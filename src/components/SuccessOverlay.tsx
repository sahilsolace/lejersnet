import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useSuccessOverlay } from '@/store/useSuccessOverlay';

export function SuccessOverlay() {
  const { open, title, message, buttonLabel, onDismiss } = useSuccessOverlay();

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="absolute inset-0 z-[80] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/50 animate-fade-in" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center animate-scale-in">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={36} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-navy-800 mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <button
          onClick={onDismiss}
          className="w-full py-3 rounded-xl bg-navy-800 text-white font-medium text-sm hover:bg-navy-900 transition-colors"
        >
          {buttonLabel}
        </button>
      </div>
    </div>,
    document.body,
  );
}
