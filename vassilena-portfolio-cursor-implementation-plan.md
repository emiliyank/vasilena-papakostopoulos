# Vassilena Papakostopoulos Portfolio

## Cursor Implementation Plan

**Progress note (2026-08-05):** Phase A–B complete (including Airtable schema + seeded mocks). Phase C lightbox/gallery polish and Phase D contact + SEO foundations are in progress / landed. Analytics/consent remain deferred.

## Source website and migration reference

The existing website that this project will reproduce, modernize, and migrate is:

**https://papakostopoulosvs.wixsite.com/portfolio**

This Wix website is the primary reference for the initial content inventory, page structure, visual direction, services, portfolio projects, blog posts, pricing information, contact details, social links, and consultation-survey link. The new Next.js website should preserve the recognizable minimalist character and all agreed functionality while improving performance, accessibility, bilingual navigation, content consistency, SEO, and maintainability.

Important clarification: `https://papakostopoulosvs.wixsite.com/` currently returns a Wix 404. All migration and comparison work must therefore use the complete `/portfolio` URL above and its inner pages, including project routes such as `https://papakostopoulosvs.wixsite.com/portfolio/portfolio-collections/portfolio/balance`.

- [x] Add the complete source URL to the project README and Cursor project context.
- [x] Use the complete `/portfolio` URL for all visual comparisons and content audits.
- [x] Treat the Wix site as a migration reference, not as an API or runtime dependency of the new website.
- [x] Record every migrated Wix page and its corresponding new URL in the redirect inventory.

### 1. Confirmed product scope

- [x] Use **Vassilena Papakostopoulos** as the definitive public name.
- [x] Preserve and refine the current minimalist, architectural visual direction.
- [ ] Launch with complete **English and Bulgarian** localization.
- [x] Keep the primary website as a **single-page homepage**.
- [x] Retain project detail pages as separate routes.
- [x] Include the current Blog, Prices, consultation survey, contact form, and service content.
- [x] Use **Airtable** as the initial external content source.
- [x] Use **Next.js App Router**, TypeScript, and Vercel-compatible server functionality.
- [x] Send contact-form messages to `e.kadiyski@gmail.com` using Resend by default, with Brevo documented as the alternative.
- [ ] Include Google Analytics, Microsoft Clarity, SEO metadata, sitemap generation, and redirect planning.
- [x] Exclude Vercel account and deployment setup from the implementation scope.

### 2. Route and information architecture

- [x] Implement `/en` as the English homepage.
- [x] Implement `/bg` as the Bulgarian homepage.
- [x] Redirect `/` to the agreed default locale, provisionally `/en`.
- [x] Implement `/en/projects/[slug]` and `/bg/projects/[slug]`.
- [x] Implement `/en/blog` and `/bg/blog`.
- [x] Implement `/en/blog/[slug]` and `/bg/blog/[slug]`.
- [x] Implement localized Prices pages or sections based on the final content review.
- [x] Keep the consultation survey as a clearly labeled external link unless it is intentionally rebuilt later.
- [x] Add language switching that preserves the equivalent route and content item where possible.
- [x] Return a localized 404 page when a project or article is unavailable.
- [x] Add previous/next project navigation derived from an explicit Airtable sort order.

### 3. Repository initialization

- [x] Create a new Next.js project with App Router, TypeScript, ESLint, and the `src` directory convention.
- [x] Select one package manager and commit its lockfile.
- [x] Enable strict TypeScript settings.
- [x] Configure absolute imports such as `@/components`, `@/lib`, and `@/types`.
- [x] Create `.env.example` containing names only, never real secrets.
- [x] Add environment validation for Airtable, email, analytics, and site URL values.
- [x] Add formatting and lint scripts.
- [x] Add `typecheck`, `test`, and production `build` scripts.
- [x] Add a concise README covering local setup, Airtable configuration, content editing, image workflow, and required environment variables.

### 4. Suggested source structure

