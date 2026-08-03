import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { getBlogPosts } from "@/lib/content";
import { getLocalizedValue, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { blogPostPath } from "@/lib/i18n/paths";

type BlogIndexProps = {
  params: Promise<{ locale: string }>;
};

export default async function BlogIndexPage({ params }: BlogIndexProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;
  const dictionary = getDictionary(locale);
  const posts = await getBlogPosts();

  return (
    <main>
      <Container className="py-16 sm:py-24">
        <h1 className="font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
          {dictionary.blog.heading}
        </h1>
        <ul className="mt-12 divide-y divide-[var(--color-line)]">
          {posts.map((post) => (
            <li key={post.id} className="py-8">
              <Link href={blogPostPath(locale, post.slug)} className="group block">
                <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)] transition-opacity group-hover:opacity-70">
                  {getLocalizedValue(post.title, locale)}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)]">
                  {getLocalizedValue(post.excerpt, locale)}
                </p>
                <span className="mt-4 inline-block text-xs tracking-[0.12em] uppercase">
                  {dictionary.blog.readMore}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
