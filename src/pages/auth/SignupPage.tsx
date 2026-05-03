import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { MessageSquare, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const signupSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const { signup, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch('password', '');
  const strength = password.length === 0 ? 0 : password.length < 8 ? 1 : 2;

  const onSubmit = async (data: SignupForm) => {
    try {
      await signup(data.email, data.name);
      navigate('/onboarding');
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
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Join the Future</h1>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-10">Launch your WhatsApp engine in minutes</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg-surface2 border border-border p-10 rounded-[3rem] shadow-2xl relative"
        >
          <div className="absolute -top-1 px-8 py-2 bg-brand text-black text-[9px] font-black uppercase tracking-widest rounded-full left-10 transform -translate-y-1/2">
            7-Day Free Trial
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
             <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={18} />
                <input 
                  {...register('name')}
                  placeholder="Ali Ahmad"
                  className={`w-full bg-bg-surface3 border rounded-2xl p-4 pl-12 text-sm font-bold text-white focus:outline-none transition-all shadow-inner ${
                    errors.name ? 'border-rose-500/50' : 'border-border focus:border-brand/40'
                  }`}
                />
              </div>
              {errors.name && <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest pl-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Work Email</label>
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
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Password</label>
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
              {/* Strength indicator */}
              <div className="flex gap-1 mt-1">
                 {[1, 2, 3].map((s) => (
                    <div key={s} className={`h-1 flex-1 rounded-full bg-bg-surface3 overflow-hidden`}>
                       <div className={`h-full transition-all duration-500 ${
                         strength >= s ? (strength === 2 ? 'bg-brand' : 'bg-yellow-500') : ''
                       }`} />
                    </div>
                 ))}
              </div>
              {errors.password && <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest pl-1">{errors.password.message}</p>}
            </div>

             <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={18} />
                <input 
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="••••••••"
                  className={`w-full bg-bg-surface3 border rounded-2xl p-4 pl-12 text-sm font-bold text-white focus:outline-none transition-all shadow-inner ${
                    errors.confirmPassword ? 'border-rose-500/50' : 'border-border focus:border-brand/40'
                  }`}
                />
              </div>
              {errors.confirmPassword && <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest pl-1">{errors.confirmPassword.message}</p>}
            </div>

            <p className="text-[9px] font-medium text-text-muted uppercase leading-relaxed text-center">
              By creating an account, you agree to our <a href="#" className="text-white hover:underline">Terms of Service</a> and <a href="#" className="text-white hover:underline">Privacy Policy</a>.
            </p>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-5 bg-brand text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:brightness-110 disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-3 mt-4"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>
        </motion.div>

        <p className="text-center text-[10px] font-black text-text-muted uppercase tracking-widest">
          Already have an account? <Link to="/login" className="text-brand hover:underline underline-offset-4 decoration-2">Login here</Link>
        </p>
      </div>
    </div>
  );
}
