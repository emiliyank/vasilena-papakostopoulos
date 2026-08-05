import type { RichTextBlock, RichTextDocument, RichTextInline } from "@/types/rich-text";

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

type ArticleBodyProps = {
  document: RichTextDocument;
};

export function ArticleBody({ document }: ArticleBodyProps) {
  if (document.blocks.length === 0) {
    return null;
  }

  return (
    <div className="max-w-3xl space-y-5">
      {document.blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
