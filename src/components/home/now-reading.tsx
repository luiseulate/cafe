import { useState, useEffect } from 'react'
import BookAnimation from '@/components/book-animation'
import type { NowReadingData } from '@/pages/api/now-reading'
import { formatDateShort } from '@/lib/utils'

type State =
  | { status: 'loading' }
  | { status: 'success'; data: NowReadingData }
  | { status: 'error' }

function ReadingCard({ state }: { state: State }) {
  const wrapper = 'ml-12 flex items-center gap-x-4 justify-between py-3'

  if (state.status === 'loading') {
    return (
      <div className={wrapper}>
        <p className="text-muted-foreground text-sm">Cargando…</p>
      </div>
    )
  }

  if (state.status === 'error' || !state.data.book) {
    return (
      <div className={wrapper}>
        <p className="text-muted-foreground text-sm">
          No hay libros para mostrar
        </p>
      </div>
    )
  }

  const { book, author, isReading, readAt } = state.data

  return (
    <div className={wrapper}>
      <div className="flex flex-wrap items-center gap-x-2 text-sm">
        <span>{book}</span>
        <span className="text-muted-foreground/80">{author}</span>
      </div>
      <span className="text-muted-foreground/40 shrink-0 self-start text-sm tabular-nums">
        {isReading ? 'Ahora' : formatDateShort(readAt)}
      </span>
    </div>
  )
}

export default function NowReading() {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const response = await fetch('/api/now-reading')
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data: NowReadingData = await response.json()
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

  const isReading = state.status === 'success' && state.data.isReading

  return (
    <div className="relative overflow-hidden border-t">
      <span className="text-muted-foreground pointer-events-none absolute top-3 select-none">
        <BookAnimation reading={isReading} />
      </span>
      <ReadingCard state={state} />
    </div>
  )
}
