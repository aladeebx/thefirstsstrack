'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import styles from './page.module.css';

interface TrackingData {
  trackingNumber: string;
  status: string;
  origin: string;
  destination: string;
  currentLocation: string | null;
  estimatedDelivery: string | null;
  timeline: any[];
  customer: {
    name: string;
  };
  company: {
    name: string;
  };
  createdAt: string;
}

function SearchWidgetContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  
  const [companyName, setCompanyName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

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
      // Use new API endpoint with userId filter to ensure company isolation
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

  return (
    <div className={styles.widgetContainer}>
      {companyName && (
        <div className={styles.companyHeader}>
          <h2 className={styles.companyName}>{companyName}</h2>
          <p className={styles.companySubtitle}>Shipment Tracking</p>
        </div>
      )}

      <div className={styles.searchBox}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Enter your tracking number (e.g., TKS-ABC12345)"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit" 
            className={styles.searchButton}
            disabled={loading}
          >
            {loading ? 'Tracking...' : 'Track Shipment'}
          </button>
        </form>
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Searching for your shipment...</p>
        </div>
      )}

      {error && searched && (
        <div className={styles.error}>
          <div className={styles.errorIcon}>❌</div>
          <h3>Shipment Not Found</h3>
          <p>{error}</p>
        </div>
      )}

      {trackingData && !loading && (
        <div className={styles.results}>
          <div className={styles.header}>
            <h1 className={styles.trackingNumber}>{trackingData.trackingNumber}</h1>
            <span className={`${styles.badge} ${styles[trackingData.status.toLowerCase()]}`}>
              {trackingData.status.replace('_', ' ')}
            </span>
          </div>

          <div className={styles.route}>
            <div className={styles.routePoint}>
              <span className={styles.routeLabel}>From</span>
              <span className={styles.routeValue}>{trackingData.origin}</span>
            </div>
            <div className={styles.routeArrow}>→</div>
            <div className={styles.routePoint}>
              <span className={styles.routeLabel}>To</span>
              <span className={styles.routeValue}>{trackingData.destination}</span>
            </div>
          </div>

          {trackingData.currentLocation && (
            <div className={styles.currentLocation}>
              📍 Current Location: {trackingData.currentLocation}
            </div>
          )}

          {trackingData.estimatedDelivery && (
            <div className={styles.delivery}>
              Estimated Delivery: {format(new Date(trackingData.estimatedDelivery), 'MMM dd, yyyy')}
            </div>
          )}

          {trackingData.timeline && trackingData.timeline.length > 0 && (
            <div className={styles.timeline}>
              <h3>Tracking History</h3>
              <div className={styles.timelineItems}>
                {trackingData.timeline.map((item: any, index: number) => (
                  <div key={index} className={styles.timelineItem}>
                    <div className={styles.timelineDot}></div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineStatus}>{item.status}</div>
                      {item.location && (
                        <div className={styles.timelineLocation}>📍 {item.location}</div>
                      )}
                      {item.description && (
                        <div className={styles.timelineDescription}>{item.description}</div>
                      )}
                      <div className={styles.timelineDate}>
                        {format(new Date(item.timestamp), 'MMM dd, yyyy - hh:mm a')}
                      </div>
                    </div>
                  </div>
                ))}
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
      <div className={styles.widgetContainer}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <SearchWidgetContent />
    </Suspense>
  );
}

