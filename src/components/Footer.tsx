'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-soft-black text-pure-white py-16 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4 tracking-tight">Trako<span className="text-primary-red">Ship</span></h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              {locale === 'ar'
                ? 'منصة تتبع شحنات احترافية لشركات الشحن، توفر حلولاً ذكية لإدارة وتتبع الشحنات بكل سهولة.'
                : 'Professional shipment tracking platform for shipping companies, providing smart solutions for managing and tracking shipments with ease.'}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-6">
              {locale === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-3">
              <li><Link href={`/${locale}/`} className="text-gray-300 hover:text-primary-red transition-colors duration-200 text-sm">{t('nav.home')}</Link></li>
              <li><Link href={`/${locale}/features`} className="text-gray-300 hover:text-primary-red transition-colors duration-200 text-sm">{t('nav.features')}</Link></li>
              <li><Link href={`/${locale}/pricing`} className="text-gray-300 hover:text-primary-red transition-colors duration-200 text-sm">{t('nav.pricing')}</Link></li>
              <li><Link href={`/${locale}/about`} className="text-gray-300 hover:text-primary-red transition-colors duration-200 text-sm">{t('nav.about')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-6">
              {locale === 'ar' ? 'الحساب' : 'Account'}
            </h4>
            <ul className="space-y-3">
              <li><Link href={`/${locale}/login`} className="text-gray-300 hover:text-primary-red transition-colors duration-200 text-sm">{t('nav.login')}</Link></li>
              <li><Link href={`/${locale}/register`} className="text-gray-300 hover:text-primary-red transition-colors duration-200 text-sm">{t('nav.register')}</Link></li>
              <li><Link href={`/${locale}/dashboard`} className="text-gray-300 hover:text-primary-red transition-colors duration-200 text-sm">{t('nav.dashboard')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} TrakoShip. {locale === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.</p>
        </div>
      </div>
    </footer>
  );
}

