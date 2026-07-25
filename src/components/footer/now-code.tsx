import { useEffect, useState } from 'react'
import { formatDateLong } from '@/lib/utils'
import type { NowCodeData } from '@/pages/api/now-code'

type State =
  | { status: 'loading' }
  | { status: 'success'; data: NowCodeData }
  | { status: 'error' }

function CodeCard({ state }: { state: State }) {
  if (state.status === 'loading') {
    return <span className="text-muted-foreground/40 text-xs">Cargando…</span>
  }

  if (state.status === 'error' || !state.data) {
    return (
      <span className="text-muted-foreground/40 text-xs">No hay datos</span>
    )
  }

  const { pushedAt } = state.data
  const formattedDate = pushedAt ? formatDateLong(new Date(pushedAt)) : '—'

  return (
    <span className="text-muted-foreground/40 text-xs">
      Última actualización: {formattedDate}
    </span>
  )
}

export default function NowCode() {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const response = await fetch('/api/now-code')
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data: NowCodeData = await response.json()
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

  return <CodeCard state={state} />
}
