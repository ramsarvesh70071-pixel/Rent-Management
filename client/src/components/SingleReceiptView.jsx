import React from 'react';
import { formatDateForDisplay } from '../utils/formatDate';

export default function SingleReceiptView({
  receipt,
  type = 'owner', // 'owner' or 'occupier'
}) {
  const isOwner = type === 'owner';
  const copyTitle = isOwner ? 'Owner Copy' : 'Occupier Copy';

  // Format date: if user provided a date, format it; else blank space
  const displayDate = receipt.receiptDate ? formatDateForDisplay(receipt.receiptDate) : '';

  return (
    <div className="receipt-box font-typewriter bg-white text-black p-4 sm:p-6 md:p-8 max-w-4xl mx-auto print:p-2 select-text relative leading-normal">
      {/* Subtle indicator for screen view */}
      <div className="absolute top-2 right-3 text-[10px] tracking-widest uppercase font-mono text-stone-400 print:hidden">
        [{copyTitle}]
      </div>

      {/* Header Property Section */}
      <div className="text-center mb-5 sm:mb-6">
        <div className="text-xs sm:text-sm font-normal tracking-[0.2em] uppercase text-black">
          PROPERTY OF
        </div>
        <div className="text-sm sm:text-base md:text-lg font-bold tracking-[0.12em] uppercase text-black mt-1 break-words">
          {receipt.ownerName || 'SRI KIRTI AGRAWAL'} S/O {receipt.ownerFatherName || 'LATE SRI SATYA PRAKASH AGRAWAL'}
        </div>
      </div>

      {/* Sub-header: No. , RENT RECEIPT , DATE */}
      <div className="flex flex-wrap items-center justify-between gap-y-2 mb-5 sm:mb-6 text-xs sm:text-sm tracking-widest font-normal">
        <div className="w-1/2 sm:w-1/3 text-left">
          <span>No. </span>
          <span className="tracking-wider font-bold sm:font-normal">{receipt.receiptNumber || '00015'}</span>
        </div>
        <div className="order-first sm:order-none w-full sm:w-1/3 text-center text-sm sm:text-base font-normal tracking-[0.25em] uppercase pb-1 sm:pb-0">
          RENT RECEIPT
        </div>
        <div className="w-1/2 sm:w-1/3 text-right">
          <span>DATE </span>
          <span className="inline-block border-b border-black w-28 sm:w-32 ml-1 align-baseline">&nbsp;</span>
        </div>
      </div>

      {/* Receipt Content Body matching typewriter layout with graceful wrapping */}
      <div className="space-y-3.5 sm:space-y-4 text-xs sm:text-sm tracking-wide text-black leading-relaxed">
        {/* RECEIVED FROM */}
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 print:flex-row print:items-baseline">
          <span className="font-normal uppercase sm:min-w-[190px] shrink-0 text-stone-600 sm:text-black print:text-black">
            RECEIVED FROM
          </span>
          <span className="font-bold uppercase tracking-wider flex-1 break-words">
            {receipt.customerName || ''}
          </span>
        </div>

        {/* R/O */}
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 print:flex-row print:items-baseline">
          <span className="font-normal uppercase sm:min-w-[190px] shrink-0 text-stone-600 sm:text-black print:text-black">
            R/O
          </span>
          <span className="uppercase tracking-wider flex-1 break-words">
            {receipt.customerFatherName || ''}
          </span>
        </div>

        {/* THE SUM OF RUPEES */}
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 print:flex-row print:items-baseline">
          <span className="font-normal uppercase sm:min-w-[190px] shrink-0 text-stone-600 sm:text-black print:text-black">
            THE SUM OF RUPEES
          </span>
          <span className="font-normal uppercase tracking-wider flex-1 break-words">
            {receipt.amountInWords || ''}
          </span>
        </div>

        {/* TOWARDS RENT FOR THE MONTH OF */}
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 print:flex-row print:items-baseline">
          <span className="font-normal uppercase sm:min-w-[270px] shrink-0 text-stone-600 sm:text-black print:text-black">
            TOWARDS RENT FOR THE MONTH OF
          </span>
          <span className="font-normal uppercase tracking-wider flex-1 break-words">
            {receipt.rentMonth || ''}
          </span>
        </div>

        {/* FOR SHOP NO. & IN */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-y-2 gap-x-4 print:flex-row print:items-baseline">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1.5 flex-1 print:flex-row print:items-baseline">
            <span className="font-normal uppercase shrink-0 text-stone-600 sm:text-black print:text-black">
              FOR SHOP NO.
            </span>
            <span className="tracking-wide break-words">
              {receipt.shopNumber || 'Second floor portion'}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1.5 flex-1 justify-start sm:justify-end print:flex-row print:items-baseline">
            <span className="font-normal uppercase shrink-0 text-stone-600 sm:text-black print:text-black">
              IN
            </span>
            <span className="tracking-wide uppercase break-words">
              {receipt.propertyAddress || 'BUXIPUR  SHER KOTHI, GORAKHPUR'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Area: Amount & Signature */}
      <div className="mt-7 sm:mt-8 pt-4 flex items-end justify-between gap-4">
        {/* Left: Rs. Amount */}
        <div className="text-base sm:text-lg font-bold sm:font-normal tracking-wider">
          <span>Rs. </span>
          <span className="tracking-wide font-mono">
            {receipt.amount ? Number(receipt.amount).toLocaleString('en-IN') : ''}
          </span>
        </div>

        {/* Right: Signature Area */}
        <div className="flex flex-col items-center justify-end text-center min-w-[140px] sm:min-w-[220px]">
          {isOwner ? (
            <div className="flex flex-col items-center">
              {/* Authentic Revenue Stamp Box */}
              <div className="w-16 h-18 border border-dashed border-rose-300 bg-rose-50/50 rounded flex flex-col items-center justify-center text-[8px] text-rose-500 uppercase font-mono tracking-tighter mb-2 p-1 print:border-stone-400 print:bg-transparent print:text-stone-600">
                <span className="text-[7px]">AFFIX</span>
                <span className="font-bold">REVENUE</span>
                <span>STAMP</span>
              </div>
              <div className="text-xs sm:text-sm font-normal tracking-wide text-black">
                Signature of Owner
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center pt-8 sm:pt-10">
              <div className="text-xs sm:text-sm font-normal tracking-wide text-black">
                Signature of Occupier
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
