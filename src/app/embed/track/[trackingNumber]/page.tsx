'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import {
  MapPin,
  Truck,
  Package,
  Box,
  Anchor,
  Layers,
  Image as ImageIcon,
  Download,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TimelineItem {
  status: string;
  timestamp: string;
  location: string;
  description: string;
  notes?: string;
  images?: string[];
}

interface TrackingData {
  trackingNumber: string;
  status: string;
  origin: string;
  destination: string;
  currentLocation: string | null;
  estimatedDelivery: string | null;
  timeline: TimelineItem[];
  shipmentType?: string;
  transportMethod?: string;
  cargoUnits?: { type: string; quantity: number };
  customer: {
    name: string;
  };
  company: {
    name: string;
  };
}

export default function EmbedTrackingPage({ params }: { params: { trackingNumber: string } }) {
  const t = useTranslations();
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrackingData();
  }, []);

  const fetchTrackingData = async () => {
    try {
      const response = await fetch(`/api/track/${params.trackingNumber}`);
      if (!response.ok) {
        setError('Shipment not found');
        return;
      }
      const data = await response.json();
      setTrackingData(data);
    } catch (err) {
      setError('Failed to fetch tracking data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-[#D01919] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-medium text-gray-500 uppercase tracking-widest">{t('common.loading')}</p>
      </div>
    );
  }

  if (error || !trackingData) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Package className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-gray-900 font-bold mb-1">{t('tracking.notFound')}</h3>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  const isDelivered = trackingData.status.toLowerCase() === 'delivered';
  const progressWidth = isDelivered ? '100%' : '60%';

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col font-sans overflow-hidden">

      {/* 1. Header Card (Dark Mode) */}
      <div className="bg-[#111111] p-6 pb-8 shadow-xl z-10 shrink-0 relative overflow-hidden text-white">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#D01919]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-[#D01919]/5 rounded-full blur-[50px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D01919] animate-pulse"></span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">TRAKOSHIP TRACKING</span>
              </div>
              <h1 className="text-2xl font-mono font-bold text-white tracking-tight">
                {trackingData.trackingNumber}
              </h1>
            </div>
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${isDelivered
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : 'bg-[#D01919]/10 text-[#D01919] border-[#D01919]/20'
              }`}>
              {trackingData.status}
            </div>
          </div>

          {/* Route Visualization */}
          <div className="relative pt-2 pb-2">
            <div className="flex justify-between items-end mb-3">
              <span className="text-sm font-bold text-white">{trackingData.origin}</span>
              <span className="text-sm font-bold text-white">{trackingData.destination}</span>
            </div>

            {/* Progress Bar Track */}
            <div className="relative h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: progressWidth }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute left-0 top-0 h-full bg-[#D01919]"
              />
            </div>

            <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-medium uppercase tracking-wider">
              <span>{t('tracking.origin')}</span>
              <span>{t('tracking.destination')}</span>
            </div>

            {/* Truck Icon on Progress */}
            {!isDelivered && (
              <motion.div
                initial={{ left: '0%' }}
                animate={{ left: '60%' }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute top-[28px] -translate-x-1/2 bg-[#111111] p-1.5 rounded-full shadow-lg border border-gray-700"
              >
                <Truck className="w-3.5 h-3.5 text-[#D01919]" />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50">
        <div className="p-5 space-y-6">

          {/* Shipment Data Grid */}
          {(trackingData.shipmentType || trackingData.transportMethod || trackingData.cargoUnits) && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" />
                {t('tracking.shipmentData') || 'SHIPMENT DATA'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {trackingData.shipmentType && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100/50">
                    <div className="w-8 h-8 rounded-lg bg-blue-100/50 flex items-center justify-center flex-shrink-0">
                      <Box className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-gray-500 mb-0.5">{t('tracking.shipmentType')}</div>
                      <div className="text-xs font-bold text-gray-900 truncate" title={trackingData.shipmentType}>
                        {trackingData.shipmentType}
                      </div>
                    </div>
                  </div>
                )}

                {trackingData.transportMethod && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50/50 border border-red-100/50">
                    <div className="w-8 h-8 rounded-lg bg-[#D01919]/10 flex items-center justify-center flex-shrink-0">
                      <Anchor className="w-4 h-4 text-[#D01919]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-gray-500 mb-0.5">{t('tracking.transportMethod')}</div>
                      <div className="text-xs font-bold text-gray-900 truncate">
                        {t(`dashboard.shipments.transportMethods.${trackingData.transportMethod}.title`).split(' ')[0]}
                      </div>
                    </div>
                  </div>
                )}

                {trackingData.cargoUnits && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50/50 border border-purple-100/50">
                    <div className="w-8 h-8 rounded-lg bg-purple-100/50 flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-gray-500 mb-0.5">{t('tracking.cargoUnits')}</div>
                      <div className="text-xs font-bold text-gray-900 truncate">
                        {trackingData.cargoUnits.quantity} {t(`dashboard.shipments.cargoTypes.${trackingData.cargoUnits.type}`)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
              {t('tracking.timeline')}
            </h3>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="relative pl-2">
                {/* Vertical Line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

                {trackingData.timeline.map((item, index) => (
                  <div key={index} className="relative flex gap-5 mb-8 last:mb-0 group">
                    {/* Dot */}
                    <div className={`
                      w-4 h-4 rounded-full border-[3px] shrink-0 z-10 relative box-content
                      ${index === 0
                        ? 'bg-white border-[#D01919] shadow-[0_0_0_4px_rgba(208,25,25,0.1)]'
                        : 'bg-gray-100 border-gray-300'
                      }
                    `}></div>

                    <div className="flex-1 -mt-1.5">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                        <p className={`text-sm font-bold ${index === 0 ? 'text-[#D01919]' : 'text-[#111111]'}`}>
                          {item.status}
                        </p>
                        <span className="text-[10px] font-medium text-gray-400 font-mono bg-gray-50 px-2 py-0.5 rounded-md self-start">
                          {format(new Date(item.timestamp), 'MMM dd, HH:mm')}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {item.description}
                      </p>

                      {item.location && (
                        <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
                          <MapPin className="w-3 h-3" />
                          {item.location}
                        </div>
                      )}

                      {/* Notes */}
                      {item.notes && (
                        <div className="mt-3 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-start gap-1.5 mb-1">
                            <FileText className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide">{t('tracking.notes') || 'Notes'}</p>
                          </div>
                          <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">{item.notes}</p>
                        </div>
                      )}

                      {/* Images */}
                      {item.images && item.images.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <ImageIcon className="w-3 h-3 text-gray-500" />
                            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
                              {t('tracking.images') || 'Images'} ({item.images.length})
                            </p>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                            {item.images.map((image, imgIndex) => (
                              <div key={imgIndex} className="relative group">
                                <img
                                  src={image}
                                  alt={`Status update image ${imgIndex + 1}`}
                                  className="w-full h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:border-[#D01919] transition-colors"
                                  onClick={() => window.open(image, '_blank')}
                                />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const link = document.createElement('a');
                                    link.href = image;
                                    link.download = `shipment-${trackingData.trackingNumber}-${index}-${imgIndex + 1}.jpg`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }}
                                  className="absolute top-0.5 right-0.5 p-1 bg-[#D01919] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                  title={t('tracking.downloadImage') || 'Download image'}
                                >
                                  <Download className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Footer */}
      <div className="bg-white border-t border-gray-100 p-3 shrink-0">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 hover:text-[#D01919] transition-colors"
        >
          <span>Powered by</span>
          <span className="font-bold text-[#111111]">TrakoShip</span>
        </a>
      </div>

    </div>
  );
}
