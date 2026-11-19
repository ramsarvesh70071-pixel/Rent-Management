import React, { useState, useEffect } from 'react';
import { X, User, Phone, MapPin, Building2, IndianRupee, FileText } from 'lucide-react';

export default function CustomerModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  properties = [],
  loading = false,
}) {
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    phone: '',
    address: '',
    defaultShopNumber: '',
    defaultAmount: '',
    propertyId: '',
    propertyName: '',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        fatherName: initialData.fatherName || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        defaultShopNumber: initialData.defaultShopNumber || '',
        defaultAmount: initialData.defaultAmount ? String(initialData.defaultAmount) : '',
        propertyId: initialData.propertyId || '',
        propertyName: initialData.propertyName || '',
        notes: initialData.notes || '',
      });
    } else {
      // Default to default property if available
      const defProp = properties.find((p) => p.isDefault) || properties[0];
      setFormData({
        name: '',
        fatherName: '',
        phone: '',
        address: '',
        defaultShopNumber: defProp ? defProp.defaultShopNumber : '',
        defaultAmount: '',
        propertyId: defProp ? (defProp._id || '') : '',
        propertyName: defProp ? defProp.name : '',
        notes: '',
      });
    }
  }, [initialData, isOpen, properties]);

  if (!isOpen) return null;

  const handlePropertyChange = (selectedName) => {
    if (!selectedName) {
      setFormData((prev) => ({
        ...prev,
        propertyName: '',
        propertyId: '',
      }));
      return;
    }
    const prop = properties.find(
      (p) => (p.name || '').toUpperCase() === selectedName.toUpperCase()
    );
    setFormData((prev) => ({
      ...prev,
      propertyName: selectedName,
      propertyId: prop ? (prop._id || '') : '',
      defaultShopNumber: prev.defaultShopNumber || (prop ? prop.defaultShopNumber : ''),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
  };

  return (
    <div
      id="modal-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-stone-700" />
            <h3 className="text-base font-semibold text-stone-900">
              {initialData ? 'Edit Customer / Tenant' : 'Add New Customer / Tenant'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-md hover:bg-stone-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Customer Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. SRI SUNNY KUMAR"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-800 focus:border-stone-800 font-medium"
            />
          </div>

          {/* Assigned Property */}
          {properties && properties.length > 0 && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-stone-500" />
                <span>Assigned Property / Building</span>
              </label>
              <select
                value={formData.propertyName || ''}
                onChange={(e) => handlePropertyChange(e.target.value)}
                className="w-full px-3 py-2 text-sm uppercase bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
              >
                <option value="">-- Unassigned / Any Property --</option>
                {properties.map((p, idx) => (
                  <option key={p._id || idx} value={p.name}>
                    {p.name} {p.isDefault ? '(Default)' : ''} — {p.address}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-stone-400">
                  <Phone className="w-3.5 h-3.5" />
                </span>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
                />
              </div>
            </div>

            {/* Default Amount */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Default Rent (₹) (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-stone-400 font-mono text-sm">₹</span>
                <input
                  type="number"
                  placeholder="7500"
                  value={formData.defaultAmount}
                  onChange={(e) => setFormData({ ...formData, defaultAmount: e.target.value })}
                  className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
                />
              </div>
            </div>
          </div>

          {/* Default Shop / Portion */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Shop / Portion Number (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Second floor portion, Shop No. 1"
              value={formData.defaultShopNumber}
              onChange={(e) => setFormData({ ...formData, defaultShopNumber: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
            />
          </div>

          {/* Customer Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Customer Address / R/O (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Buxipur, Gorakhpur"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Internal Notes (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Leased since 2024, pays 5th of every month"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-stone-900 hover:bg-black text-white text-sm font-semibold rounded-md shadow transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Saving...' : initialData ? 'Update Customer' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
