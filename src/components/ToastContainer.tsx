import { useToast } from '@/store/useToast';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex flex-col items-center gap-2 px-4 pt-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'pointer-events-auto flex items-start gap-3 rounded-2xl px-4 py-3 shadow-card w-full max-w-sm animate-slide-down',
            toast.type === 'success' && 'bg-green-50 border border-green-200',
            toast.type === 'error' && 'bg-red-50 border border-red-200',
            toast.type === 'info' && 'bg-navy-50 border border-navy-200',
          )}
        >
          {toast.type === 'success' && <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />}
          {toast.type === 'error' && <XCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info size={20} className="text-navy-600 flex-shrink-0 mt-0.5" />}
          <p className={cn(
            'text-sm font-medium flex-1',
            toast.type === 'success' && 'text-green-800',
            toast.type === 'error' && 'text-red-800',
            toast.type === 'info' && 'text-navy-800',
          )}>{toast.message}</p>
          <button onClick={() => removeToast(toast.id)} className={cn(
            'flex-shrink-0',
            toast.type === 'success' && 'text-green-400',
            toast.type === 'error' && 'text-red-400',
            toast.type === 'info' && 'text-navy-400',
          )}>
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
