import { panelClass } from '../styles/ui'

type ResultPanelProps = {
  lastAction: string
  lastResult: unknown
}

export function ResultPanel({ lastAction, lastResult }: ResultPanelProps) {
  return (
    <section className={panelClass}>
      <h2 className="text-lg font-semibold text-text-heading">
        Letzte API-Antwort
      </h2>
      <p className="mt-1 text-sm text-text">{lastAction || 'Noch keine Anfrage'}</p>
      <pre className="mt-4 max-h-80 overflow-auto rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
        {lastResult ? JSON.stringify(lastResult, null, 2) : '—'}
      </pre>
    </section>
  )
}
