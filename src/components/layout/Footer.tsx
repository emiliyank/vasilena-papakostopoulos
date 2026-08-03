import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { getLocalizedValue, type Locale } from "@/lib/i18n/config";
import type { AppDictionary } from "@/lib/i18n/dictionaries";
import { blogPath, homePath, pricesPath, sectionPath } from "@/lib/i18n/paths";
import type { SiteSettings } from "@/types/content";

type FooterProps = {
  locale: Locale;
  settings: SiteSettings;
  dictionary: AppDictionary;
};

export function Footer({ locale, settings, dictionary }: FooterProps) {
  const location = getLocalizedValue(settings.location, locale);

  return (
    <footer className="mt-auto border-t border-[var(--color-line)] bg-[var(--color-surface)]">
      <Container className="grid gap-10 py-14 sm:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
            {settings.brandName}
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--color-muted)]">
            {getLocalizedValue(settings.heroSubheading, locale)}
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-3 text-sm">
            <a
              href={`tel:${settings.phone.replace(/\s+/g, "")}`}
              className="block text-[var(--color-ink)] transition-opacity hover:opacity-70"
            >
              {settings.phone}
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="block text-[var(--color-ink)] transition-opacity hover:opacity-70"
            >
              {settings.email}
            </a>
            <p className="text-[var(--color-muted)]">{location}</p>
            <div className="flex gap-4 pt-2">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--color-ink)] transition-opacity hover:opacity-70"
              >
                Instagram
              </a>
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--color-ink)] transition-opacity hover:opacity-70"
              >
                Facebook
              </a>
            </div>
          </div>

          <nav className="flex flex-col gap-2 text-sm" aria-label="Footer">
            <Link href={sectionPath(locale, "about")} className="hover:opacity-70">
              {dictionary.nav.about}
            </Link>
            <Link href={sectionPath(locale, "portfolio")} className="hover:opacity-70">
              {dictionary.nav.portfolio}
            </Link>
            <Link href={blogPath(locale)} className="hover:opacity-70">
              {dictionary.nav.blog}
            </Link>
            <Link href={pricesPath(locale)} className="hover:opacity-70">
              {dictionary.nav.prices}
            </Link>
            <Link href={homePath(locale)} className="hover:opacity-70">
              {dictionary.footer.backToTop}
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
