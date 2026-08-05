# QA checklist — Phase E

Use before stakeholder review and release candidates. Analytics/consent remain deferred.

## Bilingual smoke

- [ ] `/en` and `/bg` load with correct `lang` and language switcher preserving route
- [ ] Homepage sections: About, Services, Portfolio, Contact
- [ ] All eight projects open in both locales with galleries and prev/next
- [ ] Blog index lists four migrated posts; each article body renders
- [ ] Prices page shows packages and payment terms
- [ ] Localized 404 for unknown project/blog slugs

## Contact and integrations

- [ ] Contact form success delivers mail to `e.kadiyski@gmail.com` (Resend)
- [ ] Invalid input shows validation; honeypot/rate limit behave as expected
- [ ] Survey, Instagram, Facebook, phone, and email links work

## Admin (Published-only public)

- [ ] Sign in at `/admin/login` with `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH`
- [ ] Draft record is not visible on public routes
- [ ] Publish via admin appears after revalidation
- [ ] Gallery image create/edit/delete works

## Redirects

- [ ] Run `npm run audit:redirects` and spot-check a few paths locally
- [ ] `/portfolio/portfolio-collections/portfolio/balance` → `/en/projects/balance`
- [ ] `/portfolio/post/where-do-we-start` → `/en/blog/where-do-we-start`
- [ ] `/portfolio/blog` → `/en/blog`

## Accessibility and responsive (manual)

- [ ] Keyboard: skip link, menu, language switcher, lightbox, contact form
- [ ] Mobile / tablet / desktop layout on homepage and a project page
- [ ] Focus states visible; reduced-motion respected

## Performance spot check

- [ ] Image-heavy project page loads without layout shift
- [ ] Below-the-fold gallery images do not block LCP unreasonably

## Content migration still pending stakeholder

- [ ] Approved Bulgarian copy
- [ ] Replace temporary Wix CDN images with originals ([CONTENT-MIGRATION.md](../CONTENT-MIGRATION.md))
- [ ] Archive leftover Airtable `consultation-survey` placeholder if present
