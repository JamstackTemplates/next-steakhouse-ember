import { business, formatAddress, formatServiceHours } from '../content/business';
import { mapDirectionsUrl } from '../lib/maps';
import { CoalNotchMark } from './cut-art';
import { SiteLink } from './site-link';
import { TimeZoneNote } from './time-zone-note';

export function SiteFooter() {
  return (
    <footer className="wrap mt-20 pb-12 text-sm text-muted">
      {/* Thin closing ledger rules on the page background, not a contrasting full-width footer band */}
      <div className="border-t-2 border-rule pt-1">
        <div className="border-t border-rule pt-10">
          <div className="grid gap-10 md:grid-cols-2">
            {/* Left column: Business & Contact */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <CoalNotchMark className="h-5 w-5 shrink-0" />
                <p className="font-display text-lg font-bold tracking-wider text-ink uppercase">
                  {business.name}
                </p>
              </div>
              <p className="max-w-md text-muted">{business.tagline} {business.introduction}</p>
              <p className="pt-1 text-ink">
                <a className="text-link" href={`mailto:${business.email}`}>
                  {business.email}
                </a>
                {business.phone ? (
                  <>
                    {' · '}
                    <a className="text-link tabular" href={`tel:${business.phone.replace(/[^\d+]/g, '')}`}>
                      {business.phone}
                    </a>
                  </>
                ) : null}
              </p>
              <p className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
                <SiteLink href="/menu/" className="text-link">
                  Cut ledger &amp; menu
                </SiteLink>
                <SiteLink href="/#find-us" className="text-link">
                  Find us
                </SiteLink>
                <SiteLink href="/contact/" className="text-link">
                  Reservation &amp; private dining enquiries
                </SiteLink>
              </p>
            </div>

            {/* Right column: Hours & Directions */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="eyebrow">Sample location</p>
                <p className="mt-2 font-semibold text-ink">{formatAddress()}</p>
                <p className="mt-1 text-xs text-muted">{business.address.note}</p>
                <p className="mt-3">
                  <a
                    className="text-link text-xs uppercase tracking-wider"
                    href={mapDirectionsUrl(business.address.mapQuery)}
                  >
                    Get directions →
                  </a>
                </p>
              </div>

              <div>
                <p className="eyebrow">Weekly service hours</p>
                <dl className="mt-2 space-y-1 text-xs tabular">
                  {business.openingHours.map(entry => (
                    <div key={entry.day} className="flex justify-between gap-3 border-b border-rule/40 pb-0.5">
                      <dt className="font-semibold text-ink">{entry.day.slice(0, 3)}</dt>
                      <dd className="text-muted">{formatServiceHours(entry)}</dd>
                    </div>
                  ))}
                </dl>
                <TimeZoneNote className="text-xs text-muted" />
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-6 text-xs text-muted">
            <p>
              {business.name} · Sample steakhouse template (all business and menu details are fictitious).
            </p>
            <span title="Made with love by jamstacks.net">
              with <span role="img" aria-label="love">❤️</span>{' '}
              <a className="no-underline hover:text-ember hover:underline" href="https://jamstacks.net">
                jamstacks.net
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
