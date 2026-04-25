import type { APIRoute } from 'astro'
import { RA_USER_ID, RA_API_KEY } from 'astro:env/server'

export const prerender = false

export interface NowRetroGamingData {
  title: string
  console: string
  lastPlayed: string
}

const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

interface CacheEntry {
  data: NowRetroGamingData | null
  timestamp: number
}

let cache: CacheEntry | null = null

function isCacheValid(): boolean {
  return cache !== null && Date.now() - cache.timestamp < CACHE_TTL_MS
}

async function fetchFromRetroAchievements(): Promise<NowRetroGamingData> {
  const url = new URL(
    'https://retroachievements.org/API/API_GetUserRecentlyPlayedGames.php',
  )
  url.searchParams.set('u', RA_USER_ID)
  url.searchParams.set('y', RA_API_KEY)
  url.searchParams.set('c', '1')

  const response = await fetch(url.toString(), {
    headers: { 'User-Agent': 'astro-cafe' },
    signal: AbortSignal.timeout(5000),
  })

  if (!response.ok) {
    throw new Error(
      `Retroachivements HTTP ${response.status}: ${response.statusText}`,
    )
  }

  const data = await response.json()

  const game = data[0]

  return {
    title: game.Title,
    console: game.ConsoleName,
    lastPlayed: game.LastPlayed,
  }
}

function jsonResponse(
  body: NowRetroGamingData | { error: string } | null,
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
  if (isCacheValid() && cache!.data) {
    return jsonResponse(cache!.data, 200, {
      'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
      'X-Cache': 'HIT',
    })
  }
  try {
    const data = await fetchFromRetroAchievements()
    if (!data) throw new Error('No data')
    cache = { data, timestamp: Date.now() }
    return jsonResponse(data, 200, {
      'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
      'X-Cache': 'MISS',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[now-retro-gaming]', message)

    if (cache) {
      return jsonResponse(cache.data, 200, {
        'Cache-Control': 'public, max-age=10',
        'X-Cache': 'STALE',
      })
    }

    return jsonResponse({ error: 'Failed to fetch retro gaming data' }, 502)
  }
}
