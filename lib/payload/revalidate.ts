import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

export const revalidateTagsAfterChange =
  (tags: string[]): CollectionAfterChangeHook | GlobalAfterChangeHook =>
  ({ doc }) => {
    for (const tag of tags) {
      revalidateTag(tag)
    }
    return doc
  }
