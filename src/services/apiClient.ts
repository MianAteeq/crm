import axios from 'axios';
import { AuthService } from './authService';
import { useLoadingStore } from '../store/loadingStore';
import { toast } from '../components/ui/Toast';

const isDev = import.meta.env.DEV;
const BASE_URL = isDev
  ? '/api'
  : `${import.meta.env.VITE_CRM_API_URL ?? 'https://crm.throbtech.com'}/api`;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if present
    const token = AuthService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add tenant ID if present
    const tenantId = AuthService.getTenantId();
    if (tenantId) {
      config.headers['X-Tenant-Id'] = tenantId;
    }

    // Check if we should skip the global loader
    const skipLoader = config.headers['X-Skip-Loader'] === 'true';
    if (!skipLoader) {
      useLoadingStore.getState().startLoading();
      (config as any)._showLoader = true;
    }

    // Store custom properties on config.metadata
    const skipToast = config.headers['X-Skip-Toast'] === 'true';
    (config as any)._skipToast = skipToast;

    // Strip custom headers so they aren't sent to server
    delete config.headers['X-Skip-Loader'];
    delete config.headers['X-Skip-Toast'];

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Stop loading if started
    if ((response.config as any)._showLoader) {
      useLoadingStore.getState().stopLoading();
    }

    // Check if we should skip success toasts
    const skipToast = (response.config as any)._skipToast;
    
    // Automatically toast success messages for write/mutate operations
    const method = response.config.method?.toUpperCase();
    if (!skipToast && (method === 'POST' || method === 'PUT' || method === 'DELETE' || method === 'PATCH')) {
      const message = response.data?.message || 'Operation completed successfully';
      toast.success('Success', message);
    }

    return response;
  },
  (error) => {
    // Stop loading if started
    if (error.config?._showLoader) {
      useLoadingStore.getState().stopLoading();
    }

    const skipToast = error.config?._skipToast;

    // Handle 401 unauthenticated
    if (error.response?.status === 401) {
      const token = AuthService.getToken();
      if (token) {
        AuthService.removeToken();
        // Redirect to login if not already there
        if (window.location.pathname !== '/' && !window.location.pathname.startsWith('/auth')) {
          console.warn('[API Client] Redirecting to login due to 401');
          window.location.href = '/';
        }
      }
    }

    // Display error toast
    if (!skipToast) {
      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
      toast.error('Error', errorMessage);
    }

    return Promise.reject(error);
  }
);
