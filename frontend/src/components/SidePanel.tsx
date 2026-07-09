import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useScrollLock } from '../hooks/useScrollLock'
import { btnSecondary } from '../styles/ui'

type SidePanelProps = {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
}

export function SidePanel({
  open,
  onClose,
  title,
  subtitle,
  children,
}: SidePanelProps) {
  useScrollLock(open)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[1px]"
        aria-label="Panel schließen"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="side-panel-title"
        className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-border bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 id="side-panel-title" className="text-lg font-semibold text-text-heading">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-sm text-text">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            className={btnSecondary}
            onClick={onClose}
            aria-label="Schließen (Escape)"
          >
            Schließen
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </div>,
    document.body,
  )
}
