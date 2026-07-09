import { createContext } from 'react'
import type { PersonDto } from '../types/api'

export type AuthContextValue = {
  user: PersonDto | null
  login: (user: PersonDto) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
