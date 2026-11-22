import React, { useState } from 'react';
import { Search, Printer, Trash2, Eye, Building2, FileText } from 'lucide-react';
import { formatDateForDisplay } from '../utils/formatDate';

export default function ReceiptHistory({
  receipts,
  properties = [],
  onViewReceipt,
  onPrintReceipt,
  onDeleteReceipt,
  loading = false,
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
    <div className="bg-white rounded-xl md:rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="p-4 sm:p-6 border-b border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
              Generated Receipts History
            </h2>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              Review past payments, reprint duplicates and track rent ({filtered.length} receipts)
            </p>
          </div>

          {/* Total Collected Pill */}
          <div className="bg-stone-100 border border-stone-200 px-3.5 py-2 rounded-xl flex items-center justify-between sm:justify-start gap-2 text-xs font-mono self-start sm:self-auto w-full sm:w-auto">
            <span className="text-stone-500">Total Collected:</span>
            <span className="font-bold text-stone-950 text-sm">
              ₹{totalFilteredAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Property Filter */}
          {properties && properties.length > 0 && (
            <div>
              <select
                value={selectedPropertyFilter}
                onChange={(e) => setSelectedPropertyFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-xs font-medium uppercase bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[44px] cursor-pointer"
                aria-label="Filter receipts by property"
              >
                <option value="">All Properties</option>
                {properties.map((p, idx) => (
                  <option key={p._id || idx} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Month Filter */}
          <div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 text-sm sm:text-xs font-medium uppercase bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[44px] cursor-pointer"
              aria-label="Filter receipts by month"
            >
              <option value="">All Months</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Search bar */}
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-stone-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search receipt / tenant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-base sm:text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[44px]"
              aria-label="Search receipts"
            />
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="p-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-stone-100 h-20 rounded-xl" />
          ))}
        </div>
      )}

      {/* MOBILE (<md): Stacked Card List */}
      {!loading && (
        <div className="md:hidden divide-y divide-stone-100">
          {filtered.length === 0 ? (
            <div className="text-center py-12 px-4 text-stone-400">
              <FileText className="w-10 h-10 mx-auto mb-2 text-stone-300" />
              <p className="text-sm font-medium text-stone-600">No receipts found</p>
              <p className="text-xs text-stone-400 mt-0.5">
                {searchTerm || selectedMonth || selectedPropertyFilter
                  ? 'Try clearing the search or filter.'
                  : 'Generate your first receipt from the Generate tab.'}
              </p>
            </div>
          ) : (
            filtered.map((r) => (
              <div key={r._id} className="p-4 space-y-3">
                {/* Header: Receipt Number & Amount */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-stone-900 text-white px-2 py-1 rounded-md">
                      #{r.receiptNumber}
                    </span>
                    <span className="text-xs text-stone-500 font-mono">
                      {formatDateForDisplay(r.receiptDate)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-base text-stone-950">
                      ₹{Number(r.amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Tenant & Rent Month */}
                <div>
                  <h3 className="font-bold text-base text-stone-900 leading-snug">
                    {r.customerName}
                  </h3>
                  {r.customerFatherName && (
                    <p className="text-xs text-stone-500">
                      R/O {r.customerFatherName}
                    </p>
                  )}
                </div>

                {/* Badges: Month, Unit, Property */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="bg-stone-100 text-stone-800 font-mono font-semibold px-2 py-0.5 rounded-md border border-stone-200 uppercase text-[11px]">
                    {r.rentMonth}
                  </span>
                  {(r.propertyName || r.propertyAddress) && (
                    <span className="inline-flex items-center gap-1 text-stone-700 bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-md text-[11px] truncate max-w-[200px]">
                      <Building2 className="w-3 h-3 text-stone-500 shrink-0" />
                      <span className="truncate">{r.propertyName || r.propertyAddress}</span>
                    </span>
                  )}
                  {r.shopNumber && (
                    <span className="text-stone-600 font-mono text-[11px]">
                      ({r.shopNumber})
                    </span>
                  )}
                </div>

                {/* Action Buttons Row */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onViewReceipt(r)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 text-xs font-semibold rounded-lg border border-stone-300 min-h-[44px] cursor-pointer touch-manipulation"
                    title="Preview Receipt"
                  >
                    <Eye className="w-4 h-4 text-stone-700 shrink-0" />
                    <span>Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onPrintReceipt(r)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-stone-900 hover:bg-black active:bg-stone-950 text-white text-xs font-semibold rounded-lg min-h-[44px] cursor-pointer touch-manipulation"
                    title="Reprint Receipt (A4 Double Copy)"
                  >
                    <Printer className="w-4 h-4 shrink-0" />
                    <span>Print A4</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteReceipt(r._id, r.receiptNumber)}
                    className="p-2.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 active:bg-rose-100 rounded-lg border border-transparent hover:border-rose-200 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
                    title="Delete Receipt"
                    aria-label={`Delete receipt #${r.receiptNumber}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* DESKTOP (md+): Traditional Table */}
      {!loading && (
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-700">
            <thead className="bg-stone-50 text-xs font-semibold uppercase text-stone-500 border-b border-stone-200 tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Receipt No.</th>
                <th className="px-6 py-3.5">Customer / Tenant</th>
                <th className="px-6 py-3.5">Property / Portion</th>
                <th className="px-6 py-3.5">Rent Month</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
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
                        <Building2 className="w-3 h-3 text-stone-400 shrink-0" />
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
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewReceipt(r)}
                          className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                          title="Preview Receipt"
                          aria-label={`Preview receipt #${r.receiptNumber}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onPrintReceipt(r)}
                          className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                          title="Reprint Receipt (A4 Double Copy)"
                          aria-label={`Print receipt #${r.receiptNumber}`}
                        >
                          <Printer className="w-4 h-4 text-stone-800" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteReceipt(r._id, r.receiptNumber)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                          title="Delete Receipt"
                          aria-label={`Delete receipt #${r.receiptNumber}`}
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
      )}
    </div>
  );
}
