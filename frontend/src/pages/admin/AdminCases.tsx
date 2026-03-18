import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { adminApi } from '../../api';
import { formatDate } from '@/lib/design-tokens';
import { StatusBadge } from '@/components/admin/StatusBadge';

// SVG Icons
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Eye, 
  Edit2, 
  Trash2, 
  AlertCircle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const priorityStyles: Record<string, string> = {
  low: 'text-slate-400 bg-slate-50',
  medium: 'text-primary-600 bg-primary-50 border-primary-100',
  high: 'text-warning-600 bg-warning-50 border-warning-100',
  urgent: 'text-error-600 bg-error-50 border-error-100 animate-pulse',
};

export default function AdminCases() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [perPage, setPerPage] = useState(10);
  const [deleteModal, setDeleteModal] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'cases', page, statusFilter, search, perPage],
    queryFn: () => adminApi.getCasesForApproval({ page, status: statusFilter || undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: (caseId: number) => adminApi.deleteCase(caseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cases'] });
      setDeleteModal(null);
    },
  });

  const cases = data?.data?.data || [];
  const meta = data?.data?.meta;

  const filteredCases = cases.filter((caseItem: any) => {
    const searchLower = search.toLowerCase();
    return (
      caseItem.patient_name?.toLowerCase().includes(searchLower) ||
      caseItem.disease?.toLowerCase().includes(searchLower) ||
      caseItem.hospital_name?.toLowerCase().includes(searchLower) ||
      caseItem.id?.toString().includes(search)
    );
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setSearchParams(value ? { status: value } : {});
    setPage(1);
  };

  const handleDelete = (caseId: number) => {
    deleteMutation.mutate(caseId);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Immersive Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">الحالات المسجلة</h1>
          <p className="text-slate-500 font-bold max-w-lg">مراقبة وتدقيق كافة التقديمات الطبية وضمان وصول المساعدات لمستحقيها بأقصى سرعة.</p>
        </div>
        <Link to="/admin/cases/create" className="inline-flex items-center gap-3 px-8 py-5 bg-primary-600 text-white rounded-xl font-black shadow-2xl shadow-primary-900/40 hover:bg-primary-500 transition-all hover:-translate-y-1 active:scale-95 group">
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
          <span>إضافة حالة استثنائية</span>
        </Link>
      </div>

      {/* Advanced Filter Panel */}
      <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-slate-200/40 border border-slate-50">
        <div className="flex flex-col xl:flex-row items-center gap-6">
          <div className="relative flex-1 w-full translate-z-0">
            <input
              type="text"
              placeholder="البحث بالاسم، المرض، أو المعرف الرقمي..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-14 pr-7 py-5 bg-slate-50/50 border-2 border-transparent focus:border-primary-500/10 focus:bg-white rounded-xl font-black text-slate-900 placeholder:text-slate-300 transition-all shadow-inner"
            />
            <Search className="w-7 h-7 text-slate-200 absolute left-5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
            <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none z-10">
                <Filter className="w-4 h-4 text-slate-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="w-full sm:w-auto appearance-none pr-12 pl-8 py-5 bg-slate-50 border-none rounded-xl font-black text-slate-600 focus:ring-2 focus:ring-primary-500 cursor-pointer min-w-[200px] shadow-sm"
              >
                <option value="">جميع الحالات</option>
                <option value="pending">بانتظار المراجعة</option>
                <option value="verifying">قيد المراجعة الفنية</option>
                <option value="verified">تم التحقق منها</option>
                <option value="approved">معتمدة للصرف</option>
                <option value="rejected">طلبات مرفوضة</option>
              </select>
            </div>

            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
              className="w-full sm:w-auto pr-8 pl-8 py-5 bg-slate-50 border-none rounded-xl font-black text-slate-600 focus:ring-2 focus:ring-primary-500 cursor-pointer shadow-sm"
            >
              <option value={10}>10 لكل صفحة</option>
              <option value={25}>25 لكل صفحة</option>
              <option value={50}>50 لكل صفحة</option>
            </select>

            <button className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-5 bg-slate-900 text-white rounded-xl font-black hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10">
              <Download className="w-5 h-5 opacity-70" />
              تصدير البيانات
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-card shadow-card border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase">رقم الحالة</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase">المريض</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase">المستشفى</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase">الحالة</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase">التاريخ</th>
                <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-10 py-12">
                      <div className="h-8 bg-slate-100 rounded-2xl w-full"></div>
                    </td>
                  </tr>
                ))
              ) : cases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-lg font-semibold text-slate-900">لا توجد سجلات</p>
                      <p className="text-sm text-slate-500">جرب تغيير معايير البحث</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCases.map((caseItem: any) => (
                  <tr key={caseItem.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4">
                      <span className="text-sm font-bold text-primary-600">
                        #{caseItem.id}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-slate-800">{caseItem.patient_name}</span>
                        <span className="text-xs text-slate-500">{caseItem.disease}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-slate-700">{caseItem.hospital_name}</span>
                        <span className="text-xs text-slate-400">{caseItem.hospital_country}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-2">
                        <StatusBadge status={caseItem.status} />
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${priorityStyles[caseItem.priority]}`}>
                          {t(`case.priorities.${caseItem.priority}`)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {formatDate(caseItem.created_at)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/admin/cases/${caseItem.id}`}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white transition-colors"
                          title="عرض"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/cases/${caseItem.id}/edit`}
                          className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-colors"
                          title="تعديل"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteModal(caseItem.id)}
                          className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors"
                          title="حذف"
                        >
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

        {/* Pagination */}
        {meta && (
          <div className="px-12 py-10 bg-slate-50/50 backdrop-blur-sm border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-sm font-black text-slate-400">
              استعراض <span className="text-slate-900 border-b-2 border-primary-400">{meta.from}-{meta.to}</span> من إجمالي <span className="text-slate-900 font-black">{meta.total}</span> حالة طبية مسجلة
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-12 h-12 flex items-center justify-center bg-white text-slate-500 rounded-2xl border border-slate-100 shadow-sm disabled:opacity-30 hover:bg-primary-600 hover:text-white hover:-translate-x-1 transition-all"
              >
                <ChevronRight className="w-6 h-6 rotate-180" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, meta.last_page) }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-12 h-12 rounded-2xl text-[14px] font-black transition-all duration-300 ${pageNum === page ? 'bg-slate-950 text-white shadow-2xl scale-110' : 'bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-900 border border-slate-100'}`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                disabled={page === meta.last_page}
                className="w-12 h-12 flex items-center justify-center bg-white text-slate-500 rounded-2xl border border-slate-100 shadow-sm disabled:opacity-30 hover:bg-primary-600 hover:text-white hover:translate-x-1 transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Overlay */}
      {deleteModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center z-[1001] p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-12 w-full max-w-lg shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-100 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-rose-50 rounded-2xl flex items-center justify-center mb-10 mx-auto shadow-inner">
              <AlertCircle className="w-12 h-12 text-rose-500" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 text-center mb-4 tracking-tight">هل ترغب بالحذف فعلاً؟</h3>
            <p className="text-slate-500 font-bold text-center mb-12 leading-relaxed text-lg">سيتم إزالة بيانات هذه الحالة نهائياً من النظام. هذا الإجراء <span className="text-rose-600 underline underline-offset-4">غير قابل للتراجع</span>.</p>
            <div className="flex flex-col sm:flex-row gap-5">
              <button onClick={() => setDeleteModal(null)} className="flex-1 py-5 bg-slate-50 text-slate-500 rounded-3xl font-black hover:bg-slate-100 transition-all active:scale-95">
                تراجع، اتركها
              </button>
              <button
                onClick={() => handleDelete(deleteModal)}
                disabled={deleteMutation.isPending}
                className="flex-1 py-5 bg-rose-600 text-white rounded-3xl font-black shadow-xl shadow-rose-900/20 hover:bg-rose-700 transition-all active:scale-95 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'جاري الأرشفة...' : 'نعم، احذف الملف'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


