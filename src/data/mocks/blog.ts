import blogSeed from "@/data/seeds/blog-posts.json";
import { markdownToRichText } from "@/lib/airtable/rich-text";
import type { BlogPost } from "@/types/content";

export const mockBlogPosts: BlogPost[] = blogSeed.map((post) => ({
  id: `blog-${post.Slug}`,
  slug: post.Slug,
  status: "published",
  publishedAt: post["Published At"],
  title: {
    en: post["Title EN"],
    bg: post["Title BG"],
  },
  excerpt: {
    en: post["Excerpt EN"],
    bg: post["Excerpt BG"],
  },
  body: {
    en: markdownToRichText(post["Body EN"]),
    bg: markdownToRichText(post["Body BG"]),
  },
}));
