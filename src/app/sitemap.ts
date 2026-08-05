import type { MetadataRoute } from "next";

import {
  getBlogPosts,
  getPrices,
  getProjects,
} from "@/lib/content";
import { locales } from "@/lib/i18n/config";
import { absoluteUrl, localizedPath } from "@/lib/seo/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts, prices] = await Promise.all([
    getProjects(),
    getBlogPosts(),
    getPrices(),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: absoluteUrl(localizedPath(locale)),
      changeFrequency: "weekly",
      priority: 1,
    });
    entries.push({
      url: absoluteUrl(localizedPath(locale, "/blog")),
      changeFrequency: "weekly",
      priority: 0.7,
    });
    if (prices.length > 0) {
      entries.push({
        url: absoluteUrl(localizedPath(locale, "/prices")),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    for (const project of projects) {
      entries.push({
        url: absoluteUrl(localizedPath(locale, `/projects/${project.slug}`)),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
    for (const post of posts) {
      entries.push({
        url: absoluteUrl(localizedPath(locale, `/blog/${post.slug}`)),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
