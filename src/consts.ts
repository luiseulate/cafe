import type { SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'astro-cafe',
  description:
    'astro-cafe es un tema construido con Astro, Tailwind y shadcn/ui.',
  href: 'https://astro-cafe.vercel.app',
  author: 'astro-cafe',
  avatar: 'https://github.com/github.png',
  birthday: new Date('1985-06-21'),
  locale: 'es-ES',
  featuredPostCount: 3,
  postsPerPage: 12,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/acerca',
    label: 'acerca',
    icon: 'lucide:user',
  },
  {
    href: '/blog',
    label: 'blog',
    icon: 'lucide:library-big',
  },
  {
    href: '/temas',
    label: 'temas',
    icon: 'lucide:tag',
  },

  {
    href: '/colofon',
    label: 'colofon',
    icon: 'lucide:palette',
  },
]
