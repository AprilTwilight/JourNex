import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { PersonDto } from '../types/api'
import { AuthContext } from './authContext'
import { clearSession, loadSession, saveSession } from './session'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PersonDto | null>(() => loadSession())

  const login = useCallback((nextUser: PersonDto) => {
    saveSession(nextUser)
    setUser(nextUser)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, login, logout }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
