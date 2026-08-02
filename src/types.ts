import type { SvgComponent } from 'astro/types'

export type Site = {
  title: string
  description: string
  href: string
  author: string
  avatar: string
  birthday: Date
  locale: string
  featuredPostCount: number
}

export type SocialLink = {
  href: string
  label: string
  icon?: string
}

export type Stack = {
  href: string
  label: string
  icon: SvgComponent
}

export type IconMap = {
  [key: string]: string
}

export type GameIDs = {
  switch: { ids: number[] }
}
