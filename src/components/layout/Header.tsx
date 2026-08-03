"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/config";
import type { AppDictionary } from "@/lib/i18n/dictionaries";
import { blogPath, homePath, pricesPath, sectionPath } from "@/lib/i18n/paths";

type HeaderProps = {
  locale: Locale;
  brandName: string;
  dictionary: AppDictionary;
  surveyUrl: string;
};

export function Header({ locale, brandName, dictionary, surveyUrl }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { href: sectionPath(locale, "about"), label: dictionary.nav.about },
    { href: sectionPath(locale, "services"), label: dictionary.nav.services },
    { href: sectionPath(locale, "portfolio"), label: dictionary.nav.portfolio },
    { href: sectionPath(locale, "contact"), label: dictionary.nav.contact },
    { href: blogPath(locale), label: dictionary.nav.blog },
    { href: pricesPath(locale), label: dictionary.nav.prices },
    { href: surveyUrl, label: dictionary.nav.survey, external: true },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-bg)_92%,transparent)] backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link
          href={homePath(locale)}
          className="font-[family-name:var(--font-display)] text-lg tracking-[0.02em] text-[var(--color-ink)] sm:text-xl"
        >
          {brandName}
        </Link>

        <div className="flex items-center gap-4">
          <LanguageSwitcher locale={locale} dictionary={dictionary.language} />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border border-[var(--color-line)] text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)]"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? dictionary.nav.closeMenu : dictionary.nav.openMenu}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">
              {open ? dictionary.nav.closeMenu : dictionary.nav.openMenu}
            </span>
            <span aria-hidden className="flex w-4 flex-col gap-1.5">
              <span
                className={`h-px w-full bg-current transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
              />
              <span className={`h-px w-full bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
              <span
                className={`h-px w-full bg-current transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </Container>

      <div
        id={menuId}
        hidden={!open}
        className="border-t border-[var(--color-line)] bg-[var(--color-bg)]"
      >
        <Container as="nav" className="flex flex-col gap-1 py-6" aria-label="Primary">
          {links.map((link) =>
            "external" in link && link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="py-3 font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)] transition-opacity hover:opacity-70"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="py-3 font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)] transition-opacity hover:opacity-70"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ),
          )}
        </Container>
      </div>
    </header>
  );
}
