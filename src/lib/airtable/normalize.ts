import { z } from "zod";

import {
  attachmentToMedia,
  emptyMedia,
  firstAttachment,
  localized,
  normalizeStatus,
  optionalLocalized,
  splitLines,
} from "@/lib/airtable/normalize-shared";
import { markdownToRichText } from "@/lib/airtable/rich-text";
import type {
  AirtableBlogPostFields,
  AirtablePriceFields,
  AirtableProjectFields,
  AirtableProjectImageFields,
  AirtableRecord,
  AirtableServiceFields,
  AirtableSiteSettingsFields,
} from "@/lib/airtable/types";
import type {
  BlogPost,
  GalleryLayoutSpan,
  PriceItem,
  PricesPageContent,
  Project,
  ProjectImage,
  Service,
  SiteSettings,
} from "@/types/content";

const localizedSchema = z.object({
  en: z.string(),
  bg: z.string(),
});

const mediaSchema = z.object({
  id: z.string(),
  src: z.string().min(1),
  width: z.number().positive(),
  height: z.number().positive(),
  alt: localizedSchema,
  caption: localizedSchema.optional(),
  temporarySource: z.boolean().optional(),
});

const projectSchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  status: z.enum(["draft", "published", "archived"]),
  order: z.number(),
  title: localizedSchema,
  summary: localizedSchema,
  description: localizedSchema,
  projectType: localizedSchema,
  location: localizedSchema,
  projectDate: z.string(),
  coverImage: mediaSchema,
  images: z.array(z.any()),
  featured: z.boolean().optional(),
  seoTitle: localizedSchema.optional(),
  seoDescription: localizedSchema.optional(),
});

function layoutSpan(value: string | undefined): GalleryLayoutSpan {
  return value?.trim().toLowerCase() === "half" ? "half" : "full";
}

export function normalizeProjectImage(
  record: AirtableRecord<AirtableProjectImageFields>,
): ProjectImage | null {
  const fields = record.fields;
  const image = attachmentToMedia(
    firstAttachment(fields.Image),
    localized(fields["Alt Text EN"], fields["Alt Text BG"], "Project image"),
    optionalLocalized(fields["Caption EN"], fields["Caption BG"]),
  );

  if (!image) {
    return null;
  }

  return {
    ...image,
    id: record.id,
    order: fields.Order ?? 0,
    layoutSpan: layoutSpan(fields["Layout Span"]),
  };
}

export function normalizeProject(
  record: AirtableRecord<AirtableProjectFields>,
  images: ProjectImage[],
): Project {
  const fields = record.fields;
  const title = localized(fields["Title EN"], fields["Title BG"], fields["Internal Name"] ?? "Project");
  const cover =
    attachmentToMedia(
      firstAttachment(fields["Cover Image"]),
      localized(title.en, title.bg, title.en),
    ) ?? emptyMedia(`${record.id}-cover`, title);

  const project: Project = {
    id: record.id,
    slug: fields.Slug?.trim() || record.id,
    status: normalizeStatus(fields.Status),
    order: fields.Order ?? 0,
    title,
    summary: localized(fields["Summary EN"], fields["Summary BG"]),
    description: localized(fields["Description EN"], fields["Description BG"]),
    projectType: localized(fields["Project Type EN"], fields["Project Type BG"]),
    location: localized(fields["Location EN"], fields["Location BG"]),
    projectDate: fields["Project Date"] ?? "",
    coverImage: cover,
    images: [...images].sort((a, b) => a.order - b.order),
    featured: fields.Featured ?? false,
    seoTitle: optionalLocalized(fields["SEO Title EN"], fields["SEO Title BG"]),
    seoDescription: optionalLocalized(
      fields["SEO Description EN"],
      fields["SEO Description BG"],
    ),
  };

  return projectSchema.parse(project) as Project;
}

export function normalizeService(
  record: AirtableRecord<AirtableServiceFields>,
): Service {
  const fields = record.fields;
  return {
    id: record.id,
    slug: fields.Slug?.trim() || record.id,
    status: normalizeStatus(fields.Status),
    order: fields.Order ?? 0,
    title: localized(fields["Title EN"], fields["Title BG"], fields["Internal Name"] ?? "Service"),
    shortDescription: localized(
      fields["Short Description EN"],
      fields["Short Description BG"],
    ),
    fullDescription: localized(
      fields["Full Description EN"],
      fields["Full Description BG"],
    ),
  };
}

