import { setRequestLocale } from 'next-intl/server';
import { Dashboard } from '@/components/app/Dashboard';

export default async function Page({ params }: PageProps<'/[locale]/app'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Dashboard />;
}
