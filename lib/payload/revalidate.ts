import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

export const revalidateTagsAfterChange = (tags: string[]) =>
  (({ doc }: { doc: unknown }) => {
    for (const tag of tags) {
      revalidateTag(tag, 'max')
    }
    return doc
  }) as CollectionAfterChangeHook & GlobalAfterChangeHook
