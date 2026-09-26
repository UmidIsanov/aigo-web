'use client';

import clsx from 'clsx';
import { BookOpen, Briefcase, Home, Map, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ReactNode, useEffect } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { levelInfo, useHydrated, useProgress } from '@/lib/progress';
import { Avatar } from '../Avatar';
import { LocaleSwitcher } from '../LocaleSwitcher';
import { Logo } from '../Logo';

export function AppShell({ children }: { children: ReactNode }) {
  const t = useTranslations('app');
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useHydrated();
  const { xp, profile, onboarded } = useProgress();
  const lvl = levelInfo(xp);
  const name = profile.name.trim() || t('friend');

  // Without a profile there is no personal path yet, so send the child to the questionnaire first.
  useEffect(() => {
    if (hydrated && !onboarded) router.replace('/start');
  }, [hydrated, onboarded, router]);

  const links = [
    { href: '/app', label: t('nav.home'), icon: Home },
    { href: '/app/path', label: t('nav.path'), icon: Map },
    { href: '/app/lesson', label: t('nav.lesson'), icon: BookOpen },
    { href: '/app/portfolio', label: t('nav.portfolio'), icon: Briefcase },
    { href: '/app/profile', label: t('nav.profile'), icon: UserRound },
  ] as const;

  return (
    <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-[260px_1fr] lg:bg-[linear-gradient(to_right,var(--color-surface)_259px,var(--color-line)_259px,var(--color-line)_260px,var(--color-canvas)_260px)]">
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
          <Link href="/app/profile" className="flex items-center gap-3 rounded-2xl bg-ink p-4 text-white transition hover:bg-ink-2">
            <Avatar name={name} photo={profile.photo} className="size-11 text-base" />
            <span className="min-w-0">
              <span className="block truncate font-semibold">{name}</span>
              <span className="block text-xs font-bold uppercase tracking-widest text-lime">
                {xp} XP · {lvl.title}
              </span>
            </span>
          </Link>
          <LocaleSwitcher />
        </div>
      </aside>

      <div className="flex min-h-screen flex-col pb-24 lg:pb-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-canvas/85 px-4 backdrop-blur-xl lg:hidden">
          <Logo />
          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <Link href="/app/profile" aria-label={t('nav.profile')}>
              <Avatar name={name} photo={profile.photo} className="size-9 text-sm" />
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-8 lg:py-10">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className={clsx('flex flex-col items-center gap-1 py-3 text-[10px] font-semibold', active ? 'text-brand' : 'text-muted')}>
              <Icon className="size-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
