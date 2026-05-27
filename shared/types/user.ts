export type Role = 'student' | 'admin'

export type Locale = 'pl' | 'en'

export interface UserStats {
  attempts: number
  correct: number
}

export interface User {
  email: string
  displayName: string
  photoURL: string | null
  locale: Locale
  role: Role
  stats: UserStats
  createdAt: unknown
  lastLoginAt: unknown
}
