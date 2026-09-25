// Course structure helpers. Content lives in messages/*.json under `course.modules`;
// every locale has the same shape, so task ids are stable across languages.

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

export type TaskRef = { id: string; module: number; lesson: number; task: number };

export const taskId = (module: number, lesson: number, task: number) => `m${module + 1}-l${lesson + 1}-t${task + 1}`;

export function flattenCourse(modules: CourseModule[]): TaskRef[] {
  return modules.flatMap((m, mi) =>
    m.lessons.flatMap((l, li) => l.tasks.map((_, ti) => ({ id: taskId(mi, li, ti), module: mi, lesson: li, task: ti }))),
  );
}

/** Where the student is: the explicit cursor, else the first unfinished task, else null (course done). */
export function currentTask(refs: TaskRef[], completed: string[], cursor: string | null): TaskRef | null {
  return refs.find((r) => r.id === cursor) ?? refs.find((r) => !completed.includes(r.id)) ?? null;
}

export function nextTask(refs: TaskRef[], id: string): TaskRef | null {
  const i = refs.findIndex((r) => r.id === id);
  return i >= 0 ? (refs[i + 1] ?? null) : null;
}
