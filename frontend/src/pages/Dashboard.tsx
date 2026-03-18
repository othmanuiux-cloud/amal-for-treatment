import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../auth';

export default function Dashboard() {
  const { user } = useAuthStore();
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'volunteer':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">لوحة تحكم المتطوع</h2>
            <Link to="/volunteer/cases" className="btn btn-primary">عرض الحالات للتحقق</Link>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">مرحباً {user?.name}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Link to="/dashboard/cases/submit" className="card card-hover">
                <div className="text-xl font-semibold mb-2">تقديم حالة جديدة</div>
                <p className="text-gray-600">قدم طلب علاج جديد</p>
              </Link>
              <Link to="/dashboard/cases/my" className="card card-hover">
                <div className="text-xl font-semibold mb-2">حالاتي</div>
                <p className="text-gray-600">تتبع حالاتك المقدمة</p>
              </Link>
            </div>
          </div>
        );
    }
  };

  return <div className="max-w-7xl mx-auto px-4 py-8">{getDashboardContent()}</div>;
}
