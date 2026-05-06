import { getCollection, render, type CollectionEntry } from 'astro:content'

export async function getAllPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog')
  return posts
    .filter((post) => !post.data.draft && !isSubpost(post.id))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

export async function getAllPostsAndSubposts(): Promise<
  CollectionEntry<'blog'>[]
> {
  const posts = await getCollection('blog')
  return posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

export async function getAllProjects(): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getCollection('projects')
  return projects.sort((a, b) => {
    const dateA = a.data.startDate?.getTime() || 0
    const dateB = b.data.startDate?.getTime() || 0
    return dateB - dateA
  })
}

export async function getAllTags(): Promise<Map<string, number>> {
  const posts = await getAllPosts()
  return posts.reduce((acc, post) => {
    post.data.tags?.forEach((tag) => {
      acc.set(tag, (acc.get(tag) || 0) + 1)
    })
    return acc
  }, new Map<string, number>())
}

export async function getAdjacentPosts(currentId: string): Promise<{
  newer: CollectionEntry<'blog'> | null
  older: CollectionEntry<'blog'> | null
  parent: CollectionEntry<'blog'> | null
}> {
  const allPosts = await getAllPosts()

  if (isSubpost(currentId)) {
    const parentId = getParentId(currentId)
    const allPosts = await getAllPosts()
    const parent = allPosts.find((post) => post.id === parentId) || null

    const posts = await getCollection('blog')
    const subposts = posts
      .filter(
        (post) =>
          isSubpost(post.id) &&
          getParentId(post.id) === parentId &&
          !post.data.draft,
      )
      .sort((a, b) => {
        const dateDiff = a.data.date.valueOf() - b.data.date.valueOf()
        if (dateDiff !== 0) return dateDiff

        const orderA = a.data.order ?? 0
        const orderB = b.data.order ?? 0
        return orderA - orderB
      })

    const currentIndex = subposts.findIndex((post) => post.id === currentId)
    if (currentIndex === -1) {
      return { newer: null, older: null, parent }
    }

    return {
      newer:
        currentIndex < subposts.length - 1 ? subposts[currentIndex + 1] : null,
      older: currentIndex > 0 ? subposts[currentIndex - 1] : null,
      parent,
    }
  }

  const parentPosts = allPosts.filter((post) => !isSubpost(post.id))
  const currentIndex = parentPosts.findIndex((post) => post.id === currentId)

  if (currentIndex === -1) {
    return { newer: null, older: null, parent: null }
  }

  return {
    newer: currentIndex > 0 ? parentPosts[currentIndex - 1] : null,
    older:
      currentIndex < parentPosts.length - 1
        ? parentPosts[currentIndex + 1]
        : null,
    parent: null,
  }
}

export async function getPostsByTag(
  tag: string,
): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getAllPosts()
  return posts.filter((post) => post.data.tags?.includes(tag))
}

export async function getRecentPosts(
  count: number,
): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getAllPosts()
  return posts.slice(0, count)
}

export async function getSortedTags(): Promise<
  { tag: string; count: number }[]
> {
  const tagCounts = await getAllTags()
  return [...tagCounts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => {
      const countDiff = b.count - a.count
      return countDiff !== 0 ? countDiff : a.tag.localeCompare(b.tag)
    })
}

export function getParentId(subpostId: string): string {
  return subpostId.split('/')[0]
}

export async function getSubpostsForParent(
  parentId: string,
): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog')
  return posts
    .filter(
      (post) =>
        !post.data.draft &&
        isSubpost(post.id) &&
        getParentId(post.id) === parentId,
    )
    .sort((a, b) => {
      const dateDiff = a.data.date.valueOf() - b.data.date.valueOf()
      if (dateDiff !== 0) return dateDiff

      const orderA = a.data.order ?? 0
      const orderB = b.data.order ?? 0
      return orderA - orderB
    })
}

