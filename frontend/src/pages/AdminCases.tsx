import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminApi } from '../api';

import CaseCard from '../components/cases/CaseCard';

export default function AdminCases() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-cases'], queryFn: () => adminApi.getCasesForApproval() });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">إدارة الحالات</h1>
        <Link to="/admin/users" className="btn btn-secondary">إدارة المستخدمين</Link>
      </div>
      {isLoading ? <div className="text-center py-8">جاري التحميل...</div> : data?.data?.data?.length ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{data.data.data.map((caseItem: any) => <CaseCard key={caseItem.id} caseData={caseItem} />)}</div>
      ) : <div className="text-center py-12 text-gray-500">لا توجد حالات بانتظار الاعتماد</div>}
    </div>
  );
}
