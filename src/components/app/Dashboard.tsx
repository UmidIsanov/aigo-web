'use client';

import { ArrowRight, Flame, Sparkles, Trophy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { assessmentLevel, levelInfo, useProgress, XP_PER_LEVEL } from '@/lib/progress';
import { buttonClass, Chip, ProgressBar } from '../ui';

export function Dashboard() {
  const t = useTranslations('app');
  const tInterests = useTranslations('onboarding.interests');
  const { xp, lessonProgress, interests, assessment, reset } = useProgress();
  const lvl = levelInfo(xp);
  const interestNames = (tInterests.raw('items') as string[]).filter((_, i) => interests.includes(i));
  const tCheck = useTranslations('onboarding.check');
  const checkQuestions = tCheck.raw('questions') as { skill: string }[];
  const score = assessment?.filter(Boolean).length ?? 0;
  const level = assessment ? assessmentLevel(score, assessment.length) : null;

  // Starting skill values come from the onboarding thinking check; lessons add fact-checking practice.
  const skillValue = (skill: string, bonus = 0) => {
    const idx = checkQuestions.flatMap((q, i) => (q.skill === skill ? [i] : []));
    const right = idx.filter((i) => assessment?.[i]).length;
    return Math.min(100, 20 + Math.round((right / Math.max(1, idx.length)) * 50) + bonus);
  };
  const skills = [
    { name: tCheck('skills.prompting'), value: skillValue('prompting'), bar: 'bg-brand' },
    { name: tCheck('skills.critical'), value: skillValue('critical', (lessonProgress - 3) * 5), bar: 'bg-coral' },
    { name: tCheck('skills.logic'), value: skillValue('logic'), bar: 'bg-sky' },
    { name: tCheck('skills.problem'), value: skillValue('problem'), bar: 'bg-lime' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <span className="grid size-14 place-items-center rounded-full bg-sun font-display text-xl font-bold">{t('demoName')[0]}</span>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold sm:text-3xl">{t('greeting', { name: t('demoName') })}</h1>
          <p className="text-muted">{t('level', { level: lvl.level, title: lvl.title })}</p>
        </div>
        {level ? <Chip tone="sky">{t('startLevel', { level: tCheck(`levels.${level}`) })}</Chip> : null}
        <Chip tone="coral">
          <Flame className="size-4" />
          {t('streak', { days: 5 })}
        </Chip>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative overflow-hidden rounded-[28px] bg-brand p-7 text-white">
          <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-lime/25 blur-2xl" />
          <p className="relative text-xs font-bold uppercase tracking-widest text-lime">{t('module')}</p>
          <h2 className="relative mt-3 font-display text-2xl font-bold leading-tight">{t('lessonTitle')}</h2>
          <div className="relative mt-6 flex items-center gap-3">
            <ProgressBar value={lessonProgress * 10} className="flex-1 bg-white/25" barClassName="bg-lime" />
            <span className="text-sm font-semibold">{lessonProgress}/10</span>
          </div>
          <Link href="/app/lesson" className={buttonClass('white', 'md', 'relative mt-7')}>
            {t('continue')}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="rounded-[28px] bg-surface p-6 ring-1 ring-line">
          <div className="flex items-center justify-between">
            <span className="font-display text-lg font-semibold">{t('xp', { current: lvl.inLevel, max: XP_PER_LEVEL })}</span>
            <Trophy className="size-5 text-sun-ink" />
          </div>
          <p className="mt-1 text-sm text-muted">{t('toLevel', { title: lvl.next })}</p>
          <ProgressBar value={(lvl.inLevel / XP_PER_LEVEL) * 100} className="mt-5 h-3 bg-brand-soft" />
          {interestNames.length ? (
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-muted">{t('interests')}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {interestNames.map((n) => (
                  <Chip key={n} tone="neutral">
                    {n}
                  </Chip>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-[28px] bg-lime p-6">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="size-4" />
            {t('challenge')}
          </p>
          <p className="mt-4 font-display text-lg font-semibold leading-snug">{t('challengeText')}</p>
          <Chip tone="ink" className="mt-5">
            +50 XP
          </Chip>
        </div>

        <Link href="/app/portfolio" className="group rounded-[28px] bg-surface p-6 ring-1 ring-line transition hover:ring-brand">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">{t('portfolio')}</p>
          <p className="mt-3 font-display text-5xl font-bold">1</p>
          <p className="mt-1 text-muted">{t('portfolioCount', { count: 1 })}</p>
          <ArrowRight className="mt-4 size-5 text-brand transition group-hover:translate-x-1" />
        </Link>

        <div className="rounded-[28px] bg-surface p-6 ring-1 ring-line">
          <p className="font-display text-lg font-semibold">{t('skills')}</p>
          <ul className="mt-4 space-y-4">
            {skills.map((s) => (
              <li key={s.name}>
                <div className="flex justify-between gap-2 text-sm">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted">{s.value}%</span>
                </div>
                <ProgressBar value={s.value} className="mt-1.5 h-1.5 bg-canvas" barClassName={s.bar} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-2 text-center">
        <Link href="/start" onClick={reset} className="text-sm font-medium text-muted underline-offset-4 hover:text-ink hover:underline">
          {t('reset')}
        </Link>
      </div>
    </div>
  );
}
