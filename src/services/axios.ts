import axios, { AxiosError } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request: attach access token ────────────────────────────────────────────
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Refresh queue ────────────────────────────────────────────────────────────
let isRefreshing = false;
type Subscriber = (token: string) => void;
let subscribers: Subscriber[] = [];

const subscribe = (cb: Subscriber) => subscribers.push(cb);
const notifyAll = (token: string) => { subscribers.forEach(cb => cb(token)); subscribers = []; };
const rejectAll = (err: any) => { subscribers.forEach(cb => cb('')); subscribers = []; };

// ─── Response: handle 401 → refresh → retry ──────────────────────────────────
api.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const original = error.config as any;

    // Transform error message for all non-401 errors (or 401s we won't retry)
    const setMsg = () => {
      const data: any = error.response?.data;
      if (data?.message) error.message = data.message;
      else if (data?.errors?.[0]?.msg) error.message = data.errors[0].msg;
    };

    if (error.response?.status !== 401 || original._retry) {
      setMsg();
      return Promise.reject(error);
    }

    // Skip refresh for the refresh endpoint itself
    if (original.url?.includes('/auth/refresh') || original.url?.includes('/auth/login')) {
      setMsg();
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      // Queue until refresh completes
      return new Promise((resolve, reject) => {
        subscribe((token: string) => {
          if (!token) return reject(error);
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    isRefreshing = true;
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      isRefreshing = false;
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      original.headers.Authorization = `Bearer ${data.token}`;
      notifyAll(data.token);
      return api(original);
    } catch (refreshErr) {
      rejectAll(refreshErr);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