- [x] Create `src/app/[locale]/page.tsx` for the single-page homepage.
- [x] Create localized project and blog route folders under `src/app/[locale]`.
- [x] Create `src/components/layout` for header, menu, language switcher, and footer.
- [x] Create `src/components/sections` for Hero, About, Services, Portfolio, Contact, and other homepage sections.
- [x] Create `src/components/projects` for cards, metadata, gallery, and project navigation.
- [ ] Create `src/components/blog` for article cards and article rendering.
- [x] Create `src/components/ui` for reusable buttons, headings, form controls, modal/lightbox, and loading states.
- [x] Create `src/lib/airtable` for the Airtable client, queries, normalization, caching, and error handling.
- [x] Create `src/lib/i18n` for locale configuration, helpers, and localized URL generation.
- [x] Create `src/lib/email` for the email provider abstraction and templates.
- [x] Create `src/lib/seo` for metadata, canonical URLs, structured data, sitemap helpers, and redirects.
- [x] Create `src/types` for normalized content models independent of Airtable's response format.

### 5. Airtable base design

#### 5.1 `Projects` table

- [ ] Add `Internal Name` as the primary field.
- [ ] Add unique `Slug`.
- [ ] Add `Status`: Draft, Published, or Archived.
- [ ] Add `Order` as a number controlling portfolio and previous/next order.
- [ ] Add `Title EN` and `Title BG`.
- [ ] Add `Summary EN` and `Summary BG`.
- [ ] Add `Description EN` and `Description BG` as long-text fields.
- [ ] Add `Project Type EN` and `Project Type BG`.
- [ ] Add `Location EN` and `Location BG`.
- [ ] Add a real `Project Date` field and optional display overrides when exact formatting differs by language.
- [ ] Add `Cover Image` as a single attachment.
- [ ] Link each project to ordered `Project Images` records rather than relying on attachment order.
- [ ] Add optional `SEO Title EN/BG` and `SEO Description EN/BG`.
- [ ] Add optional `Featured` and `Featured Order` fields.
- [ ] Add `Updated At` using Airtable's last-modified field.

#### 5.2 `Project Images` table

- [ ] Add an internal image name.
- [ ] Link each image to one `Project`.
- [ ] Add `Image` as an attachment field.
- [ ] Add numeric `Order`.
- [ ] Add `Alt Text EN` and `Alt Text BG`.
- [ ] Add optional `Caption EN` and `Caption BG`.
- [ ] Add `Orientation` or `Layout Span` only if the final gallery design needs editorial control.
- [ ] Document that new images must be uploaded at suitable quality and must not be reordered only by filename.

#### 5.3 `Services` table

- [ ] Add `Internal Name`, `Slug`, `Status`, and `Order`.
- [ ] Add localized title, short description, and full description fields.
- [ ] Add optional icon or supporting image.
- [ ] Add optional link type: section, article, external URL, or none.
- [ ] Migrate Interior Design, Consultation, 3D Visualization, Furniture Design, and Interior Styling/Home Staging.

#### 5.4 `Blog Posts` table

- [ ] Add `Internal Title`, unique `Slug`, `Status`, and `Published At`.
- [ ] Add `Title EN/BG`, `Excerpt EN/BG`, and `Body EN/BG`.
- [x] Decide whether blog body content uses Markdown stored in long-text fields.
- [ ] Add `Cover Image` and localized alt text.
- [ ] Add optional categories or tags only if the existing content needs them.
- [ ] Add localized SEO title and description fields.

#### 5.5 `Prices` table

- [ ] Add `Internal Name`, `Status`, and `Order`.
- [ ] Add localized service/package name and description.
- [ ] Add price display fields rather than assuming all prices are numeric.
- [ ] Add optional unit, notes, call-to-action label, and call-to-action URL.
- [ ] Confirm whether prices should be indexed by search engines.

#### 5.6 `Site Settings` table

