import type { MediaAsset } from "@/types/content";
import { wixMediaUrl } from "@/lib/media/wix";

export function temporaryWixAsset(
  id: string,
  mediaId: string,
  altEn: string,
  altBg: string,
  width = 1200,
  height = 1600,
): MediaAsset {
  return {
    id,
    src: wixMediaUrl(mediaId, width, height),
    width,
    height,
    alt: { en: altEn, bg: altBg },
    temporarySource: true,
  };
}
