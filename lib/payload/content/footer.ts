import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '../getPayloadClient'
import { mapMedia, type MediaContent } from './media'
import { footerDefaults } from './defaults'

export type FooterContent = {
  logo: MediaContent
  tagline: string
  description: string
  companyNumber: string
  officeAddressLines: string[]
  phone: string
  email: string
  usefulLinks: { label: string; href: string }[]
  developerCredit: string
}

export { footerDefaults }

async function fetchFooterContent(): Promise<FooterContent> {
  const payload = await getPayloadClient()
  const doc = await payload.findGlobal({ slug: 'footer' })

  return {
    logo: mapMedia(doc.logo),
    tagline: doc.tagline as string,
    description: doc.description as string,
    companyNumber: (doc.companyNumber as string) || '',
    officeAddressLines: (doc.officeAddressLines as { line: string }[]).map((entry) => entry.line),
    phone: doc.phone as string,
    email: doc.email as string,
    usefulLinks: (doc.usefulLinks as { label: string; href: string }[]).map((entry) => ({
      label: entry.label,
      href: entry.href,
    })),
    developerCredit: (doc.developerCredit as string) || '',
  }
}

export async function getFooterContent(): Promise<FooterContent> {
  try {
    const cached = unstable_cache(fetchFooterContent, ['footer-content'], { tags: ['layout'] })
    return await cached()
  } catch (error) {
    console.error('[getFooterContent] failed:', error)
    return footerDefaults
  }
}
