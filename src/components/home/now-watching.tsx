import { useState, useEffect } from 'react'
import { Clapperboard } from 'lucide-react'
import { StarsRating } from '@/components/ui/rating'
import type { NowWatchingData } from '@/pages/api/now-watching'
import { formatDateShort } from '@/lib/utils'

type State =
  | { status: 'loading' }
  | { status: 'success'; data: NowWatchingData }
  | { status: 'error' }

function WatchingCard({ state }: { state: State }) {
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
          No hay películas para mostrar
        </p>
      </div>
    )
  }

  const { title, date, rating } = state.data

  return (
    <div className={wrapper}>
      <div className="flex flex-wrap items-center gap-x-2 text-sm">
        <span>{title}</span>
        <StarsRating rating={rating} />
      </div>
      <span className="text-muted-foreground/40 shrink-0 self-start text-sm tabular-nums">
        {formatDateShort(date)}
      </span>
    </div>
  )
}

export default function NowWatching() {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const response = await fetch('/api/now-watching')
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data: NowWatchingData = await response.json()
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
      <span className="text-muted-foreground pointer-events-none absolute top-3.5 select-none">
        <Clapperboard className="size-4" strokeWidth={1.5} />
      </span>
      <WatchingCard state={state} />
    </div>
  )
}
