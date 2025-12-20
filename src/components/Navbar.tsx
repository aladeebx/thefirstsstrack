'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    const path = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(path);
  };

  return (
    <nav className="fixed w-full bg-pure-white/90 backdrop-blur-md z-50 border-b border-light-gray h-20 flex items-center transition-all duration-300">
      <div className="container mx-auto px-4 flex justify-between items-center h-full">
        <Link href={`/${locale}/`} className="text-2xl font-bold tracking-tight text-soft-black hover:text-primary-red transition-colors duration-300">
          Trako<span className="text-primary-red">Ship</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href={`/${locale}/`} className="text-sm font-medium text-soft-black/80 hover:text-primary-red transition-colors duration-200">
            {t('nav.home')}
          </Link>
          <Link href={`/${locale}/features`} className="text-sm font-medium text-soft-black/80 hover:text-primary-red transition-colors duration-200">
            {t('nav.features')}
          </Link>
          <Link href={`/${locale}/pricing`} className="text-sm font-medium text-soft-black/80 hover:text-primary-red transition-colors duration-200">
            {t('nav.pricing')}
          </Link>
          <Link href={`/${locale}/about`} className="text-sm font-medium text-soft-black/80 hover:text-primary-red transition-colors duration-200">
            {t('nav.about')}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={switchLocale} className="text-sm font-medium text-soft-black/80 hover:text-primary-red transition-colors">
            {locale === 'en' ? 'العربية' : 'English'}
          </button>
          <Link href={`/${locale}/login`} className="hidden md:block text-sm font-medium text-soft-black/80 hover:text-primary-red transition-colors">
            {t('nav.login')}
          </Link>
          <Link href={`/${locale}/register`} className="bg-primary-red text-pure-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-all duration-300 font-medium text-sm active:scale-95 shadow-lg shadow-red-500/20">
            {t('nav.register')}
          </Link>
        </div>
      </div>
    </nav>
  );
}

