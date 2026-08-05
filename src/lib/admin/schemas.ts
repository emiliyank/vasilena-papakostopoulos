import { z } from "zod";

export const publishStatusSchema = z.enum(["draft", "published", "archived"]);

export const serviceFormSchema = z.object({
  internalName: z.string().min(1),
  slug: z.string().min(1),
  status: publishStatusSchema,
  order: z.coerce.number().int(),
  titleEn: z.string().min(1),
  titleBg: z.string().min(1),
  shortDescriptionEn: z.string(),
  shortDescriptionBg: z.string(),
  fullDescriptionEn: z.string(),
  fullDescriptionBg: z.string(),
});

export const priceFormSchema = z.object({
  internalName: z.string().min(1),
  status: publishStatusSchema,
  order: z.coerce.number().int(),
  nameEn: z.string().min(1),
  nameBg: z.string().min(1),
  descriptionEn: z.string(),
  descriptionBg: z.string(),
  priceDisplayEn: z.string().min(1),
  priceDisplayBg: z.string().min(1),
  featuresEn: z.string(),
  featuresBg: z.string(),
  notesEn: z.string(),
  notesBg: z.string(),
});

export const projectFormSchema = z.object({
  internalName: z.string().min(1),
  slug: z.string().min(1),
  status: publishStatusSchema,
  order: z.coerce.number().int(),
  titleEn: z.string().min(1),
  titleBg: z.string().min(1),
  summaryEn: z.string(),
  summaryBg: z.string(),
  descriptionEn: z.string(),
  descriptionBg: z.string(),
  projectTypeEn: z.string(),
  projectTypeBg: z.string(),
  locationEn: z.string(),
  locationBg: z.string(),
  projectDate: z.string(),
  featured: z.preprocess(
    (value) => value === true || value === "true" || value === "on" || value === "1",
    z.boolean(),
  ),
  seoTitleEn: z.string(),
  seoTitleBg: z.string(),
  seoDescriptionEn: z.string(),
  seoDescriptionBg: z.string(),
  coverImageUrl: z.string(),
});

export const projectImageFormSchema = z.object({
  internalName: z.string().min(1),
  projectId: z.string().min(1),
  order: z.coerce.number().int(),
  altTextEn: z.string(),
  altTextBg: z.string(),
  captionEn: z.string(),
  captionBg: z.string(),
  layoutSpan: z.enum(["full", "half"]),
  imageUrl: z.string(),
});

export const blogFormSchema = z.object({
  internalTitle: z.string().min(1),
  slug: z.string().min(1),
  status: publishStatusSchema,
  publishedAt: z.string(),
  titleEn: z.string().min(1),
  titleBg: z.string().min(1),
  excerptEn: z.string(),
  excerptBg: z.string(),
  bodyEn: z.string(),
  bodyBg: z.string(),
  coverAltEn: z.string(),
  coverAltBg: z.string(),
  seoTitleEn: z.string(),
  seoTitleBg: z.string(),
  seoDescriptionEn: z.string(),
  seoDescriptionBg: z.string(),
  coverImageUrl: z.string(),
});

export const siteSettingsFormSchema = z.object({
  brandName: z.string().min(1),
  heroHeadingEn: z.string(),
  heroHeadingBg: z.string(),
  heroSubheadingEn: z.string(),
  heroSubheadingBg: z.string(),
  aboutHeadingEn: z.string(),
  aboutHeadingBg: z.string(),
  aboutSummaryEn: z.string(),
  aboutSummaryBg: z.string(),
  aboutBodyEn: z.string(),
  aboutBodyBg: z.string(),
  contactHeadingEn: z.string(),
  contactHeadingBg: z.string(),
  contactIntroEn: z.string(),
  contactIntroBg: z.string(),
  phone: z.string(),
  email: z.string(),
  locationEn: z.string(),
  locationBg: z.string(),
  instagramUrl: z.string(),
  facebookUrl: z.string(),
  surveyUrl: z.string(),
  pricesHeadingEn: z.string(),
  pricesHeadingBg: z.string(),
  pricesIntroEn: z.string(),
  pricesIntroBg: z.string(),
  paymentHeadingEn: z.string(),
  paymentHeadingBg: z.string(),
  paymentTermsEn: z.string(),
  paymentTermsBg: z.string(),
  logoUrl: z.string(),
  heroImageUrl: z.string(),
  aboutImageUrl: z.string(),
});

export function formDataToObject(formData: FormData): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      result[key] = value;
    }
  }
  // Checkboxes only appear when checked
  if (!("featured" in result) && formData.has("_featured_present")) {
    result.featured = "false";
  }
  return result;
}
