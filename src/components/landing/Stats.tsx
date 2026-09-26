import clsx from 'clsx';
import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Eyebrow } from '../ui';

/** WEF job-market facts. */
export function Stats() {
  const t = useTranslations('stats');
  const facts = [
    { value: t('jobsNew'), label: t('jobsNewLabel'), color: 'text-lime' },
    { value: t('jobsGone'), label: t('jobsGoneLabel'), color: 'text-coral' },
    { value: t('skills'), label: t('skillsLabel'), color: 'text-sun' },
  ];

  const grid = (
    <div className="grid gap-3 md:grid-cols-3 md:gap-4">
      {facts.map((f) => (
        <div key={f.value} className="rounded-3xl bg-ink-2 p-6">
          <p className={clsx('font-display text-4xl font-bold sm:text-5xl', f.color)}>{f.value}</p>
          <p className="mt-3 leading-snug text-white/85">{f.label}</p>
        </div>
      ))}
    </div>
  );

  return (
    <section className="bg-ink py-20 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <Eyebrow dark>{t('eyebrow')}</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">{t('title')}</h2>
          </div>
          <p className="max-w-sm text-sm text-ink-muted">{t('source')}</p>
        </div>
        <div className="mt-10">{grid}</div>
        <div className="mt-4 flex gap-4 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <Info className="mt-0.5 size-5 shrink-0 text-lime" />
          <p className="text-lg leading-relaxed text-white/90">{t('note')}</p>
        </div>
      </div>
    </section>
  );
}
