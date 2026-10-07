import { Inbox } from 'lucide-react';

export function NotificationBanner({ message }: { message: string }) {
  return (
    <div className="bg-navy-800 text-white px-4 py-3 flex items-center gap-3 text-sm animate-slide-down">
      <Inbox size={18} className="flex-shrink-0 text-accent-400" />
      <p className="flex-1">{message}</p>
    </div>
  );
}
