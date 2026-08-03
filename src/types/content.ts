import type { Locale } from "@/types/locale";
import type { RichTextDocument } from "@/types/rich-text";

export type PublishStatus = "draft" | "published" | "archived";

export type LocalizedString = Record<Locale, string>;

export type MediaAsset = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: LocalizedString;
  caption?: LocalizedString;
  /** Temporary Wix CDN asset tracked for replacement. */
  temporarySource?: boolean;
};

export type GalleryLayoutSpan = "full" | "half";

export type ProjectImage = MediaAsset & {
  order: number;
  layoutSpan: GalleryLayoutSpan;
};

export type Project = {
  id: string;
  slug: string;
  status: PublishStatus;
  order: number;
  title: LocalizedString;
  summary: LocalizedString;
  description: LocalizedString;
  projectType: LocalizedString;
  location: LocalizedString;
  projectDate: string;
  coverImage: MediaAsset;
  images: ProjectImage[];
  featured?: boolean;
  seoTitle?: LocalizedString;
  seoDescription?: LocalizedString;
};

export type Service = {
  id: string;
  slug: string;
  status: PublishStatus;
  order: number;
  title: LocalizedString;
  shortDescription: LocalizedString;
  fullDescription: LocalizedString;
};

export type BlogPost = {
  id: string;
  slug: string;
  status: PublishStatus;
  publishedAt: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  body: Record<Locale, RichTextDocument>;
  coverImage?: MediaAsset;
  seoTitle?: LocalizedString;
  seoDescription?: LocalizedString;
};

export type PriceItem = {
  id: string;
  status: PublishStatus;
  order: number;
  name: LocalizedString;
  description: LocalizedString;
  priceDisplay: LocalizedString;
  notes?: LocalizedString;
};

export type SiteSettings = {
  brandName: string;
  heroHeading: LocalizedString;
  heroSubheading: LocalizedString;
  aboutHeading: LocalizedString;
  aboutSummary: LocalizedString;
  aboutBody: LocalizedString;
  contactHeading: LocalizedString;
  contactIntro: LocalizedString;
  phone: string;
  email: string;
  location: LocalizedString;
  instagramUrl: string;
  facebookUrl: string;
  surveyUrl: string;
  logo?: MediaAsset;
  heroImage?: MediaAsset;
  aboutImage?: MediaAsset;
};