export function groupPostsByYear(
  posts: CollectionEntry<'blog'>[],
): Record<string, CollectionEntry<'blog'>[]> {
  return posts.reduce(
    (acc: Record<string, CollectionEntry<'blog'>[]>, post) => {
      const year = post.data.date.getFullYear().toString()
      ;(acc[year] ??= []).push(post)
      return acc
    },
    {},
  )
}

export async function hasSubposts(postId: string): Promise<boolean> {
  const subposts = await getSubpostsForParent(postId)
  return subposts.length > 0
}

export function isSubpost(postId: string): boolean {
  return postId.includes('/')
}

export async function getParentPost(
  subpostId: string,
): Promise<CollectionEntry<'blog'> | null> {
  if (!isSubpost(subpostId)) {
    return null
  }

  const parentId = getParentId(subpostId)
  const allPosts = await getAllPosts()
  return allPosts.find((post) => post.id === parentId) || null
}

export async function getPostById(
  postId: string,
): Promise<CollectionEntry<'blog'> | null> {
  const allPosts = await getAllPostsAndSubposts()
  return allPosts.find((post) => post.id === postId) || null
}

export async function getSubpostCount(parentId: string): Promise<number> {
  const subposts = await getSubpostsForParent(parentId)
  return subposts.length
}

export type TOCHeading = {
  slug: string
  text: string
  depth: number
  isSubpostTitle?: boolean
}

export type TOCSection = {
  type: 'parent' | 'subpost'
  title: string
  headings: TOCHeading[]
  subpostId?: string
}

export async function getTOCSections(postId: string): Promise<TOCSection[]> {
  const post = await getPostById(postId)
  if (!post) return []

  const parentId = isSubpost(postId) ? getParentId(postId) : postId
  const parentPost = isSubpost(postId) ? await getPostById(parentId) : post

  if (!parentPost) return []

  const sections: TOCSection[] = []

  const { headings: parentHeadings } = await render(parentPost)
  if (parentHeadings.length > 0) {
    sections.push({
      type: 'parent',
      title: 'Contenidos',
      headings: parentHeadings.map((heading) => ({
        slug: heading.slug,
        text: heading.text,
        depth: heading.depth,
      })),
    })
  }

  const subposts = await getSubpostsForParent(parentId)
  for (const subpost of subposts) {
    const { headings: subpostHeadings } = await render(subpost)
    if (subpostHeadings.length > 0) {
      sections.push({
        type: 'subpost',
        title: subpost.data.title,
        headings: subpostHeadings.map((heading, index) => ({
          slug: heading.slug,
          text: heading.text,
          depth: heading.depth,
          isSubpostTitle: index === 0,
        })),
        subpostId: subpost.id,
      })
    }
  }

  return sections
}

