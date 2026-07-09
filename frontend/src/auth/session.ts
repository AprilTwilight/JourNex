import type { PersonDto } from '../types/api'

export type AppRole = 'Customer' | 'Flottenmanager' | 'Service'

const SESSION_KEY = 'easyscoot-user'

export function roleHomePath(role: string): string {
  switch (role) {
    case 'Customer':
      return '/kunde'
    case 'Flottenmanager':
      return '/flottenmanager'
    case 'Service':
      return '/service'
    default:
      return '/login'
  }
}

export function roleLabel(role: string): string {
  switch (role) {
    case 'Customer':
      return 'Kunde'
    case 'Flottenmanager':
      return 'Flottenmanager'
    case 'Service':
      return 'Servicemitarbeiter'
    default:
      return role
  }
}

export function loadSession(): PersonDto | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PersonDto
  } catch {
    return null
  }
}

export function saveSession(user: PersonDto): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}

export const DEMO_ACCOUNTS = [
  {
    role: 'Kunde',
    email: 'leo.meiner@gmx.de',
    hint: 'Leo Meiner',
  },
  {
    role: 'Flottenmanager',
    email: 'max.mustermann@gmx.de',
    hint: 'Max Mustermann',
  },
  {
    role: 'Servicemitarbeiter',
    email: 'sarah.musterfrau@gmx.de',
    hint: 'Sarah Musterfrau',
  },
] as const
