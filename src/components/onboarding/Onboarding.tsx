'use client';

import clsx from 'clsx';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ReactNode, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { isJunior, TRACK_EMOJI, TrackId } from '@/lib/course';
import { useProgress } from '@/lib/progress';
import { usePath } from '@/lib/usePath';
import { PhotoPicker } from '../Avatar';
import { LocaleSwitcher } from '../LocaleSwitcher';
import { Logo } from '../Logo';
import { TrackPicker } from '../TrackPicker';
import { buttonClass, Chip } from '../ui';

// Onboarding only asks what we need to tailor the path: name (+ photo), age and interests.
const STEPS = ['name', 'age', 'interests', 'ready'] as const;
const AGES = [10, 11, 12, 13, 14, 15, 16];

export function Onboarding() {
  const t = useTranslations('onboarding');
  const [step, setStep] = useState(0);
  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));

  return (
    <div className="min-h-screen bg-canvas">
      <div className="bg-dots pointer-events-none fixed inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_60%)]" />
      <header className="relative mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <LocaleSwitcher />
      </header>

      <main className="relative mx-auto max-w-3xl px-4 pb-16 pt-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            aria-label={t('back')}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-surface ring-1 ring-line transition hover:ring-ink/30 disabled:opacity-0"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div className="flex flex-1 gap-1.5">
            {STEPS.map((s, i) => (
              <span key={s} className={clsx('h-1.5 flex-1 rounded-full transition-colors', i <= step ? 'bg-brand' : 'bg-line')} />
            ))}
          </div>
          <span className="shrink-0 text-sm font-semibold text-muted">{t('step', { current: step + 1, total: STEPS.length })}</span>
        </div>

        <div key={step} className="mt-10 animate-rise">
          {STEPS[step] === 'name' && <NameStep onNext={next} />}
          {STEPS[step] === 'age' && <AgeStep onNext={next} />}
          {STEPS[step] === 'interests' && <InterestsStep onNext={next} />}
          {STEPS[step] === 'ready' && <ReadyStep />}
        </div>
      </main>
    </div>
  );
}

function StepTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-xl text-center">
      <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">{title}</h1>
      {subtitle ? <p className="mt-3 text-lg text-muted">{subtitle}</p> : null}
    </div>
  );
}

function Footer({ children }: { children: ReactNode }) {
  return <div className="mt-10 flex flex-wrap justify-end gap-3">{children}</div>;
}

function NameStep({ onNext }: { onNext: () => void }) {
  const t = useTranslations('onboarding');
  const { profile, updateProfile } = useProgress();
  const ready = profile.name.trim().length > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) onNext();
      }}
    >
      <StepTitle title={t('name.title')} subtitle={t('name.subtitle')} />
      <div className="mx-auto mt-8 max-w-sm">
        <PhotoPicker />
        <p className="mt-1 text-center text-xs text-muted">{t('name.photoHint')}</p>
        <input
          autoFocus
          value={profile.name}
          onChange={(e) => updateProfile({ name: e.target.value })}
          placeholder={t('name.placeholder')}
          maxLength={30}
          aria-label={t('name.placeholder')}
          className="mt-6 h-14 w-full rounded-2xl bg-surface px-5 text-center font-display text-xl font-semibold outline-none ring-1 ring-line transition placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-muted focus:ring-2 focus:ring-brand"
        />
      </div>
      <Footer>
        <button type="submit" disabled={!ready} className={buttonClass('primary', 'lg')}>
          {t('next')}
          <ArrowRight className="size-5" />
        </button>
      </Footer>
    </form>
  );
}

