import React, { useState } from 'react';
import SingleReceiptView from './SingleReceiptView';
import PrintableReceiptSheet from './PrintableReceiptSheet';
import { Printer, Edit3, X, Copy, Check, FileText } from 'lucide-react';

export default function ReceiptPreviewModal({
  receipt,
  isOpen,
  onClose,
  onPrint,
  onEdit,
}) {
  const [viewMode, setViewMode] = useState('full'); // 'full' (A4 duplicate sheet) or 'single'

  if (!isOpen || !receipt) return null;

  return (
    <div
      id="modal-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-stone-900 text-white flex items-center justify-center font-typewriter font-bold text-sm">
              #
            </div>
            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Rent Receipt Preview — #{receipt.receiptNumber || '00015'}
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                {receipt.rentMonth} &bull; {receipt.customerName} &bull; ₹{receipt.amount}
              </p>
            </div>
          </div>

          {/* Mode Switcher & Close */}
          <div className="flex items-center gap-3">
            <div className="inline-flex p-0.5 bg-stone-200 rounded-md text-xs font-medium">
              <button
                type="button"
                onClick={() => setViewMode('full')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  viewMode === 'full'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                A4 Duplicate (2 Copies)
              </button>
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  viewMode === 'single'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Single Copy
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-800 p-1.5 rounded-md hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Scrollable Preview of the Receipt */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-stone-100 flex-1 flex justify-center">
          <div className="w-full max-w-3xl">
            {viewMode === 'full' ? (
              <PrintableReceiptSheet receipt={receipt} isPrintOnly={false} />
            ) : (
              <div className="bg-white p-4 sm:p-6 rounded-lg border border-stone-200 shadow-sm">
                <SingleReceiptView receipt={receipt} type="owner" />
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 bg-white">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-1.5 px-4 py-2 border border-stone-300 rounded-md text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Details</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={onPrint}
              className="flex items-center gap-2 px-6 py-2 bg-stone-900 hover:bg-black text-white text-sm font-semibold rounded-md shadow transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt (A4 Double Copy)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

