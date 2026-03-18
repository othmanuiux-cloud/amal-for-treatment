import axios from 'axios';

const getNetworkErrorMessage = (error: any): string => {
  if (!navigator.onLine) {
    return 'لا يوجد اتصال بالإنترنت. تحقق من اتصالك وحاول مرة أخرى.';
  }

  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'انتهت مهلة الاتصال بالخادم. حاول مرة أخرى.';
  }

  if (error.message === 'Network Error') {
    return 'تعذر الاتصال بالخادم. تأكد من أن الخادم يعمل وحاول مرة أخرى.';
  }

  if (error.message?.includes('ENOTFOUND')) {
    return 'لا يمكن الوصول إلى الخادم. تحقق من عنوان الخادم وحاول مرة أخرى.';
  }

  if (error.message?.includes('CERT')) {
    return 'هناك مشكلة في شهادة الأمان. اتصل بالدعم الفني.';
  }

  return error.response?.data?.message || 'حدث خطأ غير متوقع. حاول مرة أخرى.';
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = getNetworkErrorMessage(error);
    
    console.error('API Error:', {
      message: errorMessage,
      originalError: error.message,
      code: error.code,
      url: error.config?.url,
      method: error.config?.method,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject({
      ...error,
      userMessage: errorMessage,
    });
  }
);

export default api;

export const authApi = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role?: string;
    country: string;
    phone?: string;
  }) => api.post('/auth/register', data),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (data: any) =>
    api.post('/auth/reset-password', data),

  logout: () => api.post('/auth/logout'),

  me: () => api.get('/auth/me'),

  updateProfile: (data: any) => api.put('/auth/profile', data),
};

export const casesApi = {
  getAll: (params?: { status?: string; country?: string; page?: number }) =>
    api.get('/cases/my', { params }),

  getPublished: (params?: { page?: number }) =>
    api.get('/cases/published', { params }),

  getById: (id: number) => api.get(`/cases/view/${id}`),

  getPublicById: (id: number) => api.get(`/public/cases/${id}`),

  create: (data: any) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'documents' && value && Array.isArray(value)) {
        (value as File[]).forEach((file: File) => formData.append('documents[]', file));
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });
    return api.post('/cases', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  update: (id: number, data: any) => api.put(`/cases/${id}`, data),

  delete: (id: number) => api.delete(`/cases/${id}`),

  uploadDocument: (caseId: number, file: File, fileType: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_type', fileType);
    return api.post(`/cases/${caseId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const volunteerApi = {
  getCases: (params?: { page?: number }) =>
    api.get('/volunteer/cases', { params }),

  startVerification: (caseId: number, notes?: string) =>
    api.post(`/volunteer/cases/${caseId}/start`, { notes }),

  submitVerification: (caseId: number, data: { status: 'approved' | 'rejected'; notes: string; evidence_file?: File }) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'evidence_file' && value) {
        formData.append('evidence_file', value);
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });
    return api.post(`/volunteer/cases/${caseId}/verify`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const adminApi = {
  getUsers: (params?: { role?: string; search?: string; status?: string; is_active?: boolean; page?: number }) =>
    api.get('/admin/users', { params }),

  getUser: (userId: number) =>
    api.get(`/admin/users/${userId}`),

  createUser: (data: { name: string; email: string; password: string; role: string; country: string; phone?: string }) =>
    api.post('/admin/users', data),

  updateUser: (userId: number, data: { name?: string; email?: string; phone?: string; country?: string; role?: string }) =>
    api.put(`/admin/users/${userId}`, data),

  deleteUser: (userId: number) =>
    api.delete(`/admin/users/${userId}`),

  updateUserRole: (userId: number, role: string) =>
    api.put(`/admin/users/${userId}/role`, { role }),

  toggleUserStatus: (userId: number) =>
    api.put(`/admin/users/${userId}/toggle-status`),

  rejectVolunteer: (userId: number, reason?: string) =>
    api.put(`/admin/users/${userId}/reject`, { reason }),

  bulkUpdateUserStatus: (data: { user_ids: number[]; status: string; reason?: string }) =>
    api.post('/admin/users/bulk-status', data),

  getCasesForApproval: (params?: { status?: string; search?: string; page?: number }) =>
    api.get('/admin/cases/approval', { params }),

  getCase: (caseId: number) =>
    api.get(`/admin/cases/${caseId}`),

  updateCase: (caseId: number, data: any) =>
    api.put(`/admin/cases/${caseId}`, data),

  deleteCase: (caseId: number) =>
    api.delete(`/admin/cases/${caseId}`),

  approveCase: (caseId: number, notes?: string) =>
    api.put(`/admin/cases/${caseId}/approve`, { notes }),

  rejectCase: (caseId: number, reason: string) =>
    api.put(`/admin/cases/${caseId}/reject`, { reason }),

  getStatistics: () => api.get('/admin/statistics'),
  getSettings: (params?: { group?: string }) => api.get('/admin/settings', { params }),
  updateSettings: (settings: Record<string, any>) => api.put('/admin/settings', { settings }),
};

export const notificationsApi = {
  getAll: (params?: { page?: number }) =>
    api.get('/notifications', { params }),

  getUnread: () => api.get('/notifications/unread'),

  getUnreadCount: () => api.get('/notifications/unread-count'),

  markAsRead: (id: number) => api.put(`/notifications/${id}/read`),

  markAllAsRead: () => api.put('/notifications/read-all'),
};
