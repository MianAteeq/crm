import { create } from 'zustand';
import { User } from '../types';
import { AuthService } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessReady: boolean;
  refreshAccess: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string, plan?: string) => Promise<void>;
  logout: () => void;
  updateOnboarding: (step: number, data?: Partial<User>) => void;
  updateProfile: (data: Partial<User>) => void;
  verifyEmail: (code?: string) => Promise<void>;
  resendVerification: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  accessReady: false,

  refreshAccess: async () => {
    const accountId = useAuthStore.getState().user?.id;
    const remote = await AuthService.me();
    // A request from an old session must not restore access after logout.
    if (!accountId || useAuthStore.getState().user?.id !== accountId) return;
    set(state => {
      const user: User = {
        ...state.user!,
        name: remote.name,
        email: remote.email,
        role: remote.role,
        permissions: remote.permissions || [],
        tenantId: remote.tenant_id == null ? undefined : String(remote.tenant_id),
        businessName: remote.tenant?.name || state.user?.businessName,
        avatar: remote.avatar || state.user?.avatar,
      };
      if (remote.tenant_id != null) AuthService.setTenantId(remote.tenant_id);
      else localStorage.removeItem('tenant_id');
      localStorage.setItem('auth_session', JSON.stringify(user));
      return { user, accessReady: true };
    });
  },

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
        businessName: response.user.tenant?.name || response.user.businessName || 'Talkinexx Workspace',
        avatar: response.user.avatar || 'royal',
        onboardingStep: 4,
        tenantId: String(tenantIdValue),
        role: response.user.role || 'user',
        permissions: response.user.permissions || []
      };
      
      AuthService.setToken(response.token);
      AuthService.setTenantId(tenantIdValue);
      set({ user, isAuthenticated: true, isLoading: false, accessReady: true });
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
        role: response.user.role || 'user',
        permissions: response.user.permissions || []
      };
      
      AuthService.setToken(response.token);
      AuthService.setTenantId(tenantIdValue);
      set({ user, isAuthenticated: true, isLoading: false, accessReady: true });
      localStorage.setItem('auth_session', JSON.stringify(user));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    AuthService.removeToken();
    void import('../lib/echo').then(({ disconnectEcho }) => disconnectEcho());
    set({ user: null, isAuthenticated: false, accessReady: false });
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

  verifyEmail: async (code?: string) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser?.email) return;
    try {
      await AuthService.verifyEmail(currentUser.email, code);
      const updatedUser: User = {
        ...currentUser,
        emailVerified: true,
        email_verified_at: new Date().toISOString(),
      };
      set({ user: updatedUser });
      localStorage.setItem('auth_session', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to verify email', error);
      throw error;
    }
  },

  resendVerification: async () => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser?.email) return;
    try {
      await AuthService.resendVerification(currentUser.email);
    } catch (error) {
      console.error('Failed to resend verification', error);
      throw error;
    }
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
