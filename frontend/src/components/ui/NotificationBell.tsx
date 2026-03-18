import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import api from '../../api';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  time_ago: string;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success':
    case 'case_approved':
      return { Icon: CheckCircle, color: 'emerald', bg: 'bg-emerald-50' };
    case 'warning':
    case 'case_rejected':
      return { Icon: AlertCircle, color: 'amber', bg: 'bg-amber-50' };
    case 'info':
    default:
      return { Icon: Info, color: 'blue', bg: 'bg-blue-50' };
  }
};

const getColorClass = (color: string) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    emerald: 'bg-emerald-50',
    amber: 'bg-amber-50',
    red: 'bg-red-50',
    purple: 'bg-purple-50',
  };
  return colors[color] || 'bg-slate-50';
};

const getTextColorClass = (color: string) => {
  const colors: Record<string, string> = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
  };
  return colors[color] || 'text-slate-600';
};

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
    
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications/unread');
      const data = response.data;
      
      setNotifications(Array.isArray(data) ? data : []);
      const countResponse = await api.get('/notifications/unread-count');
      setUnreadCount(countResponse.data?.count || 0);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-slate-100 rounded-xl transition-colors"
        aria-label="الإشعارات"
      >
        <Bell className="w-6 h-6 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute left-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 sticky top-0 bg-white">
              <h3 className="font-black text-slate-900">الإشعارات</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-primary-600 hover:text-primary-700 font-bold flex items-center gap-1"
                  >
                    <CheckCheck className="w-4 h-4" />
                    الكل
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">جاري التحميل...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">لا توجد إشعارات جديدة</p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const { Icon, color } = getNotificationIcon(notif.type);
                  return (
                    <div
                      key={notif.id}
                      className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                        !notif.is_read ? 'bg-blue-50/50' : ''
                      }`}
                      onClick={() => handleMarkAsRead(notif.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getColorClass(color)}`}>
                          <Icon className={`w-5 h-5 ${getTextColorClass(color)}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notif.is_read ? 'font-bold text-slate-900' : 'text-slate-700'}`}>
                            {notif.title || notif.message}
                          </p>
                          {notif.message && notif.title && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notif.message}</p>
                          )}
                          <p className="text-xs text-slate-400 mt-1">{notif.time_ago}</p>
                        </div>
                        {!notif.is_read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <Link
                  to="/dashboard/notifications"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center text-sm text-primary-600 hover:text-primary-700 font-bold"
                >
                  عرض كل الإشعارات
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
