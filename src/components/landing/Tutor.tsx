import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { SectionTitle } from '../ui';

export function Tutor() {
  const t = useTranslations('tutor');
  const ladder = t.raw('ladder') as string[];

  return (
    <section id="tutor" className="scroll-mt-20 bg-ink py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <SectionTitle dark eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
          <ol className="mt-10 flex items-start">
            {ladder.map((step, i) => (
              <li key={step} className="relative flex flex-1 flex-col items-center gap-3 text-center">
                {i > 0 ? <span className="absolute right-1/2 top-4 h-0.5 w-full bg-ink-2" /> : null}
                <span
                  className={clsx(
                    'relative grid size-8 place-items-center rounded-full font-display text-xs font-bold',
                    i === ladder.length - 1 ? 'bg-lime text-ink' : 'bg-ink-2 text-white ring-1 ring-white/15',
                  )}
                >
                  {i + 1}
                </span>
                <span className="text-xs font-semibold text-white/85 sm:text-sm">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-[32px] bg-canvas p-5 sm:p-6">
          <div className="rounded-3xl bg-surface p-5 ring-1 ring-line">
            <p className="text-xs font-bold uppercase tracking-widest text-brand">AI</p>
            <p className="mt-2 font-display text-[15px] font-medium leading-relaxed">{t('chatTask')}</p>
          </div>
          <div className="mt-4 flex justify-end">
            <p className="max-w-[80%] rounded-2xl rounded-br-md bg-brand px-4 py-3 text-white">{t('chatStudent')}</p>
          </div>
          <div className="mt-4 flex gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink font-display text-[11px] font-bold text-lime">AI</span>
            <div className="rounded-2xl rounded-tl-md bg-surface px-4 py-3 ring-1 ring-line">
              <p className="text-xs font-bold text-brand">{t('chatTutorLabel')}</p>
              <p className="mt-1 leading-relaxed">{t('chatTutor')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
