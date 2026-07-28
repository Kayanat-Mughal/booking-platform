import axios from 'axios';
import { getSubdomain } from './subdomain';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor - add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // ✅ Add idempotency key for POST and PUT requests
  if (config.method === 'post' || config.method === 'put' || config.method === 'patch') {
    const idempotencyKey = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    config.headers['Idempotency-Key'] = idempotencyKey;
  }
  
  return config;
});

const subdomain = getSubdomain();
if (subdomain) {
  api.defaults.headers.common['X-Tenant'] = subdomain;
}

export default api;