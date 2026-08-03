import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getLocalizedValue, type Locale } from "@/lib/i18n/config";
import type { AppDictionary } from "@/lib/i18n/dictionaries";
import { sectionPath } from "@/lib/i18n/paths";
import type { SiteSettings } from "@/types/content";

type HeroProps = {
  locale: Locale;
  settings: SiteSettings;
  dictionary: AppDictionary;
};

export function Hero({ locale, settings, dictionary }: HeroProps) {
  const heading = getLocalizedValue(settings.heroHeading, locale);
  const subheading = getLocalizedValue(settings.heroSubheading, locale);
  const image = settings.heroImage;

  return (
    <section className="relative isolate min-h-[calc(100svh-5rem)] overflow-hidden bg-[var(--color-ink)] text-[var(--color-bg)]">
      {image ? (
        <Image
          src={image.src}
          alt={getLocalizedValue(image.alt, locale)}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/20" />

      <Container className="relative flex min-h-[calc(100svh-5rem)] flex-col justify-end pb-16 pt-28 sm:pb-24">
        <p className="mb-4 max-w-xl text-sm tracking-[0.18em] uppercase text-white/75 animate-[fade-up_0.8s_ease_both]">
          {settings.brandName}
        </p>
        <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-[-0.02em] text-white sm:text-7xl animate-[fade-up_0.9s_ease_both]">
          {heading}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg animate-[fade-up_1s_ease_both]">
          {subheading}
        </p>
        <div className="mt-10 animate-[fade-up_1.1s_ease_both]">
          <Button href={sectionPath(locale, "portfolio")} variant="ghost" className="border-white text-white hover:bg-white hover:text-[var(--color-ink)]">
            {dictionary.hero.cta}
          </Button>
        </div>
      </Container>
    </section>
  );
}
