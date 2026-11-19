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
          : 'p-4 sm:p-8 border border-stone-200 shadow-sm rounded-lg max-w-4xl'
      }`}
    >
      {/* Top Receipt: Owner Copy */}
      <div className="print-receipt-item">
        <SingleReceiptView receipt={receipt} type="owner" />
      </div>

      {/* Dotted Cut Line Divider */}
      <div className="my-6 sm:my-8 relative print-cut-divider flex items-center justify-center">
        <div className="w-full border-t border-dashed border-stone-400"></div>
        <div className="absolute bg-white px-3 text-[11px] font-mono tracking-widest text-stone-500 uppercase flex items-center gap-1.5 border border-stone-200 rounded-full py-0.5">
          <Scissors className="w-3.5 h-3.5" />
          <span>Cut Here &bull; Duplicate Copies (Owner / Occupier)</span>
        </div>
      </div>

      {/* Bottom Receipt: Occupier Copy */}
      <div className="print-receipt-item">
        <SingleReceiptView receipt={receipt} type="occupier" />
      </div>
    </div>
  );
}

