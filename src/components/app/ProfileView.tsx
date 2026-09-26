'use client';

import clsx from 'clsx';
import { Info, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { doneCount, TRACK_EMOJI, TrackId } from '@/lib/course';
import { levelInfo, useProgress } from '@/lib/progress';
import { usePath } from '@/lib/usePath';
import { PhotoPicker } from '../Avatar';
import { TrackPicker } from '../TrackPicker';
import { buttonClass, ProgressBar } from '../ui';

const AGES = [10, 11, 12, 13, 14, 15, 16];

export function ProfileView() {
  const t = useTranslations('app.profile');
  const tApp = useTranslations('app');
  const tAge = useTranslations('onboarding.age');
  const router = useRouter();
  const { profile, xp, completed, updateProfile, reset } = useProgress();
  const { path } = usePath();
  const lvl = levelInfo(xp);
  const modulesDone = path.filter((m) => m.lessons.every((l) => doneCount(l.tasks, completed) === l.tasks.length)).length;

  const stats = [
    { label: t('xp'), value: xp },
    { label: t('level'), value: `${lvl.level} · ${lvl.title}` },
    { label: t('tasks'), value: completed.length },
    { label: t('modules'), value: `${modulesDone}/${path.length}` },
  ];

  const onReset = () => {
    if (!window.confirm(t('resetConfirm'))) return;
    reset();
    router.push('/start');
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold">{t('title')}</h1>
        <p className="mt-2 text-lg text-muted">{t('subtitle')}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <section className="flex flex-col items-center rounded-[28px] bg-surface p-6 text-center ring-1 ring-line">
          <PhotoPicker />
          <p className="mt-4 font-display text-2xl font-bold">{profile.name.trim() || tApp('friend')}</p>
          {profile.age ? <p className="text-muted">{`${profile.age} ${tAge('unit', { age: profile.age })}`}</p> : null}
          <dl className="mt-6 grid w-full grid-cols-2 gap-2 text-left">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-canvas p-3">
                <dt className="text-xs text-muted">{s.label}</dt>
                <dd className="mt-0.5 font-display text-sm font-bold">{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="space-y-5 rounded-[28px] bg-surface p-6 ring-1 ring-line">
          <label className="block">
            <span className="text-sm font-semibold">{t('name')}</span>
            <input
              value={profile.name}
              onChange={(e) => updateProfile({ name: e.target.value })}
              maxLength={30}
              className="mt-2 h-12 w-full rounded-2xl bg-canvas px-4 font-medium outline-none ring-1 ring-line transition focus:ring-2 focus:ring-brand"
            />
          </label>

          <div>
            <p className="text-sm font-semibold">{t('age')}</p>
            <div role="radiogroup" aria-label={t('age')} className="mt-2 flex flex-wrap gap-2">
              {AGES.map((age) => (
                <button
                  key={age}
                  role="radio"
                  aria-checked={profile.age === age}
                  onClick={() => updateProfile({ age })}
                  className={clsx(
                    'size-12 rounded-2xl font-display font-bold transition',
                    profile.age === age ? 'bg-brand text-white' : 'bg-canvas ring-1 ring-line hover:ring-brand',
                  )}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold">{t('interests')}</p>
            <div className="mt-2">
              <TrackPicker compact />
            </div>
          </div>

          <p className="flex items-center gap-2 text-sm text-success">
            <span className="size-2 rounded-full bg-success" />
            {t('saved')}
          </p>
        </section>
      </div>

      <section className="rounded-[28px] bg-surface p-6 ring-1 ring-line">
        <h2 className="font-display text-lg font-semibold">{t('progress')}</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
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
                  <span className="shrink-0 text-muted">{tApp('tasksOf', { done, total: tasks.length })}</span>
                </div>
                <ProgressBar value={(done / tasks.length) * 100} className="mt-1.5 h-1.5 bg-canvas" barClassName={m.kind === 'track' ? 'bg-lime' : 'bg-brand'} />
              </li>
            );
          })}
        </ul>
      </section>

      <div className="flex flex-col gap-4 rounded-[28px] bg-surface p-6 ring-1 ring-line sm:flex-row sm:items-center">
        <p className="flex flex-1 gap-3 text-sm leading-relaxed text-muted">
          <Info className="mt-0.5 size-4 shrink-0" />
          {t('storageNote')}
        </p>
        <button onClick={onReset} className={buttonClass('secondary', 'sm', 'text-coral-ink')}>
          <RotateCcw className="size-4" />
          {t('reset')}
        </button>
      </div>
    </div>
  );
}
