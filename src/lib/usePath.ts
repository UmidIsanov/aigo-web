'use client';

import { useTranslations } from 'next-intl';
import { buildPath, CourseModule, currentTask, flattenPath, TrackId, TrackModule } from './course';
import { useProgress } from './progress';

/** The current child's personalised path (interests + age) and where they are in it. */
export function usePath() {
  const tCourse = useTranslations('course');
  const tProgram = useTranslations('program');
  const { interests, profile, completed, cursor } = useProgress();

  const path = buildPath(
    { modules: tCourse.raw('modules') as CourseModule[], tracks: tCourse.raw('tracks') as Record<TrackId, TrackModule> },
    tProgram.raw('modules') as { name: string; desc: string }[],
    interests,
    profile.age,
  );
  const refs = flattenPath(path);
  return { path, refs, current: currentTask(refs, completed, cursor) };
}
