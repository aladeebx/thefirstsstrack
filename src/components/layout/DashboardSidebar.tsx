'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Package, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardSidebar() {
    const t = useTranslations();
    const locale = useLocale();
    const pathname = usePathname();

    const links = [
        {
            href: `/${locale}/dashboard`,
            label: t('dashboard.title'),
            icon: LayoutDashboard,
            active: pathname === `/${locale}/dashboard`,
        },
        {
            href: `/${locale}/dashboard/customers`,
            label: t('dashboard.customers.title'),
            icon: Users,
            active: pathname.includes('/customers'),
        },
        {
            href: `/${locale}/dashboard/shipments`,
            label: t('dashboard.shipments.title'),
            icon: Package,
            active: pathname.includes('/shipments'),
        },
        {
            href: `/${locale}/dashboard/settings`,
            label: t('dashboard.settings.title'),
            icon: Settings,
            active: pathname.includes('/settings'),
        },
    ];

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-soft-black text-pure-white transition-transform duration-300 ease-in-out md:translate-x-0 hidden md:flex flex-col">
            <div className="flex h-16 items-center border-b border-gray-800 px-6">
                <Link href={`/${locale}/`} className="text-2xl font-bold tracking-tight text-white">
                    Trako<span className="text-primary-red">Ship</span>
                </Link>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                link.active
                                    ? "bg-primary-red text-white"
                                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            <link.icon className="h-5 w-5" />
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="border-t border-gray-800 p-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white">
                        CN
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">Current User</p>
                        <p className="text-xs text-gray-500">Admin</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
