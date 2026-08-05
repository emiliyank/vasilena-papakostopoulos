import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { markdownToRichText } from "@/lib/airtable/rich-text";
import {
  normalizePriceItem,
  normalizeService,
} from "@/lib/airtable/normalize";
import type {
  AirtablePriceFields,
  AirtableRecord,
  AirtableServiceFields,
} from "@/lib/airtable/types";

describe("markdownToRichText", () => {
  it("parses headings, paragraphs, and lists", () => {
    const doc = markdownToRichText(
      "## Before we meet\n\nIntro text with **bold**.\n\n- One\n- Two\n\n1. First\n2. Second",
    );

    assert.equal(doc.blocks[0]?.type, "heading");
    assert.equal(doc.blocks[1]?.type, "paragraph");
    assert.equal(doc.blocks[2]?.type, "bulletList");
    assert.equal(doc.blocks[3]?.type, "numberedList");
  });

  it("returns empty document for blank input", () => {
    assert.deepEqual(markdownToRichText("   "), { blocks: [] });
  });
});

describe("normalizeService", () => {
  it("maps Airtable fields into the public service model", () => {
    const record: AirtableRecord<AirtableServiceFields> = {
      id: "rec1",
      createdTime: "2026-01-01T00:00:00.000Z",
      fields: {
        "Internal Name": "Interior Design",
        Slug: "interior-design",
        Status: "Published",
        Order: 1,
        "Title EN": "Interior Design",
        "Title BG": "Интериорен дизайн",
        "Short Description EN": "Short EN",
        "Short Description BG": "Short BG",
        "Full Description EN": "Full EN",
        "Full Description BG": "Full BG",
      },
    };

    const service = normalizeService(record);
    assert.equal(service.slug, "interior-design");
    assert.equal(service.status, "published");
    assert.equal(service.title.bg, "Интериорен дизайн");
  });
});

describe("normalizePriceItem", () => {
  it("splits feature lines into localized feature arrays", () => {
    const record: AirtableRecord<AirtablePriceFields> = {
      id: "rec-price",
      createdTime: "2026-01-01T00:00:00.000Z",
      fields: {
        Status: "Published",
        Order: 2,
        "Name EN": "Basic package",
        "Name BG": "Базов пакет",
        "Description EN": "Desc",
        "Description BG": "Описание",
        "Price Display EN": "7 EUR/m²",
        "Price Display BG": "7 Евро/м2",
        "Features EN": "Feature A\nFeature B",
        "Features BG": "Функция A\nФункция B",
      },
    };

    const price = normalizePriceItem(record);
    assert.equal(price.features?.length, 2);
    assert.equal(price.features?.[0]?.bg, "Функция A");
    assert.equal(price.priceDisplay.en, "7 EUR/m²");
  });
});
