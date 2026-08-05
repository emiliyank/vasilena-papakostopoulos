# Airtable schema setup

Create a new base (suggested name: **Vassilena Portfolio**). Use the exact field names below so the app can map records without extra configuration.

Create a [personal access token](https://airtable.com/create/tokens) with:

- Scopes: `data.records:read`, `data.records:write`, `schema.bases:read`
- Access: only this base

Public pages only need read access. The `/admin` dashboard needs **write** (and attachment upload) so editors can create/update/delete records and replace images. Keep the token server-only — never put it in `NEXT_PUBLIC_*` variables.

Then copy into `.env.local`:

```env
CONTENT_SOURCE=airtable
AIRTABLE_PAT=pat...
AIRTABLE_BASE_ID=app...
```

Table names (defaults in `.env.example`):

| Env var | Default table name |
| --- | --- |
| `AIRTABLE_TABLE_PROJECTS` | Projects |
| `AIRTABLE_TABLE_PROJECT_IMAGES` | Project Images |
| `AIRTABLE_TABLE_SERVICES` | Services |
| `AIRTABLE_TABLE_BLOG_POSTS` | Blog Posts |
| `AIRTABLE_TABLE_PRICES` | Prices |
| `AIRTABLE_TABLE_SITE_SETTINGS` | Site Settings |

Revalidation interval: **10 minutes** (`AIRTABLE_REVALIDATE_SECONDS`, default `600`).

---

## 1. Projects

| Field | Type | Notes |
| --- | --- | --- |
| Internal Name | Single line text (primary) | Editor-facing label |
| Slug | Single line text | Unique, URL slug |
| Status | Single select | `Draft`, `Published`, `Archived` |
| Order | Number | Portfolio + prev/next order |
| Title EN / Title BG | Single line text | |
| Summary EN / Summary BG | Long text | |
| Description EN / Description BG | Long text | |
| Project Type EN / Project Type BG | Single line text | |
| Location EN / Location BG | Single line text | |
| Project Date | Date | |
| Cover Image | Attachment | Single preferred |
| Project Images | Link to Project Images | Allow multiple |
| Featured | Checkbox | Optional |
| Featured Order | Number | Optional |
| SEO Title EN / SEO Title BG | Single line text | Optional |
| SEO Description EN / SEO Description BG | Long text | Optional |

## 2. Project Images

| Field | Type | Notes |
| --- | --- | --- |
| Internal Name | Single line text (primary) | |
| Project | Link to Projects | Single |
| Image | Attachment | |
| Order | Number | |
| Alt Text EN / Alt Text BG | Single line text | |
| Caption EN / Caption BG | Single line text | Optional |
| Layout Span | Single select | `full`, `half` |

## 3. Services

| Field | Type | Notes |
| --- | --- | --- |
| Internal Name | Single line text (primary) | |
| Slug | Single line text | |
| Status | Single select | `Draft`, `Published`, `Archived` |
| Order | Number | |
| Title EN / Title BG | Single line text | |
| Short Description EN / Short Description BG | Long text | |
| Full Description EN / Full Description BG | Long text | |

## 4. Blog Posts

| Field | Type | Notes |
| --- | --- | --- |
| Internal Title | Single line text (primary) | |
| Slug | Single line text | |
| Status | Single select | `Draft`, `Published`, `Archived` |
| Published At | Date | Include time optional |
| Title EN / Title BG | Single line text | |
| Excerpt EN / Excerpt BG | Long text | |
| Body EN / Body BG | Long text **with rich text enabled** | API returns Markdown → normalized blocks |
| Cover Image | Attachment | Optional |
| Cover Alt EN / Cover Alt BG | Single line text | Optional |
| SEO Title EN / SEO Title BG | Single line text | Optional |
| SEO Description EN / SEO Description BG | Long text | Optional |

## 5. Prices

| Field | Type | Notes |
| --- | --- | --- |
| Internal Name | Single line text (primary) | |
| Status | Single select | `Draft`, `Published`, `Archived` |
| Order | Number | |
| Name EN / Name BG | Single line text | |
| Description EN / Description BG | Long text | |
| Price Display EN / Price Display BG | Single line text | e.g. `7 Евро/м2` |
| Features EN / Features BG | Long text | One feature per line |
| Notes EN / Notes BG | Long text | Optional |

## 6. Site Settings

Create **one** active row.

| Field | Type | Notes |
| --- | --- | --- |
| Internal Name | Single line text (primary) | e.g. `Production` |
| Active | Checkbox | Exactly one checked |
| Brand Name | Single line text | |
| Hero Heading EN / BG | Single line text | |
| Hero Subheading EN / BG | Long text | |
| About Heading EN / BG | Single line text | |
| About Summary EN / BG | Long text | |
| About Body EN / BG | Long text | |
| Contact Heading EN / BG | Single line text | |
| Contact Intro EN / BG | Long text | |
| Phone | Phone / single line | |
| Email | Email / single line | |
| Location EN / Location BG | Single line text | |
| Instagram URL | URL | |
| Facebook URL | URL | |
| Survey URL | URL | Google Form viewform link |
| Logo | Attachment | |
| Hero Image | Attachment | |
| About Image | Attachment | |
| Prices Heading EN / BG | Single line text | |
| Prices Intro EN / BG | Long text | |
| Payment Heading EN / BG | Single line text | |
| Payment Terms EN / BG | Long text | One term per line |

---

## Suggested first content

1. Mark one **Site Settings** row `Active` and paste current mock copy from the site.
2. Add the five **Services** as `Published`.
3. Add the four **Prices** packages (Home, Basic, Standard, Premium).
4. Add eight **Projects** with cover images; add **Project Images** linked and ordered.
5. Add at least one **Blog Post**.

Until Airtable is filled, keep `CONTENT_SOURCE=mock` so local development stays offline-friendly.

## Security

- Never put `AIRTABLE_PAT` in `NEXT_PUBLIC_*` variables.
- Token stays server-only (Server Components / route handlers).
- Public queries only expose records with `Status = Published` (and Active settings).
