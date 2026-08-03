# Vassilena Papakostopoulos Portfolio

Bilingual (EN/BG) Next.js portfolio migrating from the Wix site:

https://papakostopoulosvs.wixsite.com/portfolio

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS v4
- Mock content first; Airtable in a later phase
- Resend for contact form email (planned)

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — `/` redirects to `/en`.

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
- Temporary Wix images are tracked in `CONTENT-MIGRATION.md`
- Product decisions: `DECISIONS.md`

## Environment

See `.env.example`. Keep Airtable and email secrets server-only (never `NEXT_PUBLIC_*`).
