# Cinder & Vesper — `next-steakhouse-ember`

An editorial charcoal-and-ember steakhouse website template built with Next.js static export, React, TypeScript and Tailwind CSS v4. Designed around a **butcher’s cut ledger**, it pairs an **Ash linen** light palette and **Banked coals** dark palette with token-coloured cut silhouettes, a five-step culinary doneness guide, cellar and alcohol-free pairings, live time-zone-aware opening status, keyless Google Maps links and a Jamstacks support-form integration for reservation and private dining enquiries.

> **Sample content notice:** **Cinder & Vesper**, its menu, prices, pairings, phone number (`(212) 555-0148`), email (`hello@example.com`) and weekly service hours are entirely fictitious sample data created for this template. **20 Times Square, New York, NY 10036** is used solely as a public landmark placeholder for map links and embeds—never suggest that it houses this restaurant. Replace all sample business details, menu items, hours and the demo address before publishing a real website.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Opening cut ledger with featured cut diagram, Find us spread (`#find-us`), supporting food highlights, five-step doneness guide, pairing annotations, story & private dining inset, six native `<details>` FAQs and `Restaurant` JSON-LD |
| `/menu/` | Full dinner menu with sticky wrapping course index, cut ledger (weight, serves, marbling, bone-in/boneless, price and pairing links), vegetable main, supporting courses, `#doneness` guide, `#pairings` cellar list and dietary/weight notes |
| `/contact/` | Reservation & private dining enquiries with the hosted `<jamstacks-support-form>` when configured, or a clean direct-email fallback when unconfigured; email and telephone remain visible at all times |
| `/404.html` | Friendly static error page (“This cut isn’t on the menu.”) with navigation back to Home, Menu and Contact |

## Quick start

Node 24 or later and npm are required:

```sh
npm ci
npm run check
npm run dev
```

Preview the static export locally (including optional project base-path testing):

```sh
npm run build
npm start -- --port 3000
```

## Make it yours

Most owner updates are pure data edits in `content/` and never require touching React components:

| File | What it owns |
| --- | --- |
| `content/business.ts` | Business name, tagline, introduction, email, phone, story paragraphs, address & map query, directions, seven-day `openingHours`, service notice, amenities, private-dining copy, six visitor FAQs and Contact enquiry guidance |
| `content/menu.ts` | Currency/locale, `featuredCutId`, dinner courses (`first-course`, `cuts`, `from-the-garden`, `sides-and-sauces`, `last-course`), cut details (`art`, `weightOz`, `serves`, `marbling`, `boneIn`, `pairingId`), `pairings` and `donenessGuide` |
| `site.config.json` | Public site `name`, `description`, `domain`, IANA `timeZone` and `jamstacks` integration settings |
| `app/tailwind.input.css` | Light (`Ash linen`) and dark (`Banked coals`) colour tokens, `@theme inline` utility mappings, typography variables and shared ledger styles |
| `components/cut-art.tsx` | Token-coloured SVG cut silhouettes (`ribeye`, `strip`, `fillet`, `porterhouse`, `flat-iron`, `short-rib`, `vegetable`), wine-glass glyph, coal-notch mark and doneness cross-sections |
| `lib/structured-data.ts` | `schema.org/Restaurant` JSON-LD derived automatically from `content/business.ts` and `content/menu.ts` |
| `app/sitemap.ts` | Public static routes (`/`, `/menu/`, `/contact/`) |

### Worked example: repricing a cut, marking a cut unavailable, and switching the hero cut

Open `content/menu.ts`. To **reprice the ribeye**, **mark the New York strip temporarily unavailable** (which keeps it visible in the ledger with an explicit `Currently unavailable` badge rather than deleting it), and **promote the porterhouse to the home page hero**, update `featuredCutId` and the items in the `cuts` section:

```ts
export const menu: Menu = {
  currency: 'USD',
  locale: 'en-US',
  // 1. Choose any available cut ID from the `cuts` section as the Home hero entry:
  featuredCutId: 'porterhouse',
  sections: [
    // ...
    {
      id: 'cuts',
      title: 'The cut ledger',
      description: 'Seared over banked white-oak coals and rested before carving.',
      items: [
        {
          id: 'ribeye',
          name: 'Ribeye',
          description: 'Generous spinalis cap and rich intramuscular marbling...',
          // 2. Reprice the ribeye portion from 58 to 62:
          price: 62,
          diet: ['gluten-free-ingredients', 'dairy-free-ingredients'],
          badge: 'signature',
          available: true,
          featured: true,
          cut: {
            art: 'ribeye',
            weightOz: 14,
            serves: 1,
            marbling: 'rich',
            boneIn: false,
            pairingId: 'cabernet-blend',
          },
        },
        {
          id: 'new-york-strip',
          name: 'New York strip',
          description: 'Evenly marbled short-loin cut with a crisp outer fat cap...',
          price: 49,
          // 3. Mark temporarily unavailable without removing the item:
          available: false,
          featured: false,
          cut: {
            art: 'strip',
            weightOz: 12,
            serves: 1,
            marbling: 'balanced',
            boneIn: false,
            pairingId: 'crisp-white',
          },
        },
        // ...
      ],
    },
  ],
  // ...
};
```

