import Image from "next/image";
import Link from "next/link";

import { getLocalizedValue, type Locale } from "@/lib/i18n/config";
import { blogPostPath } from "@/lib/i18n/paths";
import type { BlogPost } from "@/types/content";

type ArticleCardProps = {
  post: BlogPost;
  locale: Locale;
  readMoreLabel: string;
};

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

export function ArticleCard({ post, locale, readMoreLabel }: ArticleCardProps) {
  const title = getLocalizedValue(post.title, locale);
  const excerpt = getLocalizedValue(post.excerpt, locale);
  const dateLabel = formatDate(post.publishedAt, locale);
  const cover = post.coverImage;

  return (
    <Link href={blogPostPath(locale, post.slug)} className="group grid gap-6 py-8 sm:grid-cols-[180px_1fr]">
      {cover ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface)] sm:aspect-square">
          <Image
            src={cover.src}
            alt={getLocalizedValue(cover.alt, locale) || title}
            fill
            className="object-cover transition-opacity group-hover:opacity-90"
            sizes="180px"
          />
        </div>
      ) : null}
      <div>
        {dateLabel ? (
          <p className="text-xs tracking-[0.12em] text-[var(--color-muted)] uppercase">{dateLabel}</p>
        ) : null}
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)] transition-opacity group-hover:opacity-70">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)]">{excerpt}</p>
        <span className="mt-4 inline-block text-xs tracking-[0.12em] uppercase">{readMoreLabel}</span>
      </div>
    </Link>
  );
}