export function normalizeBlogPost(
  record: AirtableRecord<AirtableBlogPostFields>,
): BlogPost {
  const fields = record.fields;
  const title = localized(
    fields["Title EN"],
    fields["Title BG"],
    fields["Internal Title"] ?? "Blog post",
  );

  return {
    id: record.id,
    slug: fields.Slug?.trim() || record.id,
    status: normalizeStatus(fields.Status),
    publishedAt: fields["Published At"] ?? "",
    title,
    excerpt: localized(fields["Excerpt EN"], fields["Excerpt BG"]),
    body: {
      en: markdownToRichText(fields["Body EN"]),
      bg: markdownToRichText(fields["Body BG"] || fields["Body EN"]),
    },
    coverImage: attachmentToMedia(
      firstAttachment(fields["Cover Image"]),
      localized(fields["Cover Alt EN"], fields["Cover Alt BG"], title.en),
    ),
    seoTitle: optionalLocalized(fields["SEO Title EN"], fields["SEO Title BG"]),
    seoDescription: optionalLocalized(
      fields["SEO Description EN"],
      fields["SEO Description BG"],
    ),
  };
}

export function normalizePriceItem(
  record: AirtableRecord<AirtablePriceFields>,
): PriceItem {
  const fields = record.fields;
  const featuresEn = splitLines(fields["Features EN"]);
  const featuresBg = splitLines(fields["Features BG"]);
  const featureCount = Math.max(featuresEn.length, featuresBg.length);

  return {
    id: record.id,
    status: normalizeStatus(fields.Status),
    order: fields.Order ?? 0,
    name: localized(fields["Name EN"], fields["Name BG"], fields["Internal Name"] ?? "Package"),
    description: localized(fields["Description EN"], fields["Description BG"]),
    priceDisplay: localized(fields["Price Display EN"], fields["Price Display BG"]),
    features:
      featureCount > 0
        ? Array.from({ length: featureCount }, (_, index) =>
            localized(featuresEn[index], featuresBg[index], featuresEn[index] ?? featuresBg[index] ?? ""),
          )
        : [],
    notes: optionalLocalized(fields["Notes EN"], fields["Notes BG"]),
  };
}

export function normalizeSiteSettings(
  record: AirtableRecord<AirtableSiteSettingsFields>,
): SiteSettings & { pricesPage: PricesPageContent } {
  const fields = record.fields;
  const brandName = fields["Brand Name"]?.trim() || "Vassilena Papakostopoulos";

  const paymentTermsEn = splitLines(fields["Payment Terms EN"]);
  const paymentTermsBg = splitLines(fields["Payment Terms BG"]);
  const termCount = Math.max(paymentTermsEn.length, paymentTermsBg.length);

  return {
    brandName,
    heroHeading: localized(fields["Hero Heading EN"], fields["Hero Heading BG"]),
    heroSubheading: localized(fields["Hero Subheading EN"], fields["Hero Subheading BG"]),
    aboutHeading: localized(fields["About Heading EN"], fields["About Heading BG"], "About"),
    aboutSummary: localized(fields["About Summary EN"], fields["About Summary BG"]),
    aboutBody: localized(fields["About Body EN"], fields["About Body BG"]),
    contactHeading: localized(
      fields["Contact Heading EN"],
      fields["Contact Heading BG"],
      "Get in touch",
    ),
    contactIntro: localized(fields["Contact Intro EN"], fields["Contact Intro BG"]),
    phone: fields.Phone?.trim() || "",
    email: fields.Email?.trim() || "",
    location: localized(fields["Location EN"], fields["Location BG"]),
    instagramUrl: fields["Instagram URL"]?.trim() || "",
    facebookUrl: fields["Facebook URL"]?.trim() || "",
    surveyUrl: fields["Survey URL"]?.trim() || "",
    logo: attachmentToMedia(
      firstAttachment(fields.Logo),
      localized(brandName, brandName, brandName),
    ),
    heroImage: attachmentToMedia(
      firstAttachment(fields["Hero Image"]),
      localized("Hero image", "Начално изображение", "Hero image"),
    ),
    aboutImage: attachmentToMedia(
      firstAttachment(fields["About Image"]),
      localized("About image", "Изображение За мен", "About image"),
    ),
    pricesPage: {
      heading: localized(fields["Prices Heading EN"], fields["Prices Heading BG"], "Prices"),
      intro: localized(fields["Prices Intro EN"], fields["Prices Intro BG"]),
      paymentHeading: localized(
        fields["Payment Heading EN"],
        fields["Payment Heading BG"],
        "Payment terms",
      ),
      paymentTerms:
        termCount > 0
          ? Array.from({ length: termCount }, (_, index) =>
              localized(
                paymentTermsEn[index],
                paymentTermsBg[index],
                paymentTermsEn[index] ?? paymentTermsBg[index] ?? "",
              ),
            )
          : [],
    },
  };
}
