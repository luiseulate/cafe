import type { APIRoute } from 'astro'
import { STEAM_ID, STEAM_API_KEY } from 'astro:env/server'

export const prerender = false

export interface NowGamingData {
  isPlaying: boolean
  game: string
  playtimeForever: number | null
  playedAt: string | null
}

interface PlayerSummary {
  steamid: string
  gameid?: string
}

interface OwnedGame {
  appid: number
  name?: string
  playtime_forever?: number
  rtime_last_played: number
}

const CACHE_TTL_MS = 30_000 // 30 seconds
const EXCLUDED_APP_ID = 431960

interface CacheEntry {
  data: NowGamingData
  timestamp: number
}

let cache: CacheEntry | null = null

function isCacheValid(): boolean {
  return cache !== null && Date.now() - cache.timestamp < CACHE_TTL_MS
}

async function fetchFromSteam(): Promise<NowGamingData> {
  const ownedUrl = new URL(
    'https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/',
  )
  ownedUrl.searchParams.set('key', STEAM_API_KEY)
  ownedUrl.searchParams.set('steamid', STEAM_ID)
  ownedUrl.searchParams.set('include_appinfo', 'true')
  ownedUrl.searchParams.set('include_played_free_games', 'true')

  const ownedRes = await fetch(ownedUrl.toString(), {
    headers: { 'User-Agent': 'astro-cafe' },
    signal: AbortSignal.timeout(5_000),
  })
  if (!ownedRes.ok) {
    throw new Error(`Steam owned games HTTP ${ownedRes.status}`)
  }

  const ownedData = await ownedRes.json()
  const games: OwnedGame[] = ownedData.response.games ?? []

  const summaryUrl = new URL(
    'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/',
  )
  summaryUrl.searchParams.set('key', STEAM_API_KEY)
  summaryUrl.searchParams.set('steamids', STEAM_ID)

  const summaryRes = await fetch(summaryUrl.toString(), {
    headers: { 'User-Agent': 'astro-cafe' },
    signal: AbortSignal.timeout(5_000),
  })
  if (!summaryRes.ok) {
    throw new Error(`Steam summaries HTTP ${summaryRes.status}`)
  }

  const summaryData = await summaryRes.json()
  const player: PlayerSummary | undefined = summaryData.response.players?.[0]

  const currentGame = player?.gameid
    ? games.find((game) => game.appid === Number(player.gameid))
    : undefined

  const lastGame = games
    .filter(
      (game) => game.rtime_last_played > 0 && game.appid !== EXCLUDED_APP_ID,
    )
    .sort((a, b) => b.rtime_last_played - a.rtime_last_played)[0]

  if (currentGame) {
    return {
      isPlaying: true,
      game: currentGame.name ?? '',
      playtimeForever: currentGame.playtime_forever ?? null,
      playedAt: null,
    }
  }

  if (lastGame) {
    return {
      isPlaying: false,
      game: lastGame.name ?? '',
      playtimeForever: lastGame.playtime_forever ?? null,
      playedAt: new Date(lastGame.rtime_last_played * 1000).toISOString(),
    }
  }

  return { isPlaying: false, game: '', playtimeForever: null, playedAt: null }
}

function jsonResponse(
  body: NowGamingData | { error: string },
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
      'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
      'X-Cache': 'HIT',
    })
  }

  try {
    const data = await fetchFromSteam()
    cache = { data, timestamp: Date.now() }

    return jsonResponse(data, 200, {
      'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
      'X-Cache': 'MISS',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[now-gaming]', message)

    if (cache) {
      return jsonResponse(cache.data, 200, {
        'Cache-Control': 'public, max-age=10',
        'X-Cache': 'STALE',
      })
    }

    return jsonResponse({ error: 'Failed to fetch gaming data' }, 502)
  }
}
