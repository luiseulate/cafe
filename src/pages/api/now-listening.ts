import type { APIRoute } from 'astro'
import { LASTFM_API_KEY, LASTFM_USERNAME } from 'astro:env/server'

export const prerender = false

interface NowListeningResponse {
  isPlaying: boolean
  track: string
  artist: string
  playedAt: string | null
}

interface LastFmTrack {
  name: string
  artist: { '#text': string }
  date?: { uts: string; '#text': string }
  '@attr'?: { nowplaying: 'true' }
}

interface LastFmSuccess {
  recenttracks: {
    track: LastFmTrack | LastFmTrack[]
  }
}

interface LastFmError {
  error: number
  message: string
}

type LastFmResponse = LastFmSuccess | LastFmError

const CACHE_TTL_MS = 30_000 // 30 seconds

interface CacheEntry {
  data: NowListeningResponse
  timestamp: number
}

let cache: CacheEntry | null = null

function isCacheValid(): boolean {
  return cache !== null && Date.now() - cache.timestamp < CACHE_TTL_MS
}

async function fetchFromLastFm(): Promise<NowListeningResponse> {
  const url = new URL('https://ws.audioscrobbler.com/2.0/')
  url.searchParams.set('method', 'user.getrecenttracks')
  url.searchParams.set('user', LASTFM_USERNAME)
  url.searchParams.set('api_key', LASTFM_API_KEY)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '1')

  const response = await fetch(url.toString(), {
    headers: { 'User-Agent': 'astro-cafe' },
    signal: AbortSignal.timeout(5_000),
  })

  if (!response.ok) {
    throw new Error(`Last.fm HTTP ${response.status}: ${response.statusText}`)
  }

  const data: LastFmResponse = await response.json()

  if ('error' in data) {
    throw new Error(`Last.fm API error ${data.error}: ${data.message}`)
  }

  const rawTracks = data.recenttracks.track
  const tracks: LastFmTrack[] = Array.isArray(rawTracks)
    ? rawTracks
    : [rawTracks]
  const track = tracks[0]

  if (!track) {
    return { isPlaying: false, track: '', artist: '', playedAt: null }
  }

  const isPlaying = track['@attr']?.nowplaying === 'true'
  const playedAt =
    isPlaying || !track.date
      ? null
      : new Date(Number(track.date.uts) * 1000).toISOString()

  return {
    isPlaying,
    track: track.name,
    artist: track.artist['#text'],
    playedAt,
  }
}

function jsonResponse(
  body: NowListeningResponse | { error: string },
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
    const data = await fetchFromLastFm()
    cache = { data, timestamp: Date.now() }

    return jsonResponse(data, 200, {
      'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
      'X-Cache': 'MISS',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[now-listening]', message)

    if (cache) {
      return jsonResponse(cache.data, 200, {
        'Cache-Control': 'public, max-age=10',
        'X-Cache': 'STALE',
      })
    }

    return jsonResponse({ error: 'Failed to fetch now listening data' }, 502)
  }
}
