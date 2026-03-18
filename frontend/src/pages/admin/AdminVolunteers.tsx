import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api';
import { formatDate } from '@/lib/design-tokens';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Edit, Trash2 } from 'lucide-react';

// SVG Icons
const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ViewIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const UserGroupIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const BackIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export default function AdminVolunteers() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active' | 'disabled'>(
    (searchParams.get('filter') as any) || 'all'
  );
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [rejectionModal, setRejectionModal] = useState<{ isOpen: boolean; userId: number | null }>({
    isOpen: false,
    userId: null,
  });
  const [deleteModal, setDeleteModal] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });

  useEffect(() => {
    if (toast.type) {
      const timer = setTimeout(() => setToast({ message: '', type: null }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const { data: statsData } = useQuery({
    queryKey: ['admin', 'statistics'],
    queryFn: () => adminApi.getStatistics(),
  });

  const counts = statsData?.data?.statistics?.volunteers || {
    total_count: 0,
    pending_count: 0,
    active_count: 0,
    disabled_count: 0,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'volunteers', page, search, activeTab],
    queryFn: () => adminApi.getUsers({
      page,
      role: 'volunteer',
      search: search || undefined,
      status: activeTab === 'all' ? undefined : activeTab
    }),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (userId: number) => adminApi.toggleUserStatus(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'volunteers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'statistics'] });
      setToast({ message: 'تم تحديث حالة المتطوع بنجاح', type: 'success' });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: ({ userId, reason }: { userId: number, reason: string }) =>
      adminApi.rejectVolunteer(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'volunteers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'statistics'] });
      setRejectionModal({ isOpen: false, userId: null });
      setRejectionReason('');
      setToast({ message: 'تم رفض المتطوع بنجاح', type: 'success' });
    }
  });

  const bulkMutation = useMutation({
    mutationFn: (data: { user_ids: number[], status: string }) => adminApi.bulkUpdateUserStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'volunteers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'statistics'] });
      setSelectedUsers([]);
      setToast({ message: 'تم تنفيذ الإجراء الجماعي بنجاح', type: 'success' });
    }
  });

  const volunteers = data?.data?.data || [];
  const meta = data?.data?.meta;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(volunteers.map((u: any) => u.id));
    } else {
https://amal-for-treatment.onrender.com      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id: number) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);
      await adminApi.deleteUser(id);
      queryClient.invalidateQueries({ queryKey: ['admin', 'volunteers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'statistics'] });
      setDeleteModal(null);
      setToast({ message: 'تم حذف المتطوع بنجاح', type: 'success' });
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      setToast({ message: 'حدث خطأ أثناء حذف المتطوع', type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative">
      {/* Toast Notification */}
      {toast.type && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl font-black text-white flex items-center gap-3 animate-in slide-in-from-top duration-300 ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          {toast.type === 'success' ? <CheckIcon className="w-5 h-5" /> : <XIcon className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-[22px] flex items-center justify-center shadow-sm">
            <UserGroupIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">إدارة المتطوعين</h1>
            <p className="text-slate-500 font-bold mt-1">متابعة ونشاط واعتماد المتطوعين في النظام</p>
          </div>
        </div>
        <Link
          to="/admin"
          className="flex items-center gap-2 px-6 py-3 bg-white text-slate-600 rounded-2xl font-black shadow-sm border border-slate-100 hover:bg-slate-50 transition-all"
        >
          <BackIcon className="w-4 h-4" />
          العودة للوحة التحكم
        </Link>
      </div>

      {/* Tabs / Counters Bar */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-2 shadow-xl shadow-slate-200/50 border border-white flex flex-wrap gap-2">
        <button
          onClick={() => { setActiveTab('all'); setPage(1); }}
          className={`flex-1 min-w-[140px] px-6 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 ${activeTab === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          الكل
          <span className={`px-2 py-0.5 rounded-lg text-[10px] ${activeTab === 'all' ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>{counts.total_count}</span>
        </button>
        <button
          onClick={() => { setActiveTab('pending'); setPage(1); }}
          className={`flex-1 min-w-[140px] px-6 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 ${activeTab === 'pending' ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          بانتظار الموافقة
          <span className={`px-2 py-0.5 rounded-lg text-[10px] ${activeTab === 'pending' ? 'bg-white/20 text-white' : 'bg-rose-500 text-white animate-pulse'}`}>{counts.pending_count}</span>
        </button>
        <button
          onClick={() => { setActiveTab('active'); setPage(1); }}
          className={`flex-1 min-w-[140px] px-6 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 ${activeTab === 'active' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          نشطون
          <span className={`px-2 py-0.5 rounded-lg text-[10px] ${activeTab === 'active' ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>{counts.active_count}</span>
        </button>
        <button
          onClick={() => { setActiveTab('disabled'); setPage(1); }}
          className={`flex-1 min-w-[140px] px-6 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 ${activeTab === 'disabled' ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          معطلون
          <span className={`px-2 py-0.5 rounded-lg text-[10px] ${activeTab === 'disabled' ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>{counts.disabled_count}</span>
        </button>
      </div>

      {/* Search & Bulk Bar */}
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="relative flex-1 w-full">
          <SearchIcon className="w-5 h-5 text-slate-400 absolute right-6 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="البحث بالاسم، البريد الإلكتروني..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pr-14 pl-6 py-5 bg-white rounded-[24px] font-bold text-slate-900 shadow-xl shadow-slate-100 border-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-slate-300"
          />
        </div>

        {selectedUsers.length > 0 && (
          <div className="w-full lg:w-auto flex items-center gap-3 px-6 py-3 bg-indigo-900 rounded-3xl shadow-2xl animate-in slide-in-from-left duration-300">
            <span className="text-white font-black text-sm mr-2">{selectedUsers.length} محدد</span>
            <button
              onClick={() => bulkMutation.mutate({ user_ids: selectedUsers, status: 'active' })}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs rounded-xl transition-all"
            >
              موافقة على المحدد
            </button>
            <button
              onClick={() => bulkMutation.mutate({ user_ids: selectedUsers, status: activeTab === 'pending' ? 'rejected' : 'disabled' })}
              className="px-6 py-2 bg-rose-500 hover:bg-rose-400 text-white font-black text-xs rounded-xl transition-all"
            >
              {activeTab === 'pending' ? 'رفض المحدد' : 'تعطيل المحدد'}
            </button>
          </div>
        )}
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 uppercase tracking-widest text-[10px] font-black text-slate-400">
                <th className="px-8 py-6 w-10">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedUsers.length === volunteers.length && volunteers.length > 0}
                    className="w-5 h-5 rounded-md border-slate-200 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-8 py-6">المتطوع</th>
                <th className="px-8 py-6 text-center">الحالة</th>
                <th className="px-8 py-6">الدولة</th>
                <th className="px-8 py-6">التاريخ</th>
                <th className="px-8 py-6 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-6">
                      <div className="h-12 bg-slate-50 rounded-2xl w-full"></div>
                    </td>
                  </tr>
                ))
              ) : volunteers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                        <SearchIcon className="w-10 h-10 text-slate-300" />
                      </div>
                      <p className="text-slate-400 font-bold">لا يوجد متطوعين يطابقون بحثك</p>
                    </div>
                  </td>
                </tr>
              ) : (
                volunteers.map((user: any) => (
                  <tr key={user.id} className={`group hover:bg-slate-50/50 transition-all duration-300 ${selectedUsers.includes(user.id) ? 'bg-primary-50/30' : ''}`}>
                    <td className="px-8 py-5">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="w-5 h-5 rounded-md border-slate-200 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-[18px] flex items-center justify-center font-black text-slate-400 shadow-sm group-hover:scale-110 transition-transform overflow-hidden">
                          {user.avatar_path ? <img src={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://127.0.0.1:8002'}/storage/${user.avatar_path}`} alt="" className="w-full h-full object-cover" /> : user.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-slate-900 font-black text-lg">{user.name}</p>
                          <p className="text-slate-400 font-bold text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <StatusBadge status={user.status || (user.is_active ? 'active' : 'pending')} />
                    </td>
                    <td className="px-8 py-5 text-slate-600 font-black">{user.country}</td>
                    <td className="px-8 py-5 text-slate-400 font-bold text-sm">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-2">
                        {user.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleStatusMutation.mutate(user.id)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs shadow-lg shadow-emerald-100 transition-all flex items-center gap-2"
                            >
                              <CheckIcon className="w-4 h-4" />
                              موافقة
                            </button>
                            <button
                              onClick={() => setRejectionModal({ isOpen: true, userId: user.id })}
                              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs shadow-lg shadow-rose-100 transition-all flex items-center gap-2"
                            >
                              <XIcon className="w-4 h-4" />
                              رفض
                            </button>
                          </div>
                        )}
                        {(user.status === 'active' || user.status === 'disabled') && (
                          <button
                            onClick={() => toggleStatusMutation.mutate(user.id)}
                            className={`p-3 rounded-[14px] shadow-lg transition-all ${user.is_active ? 'bg-white text-rose-600 shadow-rose-100 border border-rose-50 hover:bg-rose-600 hover:text-white' : 'bg-white text-emerald-600 shadow-emerald-100 border border-emerald-50 hover:bg-emerald-600 hover:text-white'}`}
                            title={user.is_active ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                          >
                            {user.is_active ? <XIcon className="w-4 h-4" /> : <CheckIcon className="w-4 h-4" />}
                          </button>
                        )}
                        <Link to={`/admin/users/${user.id}`} className="p-3 bg-white text-indigo-600 rounded-[14px] shadow-lg shadow-indigo-100 border border-indigo-50 hover:bg-indigo-600 hover:text-white transition-all" title="عرض">
                          <ViewIcon className="w-4 h-4" />
                        </Link>
                        <Link to={`/admin/users/${user.id}/edit`} className="p-3 bg-white text-amber-600 rounded-[14px] shadow-lg shadow-amber-100 border border-amber-50 hover:bg-amber-600 hover:text-white transition-all" title="تعديل">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => setDeleteModal(user.id)} className="p-3 bg-white text-rose-600 rounded-[14px] shadow-lg shadow-rose-100 border border-rose-50 hover:bg-rose-600 hover:text-white transition-all" title="حذف">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Improved Pagination */}
        {meta && (
          <div className="px-8 py-8 bg-slate-50/30 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="text-slate-400 font-bold text-sm italic">
              يتم عرض النتائج من {meta.from} إلى {meta.to} (إجمالي: {meta.total} متطوع)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`px-6 py-3 bg-white text-slate-600 rounded-2xl font-black text-sm border border-slate-200 shadow-sm disabled:opacity-30 hover:bg-slate-100 transition-all active:scale-95 ${page === 1 ? 'cursor-not-allowed' : ''}`}
              >
                السابق
              </button>
              <button
                onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                disabled={page === meta.last_page}
                className={`px-6 py-3 bg-white text-slate-600 rounded-2xl font-black text-sm border border-slate-200 shadow-sm disabled:opacity-30 hover:bg-slate-100 transition-all active:scale-95 ${page === meta.last_page ? 'cursor-not-allowed' : ''}`}
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {rejectionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setRejectionModal({ isOpen: false, userId: null })}></div>
          <div className="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-3xl relative animate-in zoom-in duration-300">
            <h2 className="text-3xl font-black text-slate-900 mb-2">تأكيد رفض المتطوع</h2>
            <p className="text-slate-500 font-bold mb-8 text-lg">هل أنت متأكد من رفض هذا المتطوع؟ يمكنك تحديد سبب الرفض أدناه.</p>

            <label className="block text-slate-700 font-black text-sm mb-3">سبب الرفض (اختياري)</label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="مثلاً: المستندات غير مكتملة، المعلومات غير دقيقة..."
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-rose-500 min-h-[120px] font-bold text-slate-900 mb-8"
            ></textarea>

            <div className="flex gap-4">
              <button
                onClick={() => rejectionModal.userId && rejectMutation.mutate({ userId: rejectionModal.userId, reason: rejectionReason })}
                disabled={rejectMutation.isPending}
                className="flex-1 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black shadow-xl shadow-rose-200 transition-all active:scale-95 disabled:opacity-50"
              >
                {rejectMutation.isPending ? 'جاري التنفيذ...' : 'تأكيد الرفض'}
              </button>
              <button
                onClick={() => setRejectionModal({ isOpen: false, userId: null })}
                className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black transition-all active:scale-95"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setDeleteModal(null)}></div>
          <div className="bg-white rounded-[56px] p-12 w-full max-w-lg shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-100 animate-in zoom-in-95 duration-500 relative">
            <div className="w-24 h-24 bg-rose-50 rounded-[40px] flex items-center justify-center mb-10 mx-auto shadow-inner">
              <Trash2 className="w-12 h-12 text-rose-500" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 text-center mb-4 tracking-tight">هل ترغب بالحذف فعلاً؟</h3>
            <p className="text-slate-500 font-bold text-center mb-12 leading-relaxed text-lg">
              سيتم إزالة بيانات هذا المتطوع نهائياً من النظام. هذا الإجراء <span className="text-rose-600 underline underline-offset-4">غير قابل للتراجع</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <button 
                onClick={() => setDeleteModal(null)} 
                className="flex-1 py-5 bg-slate-50 text-slate-500 rounded-3xl font-black hover:bg-slate-100 transition-all active:scale-95"
              >
                تراجع، اتركها
              </button>
              <button
                onClick={() => handleDelete(deleteModal)}
                disabled={isDeleting}
                className="flex-1 py-5 bg-rose-600 text-white rounded-3xl font-black shadow-xl shadow-rose-900/20 hover:bg-rose-700 transition-all active:scale-95 disabled:opacity-50"
              >
                {isDeleting ? 'جاري الأرشفة...' : 'نعم، احذف المتطوع'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


