import { setRequestLocale } from 'next-intl/server';
import { ProfileView } from '@/components/app/ProfileView';

export default async function Page({ params }: PageProps<'/[locale]/app/profile'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProfileView />;
}
