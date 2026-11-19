import type { Metadata } from 'next';
import { CutSilhouette, HeroCutDiagram, WineGlassGlyph } from '../components/cut-art';
import { DonenessGuide } from '../components/doneness-guide';
import { GoogleMap } from '../components/google-map';
import { OpenBadge } from '../components/open-badge';
import { SiteLink } from '../components/site-link';
import { TimeZoneNote } from '../components/time-zone-note';
import { business, formatAddress, formatServiceHours } from '../content/business';
import {
  availabilityLabel,
  DIETS,
  formatPriceDisplay,
  getFeaturedCut,
  getItemIllustrationArt,
  getPairing,
  getResolvedCutPairings,
  getSupportingHighlights,
  menu,
  pairings,
} from '../content/menu';
import { mapDirectionsUrl, mapSearchUrl } from '../lib/maps';
import { absoluteUrl } from '../lib/paths';
import { businessStructuredData, jsonLd } from '../lib/structured-data';

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/') },
};

export default function HomePage() {
  const featuredCut = getFeaturedCut(menu);
  const featuredCutUnavailable = availabilityLabel(featuredCut);
  const heroPairing = getPairing(featuredCut.cut?.pairingId, pairings);
  const heroPairingUnavailable = heroPairing ? availabilityLabel(heroPairing) : null;
  const highlights = getSupportingHighlights(menu);
  const resolvedPairings = getResolvedCutPairings(menu, pairings);
  const cleanPhone = business.phone.replace(/[^\d+]/g, '');

  return (
    <div className="wrap py-4 md:py-6">
      {/* 1. OPENING LEDGER (HERO) — Broadsheet Masthead + Oversized Horizontal Featured-Cut Entry */}
      <section aria-labelledby="hero-heading" className="hero-reveal">
        {/* Top double chophouse rule & running ledger dateline */}
        <div className="border-t-2 border-ink">
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-b border-rule py-2 text-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="ledger-num">NO. 01 · EVENING CUT SHEET</span>
              <span aria-hidden="true" className="text-rule">◆</span>
              <span className="font-semibold tracking-widest text-muted uppercase">
                WHITE-OAK HEARTH · BUTCHERED BY WEIGHT · CELLAR POUR
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 font-semibold text-ink">
              <span className="inline-block h-2 w-2 rotate-45 bg-ember" aria-hidden="true" />
              <OpenBadge hours={business.openingHours} />
            </div>
          </div>
        </div>

        {/* Full-width Ledger Heading (Masthead) */}
        <div className="grid gap-5 py-5 sm:py-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow">{business.name} · Evening Chophouse · New York</p>
            <h1
              id="hero-heading"
              className="mt-1.5 text-[clamp(2.75rem,5.8vw,5.1rem)] leading-[0.92] font-bold uppercase tracking-tight text-ink"
            >
              {business.tagline.includes('Coals.') ? (
                <>
                  Cuts. <span className="text-ember">Coals.</span> A slower evening.
                </>
              ) : (
                business.tagline
              )}
            </h1>
          </div>

          <div className="flex flex-col justify-between gap-3.5 border-t border-rule pt-4 lg:border-t-0 lg:border-l lg:border-rule lg:pt-0 lg:pl-7">
            <p className="text-sm text-muted sm:text-base">{business.introduction}</p>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rule/60 pt-3">
              <div className="text-xs">
                <p className="font-semibold text-ink">{formatAddress()} (sample landmark)</p>
                <p className="text-muted">Enquiries are confirmed only by reply.</p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <SiteLink href="/menu/" className="button">
                  See the menu
                </SiteLink>
                <SiteLink href="/contact/" className="button button-quiet">
                  Enquire about a table
                </SiteLink>
              </div>
            </div>
          </div>
        </div>

        {/* Oversized Horizontal Featured-Cut Entry: Name & short headline above weight, price & pairing; SVG integrated between vertical rules */}
        <div className="inset-plate p-4 sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[22rem_1fr] lg:items-stretch">
            {/* Left Ledger Column: Name & short headline above Weight, Price & Pairing (appears BEFORE SVG on narrow screens) */}
            <div className="flex flex-col justify-between border-b border-rule pb-5 lg:border-r lg:border-b-0 lg:pr-6 lg:pb-0">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="ledger-num text-xs">FEATURED CUT · #{featuredCut.id}</span>
                  {featuredCutUnavailable ? (
                    <span className="ledger-tag ledger-tag-unavailable">{featuredCutUnavailable}</span>
                  ) : (
                    <span className="ledger-tag">Prime Hearth Cut</span>
                  )}
                </div>

                <h2 className="mt-2 text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                  <SiteLink href={`/menu/#${featuredCut.id}`} className="no-underline hover:text-ember">
                    {featuredCut.name}
                  </SiteLink>
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
                  {featuredCut.description}
                </p>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-y-3 border-t border-rule pt-4">
                <div className="pr-3">
                  <dt className="text-[0.68rem] font-semibold tracking-widest text-muted uppercase">
                    Pre-cooked weight
                  </dt>
                  <dd className="mt-0.5 font-display text-3xl font-bold tabular text-ink">
                    {featuredCut.cut ? `${featuredCut.cut.weightOz} oz` : 'Portion'}
                  </dd>
                  <dd className="text-xs text-muted">Approx. pre-cooking</dd>
                </div>

                <div className="border-l border-rule pl-3">
                  <dt className="text-[0.68rem] font-semibold tracking-widest text-muted uppercase">
                    Portion price
                  </dt>
                  <dd className="mt-0.5 font-display text-3xl font-bold tabular text-ember">
                    {formatPriceDisplay(featuredCut.price)}
                  </dd>
                  <dd className="text-xs text-muted">
                    Per portion · serves {featuredCut.cut?.serves ?? 1}
                  </dd>
                </div>

                <div className="border-t border-rule pt-3 pr-3">
                  <dt className="text-[0.68rem] font-semibold tracking-widest text-muted uppercase">
                    Cut character
                  </dt>
                  <dd className="mt-0.5 font-display text-base font-bold uppercase text-ink sm:text-lg">
                    {featuredCut.cut ? `${featuredCut.cut.marbling} marbling` : 'House cut'}
                  </dd>
                  <dd className="text-xs text-muted">
                    {featuredCut.cut?.boneIn ? 'Bone-in · oak sear' : 'Boneless · oak sear'}
                  </dd>
                </div>

                <div className="border-t border-l border-rule pt-3 pl-3">
                  <dt className="text-[0.68rem] font-semibold tracking-widest text-muted uppercase">
                    Cellar pairing
                  </dt>
                  {heroPairing ? (
                    <>
                      <dd className="mt-0.5 font-display text-base font-bold uppercase text-wine sm:text-lg">
                        <SiteLink href={`/menu/#${heroPairing.id}`} className="no-underline hover:underline">
                          {heroPairing.name}
                        </SiteLink>
                      </dd>
                      <dd className="text-xs text-muted tabular">
                        {heroPairingUnavailable
                          ? `${heroPairingUnavailable} · ${formatPriceDisplay(heroPairing.price)}`
                          : formatPriceDisplay(heroPairing.price)}
                      </dd>
                    </>
                  ) : (
                    <dd className="mt-0.5 text-sm text-muted">See cellar pairings</dd>
                  )}
                </div>
              </dl>
            </div>

            {/* Right Ledger Column: Cast-Iron Firebox & Ribeye Cut Silhouette integrated between vertical rules */}
            <div className="flex items-center lg:border-r lg:border-rule lg:pr-4">
              <HeroCutDiagram item={featuredCut} pairing={heroPairing} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. FIND US (#find-us) DIRECTLY UNDER HERO */}
      <section
        id="find-us"
        aria-labelledby="find-us-heading"
        className="mt-12 scroll-mt-24 border-t-2 border-ink pt-10 md:mt-16 md:pt-12"
      >
        <div className="grid gap-6 lg:grid-cols-[9rem_1fr]">
          <div className="border-b border-rule pb-3 lg:border-r lg:border-b-0 lg:pr-6 lg:pb-0">
            <p className="ledger-num text-sm">Course 02</p>
            <p className="mt-1 text-xs font-semibold tracking-wider text-muted uppercase">Find Us</p>
          </div>

          {/* Square ruled spread; mobile order is address -> actions -> hours -> map */}
          <div className="grid divide-y divide-rule border-y border-rule bg-surface lg:grid-cols-[1.2fr_15.5rem_1.2fr] lg:divide-x lg:divide-y-0">
            {/* Column 1: Address, corner note, directions & actions */}
            <div className="p-5 sm:p-6">
              <p className="eyebrow">Location &amp; Directions</p>
              <h2 id="find-us-heading" className="mt-1 text-3xl font-bold uppercase">
                {business.address.street}
              </h2>
              <p className="mt-1 text-base font-semibold text-ink">
                {business.address.locality}, {business.address.region} {business.address.postalCode}
              </p>
              <p className="mt-2 border-l-2 border-ember pl-3 text-xs text-muted">
                {business.address.note}
              </p>

              <dl className="mt-5 space-y-3 border-t border-rule pt-4 text-sm">
                {business.directions.map(note => (
                  <div key={note.heading}>
                    <dt className="font-semibold text-ink">{note.heading}</dt>
                    <dd className="mt-0.5 text-xs text-muted">{note.text}</dd>
                  </div>
                ))}
              </dl>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-2.5 border-t border-rule pt-4">
                <a className="button text-xs" href={mapDirectionsUrl(business.address.mapQuery)}>
                  Get directions
                </a>
                <a className="button button-quiet text-xs" href={mapSearchUrl(business.address.mapQuery)}>
                  Open in Google Maps
                </a>
                {business.phone ? (
                  <a className="button button-quiet tabular text-xs" href={`tel:${cleanPhone}`}>
                    Call {business.phone}
                  </a>
                ) : null}
              </div>
            </div>

            {/* Column 2: Narrow seven-day hours column */}
            <div className="p-5 sm:p-6">
              <p className="eyebrow">Seven-day hours</p>
              <h3 className="mt-1 text-xl font-bold uppercase">Evening Service</h3>
              <dl className="mt-4 space-y-2 text-sm tabular">
                {business.openingHours.map(entry => (
                  <div
                    key={entry.day}
                    className="flex items-baseline justify-between gap-2 border-b border-rule/50 pb-1.5"
                  >
                    <dt className="font-semibold text-ink">{entry.day}</dt>
                    <dd className={entry.opens ? 'text-ink' : 'text-muted'}>
                      {formatServiceHours(entry)}
                    </dd>
                  </div>
                ))}
              </dl>
              <TimeZoneNote className="text-xs text-muted" />
              {business.notice ? (
                <p className="mt-4 border-t border-rule pt-3 text-xs text-muted">{business.notice}</p>
              ) : null}
            </div>

            {/* Column 3: Lazy Map */}
            <div className="bg-surface-raised p-2">
              <GoogleMap
                address={business.address.mapQuery}
                title={`Map showing sample landmark at ${formatAddress()}`}
                className="h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE CUT LEDGER (THREE SUPPORTING HIGHLIGHTS — OPEN RULED CATALOGUE ROWS) */}
      <section aria-labelledby="cut-ledger-heading" className="mt-12 border-t-2 border-ink pt-12 md:mt-16 md:pt-16">
        <div className="grid gap-6 lg:grid-cols-[9rem_1fr]">
          <div className="border-b border-rule pb-3 lg:border-r lg:border-b-0 lg:pr-6 lg:pb-0">
            <p className="ledger-num text-sm">Course 03</p>
            <p className="mt-1 text-xs font-semibold tracking-wider text-muted uppercase">The Cut Ledger</p>
          </div>

          <div>
            <div className="flex flex-wrap items-end justify-between gap-4 pb-6">
              <div>
                <p className="eyebrow">Supporting ledger entries</p>
                <h2 id="cut-ledger-heading" className="mt-1 text-3xl font-bold uppercase sm:text-4xl">
                  From the grate &amp; hearth
                </h2>
              </div>
              <SiteLink href="/menu/#cuts" className="text-link text-sm uppercase tracking-wider">
                Inspect all cuts &amp; courses →
              </SiteLink>
            </div>

            <div className="divide-y divide-rule border-y-2 border-ink">
              {highlights.map((item, idx) => {
                const itemUnavailable = availabilityLabel(item);
                const pairing = getPairing(item.cut?.pairingId, pairings);
                const art = getItemIllustrationArt(item);

                return (
                  <article
                    key={item.id}
                    className="grid gap-5 py-6 transition-colors hover:bg-surface/70 md:grid-cols-[9.5rem_1fr_13rem] md:items-center md:px-4"
                  >
                    <div className="flex items-center gap-3 md:flex-col md:items-start">
                      <span className="ledger-num text-xs">ENTRY 0{idx + 2}</span>
                      {art ? <CutSilhouette art={art} className="h-16 w-28 shrink-0" /> : null}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-baseline gap-3">
                        <h3 className="text-2xl font-bold uppercase sm:text-3xl">
                          <SiteLink href={`/menu/#${item.id}`} className="no-underline hover:text-ember">
                            {item.name}
                          </SiteLink>
                        </h3>
                        {item.cut ? (
                          <span className="ledger-tag tabular">
                            {item.cut.weightOz} oz · {item.cut.boneIn ? 'bone-in' : 'boneless'} · {item.cut.marbling} marbling
                          </span>
                        ) : (
                          <span className="ledger-tag">Hearth vegetable main</span>
                        )}
                        {itemUnavailable ? (
                          <span className="ledger-tag ledger-tag-unavailable">{itemUnavailable}</span>
                        ) : null}
                      </div>

                      <p className="mt-2 max-w-2xl text-sm text-muted">{item.description}</p>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                        {(item.diet ?? []).map(tag => (
                          <span key={tag} className="text-muted">
                            {DIETS[tag].label}
                          </span>
                        ))}
                        {pairing ? (
                          <span className="inline-flex items-center gap-1.5 font-semibold text-wine">
                            <WineGlassGlyph className="h-4 w-4" />
                            Suggested pairing:{' '}
                            <SiteLink href={`/menu/#${pairing.id}`} className="text-wine underline">
                              {pairing.name}
                            </SiteLink>
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between gap-4 border-t border-rule pt-3 md:flex-col md:items-end md:border-t-0 md:border-l md:pt-0 md:pl-5">
                      <div className="md:text-right">
                        <p className="font-display text-3xl font-bold tabular text-ember">
                          {formatPriceDisplay(item.price)}
                        </p>
                        <p className="text-xs text-muted">
                          {item.cut ? `Portion · serves ${item.cut.serves}` : 'Per portion'}
                        </p>
                      </div>
                      <SiteLink href={`/menu/#${item.id}`} className="text-link text-xs uppercase tracking-wider">
                        View on menu →
                      </SiteLink>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW DO YOU LIKE IT? (FIVE-STEP DONENESS GUIDE) */}
      <div className="mt-12 md:mt-16">
        <DonenessGuide courseNumber="04" />
      </div>

      {/* 5. FROM CUT TO GLASS (PAIRING ANNOTATIONS — OPEN CELLAR COLUMNS) */}
      <section aria-labelledby="pairings-heading" className="border-t-2 border-ink py-12 md:py-16">
        <div className="grid gap-6 lg:grid-cols-[9rem_1fr]">
          <div className="border-b border-rule pb-3 lg:border-r lg:border-b-0 lg:pr-6 lg:pb-0">
            <p className="ledger-num text-sm">Course 05</p>
            <p className="mt-1 text-xs font-semibold tracking-wider text-muted uppercase">Cellar Index</p>
          </div>

          <div>
            <div className="flex flex-wrap items-end justify-between gap-4 pb-4">
              <div>
                <p className="eyebrow">Cellar &amp; Temperance Notes</p>
                <h2 id="pairings-heading" className="mt-1 text-3xl font-bold uppercase sm:text-4xl">
                  From cut to glass
                </h2>
              </div>
              <SiteLink href="/menu/#pairings" className="text-link text-sm uppercase tracking-wider">
                Full pairing list on the menu →
              </SiteLink>
            </div>

            <p className="max-w-2xl text-sm text-muted">
              Each cut in the ledger carries a suggested glass or bottle, alongside an alcohol-free blackcurrant spritz infused for the grill. All pairings are optional taste suggestions.
            </p>

            <div className="mt-6 grid divide-y divide-rule border-y-2 border-ink bg-surface md:grid-cols-3 md:divide-x md:divide-y-0">
              {resolvedPairings.map(({ pairing, cuts }) => {
                const unavailable = availabilityLabel(pairing);
                return (
                  <article
                    key={pairing.id}
                    className="flex flex-col justify-between p-5 sm:p-6"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 border-b border-rule/60 pb-2.5">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-wine uppercase">
                          <WineGlassGlyph className="h-4 w-4" />
                          {pairing.style === 'alcohol-free' ? 'Alcohol-free' : `${pairing.style} wine`}
                        </span>
                        <span className="font-display text-sm font-bold tabular text-ink">
                          {formatPriceDisplay(pairing.price)}
                        </span>
                      </div>

                      <h3 className="mt-3 text-2xl font-bold uppercase">
                        <SiteLink href={`/menu/#${pairing.id}`} className="no-underline hover:text-ember">
                          {pairing.name}
                        </SiteLink>
                      </h3>
                      {unavailable ? (
                        <p className="mt-1">
                          <span className="ledger-tag ledger-tag-unavailable">{unavailable}</span>
                        </p>
                      ) : null}
                      <p className="mt-2 text-sm text-muted">{pairing.description}</p>
                    </div>

                    <p className="mt-4 border-t border-rule/60 pt-3 text-xs text-muted">
                      <strong className="font-semibold text-ink">Paired in the ledger with:</strong>{' '}
                      {cuts.map((cutItem, i) => (
                        <span key={cutItem.id}>
                          {i > 0 ? ', ' : ''}
                          <SiteLink href={`/menu/#${cutItem.id}`} className="text-link">
                            {cutItem.name} ({cutItem.cut?.weightOz}oz)
                          </SiteLink>
                        </span>
                      ))}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 6. A SLOWER EVENING (STORY & PRIVATE-DINING ENQUIRY INSET) */}
      <section aria-labelledby="story-heading" className="border-t-2 border-ink py-12 md:py-16">
        <div className="grid gap-6 lg:grid-cols-[9rem_1fr]">
          <div className="border-b border-rule pb-3 lg:border-r lg:border-b-0 lg:pr-6 lg:pb-0">
            <p className="ledger-num text-sm">Course 06</p>
            <p className="mt-1 text-xs font-semibold tracking-wider text-muted uppercase">The Room</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-start">
            <div>
              <p className="eyebrow">A slower evening</p>
              <h2 id="story-heading" className="mt-1 text-3xl font-bold uppercase sm:text-4xl">
                {business.story.heading}
              </h2>
              <div className="mt-4 space-y-4 text-base text-muted">
                {business.story.paragraphs.map(paragraph => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <dl className="mt-8 grid gap-5 border-t border-rule pt-6 sm:grid-cols-3">
                {business.amenities.map(amenity => (
                  <div key={amenity.id} className="border-l-2 border-rule pl-3.5">
                    <dt className="font-display text-sm font-bold uppercase text-ink">{amenity.label}</dt>
                    <dd className="mt-1 text-xs text-muted">{amenity.description}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <aside
              aria-labelledby="private-dining-heading"
              className="inset-plate border-l-4 border-l-ember p-6 sm:p-7"
            >
              <div>
                <p className="eyebrow">Back Ledger Table</p>
                <h3 id="private-dining-heading" className="mt-1 text-2xl font-bold uppercase">
                  {business.privateDining.heading}
                </h3>
                <p className="mt-3 text-sm text-ink">{business.privateDining.description}</p>
                <p className="mt-3 border-l-2 border-rule pl-3 text-xs font-semibold text-muted">
                  {business.privateDining.capacityNote}
                </p>

                <p className="mt-4 text-xs font-bold tracking-wider text-ink uppercase">
                  Useful to include in your enquiry:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted">
                  {business.privateDining.usefulToInclude.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 border-t border-rule pt-4">
                <SiteLink href="/contact/" className="button w-full">
                  Enquire about a group table
                </SiteLink>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 7. BEFORE YOUR VISIT (SIX NATIVE DETAILS FAQS) */}
      <section aria-labelledby="faq-heading" className="border-t-2 border-ink pt-12 md:pt-16">
        <div className="grid gap-6 lg:grid-cols-[9rem_1fr]">
          <div className="border-b border-rule pb-3 lg:border-r lg:border-b-0 lg:pr-6 lg:pb-0">
            <p className="ledger-num text-sm">Course 07</p>
            <p className="mt-1 text-xs font-semibold tracking-wider text-muted uppercase">House Notes</p>
          </div>

          <div>
            <div className="flex flex-wrap items-end justify-between gap-4 pb-6">
              <div>
                <p className="eyebrow">Practical answers</p>
                <h2 id="faq-heading" className="mt-1 text-3xl font-bold uppercase sm:text-4xl">
                  Before your visit
                </h2>
              </div>
              <p className="text-sm text-muted">
                Questions about tables, portion weights, dietary notes and private dining.
              </p>
            </div>

            <div className="divide-y divide-rule border-y-2 border-ink">
              {business.faqs.map(faq => (
                <details key={faq.id} id={faq.id} className="faq-item group py-4">
                  <summary className="flex items-center gap-3 font-display text-lg font-bold tracking-wide text-ink uppercase hover:text-ember">
                    <span>{faq.question}</span>
                  </summary>
                  <p className="mt-2.5 max-w-3xl pl-9 text-sm text-muted">{faq.answer}</p>
                </details>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-l-4 border-ember bg-surface px-6 py-5">
              <div>
                <p className="font-display text-xl font-bold uppercase text-ink">
                  Planning an evening or group dinner?
                </p>
                <p className="text-sm text-muted">
                  Send us your preferred date, time and party size. Arrangements are confirmed only when we reply.
                </p>
              </div>
              <SiteLink href="/contact/" className="button">
                {business.enquiries.title}
              </SiteLink>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(businessStructuredData()) }}
      />
    </div>
  );
}
