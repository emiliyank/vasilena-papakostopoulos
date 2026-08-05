import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { homePath } from "@/lib/i18n/paths";

type NotFoundProps = {
  params?: Promise<{ locale?: string }>;
};

export default async function NotFoundPage({ params }: NotFoundProps) {
  const resolved = params ? await params : undefined;
  const locale: Locale = resolved?.locale && isLocale(resolved.locale) ? resolved.locale : "en";
  const dictionary = getDictionary(locale);

  return (
    <main>
      <Container className="py-24 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
          {dictionary.notFound.title}
        </h1>
        <p className="mt-4 text-[var(--color-muted)]">{dictionary.notFound.body}</p>
        <Link
          href={homePath(locale)}
          className="mt-8 inline-block text-sm tracking-[0.12em] uppercase hover:opacity-70"
        >
          {dictionary.notFound.home}
        </Link>
      </Container>
    </main>
  );
}
