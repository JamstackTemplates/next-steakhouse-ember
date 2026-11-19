import assert from 'node:assert/strict';
import { test } from 'node:test';
import { business, formatAddress, formatServiceHours } from '../content/business.ts';
import {
  allItems,
  availabilityLabel,
  DIETS,
  DONENESS_NOTE,
  DONENESS_ORDER,
  donenessGuide,
  findFeaturedCut,
  formatPrice,
  formatPriceDisplay,
  getAllItems,
  getFeaturedCut,
  getItemIllustrationArt,
  getPairing,
  getResolvedCutPairings,
  getSupportingHighlights,
  isAvailable,
  menu,
  pairings,
  type CutArt,
  type Doneness,
  type Marbling,
  type Menu,
  type MenuBadge,
  type Pairing,
  type PairingStyle,
  type SizePrice,
} from '../content/menu.ts';
import { validateHours } from '../lib/hours.ts';
import { mapDirectionsUrl, mapEmbedUrl, mapSearchUrl } from '../lib/maps.ts';
import { businessStructuredData, derivePriceRange, jsonLd } from '../lib/structured-data.ts';
import { timeZoneLabel } from '../lib/time-zone.ts';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CUT_ARTS: readonly CutArt[] = ['ribeye', 'strip', 'fillet', 'porterhouse', 'flat-iron', 'short-rib'];
const MARBLINGS: readonly Marbling[] = ['lean', 'balanced', 'rich'];
const BADGES: readonly MenuBadge[] = ['signature', 'seasonal', 'new'];
const PAIRING_STYLES: readonly PairingStyle[] = ['red', 'white', 'sparkling', 'alcohol-free'];
const RESERVED_ANCHORS = new Set(['main', 'find-us', 'doneness', 'pairings']);

function isPositiveCentsNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 && Math.round(value * 100) === value * 100;
}

function validatePriceField(price: number | SizePrice[], context: string): void {
  if (typeof price === 'number') {
    assert.ok(isPositiveCentsNumber(price), `${context}.price: must be a positive finite number with at most 2 decimals (got ${price})`);
    return;
  }
  assert.ok(Array.isArray(price) && price.length >= 1, `${context}.price: variant list must not be empty`);
  const labels = new Set<string>();
  for (const variant of price) {
    assert.ok(typeof variant.label === 'string' && variant.label.trim().length > 0, `${context}.price: variant label is required`);
    const normalized = variant.label.trim().toLowerCase();
    assert.ok(!labels.has(normalized), `${context}.price: duplicate variant label "${variant.label}"`);
    labels.add(normalized);
    assert.ok(
      isPositiveCentsNumber(variant.amount),
      `${context}.price[${variant.label}]: amount must be a positive finite number (got ${variant.amount})`,
    );
  }
}