- [ ] Create a single active settings record.
- [ ] Add localized hero heading, subheading, About copy, and contact text.
- [ ] Add phone, public email, location, Instagram, Facebook, and survey URL.
- [ ] Add logo and optional hero media.
- [ ] Add localized navigation labels and footer labels only where code dictionaries are insufficient.
- [ ] Store no secrets or private API keys in Airtable records.

### 6. Airtable integration layer

- [ ] Create a read-only Airtable personal access token with the minimum required base permissions.
- [x] Store the token, base ID, and table identifiers as server-only environment variables.
- [x] Never expose Airtable credentials through `NEXT_PUBLIC_*` variables.
- [x] Fetch Airtable only from server components, server utilities, route handlers, or build-time processes.
- [x] Create normalized TypeScript models for Project, ProjectImage, Service, BlogPost, PriceItem, and SiteSettings.
- [x] Convert Airtable records into normalized models in one adapter layer.
- [x] Validate all normalized data with Zod or an equivalent runtime schema.
- [x] Filter public queries to Published records only.
- [x] Sort projects, images, services, and prices using explicit numeric fields.
- [x] Add clear handling for missing Bulgarian or English translations.
- [x] Add request caching/revalidation so normal page views do not query Airtable unnecessarily.
- [x] Choose an initial revalidation interval, provisionally 5–15 minutes.
- [ ] Add an optional protected revalidation webhook as a later enhancement.
- [x] Handle Airtable errors with cached or graceful UI states rather than leaking raw provider errors.
- [x] Add fixtures or mock data so development and automated tests do not require live Airtable access.

### 7. Initial content migration

- [ ] Create all Airtable tables and fields before importing content.
- [x] Enter the eight crawled projects: Form, Balance, Rhythm, Variations, Scale, Heritage, Unity, and Potential.
- [ ] Standardize project dates into valid date values while preserving intended display text.
- [ ] Standardize project types, location names, capitalization, and punctuation.
- [ ] Rewrite or polish English text with approval before publication.
- [ ] Prepare professional Bulgarian translations rather than machine-only placeholders.
- [x] Add useful bilingual alt text for every retained image.
- [x] Migrate the five service areas and their descriptions.
- [ ] Migrate existing blog posts, prices, footer data, and external survey link.
- [x] Use currently available Wix-hosted assets only as temporary migration sources where original files are not yet available.
- [x] Track every temporary Wix asset in a replacement checklist.
- [ ] Replace temporary assets incrementally when full-resolution originals become available.
- [ ] Confirm ownership and publication permission for all migrated images and copy.

### 8. Visual system and layout

- [x] Extract a small design-token system from the current aesthetic: colors, typography, spacing, radii, borders, and motion.
- [x] Use a restrained neutral palette and generous whitespace.
- [x] Select fonts with full Bulgarian Cyrillic support.
- [x] Design a responsive header with name/logo, language switcher, and compact menu.
- [x] Preserve the image-led, editorial character of the current portfolio.
- [x] Improve hierarchy and legibility without introducing a visually unrelated style.
- [x] Implement smooth anchor navigation with visible focus behavior.
- [x] Add subtle motion that respects `prefers-reduced-motion`.
- [x] Avoid layout shifts by reserving media aspect ratios.
- [ ] Design explicit empty, loading, error, and unavailable-content states.
- [ ] Validate layouts at mobile, tablet, laptop, and wide desktop sizes.

### 9. Homepage implementation

- [x] Build the localized hero section with a strong portfolio image or media treatment.
- [x] Build the About section using editable Airtable settings content.
- [x] Build the Services section from published Airtable service records.
- [x] Build the Portfolio grid from published Airtable project records.
- [x] Build a clear contact section and inquiry form.
- [x] Add Blog, Prices, and survey entry points consistent with the existing site.
- [x] Build a footer with phone, email, location, social links, and localized navigation.
- [x] Remove Wix advertising, login controls, and unrelated platform UI.
- [x] Ensure every homepage section has a stable localized anchor ID.

### 10. Project detail pages

