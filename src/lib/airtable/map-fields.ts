import type { PublishStatus } from "@/types/content";

export function toAirtableStatus(status: PublishStatus): string {
  switch (status) {
    case "published":
      return "Published";
    case "archived":
      return "Archived";
    default:
      return "Draft";
  }
}

export function joinLines(values: string[] | undefined): string | undefined {
  if (!values || values.length === 0) return undefined;
  return values.join("\n");
}

export type ServiceWriteInput = {
  internalName: string;
  slug: string;
  status: PublishStatus;
  order: number;
  titleEn: string;
  titleBg: string;
  shortDescriptionEn: string;
  shortDescriptionBg: string;
  fullDescriptionEn: string;
  fullDescriptionBg: string;
};

export function serviceFields(input: ServiceWriteInput): Record<string, unknown> {
  return {
    "Internal Name": input.internalName,
    Slug: input.slug,
    Status: toAirtableStatus(input.status),
    Order: input.order,
    "Title EN": input.titleEn,
    "Title BG": input.titleBg,
    "Short Description EN": input.shortDescriptionEn,
    "Short Description BG": input.shortDescriptionBg,
    "Full Description EN": input.fullDescriptionEn,
    "Full Description BG": input.fullDescriptionBg,
  };
}

export type PriceWriteInput = {
  internalName: string;
  status: PublishStatus;
  order: number;
  nameEn: string;
  nameBg: string;
  descriptionEn: string;
  descriptionBg: string;
  priceDisplayEn: string;
  priceDisplayBg: string;
  featuresEn: string;
  featuresBg: string;
  notesEn: string;
  notesBg: string;
};

export function priceFields(input: PriceWriteInput): Record<string, unknown> {
  return {
    "Internal Name": input.internalName,
    Status: toAirtableStatus(input.status),
    Order: input.order,
    "Name EN": input.nameEn,
    "Name BG": input.nameBg,
    "Description EN": input.descriptionEn,
    "Description BG": input.descriptionBg,
    "Price Display EN": input.priceDisplayEn,
    "Price Display BG": input.priceDisplayBg,
    "Features EN": input.featuresEn || undefined,
    "Features BG": input.featuresBg || undefined,
    "Notes EN": input.notesEn || undefined,
    "Notes BG": input.notesBg || undefined,
  };
}

export type ProjectWriteInput = {
  internalName: string;
  slug: string;
  status: PublishStatus;
  order: number;
  titleEn: string;
  titleBg: string;
  summaryEn: string;
  summaryBg: string;
  descriptionEn: string;
  descriptionBg: string;
  projectTypeEn: string;
  projectTypeBg: string;
  locationEn: string;
  locationBg: string;
  projectDate: string;
  featured: boolean;
  seoTitleEn: string;
  seoTitleBg: string;
  seoDescriptionEn: string;
  seoDescriptionBg: string;
  coverImageUrl?: string;
};

export function projectFields(input: ProjectWriteInput): Record<string, unknown> {
  const fields: Record<string, unknown> = {
    "Internal Name": input.internalName,
    Slug: input.slug,
    Status: toAirtableStatus(input.status),
    Order: input.order,
    "Title EN": input.titleEn,
    "Title BG": input.titleBg,
    "Summary EN": input.summaryEn,
    "Summary BG": input.summaryBg,
    "Description EN": input.descriptionEn,
    "Description BG": input.descriptionBg,
    "Project Type EN": input.projectTypeEn,
    "Project Type BG": input.projectTypeBg,
    "Location EN": input.locationEn,
    "Location BG": input.locationBg,
    "Project Date": input.projectDate || undefined,
    Featured: input.featured,
    "SEO Title EN": input.seoTitleEn || undefined,
    "SEO Title BG": input.seoTitleBg || undefined,
    "SEO Description EN": input.seoDescriptionEn || undefined,
    "SEO Description BG": input.seoDescriptionBg || undefined,
  };

  if (input.coverImageUrl?.trim()) {
    fields["Cover Image"] = [{ url: input.coverImageUrl.trim() }];
  }

  return fields;
}

export type ProjectImageWriteInput = {
  internalName: string;
  projectId: string;
  order: number;
  altTextEn: string;
  altTextBg: string;
  captionEn: string;
  captionBg: string;
  layoutSpan: "full" | "half";
  imageUrl?: string;
};

export function projectImageFields(input: ProjectImageWriteInput): Record<string, unknown> {
  const fields: Record<string, unknown> = {
    "Internal Name": input.internalName,
    Project: [input.projectId],
    Order: input.order,
    "Alt Text EN": input.altTextEn,
    "Alt Text BG": input.altTextBg,
    "Caption EN": input.captionEn || undefined,
    "Caption BG": input.captionBg || undefined,
    "Layout Span": input.layoutSpan === "half" ? "half" : "full",
  };

  if (input.imageUrl?.trim()) {
    fields.Image = [{ url: input.imageUrl.trim() }];
  }

  return fields;
}

