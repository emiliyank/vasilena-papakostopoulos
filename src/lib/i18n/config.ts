import { defaultLocale, isLocale, locales, type Locale } from "@/types/locale";

export { defaultLocale, isLocale, locales, type Locale };

function isMissingLocalizedValue(value: unknown): boolean {
  return value === undefined || value === null || value === "";
}

export function getLocalizedValue<T>(
  values: Record<Locale, T>,
  locale: Locale,
  fallback: Locale = defaultLocale,
): T {
  const primary = values[locale];
  if (!isMissingLocalizedValue(primary)) {
    return primary;
  }
  return values[fallback];
}
