import type { APIRoute } from 'astro'

export const prerender = false

export interface NowCodeData {
  pushedAt: string | null
}

interface GitHubRepository {
  pushed_at?: string | null
}

const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

interface CacheEntry {
  data: NowCodeData
  timestamp: number
}

let cache: CacheEntry | null = null

function isCacheValid(): boolean {
  return cache !== null && Date.now() - cache.timestamp < CACHE_TTL_MS
}

async function fetchFromGitHub(): Promise<NowCodeData> {
  const url = `https://api.github.com/repos/luiseulate/cafe`

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'astro-cafe',
    },
    signal: AbortSignal.timeout(5_000),
  })

  if (!response.ok) {
    throw new Error(`GitHub HTTP ${response.status}: ${response.statusText}`)
  }

  const data: GitHubRepository = await response.json()

  return {
    pushedAt: data.pushed_at ?? null,
  }
}

function jsonResponse(
  body: NowCodeData | { error: string },
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
    const data = await fetchFromGitHub()
    cache = { data, timestamp: Date.now() }

    return jsonResponse(data, 200, {
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      'X-Cache': 'MISS',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[now-code]', message)

    if (cache) {
      return jsonResponse(cache.data, 200, {
        'Cache-Control': 'public, max-age=60',
        'X-Cache': 'STALE',
      })
    }

    return jsonResponse({ error: 'Failed to fetch GitHub data' }, 502)
  }
}
