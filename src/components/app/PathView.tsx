'use client';

import clsx from 'clsx';
import { Check, Lock, Play } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { CourseModule, currentTask, flattenCourse, taskId } from '@/lib/course';
import { useProgress } from '@/lib/progress';
import { Chip } from '../ui';

export function PathView() {
  const t = useTranslations('app.path');
  const programModules = useTranslations('program').raw('modules') as { name: string; desc: string }[];
  const course = useTranslations('course').raw('modules') as CourseModule[];
  const { completed, cursor, setCursor } = useProgress();
  const router = useRouter();
  const current = currentTask(flattenCourse(course), completed, cursor);

  const openLesson = (m: number, l: number) => {
    const tasks = course[m].lessons[l].tasks;
    const firstOpen = tasks.findIndex((_, i) => !completed.includes(taskId(m, l, i)));
    setCursor(taskId(m, l, firstOpen === -1 ? 0 : firstOpen));
    router.push('/app/lesson');
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">{t('title')}</h1>
      <p className="mt-2 text-lg text-muted">{t('subtitle')}</p>
      <ol className="mt-8 space-y-3">
        {programModules.map((m, mi) => {
          const lessons = course[mi]?.lessons;
          const isCurrent = current?.module === mi;
          return (
            <li
              key={m.name}
              className={clsx(
                'rounded-3xl bg-surface p-3',
                isCurrent ? 'shadow-card ring-2 ring-brand' : 'ring-1 ring-line',
                !lessons && 'opacity-60',
              )}
            >
              <div className="flex items-center gap-4 pr-2">
                <span
                  className={clsx(
                    'grid size-10 shrink-0 place-items-center rounded-2xl font-display text-sm font-bold',
                    isCurrent ? 'bg-brand text-white' : lessons ? 'bg-brand-soft text-brand' : 'bg-line text-muted',
                  )}
                >
                  {mi + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[15px] font-semibold">{m.name}</p>
                  <p className="truncate text-sm text-muted">{m.desc}</p>
                </div>
                {isCurrent ? <Chip>{t('current')}</Chip> : !lessons ? <Lock className="size-4 text-muted" aria-label={t('locked')} /> : null}
              </div>

              {lessons ? (
                <div className="mt-3 grid gap-2 pl-14 sm:grid-cols-2">
                  {lessons.map((l, li) => {
                    const done = l.tasks.filter((_, ti) => completed.includes(taskId(mi, li, ti))).length;
                    const finished = done === l.tasks.length;
                    return (
                      <button
                        key={l.title}
                        onClick={() => openLesson(mi, li)}
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
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
