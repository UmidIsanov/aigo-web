'use client';

import clsx from 'clsx';
import { Lightbulb } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Chip, SectionTitle, Tone } from '../ui';

export type Actor = 'ai' | 'human' | 'together';

type Profession = { name: string; tasks: { title: string; actor: Actor }[]; takeaway: string };

export const actorTone: Record<Actor, Tone> = { ai: 'brand', human: 'coral', together: 'lime' };

export function ProfessionExplorer() {
  const t = useTranslations('professions');
  const items = t.raw('items') as Profession[];
  const [active, setActive] = useState(0);
  const p = items[active];

  return (
    <section id="how" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

        <div className="mt-10 grid gap-6 lg:grid-cols-[280px_1fr]">
          <div role="tablist" className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {items.map((item, i) => (
              <button
                key={item.name}
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={clsx(
                  'flex shrink-0 items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left font-display text-[15px] font-semibold transition',
                  i === active ? 'bg-ink text-white shadow-float' : 'bg-surface text-ink ring-1 ring-line hover:ring-ink/25',
                )}
              >
                {item.name}
                <span className={clsx('hidden text-xs lg:inline', i === active ? 'text-lime' : 'text-muted')}>0{i + 1}</span>
              </button>
            ))}
            <div className="hidden gap-2 pt-4 lg:flex lg:flex-wrap">
              {(['ai', 'together', 'human'] as Actor[]).map((a) => (
                <Chip key={a} tone={actorTone[a]}>
                  {t(`actors.${a}`)}
                </Chip>
              ))}
            </div>
          </div>

          <div key={active} className="animate-rise overflow-hidden rounded-3xl bg-surface shadow-card ring-1 ring-line">
            <ul className="divide-y divide-line px-6">
              {p.tasks.map((task) => (
                <li key={task.title} className="flex items-center justify-between gap-4 py-4">
                  <span className="font-medium">{task.title}</span>
                  <Chip tone={actorTone[task.actor]}>{t(`actors.${task.actor}`)}</Chip>
                </li>
              ))}
            </ul>
            <div className="flex gap-3 bg-sun-soft px-6 py-5">
              <Lightbulb className="mt-0.5 size-5 shrink-0 text-sun-ink" />
              <p className="leading-relaxed">
                <span className="font-semibold">{t('takeawayLabel')}: </span>
                {p.takeaway}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
