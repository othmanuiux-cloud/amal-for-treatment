import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { casesApi } from '../api';

const COUNTRIES = [
  'اليمن', 'السعودية', 'الإمارات', 'مصر', 'الأردن', 'الكويت',
  'قطر', 'البحرين', 'عمان', 'لبنان', 'العراق', 'السودان',
  'تركيا', 'المانيا', 'المملكة المتحدة', 'أمريكا'
];

// SVG Icons
const FormIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const HospitalIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

export default function SubmitCase() {
  const navigate = useNavigate();
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
  const [consent, setConsent] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return casesApi.create(data);
    },
    onSuccess: () => {
      navigate('/dashboard/cases/my');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'حدث خطأ أثناء إرسال الحالة، يرجى المحاولة مرة أخرى.';
      const errors = error.response?.data?.errors;
      if (errors) {
        const errorMessages = Object.values(errors).flat().join('\n');
        alert(`${message}\n${errorMessages}`);
      } else {
        alert(message);
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      alert('يرجى الموافقة على نشر البيانات للمضي قدماً');
      return;
    }
    mutation.mutate({ ...formData, patient_age: formData.patient_age ? Number(formData.patient_age) : undefined });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex w-20 h-20 bg-primary-100/50 text-primary-600 rounded-xl items-center justify-center mb-4">
          <FormIcon className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">تقديم حالة طبية</h1>
        <p className="text-slate-500 font-bold text-lg max-w-2xl mx-auto leading-relaxed">
          ساعدنا في فهم الحالة الطبية بشكل دقيق من خلال ملء البيانات التالية. فريقنا سيقوم بمراجعة الحالة والتحقق منها.
        </p>
      </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10" aria-live="polite">
        <div className="lg:col-span-2 space-y-8">
          {/* Section: Patient Info */}
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-xl shadow-slate-200/40 border border-slate-50 space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                <UserIcon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">بيانات المريض</h3>
            </div>

              <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="patient_name" className="text-slate-400 font-black text-sm uppercase px-1">اسم المريض الكامل</label>
                <input
                  id="patient_name"
                  type="text"
                  name="patient_name"
                  value={formData.patient_name}
                  onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="محمد أحمد علي..."
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="patient_age" className="text-slate-400 font-black text-sm uppercase px-1">العمر</label>
                <input
                  id="patient_age"
                  type="number"
                  name="patient_age"
                  value={formData.patient_age}
                  onChange={(e) => setFormData({ ...formData, patient_age: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="25"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="patient_file_number" className="text-slate-400 font-black text-sm uppercase px-1">رقم ملف المريض في المستشفى</label>
                <input
                  id="patient_file_number"
                  type="text"
                  name="patient_file_number"
                  value={formData.patient_file_number}
                  onChange={(e) => setFormData({ ...formData, patient_file_number: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="أدخل رقم الملف الطبي إن وجد"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="patient_gender" className="text-slate-400 font-black text-sm uppercase px-1">الجنس</label>
                <select
                  id="patient_gender"
                  name="patient_gender"
                  value={formData.patient_gender}
                  onChange={(e) => setFormData({ ...formData, patient_gender: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer"
                >
                  <option value="">اختر</option>
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="priority" className="text-slate-400 font-black text-sm uppercase px-1">مستوى الأولوية</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer"
                >
                  <option value="low">منخفضة</option>
                  <option value="medium">متوسطة</option>
                  <option value="high">عالية</option>
                  <option value="urgent">عاجلة (حالة حرجة)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Medical Info */}
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-xl shadow-slate-200/40 border border-slate-50 space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center">
                <HospitalIcon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">المعلومات الطبية والمستشفى</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="disease" className="text-slate-400 font-black text-sm uppercase px-1">التشخيص الطبي / نوع المرض</label>
                <input
                  id="disease"
                  type="text"
                  name="disease"
                  value={formData.disease}
                  onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="مثال: فشل كلوي حاد..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="hospital_name" className="text-slate-400 font-black text-sm uppercase px-1">اسم المستشفى المستهدف</label>
                  <input
                    id="hospital_name"
                    type="text"
                    name="hospital_name"
                    value={formData.hospital_name}
                    onChange={(e) => setFormData({ ...formData, hospital_name: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="اسم المركز الطبي..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="hospital_country" className="text-slate-400 font-black text-sm uppercase px-1">دولة المستشفى</label>
                  <select
                    id="hospital_country"
                    name="hospital_country"
                    value={formData.hospital_country}
                    onChange={(e) => setFormData({ ...formData, hospital_country: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer"
                    required
                  >
                    <option value="">اختر الدولة</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="city" className="text-slate-400 font-black text-sm uppercase px-1">المدينة</label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="المدينة..."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="estimated_cost" className="text-slate-400 font-black text-sm uppercase px-1">التكلفة والعملة</label>
                  <div className="flex gap-3">
                    <input
                      id="estimated_cost"
                      type="number"
                      name="estimated_cost"
                      value={formData.estimated_cost}
                      onChange={(e) => setFormData({ ...formData, estimated_cost: e.target.value })}
                      className="flex-1 px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="0.00"
                    />
                    <select
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-32 px-4 py-4 bg-slate-50 border-none rounded-2xl font-black text-slate-600 focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer"
                    >
                      <option value="USD">USD</option>
                      <option value="SAR">SAR</option>
                      <option value="YER">YER</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-slate-400 font-black text-sm uppercase px-1">شرح مفصل للحالة</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-3xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all h-40 resize-none"
                  placeholder="يرجى كتابة قصة المريض واحتياجه الطبي بالتفصيل..."
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-2xl p-10 text-white shadow-2xl sticky top-8">
            <h4 className="text-2xl font-black mb-6">تأكيد الإرسال</h4>
            <div className="space-y-6">
              <div className="group cursor-pointer select-none" onClick={() => setConsent(!consent)}>
                <div className="flex items-start gap-4 p-4 rounded-3xl group-hover:bg-white/5 transition-colors">
                  <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${consent ? 'bg-primary-500 border-primary-500' : 'border-slate-700'}`}>
                    {consent && <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                  </div>
                  <p className="text-sm font-bold text-slate-300 leading-relaxed">أقر بصحة البيانات المدرجة وأوافق على نشر الحالة الطبية على المنصة الإنسانية للأغراض الإغاثية.</p>
                </div>
              </div>

              <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                <p className="text-xs font-bold text-slate-400 leading-relaxed">
                  * سيقوم فريق العمل بمراجعة طلبكم والتحقق من التقارير المرفقة قبل اعتماد الحالة للنشر العام. قد يستغرق ذلك من 24-48 ساعة.
                </p>
              </div>

              <button
                type="submit"
                disabled={mutation.isPending || !consent}
                className={`w-full py-5 rounded-3xl font-black text-xl shadow-xl transition-all active:scale-95 ${mutation.isPending || !consent ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-primary-600 text-white shadow-primary-900/20 hover:bg-primary-500 hover:-translate-y-1'}`}
              >
                {mutation.isPending ? 'جاري الإرسال...' : 'إرسال الطلب الآن'}
              </button>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100 flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h5 className="font-black text-slate-900 text-lg">نحن نهتم بخصوصيتك</h5>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">بياناتك الشخصية الحساسة تُعامل بسرية تامة وتُستخدم فقط لتسهيل وصول المساعدات الطبية إليك.</p>
          </div>
        </div>
      </form>
    </div>
  );
}

