import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Bell, CheckCheck, Clock } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export function NotificationsList() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useStore();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.read : true));
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-full bg-brand-light pb-8">
      <ScreenHeader
        title="Notifications"
        rightAction={
          unreadCount > 0 ? (
            <button
              onClick={markAllNotificationsRead}
              className="text-[11px] font-semibold text-accent-600 hover:text-accent-700 flex items-center gap-1"
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
          ) : undefined
        }
      />

      <div className="px-4 py-4 space-y-4">
        {/* Filter Pills */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-navy-800 text-white shadow-soft'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filter === 'unread'
                ? 'bg-navy-800 text-white shadow-soft'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-accent-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Notifications list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-soft">
            <Bell size={28} className="mx-auto text-gray-300 mb-2" />
            <h3 className="text-sm font-bold text-navy-800">No notifications</h3>
            <p className="text-xs text-gray-400 mt-1">
              {filter === 'unread'
                ? 'You have read all your notifications.'
                : 'Updates and reminders will appear here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => markNotificationRead(item.id)}
                className={`p-4 rounded-2xl transition-all cursor-pointer shadow-soft flex items-start gap-3 ${
                  item.read
                    ? 'bg-white hover:bg-gray-50'
                    : 'bg-white border-l-4 border-l-accent-500'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    item.read
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-accent-50 text-accent-700'
                  }`}
                >
                  <Bell size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-navy-800 truncate">{item.title}</h4>
                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5 flex-shrink-0">
                      <Clock size={10} />
                      {formatRelativeTime(item.date)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
