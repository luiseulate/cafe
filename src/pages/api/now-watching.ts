import type { APIRoute } from 'astro'
import { LETTERBOXD_USER_ID } from 'astro:env/server'
import { XMLParser } from 'fast-xml-parser'

export const prerender = false

export interface NowWatchingData {
  film: string
  year: string | null
  watchedAt: string | null
}

interface LetterboxdItem {
  'letterboxd:filmTitle'?: string | number
  'letterboxd:filmYear'?: string | number
  'letterboxd:watchedDate'?: string
}

interface LetterboxdChannel {
  item?: LetterboxdItem | LetterboxdItem[]
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

  const xml = await response.text()
  const parser = new XMLParser()
  const parsed: { rss?: { channel?: LetterboxdChannel } } = parser.parse(xml)
  const raw = parsed?.rss?.channel?.item

  if (!raw) {
    return { film: '', year: null, watchedAt: null }
  }

  const items = Array.isArray(raw) ? raw : [raw]
  const item = items[0]

  const filmTitle = item['letterboxd:filmTitle']
    ? String(item['letterboxd:filmTitle'])
    : ''

  const filmYear = item['letterboxd:filmYear']
    ? String(item['letterboxd:filmYear'])
    : null

  const rawDate = item['letterboxd:watchedDate']
  const watchedAt =
    rawDate && String(rawDate).trim()
      ? new Date(String(rawDate)).toISOString()
      : null

  return {
    film: filmTitle,
    year: filmYear,
    watchedAt,
  }
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
