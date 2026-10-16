import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold transition-all duration-200 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#166534]/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-[#166534] hover:bg-[#14532d] active:bg-[#0f3d21] text-white shadow-sm hover:shadow-[#166534]/20 border border-transparent',
      secondary:
        'bg-white hover:bg-[#F0FDF4] active:bg-emerald-50 text-[#12263A] hover:text-[#166534] border border-slate-200 hover:border-[#bbf7d0] shadow-xs',
      outline:
        'bg-transparent hover:bg-[#F0FDF4] text-[#12263A] hover:text-[#166534] border border-slate-200 hover:border-[#bbf7d0]',
      ghost:
        'bg-transparent hover:bg-[#F0FDF4] text-[#57534E] hover:text-[#166534] active:bg-emerald-50/80 border border-transparent',
      danger:
        'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-sm hover:shadow-rose-600/20 border border-transparent',
      success:
        'bg-[#22C55E] hover:bg-emerald-600 active:bg-emerald-700 text-white shadow-sm hover:shadow-emerald-500/20 border border-transparent',
    };

    const sizes = {
      xs: 'h-7 px-2.5 text-[11px] gap-1 rounded-lg',
      sm: 'h-8.5 px-3.5 text-xs gap-1.5 rounded-xl',
      md: 'h-10 px-4.5 text-xs sm:text-sm gap-2 rounded-xl',
      lg: 'h-11.5 px-5.5 text-sm sm:text-base gap-2.5 rounded-xl font-bold',
      'icon-sm': 'w-8 h-8 p-0 rounded-lg',
      icon: 'w-10 h-10 p-0 rounded-xl',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0 text-current" />
        ) : (
          leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && <span className="shrink-0 flex items-center">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
