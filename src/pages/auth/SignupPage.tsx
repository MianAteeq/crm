import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Compass, 
  Bot, 
  Users, 
  Database,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useBrandingStore } from '../../store/brandingStore';
import { crmApi } from '../../services/crmApi';
import logoImg from '../../assets/logo-2.png';
import { useI18n } from '../../i18n';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';
import { cn } from '../../lib/utils';

const signupSchema = z.object({
  name: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.string().trim().email('Please enter a valid work email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
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
  const { t, isRtl } = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        if (res.success && res.plans) {
          setPlans(res.plans);
          const found = res.plans.find((p: DbPlan) => p.key === selectedPlanKey);
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
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password', '');
  const calculateStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
    return Math.min(score, 3);
  };
  const strength = calculateStrength();

  const onSubmit = async (data: SignupForm) => {
    if (isLoading) return;
    setApiError(null);
    try {
      await signup(data.email, data.name, data.password, selectedPlanKey);
      navigate('/onboarding');
    } catch (error: any) {
      console.error('Signup error:', error);
      const message = 
        error.response?.data?.message || 
        error.response?.data?.error || 
        (error.response?.data?.errors ? Object.values(error.response.data.errors).flat().join(', ') : null) ||
        error.message || 
        'Unable to create account. Please verify your details and try again.';
      setApiError(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans selection:bg-[#F0FDF4] selection:text-[#166534] flex flex-col lg:flex-row">
      
      {/* ============================================================== */}
      {/* LEFT PANEL: PRODUCT VALUE & ENTERPRISE CAPABILITIES (DESKTOP)   */}
      {/* ============================================================== */}
      <aside className="relative hidden lg:flex lg:w-5/12 xl:w-5/12 bg-[#12263A] text-white flex-col justify-between p-10 xl:p-14 overflow-hidden border-r border-white/5">
        {/* Subtle Ambient Tech Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#166534]/25 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#22C55E]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Top: Logo Link */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] rounded-xl p-1">
            <img 
              src={websiteLogo || logoImg} 
              alt={websiteName || 'ThrobTech'} 
              className="h-10 md:h-11 w-auto max-w-[220px] object-contain shrink-0 transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>
        </div>

        {/* Middle: Clear Product Value Proposition */}
        <div className="relative z-10 my-auto py-8 space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-xs font-semibold text-[#F0FDF4]">
              <Sparkles size={13} className="text-[#22C55E]" />
              <span>{t('auth.signup.heroDescription')}</span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight text-white">
              {t('auth.signup.heroTitle')}
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed max-w-md">
              {isRtl 
                ? 'منصة موحدة مصممة لفرق المبيعات والنمو لأتمتة التواصل والوصول لصناع القرار وإدارة المحادثات بدقة متناهية.' 
                : 'A unified platform designed for modern sales teams to prospect, reach decision-makers, and track deal stages with automated precision.'}
            </p>
          </div>

          {/* Genuine Product Feature Highlights */}
          <div className="space-y-4 pt-1">
            <div className={cn("flex items-start gap-3.5", isRtl ? "text-right" : "text-left")}>
              <div className="w-9 h-9 rounded-xl bg-[#166534]/40 border border-[#22C55E]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#22C55E]">
                <Compass size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">
                  {isRtl ? 'البحث عن الأنشطة التجارية واستخراج المواقع' : 'Google Places & Website Scraper'}
                </h3>
                <p className="text-[11px] text-stone-300 mt-0.5 leading-relaxed">
                  {isRtl 
                    ? 'استخرج ملفات الشركات العامة، وتحقق من العناوين، وافحص صفحات التواصل تلقائيًا.' 
                    : 'Extract public company profiles, normalize verified addresses, and inspect contact pages.'}
                </p>
              </div>
            </div>

            <div className={cn("flex items-start gap-3.5", isRtl ? "text-right" : "text-left")}>
              <div className="w-9 h-9 rounded-xl bg-[#166534]/40 border border-[#22C55E]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#22C55E]">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">
                  {isRtl ? 'مساعد التسويق عبر البريد الإلكتروني بالذكاء الاصطناعي' : 'AI Email Marketing Agent'}
                </h3>
                <p className="text-[11px] text-stone-300 mt-0.5 leading-relaxed">
                  {isRtl 
                    ? 'أطلق حملات تواصل مخصصة للشركات بنطاقات إرسال موثقة، وإعدادات DKIM، وضوابط أمان متكاملة.' 
                    : 'Orchestrate personalized B2B outreach with verified sending domains, DKIM, and safety limits.'}
                </p>
              </div>
            </div>

            <div className={cn("flex items-start gap-3.5", isRtl ? "text-right" : "text-left")}>
              <div className="w-9 h-9 rounded-xl bg-[#166534]/40 border border-[#22C55E]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#22C55E]">
                <Users size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">
                  {isRtl ? 'إدارة مركزية لشرائح الجمهور' : 'Centralized Audience Management'}
                </h3>
                <p className="text-[11px] text-stone-300 mt-0.5 leading-relaxed">
                  {isRtl 
                    ? 'أدر جهات الاتصال، والتصنيفات، والسمات المخصصة، وسجل المحادثات متعدد القنوات من مكان واحد.' 
                    : 'Manage contacts, tags, custom attributes, and multi-channel message histories in one place.'}
                </p>
              </div>
            </div>
          </div>

          {/* Transparent Security & Trust Assurance */}
          <div className={cn("bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4.5 space-y-2", isRtl ? "text-right" : "text-left")}>
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <ShieldCheck size={16} className="text-[#22C55E]" />
              <span>{isRtl ? 'خصوصية المؤسسات وأمان المنصة' : 'Enterprise Privacy & Platform Security'}</span>
            </div>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              {isRtl 
                ? 'تحصل كل منشأة على عزل مخصص لبياناتها، وتشفير تلقائي أثناء النقل والتخزين، والتحقق من ملكية نطاقات DNS قبل بدء الإرسال.' 
                : 'Every organization receives dedicated tenant isolation, automated encryption at rest and in transit, and DNS ownership validation before sending.'}
            </p>
          </div>
        </div>

        {/* Bottom Capabilities Pill Bar */}
        <div className="relative z-10 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs font-bold text-white">{isRtl ? 'موثّق' : 'Verified'}</p>
            <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mt-0.5">
              {isRtl ? 'نطاق DNS' : 'Domain DNS'}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold text-[#22C55E]">{isRtl ? 'معزول' : 'Isolated'}</p>
            <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mt-0.5">
              {isRtl ? 'بيانات المشترك' : 'Tenant Data'}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold text-white">{isRtl ? 'مدمج' : 'Built-In'}</p>
            <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mt-0.5">
              {isRtl ? 'استخراج العملاء' : 'Lead Scraper'}
            </p>
          </div>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* RIGHT PANEL: REGISTRATION FORM                                 */}
      {/* ============================================================== */}
      <main className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 overflow-y-auto">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between pb-6 sm:pb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-bold text-[#57534E] hover:text-[#12263A] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] rounded-lg p-1"
          >
            <ArrowLeft size={16} className={cn(isRtl && "rotate-180")} />
            <span>{isRtl ? 'العودة إلى الرئيسية' : 'Back to Home'}</span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="auth" />
            <div className="text-xs font-medium text-[#57534E]">
              {isRtl ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
              <Link 
                to="/login" 
                className="font-bold text-[#166534] hover:text-[#12263A] hover:underline ml-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] rounded"
              >
                {isRtl ? 'تسجيل الدخول' : 'Sign In'}
              </Link>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-[460px] w-full mx-auto my-auto space-y-6">
          
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30 rounded-full text-[11px] font-bold">
                <Sparkles size={12} className="text-[#22C55E]" />
                {activePlan ? `Selected: ${activePlan.name} Trial` : (isRtl ? 'تجربة مجانية لمدة 14 يومًا • دون بطاقة ائتمان' : '14-Day Free Trial • No Credit Card')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#12263A] tracking-tight">
              {t('auth.signup.heroTitle')}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-[#57534E]">
              {t('auth.signup.heroDescription')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="name-input" className="block text-[11px] font-bold text-[#57534E] uppercase tracking-wider pl-1">
                {t('auth.signup.fullNameLabel')} <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <div className="relative group/input">
                <User 
                  className={cn("absolute top-1/2 -translate-y-1/2 text-stone-400 group-focus-within/input:text-[#166534] transition-colors pointer-events-none", isRtl ? "right-4" : "left-4")}
                  size={18} 
                  aria-hidden="true"
                />
                <input 
                  id="name-input"
                  {...register('name')}
                  type="text"
                  autoComplete="name"
                  placeholder={isRtl ? "اسمك الكامل" : "Your full name"}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className={`w-full h-12 bg-white border rounded-xl p-3.5 ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-sm font-semibold text-[#12263A] placeholder:text-stone-400 focus:outline-none transition-all ${
                    errors.name 
                      ? 'border-rose-300 bg-rose-50/40 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' 
                      : 'border-stone-200 focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/15'
                  }`}
                />
              </div>
              {errors.name && (
                <p id="name-error" className="text-[11px] font-bold text-rose-600 pl-1 animate-fade-in" role="alert">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Work Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email-input" className="block text-[11px] font-bold text-[#57534E] uppercase tracking-wider pl-1">
                {t('auth.signup.workEmailLabel')} <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <div className="relative group/input">
                <Mail 
                  className={cn("absolute top-1/2 -translate-y-1/2 text-stone-400 group-focus-within/input:text-[#166534] transition-colors pointer-events-none", isRtl ? "right-4" : "left-4")}
                  size={18} 
                  aria-hidden="true"
                />
                <input 
                  id="email-input"
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  dir="ltr"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`w-full h-12 bg-white border rounded-xl p-3.5 ${isRtl ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'} text-sm font-semibold text-[#12263A] placeholder:text-stone-400 focus:outline-none transition-all ${
                    errors.email 
                      ? 'border-rose-300 bg-rose-50/40 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' 
                      : 'border-stone-200 focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/15'
                  }`}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-[11px] font-bold text-rose-600 pl-1 animate-fade-in" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password & Confirm Password Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password-input" className="block text-[11px] font-bold text-[#57534E] uppercase tracking-wider pl-1">
                  {t('auth.fields.passwordLabel')} <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <div className="relative group/input">
                  <Lock 
                    className={cn("absolute top-1/2 -translate-y-1/2 text-stone-400 group-focus-within/input:text-[#166534] transition-colors pointer-events-none", isRtl ? "right-4" : "left-4")}
                    size={17} 
                    aria-hidden="true"
                  />
                  <input 
                    id="password-input"
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder={isRtl ? "٦ خانات كحد أدنى" : "Min. 6 chars"}
                    dir="ltr"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    className={`w-full h-12 bg-white border rounded-xl p-3.5 ${isRtl ? 'pr-11 pl-10 text-right' : 'pl-11 pr-10 text-left'} text-sm font-semibold text-[#12263A] placeholder:text-stone-400 focus:outline-none transition-all ${
                      errors.password 
                        ? 'border-rose-300 bg-rose-50/40 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' 
                        : 'border-stone-200 focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/15'
                    }`}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className={cn("absolute top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#12263A] transition-colors cursor-pointer p-1 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#166534]", isRtl ? "left-3.5" : "right-3.5")}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirm-password-input" className="block text-[11px] font-bold text-[#57534E] uppercase tracking-wider pl-1">
                  {t('auth.signup.confirmPasswordLabel')} <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <div className="relative group/input">
                  <Lock 
                    className={cn("absolute top-1/2 -translate-y-1/2 text-stone-400 group-focus-within/input:text-[#166534] transition-colors pointer-events-none", isRtl ? "right-4" : "left-4")}
                    size={17} 
                    aria-hidden="true"
                  />
                  <input 
                    id="confirm-password-input"
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder={isRtl ? "كرر كلمة المرور" : "Repeat password"}
                    dir="ltr"
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                    className={`w-full h-12 bg-white border rounded-xl p-3.5 ${isRtl ? 'pr-11 pl-10 text-right' : 'pl-11 pr-10 text-left'} text-sm font-semibold text-[#12263A] placeholder:text-stone-400 focus:outline-none transition-all ${
                      errors.confirmPassword 
                        ? 'border-rose-300 bg-rose-50/40 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' 
                        : 'border-stone-200 focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/15'
                    }`}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    className={cn("absolute top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#12263A] transition-colors cursor-pointer p-1 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#166534]", isRtl ? "left-3.5" : "right-3.5")}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className="space-y-1 pt-1" aria-live="polite">
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((level) => (
                    <div 
                      key={level} 
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        strength >= level
                          ? strength === 3 
                            ? 'bg-[#166534]' 
                            : strength === 2 
                              ? 'bg-[#22C55E]' 
                              : 'bg-amber-500'
                          : 'bg-stone-200'
                      }`} 
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#57534E] px-0.5">
                  <span>
                    {isRtl ? 'قوة كلمة المرور: ' : 'Password Strength: '}
                    <strong className={strength === 3 ? 'text-[#166534]' : strength === 2 ? 'text-emerald-600' : 'text-amber-600'}>
                      {strength === 3 
                        ? (isRtl ? 'قوية' : 'Strong') 
                        : strength === 2 
                          ? (isRtl ? 'متوسطة' : 'Medium') 
                          : (isRtl ? 'ضعيفة' : 'Weak')}
                    </strong>
                  </span>
                  <span>{isRtl ? '٦ خانات كحد أدنى تحتوي حروفًا وأرقامًا' : 'Min. 6 chars with letters & numbers'}</span>
                </div>
              </div>
            )}

            {errors.password && (
              <p id="password-error" className="text-[11px] font-bold text-rose-600 pl-1" role="alert">{errors.password.message}</p>
            )}
            {errors.confirmPassword && (
              <p id="confirm-password-error" className="text-[11px] font-bold text-rose-600 pl-1" role="alert">{errors.confirmPassword.message}</p>
            )}

            {/* API Error Notification */}
            {apiError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-left" role="alert">
                <p className="text-xs font-bold text-rose-700 leading-snug">{apiError}</p>
              </div>
            )}

            {/* Terms and Privacy Policy Note */}
            <p className="text-[11px] font-medium text-[#57534E] leading-relaxed pt-1">
              {t('auth.signup.consent')}
            </p>

            {/* Submit Action Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-[#166534] hover:bg-[#14532d] active:bg-[#0f3d21] text-white text-xs font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-[#166534]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] focus-visible:ring-offset-2"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 size={16} className="animate-spin" />
                    <span>{isRtl ? 'جارٍ إنشاء حسابك...' : 'Creating Your Account...'}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <span>{t('auth.signup.submit')}</span>
                    <ArrowRight size={15} className={cn(isRtl && "rotate-180")} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </form>
        </div>

        {/* Security & Verification Guarantees */}
        <footer className="pt-6 mt-8 border-t border-stone-200/80 flex flex-wrap items-center justify-center gap-6 text-[11px] font-bold text-[#57534E]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#166534]" /> 
            <span>{isRtl ? 'تشفير SSL بقوة 256 بت' : '256-Bit SSL Encryption'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-[#166534]" /> 
            <span>{isRtl ? 'عزل مخصص لبيانات المشترك' : 'Dedicated Tenant Isolation'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-[#166534]" /> 
            <span>{isRtl ? 'دون الحاجة لبطاقة ائتمان' : 'No Credit Card Required'}</span>
          </span>
        </footer>
      </main>
    </div>
  );
}
