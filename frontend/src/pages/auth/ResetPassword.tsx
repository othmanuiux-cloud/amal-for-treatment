import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../../api';

// SVG Icons
const KeyIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
);
const CheckCircleIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const ExclamationCircleIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ token: '', email: '', password: '', password_confirmation: '' });
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        if (token && email) {
            setFormData(prev => ({ ...prev, token, email }));
        } else {
            setStatus({ type: 'error', message: 'رابط إعادة التعيين غير صالح أو ناقص' });
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.password_confirmation) {
            setStatus({ type: 'error', message: 'كلمتا المرور غير متطابقتين' });
            return;
        }

        setStatus(null);
        setIsLoading(true);
        try {
            const response = await authApi.resetPassword(formData);
            setStatus({ type: 'success', message: response.data.message });
            // تحويل المستخدم إلى صفحة تسجيل الدخول بعد 3 ثوانٍ
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'فشل إعادة تعيين كلمة المرور' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gradient-to-br from-slate-50 to-blue-50 text-right">
            <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 text-center mb-10 tracking-tight">تعيين كلمة مرور جديدة</h2>

                {status && (
                    <div className={`p-4 mb-6 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in duration-300 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                        {status.type === 'success' ? <CheckCircleIcon className="w-5 h-5 shrink-0" /> : <ExclamationCircleIcon className="w-5 h-5 shrink-0" />}
                        <span>{status.message}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="pass" className="block text-sm font-bold text-slate-700 mb-2 mr-1">كلمة المرور الجديدة</label>
                            <div className="relative">
                                <KeyIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="pass" type="password" value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-primary-500 outline-none pr-12 transition-all"
                                    placeholder="••••••••" required minLength={8} disabled={isLoading}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirm" className="block text-sm font-bold text-slate-700 mb-2 mr-1">تأكيد كلمة المرور</label>
                            <div className="relative">
                                <KeyIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="confirm" type="password" value={formData.password_confirmation}
                                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                    className="w-full px-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-primary-500 outline-none pr-12 transition-all"
                                    placeholder="••••••••" required disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !formData.token}
                        className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-primary-700 transition-all flex items-center justify-center gap-2 disabled:bg-slate-300"
                    >
                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                        {isLoading ? 'جاري التغيير...' : 'تعيين كلمة المرور'}
                    </button>
                </form>
            </div>
        </div>
    );
}