function AgeStep({ onNext }: { onNext: () => void }) {
  const t = useTranslations('onboarding');
  const { profile, updateProfile } = useProgress();

  const pick = (age: number) => {
    updateProfile({ age });
    // A short pause lets the child see the selection before moving on.
    setTimeout(onNext, 250);
  };

  return (
    <>
      <StepTitle title={t('age.title', { name: profile.name.trim() })} subtitle={t('age.subtitle')} />
      <div role="radiogroup" className="mx-auto mt-8 grid max-w-xl grid-cols-4 gap-3 sm:grid-cols-7">
        {AGES.map((age) => {
          const selected = profile.age === age;
          return (
            <button
              key={age}
              role="radio"
              aria-checked={selected}
              onClick={() => pick(age)}
              className={clsx(
                'flex aspect-square flex-col items-center justify-center rounded-3xl transition',
                selected ? 'bg-brand text-white shadow-float' : 'bg-surface ring-1 ring-line hover:-translate-y-1 hover:ring-brand',
              )}
            >
              <span className="font-display text-3xl font-bold">{age}</span>
              <span className={clsx('text-xs font-medium', selected ? 'text-white/80' : 'text-muted')}>{t('age.unit', { age })}</span>
            </button>
          );
        })}
      </div>
      <Footer>
        <button onClick={onNext} disabled={profile.age === null} className={buttonClass('primary', 'lg')}>
          {t('next')}
          <ArrowRight className="size-5" />
        </button>
      </Footer>
    </>
  );
}

function InterestsStep({ onNext }: { onNext: () => void }) {
  const t = useTranslations('onboarding.interests');
  const { interests } = useProgress();
  const ready = interests.length > 0;

  return (
    <>
      <StepTitle title={t('title')} subtitle={t('subtitle')} />
      <div className="mt-8">
        <TrackPicker />
      </div>
      <Footer>
        <button onClick={onNext} disabled={!ready} className={buttonClass('primary', 'lg')}>
          {ready ? t('cta') : t('pickOne')}
          <ArrowRight className="size-5" />
        </button>
      </Footer>
    </>
  );
}

function ReadyStep() {
  const t = useTranslations('onboarding.ready');
  const router = useRouter();
  const { profile, finishOnboarding } = useProgress();
  const { path } = usePath();

  const go = (href: '/app/lesson' | '/app') => {
    finishOnboarding();
    router.push(href);
  };

  return (
    <>
      <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-lime">
        <Sparkles className="size-8 text-ink" />
      </span>
      <div className="mt-6">
        <StepTitle title={t('title', { name: profile.name.trim() })} subtitle={t('subtitle')} />
      </div>

      <ol className="mt-8 space-y-2.5">
        {path.slice(0, 5).map((m, i) => {
          const tasks = m.lessons.reduce((n, l) => n + l.tasks.length, 0);
          const first = i === 0;
          return (
            <li key={m.id} className={clsx('flex items-center gap-4 rounded-3xl p-4', first ? 'bg-brand text-white shadow-float' : 'bg-surface ring-1 ring-line')}>
              <span className={clsx('grid size-11 shrink-0 place-items-center rounded-2xl text-2xl', first ? 'bg-white/15' : 'bg-canvas')}>
                {m.kind === 'track' ? TRACK_EMOJI[m.id as TrackId] : <span className="font-display text-base font-bold">{i + 1}</span>}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display font-semibold">{m.name}</span>
                <span className={clsx('block truncate text-sm', first ? 'text-white/80' : 'text-muted')}>{m.desc}</span>
              </span>
              {m.kind === 'track' ? (
                <Chip tone={first ? 'lime' : 'brand'} className="hidden sm:inline-flex">
                  {t('forYou')}
                </Chip>
              ) : null}
              <span className={clsx('shrink-0 text-sm font-semibold', first ? 'text-white/85' : 'text-muted')}>{t('tasks', { count: tasks })}</span>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-center text-sm text-muted">{isJunior(profile.age) ? t('junior') : t('teen')}</p>

      <Footer>
        <button onClick={() => go('/app')} className={buttonClass('secondary', 'lg')}>
          {t('later')}
        </button>
        <button onClick={() => go('/app/lesson')} className={buttonClass('primary', 'lg')}>
          {t('start')}
          <ArrowRight className="size-5" />
        </button>
      </Footer>
    </>
  );
}
