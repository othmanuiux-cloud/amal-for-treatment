import { useQuery } from '@tanstack/react-query';
import { volunteerApi } from '../api';

import CaseCard from '../components/cases/CaseCard';

export default function VolunteerCases() {
  const { data, isLoading } = useQuery({ queryKey: ['volunteer-cases'], queryFn: () => volunteerApi.getCases() });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">الحالات للتحقق</h1>
      {isLoading ? (
        <div className="text-center py-8">جاري التحميل...</div>
      ) : data?.data?.data?.length ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.data.data.map((caseItem: any) => <CaseCard key={caseItem.id} caseData={caseItem} />)}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">لا توجد حالات للتحقق</div>
      )}
    </div>
  );
}
