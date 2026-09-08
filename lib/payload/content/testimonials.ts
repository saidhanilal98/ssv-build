import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '../getPayloadClient'

export type TestimonialItem = {
  citation: string
  quote: string
}

async function fetchTestimonials(): Promise<TestimonialItem[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'testimonials',
    where: { _status: { equals: 'published' } },
    sort: 'order',
    limit: 100,
  })

  return docs.map((doc) => ({
    citation: doc.citation,
    quote: doc.quote,
  }))
}

export async function getTestimonials(): Promise<TestimonialItem[]> {
  try {
    const cached = unstable_cache(fetchTestimonials, ['testimonials-list'], { tags: ['testimonials'] })
    return await cached()
  } catch (error) {
    console.error('[getTestimonials] failed:', error)
    return []
  }
}
