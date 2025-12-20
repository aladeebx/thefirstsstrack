import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Users,
  Package,
  Barcode,
  LayoutDashboard,
  Code2,
  Globe,
  Webhook,
  CheckCircle2, // Using CheckCircle2 for list items
  Zap
} from 'lucide-react';
import { AnimatedSection } from '@/components/ui/animations/AnimatedSection';
import { StaggerContainer, StaggerItem } from '@/components/ui/animations/StaggerContainer';
import { HoverCard } from '@/components/ui/animations/HoverCard';

export default function FeaturesPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = useTranslations();

  const features = [
    {
      icon: Users,
      key: 'customerManagement'
    },
    {
      icon: Package,
      key: 'shipmentTracking'
    },
    {
      icon: Barcode,
      key: 'autoTracking'
    },
    {
      icon: LayoutDashboard,
      key: 'dashboard'
    },
    {
      icon: Code2,
      key: 'embedWidget'
    },
    {
      icon: Globe,
      key: 'multilingual'
    },
    {
      icon: Webhook,
      key: 'apiAccess'
    }
  ];

  return (
    <div className="min-h-screen bg-pure-white flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-soft-black text-pure-white py-24 lg:py-32">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-red/10 to-transparent" />

          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection className="max-w-3xl">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-red/10 border border-primary-red/20 text-primary-red mb-6">
                <Zap className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{t('features.badge')}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                {t('features.title')}
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                {t('features.subtitle')}
              </p>
            </AnimatedSection>
          </div>
        </div>

        {/* Features Grid */}
        <section className="py-24 bg-light-gray/20">
          <div className="container mx-auto px-4">
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <StaggerItem key={feature.key} className="h-full">
                  <HoverCard className="h-full bg-white p-8 rounded-2xl shadow-subtle border border-gray-100 group hover:border-primary-red/20 transition-colors">
                    <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-red group-hover:text-white transition-colors duration-300">
                      <feature.icon className="w-7 h-7" />
                    </div>

                    <h3 className="text-2xl font-bold text-soft-black mb-4 group-hover:text-primary-red transition-colors">
                      {t(`features.${feature.key}.title`)}
                    </h3>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {t(`features.${feature.key}.description`)}
                    </p>

                    <ul className="space-y-3">
                      {(t.raw(`features.${feature.key}.items`) as string[]).map((item, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-500">
                          <CheckCircle2 className="w-4 h-4 text-primary-red mt-0.5 mr-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* CTA Section */}
        <AnimatedSection direction="up" className="bg-soft-black py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t('features.cta.title')}</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">{t('features.cta.subtitle')}</p>
            <button className="bg-primary-red text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors transform hover:scale-105 duration-200">
              {t('features.cta.button')}
            </button>
          </div>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
}

