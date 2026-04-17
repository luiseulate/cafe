import type { APIRoute } from 'astro'
import { GOODREADS_USER_ID } from 'astro:env/server'
import { XMLParser } from 'fast-xml-parser'
import { decode } from 'html-entities'

export const prerender = false

export interface NowReadingData {
  isReading: boolean
  book: string
  author: string
  readAt: string | null
}

interface GoodreadsItem {
  title: string
  author_name: string
  user_read_at?: string
}

interface GoodreadsChannel {
  item?: GoodreadsItem | GoodreadsItem[]
}

const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

interface CacheEntry {
  data: NowReadingData
  timestamp: number
}

let cache: CacheEntry | null = null

function isCacheValid(): boolean {
  return cache !== null && Date.now() - cache.timestamp < CACHE_TTL_MS
}

function rssUrl(shelf: string): string {
  return `https://www.goodreads.com/review/list_rss/${GOODREADS_USER_ID}?shelf=${shelf}&per_page=1`
}

async function fetchShelf(shelf: string): Promise<GoodreadsItem[]> {
  const response = await fetch(rssUrl(shelf), {
    headers: { 'User-Agent': 'astro-cafe' },
    signal: AbortSignal.timeout(5_000),
  })

  if (!response.ok) {
    throw new Error(`Goodreads HTTP ${response.status}: ${response.statusText}`)
  }

  const xml = await response.text()
  const parser = new XMLParser()
  const parsed: { rss?: { channel?: GoodreadsChannel } } = parser.parse(xml)
  const raw = parsed?.rss?.channel?.item

  if (!raw) return []
  return Array.isArray(raw) ? raw : [raw]
}

async function fetchFromGoodreads(): Promise<NowReadingData> {
  const reading = await fetchShelf('currently-reading')

  if (reading.length > 0) {
    const item = reading[0]
    return {
      isReading: true,
      book: decode(String(item.title ?? '')),
      author: decode(String(item.author_name ?? '')),
      readAt: null,
    }
  }

  const read = await fetchShelf('read')

  if (read.length > 0) {
    const item = read[0]
    const rawDate = item.user_read_at
    const readAt =
      rawDate && String(rawDate).trim()
        ? new Date(String(rawDate)).toISOString()
        : null

    return {
      isReading: false,
      book: decode(String(item.title ?? '')),
      author: decode(String(item.author_name ?? '')),
      readAt,
    }
  }

  return { isReading: false, book: '', author: '', readAt: null }
}

function jsonResponse(
  body: NowReadingData | { error: string },
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
    const data = await fetchFromGoodreads()
    cache = { data, timestamp: Date.now() }

    return jsonResponse(data, 200, {
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      'X-Cache': 'MISS',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[now-reading]', message)

    if (cache) {
      return jsonResponse(cache.data, 200, {
        'Cache-Control': 'public, max-age=60',
        'X-Cache': 'STALE',
      })
    }

    return jsonResponse({ error: 'Failed to fetch now reading data' }, 502)
  }
}
