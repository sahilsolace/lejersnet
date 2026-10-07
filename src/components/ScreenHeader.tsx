import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  className?: string;
}

export function ScreenHeader({ title, onBack, showBack = true, rightAction, className }: ScreenHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={cn(
      'sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3 flex items-center gap-3',
      className,
    )}>
      {showBack && (
        <button
          onClick={() => (onBack ? onBack() : navigate(-1))}
          className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
          aria-label="Go back"
        >
          <ChevronLeft size={24} className="text-navy-800" />
        </button>
      )}
      <h1 className="text-lg font-semibold text-navy-800 flex-1 truncate">{title}</h1>
      {rightAction}
    </header>
  );
}
