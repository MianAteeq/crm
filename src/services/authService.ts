
const getBaseUrl = () => {
  if (typeof window !== 'undefined' && 
      (window.location.hostname.endsWith('run.app') || 
       window.location.hostname.includes('localhost') || 
       window.location.hostname.includes('127.0.0.1'))) {
    return '/api';
  }
  return 'https://crm.throbtech.com/api';
};

const BASE_URL = getBaseUrl();

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
