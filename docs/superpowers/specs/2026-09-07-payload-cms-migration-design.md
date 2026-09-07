# Static Site → Payload CMS Migration

Date: 2026-09-07
Status: Approved design, pending implementation plan

## Goal

Move all content and images on the SSV Property Group site (currently
hardcoded across ~20 React components on 4 pages) into Payload CMS, so
non-developers can edit copy and media through an admin UI, while:

- Visual output stays pixel-identical — no redesign, no JSX/Tailwind changes.
- Deployment stays exactly as-is — same Vercel project, same domain, same
  `git push → Vercel build` pipeline. New resources (Postgres DB, Blob
  storage) are added to that existing project, nothing is replaced.
- If Payload or its database is ever unreachable (outage, bad deploy,
  build-time DB hiccup), pages fall back to today's static content
  automatically, so the site never goes down because of the CMS.

## Current state

Next.js 16.3.0 (App Router), React 19, Tailwind 4. Four pages — `/`
(home), `/about`, `/services`, `/contact` — each composed of section
components under `app/<page>/*.tsx`, plus a shared `Header`/`Footer`
under `app/_components/Global/`. All section components are `"use
client"` (framer-motion fades, counters, carousels, accordions, tabs).
Content (headings, paragraphs, testimonials, project images, service
descriptions, timeline entries, certification links, contact details)
is hardcoded inline or in local `const` arrays inside each component.
No CMS, no database, `package.json` has no Payload dependency today.

`next.config.ts` does not enable `cacheComponents`, so the project is
on Next's classic caching model (`revalidate`, `revalidateTag`,
`revalidatePath`, route segment config) — not the newer Cache
Components / `'use cache'` model. This matters because it's what makes
the on-demand-revalidation approach below work without extra config.

**Open risk**: this is a newer/customized Next.js version (16.3, with
Proxy replacing Middleware). Payload's official Next.js integration
has not been verified against this exact version from this
conversation — that's the first thing implementation confirms (see
Rollout, step 1), before any other work is built on top of it.

## Architecture

Payload runs **embedded** in this Next.js app (not a separate
service): `payload.config.ts` at the repo root, `withPayload()`
wrapping `next.config.ts`, and two generated route-group entries that
don't touch existing routes:

- `app/(payload)/admin/[[...segments]]/page.tsx` — admin UI
- `app/(payload)/api/[...slug]/route.ts` — REST/GraphQL API

Database: Postgres via `@payloadcms/db-postgres` (Vercel Postgres or
Neon — provisioned as a new resource on the existing Vercel project).
Media storage: `@payloadcms/storage-vercel-blob`, since Vercel's
filesystem is read-only/ephemeral at runtime.

Pages remain **Server Components**. Each `page.tsx` calls a
`get<Page>Content()` function that:

1. Calls Payload's **Local API** (`getPayload({config})`, in-process —
   no HTTP round trip) to fetch that page's global(s) and any
   collection entries it needs.
2. On any failure, catches it and returns a `defaults.ts` object for
   that page instead (see Fallback below).
3. Passes the resulting data down as props into the existing,
   unmodified `"use client"` section components — e.g. `<Hero
   heading={data.hero.heading} />` replaces the component's own
   hardcoded heading. Component JSX, Tailwind classes, and animation
   logic do not change — only where their data comes from.

## Data model

Four **collections** (repeatable content, reused across pages or
independently growable — Payload gives drag-to-reorder for free) and
five **globals** (one record each, page-specific hero copy and small
layout-bound arrays).

### Collections

**`services`** — used by both the Home "Services We Excel In" cards
and the full `/services` page list, which today are separately
hardcoded and already inconsistent (Home shows 3 cards, `/services`
shows 4, with overlapping but different wording). One source of truth
fixes that drift as part of this migration.
- `title` (text)
- `icon` (select: one of the lucide-react icons currently used —
  `Building2`, `Wrench`, `ClipboardCheck`, `FenceIcon`, `CloudRain` —
  extendable later)
- `shortDescription` (text) — used in the `/services` page's nav list
- `description` (textarea) — full paragraph
- `features` (array of text) — bullet list on `/services`
- `order` (number, for manual sort override if drag-reorder isn't
  enough)

**`projects`** — Home page image carousel.
- `title` (text, optional — not currently displayed but useful for
  admin/alt text)
- `image` (upload → `media`)
- `order` (number)

**`testimonials`** — Home page testimonial grid.
- `citation` (text) — e.g. "Wall Tiling"
- `quote` (textarea)
- `order` (number)

**`certifications`** — About page certifications grid. Currently
these link to PDFs hosted on the old WordPress site
(`ssvpropertygroup.co.uk/wp-content/uploads/...`); migrating them into
Payload's own Media library retires that external dependency instead
of carrying it forward.
- `title` (text)
- `description` (textarea)
- `document` (upload → `media`, PDF)
- `order` (number)

### Media

Payload's built-in `media` upload collection, backed by Vercel Blob.
Holds: site logo, all hero/section background images, project photos,
certification PDFs.

### Globals

**`siteSettings`** — shared between Header and Footer (one logo
upload instead of two).
- `logo` (upload → `media`)
- `header.navLinks` (array: `label` text, `href` text) — currently
  Home/About/Services
- `header.ctaLabel` (text) — "Contact Us"
- `footer.tagline` (text) — "Sustainable Solutions | Visionary Values"
- `footer.description` (textarea)
- `footer.companyNumber` (text)
- `footer.officeAddressLines` (array of text)
- `footer.phone` (text)
- `footer.email` (email)
- `footer.usefulLinks` (array: `label` text, `href` text)
- `footer.developerCredit` (text, optional)

