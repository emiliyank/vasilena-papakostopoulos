const WIX_MEDIA_BASE = "https://static.wixstatic.com/media";

/** Build a temporary Wix CDN URL suitable for next/image. */
export function wixMediaUrl(
  mediaId: string,
  width = 1600,
  height = 2000,
): string {
  return `${WIX_MEDIA_BASE}/${mediaId}/v1/fit/w_${width},h_${height},q_90,enc_avif,quality_auto/${mediaId}`;
}
