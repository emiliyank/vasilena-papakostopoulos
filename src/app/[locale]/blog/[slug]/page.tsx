import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleBody } from "@/components/blog/ArticleBody";
import { Container } from "@/components/ui/Container";
import { getBlogPostBySlug } from "@/lib/content";
import { getLocalizedValue, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { blogPath } from "@/lib/i18n/paths";
import { buildPageMetadata } from "@/lib/seo/metadata";

type BlogPostPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  const title = getLocalizedValue(post.seoTitle ?? post.title, locale);
  const description = getLocalizedValue(post.seoDescription ?? post.excerpt, locale);
  return buildPageMetadata({
    locale,
    title,
    description,
    path: `/blog/${post.slug}`,
    image: post.coverImage?.src,
  });
}

function formatDate(value: string, locale: Locale): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === "bg" ? "bg-BG" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const body = getLocalizedValue(post.body, locale);
  const dateLabel = formatDate(post.publishedAt, locale);
  const cover = post.coverImage;

  return (
    <main>
      <Container className="py-16 sm:py-24">
        <Link
          href={blogPath(locale)}
          className="text-xs tracking-[0.12em] uppercase text-[var(--color-muted)] hover:opacity-70"
        >
          {dictionary.blog.backToBlog}
        </Link>
        <h1 className="mt-6 max-w-3xl font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]">
          {getLocalizedValue(post.title, locale)}
        </h1>
        {dateLabel ? <p className="mt-4 text-sm text-[var(--color-muted)]">{dateLabel}</p> : null}
        {cover ? (
          <div className="relative mt-8 aspect-[16/9] max-w-3xl overflow-hidden bg-[var(--color-surface)]">
            <Image
              src={cover.src}
              alt={getLocalizedValue(cover.alt, locale)}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        ) : null}
        <div className="mt-10">
          <ArticleBody document={body} />
        </div>
      </Container>
    </main>
  );
}
