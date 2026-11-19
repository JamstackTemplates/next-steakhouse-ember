import type { Metadata } from 'next';
import { CopyEmail } from '../../components/copy-email';
import { JamstacksSupportForm } from '../../components/jamstacks-support-form';
import { PageHead } from '../../components/page-head';
import { SiteLink } from '../../components/site-link';
import { TimeZoneNote } from '../../components/time-zone-note';
import { business, formatAddress, formatServiceHours } from '../../content/business';
import { absoluteUrl } from '../../lib/paths';
import { site } from '../../lib/site';

export const metadata: Metadata = {
  title: business.enquiries.title,
  description: business.enquiries.introduction,
  alternates: { canonical: absoluteUrl('/contact/') },
};

export default function ContactPage() {
  const hosted = Boolean(site.jamstacksSite && site.jamstacksEmbedUrl);
  const cleanPhone = business.phone.replace(/[^\d+]/g, '');

  return (
    <>
      <PageHead
        eyebrow={`${business.name} · Enquiries`}
        title={business.enquiries.title}
        sheetNo="SHEET 03"
      >
        <p>{business.enquiries.introduction}</p>
      </PageHead>

      <div className="wrap pb-16">
        <div className="inset-plate grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr]">
          <section aria-label="Enquiry form" className="space-y-6">
            <div className="border-b border-rule pb-4">
              <p className="eyebrow">Message the dining room</p>
              <h2 className="mt-1 text-2xl font-bold uppercase">Send an enquiry</h2>
              <p className="mt-2 text-sm text-muted">
                The form accepts your name, email address and message. Please include your preferred evening, party size and any dietary or seating notes in your message.
              </p>
            </div>

            {hosted ? (
              <JamstacksSupportForm
                siteId={site.jamstacksSite}
                embedUrl={site.jamstacksEmbedUrl}
                email={business.email}
              />
            ) : (
              <div className="border-l-4 border-ember bg-surface-raised p-6">
                <p className="ledger-num text-xs">Direct Email Enquiry</p>
                <h3 className="mt-2 text-xl font-bold uppercase">Write to us by email</h3>
                <p className="mt-3 text-base text-ink">
                  Email{' '}
                  <a className="text-link wrap-anywhere" href={`mailto:${business.email}`}>
                    {business.email}
                  </a>{' '}
                  with your enquiry. Arrangements are confirmed only by reply.
                </p>
              </div>
            )}

            <div className="border-t border-rule pt-5">
              <h3 className="text-lg font-bold uppercase">Useful to include in your message</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
                {business.enquiries.usefulToInclude.map(tip => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          </section>

          <aside
            aria-label="Contact details"
            className="grid content-start gap-6 border-t border-rule pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8"
          >
            <div>
              <p className="eyebrow">Direct contact</p>
              <h2 className="mt-1 text-2xl font-bold uppercase">Email &amp; Telephone</h2>
              <p className="mt-3 text-base font-semibold text-ink">
                <a className="text-link wrap-anywhere" href={`mailto:${business.email}`}>
                  {business.email}
                </a>
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <CopyEmail email={business.email} />
              </div>
              {business.phone ? (
                <p className="mt-4 text-base font-semibold text-ink">
                  Telephone:{' '}
                  <a className="text-link tabular" href={`tel:${cleanPhone}`}>
                    {business.phone}
                  </a>
                </p>
              ) : null}
            </div>

            <div className="border-t border-rule pt-5">
              <p className="eyebrow">Back Ledger Table (8–16 guests)</p>
              <h2 className="mt-1 text-xl font-bold uppercase">{business.privateDining.heading}</h2>
              <p className="mt-2 text-sm text-muted">{business.privateDining.capacityNote}</p>
            </div>

            <div className="border-t border-rule pt-5">
              <p className="eyebrow">Location &amp; Service Hours</p>
              <h2 className="mt-1 text-xl font-bold uppercase">{formatAddress()}</h2>
              <p className="mt-1 text-xs text-muted">{business.address.note}</p>

              <dl className="mt-4 space-y-1.5 text-xs tabular">
                {business.openingHours.map(entry => (
                  <div key={entry.day} className="flex justify-between gap-3 border-b border-rule/40 pb-1">
                    <dt className="font-semibold text-ink">{entry.day}</dt>
                    <dd className="text-muted">{formatServiceHours(entry)}</dd>
                  </div>
                ))}
              </dl>
              <TimeZoneNote className="text-xs text-muted" />

              <div className="mt-5 flex flex-wrap gap-3">
                <SiteLink href="/#find-us" className="button button-quiet text-xs">
                  Hours, map &amp; directions
                </SiteLink>
                <SiteLink href="/menu/" className="button button-quiet text-xs">
                  Inspect the menu
                </SiteLink>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
