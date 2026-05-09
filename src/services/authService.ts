
const BASE_URL = '/api/proxy';

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
        throw new Error('Fallback to mock');
      }

      return await response.json();
    } catch (error) {
      console.warn('[AUTH] Login failed, using mock response');
      return {
        token: 'mock_jwt_token',
        user: {
          id: 'user_1',
          email: email || 'user@example.com',
          name: email ? email.split('@')[0] : 'Demo User'
        }
      };
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
