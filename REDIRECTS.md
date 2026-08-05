# Redirect inventory

Map valuable Wix URLs to the new localized destinations. Prefer direct redirects (no chains). Default locale for unmarked links: `en`.

Implemented in [next.config.ts](next.config.ts) as permanent redirects (except hash-only anchors, which cannot be server-redirected).

| Old Wix URL | New URL |
| --- | --- |
| `https://papakostopoulosvs.wixsite.com/portfolio` | `/en` |
| `https://papakostopoulosvs.wixsite.com/portfolio#about` | `/en#about` (anchor only — document for editors) |
| `https://papakostopoulosvs.wixsite.com/portfolio#services` | `/en#services` (anchor only) |
| `https://papakostopoulosvs.wixsite.com/portfolio#portfolio` | `/en#portfolio` (anchor only) |
| `https://papakostopoulosvs.wixsite.com/portfolio#contact` | `/en#contact` (anchor only) |
| `/portfolio/portfolio-collections/portfolio/form` | `/en/projects/form` |
| `/portfolio/portfolio-collections/portfolio/balance` | `/en/projects/balance` |
| `/portfolio/portfolio-collections/portfolio/rhythm` | `/en/projects/rhythm` |
| `/portfolio/portfolio-collections/portfolio/variations` | `/en/projects/variations` |
| `/portfolio/portfolio-collections/portfolio/scale` | `/en/projects/scale` |
| `/portfolio/portfolio-collections/portfolio/heritage` | `/en/projects/heritage` |
| `/portfolio/portfolio-collections/portfolio/unity` | `/en/projects/unity` |
| `/portfolio/portfolio-collections/portfolio/potential` | `/en/projects/potential` |
| `/portfolio/blog` | `/en/blog` |
| `/portfolio/post/where-do-we-start` | `/en/blog/where-do-we-start` |
| `/portfolio/post/interior-design-and-3d-visualisation-what-is-the-diference` | `/en/blog/interior-design-and-3d-visualisation-what-is-the-diference` |
| `/portfolio/post/interior-styling-why-the-smallest-details-turn-a-space-into-a-true-home` | `/en/blog/interior-styling-why-the-smallest-details-turn-a-space-into-a-true-home` |
| `/portfolio/post/how-the-process-of-creating-an-interior-design-works` | `/en/blog/how-the-process-of-creating-an-interior-design-works` |
| `https://papakostopoulosvs.wixsite.com/vassilena-papakost-1/services-4` (Prices) | `/en/prices` |
| Consultation survey (Google Form) | keep external — do not redirect |

## Implementation notes

- Server redirects land on **English** (`/en/...`) by default.
- Bulgarian equivalents use `/bg/...` for the same paths when linked from the language switcher.
- Hash-only section links cannot be implemented as HTTP redirects; keep them as editorial documentation.
- Domain-level redirects will also be configured when the custom domain is connected (Vercel and/or Wix outbound).
- Unpublished drafts must not be redirected into the public site.
