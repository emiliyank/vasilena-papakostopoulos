import type { Locale } from "@/lib/i18n/config";

export function homePath(locale: Locale): string {
  return `/${locale}`;
}

export function projectPath(locale: Locale, slug: string): string {
  return `/${locale}/projects/${slug}`;
}

export function blogPath(locale: Locale): string {
  return `/${locale}/blog`;
}

export function blogPostPath(locale: Locale, slug: string): string {
  return `/${locale}/blog/${slug}`;
}

export function pricesPath(locale: Locale): string {
  return `/${locale}/prices`;
}

export function sectionPath(
  locale: Locale,
  section: "about" | "services" | "portfolio" | "contact",
): string {
  return `/${locale}#${section}`;
}

/** Swap locale while preserving the rest of the pathname. */
export function switchLocalePath(pathname: string, nextLocale: Locale): string {
  const segments = pathname.split("/");
  if (segments.length > 1) {
    segments[1] = nextLocale;
    return segments.join("/") || `/${nextLocale}`;
  }
  return `/${nextLocale}`;
}
