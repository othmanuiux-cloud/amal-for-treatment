import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { casesApi, adminApi } from '../../api';

// SVG Icons (More consistent stroke widths)
const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const PulseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const HospitalIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const COUNTRIES = ['اليمن', 'السعودية', 'الإمارات', 'مصر', 'الأردن', 'الكويت', 'قطر', 'البحرين', 'عمان', 'تركيا', 'المانيا', 'المملكة المتحدة', 'أمريكا'];

export default function CreateCase() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    patient_name: '',
    patient_age: '',
    patient_gender: '',
    disease: '',
    disease_category: '',
    hospital_name: '',
    hospital_country: '',
    city: '',
    hospital_address: '',
    estimated_cost: '',
    currency: 'USD',
    description: '',
    priority: 'medium',
    patient_file_number: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch existing case data if in edit mode
  const { data: caseRes, isLoading: isLoadingCase } = useQuery({
    queryKey: ['admin', 'case', id],
    queryFn: () => adminApi.getCase(Number(id)),
    enabled: isEdit,
  });

  useEffect(() => {
    const responseBody = caseRes?.data as any;
    const c = responseBody?.case?.data || responseBody?.case || responseBody?.data?.case;
    if (c) {
      setFormData({
        patient_name: c.patient_name || '',
        patient_age: String(c.patient_age || ''),
        patient_gender: c.patient_gender || '',
        disease: c.disease || '',
        disease_category: c.disease_category || '',
        hospital_name: c.hospital_name || '',
        hospital_country: c.hospital_country || '',
        city: c.city || '',
        hospital_address: c.hospital_address || '',
        estimated_cost: String(c.estimated_cost || ''),
        currency: c.currency || 'USD',
        description: c.description || '',
        priority: c.priority || 'medium',
        patient_file_number: c.patient_file_number || '',
      });
    }
  }, [caseRes]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEdit) {
        return adminApi.updateCase(Number(id), data);
      }
      return casesApi.create(data);
    },
    onSuccess: (res) => {
      const targetId = isEdit ? id : res.data?.case?.id;
      navigate(`/admin/cases/${targetId}`);
    },
    onError: (err: any) => {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: err.response?.data?.message || 'حدث خطأ' });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const submitData: any = {
      ...formData,
      patient_age: formData.patient_age ? Number(formData.patient_age) : undefined,
      estimated_cost: formData.estimated_cost ? Number(formData.estimated_cost) : undefined,
    };

    mutation.mutate(submitData);
  };

  if (isEdit && isLoadingCase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Premium Header */}
      <div className="flex items-center gap-6">
        <Link to="/admin/cases" className="w-14 h-14 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:-translate-x-1 transition-all group">
          <ArrowRightIcon className="w-6 h-6 rotate-180 group-hover:scale-110 transition-transform" />
        </Link>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {isEdit ? 'تعديل الحالة الطبية' : 'إضافة حالة جديدة'}
          </h1>
          <p className="text-slate-500 font-bold">
            {isEdit ? `تحرير بيانات الحالة #${id}` : 'قم بتعبئة بيانات الحالة الطبية بدقة ليتم مراجعتها'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {errors.general && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 p-6 rounded-[32px] font-black text-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-rose-600 text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-rose-200">!</div>
            {errors.general}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Sections */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section: Patient Details */}
            <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-50 p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 to-indigo-500 opacity-20"></div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <UserIcon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">بيانات المريض</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">اسم المريض الكامل *</label>
                  <input
                    type="text"
                    value={formData.patient_name}
                    onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                    className={`w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all ${errors.patient_name ? 'ring-2 ring-rose-500 bg-rose-50' : ''}`}
                    placeholder="أدخل الاسم الرباعي للمريض"
                    required
                  />
                  {errors.patient_name && <p className="text-rose-600 text-xs font-bold mt-1 px-2">{errors.patient_name}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">رقم ملف المريض في المستشفى</label>
                  <input
                    type="text"
                    value={formData.patient_file_number}
                    onChange={(e) => setFormData({ ...formData, patient_file_number: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="رقم الملف الطبي إن وجد"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">العمر</label>
                    <input
                      type="number"
                      value={formData.patient_age}
                      onChange={(e) => setFormData({ ...formData, patient_age: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">الجنس</label>
                    <select
                      value={formData.patient_gender}
                      onChange={(e) => setFormData({ ...formData, patient_gender: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">اختر الجنس</option>
                      <option value="male">ذكر</option>
                      <option value="female">أنثى</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Medical Info */}
            <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-50 p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-500 to-amber-500 opacity-20"></div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <PulseIcon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">التشخيص الطبي</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">اسم المرض أو الحالة *</label>
                  <input
                    type="text"
                    value={formData.disease}
                    onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
                    className={`w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all ${errors.disease ? 'ring-2 ring-rose-500 bg-rose-50' : ''}`}
                    placeholder="التشخيص الطبي الرئيسي"
                    required
                  />
                  {errors.disease && <p className="text-rose-600 text-xs font-bold mt-1 px-2">{errors.disease}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">وصف شامل للحالة *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all h-40 resize-none ${errors.description ? 'ring-2 ring-rose-500 bg-rose-50' : ''}`}
                    placeholder="اشرح تفاصيل الحالة والاحتياجات الطبية..."
                    required
                  />
                  {errors.description && <p className="text-rose-600 text-xs font-bold mt-1 px-2">{errors.description}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Additional Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-50 p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-primary-500 opacity-20"></div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                  <HospitalIcon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-slate-900">المستشفى</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">اسم المنشأة الطبية *</label>
                  <input
                    type="text"
                    value={formData.hospital_name}
                    onChange={(e) => setFormData({ ...formData, hospital_name: e.target.value })}
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                    required
                  />
                </div>

                  <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">الدولة *</label>
                  <select
                    value={formData.hospital_country}
                    onChange={(e) => setFormData({ ...formData, hospital_country: e.target.value })}
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all text-sm appearance-none cursor-pointer"
                    required
                  >
                    <option value="">اختر الدولة</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">المدينة</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                    placeholder="المدينة..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">التكلفة التقديرية</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={formData.estimated_cost}
                      onChange={(e) => setFormData({ ...formData, estimated_cost: e.target.value })}
                      className="flex-1 px-5 py-3.5 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                    />
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-24 px-3 py-3.5 bg-slate-50 border-none rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                    >
                      <option value="USD">USD</option>
                      <option value="SAR">SAR</option>
                      <option value="YER">YER</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 rounded-[40px] p-8 text-white shadow-2xl shadow-slate-950/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <h3 className="text-xl font-black mb-6 flex items-center gap-3 relative z-10">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(79,70,229,0.8)]"></div>
                إعدادات التحكم
              </h3>

              <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">درجة الأولوية</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['low', 'medium', 'high', 'urgent'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setFormData({ ...formData, priority: p })}
                        className={`px-4 py-3 rounded-xl text-xs font-black transition-all duration-300 ${formData.priority === p ? 'bg-primary-600 text-white shadow-xl shadow-primary-900/40 border border-primary-500' : 'bg-slate-900 text-slate-500 border border-slate-800 hover:border-slate-700 hover:text-slate-300'}`}
                      >
                        {p === 'low' ? 'منخفضة' : p === 'medium' ? 'متوسطة' : p === 'high' ? 'عالية' : 'عاجلة'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black shadow-xl shadow-primary-900/40 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {mutation.isPending ? 'جاري الإرسال...' : isEdit ? 'حفظ التعديلات' : 'حفظ الحالة ونشرها'}
                  </button>
                  <Link to="/admin/cases" className="block w-full py-4 bg-slate-900/50 hover:bg-slate-900 text-slate-400 text-center rounded-2xl font-black transition-all border border-slate-800">
                    إلغاء
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}


