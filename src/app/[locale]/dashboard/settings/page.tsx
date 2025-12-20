'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  User as UserIcon,
  Building2,
  Mail,
  Calendar,
  CreditCard,
  Zap,
  ShieldCheck,
  Code2,
  Copy,
  CheckCheck,
  ExternalLink,
  LayoutDashboard
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AnimatedSection } from '@/components/ui/animations/AnimatedSection';

interface UserData {
  id: string;
  email: string;
  companyName: string;
  plan: string;
  createdAt: string;
}

export default function SettingsPage() {
  const t = useTranslations('dashboard.settings');
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [baseUrl, setBaseUrl] = useState('https://trackoship.com');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    fetchUserData();
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'id' | 'code') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-red border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-red-50 p-4 mb-4">
          <ShieldCheck className="h-8 w-8 text-primary-red" />
        </div>
        <h3 className="text-lg font-semibold text-soft-black">{t('errorLoading')}</h3>
        <p className="text-gray-500">{t('refreshPage')}</p>
      </div>
    );
  }

  const widgetCode = `<script type="text/javascript" src="${baseUrl}/api/script/widget.js?code=${user.id}"></script>`;

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-4 md:p-8">
      {/* Header */}
      <AnimatedSection className="space-y-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-50 rounded-lg">
            <LayoutDashboard className="w-6 h-6 text-primary-red" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-soft-black">
            {t('title')}
          </h1>
        </div>
        <p className="text-gray-500 text-lg max-w-2xl">
          {t('pageDescription')}
        </p>
      </AnimatedSection>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Company Profile */}
        <AnimatedSection delay={0.1} className="h-full">
          <Card className="h-full border-t-4 border-t-primary-red shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-5 h-5 text-primary-red" />
                <CardTitle>{t('profile')}</CardTitle>
              </div>
              <CardDescription>{t('profileDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 transition-all hover:bg-white hover:shadow-md hover:border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white rounded-lg shadow-sm group-hover:bg-red-50 transition-colors">
                      <UserIcon className="w-5 h-5 text-gray-500 group-hover:text-primary-red" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t('companyName')}</p>
                      <p className="font-semibold text-soft-black text-base">{user.companyName}</p>
                    </div>
                  </div>
                </div>

                <div className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 transition-all hover:bg-white hover:shadow-md hover:border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white rounded-lg shadow-sm group-hover:bg-red-50 transition-colors">
                      <Mail className="w-5 h-5 text-gray-500 group-hover:text-primary-red" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t('emailAddress')}</p>
                      <p className="font-semibold text-soft-black text-base">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 transition-all hover:bg-white hover:shadow-md hover:border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white rounded-lg shadow-sm group-hover:bg-red-50 transition-colors">
                      <Calendar className="w-5 h-5 text-gray-500 group-hover:text-primary-red" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t('memberSince')}</p>
                      <p className="font-semibold text-soft-black text-base">
                        {new Date(user.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Current Plan */}
        <AnimatedSection delay={0.2} className="h-full">
          <Card className="h-full border-t-4 border-t-soft-black shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="w-5 h-5 text-soft-black" />
                  <CardTitle>{t('plan')}</CardTitle>
                </div>
                <Badge variant={user.plan === 'PRO' ? 'default' : 'secondary'} className="px-3 py-1 text-sm">
                  {user.plan} PLAN
                </Badge>
              </div>
              <CardDescription>{t('planDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-5 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-inner">
                <div className="space-y-3">
                  {user.plan === 'FREE' && (
                    <>
                      <PlanFeature text={t('features.limit50')} />
                      <PlanFeature text={t('features.limit500')} />
                      <PlanFeature text={t('features.basicFeatures')} />
                    </>
                  )}
                  {user.plan === 'BASIC' && (
                    <>
                      <PlanFeature text={t('features.limit200')} />
                      <PlanFeature text={t('features.limit2000')} />
                      <PlanFeature text={t('features.advancedAnalytics')} />
                      <PlanFeature text={t('features.emailSupport')} />
                    </>
                  )}
                  {user.plan === 'PRO' && (
                    <>
                      <PlanFeature text={t('features.unlimitedCustomers')} highlight />
                      <PlanFeature text={t('features.unlimitedShipments')} highlight />
                      <PlanFeature text={t('features.apiAccess')} highlight />
                      <PlanFeature text={t('features.prioritySupport')} highlight />
                    </>
                  )}
                </div>
              </div>

              {user.plan !== 'PRO' && (
                <div className="pt-2">
                  <Button className="w-full bg-primary-red hover:bg-red-700 text-white font-semibold py-6 text-lg shadow-red-200 shadow-xl" size="lg">
                    <Zap className="w-5 h-5 mr-2 fill-current" />
                    {t('upgrade')}
                  </Button>
                  <p className="text-center text-xs text-gray-400 mt-3">
                    {t('upgradeDescription')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>

      {/* Tracking Widget - Modern Dark UI */}
      <AnimatedSection delay={0.3}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black text-white shadow-2xl">
          <div className="absolute top-0 right-0 p-32 bg-primary-red/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

          <div className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-red/20 text-primary-red text-xs font-bold uppercase tracking-wider mb-4 border border-primary-red/20">
                    <Code2 className="w-3 h-3" />
                    {t('widget.whiteLabel')}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">{t('widget.title')}</h2>
                  <p className="text-gray-400 leading-relaxed">
                    {t('widget.description')}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <ShieldCheck className="w-6 h-6 text-emerald-400 mb-2" />
                    <h4 className="font-semibold text-white text-sm">{t('widget.secure')}</h4>
                    <p className="text-xs text-gray-400 mt-1">{t('widget.secureDesc')}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <LayoutDashboard className="w-6 h-6 text-blue-400 mb-2" />
                    <h4 className="font-semibold text-white text-sm">{t('widget.zeroBranding')}</h4>
                    <p className="text-xs text-gray-400 mt-1">{t('widget.zeroBrandingDesc')}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full max-w-xl bg-white/5 rounded-xl border border-white/10 p-6 backdrop-blur-sm">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                      {t('widget.companyId')}
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-blue-300 truncate">
                        {user.id}
                      </div>
                      <Button
                        variant="secondary"
                        className="bg-white text-black hover:bg-gray-200 font-semibold"
                        onClick={() => copyToClipboard(user.id, 'id')}
                      >
                        {copiedId ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block flex justify-between">
                      <span>{t('widget.embedCode')}</span>
                      <a
                        href={`/embed/search?userId=${user.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-red hover:underline flex items-center gap-1 normal-case"
                      >
                        {t('widget.preview')} <ExternalLink className="w-3 h-3" />
                      </a>
                    </label>
                    <div className="relative group">
                      <div className="bg-black/80 border border-white/10 rounded-lg p-4 font-mono text-xs text-gray-300 overflow-x-auto whitespace-nowrap scrollbar-hide text-left" dir="ltr">
                        {widgetCode}
                      </div>
                      <div className="absolute right-2 top-2 rtl:left-2 rtl:right-auto">
                        <Button
                          size="sm"
                          className="h-8 bg-white/10 hover:bg-white/20 text-white border-none"
                          onClick={() => {
                            copyToClipboard(widgetCode, 'code');
                          }}
                        >
                          {copiedCode ? (
                            <span className="flex items-center gap-1.5 text-emerald-400">
                              <CheckCheck className="w-3.5 h-3.5" /> {t('widget.copied')}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5">
                              <Copy className="w-3.5 h-3.5" /> {t('widget.copyCode')}
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {t('widget.instruction')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

function PlanFeature({ text, highlight = false }: { text: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`
        flex items-center justify-center w-5 h-5 rounded-full 
        ${highlight ? 'bg-primary-red text-white' : 'bg-green-100 text-green-600'}
      `}>
        <CheckCheck className="w-3 h-3" />
      </div>
      <span className={`text-sm ${highlight ? 'font-semibold text-soft-black' : 'text-gray-600'}`}>
        {text}
      </span>
    </div>
  );
}
