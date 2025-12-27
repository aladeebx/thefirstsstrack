'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/Badge';
import { MapPin, Calendar, Truck, Clock, Package, CheckCircle2, ArrowRight, Image as ImageIcon, Download, FileText } from 'lucide-react';
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
  actualDelivery: string | null;
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
  createdAt: string;
}

export default function TrackingPage({ params }: { params: { trackingNumber: string } }) {
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
        setLoading(false);
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
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D01919]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !trackingData) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-6 max-w-md w-full p-8 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-[#D01919]/10 rounded-full flex items-center justify-center mx-auto">
              <Package className="w-8 h-8 text-[#D01919]" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-[#111111]">{t('tracking.notFound')}</h1>
              <p className="text-gray-500">{error}</p>
            </div>
            <a href="/" className="inline-flex items-center justify-center px-6 py-3 bg-[#111111] text-white rounded-xl hover:bg-black transition-colors w-full font-medium">
              Back to Home
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isDelivered = trackingData.status.toLowerCase() === 'delivered';

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar />

      <main className="flex-1 py-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* Header Section */}
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#111111] to-gray-600 pb-2">
              {t('tracking.title')}
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
              <span className="text-gray-500 font-medium">Tracking ID:</span>
              <span className="font-mono text-[#D01919] font-bold tracking-wider">{trackingData.trackingNumber}</span>
            </div>
          </div>

          {/* Main Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111111] text-white rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D01919]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#D01919]/5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col gap-12">

              {/* Top Row: Status & Vendor */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-800/50 pb-8">
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Current Status</p>
                  <div className="flex items-center gap-4">
                    <h2 className={`text-3xl font-bold ${isDelivered ? 'text-green-400' : 'text-white'}`}>
                      {trackingData.status}
                    </h2>
                    <Badge className={`${isDelivered ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-gray-800 text-gray-300 border-gray-700"}`}>
                      {trackingData.status}
                    </Badge>
                  </div>
                </div>
                <div className="md:text-right">
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Service Provider</p>
                  <div className="flex items-center md:justify-end gap-2">
                    <Truck className="w-5 h-5 text-[#D01919]" />
                    <span className="font-semibold text-lg">{trackingData.company.name}</span>
                  </div>
                </div>
              </div>

              {/* Middle Row: Route Visualizer */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-8 items-center">

                {/* Origin */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                    <span className="text-xs font-bold uppercase tracking-widest">{t('tracking.origin')}</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{trackingData.origin}</p>
                  <p className="text-sm text-gray-400">Package Collected</p>
                </div>

                {/* Progress Bar (Visual) */}
                <div className="hidden md:flex flex-col items-center w-full px-4">
                  <div className="relative w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: isDelivered ? "100%" : "60%" }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      className="absolute left-0 top-0 h-full bg-[#D01919]"
                    />
                  </div>
                  <div className="mt-4 p-2 bg-[#D01919]/10 rounded-full border border-[#D01919]/20">
                    <Truck className="w-5 h-5 text-[#D01919]" />
                  </div>
                </div>

                {/* Destination */}
                <div className="space-y-2 md:text-right">
                  <div className="flex items-center gap-2 text-gray-400 mb-1 md:justify-end">
                    <span className="text-xs font-bold uppercase tracking-widest">{t('tracking.destination')}</span>
                    <div className="w-2 h-2 rounded-full bg-[#D01919]"></div>
                  </div>
                  <p className="text-2xl font-bold text-white">{trackingData.destination}</p>
                  <p className="text-sm text-gray-400">Final Destination</p>
                </div>
              </div>

              {/* Bottom Row: Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {trackingData.estimatedDelivery && (
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#D01919]/20 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-[#D01919]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">{t('tracking.estimatedDelivery')}</p>
                      <p className="text-lg font-bold text-white">{format(new Date(trackingData.estimatedDelivery), 'MMMM dd, yyyy')}</p>
                    </div>
                  </div>
                )}

                {trackingData.currentLocation && !isDelivered && (
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Latest Location</p>
                      <p className="text-lg font-bold text-white max-w-[200px] truncate" title={trackingData.currentLocation}>
                        {trackingData.currentLocation}
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </motion.div>

          {/* New Shipment Details Section */}
          {(trackingData.shipmentType || trackingData.transportMethod || trackingData.cargoUnits) && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#111111]">{t('tracking.shipmentData') || 'Shipment Data'}</h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {trackingData.shipmentType && (
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">{t('tracking.shipmentType')}</p>
                        <p className="text-lg font-bold text-[#111111]">{trackingData.shipmentType}</p>
                      </div>
                    </div>
                  </div>
                )}

                {trackingData.transportMethod && (
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#D01919]/10 flex items-center justify-center flex-shrink-0">
                        <Truck className="w-6 h-6 text-[#D01919]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">{t('tracking.transportMethod')}</p>
                        <p className="text-base font-bold text-[#111111]">
                          {t(`dashboard.shipments.transportMethods.${trackingData.transportMethod}.title`)}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                          {t(`dashboard.shipments.transportMethods.${trackingData.transportMethod}.description`)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {trackingData.cargoUnits && (
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">{t('tracking.cargoUnits')}</p>
                        <p className="text-lg font-bold text-[#111111]">
                          {trackingData.cargoUnits.quantity} {t(`dashboard.shipments.cargoTypes.${trackingData.cargoUnits.type}`)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}

          {/* Timeline Section */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,350px] gap-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#111111] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#D01919] flex items-center justify-center text-white">
                  <Clock className="w-5 h-5" />
                </div>
                {t('tracking.timeline')}
              </h2>

              <div className="border border-gray-100 rounded-3xl p-8 bg-white shadow-sm relative overflow-hidden">
                <div className="absolute left-[43px] top-8 bottom-8 w-0.5 bg-gray-100"></div>

                <div className="space-y-8 relative">
                  {trackingData.timeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-6 relative"
                    >
                      {/* Timeline Dot */}
                      <div className="flex-shrink-0 w-8 flex justify-center pt-1 z-10">
                        <div className={`w-4 h-4 rounded-full border-[3px] box-content ${index === 0
                          ? 'bg-white border-[#D01919] shadow-[0_0_0_4px_rgba(208,25,25,0.15)]'
                          : 'bg-gray-100 border-gray-300'
                          }`}></div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-2">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                          <h3 className={`font-bold text-lg ${index === 0 ? 'text-[#D01919]' : 'text-[#111111]'}`}>
                            {item.status}
                          </h3>
                          <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md whitespace-nowrap">
                            {format(new Date(item.timestamp), 'MMM dd, HH:mm')}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm mb-2">{item.description}</p>
                        {item.location && (
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            <MapPin className="w-3.5 h-3.5" />
                            {item.location}
                          </div>
                        )}
                        
                        {/* Notes */}
                        {item.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start gap-2 mb-1">
                              <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{t('tracking.notes') || 'Notes'}</p>
                            </div>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.notes}</p>
                          </div>
                        )}

                        {/* Images */}
                        {item.images && item.images.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                              <ImageIcon className="w-4 h-4 text-gray-500" />
                              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                {t('tracking.images') || 'Images'} ({item.images.length})
                              </p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                              {item.images.map((image, imgIndex) => (
                                <div key={imgIndex} className="relative group">
                                  <img
                                    src={image}
                                    alt={`Status update image ${imgIndex + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border border-gray-200 cursor-pointer hover:border-[#D01919] transition-colors"
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
                                    className="absolute top-1 right-1 p-1.5 bg-[#D01919] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    title={t('tracking.downloadImage') || 'Download image'}
                                  >
                                    <Download className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Side Info / Support */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 text-center">
                <h3 className="font-bold text-[#111111] mb-2">Need Help?</h3>
                <p className="text-gray-500 text-sm mb-4">
                  If you have any issues with your delivery, please contact our support team.
                </p>
                <button className="w-full py-3 bg-white border border-gray-200 rounded-xl text-[#111111] font-semibold hover:border-[#D01919] hover:text-[#D01919] transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
