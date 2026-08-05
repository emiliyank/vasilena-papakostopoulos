# Agent notes — Vassilena Papakostopoulos portfolio

## Product

- Bilingual interior-design portfolio (`en`, `bg`). Default locale: `en`.
- Source migration reference: https://papakostopoulosvs.wixsite.com/portfolio
- Decisions live in `DECISIONS.md`. Content asset tracking lives in `CONTENT-MIGRATION.md`.

## Stack

- Next.js App Router, TypeScript (`strict`), Tailwind CSS v4, npm
- Content: mock data or Airtable (`CONTENT_SOURCE`); see `AIRTABLE-SCHEMA.md`
- Email: Resend → `e.kadiyski@gmail.com`
- Blog bodies: Airtable rich text (Markdown via API) → normalized block model
- Project galleries: alternating rows + accessible lightbox

## Architecture rules

- Keep Airtable response types inside `src/lib/airtable`. UI uses normalized models from `src/types`.
- Never put secrets in source or `NEXT_PUBLIC_*` variables.
- Prefer server components; client components only for interaction (menu, form, lightbox, language switcher, admin forms).
- Localized UI strings live in `src/lib/i18n` dictionaries; editorial copy comes from content models.
- Admin CMS lives at `/admin` (Auth.js Credentials); not linked from the public site. Writes go to Airtable; public reads stay Published-only.
- Finish coherent tasks with `npm run lint`, `npm run typecheck`, relevant tests, and `npm run build` when practical.

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run admin:hash-password
```

## Visual direction

- Minimalist, architectural, image-led. Restrained neutrals and generous whitespace.
- Fonts must support Bulgarian Cyrillic.
- No Wix chrome, login UI, or unrelated platform navigation.
