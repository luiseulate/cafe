import type { SocialLink, Site, GameIDs } from '@/types'

export const SITE: Site = {
  title: 'astro-cafe',
  description:
    'astro-cafe es un tema construido con Astro, Tailwind y shadcn/ui.',
  href: 'https://astro-cafe.vercel.app',
  author: 'astro-cafe',
  avatar: 'https://github.com/github.png',
  birthday: new Date('1985-06-21'),
  locale: 'es-ES',
  featuredPostCount: 6,
  postsPerPage: 12,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: 'blog',
    icon: 'lucide:library-big',
  },
  {
    href: '/videojuegos',
    label: 'videojuegos',
    icon: 'lucide:gamepad-2',
  },
  {
    href: '/colofon',
    label: 'colofon',
    icon: 'lucide:palette',
  },
]

export const IGDB_GAMES: GameIDs[] = [
  {
    switch: {
      id: [
        119402, 119388, 7346, 14593, 9643, 26758, 138227, 135243, 254339, 37001,
        26226, 7344, 7342, 23733, 9061, 94873, 36911, 121760, 125587, 36952,
        1331, 9174, 22917, 262529,
      ],
    },
  },
]