### Common content tasks

- **Mark an item or wine pairing unavailable:** Set `available: false` on the `MenuItem` or `Pairing`. It stays in the ledger with an explicit `Currently unavailable` tag. If you mark the current hero cut (`menu.featuredCutId`) unavailable, `npm test` will fail with an actionable message reminding you to set `menu.featuredCutId` to an available cut, and remind you to keep `featured: true` only on 1–3 available supporting highlights.
- **Seasonal badge:** Set `badge: 'seasonal'` (or `'signature'` / `'new'`) on any `MenuItem`. Badges are manual editorial markers, never calendar-driven logic.
- **Add a new section or dish:** Add a `MenuSection` to `menu.sections` with a unique URL-safe `id` (lowercase words joined by hyphens). Items in the `cuts` section must include a `cut` object (`art`, `weightOz`, `serves`, `marbling`, `boneIn`, `pairingId`) and a single numeric portion `price`; items in other sections must omit `cut`.
- **Rename the business:** Change `name` in both `content/business.ts` and `site.config.json`.

## Opening hours, time zone and location

- **Weekly hours:** Edit `business.openingHours` in `content/business.ts`. Every weekday (`Monday` through `Sunday`) appears once. Omit `opens` and `closes` for a closed day (such as Monday), or supply same-day `HH:MM` 24-hour times (`17:00` to `22:00`). Overnight intervals past midnight are intentionally rejected by `validateHours()`.
- **Time zone:** Set the IANA `timeZone` in `site.config.json` (default `"America/New_York"`). `OpenBadge` computes `"Open now · until 22:00"` or `"Closed · opens Tuesday at 17:00"` in the browser using the restaurant’s time zone and refreshes every minute. Static HTML and no-JS views always render the neutral label `"See opening hours"`.
- **Map & directions:** Edit `business.address` in `content/business.ts`. Keep `business.address.mapQuery` in sync with the formatted address. `lib/maps.ts` builds keyless Google Maps search, directions and lazy-loaded iframe embed URLs with no API key required.

## Appearance, fonts and Tailwind CSS v4

- **Palette:** Light mode is **Ash linen** (`#F2EDE3` background, `#FAF7F0` surface, `#241D18` ink, `#923A20` primary accent, `#9C3F22` ember) and dark mode is **Banked coals** (`#141311` background, `#201D19` surface, `#F3E9DC` ink, `#AC4227` primary accent, `#F19B61` ember). Theme preference follows the visitor’s device by default and can be toggled in the header via `DarkModeToggle`.
- **Adding or changing colours:** All colours live in `app/tailwind.input.css`. Update or add a CSS variable in all three blocks (`:root`, `@media (prefers-color-scheme: dark) { :root:not(.light) }`, and `:root.dark`) and map it in `@theme inline` so utility classes and SVG fills switch automatically without scattering `dark:` overrides across components.
- **Self-hosted fonts and licences:**
  - `@fontsource-variable/oswald` (`Oswald Variable`, used for condensed ledger headings, numbers and buttons) — licensed under the **SIL Open Font License, Version 1.1 (OFL-1.1)** (`node_modules/@fontsource-variable/oswald/LICENSE`).
  - `@fontsource-variable/public-sans` (`Public Sans Variable`, used for body copy, navigation and descriptions) — licensed under the **SIL Open Font License, Version 1.1 (OFL-1.1)** (`node_modules/@fontsource-variable/public-sans/LICENSE`).
  - Both fonts are bundled locally from npm so builds and visitors never make external font requests.
- **Footer credit:** The `jamstacks.net` credit in `components/site-footer.tsx` is yours to keep, reword or remove on your own website.

## Public configuration (`site.config.json`)

```json
{
  "name": "Cinder & Vesper",
  "description": "A premium charcoal-and-ember steakhouse with editable cuts, weights and prices, a doneness guide, wine pairings, opening hours and location, and a Jamstacks contact component for reservation and private dining enquiries.",
  "domain": "next-steakhouse-ember.jamstacks.net",
  "timeZone": "America/New_York",
  "jamstacks": {
    "siteId": "",
    "cdnUrl": "https://cdn.jamstacks.net"
  }
}
```

Replace `"domain": "next-steakhouse-ember.jamstacks.net"` with your own production hostname (e.g. `"cinderandvesper.com"`). Never store menu or business content in `site.config.json`—the Jamstacks provisioner rewrites that file wholesale.

