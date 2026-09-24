import { setRequestLocale } from 'next-intl/server';
import { PortfolioView } from '@/components/app/PortfolioView';

export default async function Page({ params }: PageProps<'/[locale]/app/portfolio'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PortfolioView />;
}
