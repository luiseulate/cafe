import type { SocialLink, Site, Stack, GameIDs } from '@/types'
import {
  AstroIcon,
  GitHubIcon,
  MdxIcon,
  ShadcnIcon,
  TailwindIcon,
  VercelIcon,
  ReactIcon,
  TypescriptIcon,
} from '@/components/ui/brand-icons'

export const SITE: Site = {
  title: 'luis.cafe',
  description:
    'luis.cafe es un tema construido con Astro, Tailwind y shadcn/ui.',
  href: 'https://luis.cafe',
  author: 'Luis',
  avatar: 'https://avatars.githubusercontent.com/luiseulate',
  birthday: new Date('1985-06-21'),
  locale: 'es-ES',
  featuredPostCount: 6,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/',
    label: 'inicio',
    icon: 'lucide:home',
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
    href: '/fotos',
    label: 'fotos',
    icon: 'lucide:aperture',
  },
]

export const STACK_ICONS: Stack[] = [
  { href: 'https://astro.build/', label: 'Astro', icon: AstroIcon },
  {
    href: 'https://tailwindcss.com/',
    label: 'Tailwind CSS',
    icon: TailwindIcon,
  },
  { href: 'https://ui.shadcn.com/', label: 'shadcn/ui', icon: ShadcnIcon },
  { href: 'https://mdxjs.com/', label: 'MDX', icon: MdxIcon },
  { href: 'https://react.dev/', label: 'React', icon: ReactIcon },
  {
    href: 'https://www.typescriptlang.org/',
    label: 'TypeScript',
    icon: TypescriptIcon,
  },
  { href: 'https://github.com/', label: 'GitHub', icon: GitHubIcon },
  { href: 'https://vercel.com/', label: 'Vercel', icon: VercelIcon },
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
