import type { GlobalConfig } from 'payload'
import { revalidateTagsAfterChange } from '../lib/payload/revalidate'

export const Footer: GlobalConfig = {
  slug: 'footer',
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media', required: true },
    { name: 'tagline', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'companyNumber', type: 'text' },
    {
      name: 'officeAddressLines',
      type: 'array',
      fields: [{ name: 'line', type: 'text', required: true }],
    },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    {
      name: 'usefulLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    { name: 'developerCredit', type: 'text' },
  ],
  hooks: {
    afterChange: [revalidateTagsAfterChange(['layout'])],
  },
}
