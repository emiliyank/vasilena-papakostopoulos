# Redirect inventory

Map valuable Wix URLs to the new localized destinations. Prefer direct redirects (no chains). Default locale for unmarked links: `en`.

| Old Wix URL | New URL |
| --- | --- |
| `https://papakostopoulosvs.wixsite.com/portfolio` | `/en` |
| `https://papakostopoulosvs.wixsite.com/portfolio#about` | `/en#about` |
| `https://papakostopoulosvs.wixsite.com/portfolio#services` | `/en#services` |
| `https://papakostopoulosvs.wixsite.com/portfolio#portfolio` / portfolio section | `/en#portfolio` |
| `https://papakostopoulosvs.wixsite.com/portfolio#contact` / get in touch | `/en#contact` |
| `/portfolio/portfolio-collections/portfolio/form` | `/en/projects/form` |
| `/portfolio/portfolio-collections/portfolio/balance` | `/en/projects/balance` |
| `/portfolio/portfolio-collections/portfolio/rhythm` | `/en/projects/rhythm` |
| `/portfolio/portfolio-collections/portfolio/variations` | `/en/projects/variations` |
| `/portfolio/portfolio-collections/portfolio/scale` | `/en/projects/scale` |
| `/portfolio/portfolio-collections/portfolio/heritage` | `/en/projects/heritage` |
| `/portfolio/portfolio-collections/portfolio/unity` | `/en/projects/unity` |
| `/portfolio/portfolio-collections/portfolio/potential` | `/en/projects/potential` |
| Blog listing (Wix blog) | `/en/blog` |
| Blog: consultation survey article (if present) | `/en/blog/consultation-survey` |
| `https://papakostopoulosvs.wixsite.com/vassilena-papakost-1/services-4` (Prices) | `/en/prices` |
| Consultation survey (Google Form) | keep external — do not redirect |

## Implementation notes

- Domain-level redirects will be configured when the custom domain is connected (Vercel redirects and/or Wix outbound redirects).
- Bulgarian equivalents use `/bg/...` for the same paths.
- Unpublished drafts must not be redirected into the public site.
