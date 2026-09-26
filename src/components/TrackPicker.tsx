'use client';

import clsx from 'clsx';
import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TRACK_EMOJI, TrackId, TRACKS, TrackModule } from '@/lib/course';
import { useProgress } from '@/lib/progress';

/** Interest tiles; the order of selection sets the order of interest modules on the path. */
export function TrackPicker({ compact }: { compact?: boolean }) {
  const tracks = useTranslations('course').raw('tracks') as Record<TrackId, TrackModule>;
  const { interests, toggleInterest } = useProgress();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {TRACKS.map((id) => {
        const on = interests.includes(id);
        return (
          <button
            key={id}
            role="checkbox"
            aria-checked={on}
            onClick={() => toggleInterest(id)}
            className={clsx(
              'relative flex items-center gap-4 rounded-3xl text-left transition',
              compact ? 'p-3' : 'p-5',
              on ? 'bg-brand text-white shadow-float' : 'bg-surface ring-1 ring-line hover:-translate-y-0.5 hover:ring-brand',
            )}
          >
            <span
              className={clsx(
                'grid shrink-0 place-items-center rounded-2xl',
                compact ? 'size-11 text-2xl' : 'size-16 text-4xl',
                on ? 'bg-white/15' : 'bg-canvas',
              )}
            >
              {TRACK_EMOJI[id]}
            </span>
            <span className="min-w-0 flex-1">
              <span className={clsx('block font-display font-semibold', compact ? 'text-[15px]' : 'text-lg')}>{tracks[id].name}</span>
              {compact ? null : <span className={clsx('mt-1 block text-sm', on ? 'text-white/80' : 'text-muted')}>{tracks[id].desc}</span>}
            </span>
            <span className={clsx('grid size-7 shrink-0 place-items-center rounded-full', on ? 'bg-white text-brand' : 'ring-2 ring-line')}>
              {on ? <Check className="size-4" /> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
