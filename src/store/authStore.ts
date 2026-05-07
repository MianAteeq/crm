import { create } from 'zustand';
import { User } from '../types';
import { AuthService } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string) => Promise<void>;
  logout: () => void;
  updateOnboarding: (step: number, data?: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await AuthService.login(email, password);
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        businessName: response.user.businessName || 'throbtech Enterprise',
        onboardingStep: 4, // Assume completed for real users
      };
      
      AuthService.setToken(response.token);
      set({ user, isAuthenticated: true, isLoading: false });
      localStorage.setItem('auth_session', JSON.stringify(user));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (email: string, name: string) => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      email,
      name,
      onboardingStep: 1, // Start onboarding
    };
    set({ user: newUser, isAuthenticated: true, isLoading: false });
    localStorage.setItem('auth_session', JSON.stringify(newUser));
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
