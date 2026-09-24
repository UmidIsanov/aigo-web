import { setRequestLocale } from 'next-intl/server';
import { Lesson } from '@/components/app/Lesson';

export default async function Page({ params }: PageProps<'/[locale]/app/lesson'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Lesson />;
}
