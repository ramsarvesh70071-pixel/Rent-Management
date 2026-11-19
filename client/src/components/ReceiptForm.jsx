import React, { useState } from 'react';
import { numberToWords } from '../utils/numberToWords';
import { getTodayISODate, getCurrentMonthYear, ALL_MONTHS } from '../utils/formatDate';
import {
  Eye,
  Printer,
  Save,
  UserPlus,
  Sparkles,
  Building2,
  Building,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle,
  Filter,
} from 'lucide-react';

export default function ReceiptForm({
  formData,
  setFormData,
  customers,
  settings,
  selectedProperty,
  onSelectProperty,
  onPreview,
  onSaveAndPrint,
  onSaveOnly,
  onOpenCustomerModal,
  onNavigateToSettings,
  loading,
}) {
  const [isEditingWords, setIsEditingWords] = useState(false);
  const [filterTenantsByProperty, setFilterTenantsByProperty] = useState(false);

  // Available properties from settings
  const properties = settings?.properties && settings?.properties.length > 0
    ? settings.properties
    : [
        {
          name: 'BUXIPUR SHER KOTHI',
          address: settings?.propertyAddress || 'BUXIPUR SHER KOTHI, GORAKHPUR',
          defaultShopNumber: settings?.defaultShopNumber || 'Second floor portion',
          ownerName: settings?.ownerName || 'SRI KIRTI AGRAWAL',
          ownerFatherName: settings?.ownerFatherName || 'LATE SRI SATYA PRAKASH AGRAWAL',
          isDefault: true,
        },
      ];

  // Active property object
  const currentProp =
    selectedProperty ||
    properties.find((p) => p.isDefault) ||
    properties[0];

  // Generate dynamic 12 months with current year first, plus adjacent years
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear + 1];

  // Handle amount change and auto convert to words dynamically
  const handleAmountChange = (e) => {
    const val = e.target.value;
    const words = numberToWords(val);
    setFormData((prev) => ({
      ...prev,
      amount: val,
      amountInWords: isEditingWords ? prev.amountInWords : words,
    }));
  };

  // Property Filter Switcher
  const handlePropertyFilterChange = (propName) => {
    const targetProp = properties.find(
      (p) => (p.name || '').toUpperCase() === (propName || '').toUpperCase()
    );
    if (targetProp && onSelectProperty) {
      onSelectProperty(targetProp);
    }
  };

  // Filtered customers based on current property if toggle is enabled
  const displayedCustomers = filterTenantsByProperty && currentProp
    ? customers.filter(
        (c) =>
          !c.propertyName ||
          c.propertyName.toUpperCase() === currentProp.name.toUpperCase()
      )
    : customers;

  // Select customer from dropdown: automatically fill all customer data dynamically
  const handleSelectCustomer = (cust) => {
    if (!cust) {
      setFormData((prev) => ({
        ...prev,
        customerId: '',
        customerName: '',
        customerFatherName: '',
        amount: '',
        amountInWords: '',
        shopNumber: currentProp?.defaultShopNumber || settings?.defaultShopNumber || 'Second floor portion',
      }));
      return;
    }
    const rentVal = cust.defaultAmount ? String(cust.defaultAmount) : '';
    const rentWords = rentVal ? numberToWords(rentVal) : '';
    const shopVal =
      cust.defaultShopNumber ||
      currentProp?.defaultShopNumber ||
      settings?.defaultShopNumber ||
      'Second floor portion';

    setFormData((prev) => ({
      ...prev,
      customerId: cust._id,
      customerName: cust.name,
      customerFatherName: cust.fatherName || '',
      shopNumber: shopVal,
      amount: rentVal,
      amountInWords: rentWords,
      // If customer is explicitly assigned to a property and user hasn't switched yet
      ...(cust.propertyName
        ? {
            propertyName: cust.propertyName,
          }
        : {}),
    }));
  };

  return (
    <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-5 sm:p-7">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-200">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 tracking-tight">
            Generate Rent Receipt
          </h2>
          <p className="text-xs text-stone-500 font-mono mt-0.5">
            Select property filter, tenant, or enter details to preview & print duplicate receipts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-stone-600 bg-stone-100 border border-stone-200 px-2.5 py-1 rounded">
            Receipt: <strong className="text-stone-900">#{formData.receiptNumber || '00015'}</strong>
          </span>
        </div>
      </div>

      {/* Property Filter Bar */}
      <div className="bg-stone-50 border border-stone-200 rounded-lg p-3.5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-stone-900 flex items-center justify-center text-white shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <label htmlFor="property-filter" className="block text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                <span>Property Filter</span>
                <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded font-mono font-normal">
                  {properties.length} available
                </span>
              </label>
              <p className="text-[11px] text-stone-500">
                Switch property to auto-fill address, portion, and owner header
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              id="property-filter"
              value={currentProp?.name || ''}
              onChange={(e) => handlePropertyFilterChange(e.target.value)}
              className="flex-1 sm:w-80 px-3 py-2 text-xs font-semibold uppercase bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-800 focus:border-stone-800 cursor-pointer shadow-2xs text-stone-900"
            >
              {properties.map((prop, idx) => (
                <option key={prop._id || idx} value={prop.name}>
                  {prop.name} {prop.isDefault ? '★ (Default)' : ''} — {prop.address}
                </option>
              ))}
            </select>
            {onNavigateToSettings && (
              <button
                type="button"
                onClick={onNavigateToSettings}
                className="text-xs text-stone-700 hover:text-black font-semibold bg-white border border-stone-200 hover:border-stone-400 px-2.5 py-2 rounded-md shadow-2xs whitespace-nowrap cursor-pointer transition-colors"
                title="Add or manage properties in Settings"
              >
                + Manage
              </button>
            )}
          </div>
        </div>

        {/* Selected Property Details Strip */}
        {currentProp && (
          <div className="mt-2.5 pt-2.5 border-t border-stone-200/80 flex flex-wrap items-center justify-between text-xs text-stone-600 gap-2">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-semibold text-stone-800 uppercase">{currentProp.name}:</span>
              <span className="text-stone-600 truncate">{currentProp.address}</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px] text-stone-500">
              <span>Portion: <strong className="text-stone-800">{currentProp.defaultShopNumber || 'Second floor portion'}</strong></span>
              <span>Owner: <strong className="text-stone-800">{currentProp.ownerName || settings?.ownerName}</strong></span>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onPreview();
        }}
        className="space-y-6"
      >
        {/* Section 1: Customer Details */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <span>1. Customer / Tenant Details</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              {currentProp && (
                <button
                  type="button"
                  onClick={() => setFilterTenantsByProperty(!filterTenantsByProperty)}
                  className="text-[11px] text-stone-500 hover:text-stone-900 underline flex items-center gap-1 cursor-pointer"
                >
                  <Filter className="w-3 h-3" />
                  <span>
                    {filterTenantsByProperty
                      ? `Filter: ${currentProp.name} (${displayedCustomers.length})`
                      : 'Filter by Property'}
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={onOpenCustomerModal}
                className="text-xs text-stone-800 hover:text-black font-medium flex items-center gap-1 hover:underline cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add New Customer</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quick Customer Dropdown */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Select Saved Customer {filterTenantsByProperty ? `(for ${currentProp?.name})` : ''}
              </label>
              <select
                value={formData.customerId || ''}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  if (!selectedId) {
                    handleSelectCustomer(null);
                    return;
                  }
                  const selected = customers.find((c) => c._id === selectedId);
                  if (selected) {
                    handleSelectCustomer(selected);
                  }
                }}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
              >
                <option value="">-- Select Saved Customer --</option>
                {displayedCustomers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} {c.defaultShopNumber ? `(${c.defaultShopNumber})` : ''}{' '}
                    {c.propertyName ? `[${c.propertyName}]` : ''}{' '}
                    {c.defaultAmount ? `- ₹${c.defaultAmount}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Name Input (Editable & Dynamic) */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Customer Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Select from dropdown or type customer name..."
                value={formData.customerName}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  setFormData((prev) => ({ ...prev, customerName: val }));
                }}
                required
                className="w-full px-3 py-2 text-sm uppercase bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-800 focus:border-stone-800 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Payment & Date Information */}
        <div className="pt-2 border-t border-stone-100">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-3">
            2. Payment & Date Details
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Rent Amount */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Rent Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-stone-400 font-mono">₹</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="7500"
                  value={formData.amount}
                  onChange={handleAmountChange}
                  required
                  className="w-full pl-7 pr-3 py-2 text-sm font-semibold bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
                />
              </div>
            </div>

            {/* Rent Month Dropdown with all 12 Months */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-stone-600">
                  Rent Month <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, rentMonth: getCurrentMonthYear() }))
                  }
                  className="text-[10px] text-stone-500 hover:text-stone-900 underline cursor-pointer"
                >
                  Current
                </button>
              </div>
              <select
                value={formData.rentMonth}
                onChange={(e) => setFormData((prev) => ({ ...prev, rentMonth: e.target.value }))}
                required
                className="w-full px-3 py-2 text-sm uppercase bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-800 focus:border-stone-800 font-medium"
              >
                {years.map((yr) => (
                  <optgroup key={yr} label={`Year ${yr}`}>
                    {ALL_MONTHS.map((m) => (
                      <option key={`${m} ${yr}`} value={`${m} ${yr}`}>
                        {m} {yr}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Receipt Date */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-stone-600">
                  Receipt Date <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, receiptDate: getTodayISODate() }))
                  }
                  className="text-[10px] text-stone-500 hover:text-stone-900 underline cursor-pointer"
                >
                  Today
                </button>
              </div>
              <input
                type="date"
                value={formData.receiptDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, receiptDate: e.target.value }))}
                required
                className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
              />
            </div>
          </div>

          {/* Amount in Words */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-stone-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>The Sum of Rupees (Amount in Words)</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  if (isEditingWords) {
                    setFormData((prev) => ({ ...prev, amountInWords: numberToWords(prev.amount) }));
                  }
                  setIsEditingWords(!isEditingWords);
                }}
                className="text-[11px] text-stone-500 hover:text-stone-800 underline cursor-pointer"
              >
                {isEditingWords ? 'Reset to Auto Convert' : 'Edit Words Manually'}
              </button>
            </div>
            <input
              type="text"
              value={formData.amountInWords}
              readOnly={!isEditingWords}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, amountInWords: e.target.value.toUpperCase() }))
              }
              placeholder="e.g. SEVEN THOUSAND FIVE HUNDRED ONLY"
              required
              className={`w-full px-3 py-2 text-sm font-typewriter uppercase tracking-wide rounded-md border ${
                isEditingWords
                  ? 'border-amber-400 bg-amber-50/20 focus:ring-1 focus:ring-amber-500 focus:outline-none'
                  : 'border-stone-200 bg-stone-50 text-stone-800 select-all'
              }`}
            />
          </div>
        </div>

        {/* Section 3: Property & Owner Details */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-stone-500" />
              <span>3. Property & Owner Specifications</span>
            </label>
            <span className="text-[11px] text-emerald-700 font-medium">
              {currentProp ? `Linked to: ${currentProp.name}` : 'Configured from Settings'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Property / Shop Number
              </label>
              <input
                type="text"
                placeholder="e.g. Second floor portion"
                value={formData.shopNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, shopNumber: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Property Address (IN ...)
              </label>
              <input
                type="text"
                placeholder="BUXIPUR  SHER KOTHI, GORAKHPUR"
                value={formData.propertyAddress}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, propertyAddress: e.target.value }))
                }
                className="w-full px-3 py-2 text-sm uppercase bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Owner Name
              </label>
              <input
                type="text"
                placeholder="SRI KIRTI AGRAWAL"
                value={formData.ownerName}
                onChange={(e) => setFormData((prev) => ({ ...prev, ownerName: e.target.value }))}
                className="w-full px-3 py-2 text-sm uppercase bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Owner Father's Name (S/O)
              </label>
              <input
                type="text"
                placeholder="LATE SRI SATYA PRAKASH AGRAWAL"
                value={formData.ownerFatherName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, ownerFatherName: e.target.value }))
                }
                className="w-full px-3 py-2 text-sm uppercase bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-black text-white text-sm font-semibold rounded-md shadow transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Receipt</span>
            </button>

            <button
              type="button"
              onClick={onSaveAndPrint}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-md shadow transition-colors cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              <span>Save & Print (A4 Double Copy)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSaveOnly}
              disabled={loading}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-md border border-stone-300 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save to History</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
