import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({ open, onClose, title, children, className }: BottomSheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />
      <div
        className={cn(
          'relative bg-white rounded-t-3xl shadow-2xl animate-slide-up max-h-[85%] flex flex-col',
          className,
        )}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
          <div className="w-10 h-1 bg-gray-200 rounded-full absolute left-1/2 -translate-x-1/2 top-2" />
          {title && <h2 className="text-lg font-semibold text-navy-800">{title}</h2>}
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="overflow-y-auto no-scrollbar px-5 py-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
