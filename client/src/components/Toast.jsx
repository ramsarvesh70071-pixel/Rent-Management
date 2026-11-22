import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div
      role="status"
      aria-live="polite"
      className="toast-container fixed z-50 flex items-center justify-between gap-3 px-4 py-3 bg-stone-900 text-white rounded-xl shadow-2xl border border-stone-800 animate-in fade-in slide-in-from-bottom-4 duration-200 no-print
        left-3 right-3 bottom-[calc(68px+env(safe-area-inset-bottom,0px))]
        md:left-auto md:right-6 md:bottom-6 md:max-w-md"
    >
      <div className="flex items-center gap-3 min-w-0">
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-stone-300 shrink-0" />}

        <div className="text-sm font-medium leading-snug break-words">
          {toast.message}
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="text-stone-400 hover:text-white p-2 rounded-lg transition-colors cursor-pointer shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center -mr-1"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