| Environment variable | Public build-time meaning |
| --- | --- |
| `JAMSTACKS_SITE` | Website ID; blank retains file default, absent ID gives email fallback |
| `NEXT_PUBLIC_JAMSTACKS_CDN_URL` | CDN asset base; default `https://cdn.jamstacks.net` |
| `NEXT_PUBLIC_SITE_DOMAIN` | Hostname overriding config `domain` |
| `SITE_TIME_ZONE` | IANA zone overriding config `timeZone` |
| `PAGES_BASE_PATH` | Project path such as `/steakhouse-preview`; blank for custom domain/root |
| `PAGES_BASE_URL` | Actual Pages origin and path; takes precedence for canonical URLs |
| `JAMSTACKS_ALLOW_LOCAL_CDN` | Explicit localhost-only testing opt-in; disallowed in GitHub Actions |

## Contact and reservation enquiry limits

- The Contact page (`app/contact/page.tsx`) is for **reservation & private dining enquiries**, not instant table booking, live inventory or online payment. Copy states clearly that arrangements are confirmed only when the restaurant replies.
- When `jamstacks.siteId` (or `JAMSTACKS_SITE`) is configured, Contact renders `<jamstacks-support-form>` and loads one `{cdn}/sites/{siteId}/embed.js` bootstrap script. The hosted runtime owns the name, email and message fields, validation and submission status.
- When no site ID is configured, Contact makes zero script requests and displays the direct email prompt (`Email hello@example.com with your enquiry. Arrangements are confirmed only by reply.`). Email and phone stay visible in both states.
- Links to and from `/contact/` use full-document navigation (`SiteLink`) so the hosted component mounts cleanly on every visit.

### Local Jamstacks component development

To test against a local Jamstacks CDN server during development, set `NEXT_PUBLIC_JAMSTACKS_CDN_URL` to your local origin and opt in with `JAMSTACKS_ALLOW_LOCAL_CDN=1`. GitHub Actions builds always reject localhost CDN URLs.

## Content Security Policy

If you configure a host-level Content Security Policy, allow:

- `script-src`: `'self'`, the inline theme bootstrap script hash/nonce, and your configured Jamstacks CDN origin (`https://cdn.jamstacks.net`) when the support form is enabled.
- `connect-src`: `'self'` and the Jamstacks support-form API origin when enabled.
- `frame-src`: `https://www.google.com` for the keyless Google Maps iframe in `#find-us`.
- `style-src` / `font-src` / `img-src`: `'self'` (all fonts and SVGs are self-hosted).

## GitHub Pages deployment

`.github/workflows/pages.yml` runs `npm ci`, `npm test`, `npm run typecheck` and `npm run build`, then deploys `out/` to GitHub Pages on pushes to `main` or manual `workflow_dispatch` runs (preserving the `provisioning_id` input and correlated run name). In your repository’s Pages settings, select **GitHub Actions** as the build source and set the custom domain to match `site.config.json`'s `domain`. Do not add a `public/CNAME` file.

## Project structure

```text
app/                  Next.js App Router pages (/ , /menu/ , /contact/ , 404, icon, sitemap, robots)
components/           Header, footer, page head, cut & doneness SVG art, map, open badge, support form
content/              Typed editable business profile (business.ts) and menu/cuts/pairings (menu.ts)
lib/                  Build-time config, hours, keyless maps, base-path helpers and Restaurant JSON-LD
scripts/              Static preview server (serve.mjs) and export verification (verify-export.mjs)
tests/                Node test suite for config, content, hours, embed status and template generation
jamstacks/            Removable gallery metadata and screenshots (not used by the website at runtime)
```

## Removable `jamstacks/` folder

The `jamstacks/` directory (`config.json`, `screenshots.json`, `home-light.jpg`, `home-dark.jpg`, `config.test.mjs`) exists only for indexing this template in the Jamstacks template gallery. Nothing in the website, `npm run check`, or `.github/workflows/pages.yml` imports or reads `jamstacks/`. Customer websites can delete the entire `jamstacks/` directory safely.

## Before publishing checklist

- [ ] Replace `business.name` in `content/business.ts` and `name` in `site.config.json`.
- [ ] Replace the sample Times Square address, directions, phone, email, story and weekly hours in `content/business.ts`.
- [ ] Replace the sample cuts, weights, prices, availability flags, `featuredCutId` and pairings in `content/menu.ts`.
- [ ] Set your production `domain` and IANA `timeZone` in `site.config.json`.
- [ ] Delete planning and migration documents (`PLAN.md`, `PROMPT_TEMPLATE.md`, `VALIDATION.md`) and, optionally, the `jamstacks/` gallery folder.
- [ ] Run `npm run check` and verify every page in light and dark modes.
