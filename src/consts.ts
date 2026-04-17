import type { SocialLink, Site, GameIDs } from '@/types'

export const SITE: Site = {
  title: 'astro-cafe',
  description:
    'astro-cafe es un tema construido con Astro, Tailwind y shadcn/ui.',
  href: 'https://astro-cafe.vercel.app',
  author: 'Luis',
  avatar: 'https://github.com/luiseulate.png',
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
    href: '/fotos',
    label: 'fotos',
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
        74959, 119402,
      ],
    },
    pc: {
      ids: [
        125633, 14362, 7042, 53818, 122050, 25076, 74701, 32595, 1942, 6656,
        20025, 7603, 206510, 27860, 55057, 221950, 1062, 6611, 979, 879, 654,
        65, 66, 7408, 7342, 1331, 7599, 241, 242408, 307, 3267, 6732, 7706,
        1369, 25009,
      ],
    },
  },
]
