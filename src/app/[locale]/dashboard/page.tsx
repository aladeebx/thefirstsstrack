'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Users, Package, CheckCircle, Clock, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Stats {
  totalCustomers: number;
  totalShipments: number;
  activeShipments: number;
  deliveredShipments: number;
  pendingShipments: number;
}

interface Shipment {
  id: string;
  trackingNumber: string;
  status: string;
  origin: string;
  destination: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
  };
}

export default function DashboardPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentShipments, setRecentShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      setStats(data.stats);
      setRecentShipments(data.recentShipments);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-soft-black">{t('dashboard.title')}</h1>

      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={t('dashboard.stats.totalCustomers')}
          value={stats?.totalCustomers || 0}
          icon={<Users className="h-4 w-4 text-gray-500" />}
        />
        <StatsCard
          title={t('dashboard.stats.activeShipments')}
          value={stats?.activeShipments || 0}
          icon={<Package className="h-4 w-4 text-primary-red" />}
        />
        <StatsCard
          title={t('dashboard.stats.delivered')}
          value={stats?.deliveredShipments || 0}
          icon={<CheckCircle className="h-4 w-4 text-green-500" />}
        />
        <StatsCard
          title={t('dashboard.stats.pending')}
          value={stats?.pendingShipments || 0}
          icon={<Clock className="h-4 w-4 text-orange-500" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Recent Shipments */}
        <Card className="border-0 shadow-lg shadow-gray-100/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">{t('dashboard.recentShipments')}</CardTitle>
            <Link href={`/${locale}/dashboard/shipments`} className="text-sm text-primary-red hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                  <tr>
                    <th className="px-4 py-3 font-medium rounded-l-lg">{t('dashboard.shipments.trackingNumber')}</th>
                    <th className="px-4 py-3 font-medium">{t('dashboard.shipments.customer')}</th>
                    <th className="px-4 py-3 font-medium">{t('dashboard.shipments.status')}</th>
                    <th className="px-4 py-3 font-medium text-right rounded-r-lg">{t('dashboard.shipments.date')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentShipments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-500">
                        {locale === 'ar' ? 'لا توجد شحنات بعد' : 'No shipments yet'}
                      </td>
                    </tr>
                  ) : (
                    recentShipments.map((shipment) => (
                      <tr key={shipment.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-4 py-3 font-medium">
                          <Link
                            href={`/${locale}/track/${shipment.trackingNumber}`}
                            className="text-soft-black hover:text-primary-red transition-colors"
                          >
                            {shipment.trackingNumber}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{shipment.customer.name}</td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className={`
                            ${shipment.status.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
                            ${shipment.status.toLowerCase() === 'pending' ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' : ''}
                            ${shipment.status.toLowerCase() === 'transit' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : ''}
                          `}>
                            {shipment.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right text-gray-400 font-mono text-xs">
                          {format(new Date(shipment.createdAt), 'MMM dd')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  );
}

function StatsCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <Card className="border-0 shadow-subtle hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-soft-black">{value}</div>
      </CardContent>
    </Card>
  )
}

