import { DONENESS_NOTE, donenessGuide } from '../content/menu';
import { DonenessSwatch } from './cut-art';

export function DonenessGuide({
  id,
  courseNumber = '04',
  heading = 'How do you like it?',
  intro = 'A five-step culinary preference guide to how cuts come off our white-oak grate.',
}: {
  id?: string;
  courseNumber?: string;
  heading?: string;
  intro?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-heading` : 'doneness-heading'}
      className="scroll-mt-48 border-t-2 border-ink py-12 sm:scroll-mt-36 md:py-16"
    >
      <div className="grid gap-6 lg:grid-cols-[9rem_1fr]">
        <div className="border-b border-rule pb-3 lg:border-r lg:border-b-0 lg:pr-6 lg:pb-0">
          <p className="ledger-num text-sm">Course {courseNumber}</p>
          <p className="mt-1 text-xs font-semibold tracking-wider text-muted uppercase">Grate Temp &amp; Sear</p>
        </div>

        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-4 pb-6">
            <div>
              <p className="eyebrow">Doneness preference spectrum</p>
              <h2 id={id ? `${id}-heading` : 'doneness-heading'} className="mt-1 text-3xl font-bold uppercase sm:text-4xl">
                {heading}
              </h2>
            </div>
            <p className="max-w-xl text-sm text-muted">{intro}</p>
          </div>

          {/* Continuous 5-step horizontal grate spectrum divided by vertical grill rules */}
          <ol className="grid list-none divide-y divide-rule border-y-2 border-ink bg-surface p-0 md:grid-cols-5 md:divide-x md:divide-y-0">
            {donenessGuide.map((step, index) => (
              <li
                key={step.id}
                className="flex flex-col justify-between p-5 transition-colors hover:bg-surface-raised/60"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-rule/60 pb-2">
                    <span className="ledger-num text-xs">0{index + 1}</span>
                    <span className="text-[0.7rem] font-semibold tracking-widest text-muted uppercase">
                      {step.id}
                    </span>
                  </div>
                  <h3 className="mt-3 text-2xl font-bold uppercase tracking-wide">{step.label}</h3>
                  <div className="my-3.5">
                    <DonenessSwatch level={step.id} />
                  </div>
                  <p className="text-sm font-semibold text-ink">{step.centreDescription}</p>
                </div>
                <p className="mt-3 border-t border-rule/50 pt-3 text-xs text-muted">{step.textureNote}</p>
              </li>
            ))}
          </ol>

          <p className="mt-5 border-l-2 border-ember pl-4 text-sm text-muted">
            <strong className="font-semibold text-ink">Ordering note:</strong> {DONENESS_NOTE}
          </p>
        </div>
      </div>
    </section>
  );
}