**`homePage`**
- `hero.headingLine1` / `hero.headingLine2Highlighted` (text)
- `hero.subheading` (text)
- `hero.paragraphs` (array of textarea)
- `hero.ctaLabel` (text)
- `hero.backgroundImage` (upload → `media`)
- `statistics` (array: `value` number, `suffix` text, `label` text) —
  3 entries today (30 / 1200+ / 30+)
- `servicesSection.heading` / `.description` / `.ctaLabel` (text) —
  cards themselves come from the `services` collection (first 3 by
  `order`)
- `servicesSection.backgroundImage` (upload → `media`)
- `projectsSection.heading` / `.description` (text) — images from
  `projects` collection
- `testimonialsSection.heading` / `.description` (text) — items from
  `testimonials` collection
- `methodsSection.backgroundImage` (upload → `media`)
- `methodsSection.heading` / `.description` / `.ctaLabel` (text)
- `methodsSection.items` (array: `title` text, `description` text) —
  4 accordion entries today

**`aboutPage`**
- `hero.heading` (text) — "THE SSV DIFFERENCE"
- `hero.subheading` (text)
- `hero.paragraphs` (array of textarea)
- `hero.ctaLabel` (text)
- `hero.backgroundImage` (upload → `media`)
- `hero.philosophyItems` (array: `title` text, `description`
  textarea) — Sustainable / Solutions / Visionary / Values, 4 entries
- `visionMission.heading` / `.description` (text)
- `visionMission.visions` (array: `title` text, `description`
  textarea) — 3 entries
- `visionMission.missions` (array: `title` text, `description`
  textarea) — 3 entries
- `timeline.heading` / `.description` (text)
- `timeline.events` (array: `year` text, `title` text, `description`
  textarea) — 5 entries today
- `timeline.backgroundImage` (upload → `media`)
- `certificationsIntro.heading` / `.description` (text) — cards
  themselves from the `certifications` collection

**`servicesPage`**
- `hero.eyebrow` (text) — "Our Expertise"
- `hero.heading` / `.subheading` (text)
- `hero.description` (textarea)
- `hero.ctaLabel` (text)
- `hero.backgroundImage` (upload → `media`)
- `servicesSection.heading` / `.description` (text) — detailed cards
  from `services` collection (all 4, by `order`)

**`contactPage`**
- `hero.eyebrow` (text) — "Let us talk property"
- `hero.heading` (text)
- `hero.tagline` (text)
- `details.heading` / `.description` (text)
- `details.email` (email)
- `details.phone` (text)
- `details.locationLines` (array of text)
- `details.mapQuery` (text) — e.g. "London, United Kingdom", used to
  build the Google Maps embed URL

## Rendering & revalidation

Classic Next.js caching model (confirmed: `cacheComponents` is off).
Pages render statically by default. Every collection and global gets
an `afterChange` hook that calls `revalidatePath` (or a shared
`revalidateTag` per page) for the page(s) depending on it, via an
internal Route Handler. Publishing a change in `/admin` updates the
live page within seconds — no rebuild, no redeploy.

## Fallback behavior

Every `get<Page>Content()` function wraps its Payload Local API calls
in a try/catch. On failure (DB unreachable, network error, or a
failure during `next build` on Vercel), it returns a `defaults.ts`
module for that page — a plain object holding **today's exact
hardcoded content**, including `/public/*.jpg` image paths. Those
image files stay in the repo (not deleted) specifically to serve as
this fallback source. `page.tsx` always calls the same function and
never branches on success/failure — the fallback is invisible when
Payload is healthy, and complete (text + images) when it isn't.

## Seed data

A one-time seed script (Payload Local API `create`/`updateGlobal`
calls) uploads every current `/public` image into Media and populates
every collection/global with today's exact content, so that on first
deploy Payload's data matches the live site byte-for-byte and the
site's appearance does not change. This seed data is also the source
the `defaults.ts` fallback files are transcribed from, so the two stay
in sync by construction (write the seed script first, generate the
defaults from the same literal values).

## Admin access

Single admin role via Payload's default `users` auth collection,
reachable at `/admin` on the same deployment. No separate hosting, no
role/permission matrix (can be layered in later without restructuring
collections, per Payload's standard access-control pattern).

## Rollout order

1. **Spike**: install Payload in this repo, confirm `withPayload()` +
   admin panel boot cleanly against Next 16.3, before building
   anything else on top of it. This resolves the one open
   compatibility risk first.
2. Scaffold Payload: `payload.config.ts`, `users` collection, Postgres
   adapter, Vercel Blob adapter, admin/API routes. Provision Postgres
   + Blob as new resources on the existing Vercel project; add their
   env vars without touching existing build/deploy config or the
   domain.
3. Define the 4 collections + 5 globals above.
4. Write and run the seed script (content + images, matching today
   exactly).
5. Per page: write `defaults.ts` from the seed literals, wire
   `page.tsx` to fetch-with-fallback, update each section component's
   props signature to accept content instead of owning it — JSX and
   Tailwind classes untouched.
6. Wire `afterChange` hooks → `revalidatePath`/`revalidateTag`.
7. Visually verify each page renders pixel-identical to the current
   live site.
8. Merge to `main` → Vercel deploys through its normal pipeline to the
   existing domain. Confirm `/admin` is reachable and that an edit
   made there propagates to the live page.

## Out of scope

- Redesigning any page's layout, styling, or animations.
- Multi-role/permission admin access (single admin role only, for
  now).
- A separate/standalone Payload deployment (it's embedded in this
  Next app).
- Rewriting the Header's mismatched `/projects` footer link (should
  point to `/services`) — pre-existing bug, unrelated to this
  migration; worth a follow-up but not folded in here.
