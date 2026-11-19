import { DarkModeToggle } from 'jamstacks';
import { business } from '../content/business';
import { CoalNotchMark } from './cut-art';
import { SiteLink } from './site-link';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-bg/95 backdrop-blur-xs">
      <div className="wrap flex min-h-14 items-center justify-between gap-2 py-1.5 sm:min-h-16 sm:gap-4 sm:py-2">
        <SiteLink
          href="/"
          className="group flex shrink-0 items-center gap-2 text-ink no-underline"
        >
          <CoalNotchMark className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
          <span className="flex flex-col leading-[1.02] sm:flex-row sm:items-baseline sm:gap-2">
            <span className="max-w-[5.2rem] font-display text-[0.95rem] font-bold tracking-wider uppercase sm:max-w-none sm:text-xl">
              {business.name}
            </span>
            <span className="hidden text-xs font-semibold tracking-widest text-muted uppercase md:inline">
              Evening Chophouse
            </span>
          </span>
        </SiteLink>

        <nav
          aria-label="Main"
          className="flex shrink-0 items-center gap-2 text-[0.8125rem] font-semibold whitespace-nowrap sm:gap-4 sm:text-base"
        >
          <SiteLink href="/menu/" markCurrent="page" className="py-1 no-underline hover:text-ember">
            Menu
          </SiteLink>
          <span aria-hidden="true" className="text-rule">·</span>
          <SiteLink href="/#find-us" className="py-1 no-underline hover:text-ember">
            Find us
          </SiteLink>
          <span aria-hidden="true" className="text-rule">·</span>
          <SiteLink href="/contact/" markCurrent="page" className="py-1 no-underline hover:text-ember">
            Contact
          </SiteLink>
          <DarkModeToggle />
        </nav>
      </div>
    </header>
  );
}
