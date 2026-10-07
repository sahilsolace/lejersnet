import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="absolute inset-0 z-[60] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5 animate-scale-in">
        {variant === 'danger' && (
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
        )}
        <h2 className="text-lg font-semibold text-navy-800 mb-1">{title}</h2>
        <p className="text-sm text-gray-600 mb-5">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl font-medium text-sm transition-colors ${
              variant === 'danger'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-navy-800 text-white hover:bg-navy-900'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
