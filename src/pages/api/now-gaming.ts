import type { APIRoute } from 'astro'
import { STEAM_ID, STEAM_API_KEY } from 'astro:env/server'

export const prerender = false

export interface NowGamingData {
  isPlaying: boolean
  game: string
  developer: string | null
  playedAt: string | null
}

interface PlayerSummary {
  steamid: string
  gameid?: string
}

interface OwnedGame {
  appid: number
  rtime_last_played: number
}

interface AppDetailsData {
  name: string
  developers?: string[]
}

interface AppDetailsEntry {
  success: boolean
  data?: AppDetailsData
}

const CACHE_TTL_MS = 30_000

interface CacheEntry {
  data: NowGamingData
  timestamp: number
}

let cache: CacheEntry | null = null

function isCacheValid(): boolean {
  return cache !== null && Date.now() - cache.timestamp < CACHE_TTL_MS
}

async function getGameDetails(
  appId: string | number,
): Promise<{ name: string | null; developer: string | null }> {
  const res = await fetch(
    `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=es&l=spanish`,
    { signal: AbortSignal.timeout(5_000) },
  )
  if (!res.ok) return { name: null, developer: null }
  const data: Record<string, AppDetailsEntry> = await res.json()
  const entry = data[String(appId)]
  if (!entry?.success || !entry.data) return { name: null, developer: null }
  return {
    name: entry.data.name ?? null,
    developer: entry.data.developers?.[0] ?? null,
  }
}

async function fetchFromSteam(): Promise<NowGamingData> {
  const summaryRes = await fetch(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${STEAM_ID}`,
    { signal: AbortSignal.timeout(5_000) },
  )
  if (!summaryRes.ok) {
    throw new Error(`Steam summaries HTTP ${summaryRes.status}`)
  }

  const summaryData = await summaryRes.json()
  const player: PlayerSummary = summaryData.response.players[0]

  if (!player) {
    return { isPlaying: false, game: '', developer: null, playedAt: null }
  }

  if (player.gameid) {
    const { name, developer } = await getGameDetails(player.gameid)
    return {
      isPlaying: true,
      game: name ?? '',
      developer,
      playedAt: null,
    }
  }

  const ownedRes = await fetch(
    `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&include_appinfo=true&include_played_free_games=true`,
    { signal: AbortSignal.timeout(5_000) },
  )
  if (!ownedRes.ok) {
    throw new Error(`Steam owned games HTTP ${ownedRes.status}`)
  }

  const ownedData = await ownedRes.json()
  const games: OwnedGame[] = ownedData.response.games ?? []

  const lastGame = games
    .filter((g) => g.rtime_last_played > 0)
    .sort((a, b) => b.rtime_last_played - a.rtime_last_played)[0]

  if (!lastGame) {
    return { isPlaying: false, game: '', developer: null, playedAt: null }
  }

  const { name, developer } = await getGameDetails(lastGame.appid)

  return {
    isPlaying: false,
    game: name ?? '',
    developer,
    playedAt: new Date(lastGame.rtime_last_played * 1000).toISOString(),
  }
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
