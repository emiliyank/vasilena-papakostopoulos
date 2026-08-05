import type { ProjectImage } from "@/types/content";

export function buildGalleryRows(images: ProjectImage[]): ProjectImage[][] {
  const rows: ProjectImage[][] = [];
  let index = 0;

  while (index < images.length) {
    const current = images[index];
    if (current.layoutSpan === "half") {
      const nextHalf = images[index + 1];
      if (nextHalf?.layoutSpan === "half") {
        rows.push([current, nextHalf]);
        index += 2;
        continue;
      }
    }
    rows.push([current]);
    index += 1;
  }

  return rows;
}
