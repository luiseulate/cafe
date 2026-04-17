import type { APIRoute } from 'astro'
import { IGDB_CLIENT_ID, IGDB_CLIENT_SECRET } from 'astro:env/server'
import { IGDB_GAMES } from '@/consts'

export const prerender = false

export interface NowCollectionData {
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

export type Platform = 'switch' | 'pc'

const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

interface CacheEntry {
  data: NowCollectionData[]
  timestamp: number
}

const cache: Partial<Record<Platform, CacheEntry>> = {}

function isCacheValid(platform: Platform): boolean {
  const entry = cache[platform]
  return entry !== undefined && Date.now() - entry.timestamp < CACHE_TTL_MS
}

async function getAccessToken(): Promise<string> {
  const url = new URL('https://id.twitch.tv/oauth2/token')
  url.searchParams.set('client_id', IGDB_CLIENT_ID)
  url.searchParams.set('client_secret', IGDB_CLIENT_SECRET)
  url.searchParams.set('grant_type', 'client_credentials')

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'User-Agent': 'astro-cafe' },
    signal: AbortSignal.timeout(5_000),
  })

  if (!response.ok)
    throw new Error(
      `Twitch auth HTTP ${response.status}: ${response.statusText}`,
    )

  const data: TokenResponse = await response.json()
  return data.access_token
}

async function fetchFromIgdb(platform: Platform): Promise<NowCollectionData[]> {
  const gameIDs = IGDB_GAMES.flatMap((g) => g[platform].ids)
  const accessToken = await getAccessToken()

  const body = `fields name,first_release_date,involved_companies.developer,involved_companies.company.name; where id = (${gameIDs.join(',')}); limit ${gameIDs.length};`

  const response = await fetch('https://api.igdb.com/v4/games', {
    method: 'POST',
    headers: {
      'Client-ID': IGDB_CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'text/plain',
      'User-Agent': 'astro-cafe',
    },
    body,
    signal: AbortSignal.timeout(5_000),
  })

  if (!response.ok)
    throw new Error(`IGDB HTTP ${response.status}: ${response.statusText}`)

  const games: IgdbGame[] = await response.json()

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
  body: NowCollectionData[] | { error: string },
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

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const platformParam = url.searchParams.get('platform')
  const platform: Platform =
    platformParam === 'pc' || platformParam === 'switch'
      ? platformParam
      : 'switch'

  if (isCacheValid(platform)) {
    return jsonResponse(cache[platform]!.data, 200, {
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=7200',
      'X-Cache': 'HIT',
    })
  }

  try {
    const data = await fetchFromIgdb(platform)
    cache[platform] = { data, timestamp: Date.now() }

    return jsonResponse(data, 200, {
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=7200',
      'X-Cache': 'MISS',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[now-collection]', message)

    if (cache[platform]) {
      return jsonResponse(cache[platform]!.data, 200, {
        'Cache-Control': 'public, max-age=300',
        'X-Cache': 'STALE',
      })
    }

    return jsonResponse({ error: 'Failed to fetch game collection' }, 502)
  }
}
