// Course structure helpers. Content lives in messages/*.json under `course.modules` (core modules 1–3)
// and `course.tracks` (interest modules); every locale has the same shape, so task ids are stable.

export type Difficulty = 'easy' | 'medium' | 'challenge';

export type CourseTask = {
  difficulty: Difficulty;
  question: string;
  options: string[];
  answer: number;
  hints: [string, string];
  explanation: string;
};

export type CourseLesson = { title: string; tasks: CourseTask[] };
export type CourseModule = { lessons: CourseLesson[] };
export type TrackModule = CourseModule & { name: string; desc: string };

export const TRACKS = ['games', 'creative', 'science', 'sport'] as const;
export type TrackId = (typeof TRACKS)[number];
export const TRACK_EMOJI: Record<TrackId, string> = { games: '🎮', creative: '🎨', science: '🔬', sport: '⚽' };

export type PathTask = CourseTask & { id: string };
export type PathLesson = { title: string; tasks: PathTask[] };
export type PathModule = { id: string; kind: 'track' | 'core'; name: string; desc: string; lessons: PathLesson[] };

export type TaskRef = { id: string; module: number; lesson: number; task: number };

/** Children up to 12 get Easy and Medium tasks; Challenge tasks start at 13. */
export const isJunior = (age: number | null) => age !== null && age <= 12;

// Ids come from a task's position in the full content, not the age-filtered path,
// so progress stays valid if the child's age (and therefore the filter) changes.
const taskId = (moduleId: string, lesson: number, task: number) => `${moduleId}-l${lesson + 1}-t${task + 1}`;

function toPathModule(id: string, kind: PathModule['kind'], name: string, desc: string, source: CourseModule, junior: boolean): PathModule {
  return {
    id,
    kind,
    name,
    desc,
    lessons: source.lessons.map((l, li) => ({
      title: l.title,
      tasks: l.tasks
        .map((t, ti) => ({ ...t, id: taskId(id, li, ti) }))
        .filter((t) => !(junior && t.difficulty === 'challenge')),
    })),
  };
}

/** The child's personal path: chosen interest modules first, then the shared core modules. */
export function buildPath(
  content: { modules: CourseModule[]; tracks: Record<TrackId, TrackModule> },
  coreInfo: { name: string; desc: string }[],
  interests: TrackId[],
  age: number | null,
): PathModule[] {
  const junior = isJunior(age);
  const tracks = interests.map((id) => toPathModule(id, 'track', content.tracks[id].name, content.tracks[id].desc, content.tracks[id], junior));
  const core = content.modules.map((m, i) => toPathModule(`m${i + 1}`, 'core', coreInfo[i].name, coreInfo[i].desc, m, junior));
  return [...tracks, ...core];
}

export function flattenPath(path: PathModule[]): TaskRef[] {
  return path.flatMap((m, mi) => m.lessons.flatMap((l, li) => l.tasks.map((t, ti) => ({ id: t.id, module: mi, lesson: li, task: ti }))));
}

/** Where the student is: the explicit cursor, else the first unfinished task, else null (path done). */
export function currentTask(refs: TaskRef[], completed: string[], cursor: string | null): TaskRef | null {
  return refs.find((r) => r.id === cursor) ?? refs.find((r) => !completed.includes(r.id)) ?? null;
}

export function nextTask(refs: TaskRef[], id: string): TaskRef | null {
  const i = refs.findIndex((r) => r.id === id);
  return i >= 0 ? (refs[i + 1] ?? null) : null;
}

export const doneCount = (tasks: { id: string }[], completed: string[]) => tasks.filter((t) => completed.includes(t.id)).length;
