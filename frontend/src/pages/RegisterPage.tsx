import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import type { CreateAccountRequest } from '../types/api'
import { useAuth } from '../auth/useAuth'
import { ErrorBanner } from '../components/ErrorBanner'
import { Layout } from '../components/Layout'
import { useApiAction } from '../hooks/useApiAction'
import { btnPrimary, inputClass, panelClass } from '../styles/ui'

const defaultAccount: CreateAccountRequest = {
  firstName: '',
  name: '',
  mailAddress: '',
  address: {
    street: '',
    number: 0,
    postalCode: 0,
    city: '',
  },
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { loading, error, run } = useApiAction()
  const [account, setAccount] = useState(defaultAccount)

  const updateAddress = <K extends keyof CreateAccountRequest['address']>(
    field: K,
    value: CreateAccountRequest['address'][K],
  ) => {
    setAccount((current) => ({
      ...current,
      address: { ...current.address, [field]: value },
    }))
  }

  const createAccount = () =>
    run('POST /api/accounts', async () => {
      const person = await api.accounts.create(account)
      login(person)
      navigate('/kunde')
      return person
    })

  return (
    <Layout
      title="Kundenregistrierung"
      subtitle="Lege ein Kundenkonto an, um Scooter zu mieten."
    >
      {error && <ErrorBanner error={error} />}

      <section className={panelClass}>
        <h2 className="text-lg font-semibold text-text-heading">Kundenkonto</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium text-text">
            Vorname
            <input
              className={inputClass}
              value={account.firstName}
              placeholder="Vorname"
              onChange={(e) =>
                setAccount({ ...account, firstName: e.target.value })
              }
            />
          </label>
          <label className="text-sm font-medium text-text">
            Nachname
            <input
              className={inputClass}
              value={account.name}
              placeholder="Nachname"
              onChange={(e) => setAccount({ ...account, name: e.target.value })}
            />
          </label>
          <label className="text-sm font-medium text-text sm:col-span-2">
            E-Mail
            <input
              className={inputClass}
              type="email"
              value={account.mailAddress}
              placeholder="name@beispiel.de"
              onChange={(e) =>
                setAccount({ ...account, mailAddress: e.target.value })
              }
            />
          </label>

          <p className="text-sm font-medium text-text-heading sm:col-span-2">
            Wohnadresse
          </p>

          <label className="text-sm font-medium text-text sm:col-span-2">
            Straße
            <input
              className={inputClass}
              value={account.address.street}
              placeholder="Straße"
              onChange={(e) => updateAddress('street', e.target.value)}
            />
          </label>
          <label className="text-sm font-medium text-text">
            Hausnummer
            <input
              className={inputClass}
              type="number"
              min={0}
              value={account.address.number || ''}
              placeholder="12"
              onChange={(e) => updateAddress('number', Number(e.target.value))}
            />
          </label>
          <label className="text-sm font-medium text-text">
            Postleitzahl
            <input
              className={inputClass}
              type="number"
              min={0}
              value={account.address.postalCode || ''}
              placeholder="30926"
              onChange={(e) =>
                updateAddress('postalCode', Number(e.target.value))
              }
            />
          </label>
          <label className="text-sm font-medium text-text sm:col-span-2">
            Ort
            <input
              className={inputClass}
              value={account.address.city}
              placeholder="Stadt"
              onChange={(e) => updateAddress('city', e.target.value)}
            />
          </label>
        </div>

        <button
          type="button"
          className={`${btnPrimary} mt-4`}
          onClick={createAccount}
          disabled={loading}
        >
          {loading ? 'Wird angelegt …' : 'Konto anlegen'}
        </button>

        <p className="mt-4 text-center text-sm text-text">
          Bereits registriert?{' '}
          <Link to="/login" className="font-medium text-brand-700 underline">
            Zum Login
          </Link>
        </p>
      </section>
    </Layout>
  )
}