export async function getAllAlbums(): Promise<CollectionEntry<'albums'>[]> {
  const albums = await getCollection('albums')
  return albums
    .filter((album) => !album.data.draft && !isSubpost(album.id))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

export async function getAllAlbumsAndSubalbums(): Promise<
  CollectionEntry<'albums'>[]
> {
  const albums = await getCollection('albums')
  return albums
    .filter((album) => !album.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

export async function getAdjacentAlbums(currentId: string): Promise<{
  newer: CollectionEntry<'albums'> | null
  older: CollectionEntry<'albums'> | null
  parent: CollectionEntry<'albums'> | null
}> {
  const allAlbums = await getAllAlbums()

  if (isSubpost(currentId)) {
    const parentId = getParentId(currentId)
    const parent = allAlbums.find((album) => album.id === parentId) || null

    const albums = await getCollection('albums')
    const subalbums = albums
      .filter(
        (album) =>
          isSubpost(album.id) &&
          getParentId(album.id) === parentId &&
          !album.data.draft,
      )
      .sort((a, b) => {
        const dateDiff = a.data.date.valueOf() - b.data.date.valueOf()
        if (dateDiff !== 0) return dateDiff
        return (a.data.order ?? 0) - (b.data.order ?? 0)
      })

    const currentIndex = subalbums.findIndex((album) => album.id === currentId)
    if (currentIndex === -1) {
      return { newer: null, older: null, parent }
    }

    return {
      newer:
        currentIndex < subalbums.length - 1
          ? subalbums[currentIndex + 1]
          : null,
      older: currentIndex > 0 ? subalbums[currentIndex - 1] : null,
      parent,
    }
  }

  const parentAlbums = allAlbums.filter((album) => !isSubpost(album.id))
  const currentIndex = parentAlbums.findIndex((album) => album.id === currentId)

  if (currentIndex === -1) {
    return { newer: null, older: null, parent: null }
  }

  return {
    newer: currentIndex > 0 ? parentAlbums[currentIndex - 1] : null,
    older:
      currentIndex < parentAlbums.length - 1
        ? parentAlbums[currentIndex + 1]
        : null,
    parent: null,
  }
}

export async function getSubalbumsForParent(
  parentId: string,
): Promise<CollectionEntry<'albums'>[]> {
  const albums = await getCollection('albums')
  return albums
    .filter(
      (album) =>
        !album.data.draft &&
        isSubpost(album.id) &&
        getParentId(album.id) === parentId,
    )
    .sort((a, b) => {
      const dateDiff = a.data.date.valueOf() - b.data.date.valueOf()
      if (dateDiff !== 0) return dateDiff
      return (a.data.order ?? 0) - (b.data.order ?? 0)
    })
}

export function groupAlbumsByYear(
  albums: CollectionEntry<'albums'>[],
): Record<string, CollectionEntry<'albums'>[]> {
  return albums.reduce(
    (acc: Record<string, CollectionEntry<'albums'>[]>, album) => {
      const year = album.data.date.getFullYear().toString()
      ;(acc[year] ??= []).push(album)
      return acc
    },
    {},
  )
}

export async function hasSubalbums(albumId: string): Promise<boolean> {
  const subalbums = await getSubalbumsForParent(albumId)
  return subalbums.length > 0
}

export async function getAlbumById(
  albumId: string,
): Promise<CollectionEntry<'albums'> | null> {
  const allAlbums = await getAllAlbumsAndSubalbums()
  return allAlbums.find((album) => album.id === albumId) || null
}

export async function getSubalbumCount(parentId: string): Promise<number> {
  const subalbums = await getSubalbumsForParent(parentId)
  return subalbums.length
}

export async function getTOCSectionsForAlbum(
  albumId: string,
): Promise<TOCSection[]> {
  const album = await getAlbumById(albumId)
  if (!album) return []

  const parentId = isSubpost(albumId) ? getParentId(albumId) : albumId
  const parentAlbum = isSubpost(albumId) ? await getAlbumById(parentId) : album

  if (!parentAlbum) return []

  const sections: TOCSection[] = []

  const { headings: parentHeadings } = await render(parentAlbum)
  if (parentHeadings.length > 0) {
    sections.push({
      type: 'parent',
      title: 'Contenidos',
      headings: parentHeadings.map((heading) => ({
        slug: heading.slug,
        text: heading.text,
        depth: heading.depth,
      })),
    })
  }

  const subalbums = await getSubalbumsForParent(parentId)
  for (const subalbum of subalbums) {
    const { headings: subalbumHeadings } = await render(subalbum)
    if (subalbumHeadings.length > 0) {
      sections.push({
        type: 'subpost',
        title: subalbum.data.title,
        headings: subalbumHeadings.map((heading, index) => ({
          slug: heading.slug,
          text: heading.text,
          depth: heading.depth,
          isSubpostTitle: index === 0,
        })),
        subpostId: subalbum.id,
      })
    }
  }

  return sections
}

export async function getAlbumImages(albumId: string) {
  let images = import.meta.glob<{ default: ImageMetadata }>(
    '/src/content/albums/**/*.{jpeg,jpg,png,gif,webp}',
  )

  images = Object.fromEntries(
    Object.entries(images).filter(([key]) => key.includes(albumId)),
  )
  const resolvedImages = await Promise.all(
    Object.values(images).map((image) => image().then((mod) => mod.default)),
  )
  resolvedImages.sort(() => Math.random() - 0.5)
  return resolvedImages
}
