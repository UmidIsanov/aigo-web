import { setRequestLocale } from 'next-intl/server';
import { Onboarding } from '@/components/onboarding/Onboarding';

export default async function StartPage({ params }: PageProps<'/[locale]/start'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Onboarding />;
}
