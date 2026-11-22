import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Edit2,
  Trash2,
  FilePlus,
  Phone,
  Building2,
  Users,
} from 'lucide-react';

export default function CustomerList({
  customers,
  properties = [],
  onAddCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onSelectCustomerForReceipt,
  loading = false,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState('');

  const filtered = customers.filter((c) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      c.name.toLowerCase().includes(q) ||
      (c.fatherName && c.fatherName.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.defaultShopNumber && c.defaultShopNumber.toLowerCase().includes(q)) ||
      (c.propertyName && c.propertyName.toLowerCase().includes(q));

    const matchProperty = selectedPropertyFilter
      ? (c.propertyName || '').toUpperCase() === selectedPropertyFilter.toUpperCase()
      : true;

    return matchSearch && matchProperty;
  });

  return (
    <div className="bg-white rounded-xl md:rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="p-4 sm:p-6 border-b border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
              Tenant & Customer Directory
            </h2>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              Manage tenants, units, default rents and contact details ({filtered.length} found)
            </p>
          </div>

          <button
            type="button"
            onClick={onAddCustomer}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-black active:bg-stone-950 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer min-h-[44px] touch-manipulation w-full sm:w-auto self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4 shrink-0" />
            <span>Add New Tenant</span>
          </button>
        </div>

        {/* Filter Controls (Sticky friendly) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Property Filter Dropdown */}
          {properties && properties.length > 0 && (
            <div className="w-full sm:w-60">
              <select
                value={selectedPropertyFilter}
                onChange={(e) => setSelectedPropertyFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-xs font-medium uppercase bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[44px] cursor-pointer"
                aria-label="Filter tenants by property"
              >
                <option value="">All Properties ({customers.length})</option>
                {properties.map((p, idx) => (
                  <option key={p._id || idx} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Search box */}
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-3 text-stone-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by name, unit, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-base sm:text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[44px]"
              aria-label="Search tenants"
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
              <Users className="w-10 h-10 mx-auto mb-2 text-stone-300" />
              <p className="text-sm font-medium text-stone-600">No tenants found</p>
              <p className="text-xs text-stone-400 mt-0.5">
                {searchTerm || selectedPropertyFilter
                  ? 'Try clearing the search or property filter.'
                  : 'Add your first tenant using the button above.'}
              </p>
            </div>
          ) : (
            filtered.map((customer) => (
              <div key={customer._id} className="p-4 space-y-3">
                {/* Header row: Name & Rent */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-base text-stone-900 tracking-tight leading-snug break-words">
                      {customer.name}
                    </h3>
                    {customer.fatherName && (
                      <p className="text-xs text-stone-500 font-normal">
                        S/O {customer.fatherName}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-base text-stone-950">
                      {customer.defaultAmount
                        ? `₹${Number(customer.defaultAmount).toLocaleString('en-IN')}`
                        : '—'}
                    </span>
                    <span className="block text-[10px] uppercase text-stone-400 font-mono">
                      Monthly
                    </span>
                  </div>
                </div>

                {/* Property & Unit Pills */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {customer.propertyName && (
                    <span className="inline-flex items-center gap-1 font-semibold text-stone-800 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-md text-[11px]">
                      <Building2 className="w-3 h-3 text-stone-500" />
                      {customer.propertyName}
                    </span>
                  )}
                  {customer.defaultShopNumber ? (
                    <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200 font-mono text-[11px]">
                      Unit: {customer.defaultShopNumber}
                    </span>
                  ) : null}
                </div>

                {/* Phone & Address */}
                {(customer.phone || customer.address) && (
                  <div className="text-xs text-stone-600 space-y-0.5 pt-1">
                    {customer.phone && (
                      <a
                        href={`tel:${customer.phone}`}
                        className="inline-flex items-center gap-1.5 font-mono text-stone-800 hover:underline min-h-[32px] py-1"
                      >
                        <Phone className="w-3.5 h-3.5 text-stone-500" />
                        <span>{customer.phone}</span>
                      </a>
                    )}
                    {customer.address && (
                      <p className="text-stone-400 text-[11px] truncate">
                        {customer.address}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons Row (min 44px tap targets) */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectCustomerForReceipt(customer)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-2xs min-h-[44px] cursor-pointer touch-manipulation"
                    title="Generate receipt for this customer"
                  >
                    <FilePlus className="w-4 h-4 shrink-0" />
                    <span>Create Receipt</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onEditCustomer(customer)}
                    className="flex items-center justify-center gap-1 px-3 py-2.5 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 text-xs font-medium rounded-lg border border-stone-300 min-h-[44px] min-w-[44px] cursor-pointer touch-manipulation"
                    title="Edit Customer"
                    aria-label={`Edit ${customer.name}`}
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteCustomer(customer._id, customer.name)}
                    className="flex items-center justify-center p-2.5 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 rounded-lg border border-rose-200 min-h-[44px] min-w-[44px] cursor-pointer touch-manipulation"
                    title="Delete Customer"
                    aria-label={`Delete ${customer.name}`}
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
                <th className="px-6 py-3.5">Customer / Tenant</th>
                <th className="px-6 py-3.5">Property</th>
                <th className="px-6 py-3.5">Shop / Portion</th>
                <th className="px-6 py-3.5">Default Rent</th>
                <th className="px-6 py-3.5">Contact</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-stone-400">
                    {searchTerm || selectedPropertyFilter
                      ? 'No customers found matching your filter criteria.'
                      : 'No customers saved yet.'}
                  </td>
                </tr>
              ) : (
                filtered.map((customer) => (
                  <tr key={customer._id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-6 py-4 font-semibold text-stone-900 whitespace-nowrap">
                      <div>{customer.name}</div>
                      {customer.fatherName && (
                        <div className="text-[11px] text-stone-400 font-normal">
                          S/O {customer.fatherName}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      {customer.propertyName ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-stone-800 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded text-[11px]">
                          <Building2 className="w-3 h-3 text-stone-500" />
                          {customer.propertyName}
                        </span>
                      ) : (
                        <span className="text-stone-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-stone-600 text-xs">
                      {customer.defaultShopNumber ? (
                        <span className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded border border-stone-200 font-mono">
                          {customer.defaultShopNumber}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono font-medium text-stone-900">
                      {customer.defaultAmount
                        ? `₹${Number(customer.defaultAmount).toLocaleString('en-IN')}`
                        : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-stone-600">
                      {customer.phone || customer.address ? (
                        <div>
                          {customer.phone && (
                            <a
                              href={`tel:${customer.phone}`}
                              className="font-mono hover:underline text-stone-800"
                            >
                              {customer.phone}
                            </a>
                          )}
                          {customer.address && (
                            <div className="text-stone-400 truncate max-w-xs">
                              {customer.address}
                            </div>
                          )}
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectCustomerForReceipt(customer)}
                          className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                          title="Generate receipt for this customer"
                          aria-label={`Generate receipt for ${customer.name}`}
                        >
                          <FilePlus className="w-4 h-4 text-emerald-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditCustomer(customer)}
                          className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                          title="Edit Customer"
                          aria-label={`Edit ${customer.name}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteCustomer(customer._id, customer.name)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                          title="Delete Customer"
                          aria-label={`Delete ${customer.name}`}
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
