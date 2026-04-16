import { useState, useEffect } from 'react'
import { formatDateShort } from '@/lib/utils'
import type { NowCollectionData } from '@/pages/api/now-collection'
import { IGDB_GAMES } from '@/consts'

type State =
  | { status: 'loading' }
  | { status: 'success'; data: NowCollectionData[] }
  | { status: 'error' }

function GameCard({ game }: { game: NowCollectionData }) {
  return (
    <div className="relative ml-12 flex flex-wrap items-center justify-between border-b py-3 last:border-b-0">
      <div className="flex flex-wrap items-center gap-x-2 text-sm">
        <span>{game.name}</span>
        {game.developer && (
          <span className="text-muted-foreground/80">{game.developer}</span>
        )}
      </div>
      <span className="text-muted-foreground/40 shrink-0 text-sm tabular-nums">
        {formatDateShort(game.releaseDate)}
      </span>
    </div>
  )
}

function GameList({ state }: { state: State }) {
  const wrapper = 'relative overflow-hidden border-t'

  if (state.status === 'loading') {
    return (
      <div className={wrapper}>
        <p className="text-muted-foreground py-3 text-sm">Cargando…</p>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className={wrapper}>
        <p className="text-muted-foreground py-3 text-sm">
          Error al cargar la colección
        </p>
      </div>
    )
  }

  const gamesByYear: Record<string, NowCollectionData[]> = {}
  for (const game of state.data) {
    const year = game.releaseDate
      ? new Date(game.releaseDate).getFullYear().toString()
      : 'Desconocido'
    if (!gamesByYear[year]) gamesByYear[year] = []
    gamesByYear[year].push(game)
  }
  const years = Object.keys(gamesByYear).sort((a, b) => Number(b) - Number(a))

  return (
    <>
      {years.map((year) => (
        <div key={year} className={wrapper}>
          <span className="text-muted-foreground pointer-events-none absolute top-3 text-sm tabular-nums select-none">
            {year}
          </span>
          <div>
            {gamesByYear[year].map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

export default function NowCollection() {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const response = await fetch('/api/now-collection')
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data: NowCollectionData[] = await response.json()
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
    <section className="flex flex-col gap-2">
      <h2>
        Nintendo Switch{' '}
        <span className="text-muted-foreground/40">
          ({IGDB_GAMES[0].switch.ids.length})
        </span>
      </h2>
      <div className="group/posts">
        <GameList state={state} />
      </div>
    </section>
  )
}
