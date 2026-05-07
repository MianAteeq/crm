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
  password: z.string().min(6, 'Password must be at least 6 characters'),
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
  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : 2;

  const onSubmit = async (data: SignupForm) => {
    try {
      await signup(data.email, data.name);
      navigate('/onboarding');
    } catch (error) {
      console.error(error);
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Join the future</h1>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-10">Launch your WhatsApp engine in minutes</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-xl relative"
        >
          <div className="absolute -top-1 px-8 py-2 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest rounded-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap shadow-lg">
             7-Day Trial - Fully Featured
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
             <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
                <input 
                  {...register('name')}
                  placeholder="Ali Ahmad"
                  className={`w-full bg-slate-50 border rounded-2xl p-4 pl-12 text-sm font-bold text-slate-900 focus:outline-none transition-all ${
                    errors.name ? 'border-rose-300 bg-rose-50' : 'border-slate-100 focus:border-slate-900 focus:bg-white focus:shadow-sm'
                  }`}
                />
              </div>
              {errors.name && <p className="text-[9px] font-bold text-rose-600 uppercase tracking-widest pl-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Work Email</label>
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
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Password</label>
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
              {/* Strength indicator */}
              <div className="flex gap-1 mt-1 px-1">
                 {[1, 2, 3].map((s) => (
                    <div key={s} className={`h-1 flex-1 rounded-full bg-slate-100 overflow-hidden`}>
                       <div className={`h-full transition-all duration-500 ${
                         strength >= s ? (strength === 2 ? 'bg-slate-900' : 'bg-amber-500') : ''
                       }`} />
                    </div>
                 ))}
              </div>
              {errors.password && <p className="text-[9px] font-bold text-rose-600 uppercase tracking-widest pl-1">{errors.password.message}</p>}
            </div>

             <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
                <input 
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="••••••••"
                  className={`w-full bg-slate-50 border rounded-2xl p-4 pl-12 text-sm font-bold text-slate-900 focus:outline-none transition-all ${
                    errors.confirmPassword ? 'border-rose-300 bg-rose-50' : 'border-slate-100 focus:border-slate-900 focus:bg-white focus:shadow-sm'
                  }`}
                />
              </div>
              {errors.confirmPassword && <p className="text-[9px] font-bold text-rose-600 uppercase tracking-widest pl-1">{errors.confirmPassword.message}</p>}
            </div>

            <p className="text-[10px] font-semibold text-slate-500 leading-relaxed text-center px-4">
              By creating an account, you agree to our <a href="#" className="text-slate-900 font-bold hover:underline">Terms</a> and <a href="#" className="text-slate-900 font-bold hover:underline">Privacy Policy</a>.
            </p>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 mt-4"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>
        </motion.div>

        <p className="text-center text-[11px] font-semibold text-slate-500">
          Already have an account? <Link to="/login" className="text-slate-900 hover:underline underline-offset-4 decoration-2 font-bold">Login here</Link>
        </p>
      </div>
    </div>
  );
}
