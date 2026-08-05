#!/usr/bin/env node

/**
 * One-time Airtable schema installer for the Vassilena Portfolio website.
 *
 * Requirements:
 *   Node.js 18+
 *   AIRTABLE_SETUP_PAT with schema.bases:read + schema.bases:write
 *   AIRTABLE_BASE_ID beginning with app
 *
 * Safety:
 *   - Dry-run by default; pass --apply to create schema.
 *   - Never deletes tables, fields, or records.
 *   - Never creates content records.
 *   - Reuses exact-name tables and compatible exact-name fields.
 *   - Stops on incompatible existing fields.
 */

const API_ROOT = "https://api.airtable.com/v0/meta/bases";
const APPLY = process.argv.includes("--apply");
const setupPat = process.env.AIRTABLE_SETUP_PAT;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!setupPat) {
  fail("Missing AIRTABLE_SETUP_PAT. Use the temporary schema-write token, not the website token.");
}

if (!baseId || !/^app[A-Za-z0-9]+$/.test(baseId)) {
  fail("Missing or invalid AIRTABLE_BASE_ID. It must begin with 'app'.");
}

const STATUS_CHOICES = ["Draft", "Published", "Archived"];
const LAYOUT_CHOICES = ["full", "half"];

const singleLine = (name, description) => ({ name, type: "singleLineText", description });
const longText = (name, description, richText = false) => ({
  name,
  type: "multilineText",
  ...(richText ? { options: { isRichText: true } } : {}),
  description,
});
const number = (name, description) => ({
  name,
  type: "number",
  options: { precision: 0 },
  description,
});
const singleSelect = (name, choices, description) => ({
  name,
  type: "singleSelect",
  options: { choices: choices.map((choice) => ({ name: choice })) },
  description,
});
const date = (name, description) => ({
  name,
  type: "date",
  options: { dateFormat: { name: "iso" } },
  description,
});
const attachment = (name, description) => ({ name, type: "multipleAttachments", description });
const checkbox = (name, description) => ({
  name,
  type: "checkbox",
  options: { icon: "check", color: "greenBright" },
  description,
});
const url = (name, description) => ({ name, type: "url", description });
const email = (name, description) => ({ name, type: "email", description });
const phone = (name, description) => ({ name, type: "phoneNumber", description });

const schema = [
  {
    name: "Projects",
    description: "Bilingual portfolio projects. Public pages use Published records only.",
    primary: singleLine("Internal Name", "Editor-facing project label."),
    fields: [
      singleLine("Slug", "Unique lowercase URL slug."),
      singleSelect("Status", STATUS_CHOICES, "Publishing state."),
      number("Order", "Portfolio and previous/next ordering."),
      singleLine("Title EN"),
      singleLine("Title BG"),
      longText("Summary EN"),
      longText("Summary BG"),
      longText("Description EN"),
      longText("Description BG"),
      singleLine("Project Type EN"),
      singleLine("Project Type BG"),
      singleLine("Location EN"),
      singleLine("Location BG"),
      date("Project Date"),
      attachment("Cover Image", "One cover image preferred."),
      checkbox("Featured", "Optional homepage emphasis."),
      number("Featured Order", "Optional featured-project ordering."),
      singleLine("SEO Title EN"),
      singleLine("SEO Title BG"),
      longText("SEO Description EN"),
      longText("SEO Description BG"),
    ],
  },
  {
    name: "Project Images",
    description: "Ordered project gallery images linked to Projects.",
    primary: singleLine("Internal Name", "Editor-facing image label."),
    fields: [
      attachment("Image", "Normally one image per record."),
      number("Order", "Image order within the linked project."),
      singleLine("Alt Text EN"),
      singleLine("Alt Text BG"),
      singleLine("Caption EN"),
      singleLine("Caption BG"),
      singleSelect("Layout Span", LAYOUT_CHOICES, "Gallery width: full or half."),
    ],
  },
  {
    name: "Services",
    description: "Bilingual service descriptions.",
    primary: singleLine("Internal Name"),
    fields: [
      singleLine("Slug"),
      singleSelect("Status", STATUS_CHOICES),
      number("Order"),
      singleLine("Title EN"),
      singleLine("Title BG"),
      longText("Short Description EN"),
      longText("Short Description BG"),
      longText("Full Description EN"),
      longText("Full Description BG"),
    ],
  },
  {
    name: "Blog Posts",
    description: "Bilingual blog articles. Body fields use Airtable rich text/Markdown.",
    primary: singleLine("Internal Title"),
    fields: [
      singleLine("Slug"),
      singleSelect("Status", STATUS_CHOICES),
      date("Published At", "Publication date; time can be enabled later if needed."),
      singleLine("Title EN"),
      singleLine("Title BG"),
      longText("Excerpt EN"),
      longText("Excerpt BG"),
      // Airtable Meta API rejects isRichText on create; enable rich text manually in the UI if needed.
      longText("Body EN", "Article body. Prefer enabling Airtable rich text in the UI; API returns Markdown."),
      longText("Body BG", "Article body. Prefer enabling Airtable rich text in the UI; API returns Markdown."),
      attachment("Cover Image"),
      singleLine("Cover Alt EN"),
      singleLine("Cover Alt BG"),
      singleLine("SEO Title EN"),
      singleLine("SEO Title BG"),
      longText("SEO Description EN"),
      longText("SEO Description BG"),
    ],
  },
  {
    name: "Prices",
    description: "Bilingual service packages and pricing.",
    primary: singleLine("Internal Name"),
    fields: [
      singleSelect("Status", STATUS_CHOICES),
      number("Order"),
      singleLine("Name EN"),
      singleLine("Name BG"),
      longText("Description EN"),
      longText("Description BG"),
      singleLine("Price Display EN"),
      singleLine("Price Display BG"),
      longText("Features EN", "One feature per line."),
      longText("Features BG", "One feature per line."),
      longText("Notes EN"),
      longText("Notes BG"),
    ],
  },
  {
    name: "Site Settings",
    description: "Global bilingual site content. Exactly one record should be Active.",
    primary: singleLine("Internal Name", "For example: Production."),
    fields: [
      checkbox("Active", "Exactly one settings record should be checked."),
      singleLine("Brand Name"),
      singleLine("Hero Heading EN"),
      singleLine("Hero Heading BG"),
      longText("Hero Subheading EN"),
      longText("Hero Subheading BG"),
      singleLine("About Heading EN"),
      singleLine("About Heading BG"),
      longText("About Summary EN"),
      longText("About Summary BG"),
      longText("About Body EN"),
      longText("About Body BG"),
      singleLine("Contact Heading EN"),
      singleLine("Contact Heading BG"),
      longText("Contact Intro EN"),
      longText("Contact Intro BG"),
      phone("Phone"),
      email("Email"),
      singleLine("Location EN"),
      singleLine("Location BG"),
      url("Instagram URL"),
      url("Facebook URL"),
      url("Survey URL", "Use the public Google Form viewform URL."),
      attachment("Logo"),
      attachment("Hero Image"),
      attachment("About Image"),
      singleLine("Prices Heading EN"),
      singleLine("Prices Heading BG"),
      longText("Prices Intro EN"),
      longText("Prices Intro BG"),
      singleLine("Payment Heading EN"),
      singleLine("Payment Heading BG"),
      longText("Payment Terms EN", "One payment term per line."),
      longText("Payment Terms BG", "One payment term per line."),
    ],
  },
];

