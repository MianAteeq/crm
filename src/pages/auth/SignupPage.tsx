import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { MessageSquare, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useBrandingStore } from '../../store/brandingStore';
import { crmApi } from '../../services/crmApi';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

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

interface DbPlan {
  id: number;
  key: string;
  name: string;
  price: string;
  limits: any;
}

export default function SignupPage() {
  const { websiteName, websiteLogo } = useBrandingStore();
  const [showPassword, setShowPassword] = React.useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { signup, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedPlanKey = searchParams.get('plan') || 'free';

  const [plans, setPlans] = useState<DbPlan[]>([]);
  const [activePlan, setActivePlan] = useState<DbPlan | null>(null);

  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await crmApi.getPublicPlans();
        if (res.success) {
          setPlans(res.plans || []);
          const found = (res.plans || []).find((p: DbPlan) => p.key === selectedPlanKey);
          if (found) {
            setActivePlan(found);
          }
        }
      } catch (err) {
        console.error('Failed to load plans on signup page', err);
      }
    }
    loadPlans();
  }, [selectedPlanKey]);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch('password', '');
  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : 2;

  const onSubmit = async (data: SignupForm) => {
    setApiError(null);
    try {
      await signup(data.email, data.name, data.password, selectedPlanKey);
      navigate('/onboarding');
    } catch (error: any) {
      console.error(error);
      setApiError(error.response?.data?.message || error.message || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between selection:bg-indigo-500/20 selection:text-indigo-900 font-sans">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-6 pt-32 pb-24 bg-slate-50 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-[440px] space-y-8 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">Join the future</h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-10">Launch your WhatsApp engine in minutes</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
          >
            {/* Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-[3rem] blur-xl opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

            <div className="bg-white/90 backdrop-blur-xl border border-slate-200/60 p-10 rounded-[2.5rem] shadow-2xl relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-6 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg whitespace-nowrap">
                Create Free Account
              </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Full Name</label>
                <div className="relative group/input">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors" size={18} />
                  <input 
                    {...register('name')}
                    placeholder="Ali Ahmad"
                    className={`w-full h-14 bg-slate-50/50 border rounded-2xl p-4 pl-12 text-sm font-bold text-slate-900 focus:outline-none transition-all ${
                      errors.name ? 'border-rose-300 bg-rose-50' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-[9px] font-bold text-rose-600 uppercase tracking-widest pl-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Work Email</label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors" size={18} />
                  <input 
                    {...register('email')}
                    type="email"
                    placeholder="name@company.com"
                    className={`w-full h-14 bg-slate-50/50 border rounded-2xl p-4 pl-12 text-sm font-bold text-slate-900 focus:outline-none transition-all ${
                      errors.email ? 'border-rose-300 bg-rose-50' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-[9px] font-bold text-rose-600 uppercase tracking-widest pl-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Password</label>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors" size={18} />
                  <input 
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`w-full h-14 bg-slate-50/50 border rounded-2xl p-4 pl-12 text-sm font-bold text-slate-900 focus:outline-none transition-all ${
                      errors.password ? 'border-rose-300 bg-rose-50' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white'
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
                      <div key={s} className="h-1 flex-1 rounded-full bg-slate-100 overflow-hidden">
                         <div className={`h-full transition-all duration-500 ${
                           strength >= s ? (strength === 2 ? 'bg-indigo-600' : 'bg-amber-500') : ''
                         }`} />
                      </div>
                   ))}
                </div>
                {errors.password && <p className="text-[9px] font-bold text-rose-600 uppercase tracking-widest pl-1">{errors.password.message}</p>}
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Confirm Password</label>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors" size={18} />
                  <input 
                    {...register('confirmPassword')}
                    type="password"
                    placeholder="••••••••"
                    className={`w-full h-14 bg-slate-50/50 border rounded-2xl p-4 pl-12 text-sm font-bold text-slate-900 focus:outline-none transition-all ${
                      errors.confirmPassword ? 'border-rose-300 bg-rose-50' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white'
                    }`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-[9px] font-bold text-rose-600 uppercase tracking-widest pl-1">{errors.confirmPassword.message}</p>}
              </div>

              <p className="text-[10px] font-semibold text-slate-500 leading-normal text-center px-4 pt-2">
                By creating an account, you agree to our <Link to="/terms" className="text-indigo-600 font-bold hover:underline">Terms</Link> and <Link to="/privacy" className="text-indigo-600 font-bold hover:underline">Privacy Policy</Link>.
              </p>

              {apiError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center mt-4">
                  <p className="text-[11px] font-bold text-rose-600">{apiError}</p>
                </div>
              )}

              <motion.button 
                type="submit" 
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-3 mt-8 cursor-pointer relative overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 size={16} className="animate-spin" />
                      <span>Creating Account...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex items-center gap-2"
                    >
                      <span>Create Account</span>
                      <ArrowRight size={16} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>
            </div>
          </motion.div>

          <p className="text-center text-[12px] font-semibold text-slate-500 pt-4">
            Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold ml-1">Login here</Link>
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
