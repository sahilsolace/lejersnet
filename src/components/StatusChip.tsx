import { cn } from '@/lib/utils';

interface StatusChipProps {
  status: string;
  variant?: 'default' | 'active' | 'past' | 'upcoming' | 'cancelled' | 'expired' | 'failed' | 'paid' | 'info';
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: 'bg-gray-100 text-gray-700',
  active: 'bg-green-50 text-green-700',
  past: 'bg-gray-100 text-gray-600',
  upcoming: 'bg-accent-50 text-accent-700',
  cancelled: 'bg-red-50 text-red-700',
  expired: 'bg-gray-100 text-gray-500',
  failed: 'bg-red-50 text-red-700',
  paid: 'bg-green-50 text-green-700',
  info: 'bg-navy-50 text-navy-700',
};

export function StatusChip({ status, variant = 'default', className }: StatusChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
        variantStyles[variant] ?? variantStyles.default,
        className,
      )}
    >
      {status}
    </span>
  );
}
