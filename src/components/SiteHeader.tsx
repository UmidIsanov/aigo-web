import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { LocaleSwitcher } from './LocaleSwitcher';
import { Logo } from './Logo';
import { buttonClass } from './ui';

export async function SiteHeader() {
  const t = await getTranslations('nav');
  const links = [
    { href: '#how', label: t('how') },
    { href: '#program', label: t('program') },
    { href: '#tutor', label: t('tutor') },
    { href: '#parents', label: t('parents') },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Logo />
        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="rounded-full px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <LocaleSwitcher />
          <Link href="/start" className={buttonClass('primary', 'sm', 'hidden sm:inline-flex')}>
            {t('start')}
          </Link>
        </div>
      </div>
    </header>
  );
}
