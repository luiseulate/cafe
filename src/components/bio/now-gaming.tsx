import { useState, useEffect } from 'react'
import { formatDateShort } from '@/lib/utils'
import type { NowGamingData } from '@/pages/api/now-gaming'
import { GamepadAnimation } from '@/components/icon-animations'

type State =
  | { status: 'loading' }
  | { status: 'success'; data: NowGamingData }
  | { status: 'error' }

function GamingCard({ state }: { state: State }) {
  const wrapper = 'ml-12 flex items-center gap-x-4 justify-between py-3'

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
        <span className="text-muted-foreground/40">{developer}</span>
      </div>
      <span className="text-muted-foreground/40 shrink-0 self-start text-sm tabular-nums">
        {isPlaying ? 'Ahora' : formatDateShort(playedAt)}
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
        const response = await fetch('/api/now-gaming')
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data: NowGamingData = await response.json()
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
    <div className="relative overflow-hidden border-t">
      <span className="text-muted-foreground pointer-events-none absolute top-3.5 select-none">
        <GamepadAnimation playing={isPlaying} />
      </span>
      <GamingCard state={state} />
    </div>
  )
}
