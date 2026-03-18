import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../auth';
import { Button } from '../components/ui';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      const dashboardPath = user?.role === 'admin' ? '/admin' : '/dashboard';
      navigate(dashboardPath);
    }
  }, [isAuthenticated, navigate, user]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      console.error('Login error:', err);
      const message = err.response?.data?.message || err.message || t('common.error');
      setError(message === 'Unauthorized' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : message);
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect after successful login
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardPath = user.role === 'admin' ? '/admin' : '/dashboard';
      navigate(dashboardPath);
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-10 rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-50 rounded-full blur-2xl" aria-hidden="true"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-50 rounded-full blur-2xl" aria-hidden="true"></div>

          <div className="relative z-10">
            <div className="text-center mb-10">
              <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
                <div className="w-14 h-14 bg-primary-600 rounded-2xl rotate-3 group-hover:rotate-0 transition-all duration-300 flex items-center justify-center shadow-xl shadow-primary-200">
                  <span className="text-white font-black text-3xl">أ</span>
                </div>
              </Link>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {t('auth.login_title')}
              </h2>
              <p className="mt-2 text-sm text-slate-500 font-medium">
                سعداء برؤيتك مرة أخرى في منصة أمل
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-shake" role="alert">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2 mr-1">
                    {t('auth.email')}
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input py-3.5 pr-11 bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary-500/20"
                      placeholder="name@example.com"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400" aria-hidden="true">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2 mr-1">
                    <label htmlFor="password" className="block text-sm font-bold text-slate-700">
                      {t('auth.password')}
                    </label>
                    <Link to="/forgot-password" title={t('auth.forgot_password')} className="text-xs font-bold text-primary-600 hover:text-primary-700">
                      {t('auth.forgot_password')}
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input py-3.5 pr-11 bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary-500/20"
                      placeholder="••••••••"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400" aria-hidden="true">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="mr-2 block text-sm text-slate-600 font-medium">
                  {t('auth.remember_me')}
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full shadow-xl"
              >
                {t('auth.login')}
              </Button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-sm text-slate-500 font-medium">
                {t('auth.dont_have_account')}{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-bold underline underline-offset-4">
                  {t('auth.register')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
