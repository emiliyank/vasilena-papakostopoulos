import { Container } from "@/components/ui/Container";
import { getLocalizedValue, type Locale } from "@/lib/i18n/config";
import type { AppDictionary } from "@/lib/i18n/dictionaries";
import type { Service } from "@/types/content";

type ServicesProps = {
  locale: Locale;
  services: Service[];
  dictionary: AppDictionary;
};

export function Services({ locale, services, dictionary }: ServicesProps) {
  return (
    <section id="services" className="scroll-mt-24 border-y border-[var(--color-line)] bg-[var(--color-surface)] py-20 sm:py-28">
      <Container>
        <h2 className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-ink)] sm:text-5xl">
          {dictionary.services.heading}
        </h2>

        <div className="mt-12 divide-y divide-[var(--color-line)]">
          {services.map((service) => (
            <article key={service.id} className="grid gap-4 py-8 md:grid-cols-[0.35fr_0.65fr] md:gap-10">
              <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
                {getLocalizedValue(service.title, locale)}
              </h3>
              <div className="space-y-3">
                <p className="text-base text-[var(--color-ink)]">
                  {getLocalizedValue(service.shortDescription, locale)}
                </p>
                {getLocalizedValue(service.fullDescription, locale)
                  .split("\n\n")
                  .map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 24)}
                      className="text-sm leading-relaxed text-[var(--color-muted)]"
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
