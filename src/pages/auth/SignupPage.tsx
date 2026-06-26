import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { MessageSquare, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useBrandingStore } from '../../store/brandingStore';
import { crmApi } from '../../services/crmApi';

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
    try {
      await signup(data.email, data.name, data.password, selectedPlanKey);
      navigate('/onboarding');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 pb-12">
      <div className="w-full max-w-[440px] space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            {websiteLogo ? (
              <img src={websiteLogo} alt="Logo" className="w-12 h-12 object-contain rounded-2xl shrink-0 shadow-lg shadow-slate-900/5 transition-transform group-hover:rotate-12" />
            ) : (
              <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl transition-transform group-hover:rotate-12">
                <MessageSquare size={26} strokeWidth={2.5} />
              </div>
            )}
            <span className="text-3xl font-black text-slate-900 tracking-tight">{websiteName}</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1.5">Join the future</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Launch your WhatsApp engine in minutes</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200/80 p-8 rounded-[2.5rem] shadow-xl relative"
        >
          {/* Selected Plan Details Card */}
          {activePlan ? (
            <div className="mb-6 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-center justify-between shadow-inner select-none">
              <div className="flex items-center gap-3">
                <div className="w-8.5 h-8.5 rounded-xl bg-indigo-650 text-white flex items-center justify-center font-black">
                  <Sparkles size={14} className="animate-pulse" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Chosen Plan Tier</p>
                  <p className="text-xs font-black text-slate-900 mt-1">{activePlan.name}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-indigo-650 tracking-tight">{activePlan.price}</span>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between select-none">
              <div className="flex items-center gap-3">
                <div className="w-8.5 h-8.5 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center font-black">
                  <Sparkles size={14} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase leading-none">Chosen Plan Tier</p>
                  <p className="text-xs font-black text-slate-700 mt-1">Free Tier</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-slate-500 tracking-tight">$0/month</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest pl-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
                <input 
                  {...register('name')}
                  placeholder="Ali Ahmad"
                  className={`w-full bg-slate-50 border rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold text-slate-900 focus:outline-none transition-all ${
                    errors.name ? 'border-rose-300 bg-rose-50' : 'border-slate-200/80 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5'
                  }`}
                />
              </div>
              {errors.name && <p className="text-[9px] font-bold text-rose-600 pl-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest pl-1">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
                <input 
                  {...register('email')}
                  type="email"
                  placeholder="name@company.com"
                  className={`w-full bg-slate-50 border rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold text-slate-900 focus:outline-none transition-all ${
                    errors.email ? 'border-rose-300 bg-rose-50' : 'border-slate-200/80 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5'
                  }`}
                />
              </div>
              {errors.email && <p className="text-[9px] font-bold text-rose-600 pl-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest pl-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
                <input 
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full bg-slate-50 border rounded-2xl py-3.5 pl-11 pr-12 text-xs font-bold text-slate-900 focus:outline-none transition-all ${
                    errors.password ? 'border-rose-300 bg-rose-50' : 'border-slate-200/80 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5'
                  }`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
              {errors.password && <p className="text-[9px] font-bold text-rose-600 pl-1">{errors.password.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest pl-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
                <input 
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="••••••••"
                  className={`w-full bg-slate-50 border rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold text-slate-900 focus:outline-none transition-all ${
                    errors.confirmPassword ? 'border-rose-300 bg-rose-50' : 'border-slate-200/80 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5'
                  }`}
                />
              </div>
              {errors.confirmPassword && <p className="text-[9px] font-bold text-rose-600 pl-1">{errors.confirmPassword.message}</p>}
            </div>

            <p className="text-[9px] font-semibold text-slate-400 leading-normal text-center px-4 pt-1">
              By creating an account, you agree to our <a href="#" className="text-slate-900 font-bold hover:underline">Terms</a> and <a href="#" className="text-slate-900 font-bold hover:underline">Privacy Policy</a>.
            </p>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 mt-4 cursor-pointer"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin text-white" /> : <>Create Account <ArrowRight size={15} /></>}
            </button>
          </form>
        </motion.div>

        <p className="text-center text-xs font-semibold text-slate-500">
          Already have an account? <Link to="/login" className="text-slate-900 hover:underline underline-offset-4 decoration-2 font-black">Login here</Link>
        </p>
      </div>
    </div>
  );
}