- [x] Generate project pages dynamically from the localized route and Airtable slug.
- [x] Render title, project type, date, location, and description only when present.
- [x] Render an optimized, responsive image gallery in explicit Airtable order.
- [x] Decide whether the gallery uses editorial masonry, alternating rows, or a clean single-column layout.
- [ ] Add an accessible image lightbox only if it improves review of project details.
- [x] Add localized image alt text and optional captions.
- [x] Add previous/next navigation using Published project order.
- [x] Add a clear return-to-portfolio control.
- [ ] Generate project-specific metadata, canonical URLs, Open Graph data, and structured data.
- [x] Return `notFound()` for missing or unpublished project slugs.

### 11. Blog and Prices

- [ ] Confirm and migrate every currently published Wix blog article.
- [x] Render sanitized Markdown or structured rich text from Airtable.
- [x] Build localized blog index and article pages.
- [ ] Add publication dates, cover images, article metadata, and share-preview images.
- [x] Build localized Prices content from Airtable records.
- [x] Remove the current cross-site Wix pricing dependency.
- [ ] Preserve useful old blog and pricing URLs through redirects where technically possible.

### 12. Localization

- [x] Use a locale-aware routing solution compatible with the Next.js App Router.
- [x] Limit supported locales to `en` and `bg` initially.
- [x] Keep interface translations in typed code dictionaries.
- [ ] Keep editorial content translations in Airtable.
- [x] Set the correct HTML `lang` value for every page.
- [ ] Generate localized canonical and `hreflang` links.
- [x] Make the language selector keyboard accessible.
- [x] Preserve the current project or blog slug when switching languages.
- [x] Define a consistent fallback policy for incomplete translations before launch.
- [ ] Review Bulgarian typography, quotation marks, dates, and line wrapping manually.

### 13. Contact form and email

- [ ] Implement the form as an accessible client component with a server-side submission route.
- [ ] Include first name, last name, email, message, locale, and consent fields as required.
- [ ] Validate input in both browser and server using a shared schema.
- [ ] Use Resend as the initial provider unless Brevo is selected before implementation.
- [ ] Send notification emails to `e.kadiyski@gmail.com`.
- [ ] Set a verified sender address on the future custom domain before production use.
- [ ] Set `Reply-To` to the visitor's validated email address.
- [ ] Create a clear bilingual HTML/plain-text email template.
- [ ] Add spam protection using a honeypot, timing checks, rate limiting, and optionally Turnstile if abuse occurs.
- [ ] Never expose provider API keys in browser code.
- [ ] Avoid logging complete message contents or personal data unnecessarily.
- [ ] Display localized success, validation, rate-limit, and provider-error messages.
- [ ] Add a privacy notice and consent wording appropriate for analytics and inquiries.
- [ ] Test successful delivery, invalid input, provider failure, repeated submissions, and spam controls.

### 14. Image handling

- [ ] Define accepted source formats, minimum dimensions, and maximum upload size for editors.
- [x] Use `next/image` for responsive delivery and layout stability.
- [ ] Configure Airtable attachment hostnames safely in Next.js image settings if remote delivery is retained.
- [ ] Treat Airtable attachment URLs as content inputs, not permanent asset identifiers.
- [ ] Consider copying finalized assets to a durable image host or the repository if Airtable URLs prove unsuitable for long-term delivery.
- [ ] Generate consistent cover crops without damaging full gallery images.
- [ ] Prefer AVIF/WebP delivery where the platform can optimize it.
- [x] Add width, height, aspect ratio, alt text, and optional blur placeholder data to the normalized image model.
- [ ] Avoid loading full galleries above the fold.
- [ ] Verify image sharpness and loading behavior on high-density mobile screens.

### 15. SEO and redirects

