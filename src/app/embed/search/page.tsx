'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import {
  Barcode,
  Copy,
  Activity,
  FilePlus,
  Package,
  PackageCheck,
  Truck,
  ShieldCheck,
  CheckCircle,
  CheckCircle2,
  MapPin,
  Navigation,
  ArrowRight,
  Radar,
  CalendarClock,
  Box,
  Layers,
  User,
  CalendarDays,
  Clock,
  Info,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface TrackingData {
  trackingNumber: string;
  status: string;
  origin: string;
  destination: string;
  currentLocation: string | null;
  estimatedDelivery: string | null;
  actualDelivery: string | null;
  timeline: any[];
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
  updatedAt?: string;
}

const statusSteps = [
  { key: 'PENDING', icon: FilePlus, label: 'Pending' },
  { key: 'PICKED_UP', icon: Package, label: 'Picked Up' },
  { key: 'IN_TRANSIT', icon: Truck, label: 'In Transit' },
  { key: 'OUT_FOR_DELIVERY', icon: ShieldCheck, label: 'Out for Delivery' },
  { key: 'DELIVERED', icon: CheckCircle, label: 'Delivered' }
];

const getStatusIcon = (status: string) => {
  const statusUpper = status.toUpperCase();
  if (statusUpper.includes('PENDING')) return Clock;
  if (statusUpper.includes('PICKED_UP')) return PackageCheck;
  if (statusUpper.includes('IN_TRANSIT') || statusUpper.includes('TRANSIT')) return Truck;
  if (statusUpper.includes('DELIVERED')) return CheckCircle2;
  return Activity;
};

function SearchWidgetContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  
  const [companyName, setCompanyName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchCompanyName();
    }
  }, [userId]);

  const fetchCompanyName = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setCompanyName(data.companyName);
      }
    } catch (err) {
      console.error('Failed to fetch company name:', err);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    if (!userId) {
      setError('Configuration error: Missing user ID');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);
    setTrackingData(null);

    try {
      const response = await fetch(`/api/track?trackingNumber=${encodeURIComponent(trackingNumber.trim())}&userId=${encodeURIComponent(userId)}`);
      
      if (!response.ok) {
        setError('Shipment not found. Please check your tracking number and try again.');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setTrackingData(data);
    } catch (err) {
      setError('Failed to fetch tracking data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!trackingData?.trackingNumber) return;
    try {
      await navigator.clipboard.writeText(trackingData.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getCurrentStepIndex = (status: string) => {
    const statusUpper = status.toUpperCase();
    return statusSteps.findIndex(step => statusUpper.includes(step.key));
  };

  const isStepActive = (stepIndex: number, currentStatus: string) => {
    const currentIndex = getCurrentStepIndex(currentStatus);
    return stepIndex <= currentIndex;
  };

  const isStepCompleted = (stepIndex: number, currentStatus: string) => {
    const currentIndex = getCurrentStepIndex(currentStatus);
    return stepIndex < currentIndex;
  };

  // Skeleton Loader
  const SkeletonLoader = () => (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );

  // Empty State
  const EmptyState = () => (
    <div className="text-center py-12 animate-fade-in">
      <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Shipment Found</h3>
      <p className="text-gray-500">Please check your tracking number and try again.</p>
    </div>
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 bg-white min-h-screen">
      {/* Company Header - Professional Card */}
      {companyName && (
        <div className="mb-8 animate-fade-in">
          <div className="bg-gradient-to-br from-white via-primary-red/5 to-white rounded-2xl p-6 md:p-8 border border-primary-red/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-red/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
              {/* Icon */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary-red to-red-700 flex items-center justify-center shadow-lg flex-shrink-0 transform hover:scale-105 transition-transform duration-300">
                <Package className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              
              {/* Text Content */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-soft-black mb-2 tracking-tight">
                  {companyName}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <div className="h-px w-8 bg-primary-red"></div>
                  <p className="text-sm md:text-base font-semibold text-primary-red uppercase tracking-widest">
                    Shipment Tracking
                  </p>
                  <div className="h-px w-8 bg-primary-red"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Box */}
      <div className="mb-8 animate-slide-up">
        <form onSubmit={handleSearch} className="flex gap-3 flex-wrap">
          <input
            type="text"
            className="flex-1 min-w-[200px] px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-red focus:ring-2 focus:ring-primary-red/20 outline-none transition-all"
            placeholder="Enter your tracking number (e.g., TKS-ABC12345)"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit" 
            className="px-6 py-3 bg-primary-red text-white rounded-xl font-semibold hover:bg-red-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Tracking...
              </span>
            ) : (
              'Track Shipment'
            )}
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Loader2 className="w-12 h-12 text-primary-red animate-spin" />
          <p className="text-gray-500">Searching for your shipment...</p>
        </div>
      )}

      {/* Error State */}
      {error && searched && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center animate-fade-in">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-900 mb-2">Shipment Not Found</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Results */}
      {trackingData && !loading && (
        <div className="space-y-6 animate-fade-in">
          {/* 1. Tracking Header */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="p-3 bg-primary-red/10 rounded-xl">
                  <Barcode className="w-6 h-6 text-primary-red" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Tracking Number</span>
                    <div className="relative group">
                      <Info className="w-4 h-4 text-gray-400" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                        <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                          Click copy to share
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-mono font-bold text-primary-red truncate">
                      {trackingData.trackingNumber}
                    </h1>
                    <button
                      onClick={handleCopy}
                      className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                      title="Copy tracking number"
                    >
                      {copied ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-500 group-hover:text-primary-red" />
                      )}
                      {copied && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                          Copied!
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                  trackingData.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                  trackingData.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                  trackingData.status === 'RETURNED' ? 'bg-orange-100 text-orange-700' :
                  'bg-primary-red/15 text-primary-red'
                }`}>
                  {trackingData.status.replace(/_/g, ' ')}
                </span>
                {trackingData.updatedAt && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Activity className="w-3 h-3" />
                    <span>Updated {format(new Date(trackingData.updatedAt), 'MMM dd, yyyy')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. Progress Stepper */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="relative">
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
              <div 
                className="absolute top-6 left-0 h-0.5 bg-primary-red transition-all duration-500 -z-10"
                style={{ 
                  width: `${(getCurrentStepIndex(trackingData.status) / (statusSteps.length - 1)) * 100}%` 
                }}
              ></div>
              <div className="flex justify-between">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = isStepActive(index, trackingData.status);
                  const isCompleted = isStepCompleted(index, trackingData.status);
                  
                  return (
                    <div key={step.key} className="flex flex-col items-center gap-2 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted ? 'bg-primary-red text-white shadow-lg' :
                        isActive ? 'bg-primary-red text-white shadow-md scale-110' :
                        'bg-gray-200 text-gray-400'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-xs font-medium text-center ${
                        isActive ? 'text-primary-red' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Route Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-center animate-slide-up">
                <div className="p-4 bg-gray-50 rounded-xl mb-2">
                  <MapPin className="w-6 h-6 text-primary-red mx-auto mb-2" />
                  <span className="text-xs text-gray-500 uppercase block mb-1">From</span>
                  <span className="text-lg font-semibold text-soft-black">{trackingData.origin}</span>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="p-3 bg-primary-red/10 rounded-full">
                  <ArrowRight className="w-6 h-6 text-primary-red" />
                </div>
              </div>
              <div className="text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="p-4 bg-gray-50 rounded-xl mb-2">
                  <Navigation className="w-6 h-6 text-primary-red mx-auto mb-2" />
                  <span className="text-xs text-gray-500 uppercase block mb-1">To</span>
                  <span className="text-lg font-semibold text-soft-black">{trackingData.destination}</span>
                </div>
              </div>
            </div>
            {trackingData.currentLocation && (
              <div className="mt-4 p-4 bg-primary-red/10 rounded-xl text-center animate-fade-in">
                <div className="flex items-center justify-center gap-2 text-primary-red">
                  <Radar className="w-5 h-5 animate-pulse" />
                  <span className="font-semibold">Current Location: {trackingData.currentLocation}</span>
                </div>
              </div>
            )}
          </div>

          {/* 4. Location & ETA */}
          {(trackingData.estimatedDelivery || trackingData.actualDelivery) && (
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trackingData.estimatedDelivery && (
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <CalendarClock className="w-6 h-6 text-primary-red" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase block mb-1">Estimated Delivery</span>
                      <span className="text-lg font-semibold text-soft-black">
                        {format(new Date(trackingData.estimatedDelivery), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                )}
                {trackingData.actualDelivery && trackingData.status === 'DELIVERED' && (
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase block mb-1">Actual Delivery</span>
                      <span className="text-lg font-semibold text-green-700">
                        {format(new Date(trackingData.actualDelivery), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. Shipment Intelligence Grid */}
          {(trackingData.shipmentType || trackingData.transportMethod || trackingData.cargoUnits || trackingData.customer?.name || trackingData.createdAt) && (
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-soft-black mb-6">Shipment Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {trackingData.shipmentType && (
                  <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '0.05s' }}>
                    <div className="p-3 bg-primary-red/10 rounded-lg w-fit mb-3">
                      <Box className="w-5 h-5 text-primary-red" />
                    </div>
                    <div className="text-xs text-gray-500 uppercase mb-1">Shipment Type</div>
                    <div className="text-sm font-semibold text-soft-black">{trackingData.shipmentType}</div>
                  </div>
                )}

                {trackingData.transportMethod && (
                  <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="p-3 bg-primary-red/10 rounded-lg w-fit mb-3">
                      <Truck className="w-5 h-5 text-primary-red" />
                    </div>
                    <div className="text-xs text-gray-500 uppercase mb-1">Transport</div>
                    <div className="text-sm font-semibold text-soft-black">{trackingData.transportMethod.replace(/_/g, ' ')}</div>
                  </div>
                )}

                {trackingData.cargoUnits && (
                  <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                    <div className="p-3 bg-primary-red/10 rounded-lg w-fit mb-3">
                      <Layers className="w-5 h-5 text-primary-red" />
                    </div>
                    <div className="text-xs text-gray-500 uppercase mb-1">Cargo Units</div>
                    <div className="text-sm font-semibold text-soft-black">
                      {trackingData.cargoUnits.quantity} {trackingData.cargoUnits.type}
                    </div>
                  </div>
                )}

                {trackingData.customer?.name && (
                  <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="p-3 bg-primary-red/10 rounded-lg w-fit mb-3">
                      <User className="w-5 h-5 text-primary-red" />
                    </div>
                    <div className="text-xs text-gray-500 uppercase mb-1">Customer</div>
                    <div className="text-sm font-semibold text-soft-black truncate" title={trackingData.customer.name}>
                      {trackingData.customer.name}
                    </div>
                  </div>
                )}

                {trackingData.createdAt && (
                  <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '0.25s' }}>
                    <div className="p-3 bg-primary-red/10 rounded-lg w-fit mb-3">
                      <CalendarDays className="w-5 h-5 text-primary-red" />
                    </div>
                    <div className="text-xs text-gray-500 uppercase mb-1">Created</div>
                    <div className="text-sm font-semibold text-soft-black">
                      {format(new Date(trackingData.createdAt), 'MMM dd, yyyy')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. Tracking History Timeline */}
          {trackingData.timeline && trackingData.timeline.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-soft-black mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-primary-red" />
                Tracking History
              </h3>
              <div className="relative pl-6 border-l-2 border-gray-200">
                {trackingData.timeline.map((item: any, index: number) => {
                  const StatusIcon = getStatusIcon(item.status);
                  return (
                    <div 
                      key={index} 
                      className="relative mb-8 last:mb-0 animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="absolute -left-[29px] top-0 w-6 h-6 bg-white rounded-full border-4 border-primary-red flex items-center justify-center">
                        <StatusIcon className="w-3 h-3 text-primary-red" />
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 ml-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                            item.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                            item.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                            'bg-primary-red/15 text-primary-red'
                          }`}>
                            {item.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        {item.location && (
                          <div className="flex items-center gap-2 text-sm font-semibold text-soft-black mb-1">
                            <MapPin className="w-4 h-4 text-primary-red" />
                            {item.location}
                          </div>
                        )}
                        {item.description && (
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {format(new Date(item.timestamp), 'MMM dd, yyyy - hh:mm a')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchWidgetPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto max-w-6xl px-4 py-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-red animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <SearchWidgetContent />
    </Suspense>
  );
}
