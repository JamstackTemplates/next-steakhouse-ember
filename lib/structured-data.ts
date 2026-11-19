import { business } from '../content/business.ts';
import { formatPrice, getAllItems, menu, type Menu } from '../content/menu.ts';
import { absoluteUrl } from './paths.ts';

/** Derive an honest schema.org priceRange string directly from the menu's listed food prices. */
export function derivePriceRange(sourceMenu: Menu = menu): string {
  const amounts = getAllItems(sourceMenu)
    .flatMap(item => (typeof item.price === 'number' ? [item.price] : item.price.map(size => size.amount)))
    .filter(amount => Number.isFinite(amount) && amount > 0);
  if (amounts.length === 0) return '$$$';
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);
  return min === max
    ? formatPrice(min, sourceMenu)
    : `${formatPrice(min, sourceMenu)}–${formatPrice(max, sourceMenu)}`;
}

/**
 * schema.org Restaurant structured data built from `content/business.ts` and `content/menu.ts`.
 * Includes no ratings, reviews, awards, booking actions or fabricated geocoordinates.
 */
export function businessStructuredData() {
  const url = absoluteUrl('/');
  const menuUrl = absoluteUrl('/menu/');
  const sameAs = business.socialLinks.filter(link => link.url.trim()).map(link => link.url.trim());

  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: business.name,
    description: business.introduction,
    email: business.email,
    ...(business.phone ? { telephone: business.phone } : {}),
    ...(url ? { url } : {}),
    ...(menuUrl ? { hasMenu: menuUrl } : {}),
    servesCuisine: ['Steakhouse', 'American'],
    priceRange: derivePriceRange(menu),
    currenciesAccepted: menu.currency,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    openingHoursSpecification: business.openingHours
      .filter(entry => Boolean(entry.opens && entry.closes))
      .map(entry => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${entry.day}`,
        opens: entry.opens,
        closes: entry.closes,
      })),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/** Prevent content containing a closing script tag from escaping JSON-LD. */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
