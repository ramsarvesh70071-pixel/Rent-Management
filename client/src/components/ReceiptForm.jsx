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
  MapPin,
  Filter,
  ChevronDown,
  ChevronUp,
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
  const [isPropertyDetailsOpen, setIsPropertyDetailsOpen] = useState(false);

  // Available properties from settings
  const properties =
    settings?.properties && settings?.properties.length > 0
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
    selectedProperty || properties.find((p) => p.isDefault) || properties[0];

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
  const displayedCustomers =
    filterTenantsByProperty && currentProp
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
        shopNumber:
          currentProp?.defaultShopNumber ||
          settings?.defaultShopNumber ||
          'Second floor portion',
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
      ...(cust.propertyName
        ? {
            propertyName: cust.propertyName,
          }
        : {}),
    }));
  };

  return (
    <div className="bg-white rounded-xl md:rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-6 md:p-7">
      {/* Top Header Card */}
      <div className="flex items-center justify-between pb-4 mb-4 sm:mb-6 border-b border-stone-200">
        <div className="min-w-0 pr-2">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight leading-tight">
            Generate Rent Receipt
          </h2>
          <p className="text-xs text-stone-500 font-mono mt-0.5 truncate">
            Fill tenant details to preview and print duplicate copies
          </p>
        </div>

        <div className="shrink-0">
          <span className="inline-flex items-center gap-1 text-xs font-mono font-medium text-stone-700 bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-md">
            Receipt: <strong className="text-stone-950 font-bold">#{formData.receiptNumber || '00015'}</strong>
          </span>
        </div>
      </div>

      {/* Property Filter Banner Card */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 sm:p-4 mb-5 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-white shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <label
                htmlFor="property-filter"
                className="block text-xs font-bold uppercase tracking-wider text-stone-900"
              >
                Property / Location
              </label>
              <p className="text-[11px] text-stone-500 truncate">
                Switches address & owner header
              </p>
            </div>
          </div>

          <div className="flex flex-row items-center gap-2 w-full sm:w-auto min-w-0">
            <select
              id="property-filter"
              value={currentProp?.name || ''}
              onChange={(e) => handlePropertyFilterChange(e.target.value)}
              className="flex-1 min-w-0 sm:w-72 px-3 py-2.5 sm:py-2 text-sm sm:text-xs font-semibold uppercase bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 cursor-pointer shadow-xs text-stone-900 min-h-[44px]"
            >
              {properties.map((prop, idx) => (
                <option key={prop._id || idx} value={prop.name}>
                  {prop.name} {prop.isDefault ? '★ (Default)' : ''}
                </option>
              ))}
            </select>
            {onNavigateToSettings && (
              <button
                type="button"
                onClick={onNavigateToSettings}
                className="shrink-0 text-xs text-stone-700 hover:text-black font-semibold bg-white border border-stone-200 hover:border-stone-400 active:bg-stone-100 px-3 py-2 rounded-lg shadow-xs whitespace-nowrap cursor-pointer transition-colors min-h-[44px] flex items-center justify-center touch-manipulation"
                title="Manage properties in Settings"
              >
                + Manage
              </button>
            )}
          </div>
        </div>

        {/* Selected Property Details */}
        {currentProp && (
          <div className="mt-2.5 pt-2 border-t border-stone-200/80 flex flex-wrap items-center justify-between text-xs text-stone-600 gap-1.5">
            <div className="flex items-center gap-1.5 truncate min-w-0">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-semibold text-stone-900 uppercase truncate">
                {currentProp.name}:
              </span>
              <span className="text-stone-600 truncate">{currentProp.address}</span>
            </div>
            <div className="text-[11px] font-mono text-stone-500">
              Portion: <strong className="text-stone-800">{currentProp.defaultShopNumber || 'Second floor portion'}</strong>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onPreview();
        }}
        className="space-y-5 sm:space-y-6"
      >
        {/* Section 1: Customer Details */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1">
              <span>1. Tenant Details</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {currentProp && (
                <button
                  type="button"
                  onClick={() => setFilterTenantsByProperty(!filterTenantsByProperty)}
                  className="text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 px-3 py-2 rounded-lg transition-colors flex items-center gap-1 cursor-pointer min-h-[44px] touch-manipulation"
                >
                  <Filter className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    {filterTenantsByProperty
                      ? `Filter: ${currentProp.name} (${displayedCustomers.length})`
                      : 'Filter by Property'}
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={onOpenCustomerModal}
                className="text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 px-3 py-2 rounded-lg transition-colors flex items-center gap-1 cursor-pointer min-h-[44px] touch-manipulation shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5 text-stone-700 shrink-0" />
                <span>+ Add Tenant</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {/* Quick Customer Dropdown */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Select Saved Tenant
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
                className="w-full px-3 py-2.5 text-base sm:text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[48px] touch-manipulation"
              >
                <option value="">-- Select Saved Tenant --</option>
                {displayedCustomers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} {c.defaultShopNumber ? `(${c.defaultShopNumber})` : ''}{' '}
                    {c.defaultAmount ? `- ₹${c.defaultAmount}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Name Input */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Customer / Tenant Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Type name or select above..."
                value={formData.customerName}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  setFormData((prev) => ({ ...prev, customerName: val }));
                }}
                required
                autoComplete="off"
                enterKeyHint="next"
                className="w-full px-3 py-2.5 text-base sm:text-sm uppercase bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 font-semibold min-h-[48px] touch-manipulation"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Payment & Date Information */}
        <div className="pt-2 border-t border-stone-100">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-800 block mb-2">
            2. Payment & Date Details
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Rent Amount */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Rent Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-base sm:text-sm text-stone-400 font-mono font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  placeholder="7500"
                  value={formData.amount}
                  onChange={handleAmountChange}
                  required
                  enterKeyHint="next"
                  className="w-full pl-8 pr-3 py-2.5 text-base sm:text-sm font-bold bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[48px] touch-manipulation"
                />
              </div>
            </div>

            {/* Rent Month Dropdown */}
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
                  className="text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 px-2.5 py-1 rounded-md font-medium cursor-pointer touch-manipulation min-h-[44px] flex items-center"
                >
                  Current
                </button>
              </div>
              <select
                value={formData.rentMonth}
                onChange={(e) => setFormData((prev) => ({ ...prev, rentMonth: e.target.value }))}
                required
                className="w-full px-3 py-2.5 text-base sm:text-sm uppercase bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 font-medium min-h-[48px] touch-manipulation"
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
                  className="text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 px-2.5 py-1 rounded-md font-medium cursor-pointer touch-manipulation min-h-[44px] flex items-center"
                >
                  Today
                </button>
              </div>
              <input
                type="date"
                value={formData.receiptDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, receiptDate: e.target.value }))}
                {/* required */}
                className="w-full px-3 py-2.5 text-base sm:text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[48px] touch-manipulation"
              />
            </div>
          </div>

          {/* Amount in Words */}
          <div className="mt-3.5">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-stone-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Sum in Words (Automatic)</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  if (isEditingWords) {
                    setFormData((prev) => ({ ...prev, amountInWords: numberToWords(prev.amount) }));
                  }
                  setIsEditingWords(!isEditingWords);
                }}
                className="text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 px-2.5 py-1 rounded-md cursor-pointer touch-manipulation min-h-[44px] flex items-center font-medium"
              >
                {isEditingWords ? 'Auto Convert' : 'Edit Manually'}
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
              className={`w-full px-3 py-2.5 text-sm sm:text-base font-typewriter uppercase tracking-wide rounded-lg border min-h-[48px] touch-manipulation ${
                isEditingWords
                  ? 'border-amber-400 bg-amber-50/20 focus:ring-2 focus:ring-amber-500 focus:outline-none'
                  : 'border-stone-200 bg-stone-50 text-stone-800 select-all'
              }`}
            />
          </div>
        </div>

        {/* Section 3: Property & Owner Details (Collapsible on mobile) */}
        <div className="pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={() => setIsPropertyDetailsOpen(!isPropertyDetailsOpen)}
            className="w-full flex items-center justify-between py-2 text-left cursor-pointer min-h-[44px] touch-manipulation"
          >
            <div className="flex items-center gap-1.5">
              <Building className="w-4 h-4 text-stone-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                3. Property & Owner Specifications
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-stone-500 font-medium">
              <span className="hidden sm:inline">
                {currentProp ? currentProp.name : 'Configured Defaults'}
              </span>
              {isPropertyDetailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {/* Form fields: Open by default on desktop, collapsible on mobile */}
          <div className={`${isPropertyDetailsOpen ? 'block' : 'hidden md:block'} mt-2 space-y-3`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Property / Shop Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. Second floor portion"
                  value={formData.shopNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, shopNumber: e.target.value }))}
                  className="w-full px-3 py-2.5 text-base sm:text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[48px] touch-manipulation"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Property Address (IN ...)
                </label>
                <input
                  type="text"
                  placeholder="BUXIPUR SHER KOTHI, GORAKHPUR"
                  value={formData.propertyAddress}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, propertyAddress: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 text-base sm:text-sm uppercase bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[48px] touch-manipulation"
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
                  className="w-full px-3 py-2.5 text-base sm:text-sm uppercase bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[48px] touch-manipulation"
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
                  className="w-full px-3 py-2.5 text-base sm:text-sm uppercase bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[48px] touch-manipulation"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons (Desktop inline + Mobile friendly container) */}
        <div className="pt-4 border-t border-stone-200">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5">
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-stone-900 hover:bg-black active:bg-stone-950 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors cursor-pointer min-h-[48px] touch-manipulation"
              >
                <Eye className="w-4 h-4 shrink-0" />
                <span>Preview</span>
              </button>

              <button
                type="button"
                onClick={onSaveAndPrint}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-50 min-h-[48px] touch-manipulation"
              >
                <Printer className="w-4 h-4 shrink-0" />
                <span className="truncate">Save & Print</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onSaveOnly}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 rounded-xl border border-stone-300 transition-colors cursor-pointer min-h-[44px] touch-manipulation disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-stone-600 shrink-0" />
              <span>Save to History</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
