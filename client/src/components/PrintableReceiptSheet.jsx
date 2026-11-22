import React from 'react';
import SingleReceiptView from './SingleReceiptView';
import { Scissors } from 'lucide-react';

export default function PrintableReceiptSheet({ receipt, isPrintOnly = false }) {
  if (!receipt) return null;

  return (
    <div
      id={isPrintOnly ? 'printable-sheet' : undefined}
      className={`bg-white mx-auto ${
        isPrintOnly
          ? 'print:block hidden'
          : 'p-3 sm:p-6 md:p-8 border border-stone-200 shadow-sm rounded-xl max-w-4xl overflow-hidden'
      }`}
    >
      {/* Top Receipt: Owner Copy */}
      <div className="print-receipt-item">
        <SingleReceiptView receipt={receipt} type="owner" />
      </div>

      {/* Dotted Cut Line Divider */}
      <div className="my-5 sm:my-8 relative print-cut-divider flex items-center justify-center">
        <div className="w-full border-t border-dashed border-stone-400"></div>
        <div className="absolute bg-white px-2.5 sm:px-3 text-[10px] sm:text-[11px] font-mono tracking-widest text-stone-500 uppercase flex items-center gap-1.5 border border-stone-200 rounded-full py-0.5">
          <Scissors className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>Cut Here &bull; Duplicate Copies</span>
        </div>
      </div>

      {/* Bottom Receipt: Occupier Copy */}
      <div className="print-receipt-item">
        <SingleReceiptView receipt={receipt} type="occupier" />
      </div>
    </div>
  );
}
