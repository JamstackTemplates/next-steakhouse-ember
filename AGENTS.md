# Agent guide: `next-steakhouse-ember` customer website

## 1. Working preferences

- Work on the current branch, preserve existing user changes and leave your edits uncommitted unless the user explicitly asks you to commit.
- Do not push, change GitHub settings or deploy unless asked.
- Replace the fictitious **Cinder & Vesper** sample content (including the 20 Times Square placeholder address, `hello@example.com`, `(212) 555-0148` and sample menu prices) with the owner's real restaurant details when requested.
- This is a self-contained static website with no runtime dependency on the starter or portal repositories.

## 2. Structure and content

- **`content/business.ts`** owns the restaurant name (`business.name`), tagline, introduction, public email and phone, story paragraphs, physical address and canonical `mapQuery`, arrival directions, seven-day `openingHours`, manual service `notice`, qualified `amenities`, `privateDining` copy, six visitor `faqs`, `socialLinks` and Contact `enquiries` copy.
- **`content/menu.ts`** owns `menu` (`currency`, `locale`, `featuredCutId`, `sections`, `extras`, `notes`), `pairings` and `donenessGuide`, plus pure helpers (`getFeaturedCut`, `getSupportingHighlights`, `getPairing`, `getResolvedCutPairings`, `formatPrice`, `formatPriceDisplay`, `isAvailable`, `availabilityLabel`, `getItemIllustrationArt`).
- Most owner requests ("reprice the ribeye", "mark flat iron sold out", "change the hero cut", "update Sunday hours") are data edits in `content/menu.ts` or `content/business.ts` that never touch React components.
- Keep all `id` values across sections, menu items, pairings, amenities and FAQs unique and URL-safe (`^[a-z0-9]+(?:-[a-z0-9]+)*$`), as they double as page anchors (`/menu/#ribeye`, `/menu/#cabernet-blend`).
- Mark temporarily unavailable cuts, dishes or pairings with `available: false` rather than deleting them so the ledger shows `Currently unavailable` honestly. `menu.featuredCutId` must always reference an **available** cut in the `cuts` section, and 1–3 other available items must have `featured: true`.
- Reuse the token-coloured SVG silhouettes in `components/cut-art.tsx` (`ribeye`, `strip`, `fillet`, `porterhouse`, `flat-iron`, `short-rib`, `vegetable`) and the template palette rather than adding stock photos or external image files.
- **Never put business or menu content in `site.config.json`.** The Jamstacks provisioner rewrites `site.config.json` wholesale with `name`, `description`, `domain`, optional `timeZone`, `jamstacks.siteId`, `jamstacks.cdnUrl` and optional `provisioningId`. Rename the business in both `content/business.ts` and `site.config.json`.

## 3. Styling (Tailwind CSS v4)

- Style components with Tailwind utility classes in TSX. `app/tailwind.input.css` owns the colour tokens (`--bg`, `--surface`, `--surface-raised`, `--text`, `--muted`, `--accent`, `--ember`, `--rule`, `--focus`, `--wine`, `--fat`, `--sear`, `--on-accent`), `@theme` font/radius definitions, `@theme inline` colour utility mappings, `--jamstacks-*` variables, base styles and shared ledger building blocks (`.button`, `.button-quiet`, `.text-link`, `.eyebrow`, `.ledger-num`, `.ledger-tag`).
- Tailwind's default colour palette is disabled (`--color-*: initial`). To add or adjust a colour, define the CSS custom property in all three blocks (`:root`, `@media (prefers-color-scheme: dark) { :root:not(.light) }`, and `:root.dark`) and map it under `@theme inline`. Prefer semantic tokens over `dark:` utilities, and never hard-code hex values in TSX components.
- Keep `--accent` dark enough in both modes to support white button text (`--on-accent: #FFFFFF`), and ensure all interactive controls have accessible focus indicators (`:focus-visible`), semantic heading hierarchy, no horizontal overflow at 360px–390px, and `prefers-reduced-motion: reduce` support.

## 4. Static architecture

- Next.js static export only (`output: 'export'`, `trailingSlash: true`, unoptimized images). Do not add Route Handlers, Server Actions, middleware, request-time rendering, databases or a production Next.js server.
- Use client components (`'use client'`) only for browser-only interactions (`OpenBadge`, `CopyEmail`, `JamstacksSupportForm`, `SiteLink`).
- Time-dependent text (`OpenBadge`) is computed only in the browser using `site.timeZone` (`America/New_York`) and refreshed every minute; static/no-JS HTML always outputs `"See opening hours"`. Do not build clock-dependent specials or countdowns.
- Use `SiteLink` and the helpers in `lib/paths.ts` (`route`, `documentHref`, `asset`, `absoluteUrl`) so links and assets work under both root domains and GitHub Pages project base paths (`PAGES_BASE_PATH`).
- Read `node_modules/next/dist/docs/` before changing Next.js framework configuration.

## 5. Optional Jamstacks form

- Keep `components/jamstacks-support-form.tsx` unchanged in behaviour. Only `/contact/` renders `<jamstacks-support-form>` and loads `{cdn}/sites/{siteId}/embed.js` when a site ID is configured.
- When no site ID is configured, `/contact/` renders the direct-email fallback and makes no embed script request. Email (`business.email`) and telephone remain visible beside the form in both states.
- Never register the custom element locally, render a substitute HTML form, intercept submissions or claim that a message was delivered or a table was reserved. The form supports name, email and message only.
- Keep all config values public; never place secrets or API keys in `site.config.json` or environment variables. Preserve the `.github/workflows/pages.yml` `provisioning_id` dispatch input and correlated `run-name`.

## 6. Commands and checks

- Run `npm run check` (`npm test && npm run typecheck && npm run build`) after every change. Test failures in `tests/content.test.ts` and `tests/hours.test.ts` name the exact section, item, pairing, weekday or field to fix.
- Verify exports in both unconfigured and configured states and with a project base path:
  - `npm run build && npm run verify:export`
  - `PAGES_BASE_PATH=/steakhouse-preview JAMSTACKS_SITE=site_test123 npm run build && PAGES_BASE_PATH=/steakhouse-preview JAMSTACKS_SITE=site_test123 npm run verify:export`
- Visually verify `/`, `/menu/`, `/contact/` and `/404.html` in both light and dark modes at desktop (`1440px`) and mobile (`390px`) widths.
- Report local verification results separately from live deployment or real form message delivery.

## 7. Template publishing assets

- The `jamstacks/` directory (`config.json`, `screenshots.json`, `home-light.jpg`, `home-dark.jpg`, `config.test.mjs`) is for the source template gallery only and may be deleted by customers or provisioning.
- Nothing in `app/`, `components/`, `content/`, `lib/`, `tests/` or `.github/workflows/pages.yml` may import or read from `jamstacks/`, `PLAN.md` or `PROMPT_TEMPLATE.md`.
- After a fresh normal `npm run build`, capture gallery screenshots and validate `node --test jamstacks/config.test.mjs` separately.
