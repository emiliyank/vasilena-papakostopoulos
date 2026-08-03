# Agent notes — Vassilena Papakostopoulos portfolio

## Product

- Bilingual interior-design portfolio (`en`, `bg`). Default locale: `en`.
- Source migration reference: https://papakostopoulosvs.wixsite.com/portfolio
- Decisions live in `DECISIONS.md`. Content asset tracking lives in `CONTENT-MIGRATION.md`.

## Stack

- Next.js App Router, TypeScript (`strict`), Tailwind CSS v4, npm
- Content: mock data first; Airtable in Phase B (server-only credentials)
- Email: Resend → `e.kadiyski@gmail.com`
- Blog bodies: Airtable rich text → normalized block model
- Project galleries: alternating rows + accessible lightbox

## Architecture rules

- Keep Airtable response types inside `src/lib/airtable`. UI uses normalized models from `src/types`.
- Never put secrets in source or `NEXT_PUBLIC_*` variables.
- Prefer server components; client components only for interaction (menu, form, lightbox, language switcher).
- Localized UI strings live in `src/lib/i18n` dictionaries; editorial copy comes from content models.
- Finish coherent tasks with `npm run lint`, `npm run typecheck`, relevant tests, and `npm run build` when practical.

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

## Visual direction

- Minimalist, architectural, image-led. Restrained neutrals and generous whitespace.
- Fonts must support Bulgarian Cyrillic.
- No Wix chrome, login UI, or unrelated platform navigation.
