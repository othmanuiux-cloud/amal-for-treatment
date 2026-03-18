import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { casesApi } from '../api';
import { useAuthStore } from '../auth';
import VolunteerVerificationPanel from '../components/VolunteerVerificationPanel';
import ShareCaseModal from '../components/cases/ShareCaseModal';

// SVG Icons
const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const LocationIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const HospitalIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const UserCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function CaseDetails() {
  const { isAuthenticated, user } = useAuthStore();
  const { id } = useParams();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ['case', id, isAuthenticated],
    queryFn: async () => {
      try {
        const response = await casesApi.getPublicById(Number(id));
        return response;
      } catch (error: any) {
        if (isAuthenticated && error.response?.status === 404) {
          return await casesApi.getById(Number(id));
        }
        throw error;
      }
    }
  });
  const responseBody = data?.data as any;
  const caseData = responseBody?.case?.data || responseBody?.case || responseBody?.data?.case;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 text-center">
        <div className="max-w-md space-y-6">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-12 h-12 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900">الحالة غير موجودة</h2>
          <p className="text-slate-500 font-bold">عذراً، لا يمكننا العثور على التفاصيل التي تبحث عنها حالياً.</p>
          <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-2xl font-black shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all">
            <ArrowRightIcon className="w-5 h-5 rotate-180" />
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'قيد الانتظار' },
    verifying: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'جاري التحقق' },
    verified: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'تم التحقق' },
    approved: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'معتمد للنشر' },
    rejected: { bg: 'bg-rose-100', text: 'text-rose-800', label: 'مرفوض' },
  };

  const currentStyles = statusStyles[caseData.status] || statusStyles.pending;

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 font-bold hover:text-primary-600 transition-colors mb-8 group">
          <ArrowRightIcon className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
          العودة للمقترحات
        </Link>

        {['pending', 'verifying'].includes(caseData.status) && (
          <div className="mb-8 p-6 bg-amber-50 rounded-3xl border border-amber-200 flex flex-col md:flex-row items-start md:items-center gap-4 animate-fade-in-up">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <h3 className="text-xl font-black text-amber-900 mb-1">الحالة قيد التدقيق والمعالجة</h3>
              <p className="text-amber-800 font-bold leading-relaxed">لم يتم اعتماد هذه الحالة بعد. فريق منصة أمل الطبي يعمل حالياً على مراجعة التفاصيل والمستندات والتواصل مع المرفق الطبي قبل الاعتماد النهائي للإغلاق أو نشرها للتبرع.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Main Info Card */}
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8">
                <div className={`px-5 py-2 rounded-full text-sm font-black ${currentStyles.bg} ${currentStyles.text}`}>
                  {currentStyles.label}
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">{caseData.patient_name}</h1>
                  <div className="flex flex-wrap gap-4 items-center">
                    <span className="px-5 py-2 bg-primary-50 text-primary-600 rounded-2xl font-black text-sm">{caseData.disease}</span>
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                      <LocationIcon className="w-5 h-5" />
                      {caseData.hospital_country}
                      {caseData.city && <span className="text-slate-300"> - {caseData.city}</span>}
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100 w-full"></div>

                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-slate-900">قصة الحالة</h3>
                  <p className="text-slate-600 font-bold text-lg leading-relaxed whitespace-pre-line">
                    {caseData.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Visual/Evidence Mockup */}
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl shadow-slate-200/40 border border-slate-50">
              <h3 className="text-2xl font-black text-slate-900 mb-8">المعلومات الموثقة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right underline-offset-4 decoration-primary-200">
                <div className="p-8 bg-slate-50 rounded-2xl space-y-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200/50">
                    <HospitalIcon className="w-7 h-7 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">المرفق الطبي</p>
                    <p className="text-xl font-black text-slate-900">{caseData.hospital_name}</p>
                  </div>
                </div>
                <div className="p-8 bg-slate-50 rounded-2xl space-y-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200/50">
                    <UserCircleIcon className="w-7 h-7 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">بيانات المريض</p>
                    <p className="text-xl font-black text-slate-900">{caseData.patient_age} سنة • {caseData.patient_gender === 'male' ? 'ذكر' : 'أنثى'}</p>
                    {caseData.patient_file_number && (
                      <p className="text-xs font-bold text-primary-600 mt-1 italic tracking-widest underline decoration-primary-200 underline-offset-4">
                        رقم الملف: {caseData.patient_file_number}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Publisher & Verification Info */}
              <div className="mt-8 border border-slate-100 rounded-3xl p-6 bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl border border-slate-200 flex items-center justify-center shadow-sm shrink-0">
                    <UserCircleIcon className="w-7 h-7 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-400 mb-1">تم النشر بواسطة</p>
                    <h4 className="text-lg font-black text-slate-900">{caseData.user?.name || 'مستخدم مسجل'}</h4>
                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg mt-2">
                      تم التحقق من هوية الناشر وصفته كـ (المريض/قريب)
                    </span>
                  </div>
                </div>

                <button className="flex items-center gap-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-4 py-3 rounded-xl transition-colors font-bold text-sm w-full md:w-auto justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
                  إبلاغ عن تلاعب
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar / Donation Status */}
          <div className="space-y-8 mt-8 lg:mt-0">
            {user?.role === 'volunteer' && (
              <VolunteerVerificationPanel caseData={caseData} />
            )}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-2xl shadow-slate-200/60 border border-slate-50 flex flex-col">
              <div className="space-y-8">
                <div className="space-y-2">
                  <p className="text-slate-400 font-black uppercase text-sm tracking-widest">التكلفة المطلوبة</p>
                  <h4 className="text-5xl font-black text-slate-900">{caseData.estimated_cost?.toLocaleString()} <span className="text-2xl text-primary-600">{caseData.currency}</span></h4>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between font-black">
                    <span className="text-slate-400 text-sm">تم جمع: 0%</span>
                    <span className="text-slate-900 text-sm">المتبقي: {caseData.estimated_cost?.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-4 rounded-full p-1 shadow-inner">
                    <div className="bg-primary-600 h-2 rounded-full w-0 transition-all duration-1000"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    disabled={['pending', 'verifying'].includes(caseData.status)}
                    className={`w-full py-5 text-white rounded-3xl font-black text-xl transition-all ${['pending', 'verifying'].includes(caseData.status)
                      ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                      : 'bg-primary-600 shadow-2xl shadow-primary-200 hover:bg-primary-700 hover:-translate-y-1 active:scale-95'
                      }`}
                  >
                    {['pending', 'verifying'].includes(caseData.status) ? 'التبرع غير متاح حالياً' : 'تبرع الآن'}
                  </button>
                  <button 
                    onClick={() => setIsShareModalOpen(true)}
                    className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-xl shadow-2x shadow-slate-100 hover:bg-slate-800 hover:-translate-y-1 transition-all active:scale-95">
                    مشاركة الحالة
                  </button>
                </div>

                <div className="p-6 bg-amber-50 rounded-2xl border-2 border-amber-200 mt-6 text-right relative overflow-hidden">
                  <div className="absolute -left-6 -top-6 w-24 h-24 bg-amber-200/50 rounded-full blur-2xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      <h4 className="text-amber-900 font-black text-sm">تنبيه أمني هام</h4>
                    </div>
                    <p className="text-amber-800/80 font-bold leading-relaxed text-xs">
                      المنصة وسيط تطوعي مجاني. <strong className="text-amber-900">الدفع يتم مباشرة لحساب المستشفى الرسمي فقط</strong> باستخدام رقم ملف المريض: <span className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded italic whitespace-nowrap">{caseData.patient_file_number || 'غير متوفر'}</span>. لا تقم بتحويل أي أموال لأي شخص يدعي تمثيل المنصة.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-primary-900 rounded-2xl p-10 text-white relative overflow-hidden">
              <div className="relative z-10 space-y-4 text-right">
                <h4 className="text-2xl font-black">تحتاج استفسار؟</h4>
                <p className="text-primary-200 font-bold leading-relaxed">فريقنا متواجد للرد على استفساراتكم حول الحالة الطبية وكيفية المساهمة.</p>
                <Link to="/contact" className="px-8 py-3 bg-white text-primary-900 rounded-2xl font-black inline-block">تواصل معنا</Link>
              </div>
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>

      <ShareCaseModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        caseData={{
          id: caseData?.id,
          patientName: caseData?.patient_name || '',
          title: caseData?.disease || '',
          cost: caseData?.estimated_cost || 0,
          country: caseData?.hospital_country || '',
          hospital: caseData?.hospital_name || '',
        }}
      />
    </div>
  );
}

