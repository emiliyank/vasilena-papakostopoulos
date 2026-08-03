import { mockBlogPosts, mockPrices } from "@/data/mocks/blog";
import { mockProjects } from "@/data/mocks/projects";
import { mockServices } from "@/data/mocks/services";
import { mockSiteSettings } from "@/data/mocks/settings";
import type {
  BlogPost,
  PriceItem,
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

export async function getSiteSettings(): Promise<SiteSettings> {
  return mockSiteSettings;
}

export async function getServices(): Promise<Service[]> {
  return byOrder(publishedOnly(mockServices));
}

export async function getProjects(): Promise<Project[]> {
  return byOrder(publishedOnly(mockProjects)).map((project) => ({
    ...project,
    images: [...project.images].sort((a, b) => a.order - b.order),
  }));
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
  return publishedOnly(mockBlogPosts).sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getPrices(): Promise<PriceItem[]> {
  return byOrder(publishedOnly(mockPrices));
}
