import type { LocalizedString, MediaAsset, PublishStatus } from "@/types/content";
import type { AirtableAttachment } from "@/lib/airtable/types";

export function localized(
  en: string | undefined,
  bg: string | undefined,
  fallback = "",
): LocalizedString {
  return {
    en: en?.trim() || fallback,
    bg: bg?.trim() || en?.trim() || fallback,
  };
}

export function optionalLocalized(
  en: string | undefined,
  bg: string | undefined,
): LocalizedString | undefined {
  if (!en?.trim() && !bg?.trim()) {
    return undefined;
  }
  return localized(en, bg);
}

export function normalizeStatus(value: string | undefined): PublishStatus {
  const normalized = value?.trim().toLowerCase();
  if (normalized === "published") return "published";
  if (normalized === "archived") return "archived";
  return "draft";
}

export function splitLines(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function attachmentToMedia(
  attachment: AirtableAttachment | undefined,
  alt: LocalizedString,
  caption?: LocalizedString,
): MediaAsset | undefined {
  if (!attachment?.url) {
    return undefined;
  }

  const width =
    attachment.width ??
    attachment.thumbnails?.full?.width ??
    attachment.thumbnails?.large?.width ??
    1600;
  const height =
    attachment.height ??
    attachment.thumbnails?.full?.height ??
    attachment.thumbnails?.large?.height ??
    1200;

  return {
    id: attachment.id,
    src: attachment.url,
    width,
    height,
    alt,
    caption,
    temporarySource: false,
  };
}

export function firstAttachment(
  attachments: AirtableAttachment[] | undefined,
): AirtableAttachment | undefined {
  return attachments?.[0];
}

/** Placeholder cover used only when a published project is missing an image. */
export function emptyMedia(id: string, alt: LocalizedString): MediaAsset {
  return {
    id,
    src: "/brand/logo.png",
    width: 256,
    height: 256,
    alt,
    temporarySource: true,
  };
}
