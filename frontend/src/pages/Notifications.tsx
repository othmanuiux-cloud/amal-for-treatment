import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { notificationsApi } from '../api';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function Notifications() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getAll(),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-count'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-count'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] });
    },
  });

  const notifications = data?.data?.data || [];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
      case 'case_approved':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'warning':
      case 'case_rejected':
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'info':
      default:
        return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'success':
      case 'case_approved':
        return 'bg-emerald-50 border-emerald-100';
      case 'warning':
      case 'case_rejected':
        return 'bg-amber-50 border-amber-100';
      default:
        return 'bg-blue-50 border-blue-100';
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    
    return d.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">الإشعارات</h1>
          <p className="text-slate-600 font-bold mt-1">استعرض جميع إشعاراتك</p>
        </div>
        <button
          onClick={() => markAllAsReadMutation.mutate()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
        >
          <CheckCheck className="w-5 h-5" />
          تعيين الكل كمقروء
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 h-24 animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
          <Bell className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h2 className="text-xl font-black text-slate-800 mb-2">لا توجد إشعارات</h2>
          <p className="text-slate-500 font-bold">ستظهر الإشعارات هنا عندماOccurs something</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification: any) => (
            <div
              key={notification.id}
              className={`bg-white rounded-2xl p-5 border transition-all hover:shadow-lg ${
                !notification.read_at ? 'border-primary-200 shadow-md shadow-primary-500/5' : 'border-slate-100'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl ${getNotificationBg(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-black text-slate-900">{notification.title}</h3>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {notification.message}
                  </p>
                  
                  {notification.data?.case_id && (
                    <Link
                      to={`/cases/${notification.data.case_id}`}
                      className="inline-flex items-center gap-1.5 mt-3 text-sm font-bold text-primary-600 hover:text-primary-700"
                    >
                      عرض التفاصيل
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>

                {!notification.read_at && (
                  <button
                    onClick={() => markAsReadMutation.mutate(notification.id)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                    title="تعيين كمقروء"
                  >
                    <Check className="w-5 h-5 text-slate-400" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
