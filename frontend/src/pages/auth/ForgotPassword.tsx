import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api';

// SVG Icons
const KeyIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
);
const EnvelopeIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // تحقق مسبق
        if (!isValidEmail(email)) {
            setStatus({ type: 'error', message: 'يرجى إدخال بريد إلكتروني صحيح' });
            return;
        }

        setStatus(null);
        setIsLoading(true);
        try {
            const response = await authApi.forgotPassword(email);
            setStatus({ type: 'success', message: response.data.message });
            setEmail(''); // مسح الحقل بعد النجاح
        } catch (err: any) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'حدث خطأ ما، يرجى المحاولة لاحقاً' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gradient-to-br from-slate-50 to-blue-50 text-right">
            <div className="max-w-md w-full space-y-8 bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <KeyIcon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900">استعادة كلمة المرور</h2>
                    <p className="mt-2 text-sm text-slate-500">
                        أدخل بريدك الإلكتروني وسنرسل لك رابطاً لتعيين كلمة مرور جديدة
                    </p>
                </div>

                {/* رسالة الحالة */}
                {status && (
                    <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-fade-in ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                        {status.type === 'success'
                            ? <CheckCircleIcon className="w-5 h-5 shrink-0" />
                            : <ExclamationCircleIcon className="w-5 h-5 shrink-0" />
                        }
                        <span>{status.message}</span>
                    </div>
                )}

                {/* النموذج */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                            البريد الإلكتروني
                        </label>
                        <div className="relative">
                            <EnvelopeIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-12 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-right outline-none"
                                placeholder="example@mail.com"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !email}
                        className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-200"
                    >
                        {isLoading ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                جاري الإرسال...
                            </>
                        ) : (
                            'إرسال رابط الاستعادة'
                        )}
                    </button>
                </form>

                {/* رابط العودة */}
                <div className="text-center pt-4 border-t border-slate-100">
                    <Link to="/login" className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">
                        ← العودة لتسجيل الدخول
                    </Link>
                </div>
            </div>
        </div>
    );
}
