import { setRequestLocale } from 'next-intl/server';
import { Audience, FinalCta, SiteFooter } from '@/components/landing/Audience';
import { Hero } from '@/components/landing/Hero';
import { Method } from '@/components/landing/Method';
import { ProfessionExplorer } from '@/components/landing/ProfessionExplorer';
import { Program } from '@/components/landing/Program';
import { Stats } from '@/components/landing/Stats';
import { Tutor } from '@/components/landing/Tutor';
import { SiteHeader } from '@/components/SiteHeader';

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Stats />
        <ProfessionExplorer />
        <Method />
        <Program />
        <Tutor />
        <Audience />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
