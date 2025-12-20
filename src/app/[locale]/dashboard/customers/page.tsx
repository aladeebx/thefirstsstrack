'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FloatingInput } from '@/components/ui/FloatingInput';
import { AnimatedSection } from '@/components/ui/animations/AnimatedSection';
import { StaggerContainer, StaggerItem } from '@/components/ui/animations/StaggerContainer';

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
  _count: {
    shipments: number;
  };
}

export default function CustomersPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      setCustomers(data.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingCustomer
        ? `/api/customers/${editingCustomer.id}`
        : '/api/customers';
      const method = editingCustomer ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({ name: '', email: '', phone: '', address: '' });
        setEditingCustomer(null);
        fetchCustomers();
      }
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    const confirmMessage = t('dashboard.customers.confirmDelete') || 'Are you sure you want to delete this customer?';
    if (!window.confirm(confirmMessage)) return;

    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCustomers();
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const openAddModal = () => {
    setEditingCustomer(null);
    setFormData({ name: '', email: '', phone: '', address: '' });
    setShowModal(true);
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
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-soft-black">
              {t('dashboard.customers.title')}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {customers.length} {t('dashboard.customers.total') || 'total customers'}
            </p>
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={openAddModal}
            size="lg"
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('dashboard.customers.add')}
          </Button>
        </motion.div>
      </AnimatedSection>

      {/* Customers Table/Cards */}
      {customers.length === 0 ? (
        <AnimatedSection direction="up" delay={0.2}>
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6"
              >
                <Users className="w-12 h-12 text-gray-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-soft-black mb-2">
                {t('dashboard.customers.empty.title') || 'No customers yet'}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md">
                {t('dashboard.customers.empty.description') || 'Add your first customer to start managing shipments!'}
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button onClick={openAddModal} size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  {t('dashboard.customers.add')}
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
                    <th className="text-left p-5">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
                        <User className="w-5 h-5 text-primary-red" />
                        {t('dashboard.customers.name')}
                      </div>
                    </th>
                    <th className="text-left p-5">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
                        <Mail className="w-5 h-5 text-primary-red" />
                        {t('dashboard.customers.email')}
                      </div>
                    </th>
                    <th className="text-left p-5">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
                        <Phone className="w-5 h-5 text-primary-red" />
                        {t('dashboard.customers.phone')}
                      </div>
                    </th>
                    <th className="text-left p-5">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
                        <Package className="w-5 h-5 text-primary-red" />
                        {t('dashboard.customers.shipments')}
                      </div>
                    </th>
                    <th className="text-left p-5">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
                        <Edit className="w-5 h-5 text-primary-red" />
                        {t('dashboard.customers.actions')}
                      </div>
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
                  {customers.map((customer) => {
                    const initials = customer.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);
                    return (
                      <motion.tr
                        key={customer.id}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          show: { opacity: 1, y: 0 }
                        }}
                        whileHover={{ backgroundColor: 'rgba(208, 25, 25, 0.03)', scale: 1.001 }}
                        className="border-b border-gray-100 transition-all duration-200 group"
                      >
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-red/20 to-primary-red/10 flex items-center justify-center font-bold text-primary-red text-sm shadow-sm">
                              {initials}
                            </div>
                            <span className="font-semibold text-gray-900 group-hover:text-primary-red transition-colors">
                              {customer.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-5">
                          {customer.email ? (
                            <div className="flex items-center gap-3 text-gray-700">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                <Mail className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="text-sm">{customer.email}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic text-sm">-</span>
                          )}
                        </td>
                        <td className="p-5">
                          {customer.phone ? (
                            <div className="flex items-center gap-3 text-gray-700">
                              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                                <Phone className="w-4 h-4 text-green-600" />
                              </div>
                              <span className="text-sm font-medium">{customer.phone}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic text-sm">-</span>
                          )}
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            <div className="px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg flex items-center gap-2">
                              <Package className="w-4 h-4 text-purple-600" />
                              <span className="text-purple-700 font-bold text-sm">
                                {customer._count.shipments}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            <motion.div
                              whileHover={{ scale: 1.15, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(customer)}
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
                                onClick={() => handleDelete(customer.id)}
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
                {customers.map((customer) => (
                  <StaggerItem key={customer.id}>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-gray-400" />
                          <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 font-medium">
                            {customer._count.shipments}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        {customer.email && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {customer.email}
                          </div>
                        )}
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {customer.phone}
                          </div>
                        )}
                        {customer.address && (
                          <div className="flex items-start gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                            <span className="flex-1">{customer.address}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(customer)}
                          className="flex-1 text-blue-600"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          {t('common.edit')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(customer.id)}
                          className="flex-1 text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t('common.delete')}
                        </Button>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Customer Modal */}
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
                    {editingCustomer ? (
                      <>
                        <Edit className="w-5 h-5 text-primary-red" />
                        {t('dashboard.customers.edit')}
                      </>
                    ) : (
                      <>
                        <Users className="w-5 h-5 text-primary-red" />
                        {t('dashboard.customers.add')}
                      </>
                    )}
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
                  <FloatingInput
                    label={t('dashboard.customers.name')}
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    startIcon={<User className="w-5 h-5" />}
                  />

                  <FloatingInput
                    label={t('dashboard.customers.email')}
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    startIcon={<Mail className="w-5 h-5" />}
                  />

                  <FloatingInput
                    label={t('dashboard.customers.phone')}
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    startIcon={<Phone className="w-5 h-5" />}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('dashboard.customers.address')}
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-3.5 text-gray-400 z-10">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <textarea
                        className="w-full min-h-[100px] pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-red focus:border-primary-red outline-none transition-all resize-none"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder={t('dashboard.customers.addressPlaceholder') || 'Enter customer address...'}
                      />
                    </div>
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
    </div>
  );
}
