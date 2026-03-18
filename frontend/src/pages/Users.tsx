import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api';

export default function Users() {
  const { data, isLoading } = useQuery({ queryKey: ['users'], queryFn: () => adminApi.getUsers() });

  const roleLabels: Record<string, string> = { admin: 'مدير', volunteer: 'متطوع', patient: 'مريض' };
  const roleColors: Record<string, string> = { admin: 'bg-purple-100 text-purple-800', volunteer: 'bg-blue-100 text-blue-800', patient: 'bg-green-100 text-green-800' };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">إدارة المستخدمين</h1>
      {isLoading ? <div className="text-center py-8">جاري التحميل...</div> : data?.data?.data?.length ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr><th className="px-6 py-3 text-right text-sm font-medium text-gray-500">الاسم</th><th className="px-6 py-3 text-right text-sm font-medium text-gray-500">البريد</th><th className="px-6 py-3 text-right text-sm font-medium text-gray-500">الدور</th><th className="px-6 py-3 text-right text-sm font-medium text-gray-500">الدولة</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.data.data.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs ${roleColors[user.role]}`}>{roleLabels[user.role]}</span></td>
                  <td className="px-6 py-4">{user.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <div className="text-center py-12 text-gray-500">لا توجد مستخدمين</div>}
    </div>
  );
}
