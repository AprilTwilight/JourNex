import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../auth/useAuth'
import { DEMO_ACCOUNTS, roleHomePath } from '../auth/session'
import { useApiAction } from '../hooks/useApiAction'
import { btnPrimary, inputClass, panelClass } from '../styles/ui'
import { friendlyApiError } from '../utils/scooterDisplay'

type LoginFormProps = {
  compact?: boolean
  onSuccess?: () => void
  showRegisterLink?: boolean
  showDemoAccounts?: boolean
}

export function LoginForm({
  compact = false,
  onSuccess,
  showRegisterLink = true,
  showDemoAccounts = true,
}: LoginFormProps) {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { loading, error, run } = useApiAction()
  const [mailAddress, setMailAddress] = useState('')

  const submitLogin = () => {
    run('POST /api/accounts/login', async () => {
      const person = await api.accounts.login({ mailAddress })
      login(person)
      onSuccess?.()
      navigate(roleHomePath(person.role))
      return person
    })
  }

  const fillDemoEmail = (email: string) => {
    setMailAddress(email)
  }

  const displayError = error ? friendlyApiError(error) : null

  return (
    <div className={compact ? 'space-y-4' : panelClass}>
      {!compact && (
        <h2 className="text-lg font-semibold text-text-heading">Anmelden</h2>
      )}

      {displayError && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {displayError.includes('ACCOUNT_NOT_FOUND')
            ? 'Kein Konto mit dieser E-Mail gefunden.'
            : displayError}
        </div>
      )}

      <label className="block text-sm font-medium text-text">
        E-Mail
        <input
          className={`${inputClass} mt-1`}
          type="email"
          value={mailAddress}
          placeholder="name@beispiel.de"
          autoComplete="email"
          onChange={(e) => setMailAddress(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submitLogin()
          }}
        />
      </label>

      <button
        type="button"
        className={`${btnPrimary} w-full`}
        onClick={submitLogin}
        disabled={loading || !mailAddress.trim()}
      >
        {loading ? 'Wird angemeldet …' : 'Anmelden'}
      </button>

      {showRegisterLink && (
        <p className="text-center text-sm text-text">
          Noch kein Konto?{' '}
          <Link to="/registrieren" className="font-medium text-brand-700 underline">
            Jetzt registrieren
          </Link>
        </p>
      )}

      {showDemoAccounts && (
        <div className="rounded-xl border border-border bg-surface-muted px-4 py-3">
          <p className="text-sm font-medium text-text-heading">Demo-Zugänge</p>
          <ul className="mt-2 space-y-2">
            {DEMO_ACCOUNTS.map((account) => (
              <li key={account.email}>
                <button
                  type="button"
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-left text-sm transition hover:border-brand-500"
                  onClick={() => fillDemoEmail(account.email)}
                >
                  <span className="font-medium text-text-heading">{account.role}</span>
                  <span className="mt-0.5 block text-text">{account.hint}</span>
                  <span className="mt-0.5 block font-mono text-xs text-brand-700">
                    {account.email}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
