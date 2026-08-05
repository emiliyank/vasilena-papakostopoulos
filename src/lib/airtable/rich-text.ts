import type { RichTextDocument, RichTextInline, RichTextMark } from "@/types/rich-text";

/**
 * Convert Airtable rich-text Markdown into the site block model.
 * Supports headings, paragraphs, quotes, bullet/numbered lists, and basic inline marks.
 */
export function markdownToRichText(markdown: string | undefined): RichTextDocument {
  const source = markdown?.trim() ?? "";
  if (!source) {
    return { blocks: [] };
  }

  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: RichTextDocument["blocks"] = [];
  let paragraphLines: string[] = [];
  let bulletItems: string[] = [];
  let numberedItems: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;
    blocks.push({
      type: "paragraph",
      children: parseInline(paragraphLines.join(" ").trim()),
    });
    paragraphLines = [];
  };

  const flushBullets = () => {
    if (bulletItems.length === 0) return;
    blocks.push({
      type: "bulletList",
      items: bulletItems.map((item) => parseInline(item)),
    });
    bulletItems = [];
  };

  const flushNumbered = () => {
    if (numberedItems.length === 0) return;
    blocks.push({
      type: "numberedList",
      items: numberedItems.map((item) => parseInline(item)),
    });
    numberedItems = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushBullets();
      flushNumbered();
      continue;
    }

    const headingMatch = /^(#{2,4})\s+(.*)$/.exec(trimmed);
    if (headingMatch) {
      flushParagraph();
      flushBullets();
      flushNumbered();
      const level = Math.min(Math.max(headingMatch[1].length, 2), 4) as 2 | 3 | 4;
      blocks.push({
        type: "heading",
        level,
        children: parseInline(headingMatch[2]),
      });
      continue;
    }

    if (trimmed.startsWith("> ")) {
      flushParagraph();
      flushBullets();
      flushNumbered();
      blocks.push({
        type: "quote",
        children: parseInline(trimmed.slice(2)),
      });
      continue;
    }

    const bulletMatch = /^[-*]\s+(.*)$/.exec(trimmed);
    if (bulletMatch) {
      flushParagraph();
      flushNumbered();
      bulletItems.push(bulletMatch[1]);
      continue;
    }

    const numberedMatch = /^\d+\.\s+(.*)$/.exec(trimmed);
    if (numberedMatch) {
      flushParagraph();
      flushBullets();
      numberedItems.push(numberedMatch[1]);
      continue;
    }

    flushBullets();
    flushNumbered();
    paragraphLines.push(trimmed);
  }

  flushParagraph();
  flushBullets();
  flushNumbered();

  return { blocks };
}

function parseInline(text: string): RichTextInline[] {
  const nodes: RichTextInline[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|__[^_]+__|_[^_]+_|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push({ type: "text", text: text.slice(lastIndex, match.index) });
    }

    const token = match[0];
    if (token.startsWith("[")) {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (linkMatch) {
        nodes.push({
          type: "link",
          href: linkMatch[2],
          children: [{ type: "text", text: linkMatch[1] }],
        });
      }
    } else if (token.startsWith("**") || token.startsWith("__")) {
      nodes.push({
        type: "text",
        text: token.slice(2, -2),
        marks: ["bold"],
      });
    } else if (token.startsWith("`")) {
      nodes.push({
        type: "text",
        text: token.slice(1, -1),
        marks: ["code"],
      });
    } else {
      nodes.push({
        type: "text",
        text: token.slice(1, -1),
        marks: ["italic" as RichTextMark],
      });
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push({ type: "text", text: text.slice(lastIndex) });
  }

  return nodes.length > 0 ? nodes : [{ type: "text", text: "" }];
}
