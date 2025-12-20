'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowLeft, ArrowRight } from 'lucide-react';
import { FloatingInput } from '@/components/ui/FloatingInput';
import { Button } from '@/components/ui/Button';
import { AnimatedSection } from '@/components/ui/animations/AnimatedSection';

export default function LoginPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Redirect to dashboard
      router.push(`/${locale}/dashboard`);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 lg:px-24 xl:px-32 relative z-10 bg-white">
        <div className="mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center text-gray-500 hover:text-primary-red transition-colors text-sm font-medium">
            {isRTL ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
            {t('common.backToHome')}
          </Link>
        </div>

        <AnimatedSection direction="up" className="w-full max-w-md mx-auto px-4 sm:px-0">
          <div className="mb-10 text-center lg:text-start space-y-4">
            <div className="w-12 h-12 bg-primary-red/10 rounded-xl flex items-center justify-center mb-6 mx-auto lg:mx-0 text-primary-red">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-soft-black mb-3">{t('auth.login.title')}</h1>
            <p className="text-gray-500 text-base leading-relaxed">{t('auth.login.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <FloatingInput
              label={t('auth.login.email')}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              startIcon={<Mail className="w-5 h-5" />}
            />

            <FloatingInput
              label={t('auth.login.password')}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              startIcon={<Lock className="w-5 h-5" />}
            />

            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center cursor-pointer group flex-1">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-red border-gray-300 rounded focus:ring-2 focus:ring-primary-red focus:ring-offset-2 cursor-pointer transition-all"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                />
                <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-sm text-gray-600 group-hover:text-gray-900 transition-colors font-medium`}>
                  {t('auth.login.rememberMe')}
                </span>
              </label>
              <a href="#" className="text-sm font-medium text-primary-red hover:text-red-700 transition-colors whitespace-nowrap">
                {t('auth.login.forgotPassword')}
              </a>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl flex items-start animate-shake">
                <span className="font-medium mr-1">Error:</span> {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-14 text-base rounded-xl font-bold uppercase tracking-wide"
              loading={loading}
            >
              {t('auth.login.submit')}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            {t('auth.login.noAccount')}{' '}
            <Link href={`/${locale}/register`} className="font-semibold text-primary-red hover:text-red-700 hover:underline transition-colors">
              {t('auth.login.signUp')}
            </Link>
          </p>
        </AnimatedSection>
      </div>

      {/* Right Side - Image/Visual */}
      <div className="hidden lg:block lg:w-1/2 relative bg-soft-black overflow-hidden">
        <div className="absolute inset-0 bg-[url('/about-bg-pattern.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-red/20 to-soft-black/90" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 text-center z-10">
          <AnimatedSection delay={0.2} className="max-w-xl">
            <h2 className="text-4xl font-bold mb-6">Manage your shipments with ease.</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Join thousands of logistics companies that trust TrakoShip for their daily operations. Fast, secure, and reliable.
            </p>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}

