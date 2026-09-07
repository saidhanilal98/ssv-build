# Static Site → Payload CMS Migration Implementation Plan

> **For the human implementer:** This plan is written for you to execute
> yourself, one task at a time. Each task ends with a concrete way to
> verify it worked (usually: run `npm run dev` and look at something) —
> do not move to the next task until that verification passes. If a step
> fails, stop and read the error before continuing; don't skip ahead.

**Goal:** Move all content and images on the SSV site into Payload CMS
(admin-editable, backed by Postgres + Vercel Blob), while every page keeps
rendering pixel-identical to today and automatically falls back to today's
hardcoded content if Payload/the database is ever unreachable.

**Architecture:** Payload runs embedded in this Next.js app. Each
`page.tsx` (Server Component) fetches its content from Payload's Local
API through a `get<Page>Content()` function that catches failures and
falls back to a `defaults.ts` object holding today's literal content.
Content flows into the existing `"use client"` section components as
props — their JSX/Tailwind/animation code does not change.

**Tech Stack:** Payload 3.x, `@payloadcms/db-postgres`,
`@payloadcms/storage-vercel-blob`, Next.js 16.3.0 (App Router, classic
caching model — `cacheComponents` is off), React 19.

**Spec:** [docs/superpowers/specs/2026-09-07-payload-cms-migration-design.md](../specs/2026-09-07-payload-cms-migration-design.md)

## Global Constraints

- Visual output must stay pixel-identical to the current site — never
  change a component's JSX structure or Tailwind classes, only where its
  data comes from.
- Deployment stays on the existing Vercel project and domain — only add
  env vars and provision new resources (Postgres, Blob) on that same
  project, never change build/deploy config.
- Every page's content-fetch function must fall back to today's exact
  hardcoded content (text and images) if Payload/the DB is unreachable.
- Original `/public` image files are never deleted — they are the
  fallback source.
- Single admin role, no permission matrix.

---

## Task 1: Provision infrastructure & scaffold Payload core

This is also the de-risking spike: if Payload doesn't boot cleanly
against this project's Next.js 16.3.0, you find out here, before any
schema work is built on top of it.

**Files:**
- Create: `payload.config.ts`
- Create: `collections/Users.ts`
- Create: `collections/Media.ts`
- Create: `lib/payload/getPayloadClient.ts`
- Create: `lib/payload/revalidate.ts`
- Create: `app/(payload)/layout.tsx`
- Create: `app/(payload)/admin/[[...segments]]/page.tsx`
- Create: `app/(payload)/api/[...slug]/route.ts`
- Modify: `next.config.ts`
- Modify: `tsconfig.json`
- Create: `.env.local` (not committed)
- Modify: `.gitignore`

**Interfaces:**
- Produces: `getPayloadClient(): Promise<Payload>` in
  `lib/payload/getPayloadClient.ts` — every later content-fetch function
  calls this.
- Produces: `revalidatePagesAfterChange(paths: string[])` in
  `lib/payload/revalidate.ts` — every collection/global's `afterChange`
  hook uses this.
- Produces: `payload.config.ts` default export with `collections: [Users,
  Media]`, `globals: []` — Tasks 2–10 each add one import and one array
  entry here.

- [ ] **Step 1: Provision a Postgres database**

