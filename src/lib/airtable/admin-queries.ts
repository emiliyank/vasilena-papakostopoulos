import { listAirtableRecords } from "@/lib/airtable/client";
import {
  normalizeBlogPost,
  normalizePriceItem,
  normalizeProject,
  normalizeProjectImage,
  normalizeService,
  normalizeSiteSettings,
} from "@/lib/airtable/normalize";
import { firstAttachment } from "@/lib/airtable/normalize-shared";
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

export type AdminBlogPost = BlogPost & {
  bodyMarkdown: { en: string; bg: string };
  coverAlt: { en: string; bg: string };
};

export type AdminProjectImage = Omit<ProjectImage, "src" | "width" | "height"> & {
  src?: string;
  width?: number;
  height?: number;
  hasImage: boolean;
};

export type AdminSiteSettings = SiteSettings & {
  id: string;
  pricesPage: PricesPageContent;
};

function attachProjectImages(
  projectRecords: Awaited<ReturnType<typeof listAirtableRecords<AirtableProjectFields>>>,
  imageRecords: Awaited<ReturnType<typeof listAirtableRecords<AirtableProjectImageFields>>>,
): Project[] {
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

export async function fetchProjectsForAdmin(): Promise<Project[]> {
  const env = getEnv();
  const [projectRecords, imageRecords] = await Promise.all([
    listAirtableRecords<AirtableProjectFields>(env.AIRTABLE_TABLE_PROJECTS, {
      sort: [{ field: "Order", direction: "asc" }],
    }),
    listAirtableRecords<AirtableProjectImageFields>(env.AIRTABLE_TABLE_PROJECT_IMAGES, {
      sort: [{ field: "Order", direction: "asc" }],
    }),
  ]);
  return attachProjectImages(projectRecords, imageRecords);
}

export async function fetchProjectByIdForAdmin(id: string): Promise<Project | null> {
  const projects = await fetchProjectsForAdmin();
  return projects.find((project) => project.id === id) ?? null;
}

export async function fetchProjectImagesForAdmin(projectId: string): Promise<AdminProjectImage[]> {
  const env = getEnv();
  // Do not filter linked records with ARRAYJOIN({Project}) — Airtable formulas expose
  // primary-field names, not record IDs. Filter on API link IDs in application code.
  const [projectRecords, imageRecords] = await Promise.all([
    listAirtableRecords<AirtableProjectFields>(env.AIRTABLE_TABLE_PROJECTS, {
      filterByFormula: `RECORD_ID() = "${projectId}"`,
    }),
    listAirtableRecords<AirtableProjectImageFields>(env.AIRTABLE_TABLE_PROJECT_IMAGES, {
      sort: [{ field: "Order", direction: "asc" }],
    }),
  ]);

  const linkedIds = projectRecords[0]?.fields["Project Images"] ?? [];
  const linkedIdSet = new Set(linkedIds);

  const matching = imageRecords.filter(
    (record) =>
      linkedIdSet.has(record.id) || (record.fields.Project ?? []).includes(projectId),
  );

  const byId = new Map(matching.map((record) => [record.id, record] as const));
  const orderedRecords =
    linkedIds.length > 0
      ? [
          ...linkedIds
            .map((id) => byId.get(id))
            .filter((record): record is (typeof matching)[number] => Boolean(record)),
          ...matching.filter((record) => !linkedIdSet.has(record.id)),
        ]
      : matching;

  return orderedRecords.map((record) => {
    const normalized = normalizeProjectImage(record);
    if (normalized) {
      return { ...normalized, hasImage: true };
    }

    const fields = record.fields;
    return {
      id: record.id,
      order: fields.Order ?? 0,
      layoutSpan: fields["Layout Span"]?.trim().toLowerCase() === "half" ? "half" : "full",
      alt: {
        en: fields["Alt Text EN"]?.trim() || "",
        bg: fields["Alt Text BG"]?.trim() || fields["Alt Text EN"]?.trim() || "",
      },
      caption:
        fields["Caption EN"] || fields["Caption BG"]
          ? {
              en: fields["Caption EN"]?.trim() || "",
              bg: fields["Caption BG"]?.trim() || fields["Caption EN"]?.trim() || "",
            }
          : undefined,
      hasImage: false,
    };
  });
}

export async function fetchServicesForAdmin(): Promise<Service[]> {
  const env = getEnv();
  const records = await listAirtableRecords<AirtableServiceFields>(env.AIRTABLE_TABLE_SERVICES, {
    sort: [{ field: "Order", direction: "asc" }],
  });
  return records.map(normalizeService);
}

export async function fetchServiceByIdForAdmin(id: string): Promise<Service | null> {
  const services = await fetchServicesForAdmin();
  return services.find((service) => service.id === id) ?? null;
}

export async function fetchPricesForAdmin(): Promise<PriceItem[]> {
  const env = getEnv();
  const records = await listAirtableRecords<AirtablePriceFields>(env.AIRTABLE_TABLE_PRICES, {
    sort: [{ field: "Order", direction: "asc" }],
  });
  return records.map(normalizePriceItem);
}

export async function fetchPriceByIdForAdmin(id: string): Promise<PriceItem | null> {
  const prices = await fetchPricesForAdmin();
  return prices.find((price) => price.id === id) ?? null;
}

export async function fetchBlogPostsForAdmin(): Promise<AdminBlogPost[]> {
  const env = getEnv();
  const records = await listAirtableRecords<AirtableBlogPostFields>(
    env.AIRTABLE_TABLE_BLOG_POSTS,
    {
      sort: [{ field: "Published At", direction: "desc" }],
    },
  );

  return records.map((record) => {
    const post = normalizeBlogPost(record);
    return {
      ...post,
      bodyMarkdown: {
        en: record.fields["Body EN"] ?? "",
        bg: record.fields["Body BG"] ?? "",
      },
      coverAlt: {
        en: record.fields["Cover Alt EN"] ?? "",
        bg: record.fields["Cover Alt BG"] ?? "",
      },
    };
  });
}

export async function fetchBlogPostByIdForAdmin(id: string): Promise<AdminBlogPost | null> {
  const posts = await fetchBlogPostsForAdmin();
  return posts.find((post) => post.id === id) ?? null;
}

export async function fetchSiteSettingsForAdmin(): Promise<AdminSiteSettings | null> {
  const env = getEnv();
  const records = await listAirtableRecords<AirtableSiteSettingsFields>(
    env.AIRTABLE_TABLE_SITE_SETTINGS,
    {
      filterByFormula: "{Active} = TRUE()",
    },
  );
  const active = records[0];
  if (!active) {
    return null;
  }

  const normalized = normalizeSiteSettings(active);
  const { pricesPage, ...settings } = normalized;
  return {
    id: active.id,
    ...settings,
    pricesPage,
    logo: settings.logo ?? undefined,
    heroImage: settings.heroImage ?? undefined,
    aboutImage: settings.aboutImage ?? undefined,
  };
}

export function getExistingAttachmentUrl(
  attachments: { url?: string }[] | undefined,
): string | undefined {
  return firstAttachment(attachments as never)?.url;
}
