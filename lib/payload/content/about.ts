import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '../getPayloadClient'
import { mapMedia, type MediaContent } from './media'

export type AboutPageContent = {
  hero: {
    heading: string
    subheading: string
    paragraphs: string[]
    ctaLabel: string
    backgroundImage: MediaContent
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
    backgroundImage: MediaContent
    events: { year: string; title: string; description: string }[]
  }
  certificationsIntro: {
    heading: string
    description: string
  }
}

const aboutPageDefaults: AboutPageContent = {
  hero: {
    heading: 'THE SSV DIFFERENCE.',
    subheading: 'Property solutions built on trust, quality and vision.',
    paragraphs: [
      'At SSV Property Group Ltd, we do not just manage and maintain properties, we build relationships and protect investments. Founded as a family business, our core philosophy is simple: treat every property as if it were our own and every client as part of our family. Our story began not in a large corporate boardroom, but within our own community.',
      "We saw a need for property services that combined professional expertise with a personal touch where your call is answered by a person who knows your name and your property's history. That vision became the foundation of SSV Property Group.",
      "Today, we remain a family-owned and operated business. This means the values we started with are the values we operate by every day: integrity, reliability, and a relentless commitment to quality. For us, it's not just about completing a job, it's about building a legacy of trust, one satisfied client at a time.",
    ],
    ctaLabel: 'JOIN THE DIFFERENCE',
    backgroundImage: { url: '/about-hero.jpg', alt: '' },
    philosophyItems: [
      {
        title: 'Sustainable',
        description:
          'We focus on long-term solutions that protect property value and create lasting benefits for our clients.',
      },
      {
        title: 'Solutions',
        description: 'Every property is different. We provide practical, professional solutions built around your needs.',
      },
      {
        title: 'Visionary',
        description:
          'We look beyond today, combining experience and forward-thinking ideas to shape better outcomes.',
      },
      {
        title: 'Values',
        description:
          'Integrity, reliability, care and quality guide every decision we make and every relationship we build.',
      },
    ],
  },
  visionMission: {
    heading: 'OUR DIRECTION',
    description:
      'Guided by sustainable thinking and visionary values, we strive to create meaningful places, opportunities and long-term impact.',
    visions: [
      {
        title: 'Proactive Care Over Reactive Repairs',
        description:
          'To pioneer a new standard of predictive and planned maintenance by providing a safe environment for tenants, and delivers true peace of mind.',
      },
      {
        title: 'The Return of the Human Touch',
        description:
          'To be the trusted, local partner that our clients and communities can rely on. We are building a network of trust across the UK one relationship at a time.',
      },
      {
        title: 'Raising the Standard, Together',
        description:
          'To set a new, uncompromising benchmark for quality and integrity in everything we do. We aim to inspire a "race to the top" in the UK with excellence and loyalty.',
      },
    ],
    missions: [
      {
        title: 'Standards',
        description:
          'By upholding the highest standards of safety and craftsmanship. Whether handling small repairs or full-scale property care, we treat every home as if it were our own.',
      },
      {
        title: 'Trust',
        description:
          'Prioritizing trust, transparency, and communication. Our family-run approach means every client receives hands-on support, consistent care, and a reliable point of contact who truly understands their needs.',
      },
      {
        title: 'Deliver',
        description:
          'To deliver dependable, high-quality property care that puts people first. We are committed to supporting landlords, protecting investments, and creating safe, comfortable homes for tenants through a blend of proactive maintenance, personalized service, and family-driven values.',
      },
    ],
  },
  timeline: {
    heading: 'OUR TIMELINE',
    description:
      'From our beginnings in construction to our vision for the future of property development, our journey has been shaped by experience, evolution and a commitment to creating lasting value.',
    backgroundImage: { url: '/timeline-background.jpg', alt: '' },
    events: [
      {
        year: '2023',
        title: 'The Birth of SSV Property Group Ltd',
        description:
          'SSV Property Group Ltd was officially named and established to continue and modernize the family legacy in South Africa. The new brand united decades of expertise under one forward-thinking company, offering a proactive, structured, and high-standard approach to property services.',
      },
      {
        year: '2023 (Continued)',
        title: 'Entering the UK Market',
        description:
          'Driven by a vision to bring our unique, generationally refined solution to the UK, we expanded our services to the British market. Here, we combined our proven methods from back home with a deep understanding of UK property standards, regulations, and client expectations.',
      },
      {
        year: '2024',
        title: 'Local Expertise Meets Generational Skill',
        description:
          'With our UK base established, SSV began serving local landlords, homeowners, and tenents, offering the perfect blend. Years of perfected experience and the focused dedication of a local UK team.',
      },
      {
        year: '2025',
        title: 'Continued Expansion & Proactive Property Care',
        description:
          'We continue refining our proactive property care model, building strong partnerships, and expanding our footprint across the UK all while staying true to the values built over four generations.',
      },
      {
        year: 'Today',
        title: 'Building The Future',
        description:
          'SSV continues to build on generations of experience while looking toward the future through sustainable solutions, visionary values and meaningful development.',
      },
    ],
  },
  certificationsIntro: {
    heading: 'CERTIFICATIONS',
    description:
      'Our certifications and supporting documentation reflect our commitment to professional standards, safety, social responsibility and protecting the interests of our clients.',
  },
}

async function fetchAboutPageContent(): Promise<AboutPageContent> {
  const payload = await getPayloadClient()
  const doc = await payload.findGlobal({ slug: 'aboutPage' })
  const hero = doc.hero as Record<string, unknown>
  const visionMission = doc.visionMission as Record<string, unknown>
  const timeline = doc.timeline as Record<string, unknown>
  const certificationsIntro = doc.certificationsIntro as Record<string, unknown>

  return {
    hero: {
      heading: hero.heading as string,
      subheading: hero.subheading as string,
      paragraphs: (hero.paragraphs as { text: string }[]).map((entry) => entry.text),
      ctaLabel: hero.ctaLabel as string,
      backgroundImage: mapMedia(hero.backgroundImage),
      philosophyItems: (hero.philosophyItems as { title: string; description: string }[]).map((entry) => ({
        title: entry.title,
        description: entry.description,
      })),
    },
    visionMission: {
      heading: visionMission.heading as string,
      description: visionMission.description as string,
      visions: (visionMission.visions as { title: string; description: string }[]).map((entry) => ({
        title: entry.title,
        description: entry.description,
      })),
      missions: (visionMission.missions as { title: string; description: string }[]).map((entry) => ({
        title: entry.title,
        description: entry.description,
      })),
    },
    timeline: {
      heading: timeline.heading as string,
      description: timeline.description as string,
      backgroundImage: mapMedia(timeline.backgroundImage),
      events: (timeline.events as { year: string; title: string; description: string }[]).map((entry) => ({
        year: entry.year,
        title: entry.title,
        description: entry.description,
      })),
    },
    certificationsIntro: {
      heading: certificationsIntro.heading as string,
      description: certificationsIntro.description as string,
    },
  }
}

export async function getAboutPageContent(): Promise<AboutPageContent> {
  try {
    const cached = unstable_cache(fetchAboutPageContent, ['about-page-content'], { tags: ['about'] })
    return await cached()
  } catch (error) {
    console.error('[getAboutPageContent] failed:', error)
    return aboutPageDefaults
  }
}
