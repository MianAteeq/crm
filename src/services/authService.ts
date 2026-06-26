// Dev  → /api  (proxied by Vite → http://127.0.0.1:8000)
// Prod → VITE_CRM_API_URL/api
const BASE_URL = import.meta.env.DEV
  ? '/api'
  : `${import.meta.env.VITE_CRM_API_URL ?? 'https://crm.throbtech.com'}/api`;

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
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'No error body');
        console.error(`[AUTH] Login failed with status ${response.status}: ${errorBody}`);
        throw new Error(`Login failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[AUTH] Login error:', error);
      throw error;
    }
  }

  static async register(email: string, name: string, password: string, plan?: string): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          password,
          password_confirmation: password,
          plan: plan || 'free'
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: 'Registration failed' }));
        throw new Error(errorBody.message || `Registration failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[AUTH] Registration error:', error);
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
