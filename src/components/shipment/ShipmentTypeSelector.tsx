'use client';

import { useTranslations } from 'next-intl';
import { Package } from 'lucide-react';

interface ShipmentTypeSelectorProps {
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}

const COMMON_TYPES = [
    'Clothing',
    'Medicine',
    'Electronics',
    'Documents',
    'Food',
    'Furniture',
    'Machinery',
    'Chemicals',
    'Automotive Parts',
    'Textiles'
];

export function ShipmentTypeSelector({ value, onChange, required = false }: ShipmentTypeSelectorProps) {
    const t = useTranslations();

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {t('dashboard.shipments.shipmentType')}
                {required && <span className="text-primary-red ml-1">*</span>}
            </label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Package className="w-5 h-5" />
                </div>
                <input
                    type="text"
                    list="shipment-types"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                    placeholder={t('dashboard.shipments.shipmentTypePlaceholder')}
                    className="w-full h-12 pl-12 pr-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-red focus:border-primary-red outline-none transition-all"
                />
                <datalist id="shipment-types">
                    {COMMON_TYPES.map((type) => (
                        <option key={type} value={type} />
                    ))}
                </datalist>
            </div>
        </div>
    );
}
