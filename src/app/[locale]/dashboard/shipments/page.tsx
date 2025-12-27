'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Copy,
  CheckCircle2,
  X,
  MapPin,
  Calendar,
  User,
  Truck,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FloatingInput } from '@/components/ui/FloatingInput';
import { AnimatedSection } from '@/components/ui/animations/AnimatedSection';
import { StaggerContainer, StaggerItem } from '@/components/ui/animations/StaggerContainer';
import { ShipmentTypeSelector } from '@/components/shipment/ShipmentTypeSelector';
import { TransportMethodSelector } from '@/components/shipment/TransportMethodSelector';
import { CargoUnitsSelector } from '@/components/shipment/CargoUnitsSelector';

interface Shipment {
  id: string;
  trackingNumber: string;
  status: string;
  origin: string;
  destination: string;
  createdAt: string;
  shipmentType?: string;
  transportMethod?: string;
  cargoUnits?: { type: string; quantity: number };
  customer: {
    id: string;
    name: string;
  };
}

interface Customer {
  id: string;
  name: string;
}

const getStatusColor = (status: string) => {
  const statusMap: Record<string, { bg: string; text: string; border: string }> = {
    PENDING: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    PICKED_UP: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    IN_TRANSIT: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    OUT_FOR_DELIVERY: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    DELIVERED: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    CANCELLED: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    RETURNED: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  };
  return statusMap[status] || statusMap.PENDING;
};

const getStatusLabel = (status: string, t: any) => {
  const statusLabels: Record<string, string> = {
    PENDING: t('dashboard.shipments.statuses.pending') || 'Pending',
    PICKED_UP: t('dashboard.shipments.statuses.pickedUp') || 'Picked Up',
    IN_TRANSIT: t('dashboard.shipments.statuses.inTransit') || 'In Transit',
    OUT_FOR_DELIVERY: t('dashboard.shipments.statuses.outForDelivery') || 'Out for Delivery',
    DELIVERED: t('dashboard.shipments.statuses.delivered') || 'Delivered',
    CANCELLED: t('dashboard.shipments.statuses.cancelled') || 'Cancelled',
    RETURNED: t('dashboard.shipments.statuses.returned') || 'Returned',
  };
  return statusLabels[status] || status;
};

