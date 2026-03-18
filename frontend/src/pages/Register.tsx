import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../auth';
import { Button } from '../components/ui';

const COUNTRIES = [
  'اليمن', 'السعودية', 'الإمارات', 'مصر', 'الأردن', 'الكويت', 'قطر', 'البحرين', 'عمان', 'لبنان', 'العراق', 'السودان', 'تركيا', 'المانيا', 'المملكة المتحدة', 'أمريكا'
];

// SVG Icons
const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const UserGroupIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9-9H3m9 9V3m0 9L12 21" />
  </svg>
);

const LockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, isAuthenticated, user } = useAuthStore();

  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      const dashboardPath = user?.role === 'admin' ? '/admin' : '/dashboard';
      navigate(dashboardPath);
    }
  }, [isAuthenticated, navigate, user]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    country: '',
    phone: '',
    role: 'patient',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password_confirmation) {
      setError(t('validation.password_match'));
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.errors?.email?.[0] || t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row transition-all duration-700 animate-in fade-in overflow-hidden" dir="rtl">
      {/* Left Side: Hero Section (Visible on Desktop) */}
        <div className="hidden md:flex md:w-1/2 lg:w-[45%] bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/register_hero.png"
            alt="Humanitarian Aid"
            width={800}
            height={600}
            className="w-full h-full object-cover opacity-60 scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-lg text-right">
          <Link to="/" className="inline-flex items-center gap-3 mb-10 group">
            <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-500/40 group-hover:rotate-12 transition-transform duration-300">
              <span className="text-white font-black text-2xl">أ</span>
            </div>
            <span className="text-2xl font-black text-white tracking-tight">منصة أمل</span>
          </Link>

          <h1 className="text-5xl font-black text-white leading-tight mb-6">
            كن جزءاً من مسيرة <br />
            <span className="text-primary-400">الأمل والعطاء</span>
          </h1>
          <p className="text-slate-300 text-xl font-bold leading-relaxed mb-10">
            انضم إلى آلاف المتطوعين والمستفيدين في أكبر شبكة إنسانية يمنية للرعاية الطبية.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
              <p className="text-3xl font-black text-white mb-1">+500</p>
              <p className="text-slate-400 font-bold text-sm">متطوع نشط</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
              <p className="text-3xl font-black text-white mb-1">+1200</p>
              <p className="text-slate-400 font-bold text-sm">حالة مكتملة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-20 bg-slate-50 relative overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex flex-col items-center mb-10 w-full animate-in fade-in slide-in-from-top duration-500">
          <Link to="/" className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-200 mb-4">
            <span className="text-white font-black text-3xl">أ</span>
          </Link>
          <h2 className="text-3xl font-black text-slate-900">إنشاء حساب جديد</h2>
        </div>

        <div className="w-full max-w-xl animate-in fade-in slide-in-from-left duration-700">
          <div className="hidden md:block mb-10">
            <h2 className="text-4xl font-black text-slate-900 mb-2">إنشاء حساب</h2>
            <p className="text-slate-500 font-bold">ابدأ رحلتك معنا بملء البيانات التالية</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in shake duration-500">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Role Selection Blocks */}
            <div className="space-y-4">
              <label className="text-slate-400 font-black text-xs uppercase px-1 tracking-widest">نوع الحساب</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'patient' })}
                  className={`relative p-6 rounded-xl text-right transition-all duration-300 border-2 ${formData.role === 'patient' ? 'bg-primary-50 border-primary-500 shadow-xl shadow-primary-100' : 'bg-white border-slate-100 grayscale hover:grayscale-0 hover:border-primary-200 shadow-sm'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${formData.role === 'patient' ? 'bg-primary-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                    <UserIcon className="w-6 h-6" />
                  </div>
                  <h3 className={`font-black text-lg ${formData.role === 'patient' ? 'text-primary-900' : 'text-slate-400'}`}>مريض</h3>
                  <p className={`text-sm font-bold ${formData.role === 'patient' ? 'text-primary-600' : 'text-slate-300'}`}>أحتاج مساعدة طبية</p>
                  {formData.role === 'patient' && (
                    <div className="absolute top-4 left-4 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white p-1 shadow-lg">
                      <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'volunteer' })}
                  className={`relative p-6 rounded-xl text-right transition-all duration-300 border-2 ${formData.role === 'volunteer' ? 'bg-emerald-50 border-emerald-500 shadow-xl shadow-emerald-100' : 'bg-white border-slate-100 grayscale hover:grayscale-0 hover:border-emerald-200 shadow-sm'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${formData.role === 'volunteer' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                    <UserGroupIcon className="w-6 h-6" />
                  </div>
                  <h3 className={`font-black text-lg ${formData.role === 'volunteer' ? 'text-emerald-900' : 'text-slate-400'}`}>متطوع</h3>
                  <p className={`text-sm font-bold ${formData.role === 'volunteer' ? 'text-emerald-600' : 'text-slate-300'}`}>أريد المساهمة والمساعدة</p>
                  {formData.role === 'volunteer' && (
                    <div className="absolute top-4 left-4 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white p-1 shadow-lg">
                      <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Basic Info Group */}
            <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/40 border border-slate-50 space-y-6">
              <h4 className="text-slate-900 font-black text-lg flex items-center gap-3 mb-2">
                <span className="w-1.5 h-6 bg-primary-500 rounded-full"></span>
                المعلومات الشخصية
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-slate-400 font-bold text-sm px-1">الاسم الكامل</label>
                  <div className="relative group">
                    <UserIcon className="w-5 h-5 text-slate-300 absolute right-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary-500 transition-colors" aria-hidden="true" />
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pr-12 pl-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-slate-300"
                      placeholder="عبدالله محمد..."
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-400 font-bold text-sm px-1">البريد الإلكتروني</label>
                  <div className="relative group">
                    <MailIcon className="w-5 h-5 text-slate-300 absolute right-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary-500 transition-colors" aria-hidden="true" />
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pr-12 pl-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-slate-300"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-400 font-bold text-sm px-1">الدولة</label>
                  <div className="relative group">
                    <GlobeIcon className="w-5 h-5 text-slate-300 absolute right-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary-500 transition-colors" aria-hidden="true" />
                    <select
                      name="country"
                      autoComplete="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full pr-12 pl-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all cursor-pointer appearance-none"
                      required
                    >
                      <option value="">اختر الدولة</option>
                      {COUNTRIES.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-400 font-bold text-sm px-1">رقم الهاتف (اختياري)</label>
                  <div className="relative group">
                    <PhoneIcon className="w-5 h-5 text-slate-300 absolute right-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary-500 transition-colors" aria-hidden="true" />
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pr-12 pl-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-slate-300"
                      placeholder="7xx xxx xxx"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security Group */}
            <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/40 border border-slate-50 space-y-6">
              <h4 className="text-slate-900 font-black text-lg flex items-center gap-3 mb-2">
                <span className="w-1.5 h-6 bg-rose-500 rounded-full"></span>
                أمان الحساب
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-slate-400 font-bold text-sm px-1">كلمة المرور</label>
                  <div className="relative group">
                    <LockIcon className="w-5 h-5 text-slate-300 absolute right-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary-500 transition-colors" aria-hidden="true" />
                    <input
                      type="password"
                      name="password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pr-12 pl-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-slate-300"
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-400 font-bold text-sm px-1">تأكيد كلمة المرور</label>
                  <div className="relative group">
                    <LockIcon className="w-5 h-5 text-slate-300 absolute right-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary-500 transition-colors" aria-hidden="true" />
                    <input
                      type="password"
                      name="password_confirmation"
                      autoComplete="new-password"
                      value={formData.password_confirmation}
                      onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                      className="w-full pr-12 pl-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-slate-300"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full shadow-2xl"
            >
              إنشاء الحساب الآن
            </Button>
          </form>

          <p className="mt-12 text-center text-slate-400 font-bold">
            هل لديك حساب بالفعل؟{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 transition-colors border-b-2 border-transparent hover:border-primary-600 pb-0.5">
              تسجيل الدخول
            </Link>
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-[10%] right-[-5%] w-64 h-64 bg-primary-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}

