import { getEnv } from "@/lib/env";
import { AirtableError } from "@/lib/airtable/client";
import type { AirtableRecord } from "@/lib/airtable/types";

function getWriteCredentials() {
  const env = getEnv();
  if (!env.AIRTABLE_PAT || !env.AIRTABLE_BASE_ID) {
    throw new AirtableError("Airtable credentials are not configured");
  }
  return {
    pat: env.AIRTABLE_PAT,
    baseId: env.AIRTABLE_BASE_ID,
  };
}

async function mutateAirtable<TFields extends Record<string, unknown>>(
  method: "POST" | "PATCH" | "DELETE",
  tableName: string,
  pathSuffix: string,
  body?: unknown,
): Promise<AirtableRecord<TFields> | null> {
  const { pat, baseId } = getWriteCredentials();
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}${pathSuffix}`;

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${pat}`,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new AirtableError(
      `Airtable ${method} failed for "${tableName}" (${response.status}): ${text}`,
      response.status,
    );
  }

  if (method === "DELETE") {
    return null;
  }

  return (await response.json()) as AirtableRecord<TFields>;
}

export async function createAirtableRecord<TFields extends Record<string, unknown>>(
  tableName: string,
  fields: Record<string, unknown>,
): Promise<AirtableRecord<TFields>> {
  const record = await mutateAirtable<TFields>("POST", tableName, "", {
    fields,
    typecast: true,
  });
  if (!record) {
    throw new AirtableError(`Airtable create returned empty response for "${tableName}"`);
  }
  return record;
}

export async function updateAirtableRecord<TFields extends Record<string, unknown>>(
  tableName: string,
  recordId: string,
  fields: Record<string, unknown>,
): Promise<AirtableRecord<TFields>> {
  const record = await mutateAirtable<TFields>("PATCH", tableName, `/${recordId}`, {
    fields,
    typecast: true,
  });
  if (!record) {
    throw new AirtableError(`Airtable update returned empty response for "${tableName}"`);
  }
  return record;
}

export async function deleteAirtableRecord(tableName: string, recordId: string): Promise<void> {
  await mutateAirtable("DELETE", tableName, `/${recordId}`);
}

/** Attach a remote URL; Airtable downloads and stores the file. */
export async function setAttachmentFromUrl(
  tableName: string,
  recordId: string,
  fieldName: string,
  url: string,
  filename?: string,
): Promise<void> {
  await updateAirtableRecord(tableName, recordId, {
    [fieldName]: [{ url, filename: filename ?? "upload" }],
  });
}

/**
 * Upload a binary attachment via Airtable content API.
 * Requires a write-capable PAT; field must already exist on the record.
 */
export async function uploadAirtableAttachment(options: {
  recordId: string;
  fieldName: string;
  filename: string;
  contentType: string;
  bytes: ArrayBuffer;
}): Promise<void> {
  const { pat, baseId } = getWriteCredentials();
  const url = `https://content.airtable.com/v0/${baseId}/${options.recordId}/${encodeURIComponent(options.fieldName)}/uploadAttachment`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${pat}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contentType: options.contentType,
      filename: options.filename,
      file: Buffer.from(options.bytes).toString("base64"),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new AirtableError(
      `Airtable attachment upload failed (${response.status}): ${text}`,
      response.status,
    );
  }
}
