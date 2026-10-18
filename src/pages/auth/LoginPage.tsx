import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { MessageSquare, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useBrandingStore } from '../../store/brandingStore';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import { useI18n } from '../../i18n';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';
import { cn } from '../../lib/utils';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { websiteName } = useBrandingStore();
  const { t, isRtl } = useI18n();
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
      const user = useAuthStore.getState().user;
      const targetPath = user?.role === 'superadmin' ? '/admin' : from;
      navigate(targetPath, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : (isRtl ? 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.' : 'Login failed. Please try again.'));
    }
  };

  return (
    <div className="bg-[#FAFAF9] min-h-screen flex flex-col justify-between selection:bg-[#F0FDF4] selection:text-[#166534] font-sans">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-6 pt-32 pb-24 bg-[#FAFAF9] relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#22C55E]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#166534]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-[440px] space-y-8 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <LanguageSwitcher variant="auth" />
            </div>
            <h1 className="text-3xl font-extrabold text-[#12263A] tracking-tight mb-3">{t('auth.login.heroTitle')}</h1>
            <p className="text-xs font-bold text-[#57534E] uppercase tracking-widest px-4">{t('auth.login.heroDescription')}</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
          >
            {/* Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#12263A] via-[#166534] to-[#22C55E] rounded-[3rem] blur-xl opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>

            <div className="bg-white/95 backdrop-blur-xl border border-stone-200 p-10 rounded-[2.5rem] shadow-2xl relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-6 py-1.5 bg-[#12263A] border border-[#22C55E]/30 text-[#22C55E] text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg whitespace-nowrap">
                {t('auth.login.formTitle')}
              </div>

              {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-in fade-in slide-in-from-top-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                    <Lock size={14} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                    {error}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
                <div className="space-y-2.5 text-start">
                  <label className="text-[10px] font-black text-[#57534E] uppercase tracking-widest">{t('auth.login.businessEmailLabel')}</label>
                  <div className="relative group/input">
                    <Mail className={cn("absolute top-1/2 -translate-y-1/2 text-stone-400 group-focus-within/input:text-[#166534] transition-colors", isRtl ? "right-4" : "left-4")} size={18} />
                    <input 
                      {...register('email')}
                      type="email"
                      placeholder="name@company.com"
                      className={`w-full h-14 bg-[#FAFAF9] border rounded-2xl p-4 ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-sm font-bold text-[#12263A] focus:outline-none transition-all ${
                        errors.email ? 'border-rose-300 bg-rose-50' : 'border-stone-200 focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-[9px] font-bold text-rose-600 uppercase tracking-widest">{errors.email.message}</p>}
                </div>

                <div className="space-y-2.5 text-start">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-[#57534E] uppercase tracking-widest">{t('auth.fields.passwordLabel')}</label>
                    <button type="button" className="text-[10px] font-bold text-[#166534] hover:text-[#12263A] transition-colors">{t('auth.login.forgotPassword')}</button>
                  </div>
                  <div className="relative group/input">
                    <Lock className={cn("absolute top-1/2 -translate-y-1/2 text-stone-400 group-focus-within/input:text-[#166534] transition-colors", isRtl ? "right-4" : "left-4")} size={18} />
                    <input 
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className={`w-full h-14 bg-[#FAFAF9] border rounded-2xl p-4 ${isRtl ? 'pr-12 pl-12' : 'pl-12 pr-12'} text-sm font-bold text-[#12263A] focus:outline-none transition-all ${
                        errors.password ? 'border-rose-300 bg-rose-50' : 'border-stone-200 focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 focus:bg-white'
                      }`}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className={cn("absolute top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#12263A] transition-colors", isRtl ? "left-4" : "right-4")}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[9px] font-bold text-rose-600 uppercase tracking-widest">{errors.password.message}</p>}
                </div>

                <motion.button 
                  type="submit" 
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="w-full h-14 bg-gradient-to-r from-[#12263A] to-[#166534] hover:from-[#0a1826] hover:to-[#14532d] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl disabled:opacity-50 transition-all shadow-xl shadow-[#12263A]/20 flex items-center justify-center gap-3 mt-8 cursor-pointer relative overflow-hidden"
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
                        <span>{isRtl ? 'جاري التحقق...' : 'Authenticating...'}</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center gap-2"
                      >
                        <span>{t('auth.login.submit')}</span>
                        <ArrowRight size={16} className={cn(isRtl && "rotate-180")} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
            </div>
          </motion.div>

          <p className="text-center text-[12px] font-semibold text-[#57534E] pt-4">
            <Link to="/signup" className="text-[#166534] hover:text-[#12263A] font-bold">
              {t('auth.login.signupPrompt')}
            </Link>
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
