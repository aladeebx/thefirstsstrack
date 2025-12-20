'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Package, User, MapPin, Scale, FileText } from 'lucide-react';
import { FloatingInput } from '@/components/ui/FloatingInput';
import { Button } from '@/components/ui/Button';
import { AnimatedSection } from '@/components/ui/animations/AnimatedSection';

export default function NewShipmentPage({ params: { locale } }: { params: { locale: string } }) {
    const t = useTranslations();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        senderName: '',
        senderAddress: '',
        receiverName: '',
        receiverAddress: '',
        weight: '',
        content: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            // In real implementation: await fetch('/api/shipments', { method: 'POST', body: JSON.stringify(formData) });

            router.push(`/${locale}/dashboard/shipments`);
        } catch (error) {
            console.error('Failed to create shipment', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <AnimatedSection direction="up">
                <div className="bg-white rounded-2xl shadow-subtle p-8 border border-gray-100">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse mb-8">
                        <div className="w-12 h-12 bg-primary-red/10 rounded-xl flex items-center justify-center text-primary-red">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-soft-black">
                                {t('dashboard.shipments.new.title') || 'Create New Shipment'}
                            </h1>
                            <p className="text-gray-500 text-sm">
                                {t('dashboard.shipments.new.subtitle') || 'Enter shipment details below'}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FloatingInput
                                label={t('dashboard.shipments.new.senderName') || 'Sender Name'}
                                value={formData.senderName}
                                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                                required
                                startIcon={<User className="w-5 h-5" />}
                            />

                            <FloatingInput
                                label={t('dashboard.shipments.new.senderAddress') || 'Sender Address'}
                                value={formData.senderAddress}
                                onChange={(e) => setFormData({ ...formData, senderAddress: e.target.value })}
                                required
                                startIcon={<MapPin className="w-5 h-5" />}
                            />
                        </div>

                        <div className="border-t border-gray-100 my-6" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FloatingInput
                                label={t('dashboard.shipments.new.receiverName') || 'Receiver Name'}
                                value={formData.receiverName}
                                onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                                required
                                startIcon={<User className="w-5 h-5" />}
                            />

                            <FloatingInput
                                label={t('dashboard.shipments.new.receiverAddress') || 'Receiver Address'}
                                value={formData.receiverAddress}
                                onChange={(e) => setFormData({ ...formData, receiverAddress: e.target.value })}
                                required
                                startIcon={<MapPin className="w-5 h-5" />}
                            />
                        </div>

                        <div className="border-t border-gray-100 my-6" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FloatingInput
                                label={t('dashboard.shipments.new.weight') || 'Weight (kg)'}
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                required
                                type="number"
                                startIcon={<Scale className="w-5 h-5" />}
                            />

                            <FloatingInput
                                label={t('dashboard.shipments.new.content') || 'Content Description'}
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                required
                                startIcon={<FileText className="w-5 h-5" />}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="button" variant="ghost" className="mr-4" onClick={() => router.back()}>
                                {t('common.cancel') || 'Cancel'}
                            </Button>
                            <Button type="submit" loading={loading} className="min-w-[150px]">
                                {t('common.create') || 'Create Shipment'}
                            </Button>
                        </div>
                    </form>
                </div>
            </AnimatedSection>
        </div>
    );
}
