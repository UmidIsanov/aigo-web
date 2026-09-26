'use client';

import { createContext, ReactNode, useContext, useMemo, useSyncExternalStore } from 'react';
import type { TrackId } from './course';

export type Profile = {
  name: string;
  age: number | null;
  /** Square JPEG data URL, already downscaled (see lib/image.ts). */
  photo: string | null;
};

type Progress = {
  profile: Profile;
  /** Interest tracks in the order the child picked them; they become the first modules of the path. */
  interests: TrackId[];
  xp: number;
  onboarded: boolean;
  /** Question ids that already gave XP — each question pays out only once. */
  rewarded: string[];
  /** Course task ids the student has finished (solved or saw the explanation). */
  completed: string[];
  /** Course task the student is on; null means "first unfinished task". */
  cursor: string | null;
};

type ProgressApi = Progress & {
  updateProfile: (patch: Partial<Profile>) => void;
  toggleInterest: (track: TrackId) => void;
  /** Adds XP for a question once; returns false if this question was already rewarded. */
  award: (questionId: string, xp: number) => boolean;
  completeTask: (taskId: string) => void;
  setCursor: (taskId: string | null) => void;
  finishOnboarding: () => void;
  reset: () => void;
};

const STORAGE_KEY = 'aigo-progress-v3';
const LEGACY_KEY = 'aigo-progress-v2';

const initial: Progress = {
  profile: { name: '', age: null, photo: null },
  interests: [],
  xp: 0,
  onboarded: false,
  rewarded: [],
  completed: [],
  cursor: null,
};

// Progress lives in localStorage so it survives reloads and new sessions in this browser.
// useSyncExternalStore keeps SSR (initial) and the client in sync; the storage event syncs other tabs.
const listeners = new Set<() => void>();
let current: Progress | null = null;

function load(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      return { ...initial, ...saved, profile: { ...initial.profile, ...saved.profile } };
    }
    // Carry XP and finished tasks over from the previous version; the new onboarding asks the rest.
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const old = JSON.parse(legacy);
      return { ...initial, xp: old.xp ?? 0, rewarded: old.rewarded ?? [], completed: old.completed ?? [] };
    }
  } catch {
    // Storage can be unavailable (private mode) or hold broken JSON — fall back to a fresh start.
  }
  return initial;
}

function read(): Progress {
  current ??= load();
  return current;
}

function write(next: Progress) {
  current = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Quota or private mode: progress still works for this session.
  }
  listeners.forEach((l) => l());
}

function onStorage(e: StorageEvent) {
  if (e.key !== STORAGE_KEY) return;
  current = load();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener('storage', onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener('storage', onStorage);
  };
}

const Ctx = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, read, () => initial);

  const api = useMemo<ProgressApi>(() => {
    const update = (patch: (s: Progress) => Partial<Progress>) => write({ ...read(), ...patch(read()) });
    return {
      ...state,
      updateProfile: (patch) => update((s) => ({ profile: { ...s.profile, ...patch } })),
      toggleInterest: (track) =>
        update((s) => ({ interests: s.interests.includes(track) ? s.interests.filter((x) => x !== track) : [...s.interests, track] })),
      award: (questionId, xp) => {
        if (read().rewarded.includes(questionId)) return false;
        update((s) => ({ xp: s.xp + xp, rewarded: [...s.rewarded, questionId] }));
        return true;
      },
      completeTask: (taskId) => update((s) => (s.completed.includes(taskId) ? {} : { completed: [...s.completed, taskId] })),
      setCursor: (cursor) => update(() => ({ cursor })),
      finishOnboarding: () => update(() => ({ onboarded: true, cursor: null })),
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

const noopSubscribe = () => () => {};

/** False during SSR and hydration, true once the saved progress is visible — use before redirecting. */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
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
