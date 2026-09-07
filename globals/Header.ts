import type { GlobalConfig } from 'payload'
import { revalidateTagsAfterChange } from '../lib/payload/revalidate'

export const Header: GlobalConfig = {
  slug: 'header',
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'navLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    { name: 'ctaLabel', type: 'text', required: true, defaultValue: 'Contact Us' },
  ],
  hooks: {
    afterChange: [revalidateTagsAfterChange(['layout'])],
  },
}
