import React from 'react';
import { formatDateForDisplay } from '../utils/formatDate';

export default function SingleReceiptView({
  receipt,
  type = 'owner', // 'owner' or 'occupier'
  showWatermark = false,
}) {
  const isOwner = type === 'owner';
  const copyTitle = isOwner ? 'Owner Copy' : 'Occupier Copy';

  // Format date: if user provided a date, format it; else blank space
  const displayDate = receipt.receiptDate ? formatDateForDisplay(receipt.receiptDate) : '';

  return (
    <div className="receipt-box font-typewriter bg-white text-black p-6 sm:p-8 max-w-4xl mx-auto print:p-2 select-text relative leading-normal">
      {/* Subtle indicator for screen view */}
      <div className="absolute top-2 right-3 text-[10px] tracking-widest uppercase font-mono text-stone-400 print:hidden">
        [{copyTitle}]
      </div>

      {/* Header Property Section */}
      <div className="text-center mb-6">
        <div className="text-xs sm:text-sm font-normal tracking-[0.2em] uppercase text-black">
          PROPERTY OF
        </div>
        <div className="text-sm sm:text-base md:text-lg font-bold tracking-[0.12em] uppercase text-black mt-1">
          {receipt.ownerName || 'SRI KIRTI AGRAWAL'} S/O {receipt.ownerFatherName || 'LATE SRI SATYA PRAKASH AGRAWAL'}
        </div>
      </div>

      {/* Sub-header: No. , RENT RECEIPT , DATE */}
      <div className="flex items-center justify-between mb-6 text-xs sm:text-sm tracking-widest font-normal">
        <div className="w-1/3 text-left">
          <span>No. </span>
          <span className="tracking-wider">{receipt.receiptNumber || '00015'}</span>
        </div>
        <div className="w-1/3 text-center text-sm sm:text-base font-normal tracking-[0.25em] uppercase">
          RENT RECEIPT
        </div>
        <div className="w-1/3 text-right">
          <span>DATE </span>
          <span className="tracking-wider">{displayDate}</span>
        </div>
      </div>

      {/* Receipt Content Body matching typewriter exact layout */}
      <div className="space-y-4 text-xs sm:text-sm tracking-wide text-black leading-relaxed">
        {/* RECEIVED FROM */}
        <div className="flex items-baseline">
          <span className="font-normal uppercase whitespace-nowrap min-w-[170px] sm:min-w-[190px]">
            RECEIVED FROM
          </span>
          <span className="font-bold uppercase tracking-wider flex-1">
            {receipt.customerName || ''}
          </span>
        </div>

        {/* R/O */}
        <div className="flex items-baseline">
          <span className="font-normal uppercase whitespace-nowrap min-w-[170px] sm:min-w-[190px]">
            R/O
          </span>
          <span className="uppercase tracking-wider flex-1">
            {receipt.customerFatherName || ''}
          </span>
        </div>

        {/* THE SUM OF RUPEES */}
        <div className="flex items-baseline">
          <span className="font-normal uppercase whitespace-nowrap min-w-[170px] sm:min-w-[190px]">
            THE SUM OF RUPEES
          </span>
          <span className="font-normal uppercase tracking-wider flex-1">
            {receipt.amountInWords || ''}
          </span>
        </div>

        {/* TOWARDS RENT FOR THE MONTH OF */}
        <div className="flex items-baseline">
          <span className="font-normal uppercase whitespace-nowrap min-w-[260px] sm:min-w-[310px]">
            TOWARDS RENT FOR THE MONTH OF
          </span>
          <span className="font-normal uppercase tracking-wider flex-1">
            {receipt.rentMonth || ''}
          </span>
        </div>

        {/* FOR SHOP NO. & IN */}
        <div className="flex flex-wrap items-baseline justify-between gap-y-2 gap-x-4">
          <div className="flex items-baseline flex-1 min-w-[240px]">
            <span className="font-normal uppercase whitespace-nowrap mr-2">FOR SHOP NO.</span>
            <span className="tracking-wide">
              {receipt.shopNumber || 'Second floor portion'}
            </span>
          </div>
          <div className="flex items-baseline flex-1 min-w-[260px] justify-start sm:justify-end">
            <span className="font-normal uppercase whitespace-nowrap mr-2">IN</span>
            <span className="tracking-wide uppercase">
              {receipt.propertyAddress || 'BUXIPUR  SHER KOTHI, GORAKHPUR'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Area: Amount & Signature */}
      <div className="mt-8 pt-4 flex items-end justify-between">
        {/* Left: Rs. Amount */}
        <div className="text-sm sm:text-base font-normal tracking-wider">
          <span>Rs. </span>
          <span className="font-normal tracking-wide">
            {receipt.amount ? Number(receipt.amount).toLocaleString('en-IN') : ''}
          </span>
        </div>

        {/* Right: Signature Area */}
        <div className="flex flex-col items-center justify-end text-center min-w-[180px] sm:min-w-[240px]">
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
            <div className="flex flex-col items-center pt-10">
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
