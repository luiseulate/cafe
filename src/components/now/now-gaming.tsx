import { useState, useEffect } from 'react'
import { formatDuration, intervalToDuration } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatDateShort } from '@/lib/utils'
import type { NowGamingData } from '@/pages/api/now-gaming'
import { GamepadAnimation } from '@/components/ui/now-icons'

type State =
  | { status: 'loading' }
  | { status: 'success'; data: NowGamingData }
  | { status: 'error' }

function formatPlaytime(minutes: number | null): string {
  if (minutes === null) return '—'
  if (minutes <= 0) return '0m'

  return formatDuration(
    intervalToDuration({ start: 0, end: minutes * 60 * 1000 }),
    {
      format: ['hours', 'minutes', 'seconds'],
      locale: es,
    },
  )
}

function formatSessionTime(totalSeconds: number): string {
  return formatDuration(
    intervalToDuration({ start: 0, end: totalSeconds * 1000 }),
    {
      format: ['hours', 'minutes', 'seconds'],
      zero: true,
      locale: es,
    },
  )
}

function GamingCard({
  state,
  sessionSeconds,
}: {
  state: State
  sessionSeconds: number
}) {
  const wrapper = 'ml-12 flex items-center gap-x-4 justify-between py-3'

  if (state.status === 'loading') {
    return (
      <div className={wrapper}>
        <p className="text-muted-foreground text-sm">Cargando…</p>
      </div>
    )
  }

  if (state.status === 'error' || !state.data) {
    return (
      <div className={wrapper}>
        <p className="text-muted-foreground text-sm">
          No hay juegos para mostrar
        </p>
      </div>
    )
  }

  const { game, playtimeForever, isPlaying, playedAt } = state.data
  const displayPlaytime = isPlaying
    ? formatSessionTime(sessionSeconds)
    : formatPlaytime(playtimeForever)

  return (
    <div className={wrapper}>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <span>{game}</span>
        <span className="text-muted-foreground/80">{displayPlaytime}</span>
      </div>
      <span className="text-muted-foreground/40 shrink-0 self-start text-sm tabular-nums">
        {isPlaying ? 'Ahora' : formatDateShort(playedAt)}
      </span>
    </div>
  )
}

const SESSION_START_KEY_PREFIX = 'steam-session-start:'

function getSessionKey(game: string) {
  return `${SESSION_START_KEY_PREFIX}${encodeURIComponent(game)}`
}

export default function NowGaming() {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [sessionSeconds, setSessionSeconds] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const response = await fetch('/api/now-gaming')
        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const data: NowGamingData = await response.json()

        if (!cancelled) {
          setState({ status: 'success', data })
        }
      } catch {
        if (!cancelled) {
          setState({ status: 'error' })
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  const isPlaying = state.status === 'success' && state.data.isPlaying
  const currentGame = state.status === 'success' ? state.data.game : null

  useEffect(() => {
    if (state.status !== 'success') return

    if (!isPlaying || !currentGame) {
      if (currentGame) {
        window.localStorage.removeItem(getSessionKey(currentGame))
      }
      setSessionSeconds(0)
      return
    }

    const sessionKey = getSessionKey(currentGame)
    const cachedStart = Number(window.localStorage.getItem(sessionKey) ?? '0')
    const startAt = cachedStart > 0 ? cachedStart : Date.now()

    if (cachedStart <= 0) {
      window.localStorage.setItem(sessionKey, String(startAt))
    }

    const tick = () => {
      const elapsedSeconds = Math.floor((Date.now() - startAt) / 1000)
      setSessionSeconds(elapsedSeconds)
    }

    tick()
    const interval = window.setInterval(tick, 1000)

    return () => window.clearInterval(interval)
  }, [state.status, isPlaying, currentGame])

  return (
    <div className="relative overflow-hidden border-t">
      <span className="text-muted-foreground/80 pointer-events-none absolute top-3.5 select-none">
        <GamepadAnimation playing={isPlaying} />
      </span>
      <GamingCard state={state} sessionSeconds={sessionSeconds} />
    </div>
  )
}
