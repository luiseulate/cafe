import type { SocialLink, Site, GameIDs } from '@/types'

export const SITE: Site = {
  title: 'luis-cafe',
  description:
    'luis-cafe es un tema construido con Astro, Tailwind y shadcn/ui.',
  href: 'https://luis.cafe',
  author: 'Luis',
  avatar: 'https://avatars.githubusercontent.com/luiseulate',
  birthday: new Date('1985-06-21'),
  locale: 'es-ES',
  featuredPostCount: 6,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/bio',
    label: 'bio',
    icon: 'lucide:user',
  },
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
    href: '/albums',
    label: 'albums',
    icon: 'lucide:aperture',
  },
]

export const IGDB_GAMES: GameIDs[] = [
  {
    switch: {
      ids: [
        119402, 119388, 7346, 14593, 9643, 26758, 138227, 135243, 254339, 37001,
        26226, 7344, 7342, 23733, 9061, 94873, 36911, 121760, 125587, 36952,
        1331, 9174, 22917, 262529, 250621, 26764, 115276, 155074, 182480,
        356310, 41862, 121567, 135254, 150045, 7725, 306149, 114009, 19449,
        74959, 119402, 37136,
      ],
    },
  },
]
