import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Save,
  Building2,
  Hash,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Star,
  X,
  MapPin,
  User,
} from 'lucide-react';

export default function SettingsModal({
  settings,
  onSaveSettings,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    ownerName: '',
    ownerFatherName: '',
    propertyAddress: '',
    defaultShopNumber: '',
    properties: [],
    currencyPrefix: 'Rs.',
    receiptNumberPrefix: '',
    receiptNumberPadding: 5,
    setNextSequenceNumber: '',
  });

  // State for Add / Edit Property Modal
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [editingPropIndex, setEditingPropIndex] = useState(null);
  const [propForm, setPropForm] = useState({
    name: '',
    address: '',
    defaultShopNumber: '',
    ownerName: '',
    ownerFatherName: '',
    isDefault: false,
  });

  // Lock body scroll while inner modal is open & handle Esc
  useEffect(() => {
    if (!isPropertyModalOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsPropertyModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPropertyModalOpen]);

  useEffect(() => {
    if (settings) {
      const defaultOwner = settings.ownerName || 'SRI KIRTI AGRAWAL';
      const defaultFather = settings.ownerFatherName || 'LATE SRI SATYA PRAKASH AGRAWAL';
      const defaultAddr = settings.propertyAddress || 'BUXIPUR SHER KOTHI, GORAKHPUR';
      const defaultShop = settings.defaultShopNumber || 'Second floor portion';

      let props = settings.properties && settings.properties.length > 0 ? settings.properties : [];
      if (props.length === 0) {
        props = [
          {
            name: 'BUXIPUR SHER KOTHI',
            address: defaultAddr,
            defaultShopNumber: defaultShop,
            ownerName: defaultOwner,
            ownerFatherName: defaultFather,
            isDefault: true,
          },
        ];
      }

      setFormData({
        ownerName: defaultOwner,
        ownerFatherName: defaultFather,
        propertyAddress: defaultAddr,
        defaultShopNumber: defaultShop,
        properties: props,
        currencyPrefix: settings.currencyPrefix || 'Rs.',
        receiptNumberPrefix: settings.receiptNumberPrefix || '',
        receiptNumberPadding: settings.receiptNumberPadding || 5,
        setNextSequenceNumber: settings.nextReceiptNumber ? String(settings.nextReceiptNumber) : '',
      });
    }
  }, [settings]);

  // Handle open Add Property
  const handleOpenAddProperty = () => {
    setEditingPropIndex(null);
    setPropForm({
      name: '',
      address: '',
      defaultShopNumber: '',
      ownerName: formData.ownerName || '',
      ownerFatherName: formData.ownerFatherName || '',
      isDefault: formData.properties.length === 0,
    });
    setIsPropertyModalOpen(true);
  };

  // Handle open Edit Property
  const handleOpenEditProperty = (index) => {
    const prop = formData.properties[index];
    if (!prop) return;
    setEditingPropIndex(index);
    setPropForm({
      name: prop.name || '',
      address: prop.address || '',
      defaultShopNumber: prop.defaultShopNumber || '',
      ownerName: prop.ownerName || formData.ownerName || '',
      ownerFatherName: prop.ownerFatherName || formData.ownerFatherName || '',
      isDefault: Boolean(prop.isDefault),
    });
    setIsPropertyModalOpen(true);
  };

  // Save single property into properties array
  const handleSavePropertyForm = (e) => {
    e.preventDefault();
    if (!propForm.name.trim() || !propForm.address.trim()) return;

    const newProp = {
      name: propForm.name.trim().toUpperCase(),
      address: propForm.address.trim().toUpperCase(),
      defaultShopNumber: propForm.defaultShopNumber.trim(),
      ownerName: (propForm.ownerName || formData.ownerName).trim().toUpperCase(),
      ownerFatherName: (propForm.ownerFatherName || formData.ownerFatherName).trim().toUpperCase(),
      isDefault: propForm.isDefault,
    };

    let updatedList = [...formData.properties];

    if (editingPropIndex !== null) {
      if (newProp.isDefault) {
        updatedList = updatedList.map((p, idx) => ({
          ...p,
          isDefault: idx === editingPropIndex,
        }));
      }
      updatedList[editingPropIndex] = {
        ...updatedList[editingPropIndex],
        ...newProp,
      };
    } else {
      if (newProp.isDefault) {
        updatedList = updatedList.map((p) => ({ ...p, isDefault: false }));
      }
      updatedList.push(newProp);
    }

    if (!updatedList.some((p) => p.isDefault) && updatedList.length > 0) {
      updatedList[0].isDefault = true;
    }

    const defProp = updatedList.find((p) => p.isDefault) || updatedList[0];

    setFormData((prev) => ({
      ...prev,
      properties: updatedList,
      propertyAddress: defProp ? defProp.address : prev.propertyAddress,
      defaultShopNumber: defProp ? defProp.defaultShopNumber : prev.defaultShopNumber,
    }));

    setIsPropertyModalOpen(false);
  };

  // Set a property as default
  const handleSetDefaultProperty = (index) => {
    const updated = formData.properties.map((p, idx) => ({
      ...p,
      isDefault: idx === index,
    }));
    const defProp = updated[index];
    setFormData((prev) => ({
      ...prev,
      properties: updated,
      propertyAddress: defProp.address,
      defaultShopNumber: defProp.defaultShopNumber,
      ownerName: defProp.ownerName || prev.ownerName,
      ownerFatherName: defProp.ownerFatherName || prev.ownerFatherName,
    }));
  };

  // Delete a property
  const handleDeleteProperty = (index) => {
    if (formData.properties.length <= 1) {
      alert('You must keep at least one property configured.');
      return;
    }
    const propToDelete = formData.properties[index];
    if (!window.confirm(`Are you sure you want to delete property "${propToDelete.name}"?`)) {
      return;
    }

    let updated = formData.properties.filter((_, idx) => idx !== index);
    if (propToDelete.isDefault && updated.length > 0) {
      updated[0].isDefault = true;
    }

    const defProp = updated.find((p) => p.isDefault) || updated[0];

    setFormData((prev) => ({
      ...prev,
      properties: updated,
      propertyAddress: defProp ? defProp.address : prev.propertyAddress,
      defaultShopNumber: defProp ? defProp.defaultShopNumber : prev.defaultShopNumber,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-4xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl md:rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-6 md:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 shrink-0">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight leading-tight">
                Owner & Property Settings
              </h2>
              <p className="text-xs text-stone-500 font-mono mt-0.5">
                Manage multiple properties, ownership headers, and numbering
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-black active:bg-stone-950 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer min-h-[44px] touch-manipulation disabled:opacity-50 w-full sm:w-auto"
          >
            <Save className="w-4 h-4 shrink-0" />
            <span>{loading ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>

        {/* Section 1: Multiple Properties Management */}
        <div className="mt-5 sm:mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 mb-3.5">
            <div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-stone-700" />
                <span>Managed Properties ({formData.properties.length})</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Each property has its own address, unit portion, and header.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddProperty}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer min-h-[44px] touch-manipulation self-start sm:self-auto w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Property</span>
            </button>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {formData.properties.map((prop, idx) => (
              <div
                key={prop._id || idx}
                className={`relative rounded-xl border p-4 transition-all ${
                  prop.isDefault
                    ? 'border-emerald-500 bg-emerald-50/20 shadow-xs ring-1 ring-emerald-400'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                {/* Header with Title and Default Badge */}
                <div className="flex items-start justify-between gap-2 pb-2 mb-2 border-b border-stone-100">
                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                    <span className="font-bold text-sm sm:text-base text-stone-900 tracking-tight break-words">
                      {prop.name || `Property ${idx + 1}`}
                    </span>
                    {prop.isDefault && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200 font-mono">
                        <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                        Default
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEditProperty(idx)}
                      className="p-2 text-stone-500 hover:text-stone-900 active:bg-stone-100 rounded-lg transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center touch-manipulation"
                      title="Edit Property"
                      aria-label={`Edit ${prop.name}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {formData.properties.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteProperty(idx)}
                        className="p-2 text-stone-400 hover:text-rose-600 active:bg-rose-50 rounded-lg transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center touch-manipulation"
                        title="Delete Property"
                        aria-label={`Delete ${prop.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <span className="font-medium text-stone-800 uppercase tracking-wide break-words">
                      {prop.address || '—'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 pl-5 text-stone-500">
                    <span className="font-medium">Default Unit:</span>
                    <span className="text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded font-mono text-[11px]">
                      {prop.defaultShopNumber || 'Second floor portion'}
                    </span>
                  </div>

                  <div className="flex items-start gap-1.5 pl-5 text-stone-500">
                    <span className="font-medium">Owner:</span>
                    <span className="text-stone-700 uppercase truncate">
                      {prop.ownerName || formData.ownerName}
                      {(prop.ownerFatherName || formData.ownerFatherName) &&
                        ` S/O ${prop.ownerFatherName || formData.ownerFatherName}`}
                    </span>
                  </div>
                </div>

                {/* Card Footer: Set Default Button */}
                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                  {!prop.isDefault ? (
                    <button
                      type="button"
                      onClick={() => handleSetDefaultProperty(idx)}
                      className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1.5 cursor-pointer min-h-[36px] py-1 touch-manipulation"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Set as Default</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active for new receipts
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Global Owner Profile */}
        <div className="mt-6 pt-5 border-t border-stone-200">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900 mb-3 flex items-center gap-1.5">
            <User className="w-4 h-4 text-stone-700" />
            <span>Reset Owner Profile (Fallback)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Owner Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.ownerName}
                onChange={(e) =>
                  setFormData({ ...formData, ownerName: e.target.value.toUpperCase() })
                }
                placeholder="SRI KIRTI AGRAWAL"
                className="w-full px-3.5 py-2.5 text-base sm:text-sm uppercase bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[48px] touch-manipulation"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Owner's Father Name (S/O) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.ownerFatherName}
                onChange={(e) =>
                  setFormData({ ...formData, ownerFatherName: e.target.value.toUpperCase() })
                }
                placeholder="LATE SRI SATYA PRAKASH AGRAWAL"
                className="w-full px-3.5 py-2.5 text-base sm:text-sm uppercase bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[48px] touch-manipulation"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Receipt Sequence Controls */}
        <div className="mt-5 pt-5 border-t border-stone-200">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900 mb-3 flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-stone-700" />
            <span>Receipt Sequence Numbering</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Next Receipt Number Sequence
              </label>
              <input
                type="number"
                min="1"
                inputMode="numeric"
                value={formData.setNextSequenceNumber}
                onChange={(e) =>
                  setFormData({ ...formData, setNextSequenceNumber: e.target.value })
                }
                placeholder="15"
                className="w-full px-3.5 py-2.5 text-base sm:text-sm font-mono bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[48px] touch-manipulation"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Sequence number for the upcoming receipt (e.g. 15 for #00015)
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Zero Padding Digits
              </label>
              <input
                type="number"
                min="1"
                max="10"
                inputMode="numeric"
                value={formData.receiptNumberPadding}
                onChange={(e) =>
                  setFormData({ ...formData, receiptNumberPadding: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-base sm:text-sm font-mono bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[48px] touch-manipulation"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Default is 5 (outputs "00015")
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 hover:bg-black active:bg-stone-950 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer min-h-[48px] touch-manipulation disabled:opacity-50 w-full sm:w-auto"
          >
            <Save className="w-4 h-4 shrink-0" />
            <span>{loading ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Property Modal (Mobile Bottom-Sheet) */}
      {isPropertyModalOpen && (
        <div
          id="property-modal-backdrop"
          onClick={(e) => {
            if (e.target.id === 'property-modal-backdrop') setIsPropertyModalOpen(false);
          }}
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col border border-stone-200 overflow-hidden animate-in slide-in-from-bottom duration-200 sm:duration-150 sm:fade-in sm:zoom-in-95">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stone-200 bg-stone-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 leading-tight">
                    {editingPropIndex !== null ? 'Edit Property' : 'Add New Property'}
                  </h3>
                  <p className="text-xs text-stone-500 font-mono">
                    Configure address and default rental portion
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPropertyModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 active:bg-stone-200 p-2 rounded-lg cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePropertyForm} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {/* Property Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Property Name / Alias <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BUXIPUR SHER KOTHI, CIVIL LINES"
                  value={propForm.name}
                  onChange={(e) =>
                    setPropForm({ ...propForm, name: e.target.value.toUpperCase() })
                  }
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm uppercase bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[48px] touch-manipulation"
                />
              </div>

              {/* Property Address */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Property Address (IN ...) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BUXIPUR SHER KOTHI, GORAKHPUR"
                  value={propForm.address}
                  onChange={(e) =>
                    setPropForm({ ...propForm, address: e.target.value.toUpperCase() })
                  }
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm uppercase bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[48px] touch-manipulation"
                />
              </div>

              {/* Default Shop / Portion */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Default Shop / Unit / Portion Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. Second floor portion, Shop No. 1"
                  value={propForm.defaultShopNumber}
                  onChange={(e) =>
                    setPropForm({ ...propForm, defaultShopNumber: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[48px] touch-manipulation"
                />
              </div>

              {/* Custom Owner Header */}
              <div className="pt-2 border-t border-stone-100">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  Owner Header Override (Optional)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">
                      Owner Name
                    </label>
                    <input
                      type="text"
                      placeholder={formData.ownerName || 'SRI KIRTI AGRAWAL'}
                      value={propForm.ownerName}
                      onChange={(e) =>
                        setPropForm({ ...propForm, ownerName: e.target.value.toUpperCase() })
                      }
                      className="w-full px-3 py-2 text-base sm:text-xs uppercase bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[44px] touch-manipulation"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">
                      Father's Name (S/O)
                    </label>
                    <input
                      type="text"
                      placeholder={formData.ownerFatherName || 'LATE SRI SATYA PRAKASH AGRAWAL'}
                      value={propForm.ownerFatherName}
                      onChange={(e) =>
                        setPropForm({
                          ...propForm,
                          ownerFatherName: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full px-3 py-2 text-base sm:text-xs uppercase bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[44px] touch-manipulation"
                    />
                  </div>
                </div>
              </div>

              {/* Set as Default Checkbox */}
              <div className="pt-2 flex items-center gap-3 min-h-[44px]">
                <input
                  type="checkbox"
                  id="propIsDefault"
                  checked={propForm.isDefault}
                  onChange={(e) =>
                    setPropForm({ ...propForm, isDefault: e.target.checked })
                  }
                  className="w-5 h-5 rounded text-stone-900 border-stone-300 focus:ring-stone-900 cursor-pointer"
                />
                <label
                  htmlFor="propIsDefault"
                  className="text-xs font-medium text-stone-700 cursor-pointer select-none"
                >
                  Set as default property for new receipts
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3 pb-safe">
                <button
                  type="button"
                  onClick={() => setIsPropertyModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-stone-600 hover:text-stone-900 cursor-pointer min-h-[48px] touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-stone-900 hover:bg-black active:bg-stone-950 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer min-h-[48px] touch-manipulation"
                >
                  {editingPropIndex !== null ? 'Update Property' : 'Add Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
