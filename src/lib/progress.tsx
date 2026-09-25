'use client';

import { createContext, ReactNode, useContext, useMemo, useSyncExternalStore } from 'react';

export type AgeGroup = '10-12' | '13-16';

type Progress = {
  age: AgeGroup | null;
  /** Indices into onboarding.interests.items, so the choice survives a language switch. */
  interests: number[];
  xp: number;
  lessonProgress: number;
  onboarded: boolean;
  /** Onboarding thinking check: one entry per question, true if answered correctly. */
  assessment: boolean[] | null;
};

type ProgressApi = Progress & {
  setAge: (a: AgeGroup) => void;
  toggleInterest: (i: number) => void;
  addXp: (n: number) => void;
  completeLessonTask: () => void;
  finishOnboarding: () => void;
  saveAssessment: (answers: boolean[]) => void;
  reset: () => void;
};

const STORAGE_KEY = 'aigo-progress-v1';

const initial: Progress = { age: null, interests: [], xp: 290, lessonProgress: 3, onboarded: false, assessment: null };

// Progress lives in localStorage; useSyncExternalStore keeps SSR (initial) and the client in sync.
const listeners = new Set<() => void>();
let current: Progress | null = null;

function read(): Progress {
  if (current) return current;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    current = raw ? { ...initial, ...JSON.parse(raw) } : initial;
  } catch {
    // Storage can be unavailable (private mode) — fall back to in-memory progress.
    current = initial;
  }
  return current!;
}

function write(next: Progress) {
  current = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore write failures; progress still works for this session.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const Ctx = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, read, () => initial);

  const api = useMemo<ProgressApi>(() => {
    const update = (patch: (s: Progress) => Partial<Progress>) => write({ ...read(), ...patch(read()) });
    return {
      ...state,
      setAge: (age) => update(() => ({ age })),
      toggleInterest: (i) =>
        update((s) => ({ interests: s.interests.includes(i) ? s.interests.filter((x) => x !== i) : [...s.interests, i] })),
      addXp: (n) => update((s) => ({ xp: s.xp + n })),
      completeLessonTask: () => update((s) => ({ lessonProgress: Math.min(10, s.lessonProgress + 1) })),
      finishOnboarding: () => update(() => ({ onboarded: true })),
      saveAssessment: (answers) => update(() => ({ assessment: answers })),
      reset: () => write(initial),
    };
  }, [state]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useProgress() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useProgress must be used inside ProgressProvider');
  return v;
}

export const XP_PER_LEVEL = 500;
const LEVEL_TITLES = ['AI Explorer', 'AI Researcher', 'Critical Thinker', 'AI Creator', 'AI Coder'];

export function levelInfo(xp: number) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  return {
    level,
    title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)],
    next: LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)],
    inLevel: xp % XP_PER_LEVEL,
  };
}

export type AssessmentLevel = 'start' | 'middle' | 'advanced';

export function assessmentLevel(score: number, total: number): AssessmentLevel {
  if (score === total) return 'advanced';
  return score >= Math.ceil(total / 2) ? 'middle' : 'start';
}
