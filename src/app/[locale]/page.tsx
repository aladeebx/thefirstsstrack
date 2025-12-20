import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Package, Users, BarChart3, Globe, Zap, Shield, MousePointer2 } from 'lucide-react';

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <HomeContent locale={locale} />
      <Footer />
    </>
  );
}

function HomeContent({ locale }: { locale: string }) {
  const t = useTranslations();

  return (
    <div className="flex flex-col min-h-screen bg-pure-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-50/50 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-soft-black leading-[1.1]">
              {t('hero.title')}<span className="text-primary-red">.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href={`/${locale}/register`}>
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14 rounded-full shadow-xl shadow-red-500/20 hover:shadow-red-500/30">
                  {t('hero.getStarted')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href={`/${locale}/features`}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 h-14 rounded-full border-2">
                  {t('hero.watchDemo')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Abstract Dashboard Preview */}
          <div className="mt-20 relative max-w-5xl mx-auto animate-slide-up">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center bg-gray-50/50">
              <div className="text-center text-gray-400">
                <p className="text-sm font-medium uppercase tracking-widest mb-2">Dashboard Preview</p>
                <div className="w-16 h-1 bg-gray-200 rounded-full mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('features.title')}</h2>
            <p className="text-gray-500 text-lg">{t('features.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Users className="w-6 h-6 text-primary-red" />}
              title={t('features.customerManagement.title')}
              desc={t('features.customerManagement.description')}
            />
            <FeatureCard
              icon={<Package className="w-6 h-6 text-primary-red" />}
              title={t('features.shipmentTracking.title')}
              desc={t('features.shipmentTracking.description')}
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6 text-primary-red" />}
              title={t('features.autoTracking.title')}
              desc={t('features.autoTracking.description')}
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6 text-primary-red" />}
              title={t('features.embedWidget.title')}
              desc={t('features.embedWidget.description')}
            />
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-24 bg-pure-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{t('whyUs.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <WhyUsCard icon={<Zap className="w-8 h-8" />} title={t('whyUs.speed')} />
            <WhyUsCard icon={<Shield className="w-8 h-8" />} title={t('whyUs.clarity')} />
            <WhyUsCard icon={<MousePointer2 className="w-8 h-8" />} title={t('whyUs.simplicity')} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-soft-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gray-800 via-soft-black to-soft-black opacity-50" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 max-w-2xl mx-auto">
            {t('cta.title')}
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <Link href={`/${locale}/register`}>
            <Button size="lg" className="text-lg px-8 h-14 rounded-full bg-white text-soft-black hover:bg-gray-100 hover:text-primary-red border-0">
              {t('cta.button')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-subtle hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-soft-black">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
    </div>
  )
}

function WhyUsCard({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-soft-black">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-soft-black">{title}</h3>
    </div>
  )
}

