import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Icons
const SettingsIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const BellIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9" />
    </svg>
);

const PaletteIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
    </svg>
);

const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState('general');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [formData, setFormData] = useState<Record<string, string>>({
        site_name: '',
        support_email: '',
        whatsapp_number: '',
        site_description: '',
        notify_new_case: '1',
        notify_verification: '1',
        notify_urgent: '1',
        primary_color: '#0f172a',
        site_logo: ''
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>('');

    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/admin/settings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Settings loaded:', response.data);

            if (response.data?.data) {
                const settings: Record<string, string> = {};
                response.data.data.forEach((item: any) => {
                    settings[item.key] = item.value;
                });
                setFormData(prev => ({ ...prev, ...settings }));
            }
        } catch (error: any) {
            console.error('Failed to load settings:', error);
            // Use defaults
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                setMessage({ type: 'error', text: '❌ يرجى رفع ملف صورة (PNG، JPG، SVG)' });
                setTimeout(() => setMessage(null), 3000);
                return;
            }
            
            // Validate file size (2MB max)
            if (file.size > 2 * 1024 * 1024) {
                setMessage({ type: 'error', text: '❌ حجم الصورة يجب أن لا يتجاوز 2 ميجابايت' });
                setTimeout(() => setMessage(null), 3000);
                return;
            }
            
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);
        console.log('Saving settings:', formData);

        try {
            const token = localStorage.getItem('token');

            // If there's a logo file, upload it first
            if (logoFile) {
                const logoFormData = new FormData();
                logoFormData.append('logo', logoFile);
                
                try {
                    const uploadResponse = await axios.post(
                        `${API_URL}/admin/settings/logo`,
                        logoFormData,
                        { 
                            headers: { 
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data'
                            } 
                        }
                    );
                    console.log('Logo upload response:', uploadResponse.data);
                    if (uploadResponse.data?.url) {
                        setFormData(prev => ({ ...prev, site_logo: uploadResponse.data.url }));
                    }
                } catch (uploadError: any) {
                    console.error('Logo upload failed:', uploadError);
                    // Continue with other settings even if logo fails
                }
            }

            // Save all settings
            const response = await axios.put(
                `${API_URL}/admin/settings`,
                { settings: formData },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('Save response:', response.data);
            setMessage({ type: 'success', text: '✅ تم حفظ الإعدادات بنجاح' });
            
            // Clear logo file after successful save
            setLogoFile(null);
            
            // Reload settings after save
            await loadSettings();
        } catch (error: any) {
            console.error('Save failed:', error);
            setMessage({
                type: 'error',
                text: error?.response?.data?.message || error?.response?.data?.error || '❌ فشل حفظ الإعدادات'
            });
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.new_password !== passwordData.confirm_password) {
            setMessage({ type: 'error', text: '❌ كلمات المرور غير متطابقة' });
            return;
        }

        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${API_URL}/auth/profile`,
                {
                    current_password: passwordData.current_password,
                    password: passwordData.new_password,
                    password_confirmation: passwordData.confirm_password
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage({ type: 'success', text: '✅ تم تحديث كلمة المرور' });
            setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
        } catch (error: any) {
            console.error('Password change failed:', error);
            setMessage({
                type: 'error',
                text: error?.response?.data?.message || '❌ فشل تحديث كلمة المرور'
            });
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const tabs = [
        { id: 'general', label: 'المعلومات الأساسية', icon: SettingsIcon },
        { id: 'design', label: 'المظهر والتصميم', icon: PaletteIcon },
        { id: 'security', label: 'الأمان والصلاحيات', icon: ShieldIcon },
        { id: 'notifications', label: 'الإشعارات التلقائية', icon: BellIcon },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">إعدادات المنصة</h1>
                    <p className="text-slate-500 font-bold max-w-lg">إدارة التكوين العام للمنصة وتخصيص تجربة المستخدم والمشرفين.</p>
                </div>
                <div className="flex items-center gap-3">
                    {message && (
                        <div className={`px-4 py-2 rounded-xl font-bold text-sm ${
                            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                            {message.text}
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={loadSettings}
                        className="px-6 py-3 bg-white text-slate-600 border-2 border-slate-100 rounded-2xl font-black hover:bg-slate-50 transition-all"
                    >
                        إعادة تعيين
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-8 py-3 bg-primary-600 text-white rounded-2xl font-black shadow-lg shadow-primary-600/20 hover:bg-primary-500 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </button>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-10">
                {/* Sidebar */}
                <div className="w-full xl:w-80 shrink-0">
                    <div className="bg-white rounded-3xl p-6 shadow-2xl shadow-slate-200/40 border border-slate-50 space-y-2 sticky top-6">
                        <div className="px-4 py-3 mb-2">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">الإعدادات</p>
                        </div>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-4 px-6 py-5 rounded-xl font-black text-sm transition-all duration-500 overflow-hidden relative group ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-2xl scale-[1.02]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                            >
                                {activeTab === tab.id && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary-500 rounded-l-full"></div>
                                )}
                                <tab.icon className={`w-5 h-5 transition-transform duration-500 ${activeTab === tab.id ? 'text-white scale-110' : 'group-hover:text-primary-600 group-hover:scale-110'}`} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-6">
                    {activeTab === 'general' && (
                        <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/30 border border-slate-100 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
                                    <SettingsIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900">المعلومات الأساسية</h3>
                                    <p className="text-sm text-slate-500">اسم المنصة ومعلومات التواصل</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">اسم المنصة الرسمي</label>
                                    <input
                                        type="text"
                                        value={formData.site_name}
                                        onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">البريد الرسمي للدعم</label>
                                    <input
                                        type="email"
                                        value={formData.support_email}
                                        onChange={(e) => setFormData({ ...formData, support_email: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">رقم الواتساب</label>
                                    <input
                                        type="text"
                                        value={formData.whatsapp_number}
                                        onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all"
                                        dir="ltr"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">حالة المنصة</label>
                                    <div className="flex items-center gap-3 px-6 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                        مفعلة وتستقبل الطلبات
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">نص تعريفي للمنصة (SEO)</label>
                                <textarea
                                    value={formData.site_description}
                                    onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                                    className="w-full h-28 px-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all resize-none leading-relaxed"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/30 border border-slate-100 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                        <ShieldIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900">تغيير كلمة المرور</h3>
                                        <p className="text-sm text-slate-500">أمان الحساب</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">كلمة المرور الحالية</label>
                                        <input
                                            type="password"
                                            value={passwordData.current_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all font-mono"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">كلمة المرور الجديدة</label>
                                        <input
                                            type="password"
                                            value={passwordData.new_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all font-mono"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">تأكيد كلمة المرور</label>
                                        <input
                                            type="password"
                                            value={passwordData.confirm_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-start">
                                    <button
                                        type="button"
                                        onClick={handlePasswordChange}
                                        disabled={isSaving}
                                        className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {isSaving ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
                                    </button>
                                </div>
                            </div>

                            {/* RBAC Overview */}
                            <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/30 border border-slate-100 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                                        <ShieldIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900">نظرة عامة على الصلاحيات</h3>
                                        <p className="text-sm text-slate-500">مجموعات المستخدمين وصلاحياتهم</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { role: 'مدير النظام', color: 'text-indigo-600', bg: 'bg-indigo-50', perms: ['إدارة المستخدمين', 'اعتماد الحالات', 'تعديل الإعدادات', 'التقارير'] },
                                        { role: 'المتطوع', color: 'text-teal-600', bg: 'bg-teal-50', perms: ['التحقق من الحالات', 'إضافة ملاحظات', 'التواصل مع المرضى'] },
                                        { role: 'المريض', color: 'text-rose-600', bg: 'bg-rose-50', perms: ['رفع حالات جديدة', 'متابعة التبرعات', 'تعديل الملف'] }
                                    ].map((r, i) => (
                                        <div key={i} className={`${r.bg} rounded-3xl p-6 border border-white`}>
                                            <h4 className={`font-black ${r.color} mb-3`}>{r.role}</h4>
                                            <ul className="space-y-2">
                                                {r.perms.map((p, j) => (
                                                    <li key={j} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${r.color.replace('text', 'bg')}`}></div>
                                                        {p}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>

                                <Link to="/admin/users" className="flex items-center justify-between p-6 bg-slate-900 rounded-3xl text-white hover:bg-slate-800 transition-all">
                                    <div>
                                        <p className="font-black">إدارة المستخدمين والصلاحيات</p>
                                        <p className="text-xs text-slate-400 font-bold">انتقل لصفحة إدارة المستخدمين</p>
                                    </div>
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                        <ArrowRightIcon className="w-5 h-5" />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/30 border border-slate-100 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                                    <BellIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900">الإشعارات التلقائية</h3>
                                    <p className="text-sm text-slate-500">الأحداث التي تتطلب تنبيهات</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { id: 'notify_new_case', label: 'تنبيه عند إضافة حالة جديدة', desc: 'إشعار المشرفين عند تسجيل حالة طبية جديدة.' },
                                    { id: 'notify_verification', label: 'تنبيه عند انتهاء التحقق', desc: 'إشعار عند اكتمال عملية التحقق.' },
                                    { id: 'notify_urgent', label: 'تنبيهات الحالات العاجلة (WhatsApp)', desc: 'تنبيهات فورية للحالات الطارئة.' },
                                ].map(item => (
                                    <div key={item.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100/50 hover:bg-white hover:shadow-lg transition-all">
                                        <div>
                                            <h4 className="font-black text-slate-900">{item.label}</h4>
                                            <p className="text-sm text-slate-500">{item.desc}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, [item.id]: formData[item.id] === '1' ? '0' : '1' })}
                                            className={`w-14 h-8 rounded-full transition-all relative ${formData[item.id] === '1' ? 'bg-primary-600' : 'bg-slate-200'}`}
                                        >
                                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all ${formData[item.id] === '1' ? 'left-1' : 'right-1'}`}></div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'design' && (
                        <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/30 border border-slate-100 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                                    <PaletteIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900">المظهر والتصميم</h3>
                                    <p className="text-sm text-slate-500">الهوية البصرية للمنصة</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Logo Upload Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">شعار المنصة</label>
                                        {formData.site_logo && (
                                            <span className="text-xs text-emerald-600 font-bold">✓ تم رفع الشعار</span>
                                        )}
                                    </div>
                                    
                                    {/* Upload Area */}
                                    <div 
                                        className={`relative aspect-square max-w-[240px] mx-auto w-full bg-slate-50 rounded-3xl border-4 border-dashed transition-all overflow-hidden group ${
                                            logoPreview || formData.site_logo 
                                                ? 'border-emerald-200 bg-emerald-50/30' 
                                                : 'border-slate-200 hover:border-primary-400 hover:bg-slate-100'
                                        }`}
                                    >
                                        {logoPreview || formData.site_logo ? (
                                            <>
                                                <img 
                                                    src={logoPreview || formData.site_logo} 
                                                    alt="شعار المنصة" 
                                                    className="w-full h-full object-contain p-6"
                                                />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                    <span className="text-white font-black text-sm">تغيير الشعار</span>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { 
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setLogoFile(null); 
                                                            setLogoPreview(''); 
                                                            setFormData(prev => ({ ...prev, site_logo: '' })); 
                                                        }}
                                                        className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors"
                                                    >
                                                        إزالة
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <label className="w-full h-full flex flex-col items-center justify-center gap-4 cursor-pointer p-6">
                                                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
                                                    <SettingsIcon className="w-10 h-10" />
                                                </div>
                                                <div className="text-center space-y-2">
                                                    <p className="text-sm font-black text-slate-700">انقر لرفع الشعار</p>
                                                    <p className="text-xs text-slate-400">PNG، SVG، JPG • الحد الأقصى 2MB</p>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                                                    onChange={handleLogoChange}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </label>
                                        )}
                                    </div>

                                    {/* Guidelines */}
                                    <div className="bg-blue-50 rounded-2xl p-4 space-y-2">
                                        <p className="text-xs font-black text-blue-800">📋 إرشادات الشعار:</p>
                                        <ul className="text-xs text-blue-700 space-y-1">
                                            <li>• الأبعاد المثالية: 200×200 بكسل (مربع)</li>
                                            <li>• الصيغة: PNG شفاف أو SVG</li>
                                            <li>• الحجم: 2 ميجابايت كحد أقصى</li>
                                            <li>• الأيقونة: يفضل أن تكون بسيطة وواضحة</li>
                                        </ul>
                                    </div>

                                    {/* Current Logo Preview in Header */}
                                    {formData.site_logo && (
                                        <div className="bg-slate-900 rounded-2xl p-4 space-y-3">
                                            <p className="text-xs font-black text-slate-400">معاينة في الترويسة:</p>
                                            <div className="flex items-center gap-3 bg-white rounded-xl p-3">
                                                {formData.site_logo && (
                                                    <img src={formData.site_logo} alt="شعار" className="w-10 h-10 object-contain rounded-lg" />
                                                )}
                                                <span className="text-sm font-black text-slate-900">{formData.site_name || 'اسم المنصة'}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">اللون الرئيسي</label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="color"
                                                value={formData.primary_color}
                                                onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                                                className="w-16 h-16 bg-transparent border-4 border-white shadow-lg cursor-pointer rounded-2xl overflow-hidden"
                                            />
                                            <div className="flex-1 px-5 py-4 bg-slate-50 rounded-2xl font-mono text-sm text-slate-600">
                                                {formData.primary_color}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Live Color Preview */}
                                    <div className="p-6 bg-slate-900 rounded-3xl space-y-4">
                                        <p className="text-xs font-black text-slate-400 uppercase">معاينة الألوان:</p>
                                        <div className="flex items-center gap-3">
                                            <button 
                                                className="px-6 py-3 rounded-xl font-black text-white text-sm"
                                                style={{ backgroundColor: formData.primary_color }}
                                            >
                                                زر رئيسي
                                            </button>
                                            <a 
                                                href="#" 
                        style={{ color: formData.primary_color }}
                                                className="text-sm font-bold underline"
                                            >
                                                رابط
                                            </a>
                                        </div>
                                        <p className="text-xs text-slate-400">
                                            سيتم تطبيق هذا اللون على الأزرار، الروابط، والأيقونات التفاعلية.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