const linkedFields = [
  {
    table: "Project Images",
    field: {
      name: "Project",
      type: "multipleRecordLinks",
      description: "The single parent portfolio project.",
      targetTable: "Projects",
      prefersSingleRecordLink: true,
      inverseLinkFieldName: "Project Images",
    },
  },
];

async function main() {
  console.log(`Airtable base: ${baseId}`);
  console.log(APPLY ? "Mode: APPLY" : "Mode: DRY RUN (no changes will be made)");

  let current = await getSchema();
  const tableByName = new Map(current.tables.map((table) => [table.name, table]));

  for (const tableSpec of schema) {
    let table = tableByName.get(tableSpec.name);

    if (!table) {
      logPlan(`Create table '${tableSpec.name}' with ${1 + tableSpec.fields.length} non-linked fields`);
      if (APPLY) {
        table = await createTable(tableSpec);
        tableByName.set(table.name, table);
        console.log(`  created ${table.name} (${table.id})`);
      }
      continue;
    }

    console.log(`Found table '${tableSpec.name}' (${table.id})`);
    await ensurePrimaryField(table, tableSpec.primary);
    for (const fieldSpec of tableSpec.fields) {
      await ensureField(table, fieldSpec);
      if (APPLY) {
        current = await getSchema();
        table = current.tables.find((item) => item.name === tableSpec.name);
        tableByName.set(table.name, table);
      }
    }
  }

  if (APPLY) {
    current = await getSchema();
    tableByName.clear();
    for (const table of current.tables) tableByName.set(table.name, table);
  }

  for (const link of linkedFields) {
    const source = tableByName.get(link.table);
    const target = tableByName.get(link.field.targetTable);
    if (!source || !target) {
      if (!APPLY) {
        logPlan(`Create linked field '${link.table}.${link.field.name}' after both tables exist`);
        continue;
      }
      fail(`Cannot create link '${link.table}.${link.field.name}': source or target table is missing.`);
    }

    const fieldSpec = {
      name: link.field.name,
      type: link.field.type,
      description: link.field.description,
      options: {
        linkedTableId: target.id,
      },
    };
    await ensureField(source, fieldSpec, target.id);
  }

  if (!APPLY) {
    console.log("\nDry run complete. Review the plan, then rerun with --apply.");
    return;
  }

  const finalSchema = await getSchema();
  verifyFinalSchema(finalSchema);
  console.log("\nSchema installation complete and verified.");

  const extras = finalSchema.tables.filter((table) => !schema.some((item) => item.name === table.name));
  if (extras.length) {
    console.log("\nExtra tables were not changed or deleted:");
    for (const table of extras) console.log(`  - ${table.name} (${table.id})`);
    console.log("Delete an unused default table such as 'Table 1' manually only after confirming it contains no needed data.");
  }
}

