import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildGalleryRows } from "@/components/projects/gallery-rows";
import { contactFormSchema } from "@/lib/email/contact-schema";
import type { ProjectImage } from "@/types/content";

function image(id: string, span: "full" | "half"): ProjectImage {
  return {
    id,
    src: `/img/${id}.jpg`,
    width: 1000,
    height: 1200,
    alt: { en: id, bg: id },
    order: 1,
    layoutSpan: span,
  };
}

describe("buildGalleryRows", () => {
  it("pairs consecutive half-width images", () => {
    const rows = buildGalleryRows([
      image("a", "full"),
      image("b", "half"),
      image("c", "half"),
      image("d", "full"),
    ]);
    assert.equal(rows.length, 3);
    assert.equal(rows[1]?.length, 2);
  });
});

describe("contactFormSchema", () => {
  it("accepts a valid payload", () => {
    const parsed = contactFormSchema.parse({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      message: "Hello",
      locale: "en",
      website: "",
      startedAt: Date.now(),
    });
    assert.equal(parsed.firstName, "Ada");
  });

  it("keeps honeypot values parseable for silent discard", () => {
    const parsed = contactFormSchema.safeParse({
      firstName: "Ada",
      email: "ada@example.com",
      message: "Hello",
      locale: "en",
      website: "spam",
      startedAt: Date.now(),
    });
    assert.equal(parsed.success, true);
    if (parsed.success) {
      assert.equal(parsed.data.website, "spam");
    }
  });
});
