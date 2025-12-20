'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function DashboardHeader() {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push(`/${locale}/login`);
    };

    const switchLocale = () => {
        const newLocale = locale === 'en' ? 'ar' : 'en';
        const path = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(path);
    };

    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-md px-6 shadow-sm">
            <div className="md:hidden">
                {/* Mobile menu trigger would go here */}
                <span className="text-lg font-bold">TrakoShip</span>
            </div>
            <div className="flex flex-1 justify-end gap-4">
                <Button variant="ghost" size="sm" onClick={switchLocale} className="gap-2">
                    <Globe className="h-4 w-4" />
                    {locale === 'en' ? 'العربية' : 'English'}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="h-4 w-4" />
                    {locale === 'ar' ? 'خروج' : 'Logout'}
                </Button>
            </div>
        </header>
    );
}
