import type { Metadata } from 'next';
import { CutSilhouette, WineGlassGlyph } from '../../components/cut-art';
import { DonenessGuide } from '../../components/doneness-guide';
import { PageHead } from '../../components/page-head';
import { SiteLink } from '../../components/site-link';
import { business } from '../../content/business';
import {
  availabilityLabel,
  DIETS,
  formatPrice,
  formatPriceDisplay,
  getAllItems,
  getItemIllustrationArt,
  getPairing,
  menu,
  pairings,
} from '../../content/menu';
import { absoluteUrl } from '../../lib/paths';

export const metadata: Metadata = {
  title: 'Menu & Cut Ledger',
  description:
    'Evening cut ledger with approximate pre-cooking weights, marbling notes, supporting courses, five-step doneness guide and cellar pairings.',
  alternates: { canonical: absoluteUrl('/menu/') },
};

export default function MenuPage() {
  const allCuts = getAllItems(menu).filter(item => Boolean(item.cut));

  return (
    <>
      <PageHead eyebrow={`${business.name} · Dinner Ledger`} title="Menu &amp; Cut Ledger" sheetNo="SHEET 02">
        <p>
          Cuts are seared over white-oak coals and listed by approximate pre-cooking weight and portion price. All courses, doneness notes and pairings are shown below.
        </p>
      </PageHead>

      {/* Sticky wrapping section-anchor index (never requires horizontal scrolling) */}
      <nav
        aria-label="Menu sections"
        className="sticky top-14 z-30 border-y-2 border-ink bg-bg/95 py-2 backdrop-blur-xs sm:top-16 sm:py-2.5"
      >
        <div className="wrap flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold tracking-wider uppercase sm:gap-x-4 sm:text-sm">
          <span className="ledger-num">Index:</span>
          {menu.sections.map((section, idx) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="py-0.5 text-ink no-underline hover:text-ember hover:underline"
            >
              0{idx + 1}. {section.title}
            </a>
          ))}
          <a href="#doneness" className="py-0.5 text-ink no-underline hover:text-ember hover:underline">
            0{menu.sections.length + 1}. Doneness
          </a>
          <a href="#pairings" className="py-0.5 text-ink no-underline hover:text-ember hover:underline">
            0{menu.sections.length + 2}. Pairings
          </a>
        </div>
      </nav>

      <div className="wrap pb-12">
        {menu.sections.map((section, sectionIndex) => {
          const isCuts = section.id === 'cuts';
          const isGarden = section.id === 'from-the-garden';

          return (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
              className="scroll-mt-48 border-b-2 border-ink py-10 sm:scroll-mt-36 md:py-14"
            >
              <div className="grid gap-6 lg:grid-cols-[9rem_1fr]">
                <div className="border-b border-rule pb-3 lg:border-r lg:border-b-0 lg:pr-6 lg:pb-0">
                  <p className="ledger-num text-sm">Course 0{sectionIndex + 1}</p>
                  <p className="mt-1 text-xs font-semibold tracking-wider text-muted uppercase">
                    {section.items.length} {section.items.length === 1 ? 'entry' : 'entries'}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-4 border-b-2 border-ink pb-4">
                    <h2 id={`${section.id}-heading`} className="text-3xl font-bold uppercase sm:text-4xl">
                      {section.title}
                    </h2>
                    <p className="max-w-xl text-sm text-muted">{section.description}</p>
                  </div>

                  {isCuts || isGarden ? (
                    /* Open Ruled Cut & Hearth Catalogue */
                    <div className="divide-y divide-rule">
                      {section.items.map(item => {
                        const unavailable = availabilityLabel(item);
                        const pairing = getPairing(item.cut?.pairingId, pairings);
                        const pairingUnavailable = pairing ? availabilityLabel(pairing) : null;
                        const art = getItemIllustrationArt(item, section.id);

                        return (
                          <article
                            key={item.id}
                            id={item.id}
                            className="scroll-mt-48 grid gap-5 py-6 transition-colors hover:bg-surface/75 sm:scroll-mt-36 md:grid-cols-[9.5rem_1fr_13.5rem] md:items-center md:px-4"
                          >
                            <div className="flex items-center gap-3 md:flex-col md:items-start">
                              <span className="ledger-num text-xs">#{item.id}</span>
                              {art ? <CutSilhouette art={art} className="h-16 w-28 shrink-0" /> : null}
                            </div>

                            <div>
                              <div className="flex flex-wrap items-baseline gap-2.5">
                                <h3 className="text-2xl font-bold uppercase text-ink sm:text-3xl">
                                  {item.name}
                                </h3>
                                {item.badge ? (
                                  <span className="ledger-tag uppercase">{item.badge}</span>
                                ) : null}
                                {unavailable ? (
                                  <span className="ledger-tag ledger-tag-unavailable">{unavailable}</span>
                                ) : null}
                              </div>

                              {item.cut ? (
                                <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold tracking-wider text-ember uppercase tabular">
                                  <div>
                                    <dt className="sr-only">Approximate pre-cooking weight</dt>
                                    <dd>{item.cut.weightOz} oz pre-cooked</dd>
                                  </div>
                                  <span aria-hidden="true" className="text-rule">·</span>
                                  <div>
                                    <dt className="sr-only">Cut style</dt>
                                    <dd>{item.cut.boneIn ? 'Bone-in' : 'Boneless'}</dd>
                                  </div>
                                  <span aria-hidden="true" className="text-rule">·</span>
                                  <div>
                                    <dt className="sr-only">Marbling</dt>
                                    <dd>{item.cut.marbling} marbling</dd>
                                  </div>
                                  <span aria-hidden="true" className="text-rule">·</span>
                                  <div>
                                    <dt className="sr-only">Portion size</dt>
                                    <dd>Serves {item.cut.serves}</dd>
                                  </div>
                                </dl>
                              ) : null}

                              <p className="mt-2.5 max-w-2xl text-sm text-muted">{item.description}</p>

                              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                                {(item.diet ?? []).map(tag => (
                                  <span key={tag} className="font-medium text-muted">
                                    {DIETS[tag].label}
                                  </span>
                                ))}

                                {pairing ? (
                                  <span className="inline-flex flex-wrap items-center gap-1.5 font-semibold text-wine">
                                    <WineGlassGlyph className="h-4 w-4" />
                                    Suggested pairing:{' '}
                                    <a href={`#${pairing.id}`} className="text-wine underline">
                                      {pairing.name}
                                    </a>
                                    <span className="text-muted tabular">
                                      ({formatPriceDisplay(pairing.price)}
                                      {pairingUnavailable ? ` · ${pairingUnavailable}` : ''})
                                    </span>
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
                                  {item.cut
                                    ? `Per portion (${item.cut.weightOz} oz)`
                                    : 'Per portion'}
                                </p>
                              </div>
                              {unavailable ? (
                                <span className="text-xs font-semibold text-muted uppercase">
                                  Not available tonight
                                </span>
                              ) : (
                                <span className="text-xs text-muted">Available on the grate</span>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    /* Supporting courses: open printed-menu rows */
                    <div className="divide-y divide-rule">
                      {section.items.map(item => {
                        const unavailable = availabilityLabel(item);
                        return (
                          <article
                            key={item.id}
                            id={item.id}
                            className="scroll-mt-48 flex flex-col justify-between gap-3 py-4 transition-colors hover:bg-surface/60 sm:scroll-mt-36 sm:flex-row sm:items-baseline sm:justify-between sm:px-3 sm:py-5"
                          >
                            <div className="max-w-2xl">
                              <div className="flex flex-wrap items-baseline gap-2.5">
                                <h3 className="text-xl font-bold uppercase text-ink">{item.name}</h3>
                                {item.badge ? (
                                  <span className="ledger-tag uppercase">{item.badge}</span>
                                ) : null}
                                {unavailable ? (
                                  <span className="ledger-tag ledger-tag-unavailable">{unavailable}</span>
                                ) : null}
                              </div>
                              <p className="mt-1 text-sm text-muted">{item.description}</p>
                              {(item.diet ?? []).length > 0 ? (
                                <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
                                  {(item.diet ?? []).map(tag => (
                                    <span key={tag}>{DIETS[tag].label}</span>
                                  ))}
                                </p>
                              ) : null}
                            </div>

                            <div className="shrink-0 sm:text-right">
                              <p className="font-display text-2xl font-bold tabular text-ink">
                                {formatPriceDisplay(item.price)}
                              </p>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}

        {/* #doneness guide */}
        <div>
          <DonenessGuide
            id="doneness"
            courseNumber={`0${menu.sections.length + 1}`}
            heading="How do you like it?"
          />
        </div>

        {/* #pairings list */}
        <section
          id="pairings"
          aria-labelledby="pairings-heading"
          className="scroll-mt-48 border-t-2 border-ink py-12 sm:scroll-mt-36 md:py-16"
        >
          <div className="grid gap-6 lg:grid-cols-[9rem_1fr]">
            <div className="border-b border-rule pb-3 lg:border-r lg:border-b-0 lg:pr-6 lg:pb-0">
              <p className="ledger-num text-sm">Course 0{menu.sections.length + 2}</p>
              <p className="mt-1 text-xs font-semibold tracking-wider text-muted uppercase">Cellar Index</p>
            </div>

            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-4 pb-6">
                <div>
                  <p className="eyebrow">By the glass, bottle &amp; carafe</p>
                  <h2 id="pairings-heading" className="mt-1 text-3xl font-bold uppercase sm:text-4xl">
                    Wine &amp; alcohol-free pairings
                  </h2>
                </div>
                <p className="max-w-xl text-sm text-muted">
                  Suggested pairings referenced across the cut ledger. All pairings are optional culinary suggestions, with explicit glass and bottle pricing.
                </p>
              </div>

              <div className="grid divide-y divide-rule border-y-2 border-ink bg-surface md:grid-cols-2 md:divide-x md:divide-y-0">
                {pairings.map(pairing => {
                  const unavailable = availabilityLabel(pairing);
                  const matchedCuts = allCuts.filter(item => item.cut?.pairingId === pairing.id);

                  return (
                    <article
                      key={pairing.id}
                      id={pairing.id}
                      className="scroll-mt-48 flex flex-col justify-between border-b border-rule p-5 sm:scroll-mt-36 sm:p-6"
                    >
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule/60 pb-2.5">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-wine uppercase">
                            <WineGlassGlyph className="h-4 w-4" />
                            {pairing.style === 'alcohol-free' ? 'Alcohol-free pairing' : `${pairing.style} wine`}
                          </span>
                          <span className="font-display text-base font-bold tabular text-ink">
                            {formatPriceDisplay(pairing.price)}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-baseline gap-2.5">
                          <h3 className="text-2xl font-bold uppercase text-ink">{pairing.name}</h3>
                          {unavailable ? (
                            <span className="ledger-tag ledger-tag-unavailable">{unavailable}</span>
                          ) : null}
                        </div>

                        <p className="mt-2 text-sm text-muted">{pairing.description}</p>
                      </div>

                      {matchedCuts.length > 0 ? (
                        <p className="mt-4 border-t border-rule/60 pt-3 text-xs text-muted">
                          <strong className="font-semibold text-ink">Suggested with:</strong>{' '}
                          {matchedCuts.map((cutItem, idx) => (
                            <span key={cutItem.id}>
                              {idx > 0 ? ', ' : ''}
                              <a href={`#${cutItem.id}`} className="text-link">
                                {cutItem.name} ({cutItem.cut?.weightOz}oz)
                              </a>
                            </span>
                          ))}
                        </p>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Table additions, dietary/cross-contact and approximate pre-cooking-weight notes + enquiry CTA */}
        <section aria-labelledby="ledger-notes-heading" className="border-t-2 border-ink pt-10">
          <div className="inset-plate grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <p className="eyebrow">Table additions</p>
              <h2 id="ledger-notes-heading" className="mt-1 text-2xl font-bold uppercase">
                Accompaniments &amp; Ledger Notes
              </h2>
              <dl className="mt-4 space-y-2 border-t border-rule pt-3 text-sm tabular">
                {menu.extras.map(extra => (
                  <div key={extra.name} className="flex justify-between gap-4 border-b border-rule/50 pb-1.5">
                    <dt className="font-medium text-ink">{extra.name}</dt>
                    <dd className="font-semibold text-ember">{formatPrice(extra.price)}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex flex-col justify-between gap-6">
              <div className="space-y-2.5 text-xs text-muted sm:text-sm">
                {menu.notes.map(note => (
                  <p key={note} className="border-l-2 border-ember pl-3">
                    {note}
                  </p>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-4">
                <p className="text-sm font-semibold text-ink">
                  Asking about a table or a private group dinner for 8–16?
                </p>
                <SiteLink href="/contact/" className="button">
                  {business.enquiries.title}
                </SiteLink>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