/** Validate structural and relational rules for any Menu, Pairing[] and Doneness[] set with actionable messages. */
export function validateMenuAndPairings(
  sourceMenu: Menu,
  sourcePairings: readonly Pairing[],
  sourceDoneness: readonly Doneness[] = donenessGuide,
): void {
  assert.ok(sourceMenu.currency.trim().length === 3, 'menu.currency: expected a 3-letter ISO currency code');
  assert.ok(sourceMenu.locale.trim().length >= 2, 'menu.locale: expected a non-empty locale string');
  assert.doesNotThrow(
    () => new Intl.NumberFormat(sourceMenu.locale, { style: 'currency', currency: sourceMenu.currency }),
    'menu.locale / menu.currency: invalid Intl.NumberFormat configuration',
  );

  assert.ok(sourceMenu.sections.length >= 1, 'menu.sections: include at least one menu section');
  const seenIds = new Set<string>(RESERVED_ANCHORS);

  const registerId = (id: string, context: string) => {
    assert.match(id, SLUG, `${context}: id "${id}" must be URL-safe lowercase words joined by hyphens`);
    assert.ok(!seenIds.has(id), `${context}: duplicate or reserved anchor id "${id}"`);
    seenIds.add(id);
  };

  assert.ok(sourcePairings.length >= 1, 'pairings: include at least one pairing');
  const pairingById = new Map<string, Pairing>();
  for (const pairing of sourcePairings) {
    registerId(pairing.id, `pairing "${pairing.id}"`);
    assert.ok(pairing.name.trim(), `pairing "${pairing.id}".name: required`);
    assert.ok(pairing.description.trim(), `pairing "${pairing.id}".description: required`);
    assert.ok(
      PAIRING_STYLES.includes(pairing.style),
      `pairing "${pairing.id}".style: must be one of ${PAIRING_STYLES.join(', ')}`,
    );
    validatePriceField(pairing.price, `pairing "${pairing.id}"`);
    if (pairing.available !== undefined) {
      assert.equal(typeof pairing.available, 'boolean', `pairing "${pairing.id}".available: must be boolean`);
    }
    pairingById.set(pairing.id, pairing);
  }
  assert.ok(
    sourcePairings.some(pairing => pairing.style === 'alcohol-free'),
    'pairings: include at least one alcohol-free pairing option',
  );

  let cutsSectionFound = false;
  for (const section of sourceMenu.sections) {
    registerId(section.id, `section "${section.id}"`);
    assert.ok(section.title.trim(), `section "${section.id}".title: required`);
    assert.ok(section.description.trim(), `section "${section.id}".description: required`);
    assert.ok(section.items.length >= 1, `section "${section.id}".items: add at least one item`);

    const isCutsSection = section.id === 'cuts';
    if (isCutsSection) cutsSectionFound = true;

    for (const item of section.items) {
      const ctx = `section "${section.id}" -> item "${item.id}"`;
      registerId(item.id, ctx);
      assert.ok(item.name.trim(), `${ctx}.name: required`);
      assert.ok(item.description.trim(), `${ctx}.description: required`);
      validatePriceField(item.price, ctx);

      if (item.available !== undefined) {
        assert.equal(typeof item.available, 'boolean', `${ctx}.available: must be boolean`);
      }
      if (item.featured !== undefined) {
        assert.equal(typeof item.featured, 'boolean', `${ctx}.featured: must be boolean`);
      }
      if (item.badge !== undefined) {
        assert.ok(BADGES.includes(item.badge), `${ctx}.badge: must be one of ${BADGES.join(', ')}`);
      }
      for (const diet of item.diet ?? []) {
        assert.ok(diet in DIETS, `${ctx}.diet: unknown diet "${diet}"`);
      }
      assert.equal(new Set(item.diet ?? []).size, (item.diet ?? []).length, `${ctx}.diet: duplicate diet tag`);

      if (isCutsSection) {
        assert.ok(item.cut, `${ctx}.cut: every item in section "cuts" must define cut details`);
        assert.equal(
          typeof item.price,
          'number',
          `${ctx}.price: cuts must use a single numeric portion price so weight and price never mismatch`,
        );
        const { cut } = item;
        assert.ok(CUT_ARTS.includes(cut.art), `${ctx}.cut.art: must be one of ${CUT_ARTS.join(', ')}`);
        assert.ok(
          typeof cut.weightOz === 'number' && Number.isFinite(cut.weightOz) && cut.weightOz > 0,
          `${ctx}.cut.weightOz: must be a positive number`,
        );
        assert.ok(
          Number.isInteger(cut.serves) && cut.serves >= 1,
          `${ctx}.cut.serves: must be a positive integer`,
        );
        assert.ok(MARBLINGS.includes(cut.marbling), `${ctx}.cut.marbling: must be one of ${MARBLINGS.join(', ')}`);
        assert.equal(typeof cut.boneIn, 'boolean', `${ctx}.cut.boneIn: must be boolean`);
        assert.ok(cut.pairingId && cut.pairingId.trim(), `${ctx}.cut.pairingId: assign a pairing reference to every cut`);
        assert.ok(
          pairingById.has(cut.pairingId),
          `${ctx}.cut.pairingId: "${cut.pairingId}" does not match any pairing id in content/menu.ts`,
        );
      } else {
        assert.equal(
          item.cut,
          undefined,
          `${ctx}.cut: cut metadata is only allowed in section "cuts" (omit cut on vegetable, starter, side and dessert items)`,
        );
      }
    }
  }

  assert.ok(cutsSectionFound, 'menu.sections: a "cuts" section is required');

  const heroCut = findFeaturedCut(sourceMenu);
  assert.ok(
    heroCut,
    `menu.featuredCutId "${sourceMenu.featuredCutId}" does not match any cut in section "cuts"; update menu.featuredCutId in content/menu.ts`,
  );
  assert.ok(
    isAvailable(heroCut),
    `menu.featuredCutId "${sourceMenu.featuredCutId}" is marked unavailable (available: false); select an available replacement cut in menu.featuredCutId`,
  );

  const supporting = getSupportingHighlights(sourceMenu);
  assert.ok(
    supporting.length >= 1 && supporting.length <= 3,
    `menu.sections: mark 1–3 supporting items (excluding "${sourceMenu.featuredCutId}") with featured: true (found ${supporting.length})`,
  );
  for (const item of supporting) {
    assert.ok(
      isAvailable(item),
      `supporting highlight "${item.id}" is marked unavailable (available: false); only available items should be marked featured: true`,
    );
  }

  for (const extra of sourceMenu.extras) {
    assert.ok(extra.name.trim(), 'menu.extras: name is required');
    assert.ok(
      typeof extra.price === 'number' && Number.isFinite(extra.price) && extra.price >= 0,
      `menu.extras "${extra.name}": price must be a non-negative number`,
    );
  }
  assert.ok(sourceMenu.notes.length >= 1, 'menu.notes: include dietary and weight notes');
  for (const note of sourceMenu.notes) {
    assert.ok(note.trim(), 'menu.notes: note cannot be blank');
  }

  assert.deepEqual(
    sourceDoneness.map(entry => entry.id),
    [...DONENESS_ORDER],
    `donenessGuide: must contain all 5 doneness levels in exact order (${DONENESS_ORDER.join(', ')})`,
  );
  for (const entry of sourceDoneness) {
    assert.ok(entry.label.trim(), `donenessGuide "${entry.id}".label: required`);
    assert.ok(entry.centreDescription.trim(), `donenessGuide "${entry.id}".centreDescription: required`);
    assert.ok(entry.textureNote.trim(), `donenessGuide "${entry.id}".textureNote: required`);
  }
  assert.ok(DONENESS_NOTE.trim(), 'DONENESS_NOTE: required');
}

