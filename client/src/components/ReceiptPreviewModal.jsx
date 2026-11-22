import React, { useState, useEffect } from 'react';
import SingleReceiptView from './SingleReceiptView';
import PrintableReceiptSheet from './PrintableReceiptSheet';
import { Printer, Edit3, X, Share2 } from 'lucide-react';

export default function ReceiptPreviewModal({
  receipt,
  isOpen,
  onClose,
  onPrint,
  onEdit,
}) {
  const [viewMode, setViewMode] = useState('full'); // 'full' (A4 duplicate sheet) or 'single'

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

  if (!isOpen || !receipt) return null;

  // Share receipt summary via Web Share API or WhatsApp
  const handleShare = async () => {
    const summaryText = `*RENT RECEIPT #${receipt.receiptNumber}*\nTenant: ${receipt.customerName}\nAmount: ₹${Number(receipt.amount).toLocaleString('en-IN')} (${receipt.amountInWords})\nMonth: ${receipt.rentMonth}\nDate: ${receipt.receiptDate}\nUnit: ${receipt.shopNumber}\nProperty: ${receipt.propertyAddress}\nOwner: ${receipt.ownerName}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Rent Receipt #${receipt.receiptNumber}`,
          text: summaryText,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      // Fallback to WhatsApp
      const waUrl = `https://wa.me/?text=${encodeURIComponent(summaryText)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
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
      aria-labelledby="preview-modal-title"
    >
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-stone-200 animate-in slide-in-from-bottom duration-200 sm:duration-150 sm:fade-in sm:zoom-in-95">
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-stone-200 bg-stone-50 gap-2.5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-typewriter font-bold text-sm shrink-0">
                #
              </div>
              <div className="min-w-0">
                <h3 id="preview-modal-title" className="text-sm sm:text-base font-bold text-stone-900 truncate leading-tight">
                  Receipt #{receipt.receiptNumber || '00015'} Preview
                </h3>
                <p className="text-[11px] text-stone-500 font-mono truncate">
                  {receipt.rentMonth} &bull; {receipt.customerName} &bull; ₹{receipt.amount}
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onClose}
              className="sm:hidden text-stone-400 hover:text-stone-800 p-2 rounded-lg cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher & Desktop Close */}
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <div className="inline-flex p-1 bg-stone-200/80 rounded-lg text-xs font-semibold w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setViewMode('full')}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md transition-colors cursor-pointer min-h-[36px] flex items-center justify-center ${
                  viewMode === 'full'
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                A4 Duplicate (2 Copies)
              </button>
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md transition-colors cursor-pointer min-h-[36px] flex items-center justify-center ${
                  viewMode === 'single'
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Single Copy
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="hidden sm:flex text-stone-400 hover:text-stone-800 p-2 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer min-h-[44px] min-w-[44px] items-center justify-center"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Scrollable Preview of the Receipt */}
        <div className="p-3 sm:p-6 overflow-y-auto bg-stone-100 flex-1 flex justify-center">
          <div className="w-full max-w-3xl">
            {viewMode === 'full' ? (
              <PrintableReceiptSheet receipt={receipt} isPrintOnly={false} />
            ) : (
              <div className="bg-white p-3 sm:p-6 rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                <SingleReceiptView receipt={receipt} type="owner" />
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls (Sticky thumb-reachable) */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-t border-stone-200 bg-white shrink-0 pb-safe">
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onEdit}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs sm:text-sm font-semibold text-stone-700 hover:bg-stone-50 active:bg-stone-100 transition-colors cursor-pointer min-h-[44px] touch-manipulation"
              >
                <Edit3 className="w-4 h-4 shrink-0" />
                <span>Edit Details</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs sm:text-sm font-semibold text-stone-700 hover:bg-stone-50 active:bg-stone-100 transition-colors cursor-pointer min-h-[44px] touch-manipulation"
                title="Share via WhatsApp or Web Share"
              >
                <Share2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Share</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="hidden sm:inline-block px-4 py-2.5 text-sm font-medium text-stone-600 hover:text-stone-900 cursor-pointer min-h-[44px]"
              >
                Close
              </button>

              <button
                type="button"
                onClick={onPrint}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 hover:bg-black active:bg-stone-950 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors cursor-pointer min-h-[48px] touch-manipulation"
              >
                <Printer className="w-4 h-4 shrink-0" />
                <span>Print (A4 Double Copy)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
