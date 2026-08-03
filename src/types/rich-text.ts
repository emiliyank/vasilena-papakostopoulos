export type RichTextMark = "bold" | "italic" | "underline" | "code";

export type RichTextInline =
  | { type: "text"; text: string; marks?: RichTextMark[] }
  | { type: "link"; href: string; children: RichTextInline[] };

export type RichTextBlock =
  | { type: "paragraph"; children: RichTextInline[] }
  | { type: "heading"; level: 2 | 3 | 4; children: RichTextInline[] }
  | { type: "bulletList"; items: RichTextInline[][] }
  | { type: "numberedList"; items: RichTextInline[][] }
  | { type: "quote"; children: RichTextInline[] }
  | { type: "image"; src: string; alt: string; caption?: string };

export type RichTextDocument = {
  blocks: RichTextBlock[];
};
