import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/blog/ArticleCard";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { getBlogPosts } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildPageMetadata } from "@/lib/seo/metadata";

type BlogIndexProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: BlogIndexProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const dictionary = getDictionary(rawLocale);
  return buildPageMetadata({
    locale: rawLocale,
    title: dictionary.blog.heading,
    description: dictionary.meta.siteDescription,
    path: "/blog",
  });
}

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
        {posts.length === 0 ? (
          <EmptyState title={dictionary.blog.emptyTitle} body={dictionary.blog.emptyBody} />
        ) : (
          <ul className="mt-12 divide-y divide-[var(--color-line)]">
            {posts.map((post) => (
              <li key={post.id}>
                <ArticleCard
                  post={post}
                  locale={locale}
                  readMoreLabel={dictionary.blog.readMore}
                />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </main>
  );
}
