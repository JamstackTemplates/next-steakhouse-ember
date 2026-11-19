// The steakhouse cut ledger, supporting courses, doneness guide and wine pairings.
// Edit cuts, weights, prices, availability or `featuredCutId` here; Home, Menu and schema read from this file.
// Plain strings only: text is rendered as text, never as HTML.

/**
 * Dietary and ingredient markers shown on menu items.
 * Labels state "gluten-free ingredients" and "dairy-free ingredients"; kitchen notes warn of shared preparation and cross-contact.
 */
export type Diet =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free-ingredients'
  | 'dairy-free-ingredients'
  | 'contains-nuts';

export const DIETS: Record<Diet, { label: string; short: string }> = {
  vegetarian: { label: 'Vegetarian', short: 'V' },
  vegan: { label: 'Vegan', short: 'VG' },
  'gluten-free-ingredients': { label: 'Gluten-free ingredients', short: 'GFI' },
  'dairy-free-ingredients': { label: 'Dairy-free ingredients', short: 'DFI' },
  'contains-nuts': { label: 'Contains nuts', short: 'N' },
};

/** Deterministic cut silhouette key used by cuts in the ledger. */
export type CutArt = 'ribeye' | 'strip' | 'fillet' | 'porterhouse' | 'flat-iron' | 'short-rib';

/** Supported illustration art keys, including the optional non-beef vegetable silhouette. */
export type IllustrationArt = CutArt | 'vegetable';

/** Intramuscular marbling profile for steak cuts. */
export type Marbling = 'lean' | 'balanced' | 'rich';

/** Optional editorial callout badge. Seasonal is a manual badge, never calendar logic. */
export type MenuBadge = 'signature' | 'seasonal' | 'new';

/** Explicit labelled price variant (e.g. "Glass" / "Bottle"). */
export interface SizePrice {
  /** Explicit portion or vessel label, e.g. "Glass" or "Bottle". */
  label: string;
  /** Positive price in `menu.currency`. */
  amount: number;
}

/** Butcher's ledger metadata required on items in the `cuts` section and absent on other courses. */
export interface CutDetails {
  /** Deterministic SVG silhouette key for this cut. */
  art: CutArt;
  /** Approximate pre-cooking weight in ounces. */
  weightOz: number;
  /** Suggested number of diners the cut serves (positive integer, e.g. 1 or 2). */
  serves: number;
  /** Marbling character shown in the ledger. */
  marbling: Marbling;
  /** True when cooked on the bone, false when boneless. */
  boneIn: boolean;
  /** Optional ID referencing an entry in `pairings`. */
  pairingId?: string;
}

/** A single dish or cut on the dinner menu. */
export interface MenuItem {
  /** Unique, URL-safe ID used for links and anchors such as `/menu/#ribeye`. */
  id: string;
  /** Dish or cut name. */
  name: string;
  /** Direct culinary description of texture and preparation. */
  description: string;
  /** Portion price in `menu.currency` (cuts use a single number; other items may use labelled variants). */
  price: number | SizePrice[];
  /** Optional dietary/ingredient markers; never imply allergy safety. */
  diet?: Diet[];
  /** Optional manual highlight badge. */
  badge?: MenuBadge;
  /** Set to false to mark an item currently unavailable without hiding or deleting it. */
  available?: boolean;
  /** Marks 1–3 supporting highlights for the home page Cut ledger section (distinct from `menu.featuredCutId`). */
  featured?: boolean;
  /** Cut ledger specifications; required in the `cuts` section and omitted in other sections. */
  cut?: CutDetails;
}

/** A course or section of the dinner menu. */
export interface MenuSection {
  /** Unique, URL-safe ID used for section anchors such as `/menu/#cuts`. */
  id: string;
  /** Course heading. */
  title: string;
  /** Short editorial note under the course heading. */
  description: string;
  /** Items in this course. */
  items: MenuItem[];
}

/** Complete dinner menu configuration and courses. */
export interface Menu {
  /** ISO 4217 currency code (e.g. "USD"). */
  currency: string;
  /** BCP 47 locale for price formatting (e.g. "en-US"). */
  locale: string;
  /** Ordered dinner courses. */
  sections: MenuSection[];
  /** Optional table additions or sauces with prices. */
  extras: {
    /** Addition name. */
    name: string;
    /** Price in `menu.currency`. */
    price: number;
  }[];
  /** Footnotes covering approximate pre-cooking weights, shared-kitchen cross-contact and taxes/gratuity. */
  notes: string[];
  /** ID of the available cut in the `cuts` section featured in the Home hero ledger. */
  featuredCutId: string;
}

