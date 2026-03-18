import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth';
import { NotificationBell } from '../ui/NotificationBell';
import { 
  Home, 
  FileText, 
  PlusCircle, 
  Menu,
  X,
  LogOut,
  WifiOff
} from 'lucide-react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone 
} from 'lucide-react';

export const Layout = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm('هل تريد تسجيل الخروج؟')) {
      logout();
      navigate('/');
    }
  };

  const getUserDashboardPath = (role?: string) => {
    switch(role) {
      case 'admin': return '/admin';
      case 'volunteer': return '/volunteer';
      case 'patient': return '/dashboard/cases/my';
      default: return '/dashboard';
    }
  };

  const navLinks = [
    { to: '/', label: 'الرئيسية', icon: Home },
    { to: '/cases/published', label: 'تصفح الحالات', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-arabic" dir="rtl">
      {/* Offline Banner */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white text-center py-2 text-sm font-bold">
          <WifiOff className="w-4 h-4 inline ml-2" />
          لا يوجد اتصال بالإنترنت - بعض الميزات قد لا تعمل
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 backdrop-blur-lg bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Right - Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-2xl">أ</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-black text-slate-900">أمل للعلاج</h1>
                <p className="text-xs text-slate-500 font-bold">منصة علاج خيرية</p>
              </div>
            </Link>

            {/* Center - Navigation Links */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                    location.pathname === link.to
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Left - Actions */}
            <div className="flex items-center gap-3">
              {/* Submit Case Button - ALWAYS VISIBLE */}
              <Link
                to="/dashboard/cases/submit"
                className="hidden sm:flex items-center gap-2 bg-primary-600 text-white px-6 py-3 min-h-[44px] rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 active:scale-95"
              >
                <PlusCircle className="w-5 h-5" />
                <span>قدم حالتك</span>
              </Link>

              {/* Mobile Submit Button */}
              <Link
                to="/dashboard/cases/submit"
                className="sm:hidden flex items-center justify-center w-12 h-12 bg-primary-600 text-white rounded-xl shadow-lg"
                aria-label="قدم حالتك"
              >
                <PlusCircle className="w-6 h-6" />
              </Link>

              {/* For Logged-in Users */}
              {isAuthenticated && user ? (
                <>
                  {/* Volunteer Dashboard Link - For Volunteers */}
                  {(user.role === 'volunteer' || user.role === 'admin') && (
                    <Link
                      to="/volunteer"
                      className="hidden md:flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl font-bold transition-colors"
                    >
                      <FileText className="w-5 h-5" />
                      <span>التحقق</span>
                    </Link>
                  )}

                  {/* My Cases Link - For Patients */}
                  {user.role === 'patient' && (
                    <Link
                      to="/dashboard/cases/my"
                      className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                    >
                      <FileText className="w-5 h-5" />
                      <span>حالاتي</span>
                    </Link>
                  )}

                  {/* Notifications */}
                  <NotificationBell />

                  {/* User Menu */}
                  <Link
                    to={getUserDashboardPath(user.role)}
                    className="flex items-center gap-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-black text-sm">
                        {user.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="hidden lg:block text-right">
                      <p className="text-sm font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 font-bold uppercase">{user.role}</p>
                    </div>
                  </Link>

                  {/* Logout Button - ALWAYS VISIBLE */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors"
                    title="تسجيل الخروج"
                    aria-label="تسجيل الخروج"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden md:inline">خروج</span>
                  </button>

                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
                    aria-label="القائمة"
                  >
                    {mobileMenuOpen ? (
                      <X className="w-6 h-6 text-slate-600" />
                    ) : (
                      <Menu className="w-6 h-6 text-slate-600" />
                    )}
                  </button>
                </>
              ) : (
                <>
                  {/* Not Logged In - Show Login/Signup */}
                  <Link
                    to="/login"
                    className="hidden sm:flex items-center gap-2 px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-xl font-bold hover:bg-primary-50 transition-all"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
                  >
                    إنشاء حساب
                  </Link>

                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
                    aria-label="القائمة"
                  >
                    {mobileMenuOpen ? (
                      <X className="w-6 h-6 text-slate-600" />
                    ) : (
                      <Menu className="w-6 h-6 text-slate-600" />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                    location.pathname === link.to
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              ))}
              
              {/* Mobile: Submit Case */}
              <Link
                to="/dashboard/cases/submit"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 bg-primary-600 text-white rounded-xl font-bold"
              >
                <PlusCircle className="w-5 h-5" />
                <span>قدم حالتك</span>
              </Link>

              {/* Mobile: My Cases (for patients) */}
              {user?.role === 'patient' && (
                <Link
                  to="/dashboard/cases/my"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  <FileText className="w-5 h-5" />
                  <span>حالاتي</span>
                </Link>
              )}

              {/* Mobile: Volunteer Dashboard */}
              {(user?.role === 'volunteer' || user?.role === 'admin') && (
                <Link
                  to="/volunteer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 bg-amber-50 text-amber-700 rounded-xl font-bold"
                >
                  <FileText className="w-5 h-5" />
                  <span>التحقق من الحالات</span>
                </Link>
              )}

              {/* Mobile: Login/Signup */}
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 border-2 border-primary-600 text-primary-600 rounded-xl font-bold"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 bg-primary-600 text-white rounded-xl font-bold"
                  >
                    إنشاء حساب
                  </Link>
                </>
              )}

              {/* Mobile: Logout Button - For logged in users */}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold"
                >
                  <LogOut className="w-5 h-5" />
                  <span>تسجيل الخروج</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className={`flex-1 ${!isOnline ? 'mt-10' : ''}`}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-2xl">أ</span>
                </div>
                <div>
                  <h2 className="text-xl font-black">أمل للعلاج</h2>
                  <p className="text-slate-400 text-sm">منصة علاج خيرية موثوقة</p>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-md">
                منصة أمل وساطة موثوقة لعرض الحالات الطبية المعتمدة. الدفع يتم مباشرة لحسابات المستشفيات الرسمية - المنصة لا تتلقى أي مبالغ مالية لضمان الشفافية المطلقة.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">روابط سريعة</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                    الرئيسية
                  </Link>
                </li>
                <li>
                  <Link to="/cases/published" className="text-slate-400 hover:text-white transition-colors">
                    الحالات المنشورة
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/cases/submit" className="text-slate-400 hover:text-white transition-colors">
                    تقديم حالة
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                    تواصل معنا
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-4">تواصل معنا</h3>
              <ul className="space-y-3">
                <li>
                  <a href="mailto:support@amal.platform" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                    support@amal.platform
                  </a>
                </li>
                <li>
                  <a href="tel:+967777000000" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <Phone className="w-4 h-4" />
                    +967 777 000 000
                  </a>
                </li>
              </ul>
              {/* Social Media Icons */}
              <div className="flex gap-3 mt-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="فيسبوك" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="تويتر" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="إنستغرام" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="يوتيوب" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} جميع الحقوق محفوظة لمنصة أمل للعلاج.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">
                سياسة الخصوصية
              </Link>
              <Link to="/terms" className="text-slate-400 hover:text-white transition-colors">
                شروط الاستخدام
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
