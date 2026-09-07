import type { GlobalConfig } from 'payload'
import { revalidateTagsAfterChange } from '../lib/payload/revalidate'

export const ServicesPage: GlobalConfig = {
  slug: 'servicesPage',
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', required: true },
        { name: 'heading', type: 'text', required: true },
        { name: 'subheading', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'ctaLabel', type: 'text', required: true },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'servicesSection',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateTagsAfterChange(['services-page'])],
  },
}