async function getSchema() {
  return api(`${API_ROOT}/${baseId}/tables`);
}

async function createTable(tableSpec) {
  return api(`${API_ROOT}/${baseId}/tables`, {
    method: "POST",
    body: JSON.stringify({
      name: tableSpec.name,
      description: tableSpec.description,
      fields: [cleanField(tableSpec.primary), ...tableSpec.fields.map(cleanField)],
    }),
  });
}

async function ensurePrimaryField(table, expected) {
  const primary = table.primaryFieldId
    ? table.fields.find((field) => field.id === table.primaryFieldId)
    : table.fields[0];
  if (!primary) fail(`Table '${table.name}' has no primary field.`);
  if (primary.name !== expected.name || primary.type !== expected.type) {
    fail(
      `Table '${table.name}' has incompatible primary field '${primary.name}' (${primary.type}); ` +
        `expected '${expected.name}' (${expected.type}). Rename/configure it in Airtable, then rerun.`,
    );
  }
  console.log(`  ok primary field '${expected.name}'`);
}

async function ensureField(table, expected, expectedLinkedTableId) {
  const existing = table.fields.find((field) => field.name === expected.name);
  if (!existing) {
    logPlan(`Create field '${table.name}.${expected.name}' (${expected.type})`);
    if (APPLY) {
      const created = await api(`${API_ROOT}/${baseId}/tables/${table.id}/fields`, {
        method: "POST",
        body: JSON.stringify(cleanField(expected)),
      });
      console.log(`  created field '${created.name}' (${created.id})`);
    }
    return;
  }

  if (existing.type !== expected.type) {
    fail(
      `Field '${table.name}.${expected.name}' has type '${existing.type}', expected '${expected.type}'. ` +
        "The script will not modify or delete it.",
    );
  }

  if (
    expectedLinkedTableId &&
    existing.options?.linkedTableId &&
    existing.options.linkedTableId !== expectedLinkedTableId
  ) {
    fail(`Linked field '${table.name}.${expected.name}' points to the wrong table.`);
  }

  validateChoiceNames(table.name, existing, expected);
  console.log(`  ok field '${expected.name}'`);
}

function validateChoiceNames(tableName, existing, expected) {
  if (expected.type !== "singleSelect") return;
  const actualNames = new Set((existing.options?.choices ?? []).map((choice) => choice.name));
  const expectedNames = (expected.options?.choices ?? []).map((choice) => choice.name);
  const missing = expectedNames.filter((name) => !actualNames.has(name));
  if (missing.length) {
    fail(
      `Single-select field '${tableName}.${expected.name}' is missing choices: ${missing.join(", ")}. ` +
        "Add them in Airtable or remove the conflicting field and rerun on a blank schema.",
    );
  }
}

function verifyFinalSchema(finalSchema) {
  const tables = new Map(finalSchema.tables.map((table) => [table.name, table]));
  for (const spec of schema) {
    const table = tables.get(spec.name);
    if (!table) fail(`Verification failed: missing table '${spec.name}'.`);
    const required = [spec.primary, ...spec.fields];
    for (const fieldSpec of required) {
      const field = table.fields.find((item) => item.name === fieldSpec.name);
      if (!field || field.type !== fieldSpec.type) {
        fail(`Verification failed: missing or incompatible field '${spec.name}.${fieldSpec.name}'.`);
      }
    }
  }
  for (const link of linkedFields) {
    const table = tables.get(link.table);
    const field = table?.fields.find((item) => item.name === link.field.name);
    if (!field || field.type !== "multipleRecordLinks") {
      fail(`Verification failed: missing linked field '${link.table}.${link.field.name}'.`);
    }
  }
}

function cleanField(field) {
  return Object.fromEntries(
    Object.entries(field).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  );
}

async function api(endpoint, init = {}) {
  const response = await fetch(endpoint, {
    ...init,
    headers: {
      Authorization: `Bearer ${setupPat}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const text = await response.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }

  if (!response.ok) {
    const message = payload?.error?.message || payload?.error?.type || payload?.raw || response.statusText;
    fail(`Airtable API ${response.status}: ${message}`);
  }
  return payload;
}

function logPlan(message) {
  console.log(`${APPLY ? "Apply" : "Plan"}: ${message}`);
}

function fail(message) {
  console.error(`\nERROR: ${message}`);
  process.exit(1);
}

main().catch((error) => fail(error instanceof Error ? error.message : String(error)));

