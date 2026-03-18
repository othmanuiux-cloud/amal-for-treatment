import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './auth';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SubmitCase from './pages/SubmitCase';
import MyCases from './pages/MyCases';
import CaseDetails from './pages/CaseDetails';
import Dashboard from './pages/Dashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import VolunteerCasesList from './pages/VolunteerCasesList';
import VolunteerCaseReview from './pages/VolunteerCaseReview';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCases from './pages/admin/AdminCases';
import AdminCaseDetails from './pages/admin/AdminCaseDetails';
import AdminUsers from './pages/admin/AdminUsers';
import AdminVolunteers from './pages/admin/AdminVolunteers';
import AdminUserDetails from './pages/admin/AdminUserDetails';
import CreateCase from './pages/admin/CreateCase';
import CreateUser from './pages/admin/CreateUser';
import AdminActivity from './pages/admin/AdminActivity';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';
import PublishedCases from './pages/PublishedCases';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import ForgotPassword from './pages/auth/ForgotPassword';
import Notifications from './pages/Notifications';
import ResetPassword from './pages/auth/ResetPassword';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="cases/published" element={<PublishedCases />} />
          <Route path="cases/:id" element={<CaseDetails />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />

          {/* Legacy Redirects */}
          <Route path="cases/submit" element={<Navigate to="/dashboard/cases/submit" replace />} />
          <Route path="cases/my" element={<Navigate to="/dashboard/cases/my" replace />} />
        </Route>

        {/* Protected User Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="cases/submit" element={<SubmitCase />} />
          <Route path="cases/my" element={<MyCases />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Volunteer Routes */}
        <Route path="/volunteer" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<VolunteerDashboard />} />
          <Route path="cases" element={<VolunteerCasesList />} />
          <Route path="cases/:id" element={<VolunteerCaseReview />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="cases" element={<AdminCases />} />
          <Route path="cases/create" element={<CreateCase />} />
          <Route path="cases/:id" element={<AdminCaseDetails />} />
          <Route path="cases/:id/edit" element={<CreateCase />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/create" element={<CreateUser />} />
          <Route path="users/:id" element={<AdminUserDetails />} />
          <Route path="users/:id/edit" element={<CreateUser />} />
          <Route path="volunteers" element={<AdminVolunteers />} />
          <Route path="activity" element={<AdminActivity />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
