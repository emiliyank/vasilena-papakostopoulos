"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { locales, type Locale } from "@/lib/i18n/config";
import type { AppDictionary } from "@/lib/i18n/dictionaries";
import { switchLocalePath } from "@/lib/i18n/paths";

type LanguageSwitcherProps = {
  locale: Locale;
  dictionary: AppDictionary["language"];
};

export function LanguageSwitcher({ locale, dictionary }: LanguageSwitcherProps) {
  const pathname = usePathname() || `/${locale}`;

  return (
    <div
      className="flex items-center gap-2 text-xs tracking-[0.14em] uppercase"
      role="group"
      aria-label={dictionary.label}
    >
      {locales.map((item) => {
        const active = item === locale;
        return (
          <Link
            key={item}
            href={switchLocalePath(pathname, item)}
            hrefLang={item}
            aria-current={active ? "true" : undefined}
            className={
              active
                ? "text-[var(--color-ink)]"
                : "text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
            }
          >
            {dictionary[item]}
          </Link>
        );
      })}
    </div>
  );
}
