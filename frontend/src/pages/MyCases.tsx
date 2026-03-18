import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { casesApi } from '../api';
import { useAuthStore } from '../auth';
import { FileText, Clock, Activity, CheckCircle, TrendingUp, Building2, MapPin, Banknote } from 'lucide-react';

const STATUS_STEPS = [
  { key: 'pending', label: 'بانتظار المراجعة', icon: Clock },
  { key: 'verifying', label: 'قيد التحقق', icon: Activity },
  { key: 'verified', label: 'تم التحقق', icon: CheckCircle },
  { key: 'approved', label: 'مقبول', icon: TrendingUp },
];

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  const colors: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-600',
    amber: 'bg-amber-100 text-amber-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-emerald-100 text-emerald-600',
    cyan: 'bg-cyan-100 text-cyan-600',
  };
  return (
    <div className={`${colors[color]} rounded-3xl p-6 flex items-center gap-4`}>
      <div className="w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-bold opacity-70">{label}</p>
        <p className="text-2xl font-black">{value}</p>
      </div>
    </div>
  );
}

function TimelineStep({ completed, label }: { completed: boolean; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
        completed ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
      }`}>
        {completed ? <CheckCircle className="w-4 h-4" /> : '•'}
      </div>
      <span className={`text-[10px] font-medium ${completed ? 'text-slate-700' : 'text-slate-400'}`}>
        {label}
      </span>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, highlight }: { icon: any; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`p-3 rounded-xl ${highlight ? 'bg-primary-50' : 'bg-slate-50'}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-3.5 h-3.5 ${highlight ? 'text-primary-600' : 'text-slate-400'}`} />
        <span className="text-[10px] font-medium text-slate-500">{label}</span>
      </div>
      <p className={`text-sm font-bold ${highlight ? 'text-primary-700' : 'text-slate-800'}`}>{value}</p>
    </div>
  );
}

function EnhancedCaseCard({ caseData }: { caseData: any }) {
  const currentIndex = STATUS_STEPS.findIndex(s => s.key === caseData.status);
  const progress = currentIndex >= 0 ? ((currentIndex + 1) / STATUS_STEPS.length) * 100 : 20;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
      case 'verifying': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
      case 'verified': return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
      case 'rejected': return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
      default: return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'مقبول';
      case 'verifying': return 'قيد التحقق';
      case 'verified': return 'تم التحقق';
      case 'rejected': return 'مرفوض';
      default: return 'بانتظار';
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });

  const status = getStatusStyle(caseData.status);
  const statusText = getStatusText(caseData.status);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-shadow">
      {/* Card Header */}
      <div className="bg-gradient-to-l from-slate-50 to-white p-5 border-b border-slate-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-1">
              {caseData.patient_name}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>ملف #{caseData.file_number}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>{formatDate(caseData.created_at)}</span>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-full ${status.bg} ${status.text} font-bold text-xs border ${status.border}`}>
            {statusText}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-600">حالة التقدم</span>
            <span className="font-bold text-slate-800">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${caseData.status === 'approved' ? 'bg-emerald-500' : caseData.status === 'verifying' ? 'bg-blue-500' : caseData.status === 'verified' ? 'bg-indigo-500' : 'bg-amber-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-1">
          <TimelineStep completed={progress >= 20} label="التقديم" />
          <div className="flex-1 h-0.5 bg-slate-200" />
          <TimelineStep completed={progress >= 40} label="التحقق" />
          <div className="flex-1 h-0.5 bg-slate-200" />
          <TimelineStep completed={progress >= 60} label="القبول" />
          <div className="flex-1 h-0.5 bg-slate-200" />
          <TimelineStep completed={progress >= 80} label="النشر" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <InfoItem icon={Building2} label="المستشفى" value={caseData.hospital_name || '-'} />
          <InfoItem icon={MapPin} label="المدينة" value={caseData.city || caseData.hospital_country || '-'} />
          <InfoItem icon={Banknote} label="التكلفة" value={caseData.estimated_cost ? `${caseData.estimated_cost.toLocaleString()} ${caseData.currency || '$'}` : '-'} highlight />
          <InfoItem icon={Activity} label="الأولوية" value={caseData.priority || 'عادية'} />
        </div>

        {caseData.description && (
          <div className="p-3 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-600 line-clamp-2">{caseData.description}</p>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <Link
          to={`/cases/${caseData.id}`}
          className="flex-1 bg-primary-600 text-white text-center py-2.5 rounded-xl font-bold text-sm hover:bg-primary-700 transition-colors block"
        >
          عرض التفاصيل
        </Link>
      </div>
    </div>
  );
}

export default function MyCases() {
  const { user } = useAuthStore();
  const { data, isLoading } = useQuery({ queryKey: ['my-cases'], queryFn: () => casesApi.getAll() });

  const cases = data?.data?.data || [];
  const stats = {
    total: cases.length,
    pending: cases.filter((c: any) => c.status === 'pending').length,
    under_review: cases.filter((c: any) => c.status === 'verifying').length,
    approved: cases.filter((c: any) => c.status === 'approved').length,
    published: cases.filter((c: any) => c.is_published).length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">حالاتي</h1>
        {user?.role === 'patient' && (
          <Link to="/dashboard/cases/submit" className="px-6 py-3 bg-primary-600 text-white rounded-2xl font-black hover:bg-primary-500 transition-colors">
            تقديم حالة جديدة
          </Link>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard label="الإجمالي" value={stats.total} icon={FileText} color="slate" />
        <StatCard label="بانتظار" value={stats.pending} icon={Clock} color="amber" />
        <StatCard label="قيد التحقق" value={stats.under_review} icon={Activity} color="blue" />
        <StatCard label="مقبول" value={stats.approved} icon={CheckCircle} color="green" />
        <StatCard label="منشور" value={stats.published} icon={TrendingUp} color="cyan" />
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse"></div>)}
        </div>
      ) : cases.length ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((caseItem: any) => (
            <EnhancedCaseCard key={caseItem.id} caseData={caseItem} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 bg-white rounded-3xl shadow-lg">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-bold">لا توجد حالات</p>
          <Link to="/dashboard/cases/submit" className="text-primary-600 font-bold hover:underline mt-2 inline-block">
            قدم أول حالة الآن
          </Link>
        </div>
      )}
    </div>
  );
}
