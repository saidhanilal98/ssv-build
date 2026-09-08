import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '../getPayloadClient'

export type ServiceItem = {
  title: string
  icon: string
  shortDescription: string
  description: string
  features: string[]
  showOnHomePage: boolean
}

async function fetchServices(): Promise<ServiceItem[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    where: { _status: { equals: 'published' } },
    sort: 'order',
    limit: 100,
  })

  return docs.map((doc) => ({
    title: doc.title,
    icon: doc.icon,
    shortDescription: doc.shortDescription,
    description: doc.description,
    features: (doc.features || []).map((entry) => entry.text),
    showOnHomePage: doc.showOnHomePage ?? true,
  }))
}

export async function getServices(): Promise<ServiceItem[]> {
  try {
    const cached = unstable_cache(fetchServices, ['services-list'], { tags: ['services'] })
    return await cached()
  } catch {
    return []
  }
}