- [x] Define a production site URL environment variable for canonical URL generation.
- [x] Create localized default metadata and per-page overrides.
- [ ] Add canonical URLs and English/Bulgarian alternate links.
- [ ] Generate `sitemap.xml` for homepages, projects, posts, and Prices pages.
- [ ] Generate `robots.txt` with the correct production rules.
- [ ] Add Person or ProfessionalService structured data where accurate.
- [ ] Add BreadcrumbList and CreativeWork or Article data where appropriate.
- [ ] Create meaningful Open Graph and social preview metadata.
- [ ] Build a redirect inventory mapping every valuable old Wix URL to its new route.
- [ ] Add redirects for the eight known `/portfolio/portfolio-collections/portfolio/[slug]` pages.
- [ ] Add redirects for existing Wix blog post routes and the current pricing route.
- [ ] Decide whether redirects will be implemented on the purchased domain, the old Wix site, or both.
- [ ] Avoid redirect chains and redirect every legacy URL directly to the final localized destination.
- [ ] Verify that unpublished and duplicate routes do not enter the sitemap.

### 16. Analytics, Clarity, consent, and privacy

- [ ] Add Google Analytics using its production measurement ID from an environment variable.
- [ ] Add Microsoft Clarity using its project ID from an environment variable.
- [ ] Load analytics only in production.
- [ ] Implement consent handling suitable for the site's target audience and applicable privacy requirements.
- [ ] Prevent analytics from loading before consent when consent is legally required.
- [ ] Provide localized cookie/privacy controls and a way to revise consent.
- [ ] Exclude personal form content from analytics events and Clarity masking exceptions.
- [ ] Track only useful events such as language switch, project view, contact-form success, survey click, phone click, and email click.
- [ ] Avoid duplicate page-view events during App Router navigation.
- [ ] Document analytics event names and their business purpose.

### 17. Accessibility

- [x] Use semantic landmarks, heading order, navigation, lists, and form elements.
- [ ] Ensure all functionality is keyboard accessible.
- [x] Provide visible focus states consistent with the visual design.
- [ ] Meet WCAG AA contrast for essential text and controls.
- [x] Add an accessible skip link.
- [ ] Associate every form input with a visible label and error message.
- [ ] Ensure menu, language selector, and lightbox expose correct accessible states.
- [x] Add meaningful alt text and mark purely decorative images appropriately.
- [x] Respect reduced-motion settings.
- [ ] Run automated accessibility checks and complete a manual keyboard review.

### 18. Performance and resilience

- [x] Keep most homepage and detail-page rendering server-side.
- [x] Use client components only for interactions that require them.
- [ ] Cache normalized Airtable responses and define revalidation behavior.
- [x] Minimize third-party scripts and load them with appropriate strategies.
- [ ] Lazy-load below-the-fold media.
- [x] Keep font families and weights limited.
- [ ] Measure Core Web Vitals on representative mobile and desktop pages.
- [ ] Ensure Airtable or email-provider failures do not crash unrelated pages.
- [ ] Add a graceful maintenance fallback for temporary content-source failures.
- [ ] Check the final production bundle for accidentally exposed secrets.

### 19. Testing strategy

- [ ] Unit-test Airtable record normalization and validation.
- [x] Unit-test localized URL builders and fallback rules.
- [ ] Unit-test project ordering and previous/next navigation.
- [ ] Unit-test contact-form validation and email payload construction.
- [ ] Add component tests for navigation, language selection, cards, and form states.
- [ ] Add end-to-end tests for both localized homepages.
- [ ] Add end-to-end tests for a project page, blog article, Prices content, and 404 page.
- [ ] Add end-to-end tests for successful and failed contact submissions using mocked provider calls.
- [ ] Test desktop and mobile menu behavior.
- [x] Run lint, typecheck, tests, and production build before every release candidate.
- [ ] Test with Airtable unavailable, incomplete translations, missing images, and malformed records.

### 20. Cursor working method

- [x] Add a repository-level `AGENTS.md` or Cursor rules file describing architecture, naming, commands, localization, Airtable access, and security constraints.
- [x] Tell Cursor never to place secrets in source files or expose them through public environment variables.
- [x] Instruct Cursor to keep Airtable response types isolated from UI components.
- [x] Require each implementation task to finish with lint, typecheck, relevant tests, and a build when practical.
- [ ] Commit after each coherent phase rather than one large final commit.
- [x] Use small Cursor tasks: scaffold, data model, one section, one route family, one integration, then tests.
- [x] Review generated code before accepting dependency additions or architecture changes.
- [x] Keep a `DECISIONS.md` file for resolved choices and a `CONTENT-MIGRATION.md` checklist for missing assets/translations.

