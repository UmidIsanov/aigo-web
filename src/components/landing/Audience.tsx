import { ArrowRight, Check, GraduationCap, HeartHandshake } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Logo } from '../Logo';
import { buttonClass, SectionTitle } from '../ui';

export function Audience() {
  const t = useTranslations('audience');
  const cards = [
    { title: t('parentsTitle'), points: t.raw('parentsPoints') as string[], icon: HeartHandshake, tint: 'bg-coral-soft text-coral-ink' },
    { title: t('schoolsTitle'), points: t.raw('schoolsPoints') as string[], icon: GraduationCap, tint: 'bg-sky-soft text-sky-ink' },
  ];

  return (
    <section id="parents" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle eyebrow={t('eyebrow')} title={t('title')} />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {cards.map(({ title, points, icon: Icon, tint }) => (
            <div key={title} className="rounded-3xl bg-surface p-7 ring-1 ring-line">
              <span className={`grid size-12 place-items-center rounded-2xl ${tint}`}>
                <Icon className="size-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
              <ul className="mt-5 space-y-3">
                {points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <Check className="mt-0.5 size-5 shrink-0 text-brand" />
                    <span className="text-muted">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  const t = useTranslations('cta');
  return (
    <section className="px-4 pb-20 sm:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[40px] bg-brand px-6 py-16 text-center text-white sm:px-12">
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-lime/30 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 size-72 rounded-full bg-sky/40 blur-2xl" />
        <h2 className="relative font-display text-3xl font-bold sm:text-5xl">{t('title')}</h2>
        <p className="relative mt-4 text-lg text-white/85">{t('subtitle')}</p>
        <Link href="/start" className={buttonClass('lime', 'lg', 'relative mt-8')}>
          {t('button')}
          <ArrowRight className="size-5" />
        </Link>
      </div>
    </section>
  );
}

export function SiteFooter() {
  const t = useTranslations('footer');
  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted sm:flex-row sm:px-6">
        <Logo />
        <p className="font-display text-xs font-semibold tracking-wide text-ink">{t('tagline')}</p>
        <p>{t('rights')}</p>
      </div>
    </footer>
  );
}
