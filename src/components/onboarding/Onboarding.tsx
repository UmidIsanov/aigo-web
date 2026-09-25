'use client';

import clsx from 'clsx';
import { ArrowLeft, ArrowRight, Brain, Check, Rocket, Telescope, TrendingUp, Trophy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ReactNode, useState } from 'react';
import { actorTone, Actor } from '../landing/ProfessionExplorer';
import { Stats } from '../landing/Stats';
import { LocaleSwitcher } from '../LocaleSwitcher';
import { Logo } from '../Logo';
import { buttonClass, Chip } from '../ui';
import { useRouter } from '@/i18n/navigation';
import { AgeGroup, assessmentLevel, useProgress } from '@/lib/progress';

const STEPS = ['age', 'reality', 'quiz', 'check', 'insight', 'interests'] as const;
const MIN_INTERESTS = 3;

export function Onboarding() {
  const t = useTranslations('onboarding');
  const [step, setStep] = useState(0);
  const dark = STEPS[step] === 'insight';
  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));

  return (
    <div className={clsx('min-h-screen transition-colors duration-500', dark ? 'bg-ink' : 'bg-canvas')}>
      <div className={clsx('pointer-events-none fixed inset-0', !dark && 'bg-dots [mask-image:linear-gradient(to_bottom,black,transparent_60%)]')} />
      <header className="relative mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
        <Logo dark={dark} />
        <LocaleSwitcher dark={dark} />
      </header>

      <main className="relative mx-auto max-w-3xl px-4 pb-16 pt-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            aria-label={t('back')}
            className={clsx(
              'grid size-10 shrink-0 place-items-center rounded-full transition disabled:opacity-0',
              dark ? 'bg-ink-2 text-white' : 'bg-surface ring-1 ring-line hover:ring-ink/30',
            )}
          >
            <ArrowLeft className="size-4" />
          </button>
          <div className="flex flex-1 gap-1.5">
            {STEPS.map((s, i) => (
              <span
                key={s}
                className={clsx('h-1.5 flex-1 rounded-full transition-colors', i <= step ? (dark ? 'bg-lime' : 'bg-brand') : dark ? 'bg-ink-2' : 'bg-line')}
              />
            ))}
          </div>
          <span className={clsx('shrink-0 text-sm font-semibold', dark ? 'text-ink-muted' : 'text-muted')}>
            {t('step', { current: step + 1, total: STEPS.length })}
          </span>
        </div>

        <div key={step} className="mt-10 animate-rise">
          {STEPS[step] === 'age' && <AgeStep onNext={next} />}
          {STEPS[step] === 'reality' && <RealityStep onNext={next} />}
          {STEPS[step] === 'quiz' && <QuizStep onNext={next} />}
          {STEPS[step] === 'check' && <CheckStep onNext={next} />}
          {STEPS[step] === 'insight' && <InsightStep onNext={next} />}
          {STEPS[step] === 'interests' && <InterestsStep />}
        </div>
      </main>
    </div>
  );
}

function StepTitle({ title, subtitle, dark }: { title: string; subtitle?: string; dark?: boolean }) {
  return (
    <div className="max-w-xl">
      <h1 className={clsx('font-display text-3xl font-bold leading-tight sm:text-4xl', dark ? 'text-white' : 'text-ink')}>{title}</h1>
      {subtitle ? <p className={clsx('mt-3 text-lg', dark ? 'text-ink-muted' : 'text-muted')}>{subtitle}</p> : null}
    </div>
  );
}

function Footer({ children }: { children: ReactNode }) {
  return <div className="mt-10 flex justify-end">{children}</div>;
}