### 21. Recommended implementation sequence

#### Phase A — Foundation

- [x] Initialize the repository and quality scripts.
- [x] Establish the design tokens and base layout.
- [x] Establish localized routing and typed UI dictionaries.
- [x] Add normalized mock data and shared content types.
- [x] Build the header, footer, and single-page section shell.

#### Phase B — Airtable

- [x] Create the Airtable schema and sample records.
- [x] Implement secure server-side Airtable queries.
- [x] Implement normalization, validation, sorting, caching, and mocks.
- [x] Connect projects, services, settings, blog posts, and prices one content type at a time.

#### Phase C — Core experience

- [x] Implement all homepage sections.
- [x] Implement project detail routes and galleries.
- [x] Implement localized blog and Prices experiences.
- [x] Implement the language switcher and content fallbacks.
- [x] Complete responsive styling and motion.

#### Phase D — Contact and integrations

- [x] Implement and secure the contact form.
- [x] Configure and test Resend or Brevo.
- [ ] Add Google Analytics, Microsoft Clarity, and consent controls.
- [x] Add metadata, structured data, sitemap, robots, and redirects.

#### Phase E — Migration and quality assurance

- [ ] Migrate and standardize all current content.
- [ ] Add approved Bulgarian translations.
- [ ] Import available original images and track temporary Wix assets.
- [ ] Complete accessibility, performance, responsive, and browser testing.
- [ ] Run a full link and redirect audit.
- [ ] Complete stakeholder review in both languages.

### 22. Pre-launch acceptance checklist

- [ ] Every public page is available in English and Bulgarian.
- [x] All eight projects appear in the intended order and open correctly.
- [ ] Every project gallery uses the correct images and order.
- [x] All temporary or low-resolution images are clearly tracked.
- [ ] Blog, Prices, consultation survey, contact form, and social links work.
- [ ] Contact messages arrive at `e.kadiyski@gmail.com` without exposing credentials.
- [ ] No draft Airtable records are publicly accessible.
- [x] No Wix branding, Wix login UI, or obsolete cross-site navigation remains.
- [ ] Canonicals, `hreflang`, sitemap, robots, structured data, and social previews are correct.
- [ ] Google Analytics and Microsoft Clarity respect the chosen consent behavior.
- [ ] Known old URLs have documented redirect destinations.
- [ ] There are no broken links, missing required translations, console errors, or failed network requests.
- [x] Lint, typecheck, automated tests, and production build pass.
- [ ] Mobile, tablet, desktop, keyboard, and screen-reader spot checks pass.
- [ ] Performance is acceptable on image-heavy project pages.
- [ ] Environment-variable and content-editor documentation is complete.

### 23. Decisions to finalize during implementation

- [x] Confirm whether `/en` or `/bg` is the default redirect from `/`.
- [x] Confirm Resend versus Brevo; current recommendation is Resend.
- [ ] Confirm whether Prices are a homepage section or a dedicated localized page.
- [x] Confirm whether blog article bodies will be stored as Markdown in Airtable.
- [x] Confirm the project-gallery layout and whether a lightbox is required.
- [ ] Confirm the final custom domain and verified sender address when purchased.
- [x] Confirm cookie-consent requirements based on the intended markets and legal advice.
- [ ] Confirm whether Airtable attachments are temporary sources or the long-term media store.
- [ ] Confirm who approves the final Bulgarian translations and standardized project copy.

## Definition of done

- [ ] The implementation is complete only when the bilingual site builds successfully, reads Published content securely from Airtable, sends validated inquiries, exposes no secrets, meets the agreed visual direction, passes the quality checks above, and has a documented path for replacing temporary images and connecting the future custom domain.
