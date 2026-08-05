import { mockBlogPosts } from "@/data/mocks/blog";
import { mockPrices, mockPricesPageContent } from "@/data/mocks/prices";
import { mockProjects } from "@/data/mocks/projects";
import { mockServices } from "@/data/mocks/services";
import { mockSiteSettings } from "@/data/mocks/settings";
import {
  fetchBlogPostsFromAirtable,
  fetchPricesFromAirtable,
  fetchProjectsFromAirtable,
  fetchServicesFromAirtable,
  fetchSiteSettingsFromAirtable,
} from "@/lib/airtable";
import { getEnv } from "@/lib/env";
import type {
  BlogPost,
  PriceItem,
  PricesPageContent,
  Project,
  Service,
  SiteSettings,
} from "@/types/content";

function publishedOnly<T extends { status: string }>(items: T[]): T[] {
  return items.filter((item) => item.status === "published");
}

function byOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

async function withAirtableFallback<T>(
  label: string,
  loader: () => Promise<T>,
  fallback: () => T | Promise<T>,
): Promise<T> {
  const env = getEnv();
  if (env.CONTENT_SOURCE !== "airtable") {
    return fallback();
  }

  try {
    return await loader();
  } catch (error) {
    console.error(`[content] Airtable ${label} failed`, error);
    if (env.AIRTABLE_FALLBACK_TO_MOCK) {
      return fallback();
    }
    throw error;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return withAirtableFallback(
    "site settings",
    async () => {
      const { settings } = await fetchSiteSettingsFromAirtable();
      return settings;
    },
    () => mockSiteSettings,
  );
}

export async function getServices(): Promise<Service[]> {
  return withAirtableFallback(
    "services",
    async () => byOrder(publishedOnly(await fetchServicesFromAirtable())),
    () => byOrder(publishedOnly(mockServices)),
  );
}

export async function getProjects(): Promise<Project[]> {
  return withAirtableFallback(
    "projects",
    async () =>
      byOrder(publishedOnly(await fetchProjectsFromAirtable())).map((project) => ({
        ...project,
        images: [...project.images].sort((a, b) => a.order - b.order),
      })),
    () =>
      byOrder(publishedOnly(mockProjects)).map((project) => ({
        ...project,
        images: [...project.images].sort((a, b) => a.order - b.order),
      })),
  );
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

export async function getAdjacentProjects(slug: string): Promise<{
  previous: Project | null;
  next: Project | null;
}> {
  const projects = await getProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) {
    return { previous: null, next: null };
  }
  return {
    previous: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null,
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return withAirtableFallback(
    "blog posts",
    async () =>
      publishedOnly(await fetchBlogPostsFromAirtable()).sort((a, b) =>
        b.publishedAt.localeCompare(a.publishedAt),
      ),
    () =>
      publishedOnly(mockBlogPosts).sort((a, b) =>
        b.publishedAt.localeCompare(a.publishedAt),
      ),
  );
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getPrices(): Promise<PriceItem[]> {
  return withAirtableFallback(
    "prices",
    async () => byOrder(publishedOnly(await fetchPricesFromAirtable())),
    () => byOrder(publishedOnly(mockPrices)),
  );
}

export async function getPricesPageContent(): Promise<PricesPageContent> {
  return withAirtableFallback(
    "prices page content",
    async () => {
      const { pricesPage } = await fetchSiteSettingsFromAirtable();
      return pricesPage;
    },
    () => mockPricesPageContent,
  );
}
