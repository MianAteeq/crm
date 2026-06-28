import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  activeRequests: number;
  startLoading: () => void;
  stopLoading: () => void;
}

let timeoutId: ReturnType<typeof setTimeout> | null = null;

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  activeRequests: 0,
  startLoading: () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    set((state) => ({
      activeRequests: state.activeRequests + 1,
      isLoading: true,
    }));
  },
  stopLoading: () => {
    set((state) => {
      const nextActive = Math.max(0, state.activeRequests - 1);
      if (nextActive === 0) {
        // Debounce stopping the loader to prevent flickering on quick consecutive calls
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          set({ isLoading: false });
        }, 150); // 150ms delay
      }
      return { activeRequests: nextActive };
    });
  },
}));