export default function ShipmentsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newTrackingNumber, setNewTrackingNumber] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [formData, setFormData] = useState({
    customerId: '',
    origin: '',
    destination: '',
    estimatedDelivery: '',
    notes: '',
    shipmentType: '',
    transportMethod: '',
    cargoUnits: null as { type: string; quantity: number } | null,
  });
  const [updateData, setUpdateData] = useState({
    status: '',
    currentLocation: '',
  });

  useEffect(() => {
    fetchShipments();
    fetchCustomers();
  }, []);

  const fetchShipments = async () => {
    try {
      const response = await fetch('/api/shipments');
      const data = await response.json();
      setShipments(data.shipments);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      setCustomers(data.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setShowModal(false);
        setFormData({
          customerId: '',
          origin: '',
          destination: '',
          estimatedDelivery: '',
          notes: '',
          shipmentType: '',
          transportMethod: '',
          cargoUnits: null,
        });
        setNewTrackingNumber(data.shipment.trackingNumber);
        setShowSuccessModal(true);
        fetchShipments();
      }
    } catch (error) {
      console.error('Error creating shipment:', error);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;

    try {
      const response = await fetch(`/api/shipments/${selectedShipment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        setShowUpdateModal(false);
        setSelectedShipment(null);
        setUpdateData({ status: '', currentLocation: '' });
        fetchShipments();
      }
    } catch (error) {
      console.error('Error updating shipment:', error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmMessage = t('dashboard.shipments.confirmDelete') || 'Are you sure you want to delete this shipment?';
    if (!window.confirm(confirmMessage)) return;

    try {
      const response = await fetch(`/api/shipments/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchShipments();
      }
    } catch (error) {
      console.error('Error deleting shipment:', error);
    }
  };

  const openUpdateModal = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setUpdateData({
      status: shipment.status,
      currentLocation: '',
    });
    setShowUpdateModal(true);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${label} ${t('common.copied') || 'copied to clipboard'}!`);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }


  const openDetailsModal = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setShowDetailsModal(true);
  };

  const getEmbedCode = (trackingNumber: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `<!-- TrakoShip Tracking Widget -->
<iframe 
  src="${baseUrl}/embed/track/${trackingNumber}" 
  width="100%" 
  height="600" 
  frameborder="0"
  style="border: 1px solid #e2e8f0; border-radius: 0.5rem;"
></iframe>`;
  };

  const getTrackingUrl = (trackingNumber: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/${locale}/track/${trackingNumber}`;
  };

  const isRTL = locale === 'ar';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary-red border-t-transparent rounded-full"
          />
          <p className="text-gray-500">{t('common.loading')}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <AnimatedSection direction="down" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-red/10 rounded-xl flex items-center justify-center text-primary-red">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-soft-black">
              {t('dashboard.shipments.title')}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {shipments.length} {t('dashboard.shipments.total') || 'total shipments'}
            </p>
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => setShowModal(true)}
            size="lg"
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('dashboard.shipments.add')}
          </Button>
        </motion.div>
      </AnimatedSection>

      {/* Shipments Table/Cards */}
      {shipments.length === 0 ? (
        <AnimatedSection direction="up" delay={0.2}>
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6"
              >
                <Package className="w-12 h-12 text-gray-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-soft-black mb-2">
                {t('dashboard.shipments.empty.title') || 'No shipments yet'}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md">
                {t('dashboard.shipments.empty.description') || 'Create your first shipment to start tracking!'}
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button onClick={() => setShowModal(true)} size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  {t('dashboard.shipments.add')}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </AnimatedSection>
      ) : (
        <Card>
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-50/50">
                    <th className="text-left p-5 align-middle">
                      <span className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
                        <Package className="w-5 h-5 text-primary-red" />
                        {t('dashboard.shipments.trackingNumber')}
                      </span>
                    </th>
                    <th className="text-left p-5 align-middle">
                      <span className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
                        <User className="w-5 h-5 text-primary-red" />
                        {t('dashboard.shipments.customer')}
                      </span>
                    </th>
                    <th className="text-left p-5 align-middle">
                      <span className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
                        <Truck className="w-5 h-5 text-primary-red" />
                        {t('dashboard.shipments.status')}
                      </span>
                    </th>
                    <th className="text-left p-5 align-middle">
                      <span className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
                        <MapPin className="w-5 h-5 text-primary-red" />
                        {t('dashboard.shipments.origin')}
                      </span>
                    </th>
                    <th className="text-left p-5 align-middle">
                      <span className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
                        <MapPin className="w-5 h-5 text-primary-red" />
                        {t('dashboard.shipments.destination')}
                      </span>
                    </th>
                    <th className="text-left p-5 align-middle">
                      <span className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
                        <Calendar className="w-5 h-5 text-primary-red" />
                        {t('dashboard.shipments.date')}
                      </span>
                    </th>
                    <th className="text-left p-5 align-middle">
                      <span className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
                        <Edit className="w-5 h-5 text-primary-red" />
                        {t('dashboard.shipments.actions')}
                      </span>
                    </th>
                  </tr>
                </thead>
                <motion.tbody
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                >
                  {shipments.map((shipment) => {
                    const statusColors = getStatusColor(shipment.status);
                    const customerInitials = shipment.customer.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);
                    return (
                      <motion.tr
                        key={shipment.id}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          show: { opacity: 1, y: 0 }
                        }}
                        whileHover={{ backgroundColor: 'rgba(208, 25, 25, 0.03)', scale: 1.001 }}
                        className="border-b border-gray-100 transition-all duration-200 group"
                      >
                        <td className="p-5 align-middle">
                          <Link
                            href={`/${locale}/track/${shipment.trackingNumber}`}
                            className="flex items-center gap-2 group/link"
                          >
                            <div className="w-10 h-10 rounded-lg bg-primary-red/10 flex items-center justify-center group-hover/link:bg-primary-red/20 transition-colors">
                              <Package className="w-5 h-5 text-primary-red" />
                            </div>
                            <span className="font-bold text-primary-red group-hover/link:text-red-700 transition-colors text-sm">
                              {shipment.trackingNumber}
                            </span>
                          </Link>
                        </td>
                        <td className="p-5 align-middle">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center font-bold text-blue-600 text-xs shadow-sm">
                              {customerInitials}
                            </div>
                            <span className="font-medium text-gray-900 group-hover:text-primary-red transition-colors">
                              {shipment.customer.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-5 align-middle">
                          <Badge
                            className={`${statusColors.bg} ${statusColors.text} ${statusColors.border} border px-3 py-1.5 font-semibold text-xs shadow-sm`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${statusColors.bg.replace('bg-', 'bg-').replace('/50', '')} ${statusColors.border.replace('border-', 'border-')} border`} />
                              {getStatusLabel(shipment.status, t)}
                            </div>
                          </Badge>
                        </td>
                        <td className="p-5 align-middle">
                          <div className="flex items-center gap-2 text-gray-700">
                            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-orange-600" />
                            </div>
                            <span className="text-sm font-medium">{shipment.origin}</span>
                          </div>
                        </td>
                        <td className="p-5 align-middle">
                          <div className="flex items-center gap-2 text-gray-700">
                            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="text-sm font-medium">{shipment.destination}</span>
                          </div>
                        </td>
                        <td className="p-5 align-middle">
                          <div className="flex items-center gap-2 text-gray-700">
                            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium">
                              {format(new Date(shipment.createdAt), 'MMM dd, yyyy')}
                            </span>
                          </div>
                        </td>
                        <td className="p-5 align-middle">
                          <div className="flex items-center gap-2">
                            <motion.div
                              whileHover={{ scale: 1.15, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDetailsModal(shipment)}
                                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                title={t('common.view')}
                              >
                                <Package className="w-5 h-5" />
                              </Button>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.15, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openUpdateModal(shipment)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                title={t('common.edit')}
                              >
                                <Edit className="w-5 h-5" />
                              </Button>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.15, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(shipment.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                title={t('common.delete')}
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </motion.div>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </motion.tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-100">
              <StaggerContainer staggerChildren={0.05}>
                {shipments.map((shipment) => {
                  const statusColors = getStatusColor(shipment.status);
                  return (
                    <StaggerItem key={shipment.id}>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <Link
                            href={`/${locale}/track/${shipment.trackingNumber}`}
                            className="font-semibold text-primary-red hover:text-red-700 transition-colors flex items-center gap-2"
                          >
                            <Package className="w-4 h-4" />
                            {shipment.trackingNumber}
                          </Link>
                          <Badge
                            className={`${statusColors.bg} ${statusColors.text} ${statusColors.border} border`}
                          >
                            {getStatusLabel(shipment.status, t)}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="w-4 h-4 text-gray-400" />
                            {shipment.customer.name}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {shipment.origin} → {shipment.destination}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {format(new Date(shipment.createdAt), 'MMM dd, yyyy')}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openUpdateModal(shipment)}
                            className="flex-1 text-blue-600"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            {t('common.edit')}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(shipment.id)}
                            className="flex-1 text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t('common.delete')}
                          </Button>
                        </div>
                      </motion.div>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Shipment Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary-red" />
                    {t('dashboard.shipments.add')}
                  </CardTitle>
                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('dashboard.shipments.customer')}
                    </label>
                    <select
                      className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-red focus:border-primary-red outline-none transition-all"
                      value={formData.customerId}
                      onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                      required
                    >
                      <option value="">{t('dashboard.shipments.selectCustomer') || 'Select customer...'}</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <FloatingInput
                    label={t('dashboard.shipments.origin')}
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    required
                    startIcon={<MapPin className="w-5 h-5" />}
                  />

                  <FloatingInput
                    label={t('dashboard.shipments.destination')}
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    required
                    startIcon={<MapPin className="w-5 h-5" />}
                  />

                  <FloatingInput
                    label={t('dashboard.shipments.estimatedDelivery') || 'Estimated Delivery'}
                    type="date"
                    value={formData.estimatedDelivery}
                    onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
                    startIcon={<Calendar className="w-5 h-5" />}
                  />

                  <div className="border-t border-gray-100 my-2" />

                  <ShipmentTypeSelector
                    value={formData.shipmentType}
                    onChange={(value) => setFormData({ ...formData, shipmentType: value })}
                  />

                  <TransportMethodSelector
                    value={formData.transportMethod}
                    onChange={(value) => setFormData({ ...formData, transportMethod: value })}
                  />

                  <CargoUnitsSelector
                    value={formData.cargoUnits}
                    onChange={(value) => setFormData({ ...formData, cargoUnits: value })}
                  />

                  <div className="border-t border-gray-100 my-2" />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('dashboard.shipments.notes') || 'Notes'}
                    </label>
                    <textarea
                      className="w-full min-h-[100px] px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-red focus:border-primary-red outline-none transition-all resize-none"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder={t('dashboard.shipments.notesPlaceholder') || 'Optional notes...'}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowModal(false)}
                      className="flex-1"
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button type="submit" className="flex-1">
                      {t('common.save')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update Status Modal */}
      <AnimatePresence>
        {showUpdateModal && selectedShipment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUpdateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
            >
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary-red" />
                    {t('dashboard.shipments.updateStatus') || 'Update Shipment Status'}
                  </CardTitle>
                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowUpdateModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
                <p className="text-sm text-gray-500 mt-2 font-mono">
                  {selectedShipment.trackingNumber}
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleUpdateStatus} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('dashboard.shipments.status')}
                    </label>
                    <select
                      className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-red focus:border-primary-red outline-none transition-all"
                      value={updateData.status}
                      onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                      required
                    >
                      <option value="">{t('dashboard.shipments.selectStatus') || 'Select status...'}</option>
                      <option value="PENDING">PENDING</option>
                      <option value="PICKED_UP">PICKED_UP</option>
                      <option value="IN_TRANSIT">IN_TRANSIT</option>
                      <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="RETURNED">RETURNED</option>
                    </select>
                  </div>

                  <FloatingInput
                    label={t('dashboard.shipments.currentLocation') || 'Current Location'}
                    type="text"
                    value={updateData.currentLocation}
                    onChange={(e) => setUpdateData({ ...updateData, currentLocation: e.target.value })}
                    placeholder={t('dashboard.shipments.currentLocationPlaceholder') || 'Optional'}
                    startIcon={<MapPin className="w-5 h-5" />}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowUpdateModal(false)}
                      className="flex-1"
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button type="submit" className="flex-1">
                      {t('dashboard.shipments.updateStatus') || 'Update Status'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedShipment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary-red" />
                    {t('dashboard.shipments.viewDetails') || 'Shipment Details'}
                  </CardTitle>
                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-2xl font-mono font-bold text-soft-black">
                    {selectedShipment.trackingNumber}
                  </span>
                  <Badge className={`${getStatusColor(selectedShipment.status).bg} ${getStatusColor(selectedShipment.status).text} border`}>
                    {getStatusLabel(selectedShipment.status, t)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">

                {/* Route */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('dashboard.shipments.origin')}</p>
                    <p className="font-semibold text-gray-900">{selectedShipment.origin}</p>
                  </div>
                  <div className="flex-1 px-4 flex justify-center">
                    <Truck className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('dashboard.shipments.destination')}</p>
                    <p className="font-semibold text-gray-900">{selectedShipment.destination}</p>
                  </div>
                </div>

                {/* New Fields Display */}
                <div className="grid grid-cols-1 gap-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t('tracking.shipmentData') || 'Shipment Data'}</h3>
                  {selectedShipment.shipmentType && (
                    <div className="p-4 border border-gray-100 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">{t('dashboard.shipments.shipmentType')}</p>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-primary-red" />
                        <span className="font-medium text-gray-900">{selectedShipment.shipmentType}</span>
                      </div>
                    </div>
                  )}

                  {selectedShipment.transportMethod && (
                    <div className="p-4 border border-gray-100 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">{t('dashboard.shipments.transportMethod')}</p>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-primary-red" />
                        <span className="font-medium text-gray-900">
                          {t(`dashboard.shipments.transportMethods.${selectedShipment.transportMethod}.title`)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 pl-6">
                        {t(`dashboard.shipments.transportMethods.${selectedShipment.transportMethod}.description`)}
                      </p>
                    </div>
                  )}

                  {selectedShipment.cargoUnits && (
                    <div className="p-4 border border-gray-100 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">{t('dashboard.shipments.cargoUnits')}</p>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                          {selectedShipment.cargoUnits.quantity}
                        </span>
                        <span className="font-medium text-gray-900">
                          {t(`dashboard.shipments.cargoTypes.${selectedShipment.cargoUnits.type}`)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <Link
                    href={`/${locale}/track/${selectedShipment.trackingNumber}`}
                    className="w-full"
                    target="_blank"
                  >
                    <Button variant="outline" className="w-full">
                      {t('dashboard.shipments.viewTracking')}
                    </Button>
                  </Link>
                </div>

              </CardContent>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-soft-black mb-2">
                    {t('dashboard.shipments.success.title') || 'Shipment Created Successfully!'}
                  </h2>
                  <p className="text-gray-500">
                    {t('dashboard.shipments.success.description') || 'Your shipment has been created and a tracking number has been generated.'}
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📦 {t('dashboard.shipments.trackingNumber')}
                    </label>
                    <div className="flex gap-2">
                      <code className="flex-1 px-4 py-3 bg-white border-2 border-primary-red rounded-xl text-lg font-bold text-primary-red">
                        {newTrackingNumber}
                      </code>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="secondary"
                          onClick={() => copyToClipboard(newTrackingNumber, t('dashboard.shipments.trackingNumber'))}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          {t('common.copy') || 'Copy'}
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🔗 {t('dashboard.shipments.trackingUrl') || 'Tracking URL'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={getTrackingUrl(newTrackingNumber)}
                        readOnly
                        className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm"
                      />
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="secondary"
                          onClick={() => copyToClipboard(getTrackingUrl(newTrackingNumber), t('dashboard.shipments.trackingUrl') || 'Tracking URL')}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          {t('common.copy') || 'Copy'}
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📋 {t('dashboard.shipments.embedCode') || 'Embed Code (Widget)'}
                    </label>
                    <div className="flex gap-2">
                      <textarea
                        value={getEmbedCode(newTrackingNumber)}
                        readOnly
                        rows={6}
                        className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-mono resize-none"
                      />
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="secondary"
                          onClick={() => copyToClipboard(getEmbedCode(newTrackingNumber), t('dashboard.shipments.embedCode') || 'Embed code')}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          {t('common.copy') || 'Copy'}
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/${locale}/track/${newTrackingNumber}`}
                    className="flex-1"
                    onClick={() => setShowSuccessModal(false)}
                  >
                    <Button className="w-full">
                      {t('dashboard.shipments.viewTracking') || 'View Tracking Page'}
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    onClick={() => setShowSuccessModal(false)}
                    className="flex-1"
                  >
                    {t('common.close') || 'Close'}
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
