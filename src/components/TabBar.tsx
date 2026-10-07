import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, Image, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

const tabs = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/documents', label: 'Documents', icon: FileText },
  { to: '/pictures', label: 'Pictures', icon: Image },
  { to: '/profile', label: 'Profile', icon: User },
];

export function TabBar() {
  const location = useLocation();
  const notifications = useStore((s) => s.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="flex-shrink-0 bg-white border-t border-gray-100 shadow-nav px-2 pb-2 pt-1.5 flex items-center justify-around">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname.startsWith(tab.to);
        const showBadge = tab.to === '/profile' && unreadCount > 0;

        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            className="flex flex-col items-center gap-0.5 py-1 px-3 min-w-[60px] relative"
          >
            <div className="relative">
              <Icon
                size={24}
                className={cn(
                  'transition-colors',
                  isActive ? 'text-navy-800' : 'text-gray-400',
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {showBadge && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-accent-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <span
              className={cn(
                'text-[10px] font-medium transition-colors',
                isActive ? 'text-navy-800' : 'text-gray-400',
              )}
            >
              {tab.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}