/** Style category for cellar and non-alcoholic pairings. */
export type PairingStyle = 'red' | 'white' | 'sparkling' | 'alcohol-free';

/** A wine or alcohol-free pairing suggestion referenced by cuts. */
export interface Pairing {
  /** Unique, URL-safe ID used for anchors such as `/menu/#cabernet-blend`. */
  id: string;
  /** Generic style name (never a real producer trademark or invented vintage). */
  name: string;
  /** Pairing category. */
  style: PairingStyle;
  /** Tasting note explaining how it complements the cut or dish. */
  description: string;
  /** Single price or explicit Glass / Bottle variant prices. */
  price: number | SizePrice[];
  /** Set to false to show the pairing as currently unavailable while preserving cut references. */
  available?: boolean;
}

/** Fixed five-step doneness identifier. */
export type DonenessId = 'rare' | 'medium-rare' | 'medium' | 'medium-well' | 'well-done';

/** Culinary doneness description (appearance and texture only; never temperature targets or safety advice). */
export interface Doneness {
  /** Fixed doneness identifier. */
  id: DonenessId;
  /** Display label. */
  label: string;
  /** Visual description of the cut's centre. */
  centreDescription: string;
  /** Texture and crust note. */
  textureNote: string;
}

export const DONENESS_ORDER: readonly DonenessId[] = [
  'rare',
  'medium-rare',
  'medium',
  'medium-well',
  'well-done',
] as const;

export const DONENESS_NOTE =
  'Tell the team your preference and any dietary needs; preparation is discussed when ordering.';

export const pairings: Pairing[] = [
  {
    id: 'cabernet-blend',
    name: 'Cabernet blend',
    style: 'red',
    description:
      'Blackcurrant leaf, cedar and firm tannin that cuts cleanly through rich ribeye marbling and a heavy coal sear.',
    price: [
      { label: 'Glass', amount: 14 },
      { label: 'Bottle', amount: 52 },
    ],
  },
  {
    id: 'pinot-style-red',
    name: 'Pinot-style red',
    style: 'red',
    description:
      'Bright red cherry, dried thyme and supple acidity that complements lean centre-cut tenderloin and flat iron.',
    price: [
      { label: 'Glass', amount: 13 },
      { label: 'Bottle', amount: 48 },
    ],
  },
  {
    id: 'crisp-white',
    name: 'Crisp white',
    style: 'white',
    description:
      'Orchard pear, citrus pith and a dry mineral finish that refreshes the palate beside New York strip and charred greens.',
    price: [
      { label: 'Glass', amount: 12 },
      { label: 'Bottle', amount: 44 },
    ],
  },
  {
    id: 'blackcurrant-spritz',
    name: 'Alcohol-free blackcurrant spritz',
    style: 'alcohol-free',
    description:
      'Tart blackcurrant infusion, toasted rosemary and cold sparkling water with gentle tannic grip for slow-braised and bone-in cuts.',
    price: 8,
  },
];

export const donenessGuide: Doneness[] = [
  {
    id: 'rare',
    label: 'Rare',
    centreDescription: 'Deep crimson centre throughout with a thin seared outer ring.',
    textureNote: 'Very soft, cool-to-warm bite with maximum natural juiciness; best suited to lean fillet.',
  },
  {
    id: 'medium-rare',
    label: 'Medium-rare',
    centreDescription: 'Warm red centre shading to rose toward the crust.',
    textureNote: 'Supple and yielding while giving intramuscular marbling time to soften across the grate.',
  },
  {
    id: 'medium',
    label: 'Medium',
    centreDescription: 'Even rose-pink centre with a broader browned collar.',
    textureNote: 'Firm, juicy bite that renders thicker seams of fat in ribeye and short rib.',
  },
  {
    id: 'medium-well',
    label: 'Medium-well',
    centreDescription: 'Mostly browned interior with a faint ribbon of muted pink at the core.',
    textureNote: 'Dense, savoury chew with pronounced char character from longer time over the coals.',
  },
  {
    id: 'well-done',
    label: 'Well-done',
    centreDescription: 'Browned evenly from edge to centre with no pink remaining.',
    textureNote: 'Firmest grain and deepest roasted crust; basted with herb butter unless requested dairy-free.',
  },
];

