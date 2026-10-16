import { apiClient } from './apiClient';

export interface LoginResponse {
  token: string;
  tenant_id?: string | number;
  user: {
    id: string;
    email: string;
    name: string;
    tenant_id?: string | number;
    [key: string]: any;
  };
}

export class AuthService {
  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        '/login',
        { email, password },
        {
          headers: {
            'X-Skip-Toast': 'true', // Handle manually or via onboarding redirect
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('[AUTH] Login error:', error);
      throw error;
    }
  }

  static async register(email: string, name: string, password: string, plan?: string): Promise<any> {
    try {
      const response = await apiClient.post(
        '/register',
        {
          email,
          name,
          password,
          password_confirmation: password,
          plan: plan || 'free',
        },
        {
          headers: {
            'X-Skip-Toast': 'true',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('[AUTH] Registration error:', error);
      throw error;
    }
  }

  static async verifyEmail(email: string, code?: string): Promise<any> {
    try {
      const response = await apiClient.post(
        '/email/verify',
        { email, code },
        {
          headers: {
            'X-Skip-Toast': 'true',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('[AUTH] Email verification error:', error);
      throw error;
    }
  }

  static async resendVerification(email: string): Promise<any> {
    try {
      const response = await apiClient.post(
        '/email/resend-verification',
        { email },
        {
          headers: {
            'X-Skip-Toast': 'true',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('[AUTH] Resend verification error:', error);
      throw error;
    }
  }

  static setToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  static setTenantId(id: string | number) {
    localStorage.setItem('tenant_id', String(id));
  }

  static getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  static getTenantId(): string | null {
    return localStorage.getItem('tenant_id');
  }

  static removeToken() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('tenant_id');
  }
}
