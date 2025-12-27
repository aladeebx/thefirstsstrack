'use client';

import { useTranslations } from 'next-intl';
import { Box, Package, Ruler } from 'lucide-react';

interface CargoUnitsSelectorProps {
    value: { type: string; quantity: number } | null;
    onChange: (value: { type: string; quantity: number }) => void;
    required?: boolean;
}

const CARGO_TYPES = [
    { key: 'containers', icon: Box, color: 'blue' },
    { key: 'parcels', icon: Package, color: 'green' },
    { key: 'cbm', icon: Ruler, color: 'purple' },
];

export function CargoUnitsSelector({ value, onChange, required = false }: CargoUnitsSelectorProps) {
    const t = useTranslations();

    const handleTypeChange = (type: string) => {
        onChange({
            type,
            quantity: value?.quantity || 1,
        });
    };

    const handleQuantityChange = (quantity: number) => {
        if (value) {
            onChange({
                ...value,
                quantity: Math.max(1, quantity),
            });
        }
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
                {t('dashboard.shipments.cargoUnits')}
                {required && <span className="text-primary-red ml-1">*</span>}
            </label>

            {/* Type Selection */}
            <div className="grid grid-cols-3 gap-3">
                {CARGO_TYPES.map((cargo) => {
                    const Icon = cargo.icon;
                    const isSelected = value?.type === cargo.key;
                    const label = t(`dashboard.shipments.cargoTypes.${cargo.key}`);

                    return (
                        <button
                            key={cargo.key}
                            type="button"
                            onClick={() => handleTypeChange(cargo.key)}
                            className={`relative p-4 border-2 rounded-xl transition-all ${isSelected
                                    ? 'border-primary-red bg-primary-red/5 shadow-sm'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <div
                                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${isSelected
                                            ? 'bg-primary-red text-white'
                                            : 'bg-gray-100 text-gray-400'
                                        }`}
                                >
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span
                                    className={`text-sm font-medium ${isSelected ? 'text-primary-red' : 'text-gray-700'
                                        }`}
                                >
                                    {label}
                                </span>
                            </div>
                            {isSelected && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-primary-red rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Quantity Input */}
            {value && (
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        {t('dashboard.shipments.cargoQuantity')}
                    </label>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => handleQuantityChange(value.quantity - 1)}
                            className="w-10 h-10 rounded-lg border border-gray-200 hover:border-primary-red hover:bg-primary-red/5 transition-colors flex items-center justify-center font-semibold text-gray-700"
                        >
                            −
                        </button>
                        <input
                            type="number"
                            min="1"
                            value={value.quantity}
                            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                            className="flex-1 h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-red focus:border-primary-red outline-none transition-all text-center font-semibold text-lg"
                        />
                        <button
                            type="button"
                            onClick={() => handleQuantityChange(value.quantity + 1)}
                            className="w-10 h-10 rounded-lg border border-gray-200 hover:border-primary-red hover:bg-primary-red/5 transition-colors flex items-center justify-center font-semibold text-gray-700"
                        >
                            +
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