function AgeStep({ onNext }: { onNext: () => void }) {
  const t = useTranslations('onboarding');
  const { age, setAge } = useProgress();
  const options: { id: AgeGroup; title: string; desc: string; icon: typeof Telescope; tint: string }[] = [
    { id: '10-12', title: t('age.explorer'), desc: t('age.explorerDesc'), icon: Telescope, tint: 'bg-sun-soft text-sun-ink' },
    { id: '13-16', title: t('age.creator'), desc: t('age.creatorDesc'), icon: Rocket, tint: 'bg-lime-soft text-lime-ink' },
  ];

  return (
    <>
      <StepTitle title={t('age.title')} subtitle={t('age.subtitle')} />
      <div role="radiogroup" className="mt-8 grid gap-4 sm:grid-cols-2">
        {options.map(({ id, title, desc, icon: Icon, tint }) => {
          const selected = age === id;
          return (
            <button
              key={id}
              role="radio"
              aria-checked={selected}
              onClick={() => setAge(id)}
              className={clsx(
                'relative rounded-3xl bg-surface p-6 text-left transition',
                selected ? 'shadow-float ring-[3px] ring-brand' : 'ring-1 ring-line hover:-translate-y-0.5 hover:ring-ink/25',
              )}
            >
              <div className="flex items-start justify-between">
                <span className={`grid size-14 place-items-center rounded-2xl ${tint}`}>
                  <Icon className="size-7" />
                </span>
                <span className={clsx('grid size-7 place-items-center rounded-full transition', selected ? 'bg-brand text-white' : 'ring-2 ring-line')}>
                  {selected ? <Check className="size-4" /> : null}
                </span>
              </div>
              <p className="mt-6 font-display text-3xl font-bold">{id.replace('-', '–')}</p>
              <p className="mt-1 font-display text-lg font-semibold">{title}</p>
              <p className="mt-2 text-muted">{desc}</p>
            </button>
          );
        })}
      </div>
      <Footer>
        <button onClick={onNext} disabled={!age} className={buttonClass('primary', 'lg')}>
          {t('next')}
          <ArrowRight className="size-5" />
        </button>
      </Footer>
    </>
  );
}

function RealityStep({ onNext }: { onNext: () => void }) {
  const t = useTranslations();
  return (
    <>
      <Chip tone="coral" dot="var(--color-coral)">
        {t('stats.eyebrow')}
      </Chip>
      <div className="mt-4">
        <StepTitle title={t('stats.title')} />
      </div>
      <div className="mt-8">
        <Stats compact />
      </div>
      <p className="mt-4 rounded-3xl bg-surface p-5 leading-relaxed ring-1 ring-line">{t('stats.note')}</p>
      <Footer>
        <button onClick={onNext} className={buttonClass('primary', 'lg')}>
          {t('onboarding.next')}
          <ArrowRight className="size-5" />
        </button>
      </Footer>
    </>
  );
}

type Question = { task: string; answer: Actor; options: { actor: Actor; hint: string }[]; explanation: string };

function QuizStep({ onNext }: { onNext: () => void }) {
  const t = useTranslations('onboarding.quiz');
  const tp = useTranslations('professions.actors');
  const { addXp } = useProgress();
  const questions = t.raw('questions') as Question[];
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<Actor | null>(null);
  const [earned, setEarned] = useState(0);
  const q = questions[index];
  const correct = picked === q.answer;
  const last = index === questions.length - 1;

  const pick = (a: Actor) => {
    if (picked) return;
    setPicked(a);
    if (a === q.answer) {
      addXp(10);
      setEarned((e) => e + 10);
    }
  };

  const advance = () => {
    if (last) return onNext();
    setIndex(index + 1);
    setPicked(null);
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <Chip>{t('question', { current: index + 1, total: questions.length })}</Chip>
        <Chip tone="lime">+{earned} XP</Chip>
      </div>
      <div className="mt-4">
        <StepTitle title={t('title')} />
      </div>

      <div key={index} className="animate-rise">
        <div className="mt-8 rounded-3xl bg-ink p-6 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-widest text-lime">{t('task')}</p>
          <p className="mt-3 font-display text-lg font-medium leading-relaxed text-white sm:text-xl">{q.task}</p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {q.options.map((o) => {
            const isAnswer = picked && o.actor === q.answer;
            const wrong = picked === o.actor && !correct;
            return (
              <button
                key={o.actor}
                onClick={() => pick(o.actor)}
                disabled={!!picked && !isAnswer && !wrong}
                className={clsx(
                  'rounded-3xl bg-surface p-5 text-left transition disabled:opacity-50',
                  isAnswer && 'bg-success-soft ring-2 ring-success',
                  wrong && 'bg-coral-soft ring-2 ring-coral',
                  !picked && 'ring-1 ring-line hover:-translate-y-0.5 hover:ring-brand',
                )}
              >
                <Chip tone={actorTone[o.actor]}>{tp(o.actor)}</Chip>
                <p className="mt-3 text-sm text-muted">{o.hint}</p>
              </button>
            );
          })}
        </div>

        {picked ? (
          <div className={clsx('mt-4 animate-rise rounded-3xl bg-surface p-5 ring-2', correct ? 'ring-success' : 'ring-coral')}>
            <p className={clsx('font-display font-semibold', correct ? 'text-success' : 'text-coral-ink')}>{correct ? t('correct') : t('wrong')}</p>
            <p className="mt-1 leading-relaxed">{q.explanation}</p>
          </div>
        ) : null}
      </div>

      <Footer>
        <button onClick={advance} disabled={!picked} className={buttonClass('primary', 'lg')}>
          {last ? t('finish') : t('next')}
          <ArrowRight className="size-5" />
        </button>
      </Footer>
    </>
  );
}

