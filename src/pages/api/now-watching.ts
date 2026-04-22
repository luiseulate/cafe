import type { APIRoute } from 'astro'
import { LETTERBOXD_USER_ID } from 'astro:env/server'
import { XMLParser } from 'fast-xml-parser'
import { decode } from 'html-entities'

export const prerender = false

interface XMLParserDocument<T> {
  rss: T
}

export interface NowWatchingData {
  title: string
  rating: number
  date: string
  rewatch: boolean
}

interface LetterboxdItem {
  guid: string
  'letterboxd:filmTitle': string
  'letterboxd:memberRating': number
  'letterboxd:rewatch': 'No' | 'Yes'
  'letterboxd:watchedDate': string
  title: string
}

interface LetterboxdResponse {
  channel: {
    description: string
    item: LetterboxdItem[]
    link: string
    title: string
  }
}

const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

interface CacheEntry {
  data: NowWatchingData
  timestamp: number
}

let cache: CacheEntry | null = null

function isCacheValid(): boolean {
  return cache !== null && Date.now() - cache.timestamp < CACHE_TTL_MS
}

function formatFilm(entry: LetterboxdItem): NowWatchingData {
  return {
    title: decode(entry['letterboxd:filmTitle']),
    rating: entry['letterboxd:memberRating'],
    date: entry['letterboxd:watchedDate'],
    rewatch: entry['letterboxd:rewatch'] === 'Yes',
  }
}

async function fetchFromLetterboxd(): Promise<NowWatchingData> {
  const url = `https://letterboxd.com/${LETTERBOXD_USER_ID}/rss/`
  const response = await fetch(url, {
    headers: { 'User-Agent': 'astro-cafe' },
    signal: AbortSignal.timeout(5_000),
  })

  if (!response.ok) {
    throw new Error(
      `Letterboxd HTTP ${response.status}: ${response.statusText}`,
    )
  }

  const parser = new XMLParser()
  const { rss }: XMLParserDocument<LetterboxdResponse> = parser.parse(
    await response.text(),
  )
  const films = rss.channel.item
    .filter((item): item is LetterboxdItem => 'letterboxd:watchedDate' in item)
    .sort((a, b) =>
      b['letterboxd:watchedDate'].localeCompare(a['letterboxd:watchedDate']),
    )

  return formatFilm(films[0])
}

function jsonResponse(
  body: NowWatchingData | { error: string },
  status: number,
  extraHeaders?: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  })
}

export const GET: APIRoute = async () => {
  if (isCacheValid()) {
    return jsonResponse(cache!.data, 200, {
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      'X-Cache': 'HIT',
    })
  }

  try {
    const data = await fetchFromLetterboxd()
    cache = { data, timestamp: Date.now() }
    return jsonResponse(data, 200, {
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return jsonResponse({ error: message }, 500)
  }
}
