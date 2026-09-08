import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '../getPayloadClient'
import { mapMedia, type MediaContent } from './media'

export type ServicesPageContent = {
  hero: {
    eyebrow: string
    heading: string
    subheading: string
    description: string
    ctaLabel: string
    backgroundImage: MediaContent
    serviceItems: { label: string; icon: string }[]
  }
  servicesSection: {
    heading: string
    description: string
  }
}

const servicesPageDefaults: ServicesPageContent = {
  hero: {
    eyebrow: 'Our Expertise',
    heading: 'WE ARE AT YOUR SERVICE.',
    subheading: 'Property management with a difference.',
    description:
      'We manage properties with care, professionalism and a long-term vision. Our approach combines reliable service with practical solutions that protect your property and your investment.',
    ctaLabel: 'GET IN TOUCH',
    backgroundImage: { url: '/services-hero.jpg', alt: '' },
    serviceItems: [
      { label: 'Property Maintenance', icon: 'Building2' },
      { label: 'Inspections', icon: 'FenceIcon' },
      { label: 'Damage Mitigation', icon: 'CloudRain' },
      { label: 'Reinstatement', icon: 'ClipboardCheck' },
    ],
  },
  servicesSection: {
    heading: 'PROPERTY MANAGEMENT SERVICES',
    description:
      'Professional property management solutions designed to protect your investment, maintain your property and deliver lasting value.',
  },
}

async function fetchServicesPageContent(): Promise<ServicesPageContent> {
  const payload = await getPayloadClient()
  const doc = await payload.findGlobal({ slug: 'servicesPage' })
  const hero = doc.hero as Record<string, unknown>
  const servicesSection = doc.servicesSection as Record<string, unknown>

  return {
    hero: {
      eyebrow: hero.eyebrow as string,
      heading: hero.heading as string,
      subheading: hero.subheading as string,
      description: hero.description as string,
      ctaLabel: hero.ctaLabel as string,
      backgroundImage: mapMedia(hero.backgroundImage),
      serviceItems: (hero.serviceItems as { label: string; icon: string }[]).map((entry) => ({
        label: entry.label,
        icon: entry.icon,
      })),
    },
    servicesSection: {
      heading: servicesSection.heading as string,
      description: servicesSection.description as string,
    },
  }
}

export async function getServicesPageContent(): Promise<ServicesPageContent> {
  try {
    const cached = unstable_cache(fetchServicesPageContent, ['services-page-content'], { tags: ['services-page'] })
    return await cached()
  } catch {
    return servicesPageDefaults
  }
}
