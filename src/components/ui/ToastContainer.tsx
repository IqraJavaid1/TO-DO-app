import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTaskContext();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl border shadow-2xl backdrop-blur-md transition-all duration-200 animate-in slide-in-from-bottom-3 fade-in
              ${
                isError
                  ? 'bg-rose-950/90 border-rose-700/60 text-rose-200'
                  : isSuccess
                  ? 'bg-[#0e241e]/95 border-[#408A71] text-neutral-100 shadow-[#408A71]/15'
                  : 'bg-[#122822]/95 border-[#285A48] text-neutral-200'
              }
            `}
          >
            <div className="flex items-center gap-2.5 pr-2 min-w-0">
              {isError ? (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : isSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-[#B0E4CC] shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-[#408A71] shrink-0" />
              )}
              <span className="text-xs font-medium leading-snug truncate">
                {toast.message}
              </span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors shrink-0"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
