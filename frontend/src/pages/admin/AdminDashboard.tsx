'use client';

import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api';
import { 
  Plus, 
  Clock,
  FileText,
  ChevronLeft
} from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';

export default function AdminDashboard() {
  const { 
    data: statsDataResponse, 
    isLoading: statsLoading
  } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await adminApi.getStatistics();
      return response.data.statistics;
    }
  });

  const { 
    data: recentCasesResponse, 
    isLoading: casesLoading 
  } = useQuery({
    queryKey: ['admin-recent-cases'],
    queryFn: async () => {
      const response = await adminApi.getCasesForApproval({ page: 1 });
      return response.data;
    }
  });

  const loading = statsLoading || casesLoading;
  const recentCases = recentCasesResponse?.data || [];

  const stats = {
    total_cases: statsDataResponse?.total_cases || 0,
    active_volunteers: statsDataResponse?.volunteers?.active_count || 0,
    pending_cases: statsDataResponse?.pending_cases || 0,
    monthly_donations: 0, // Not available in current API schema yet
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-50/50">
      <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6 lg:space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-slate-900">مرحباً بك، أيها المسؤول 👋</h1>
            <p className="text-sm text-slate-500 mt-1">إليك نظرة سريعة على ما يحدث اليوم.</p>
          </div>
          <Link to="/admin/cases" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 lg:px-5 py-2.5 rounded-lg text-sm font-medium transition-all">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">إضافة حالة</span>
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard
            title="إجمالي الحالات"
            value={loading ? '...' : stats.total_cases.toLocaleString('en-US')}
            trend="+12.5%"
            isPositive={true}
            data={[{v: 10}, {v: 15}, {v: 12}, {v: 18}, {v: 25}, {v: 22}, {v: 30}]}
            color="#2563eb"
            icon={<FileText className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: '#2563eb' }} />}
          />
          
          <StatCard
            title="المتطوعون النشطون"
            value={loading ? '...' : stats.active_volunteers.toLocaleString('en-US')}
            trend="+5.2%"
            isPositive={true}
            data={[{v: 20}, {v: 22}, {v: 21}, {v: 24}, {v: 28}, {v: 26}, {v: 30}]}
            color="#059669"
            icon={<FileText className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: '#059669' }} />}
          />
          
          <StatCard
            title="قيد الانتظار"
            value={loading ? '...' : stats.pending_cases.toLocaleString('en-US')}
            trend="-14.1%"
            isPositive={true}
            data={[{v: 30}, {v: 28}, {v: 25}, {v: 22}, {v: 18}, {v: 15}, {v: 12}]}
            color="#d97706"
            icon={<Clock className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: '#d97706' }} />}
          />
          
          <StatCard
            title="التبرعات الشهرية"
            value={loading ? '...' : `$${stats.monthly_donations.toLocaleString('en-US')}`}
            trend="+28.4%"
            isPositive={true}
            data={[{v: 10}, {v: 20}, {v: 15}, {v: 25}, {v: 30}, {v: 45}, {v: 50}]}
            color="#7c3aed"
            icon={<FileText className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: '#7c3aed' }} />}
          />
        </div>

        {/* Recent Cases */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="px-4 lg:px-6 py-4 lg:py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base lg:text-lg font-semibold text-slate-900">الحالات الطبية الأخيرة</h2>
              <p className="text-xs lg:text-sm text-slate-500 mt-1 hidden sm:block">أحدث التحديثات والحالات الجديدة.</p>
            </div>
            <Link to="/admin/cases" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
              عرض الكل
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-slate-500">جاري التحميل...</div>
          ) : (
            <>
              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-slate-100">
                {recentCases.length > 0 ? recentCases.map((caseItem: any) => (
                  <div key={caseItem.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600">#{caseItem.id}</span>
                      <StatusBadge status={caseItem.status} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900">{caseItem.patient_name}</span>
                      <span className="text-xs text-slate-500">{caseItem.department || 'عام'}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(caseItem.created_at).toLocaleDateString('ar-YE', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-slate-500">لا توجد حالات حديثة</div>
                )}
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">رقم الحالة</th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">المريض</th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">القسم</th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">التاريخ</th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentCases.length > 0 ? recentCases.map((caseItem: any) => (
                      <tr key={caseItem.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">#{caseItem.id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{caseItem.patient_name}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{caseItem.department || 'عام'}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Intl.DateTimeFormat('ar-YE', { month: 'short', day: 'numeric' }).format(new Date(caseItem.created_at))}
                        </td>
                        <td className="px-6 py-4">
                          <Link to={`/admin/cases/${caseItem.id}`} className="inline-flex">
                            <StatusBadge status={caseItem.status} />
                          </Link>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-sm">لا توجد حالات حديثة</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
