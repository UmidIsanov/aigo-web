'use client';

import clsx from 'clsx';
import { ArrowLeft, ArrowRight, PartyPopper, Trophy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { Difficulty, nextTask, PathModule, TaskRef } from '@/lib/course';
import { useProgress } from '@/lib/progress';
import { usePath } from '@/lib/usePath';
import { buttonClass, Chip, Tone } from '../ui';

// AI Tutor hint ladder from the PRD: Mistake → Hint → Try again → Second hint → Explanation.
type Stage = 'answering' | 'hint1' | 'hint2' | 'explained' | 'solved';

const ladderStep: Record<Stage, number> = { answering: -1, hint1: 1, hint2: 3, explained: 4, solved: 4 };
const xpFor: Partial<Record<Stage, number>> = { answering: 30, hint1: 20, hint2: 10 };
const difficultyTone: Record<Difficulty, Tone> = { easy: 'lime', medium: 'sun', challenge: 'coral' };
const difficultyLabel: Record<Difficulty, string> = { easy: 'Easy', medium: 'Medium', challenge: 'Challenge' };

type Message = { from: 'me' | 'tutor'; label?: string; text: string; success?: boolean };

export function Lesson() {
  const { path, refs, current } = usePath();

  if (!current) return <CourseDone />;
  // Keyed by task id so every task starts with a fresh hint ladder.
  return <TaskView key={current.id} path={path} refs={refs} current={current} />;
}

function TaskView({ path, refs, current }: { path: PathModule[]; refs: TaskRef[]; current: TaskRef }) {
  const t = useTranslations('app.lesson');
  const ladder = useTranslations('tutor').raw('ladder') as string[];
  const { award, completeTask, setCursor } = useProgress();
  const [stage, setStage] = useState<Stage>('answering');
  const [messages, setMessages] = useState<Message[]>([]);

  const mod = path[current.module];
  const lesson = mod.lessons[current.lesson];
  const task = lesson.tasks[current.task];
  const done = stage === 'solved' || stage === 'explained';
  const next = nextTask(refs, current.id);
  const lessonFinished = !next || next.lesson !== current.lesson || next.module !== current.module;
  const moduleFinished = !next || next.module !== current.module;

  const tutor = (label: string, text: string, success?: boolean): Message => ({ from: 'tutor', label, text, success });

  const answer = (i: number) => {
    const mine: Message = { from: 'me', text: task.options[i] };
    // Pin this task so finishing it doesn't immediately swap the view to the next unfinished one.
    setCursor(current.id);
    if (i === task.answer) {
      const xp = xpFor[stage] ?? 10;
      // award() pays once per task, so replaying a lesson can't farm XP.
      const paid = award(current.id, xp);
      completeTask(current.id);
      setStage('solved');
      const label = paid ? t('successLabel', { xp }) : t('successNoXp');
      const text = paid ? task.explanation : `${task.explanation} ${t('alreadyDone')}`;
      setMessages((m) => [...m, mine, tutor(label, text, true)]);
    } else if (stage === 'answering') {
      setStage('hint1');
      setMessages((m) => [...m, mine, tutor(t('hint1Label'), task.hints[0])]);
    } else if (stage === 'hint1') {
      setStage('hint2');
      setMessages((m) => [...m, mine, tutor(t('hint2Label'), task.hints[1])]);
    } else {
      // The answer was revealed, so this task can no longer earn XP.
      award(current.id, 0);
      completeTask(current.id);
      setStage('explained');
      setMessages((m) => [...m, mine, tutor(t('explainLabel'), task.explanation)]);
    }
  };

  const moreHint = () => {
    setStage('hint2');
    setMessages((m) => [...m, tutor(t('hint2Label'), task.hints[1])]);
  };

  const goNext = () => {
    setCursor(next?.id ?? null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div>
        <div className="flex items-center gap-3">
          <Link href="/app" aria-label={t('back')} className="grid size-10 place-items-center rounded-full bg-surface ring-1 ring-line hover:ring-ink/30">
            <ArrowLeft className="size-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{t('header', { module: current.module + 1, lesson: current.lesson + 1 })}</p>
            <p className="truncate text-sm text-muted">
              {mod.name} · {lesson.title}
            </p>
          </div>
          <Chip tone={difficultyTone[task.difficulty]}>{difficultyLabel[task.difficulty]}</Chip>
        </div>

        <div className="mt-5 flex gap-1.5">
          {lesson.tasks.map((_, i) => (
            <span key={i} className={clsx('h-1.5 flex-1 rounded-full', i < current.task || (i === current.task && done) ? 'bg-brand' : 'bg-line')} />
          ))}
        </div>

        <div className="mt-5 rounded-[28px] bg-surface p-6 shadow-card ring-1 ring-line">
          <p className="text-xs font-bold uppercase tracking-widest text-brand">
            {t('taskOf', { n: current.task + 1, total: lesson.tasks.length })}
          </p>
          <p className="mt-3 font-display text-lg font-medium leading-relaxed sm:text-xl">{task.question}</p>
        </div>

        <div className="mt-5 space-y-3">
          {messages.map((m, i) =>
            m.from === 'me' ? (
              <div key={i} className="flex animate-rise justify-end">
                <p className="max-w-[80%] rounded-2xl rounded-br-md bg-brand px-4 py-3 text-white">{m.text}</p>
              </div>
            ) : (
              <div key={i} className="flex animate-rise gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink font-display text-[11px] font-bold text-lime">AI</span>
                <div className={clsx('rounded-2xl rounded-tl-md px-4 py-3 ring-1', m.success ? 'bg-success-soft ring-success/40' : 'bg-surface ring-line')}>
                  <p className={clsx('text-xs font-bold', m.success ? 'text-success' : 'text-brand')}>{m.label}</p>
                  <p className="mt-1 leading-relaxed">{m.text}</p>
                </div>
              </div>
            ),
          )}
        </div>

        {!done ? (
          <div className="mt-6">
            <p className="text-sm font-medium text-muted">{stage === 'answering' ? t('choose') : t('tryAgain')}</p>
            <div className="mt-3 grid gap-2.5">
              {task.options.map((o, i) => (
                <button
                  key={o}
                  onClick={() => answer(i)}
                  className="rounded-2xl bg-surface px-5 py-4 text-left font-medium ring-1 ring-line transition hover:-translate-y-0.5 hover:ring-brand"
                >
                  {o}
                </button>
              ))}
            </div>
            {stage === 'hint1' ? (
              <button onClick={moreHint} className={buttonClass('secondary', 'md', 'mt-4')}>
                {t('moreHint')}
              </button>
            ) : null}
          </div>
        ) : (
          <div className="mt-6 animate-rise">
            {lessonFinished ? (
              <div className="mb-4 flex items-center gap-3 rounded-3xl bg-lime-soft p-5">
                <Trophy className="size-6 shrink-0 text-lime-ink" />
                <p className="font-display font-semibold">
                  {moduleFinished ? t('moduleDone', { module: current.module + 1 }) : t('lessonDone', { title: lesson.title })}
                </p>
              </div>
            ) : null}
            <button onClick={goNext} className={buttonClass('primary', 'lg')}>
              {!next ? t('courseDoneTitle') : moduleFinished ? t('nextModule') : lessonFinished ? t('nextLesson') : t('next')}
              <ArrowRight className="size-5" />
            </button>
          </div>
        )}
      </div>

      <aside className="h-fit rounded-[28px] bg-ink p-6 lg:sticky lg:top-10">
        <p className="font-display text-sm font-semibold text-white">{t('howTitle')}</p>
        <ol className="mt-5 space-y-3">
          {ladder.map((step, i) => {
            const active = i <= ladderStep[stage] || (stage !== 'answering' && stage !== 'solved' && i === 0);
            return (
              <li key={step} className="flex items-center gap-3">
                <span
                  className={clsx(
                    'grid size-7 place-items-center rounded-full text-xs font-bold transition',
                    active ? 'bg-lime text-ink' : 'text-ink-muted ring-1 ring-ink-muted/40',
                  )}
                >
                  {i + 1}
                </span>
                <span className={clsx('text-sm font-medium', active ? 'text-white' : 'text-ink-muted')}>{step}</span>
              </li>
            );
          })}
        </ol>
        <p className="mt-5 text-sm leading-relaxed text-ink-muted">{t('howNote')}</p>
      </aside>
    </div>
  );
}

function CourseDone() {
  const t = useTranslations('app.lesson');
  return (
    <div className="mx-auto max-w-xl animate-rise pt-6 text-center">
      <span className="mx-auto grid size-20 place-items-center rounded-[28px] bg-lime">
        <PartyPopper className="size-9 text-ink" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-bold">{t('courseDoneTitle')}</h1>
      <p className="mt-3 text-lg leading-relaxed text-muted">{t('courseDoneText')}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/app/path" className={buttonClass('primary', 'lg')}>
          {t('toPath')}
        </Link>
        <Link href="/app" className={buttonClass('secondary', 'lg')}>
          {t('back')}
        </Link>
      </div>
    </div>
  );
}
