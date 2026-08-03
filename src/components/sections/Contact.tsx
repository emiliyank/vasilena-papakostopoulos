import { ContactForm } from "@/components/sections/ContactForm";
import { Container } from "@/components/ui/Container";
import { getLocalizedValue, type Locale } from "@/lib/i18n/config";
import type { AppDictionary } from "@/lib/i18n/dictionaries";
import type { SiteSettings } from "@/types/content";

type ContactProps = {
  locale: Locale;
  settings: SiteSettings;
  dictionary: AppDictionary;
};

export function Contact({ locale, settings, dictionary }: ContactProps) {
  const heading = getLocalizedValue(settings.contactHeading, locale);
  const intro = getLocalizedValue(settings.contactIntro, locale);

  return (
    <section id="contact" className="scroll-mt-24 border-t border-[var(--color-line)] py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <h2 className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-ink)] sm:text-5xl">
            {heading}
          </h2>
          <p className="max-w-md text-base leading-relaxed text-[var(--color-muted)]">{intro}</p>
          <div className="space-y-2 pt-4 text-sm text-[var(--color-ink)]">
            <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="block hover:opacity-70">
              {settings.phone}
            </a>
            <a href={`mailto:${settings.email}`} className="block hover:opacity-70">
              {settings.email}
            </a>
            <p className="text-[var(--color-muted)]">
              {getLocalizedValue(settings.location, locale)}
            </p>
          </div>
        </div>

        <ContactForm dictionary={dictionary} />
      </Container>
    </section>
  );
}
