import api from './axios';

export const userService = {
  getProfile: () =>
    api.get('/users/profile').then(r => r.data),

  updateProfileInfo: (data: any) =>
    api.put('/users/profile', data).then(r => r.data),

  uploadProfilePhoto: (formData: FormData) =>
    api.put('/users/profile/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data),

  // Alias used by Dashboard/ProfileCompletion for file uploads
  updateProfile: (formData: FormData) =>
    api.put('/users/profile/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data),

  updatePreferences: (prefs: {
    emailAnnouncements: boolean;
    emailEvents: boolean;
    emailForum: boolean;
    profileVisible: boolean;
  }) => api.put('/users/preferences', prefs).then(r => r.data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/users/change-password', data).then(r => r.data),

  // Admin
  getAllUsers: (page = 1, limit = 10) =>
    api.get(`/users?page=${page}&limit=${limit}`).then(r => r.data),

  verifyUser: (userId: string, action: 'approve' | 'reject', reason?: string) =>
    api.patch(`/users/${userId}/verify`, { action, reason }).then(r => r.data),

  banUser: (userId: string, action: 'ban' | 'unban', reason?: string) =>
    api.patch(`/users/${userId}/ban`, { action, reason }).then(r => r.data),

  getUserDetails: (userId: string) =>
    api.get(`/users/${userId}/details`).then(r => r.data),

  // Super admin
  assignRole: (userId: string, role: 'super_admin' | 'admin' | 'member') =>
    api.patch(`/users/${userId}/role`, { role }).then(r => r.data),

  deleteUser: (userId: string) =>
    api.delete(`/users/${userId}`).then(r => r.data),
};
