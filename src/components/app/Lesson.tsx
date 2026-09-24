'use client';

import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useProgress } from '@/lib/progress';
import { buttonClass, Chip } from '../ui';

// AI Tutor hint ladder from the PRD: Mistake → Hint → Try again → Second hint → Explanation.
type Stage = 'answering' | 'hint1' | 'hint2' | 'explained' | 'solved';

const CORRECT = 1;
const ladderStep: Record<Stage, number> = { answering: -1, hint1: 1, hint2: 3, explained: 4, solved: 4 };
const xpFor: Partial<Record<Stage, number>> = { answering: 30, hint1: 20, hint2: 10 };

type Message = { from: 'me' | 'tutor'; label?: string; text: string };

export function Lesson() {
  const t = useTranslations('app.lesson');
  const ladder = useTranslations('tutor').raw('ladder') as string[];
  const options = t.raw('options') as string[];
  const { addXp, completeLessonTask, lessonProgress } = useProgress();
  const [taskNumber] = useState(() => Math.min(10, lessonProgress + 1));
  const [stage, setStage] = useState<Stage>('answering');
  const [messages, setMessages] = useState<Message[]>([]);
  const done = stage === 'solved' || stage === 'explained';

  const tutor = (label: string, text: string): Message => ({ from: 'tutor', label, text });

  const answer = (i: number) => {
    const mine: Message = { from: 'me', text: options[i] };
    if (i === CORRECT) {
      const xp = xpFor[stage] ?? 10;
      addXp(xp);
      completeLessonTask();
      setStage('solved');
      setMessages((m) => [...m, mine, tutor(t('successLabel', { xp }), t('explanation'))]);
    } else if (stage === 'answering') {
      setStage('hint1');
      setMessages((m) => [...m, mine, tutor(t('hint1Label'), t('hint1'))]);
    } else if (stage === 'hint1') {
      setStage('hint2');
      setMessages((m) => [...m, mine, tutor(t('hint2Label'), t('hint2'))]);
    } else {
      completeLessonTask();
      setStage('explained');
      setMessages((m) => [...m, mine, tutor(t('explainLabel'), t('explanation'))]);
    }
  };

  const moreHint = () => {
    setStage('hint2');
    setMessages((m) => [...m, tutor(t('hint2Label'), t('hint2'))]);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div>
        <div className="flex items-center gap-3">
          <Link href="/app" aria-label={t('back')} className="grid size-10 place-items-center rounded-full bg-surface ring-1 ring-line hover:ring-ink/30">
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex-1">
            <p className="font-semibold">{t('header', { n: taskNumber })}</p>
            <p className="text-sm text-muted">{t('topic')}</p>
          </div>
          <Chip tone="sun">Medium</Chip>
        </div>

        <div className="mt-6 rounded-[28px] bg-surface p-6 shadow-card ring-1 ring-line">
          <p className="text-xs font-bold uppercase tracking-widest text-brand">{t('task')}</p>
          <p className="mt-3 font-display text-lg font-medium leading-relaxed sm:text-xl">{t('claim')}</p>
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
                <div className={clsx('rounded-2xl rounded-tl-md px-4 py-3 ring-1', stage === 'solved' && i === messages.length - 1 ? 'bg-success-soft ring-success/40' : 'bg-surface ring-line')}>
                  <p className="text-xs font-bold text-brand">{m.label}</p>
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
              {options.map((o, i) => (
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
          <Link href="/app" className={buttonClass('primary', 'lg', 'mt-6')}>
            {t('back')}
          </Link>
        )}
      </div>

      <aside className="h-fit rounded-[28px] bg-ink p-6 lg:sticky lg:top-10">
        <p className="font-display text-sm font-semibold text-white">{t('howTitle')}</p>
        <ol className="mt-5 space-y-3">
          {ladder.map((step, i) => {
            const active = i <= ladderStep[stage] || (stage !== 'answering' && i === 0);
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
