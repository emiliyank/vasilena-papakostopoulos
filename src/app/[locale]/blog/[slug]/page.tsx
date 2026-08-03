import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { getBlogPostBySlug } from "@/lib/content";
import { getLocalizedValue, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { blogPath } from "@/lib/i18n/paths";
import type { RichTextBlock, RichTextInline } from "@/types/rich-text";

type BlogPostPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

function renderInline(nodes: RichTextInline[], keyPrefix: string) {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`;
    if (node.type === "link") {
      return (
        <a key={key} href={node.href} className="underline underline-offset-2">
          {renderInline(node.children, key)}
        </a>
      );
    }
    const className = [
      node.marks?.includes("bold") ? "font-semibold" : "",
      node.marks?.includes("italic") ? "italic" : "",
      node.marks?.includes("underline") ? "underline" : "",
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <span key={key} className={className || undefined}>
        {node.text}
      </span>
    );
  });
}

function renderBlock(block: RichTextBlock, index: number) {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={index} className="text-base leading-relaxed text-[var(--color-muted)]">
          {renderInline(block.children, `p-${index}`)}
        </p>
      );
    case "heading":
      return (
        <h2
          key={index}
          className="pt-4 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]"
        >
          {renderInline(block.children, `h-${index}`)}
        </h2>
      );
    case "bulletList":
      return (
        <ul key={index} className="list-disc space-y-2 pl-5 text-[var(--color-muted)]">
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item, `ul-${index}-${itemIndex}`)}</li>
          ))}
        </ul>
      );
    case "numberedList":
      return (
        <ol key={index} className="list-decimal space-y-2 pl-5 text-[var(--color-muted)]">
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item, `ol-${index}-${itemIndex}`)}</li>
          ))}
        </ol>
      );
    case "quote":
      return (
        <blockquote
          key={index}
          className="border-l border-[var(--color-line)] pl-4 text-[var(--color-muted)] italic"
        >
          {renderInline(block.children, `q-${index}`)}
        </blockquote>
      );
    case "image":
      return (
        <figure key={index} className="space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.src} alt={block.alt} className="w-full" />
          {block.caption ? (
            <figcaption className="text-sm text-[var(--color-muted)]">{block.caption}</figcaption>
          ) : null}
        </figure>
      );
    default:
      return null;
  }
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
        <p className="mt-4 text-sm text-[var(--color-muted)]">{post.publishedAt}</p>
        <div className="mt-10 max-w-3xl space-y-5">
          {body.blocks.map((block, index) => renderBlock(block, index))}
        </div>
      </Container>
    </main>
  );
}
