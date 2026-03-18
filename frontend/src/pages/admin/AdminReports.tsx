'use client';

import { useState, useRef } from 'react';
import {
  Download,
  Calendar,
  Filter,
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Users,
  FileText,
  HeartHandshake,
  Clock,
  CheckCircle,
  XCircle,
  Printer,
  Grid3x3,
  RefreshCw,
  Search,
  Eye,
  Edit,
  Trash2,
  Globe
} from 'lucide-react';
import {
  BarChart,
  PieChart,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  Pie,
  Cell,
  Area
} from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

// أنواع البيانات
interface TrendData {
  month: string;
  cases: number;
  volunteers: number;
  donations: number;
}

interface StatusData {
  name: string;
  value: number;
  color: string;
}

interface RoleData {
  role: string;
  count: number;
}

interface MonthlyData {
  month: string;
  cases: number;
  resolved: number;
}

interface CountryData {
  country: string;
  count: number;
  flag: string;
}

interface ReportItem {
  id: number;
  type: string;
  date: string;
  status: string;
  views: number;
}

export default function AdminReports() {
  const [dateRange, setDateRange] = useState('month');
  const [customDate, setCustomDate] = useState({ start: '', end: '' });
  const [isExporting, setIsExporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCharts, setSelectedCharts] = useState<string[]>(['trend', 'status', 'roles', 'countries']);

  const componentRef = useRef<HTMLDivElement>(null);

  const { data: statsDataResponse, isLoading, isError } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await adminApi.getStatistics();
      return response.data.statistics;
    }
  });

  const [detailedReports, setDetailedReports] = useState<ReportItem[]>([]);
  const [viewReportModal, setViewReportModal] = useState<ReportItem | null>(null);
  const [editReportModal, setEditReportModal] = useState<ReportItem | null>(null);
  const [deleteReportModal, setDeleteReportModal] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">جاري جلب الإحصائيات...</p>
        </div>
      </div>
    );
  }

  if (isError || !statsDataResponse) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">عذراً، حدث خطأ ما</h3>
          <p className="text-slate-500">لم نتمكن من جلب بيانات التقارير، يرجى المحاولة مرة أخرى لاحقاً.</p>
        </div>
      </div>
    );
  }

  // استخدام البيانات الفعلية من الـ API بدلاً من التجريبية
  const statsData = {
    totalUsers: statsDataResponse.total_users || 0,
    pendingCases: statsDataResponse.pending_cases || 0,
    approvedCases: statsDataResponse.approved_cases || 0,
    totalCases: statsDataResponse.total_cases || 0,
    activeVolunteers: statsDataResponse.volunteers?.active_count || 0,
    monthlyDonations: 0, // Not available in current API schema yet
  };

  const trendData: TrendData[] = statsDataResponse.monthly_trends || [];

  // Mapping Backend states colors: pending (amber), verifying (blue), verified (indigo), approved (emerald), rejected (rose)
  const casesByStatus: StatusData[] = (statsDataResponse.by_status || []).map((s: any) => {
    let color = '#3b82f6';
    if (s.color === 'bg-amber-400') color = '#fbbf24';
    if (s.color === 'bg-blue-400') color = '#60a5fa';
    if (s.color === 'bg-indigo-500') color = '#6366f1';
    if (s.color === 'bg-emerald-500') color = '#10b981';
    if (s.color === 'bg-rose-500') color = '#f43f5e';

    return {
      name: s.label,
      value: s.count,
      color: color,
    };
  });

  const totalCasesPie = casesByStatus.reduce((sum, item) => sum + item.value, 0);
  const casesByStatusWithPercent = casesByStatus.map(item => ({
    ...item,
    nameWithPercent: `${item.name} (${totalCasesPie > 0 ? ((item.value / totalCasesPie) * 100).toFixed(0) : 0}%)`
  }));

  const usersByRole: RoleData[] = [
    { role: 'المرضى', count: statsDataResponse.total_patients || 0 },
    { role: 'المتطوعون', count: statsDataResponse.total_volunteers || 0 },
    { role: 'المسؤولون', count: statsDataResponse.total_admins || 0 },
  ];

  const monthlyStats: MonthlyData[] = (statsDataResponse.monthly_trends || []).map((item: any) => ({
    month: item.month,
    cases: item.cases,
    resolved: Math.floor(item.cases * 0.8) // Placeholder calculation for now
  }));

  // Handle potential cases by country mapped structure: { "اليمن": 145, "السعودية": 68 }
  const casesByCountry: CountryData[] = Object.entries(statsDataResponse.cases_by_country || {}).map(([country, count]) => {
    // Generate static dummy flag mapping since flag is not stored in DB
    const countryFlags: Record<string, string> = {
      'اليمن': '🇾🇪',
      'السعودية': '🇸🇦',
      'الإمارات': '🇦🇪',
      'الأردن': '🇯🇴',
      'مصر': '🇪🇬',
      'السودان': '🇸🇩',
      'الصومال': '🇸🇴',
      'فلسطين': '🇵🇸',
      'عمان': '🇴🇲',
      'الكويت': '🇰🇼'
    };

    return {
      country,
      count: Number(count),
      flag: countryFlags[country] || '🌐'
    };
  }).sort((a, b) => b.count - a.count);

  const handleDeleteReport = (id: number) => {
    setDetailedReports(prev => prev.filter(r => r.id !== id));
    setDeleteReportModal(null);
  };

  const handleUpdateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (editReportModal) {
      setDetailedReports(prev => prev.map(r => r.id === editReportModal.id ? editReportModal : r));
      setEditReportModal(null);
    }
  };

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');

      doc.setFont('amiri', 'bold');
      doc.setFontSize(18);
      doc.text('تقرير منصة أمل للعلاج', 105, 20, { align: 'center' });

      doc.setFontSize(12);
      doc.text(`تاريخ التقرير: ${format(new Date(), 'dd MMMM yyyy', { locale: arSA })}`, 105, 30, { align: 'center' });

      doc.setFontSize(14);
      doc.text('الإحصائيات العامة', 20, 50);

      const statsTable = [
        ['إجمالي المستخدمين', statsData.totalUsers.toString()],
        ['إجمالي الحالات', statsData.totalCases.toString()],
        ['الحالات المعتمدة', statsData.approvedCases.toString()],
        ['قيد الانتظار', statsData.pendingCases.toString()],
        ['المتطوعون النشطون', statsData.activeVolunteers.toString()],
        ['التبرعات الشهرية', `$${statsData.monthlyDonations.toLocaleString()}`],
      ];

      (doc as any).autoTable({
        startY: 60,
        head: [['المؤشر', 'القيمة']],
        body: statsTable,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] },
        styles: { font: 'amiri', fontSize: 12 },
      });

      doc.save(`amal-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    } catch (error) {
      console.error('PDF Export Error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      const statsDataExcel = [
        ['المؤشر', 'القيمة'],
        ['إجمالي المستخدمين', statsData.totalUsers],
        ['إجمالي الحالات', statsData.totalCases],
        ['الحالات المعتمدة', statsData.approvedCases],
        ['قيد الانتظار', statsData.pendingCases],
        ['المتطوعون النشطون', statsData.activeVolunteers],
        ['التبرعات الشهرية', statsData.monthlyDonations],
      ];

      const wsStats = XLSX.utils.aoa_to_sheet(statsDataExcel);
      XLSX.utils.book_append_sheet(wb, wsStats, 'الإحصائيات');

      const casesDataExcel: (string | number)[][] = [['الحالة', 'العدد', 'النسبة']];
      casesByStatus.forEach(item => {
        casesDataExcel.push([item.name, item.value, `${((item.value / statsData.totalCases) * 100).toFixed(1)}%`]);
      });

      const wsCases = XLSX.utils.aoa_to_sheet(casesDataExcel);
      XLSX.utils.book_append_sheet(wb, wsCases, 'الحالات');

      XLSX.writeFile(wb, `amal-report-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    } catch (error) {
      console.error('Excel Export Error:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleChart = (chartId: string) => {
    setSelectedCharts(prev =>
      prev.includes(chartId)
        ? prev.filter(id => id !== chartId)
        : [...prev, chartId]
    );
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-50/50 p-4 lg:p-8" ref={componentRef}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">التقارير والإحصائيات</h1>
            <p className="text-slate-500 mt-1">تحليل شامل لبيانات المنصة والأداء</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => handleDateRangeChange(e.target.value)}
                className="appearance-none px-4 py-2 pr-10 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="today">اليوم</option>
                <option value="week">هذا الأسبوع</option>
                <option value="month">هذا الشهر</option>
                <option value="year">هذه السنة</option>
                <option value="custom">مخصص</option>
              </select>
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showFilters
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
            >
              <Filter className="w-4 h-4" />
              فلاتر
            </button>

            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors">
                <Download className="w-4 h-4" />
                تصدير
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-t-lg border-b border-slate-100"
                >
                  <FileText className="w-4 h-4 text-red-600" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={handleExportExcel}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 border-b border-slate-100"
                >
                  <Grid3x3 className="w-4 h-4 text-emerald-600" />
                  <span>Excel</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-b-lg"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>طباعة</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 print:hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">فلاتر متقدمة</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">من تاريخ</label>
                <input
                  type="date"
                  value={customDate.start}
                  onChange={(e) => setCustomDate(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">إلى تاريخ</label>
                <input
                  type="date"
                  value={customDate.end}
                  onChange={(e) => setCustomDate(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex items-end">
                <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                  <RefreshCw className="w-4 h-4" />
                  تطبيق الفلتر
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-3">إظهار الرسوم البيانية</label>
              <div className="flex flex-wrap gap-3">
                {['trend', 'status', 'roles', 'countries', 'monthly'].map((chart) => (
                  <label key={chart} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCharts.includes(chart)}
                      onChange={() => toggleChart(chart)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">
                      {chart === 'trend' && 'الاتجاه العام'}
                      {chart === 'status' && 'الحالات حسب الحالة'}
                      {chart === 'roles' && 'المستخدمون حسب الدور'}
                      {chart === 'countries' && 'الحالات حسب الدولة'}
                      {chart === 'monthly' && 'الإحصائيات الشهرية'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCardWidget
            title="إجمالي المستخدمين"
            value={statsData.totalUsers.toString()}
            trend={12.5}
            icon={<Users className="w-6 h-6" />}
            color="blue"
          />
          <StatCardWidget
            title="قيد الانتظار"
            value={statsData.pendingCases.toString()}
            trend={-5.2}
            icon={<Clock className="w-6 h-6" />}
            color="amber"
          />
          <StatCardWidget
            title="حالات معتمدة"
            value={statsData.approvedCases.toString()}
            trend={8.3}
            icon={<CheckCircle className="w-6 h-6" />}
            color="emerald"
          />
          <StatCardWidget
            title="إجمالي الحالات"
            value={statsData.totalCases.toString()}
            trend={15.7}
            icon={<HeartHandshake className="w-6 h-6" />}
            color="purple"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {selectedCharts.includes('trend') && (
            <ChartCard
              title="الاتجاه العام"
              description="نمو الحالات والمتطوعين والتبرعات"
              icon={<TrendingUp className="w-5 h-5" />}
              className="lg:col-span-2"
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorVolunteers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis orientation="right" stroke="#64748b" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      direction: 'rtl',
                      fontFamily: 'inherit'
                    }}
                  />
                  <Legend wrapperStyle={{ fontFamily: 'inherit', fontSize: '12px', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="cases"
                    stroke="#2563eb"
                    fill="url(#colorCases)"
                    strokeWidth={3}
                    name="الحالات"
                  />
                  <Area
                    type="monotone"
                    dataKey="volunteers"
                    stroke="#10b981"
                    fill="url(#colorVolunteers)"
                    strokeWidth={3}
                    name="المتطوعون"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {selectedCharts.includes('status') && (
            <ChartCard
              title="الحالات حسب الحالة"
              description="توزيع الحالات"
              icon={<PieIcon className="w-5 h-5" />}
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={casesByStatusWithPercent}
                    cx="40%"
                    cy="50%"
                    labelLine={false}
                    label={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="nameWithPercent"
                  >
                    {casesByStatusWithPercent.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      direction: 'rtl',
                      fontFamily: 'inherit'
                    }}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{ fontFamily: 'inherit', fontSize: '13px', lineHeight: '24px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {selectedCharts.includes('roles') && (
            <ChartCard
              title="المستخدمون حسب الدور"
              description="توزيع الأدوار"
              icon={<BarChart3 className="w-5 h-5" />}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usersByRole} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="role" stroke="#64748b" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis orientation="right" stroke="#64748b" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      direction: 'rtl'
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                    name="العدد"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {selectedCharts.includes('countries') && (
            <ChartCard
              title="الحالات حسب الدولة"
              description="التوزيع الجغرافي للحالات"
              icon={<Globe className="w-5 h-5" />}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={casesByCountry}
                  layout="vertical"
                  margin={{ top: 5, right: 80, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="country"
                    stroke="#64748b"
                    width={80}
                    orientation="right"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      direction: 'rtl'
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#3b82f6"
                    radius={[0, 8, 8, 0]}
                    name="عدد الحالات"
                  >
                    {casesByCountry.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {selectedCharts.includes('monthly') && (
            <ChartCard
              title="الإحصائيات الشهرية"
              description="الحالات الجديدة مقابل المكتملة"
              icon={<BarChart3 className="w-5 h-5" />}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyStats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis orientation="right" stroke="#64748b" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      direction: 'rtl',
                      fontFamily: 'inherit'
                    }}
                  />
                  <Legend wrapperStyle={{ fontFamily: 'inherit', fontSize: '12px', paddingTop: '10px' }} />
                  <Bar
                    dataKey="cases"
                    fill="#2563eb"
                    radius={[8, 8, 0, 0]}
                    name="حالات جديدة"
                  />
                  <Bar
                    dataKey="resolved"
                    fill="#10b981"
                    radius={[8, 8, 0, 0]}
                    name="تم الحل"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </div>

        {/* Detailed Reports Table */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">التقارير المحفوظة</h3>
              <p className="text-sm text-slate-500 mt-1">سجل التقارير المصدرة سابقاً</p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="بحث في التقارير..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 pl-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">نوع التقرير</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">التاريخ</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">الحالة</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">عدد المشاهدات</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {detailedReports
                  .filter(report => report.type.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-slate-900">{report.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(report.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={report.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{report.views}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setViewReportModal(report)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="عرض التقرير">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditReportModal(report)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="تعديل التقرير">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteReportModal(report.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="حذف التقرير">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* View Modal */}
      {viewReportModal && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setViewReportModal(null)}></div>
          <div className="bg-white rounded-[40px] p-10 w-full max-w-xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative">
            <h3 className="text-2xl font-black text-slate-900 mb-6">تفاصيل التقرير</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-500 font-bold">المعرف</span>
                <span className="text-slate-900 font-black">#{viewReportModal.id}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-500 font-bold">النوع</span>
                <span className="text-slate-900 font-black">{viewReportModal.type}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-500 font-bold">التاريخ</span>
                <span className="text-slate-900 font-black">{viewReportModal.date}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-500 font-bold">المشاهدات</span>
                <span className="text-slate-900 font-black">{viewReportModal.views} مشاهدة</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-500 font-bold">الحالة</span>
                <StatusBadge status={viewReportModal.status} />
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setViewReportModal(null)} className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black hover:bg-slate-200 transition-all">
                إغلاق
              </button>
              <button
                onClick={() => { setEditReportModal(viewReportModal); setViewReportModal(null); }}
                className="flex-1 py-4 bg-amber-500 text-white rounded-2xl font-black shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all"
              >
                تعديل التقرير
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editReportModal && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setEditReportModal(null)}></div>
          <div className="bg-white rounded-[40px] p-10 w-full max-w-xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative">
            <h3 className="text-2xl font-black text-slate-900 mb-6">تعديل التقرير #{editReportModal.id}</h3>
            <form onSubmit={handleUpdateReport} className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-2">نوع التقرير</label>
                <input
                  type="text"
                  value={editReportModal.type}
                  onChange={(e) => setEditReportModal({ ...editReportModal, type: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-black text-slate-900 focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-2">الحالة</label>
                <select
                  value={editReportModal.status}
                  onChange={(e) => setEditReportModal({ ...editReportModal, status: e.target.value as any })}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-black text-slate-900 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="approved">معتمد</option>
                  <option value="pending">قيد الانتظار</option>
                  <option value="rejected">مرفوض</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setEditReportModal(null)} className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black hover:bg-slate-200 transition-all">
                  إلغاء
                </button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteReportModal && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setDeleteReportModal(null)}></div>
          <div className="bg-white rounded-[56px] p-12 w-full max-w-lg shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-100 relative">
            <div className="w-24 h-24 bg-rose-50 rounded-[40px] flex items-center justify-center mb-10 mx-auto shadow-inner">
              <Trash2 className="w-12 h-12 text-rose-500" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 text-center mb-4 tracking-tight">هل ترغب بالحذف فعلاً؟</h3>
            <p className="text-slate-500 font-bold text-center mb-12 leading-relaxed text-lg">
              سيتم إزالة هذا التقرير نهائياً من النظام. هذا الإجراء <span className="text-rose-600 underline underline-offset-4">غير قابل للتراجع</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <button
                onClick={() => setDeleteReportModal(null)}
                className="flex-1 py-5 bg-slate-50 text-slate-500 rounded-3xl font-black hover:bg-slate-100 transition-all active:scale-95"
              >
                تراجع، اتركها
              </button>
              <button
                onClick={() => handleDeleteReport(deleteReportModal)}
                className="flex-1 py-5 bg-rose-600 text-white rounded-3xl font-black shadow-xl shadow-rose-900/20 hover:bg-rose-700 transition-all active:scale-95"
              >
                نعم، احذف التقرير
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCardWidget({ title, value, trend, icon, color }: {
  title: string;
  value: string;
  trend: number;
  icon: React.ReactNode;
  color: 'blue' | 'amber' | 'emerald' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${trend > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
          }`}>
          {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>
      <p className="text-sm text-slate-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
    </div>
  );
}

// Chart Card Component
function ChartCard({ title, description, icon, children, className = '' }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
        <div className="text-slate-400">{icon}</div>
      </div>
      {children}
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    approved: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
    pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
    rejected: 'bg-red-50 text-red-700 ring-1 ring-red-600/20',
  };

  const labels: Record<string, string> = {
    approved: 'معتمد',
    pending: 'قيد الانتظار',
    rejected: 'مرفوض',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
      {labels[status] || status}
    </span>
  );
}