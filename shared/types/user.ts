export type Role = 'student' | 'admin'

export type Locale = 'pl' | 'en'

export interface User {
  email: string
  displayName: string
  photoURL: string | null
  locale: Locale
  role: Role
  createdAt: unknown
  lastLoginAt: unknown
}
