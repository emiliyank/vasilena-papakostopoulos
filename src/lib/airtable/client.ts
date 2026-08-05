import { getEnv } from "@/lib/env";
import type { AirtableListResponse } from "@/lib/airtable/types";

export class AirtableError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "AirtableError";
  }
}

type ListOptions = {
  filterByFormula?: string;
  sort?: Array<{ field: string; direction?: "asc" | "desc" }>;
};

function getCredentials() {
  const env = getEnv();
  if (!env.AIRTABLE_PAT || !env.AIRTABLE_BASE_ID) {
    throw new AirtableError("Airtable credentials are not configured");
  }
  return {
    pat: env.AIRTABLE_PAT,
    baseId: env.AIRTABLE_BASE_ID,
    revalidate: env.AIRTABLE_REVALIDATE_SECONDS,
  };
}

export async function listAirtableRecords<TFields extends Record<string, unknown>>(
  tableName: string,
  options: ListOptions = {},
): Promise<AirtableListResponse<TFields>["records"]> {
  const { pat, baseId, revalidate } = getCredentials();
  const records: AirtableListResponse<TFields>["records"] = [];
  let offset: string | undefined;

  do {
    const params = new URLSearchParams();
    params.set("pageSize", "100");
    if (options.filterByFormula) {
      params.set("filterByFormula", options.filterByFormula);
    }
    options.sort?.forEach((entry, index) => {
      params.set(`sort[${index}][field]`, entry.field);
      params.set(`sort[${index}][direction]`, entry.direction ?? "asc");
    });
    if (offset) {
      params.set("offset", offset);
    }

    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?${params}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${pat}`,
      },
      next: {
        revalidate,
        tags: ["airtable", `airtable:${tableName}`],
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new AirtableError(
        `Airtable request failed for "${tableName}" (${response.status}): ${body}`,
        response.status,
      );
    }

    const payload = (await response.json()) as AirtableListResponse<TFields>;
    records.push(...payload.records);
    offset = payload.offset;
  } while (offset);

  return records;
}
