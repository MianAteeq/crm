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
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/inbox';

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email);
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-bg-surface flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="w-full max-w-[460px] space-y-10">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-10 group">
            <div className="w-12 h-12 bg-brand text-black rounded-2xl flex items-center justify-center shadow-xl shadow-brand/20 transition-transform group-hover:rotate-12">
              <MessageSquare size={28} strokeWidth={3} />
            </div>
            <span className="text-3xl font-black text-white uppercase tracking-tighter">throbtech</span>
          </Link>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Welcome Back</h1>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-10">Access your enterprise WhatsApp engine</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg-surface2 border border-border p-10 rounded-[3rem] shadow-2xl relative"
        >
          <div className="absolute -top-1 px-8 py-2 bg-brand text-black text-[9px] font-black uppercase tracking-widest rounded-full left-10 transform -translate-y-1/2">
            Secure Login
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Business Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={18} />
                <input 
                  {...register('email')}
                  type="email"
                  placeholder="name@company.com"
                  className={`w-full bg-bg-surface3 border rounded-2xl p-4 pl-12 text-sm font-bold text-white focus:outline-none transition-all shadow-inner ${
                    errors.email ? 'border-rose-500/50' : 'border-border focus:border-brand/40'
                  }`}
                />
              </div>
              {errors.email && <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest pl-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between pl-1">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Password</label>
                <button type="button" className="text-[9px] font-black text-brand uppercase tracking-widest hover:brightness-110">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={18} />
                <input 
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full bg-bg-surface3 border rounded-2xl p-4 pl-12 text-sm font-bold text-white focus:outline-none transition-all shadow-inner ${
                    errors.password ? 'border-rose-500/50' : 'border-border focus:border-brand/40'
                  }`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest pl-1">{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-5 bg-brand text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:brightness-110 disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-3 mt-4"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-border/50 text-center">
            <div className="grid grid-cols-2 gap-4">
               <button className="flex items-center justify-center gap-3 p-3 bg-bg-surface3 border border-border rounded-xl text-[9px] font-black text-white hover:border-brand/40 transition-all uppercase">
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center overflow-hidden">
                     <span className="text-black font-black text-[10px]">G</span>
                  </div>
                  Google
               </button>
               <button className="flex items-center justify-center gap-3 p-3 bg-bg-surface3 border border-border rounded-xl text-[9px] font-black text-white hover:border-brand/40 transition-all uppercase">
                  <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-[10px]">f</div>
                  Facebook
               </button>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-[10px] font-black text-text-muted uppercase tracking-widest">
          New to throbtech? <Link to="/signup" className="text-brand hover:underline underline-offset-4 decoration-2">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
