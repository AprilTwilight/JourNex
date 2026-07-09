import { panelClass } from '../styles/ui'

type ApiErrorPanelProps = {
  error: string
  details?: unknown
}

export function ApiErrorPanel({ error, details }: ApiErrorPanelProps) {
  return (
    <section className={`${panelClass} border-red-200 bg-red-50`}>
      <h2 className="text-lg font-semibold text-red-900">Fehlerdetails</h2>
      <p className="mt-2 text-sm text-red-800">{error}</p>
      {details != null && (
        <pre className="mt-4 max-h-60 overflow-auto rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
          {JSON.stringify(details, null, 2)}
        </pre>
      )}
    </section>
  )
}
