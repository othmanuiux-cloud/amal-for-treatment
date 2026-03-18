import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { ArrowRight, Edit3, Power, Mail, Phone, MapPin, Shield, User } from 'lucide-react';
import { adminApi } from '../../api';

const roleStyles: Record<string, { bg: string; text: string; label: string }> = {
  admin: { bg: 'bg-indigo-50', text: 'text-indigo-600', label: 'مدير نظام' },
  staff: { bg: 'bg-amber-50', text: 'text-amber-600', label: 'موظف' },
  volunteer: { bg: 'bg-teal-50', text: 'text-teal-600', label: 'متطوع' },
  patient: { bg: 'bg-rose-50', text: 'text-rose-600', label: 'مريض' },
};

const COUNTRIES = ['اليمن', 'السعودية', 'الإمارات', 'مصر', 'الأردن', 'الكويت', 'قطر', 'البحرين', 'عمان', 'لبنان', 'العراق', 'السودان', 'تركيا', 'المانيا', 'المملكة المتحدة', 'أمريكا'];

export default function AdminUserDetails() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    role: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'user', id],
    queryFn: () => adminApi.getUser(Number(id)),
  });

  useEffect(() => {
    if (data?.data?.user || data?.data?.data?.user) {
      const user = data?.data?.user || data?.data?.data?.user;
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        country: user.country || '',
        role: user.role || '',
      });
    }
  }, [data]);

  const user = data?.data?.user || data?.data?.data?.user;

  const updateMutation = useMutation({
    mutationFn: (data: any) => adminApi.updateUser(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      setIsEditing(false);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: () => adminApi.toggleUserStatus(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 bg-slate-100 rounded-2xl w-1/3"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="h-96 bg-slate-50 rounded-[40px]"></div>
          <div className="lg:col-span-2 h-96 bg-slate-50 rounded-[40px]"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-6">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center">
          <User className="w-12 h-12 text-slate-400" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">المستخدم غير موجود</h2>
        <Link to="/admin/users" className="px-8 py-3 bg-primary-600 text-white rounded-2xl font-black shadow-xl shadow-primary-200">
          العودة للقائمة
        </Link>
      </div>
    );
  }

  const style = roleStyles[user.role] || { bg: 'bg-slate-100', text: 'text-slate-600', label: user.role };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link to="/admin/users" className="w-14 h-14 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:-translate-x-1 transition-all group">
            <ArrowRight className="w-6 h-6 rotate-180 group-hover:scale-110 transition-transform" />
          </Link>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{user.name}</h1>
            <p className="text-slate-500 font-bold">
              تاريخ الانضمام: {new Date(user.created_at).toLocaleDateString('ar-SA')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-black shadow-lg hover:bg-slate-50 transition-all active:scale-95"
              >
                <Edit3 className="w-5 h-5" />
                تعديل البيانات
              </button>
              <button
                onClick={() => toggleStatusMutation.mutate()}
                disabled={toggleStatusMutation.isPending}
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black transition-all active:scale-95 border-2 ${
                  user.is_active 
                  ? 'border-rose-100 text-rose-600 hover:bg-rose-50 bg-white' 
                  : 'bg-emerald-600 text-white shadow-xl shadow-emerald-200 hover:bg-emerald-500 border-transparent'
                }`}
              >
                <Power className="w-5 h-5" />
                {user.is_active ? 'تعطيل الحساب' : 'تفعيل الحساب'}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(false)} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all">
                إلغاء
              </button>
              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="px-10 py-4 bg-primary-600 text-white rounded-2xl font-black shadow-xl shadow-primary-200 hover:bg-primary-500 transition-all active:scale-95"
              >
                {updateMutation.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Stats Card */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-50 p-10 flex flex-col items-center text-center">
          <div className="relative group">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] flex items-center justify-center text-5xl font-black text-white shadow-xl group-hover:scale-105 transition-transform duration-500">
              {user.name?.trim().charAt(0) || 'ع'}
            </div>
            <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full border-8 border-white shadow-lg ${user.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
          </div>

          <div className="mt-8 space-y-2">
            <h2 className="text-2xl font-black text-slate-900">{user.name}</h2>
            <p className="text-slate-500 font-bold">{user.email}</p>
            <div className={`mt-4 inline-flex px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest ${style.bg} ${style.text}`}>
              {style.label}
            </div>
          </div>

          <div className="w-full mt-10 pt-10 border-t border-slate-50 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold text-sm">حالة الحساب</span>
              <span className={`font-black text-sm ${user.is_active ? 'text-emerald-600' : 'text-rose-600'}`}>
                {user.is_active ? 'نشط ومفعل' : 'معطل مؤقتاً'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold text-sm">آخر نشاط</span>
              <span className="text-slate-700 font-black text-sm">
                {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString('ar-SA') : 'لم يسجل دخول'}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Info / Edit Form Card */}
        <div className="lg:col-span-2 bg-white rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-50 p-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">المعلومات الشخصية</h3>
          </div>

          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">الاسم الكامل</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">رقم الهاتف</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all text-left"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">الدولة</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="">اختر الدولة</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">دور المستخدم (الصلاحيات)</label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {Object.keys(roleStyles).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: r })}
                      className={`px-8 py-4 rounded-2xl font-black text-sm transition-all ${formData.role === r ? 'bg-primary-600 text-white shadow-xl shadow-primary-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    >
                      {roleStyles[r]?.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <User className="w-3.5 h-3.5" />
                  <p className="font-bold text-xs uppercase tracking-widest">الاسم الحقيقي</p>
                </div>
                <p className="text-xl font-black text-slate-800">{user.name}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Mail className="w-3.5 h-3.5" />
                  <p className="font-bold text-xs uppercase tracking-widest">البريد الإلكتروني</p>
                </div>
                <p className="text-xl font-black text-slate-800">{user.email}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Phone className="w-3.5 h-3.5" />
                  <p className="font-bold text-xs uppercase tracking-widest">رقم الهاتف</p>
                </div>
                <p className="text-xl font-black text-slate-800 text-left" dir="ltr">{user.phone || 'غير مسجل'}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <p className="font-bold text-xs uppercase tracking-widest">محل الإقامة</p>
                </div>
                <p className="text-xl font-black text-slate-800">{user.country || 'غير محدد'}</p>
              </div>
              <div className="space-y-1 md:col-span-2">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">الصلاحيات الممنوحة</p>
                <div className="mt-2 p-6 bg-slate-50/50 border border-slate-100 rounded-[32px]">
                  <p className="font-black text-slate-900 mb-1">{style.label}</p>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    هذا المستخدم يمتلك صلاحية {style.label}. يمكنه القيام بالعمليات المخصصة لهذا الدور داخل المنصة.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

