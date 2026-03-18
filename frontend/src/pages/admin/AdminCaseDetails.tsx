import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { adminApi } from '../../api';
import { useState } from 'react';

// SVG Icons
const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const EditIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const DocumentIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const statusStyles: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500', label: 'قيد الانتظار' },
  verifying: { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500', label: 'جاري التحقق' },
  verified: { bg: 'bg-indigo-50', text: 'text-indigo-600', dot: 'bg-indigo-500', label: 'تم التحقق' },
  approved: { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500', label: 'تم الاعتماد' },
  rejected: { bg: 'bg-rose-50', text: 'text-rose-600', dot: 'bg-rose-500', label: 'مرفوض' },
};

const priorityStyles: Record<string, { text: string; label: string }> = {
  low: { text: 'text-slate-400', label: 'منخفضة' },
  medium: { text: 'text-blue-500', label: 'متوسطة' },
  high: { text: 'text-amber-500', label: 'عالية' },
  urgent: { text: 'text-rose-600', label: 'عاجلة جداً' },
};

export default function AdminCaseDetails() {
  const { id } = useParams<{ id: string }>();

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusAction, setStatusAction] = useState<'approve' | 'reject'>('approve');
  const [notes, setNotes] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-case', id],
    queryFn: () => adminApi.getCase(Number(id)),
    enabled: !!id,
  });

  const responseBody = data?.data as any;
  const caseData = responseBody?.case?.data || responseBody?.case || responseBody?.data?.case;

  const approveMutation = useMutation({
    mutationFn: (data: { notes?: string }) => adminApi.approveCase(Number(id), data.notes),
    onSuccess: () => {
      setShowStatusModal(false);
      refetch();
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (reason: string) => adminApi.rejectCase(Number(id), reason),
    onSuccess: () => {
      setShowStatusModal(false);
      refetch();
    },
  });

  const handleStatusChange = () => {
    if (statusAction === 'approve') {
      approveMutation.mutate({ notes });
    } else {
      rejectMutation.mutate(notes);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 bg-slate-100 rounded-2xl w-1/3"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-64 bg-slate-50 rounded-[40px]"></div>
            <div className="h-48 bg-slate-50 rounded-[40px]"></div>
          </div>
          <div className="h-96 bg-slate-50 rounded-[40px]"></div>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-6">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center">
          <XIcon className="w-12 h-12 text-slate-400" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800">الحالة غير موجودة</h2>
          <p className="text-slate-500 font-bold mt-2">عذراً، لم نتمكن من العثور على تفاصيل هذه الحالة</p>
        </div>
        <Link to="/admin/cases" className="px-8 py-3 bg-primary-600 text-white rounded-2xl font-black shadow-xl shadow-primary-200 hover:bg-primary-500 transition-all">
          العودة لقائمة الحالات
        </Link>
      </div>
    );
  }

  const currentStatus = statusStyles[caseData.status] || statusStyles.pending;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link to="/admin/cases" className="w-14 h-14 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:-translate-x-1 transition-all group">
            <ArrowRightIcon className="w-6 h-6 rotate-180 group-hover:scale-110 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">تفاصيل الحالة</h1>
              <span className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-full text-xs font-black">#{caseData.id}</span>
            </div>
            <p className="text-slate-500 font-bold">
              تاريخ التقديم: {new Date(caseData.created_at).toLocaleDateString('ar-SA')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to={`/admin/cases/${id}/edit`} className="inline-flex items-center gap-2 px-6 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-black shadow-lg shadow-slate-200/50 hover:bg-slate-50 transition-all">
            <EditIcon className="w-5 h-5" />
            تعديل البيانات
          </Link>
          {['pending', 'verifying', 'verified'].includes(caseData.status) && (
            <>
              <button
                onClick={() => { setStatusAction('approve'); setShowStatusModal(true); }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-200 hover:bg-emerald-500 hover:-translate-y-1 transition-all active:scale-95"
              >
                <CheckIcon className="w-5 h-5" />
                اعتماد الحالة
              </button>
              <button
                onClick={() => { setStatusAction('reject'); setShowStatusModal(true); }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-rose-600 text-white rounded-2xl font-black shadow-xl shadow-rose-200 hover:bg-rose-500 hover:-translate-y-1 transition-all active:scale-95"
              >
                <XIcon className="w-5 h-5" />
                رفض الحالة
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Patient Card */}
          <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-50 p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black">
                م
              </div>
              <h3 className="text-2xl font-black text-slate-900">بيانات المريض</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-1">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">اسم المريض الكامل</p>
                <p className="text-xl font-black text-slate-800">{caseData.patient_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">العمر والجنس</p>
                <p className="text-xl font-black text-slate-800">
                  {caseData.patient_age} سنة • {caseData.patient_gender === 'male' ? 'ذكر' : 'أنثى'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">رقم ملف المستشفى</p>
                <p className="text-xl font-black text-slate-800">{caseData.patient_file_number || 'غير متوفر'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">التشخيص الطبي</p>
                <p className="text-xl font-black text-primary-600">{caseData.disease}</p>
              </div>
              <div className="space-y-1 md:col-span-2">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">وصف الحالة بالتفصيل</p>
                <p className="text-lg font-bold text-slate-600 leading-relaxed mt-2 bg-slate-50/50 p-6 rounded-3xl border border-slate-100 italic">
                  &quot;{caseData.description}&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Hospital Card */}
          <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-50 p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black">
                م
              </div>
              <h3 className="text-2xl font-black text-slate-900">بيانات المستشفى والتكلفة</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-1">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">اسم المستشفى</p>
                <p className="text-xl font-black text-slate-800">{caseData.hospital_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">الدولة</p>
                <p className="text-xl font-black text-slate-800">{caseData.hospital_country}{caseData.city && ` - ${caseData.city}`}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">التكلفة المتوقعة</p>
                <p className="text-2xl font-black text-emerald-600">
                  {caseData.estimated_cost?.toLocaleString()} <span className="text-sm font-black">{caseData.currency}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Documents Card */}
          <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-50 p-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 text-slate-500 rounded-2xl flex items-center justify-center font-black">
                  د
                </div>
                <h3 className="text-2xl font-black text-slate-900">المستندات الطبية</h3>
              </div>
              <span className="text-slate-400 font-black text-sm">{caseData.documents?.length || 0} ملف</span>
            </div>

            {caseData.documents?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {caseData.documents.map((doc: any) => (
                  <div key={doc.id} className="group flex items-center gap-4 p-5 bg-slate-50/50 border border-slate-100 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-colors">
                      <DocumentIcon className="w-7 h-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 font-black text-sm truncate">{doc.file_name}</p>
                      <p className="text-slate-400 font-bold text-[10px] uppercase mt-1">{doc.file_type || 'PDF DOCUMENT'}</p>
                    </div>
                    <button className="text-primary-600 font-black text-sm px-4 py-2 hover:bg-primary-50 rounded-xl transition-all">تحميل</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 bg-slate-50/50 rounded-[32px] border border-dashed border-slate-200 text-center">
                <p className="text-slate-400 font-bold">لا توجد مستندات مرفقة لهذه الحالة</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          {/* Status Sidebar Card */}
          <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-50 p-8">
            <h3 className="text-xl font-black text-slate-900 mb-6">الحالة الحالية</h3>
            <div className="space-y-6">
              <div className="p-6 bg-slate-50/50 rounded-[32px] border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold text-sm">حالة المعالجة</span>
                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${currentStatus.bg} ${currentStatus.text}`}>
                    <div className={`w-2 h-2 rounded-full ${currentStatus.dot} animate-pulse`}></div>
                    {currentStatus.label}
                  </div>
                </div>
                <div className="h-px bg-slate-200/50"></div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold text-sm">مستوى الأولوية</span>
                  <span className={`font-black text-sm ${priorityStyles[caseData.priority]?.text}`}>
                    {priorityStyles[caseData.priority]?.label}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 px-2">
                <div className="w-12 h-12 bg-slate-100 rounded-[18px] flex items-center justify-center font-black text-slate-500">
                  {caseData.user?.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-0.5">مقدم الطلب</p>
                  <p className="text-slate-900 font-black">{caseData.user?.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Table */}
          <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-50 p-8">
            <h3 className="text-xl font-black text-slate-900 mb-8">سجل التحديثات</h3>
            <div className="space-y-10 relative pr-4">
              {/* Line */}
              <div className="absolute right-3.5 top-0 bottom-0 w-0.5 bg-slate-100"></div>

              {/* Step 1 */}
              <div className="relative flex items-start gap-4">
                <div className="absolute -right-3 top-2 w-3.5 h-3.5 rounded-full border-2 border-white bg-primary-600 shadow-lg shadow-primary-200 z-10"></div>
                <div className="flex-1">
                  <p className="text-slate-900 font-black text-sm">تم إنشاء الطلب</p>
                  <p className="text-slate-400 font-bold text-xs mt-1">{new Date(caseData.created_at).toLocaleDateString('ar-SA')}</p>
                </div>
              </div>

              {/* Step 2 */}
              {caseData.status !== 'pending' && (
                <div className="relative flex items-start gap-4">
                  <div className="absolute -right-3 top-2 w-3.5 h-3.5 rounded-full border-2 border-white bg-blue-500 shadow-lg shadow-blue-200 z-10"></div>
                  <div className="flex-1">
                    <p className="text-slate-900 font-black text-sm">جاري مراجعة البيانات</p>
                    <p className="text-slate-400 font-bold text-xs mt-1">تم إرسال الأوراق للتحقق</p>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {['verified', 'approved'].includes(caseData.status) && (
                <div className="relative flex items-start gap-4">
                  <div className="absolute -right-3 top-2 w-3.5 h-3.5 rounded-full border-2 border-white bg-indigo-500 shadow-lg shadow-indigo-200 z-10"></div>
                  <div className="flex-1">
                    <p className="text-slate-900 font-black text-sm">تم التحقق بنجاح</p>
                    <p className="text-slate-400 font-bold text-xs mt-1">أوراق المريض صحيحة</p>
                  </div>
                </div>
              )}

              {/* Step 4 */}
              {caseData.status === 'approved' && (
                <div className="relative flex items-start gap-4">
                  <div className="absolute -right-3 top-2 w-3.5 h-3.5 rounded-full border-2 border-white bg-emerald-500 shadow-lg shadow-emerald-200 z-10"></div>
                  <div className="flex-1">
                    <p className="text-slate-900 font-black text-sm">تم اعتماد الحالة للنشر</p>
                    <p className="text-slate-400 font-bold text-xs mt-1">جاهزة لاستقبال التبرعات</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-xl shadow-2xl relative">
            <button onClick={() => setShowStatusModal(false)} className="absolute left-8 top-8 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
              <XIcon className="w-5 h-5" />
            </button>

            <div className="mb-8">
              <h3 className="text-3xl font-black text-slate-900 mb-2">
                {statusAction === 'approve' ? 'تأكيد اعتماد الحالة' : 'سبب رفض الحالة'}
              </h3>
              <p className="text-slate-500 font-bold">يرجى كتابة ملاحظاتك لاتخاذ هذا الإجراء</p>
            </div>

            <div className="space-y-6">
              <div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-40 p-6 bg-slate-50 border-none rounded-[32px] font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all resize-none"
                  placeholder={statusAction === 'approve' ? 'أضف ملاحظات إيجابية حول الحالة...' : 'وضح سبب الرفض ليتمكن مقدم الطلب من التصحيح...'}
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-3xl font-black hover:bg-slate-200 transition-all active:scale-95"
                >
                  تراجع
                </button>
                <button
                  onClick={handleStatusChange}
                  disabled={approveMutation.isPending || rejectMutation.isPending}
                  className={`flex-[2] py-5 rounded-3xl font-black text-white shadow-xl transition-all active:scale-95 disabled:opacity-50 ${statusAction === 'approve' ? 'bg-emerald-600 shadow-emerald-200 hover:bg-emerald-500' : 'bg-rose-600 shadow-rose-200 hover:bg-rose-500'}`}
                >
                  {approveMutation.isPending || rejectMutation.isPending ? 'جاري التنفيذ...' : statusAction === 'approve' ? 'اعتماد ونشر الحالة' : 'رفض الطلب نهائياً'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

