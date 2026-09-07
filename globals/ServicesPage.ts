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
        {
          name: 'serviceItems',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            {
              name: 'icon',
              type: 'select',
              required: true,
              options: ['Building2', 'Wrench', 'ClipboardCheck', 'FenceIcon', 'CloudRain'],
            },
          ],
        },
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
