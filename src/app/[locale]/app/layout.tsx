import { setRequestLocale } from 'next-intl/server';
import { AppShell } from '@/components/app/AppShell';

export default async function AppLayout({ children, params }: LayoutProps<'/[locale]/app'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AppShell>{children}</AppShell>;
}
