import { Bot, Lock, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Chip } from '../ui';

// Each project records the problem, the solution, AI's role and the student's role (PRD §27).
export function PortfolioView() {
  const t = useTranslations('app.portfolioPage');
  const skills = t.raw('skills') as string[];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">{t('title')}</h1>
      <p className="mt-2 text-lg text-muted">{t('subtitle')}</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <article className="rounded-[28px] bg-surface p-7 shadow-card ring-1 ring-line">
          <Chip tone="lime">{t('tag')}</Chip>
          <h2 className="mt-4 font-display text-2xl font-bold">{t('projectTitle')}</h2>
          <dl className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-muted">{t('problemLabel')}</dt>
              <dd className="mt-1.5 leading-relaxed">{t('problem')}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-muted">{t('solutionLabel')}</dt>
              <dd className="mt-1.5 leading-relaxed">{t('solution')}</dd>
            </div>
          </dl>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-brand-soft p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-brand">
                <Bot className="size-4" />
                {t('aiRole')}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed">{t('aiRoleText')}</p>
            </div>
            <div className="rounded-2xl bg-coral-soft p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-coral-ink">
                <User className="size-4" />
                {t('humanRole')}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed">{t('humanRoleText')}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {skills.map((s) => (
              <Chip key={s} tone="neutral">
                {s}
              </Chip>
            ))}
          </div>
        </article>

        <div className="grid place-items-center rounded-[28px] border-2 border-dashed border-line p-8 text-center">
          <div>
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-surface ring-1 ring-line">
              <Lock className="size-5 text-muted" />
            </span>
            <p className="mt-4 max-w-[220px] text-muted">{t('next')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
