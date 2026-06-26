import { create } from 'zustand';
import { User } from '../types';
import { AuthService } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string, plan?: string) => Promise<void>;
  logout: () => void;
  updateOnboarding: (step: number, data?: Partial<User>) => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await AuthService.login(email, password);
      
      // Fallback for tenant_id if not present in user object but present in root
      const tenantIdValue = response.user.tenant_id || response.tenant_id || '1';
      
      const user: User = {
        id: String(response.user.id),
        email: response.user.email,
        name: response.user.name,
        businessName: response.user.tenant?.name || response.user.businessName || 'throbtech Enterprise',
        avatar: response.user.avatar || 'royal',
        onboardingStep: 4,
        tenantId: String(tenantIdValue),
        role: response.user.role || 'admin'
      };
      
      AuthService.setToken(response.token);
      AuthService.setTenantId(tenantIdValue);
      set({ user, isAuthenticated: true, isLoading: false });
      localStorage.setItem('auth_session', JSON.stringify(user));
      
      // Refresh the WebSocket connection with the new token
      try {
        const { refreshEcho } = await import('../lib/echo');
        refreshEcho();
      } catch (e) {
        console.warn('Realtime refresh deferred', e);
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (email: string, name: string, password: string, plan?: string) => {
    set({ isLoading: true });
    try {
      const response = await AuthService.register(email, name, password, plan);
      
      const tenantIdValue = response.user.tenant_id || response.tenant_id || '1';
      
      const user: User = {
        id: String(response.user.id),
        email: response.user.email,
        name: response.user.name,
        businessName: response.tenant?.name || response.user.businessName || 'Workspace',
        avatar: response.user.avatar || 'royal',
        onboardingStep: 1, // Start onboarding
        tenantId: String(tenantIdValue),
        role: response.user.role || 'admin'
      };
      
      AuthService.setToken(response.token);
      AuthService.setTenantId(tenantIdValue);
      set({ user, isAuthenticated: true, isLoading: false });
      localStorage.setItem('auth_session', JSON.stringify(user));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    AuthService.removeToken();
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('auth_session');
  },

  updateOnboarding: (step: number, data?: Partial<User>) => {
    set((state) => {
      const updatedUser = state.user ? { ...state.user, ...data, onboardingStep: step } : null;
      if (updatedUser) {
        localStorage.setItem('auth_session', JSON.stringify(updatedUser));
      }
      return { user: updatedUser };
    });
  },

  updateProfile: (data: Partial<User>) => {
    set((state) => {
      const updatedUser = state.user ? { ...state.user, ...data } : null;
      if (updatedUser) {
        localStorage.setItem('auth_session', JSON.stringify(updatedUser));
      }
      return { user: updatedUser };
    });
  },
}));

// Initialize from localStorage
const savedSession = localStorage.getItem('auth_session');
if (savedSession) {
  try {
    const user = JSON.parse(savedSession);
    useAuthStore.setState({ user, isAuthenticated: true });
  } catch (e) {
    localStorage.removeItem('auth_session');
  }
}
