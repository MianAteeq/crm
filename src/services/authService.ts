
const BASE_URL = 'https://crm.throbtech.com/api';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid credentials or server error');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected network error occurred');
    }
  }

  static setToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  static getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  static removeToken() {
    localStorage.removeItem('auth_token');
  }
}
