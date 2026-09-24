import clsx from 'clsx';
import { Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { AVAILABLE_MODULES } from '../landing/Program';
import { Chip } from '../ui';

export function PathView() {
  const t = useTranslations('app.path');
  const modules = useTranslations('program').raw('modules') as { name: string; desc: string }[];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">{t('title')}</h1>
      <p className="mt-2 text-lg text-muted">{t('subtitle')}</p>
      <ol className="relative mt-8 space-y-3 before:absolute before:bottom-6 before:left-[27px] before:top-6 before:w-0.5 before:bg-line">
        {modules.map((m, i) => {
          const current = i === 0;
          const open = i < AVAILABLE_MODULES;
          return (
            <li
              key={m.name}
              className={clsx(
                'relative flex items-center gap-4 rounded-3xl bg-surface p-3 pr-5',
                current ? 'shadow-card ring-2 ring-brand' : 'ring-1 ring-line',
                !open && 'opacity-60',
              )}
            >
              <span
                className={clsx(
                  'grid size-10 shrink-0 place-items-center rounded-2xl font-display text-sm font-bold',
                  current ? 'bg-brand text-white' : open ? 'bg-brand-soft text-brand' : 'bg-line text-muted',
                )}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[15px] font-semibold">{m.name}</p>
                <p className="truncate text-sm text-muted">{m.desc}</p>
              </div>
              {current ? <Chip>{t('current')}</Chip> : !open ? <Lock className="size-4 text-muted" aria-label={t('locked')} /> : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
