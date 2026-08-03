import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { homePath } from "@/lib/i18n/paths";

export default function NotFoundPage() {
  const dictionary = getDictionary(defaultLocale);

  return (
    <main>
      <Container className="py-24 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
          {dictionary.notFound.title}
        </h1>
        <p className="mt-4 text-[var(--color-muted)]">{dictionary.notFound.body}</p>
        <Link
          href={homePath(defaultLocale)}
          className="mt-8 inline-block text-sm tracking-[0.12em] uppercase hover:opacity-70"
        >
          {dictionary.notFound.home}
        </Link>
      </Container>
    </main>
  );
}
