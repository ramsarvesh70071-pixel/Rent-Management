import React, { useState } from 'react';
import { Search, Printer, Trash2, Eye, Calendar, DollarSign, FileText, Building2 } from 'lucide-react';
import { formatDateForDisplay } from '../utils/formatDate';

export default function ReceiptHistory({
  receipts,
  properties = [],
  onViewReceipt,
  onPrintReceipt,
  onDeleteReceipt,
  loading,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState('');

  // Extract unique months from receipts for filter
  const months = Array.from(new Set(receipts.map((r) => r.rentMonth).filter(Boolean)));

  const filtered = receipts.filter((r) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      r.receiptNumber.toLowerCase().includes(q) ||
      r.customerName.toLowerCase().includes(q) ||
      (r.customerFatherName && r.customerFatherName.toLowerCase().includes(q)) ||
      (r.shopNumber && r.shopNumber.toLowerCase().includes(q)) ||
      (r.propertyName && r.propertyName.toLowerCase().includes(q)) ||
      (r.propertyAddress && r.propertyAddress.toLowerCase().includes(q));

    const matchMonth = selectedMonth ? r.rentMonth === selectedMonth : true;

    const matchProperty = selectedPropertyFilter
      ? ((r.propertyName || '').toUpperCase() === selectedPropertyFilter.toUpperCase()) ||
        ((r.propertyAddress || '').toUpperCase().includes(selectedPropertyFilter.toUpperCase()))
      : true;

    return matchSearch && matchMonth && matchProperty;
  });

  const totalFilteredAmount = filtered.reduce((acc, r) => acc + (Number(r.amount) || 0), 0);

  return (
    <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="p-4 sm:p-6 border-b border-stone-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 tracking-tight">
            Generated Receipts History
          </h2>
          <p className="text-xs text-stone-500 font-mono mt-0.5">
            Filter receipts by property or month, review payments, and reprint duplicates
          </p>
        </div>

        {/* Stats & Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Total Collected Pill */}
          <div className="bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-md flex items-center gap-2 text-xs font-mono">
            <span className="text-stone-500">Total:</span>
            <span className="font-bold text-stone-900">
              ₹{totalFilteredAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-stone-400">({filtered.length} receipts)</span>
          </div>

          {/* Property Filter */}
          {properties && properties.length > 0 && (
            <select
              value={selectedPropertyFilter}
              onChange={(e) => setSelectedPropertyFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium uppercase bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-800"
            >
              <option value="">All Properties</option>
              {properties.map((p, idx) => (
                <option key={p._id || idx} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          )}

          {/* Month Filter */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-800"
          >
            <option value="">All Months</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Search bar */}
          <div className="relative w-full sm:w-56">
            <span className="absolute left-3 top-2 text-stone-400">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="Search receipt / tenant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-800"
            />
          </div>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-stone-700">
          <thead className="bg-stone-50 text-xs font-semibold uppercase text-stone-500 border-b border-stone-200 tracking-wider">
            <tr>
              <th className="px-6 py-3">Receipt No.</th>
              <th className="px-6 py-3">Customer / Tenant</th>
              <th className="px-6 py-3">Property / Portion</th>
              <th className="px-6 py-3">Rent Month</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12 text-stone-400">
                  {searchTerm || selectedMonth || selectedPropertyFilter
                    ? 'No receipts matched your filter.'
                    : 'No receipts generated yet. Generate your first receipt above!'}
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r._id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-stone-900">
                    #{r.receiptNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-stone-900">{r.customerName}</div>
                    {r.customerFatherName && (
                      <div className="text-[11px] text-stone-400 font-normal">
                        R/O {r.customerFatherName}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-stone-600">
                    <div className="font-medium text-stone-800 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-stone-400" />
                      <span>{r.propertyName || r.propertyAddress || '—'}</span>
                    </div>
                    {r.shopNumber && (
                      <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                        {r.shopNumber}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs uppercase text-stone-700 font-medium">
                    {r.rentMonth}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-stone-500 font-mono">
                    {formatDateForDisplay(r.receiptDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-stone-900">
                    ₹{Number(r.amount).toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onViewReceipt(r)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                        title="Preview Receipt"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onPrintReceipt(r)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                        title="Reprint Receipt (A4 Double Copy)"
                      >
                        <Printer className="w-4 h-4 text-stone-800" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteReceipt(r._id, r.receiptNumber)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title="Delete Receipt"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
