import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useScrollLock } from '../hooks/useScrollLock'
import { btnSecondary } from '../styles/ui'
import { LoginForm } from './LoginForm'

type LoginModalProps = {
  open: boolean
  onClose: () => void
}

export function LoginModal({ open, onClose }: LoginModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[1px]"
        aria-label="Login schließen"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="login-modal-title" className="text-xl font-semibold text-text-heading">
              Anmelden
            </h2>
            <p className="mt-1 text-sm text-text">
              Melde dich mit deiner E-Mail an oder lege ein neues Konto an.
            </p>
          </div>
          <button type="button" className={btnSecondary} onClick={onClose}>
            Schließen
          </button>
        </div>
        <LoginForm compact onSuccess={onClose} />
      </div>
    </div>,
    document.body,
  )
}
