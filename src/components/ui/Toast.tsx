import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { create } from 'zustand';
import { cn } from '../../lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }]
    }));

    // Auto remove after duration
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }));
    }, toast.duration || 5000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }))
}));

// Helper function to show toasts
export const toast = {
  success: (title: string, message?: string, duration?: number) => {
    useToastStore.getState().addToast({ type: 'success', title, message, duration });
  },
  error: (title: string, message?: string, duration?: number) => {
    useToastStore.getState().addToast({ type: 'error', title, message, duration });
  },
  warning: (title: string, message?: string, duration?: number) => {
    useToastStore.getState().addToast({ type: 'warning', title, message, duration });
  },
  info: (title: string, message?: string, duration?: number) => {
    useToastStore.getState().addToast({ type: 'info', title, message, duration });
  }
};

function ToastItem({ toast: toastData }: { toast: Toast }) {
  const { removeToast } = useToastStore();

  const config = {
    success: {
      icon: CheckCircle2,
      badgeBg: 'bg-[#F0FDF4]',
      badgeBorder: 'border-[#22C55E]/40',
      iconColor: 'text-[#166534]',
      accentBorder: 'border-l-4 border-l-[#166534]'
    },
    error: {
      icon: XCircle,
      badgeBg: 'bg-red-50',
      badgeBorder: 'border-red-200',
      iconColor: 'text-red-600',
      accentBorder: 'border-l-4 border-l-red-600'
    },
    warning: {
      icon: AlertCircle,
      badgeBg: 'bg-amber-50',
      badgeBorder: 'border-amber-200',
      iconColor: 'text-amber-600',
      accentBorder: 'border-l-4 border-l-amber-500'
    },
    info: {
      icon: Info,
      badgeBg: 'bg-blue-50',
      badgeBorder: 'border-blue-200',
      iconColor: 'text-blue-600',
      accentBorder: 'border-l-4 border-l-blue-600'
    }
  };

  const toastConfig = config[toastData.type];
  const Icon = toastConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex items-start gap-3.5 p-4 rounded-2xl border border-[#E2E8F0] bg-white shadow-xl shadow-slate-900/10 max-w-sm w-full relative overflow-hidden pointer-events-auto select-none",
        toastConfig.accentBorder
      )}
    >
      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border mt-0.5", toastConfig.badgeBg, toastConfig.badgeBorder, toastConfig.iconColor)}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-bold text-[#12263A] leading-tight mb-0.5">
          {toastData.title}
        </p>
        {toastData.message && (
          <p className="text-xs text-[#64748B] font-medium leading-relaxed break-words">
            {toastData.message}
          </p>
        )}
      </div>
      <button
        onClick={() => removeToast(toastData.id)}
        className="p-1 rounded-lg hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#12263A] transition-colors cursor-pointer shrink-0 mt-0.5"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const { toasts } = useToastStore();

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none max-w-[calc(100vw-2.5rem)]">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