export type BlogWriteInput = {
  internalTitle: string;
  slug: string;
  status: PublishStatus;
  publishedAt: string;
  titleEn: string;
  titleBg: string;
  excerptEn: string;
  excerptBg: string;
  bodyEn: string;
  bodyBg: string;
  coverAltEn: string;
  coverAltBg: string;
  seoTitleEn: string;
  seoTitleBg: string;
  seoDescriptionEn: string;
  seoDescriptionBg: string;
  coverImageUrl?: string;
};

export function blogFields(input: BlogWriteInput): Record<string, unknown> {
  const fields: Record<string, unknown> = {
    "Internal Title": input.internalTitle,
    Slug: input.slug,
    Status: toAirtableStatus(input.status),
    "Published At": input.publishedAt || undefined,
    "Title EN": input.titleEn,
    "Title BG": input.titleBg,
    "Excerpt EN": input.excerptEn,
    "Excerpt BG": input.excerptBg,
    "Body EN": input.bodyEn,
    "Body BG": input.bodyBg,
    "Cover Alt EN": input.coverAltEn || undefined,
    "Cover Alt BG": input.coverAltBg || undefined,
    "SEO Title EN": input.seoTitleEn || undefined,
    "SEO Title BG": input.seoTitleBg || undefined,
    "SEO Description EN": input.seoDescriptionEn || undefined,
    "SEO Description BG": input.seoDescriptionBg || undefined,
  };

  if (input.coverImageUrl?.trim()) {
    fields["Cover Image"] = [{ url: input.coverImageUrl.trim() }];
  }

  return fields;
}

export type SiteSettingsWriteInput = {
  brandName: string;
  heroHeadingEn: string;
  heroHeadingBg: string;
  heroSubheadingEn: string;
  heroSubheadingBg: string;
  aboutHeadingEn: string;
  aboutHeadingBg: string;
  aboutSummaryEn: string;
  aboutSummaryBg: string;
  aboutBodyEn: string;
  aboutBodyBg: string;
  contactHeadingEn: string;
  contactHeadingBg: string;
  contactIntroEn: string;
  contactIntroBg: string;
  phone: string;
  email: string;
  locationEn: string;
  locationBg: string;
  instagramUrl: string;
  facebookUrl: string;
  surveyUrl: string;
  pricesHeadingEn: string;
  pricesHeadingBg: string;
  pricesIntroEn: string;
  pricesIntroBg: string;
  paymentHeadingEn: string;
  paymentHeadingBg: string;
  paymentTermsEn: string;
  paymentTermsBg: string;
  logoUrl?: string;
  heroImageUrl?: string;
  aboutImageUrl?: string;
};

export function siteSettingsFields(input: SiteSettingsWriteInput): Record<string, unknown> {
  const fields: Record<string, unknown> = {
    Active: true,
    "Brand Name": input.brandName,
    "Hero Heading EN": input.heroHeadingEn,
    "Hero Heading BG": input.heroHeadingBg,
    "Hero Subheading EN": input.heroSubheadingEn,
    "Hero Subheading BG": input.heroSubheadingBg,
    "About Heading EN": input.aboutHeadingEn,
    "About Heading BG": input.aboutHeadingBg,
    "About Summary EN": input.aboutSummaryEn,
    "About Summary BG": input.aboutSummaryBg,
    "About Body EN": input.aboutBodyEn,
    "About Body BG": input.aboutBodyBg,
    "Contact Heading EN": input.contactHeadingEn,
    "Contact Heading BG": input.contactHeadingBg,
    "Contact Intro EN": input.contactIntroEn,
    "Contact Intro BG": input.contactIntroBg,
    Phone: input.phone,
    Email: input.email,
    "Location EN": input.locationEn,
    "Location BG": input.locationBg,
    "Instagram URL": input.instagramUrl,
    "Facebook URL": input.facebookUrl,
    "Survey URL": input.surveyUrl,
    "Prices Heading EN": input.pricesHeadingEn,
    "Prices Heading BG": input.pricesHeadingBg,
    "Prices Intro EN": input.pricesIntroEn,
    "Prices Intro BG": input.pricesIntroBg,
    "Payment Heading EN": input.paymentHeadingEn,
    "Payment Heading BG": input.paymentHeadingBg,
    "Payment Terms EN": input.paymentTermsEn,
    "Payment Terms BG": input.paymentTermsBg,
  };

  if (input.logoUrl?.trim()) {
    fields.Logo = [{ url: input.logoUrl.trim() }];
  }
  if (input.heroImageUrl?.trim()) {
    fields["Hero Image"] = [{ url: input.heroImageUrl.trim() }];
  }
  if (input.aboutImageUrl?.trim()) {
    fields["About Image"] = [{ url: input.aboutImageUrl.trim() }];
  }

  return fields;
}
