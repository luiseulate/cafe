import { useState, useEffect } from 'react'
import AudioLines from '@/components/audio-lines'
import { formatDateShort } from '@/lib/utils'

interface NowListeningData {
  isPlaying: boolean
  track: string
  artist: string
  playedAt: string | null
}

type State =
  | { status: 'loading' }
  | { status: 'success'; data: NowListeningData }
  | { status: 'error' }

function Row({ state }: { state: State }) {
  const base =
    'relative ml-16 flex items-center justify-between border-b py-3 last:border-b-0'

  if (state.status === 'loading') {
    return (
      <div className={base}>
        <p className="text-muted-foreground text-sm">Cargando…</p>
      </div>
    )
  }

  if (state.status === 'error' || !state.data.track) {
    return (
      <div className={base}>
        <p className="text-muted-foreground text-sm">Nada por ahora</p>
      </div>
    )
  }

  const { track, artist, isPlaying, playedAt } = state.data

  return (
    <div className={base}>
      <p className="text-sm">{track}</p>
      <span className="text-muted-foreground/40 shrink-0 text-sm tabular-nums">
        {isPlaying ? artist : formatDateShort(playedAt)}
      </span>
    </div>
  )
}

export default function NowListening() {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/now-listening')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: NowListeningData = await res.json()
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
      <h2>Música</h2>

      <div className="group/posts">
        <div className="relative overflow-hidden border-t">
          <span className="text-muted-foreground pointer-events-none absolute top-3 text-sm tabular-nums select-none">
            <AudioLines playing={isPlaying} />
          </span>
          <Row state={state} />
        </div>
      </div>
    </section>
  )
}
