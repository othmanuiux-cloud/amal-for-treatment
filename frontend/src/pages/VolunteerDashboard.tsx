import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuthStore } from '../auth';
import { 
  Clock, CheckCircle, Loader2, FileText,
  TrendingUp, ArrowRight, ChevronRight
} from 'lucide-react';

interface Case {
  id: number;
  patient_name: string;
  disease: string;
  age: number;
  hospital_name: string;
  hospital_country: string;
  city: string;
  estimated_cost: number;
  currency: string;
  priority: 'normal' | 'urgent' | 'critical';
  status: string;
  documents_count: number;
  created_at: string;
  description?: string;
}

export const VolunteerDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['volunteer-cases'],
    queryFn: () => api.get('/volunteer/cases'),
  });

  const cases: Case[] = data?.data?.data || [];

  const stats = {
    pending: cases.filter(c => c.status === 'pending').length,
    verifying: cases.filter(c => c.status === 'verifying').length,
    verified: cases.filter(c => c.status === 'verified').length,
    total: cases.length,
  };

  const recentCases = cases.slice(0, 6);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
            مرحباً {user?.name} 👋
          </h1>
          <p className="text-slate-600 font-medium">
            هذا ملخص حالاتك في مركز التحقق الطبي
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-5 border border-amber-200">
            <Clock className="w-8 h-8 text-amber-600 mb-3" />
            <p className="text-3xl font-black text-amber-700">{stats.pending}</p>
            <p className="text-sm font-bold text-amber-600">بانتظار المراجعة</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-200">
            <Loader2 className="w-8 h-8 text-blue-600 mb-3" />
            <p className="text-3xl font-black text-blue-700">{stats.verifying}</p>
            <p className="text-sm font-bold text-blue-600">قيد التحقق</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-5 border border-emerald-200">
            <CheckCircle className="w-8 h-8 text-emerald-600 mb-3" />
            <p className="text-3xl font-black text-emerald-700">{stats.verified}</p>
            <p className="text-sm font-bold text-emerald-600">تم التحقق</p>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-5 border border-primary-200">
            <TrendingUp className="w-8 h-8 text-primary-600 mb-3" />
            <p className="text-3xl font-black text-primary-700">{stats.total}</p>
            <p className="text-sm font-bold text-primary-600">الإجمالي</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            to="/volunteer/cases"
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-primary-300 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-lg mb-1">تصفح جميع الحالات</h3>
                <p className="text-slate-600 text-sm">عرض و إدارة الحالات المخصصة لك</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                <ArrowRight className="w-6 h-6 text-primary-600 group-hover:text-white" />
              </div>
            </div>
          </Link>
          
          <Link
            to="/dashboard/notifications"
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-amber-300 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-lg mb-1">الإشعارات</h3>
                <p className="text-slate-600 text-sm">استعرض الإشعارات الجديدة</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <FileText className="w-6 h-6 text-amber-600 group-hover:text-white" />
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Cases */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-black text-slate-900 text-lg">الحالات الأخيرة</h2>
            <Link to="/volunteer/cases" className="text-primary-600 font-bold text-sm hover:underline flex items-center gap-1">
              عرض الكل <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentCases.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-bold text-slate-600">لا توجد حالات بعد</p>
              <p className="text-sm text-slate-400">ستظهر الحالات الجديدة هنا تلقائياً</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentCases.map((caseItem) => (
                <div 
                  key={caseItem.id}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/volunteer/cases/${caseItem.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${
                        caseItem.priority === 'urgent' || caseItem.priority === 'critical' 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {caseItem.patient_name?.charAt(0) || '؟'}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{caseItem.patient_name}</h3>
                        <p className="text-sm text-slate-500">{caseItem.disease}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-left hidden sm:block">
                        <p className="text-sm font-bold text-slate-700">{caseItem.hospital_name}</p>
                        <p className="text-xs text-slate-400">{caseItem.city}</p>
                      </div>
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                        caseItem.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        caseItem.status === 'verifying' ? 'bg-blue-100 text-blue-700' :
                        caseItem.status === 'verified' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {caseItem.status === 'pending' ? 'بانتظار' :
                         caseItem.status === 'verifying' ? 'قيد التحقق' :
                         caseItem.status === 'verified' ? 'تم' : caseItem.status}
                      </span>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
