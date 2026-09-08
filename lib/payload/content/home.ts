import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '../getPayloadClient'
import { mapMedia, type MediaContent } from './media'

export type HomePageContent = {
  hero: {
    headingLine1: string
    headingLine2Highlighted: string
    subheading: string
    paragraphs: string[]
    ctaLabel: string
    backgroundImage: MediaContent
  }
  statistics: { value: number; suffix: string; label: string }[]
  servicesSection: {
    heading: string
    description: string
    ctaLabel: string
    backgroundImage: MediaContent
  }
  projectsSection: {
    heading: string
    description: string
  }
  testimonialsSection: {
    heading: string
    description: string
  }
  methodsSection: {
    backgroundImage: MediaContent
    heading: string
    description: string
    ctaLabel: string
    itemsHeading: string
    items: { title: string; description: string }[]
  }
}

const homePageDefaults: HomePageContent = {
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
    backgroundImage: { url: '/home-hero-background.jpg', alt: '' },
  },
  statistics: [
    { value: 30, suffix: '', label: 'Years of Sustainable Success' },
    { value: 1200, suffix: '+', label: 'Successful Projects Completed' },
    { value: 30, suffix: '+', label: 'Years of Experience' },
  ],
  servicesSection: {
    heading: 'Services We Excel In.',
    description:
      'We excel in property renovation, refurbishment, reinstatement, and maintenance, delivering quality workmanship and reliable results.',
    ctaLabel: 'VIEW MORE',
    backgroundImage: { url: '/services-background.jpg', alt: '' },
  },
  projectsSection: {
    heading: 'Some Projects We are Proud Of.',
    description:
      'Explore some of our completed projects, showcasing quality workmanship, attention to detail, and exceptional results.',
  },
  testimonialsSection: {
    heading: 'What Our Clients Say?',
    description:
      'Trusted by property owners, managers, and businesses for professional property services and quality workmanship.',
  },
  methodsSection: {
    backgroundImage: { url: '/methods-background.jpg', alt: '' },
    heading: 'Sustainable Solutions | Visionary Values',
    description:
      'We are ready to discuss your project and provide reliable, professional property services tailored to your needs.',
    ctaLabel: 'Contact Us',
    itemsHeading: 'OPTIMAL METHODS WE ACCOMPLISH.',
    items: [
      { title: 'Extensive Experience', description: 'Over 30+ years expertise and sustainable success.' },
      {
        title: 'Qualified Team',
        description: 'A dedicated team that delivers exceptional results on every project.',
      },
      {
        title: 'Superior Quality',
        description: 'We offer expert workmanship, premium materials, and meticulous attention to detail.',
      },
      {
        title: 'Reliable & Committed',
        description: 'Our commitment to delivering dependable services, consistent quality, and trust.',
      },
    ],
  },
}

async function fetchHomePageContent(): Promise<HomePageContent> {
  const payload = await getPayloadClient()
  const doc = await payload.findGlobal({ slug: 'homePage' })
  const hero = doc.hero as Record<string, unknown>
  const servicesSection = doc.servicesSection as Record<string, unknown>
  const projectsSection = doc.projectsSection as Record<string, unknown>
  const testimonialsSection = doc.testimonialsSection as Record<string, unknown>
  const methodsSection = doc.methodsSection as Record<string, unknown>

  return {
    hero: {
      headingLine1: hero.headingLine1 as string,
      headingLine2Highlighted: hero.headingLine2Highlighted as string,
      subheading: hero.subheading as string,
      paragraphs: (hero.paragraphs as { text: string }[]).map((entry) => entry.text),
      ctaLabel: hero.ctaLabel as string,
      backgroundImage: mapMedia(hero.backgroundImage),
    },
    statistics: (doc.statistics as { value: number; suffix?: string; label: string }[]).map((entry) => ({
      value: entry.value,
      suffix: entry.suffix || '',
      label: entry.label,
    })),
    servicesSection: {
      heading: servicesSection.heading as string,
      description: servicesSection.description as string,
      ctaLabel: servicesSection.ctaLabel as string,
      backgroundImage: mapMedia(servicesSection.backgroundImage),
    },
    projectsSection: {
      heading: projectsSection.heading as string,
      description: projectsSection.description as string,
    },
    testimonialsSection: {
      heading: testimonialsSection.heading as string,
      description: testimonialsSection.description as string,
    },
    methodsSection: {
      backgroundImage: mapMedia(methodsSection.backgroundImage),
      heading: methodsSection.heading as string,
      description: methodsSection.description as string,
      ctaLabel: methodsSection.ctaLabel as string,
      itemsHeading: methodsSection.itemsHeading as string,
      items: (methodsSection.items as { title: string; description: string }[]).map((entry) => ({
        title: entry.title,
        description: entry.description,
      })),
    },
  }
}

export async function getHomePageContent(): Promise<HomePageContent> {
  try {
    const cached = unstable_cache(fetchHomePageContent, ['home-page-content'], { tags: ['home'] })
    return await cached()
  } catch (error) {
    console.error('[getHomePageContent] failed:', error)
    return homePageDefaults
  }
}
