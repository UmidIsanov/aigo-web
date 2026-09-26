import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Onest, Unbounded } from 'next/font/google';
import { notFound } from 'next/navigation';
import { ProgressProvider } from '@/lib/progress';
import { routing } from '@/i18n/routing';
import '../globals.css';

const onest = Onest({
  variable: '--font-onest',
  subsets: ['latin', 'latin-ext', 'cyrillic'],
});

const unbounded = Unbounded({
  variable: '--font-unbounded',
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['500', '600', '700'],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} data-scroll-behavior="smooth" className={`${onest.variable} ${unbounded.variable} h-full`}>
      <body className="min-h-full">
        <NextIntlClientProvider>
          <ProgressProvider>{children}</ProgressProvider>
        </NextIntlClientProvider>
        {/* Vercel Web Analytics (visits, pages, countries) and Speed Insights; they only report on Vercel deployments. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
