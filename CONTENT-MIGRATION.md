# Content migration checklist

Temporary Wix-hosted assets are used for early visuals. Replace with original files before launch.

## Temporary image sources

Base CDN: `https://static.wixstatic.com/media/`

| Asset role | Temporary media id | Replacement status |
| --- | --- | --- |
| Site logo / favicon | `8a77d8_e1ca566d2cb94082bf74c562009b37a3~mv2.png` → copied to `public/brand/logo.png` | pending original |
| About portrait | `8a77d8_74b19c928d384f098a3ccd76864aa169~mv2.png` | pending |
| Hero / portfolio cover set | `8a77d8_8e03881a880541beaaf621b2654edf31~mv2.png` | pending |
| Portfolio cover | `8a77d8_1962249a003c483d88ecd88f30677bf3~mv2.png` | pending |
| Portfolio cover | `8a77d8_01657f5e88f74fddaa71b2e0bad02633~mv2.png` | pending |
| Portfolio cover | `8a77d8_f429eac970024fbcbfc6d8b945bdd96b~mv2.png` | pending |
| Portfolio cover | `8a77d8_a3b682e098754633a755c1266b80d583~mv2.png` | pending |
| Portfolio cover | `8a77d8_d698b76ef779423492a3d4739cefceb7~mv2.png` | pending |
| Portfolio cover | `8a77d8_c8734f6fbd184432bd2221d37a18aae1~mv2.jpg` | pending |
| Portfolio cover | `8a77d8_2f2a39c934264d229e39ec9a6ec6d970~mv2.png` | pending |
| Extra media | `8a77d8_1f768377219048708e0f0aa91a9f491c~mv2.png` | pending |
| Extra media | `8a77d8_b315c66d6bd94ce78f53b2158aef8b16~mv2.png` | pending |

## Editorial

| Item | EN | BG | Notes |
| --- | --- | --- | --- |
| Site settings / About | migrated draft | provisional | needs stakeholder approval |
| Services (5) | migrated draft | provisional | |
| Projects (8) | migrated draft | provisional | Form, Balance, Rhythm, Variations, Scale, Heritage, Unity, Potential |
| Blog posts | pending crawl | pending | |
| Prices | migrated to Airtable from Wix/mocks | provisional EN | Source: https://papakostopoulosvs.wixsite.com/vassilena-papakost-1/services-4 |
| Consultation survey URL | confirmed | — | https://docs.google.com/forms/d/10-k1YJ33jze-Rqq_tgzdT4KgvFDKSjsr1NXKvU7BsLo/viewform |
| Initial Airtable records | seeded from mocks | provisional | Via `scripts/seed-airtable-from-mocks.mjs` |

## Redirect inventory

Document every valuable Wix URL → new localized route before launch. Known project pattern:

`/portfolio/portfolio-collections/portfolio/[slug]` → `/en/projects/[slug]` (and BG equivalent).
