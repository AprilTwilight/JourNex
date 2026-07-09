import { Link } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <header className="max-w-md text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-brand-600">
          EasyScoot
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-text-heading">
          Willkommen
        </h1>
        <p className="mt-3 text-sm text-text">
          Melde dich an oder lege ein neues Kundenkonto an.
        </p>
      </header>

      <div className="w-full max-w-md">
        <LoginForm />
      </div>

      <Link
        to="/home"
        className="text-sm text-text underline transition hover:text-brand-700"
      >
        Zur Info-Seite
      </Link>
    </div>
  )
}
