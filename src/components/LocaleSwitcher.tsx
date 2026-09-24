'use client';

import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Locale, routing } from '@/i18n/routing';

export function LocaleSwitcher({ dark }: { dark?: boolean }) {
  const t = useTranslations('lang');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const change = (next: Locale) =>
    startTransition(() => {
      router.replace(pathname, { locale: next, scroll: false });
    });

  return (
    <div
      role="radiogroup"
      aria-label={t('label')}
      className={clsx(
        'inline-flex items-center rounded-full p-1 text-xs font-bold transition-opacity',
        dark ? 'bg-ink-2' : 'bg-surface ring-1 ring-line',
        pending && 'opacity-60',
      )}
    >
      {routing.locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            role="radio"
            aria-checked={active}
            title={t(l)}
            onClick={() => change(l)}
            className={clsx(
              'h-8 min-w-10 rounded-full px-2.5 uppercase tracking-wide transition',
              active ? 'bg-brand text-white' : dark ? 'text-ink-muted hover:text-white' : 'text-muted hover:text-ink',
            )}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
