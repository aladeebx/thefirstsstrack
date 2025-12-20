'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { MapPin, Truck, CheckCircle2, Clock } from 'lucide-react';

interface TimelineItem {
  status: string;
  timestamp: string;
  location: string;
  description: string;
}

interface TrackingData {
  trackingNumber: string;
  status: string;
  origin: string;
  destination: string;
  currentLocation: string | null;
  estimatedDelivery: string | null;
  timeline: TimelineItem[];
  customer: {
    name: string;
  };
  company: {
    name: string;
  };
}

export default function EmbedTrackingPage({ params }: { params: { trackingNumber: string } }) {
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
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D01919]"></div>
      </div>
    );
  }

  if (error || !trackingData) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-200 h-full text-center">
        <h2 className="text-[#111111] font-bold text-lg mb-1">Status Unavailable</h2>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  const isDelivered = trackingData.status.toLowerCase() === 'delivered';

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 font-sans shadow-sm w-full max-w-md mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="bg-[#111111] text-white p-4 flex justify-between items-center shrink-0">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Tracking ID</p>
          <h1 className="text-lg font-mono font-bold">{trackingData.trackingNumber}</h1>
        </div>
        <div className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${isDelivered ? 'bg-green-500 text-white' : 'bg-[#D01919] text-white'}`}>
          {trackingData.status}
        </div>
      </div>

      {/* Progress / Status */}
      <div className="p-5 bg-gray-50 border-b border-gray-100 shrink-0">
        <div className="flex justify-between items-center mb-4 text-sm">
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase mb-1">From</div>
            <div className="font-bold text-[#111111]">{trackingData.origin}</div>
          </div>
          <div className="flex-1 mx-3 flex flex-col items-center">
            <div className="w-full h-0.5 bg-gray-200 relative top-1.5"></div>
            <Truck className={`w-4 h-4 text-[#D01919] relative z-10 bg-gray-50 px-0.5 mt-0`} />
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase mb-1">To</div>
            <div className="font-bold text-[#111111]">{trackingData.destination}</div>
          </div>
        </div>
        {trackingData.estimatedDelivery && (
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600 bg-white py-2 rounded-lg border border-gray-100">
            <Clock className="w-3.5 h-3.5 text-[#D01919]" />
            <span>Est. Delivery: <strong>{format(new Date(trackingData.estimatedDelivery), 'MMM dd, yyyy')}</strong></span>
          </div>
        )}
      </div>

      {/* Timeline (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
        {trackingData.timeline.map((item, index) => (
          <div key={index} className="flex gap-3 relative">
            {/* Connector Line */}
            {index !== trackingData.timeline.length - 1 && (
              <div className="absolute left-[7px] top-4 bottom-[-20px] w-0.5 bg-gray-100"></div>
            )}

            {/* Dot */}
            <div className={`w-4 h-4 rounded-full border-2 shrink-0 z-10 ${index === 0 ? 'bg-white border-[#D01919]' : 'bg-gray-100 border-gray-300'}`}></div>

            <div className="pb-1">
              <div className="flex justify-between items-baseline gap-2">
                <p className={`text-sm font-bold leading-none ${index === 0 ? 'text-[#111111]' : 'text-gray-600'}`}>
                  {item.status}
                </p>
                <span className="text-[10px] text-gray-400 whitespace-nowrap">
                  {format(new Date(item.timestamp), 'MMM dd, HH:mm')}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{item.description}</p>
              {item.location && (
                <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1 font-medium">
                  <MapPin className="w-3 h-3" /> {item.location}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 bg-white border-t border-gray-100 text-center text-[10px] text-gray-400 shrink-0">
        Powered by <strong className="text-[#111111]">TrakoShip</strong>
      </div>
    </div>
  );
}
