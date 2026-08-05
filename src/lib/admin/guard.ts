import { auth } from "@/auth";
import { getEnv } from "@/lib/env";

export class AdminAuthError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AdminAuthError";
  }
}

export class AdminConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminConfigError";
  }
}

export async function requireAdminSession() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    throw new AdminAuthError();
  }
  return { email };
}

export function requireAirtableContentSource() {
  const env = getEnv();
  if (env.CONTENT_SOURCE !== "airtable") {
    throw new AdminConfigError(
      "Admin content editing requires CONTENT_SOURCE=airtable and a write-capable Airtable PAT.",
    );
  }
  if (!env.AIRTABLE_PAT || !env.AIRTABLE_BASE_ID) {
    throw new AdminConfigError("Airtable credentials are not configured.");
  }
  return env;
}
