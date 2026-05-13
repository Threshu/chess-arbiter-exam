import type { Bilingual } from '~~/shared/types/question'
import type { Locale } from '~~/shared/types/user'

export function localized<T>(value: Bilingual<T> | undefined | null, locale: Locale): T | '' {
  if (!value) return '' as T | ''
  const primary = value[locale]
  if (primary !== undefined && primary !== null && primary !== '') return primary
  const fallback = locale === 'pl' ? value.en : value.pl
  return fallback ?? ('' as T | '')
}
