import type { HeaderContent } from './header'
import type { FooterContent } from './footer'

export const headerDefaults: HeaderContent = {
  logo: { url: '/ssv-logo.webp', alt: 'SSV Logo' },
  navLinks: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
  ],
  ctaLabel: 'Contact Us',
}

export const footerDefaults: FooterContent = {
  logo: { url: '/ssv-logo.webp', alt: 'SSV Property Group' },
  tagline: 'Sustainable Solutions | Visionary Values',
  description:
    'SSV is guided by integrity, reliability, and attention to detail. Start your journey with us to create your desired project.',
  companyNumber: '14877900',
  officeAddressLines: ['Milton Keynes', 'North West London', 'United Kingdom', 'MK10 7DR'],
  phone: '+44 7918 351115',
  email: 'geet.ssvpropertygroup@gmail.com',
  usefulLinks: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/projects' },
    { label: 'Contact Us', href: '/contact' },
  ],
  developerCredit: 'Carbron Coders',
}
