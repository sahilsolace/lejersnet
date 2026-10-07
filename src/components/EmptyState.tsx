import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ icon, title, message, actionLabel, onAction, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center px-8 py-12', className)}>
      <div className="w-20 h-20 rounded-full bg-navy-50 flex items-center justify-center mb-4 text-navy-300">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-navy-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-5 max-w-xs">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 rounded-xl bg-navy-800 text-white text-sm font-medium hover:bg-navy-900 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
