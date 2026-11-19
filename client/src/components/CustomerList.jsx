import React, { useState } from 'react';
import { Search, UserPlus, Edit2, Trash2, FilePlus, Phone, MapPin, Building2 } from 'lucide-react';

export default function CustomerList({
  customers,
  properties = [],
  onAddCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onSelectCustomerForReceipt,
  loading,
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
    <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="p-4 sm:p-6 border-b border-stone-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 tracking-tight">
            Customer & Tenant Directory
          </h2>
          <p className="text-xs text-stone-500 font-mono mt-0.5">
            Manage your tenants, their default rental units, assigned properties, and contact information
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Property Filter Dropdown */}
          {properties && properties.length > 0 && (
            <div className="relative">
              <select
                value={selectedPropertyFilter}
                onChange={(e) => setSelectedPropertyFilter(e.target.value)}
                className="px-3 py-1.5 text-xs font-medium uppercase bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-800"
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
          <div className="relative w-full sm:w-56">
            <span className="absolute left-3 top-2 text-stone-400">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-800"
            />
          </div>

          <button
            type="button"
            onClick={onAddCustomer}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-md shadow transition-colors shrink-0 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-stone-700">
          <thead className="bg-stone-50 text-xs font-semibold uppercase text-stone-500 border-b border-stone-200 tracking-wider">
            <tr>
              <th className="px-6 py-3">Customer / Tenant</th>
              <th className="px-6 py-3">Property</th>
              <th className="px-6 py-3">Shop / Portion</th>
              <th className="px-6 py-3">Default Rent</th>
              <th className="px-6 py-3">Contact</th>
              <th className="px-6 py-3 text-right">Actions</th>
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
                    {customer.defaultAmount ? `₹${Number(customer.defaultAmount).toLocaleString('en-IN')}` : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-stone-600">
                    {customer.phone || customer.address ? (
                      <div>
                        {customer.phone && <div className="font-mono">{customer.phone}</div>}
                        {customer.address && <div className="text-stone-400 truncate max-w-xs">{customer.address}</div>}
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectCustomerForReceipt(customer)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                        title="Generate receipt for this customer"
                      >
                        <FilePlus className="w-4 h-4 text-emerald-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditCustomer(customer)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                        title="Edit Customer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteCustomer(customer._id, customer.name)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title="Delete Customer"
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
