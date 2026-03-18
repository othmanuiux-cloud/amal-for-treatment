import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  Loader2, Search, 
  Building2, MapPin, DollarSign, FileText,
  ChevronRight
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

export const VolunteerCasesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['volunteer-cases', page, statusFilter, priorityFilter, sortBy],
    queryFn: () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);
      params.append('page', String(page));
      return api.get(`/volunteer/cases?${params}`);
    },
  });

  const cases: Case[] = data?.data?.data || [];
  const meta = data?.data?.meta;

  const filteredCases = cases.filter(c => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return c.patient_name.toLowerCase().includes(term) ||
             c.hospital_name.toLowerCase().includes(term) ||
             c.disease.toLowerCase().includes(term);
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sortBy === 'priority') {
      const priorityOrder = { critical: 0, urgent: 1, normal: 2 };
      return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
    }
    return 0;
  });

  const stats = {
    pending: cases.filter(c => c.status === 'pending').length,
    verifying: cases.filter(c => c.status === 'verifying').length,
    verified: cases.filter(c => c.status === 'verified').length,
    total: cases.length,
  };

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
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">
              جميع الحالات
            </h1>
            <p className="text-slate-600 text-sm font-medium mt-1">
              {stats.total} حالة • {stats.pending} بانتظار • {stats.verifying} قيد التحقق
            </p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="بحث بالاسم أو المستشفى..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-9 pl-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:border-primary-500 focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:border-primary-500 focus:outline-none bg-white"
            >
              <option value="all">كل الحالات</option>
              <option value="pending">بانتظار</option>
              <option value="verifying">قيد التحقق</option>
              <option value="verified">تم التحقق</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:border-primary-500 focus:outline-none bg-white"
            >
              <option value="all">كل الأولويات</option>
              <option value="critical">حرجة</option>
              <option value="urgent">عاجلة</option>
              <option value="normal">عادية</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:border-primary-500 focus:outline-none bg-white"
            >
              <option value="newest">الأحدث</option>
              <option value="oldest">الأقدم</option>
              <option value="priority">الأولوية</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-slate-500 mb-3">
          Showing {filteredCases.length} of {stats.total} cases
        </p>

        {/* Cases Grid */}
        {filteredCases.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-100">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-bold text-slate-600">لا توجد حالات</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCases.map((caseItem) => (
              <CaseCard 
                key={caseItem.id} 
                caseItem={caseItem}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold disabled:opacity-50"
            >
              السابق
            </button>
            <span className="px-4 py-2 text-sm font-bold text-slate-600">
              {page} / {meta.last_page}
            </span>
            <button
              onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
              disabled={page === meta.last_page}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Case Card Component
const CaseCard = ({ caseItem }: { caseItem: Case }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="p-4 flex-1">
        {/* Patient Info */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${
            caseItem.priority === 'urgent' || caseItem.priority === 'critical' 
              ? 'bg-red-100 text-red-600' 
              : 'bg-slate-100 text-slate-600'
          }`}>
            {caseItem.patient_name?.charAt(0) || '؟'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-base truncate">
              {caseItem.patient_name}
            </h3>
            <p className="text-sm text-slate-600 line-clamp-2">{caseItem.disease}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
            caseItem.priority === 'critical' ? 'bg-red-100 text-red-700' :
            caseItem.priority === 'urgent' ? 'bg-orange-100 text-orange-700' :
            'bg-slate-100 text-slate-600'
          }`}>
            {caseItem.priority === 'critical' ? '🔴 حرجة' : 
             caseItem.priority === 'urgent' ? '🟠 عاجلة' : 'عادية'}
          </span>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
            caseItem.status === 'pending' ? 'bg-amber-100 text-amber-700' :
            caseItem.status === 'verifying' ? 'bg-blue-100 text-blue-700' :
            caseItem.status === 'verified' ? 'bg-emerald-100 text-emerald-700' :
            'bg-slate-100 text-slate-600'
          }`}>
            {caseItem.status === 'pending' ? 'بانتظار' :
             caseItem.status === 'verifying' ? '🔄 قيد' :
             caseItem.status === 'verified' ? '✅ تم' : caseItem.status}
          </span>
        </div>

        {/* Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="truncate">{caseItem.hospital_name}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>{caseItem.hospital_country} - {caseItem.city}</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-primary-600">
            <DollarSign className="w-4 h-4" />
            <span>{caseItem.currency} {caseItem.estimated_cost?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 border-t border-slate-100 bg-slate-50">
        <button
          onClick={() => navigate(`/volunteer/cases/${caseItem.id}`)}
          className="w-full bg-white border border-slate-200 text-slate-700 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
        >
          عرض التفاصيل
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default VolunteerCasesList;
