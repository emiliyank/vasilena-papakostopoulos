# Airtable Schema Import Runbook

This runbook creates the six-table schema defined in `AIRTABLE-SCHEMA.md` by running `setup-airtable-schema.mjs` against your existing Airtable base.

## What the script does

- Creates `Projects`, `Project Images`, `Services`, `Blog Posts`, `Prices`, and `Site Settings`.
- Creates the exact fields, types, select choices, and descriptions from the schema.
- Creates the linked-record relationship from `Project Images.Project` to `Projects`.
- Lets Airtable create the reciprocal `Projects.Project Images` field.
- Uses a dry run unless you explicitly pass `--apply`.
- Reuses compatible exact-name tables and fields.
- Stops when an existing exact-name field has an incompatible type.
- Does not create content records.
- Does not delete, overwrite, or rename existing tables, fields, or records.

## Prerequisites

- [ ] Node.js 18 or newer is installed.
- [ ] `AIRTABLE_BASE_ID` is already in `.env.local` and begins with `app`.
- [ ] You have a temporary setup PAT with `schema.bases:read` and `schema.bases:write`.
- [ ] The setup PAT has access to only the intended portfolio base.
- [ ] Your Airtable user has Creator access to that base.
- [ ] Your permanent website PAT remains separate and read-only.

## Step 1 — Put the script in the project

1. Create a `scripts` folder in the root of the Next.js repository if it does not exist.
2. Save `setup-airtable-schema.mjs` as:

   ```text
   scripts/setup-airtable-schema.mjs
   ```

3. Do not put either token inside the script.

Your project should resemble:

```text
your-project/
  scripts/
    setup-airtable-schema.mjs
  AIRTABLE-SCHEMA.md
  .env.local
  package.json
```

## Step 2 — Make `.env.local` safe

Keep the normal application configuration in `.env.local`:

```dotenv
CONTENT_SOURCE=airtable
AIRTABLE_PAT=pat_your_read_only_website_token
AIRTABLE_BASE_ID=app_your_base_id
AIRTABLE_FALLBACK_TO_MOCK=true
```

Do not replace `AIRTABLE_PAT` with the write-enabled setup token.

Confirm `.gitignore` includes:

```gitignore
.env.local
.env*.local
```

## Step 3 — Load the Base ID without printing secrets

Open a terminal in the repository and run:

```bash
set -a
source .env.local
set +a
```

This loads `AIRTABLE_BASE_ID` into the terminal session.

Do not run `env`, `printenv`, `echo $AIRTABLE_PAT`, or commands that would print tokens into terminal logs.

## Step 4 — Provide the temporary setup token

For the current terminal session only, run:

```bash
read -s -p "Temporary Airtable setup PAT: " AIRTABLE_SETUP_PAT
export AIRTABLE_SETUP_PAT
printf '\n'
```

Paste the temporary token when prompted and press Enter. The `-s` option prevents it from being displayed.

Do not add `AIRTABLE_SETUP_PAT` to `.env.local`, because the website does not need schema-write access.

## Step 5 — Run the dry run

Run:

```bash
node scripts/setup-airtable-schema.mjs
```

Expected beginning:

```text
Airtable base: app...
Mode: DRY RUN (no changes will be made)
```

The script will retrieve the existing schema and list the changes it plans to make. It will not change Airtable without `--apply`.

Stop and investigate if:

- The displayed Base ID is not the intended portfolio base.
- The API reports missing scopes or access.
- It reports an incompatible existing table or field.
- You recognize an existing table containing content that should not be changed.

## Step 6 — Apply the schema

After reviewing the dry run, run:

```bash
node scripts/setup-airtable-schema.mjs --apply
```

The script should finish with:

```text
Schema installation complete and verified.
```

If it stops partway through, do not delete the newly created tables. Fix the reported issue and run the same command again. The script is designed to reuse compatible tables and fields.

## Step 7 — Check Airtable manually

Open the base and confirm these tables exist:

- [ ] `Projects`
- [ ] `Project Images`
- [ ] `Services`
- [ ] `Blog Posts`
- [ ] `Prices`
- [ ] `Site Settings`

Then check:

- [ ] `Projects.Status` has `Draft`, `Published`, and `Archived`.
- [ ] `Project Images.Layout Span` has `full` and `half`.
- [ ] `Project Images.Project` links to `Projects`.
- [ ] `Projects.Project Images` exists as the reciprocal link and allows multiple linked images.
- [ ] `Blog Posts.Body EN` and `Body BG` have rich text enabled.
- [ ] `Site Settings.Active` is a checkbox.
- [ ] No table or field name was translated or automatically renamed.

### Default `Table 1`

A blank Airtable base commonly starts with an extra default table such as `Table 1`. The script intentionally does not delete it.

Only after confirming it contains no needed data:

1. Open the default table.
2. Check that it is empty and is not one of the six required tables.
3. Open its table menu.
4. Choose **Delete table**.
5. Confirm deletion.

After this cleanup, the base should contain exactly the six required tables.

## Step 8 — Remove the setup credential

Remove the temporary token from the terminal session:

```bash
unset AIRTABLE_SETUP_PAT
```

Then delete or revoke the temporary setup PAT in Airtable's Developer Hub. The website should keep using the separate read-only PAT with:

```text
data.records:read
schema.bases:read
```

## Step 9 — Add initial content

The script creates structure only. Next:

1. Create one active `Site Settings` record.
2. Add five Published Services.
3. Add Home, Basic, Standard, and Premium Prices records.
4. Add the eight Projects.
5. Add linked and ordered Project Images.
6. Add at least one Blog Post.

Keep `AIRTABLE_FALLBACK_TO_MOCK=true` until the required initial records exist.

## Troubleshooting

### `401 AUTHENTICATION_REQUIRED`

- The setup PAT was copied incorrectly or revoked.
- Repeat Step 4 with the temporary schema-write PAT.

### `403 INVALID_PERMISSIONS_OR_MODEL_NOT_FOUND`

- Confirm the setup PAT has `schema.bases:read` and `schema.bases:write`.
- Confirm the base is included in the PAT's resource access.
- Confirm your Airtable user has Creator access to the base.

### Primary field conflict

The script found an existing table with a matching required name but its primary field is not the expected field.

For a genuinely blank table, rename the primary field manually:

- `Projects`, `Project Images`, `Services`, `Prices`, `Site Settings`: `Internal Name`
- `Blog Posts`: `Internal Title`

Then rerun the script.

### Existing field has the wrong type

The script will not convert or delete it. If the field is empty and was created by mistake, correct or remove it manually in Airtable, then rerun. If it contains data, back it up and decide how to migrate it before changing the type.

### Rich text option is not enabled

Open `Blog Posts`, edit `Body EN` and `Body BG`, choose **Long text**, and enable rich-text formatting. Then keep the field names unchanged.

## Security checklist

- [ ] Setup PAT was never committed or placed in `.env.local`.
- [ ] Setup PAT was unset from the terminal.
- [ ] Setup PAT was revoked after schema creation.
- [ ] Website `AIRTABLE_PAT` remains read-only.
- [ ] `.env.local` is ignored by Git.
- [ ] No token was pasted into screenshots, chat, logs, or documentation.

