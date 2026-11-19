import { SiteLink } from '../components/site-link';

export default function NotFound() {
  return (
    <section className="wrap py-16 md:py-24">
      <div className="inset-plate border-l-4 border-l-ember p-6 sm:p-10">
        <p className="ledger-num text-sm">LEDGER NOTICE · 404</p>
        <h1 className="mt-2 text-4xl font-bold uppercase sm:text-6xl">
          This cut isn’t on the menu.
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted">
          The page or anchor you requested could not be found in the ledger. Return to the opening sheet, inspect the full dinner menu, or send an enquiry to the dining room.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <SiteLink href="/" className="button">
            Home ledger
          </SiteLink>
          <SiteLink href="/menu/" className="button button-quiet">
            See the menu
          </SiteLink>
          <SiteLink href="/contact/" className="button button-quiet">
            Contact &amp; enquiries
          </SiteLink>
        </div>
      </div>
    </section>
  );
}