test('business content has actionable required fields, address, hours, FAQs and enquiry guidance', () => {
  for (const key of ['name', 'tagline', 'introduction', 'email', 'phone'] as const) {
    assert.ok(business[key].trim(), `business.${key}: required`);
  }
  assert.match(business.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'business.email: valid public email required');
  assert.ok(business.story.heading.trim(), 'business.story.heading: required');
  assert.ok(business.story.paragraphs.length >= 2, 'business.story.paragraphs: provide two story paragraphs');
  for (const paragraph of business.story.paragraphs) {
    assert.ok(paragraph.trim(), 'business.story.paragraphs: blank paragraph');
  }

  for (const key of ['street', 'locality', 'region', 'postalCode', 'country', 'note', 'mapQuery'] as const) {
    assert.ok(business.address[key].trim(), `business.address.${key}: required`);
  }
  assert.match(business.address.country, /^[A-Z]{2}$/, 'business.address.country: expected 2-letter ISO code');
  assert.equal(formatAddress(), '20 Times Square, New York, NY 10036');
  assert.equal(business.address.mapQuery, formatAddress(), 'business.address.mapQuery: must match canonical address');

  for (const url of [
    mapSearchUrl(business.address.mapQuery),
    mapDirectionsUrl(business.address.mapQuery),
    mapEmbedUrl(business.address.mapQuery),
  ]) {
    assert.match(url, /^https:\/\/www\.google\.com\/maps\//);
    assert.doesNotMatch(url, /key=/, 'Google Maps URLs must stay keyless');
  }

  assert.ok(business.directions.length >= 2, 'business.directions: include at least two direction notes');
  for (const direction of business.directions) {
    assert.ok(direction.heading.trim() && direction.text.trim(), `business.directions "${direction.heading}": required`);
  }

  assert.doesNotThrow(() => validateHours(business.openingHours));
  assert.equal(formatServiceHours({ day: 'Monday' }), 'Closed');
  assert.equal(formatServiceHours({ day: 'Tuesday', opens: '17:00', closes: '22:00' }), '17:00 – 22:00');
  assert.equal(timeZoneLabel('America/New_York'), 'Eastern Time');

  assert.ok(business.amenities.length >= 3, 'business.amenities: include at least 3 amenities');
  const amenityIds = new Set<string>();
  for (const amenity of business.amenities) {
    assert.match(amenity.id, SLUG, `business.amenities "${amenity.id}": invalid slug`);
    assert.ok(!amenityIds.has(amenity.id), `business.amenities "${amenity.id}": duplicate id`);
    amenityIds.add(amenity.id);
    assert.ok(amenity.label.trim() && amenity.description.trim(), `business.amenities "${amenity.id}": required text`);
  }

  assert.ok(business.privateDining.heading.trim(), 'business.privateDining.heading: required');
  assert.ok(business.privateDining.description.trim(), 'business.privateDining.description: required');
  assert.ok(business.privateDining.capacityNote.trim(), 'business.privateDining.capacityNote: required');
  assert.ok(business.privateDining.usefulToInclude.length >= 1, 'business.privateDining.usefulToInclude: required');

  assert.ok(business.faqs.length >= 6, 'business.faqs: include the six visitor FAQs');
  const faqIds = new Set<string>();
  for (const faq of business.faqs) {
    assert.match(faq.id, SLUG, `business.faqs "${faq.id}": invalid slug`);
    assert.ok(!faqIds.has(faq.id), `business.faqs "${faq.id}": duplicate id`);
    faqIds.add(faq.id);
    assert.ok(faq.question.trim() && faq.answer.trim(), `business.faqs "${faq.id}": question and answer required`);
  }

  for (const link of business.socialLinks) {
    assert.ok(link.label.trim(), 'business.socialLinks: label required');
    assert.match(link.url, /^https:\/\//, `business.socialLinks "${link.label}": must be https://`);
  }

  assert.ok(business.enquiries.title.trim(), 'business.enquiries.title: required');
  assert.ok(business.enquiries.introduction.trim(), 'business.enquiries.introduction: required');
  assert.ok(business.enquiries.usefulToInclude.length >= 3, 'business.enquiries.usefulToInclude: include message guidance');
  for (const tip of business.enquiries.usefulToInclude) {
    assert.ok(tip.trim(), 'business.enquiries.usefulToInclude: empty tip');
  }
});

test('menu, cuts, pairings and doneness guide satisfy all structural invariants', () => {
  validateMenuAndPairings(menu, pairings, donenessGuide);
});

test('validation rejects an unavailable hero cut and a broken pairing reference with actionable messages', () => {
  // Exercise an unavailable hero cut (flat-iron is available: false in the sample menu).
  const unavailableHeroMenu: Menu = {
    ...menu,
    featuredCutId: 'flat-iron',
  };
  assert.throws(
    () => validateMenuAndPairings(unavailableHeroMenu, pairings),
    /menu\.featuredCutId "flat-iron" is marked unavailable.*select an available replacement cut/,
  );

  // Exercise a broken pairing reference on a cut item.
  const brokenPairingMenu: Menu = {
    ...menu,
    sections: menu.sections.map(section =>
      section.id !== 'cuts'
        ? section
        : {
            ...section,
            items: section.items.map(item =>
              item.id === 'ribeye' && item.cut
                ? { ...item, cut: { ...item.cut, pairingId: 'missing-cellar-bottle' } }
                : item,
            ),
          },
    ),
  };
  assert.throws(
    () => validateMenuAndPairings(brokenPairingMenu, pairings),
    /section "cuts" -> item "ribeye"\.cut\.pairingId: "missing-cellar-bottle" does not match any pairing id/,
  );
});

test('pure menu helpers resolve hero selection, availability labels, pairings and variant prices', () => {
  // Hero selection reflects menu.featuredCutId dynamically.
  assert.equal(getFeaturedCut(menu).id, 'ribeye');
  const switchedHeroMenu: Menu = {
    ...menu,
    featuredCutId: 'porterhouse',
  };
  assert.equal(getFeaturedCut(switchedHeroMenu).id, 'porterhouse');
  assert.equal(getFeaturedCut(switchedHeroMenu).cut?.weightOz, 32);

  // Unavailable items remain in allItems and report an explicit label rather than disappearing.
  const flatIron = getAllItems(menu).find(item => item.id === 'flat-iron');
  assert.ok(flatIron, 'flat-iron remains in the menu list');
  assert.equal(isAvailable(flatIron), false);
  assert.equal(availabilityLabel(flatIron), 'Currently unavailable');
  assert.equal(availabilityLabel(getFeaturedCut(menu)), null);

  // Pairing lookup and unavailable pairing handling.
  const cabernet = getPairing('cabernet-blend', pairings);
  assert.equal(cabernet?.name, 'Cabernet blend');
  assert.equal(getPairing('non-existent', pairings), undefined);
  const unavailablePairing: Pairing = { ...pairings[0], available: false };
  assert.equal(availabilityLabel(unavailablePairing), 'Currently unavailable');

  // Resolved cut pairings include an alcohol-free suggestion.
  const resolved = getResolvedCutPairings(menu, pairings);
  assert.ok(resolved.length >= 2 && resolved.length <= 3);
  assert.ok(resolved.some(entry => entry.pairing.style === 'alcohol-free'));

  // Illustration helper maps cuts to their art and vegetable main to 'vegetable' without fake cut metadata.
  const cauliflower = allItems.find(item => item.id === 'coal-roasted-cauliflower')!;
  assert.equal(cauliflower.cut, undefined);
  assert.equal(getItemIllustrationArt(cauliflower, 'from-the-garden'), 'vegetable');
  assert.equal(getItemIllustrationArt(getFeaturedCut(menu), 'cuts'), 'ribeye');

  // Price formatting renders both single numbers and explicit variant labels/amounts.
  assert.equal(formatPrice(58), '$58');
  assert.equal(formatPrice(14.5), '$14.50');
  assert.equal(formatPrice(0), 'Included');
  assert.equal(
    formatPriceDisplay([
      { label: 'Glass', amount: 14 },
      { label: 'Bottle', amount: 52 },
    ]),
    'Glass $14 · Bottle $52',
  );
});

test('Restaurant JSON-LD derives from content and escapes closing script content without changing values', () => {
  const schema = businessStructuredData();
  assert.equal(schema['@type'], 'Restaurant');
  assert.equal(schema.name, business.name);
  assert.deepEqual(schema.servesCuisine, ['Steakhouse', 'American']);
  assert.equal(schema.priceRange, derivePriceRange(menu));
  assert.equal(schema.openingHoursSpecification.length, 6, 'Monday is closed so 6 open days are emitted');

  const value = { name: '</script><script>alert(1)</script>', text: '< & >' };
  const encoded = jsonLd(value);
  assert.ok(!encoded.includes('<'), 'JSON-LD must escape <');
  assert.deepEqual(JSON.parse(encoded), value);
});
