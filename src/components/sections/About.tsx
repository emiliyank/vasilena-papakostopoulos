import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { getLocalizedValue, type Locale } from "@/lib/i18n/config";
import type { SiteSettings } from "@/types/content";

type AboutProps = {
  locale: Locale;
  settings: SiteSettings;
};

export function About({ locale, settings }: AboutProps) {
  const heading = getLocalizedValue(settings.aboutHeading, locale);
  const summary = getLocalizedValue(settings.aboutSummary, locale);
  const body = getLocalizedValue(settings.aboutBody, locale);
  const image = settings.aboutImage;

  return (
    <section id="about" className="scroll-mt-24 py-20 sm:py-28">
      <Container className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="space-y-5">
          <h2 className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-ink)] sm:text-5xl">
            {heading}
          </h2>
          <p className="text-lg leading-relaxed text-[var(--color-ink)]">{summary}</p>
          {body.split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="text-base leading-relaxed text-[var(--color-muted)]">
              {paragraph}
            </p>
          ))}
        </div>

        {image ? (
          <div className="relative aspect-[5/4] overflow-hidden bg-[var(--color-surface)]">
            <Image
              src={image.src}
              alt={getLocalizedValue(image.alt, locale)}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