type Skill = 'critical' | 'logic' | 'prompting' | 'problem';
type CheckQuestion = { skill: Skill; text: string; options: string[]; answer: number; explanation: string };

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

function CheckStep({ onNext }: { onNext: () => void }) {
  const t = useTranslations('onboarding.check');
  const { addXp, saveAssessment } = useProgress();
  const questions = t.raw('questions') as CheckQuestion[];
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);
  const q = questions[index];
  const correct = picked === q.answer;
  const last = index === questions.length - 1;

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    setAnswers((a) => [...a, i === q.answer]);
    if (i === q.answer) addXp(10);
  };

  const advance = () => {
    if (!last) {
      setIndex(index + 1);
      setPicked(null);
      return;
    }
    saveAssessment(answers);
    setShowResult(true);
  };

  if (showResult) return <CheckResult questions={questions} answers={answers} onNext={onNext} />;

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <Chip tone="sky">
          <Brain className="size-3.5" />
          {t('badge')}
        </Chip>
        <Chip>{t('question', { current: index + 1, total: questions.length })}</Chip>
      </div>
      <div className="mt-4">
        <StepTitle title={t('title')} subtitle={index === 0 ? t('subtitle') : undefined} />
      </div>

      <div key={index} className="animate-rise">
        <div className="mt-8 rounded-3xl bg-surface p-6 shadow-card ring-1 ring-line sm:p-7">
          <p className="text-xs font-bold uppercase tracking-widest text-brand">{t(`skills.${q.skill}`)}</p>
          <p className="mt-3 font-display text-lg font-medium leading-relaxed sm:text-xl">{q.text}</p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {q.options.map((o, i) => {
            const isAnswer = picked !== null && i === q.answer;
            const wrong = picked === i && !correct;
            return (
              <button
                key={o}
                onClick={() => pick(i)}
                disabled={picked !== null && !isAnswer && !wrong}
                className={clsx(
                  'flex items-center gap-3 rounded-2xl bg-surface p-4 text-left font-medium transition disabled:opacity-50',
                  isAnswer && 'bg-success-soft ring-2 ring-success',
                  wrong && 'bg-coral-soft ring-2 ring-coral',
                  picked === null && 'ring-1 ring-line hover:-translate-y-0.5 hover:ring-brand',
                )}
              >
                <span
                  className={clsx(
                    'grid size-8 shrink-0 place-items-center rounded-xl font-display text-sm font-bold',
                    isAnswer ? 'bg-success text-white' : wrong ? 'bg-coral text-white' : 'bg-canvas text-muted',
                  )}
                >
                  {OPTION_LETTERS[i]}
                </span>
                {o}
              </button>
            );
          })}
        </div>

        {picked !== null ? (
          <div className={clsx('mt-4 animate-rise rounded-3xl bg-surface p-5 ring-2', correct ? 'ring-success' : 'ring-coral')}>
            <p className={clsx('font-display font-semibold', correct ? 'text-success' : 'text-coral-ink')}>{correct ? t('correct') : t('wrong')}</p>
            <p className="mt-1 leading-relaxed">{q.explanation}</p>
          </div>
        ) : null}
      </div>

      <Footer>
        <button onClick={advance} disabled={picked === null} className={buttonClass('primary', 'lg')}>
          {last ? t('finish') : t('next')}
          <ArrowRight className="size-5" />
        </button>
      </Footer>
    </>
  );
}

function CheckResult({ questions, answers, onNext }: { questions: CheckQuestion[]; answers: boolean[]; onNext: () => void }) {
  const t = useTranslations('onboarding.check');
  const score = answers.filter(Boolean).length;
  const level = assessmentLevel(score, questions.length);
  const skills = [...new Set(questions.map((q) => q.skill))];
  const strong = skills.filter((s) => questions.every((q, i) => q.skill !== s || answers[i]));
  const growth = skills.filter((s) => !strong.includes(s));

  return (
    <div className="animate-rise">
      <div className="relative overflow-hidden rounded-[32px] bg-brand p-7 text-white sm:p-9">
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-lime/30 blur-2xl" />
        <Trophy className="relative size-10 text-lime" />
        <h1 className="relative mt-5 font-display text-3xl font-bold sm:text-4xl">{t('resultTitle', { score, total: questions.length })}</h1>
        <div className="relative mt-5 flex gap-1.5">
          {answers.map((ok, i) => (
            <span key={i} className={clsx('h-2 flex-1 rounded-full', ok ? 'bg-lime' : 'bg-white/25')} />
          ))}
        </div>
        <p className="relative mt-6 text-sm font-semibold uppercase tracking-widest text-white/70">{t('levelLabel')}</p>
        <p className="relative mt-1 font-display text-2xl font-bold">{t(`levels.${level}`)}</p>
        <p className="relative mt-2 max-w-lg text-white/85">{t(`levelText.${level}`)}</p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <SkillList icon={<Check className="size-4" />} title={t('strengths')} items={strong.map((s) => t(`skills.${s}`))} tone="success" />
        <SkillList icon={<TrendingUp className="size-4" />} title={t('growth')} items={growth.map((s) => t(`skills.${s}`))} tone="sky" />
      </div>

      <Footer>
        <button onClick={onNext} className={buttonClass('primary', 'lg')}>
          {t('continue')}
          <ArrowRight className="size-5" />
        </button>
      </Footer>
    </div>
  );
}