export const menu: Menu = {
  currency: 'USD',
  locale: 'en-US',
  featuredCutId: 'ribeye',
  sections: [
    {
      id: 'first-course',
      title: 'First course',
      description: 'Small warm and crisp plates to open the evening while the grate comes to heat.',
      items: [
        {
          id: 'charred-onion-broth',
          name: 'Charred onion broth',
          description: 'Slow-caramelised yellow onions simmered in dark roasted stock with thyme and a toasted country crouton.',
          price: 12,
          diet: ['vegetarian', 'dairy-free-ingredients'],
        },
        {
          id: 'little-gem-salad',
          name: 'Little gem salad',
          description: 'Crisp quartered hearts dressed in aged sherry vinaigrette with shaved radish, chives and cracked pepper.',
          price: 14,
          diet: ['vegan', 'vegetarian', 'gluten-free-ingredients', 'dairy-free-ingredients'],
        },
        {
          id: 'ember-roasted-mushrooms',
          name: 'Ember-roasted mushrooms',
          description: 'Clustered oyster and cremini mushrooms blistered in cast iron over the coals with roasted garlic and parsley.',
          price: 16,
          diet: ['vegan', 'vegetarian', 'gluten-free-ingredients', 'dairy-free-ingredients'],
          badge: 'signature',
        },
      ],
    },
    {
      id: 'cuts',
      title: 'The cut ledger',
      description: 'Seared over banked white-oak coals and rested before carving. Weights are approximate pre-cooking ounces; prices are per listed portion.',
      items: [
        {
          id: 'ribeye',
          name: 'Ribeye',
          description: 'Generous spinalis cap and rich intramuscular marbling that bastes itself over high heat, giving a deep crust and loose, juicy grain.',
          price: 58,
          diet: ['gluten-free-ingredients', 'dairy-free-ingredients'],
          badge: 'signature',
          available: true,
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
          description: 'Evenly marbled short-loin cut with a crisp outer fat cap, tighter grain than ribeye and a clean, savoury beef finish.',
          price: 49,
          diet: ['gluten-free-ingredients', 'dairy-free-ingredients'],
          available: true,
          featured: true,
          cut: {
            art: 'strip',
            weightOz: 12,
            serves: 1,
            marbling: 'balanced',
            boneIn: false,
            pairingId: 'crisp-white',
          },
        },
        {
          id: 'fillet',
          name: 'Fillet',
          description: 'Thick centre-cut tenderloin with almost no external fat, prized for a fine, velvety texture and delicate char.',
          price: 54,
          diet: ['gluten-free-ingredients', 'dairy-free-ingredients'],
          available: true,
          featured: true,
          cut: {
            art: 'fillet',
            weightOz: 8,
            serves: 1,
            marbling: 'lean',
            boneIn: false,
            pairingId: 'pinot-style-red',
          },
        },
        {
          id: 'porterhouse',
          name: 'Porterhouse',
          description: 'Two cuts on a single T-bone—full strip on one side, generous tenderloin on the other—seared whole, rested and sliced for the table.',
          price: 112,
          diet: ['gluten-free-ingredients', 'dairy-free-ingredients'],
          badge: 'signature',
          available: true,
          cut: {
            art: 'porterhouse',
            weightOz: 32,
            serves: 2,
            marbling: 'balanced',
            boneIn: true,
            pairingId: 'cabernet-blend',
          },
        },
        {
          id: 'flat-iron',
          name: 'Flat iron',
          description: 'Seam-cut chuck blade with uniform thickness, fine marbling streaks and a deep, mineral flavour best suited to medium-rare.',
          price: 36,
          diet: ['gluten-free-ingredients', 'dairy-free-ingredients'],
          available: false,
          cut: {
            art: 'flat-iron',
            weightOz: 10,
            serves: 1,
            marbling: 'balanced',
            boneIn: false,
            pairingId: 'pinot-style-red',
          },
        },
        {
          id: 'short-rib',
          name: 'Short rib',
          description: 'Thick bone-in chuck rib braised slowly until spoon-tender, then finished over the embers for a lacquered, smoky bark.',
          price: 42,
          diet: ['gluten-free-ingredients', 'dairy-free-ingredients'],
          available: true,
          cut: {
            art: 'short-rib',
            weightOz: 16,
            serves: 1,
            marbling: 'rich',
            boneIn: true,
            pairingId: 'blackcurrant-spritz',
          },
        },
      ],
    },
    {
      id: 'from-the-garden',
      title: 'From the garden',
      description: 'Hearty plant-based centrepiece roasted directly over the same banked coals.',
      items: [
        {
          id: 'coal-roasted-cauliflower',
          name: 'Coal-roasted cauliflower',
          description: 'Whole crown basted with herb oil and roasted until the florets caramelise and the stem turns tender, served over lemon-tahini emulsion and caper gremolata.',
          price: 27,
          diet: ['vegan', 'vegetarian', 'gluten-free-ingredients', 'dairy-free-ingredients'],
          badge: 'signature',
          available: true,
          featured: true,
        },
      ],
    },
    {
      id: 'sides-and-sauces',
      title: 'Sides & sauces',
      description: 'Portioned for the middle of the table alongside pan sauces for the grill.',
      items: [
        {
          id: 'crisp-potatoes',
          name: 'Crisp potatoes',
          description: 'Crushed Yukon Gold potatoes par-cooked and roasted in vegetable oil with rosemary and flaky sea salt.',
          price: 9,
          diet: ['vegan', 'vegetarian', 'gluten-free-ingredients', 'dairy-free-ingredients'],
        },
        {
          id: 'creamed-greens',
          name: 'Creamed greens',
          description: 'Wilted lacinato kale and spinach folded into a nutmeg, shallot and double-cream reduction.',
          price: 10,
          diet: ['vegetarian', 'gluten-free-ingredients'],
        },
        {
          id: 'charred-carrots',
          name: 'Charred carrots',
          description: 'Split Thumbelina and Nantes carrots roasted over the grate with cumin seed and orange zest.',
          price: 9,
          diet: ['vegan', 'vegetarian', 'gluten-free-ingredients', 'dairy-free-ingredients'],
          badge: 'seasonal',
        },
        {
          id: 'peppercorn-sauce',
          name: 'Peppercorn sauce',
          description: 'Cracked black and green peppercorns simmered with brandy, reduced stock and a touch of cream.',
          price: 4,
          diet: ['gluten-free-ingredients'],
        },
      ],
    },
    {
      id: 'last-course',
      title: 'Last course',
      description: 'Simple, unhurried puddings to close the ledger.',
      items: [
        {
          id: 'dark-chocolate-torte',
          name: 'Dark chocolate torte',
          description: 'Dense flourless bittersweet chocolate slice baked with espresso and served with unsweetened cream.',
          price: 12,
          diet: ['vegetarian', 'gluten-free-ingredients'],
        },
        {
          id: 'vanilla-custard',
          name: 'Vanilla custard',
          description: 'Chilled baked custard infused with split vanilla pod under a thin crack of burnt sugar.',
          price: 11,
          diet: ['vegetarian', 'gluten-free-ingredients'],
        },
      ],
    },
  ],
  extras: [
    { name: 'Peppercorn sauce', price: 4 },
    { name: 'Roasted garlic & herb butter', price: 3 },
    { name: 'Charred lemon & flaky salt', price: 0 },
  ],
  notes: [
    'Weights in the cut ledger are approximate pre-cooking weights in ounces; prices are per listed portion, never per ounce.',
    'GFI gluten-free ingredients · DFI dairy-free ingredients · V vegetarian · VG vegan · N contains nuts. All dishes are prepared in a shared kitchen and over open coals where allergen cross-contact can occur; please inform the team of any allergy before ordering.',
    'Prices are listed in US dollars before applicable state and local sales tax. No mandatory service charge is added automatically.',
  ],
};

