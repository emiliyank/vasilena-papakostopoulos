import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { hashPassword, verifyPassword } from "@/lib/admin/password";
import {
  decodePasswordHash,
  encodePasswordHash,
  isValidBcryptHash,
  parseAdminUsers,
} from "@/lib/admin/users";
import { serviceFields, toAirtableStatus } from "@/lib/airtable/map-fields";

describe("admin users", () => {
  it("parses ADMIN_USERS JSON", () => {
    const users = parseAdminUsers(
      JSON.stringify([{ email: "Admin@Example.com", passwordHash: "x".repeat(20) }]),
    );
    assert.equal(users.length, 1);
    assert.equal(users[0]?.email, "Admin@Example.com");
  });

  it("decodes bcrypt64 password hashes", async () => {
    const hash = await hashPassword("correct-horse");
    const encoded = encodePasswordHash(hash);
    assert.ok(encoded.startsWith("bcrypt64:"));
    assert.equal(decodePasswordHash(encoded), hash);
    assert.equal(isValidBcryptHash(decodePasswordHash(encoded)), true);

    const users = parseAdminUsers(
      JSON.stringify([{ email: "admin@example.com", passwordHash: encoded }]),
    );
    assert.equal(await verifyPassword("correct-horse", users[0]!.passwordHash), true);
  });

  it("rejects invalid ADMIN_USERS", () => {
    assert.throws(() => parseAdminUsers("{not-json"), /valid JSON/);
  });
});
describe("password hashing", () => {
  it("verifies a bcrypt hash", async () => {
    const hash = await hashPassword("correct-horse");
    assert.equal(await verifyPassword("correct-horse", hash), true);
    assert.equal(await verifyPassword("wrong", hash), false);
  });
});

describe("airtable field mapping", () => {
  it("maps publish status labels", () => {
    assert.equal(toAirtableStatus("published"), "Published");
    assert.equal(toAirtableStatus("draft"), "Draft");
    assert.equal(toAirtableStatus("archived"), "Archived");
  });

  it("builds service write fields", () => {
    const fields = serviceFields({
      internalName: "Interior",
      slug: "interior-design",
      status: "published",
      order: 1,
      titleEn: "Interior Design",
      titleBg: "Интериорен дизайн",
      shortDescriptionEn: "Short",
      shortDescriptionBg: "Кратко",
      fullDescriptionEn: "Full",
      fullDescriptionBg: "Пълно",
    });

    assert.equal(fields.Status, "Published");
    assert.equal(fields.Slug, "interior-design");
    assert.equal(fields["Title EN"], "Interior Design");
    assert.equal(fields.Order, 1);
  });
});
