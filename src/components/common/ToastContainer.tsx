import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            id={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-4 bg-[#FAF5ED] border border-[#3A2721]/15 shadow-[0_8px_24px_rgba(58,39,33,0.08)] transition-all transform translate-y-0"
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#657258] stroke-[1.5]" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-[#A96345] stroke-[1.5]" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-700 stroke-[1.5]" />}
              {isInfo && <Info className="w-4 h-4 text-[#3A2721] stroke-[1.5]" />}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="font-serif text-sm font-normal text-[#3A2721] leading-snug">{toast.title}</p>
              {toast.message && (
                <p className="font-mono text-[11px] text-[#29211E]/75 mt-0.5 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#29211E]/40 hover:text-[#3A2721] p-1 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
