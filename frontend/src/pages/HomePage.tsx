import { useState } from 'react'
import { LoginModal } from '../components/LoginModal'
import { btnPrimary } from '../styles/ui'

export function HomePage() {
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-8">
      <header className="max-w-lg text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-brand-600">
          EasyScoot
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-text-heading">
          E-Scooter Sharing
        </h1>
        <p className="mt-3 text-sm text-text">
          Scooter mieten, Flotte verwalten oder Wartung durchführen – alles über
          ein persönliches Konto.
        </p>
      </header>

      <button
        type="button"
        className={`${btnPrimary} px-8 py-3 text-base`}
        onClick={() => setLoginOpen(true)}
      >
        Zum Login
      </button>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  )
}
