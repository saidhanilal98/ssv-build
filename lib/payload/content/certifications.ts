import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '../getPayloadClient'

export type CertificationItem = {
  title: string
  description: string
  documentUrl: string | null
}

async function fetchCertifications(): Promise<CertificationItem[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'certifications',
    where: { _status: { equals: 'published' } },
    sort: 'order',
    limit: 100,
  })

  return docs.map((doc) => ({
    title: doc.title,
    description: doc.description,
    documentUrl: doc.document && typeof doc.document === 'object' ? (doc.document.url as string) || null : null,
  }))
}

export async function getCertifications(): Promise<CertificationItem[]> {
  try {
    const cached = unstable_cache(fetchCertifications, ['certifications-list'], { tags: ['certifications'] })
    return await cached()
  } catch {
    return []
  }
}
