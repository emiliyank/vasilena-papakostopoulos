import { notFound } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPrices, getPricesPageContent } from "@/lib/content";
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
  const [pageContent, prices] = await Promise.all([
    getPricesPageContent(),
    getPrices(),
  ]);

  return (
    <main>
      <Container className="py-16 sm:py-24">
        <h1 className="font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
          {getLocalizedValue(pageContent.heading, locale)}
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--color-muted)]">
          {getLocalizedValue(pageContent.intro, locale)}
        </p>

        <div className="mt-10 max-w-xl border-t border-[var(--color-line)] pt-8">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">
            {getLocalizedValue(pageContent.paymentHeading, locale)}
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-[var(--color-muted)]">
            {pageContent.paymentTerms.map((term) => (
              <li key={getLocalizedValue(term, locale)}>
                {getLocalizedValue(term, locale)}
              </li>
            ))}
          </ul>
        </div>

        {prices.length === 0 ? (
          <EmptyState title={dictionary.prices.emptyTitle} body={dictionary.prices.emptyBody} />
        ) : (
          <ul className="mt-14 divide-y divide-[var(--color-line)]">
            {prices.map((item) => {
              const features = item.features ?? [];
              return (
                <li key={item.id} className="grid gap-6 py-10 lg:grid-cols-[1fr_auto]">
                  <div>
                    <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
                      {getLocalizedValue(item.name, locale)}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)]">
                      {getLocalizedValue(item.description, locale)}
                    </p>
                    {features.length > 0 ? (
                      <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--color-muted)]">
                        {features.map((feature) => (
                          <li key={getLocalizedValue(feature, locale)}>
                            {getLocalizedValue(feature, locale)}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                  <p className="text-base tracking-[0.06em] text-[var(--color-ink)] lg:pt-2">
                    {getLocalizedValue(item.priceDisplay, locale)}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </Container>
    </main>
  );
}
