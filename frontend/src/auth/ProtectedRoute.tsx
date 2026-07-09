import { Navigate, useLocation } from 'react-router-dom'
import { roleHomePath } from './session'
import { useAuth } from './useAuth'

type ProtectedRouteProps = {
  allowedRoles: string[]
  children: React.ReactNode
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={roleHomePath(user.role)} replace />
  }

  return children
}

type GuestRouteProps = {
  children: React.ReactNode
}

export function GuestRoute({ children }: GuestRouteProps) {
  const { user } = useAuth()

  if (user) {
    return <Navigate to={roleHomePath(user.role)} replace />
  }

  return children
}
