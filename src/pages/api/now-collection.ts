import type { APIRoute } from 'astro'
import { IGDB_CLIENT_ID, IGDB_CLIENT_SECRET } from 'astro:env/server'
import { IGDB_GAMES } from '@/consts'

export const prerender = false

export interface Game {
  id: number
  name: string
  developer: string | null
  releaseDate: string | null
}

interface IgdbGame {
  id: number
  name: string
  first_release_date?: number
  involved_companies?: {
    developer: boolean
    company: { name: string }
  }[]
}

interface TokenResponse {
  access_token: string
  expires_in: number
}

const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

interface CacheEntry {
  data: Game[]
  timestamp: number
}

let cache: CacheEntry | null = null

function isCacheValid(): boolean {
  return cache !== null && Date.now() - cache.timestamp < CACHE_TTL_MS
}

async function getAccessToken(): Promise<string> {
  const url = new URL('https://id.twitch.tv/oauth2/token')
  url.searchParams.set('client_id', IGDB_CLIENT_ID)
  url.searchParams.set('client_secret', IGDB_CLIENT_SECRET)
  url.searchParams.set('grant_type', 'client_credentials')

  const res = await fetch(url.toString(), {
    method: 'POST',
    signal: AbortSignal.timeout(5_000),
  })

  if (!res.ok)
    throw new Error(`Twitch auth HTTP ${res.status}: ${res.statusText}`)

  const data: TokenResponse = await res.json()
  return data.access_token
}

async function fetchFromIgdb(): Promise<Game[]> {
  const ids = IGDB_GAMES.flatMap((g) => g.switch.id)
  const accessToken = await getAccessToken()

  const body = `fields name,first_release_date,involved_companies.developer,involved_companies.company.name; where id = (${ids.join(',')}); limit ${ids.length};`

  const res = await fetch('https://api.igdb.com/v4/games', {
    method: 'POST',
    headers: {
      'Client-ID': IGDB_CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'text/plain',
    },
    body,
    signal: AbortSignal.timeout(5_000),
  })

  if (!res.ok) throw new Error(`IGDB HTTP ${res.status}: ${res.statusText}`)

  const games: IgdbGame[] = await res.json()

  return games
    .map((game) => {
      const devCompany = game.involved_companies?.find((c) => c.developer)
      return {
        id: game.id,
        name: game.name,
        developer: devCompany?.company.name ?? null,
        releaseDate: game.first_release_date
          ? new Date(game.first_release_date * 1000).toISOString()
          : null,
      }
    })
    .sort((a, b) => {
      if (!a.releaseDate) return 1
      if (!b.releaseDate) return -1
      return (
        new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      )
    })
}

function jsonResponse(
  body: Game[] | { error: string },
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
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=7200',
      'X-Cache': 'HIT',
    })
  }

  try {
    const data = await fetchFromIgdb()
    cache = { data, timestamp: Date.now() }

    return jsonResponse(data, 200, {
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=7200',
      'X-Cache': 'MISS',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[now-collection]', message)

    if (cache) {
      return jsonResponse(cache.data, 200, {
        'Cache-Control': 'public, max-age=300',
        'X-Cache': 'STALE',
      })
    }

    return jsonResponse({ error: 'Failed to fetch game collection' }, 502)
  }
}
