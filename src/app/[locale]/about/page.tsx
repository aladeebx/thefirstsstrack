import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Target, Lightbulb, Rocket, Star, Info } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/animations/AnimatedSection';

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = useTranslations();

  const sections = [
    {
      icon: Target,
      key: 'mission',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Lightbulb,
      key: 'problem',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      icon: Rocket,
      key: 'vision',
      color: 'bg-primary-red/10 text-primary-red',
    },
  ];

  return (
    <div className="min-h-screen bg-pure-white flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Parallax-style Hero */}
        <div className="relative h-[60vh] min-h-[400px] flex items-center overflow-hidden bg-soft-black">
          <div className="absolute inset-0 bg-[url('/about-bg-pattern.svg')] opacity-20 animate-pulse-slow" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-soft-black/90" />

          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection direction="up" className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-8 text-white">
                <Info className="w-8 h-8" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                {t('about.title')}
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {t('about.tagline')}
              </p>
            </AnimatedSection>
          </div>
        </div>

        {/* Story Sections (Timeline/Zigzag) */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 w-px h-full bg-gray-100 -translate-x-1/2 hidden md:block" />

          <div className="container mx-auto px-4 space-y-32">
            {sections.map((section, index) => (
              <div key={section.key} className={`relative flex flex-col md:flex-row items-center gap-12 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                {/* Center Node (Hidden on Mobile) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary-red border-4 border-white shadow-lg hidden md:block z-10" />

                {/* Content Side */}
                <div className="w-full md:w-1/2">
                  <AnimatedSection direction={index % 2 === 0 ? "right" : "left"}>
                    <div className="bg-white p-8 rounded-3xl shadow-subtle border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                      <div className={`w-14 h-14 ${section.color} rounded-2xl flex items-center justify-center mb-6`}>
                        <section.icon className="w-7 h-7" />
                      </div>
                      <h2 className="text-3xl font-bold text-soft-black mb-4">
                        {t(`about.${section.key}.title`)}
                      </h2>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {t(`about.${section.key}.content`)}
                      </p>
                    </div>
                  </AnimatedSection>
                </div>

                {/* Visual Side */}
                <div className="w-full md:w-1/2 flex justify-center">
                  <AnimatedSection delay={0.2} direction={index % 2 === 0 ? "left" : "right"}>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-primary-red/5 rounded-3xl transform rotate-6 group-hover:rotate-12 transition-transform duration-500" />
                      <div className="w-64 h-64 md:w-80 md:h-80 bg-gray-50 rounded-3xl flex items-center justify-center relative z-10 border border-gray-100 transform group-hover:-translate-y-2 transition-transform duration-500">
                        <section.icon className={`w-32 h-32 ${section.color} opacity-20`} />
                      </div>
                    </div>
                  </AnimatedSection>
                </div>
              </div>
            ))}

            {/* Values Section */}
            <AnimatedSection direction="up" className="relative pt-20">
              <div className="bg-soft-black text-white rounded-[2.5rem] p-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-red/20 blur-[100px] rounded-full" />

                <div className="relative z-10 text-center mb-16">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-6">
                    <Star className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h2 className="text-4xl font-bold mb-4">{t('about.values.title')}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {['speed', 'clarity', 'simplicity'].map((value, i) => (
                    <div key={value} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <h3 className="text-xl font-bold mb-3">{t(`about.values.${value}`)}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

