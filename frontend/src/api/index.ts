import api from './axios';
import { User, Case, Notification, PaginatedResponse, ApiResponse } from '../types';

export const authApi = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role?: string;
    country: string;
    phone?: string;
  }) => api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data),

  login: (email: string, password: string) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', { email, password }),

  logout: () => api.post('/auth/logout'),

  me: () => api.get<ApiResponse<{ user: User }>>('/auth/me'),

  updateProfile: (data: Partial<User>) => api.put<ApiResponse<{ user: User }>>('/auth/profile', data),
};

export const casesApi = {
  getAll: (params?: { status?: string; country?: string; page?: number }) =>
    api.get<PaginatedResponse<Case>>('/cases/my', { params }),

  getPublished: (params?: { page?: number }) =>
    api.get<PaginatedResponse<Case>>('/cases/published', { params }),

  getById: (id: number) => api.get<ApiResponse<{ case: Case }>>(`/cases/${id}`),

  getPublicById: (id: number) => api.get<ApiResponse<{ case: Case }>>(`/public/cases/${id}`),

  create: (data: Partial<Case> & { documents?: File[] }) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'documents' && value) {
        (value as File[]).forEach((file) => formData.append('documents[]', file));
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });
    return api.post<ApiResponse<{ case: Case }>>('/cases', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  update: (id: number, data: Partial<Case>) =>
    api.put<ApiResponse<{ case: Case }>>(`/cases/${id}`, data),

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
    api.get<PaginatedResponse<Case>>('/volunteer/cases', { params }),

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
  getUsers: (params?: { role?: string; search?: string; page?: number }) =>
    api.get<PaginatedResponse<User>>('/admin/users', { params }),

  createUser: (data: { name: string; email: string; password: string; role: string; country: string }) =>
    api.post<ApiResponse<{ user: User }>>('/admin/users', data),

  updateUserRole: (userId: number, role: string) =>
    api.put<ApiResponse<{ user: User }>>(`/admin/users/${userId}/role`, { role }),

  toggleUserStatus: (userId: number) =>
    api.put<ApiResponse<{ user: User }>>(`/admin/users/${userId}/toggle-status`),

  getCasesForApproval: (params?: { page?: number }) =>
    api.get<PaginatedResponse<Case>>('/admin/cases/approval', { params }),

  approveCase: (caseId: number, notes?: string) =>
    api.put<ApiResponse<{ case: Case }>>(`/admin/cases/${caseId}/approve`, { notes }),

  rejectCase: (caseId: number, reason: string) =>
    api.put<ApiResponse<{ case: Case }>>(`/admin/cases/${caseId}/reject`, { reason }),

  getCase: (id: number) => api.get<ApiResponse<{ case: Case }>>(`/admin/cases/${id}`),

  updateCase: (id: number, data: Partial<Case>) =>
    api.put<ApiResponse<{ case: Case }>>(`/admin/cases/${id}`, data),

  getStatistics: () => api.get<ApiResponse<{ statistics: Record<string, unknown> }>>('/admin/statistics'),
};

export const notificationsApi = {
  getAll: (params?: { page?: number }) =>
    api.get<PaginatedResponse<Notification>>('/notifications', { params }),

  getUnread: () => api.get<Notification[]>('/notifications/unread'),

  getUnreadCount: () => api.get<{ count: number }>('/notifications/unread-count'),

  markAsRead: (id: number) => api.put(`/notifications/${id}/read`),

  markAllAsRead: () => api.put('/notifications/read-all'),
};
