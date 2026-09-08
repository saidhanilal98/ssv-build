import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '../getPayloadClient'
import { mapMedia, type MediaContent } from './media'

export type ProjectItem = {
  title: string
  image: MediaContent
}

async function fetchProjects(): Promise<ProjectItem[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    where: { _status: { equals: 'published' } },
    sort: 'order',
    limit: 100,
  })

  return docs.map((doc) => ({
    title: doc.title || '',
    image: mapMedia(doc.image),
  }))
}

export async function getProjects(): Promise<ProjectItem[]> {
  try {
    const cached = unstable_cache(fetchProjects, ['projects-list'], { tags: ['projects'] })
    return await cached()
  } catch {
    return []
  }
}
