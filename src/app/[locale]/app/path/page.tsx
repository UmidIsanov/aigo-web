import { setRequestLocale } from 'next-intl/server';
import { PathView } from '@/components/app/PathView';

export default async function Page({ params }: PageProps<'/[locale]/app/path'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PathView />;
}
