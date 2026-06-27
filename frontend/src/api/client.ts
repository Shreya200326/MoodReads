import axios from 'axios';

// In dev: empty string → Vite proxy → localhost:8000
// In prod: set VITE_API_URL to your deployed backend URL
const BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('moodreads_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('moodreads_token');
      localStorage.removeItem('moodreads_user');
    }
    return Promise.reject(err);
  }
);

export default api;
