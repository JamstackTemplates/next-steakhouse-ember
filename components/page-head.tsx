import type { ReactNode } from 'react';

/** Ledger heading block for inner pages: double chophouse rule bar, eyebrow, condensed Oswald title and lede. */
export function PageHead({
  eyebrow,
  title,
  children,
  id,
  before,
  sheetNo = 'SHEET 02',
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  id?: string;
  /** Optional illustration or badge above the eyebrow. */
  before?: ReactNode;
  /** Ledger sheet reference shown in the top rule bar. */
  sheetNo?: string;
}) {
  return (
    <header className="wrap pt-6 pb-8 md:pt-10 md:pb-10">
      <div className="border-t-2 border-ink">
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-b border-rule py-2 text-xs">
          <span className="eyebrow">{eyebrow}</span>
          <span className="ledger-num">{sheetNo}</span>
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_24rem] lg:items-end">
        <div>
          {before}
          <h1
            id={id}
            className="text-[clamp(2.6rem,5.6vw,4.85rem)] leading-[0.94] font-bold uppercase tracking-tight text-ink"
          >
            {title}
          </h1>
        </div>
        {children ? (
          <div className="border-l-2 border-ember pl-4 text-base text-muted">{children}</div>
        ) : null}
      </div>
    </header>
  );
}
