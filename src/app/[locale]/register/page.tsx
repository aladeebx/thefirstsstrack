'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Building2, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { FloatingInput } from '@/components/ui/FloatingInput';
import { Button } from '@/components/ui/Button';
import { AnimatedSection } from '@/components/ui/animations/AnimatedSection';

export default function RegisterPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.acceptTerms) {
      setError('You must accept the terms and conditions');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: formData.companyName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
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
      {/* Right Side - Image/Visual (Swapped for Register) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-soft-black overflow-hidden order-last">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-bl from-primary-red/20 to-soft-black/90" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 text-center z-10">
          <AnimatedSection delay={0.2} className="max-w-xl">
            <h2 className="text-4xl font-bold mb-6">Start your journey with us.</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Create your account today and experience the next generation of shipment tracking and management.
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 lg:px-24 xl:px-32 relative z-10 bg-white">
        <div className="mb-8 pt-8 lg:pt-0">
          <Link href={`/${locale}`} className="inline-flex items-center text-gray-500 hover:text-primary-red transition-colors text-sm font-medium">
            {isRTL ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
            {t('common.backToHome')}
          </Link>
        </div>

        <AnimatedSection direction="up" className="w-full max-w-md mx-auto px-4 sm:px-0">
          <div className="mb-10 text-center lg:text-start space-y-4">
            <div className="w-12 h-12 bg-primary-red/10 rounded-xl flex items-center justify-center mb-6 mx-auto lg:mx-0 text-primary-red">
              <User className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-soft-black mb-3">{t('auth.register.title')}</h1>
            <p className="text-gray-500 text-base leading-relaxed">{t('auth.register.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <FloatingInput
              label={t('auth.register.companyName')}
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
              startIcon={<Building2 className="w-5 h-5" />}
            />

            <FloatingInput
              label={t('auth.register.email')}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              startIcon={<Mail className="w-5 h-5" />}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FloatingInput
                label={t('auth.register.password')}
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                startIcon={<Lock className="w-5 h-5" />}
              />

              <FloatingInput
                label={t('auth.register.confirmPassword')}
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                startIcon={<Lock className="w-5 h-5" />}
              />
            </div>

            <div className="flex items-start">
              <label className="flex items-start cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-1 text-primary-red border-gray-300 rounded focus:ring-2 focus:ring-primary-red focus:ring-offset-2 cursor-pointer transition-all"
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                  required
                />
                <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-sm text-gray-600 group-hover:text-gray-900 transition-colors leading-snug font-medium`}>
                  {t('auth.register.acceptTerms')}
                </span>
              </label>
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
              {t('auth.register.submit')}
            </Button>
          </form>

          <p className="mt-8 mb-8 lg:mb-0 text-center text-sm text-gray-600">
            {t('auth.register.hasAccount')}{' '}
            <Link href={`/${locale}/login`} className="font-semibold text-primary-red hover:text-red-700 hover:underline transition-colors">
              {t('auth.register.signIn')}
            </Link>
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
}

