import type { APIRoute } from 'astro'
import {
  STRAVA_CLIENT_ID,
  STRAVA_CLIENT_SECRET,
  STRAVA_REFRESH_TOKEN,
} from 'astro:env/server'

export const prerender = false

export interface NowRunningData {
  name: string
  date: string
  sport: string
}

interface TokenResponse {
  access_token: string
  expires_in: number
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

interface CacheEntry {
  data: NowRunningData | null
  timestamp: number
}

let cache: CacheEntry | null = null

function isCacheValid(): boolean {
  return cache !== null && Date.now() - cache.timestamp < CACHE_TTL_MS
}

function translateSportType(type: string): string {
  const map: Record<string, string> = {
    AlpineSki: 'Esquí alpino',
    BackcountrySki: 'Esquí de travesía',
    Canoeing: 'Piragüismo',
    Crossfit: 'Crossfit',
    EBikeRide: 'Bicicleta eléctrica',
    Elliptical: 'Elíptica',
    Golf: 'Golf',
    Handcycle: 'Handbike',
    Hike: 'Senderismo',
    IceSkate: 'Patinaje sobre hielo',
    InlineSkate: 'Patinaje en línea',
    Kayaking: 'Kayak',
    Kitesurf: 'Kitesurf',
    NordicSki: 'Esquí nórdico',
    Ride: 'Ciclismo',
    RockClimbing: 'Escalada',
    RollerSki: 'Rollerski',
    Rowing: 'Remo',
    Run: 'Correr',
    Sail: 'Vela',
    Skateboard: 'Skateboard',
    Snowboard: 'Snowboard',
    Snowshoe: 'Raquetas de nieve',
    Soccer: 'Fútbol',
    StairStepper: 'Escaladora',
    StandUpPaddling: 'Paddle surf',
    Surfing: 'Surf',
    Swim: 'Natación',
    Velomobile: 'Velomóvil',
    VirtualRide: 'Ciclismo virtual',
    VirtualRun: 'Correr virtual',
    Walk: 'Caminar',
    WeightTraining: 'Entrenamiento de fuerza',
    Wheelchair: 'Silla de ruedas',
    Windsurf: 'Windsurf',
    Workout: 'Entrenamiento',
    Yoga: 'Yoga',
  }
  return map[type] || type
}

async function getAccessToken(): Promise<string> {
  const url = new URL('https://www.strava.com/oauth/token')
  url.searchParams.set('client_id', STRAVA_CLIENT_ID)
  url.searchParams.set('client_secret', STRAVA_CLIENT_SECRET)
  url.searchParams.set('grant_type', 'refresh_token')
  url.searchParams.set('refresh_token', STRAVA_REFRESH_TOKEN)

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'User-Agent': 'astro-cafe' },
    signal: AbortSignal.timeout(5_000),
  })

  if (!response.ok)
    throw new Error(
      `Strava auth HTTP ${response.status}: ${response.statusText}`,
    )

  const data: TokenResponse = await response.json()
  return data.access_token
}

async function fetchFromStrava(): Promise<NowRunningData> {
  const access_token = await getAccessToken()
  const response = await fetch(
    'https://www.strava.com/api/v3/athlete/activities?per_page=1',
    {
      headers: { Authorization: `Bearer ${access_token}` },
    },
  )
  if (!response.ok) throw new Error('No se pudo obtener actividad')
  const activities = await response.json()
  if (!Array.isArray(activities) || activities.length === 0) {
    throw new Error('No hay actividad')
  }
  const activitie = activities[0]
  return {
    name: activitie.name,
    date: activitie.start_date_local,
    sport: translateSportType(activitie.sport_type),
  }
}

function jsonResponse(
  body: NowRunningData | { error: string },
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
  if (isCacheValid() && cache?.data) {
    return jsonResponse(cache.data, 200, {
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=7200',
      'X-Cache': 'HIT',
    })
  }

  try {
    const data = await fetchFromStrava()
    cache = { data, timestamp: Date.now() }

    return jsonResponse(data, 200, {
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=7200',
      'X-Cache': 'MISS',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[now-running]', message)

    if (cache?.data) {
      return jsonResponse(cache.data, 200, {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=7200',
        'X-Cache': 'STALE',
      })
    }

    return jsonResponse({ error: 'No se pudo obtener actividad' }, 502)
  }
}
