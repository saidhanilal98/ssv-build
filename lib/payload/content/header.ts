import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '../getPayloadClient'
import { mapMedia, type MediaContent } from './media'
import { headerDefaults } from './defaults'

export type HeaderContent = {
  logo: MediaContent
  navLinks: { label: string; href: string }[]
  ctaLabel: string
}

export { headerDefaults }

async function fetchHeaderContent(): Promise<HeaderContent> {
  const payload = await getPayloadClient()
  const doc = await payload.findGlobal({ slug: 'header' })

  return {
    logo: mapMedia(doc.logo),
    navLinks: (doc.navLinks as { label: string; href: string }[]).map((entry) => ({
      label: entry.label,
      href: entry.href,
    })),
    ctaLabel: doc.ctaLabel as string,
  }
}

export async function getHeaderContent(): Promise<HeaderContent> {
  try {
    const cached = unstable_cache(fetchHeaderContent, ['header-content'], { tags: ['layout'] })
    return await cached()
  } catch (error) {
    console.error('[getHeaderContent] failed:', error)
    return headerDefaults
  }
}
