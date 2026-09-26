'use client';

import clsx from 'clsx';
import { Check, Lock, Play } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { doneCount, PathLesson, TRACK_EMOJI, TrackId } from '@/lib/course';
import { useProgress } from '@/lib/progress';
import { usePath } from '@/lib/usePath';
import { Chip } from '../ui';

export function PathView() {
  const t = useTranslations('app.path');
  const tApp = useTranslations('app');
  const program = useTranslations('program').raw('modules') as { name: string; desc: string }[];
  const { completed, setCursor } = useProgress();
  const { path, current } = usePath();
  const router = useRouter();
  const coreCount = path.filter((m) => m.kind === 'core').length;
  const locked = program.slice(coreCount);

  const openLesson = (lesson: PathLesson) => {
    const firstOpen = lesson.tasks.find((task) => !completed.includes(task.id)) ?? lesson.tasks[0];
    setCursor(firstOpen.id);
    router.push('/app/lesson');
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">{t('title')}</h1>
      <p className="mt-2 text-lg text-muted">{t('subtitle')}</p>
      <ol className="mt-8 space-y-3">
        {path.map((m, mi) => {
          const isCurrent = current?.module === mi;
          return (
            <li key={m.id} className={clsx('rounded-3xl bg-surface p-3', isCurrent ? 'shadow-card ring-2 ring-brand' : 'ring-1 ring-line')}>
              <div className="flex items-center gap-4 pr-2">
                <span
                  className={clsx(
                    'grid size-10 shrink-0 place-items-center rounded-2xl font-display text-sm font-bold',
                    isCurrent ? 'bg-brand text-white' : 'bg-brand-soft text-brand',
                  )}
                >
                  {m.kind === 'track' ? <span className="text-xl">{TRACK_EMOJI[m.id as TrackId]}</span> : mi + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[15px] font-semibold">{m.name}</p>
                  <p className="truncate text-sm text-muted">{m.desc}</p>
                </div>
                {isCurrent ? <Chip>{t('current')}</Chip> : m.kind === 'track' ? <Chip tone="lime">{tApp('forYou')}</Chip> : null}
              </div>

              <div className="mt-3 grid gap-2 pl-14 sm:grid-cols-2">
                {m.lessons.map((l) => {
                  const done = doneCount(l.tasks, completed);
                  const finished = done === l.tasks.length;
                  return (
                    <button
                      key={l.title}
                      onClick={() => openLesson(l)}
                      className="group flex items-center gap-3 rounded-2xl bg-canvas px-4 py-3 text-left transition hover:bg-brand-soft"
                    >
                      <span
                        className={clsx(
                          'grid size-8 shrink-0 place-items-center rounded-full',
                          finished ? 'bg-success text-white' : 'bg-surface text-brand ring-1 ring-line',
                        )}
                      >
                        {finished ? <Check className="size-4" /> : <Play className="size-3.5" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{l.title}</span>
                        <span className="block text-xs text-muted">{t('lessonsDone', { done, total: l.tasks.length })}</span>
                      </span>
                      <span className="text-xs font-semibold text-brand opacity-0 transition group-hover:opacity-100">
                        {finished ? t('done') : t('open')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}

        {locked.map((m, i) => (
          <li key={m.name} className="flex items-center gap-4 rounded-3xl bg-surface p-3 pr-5 opacity-60 ring-1 ring-line">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-line font-display text-sm font-bold text-muted">
              {path.length + i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[15px] font-semibold">{m.name}</p>
              <p className="truncate text-sm text-muted">{m.desc}</p>
            </div>
            <Lock className="size-4 text-muted" aria-label={t('locked')} />
          </li>
        ))}
      </ol>
    </div>
  );
}
