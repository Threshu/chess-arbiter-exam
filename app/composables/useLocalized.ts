import { localized } from '~/utils/localized'
import type { Bilingual } from '~~/shared/types/question'
import type { Locale } from '~~/shared/types/user'

export function useLocalized() {
  const { locale } = useI18n()

  function l<T>(value: Bilingual<T> | undefined | null): T | '' {
    return localized(value, locale.value as Locale)
  }

  return { l, locale }
}
