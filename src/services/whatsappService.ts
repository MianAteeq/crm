import axios from 'axios';
import { WhatsAppSettings } from '../types';
import { AuthService } from './authService';

const BASE_URL = 'https://crm.throbtech.com/api/whatsapp';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = AuthService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const whatsappService = {
  getSettings: async (): Promise<WhatsAppSettings> => {
    const response = await api.get('/settings');
    return response.data?.data || response.data;
  },

  saveSettings: async (settings: WhatsAppSettings): Promise<{ message: string; data?: WhatsAppSettings }> => {
    const response = await api.post('/settings', settings);
    return response.data;
  },

  disconnect: async (): Promise<{ message: string }> => {
    const response = await api.delete('/settings');
    return response.data;
  },

  testConnection: async (phone: string): Promise<{ message: string; success?: boolean }> => {
    const response = await api.post('/test', { phone });
    return response.data;
  },

  embeddedSignup: async (code: string): Promise<{ message: string; data?: WhatsAppSettings }> => {
    const response = await api.post('/embedded-signup', { code });
    return response.data;
  },

  sendText: async (phone: string, message: string): Promise<{ message: string; data?: any }> => {
    const response = await api.post('/send-text', { phone, message });
    return response.data;
  }
};
