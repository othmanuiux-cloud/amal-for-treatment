'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { adminApi } from '../../api';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [deleteModal, setDeleteModal] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getUsers({ role: 'admin,staff,user,patient' });
      const data = response.data.data || response.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);
      await adminApi.deleteUser(id);
      setDeleteModal(null);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('حدث خطأ أثناء حذف المستخدم');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-50/50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">إدارة المستخدمين</h1>
            <p className="text-slate-500 mt-1">تحكم في الصلاحيات والمستخدمين المسجلين في المنصة</p>
          </div>
          <Link to="/admin/users/create" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium">
            <Plus className="w-5 h-5" />
            إضافة مستخدم جديد
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-4 flex items-center gap-4 relative">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="البحث بالاسم أو البريد الإلكتروني..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap min-w-[140px] justify-between"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-400" />
                <span>
                  {selectedRole === 'all' ? 'كل الأدوار' : 
                   selectedRole === 'admin' ? 'المدراء' :
                   selectedRole === 'staff' ? 'الموظفين' :
                   selectedRole === 'patient' ? 'المرضى' : 'المستخدمين'}
                </span>
              </div>
            </button>

            {showRoleDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowRoleDropdown(false)}
                />
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-1">
                    {[
                      { id: 'all', label: 'كل الأدوار' },
                      { id: 'admin', label: 'المدراء' },
                      { id: 'staff', label: 'الموظفين' },
                      { id: 'patient', label: 'المرضى' },
                      { id: 'user', label: 'المستخدمين' },
                    ].map((role) => (
                      <button
                        key={role.id}
                        onClick={() => {
                          setSelectedRole(role.id);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-right px-4 py-2.5 text-sm rounded-lg transition-colors ${
                          selectedRole === role.id 
                            ? 'bg-blue-50 text-blue-600 font-bold' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">المستخدم</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">البريد الإلكتروني</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">الدور</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">الدولة</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">الحالة</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">التاريخ</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      جاري التحميل...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      لا يوجد مستخدمين
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-bold">
                              {user.name?.charAt(0) || 'م'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{user.name}</p>
                            {user.phone && (
                              <p className="text-xs text-slate-500">{user.phone}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          status={
                            user.role === 'admin' ? 'active' :
                              user.role === 'staff' ? 'pending' :
                                user.role === 'patient' ? 'urgent' :
                                  'inactive'
                          }
                          label={
                            user.role === 'admin' ? 'مدير' :
                              user.role === 'staff' ? 'موظف' :
                                user.role === 'patient' ? 'مريض' :
                                  'مستخدم'
                          }
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{user.country}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={user.status === 'active' ? 'active' : 'inactive'} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link to={`/admin/users/${user.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="عرض">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link to={`/admin/users/${user.id}/edit`} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="تعديل">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button onClick={() => setDeleteModal(user.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center z-[1001] p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[56px] p-12 w-full max-w-lg shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-100 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-rose-50 rounded-[40px] flex items-center justify-center mb-10 mx-auto shadow-inner">
              <Trash2 className="w-12 h-12 text-rose-500" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 text-center mb-4 tracking-tight">هل ترغب بالحذف فعلاً؟</h3>
            <p className="text-slate-500 font-bold text-center mb-12 leading-relaxed text-lg">
              سيتم إزالة بيانات هذا المستخدم نهائياً من النظام. هذا الإجراء <span className="text-rose-600 underline underline-offset-4">غير قابل للتراجع</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <button 
                onClick={() => setDeleteModal(null)} 
                className="flex-1 py-5 bg-slate-50 text-slate-500 rounded-3xl font-black hover:bg-slate-100 transition-all active:scale-95"
              >
                تراجع، اتركها
              </button>
              <button
                onClick={() => handleDelete(deleteModal)}
                disabled={isDeleting}
                className="flex-1 py-5 bg-rose-600 text-white rounded-3xl font-black shadow-xl shadow-rose-900/20 hover:bg-rose-700 transition-all active:scale-95 disabled:opacity-50"
              >
                {isDeleting ? 'جاري الأرشفة...' : 'نعم، احذف المستخدم'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}