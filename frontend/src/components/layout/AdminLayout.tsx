import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../auth';
import { usePlatformSettings } from '../../hooks/usePlatformSettings';
import { 
  LayoutDashboard, FileText, Users, ShieldCheck, 
  Activity, Settings, Bell, LogOut, Menu, ExternalLink, BarChart3
} from 'lucide-react';

const menuItems = [
  { path: '/admin', label: 'dashboard.title', icon: LayoutDashboard },
  { path: '/admin/cases', label: 'admin.cases', icon: FileText },
  { path: '/admin/users', label: 'admin.users', icon: Users },
  { path: '/admin/volunteers', label: 'admin.volunteers', icon: ShieldCheck },
  { path: '/admin/reports', label: 'التقارير', icon: BarChart3 },
  { path: '/admin/activity', label: 'admin.activity', icon: Activity },
  { path: '/admin/notifications', label: 'الإشعارات', icon: Bell },
  { path: '/admin/settings', label: 'admin.settings', icon: Settings },
];

export default function AdminLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const { settings } = usePlatformSettings();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-arabic" dir="rtl">
      {/* Immersive Sidebar */}
      <aside className={`fixed top-0 bottom-0 z-50 ${sidebarOpen ? 'w-80' : 'w-28'} bg-white border-l border-slate-100 transition-all duration-500 ease-in-out shadow-[40px_0_80px_-20px_rgba(15,23,42,0.03)]`}>
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary-50/30 to-transparent pointer-events-none"></div>

          {/* Sidebar Header */}
          <div className="h-24 flex items-center justify-between px-8 border-b border-slate-50 relative z-10">
            {sidebarOpen ? (
              <Link to="/" className="flex items-center gap-4 group">
                {settings.site_logo ? (
                  <img src={settings.site_logo} alt={settings.site_name} className="w-12 h-12 object-contain rounded-[18px] shadow-2xl" />
                ) : (
                  <div className="w-12 h-12 bg-slate-950 rounded-[18px] flex items-center justify-center shadow-2xl shadow-slate-950/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <span className="text-white font-black text-2xl">أ</span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-xl font-black text-slate-900 tracking-tight">{settings.site_name || 'أمل للعلاج'}</span>
                  <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em]">Dashboard UI</span>
                </div>
              </Link>
            ) : (
              <div className="w-12 h-12 bg-slate-950 rounded-[18px] flex items-center justify-center mx-auto shadow-xl overflow-hidden">
                {settings.site_logo ? (
                  <img src={settings.site_logo} alt={settings.site_name} className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="text-white font-black text-2xl">أ</span>
                )}
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300 ${!sidebarOpen && 'hidden'}`}
              aria-label="طي الشريط الجانبي"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="mt-6 mx-auto p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all shadow-sm"
              aria-label="توسيع الشريط الجانبي"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto relative z-10 custom-scrollbar">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group relative ${isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20 border-r-4 border-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-r-4 border-transparent'
                    }`}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-600'}`} />
                  {sidebarOpen && <span className="font-bold text-sm">{t(item.label)}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User Section - Enhanced */}
          <div className="p-6 border-t border-slate-50 relative z-10">
            <div className={`group flex items-center gap-4 ${sidebarOpen ? 'px-5' : 'justify-center'} py-5 bg-slate-900 rounded-[28px] shadow-2xl shadow-slate-900/10 hover:scale-[1.02] transition-all duration-500 overflow-hidden relative`}>
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <div className="w-11 h-11 rounded-[16px] bg-gradient-to-br from-indigo-400 to-primary-600 flex items-center justify-center text-white font-black border-2 border-white/20 shadow-xl flex-shrink-0 relative z-10">
                {user?.name?.charAt(0)}
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0 relative z-10">
                  <p className="text-[15px] font-black text-white truncate group-hover:translate-x-1 transition-transform">{user?.name}</p>
                  <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.15em] opacity-80">{user?.role}</p>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-4 mt-4 px-5 py-4 rounded-[22px] text-rose-500 hover:bg-rose-50 transition-all duration-300 group ${!sidebarOpen && 'justify-center'}`}
              aria-label="تسجيل الخروج"
            >
              <LogOut className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
              {sidebarOpen && <span className="font-black text-[15px] tracking-wide">تسجيل الخروج</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-500 ${sidebarOpen ? 'mr-80' : 'mr-28'}`}>
        {/* Floating Header */}
        <header className={`h-24 flex items-center justify-between px-10 sticky top-0 z-40 transition-all duration-500 ${scrolled ? 'bg-white/70 backdrop-blur-xl border-b border-slate-100 shadow-sm h-20' : 'bg-transparent'}`}>
          <div className="flex items-center gap-4 animate-in slide-in-from-right-4 duration-700">
            <div className="w-1.5 h-8 bg-primary-600 rounded-full"></div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {t(menuItems.find(i => i.path === location.pathname || (i.path !== '/admin' && location.pathname.startsWith(i.path)))?.label || 'admin.title')}
            </h1>
          </div>

          <div className="flex items-center gap-6 animate-in slide-in-from-left-4 duration-700">
            <Link to="/admin/notifications" className="relative p-3.5 rounded-2xl bg-white text-slate-400 hover:text-primary-600 hover:bg-white shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-primary-100/50 transition-all duration-500 group" aria-label="الإشعارات">
              <Bell className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="absolute top-3.5 right-3.5 w-3 h-3 bg-rose-500 rounded-full border-[3px] border-white shadow-sm" aria-hidden="true"></span>
            </Link>
            <div className="w-px h-10 bg-slate-200/60 hidden sm:block"></div>
            <Link to="/" className="hidden sm:flex items-center gap-2 text-sm font-black text-slate-600 hover:text-primary-600 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <ExternalLink className="w-4 h-4" />
              <span>معاينة الموقع</span>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-10 pb-20 relative">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-50/20 rounded-full blur-[120px] -z-10 pointer-events-none opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-50/30 rounded-full blur-[100px] -z-10 pointer-events-none opacity-50"></div>

          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Simple Footer */}
        <footer className="px-10 py-8 border-t border-slate-100 flex items-center justify-between text-slate-400 font-bold text-xs bg-white/50 backdrop-blur-sm">
          <p>© {new Date().getFullYear()} {settings.site_name || 'منصة أمل للعلاج'}. كافة الحقوق محفوظة.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-primary-600 cursor-pointer transition-colors">اتفاقية الاستخدام</span>
            <span className="hover:text-primary-600 cursor-pointer transition-colors">الدعم الفني</span>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full font-black text-[9px] uppercase tracking-wider">
              <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
              Server Online
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}


