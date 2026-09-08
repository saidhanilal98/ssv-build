import type { CollectionConfig } from 'payload'
import { revalidateTagsAfterChange } from '../lib/payload/revalidate'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', '_status', 'order'],
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [revalidateTagsAfterChange(['services'])],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'icon',
      type: 'select',
      required: true,
      options: ['Building2', 'Wrench', 'ClipboardCheck', 'FenceIcon', 'CloudRain'],
    },
    { name: 'shortDescription', type: 'textarea', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'features', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    {
      name: 'showOnHomePage',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Show this service in the services section on the home page.',
      },
    },
  ],
}
