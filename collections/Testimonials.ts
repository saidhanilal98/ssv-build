import type { CollectionConfig } from 'payload'
import { revalidateTagsAfterChange } from '../lib/payload/revalidate'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'citation',
    defaultColumns: ['citation', '_status', 'order'],
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [revalidateTagsAfterChange(['testimonials'])],
  },
  fields: [
    { name: 'citation', type: 'text', required: true },
    { name: 'quote', type: 'textarea', required: true },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
