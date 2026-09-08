import fs from 'fs'
import path from 'path'
import { getPayloadClient } from '../../../../lib/payload/getPayloadClient'

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

async function uploadImage(payload: Awaited<ReturnType<typeof getPayloadClient>>, publicPath: string, alt: string) {
  const filePath = path.join(process.cwd(), 'public', publicPath)
  const data = fs.readFileSync(filePath)
  const ext = path.extname(publicPath).toLowerCase()
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data,
      mimetype: MIME_TYPES[ext] || 'application/octet-stream',
      name: path.basename(publicPath),
      size: data.length,
    },
  })
  return doc.id
}

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'Seed route is disabled in production' }, { status: 403 })
  }

  const payload = await getPayloadClient()

  await (payload.db as unknown as { pool: { query: (sql: string) => Promise<unknown> } }).pool.query(
    'TRUNCATE TABLE services, projects, testimonials, certifications, media, _services_v, _projects_v, _testimonials_v, _certifications_v RESTART IDENTITY CASCADE',
  )

  const logo = await uploadImage(payload, 'ssv-logo.webp', 'SSV Property Group logo')
  const homeHero = await uploadImage(payload, 'home-hero-background.jpg', 'Home hero background')
  const servicesBg = await uploadImage(payload, 'services-background.jpg', 'Services section background')
  const methodsBg = await uploadImage(payload, 'methods-background.jpg', 'Methods section background')
  const aboutHero = await uploadImage(payload, 'about-hero.jpg', 'About hero background')
  const timelineBg = await uploadImage(payload, 'timeline-background.jpg', 'Timeline background')
  const servicesHero = await uploadImage(payload, 'services-hero.jpg', 'Services page hero background')
  const project1 = await uploadImage(payload, 'projects/ssv-project-1.png', 'Project photo 1')
  const project2 = await uploadImage(payload, 'projects/ssv-project-2.png', 'Project photo 2')
  const project3 = await uploadImage(payload, 'projects/ssv-project-3.png', 'Project photo 3')
  const project4 = await uploadImage(payload, 'projects/ssv-project-4.png', 'Project photo 4')

  await payload.updateGlobal({
    slug: 'header',
    data: {
      logo,
      navLinks: [
        { label: 'Home', href: '/' },
        { label: 'About Us', href: '/about' },
        { label: 'Services', href: '/services' },
      ],
      ctaLabel: 'Contact Us',
    },
  })

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      logo,
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
        { label: 'Services', href: '/projects' },
        { label: 'Contact Us', href: '/contact' },
      ],
      developerCredit: 'Carbron Coders',
    },
  })

  await payload.updateGlobal({
    slug: 'homePage',
    data: {
      hero: {
        headingLine1: 'YOUR VISION.',
        headingLine2Highlighted: 'EXPERTLY BUILT.',
        subheading: 'Sustainable Solutions | Visionary Values',
        paragraphs: [
          {
            text: 'At SSV Property Group Ltd, we do more than manage and maintain properties. We build strong client relationships and protect long-term investments.',
          },
          {
            text: "Guided by integrity, reliability, and attention to detail, we treat every property with the highest level of care. Our team delivers professional, responsive service with a personal touch, ensuring your property is maintained to the highest standards and your peace of mind always comes first.",
          },
          {
            text: 'Begin your project with confidence. Our team supports you throughout the entire journey, allowing you to enjoy a stress-free experience while we expertly manage and deliver your desired project.',
          },
        ],
        ctaLabel: 'GET STARTED',
        backgroundImage: homeHero,
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
        backgroundImage: servicesBg,
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
        backgroundImage: methodsBg,
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
    },
  })

  await payload.updateGlobal({
    slug: 'aboutPage',
    data: {
      hero: {
        heading: 'THE SSV DIFFERENCE.',
        subheading: 'Property solutions built on trust, quality and vision.',
        paragraphs: [
          {
            text: 'At SSV Property Group Ltd, we do not just manage and maintain properties, we build relationships and protect investments. Founded as a family business, our core philosophy is simple: treat every property as if it were our own and every client as part of our family. Our story began not in a large corporate boardroom, but within our own community.',
          },
          {
            text: "We saw a need for property services that combined professional expertise with a personal touch where your call is answered by a person who knows your name and your property's history. That vision became the foundation of SSV Property Group.",
          },
          {
            text: "Today, we remain a family-owned and operated business. This means the values we started with are the values we operate by every day: integrity, reliability, and a relentless commitment to quality. For us, it's not just about completing a job, it's about building a legacy of trust, one satisfied client at a time.",
          },
        ],
        ctaLabel: 'JOIN THE DIFFERENCE',
        backgroundImage: aboutHero,
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
        backgroundImage: timelineBg,
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
    },
  })

  await payload.updateGlobal({
    slug: 'servicesPage',
    data: {
      hero: {
        eyebrow: 'Our Expertise',
        heading: 'WE ARE AT YOUR SERVICE.',
        subheading: 'Property management with a difference.',
        description:
          'We manage properties with care, professionalism and a long-term vision. Our approach combines reliable service with practical solutions that protect your property and your investment.',
        ctaLabel: 'GET IN TOUCH',
        backgroundImage: servicesHero,
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
    },
  })

  await payload.updateGlobal({
    slug: 'contactPage',
    data: {
      hero: {
        eyebrow: 'Let us talk property',
        headingLine1: 'CONTACT',
        headingLine2Highlighted: 'US.',
        tagline: 'Property advice and services when you need it.',
      },
      details: {
        headingLine1: 'Get In',
        headingLine2Highlighted: 'Touch.',
        description: 'Have a property that needs attention? Get in touch with our team and let us know how we can assist.',
        email: 'geet.ssvpropertygroup@gmail.com',
        phone: '+44 7918 351115',
        locationLines: [{ line: 'Milton Keynes' }, { line: 'London, United Kingdom' }],
        mapQuery: 'Milton Keynes, United Kingdom',
      },
    },
  })

  await payload.create({
    collection: 'services',
    data: {
      _status: 'published',
      title: 'Property Maintenance & Preventative Care',
      icon: 'Building2',
      shortDescription:
        'Planned and reactive maintenance to keep properties safe, functional, and well maintained.',
      description:
        'Ongoing maintenance is paramount to responsible property ownership and plays an important role in reducing the risk of damage and deterioration. We offer planned and reactive property maintenance services to help keep buildings in good condition, address issues early, and reduce the likelihood of preventable problems escalating.',
      features: [
        { text: 'General property repairs and upkeep.' },
        { text: 'Identification and rectification of minor defects.' },
        { text: 'Preventative works to reduce water ingress and deterioration.' },
        { text: 'Ongoing maintenance support for landlords and property owners.' },
        { text: 'Records of maintenance and repair works carried out.' },
      ],
      order: 1,
    },
  })

  await payload.create({
    collection: 'services',
    data: {
      _status: 'published',
      title: 'Damage Mitigation & Protective Measures',
      icon: 'FenceIcon',
      shortDescription:
        'Prompt damage mitigation to limit further damage, protect your property, and reduce costly repairs.',
      description:
        'Early intervention can significantly reduce the extent and cost of property damage. We provide damage mitigation services to prevent minor issues from becoming major repairs. Where appropriate, we can attend site promptly to assess the situation and carry out practical measures to limit further damage and protect the property.',
      features: [
        { text: 'Making the property safe following an incident.' },
        { text: 'Temporary isolation and protection works.' },
        { text: 'Moisture control and drying measures.' },
        { text: 'Removal of affected materials where necessary.' },
        { text: 'Preventative actions to stop further deterioration.' },
      ],
      order: 2,
    },
  })

  await payload.create({
    collection: 'services',
    data: {
      _status: 'published',
      title: 'Property Claims & Resultant Damage Reinstatement',
      icon: 'CloudRain',
      shortDescription:
        'Professional damage assessment and reinstatement services to accurately identify, report, and restore property damage.',
      description:
        'We provide a professional damage assessment and reinstatement service. Our role is to support the claims process by accurately assessing damage, preparing repair reports and quotations, and delivering reinstatement works. We work collaboratively with insurers and appointed loss adjusters to ensure all resultant damage is properly identified and addressed.',
      features: [
        { text: 'Assessing and documenting resultant damage.' },
        { text: 'Preparing detailed repair reports and scopes of works.' },
        { text: 'Providing clear and transparent repair quotations.' },
        { text: 'Liaising with appointed loss adjusters where required.' },
        { text: 'Managing and completing reinstatement works.' },
      ],
      order: 3,
    },
  })

  await payload.create({
    collection: 'services',
    data: {
      _status: 'published',
      title: 'Maintenance Insurance Claims & Inspections',
      icon: 'ClipboardCheck',
      shortDescription:
        'Property management focused on inspections, maintenance, safety, and keeping your property in excellent condition.',
      description:
        'We provide hands-on property management focused on maintenance, inspections, and ensuring your property remains safe, compliant, and well maintained at all times. Our services do not include rent collection or tenant financial management. We specialize in physical care of your property, managing inspections and overseeing maintenance works professionally.',
      features: [
        { text: 'We carry out regular property inspections, routine maintenance, and urgent repairs.' },
        {
          text: 'Identifying issues early and resolving them quickly to protect your property and reduce long-term costs.',
        },
        { text: "We offer flexible monthly maintenance packages tailored to your property's needs." },
        { text: 'Providing clear and transparent repair quotations.' },
        {
          text: 'These include regular inspections, preventative maintenance, and prompt repairs, helping identify issues early, reduce unexpected costs, and protect your investment.',
        },
      ],
      order: 4,
      showOnHomePage: false,
    },
  })

  const projectImages = [project1, project2, project3, project4]
  for (let i = 0; i < projectImages.length; i++) {
    await payload.create({
      collection: 'projects',
      data: { _status: 'published', title: `Project ${i + 1}`, image: projectImages[i], order: i + 1 },
    })
  }

  const testimonials = [
    {
      citation: 'Wall Tiling',
      quote:
        "Robert was an absolute hero. Over the course of 2 intense and long days, he blitzed through a long list of jobs needing doing, all very quickly, cleanly and to a high standard. I'm very pleased with the result and would thoroughly recommend SSV for tiling, carpentry, decorating and other works. Pragmatic, great value and a lovely guy as well!",
    },
    {
      citation: 'Internal Painting',
      quote:
        'Good work, clean and quiet! Robert was very professional and quickly got on with the painting work we had hired him for, causing minimal disruption. He was on time, stuck to the quote and did not leave any mess. Even wore shoe covers, which is always appreciated! Would not hesitate to recommend/use again!',
    },
    {
      citation: 'Painting & Minor Repairs',
      quote:
        "Robert was professional from the day I met him and he offered me a fair price for the decorating work as well as completing it on time. I was so impressed with his work that I have asked him to do my laminate flooring as well as I wasn't disappointed! His general knowledge about building work is great and I felt I could trust him. Finally, the administrative system of things like invoicing setup is accurate and timely. Will be using SSV Property Group again.",
    },
    {
      citation: 'Bathroom Wall Tiling',
      quote:
        'Robert did a great job with repairing our bathroom, including retiling, grouting, sealing and repairing some damp and water damage to the ceilings. He was quick, efficient, tidy, friendly and professional! Would definitely work with SSV again!',
    },
    {
      citation: 'Internal Painting',
      quote:
        "Robert was brilliant, I would highly recommend! He worked tirelessly on my walls and ceiling to ensure they were completely covered, it wasn't an easy job but he wouldn't leave without it looking great. He was super helpful when discussing paint suggestions and very professional and friendly, both in communications and in person!",
    },
    {
      citation: 'Renovation Upgrades',
      quote:
        'The decorator was very professional, came across like he knew what he was doing, carried out the work to a high standard, was friendly, communicative and was a great price for the work done. It was a pleasant experience and I would trust them to return for future jobs.',
    },
  ]
  for (let i = 0; i < testimonials.length; i++) {
    await payload.create({
      collection: 'testimonials',
      data: { _status: 'published', ...testimonials[i], order: i + 1 },
    })
  }

  const certifications = [
    {
      title: 'Bronze Membership Certificate',
      description:
        'Our Bronze Membership Certificate demonstrates our commitment to professional standards and continued development.',
    },
    {
      title: 'Health & Safety Certificate',
      description:
        'Recognition of our commitment to maintaining strong health and safety standards across our operations.',
    },
    {
      title: 'Social Value Certificate',
      description:
        'Reflecting our commitment to creating positive social impact and delivering value within the communities we serve.',
    },
    {
      title: 'Liability Insurance Policy',
      description:
        'Confirmation of our professional insurance coverage and commitment to protecting our clients and projects.',
    },
  ]
  for (let i = 0; i < certifications.length; i++) {
    await payload.create({
      collection: 'certifications',
      data: { _status: 'published', ...certifications[i], order: i + 1 },
    })
  }

  return Response.json({ ok: true, message: 'Seed complete' })
}