function SkillList({ icon, title, items, tone }: { icon: ReactNode; title: string; items: string[]; tone: 'success' | 'sky' }) {
  if (!items.length) return null;
  return (
    <div className="rounded-3xl bg-surface p-5 ring-1 ring-line">
      <p className={clsx('flex items-center gap-2 text-sm font-bold', tone === 'success' ? 'text-success' : 'text-sky-ink')}>
        {icon}
        {title}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((s) => (
          <Chip key={s} tone={tone}>
            {s}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function InsightStep({ onNext }: { onNext: () => void }) {
  const t = useTranslations('onboarding.insight');
  const points = t.raw('points') as { title: string; desc: string }[];
  const dots = ['bg-coral', 'bg-sky', 'bg-sun'];

  return (
    <>
      <span className="inline-flex rounded-full bg-lime px-3 py-1 text-[13px] font-semibold text-ink">{t('badge')}</span>
      <div className="mt-4">
        <StepTitle dark title={t('title')} />
      </div>

      <div className="mt-8 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 sm:gap-3">
        <span className="rounded-2xl bg-white px-3 py-4 text-center text-sm font-bold text-ink">{t('skills')}</span>
        <span className="font-display text-xl font-bold text-white">+</span>
        <span className="rounded-2xl bg-brand px-3 py-4 text-center text-sm font-bold text-white">{t('ai')}</span>
        <span className="font-display text-xl font-bold text-white">=</span>
        <span className="rounded-2xl bg-lime px-3 py-4 text-center text-sm font-bold text-ink">{t('result')}</span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {points.map((p, i) => (
          <div key={p.title} className="rounded-3xl bg-ink-2 p-5">
            <span className={`block size-3 rounded-full ${dots[i]}`} />
            <p className="mt-4 font-semibold text-white">{p.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{p.desc}</p>
          </div>
        ))}
      </div>

      <Footer>
        <button onClick={onNext} className={buttonClass('lime', 'lg')}>
          {t('cta')}
          <ArrowRight className="size-5" />
        </button>
      </Footer>
    </>
  );
}

function InterestsStep() {
  const t = useTranslations('onboarding.interests');
  const router = useRouter();
  const { interests, toggleInterest, finishOnboarding } = useProgress();
  const items = t.raw('items') as string[];
  const ready = interests.length >= MIN_INTERESTS;

  const finish = () => {
    finishOnboarding();
    router.push('/app');
  };

  return (
    <>
      <StepTitle title={t('title')} subtitle={t('subtitle')} />
      <div className="mt-8 flex flex-wrap gap-2.5">
        {items.map((item, i) => {
          const on = interests.includes(i);
          return (
            <button
              key={item}
              role="checkbox"
              aria-checked={on}
              onClick={() => toggleInterest(i)}
              className={clsx(
                'inline-flex h-12 items-center gap-2 rounded-full px-5 font-medium transition',
                on ? 'bg-brand text-white shadow-[0_8px_20px_-8px_rgb(24_119_242/0.6)]' : 'bg-surface ring-1 ring-line hover:ring-brand',
              )}
            >
              {on ? <Check className="size-4" /> : null}
              {item}
            </button>
          );
        })}
      </div>

      {ready ? (
        <div className="mt-8 flex animate-rise items-center gap-4 rounded-3xl bg-lime-soft p-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-lime font-display font-bold">{interests.length}</span>
          <p className="leading-relaxed">{t('example', { topic: items[interests[0]].toLowerCase() })}</p>
        </div>
      ) : null}

      <Footer>
        <button onClick={finish} disabled={!ready} className={buttonClass('primary', 'lg')}>
          {ready ? t('cta') : t('more', { count: MIN_INTERESTS - interests.length })}
          <ArrowRight className="size-5" />
        </button>
      </Footer>
    </>
  );
}
