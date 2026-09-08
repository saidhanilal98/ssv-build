import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '../getPayloadClient'
import { mapMedia, type MediaContent } from './media'

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

const footerDefaults: FooterContent = {
  logo: { url: '/ssv-logo.webp', alt: 'SSV Property Group' },
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
    { label: 'Services', href: '/projects' },
    { label: 'Contact Us', href: '/contact' },
  ],
  developerCredit: 'Carbron Coders',
}

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
