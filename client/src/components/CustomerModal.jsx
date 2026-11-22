import React, { useState, useEffect } from 'react';
import { X, User, Phone, Building2 } from 'lucide-react';

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

  // Lock body scroll while modal is open & handle Esc key
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

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
      onClick={(e) => {
        if (e.target.id === 'modal-backdrop') onClose();
      }}
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customer-modal-title"
    >
      <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col border border-stone-200 overflow-hidden animate-in slide-in-from-bottom duration-200 sm:duration-150 sm:fade-in sm:zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stone-200 bg-stone-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-white shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 id="customer-modal-title" className="text-base font-bold text-stone-900 leading-tight">
                {initialData ? 'Edit Tenant / Customer' : 'Add New Tenant'}
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                {initialData ? 'Update contact & unit details' : 'Save tenant profile for quick receipts'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 active:bg-stone-200 p-2 rounded-lg cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* Tenant Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Customer / Tenant Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. SRI SUNNY KUMAR"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
              autoComplete="name"
              enterKeyHint="next"
              className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 font-medium min-h-[48px] touch-manipulation"
            />
          </div>

          {/* Father's Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Father's Name / R/O (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. LATE SRI RAMESH KUMAR"
              value={formData.fatherName}
              onChange={(e) => setFormData({ ...formData, fatherName: e.target.value.toUpperCase() })}
              enterKeyHint="next"
              className="w-full px-3.5 py-2.5 text-base sm:text-sm uppercase bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[48px] touch-manipulation"
            />
          </div>

          {/* Assigned Property */}
          {properties && properties.length > 0 && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-stone-500" />
                <span>Assigned Property / Location</span>
              </label>
              <select
                value={formData.propertyName || ''}
                onChange={(e) => handlePropertyChange(e.target.value)}
                className="w-full px-3.5 py-2.5 text-base sm:text-sm uppercase bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[48px] touch-manipulation"
              >
                <option value="">-- Unassigned / Any Property --</option>
                {properties.map((p, idx) => (
                  <option key={p._id || idx} value={p.name}>
                    {p.name} {p.isDefault ? '(Default)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Phone & Default Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-stone-400">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 text-base sm:text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[48px] touch-manipulation"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Default Monthly Rent (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-stone-400 font-mono text-base font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="7500"
                  value={formData.defaultAmount}
                  onChange={(e) => setFormData({ ...formData, defaultAmount: e.target.value })}
                  className="w-full pl-8 pr-3.5 py-2.5 text-base sm:text-sm font-semibold bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[48px] touch-manipulation"
                />
              </div>
            </div>
          </div>

          {/* Unit / Shop Number */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Shop / Unit / Portion Number (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Second floor portion, Shop No. 1"
              value={formData.defaultShopNumber}
              onChange={(e) => setFormData({ ...formData, defaultShopNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[48px] touch-manipulation"
            />
          </div>

          {/* Customer Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Customer Address (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Buxipur, Gorakhpur"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[48px] touch-manipulation"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Internal Notes (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Leased since 2024, pays on 5th"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 touch-manipulation"
            ></textarea>
          </div>

          {/* Sticky Footer in Form */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3 pb-safe">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-stone-600 hover:text-stone-900 cursor-pointer min-h-[48px] touch-manipulation"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-stone-900 hover:bg-black active:bg-stone-950 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer min-h-[48px] touch-manipulation disabled:opacity-50"
            >
              {loading ? 'Saving...' : initialData ? 'Update Tenant' : 'Save Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
