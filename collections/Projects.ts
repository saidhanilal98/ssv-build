import type { CollectionConfig } from 'payload'
import { revalidateTagsAfterChange } from '../lib/payload/revalidate'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', '_status', 'order'],
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [revalidateTagsAfterChange(['projects'])],
  },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
