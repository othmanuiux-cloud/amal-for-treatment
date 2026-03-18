import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, UserPlus, ShieldCheck, Mail, User, Phone, MapPin, Lock, Save, X } from 'lucide-react';
import { adminApi } from '../../api';

const COUNTRIES = ['اليمن', 'السعودية', 'الإمارات', 'مصر', 'الأردن', 'الكويت', 'قطر', 'البحرين', 'عمان', 'لبنان', 'العراق', 'السودان', 'تركيا', 'المانيا', 'المملكة المتحدة', 'أمريكا'];

export default function CreateUser() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'patient',
    country: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch user data for editing
  const { data: userData, isLoading: isFetching } = useQuery({
    queryKey: ['admin', 'user', id],
    queryFn: () => adminApi.getUser(Number(id)),
    enabled: isEdit,
  });

  useEffect(() => {
    if (userData?.data?.data) {
      const user = userData.data.data;
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role: user.role || 'patient',
        country: user.country || '',
        phone: user.phone || '',
      });
    }
  }, [userData]);

  const mutation = useMutation({
    mutationFn: (data: any) => isEdit ? adminApi.updateUser(Number(id), data) : adminApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      if (isEdit) queryClient.invalidateQueries({ queryKey: ['admin', 'user', id] });
      navigate('/admin/users');
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

    if (formData.password || formData.password_confirmation) {
      if (formData.password !== formData.password_confirmation) {
        setErrors({ password_confirmation: 'كلمات المرور غير متطابقة' });
        return;
      }
    }

    const payload: any = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      country: formData.country,
      phone: formData.phone || undefined,
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    mutation.mutate(payload);
  };

  if (isFetching) {
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
        <Link to="/admin/users" className="w-14 h-14 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:-translate-x-1 transition-all group">
          <ArrowRight className="w-6 h-6 rotate-180 group-hover:scale-110 transition-transform" />
        </Link>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {isEdit ? 'تعديل مستخدم' : 'إضافة مستخدم'}
          </h1>
          <p className="text-slate-500 font-bold text-lg">
            {isEdit ? 'تحديث بيانات الحساب وتغيير الصلاحيات' : 'إنشاء حساب جديد وتحديد الصلاحيات والمناطق'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {errors.general && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 p-6 rounded-[32px] font-black text-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-rose-600 text-white rounded-full flex items-center justify-center shrink-0">!</div>
            {errors.general}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Content Sections */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section: Basic Identity */}
            <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-50 p-10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="flex items-center gap-4 mb-10 relative">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                  {isEdit ? <User className="w-7 h-7" /> : <UserPlus className="w-7 h-7" />}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">الهوية والاتصال</h3>
                  <p className="text-sm text-slate-400 font-bold mt-0.5">البيانات الأساسية المسجلة للنظام</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                <div className="space-y-2 text-right">
                  <div className="flex items-center gap-2 text-slate-400 mb-1 px-1">
                    <User className="w-3.5 h-3.5" />
                    <label className="text-sm font-black uppercase tracking-widest">اسم المستخدم الكامل *</label>
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-6 py-5 bg-slate-50/80 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-4 focus:ring-primary-100 focus:bg-white focus:border-primary-300 transition-all outline-none ${errors.name ? 'border-rose-300 ring-4 ring-rose-50' : ''}`}
                    placeholder="الاسم الرباعي"
                    required
                  />
                  {errors.name && <p className="text-rose-600 text-xs font-bold mt-1 px-2">{errors.name}</p>}
                </div>

                <div className="space-y-2 text-right">
                  <div className="flex items-center gap-2 text-slate-400 mb-1 px-1">
                    <Mail className="w-3.5 h-3.5" />
                    <label className="text-sm font-black uppercase tracking-widest">البريد الإلكتروني *</label>
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-6 py-5 bg-slate-50/80 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-4 focus:ring-primary-100 focus:bg-white focus:border-primary-300 transition-all outline-none ${errors.email ? 'border-rose-300 ring-4 ring-rose-50' : ''}`}
                    placeholder="example@mail.com"
                    required
                  />
                  {errors.email && <p className="text-rose-600 text-xs font-bold mt-1 px-2">{errors.email}</p>}
                </div>

                <div className="space-y-2 text-right">
                  <div className="flex items-center gap-2 text-slate-400 mb-1 px-1">
                    <Phone className="w-3.5 h-3.5" />
                    <label className="text-sm font-black uppercase tracking-widest">رقم الهاتف</label>
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-6 py-5 bg-slate-50/80 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-4 focus:ring-primary-100 focus:bg-white focus:border-primary-300 transition-all outline-none text-left"
                    placeholder="+967 ..."
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2 text-right">
                  <div className="flex items-center gap-2 text-slate-400 mb-1 px-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <label className="text-sm font-black uppercase tracking-widest">الدولة / منطقة الإقامة *</label>
                  </div>
                  <div className="relative">
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className={`w-full px-6 py-5 bg-slate-50/80 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-4 focus:ring-primary-100 focus:bg-white focus:border-primary-300 transition-all outline-none appearance-none cursor-pointer ${errors.country ? 'border-rose-300 ring-4 ring-rose-50' : ''}`}
                      required
                    >
                      <option value="">اختر الدولة</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ArrowRight className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                  {errors.country && <p className="text-rose-600 text-xs font-bold mt-1 px-2">{errors.country}</p>}
                </div>
              </div>
            </div>

            {/* Section: Credentials */}
            <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-50 p-10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="flex items-center gap-4 mb-8 relative">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <Lock className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    {isEdit ? 'تغيير كلمة المرور' : 'الأمان والخصوصية'}
                  </h3>
                  <p className="text-sm text-slate-400 font-bold mt-0.5">
                    {isEdit ? 'اتركها فارغة إذا لا ترغب في التغيير' : 'حدد كلمة مرور قوية للحساب'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                <div className="space-y-2 text-right">
                  <div className="flex items-center gap-2 text-slate-400 mb-1 px-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <label className="text-sm font-black uppercase tracking-widest">
                      كلمة المرور {isEdit ? '' : '*'}
                    </label>
                  </div>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full px-6 py-5 bg-slate-50/80 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-4 focus:ring-primary-100 focus:bg-white focus:border-primary-300 transition-all outline-none ${errors.password ? 'border-rose-300 ring-4 ring-rose-50' : ''}`}
                    placeholder="••••••••"
                    required={!isEdit}
                    minLength={8}
                  />
                  {errors.password && <p className="text-rose-600 text-xs font-bold mt-1 px-2">{errors.password}</p>}
                </div>

                <div className="space-y-2 text-right">
                  <div className="flex items-center gap-2 text-slate-400 mb-1 px-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <label className="text-sm font-black uppercase tracking-widest">
                      تأكيد كلمة المرور {isEdit ? '' : '*'}
                    </label>
                  </div>
                  <input
                    type="password"
                    value={formData.password_confirmation}
                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                    className={`w-full px-6 py-5 bg-slate-50/80 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-4 focus:ring-primary-100 focus:bg-white focus:border-primary-300 transition-all outline-none ${errors.password_confirmation ? 'border-rose-300 ring-4 ring-rose-50' : ''}`}
                    placeholder="••••••••"
                    required={!isEdit}
                  />
                  {errors.password_confirmation && <p className="text-rose-600 text-xs font-bold mt-1 px-2">{errors.password_confirmation}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-8">
            <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl shadow-slate-900/20 sticky top-8">
              <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                صلاحيات النظام
              </h3>

              <div className="space-y-8">
                {/* ... role buttons ... */}
                <div className="space-y-4">
                  {[
                    { id: 'patient', label: 'مريض / مستخدم', icon: User },
                    { id: 'volunteer', label: 'متطوع رسمي', icon: UserPlus },
                    { id: 'admin', label: 'مدير نظام كامل', icon: ShieldCheck }
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: r.id })}
                      className={`w-full px-6 py-5 rounded-2xl font-black text-sm flex items-center justify-between transition-all group ${formData.role === r.id ? 'bg-primary-600 text-white shadow-xl shadow-primary-900/40' : 'bg-slate-800 text-slate-400 hover:bg-slate-750'}`}
                    >
                      <div className="flex items-center gap-3">
                        <r.icon className={`w-5 h-5 ${formData.role === r.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                        <span>{r.label}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 border-current flex items-center justify-center ${formData.role === r.id ? 'bg-white text-primary-600 border-white' : 'text-slate-600'}`}>
                        {formData.role === r.id && <div className="w-2.5 h-2.5 bg-current rounded-full"></div>}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-6 space-y-4 border-t border-slate-800 text-right">
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black shadow-xl shadow-primary-900/40 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {mutation.isPending ? 'جاري التنفيذ...' : (
                      <>
                        <Save className="w-5 h-5" />
                        {isEdit ? 'تحديث البيانات' : 'إنشاء الحساب الآن'}
                      </>
                    )}
                  </button>
                  <Link to="/admin/users" className="w-full py-5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-center rounded-2xl font-black transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                    <X className="w-5 h-5" />
                    تراجع
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

