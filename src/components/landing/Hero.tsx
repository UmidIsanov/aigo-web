import { ArrowRight, BadgeCheck, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { buttonClass, Chip } from '../ui';

export function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative overflow-hidden">
      <div className="bg-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div className="pointer-events-none absolute -top-40 right-[-10%] size-[520px] rounded-full bg-brand/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-[-10%] size-[420px] rounded-full bg-lime/25 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
        <div className="animate-rise">
          <Chip tone="neutral" className="shadow-card">
            <Sparkles className="size-3.5 text-brand" />
            {t('badge')}
          </Chip>
          <h1 className="mt-6 font-display text-[34px] font-bold leading-[1.08] tracking-tight sm:text-5xl xl:text-[56px]">
            {t('title')}
            <br />
            <span className="box-decoration-clone bg-[linear-gradient(transparent_62%,rgb(198_244_50/0.75)_62%,rgb(198_244_50/0.75)_92%,transparent_92%)] text-brand">
              {t('titleAccent')}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{t('subtitle')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/start" className={buttonClass('primary', 'lg')}>
              {t('cta')}
              <ArrowRight className="size-5" />
            </Link>
            <a href="#how" className={buttonClass('secondary', 'lg')}>
              {t('ctaSecondary')}
            </a>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-muted">
            {[t('trust1'), t('trust2'), t('trust3')].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <BadgeCheck className="size-4 text-brand" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual you={t('you')} ai={t('ai')} check={t('floatCheck')} xp={t('floatXp')} xpLabel={t('floatXpLabel')} tutor={t('floatTutor')} />
      </div>
    </section>
  );
}

function HeroVisual(props: { you: string; ai: string; check: string; xp: string; xpLabel: string; tutor: string }) {
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[560px]" aria-hidden>
      <svg viewBox="0 0 520 416" className="absolute inset-0 size-full">
        <defs>
          <clipPath id="hero-you">
            <circle cx="190" cy="208" r="150" />
          </clipPath>
        </defs>
        <circle cx="190" cy="208" r="150" fill="var(--color-ink)" />
        <circle cx="330" cy="208" r="150" fill="var(--color-brand)" />
        <circle cx="330" cy="208" r="150" fill="var(--color-lime)" clipPath="url(#hero-you)" />
        <text x="120" y="222" textAnchor="middle" fill="white" fontFamily="var(--font-unbounded)" fontWeight="700" fontSize="40">
          {props.you}
        </text>
        <text x="400" y="222" textAnchor="middle" fill="white" fontFamily="var(--font-unbounded)" fontWeight="700" fontSize="40">
          {props.ai}
        </text>
        <text x="260" y="226" textAnchor="middle" fill="var(--color-ink)" fontFamily="var(--font-unbounded)" fontWeight="700" fontSize="52">
          +
        </text>
      </svg>

      <div className="absolute right-[6%] top-[2%] size-11 rotate-12 rounded-xl bg-sun animate-float-slow" />
      <div className="absolute bottom-[8%] right-[2%] size-9 -rotate-12 rounded-lg bg-sky animate-float" />
      <div className="absolute left-[4%] top-[8%] size-6 rounded-full bg-coral animate-float" />

      <div className="absolute left-0 top-[18%] hidden items-center sm:flex gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold shadow-float animate-float">
        <span className="grid size-7 place-items-center rounded-full bg-coral-soft text-coral-ink">!</span>
        {props.check}
      </div>
      <div className="absolute bottom-[4%] left-[6%] rounded-2xl bg-lime px-4 py-3 shadow-float animate-float-slow">
        <p className="font-display text-xl font-bold text-ink">{props.xp}</p>
        <p className="text-xs font-medium text-ink/70">{props.xpLabel}</p>
      </div>
      <div className="absolute bottom-[20%] right-0 hidden max-w-[220px] sm:block rounded-2xl rounded-br-md bg-ink px-4 py-3 text-sm font-medium text-white shadow-float animate-float">
        <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-lime">AI Tutor</span>
        {props.tutor}
      </div>
    </div>
  );
}
