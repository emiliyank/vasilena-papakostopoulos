/**
 * Raw Airtable API response shapes.
 * Keep these types inside `src/lib/airtable` — UI must use normalized models from `@/types`.
 */

export type AirtableThumbnail = {
  url: string;
  width: number;
  height: number;
};

export type AirtableAttachment = {
  id: string;
  url: string;
  filename: string;
  size?: number;
  type?: string;
  width?: number;
  height?: number;
  thumbnails?: {
    small?: AirtableThumbnail;
    large?: AirtableThumbnail;
    full?: AirtableThumbnail;
  };
};

export type AirtableRecord<TFields extends Record<string, unknown>> = {
  id: string;
  createdTime: string;
  fields: TFields;
};

export type AirtableListResponse<TFields extends Record<string, unknown>> = {
  records: AirtableRecord<TFields>[];
  offset?: string;
};

export type AirtableProjectFields = {
  "Internal Name"?: string;
  Slug?: string;
  Status?: string;
  Order?: number;
  "Title EN"?: string;
  "Title BG"?: string;
  "Summary EN"?: string;
  "Summary BG"?: string;
  "Description EN"?: string;
  "Description BG"?: string;
  "Project Type EN"?: string;
  "Project Type BG"?: string;
  "Location EN"?: string;
  "Location BG"?: string;
  "Project Date"?: string;
  "Cover Image"?: AirtableAttachment[];
  "Project Images"?: string[];
  Featured?: boolean;
  "Featured Order"?: number;
  "SEO Title EN"?: string;
  "SEO Title BG"?: string;
  "SEO Description EN"?: string;
  "SEO Description BG"?: string;
};

export type AirtableProjectImageFields = {
  "Internal Name"?: string;
  Project?: string[];
  Image?: AirtableAttachment[];
  Order?: number;
  "Alt Text EN"?: string;
  "Alt Text BG"?: string;
  "Caption EN"?: string;
  "Caption BG"?: string;
  "Layout Span"?: string;
};

export type AirtableServiceFields = {
  "Internal Name"?: string;
  Slug?: string;
  Status?: string;
  Order?: number;
  "Title EN"?: string;
  "Title BG"?: string;
  "Short Description EN"?: string;
  "Short Description BG"?: string;
  "Full Description EN"?: string;
  "Full Description BG"?: string;
};

export type AirtableBlogPostFields = {
  "Internal Title"?: string;
  Slug?: string;
  Status?: string;
  "Published At"?: string;
  "Title EN"?: string;
  "Title BG"?: string;
  "Excerpt EN"?: string;
  "Excerpt BG"?: string;
  "Body EN"?: string;
  "Body BG"?: string;
  "Cover Image"?: AirtableAttachment[];
  "Cover Alt EN"?: string;
  "Cover Alt BG"?: string;
  "SEO Title EN"?: string;
  "SEO Title BG"?: string;
  "SEO Description EN"?: string;
  "SEO Description BG"?: string;
};

export type AirtablePriceFields = {
  "Internal Name"?: string;
  Status?: string;
  Order?: number;
  "Name EN"?: string;
  "Name BG"?: string;
  "Description EN"?: string;
  "Description BG"?: string;
  "Price Display EN"?: string;
  "Price Display BG"?: string;
  "Features EN"?: string;
  "Features BG"?: string;
  "Notes EN"?: string;
  "Notes BG"?: string;
};

export type AirtableSiteSettingsFields = {
  "Internal Name"?: string;
  Active?: boolean;
  "Brand Name"?: string;
  "Hero Heading EN"?: string;
  "Hero Heading BG"?: string;
  "Hero Subheading EN"?: string;
  "Hero Subheading BG"?: string;
  "About Heading EN"?: string;
  "About Heading BG"?: string;
  "About Summary EN"?: string;
  "About Summary BG"?: string;
  "About Body EN"?: string;
  "About Body BG"?: string;
  "Contact Heading EN"?: string;
  "Contact Heading BG"?: string;
  "Contact Intro EN"?: string;
  "Contact Intro BG"?: string;
  Phone?: string;
  Email?: string;
  "Location EN"?: string;
  "Location BG"?: string;
  "Instagram URL"?: string;
  "Facebook URL"?: string;
  "Survey URL"?: string;
  Logo?: AirtableAttachment[];
  "Hero Image"?: AirtableAttachment[];
  "About Image"?: AirtableAttachment[];
  "Prices Heading EN"?: string;
  "Prices Heading BG"?: string;
  "Prices Intro EN"?: string;
  "Prices Intro BG"?: string;
  "Payment Heading EN"?: string;
  "Payment Heading BG"?: string;
  "Payment Terms EN"?: string;
  "Payment Terms BG"?: string;
};
