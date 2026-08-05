import { mockPricesPageContent } from "@/data/mocks/prices";
import { mockSiteSettings } from "@/data/mocks/settings";
import { listAirtableRecords } from "@/lib/airtable/client";
import {
  normalizeBlogPost,
  normalizePriceItem,
  normalizeProject,
  normalizeProjectImage,
  normalizeService,
  normalizeSiteSettings,
} from "@/lib/airtable/normalize";
import type {
  AirtableBlogPostFields,
  AirtablePriceFields,
  AirtableProjectFields,
  AirtableProjectImageFields,
  AirtableServiceFields,
  AirtableSiteSettingsFields,
} from "@/lib/airtable/types";
import { getEnv } from "@/lib/env";
import type {
  BlogPost,
  PriceItem,
  PricesPageContent,
  Project,
  ProjectImage,
  Service,
  SiteSettings,
} from "@/types/content";

const PUBLISHED_FORMULA = "{Status} = 'Published'";

export async function fetchProjectsFromAirtable(): Promise<Project[]> {
  const env = getEnv();
  const [projectRecords, imageRecords] = await Promise.all([
    listAirtableRecords<AirtableProjectFields>(env.AIRTABLE_TABLE_PROJECTS, {
      filterByFormula: PUBLISHED_FORMULA,
      sort: [{ field: "Order", direction: "asc" }],
    }),
    listAirtableRecords<AirtableProjectImageFields>(env.AIRTABLE_TABLE_PROJECT_IMAGES, {
      sort: [{ field: "Order", direction: "asc" }],
    }),
  ]);

  const imagesByRecordId = new Map<string, ProjectImage>();
  const imagesByProjectId = new Map<string, ProjectImage[]>();

  for (const imageRecord of imageRecords) {
    const normalized = normalizeProjectImage(imageRecord);
    if (!normalized) continue;

    imagesByRecordId.set(imageRecord.id, normalized);

    for (const projectId of imageRecord.fields.Project ?? []) {
      const existing = imagesByProjectId.get(projectId) ?? [];
      existing.push(normalized);
      imagesByProjectId.set(projectId, existing);
    }
  }

  return projectRecords.map((record) => {
    const linkedIds = record.fields["Project Images"] ?? [];
    const linkedImages = linkedIds
      .map((id) => imagesByRecordId.get(id))
      .filter((image): image is ProjectImage => Boolean(image));

    const images =
      linkedImages.length > 0
        ? linkedImages
        : [...(imagesByProjectId.get(record.id) ?? [])].sort((a, b) => a.order - b.order);

    return normalizeProject(record, images);
  });
}

export async function fetchServicesFromAirtable(): Promise<Service[]> {
  const env = getEnv();
  const records = await listAirtableRecords<AirtableServiceFields>(
    env.AIRTABLE_TABLE_SERVICES,
    {
      filterByFormula: PUBLISHED_FORMULA,
      sort: [{ field: "Order", direction: "asc" }],
    },
  );
  return records.map(normalizeService);
}

export async function fetchBlogPostsFromAirtable(): Promise<BlogPost[]> {
  const env = getEnv();
  const records = await listAirtableRecords<AirtableBlogPostFields>(
    env.AIRTABLE_TABLE_BLOG_POSTS,
    {
      filterByFormula: PUBLISHED_FORMULA,
      sort: [{ field: "Published At", direction: "desc" }],
    },
  );
  return records.map(normalizeBlogPost);
}

export async function fetchPricesFromAirtable(): Promise<PriceItem[]> {
  const env = getEnv();
  const records = await listAirtableRecords<AirtablePriceFields>(env.AIRTABLE_TABLE_PRICES, {
    filterByFormula: PUBLISHED_FORMULA,
    sort: [{ field: "Order", direction: "asc" }],
  });
  return records.map(normalizePriceItem);
}

export async function fetchSiteSettingsFromAirtable(): Promise<{
  settings: SiteSettings;
  pricesPage: PricesPageContent;
}> {
  const env = getEnv();
  const records = await listAirtableRecords<AirtableSiteSettingsFields>(
    env.AIRTABLE_TABLE_SITE_SETTINGS,
    {
      filterByFormula: "{Active} = TRUE()",
    },
  );

  const active = records[0];
  if (!active) {
    return {
      settings: mockSiteSettings,
      pricesPage: mockPricesPageContent,
    };
  }

  const normalized = normalizeSiteSettings(active);
  const { pricesPage, ...settings } = normalized;
  return { settings, pricesPage };
}
