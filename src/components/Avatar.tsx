import { getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface AvatarProps {
  name: string;
  photoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ name, photoUrl, size = 'md', className }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-2xl',
  };

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={cn('rounded-full object-cover', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-navy-700 text-white flex items-center justify-center font-semibold',
        sizes[size],
        className,
      )}
    >
      {getInitials(name)}
    </div>
  );
}
