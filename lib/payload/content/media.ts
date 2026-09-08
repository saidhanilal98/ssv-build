export type MediaContent = {
  url: string
  alt: string
}

export function mapMedia(media: unknown): MediaContent {
  const doc = media as Record<string, unknown>
  return {
    url: (doc.url as string) || '',
    alt: (doc.alt as string) || '',
  }
}
