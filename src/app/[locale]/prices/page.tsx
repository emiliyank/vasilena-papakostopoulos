import { notFound } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { getPrices } from "@/lib/content";
import { getLocalizedValue, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type PricesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PricesPage({ params }: PricesPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;
  const dictionary = getDictionary(locale);
  const prices = await getPrices();

  return (
    <main>
      <Container className="py-16 sm:py-24">
        <h1 className="font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
          {dictionary.prices.heading}
        </h1>
        <ul className="mt-12 divide-y divide-[var(--color-line)]">
          {prices.map((item) => (
            <li key={item.id} className="grid gap-3 py-8 md:grid-cols-[1fr_auto]">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
                  {getLocalizedValue(item.name, locale)}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)]">
                  {getLocalizedValue(item.description, locale)}
                </p>
              </div>
              <p className="text-sm tracking-[0.08em] uppercase text-[var(--color-ink)]">
                {getLocalizedValue(item.priceDisplay, locale)}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
