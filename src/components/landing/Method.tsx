import { RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SectionTitle } from '../ui';

export function Method() {
  const t = useTranslations('method');
  const steps = t.raw('steps') as { title: string; desc: string }[];
  const loop = t.raw('loop') as string[];

  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
          <div className="w-full max-w-sm">
            <div className="flex h-12 overflow-hidden rounded-2xl text-sm font-bold">
              <div className="flex w-[20%] items-center justify-center bg-sky-soft text-sky-ink">20%</div>
              <div className="flex w-[60%] items-center justify-center bg-brand text-white">60%</div>
              <div className="flex w-[20%] items-center justify-center bg-lime text-ink">20%</div>
            </div>
            <div className="mt-2 flex text-xs font-medium text-muted">
              <span className="w-[20%] text-center">{t('ratioTheory')}</span>
              <span className="w-[60%] text-center">{t('ratioPractice')}</span>
              <span className="w-[20%] text-center">{t('ratioProject')}</span>
            </div>
          </div>
        </div>

        <ol className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className={
                i === 4
                  ? 'rounded-3xl bg-brand p-5 text-white lg:-translate-y-2'
                  : 'rounded-3xl bg-canvas p-5'
              }
            >
              <span className={i === 4 ? 'font-display text-sm font-bold text-lime' : 'font-display text-sm font-bold text-brand'}>
                0{i + 1}
              </span>
              <p className="mt-6 hyphens-auto break-words font-display text-[15px] font-semibold leading-snug lg:text-sm">{s.title}</p>
              <p className={i === 4 ? 'mt-2 text-sm text-white/80' : 'mt-2 text-sm text-muted'}>{s.desc}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col gap-4 rounded-3xl bg-ink p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 text-white">
            <RefreshCw className="size-5 text-lime" />
            <span className="font-display text-sm font-semibold">{t('loopTitle')}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {loop.map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                <span className="rounded-full bg-ink-2 px-3 py-1.5 text-sm font-semibold text-white">{step}</span>
                {i < loop.length - 1 ? <span className="text-ink-muted">→</span> : null}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
