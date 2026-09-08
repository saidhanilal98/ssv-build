import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '../getPayloadClient'

export type ContactPageContent = {
  hero: {
    eyebrow: string
    headingLine1: string
    headingLine2Highlighted: string
    tagline: string
  }
  details: {
    headingLine1: string
    headingLine2Highlighted: string
    description: string
    email: string
    phone: string
    locationLines: string[]
    mapQuery: string
  }
}

const contactPageDefaults: ContactPageContent = {
  hero: {
    eyebrow: 'Let us talk property',
    headingLine1: 'CONTACT',
    headingLine2Highlighted: 'US.',
    tagline: 'Property advice and services when you need it.',
  },
  details: {
    headingLine1: 'Get In',
    headingLine2Highlighted: 'Touch.',
    description:
      'Have a property that needs attention? Get in touch with our team and let us know how we can assist.',
    email: 'geet.ssvpropertygroup@gmail.com',
    phone: '+44 7918 351115',
    locationLines: ['Milton Keynes', 'London, United Kingdom'],
    mapQuery: 'Milton Keynes, United Kingdom',
  },
}

async function fetchContactPageContent(): Promise<ContactPageContent> {
  const payload = await getPayloadClient()
  const doc = await payload.findGlobal({ slug: 'contactPage' })
  const hero = doc.hero as Record<string, unknown>
  const details = doc.details as Record<string, unknown>

  return {
    hero: {
      eyebrow: hero.eyebrow as string,
      headingLine1: hero.headingLine1 as string,
      headingLine2Highlighted: hero.headingLine2Highlighted as string,
      tagline: hero.tagline as string,
    },
    details: {
      headingLine1: details.headingLine1 as string,
      headingLine2Highlighted: details.headingLine2Highlighted as string,
      description: details.description as string,
      email: details.email as string,
      phone: details.phone as string,
      locationLines: (details.locationLines as { line: string }[]).map((entry) => entry.line),
      mapQuery: details.mapQuery as string,
    },
  }
}

export async function getContactPageContent(): Promise<ContactPageContent> {
  try {
    const cached = unstable_cache(fetchContactPageContent, ['contact-page-content'], { tags: ['contact'] })
    return await cached()
  } catch {
    return contactPageDefaults
  }
}
