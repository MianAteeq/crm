import { motion, AnimatePresence } from 'motion/react';

interface LoaderProps {
  show?: boolean;
  inline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function Loader({
  show = true,
  inline = false,
  size = 'md',
  text,
}: LoaderProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-[2px]',
    md: 'w-10 h-10 border-[3px]',
    lg: 'w-16 h-16 border-[4px]',
  };

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative flex items-center justify-center">
        {/* Glow backdrop effect */}
        <div 
          className={`absolute rounded-full bg-indigo-500/20 blur-xl ${
            size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-14 h-14' : 'w-24 h-24'
          }`} 
        />
        
        {/* Inner rotating gradient circle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
          className={`${sizeClasses[size]} rounded-full border-indigo-100 border-t-indigo-600 border-r-purple-600 shadow-md`}
        />
      </div>

      {text && (
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">
          {text}
        </span>
      )}
    </div>
  );

  if (inline) {
    if (!show) return null;
    return (
      <div 
        role="status" 
        aria-live="polite" 
        className="flex items-center justify-center p-4 w-full h-full min-h-[100px]"
      >
        {spinnerContent}
      </div>
    );
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/40 backdrop-blur-md"
          role="status"
          aria-live="polite"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="bg-white/90 border border-slate-100/50 p-8 rounded-3xl shadow-premium shadow-indigo-900/5 max-w-sm flex flex-col items-center justify-center"
          >
            {spinnerContent}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