Go to your Vercel project → Storage → Create Database → Postgres (or
use [Neon](https://neon.tech) directly if you prefer managing it
outside Vercel). Copy the connection string — it looks like
`postgres://user:password@host/dbname?sslmode=require`.

- [ ] **Step 2: Provision a Vercel Blob store**

Vercel project → Storage → Create → Blob. Copy the `BLOB_READ_WRITE_TOKEN`
it gives you.

- [ ] **Step 3: Create `.env.local`**

```bash
DATABASE_URI=postgres://your-connection-string-here
PAYLOAD_SECRET=
BLOB_READ_WRITE_TOKEN=your-blob-token-here
```

Generate a secret for `PAYLOAD_SECRET` (any random 32+ character
string):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Paste the output in as `PAYLOAD_SECRET`.

- [ ] **Step 4: Add `.env.local` to `.gitignore`**

Open `.gitignore` and confirm `.env.local` is listed (Next.js's default
`.gitignore` already includes `.env*.local` — verify it's there; if not,
add it). Never commit this file.

- [ ] **Step 5: Install Payload dependencies**

```bash
npm install payload @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical @payloadcms/storage-vercel-blob sharp
```

- [ ] **Step 6: Create the Users collection**

`collections/Users.ts`:

```ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [],
}
```

- [ ] **Step 7: Create the Media collection**

`collections/Media.ts`:

```ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
```

- [ ] **Step 8: Create the revalidation helper**

`lib/payload/revalidate.ts`:

```ts
import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

export const revalidatePagesAfterChange =
  (paths: string[]): CollectionAfterChangeHook | GlobalAfterChangeHook =>
  ({ doc }) => {
    for (const path of paths) {
      revalidatePath(path)
    }
    return doc
  }
```

- [ ] **Step 9: Create `payload.config.ts`**

At the repo root:

```ts
import path from 'path'
import { fileURLToPath } from 'url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media],
  globals: [],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
```

- [ ] **Step 10: Add the `@payload-config` path alias**

Open `tsconfig.json` and add to `compilerOptions.paths` (create the
`paths` key if it doesn't exist):

```json
{
  "compilerOptions": {
    "paths": {
      "@payload-config": ["./payload.config.ts"]
    }
  }
}
```

- [ ] **Step 11: Wrap `next.config.ts` with `withPayload`**

```ts
import type { NextConfig } from "next";
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  /* config options here */
};

export default withPayload(nextConfig, { devBundleServerPackages: false })
```

- [ ] **Step 12: Create the admin layout**

`app/(payload)/layout.tsx`:

```tsx
import config from '@payload-config'
import '@payloadcms/next/css'
import { RootLayout } from '@payloadcms/next/layouts'
import React from 'react'
import { importMap } from './admin/importMap'

type Args = {
  children: React.ReactNode
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap}>
    {children}
  </RootLayout>
)

export default Layout
```

- [ ] **Step 13: Create the admin page route**

`app/(payload)/admin/[[...segments]]/page.tsx`:

```tsx
import type { Metadata } from 'next'
import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, params, searchParams, importMap })

export default Page
```

- [ ] **Step 14: Create the REST API route**

`app/(payload)/api/[...slug]/route.ts`:

```ts
import config from '@payload-config'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
```

- [ ] **Step 15: Generate the admin import map**

```bash
npx payload generate:importmap
```

This creates `app/(payload)/admin/importMap.js` — a generated file the
routes above import. Don't hand-edit it; re-run this command whenever
you add a new admin-facing field type.

- [ ] **Step 16: Create the shared Payload client helper**

`lib/payload/getPayloadClient.ts`:

```ts
import { getPayload, type Payload } from 'payload'
import config from '@payload-config'

let clientPromise: Promise<Payload> | null = null

export function getPayloadClient(): Promise<Payload> {
  if (!clientPromise) {
    clientPromise = getPayload({ config })
  }
  return clientPromise
}
```

- [ ] **Step 17: Verify it boots**

```bash
npm run dev
```

Visit `http://localhost:3000/admin`. **This is the spike checkpoint** —
if this doesn't show Payload's "Create your first admin user" screen
without errors, stop here and debug before continuing (check the
terminal for the actual connection/build error — most likely cause is
`DATABASE_URI` being wrong, or a Next 16-specific incompatibility
worth searching Payload's GitHub issues for).

Create the admin user when prompted (use your own email — this is the
one account with access to `/admin`). Confirm you land on the empty
Payload dashboard showing "Users" and "Media" collections.

Also confirm your existing pages still work: visit `http://localhost:3000/`,
`/about`, `/services`, `/contact` — they should look completely
unchanged, since nothing about them has been touched yet.

- [ ] **Step 18: Commit**

```bash
git add payload.config.ts collections lib/payload "app/(payload)" next.config.ts tsconfig.json .gitignore package.json package-lock.json
git commit -m "Scaffold embedded Payload CMS (Users, Media, admin/API routes)"
```

---

## Task 2: Services collection

**Files:**
- Create: `collections/Services.ts`
- Modify: `payload.config.ts`

**Interfaces:**
- Consumes: `revalidatePagesAfterChange` from `lib/payload/revalidate.ts`
  (Task 1).
- Produces: `Services: CollectionConfig` (slug `services`) — used by the
  Home page (top 3 by `order`) and the `/services` page (all, by
  `order`) in Tasks 13 and 15.

- [ ] **Step 1: Create the collection**

`collections/Services.ts`:

```ts
import type { CollectionConfig } from 'payload'
import { revalidatePagesAfterChange } from '../lib/payload/revalidate'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order'],
  },
  access: {
    read: () => true,
  },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'icon',
      type: 'select',
      required: true,
      options: ['Building2', 'Wrench', 'ClipboardCheck', 'FenceIcon', 'CloudRain'],
    },
    { name: 'shortDescription', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    {
      name: 'features',
      type: 'array',
      fields: [{ name: 'feature', type: 'text', required: true }],
    },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
  hooks: {
    afterChange: [revalidatePagesAfterChange(['/', '/services'])],
  },
}
```

- [ ] **Step 2: Register it in `payload.config.ts`**

```ts
import { Services } from './collections/Services'
// ...
  collections: [Users, Media, Services],
```

- [ ] **Step 3: Verify**

```bash
npm run dev
```

Visit `/admin`, confirm a "Services" collection now appears in the
sidebar, and create one test entry to confirm every field (including
the `features` array and `icon` select) works as expected. Delete the
test entry afterward.

- [ ] **Step 4: Commit**

```bash
git add collections/Services.ts payload.config.ts
git commit -m "Add Services collection"
```

---

## Task 3: Projects collection

**Files:**
- Create: `collections/Projects.ts`
- Modify: `payload.config.ts`

**Interfaces:**
- Consumes: `revalidatePagesAfterChange` (Task 1).
- Produces: `Projects: CollectionConfig` (slug `projects`) — used by the
  Home page carousel in Task 13.

- [ ] **Step 1: Create the collection**

`collections/Projects.ts`:

```ts
import type { CollectionConfig } from 'payload'
import { revalidatePagesAfterChange } from '../lib/payload/revalidate'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order'],
  },
  access: {
    read: () => true,
  },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
  hooks: {
    afterChange: [revalidatePagesAfterChange(['/'])],
  },
}
```

- [ ] **Step 2: Register it in `payload.config.ts`**

```ts
import { Projects } from './collections/Projects'
// ...
  collections: [Users, Media, Services, Projects],
```

- [ ] **Step 3: Verify**

`npm run dev`, visit `/admin`, confirm "Projects" appears and you can
create a test entry with an image upload (confirms the Vercel Blob
storage adapter is wired correctly — check the uploaded image's URL
points to your blob store's domain, not `/media/...` on localhost).
Delete the test entry.

- [ ] **Step 4: Commit**

```bash
git add collections/Projects.ts payload.config.ts
git commit -m "Add Projects collection"
```

---

## Task 4: Testimonials collection

**Files:**
- Create: `collections/Testimonials.ts`
- Modify: `payload.config.ts`

**Interfaces:**
- Consumes: `revalidatePagesAfterChange` (Task 1).
- Produces: `Testimonials: CollectionConfig` (slug `testimonials`) — used
  by the Home page in Task 13.

- [ ] **Step 1: Create the collection**

`collections/Testimonials.ts`:

```ts
import type { CollectionConfig } from 'payload'
import { revalidatePagesAfterChange } from '../lib/payload/revalidate'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'citation',
    defaultColumns: ['citation', 'order'],
  },
  access: {
    read: () => true,
  },
  defaultSort: 'order',
  fields: [
    { name: 'citation', type: 'text', required: true },
    { name: 'quote', type: 'textarea', required: true },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
  hooks: {
    afterChange: [revalidatePagesAfterChange(['/'])],
  },
}
```

- [ ] **Step 2: Register it in `payload.config.ts`**

```ts
import { Testimonials } from './collections/Testimonials'
// ...
  collections: [Users, Media, Services, Projects, Testimonials],
```

- [ ] **Step 3: Verify**

`npm run dev`, visit `/admin`, confirm "Testimonials" appears, create
and delete a test entry.

- [ ] **Step 4: Commit**

```bash
git add collections/Testimonials.ts payload.config.ts
git commit -m "Add Testimonials collection"
```

---

## Task 5: Certifications collection

**Files:**
- Create: `collections/Certifications.ts`
- Modify: `payload.config.ts`

**Interfaces:**
- Consumes: `revalidatePagesAfterChange` (Task 1).
- Produces: `Certifications: CollectionConfig` (slug `certifications`) —
  used by the About page in Task 14.

- [ ] **Step 1: Create the collection**

`collections/Certifications.ts`:

```ts
import type { CollectionConfig } from 'payload'
import { revalidatePagesAfterChange } from '../lib/payload/revalidate'

export const Certifications: CollectionConfig = {
  slug: 'certifications',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order'],
  },
  access: {
    read: () => true,
  },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'document', type: 'upload', relationTo: 'media', required: true },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
  hooks: {
    afterChange: [revalidatePagesAfterChange(['/about'])],
  },
}
```

- [ ] **Step 2: Register it in `payload.config.ts`**

```ts
import { Certifications } from './collections/Certifications'
// ...
  collections: [Users, Media, Services, Projects, Testimonials, Certifications],
```

- [ ] **Step 3: Verify**

`npm run dev`, visit `/admin`, confirm "Certifications" appears, create
a test entry with a PDF upload, confirm it accepts PDFs (Media's
`upload: true` with no `mimeTypes` restriction accepts any file type by
default). Delete the test entry.

- [ ] **Step 4: Commit**

```bash
git add collections/Certifications.ts payload.config.ts
git commit -m "Add Certifications collection"
```

---

## Task 6: SiteSettings global

**Files:**
- Create: `globals/SiteSettings.ts`
- Modify: `payload.config.ts`

**Interfaces:**
- Consumes: `revalidatePagesAfterChange` (Task 1).
- Produces: `SiteSettings: GlobalConfig` (slug `siteSettings`) — used by
  Header/Footer in Task 12.

- [ ] **Step 1: Create the global**

`globals/SiteSettings.ts`:

```ts
import type { GlobalConfig } from 'payload'
import { revalidatePagesAfterChange } from '../lib/payload/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'header',
      type: 'group',
      fields: [
        {
          name: 'navLinks',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
        { name: 'ctaLabel', type: 'text', required: true },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      fields: [
        { name: 'tagline', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'companyNumber', type: 'text', required: true },
        {
          name: 'officeAddressLines',
          type: 'array',
          fields: [{ name: 'line', type: 'text', required: true }],
        },
        { name: 'phone', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        {
          name: 'usefulLinks',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
        { name: 'developerCredit', type: 'text' },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidatePagesAfterChange(['/', '/about', '/services', '/contact'])],
  },
}
```

- [ ] **Step 2: Register it in `payload.config.ts`**

```ts
import { SiteSettings } from './globals/SiteSettings'
// ...
  globals: [SiteSettings],
```

- [ ] **Step 3: Verify**

`npm run dev`, visit `/admin`, confirm "Site Settings" appears under
Globals in the sidebar, and that you can fill in and save it (leave
your test data in — Task 12 will need real values here, or you can
overwrite it with the seed script in Task 11).

- [ ] **Step 4: Commit**

```bash
git add globals/SiteSettings.ts payload.config.ts
git commit -m "Add SiteSettings global"
```

---

## Task 7: HomePage global

**Files:**
- Create: `globals/HomePage.ts`
- Modify: `payload.config.ts`

**Interfaces:**
- Consumes: `revalidatePagesAfterChange` (Task 1).
- Produces: `HomePage: GlobalConfig` (slug `homePage`) — used in Task 13.

- [ ] **Step 1: Create the global**

`globals/HomePage.ts`:

```ts
import type { GlobalConfig } from 'payload'
import { revalidatePagesAfterChange } from '../lib/payload/revalidate'

export const HomePage: GlobalConfig = {
  slug: 'homePage',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'headingLine1', type: 'text', required: true },
        { name: 'headingLine2Highlighted', type: 'text', required: true },
        { name: 'subheading', type: 'text', required: true },
        {
          name: 'paragraphs',
          type: 'array',
          fields: [{ name: 'text', type: 'textarea', required: true }],
        },
        { name: 'ctaLabel', type: 'text', required: true },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'statistics',
      type: 'array',
      fields: [
        { name: 'value', type: 'number', required: true },
        { name: 'suffix', type: 'text' },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'servicesSection',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'ctaLabel', type: 'text', required: true },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'projectsSection',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'testimonialsSection',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'methodsSection',
      type: 'group',
      fields: [
        { name: 'backgroundImage', type: 'upload', relationTo: 'media', required: true },
        { name: 'heading', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'ctaLabel', type: 'text', required: true },
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea', required: true },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidatePagesAfterChange(['/'])],
  },
}
```

- [ ] **Step 2: Register it in `payload.config.ts`**

```ts
import { HomePage } from './globals/HomePage'
// ...
  globals: [SiteSettings, HomePage],
```

- [ ] **Step 3: Verify**

`npm run dev`, visit `/admin`, confirm "Home Page" appears under
Globals and every group/array field renders and saves correctly.

- [ ] **Step 4: Commit**

```bash
git add globals/HomePage.ts payload.config.ts
git commit -m "Add HomePage global"
```

---

## Task 8: AboutPage global

**Files:**
- Create: `globals/AboutPage.ts`
- Modify: `payload.config.ts`

**Interfaces:**
- Consumes: `revalidatePagesAfterChange` (Task 1).
- Produces: `AboutPage: GlobalConfig` (slug `aboutPage`) — used in Task 14.

- [ ] **Step 1: Create the global**

`globals/AboutPage.ts`:

```ts
import type { GlobalConfig } from 'payload'
import { revalidatePagesAfterChange } from '../lib/payload/revalidate'

export const AboutPage: GlobalConfig = {
  slug: 'aboutPage',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'subheading', type: 'text', required: true },
        {
          name: 'paragraphs',
          type: 'array',
          fields: [{ name: 'text', type: 'textarea', required: true }],
        },
        { name: 'ctaLabel', type: 'text', required: true },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media', required: true },
        {
          name: 'philosophyItems',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      name: 'visionMission',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        {
          name: 'visions',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea', required: true },
          ],
        },
        {
          name: 'missions',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      name: 'timeline',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media', required: true },
        {
          name: 'events',
          type: 'array',
          fields: [
            { name: 'year', type: 'text', required: true },
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      name: 'certificationsIntro',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidatePagesAfterChange(['/about'])],
  },
}
```

- [ ] **Step 2: Register it in `payload.config.ts`**

```ts
import { AboutPage } from './globals/AboutPage'
// ...
  globals: [SiteSettings, HomePage, AboutPage],
```

- [ ] **Step 3: Verify**

`npm run dev`, visit `/admin`, confirm "About Page" appears and saves
correctly.

- [ ] **Step 4: Commit**

```bash
git add globals/AboutPage.ts payload.config.ts
git commit -m "Add AboutPage global"
```

---

## Task 9: ServicesPage global

**Files:**
- Create: `globals/ServicesPage.ts`
- Modify: `payload.config.ts`

**Interfaces:**
- Consumes: `revalidatePagesAfterChange` (Task 1).
- Produces: `ServicesPage: GlobalConfig` (slug `servicesPage`) — used in
  Task 15.

- [ ] **Step 1: Create the global**

`globals/ServicesPage.ts`:

```ts
import type { GlobalConfig } from 'payload'
import { revalidatePagesAfterChange } from '../lib/payload/revalidate'

export const ServicesPage: GlobalConfig = {
  slug: 'servicesPage',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', required: true },
        { name: 'heading', type: 'text', required: true },
        { name: 'subheading', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'ctaLabel', type: 'text', required: true },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'servicesSection',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidatePagesAfterChange(['/services'])],
  },
}
```

- [ ] **Step 2: Register it in `payload.config.ts`**

```ts
import { ServicesPage } from './globals/ServicesPage'
// ...
  globals: [SiteSettings, HomePage, AboutPage, ServicesPage],
```

- [ ] **Step 3: Verify**

`npm run dev`, visit `/admin`, confirm "Services Page" appears and
saves correctly.

- [ ] **Step 4: Commit**

```bash
git add globals/ServicesPage.ts payload.config.ts
git commit -m "Add ServicesPage global"
```

---

## Task 10: ContactPage global

**Files:**
- Create: `globals/ContactPage.ts`
- Modify: `payload.config.ts`

**Interfaces:**
- Consumes: `revalidatePagesAfterChange` (Task 1).
- Produces: `ContactPage: GlobalConfig` (slug `contactPage`) — used in
  Task 16.

- [ ] **Step 1: Create the global**

`globals/ContactPage.ts`:

```ts
import type { GlobalConfig } from 'payload'
import { revalidatePagesAfterChange } from '../lib/payload/revalidate'

export const ContactPage: GlobalConfig = {
  slug: 'contactPage',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', required: true },
        { name: 'heading', type: 'text', required: true },
        { name: 'tagline', type: 'text', required: true },
      ],
    },
    {
      name: 'details',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text', required: true },
        {
          name: 'locationLines',
          type: 'array',
          fields: [{ name: 'line', type: 'text', required: true }],
        },
        { name: 'mapQuery', type: 'text', required: true },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidatePagesAfterChange(['/contact'])],
  },
}
```

- [ ] **Step 2: Register it in `payload.config.ts`**

```ts
import { ContactPage } from './globals/ContactPage'
// ...
  globals: [SiteSettings, HomePage, AboutPage, ServicesPage, ContactPage],
```

- [ ] **Step 3: Verify**

`npm run dev`, visit `/admin`, confirm "Contact Page" appears and saves
correctly. At this point every collection and global from the spec
exists — the sidebar should show: Users, Media, Services, Projects,
Testimonials, Certifications under Collections, and Site Settings, Home
Page, About Page, Services Page, Contact Page under Globals.

- [ ] **Step 4: Commit**

```bash
git add globals/ContactPage.ts payload.config.ts
git commit -m "Add ContactPage global"
```

---

## Task 11: Seed script

Populates every collection/global with today's exact content, so
Payload's data matches the live site byte-for-byte on first deploy.

**Files:**
- Create: `scripts/seed.ts`

**Interfaces:**
- Consumes: `getPayloadClient` (Task 1), all collection/global slugs
  (Tasks 2–10).
- Produces: seeded database rows — the prerequisite for Tasks 12–16
  (the pages will show this data once fetched).

- [ ] **Step 1: Install a TypeScript script runner**

```bash
npm install -D tsx
```

- [ ] **Step 2: Write the seed script**

`scripts/seed.ts` — this uploads the current `/public` images first
(capturing their returned IDs), then uses those IDs when creating the
content that references them:

```ts
import { getPayloadClient } from '../lib/payload/getPayloadClient'
import fs from 'fs'
import path from 'path'

async function uploadImage(payload: Awaited<ReturnType<typeof getPayloadClient>>, publicPath: string, alt: string) {
  const filePath = path.join(process.cwd(), 'public', publicPath)
  const file = fs.readFileSync(filePath)
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: file,
      mimetype: publicPath.endsWith('.png') ? 'image/png' : 'image/jpeg',
      name: path.basename(publicPath),
      size: file.length,
    },
  })
  return doc.id
}

async function seed() {
  const payload = await getPayloadClient()

  const logo = await uploadImage(payload, 'ssv-logo.webp', 'SSV Property Group logo')
  const homeHeroBg = await uploadImage(payload, 'home-hero-background.jpg', '')
  const servicesBg = await uploadImage(payload, 'services-background.jpg', '')
  const methodsBg = await uploadImage(payload, 'methods-background.jpg', '')
  const aboutHeroBg = await uploadImage(payload, 'about-hero.jpg', '')
  const timelineBg = await uploadImage(payload, 'timeline-background.jpg', '')
  const servicesPageHeroBg = await uploadImage(payload, 'services-hero.jpg', '')

  const project1 = await uploadImage(payload, 'projects/ssv-project-1.png', '')
  const project2 = await uploadImage(payload, 'projects/ssv-project-2.png', '')
  const project3 = await uploadImage(payload, 'projects/ssv-project-3.png', '')
  const project4 = await uploadImage(payload, 'projects/ssv-project-4.png', '')

  await payload.updateGlobal({
    slug: 'siteSettings',
    data: {
      logo,
      header: {
        navLinks: [
          { label: 'Home', href: '/' },
          { label: 'About Us', href: '/about' },
          { label: 'Services', href: '/services' },
        ],
        ctaLabel: 'Contact Us',
      },
      footer: {
        tagline: 'Sustainable Solutions | Visionary Values',
        description:
          'SSV is guided by integrity, reliability, and attention to detail. Start your journey with us to create your desired project.',
        companyNumber: '14877900',
        officeAddressLines: [
          { line: 'Milton Keynes' },
          { line: 'North West London' },
          { line: 'United Kingdom' },
          { line: 'MK10 7DR' },
        ],
        phone: '+44 7918 351115',
        email: 'geet.ssvpropertygroup@gmail.com',
        usefulLinks: [
          { label: 'Home', href: '/' },
          { label: 'About Us', href: '/about' },
          { label: 'Services', href: '/services' },
          { label: 'Contact Us', href: '/contact' },
        ],
        developerCredit: 'Carbron Coders',
      },
    },
  })

  await payload.create({
    collection: 'services',
    data: {
      title: 'Property Maintenance & Preventative Care',
      icon: 'Building2',
      shortDescription:
        'Planned and reactive maintenance to keep properties safe, functional, and well maintained.',
      description:
        'Ongoing maintenance is paramount to responsible property ownership and plays an important role in reducing the risk of damage and deterioration. We offer planned and reactive property maintenance services to help keep buildings in good condition, address issues early, and reduce the likelihood of preventable problems escalating.',
      features: [
        { feature: 'General property repairs and upkeep.' },
        { feature: 'Identification and rectification of minor defects.' },
        { feature: 'Preventative works to reduce water ingress and deterioration.' },
        { feature: 'Ongoing maintenance support for landlords and property owners.' },
        { feature: 'Records of maintenance and repair works carried out.' },
      ],
      order: 1,
    },
  })

  await payload.create({
    collection: 'services',
    data: {
      title: 'Damage Mitigation & Protective Measures',
      icon: 'FenceIcon',
      shortDescription:
        'Prompt damage mitigation to limit further damage, protect your property, and reduce costly repairs.',
      description:
        'Early intervention can significantly reduce the extent and cost of property damage. We provide damage mitigation services to prevent minor issues from becoming major repairs. Where appropriate, we can attend site promptly to assess the situation and carry out practical measures to limit further damage and protect the property.',
      features: [
        { feature: 'Making the property safe following an incident.' },
        { feature: 'Temporary isolation and protection works.' },
        { feature: 'Moisture control and drying measures.' },
        { feature: 'Removal of affected materials where necessary.' },
        { feature: 'Preventative actions to stop further deterioration.' },
      ],
      order: 2,
    },
  })

  await payload.create({
    collection: 'services',
    data: {
      title: 'Property Claims & Resultant Damage Reinstatement',
      icon: 'CloudRain',
      shortDescription:
        'Professional damage assessment and reinstatement services to accurately identify, report, and restore property damage.',
      description:
        'We provide a professional damage assessment and reinstatement service. Our role is to support the claims process by accurately assessing damage, preparing repair reports and quotations, and delivering reinstatement works. We work collaboratively with insurers and appointed loss adjusters to ensure all resultant damage is properly identified and addressed.',
      features: [
        { feature: 'Assessing and documenting resultant damage.' },
        { feature: 'Preparing detailed repair reports and scopes of works.' },
        { feature: 'Providing clear and transparent repair quotations.' },
        { feature: 'Liaising with appointed loss adjusters where required.' },
        { feature: 'Managing and completing reinstatement works.' },
      ],
      order: 3,
    },
  })

  await payload.create({
    collection: 'services',
    data: {
      title: 'Maintenance Insurance Claims & Inspections',
      icon: 'ClipboardCheck',
      shortDescription:
        'Property management focused on inspections, maintenance, safety, and keeping your property in excellent condition.',
      description:
        'We provide hands-on property management focused on maintenance, inspections, and ensuring your property remains safe, compliant, and well maintained at all times. Our services do not include rent collection or tenant financial management. We specialize in physical care of your property, managing inspections and overseeing maintenance works professionally.',
      features: [
        { feature: 'We carry out regular property inspections, routine maintenance, and urgent repairs.' },
        { feature: 'Identifying issues early and resolving them quickly to protect your property and reduce long-term costs.' },
        { feature: "We offer flexible monthly maintenance packages tailored to your property's needs." },
        { feature: 'Providing clear and transparent repair quotations.' },
        { feature: 'These include regular inspections, preventative maintenance, and prompt repairs, helping identify issues early, reduce unexpected costs, and protect your investment.' },
      ],
      order: 4,
    },
  })

  await payload.create({ collection: 'projects', data: { image: project1, order: 1 } })
  await payload.create({ collection: 'projects', data: { image: project2, order: 2 } })
  await payload.create({ collection: 'projects', data: { image: project3, order: 3 } })
  await payload.create({ collection: 'projects', data: { image: project4, order: 4 } })

  const testimonials = [
    { cite: 'Wall Tiling', quote: "Robert was an absolute hero. Over the course of 2 intense and long days, he blitzed through a long list of jobs needing doing, all very quickly, cleanly and to a high standard. I'm very pleased with the result and would thoroughly recommend SSV for tiling, carpentry, decorating and other works. Pragmatic, great value and a lovely guy as well!" },
    { cite: 'Internal Painting', quote: 'Good work, clean and quiet! Robert was very professional and quickly got on with the painting work we had hired him for, causing minimal disruption. He was on time, stuck to the quote and did not leave any mess. Even wore shoe covers, which is always appreciated! Would not hesitate to recommend/use again!' },
    { cite: 'Painting & Minor Repairs', quote: 'Robert was professional from the day I met him and he offered me a fair price for the decorating work as well as completing it on time. I was so impressed with his work that I have asked him to do my laminate flooring as well as I wasn\'t disappointed! His general knowledge about building work is great and I felt I could trust him. Finally, the administrative system of things like invoicing setup is accurate and timely. Will be using SSV Property Group again.' },
    { cite: 'Bathroom Wall Tiling', quote: 'Robert did a great job with repairing our bathroom, including retiling, grouting, sealing and repairing some damp and water damage to the ceilings. He was quick, efficient, tidy, friendly and professional! Would definitely work with SSV again!' },
    { cite: 'Internal Painting', quote: "Robert was brilliant, I would highly recommend! He worked tirelessly on my walls and ceiling to ensure they were completely covered, it wasn't an easy job but he wouldn't leave without it looking great. He was super helpful when discussing paint suggestions and very professional and friendly, both in communications and in person!" },
    { cite: 'Renovation Upgrades', quote: 'The decorator was very professional, came across like he knew what he was doing, carried out the work to a high standard, was friendly, communicative and was a great price for the work done. It was a pleasant experience and I would trust them to return for future jobs.' },
  ]
  for (const [i, t] of testimonials.entries()) {
    await payload.create({ collection: 'testimonials', data: { citation: t.cite, quote: t.quote, order: i + 1 } })
  }

  await payload.updateGlobal({
    slug: 'homePage',
    data: {
      hero: {
        headingLine1: 'YOUR VISION.',
        headingLine2Highlighted: 'EXPERTLY BUILT.',
        subheading: 'Sustainable Solutions | Visionary Values',
        paragraphs: [
          { text: 'At SSV Property Group Ltd, we do more than manage and maintain properties. We build strong client relationships and protect long-term investments.' },
          { text: 'Guided by integrity, reliability, and attention to detail, we treat every property with the highest level of care. Our team delivers professional, responsive service with a personal touch, ensuring your property is maintained to the highest standards and your peace of mind always comes first.' },
          { text: 'Begin your project with confidence. Our team supports you throughout the entire journey, allowing you to enjoy a stress-free experience while we expertly manage and deliver your desired project.' },
        ],
        ctaLabel: 'GET STARTED',
        backgroundImage: homeHeroBg,
      },
      statistics: [
        { value: 30, suffix: '', label: 'Years of Sustainable Success' },
        { value: 1200, suffix: '+', label: 'Successful Projects Completed' },
        { value: 30, suffix: '+', label: 'Years of Experience' },
      ],
      servicesSection: {
        heading: 'Services We Excel In.',
        description: 'We excel in property renovation, refurbishment, reinstatement, and maintenance, delivering quality workmanship and reliable results.',
        ctaLabel: 'VIEW MORE',
        backgroundImage: servicesBg,
      },
      projectsSection: {
        heading: 'Some Projects We are Proud Of.',
        description: 'Explore some of our completed projects, showcasing quality workmanship, attention to detail, and exceptional results.',
      },
      testimonialsSection: {
        heading: 'What Our Clients Say?',
        description: 'Trusted by property owners, managers, and businesses for professional property services and quality workmanship.',
      },
      methodsSection: {
        backgroundImage: methodsBg,
        heading: 'Sustainable Solutions | Visionary Values',
        description: 'We are ready to discuss your project and provide reliable, professional property services tailored to your needs.',
        ctaLabel: 'Contact Us',
        items: [
          { title: 'Extensive Experience', description: 'Over 30+ years expertise and sustainable success.' },
          { title: 'Qualified Team', description: 'A dedicated team that delivers exceptional results on every project.' },
          { title: 'Superior Quality', description: 'We offer expert workmanship, premium materials, and meticulous attention to detail.' },
          { title: 'Reliable & Committed', description: 'Our commitment to delivering dependable services, consistent quality, and trust.' },
        ],
      },
    },
  })

  await payload.updateGlobal({
    slug: 'aboutPage',
    data: {
      hero: {
        heading: 'THE SSV DIFFERENCE.',
        subheading: 'trust, quality and vision.',
        paragraphs: [
          { text: 'At SSV Property Group Ltd, we do not just manage and maintain properties, we build relationships and protect investments. Founded as a family business, our core philosophy is simple: treat every property as if it were our own and every client as part of our family. Our story began not in a large corporate boardroom, but within our own community.' },
          { text: 'We saw a need for property services that combined professional expertise with a personal touch where your call is answered by a person who knows your name and your property’s history. That vision became the foundation of SSV Property Group.' },
          { text: 'Today, we remain a family-owned and operated business. This means the values we started with are the values we operate by every day: integrity, reliability, and a relentless commitment to quality. For us, it’s not just about completing a job, it’s about building a legacy of trust, one satisfied client at a time.' },
        ],
        ctaLabel: 'JOIN THE DIFFERENCE',
        backgroundImage: aboutHeroBg,
        philosophyItems: [
          { title: 'Sustainable', description: 'We focus on long-term solutions that protect property value and create lasting benefits for our clients.' },
          { title: 'Solutions', description: 'Every property is different. We provide practical, professional solutions built around your needs.' },
          { title: 'Visionary', description: 'We look beyond today, combining experience and forward-thinking ideas to shape better outcomes.' },
          { title: 'Values', description: 'Integrity, reliability, care and quality guide every decision we make and every relationship we build.' },
        ],
      },
      visionMission: {
        heading: 'OUR DIRECTION',
        description: 'Guided by sustainable thinking and visionary values, we strive to create meaningful places, opportunities and long-term impact.',
        visions: [
          { title: 'Proactive Care Over Reactive Repairs', description: 'To pioneer a new standard of predictive and planned maintenance by providing a safe environment for tenants, and delivers true peace of mind.' },
          { title: 'The Return of the Human Touch', description: 'To be the trusted, local partner that our clients and communities can rely on. We are building a network of trust across the UK one relationship at a time.' },
          { title: 'Raising the Standard, Together', description: 'To set a new, uncompromising benchmark for quality and integrity in everything we do. We aim to inspire a “race to the top” in the UK with excellence and loyalty.' },
        ],
        missions: [
          { title: 'Standards', description: 'By upholding the highest standards of safety and craftsmanship. Whether handling small repairs or full-scale property care, we treat every home as if it were our own.' },
          { title: 'Trust', description: 'Prioritizing trust, transparency, and communication. Our family-run approach means every client receives hands-on support, consistent care, and a reliable point of contact who truly understands their needs.' },
          { title: 'Deliver', description: 'To deliver dependable, high-quality property care that puts people first. We are committed to supporting landlords, protecting investments, and creating safe, comfortable homes for tenants through a blend of proactive maintenance, personalized service, and family-driven values.' },
        ],
      },
      timeline: {
        heading: 'OUR TIMELINE',
        description: 'From our beginnings in construction to our vision for the future of property development, our journey has been shaped by experience, evolution and a commitment to creating lasting value.',
        backgroundImage: timelineBg,
        events: [
          { year: '2023', title: 'The Birth of SSV Property Group Ltd', description: 'SSV Property Group Ltd was officially named and established to continue and modernize the family legacy in South Africa. The new brand united decades of expertise under one forward-thinking company, offering a proactive, structured, and high-standard approach to property services.' },
          { year: '2023 (Continued)', title: 'Entering the UK Market', description: 'Driven by a vision to bring our unique, generationally refined solution to the UK, we expanded our services to the British market. Here, we combined our proven methods from back home with a deep understanding of UK property standards, regulations, and client expectations.' },
          { year: '2024', title: 'Local Expertise Meets Generational Skill', description: 'With our UK base established, SSV began serving local landlords, homeowners, and tenents, offering the perfect blend. Years of perfected experience and the focused dedication of a local UK team.' },
          { year: '2025', title: 'Continued Expansion & Proactive Property Care', description: 'We continue refining our proactive property care model, building strong partnerships, and expanding our footprint across the UK all while staying true to the values built over four generations.' },
          { year: 'Today', title: 'Building The Future', description: 'SSV continues to build on generations of experience while looking toward the future through sustainable solutions, visionary values and meaningful development.' },
        ],
      },
      certificationsIntro: {
        heading: 'CERTIFICATIONS',
        description: 'Our certifications and supporting documentation reflect our commitment to professional standards, safety, social responsibility and protecting the interests of our clients.',
      },
    },
  })

  await payload.updateGlobal({
    slug: 'servicesPage',
    data: {
      hero: {
        eyebrow: 'Our Expertise',
        heading: 'WE ARE AT YOUR SERVICE.',
        subheading: 'Property management with a difference.',
        description: 'We manage properties with care, professionalism and a long-term vision. Our approach combines reliable service with practical solutions that protect your property and your investment.',
        ctaLabel: 'GET IN TOUCH',
        backgroundImage: servicesPageHeroBg,
      },
      servicesSection: {
        heading: 'PROPERTY MANAGEMENT SERVICES',
        description: 'Professional property management solutions designed to protect your investment, maintain your property and deliver lasting value.',
      },
    },
  })

  await payload.updateGlobal({
    slug: 'contactPage',
    data: {
      hero: {
        eyebrow: 'Let us talk property',
        heading: 'CONTACT US.',
        tagline: 'Property advice and services when you need it.',
      },
      details: {
        heading: 'Get In Touch.',
        description: 'Have a property that needs attention? Get in touch with our team and let us know how we can assist.',
        email: 'geet.ssvpropertygroup@gmail.com',
        phone: '+44 7918 351115',
        locationLines: [{ line: 'Milton Keynes' }, { line: 'London, United Kingdom' }],
        mapQuery: 'London, United Kingdom',
      },
    },
  })

  console.log('Seed complete.')
  process.exit(0)
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
```

> **Note on certifications:** the current site links to PDFs hosted on
> the old WordPress site rather than local files, so there's nothing in
> `/public` to upload for them. After running the seed script, go into
> `/admin` → Certifications and manually create the 4 entries (Bronze
> Membership Certificate, Health & Safety Certificate, Social Value
> Certificate, Liability Insurance Policy — titles/descriptions are in
> the spec's Certifications section), uploading the actual PDF files
> when you have them. Until then, Task 14's fallback defaults keep the
> current live site showing the old external links.

- [ ] **Step 3: Run the seed script**

```bash
npx tsx scripts/seed.ts
```

Expected output: `Seed complete.` with no errors.

- [ ] **Step 4: Verify in the admin UI**

Visit `/admin`, click through Services (4 entries), Projects (4),
Testimonials (6), and each Global (Site Settings, Home Page, About
Page, Services Page, Contact Page) — confirm every field is populated
and matches the current live site's text.

- [ ] **Step 5: Commit**

```bash
git add scripts/seed.ts package.json package-lock.json
git commit -m "Add content seed script"
```

---

## Task 12: Header/Footer wiring

**Files:**
- Create: `lib/content/siteSettings.ts`
- Create: `lib/content/siteSettings.defaults.ts`
- Modify: `app/layout.tsx`
- Modify: `app/_components/Global/Header.tsx`
- Modify: `app/_components/Global/Footer.tsx`

**Interfaces:**
- Consumes: `getPayloadClient` (Task 1), `siteSettings` global shape
  (Task 6).
- Produces: `getSiteSettings(): Promise<SiteSettingsContent>`,
  `SiteSettingsContent` type — used by `app/layout.tsx`.

- [ ] **Step 1: Write the defaults (today's exact content)**

`lib/content/siteSettings.defaults.ts`:

```ts
export type SiteSettingsContent = {
  logoUrl: string
  header: {
    navLinks: { label: string; href: string }[]
    ctaLabel: string
  }
  footer: {
    tagline: string
    description: string
    companyNumber: string
    officeAddressLines: string[]
    phone: string
    email: string
    usefulLinks: { label: string; href: string }[]
    developerCredit: string
  }
}

export const siteSettingsDefaults: SiteSettingsContent = {
  logoUrl: '/ssv-logo.webp',
  header: {
    navLinks: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Services', href: '/services' },
    ],
    ctaLabel: 'Contact Us',
  },
  footer: {
    tagline: 'Sustainable Solutions | Visionary Values',
    description:
      'SSV is guided by integrity, reliability, and attention to detail. Start your journey with us to create your desired project.',
    companyNumber: '14877900',
    officeAddressLines: ['Milton Keynes', 'North West London', 'United Kingdom', 'MK10 7DR'],
    phone: '+44 7918 351115',
    email: 'geet.ssvpropertygroup@gmail.com',
    usefulLinks: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Contact Us', href: '/contact' },
    ],
    developerCredit: 'Carbron Coders',
  },
}
```

- [ ] **Step 2: Write the fetch-with-fallback function**

`lib/content/siteSettings.ts`:

```ts
import { getPayloadClient } from '../payload/getPayloadClient'
import { siteSettingsDefaults, type SiteSettingsContent } from './siteSettings.defaults'

function mediaUrl(image: unknown): string {
  if (image && typeof image === 'object' && 'url' in image && typeof (image as { url: unknown }).url === 'string') {
    return (image as { url: string }).url
  }
  return ''
}

export async function getSiteSettings(): Promise<SiteSettingsContent> {
  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'siteSettings', depth: 1 })

    return {
      logoUrl: mediaUrl(settings.logo) || siteSettingsDefaults.logoUrl,
      header: {
        navLinks: (settings.header?.navLinks ?? []).map((l) => ({ label: l.label, href: l.href })),
        ctaLabel: settings.header?.ctaLabel ?? siteSettingsDefaults.header.ctaLabel,
      },
      footer: {
        tagline: settings.footer?.tagline ?? siteSettingsDefaults.footer.tagline,
        description: settings.footer?.description ?? siteSettingsDefaults.footer.description,
        companyNumber: settings.footer?.companyNumber ?? siteSettingsDefaults.footer.companyNumber,
        officeAddressLines: (settings.footer?.officeAddressLines ?? []).map((l) => l.line),
        phone: settings.footer?.phone ?? siteSettingsDefaults.footer.phone,
        email: settings.footer?.email ?? siteSettingsDefaults.footer.email,
        usefulLinks: (settings.footer?.usefulLinks ?? []).map((l) => ({ label: l.label, href: l.href })),
        developerCredit: settings.footer?.developerCredit ?? siteSettingsDefaults.footer.developerCredit,
      },
    }
  } catch (error) {
    console.error('Falling back to static site settings:', error)
    return siteSettingsDefaults
  }
}
```

- [ ] **Step 3: Fetch in `app/layout.tsx` and pass down**

Modify `app/layout.tsx` — it's currently:

```tsx
import Header from "./_components/Global/Header";
import Footer from "./_components/Global/Footer";
// ...
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html ...>
      <body ...>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

Change to:

```tsx
import Header from "./_components/Global/Header";
import Footer from "./_components/Global/Footer";
import { getSiteSettings } from "../lib/content/siteSettings";
// ...
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const siteSettings = await getSiteSettings();
  return (
    <html ...>
      <body ...>
        <Header siteSettings={siteSettings} />
        {children}
        <Footer siteSettings={siteSettings} />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Update `Header.tsx` to accept props**

In `app/_components/Global/Header.tsx`, replace the hardcoded
`navLinks` const and add a props type. Change:

```tsx
const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
];

export default function Header() {
```

to:

```tsx
import type { SiteSettingsContent } from "../../../lib/content/siteSettings.defaults";

export default function Header({ siteSettings }: { siteSettings: SiteSettingsContent }) {
    const navLinks = siteSettings.header.navLinks;
```

Then update the two places the logo `<Image src="/ssv-logo.webp" .../>`
appears (desktop and, if present, mobile) to `src={siteSettings.logoUrl}`,
and the two "Contact Us" button labels to `{siteSettings.header.ctaLabel}`.

- [ ] **Step 5: Update `Footer.tsx` to accept props**

In `app/_components/Global/Footer.tsx`, change:

```tsx
export default function Footer() {
```

to:

```tsx
import type { SiteSettingsContent } from "../../../lib/content/siteSettings.defaults";

export default function Footer({ siteSettings }: { siteSettings: SiteSettingsContent }) {
    const { footer } = siteSettings;
```

Then replace each hardcoded value with the matching field:
- `<span className="block">Sustainable Solutions |</span><span className="block">Visionary Values</span>` →
  split `footer.tagline` on `' | '` and render the two halves in those
  spans (keeps the two-line layout unchanged):
  ```tsx
  const [taglineLine1, taglineLine2] = footer.tagline.split(' | ');
  // ...
  <span className="block">{taglineLine1} |</span>
  <span className="block">{taglineLine2}</span>
  ```
- The description paragraph → `{footer.description}`
- `Company Number: 14877900` → `{`Company Number: ${footer.companyNumber}`}`
- Logo image `src="/ssv-logo.webp"` → `src={siteSettings.logoUrl}`
- The 4 address `<span>` lines → `{footer.officeAddressLines.map((line) => <span key={line}>{line}</span>)}`
- Phone `href="tel:+447918351115"` / text `+44 7918 351115` →
  `href={`tel:${footer.phone.replace(/\s/g, '')}`}` / `{footer.phone}`
- Email `href="mailto:..."` / text → `href={`mailto:${footer.email}`}` / `{footer.email}`
- "Useful Links" — replace the 4 hardcoded `<Link>` entries with
  `{footer.usefulLinks.map((link) => <Link key={link.href} href={link.href} className="transition hover:text-[#0CC0DF]">{link.label}</Link>)}`
  (this also fixes the pre-existing bug where "Services" pointed to
  `/projects` instead of `/services` — the seed data in Task 11 already
  has the correct href)
- `Developed by Carbron Coders with <HeartIcon .../>` → `Developed by {footer.developerCredit} with <HeartIcon size={16} />`

- [ ] **Step 6: Verify**

```bash
npm run dev
```

Visit every page — Header and Footer should render identically to
before. Confirm the "Services" footer link now goes to `/services`.

Test the fallback: temporarily rename `DATABASE_URI` in `.env.local` to
`DATABASE_URI_DISABLED`, restart `npm run dev`, reload the site — Header
and Footer should still render (from `siteSettingsDefaults`), with an
error logged in the terminal. Restore the env var name afterward.

- [ ] **Step 7: Commit**

```bash
git add lib/content/siteSettings.ts lib/content/siteSettings.defaults.ts app/layout.tsx app/_components
git commit -m "Wire Header/Footer to Payload SiteSettings with static fallback"
```

---

## Task 13: Home page wiring

**Files:**
- Create: `lib/content/home.ts`
- Create: `lib/content/home.defaults.ts`
- Modify: `app/page.tsx`
- Modify: `app/home/Hero.tsx`
- Modify: `app/home/Statistics.tsx`
- Modify: `app/home/Services.tsx`
- Modify: `app/home/Projects.tsx`
- Modify: `app/home/Testimonials.tsx`
- Modify: `app/home/Methods.tsx`

**Interfaces:**
- Consumes: `getPayloadClient` (Task 1); `homePage` global (Task 7);
  `services`, `projects`, `testimonials` collections (Tasks 2–4).
- Produces: `getHomeContent(): Promise<HomePageContent>` — consumed only
  by `app/page.tsx`.

- [ ] **Step 1: Write the defaults**

`lib/content/home.defaults.ts`:

```ts
export type HomePageContent = {
  hero: {
    headingLine1: string
    headingLine2Highlighted: string
    subheading: string
    paragraphs: string[]
    ctaLabel: string
    backgroundImageUrl: string
  }
  statistics: { value: number; suffix: string; label: string }[]
  servicesSection: {
    heading: string
    description: string
    ctaLabel: string
    backgroundImageUrl: string
    cards: { title: string; description: string }[]
  }
  projectsSection: {
    heading: string
    description: string
    images: string[]
  }
  testimonialsSection: {
    heading: string
    description: string
    items: { citation: string; quote: string }[]
  }
  methodsSection: {
    backgroundImageUrl: string
    heading: string
    description: string
    ctaLabel: string
    items: { title: string; description: string }[]
  }
}

export const homePageDefaults: HomePageContent = {
  hero: {
    headingLine1: 'YOUR VISION.',
    headingLine2Highlighted: 'EXPERTLY BUILT.',
    subheading: 'Sustainable Solutions | Visionary Values',
    paragraphs: [
      'At SSV Property Group Ltd, we do more than manage and maintain properties. We build strong client relationships and protect long-term investments.',
      'Guided by integrity, reliability, and attention to detail, we treat every property with the highest level of care. Our team delivers professional, responsive service with a personal touch, ensuring your property is maintained to the highest standards and your peace of mind always comes first.',
      'Begin your project with confidence. Our team supports you throughout the entire journey, allowing you to enjoy a stress-free experience while we expertly manage and deliver your desired project.',
    ],
    ctaLabel: 'GET STARTED',
    backgroundImageUrl: '/home-hero-background.jpg',
  },
  statistics: [
    { value: 30, suffix: '', label: 'Years of Sustainable Success' },
    { value: 1200, suffix: '+', label: 'Successful Projects Completed' },
    { value: 30, suffix: '+', label: 'Years of Experience' },
  ],
  servicesSection: {
    heading: 'Services We Excel In.',
    description: 'We excel in property renovation, refurbishment, reinstatement, and maintenance, delivering quality workmanship and reliable results.',
    ctaLabel: 'VIEW MORE',
    backgroundImageUrl: '/services-background.jpg',
    cards: [
      { title: 'Property Maintenance & Preventative Care', description: 'Ongoing maintenance is paramount to responsible property ownership and plays an important role in reducing the risk of damage and deterioration. We offer planned and reactive property maintenance services to help keep buildings in good condition, address issues early, and reduce the likelihood of preventable problems escalating.' },
      { title: 'Damage Mitigation & Protective Measures', description: 'Early intervention can significantly reduce the extent and cost of property damage. We provide damage mitigation services to prevent minor issues from becoming major repairs. Where appropriate, we can attend site promptly to assess the situation and carry out practical measures to limit further damage and protect the property.' },
      { title: 'Property Claims & Resultant Damage Reinstatement', description: 'We provide a professional damage assessment and reinstatement service. Our role is to support the claims process by accurately assessing damage, preparing repair reports and quotations, and delivering reinstatement works. We work collaboratively with insurers and appointed loss adjusters to ensure all resultant damage is properly identified and addressed.' },
    ],
  },
  projectsSection: {
    heading: 'Some Projects We are Proud Of.',
    description: 'Explore some of our completed projects, showcasing quality workmanship, attention to detail, and exceptional results.',
    images: ['/projects/ssv-project-1.png', '/projects/ssv-project-2.png', '/projects/ssv-project-3.png', '/projects/ssv-project-4.png'],
  },
  testimonialsSection: {
    heading: 'What Our Clients Say?',
    description: 'Trusted by property owners, managers, and businesses for professional property services and quality workmanship.',
    items: [
      { citation: 'Wall Tiling', quote: "Robert was an absolute hero. Over the course of 2 intense and long days, he blitzed through a long list of jobs needing doing, all very quickly, cleanly and to a high standard. I'm very pleased with the result and would thoroughly recommend SSV for tiling, carpentry, decorating and other works. Pragmatic, great value and a lovely guy as well!" },
      { citation: 'Internal Painting', quote: 'Good work, clean and quiet! Robert was very professional and quickly got on with the painting work we had hired him for, causing minimal disruption. He was on time, stuck to the quote and did not leave any mess. Even wore shoe covers, which is always appreciated! Would not hesitate to recommend/use again!' },
      { citation: 'Painting & Minor Repairs', quote: "Robert was professional from the day I met him and he offered me a fair price for the decorating work as well as completing it on time. I was so impressed with his work that I have asked him to do my laminate flooring as well as I wasn't disappointed! His general knowledge about building work is great and I felt I could trust him. Finally, the administrative system of things like invoicing setup is accurate and timely. Will be using SSV Property Group again." },
      { citation: 'Bathroom Wall Tiling', quote: 'Robert did a great job with repairing our bathroom, including retiling, grouting, sealing and repairing some damp and water damage to the ceilings. He was quick, efficient, tidy, friendly and professional! Would definitely work with SSV again!' },
      { citation: 'Internal Painting', quote: "Robert was brilliant, I would highly recommend! He worked tirelessly on my walls and ceiling to ensure they were completely covered, it wasn't an easy job but he wouldn't leave without it looking great. He was super helpful when discussing paint suggestions and very professional and friendly, both in communications and in person!" },
      { citation: 'Renovation Upgrades', quote: 'The decorator was very professional, came across like he knew what he was doing, carried out the work to a high standard, was friendly, communicative and was a great price for the work done. It was a pleasant experience and I would trust them to return for future jobs.' },
    ],
  },
  methodsSection: {
    backgroundImageUrl: '/methods-background.jpg',
    heading: 'Sustainable Solutions | Visionary Values',
    description: 'We are ready to discuss your project and provide reliable, professional property services tailored to your needs.',
    ctaLabel: 'Contact Us',
    items: [
      { title: 'Extensive Experience', description: 'Over 30+ years expertise and sustainable success.' },
      { title: 'Qualified Team', description: 'A dedicated team that delivers exceptional results on every project.' },
      { title: 'Superior Quality', description: 'We offer expert workmanship, premium materials, and meticulous attention to detail.' },
      { title: 'Reliable & Committed', description: 'Our commitment to delivering dependable services, consistent quality, and trust.' },
    ],
  },
}
```

- [ ] **Step 2: Write the fetch-with-fallback function**

`lib/content/home.ts`:

```ts
import { getPayloadClient } from '../payload/getPayloadClient'
import { homePageDefaults, type HomePageContent } from './home.defaults'

function mediaUrl(image: unknown): string {
  if (image && typeof image === 'object' && 'url' in image && typeof (image as { url: unknown }).url === 'string') {
    return (image as { url: string }).url
  }
  return ''
}

export async function getHomeContent(): Promise<HomePageContent> {
  try {
    const payload = await getPayloadClient()
    const [home, services, projects, testimonials] = await Promise.all([
      payload.findGlobal({ slug: 'homePage', depth: 1 }),
      payload.find({ collection: 'services', sort: 'order', limit: 3, depth: 0 }),
      payload.find({ collection: 'projects', sort: 'order', limit: 100, depth: 1 }),
      payload.find({ collection: 'testimonials', sort: 'order', limit: 100, depth: 0 }),
    ])

    return {
      hero: {
        headingLine1: home.hero.headingLine1,
        headingLine2Highlighted: home.hero.headingLine2Highlighted,
        subheading: home.hero.subheading,
        paragraphs: home.hero.paragraphs.map((p) => p.text),
        ctaLabel: home.hero.ctaLabel,
        backgroundImageUrl: mediaUrl(home.hero.backgroundImage) || homePageDefaults.hero.backgroundImageUrl,
      },
      statistics: home.statistics.map((s) => ({ value: s.value, suffix: s.suffix ?? '', label: s.label })),
      servicesSection: {
        heading: home.servicesSection.heading,
        description: home.servicesSection.description,
        ctaLabel: home.servicesSection.ctaLabel,
        backgroundImageUrl: mediaUrl(home.servicesSection.backgroundImage) || homePageDefaults.servicesSection.backgroundImageUrl,
        cards: services.docs.map((s) => ({ title: s.title, description: s.description })),
      },
      projectsSection: {
        heading: home.projectsSection.heading,
        description: home.projectsSection.description,
        images: projects.docs.map((p) => mediaUrl(p.image)).filter(Boolean),
      },
      testimonialsSection: {
        heading: home.testimonialsSection.heading,
        description: home.testimonialsSection.description,
        items: testimonials.docs.map((t) => ({ citation: t.citation, quote: t.quote })),
      },
      methodsSection: {
        backgroundImageUrl: mediaUrl(home.methodsSection.backgroundImage) || homePageDefaults.methodsSection.backgroundImageUrl,
        heading: home.methodsSection.heading,
        description: home.methodsSection.description,
        ctaLabel: home.methodsSection.ctaLabel,
        items: home.methodsSection.items.map((i) => ({ title: i.title, description: i.description })),
      },
    }
  } catch (error) {
    console.error('Falling back to static home content:', error)
    return homePageDefaults
  }
}
```

- [ ] **Step 3: Wire `app/page.tsx`**

Replace the whole file:

```tsx
import FadeIn from "./home/FadeIn";
import Hero from "./home/Hero";
import Statistics from "./home/Statistics";
import Services from "./home/Services";
import Projects from "./home/Projects";
import Testimonials from "./home/Testimonials";
import Methods from "./home/Methods";
import { getHomeContent } from "../lib/content/home";

export default async function Home() {
  const content = await getHomeContent();

  return (
    <main>
      <FadeIn>
        <Hero {...content.hero} />
      </FadeIn>
      <Statistics statistics={content.statistics} />
      <Services {...content.servicesSection} />
      <Projects {...content.projectsSection} />
      <Testimonials {...content.testimonialsSection} />
      <Methods {...content.methodsSection} />
    </main>
  );
}
```

- [ ] **Step 4: Update `app/home/Hero.tsx`**

Add a props type and replace hardcoded values. The background image
(currently `line 11`, `src="/home-hero-background.jpg"`) becomes
`src={backgroundImageUrl}`. The heading (`lines 81-85`) becomes:

```tsx
{headingLine1}
<br />
<span className="text-[#0CC0DF]">{headingLine2Highlighted}</span>
```

The subheading (`lines 101-104`, "Sustainable Solutions | Visionary
Values" with a colored pipe) — split on `' | '`:

```tsx
const [subheadingLeft, subheadingRight] = subheading.split(' | ');
// in JSX:
{subheadingLeft}{" "}
<span className="text-[#0CC0DF]">|</span>{" "}
{subheadingRight}
```

The three hardcoded `<p>` paragraphs (`lines 118-154`) become:

```tsx
{paragraphs.map((paragraph, i) => (
  <p key={i} className={`mt-${i === 0 ? 6 : 4} max-w-lg text-sm leading-7 text-white sm:text-base`}>
    {paragraph}
  </p>
))}
```

The CTA text `GET STARTED` (`line 180`) becomes `{ctaLabel}`.

Function signature becomes:

```tsx
export default function Hero({
  headingLine1,
  headingLine2Highlighted,
  subheading,
  paragraphs,
  ctaLabel,
  backgroundImageUrl,
}: {
  headingLine1: string;
  headingLine2Highlighted: string;
  subheading: string;
  paragraphs: string[];
  ctaLabel: string;
  backgroundImageUrl: string;
}) {
  const [subheadingLeft, subheadingRight] = subheading.split(' | ');
```

- [ ] **Step 5: Update `app/home/Statistics.tsx`**

Replace the three hardcoded stat blocks (`lines 69-91`) with a map over
a new `statistics` prop, keeping the 3 distinct background colors
(`bg-[#0CC0DF]`, `bg-white`, `bg-[#062133]`) and text colors indexed by
position:

```tsx
const STAT_STYLES = [
  { bg: 'bg-[#0CC0DF]', text: 'text-black' },
  { bg: 'bg-white', text: 'text-black' },
  { bg: 'bg-[#062133]', text: 'text-white' },
];

export default function Statistics({
  statistics,
}: {
  statistics: { value: number; suffix: string; label: string }[];
}) {
  return (
    <section className="bg-black text-white">
      <div className="grid w-full grid-cols-1 md:grid-cols-3">
        {statistics.map((stat, i) => {
          const style = STAT_STYLES[i] ?? STAT_STYLES[0];
          return (
            <div
              key={stat.label}
              className={`flex min-h-[280px] flex-col justify-center ${style.bg} px-10 py-16 text-center ${style.text} md:text-left`}
            >
              <Counter target={stat.value} suffix={stat.suffix} />
              <p className="mt-4 text-medium font-medium italic tracking-wide">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

(The `Counter` function above it, `lines 5-62`, is unchanged.)

- [ ] **Step 6: Update `app/home/Services.tsx`**

Replace the hardcoded heading/description/CTA (`lines 25-55`) with
props, and replace the 3 hardcoded card `<div>`s (`lines 61-121`) with
a map. The icon and card background/text colors are positional styling,
not content — keep them in a local array indexed by position:

```tsx
const CARD_STYLES = [
  { bg: 'bg-[#062133]', text: 'text-white', icon: Building2, numberColor: 'text-[#0CC0DF]', iconColor: 'text-[#0CC0DF]' },
  { bg: 'bg-[#0CC0DF]', text: 'text-white', icon: Wrench, numberColor: 'text-black/60', iconColor: 'text-[#062133]' },
  { bg: 'bg-black', text: 'text-white', icon: ClipboardCheck, numberColor: 'text-[#0CC0DF]', iconColor: 'text-[#0CC0DF]' },
];

export default function Services({
  heading,
  description,
  ctaLabel,
  backgroundImageUrl,
  cards,
}: {
  heading: string;
  description: string;
  ctaLabel: string;
  backgroundImageUrl: string;
  cards: { title: string; description: string }[];
}) {
```

Inside the JSX: `<Image src={backgroundImageUrl} .../>`, heading becomes
`Services We <span className="text-[#0CC0DF]">Excel In.</span>` — since
`heading` is the single string `"Services We Excel In."` from the seed
data, split it the same way as before on the last word to preserve the
colored-last-word styling:

```tsx
const headingWords = heading.split(' ');
const headingLead = headingWords.slice(0, -1).join(' ');
const headingHighlight = headingWords.slice(-1)[0];
// JSX: {headingLead} <span className="text-[#0CC0DF]">{headingHighlight}</span>
```

description → `{description}`, the "VIEW MORE" link text → `{ctaLabel}`,
and the card grid becomes:

```tsx
<div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-3">
  {cards.map((card, i) => {
    const style = CARD_STYLES[i] ?? CARD_STYLES[0];
    const Icon = style.icon;
    return (
      <div key={card.title} className={`flex min-h-[440px] flex-col ${style.bg} p-10 ${style.text} transition-all duration-300 hover:-translate-y-3`}>
        <p className={`text-lg ${style.numberColor}`}>{String(i + 1).padStart(2, '0')}</p>
        <Icon className={`mt-8 h-14 w-14 ${style.iconColor}`} strokeWidth={1.5} />
        <h3 className="mt-8 text-xl font-semibold">{card.title}</h3>
        <p className="mt-8 text-base leading-7 text-white">{card.description}</p>
      </div>
    );
  })}
</div>
```

- [ ] **Step 7: Update `app/home/Projects.tsx`**

Replace the hardcoded `projects` const (`lines 7-20`) and heading/
description (`lines 44-56`) with props:

```tsx
export default function Projects({
  heading,
  description,
  images,
}: {
  heading: string;
  description: string;
  images: string[];
}) {
    const [current, setCurrent] = useState(0);
    const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
    const previousSlide = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);
    const image = images[current];
```

Replace every `project.image` reference in the JSX with `image`, and
`projects.length` / `projects.map` with `images.length` / `images.map`.
Split `heading` the same trailing-highlight way as Services (`"Some
Projects We are Proud Of."` → lead + last word highlighted) to preserve
the `<span className="text-[#0CC0DF]">Proud Of.</span>` styling, and
render `{description}` in place of the hardcoded paragraph.

- [ ] **Step 8: Update `app/home/Testimonials.tsx`**

Replace the hardcoded `testimonials` const (`lines 5-36`) and heading/
description (`lines 48-55`) with props:

```tsx
export default function Testimonials({
  heading,
  description,
  items,
}: {
  heading: string;
  description: string;
  items: { citation: string; quote: string }[];
}) {
```

Split `heading` the same way (`"What Our Clients Say?"` → lead + last
word). In the map (`lines 62-76`), replace `testimonials.map((testimonial, index) =>` with `items.map((item, index) =>`, `testimonial.cite` → `` `~ ${item.citation}` ``, `testimonial.quote` → `item.quote`.

- [ ] **Step 9: Update `app/home/Methods.tsx`**

Replace the hardcoded `methods` const (`lines 7-27`) and all hardcoded
text with props:

```tsx
export default function Methods({
  backgroundImageUrl,
  heading,
  description,
  ctaLabel,
  items,
}: {
  backgroundImageUrl: string;
  heading: string;
  description: string;
  ctaLabel: string;
  items: { title: string; description: string }[];
}) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const toggle = (index: number) => setOpenIndex((prev) => (prev === index ? null : index));
```

`<Image src="/methods-background.jpg" .../>` → `src={backgroundImageUrl}`.
The left column's heading/description/button (`lines 57-69`) — split
`heading` on `' | '` like Hero's subheading:

```tsx
const [headingLeft, headingRight] = heading.split(' | ');
// JSX: <h2 ...>{headingLeft} | {headingRight}</h2>
<p ...>{description}</p>
<button ...>{ctaLabel}</button>
```

The right column's heading `OPTIMAL METHODS WE ACCOMPLISH.` (`lines
77-82`) stays hardcoded — it's not in the spec's field list for this
section (only the accordion `items` and left-column CTA/heading were
modeled). Leave those two lines exactly as they are.

The accordion `methods.map(...)` (`line 85`) becomes `items.map(...)`,
with `method.title`/`method.description` → `item.title`/`item.description`.

- [ ] **Step 10: Verify**

```bash
npm run dev
```

Visit `/`. Compare it carefully against what you remember of the
current live site (or open the live site in another tab side by side)
— every heading, paragraph, stat, service card, project image,
testimonial, and accordion item should be identical.

Test the fallback the same way as Task 12 (rename `DATABASE_URI`
temporarily, reload, confirm the home page still renders fully — text
and images — restore the env var).

> **Expected breakage, fixed next:** `app/about/page.tsx` renders
> `<Methods />` (imported from `../home/Methods`) and
> `app/services/page.tsx` renders `<Projects />` and `<Testimonials />`
> (imported from `../home/Projects` and `../home/Testimonials`) — both
> reusing these Home components directly, with no props passed today.
> After this task, those three components require props, so `/about`
> and `/services` will error until Task 14 and Task 15 update those
> pages to pass them in. Don't worry about it here — just confirm `/`
> itself works, then move straight on.

- [ ] **Step 11: Commit**

```bash
git add lib/content/home.ts lib/content/home.defaults.ts app/page.tsx app/home
git commit -m "Wire Home page to Payload with static fallback"
```

---

## Task 14: About page wiring

**Files:**
- Create: `lib/content/about.ts`
- Create: `lib/content/about.defaults.ts`
- Modify: `app/about/page.tsx`
- Modify: `app/about/Hero.tsx`
- Modify: `app/about/VisionMission.tsx`
- Modify: `app/about/Timeline.tsx`
- Modify: `app/about/Certfications.tsx`

**Interfaces:**
- Consumes: `getPayloadClient` (Task 1); `aboutPage` global (Task 8);
  `certifications` collection (Task 5); `getHomeContent` (Task 13) — the
  About page reuses Home's `Methods` component (`app/home/Methods.tsx`,
  imported via `../home/Methods` in `app/about/page.tsx`) and needs its
  `methodsSection` props.
- Produces: `getAboutContent(): Promise<AboutPageContent>` — consumed
  only by `app/about/page.tsx`.

- [ ] **Step 1: Write the defaults**

`lib/content/about.defaults.ts` — same pattern as `home.defaults.ts`:
a `AboutPageContent` type and an `aboutPageDefaults` object built
directly from the literal content already listed in the Task 11 seed
script's `aboutPage` `updateGlobal` call above, plus a `certifications`
array (since that collection has no local `/public` images to fall
back to, use the current hardcoded external links):

```ts
export type AboutPageContent = {
  hero: {
    heading: string
    subheading: string
    paragraphs: string[]
    ctaLabel: string
    backgroundImageUrl: string
    philosophyItems: { title: string; description: string }[]
  }
  visionMission: {
    heading: string
    description: string
    visions: { title: string; description: string }[]
    missions: { title: string; description: string }[]
  }
  timeline: {
    heading: string
    description: string
    backgroundImageUrl: string
    events: { year: string; title: string; description: string }[]
  }
  certificationsIntro: {
    heading: string
    description: string
  }
  certifications: { title: string; description: string; documentUrl: string }[]
}

export const aboutPageDefaults: AboutPageContent = {
  hero: {
    heading: 'THE SSV DIFFERENCE.',
    subheading: 'trust, quality and vision.',
    paragraphs: [
      'At SSV Property Group Ltd, we do not just manage and maintain properties, we build relationships and protect investments. Founded as a family business, our core philosophy is simple: treat every property as if it were our own and every client as part of our family. Our story began not in a large corporate boardroom, but within our own community.',
      "We saw a need for property services that combined professional expertise with a personal touch where your call is answered by a person who knows your name and your property’s history. That vision became the foundation of SSV Property Group.",
      "Today, we remain a family-owned and operated business. This means the values we started with are the values we operate by every day: integrity, reliability, and a relentless commitment to quality. For us, it’s not just about completing a job, it’s about building a legacy of trust, one satisfied client at a time.",
    ],
    ctaLabel: 'JOIN THE DIFFERENCE',
    backgroundImageUrl: '/about-hero.jpg',
    philosophyItems: [
      { title: 'Sustainable', description: 'We focus on long-term solutions that protect property value and create lasting benefits for our clients.' },
      { title: 'Solutions', description: 'Every property is different. We provide practical, professional solutions built around your needs.' },
      { title: 'Visionary', description: 'We look beyond today, combining experience and forward-thinking ideas to shape better outcomes.' },
      { title: 'Values', description: 'Integrity, reliability, care and quality guide every decision we make and every relationship we build.' },
    ],
  },
  visionMission: {
    heading: 'OUR DIRECTION',
    description: 'Guided by sustainable thinking and visionary values, we strive to create meaningful places, opportunities and long-term impact.',
    visions: [
      { title: 'Proactive Care Over Reactive Repairs', description: 'To pioneer a new standard of predictive and planned maintenance by providing a safe environment for tenants, and delivers true peace of mind.' },
      { title: 'The Return of the Human Touch', description: 'To be the trusted, local partner that our clients and communities can rely on. We are building a network of trust across the UK one relationship at a time.' },
      { title: 'Raising the Standard, Together', description: 'To set a new, uncompromising benchmark for quality and integrity in everything we do. We aim to inspire a “race to the top” in the UK with excellence and loyalty.' },
    ],
    missions: [
      { title: 'Standards', description: 'By upholding the highest standards of safety and craftsmanship. Whether handling small repairs or full-scale property care, we treat every home as if it were our own.' },
      { title: 'Trust', description: 'Prioritizing trust, transparency, and communication. Our family-run approach means every client receives hands-on support, consistent care, and a reliable point of contact who truly understands their needs.' },
      { title: 'Deliver', description: 'To deliver dependable, high-quality property care that puts people first. We are committed to supporting landlords, protecting investments, and creating safe, comfortable homes for tenants through a blend of proactive maintenance, personalized service, and family-driven values.' },
    ],
  },
  timeline: {
    heading: 'OUR TIMELINE',
    description: 'From our beginnings in construction to our vision for the future of property development, our journey has been shaped by experience, evolution and a commitment to creating lasting value.',
    backgroundImageUrl: '/timeline-background.jpg',
    events: [
      { year: '2023', title: 'The Birth of SSV Property Group Ltd', description: 'SSV Property Group Ltd was officially named and established to continue and modernize the family legacy in South Africa. The new brand united decades of expertise under one forward-thinking company, offering a proactive, structured, and high-standard approach to property services.' },
      { year: '2023 (Continued)', title: 'Entering the UK Market', description: 'Driven by a vision to bring our unique, generationally refined solution to the UK, we expanded our services to the British market. Here, we combined our proven methods from back home with a deep understanding of UK property standards, regulations, and client expectations.' },
      { year: '2024', title: 'Local Expertise Meets Generational Skill', description: 'With our UK base established, SSV began serving local landlords, homeowners, and tenents, offering the perfect blend. Years of perfected experience and the focused dedication of a local UK team.' },
      { year: '2025', title: 'Continued Expansion & Proactive Property Care', description: 'We continue refining our proactive property care model, building strong partnerships, and expanding our footprint across the UK all while staying true to the values built over four generations.' },
      { year: 'Today', title: 'Building The Future', description: 'SSV continues to build on generations of experience while looking toward the future through sustainable solutions, visionary values and meaningful development.' },
    ],
  },
  certificationsIntro: {
    heading: 'CERTIFICATIONS',
    description: 'Our certifications and supporting documentation reflect our commitment to professional standards, safety, social responsibility and protecting the interests of our clients.',
  },
  certifications: [
    { title: 'Bronze Membership Certificate', description: 'Our Bronze Membership Certificate demonstrates our commitment to professional standards and continued development.', documentUrl: 'https://ssvpropertygroup.co.uk/wp-content/uploads/2026/06/Bronze-1.pdf' },
    { title: 'Health & Safety Certificate', description: 'Recognition of our commitment to maintaining strong health and safety standards across our operations.', documentUrl: 'https://ssvpropertygroup.co.uk/wp-content/uploads/2026/06/Once_For_All_Health_Safety_-_SSIP_-2.pdf' },
    { title: 'Social Value Certificate', description: 'Reflecting our commitment to creating positive social impact and delivering value within the communities we serve.', documentUrl: 'https://ssvpropertygroup.co.uk/wp-content/uploads/2026/06/Social_Value-2.pdf' },
    { title: 'Liability Insurance Policy', description: 'Confirmation of our professional insurance coverage and commitment to protecting our clients and projects.', documentUrl: 'https://ssvpropertygroup.co.uk/wp-content/uploads/2026/06/TO-WHOM-IT-MAY-CONCERN-TL-1.pdf' },
  ],
}
```

- [ ] **Step 2: Write the fetch-with-fallback function**

`lib/content/about.ts`:

```ts
import { getPayloadClient } from '../payload/getPayloadClient'
import { aboutPageDefaults, type AboutPageContent } from './about.defaults'

function mediaUrl(image: unknown): string {
  if (image && typeof image === 'object' && 'url' in image && typeof (image as { url: unknown }).url === 'string') {
    return (image as { url: string }).url
  }
  return ''
}

export async function getAboutContent(): Promise<AboutPageContent> {
  try {
    const payload = await getPayloadClient()
    const [about, certifications] = await Promise.all([
      payload.findGlobal({ slug: 'aboutPage', depth: 1 }),
      payload.find({ collection: 'certifications', sort: 'order', limit: 100, depth: 1 }),
    ])

    return {
      hero: {
        heading: about.hero.heading,
        subheading: about.hero.subheading,
        paragraphs: about.hero.paragraphs.map((p) => p.text),
        ctaLabel: about.hero.ctaLabel,
        backgroundImageUrl: mediaUrl(about.hero.backgroundImage) || aboutPageDefaults.hero.backgroundImageUrl,
        philosophyItems: about.hero.philosophyItems.map((p) => ({ title: p.title, description: p.description })),
      },
      visionMission: {
        heading: about.visionMission.heading,
        description: about.visionMission.description,
        visions: about.visionMission.visions.map((v) => ({ title: v.title, description: v.description })),
        missions: about.visionMission.missions.map((m) => ({ title: m.title, description: m.description })),
      },
      timeline: {
        heading: about.timeline.heading,
        description: about.timeline.description,
        backgroundImageUrl: mediaUrl(about.timeline.backgroundImage) || aboutPageDefaults.timeline.backgroundImageUrl,
        events: about.timeline.events.map((e) => ({ year: e.year, title: e.title, description: e.description })),
      },
      certificationsIntro: {
        heading: about.certificationsIntro.heading,
        description: about.certificationsIntro.description,
      },
      certifications: certifications.docs.length
        ? certifications.docs.map((c) => ({ title: c.title, description: c.description, documentUrl: mediaUrl(c.document) }))
        : aboutPageDefaults.certifications,
    }
  } catch (error) {
    console.error('Falling back to static about content:', error)
    return aboutPageDefaults
  }
}
```

- [ ] **Step 3: Wire `app/about/page.tsx`**

The current file is:

```tsx
import Hero from "./Hero";
import VisionMission from "./VisionMission";
import Timeline from "./Timeline";
import Certifications from "./Certfications";
import Methods from "../home/Methods";

export default function About() {
    return (
        <main>
            <Hero />
            <VisionMission />
            <Timeline />
            <Certifications />
            <Methods />
        </main>
    );
}
```

It reuses Home's `Methods` component as its final section. Replace the
whole file — fetch both this page's own content and Home's content
(for `Methods`' props), keeping the exact same component order:

```tsx
import Hero from "./Hero";
import VisionMission from "./VisionMission";
import Timeline from "./Timeline";
import Certifications from "./Certfications";
import Methods from "../home/Methods";
import { getAboutContent } from "../../lib/content/about";
import { getHomeContent } from "../../lib/content/home";

export default async function About() {
  const [content, homeContent] = await Promise.all([
    getAboutContent(),
    getHomeContent(),
  ]);

  return (
    <main>
      <Hero {...content.hero} />
      <VisionMission {...content.visionMission} />
      <Timeline {...content.timeline} />
      <Certifications {...content.certificationsIntro} certifications={content.certifications} />
      <Methods {...homeContent.methodsSection} />
    </main>
  );
}
```

- [ ] **Step 4: Update `app/about/Hero.tsx`**

Same pattern as Task 13 Step 4. Background image, heading (`"THE SSV
DIFFERENCE."` — split into `THE SSV` / `DIFFERENCE` + trailing `.` to
match the existing two-line styling with the colored period), the
`h2` statement (`lines 92-107`, contains an embedded highlighted
phrase — since this is one field, keep the highlight styling
hardcoded around the *last sentence clause* the way the heading split
works, or simplify to rendering `subheading` as one styled string with
the last few words highlighted only if they match a known suffix;
simplest faithful option: store `subheading` as plain text and drop the
partial-highlight styling to just wrap the whole subheading, OR keep
the two-tone split by having the field literally be `"trust, quality
and vision"` in Payload's `subheading` matched against the fixed lead-in
"Property solutions built on" already hardcoded in JSX). Use this
approach — lead-in text stays in the component, only the colored
tail is a prop:

```tsx
export default function Hero({
  heading,
  subheading,
  paragraphs,
  ctaLabel,
  backgroundImageUrl,
  philosophyItems,
}: {
  heading: string;
  subheading: string;
  paragraphs: string[];
  ctaLabel: string;
  backgroundImageUrl: string;
  philosophyItems: { title: string; description: string }[];
}) {
```

JSX changes:
- `<Image src="/about-hero.jpg" .../>` → `src={backgroundImageUrl}`
- Heading: split `heading` (`"THE SSV DIFFERENCE."`) into everything
  before the last word and the last word:
  ```tsx
  const headingWords = heading.replace(/\.$/, '').split(' ');
  const headingLead = headingWords.slice(0, -1).join(' ');
  const headingTail = headingWords.slice(-1)[0];
  // JSX: {headingLead}<br /><span className="text-white/90">{headingTail}<span className="text-[#0CC0DF]">.</span></span>
  ```
- `h2` (`lines 92-107`): replace with
  `Property solutions built on{" "}<span className="text-[#0CC0DF]">{subheading}</span>`
  — `subheading` holds just the colored tail phrase (`"trust, quality
  and vision."`), matching how `about.defaults.ts` and the Task 11 seed
  script already define it above.
- The 3 `<p>` paragraphs (`lines 115-145`) → `{paragraphs.map((p, i) => <p key={i} className="mt-6 max-w-lg text-sm leading-7 text-white sm:text-base">{p}</p>)}` (drop the differing `mt-*` values, they're visually indistinguishable at `mt-6`)
- CTA text `JOIN THE DIFFERENCE` (`line 171`) → `{ctaLabel}`
- The 4 philosophy blocks (`Sustainable`/`Solutions`/`Visionary`/`Values`,
  `lines 226-323`) → map over `philosophyItems`, keeping the `01`-`04`
  numbering and border styling:
  ```tsx
  {philosophyItems.map((item, i) => (
    <div key={item.title} className={`border-${i === 3 ? 'y' : 't'} border-white/20 py-6`}>
      <div className="flex items-start gap-5">
        <span className="text-sm font-medium text-[#0CC0DF]">{String(i + 1).padStart(2, '0')}</span>
        <div>
          <h4 className="text-lg font-semibold uppercase tracking-wide">{item.title}</h4>
          <p className="mt-2 text-sm leading-6 text-white/60">{item.description}</p>
        </div>
      </div>
    </div>
  ))}
  ```

- [ ] **Step 5: Update `app/about/VisionMission.tsx`**

Replace the hardcoded `visions`/`missions` consts (`lines 6-46`) and
heading/description (`lines 55-65`) with props:

```tsx
export default function VisionMission({
  heading,
  description,
  visions,
  missions,
}: {
  heading: string;
  description: string;
  visions: { title: string; description: string }[];
  missions: { title: string; description: string }[];
}) {
```

Split `heading` (`"OUR DIRECTION"`) into lead + highlighted last word
the same way as prior components. Render `{description}` in place of
the hardcoded paragraph. Replace `visions.map((vision) => ...)` (`line
88`) and `missions.map((mission) => ...)` (`line 133`) — they already
map over local consts with the same shape (`number`, `title`,
`description`); since the prop items don't have a `number` field,
derive it: `visions.map((vision, i) => ...)` using
`String(i + 1).padStart(2, '0')` wherever `vision.number` was
referenced, same for missions.

- [ ] **Step 6: Update `app/about/Timeline.tsx`**

Replace the hardcoded `timeline` const (`lines 6-37`) and
heading/description (`lines 75-91`) with props:

```tsx
export default function Timeline({
  heading,
  description,
  backgroundImageUrl,
  events,
}: {
  heading: string;
  description: string;
  backgroundImageUrl: string;
  events: { year: string; title: string; description: string }[];
}) {
```

`<Image src="/timeline-background.jpg" .../>` → `src={backgroundImageUrl}`.
Split `heading` (`"OUR TIMELINE"`) the same lead+highlight way. Render
`{description}`. The `timeline.map((item, index) => ...)` (`line 104`)
becomes `events.map((item, index) => ...)` — the item shape (`year`,
`title`, `description`) is unchanged, so the rest of that block needs
no further edits.

- [ ] **Step 7: Update `app/about/Certfications.tsx`**

Replace the hardcoded `certifications` const (`lines 5-34`) and
heading/description (`lines 60-81`) with props:

```tsx
export default function Certifications({
  heading,
  description,
  certifications,
}: {
  heading: string;
  description: string;
  certifications: { title: string; description: string; documentUrl: string }[];
}) {
```

Split `heading` (`"CERTIFICATIONS"`) — this one has no trailing
lowercase word to highlight, it's rendered as
`CERTIFICATIONS <span className="text-[#0CC0DF]">.</span>` today
(`lines 70-74`), so keep that exact structure with `{heading}` replacing
the literal text and the colored period staying hardcoded. Render
`{description}`. The `certifications.map((certificate) => ...)` (`line
89`) — replace `certificate.number` (no longer in the data) with
`String(i + 1).padStart(2, '0')` via `certifications.map((certificate, i) => ...)`,
`certificate.title`/`certificate.description` unchanged, `certificate.link` → `certificate.documentUrl`.

- [ ] **Step 8: Verify**

```bash
npm run dev
```

Visit `/about`. Compare every section against the current live site.
Test the fallback (rename `DATABASE_URI`, reload, confirm full render,
restore).

- [ ] **Step 9: Commit**

```bash
git add lib/content/about.ts lib/content/about.defaults.ts app/about
git commit -m "Wire About page to Payload with static fallback"
```

---

## Task 15: Services page wiring

**Files:**
- Create: `lib/content/services-page.ts`
- Create: `lib/content/services-page.defaults.ts`
- Modify: `app/services/page.tsx`
- Modify: `app/services/Hero.tsx`
- Modify: `app/services/PropManagementServices.tsx`

**Interfaces:**
- Consumes: `getPayloadClient` (Task 1); `servicesPage` global (Task 9);
  `services` collection (Task 2); `getHomeContent` (Task 13) — the
  Services page reuses Home's `Projects` and `Testimonials` components
  (`app/home/Projects.tsx` / `app/home/Testimonials.tsx`, imported via
  `../home/Projects` / `../home/Testimonials` in
  `app/services/page.tsx`) and needs their `projectsSection` /
  `testimonialsSection` props.
- Produces: `getServicesPageContent(): Promise<ServicesPageContent>` —
  consumed only by `app/services/page.tsx`.

- [ ] **Step 1: Write the defaults**

`lib/content/services-page.defaults.ts`:

```ts
export type ServicesPageContent = {
  hero: {
    eyebrow: string
    heading: string
    subheading: string
    description: string
    ctaLabel: string
    backgroundImageUrl: string
  }
  servicesSection: {
    heading: string
    description: string
    services: {
      title: string
      icon: string
      shortDescription: string
      description: string
      features: string[]
    }[]
  }
}

export const servicesPageDefaults: ServicesPageContent = {
  hero: {
    eyebrow: 'Our Expertise',
    heading: 'WE ARE AT YOUR SERVICE.',
    subheading: 'Property management with a difference.',
    description: 'We manage properties with care, professionalism and a long-term vision. Our approach combines reliable service with practical solutions that protect your property and your investment.',
    ctaLabel: 'GET IN TOUCH',
    backgroundImageUrl: '/services-hero.jpg',
  },
  servicesSection: {
    heading: 'PROPERTY MANAGEMENT SERVICES',
    description: 'Professional property management solutions designed to protect your investment, maintain your property and deliver lasting value.',
    services: [
      { title: 'Property Maintenance & Preventative Care', icon: 'Building2', shortDescription: 'Planned and reactive maintenance to keep properties safe, functional, and well maintained.', description: 'Ongoing maintenance is paramount to responsible property ownership and plays an important role in reducing the risk of damage and deterioration. We offer planned and reactive property maintenance services to help keep buildings in good condition, address issues early, and reduce the likelihood of preventable problems escalating.', features: ['General property repairs and upkeep.', 'Identification and rectification of minor defects.', 'Preventative works to reduce water ingress and deterioration.', 'Ongoing maintenance support for landlords and property owners.', 'Records of maintenance and repair works carried out.'] },
      { title: 'Damage Mitigation & Protective Measures', icon: 'FenceIcon', shortDescription: 'Prompt damage mitigation to limit further damage, protect your property, and reduce costly repairs.', description: 'Early intervention can significantly reduce the extent and cost of property damage. We provide damage mitigation services to prevent minor issues from becoming major repairs. Where appropriate, we can attend site promptly to assess the situation and carry out practical measures to limit further damage and protect the property.', features: ['Making the property safe following an incident.', 'Temporary isolation and protection works.', 'Moisture control and drying measures.', 'Removal of affected materials where necessary.', 'Preventative actions to stop further deterioration.'] },
      { title: 'Property Claims & Resultant Damage Reinstatement', icon: 'CloudRain', shortDescription: 'Professional damage assessment and reinstatement services to accurately identify, report, and restore property damage.', description: 'We provide a professional damage assessment and reinstatement service. Our role is to support the claims process by accurately assessing damage, preparing repair reports and quotations, and delivering reinstatement works. We work collaboratively with insurers and appointed loss adjusters to ensure all resultant damage is properly identified and addressed.', features: ['Assessing and documenting resultant damage.', 'Preparing detailed repair reports and scopes of works.', 'Providing clear and transparent repair quotations.', 'Liaising with appointed loss adjusters where required.', 'Managing and completing reinstatement works.'] },
      { title: 'Maintenance Insurance Claims & Inspections', icon: 'ClipboardCheck', shortDescription: 'Property management focused on inspections, maintenance, safety, and keeping your property in excellent condition.', description: 'We provide hands-on property management focused on maintenance, inspections, and ensuring your property remains safe, compliant, and well maintained at all times. Our services do not include rent collection or tenant financial management. We specialize in physical care of your property, managing inspections and overseeing maintenance works professionally.', features: ['We carry out regular property inspections, routine maintenance, and urgent repairs.', 'Identifying issues early and resolving them quickly to protect your property and reduce long-term costs.', "We offer flexible monthly maintenance packages tailored to your property's needs.", 'Providing clear and transparent repair quotations.', 'These include regular inspections, preventative maintenance, and prompt repairs, helping identify issues early, reduce unexpected costs, and protect your investment.'] },
    ],
  },
}
```

- [ ] **Step 2: Write the fetch-with-fallback function**

`lib/content/services-page.ts`:

```ts
import { getPayloadClient } from '../payload/getPayloadClient'
import { servicesPageDefaults, type ServicesPageContent } from './services-page.defaults'

function mediaUrl(image: unknown): string {
  if (image && typeof image === 'object' && 'url' in image && typeof (image as { url: unknown }).url === 'string') {
    return (image as { url: string }).url
  }
  return ''
}

export async function getServicesPageContent(): Promise<ServicesPageContent> {
  try {
    const payload = await getPayloadClient()
    const [servicesPage, services] = await Promise.all([
      payload.findGlobal({ slug: 'servicesPage', depth: 1 }),
      payload.find({ collection: 'services', sort: 'order', limit: 100, depth: 0 }),
    ])

    return {
      hero: {
        eyebrow: servicesPage.hero.eyebrow,
        heading: servicesPage.hero.heading,
        subheading: servicesPage.hero.subheading,
        description: servicesPage.hero.description,
        ctaLabel: servicesPage.hero.ctaLabel,
        backgroundImageUrl: mediaUrl(servicesPage.hero.backgroundImage) || servicesPageDefaults.hero.backgroundImageUrl,
      },
      servicesSection: {
        heading: servicesPage.servicesSection.heading,
        description: servicesPage.servicesSection.description,
        services: services.docs.length
          ? services.docs.map((s) => ({
              title: s.title,
              icon: s.icon,
              shortDescription: s.shortDescription,
              description: s.description,
              features: s.features.map((f) => f.feature),
            }))
          : servicesPageDefaults.servicesSection.services,
      },
    }
  } catch (error) {
    console.error('Falling back to static services page content:', error)
    return servicesPageDefaults
  }
}
```

- [ ] **Step 3: Wire `app/services/page.tsx`**

The current file is:

```tsx
import Hero from "../services/Hero";
import PropManagementServices from "../services/PropManagementServices";
import Projects from "../home/Projects";
import Testimonials from "../home/Testimonials";

export default function Services() {
  return (
    <main>
      <Hero />
      <PropManagementServices />
      <Projects />
      <Testimonials />
    </main>
  );
}
```

It reuses Home's `Projects` and `Testimonials` components. Replace the
whole file — fetch both this page's own content and Home's content
(for those two components' props), keeping the exact same order:

```tsx
import Hero from "../services/Hero";
import PropManagementServices from "../services/PropManagementServices";
import Projects from "../home/Projects";
import Testimonials from "../home/Testimonials";
import { getServicesPageContent } from "../../lib/content/services-page";
import { getHomeContent } from "../../lib/content/home";

export default async function Services() {
  const [content, homeContent] = await Promise.all([
    getServicesPageContent(),
    getHomeContent(),
  ]);

  return (
    <main>
      <Hero {...content.hero} services={content.servicesSection.services} />
      <PropManagementServices {...content.servicesSection} />
      <Projects {...homeContent.projectsSection} />
      <Testimonials {...homeContent.testimonialsSection} />
    </main>
  );
}
```

- [ ] **Step 4: Update `app/services/Hero.tsx`**

This component has its own local `services` const (`lines 6-11`) that
is a *shorter* list (just 4 title strings, no icons in that array — the
icons are actually imported separately per hardcoded item) — replace it
with a `services` prop derived from the same `services` collection data,
mapping icon name strings to the actual lucide components:

```tsx
import {
    Building2,
    ClipboardCheck,
    CloudRain,
    FenceIcon,
} from "lucide-react";

const ICONS = { Building2, ClipboardCheck, CloudRain, FenceIcon } as const;

export default function Hero({
  eyebrow,
  heading,
  subheading,
  description,
  ctaLabel,
  backgroundImageUrl,
  services,
}: {
  eyebrow: string;
  heading: string;
  subheading: string;
  description: string;
  ctaLabel: string;
  backgroundImageUrl: string;
  services: { title: string; icon: string }[];
}) {
```

JSX changes:
- `<Image src="/services-hero.jpg" .../>` → `src={backgroundImageUrl}`
- `Let us talk property` (`line 83`, note: this file is actually the
  `/services` Hero, whose eyebrow text is "Our Expertise" — reread the
  file's actual current text before editing; use whatever's there) →
  `{eyebrow}`
- Left column heading `Property management with a{" "}<span
  className="text-[#0CC0DF]">difference.</span>` (`lines 82-87`) — split
  `subheading` (`"Property management with a difference."`) into lead +
  highlighted last word, same pattern as before
- Left column description (`lines 91-96`) → `{description}`
- `GET IN TOUCH` (`line 121`) → `{ctaLabel}`
- Right column heading `WE ARE AT{" "}<br /><span
  className="text-white">YOUR SERVICE<span
  className="text-[#0CC0DF]">.</span></span>` (`lines 144-165`) — split
  `heading` (`"WE ARE AT YOUR SERVICE."`) the same lead+highlight way,
  keeping the trailing colored period hardcoded
- Service list `services.map((service) => ...)` (`line 172`) — now
  iterates the prop instead of the local const; replace `service.icon`
  (previously a component reference) with `ICONS[service.icon as
  keyof typeof ICONS]`:
  ```tsx
  {services.map((service) => {
    const Icon = ICONS[service.icon as keyof typeof ICONS];
    return (
      <div key={service.title} ...>
        ...
        <Icon size={21} strokeWidth={1.7} .../>
        <span ...>{service.title}</span>
      </div>
    );
  })}
  ```

- [ ] **Step 5: Update `app/services/PropManagementServices.tsx`**

Replace the hardcoded `services` const (`lines 6-63`) and
heading/description (`lines 108-128`) with props:

```tsx
const ICONS = { Building2, Wrench, ClipboardCheck, FenceIcon, CloudRain } as const;
// (add whichever of these are already imported vs. need importing —
// this file doesn't currently render icons per-service, only text, so
// no new icon imports are actually needed here; the `icon` field is
// unused by this component and safe to ignore)

export default function Services({
  heading,
  description,
  services,
}: {
  heading: string;
  description: string;
  services: { title: string; shortDescription: string; description: string; features: string[] }[];
}) {
  const [activeService, setActiveService] = useState(0);
  const service = services[activeService];
```

Split `heading` (`"PROPERTY MANAGEMENT SERVICES"`) into lead + highlight
following the existing `PROPERTY{" "}<span
className="text-[#0CC0DF]">MANAGEMENT SERVICES</span>` split (first word
plain, rest highlighted — this one splits differently from the others,
after the *first* word rather than before the last, so implement it
specifically):

```tsx
const [headingFirst, ...headingRest] = heading.split(' ');
// JSX: {headingFirst}{" "}<span className="text-[#0CC0DF]">{headingRest.join(' ')}</span>
```

Render `{description}` in place of the hardcoded paragraph. The service
nav buttons `services.map((item, index) => ...)` (`line 141`) and the
active service detail panel (`lines 230-344`) both already read from a
`services`-shaped array with matching field names (`title`,
`short`/→ rename references from `item.short` to `item.shortDescription`,
`description`, `features`) — update those two field name references
(`short` → `shortDescription`) and replace `service.number` (no longer
in the data) with `String(activeService + 1).padStart(2, '0')` in the
two places `service.number` is rendered.

- [ ] **Step 6: Verify**

```bash
npm run dev
```

Visit `/services`. Compare against the current live site, including
clicking through all 4 services in the interactive nav to confirm the
detail panel updates correctly. Test the fallback (rename
`DATABASE_URI`, reload, confirm full render, restore).

- [ ] **Step 7: Commit**

```bash
git add lib/content/services-page.ts lib/content/services-page.defaults.ts app/services
git commit -m "Wire Services page to Payload with static fallback"
```

---

## Task 16: Contact page wiring

**Files:**
- Create: `lib/content/contact.ts`
- Create: `lib/content/contact.defaults.ts`
- Modify: `app/contact/page.tsx`
- Modify: `app/contact/Hero.tsx`
- Modify: `app/contact/ContactDetails.tsx`

**Interfaces:**
- Consumes: `getPayloadClient` (Task 1); `contactPage` global (Task 10).
- Produces: `getContactContent(): Promise<ContactPageContent>` —
  consumed only by `app/contact/page.tsx`.

- [ ] **Step 1: Write the defaults**

`lib/content/contact.defaults.ts`:

```ts
export type ContactPageContent = {
  hero: {
    eyebrow: string
    heading: string
    tagline: string
  }
  details: {
    heading: string
    description: string
    email: string
    phone: string
    locationLines: string[]
    mapQuery: string
  }
}

export const contactPageDefaults: ContactPageContent = {
  hero: {
    eyebrow: 'Let us talk property',
    heading: 'CONTACT US.',
    tagline: 'Property advice and services when you need it.',
  },
  details: {
    heading: 'Get In Touch.',
    description: 'Have a property that needs attention? Get in touch with our team and let us know how we can assist.',
    email: 'geet.ssvpropertygroup@gmail.com',
    phone: '+44 7918 351115',
    locationLines: ['Milton Keynes', 'London, United Kingdom'],
    mapQuery: 'London, United Kingdom',
  },
}
```

- [ ] **Step 2: Write the fetch-with-fallback function**

`lib/content/contact.ts`:

```ts
import { getPayloadClient } from '../payload/getPayloadClient'
import { contactPageDefaults, type ContactPageContent } from './contact.defaults'

export async function getContactContent(): Promise<ContactPageContent> {
  try {
    const payload = await getPayloadClient()
    const contact = await payload.findGlobal({ slug: 'contactPage', depth: 0 })

    return {
      hero: {
        eyebrow: contact.hero.eyebrow,
        heading: contact.hero.heading,
        tagline: contact.hero.tagline,
      },
      details: {
        heading: contact.details.heading,
        description: contact.details.description,
        email: contact.details.email,
        phone: contact.details.phone,
        locationLines: contact.details.locationLines.map((l) => l.line),
        mapQuery: contact.details.mapQuery,
      },
    }
  } catch (error) {
    console.error('Falling back to static contact content:', error)
    return contactPageDefaults
  }
}
```

- [ ] **Step 3: Wire `app/contact/page.tsx`**

The current file is:

```tsx
import Hero from "../contact/Hero";
import ContactDetails from "../contact/ContactDetails";

export default function Home() {
    return (
        <main>
            <Hero />
            <ContactDetails />
        </main>
    );
}
```

(Its default export is named `Home` — a pre-existing naming leftover,
unrelated to this migration; leave it as-is.) Replace with:

```tsx
import Hero from "../contact/Hero";
import ContactDetails from "../contact/ContactDetails";
import { getContactContent } from "../../lib/content/contact";

export default async function Home() {
  const content = await getContactContent();

  return (
    <main>
      <Hero {...content.hero} />
      <ContactDetails {...content.details} />
    </main>
  );
}
```

- [ ] **Step 4: Update `app/contact/Hero.tsx`**

```tsx
export default function Hero({
  eyebrow,
  heading,
  tagline,
}: {
  eyebrow: string;
  heading: string;
  tagline: string;
}) {
```

- `Let us talk property` (`line 83`) → `{eyebrow}`
- Heading `CONTACT<br /><span className="text-[#0CC0DF]">US<span
  className="text-white">.</span></span>` (`lines 95-101`) — split
  `heading` (`"CONTACT US."`) into lead + highlighted last word (drop
  the trailing `.` before splitting, keep it hardcoded after, matching
  the existing structure):
  ```tsx
  const headingWords = heading.replace(/\.$/, '').split(' ');
  const headingLead = headingWords.slice(0, -1).join(' ');
  const headingTail = headingWords.slice(-1)[0];
  // JSX: {headingLead}<br /><span className="text-[#0CC0DF]">{headingTail}<span className="text-white">.</span></span>
  ```
- `Property advice and services when you need it.` (`line 107`) →
  `{tagline}`

- [ ] **Step 5: Update `app/contact/ContactDetails.tsx`**

```tsx
export default function ContactDetails({
  heading,
  description,
  email,
  phone,
  locationLines,
  mapQuery,
}: {
  heading: string;
  description: string;
  email: string;
  phone: string;
  locationLines: string[];
  mapQuery: string;
}) {
```

- Heading `Get In<br /><span className="text-[#0CC0DF]">Touch.</span>`
  (`lines 42-47`) — split `heading` (`"Get In Touch."`) the same
  lead+highlight way
- Description (`line 53`) → `{description}`
- Email link (`lines 107, 149`) → `href={`mailto:${email}`}`, text →
  `{email}`
- Phone link (`lines 173, 215`) → `href={`tel:${phone.replace(/\s/g, '')}`}`, text → `{phone}`
- Location `<p>` (`lines 262-266`, two hardcoded `<span>` lines) →
  `{locationLines.map((line) => <span key={line}>{line}</span>)}`
- Map embed `src="https://www.google.com/maps?q=London%2C%20United%20Kingdom&output=embed"`
  (`line 316`) → `` src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`} ``

- [ ] **Step 6: Verify**

```bash
npm run dev
```

Visit `/contact`. Compare against the current live site — including
that the map embed still shows the right location. Test the fallback
(rename `DATABASE_URI`, reload, confirm full render, restore).

- [ ] **Step 7: Commit**

```bash
git add lib/content/contact.ts lib/content/contact.defaults.ts app/contact
git commit -m "Wire Contact page to Payload with static fallback"
```

---

## Task 17: Final verification & deploy

**Files:** none (verification and deployment configuration only)

- [ ] **Step 1: Full local pixel-comparison pass**

With `npm run dev` running, open each of the 4 pages and compare them
side-by-side against the current production site (open it in a second
tab). Check: fonts, spacing, colors, image placement, hover states,
the Home statistics counters animating, the Home/Contact carousels and
accordions still working, mobile nav menu still working.

- [ ] **Step 2: Full fallback pass**

Rename `DATABASE_URI` in `.env.local` to `DATABASE_URI_DISABLED`,
restart `npm run dev`, and click through all 4 pages plus Header/Footer.
Every page should render fully (text and images) from its `defaults.ts`
file, with fallback errors logged in the terminal but no broken UI.
Restore `DATABASE_URI` afterward and confirm the site goes back to
serving Payload-sourced content.

- [ ] **Step 3: Type-check and build locally**

```bash
npx tsc --noEmit
npm run build
```

Fix any type errors before proceeding — these are the same checks
Vercel's build will run.

- [ ] **Step 4: Add environment variables to Vercel**

In the Vercel dashboard for this existing project → Settings →
Environment Variables, add `DATABASE_URI`, `PAYLOAD_SECRET`, and
`BLOB_READ_WRITE_TOKEN` (same values as `.env.local`) for the
Production environment. Do not change any other project setting.

- [ ] **Step 5: Merge and deploy**

```bash
git push origin main
```

Vercel deploys through its normal existing pipeline. Once deployed,
visit the live domain and repeat Step 1's comparison pass against
production traffic.

- [ ] **Step 6: Verify the admin panel in production**

Visit `https://<your-domain>/admin`, log in with the admin user you
created in Task 1 (Payload's data lives in the same production
database, so the same login works), edit one piece of text (e.g. a
testimonial), save, and reload the live page — confirm the change
appears within a few seconds (the `afterChange` → `revalidatePath`
hooks from Tasks 2–10 doing their job).

- [ ] **Step 7: Run the seed script's certifications reminder**

If you skipped uploading real certification PDFs during Task 11,
do it now via `/admin` → Certifications, so the About page serves your
own hosted files instead of falling back to the old WordPress links.
