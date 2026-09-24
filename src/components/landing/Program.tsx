import clsx from 'clsx';
import { Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Chip, SectionTitle } from '../ui';

// MVP ships content for the first three modules (PRD §37).
export const AVAILABLE_MODULES = 3;

export function Program() {
  const t = useTranslations('program');
  const modules = t.raw('modules') as { name: string; desc: string }[];

  return (
    <section id="program" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m, i) => {
            const open = i < AVAILABLE_MODULES;
            return (
              <div
                key={m.name}
                className={clsx(
                  'group relative flex flex-col rounded-3xl p-5 transition',
                  open ? 'bg-surface shadow-card ring-1 ring-line hover:-translate-y-1' : 'bg-surface/60 ring-1 ring-line/70',
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={clsx(
                      'grid size-10 place-items-center rounded-xl font-display text-sm font-bold',
                      open ? 'bg-brand text-white' : 'bg-line text-muted',
                    )}
                  >
                    {i + 1}
                  </span>
                  {open ? <Chip tone="lime">{t('available')}</Chip> : <Lock className="size-4 text-muted" aria-label={t('soon')} />}
                </div>
                <p className={clsx('mt-5 font-display text-[15px] font-semibold', !open && 'text-ink/60')}>{m.name}</p>
                <p className="mt-1.5 text-sm leading-snug text-muted">{m.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
