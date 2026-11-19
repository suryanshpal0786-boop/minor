import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || '';
const baseURL = rawApiUrl ? `${rawApiUrl.replace(/\/$/, '')}/api` : '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('truthlens_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if invalid or expired session
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/dashboard')) {
        localStorage.removeItem('truthlens_token');
        localStorage.removeItem('truthlens_user');
        window.location.href = '/login?expired=1';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
