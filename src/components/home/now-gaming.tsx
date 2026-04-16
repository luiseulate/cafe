import { useState, useEffect } from 'react'
import { formatDateShort } from '@/lib/utils'
import type { NowGamingData } from '@/pages/api/now-gaming'
import GamepadAnimation from '@/components/gamepad-animation'

type State =
  | { status: 'loading' }
  | { status: 'success'; data: NowGamingData }
  | { status: 'error' }

function GamingCard({ state }: { state: State }) {
  const wrapper =
    'relative ml-12 flex items-center justify-between border-b py-3 last:border-b-0'

  if (state.status === 'loading') {
    return (
      <div className={wrapper}>
        <p className="text-muted-foreground text-sm">Cargando…</p>
      </div>
    )
  }

  if (state.status === 'error' || !state.data.game) {
    return (
      <div className={wrapper}>
        <p className="text-muted-foreground text-sm">
          No hay juegos para mostrar
        </p>
      </div>
    )
  }

  const { game, developer, isPlaying, playedAt } = state.data

  return (
    <div className={wrapper}>
      <div className="flex flex-wrap items-center gap-x-2 text-sm">
        <span>{game}</span>
        {!isPlaying && (
          <span className="text-muted-foreground/80">{developer}</span>
        )}
      </div>
      <span className="text-muted-foreground/40 shrink-0 text-sm tabular-nums">
        {isPlaying ? developer : formatDateShort(playedAt)}
      </span>
    </div>
  )
}

export default function NowGaming() {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/now-gaming')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: NowGamingData = await res.json()
        if (!cancelled) setState({ status: 'success', data })
      } catch {
        if (!cancelled) setState({ status: 'error' })
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  const isPlaying = state.status === 'success' && state.data.isPlaying

  return (
    <section className="flex flex-col gap-2">
      <h2>Videojuegos</h2>

      <div className="group/posts">
        <div className="relative overflow-hidden border-t">
          <span className="text-muted-foreground pointer-events-none absolute top-3 select-none">
            <GamepadAnimation playing={isPlaying} />
          </span>
          <GamingCard state={state} />
        </div>
      </div>
    </section>
  )
}
