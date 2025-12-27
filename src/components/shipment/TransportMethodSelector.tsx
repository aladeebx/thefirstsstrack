'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Truck, Ship, Plane, Train, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransportMethodSelectorProps {
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}

const TRANSPORT_METHODS = [
    { key: 'MULTIMODAL', icon: Ship },
    { key: 'INTERMODAL', icon: Truck },
    { key: 'COMBINED', icon: Ship },
    { key: 'THROUGH', icon: Truck },
    { key: 'DOOR_TO_DOOR', icon: Truck },
    { key: 'DOOR_TO_PORT', icon: Ship },
    { key: 'PORT_TO_DOOR', icon: Truck },
    { key: 'TRANSSHIPMENT', icon: Ship },
    { key: 'SEA_AIR', icon: Plane },
    { key: 'SEA_ROAD', icon: Truck },
    { key: 'RAIL_ROAD', icon: Train },
    { key: 'SEA_RAIL', icon: Train },
];

export function TransportMethodSelector({ value, onChange, required = false }: TransportMethodSelectorProps) {
    const t = useTranslations();
    const [isOpen, setIsOpen] = useState(false);

    const selectedMethod = TRANSPORT_METHODS.find(m => m.key === value);
    const selectedTitle = value ? t(`dashboard.shipments.transportMethods.${value}.title`) : '';
    const selectedDescription = value ? t(`dashboard.shipments.transportMethods.${value}.description`) : '';

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {t('dashboard.shipments.transportMethod')}
                {required && <span className="text-primary-red ml-1">*</span>}
            </label>

            {/* Dropdown Selector */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-red focus:border-primary-red outline-none transition-all bg-white flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        {selectedMethod ? (
                            <>
                                <selectedMethod.icon className="w-5 h-5 text-primary-red" />
                                <span className="text-gray-900 font-medium">{selectedTitle}</span>
                            </>
                        ) : (
                            <span className="text-gray-400">{t('dashboard.shipments.transportMethodPlaceholder')}</span>
                        )}
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto"
                        >
                            {TRANSPORT_METHODS.map((method) => {
                                const Icon = method.icon;
                                const title = t(`dashboard.shipments.transportMethods.${method.key}.title`);
                                const isSelected = value === method.key;

                                return (
                                    <button
                                        key={method.key}
                                        type="button"
                                        onClick={() => {
                                            onChange(method.key);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left ${isSelected ? 'bg-primary-red/5' : ''
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 ${isSelected ? 'text-primary-red' : 'text-gray-400'}`} />
                                        <span className={`font-medium ${isSelected ? 'text-primary-red' : 'text-gray-900'}`}>
                                            {title}
                                        </span>
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Description Display */}
            <AnimatePresence>
                {value && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 border border-gray-100 rounded-xl p-4"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-primary-red/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                {selectedMethod && <selectedMethod.icon className="w-4 h-4 text-primary-red" />}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-soft-black text-sm mb-1">{selectedTitle}</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">{selectedDescription}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
