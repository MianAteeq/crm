import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { MessageSquare, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 bg-[dashed-pattern]">
      <div className="w-full max-w-[440px] space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-slate-900/20 transition-transform group-hover:rotate-12">
              <MessageSquare size={26} strokeWidth={2.5} />
            </div>
            <span className="text-3xl font-bold text-slate-900 tracking-tight">throbtech</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Welcome back</h1>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-10">Access your enterprise communication portal</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-xl relative"
        >
          <div className="absolute -top-1 px-8 py-2 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest rounded-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap shadow-lg">
            Secure Authentication Gateway
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-in fade-in slide-in-from-top-2">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <Lock size={14} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Business Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
                <input 
                  {...register('email')}
                  type="email"
                  placeholder="name@company.com"
                  className={`w-full bg-slate-50 border rounded-2xl p-4 pl-12 text-sm font-bold text-slate-900 focus:outline-none transition-all ${
                    errors.email ? 'border-rose-300 bg-rose-50' : 'border-slate-100 focus:border-slate-900 focus:bg-white focus:shadow-sm'
                  }`}
                />
              </div>
              {errors.email && <p className="text-[9px] font-bold text-rose-600 uppercase tracking-widest pl-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between pl-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                <button type="button" className="text-[9px] font-bold text-slate-900 uppercase tracking-widest hover:underline">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
                <input 
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full bg-slate-50 border rounded-2xl p-4 pl-12 text-sm font-bold text-slate-900 focus:outline-none transition-all ${
                    errors.password ? 'border-rose-300 bg-rose-50' : 'border-slate-100 focus:border-slate-900 focus:bg-white focus:shadow-sm'
                  }`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-[9px] font-bold text-rose-600 uppercase tracking-widest pl-1">{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 mt-4"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>
        </motion.div>

        <p className="text-center text-[11px] font-semibold text-slate-500">
          New to throbtech? <Link to="/signup" className="text-slate-900 hover:underline underline-offset-4 decoration-2 font-bold">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
