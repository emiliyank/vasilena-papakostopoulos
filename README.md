# Vassilena Papakostopoulos Portfolio

Bilingual (EN/BG) Next.js portfolio migrating from the Wix site:

https://papakostopoulosvs.wixsite.com/portfolio

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS v4
- Content: mock data or Airtable (`CONTENT_SOURCE`)
- Resend for contact form email (planned)

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — `/` redirects to `/en`.

## Airtable

1. Create a base and tables using **`AIRTABLE-SCHEMA.md`** (exact field names matter).
2. Create a read-only [personal access token](https://airtable.com/create/tokens) with `data.records:read` and `schema.bases:read` for that base.
3. In `.env.local`:

```env
CONTENT_SOURCE=airtable
AIRTABLE_PAT=pat...
AIRTABLE_BASE_ID=app...
```

4. Keep `AIRTABLE_FALLBACK_TO_MOCK=true` while the base is still empty so the site can fall back to fixtures.
5. Restart `npm run dev` after changing env vars.

Only **Published** records (and the **Active** Site Settings row) are shown publicly. Credentials stay server-only — never use `NEXT_PUBLIC_*` for Airtable.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run test` | Unit tests |
| `npm run build` | Production build |

## Content

- Editorial UI strings: `src/lib/i18n/dictionaries.ts`
- Mock content: `src/data/mocks`
- Airtable adapter: `src/lib/airtable`
- Temporary Wix images: `CONTENT-MIGRATION.md`
- Product decisions: `DECISIONS.md`

## Environment

See `.env.example`. Keep Airtable and email secrets server-only (never `NEXT_PUBLIC_*`).
