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

For the admin dashboard, the PAT must also include `data.records:write` so content can be created, updated, and deleted from `/admin`.

## Admin dashboard

Private content CMS at `/admin` (not linked from the public site). Uses Auth.js Credentials with HTTP-only session cookies.

1. Generate a secret: `openssl rand -base64 32`
2. Hash a password: `npm run admin:hash-password`
3. In `.env.local`:

```env
AUTH_SECRET=...
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD_HASH=bcrypt64:...
CONTENT_SOURCE=airtable
AIRTABLE_PAT=pat...   # needs data.records:read + data.records:write
AIRTABLE_BASE_ID=app...
```

Run `npm run admin:hash-password` and paste the printed `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` lines into `.env.local`. The `bcrypt64:` form avoids dotenv corrupting `$` characters inside raw bcrypt hashes (which causes “Invalid email or password”).4. Open `/admin/login`, sign in, and manage Site Settings, Services, Projects (with gallery images), Prices, and Blog posts.
5. Public pages continue to show **Published** records only; Draft/Archived stay admin-only.

Password reset is manual: generate a new hash and update `ADMIN_USERS`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run test` | Unit tests |
| `npm run build` | Production build |
| `npm run admin:hash-password` | Generate bcrypt hash for ADMIN_USERS |

## Content

- Editorial UI strings: `src/lib/i18n/dictionaries.ts`
- Mock content: `src/data/mocks`
- Airtable adapter: `src/lib/airtable`
- Temporary Wix images: `CONTENT-MIGRATION.md`
- Product decisions: `DECISIONS.md`

## Environment

See `.env.example`. Keep Airtable and email secrets server-only (never `NEXT_PUBLIC_*`).
