import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { roleLabel } from '../auth/session'
import { btnSecondary } from '../styles/ui'

type LayoutProps = {
  role?: string
  title: string
  subtitle?: string
  children: ReactNode
}

export function Layout({ role, title, subtitle, children }: LayoutProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b border-border bg-white px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            {role ? (
              <p className="text-sm font-medium uppercase tracking-wide text-brand-600">
                EasyScoot · {role}
              </p>
            ) : (
              <p className="text-sm font-medium uppercase tracking-wide text-brand-600">
                EasyScoot
              </p>
            )}
            <h1 className="mt-1 text-2xl font-semibold text-text-heading sm:text-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm text-text">{subtitle}</p>
            )}
          </div>
          {user && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-right text-sm">
                <p className="font-medium text-text-heading">
                  {user.firstName} {user.name}
                </p>
                <p className="text-text">{roleLabel(user.role)}</p>
              </div>
              <button type="button" className={btnSecondary} onClick={handleLogout}>
                Abmelden
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-5 p-6">{children}</main>
    </div>
  )
}
