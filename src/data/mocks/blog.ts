import type { BlogPost } from "@/types/content";
import type { RichTextDocument } from "@/types/rich-text";

const sampleBodyEn: RichTextDocument = {
  blocks: [
    {
      type: "paragraph",
      children: [
        {
          type: "text",
          text: "A short note on preparing for an interior consultation — what to gather, what to decide later, and how visual references help the process.",
        },
      ],
    },
    {
      type: "heading",
      level: 2,
      children: [{ type: "text", text: "Before we meet" }],
    },
    {
      type: "bulletList",
      items: [
        [{ type: "text", text: "Floor plans or approximate room dimensions" }],
        [{ type: "text", text: "Photos of the existing space" }],
        [{ type: "text", text: "A few references that feel close to your taste" }],
      ],
    },
  ],
};

const sampleBodyBg: RichTextDocument = {
  blocks: [
    {
      type: "paragraph",
      children: [
        {
          type: "text",
          text: "Кратка бележка за подготовката за интериорна консултация — какво да съберете, какво да оставите за по-късно и как визуалните референции помагат на процеса.",
        },
      ],
    },
    {
      type: "heading",
      level: 2,
      children: [{ type: "text", text: "Преди срещата" }],
    },
    {
      type: "bulletList",
      items: [
        [{ type: "text", text: "Планове или приблизителни размери" }],
        [{ type: "text", text: "Снимки на съществуващото пространство" }],
        [{ type: "text", text: "Няколко референции, близки до вашия вкус" }],
      ],
    },
  ],
};

export const mockBlogPosts: BlogPost[] = [
  {
    id: "blog-consultation-survey",
    slug: "consultation-survey",
    status: "published",
    publishedAt: "2025-01-15",
    title: {
      en: "Consultation survey",
      bg: "Анкета за консултация",
    },
    excerpt: {
      en: "How a short questionnaire helps clarify priorities before a design conversation.",
      bg: "Как кратката анкета помага да се изяснят приоритетите преди дизайнерски разговор.",
    },
    body: { en: sampleBodyEn, bg: sampleBodyBg },
  },
];
