'use client';

import clsx from 'clsx';
import { BookOpen, Briefcase, Home, Map } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { levelInfo, useProgress } from '@/lib/progress';
import { LocaleSwitcher } from '../LocaleSwitcher';
import { Logo } from '../Logo';

export function AppShell({ children }: { children: ReactNode }) {
  const t = useTranslations('app');
  const pathname = usePathname();
  const { xp } = useProgress();
  const lvl = levelInfo(xp);

  const links = [
    { href: '/app', label: t('nav.home'), icon: Home },
    { href: '/app/path', label: t('nav.path'), icon: Map },
    { href: '/app/lesson', label: t('nav.lesson'), icon: BookOpen },
    { href: '/app/portfolio', label: t('nav.portfolio'), icon: Briefcase },
  ] as const;

  return (
    <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-line bg-surface p-5 lg:flex">
        <Logo className="px-2" />
        <nav className="mt-10 flex flex-col gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 font-medium transition',
                  active ? 'bg-brand-soft text-brand' : 'text-muted hover:bg-canvas hover:text-ink',
                )}
              >
                <Icon className="size-5" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-4">
          <div className="rounded-2xl bg-ink p-4 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-lime">{lvl.title}</p>
            <p className="mt-1 font-display text-2xl font-bold">{xp} XP</p>
          </div>
          <LocaleSwitcher />
        </div>
      </aside>

      <div className="flex min-h-screen flex-col pb-24 lg:pb-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-canvas/85 px-4 backdrop-blur-xl lg:hidden">
          <Logo />
          <LocaleSwitcher />
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-8 lg:py-10">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className={clsx('flex flex-col items-center gap-1 py-3 text-[11px] font-semibold', active ? 'text-brand' : 'text-muted')}>
              <Icon className="size-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
