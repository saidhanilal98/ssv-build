import type { GlobalConfig } from 'payload'
import { revalidateTagsAfterChange } from '../lib/payload/revalidate'

export const ContactPage: GlobalConfig = {
  slug: 'contactPage',
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', required: true },
        { name: 'heading', type: 'text', required: true },
        { name: 'tagline', type: 'text', required: true },
      ],
    },
    {
      name: 'details',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text', required: true },
        {
          name: 'locationLines',
          type: 'array',
          fields: [{ name: 'line', type: 'text', required: true }],
        },
        { name: 'mapQuery', type: 'text', required: true },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateTagsAfterChange(['contact'])],
  },
}
