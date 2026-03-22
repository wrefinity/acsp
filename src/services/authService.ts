import api from './axios';

export const authService = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data).then(r => r.data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data).then(r => r.data),

  logout: () =>
    api.post('/auth/logout').then(r => r.data).catch(() => null),

  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }).then(r => r.data),

  getProfile: () =>
    api.get('/auth/profile').then(r => r.data),

  verifyRegistrationOtp: (email: string, otp: string) =>
    api.post('/auth/verify-registration-otp', { email, otp }).then(r => r.data),

  resendVerificationOtp: (email: string) =>
    api.post('/auth/resend-verification-otp', { email }).then(r => r.data),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }).then(r => r.data),

  verifyResetOtp: (email: string, otp: string) =>
    api.post('/auth/verify-reset-otp', { email, otp }).then(r => r.data),

  resetPassword: (resetSessionToken: string, password: string) =>
    api.post('/auth/reset-password', { resetSessionToken, password }).then(r => r.data),
};
