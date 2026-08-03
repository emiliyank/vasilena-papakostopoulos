import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { defaultLocale, isLocale } from "@/lib/i18n/config";
import {
  blogPath,
  homePath,
  projectPath,
  sectionPath,
  switchLocalePath,
} from "@/lib/i18n/paths";

describe("i18n paths", () => {
  it("builds localized routes", () => {
    assert.equal(homePath("en"), "/en");
    assert.equal(homePath("bg"), "/bg");
    assert.equal(projectPath("en", "balance"), "/en/projects/balance");
    assert.equal(blogPath("bg"), "/bg/blog");
    assert.equal(sectionPath("en", "portfolio"), "/en#portfolio");
  });

  it("switches locale while preserving path", () => {
    assert.equal(switchLocalePath("/en/projects/form", "bg"), "/bg/projects/form");
    assert.equal(switchLocalePath("/bg", "en"), "/en");
  });

  it("validates locales", () => {
    assert.equal(defaultLocale, "en");
    assert.equal(isLocale("en"), true);
    assert.equal(isLocale("de"), false);
  });
});
