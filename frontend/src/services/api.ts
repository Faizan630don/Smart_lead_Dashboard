import axios from 'axios';
import { API_BASE_URL } from '../constants/config';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to format errors and handle session expiry
api.interceptors.response.use(
  (response) => {
    // Return the response data body directly
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if path is not already login/register
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        window.location.href = '/login';
      }
    }

    // Normalize standard API error response structures
    const errorDetails = error.response?.data?.error || {
      code: 'NETWORK_ERROR',
      message: error.response?.data?.message || error.message || 'An unexpected error occurred.',
      details: error.response?.data?.details || null,
    };

    return Promise.reject(errorDetails);
  }
);

export default api;