/** Every food item across all sections, in menu order. */
export function getAllItems(sourceMenu: Menu = menu): MenuItem[] {
  return sourceMenu.sections.flatMap(section => section.items);
}

export const allItems: MenuItem[] = getAllItems(menu);

/** Returns true unless `available` is explicitly set to `false`. */
export function isAvailable(item: { available?: boolean }): boolean {
  return item.available !== false;
}

/** Explicit label when an item or pairing is marked unavailable (`available: false`), or `null` when available. */
export function availabilityLabel(item: { available?: boolean }): string | null {
  return isAvailable(item) ? null : 'Currently unavailable';
}

/** Look up the cut referenced by `menu.featuredCutId` in the `cuts` section. */
export function findFeaturedCut(sourceMenu: Menu = menu): MenuItem | undefined {
  const cutsSection = sourceMenu.sections.find(section => section.id === 'cuts');
  const pool = cutsSection ? cutsSection.items : getAllItems(sourceMenu);
  return pool.find(item => item.id === sourceMenu.featuredCutId && Boolean(item.cut));
}

/**
 * Returns the selected hero cut from `menu.featuredCutId`.
 * Falls back to the first cut in the `cuts` section only if the referenced ID is missing at runtime.
 */
export function getFeaturedCut(sourceMenu: Menu = menu): MenuItem {
  const match = findFeaturedCut(sourceMenu);
  if (match) return match;
  const fallback = getAllItems(sourceMenu).find(item => Boolean(item.cut));
  if (!fallback) throw new Error('Menu must contain at least one cut item.');
  return fallback;
}

