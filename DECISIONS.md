# Decisions

Resolved product and technical choices for the Vassilena Papakostopoulos portfolio.

| Decision | Choice | Notes |
| --- | --- | --- |
| Default locale | `/en` | `/` redirects to `/en` |
| Email provider | Resend | Brevo documented as alternative only |
| Blog body format | Airtable rich text / structured blocks | Normalize to typed `RichTextDocument` blocks; sanitize before render |
| Project gallery | Alternating rows | Full-width and paired half-width rows via `layoutSpan`; lightbox deferred to Phase C polish |
| Project lightbox | Yes | Accessible overlay with prev/next and Escape |
| Package manager | npm | Commit `package-lock.json` |
| Content source (dev) | Airtable when configured | `CONTENT_SOURCE=airtable`; mocks remain as fallback |
| Cookie consent | Deferred | Add before analytics go live in production markets |
| Temporary images | Wix-hosted assets | Track replacements in `CONTENT-MIGRATION.md` |
| Prices IA | Pending | Dedicated pages vs homepage section — decide later |
| Custom domain / sender | Pending | Needed before production email |
| Airtable as long-term media store | Pending | Attachments OK for migration; revisit durability |
| Bulgarian copy approval | Pending | Confirm stakeholder before launch |
| Admin dashboard | Auth.js Credentials + Airtable CRUD | `/admin` manages content; public site stays Published-only |
| Admin auth provider | Auth.js (Credentials) | JWT sessions, HTTP-only cookies; admins in `ADMIN_USERS` env (bcrypt hashes) |
| Admin content writes | Airtable API | Dashboard writes through Airtable; public site still reads Published-only |

## Source website

Primary migration reference: https://papakostopoulosvs.wixsite.com/portfolio
