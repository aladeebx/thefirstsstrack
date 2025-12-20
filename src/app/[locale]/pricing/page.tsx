import { useTranslations, useLocale } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PricingContent from '@/components/PricingContent';
import { AnimatedSection } from '@/components/ui/animations/AnimatedSection';

export default function PricingPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = useTranslations();
  const currentLocale = useLocale();

  const plans = [
    {
      name: t('pricing.free.name'),
      price: 0,
      customers: t('pricing.free.customers'),
      shipments: t('pricing.free.shipments'),
      features: t('pricing.free.features'),
      support: t('pricing.free.support'),
      highlighted: false,
      icon: 'zap'
    },
    {
      name: t('pricing.basic.name'),
      price: 25,
      customers: t('pricing.basic.customers'),
      shipments: t('pricing.basic.shipments'),
      features: t('pricing.basic.features'),
      support: t('pricing.basic.support'),
      highlighted: true,
      icon: 'crown'
    },
    {
      name: t('pricing.pro.name'),
      price: 100,
      customers: t('pricing.pro.customers'),
      shipments: t('pricing.pro.shipments'),
      features: t('pricing.pro.features'),
      support: t('pricing.pro.support'),
      highlighted: false,
      icon: 'building'
    },
  ];

  return (
    <div className="min-h-screen bg-pure-white flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="bg-soft-black text-white py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
          <AnimatedSection className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">{t('pricing.title')}</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">{t('pricing.subtitle')}</p>
          </AnimatedSection>
        </div>

        <section className="py-20 -mt-20 relative z-20">
          <PricingContent
            plans={plans}
            monthlyText={t('pricing.monthly')}
            yearlyText={currentLocale === 'ar' ? 'سنوي' : 'Yearly'}
            startTrialText={t('pricing.startTrial')}
            choosePlanText={t('pricing.choosePlan')}
            mostPopularText={currentLocale === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}

