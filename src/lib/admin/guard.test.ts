import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { AdminAuthError, AdminConfigError, requireAirtableContentSource } from "@/lib/admin/guard";
import { resetEnvCacheForTests } from "@/lib/env";

describe("admin guard", () => {
  it("exposes AdminAuthError for unauthorized access", () => {
    const error = new AdminAuthError();
    assert.equal(error.name, "AdminAuthError");
    assert.equal(error.message, "Unauthorized");
  });

  it("requireAirtableContentSource rejects mock mode", () => {
    const previous = process.env.CONTENT_SOURCE;
    process.env.CONTENT_SOURCE = "mock";
    resetEnvCacheForTests();
    try {
      assert.throws(() => requireAirtableContentSource(), (error: unknown) => {
        assert.ok(error instanceof AdminConfigError);
        return true;
      });
    } finally {
      if (previous === undefined) {
        delete process.env.CONTENT_SOURCE;
      } else {
        process.env.CONTENT_SOURCE = previous;
      }
      resetEnvCacheForTests();
    }
  });
});