/** Supporting highlights marked `featured: true` (excluding the hero cut). */
export function getSupportingHighlights(sourceMenu: Menu = menu): MenuItem[] {
  return getAllItems(sourceMenu).filter(item => item.featured && item.id !== sourceMenu.featuredCutId);
}

export const featuredItems: MenuItem[] = getSupportingHighlights(menu);

/** Look up a wine or alcohol-free pairing by ID. */
export function getPairing(
  pairingId: string | undefined,
  sourcePairings: readonly Pairing[] = pairings,
): Pairing | undefined {
  if (!pairingId) return undefined;
  return sourcePairings.find(entry => entry.id === pairingId);
}

/**
 * Resolves two or three pairing annotations from menu cut references for the Home page,
 * ensuring the alcohol-free suggestion is included when referenced or available.
 */
export function getResolvedCutPairings(
  sourceMenu: Menu = menu,
  sourcePairings: readonly Pairing[] = pairings,
): { pairing: Pairing; cuts: MenuItem[] }[] {
  const cuts = getAllItems(sourceMenu).filter(item => Boolean(item.cut));
  const byPairing = new Map<string, { pairing: Pairing; cuts: MenuItem[] }>();
  for (const item of cuts) {
    const pairing = getPairing(item.cut?.pairingId, sourcePairings);
    if (!pairing) continue;
    const existing = byPairing.get(pairing.id);
    if (existing) existing.cuts.push(item);
    else byPairing.set(pairing.id, { pairing, cuts: [item] });
  }
  const resolved = [...byPairing.values()];
  if (resolved.length <= 3) return resolved;
  const alcoholFree = resolved.find(entry => entry.pairing.style === 'alcohol-free');
  const firstTwo = resolved.filter(entry => entry.pairing.style !== 'alcohol-free').slice(0, 2);
  return alcoholFree ? [...firstTwo, alcoholFree] : resolved.slice(0, 3);
}

/** Presentation helper that maps a menu item to its SVG silhouette key without adding a fake beef `cut` object to vegetable items. */
export function getItemIllustrationArt(item: MenuItem, sectionId?: string): IllustrationArt | undefined {
  if (item.cut) return item.cut.art;
  if (sectionId === 'from-the-garden' || item.id === 'coal-roasted-cauliflower') return 'vegetable';
  return undefined;
}

/** Format a single numeric amount in the menu currency (e.g. "$58" or "$4.50"). */
export function formatPrice(amount: number, sourceMenu: Pick<Menu, 'locale' | 'currency'> = menu): string {
  if (amount === 0) return 'Included';
  const formatter = new Intl.NumberFormat(sourceMenu.locale, {
    style: 'currency',
    currency: sourceMenu.currency,
  });
  const text = formatter.format(amount);
  return Number.isInteger(amount) ? text.replace(/[.,]00(?=\D*$)/, '') : text;
}

/**
 * Format a numeric price or a `SizePrice[]` variant array with explicit labels and amounts
 * (e.g. "Glass $14 · Bottle $52"), never a misleading starting price.
 */
export function formatPriceDisplay(
  price: number | SizePrice[],
  sourceMenu: Pick<Menu, 'locale' | 'currency'> = menu,
): string {
  if (typeof price === 'number') return formatPrice(price, sourceMenu);
  return price.map(variant => `${variant.label} ${formatPrice(variant.amount, sourceMenu)}`).join(' · ');
}
