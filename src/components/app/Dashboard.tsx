'use client';

import { ArrowRight, Pencil, Sparkles, Trophy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { doneCount, TRACK_EMOJI, TrackId, TrackModule } from '@/lib/course';
import { levelInfo, useProgress, XP_PER_LEVEL } from '@/lib/progress';
import { usePath } from '@/lib/usePath';
import { Avatar } from '../Avatar';
import { buttonClass, Chip, ProgressBar } from '../ui';

export function Dashboard() {
  const t = useTranslations('app');
  const tracks = useTranslations('course').raw('tracks') as Record<TrackId, TrackModule>;
  const { xp, profile, interests, completed } = useProgress();
  const { path, current } = usePath();
  const lvl = levelInfo(xp);
  const name = profile.name.trim() || t('friend');
  const mod = current ? path[current.module] : null;
  const lesson = mod && current ? mod.lessons[current.lesson] : null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <Avatar name={name} photo={profile.photo} className="size-14 text-xl" />
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold sm:text-3xl">{t('greeting', { name })}</h1>
          <p className="text-muted">{t('level', { level: lvl.level, title: lvl.title })}</p>
        </div>
        <Link href="/app/profile" className={buttonClass('secondary', 'sm')}>
          <Pencil className="size-4" />
          {t('editProfile')}
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative overflow-hidden rounded-[28px] bg-brand p-7 text-white">
          <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-lime/25 blur-2xl" />
          {current && mod && lesson ? (
            <>
              <p className="relative flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-lime">
                {t('module', { n: current.module + 1, name: mod.name })}
                {mod.kind === 'track' ? <span className="text-base">{TRACK_EMOJI[mod.id as TrackId]}</span> : null}
              </p>
              <h2 className="relative mt-3 font-display text-2xl font-bold leading-tight">
                {t('lessonTitle', { n: current.lesson + 1, title: lesson.title })}
              </h2>
              <div className="relative mt-6 flex items-center gap-3">
                <ProgressBar value={(doneCount(lesson.tasks, completed) / lesson.tasks.length) * 100} className="flex-1 bg-white/25" barClassName="bg-lime" />
                <span className="text-sm font-semibold">
                  {doneCount(lesson.tasks, completed)}/{lesson.tasks.length}
                </span>
              </div>
              <Link href="/app/lesson" className={buttonClass('white', 'md', 'relative mt-7')}>
                {t('continue')}
                <ArrowRight className="size-4" />
              </Link>
            </>
          ) : (
            <>
              <h2 className="relative font-display text-2xl font-bold leading-tight">{t('courseDone')}</h2>
              <Link href="/app/path" className={buttonClass('white', 'md', 'relative mt-7')}>
                {t('nav.path')}
                <ArrowRight className="size-4" />
              </Link>
            </>
          )}
        </div>

        <div className="rounded-[28px] bg-surface p-6 ring-1 ring-line">
          <div className="flex items-center justify-between">
            <span className="font-display text-lg font-semibold">{t('xp', { current: lvl.inLevel, max: XP_PER_LEVEL })}</span>
            <Trophy className="size-5 text-sun-ink" />
          </div>
          <p className="mt-1 text-sm text-muted">{t('toLevel', { title: lvl.next })}</p>
          <ProgressBar value={(lvl.inLevel / XP_PER_LEVEL) * 100} className="mt-5 h-3 bg-brand-soft" />
          {interests.length ? (
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-muted">{t('interests')}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {interests.map((id) => (
                  <Chip key={id} tone="neutral">
                    {TRACK_EMOJI[id]} {tracks[id].name}
                  </Chip>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-[1fr_1fr_1.3fr]">
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
          <p className="font-display text-lg font-semibold">{t('progress')}</p>
          <ul className="mt-4 space-y-3.5">
            {path.map((m) => {
              const tasks = m.lessons.flatMap((l) => l.tasks);
              const done = doneCount(tasks, completed);
              return (
                <li key={m.id}>
                  <div className="flex justify-between gap-2 text-sm">
                    <span className="truncate font-medium">
                      {m.kind === 'track' ? `${TRACK_EMOJI[m.id as TrackId]} ` : ''}
                      {m.name}
                    </span>
                    <span className="shrink-0 text-muted">{t('tasksOf', { done, total: tasks.length })}</span>
                  </div>
                  <ProgressBar value={(done / tasks.length) * 100} className="mt-1.5 h-1.5 bg-canvas" barClassName={m.kind === 'track' ? 'bg-lime' : 'bg-brand'} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
