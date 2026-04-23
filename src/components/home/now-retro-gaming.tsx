import { useState, useEffect } from 'react'
import { Gamepad2 } from 'lucide-react'
import type { NowRetroGamingData } from '@/pages/api/now-retro-gaming'
import { formatDateShort } from '@/lib/utils'

type State =
  | { status: 'loading' }
  | { status: 'success'; data: NowRetroGamingData }
  | { status: 'error' }

function RetroGamingCard({ state }: { state: State }) {
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

  const { title, console, lastPlayed } = state.data

  return (
    <div className={wrapper}>
      <div className="flex flex-wrap items-center gap-x-2 text-sm">
        <span>{title}</span>
        <span className="text-muted-foreground/80">{console}</span>
      </div>
      <span className="text-muted-foreground/40 shrink-0 self-start text-sm tabular-nums">
        {formatDateShort(lastPlayed)}
      </span>
    </div>
  )
}

export default function NowRetroGaming() {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const response = await fetch('/api/now-retro-gaming')
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data: NowRetroGamingData = await response.json()
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

  return (
    <div className="relative overflow-hidden border-t">
      <span className="text-muted-foreground pointer-events-none absolute top-3 select-none">
        <Gamepad2 className="size-5" strokeWidth={1.5} />
      </span>
      <RetroGamingCard state={state} />
    </div>
  )
}
