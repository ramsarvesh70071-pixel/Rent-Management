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
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-white border border-stone-200 rounded-lg shadow-lg text-stone-800 animate-in fade-in slide-in-from-bottom-3 duration-200 no-print max-w-md">
      {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
      {isError && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
      {!isSuccess && !isError && <Info className="w-5 h-5 text-stone-600 shrink-0" />}

      <div className="text-sm font-medium">{toast.message}</div>

      <button
        onClick={onClose}
        className="text-stone-400 hover:text-stone-700 ml-2 p-0.5 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

