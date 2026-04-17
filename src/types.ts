export type Site = {
  title: string
  description: string
  href: string
  author: string
  avatar: string
  birthday: Date
  locale: string
  featuredPostCount: number
  postsPerPage: number
}

export type SocialLink = {
  href: string
  label: string
  icon?: string
}

export type IconMap = {
  [key: string]: string
}

export type GameIDs = {
  switch: { ids: number[] }
  pc: { ids: number[] }
}
