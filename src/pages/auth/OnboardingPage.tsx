import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Mail, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  Compass, 
  Users,
  Bot,
  AlertCircle
} from 'lucide-react';
import OnboardingHeader from '../../components/auth/OnboardingHeader';
import { crmApi } from '../../services/crmApi';
import { useI18n } from '../../i18n';
import { cn } from '../../lib/utils';

export default function OnboardingPage() {
  const { user, updateOnboarding, updateProfile, verifyEmail, resendVerification } = useAuthStore();
  const navigate = useNavigate();
  const { t, isRtl } = useI18n();

  // Determine initial step: if user's email is already verified, allow moving to workspace
  const isInitiallyVerified = Boolean(user?.emailVerified || user?.email_verified_at);
  const [step, setStep] = useState<number>(isInitiallyVerified ? 2 : 1);
  
  // Workspace Setup State
  const defaultWorkspaceName = user?.businessName && user.businessName !== 'Workspace' && user.businessName !== 'ThrobTech Workspace'
    ? user.businessName
    : user?.name 
      ? `${user.name.split(' ')[0]}'s Workspace`
      : 'My Workspace';

  const [businessName, setBusinessName] = useState(defaultWorkspaceName);
  const [industry, setIndustry] = useState('Technology & SaaS');
  const [primaryGoal, setPrimaryGoal] = useState('Email Marketing & Lead Discovery');
  const [isSavingWorkspace, setIsSavingWorkspace] = useState(false);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  
  // 6-Digit OTP State (starts 100% empty)
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(isInitiallyVerified);
  
  // Resend Countdown Timer State
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update business name default if user loads late
  useEffect(() => {
    if (user?.name && (!businessName || businessName === 'My Workspace')) {
      const generated = `${user.name.split(' ')[0]}'s Workspace`;
      setBusinessName(generated);
    }
    if (user?.emailVerified || user?.email_verified_at) {
      setIsVerified(true);
    }
  }, [user]);

  // Resend timer countdown logic
  useEffect(() => {
    let interval: any;
    if (resendCooldown > 0 && !canResend) {
      interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown, canResend]);

  // OTP Input Handlers (Numeric only, auto-advance, backspace)
  const handleDigitChange = (index: number, value: string) => {
    const numericChar = value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = numericChar.slice(-1);
    setOtp(newOtp);
    setVerifyError(null);

    if (numericChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '');
    if (pastedData.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || '';
      }
      setOtp(newOtp);
      setVerifyError(null);
      const targetFocusIdx = Math.min(pastedData.length, 5);
      inputRefs.current[targetFocusIdx]?.focus();
    }
  };

  // Submit OTP Verification to backend
  const handleConfirmVerification = async () => {
    const fullCode = otp.join('').trim();
    if (fullCode.length !== 6) {
      setVerifyError(isRtl ? 'يرجى إدخال جميع أرقام رمز التحقق الستة.' : 'Please enter all 6 digits of your verification code.');
      return;
    }

    setIsVerifying(true);
    setVerifyError(null);

    try {
      await verifyEmail(fullCode);
      setIsVerified(true);
      setTimeout(() => {
        setStep(2);
      }, 600);
    } catch (err: any) {
      console.error('Email verification error:', err);
      const msg = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        (isRtl ? 'رمز التحقق غير صالح أو انتهت صلاحيته. يرجى التحقق من بريدك والمحاولة مجددًا.' : 'Invalid or expired verification code. Please check your inbox and try again.');
      setVerifyError(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    if (!canResend || isResending) return;
    setIsResending(true);
    setResendError(null);
    setResendMessage(null);

    try {
      await resendVerification();
      setCanResend(false);
      setResendCooldown(60);
      setResendMessage(isRtl ? 'تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني.' : 'A fresh verification code has been dispatched to your email.');
      setTimeout(() => setResendMessage(null), 5000);
    } catch (err: any) {
      console.error('Resend error:', err);
      const msg = err.response?.data?.message || (isRtl ? 'فشل إرسال رمز التحقق. يرجى المحاولة مرة أخرى.' : 'Failed to dispatch new verification code. Please try again.');
      setResendError(msg);
    } finally {
      setIsResending(false);
    }
  };

  // Save workspace and continue
  const handleSaveWorkspace = async () => {
    const trimmed = businessName.trim();
    if (!trimmed) {
      setWorkspaceError(isRtl ? 'يرجى إدخال اسم لمساحة العمل الخاصة بك.' : 'Please enter a name for your workspace.');
      return;
    }

    setIsSavingWorkspace(true);
    setWorkspaceError(null);

    try {
      if (user?.name) {
        await crmApi.updateProfile({
          name: user.name,
          business_name: trimmed
        });
      }
      updateProfile({ businessName: trimmed });
      updateOnboarding(3, { businessName: trimmed });
      setStep(3);
    } catch (err: any) {
      console.error('Failed to update workspace profile:', err);
      updateProfile({ businessName: trimmed });
      updateOnboarding(3, { businessName: trimmed });
      setStep(3);
    } finally {
      setIsSavingWorkspace(false);
    }
  };

  // Launch Dashboard
  const handleLaunchDashboard = () => {
    updateOnboarding(4);
    navigate('/dashboard');
  };

  const steps = [
    { number: 1, title: t('auth.onboarding.step1_nav', 'Email Verify'), icon: Mail },
    { number: 2, title: t('auth.onboarding.step2_nav', 'Workspace'), icon: Building2 },
    { number: 3, title: t('auth.onboarding.step3_nav', 'Ready'), icon: CheckCircle2 },
  ];

  const industries = isRtl ? [
    { key: 'Technology & SaaS', label: 'التكنولوجيا والبرمجيات كخدمة' },
    { key: 'Marketing & Advertising Agency', label: 'وكالات التسويق والإعلانات' },
    { key: 'Real Estate & Property', label: 'العقارات وإدارة الأملاك' },
    { key: 'E-Commerce & D2C', label: 'التجارة الإلكترونية والبيع المباشر' },
    { key: 'Healthcare, Medical & Clinics', label: 'الرعاية الصحية والمراكز الطبية والعيادات' },
    { key: 'Financial, Legal & Professional Services', label: 'الخدمات المالية والقانونية والمهنية' },
    { key: 'Education & Training', label: 'التعليم والتدريب' },
    { key: 'Hospitality & Tourism', label: 'الضيافة والسياحة' },
    { key: 'Other Business Services', label: 'خدمات الأعمال الأخرى' }
  ] : [
    { key: 'Technology & SaaS', label: 'Technology & SaaS' },
    { key: 'Marketing & Advertising Agency', label: 'Marketing & Advertising Agency' },
    { key: 'Real Estate & Property', label: 'Real Estate & Property' },
    { key: 'E-Commerce & D2C', label: 'E-Commerce & D2C' },
    { key: 'Healthcare, Medical & Clinics', label: 'Healthcare, Medical & Clinics' },
    { key: 'Financial, Legal & Professional Services', label: 'Financial, Legal & Professional Services' },
    { key: 'Education & Training', label: 'Education & Training' },
    { key: 'Hospitality & Tourism', label: 'Hospitality & Tourism' },
    { key: 'Other Business Services', label: 'Other Business Services' }
  ];

  const goals = [
    {
      id: 'Email Marketing & Lead Discovery',
      title: isRtl ? 'التسويق واكتشاف العملاء المحتملين' : 'Email Marketing & Lead Discovery',
      desc: isRtl ? 'اكتشف فرص الأعمال، وافحص صفحات التواصل وأطلق مسارات تواصل موثقة.' : 'Discover business leads, inspect contact pages & launch verified email sequences.',
      icon: Compass
    },
    {
      id: 'Customer Relationship Management',
      title: isRtl ? 'دليل العملاء وتصنيف الشرائح' : 'Customer Directory & Segmentation',
      desc: isRtl ? 'اجمع جهات الاتصال، ونظم التصنيفات، وتتبع الأنشطة وأدر صفقات مسار المبيعات.' : 'Centralize contacts, organize tags, track activities & manage pipeline deals.',
      icon: Users
    },
    {
      id: 'AI Marketing Automation',
      title: isRtl ? 'أتمتة الحملات بالذكاء الاصطناعي' : 'AI Campaign Orchestration',
      desc: isRtl ? 'فعّل مساعدي الذكاء الاصطناعي لصياغة تواصل مخصص للشركات بمعدلات تسليم موثوقة.' : 'Deploy AI agents to craft personalized B2B outreach with verified deliverability.',
      icon: Bot
    }
  ];

  return (
    <div className={cn("min-h-screen bg-[#FAFAF9] flex flex-col justify-between font-sans selection:bg-[#F0FDF4] selection:text-[#166534]", isRtl && "font-arabic")}>
      {/* Unified Onboarding Header */}
      <OnboardingHeader showLogout={true} />
      
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 z-10 w-full relative">
        <div className="w-full max-w-[580px] space-y-6 sm:space-y-8 my-auto">
          
          {/* ============================================================== */}
          {/* 3-STEP PROGRESS STEPPER                                        */}
          {/* ============================================================== */}
          <nav aria-label="Onboarding Progress" className="px-4 sm:px-8">
            <ol className="flex items-center justify-between relative">
              {/* Background Connecting Line */}
              <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-stone-200 -z-10" />
              
              {/* Active Progress Fill Line */}
              <div 
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 h-[2px] bg-[#166534] -z-10 transition-all duration-500 ease-out",
                  isRtl ? "right-8" : "left-8"
                )}
                style={{ width: `calc(${(step - 1) / 2} * calc(100% - 64px))` }}
              />
              
              {steps.map((s) => {
                const isCompleted = step > s.number || (s.number === 1 && isVerified);
                const isCurrent = step === s.number;
                const Icon = s.icon;
                return (
                  <li 
                    key={s.number} 
                    className="flex flex-col items-center gap-2 relative bg-[#FAFAF9] px-2"
                    aria-current={isCurrent ? 'step' : undefined}
                  >
                    <div 
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-[#166534] text-white shadow-sm shadow-[#166534]/25' 
                          : isCurrent 
                            ? 'bg-white border-2 border-[#166534] text-[#166534] ring-4 ring-[#22C55E]/15 shadow-xs' 
                            : 'bg-white border-2 border-stone-200 text-stone-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={18} strokeWidth={2.5} />
                      ) : (
                        <Icon size={18} strokeWidth={isCurrent ? 2.5 : 2} />
                      )}
                    </div>
                    <span 
                      className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${
                        isCurrent 
                          ? 'text-[#166534]' 
                          : isCompleted 
                            ? 'text-[#12263A]' 
                            : 'text-stone-400'
                      }`}
                    >
                      {s.title}
                    </span>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* ============================================================== */}
          {/* MAIN ONBOARDING CARD                                           */}
          {/* ============================================================== */}
          <div className="bg-white border border-stone-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-sm sm:shadow-lg shadow-stone-200/40 relative overflow-hidden">
            <AnimatePresence mode="wait">
              
              {/* ------------------------------------------------------------ */}
              {/* STEP 1: EMAIL VERIFICATION                                   */}
              {/* ------------------------------------------------------------ */}
              {step === 1 && (
                <motion.div 
                  key="step-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className={cn("space-y-2 text-center", isRtl ? "sm:text-right" : "sm:text-left")}>
                    <div className={cn("w-12 h-12 rounded-2xl bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30 flex items-center justify-center mb-3 mx-auto shadow-xs", isRtl ? "sm:mr-0 sm:ml-auto" : "sm:mx-0")}>
                      <Mail size={22} strokeWidth={2} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12263A] tracking-tight">
                      {t('auth.onboarding.verify_title', 'Verify your email address')}
                    </h2>
                    <p className="text-xs sm:text-sm font-medium text-[#57534E] leading-relaxed">
                      {isRtl ? (
                        <>
                          أرسلنا رمز تحقق مكوّن من 6 أرقام إلى{' '}
                          <strong className="text-[#12263A] font-bold break-all" dir="ltr">{user?.email || 'بريدك الإلكتروني'}</strong>.
                          أدخله أدناه لتأكيد ملكية حسابك.
                        </>
                      ) : (
                        <>
                          We've dispatched a 6-digit verification code to{' '}
                          <strong className="text-[#12263A] font-bold break-all">{user?.email || 'your email'}</strong>.
                          Enter it below to confirm your account ownership.
                        </>
                      )}
                    </p>
                  </div>

                  {/* 6 Digit Numeric OTP Inputs */}
                  <div className="space-y-2 pt-2">
                    <label className={cn("block text-[11px] font-bold text-[#57534E] uppercase tracking-wider text-center", isRtl ? "sm:text-right" : "sm:text-left")}>
                      {t('auth.onboarding.otp_label', '6-Digit Verification Code')}
                    </label>
                    <div 
                      className={cn("grid grid-cols-6 gap-2 sm:gap-3 max-w-sm mx-auto", isRtl ? "sm:mr-0 sm:ml-auto" : "sm:mx-0")}
                      dir="ltr"
                      onPaste={handlePaste}
                    >
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => { inputRefs.current[idx] = el; }}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                          aria-label={`Digit ${idx + 1}`}
                          value={digit}
                          onChange={(e) => handleDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(idx, e)}
                          className={`w-full aspect-square text-center text-xl sm:text-2xl font-black rounded-xl border transition-all focus:outline-none ${
                            digit
                              ? 'border-[#166534] bg-[#F0FDF4] text-[#12263A] shadow-xs'
                              : 'border-stone-200 bg-white text-[#12263A] focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/15'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Error Notification */}
                  {verifyError && (
                    <div className={cn("p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 animate-fade-in", isRtl ? "text-right" : "text-left")} role="alert">
                      <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                      <p className="text-xs font-bold text-rose-700 leading-snug">{verifyError}</p>
                    </div>
                  )}

                  {/* Resend Success Notification */}
                  {resendMessage && (
                    <div className={cn("p-3.5 bg-[#F0FDF4] border border-[#22C55E]/30 rounded-xl flex items-start gap-2.5 animate-fade-in", isRtl ? "text-right" : "text-left")} role="status">
                      <CheckCircle2 size={16} className="text-[#166534] shrink-0 mt-0.5" />
                      <p className="text-xs font-bold text-[#166534] leading-snug">{resendMessage}</p>
                    </div>
                  )}

                  {resendError && (
                    <div className={cn("p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 animate-fade-in", isRtl ? "text-right" : "text-left")} role="alert">
                      <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                      <p className="text-xs font-bold text-rose-700 leading-snug">{resendError}</p>
                    </div>
                  )}

                  {/* Trust Footer & Resend Link */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs border-t border-stone-100 mt-6">
                    <div className="flex items-center gap-1.5 font-medium text-[#57534E]">
                      <ShieldCheck size={16} className="text-[#166534]" />
                      <span>{t('auth.onboarding.security_protection', 'Enterprise deliverability protection')}</span>
                    </div>
                    <div>
                      {canResend ? (
                        <button
                          type="button"
                          onClick={handleResendCode}
                          disabled={isResending}
                          className="font-bold text-[#166534] hover:text-[#12263A] underline cursor-pointer disabled:opacity-50"
                        >
                          {isResending ? t('auth.onboarding.resending', 'Dispatching...') : t('auth.onboarding.resend_code', 'Resend Code')}
                        </button>
                      ) : (
                        <span className="text-stone-400 font-medium">
                          {isRtl ? (
                            <>إعادة الإرسال خلال <strong className="text-[#12263A] font-bold">{resendCooldown} ثانية</strong></>
                          ) : (
                            <>Resend code in <strong className="text-[#12263A] font-bold">{resendCooldown}s</strong></>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleConfirmVerification}
                      disabled={isVerifying || otp.join('').trim().length !== 6}
                      className="w-full h-12 bg-[#166534] hover:bg-[#14532d] active:bg-[#0f3d21] text-white text-xs font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-[#166534]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#166534]"
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw size={15} className="animate-spin text-white" />
                          <span>{t('auth.onboarding.verifying', 'Verifying Code...')}</span>
                        </>
                      ) : (
                        <>
                          <span>{t('auth.onboarding.verify_button', 'Verify & Continue')}</span>
                          <ArrowRight size={15} className={cn(isRtl && "rotate-180")} />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ------------------------------------------------------------ */}
              {/* STEP 2: WORKSPACE SETUP                                      */}
              {/* ------------------------------------------------------------ */}
              {step === 2 && (
                <motion.div 
                  key="step-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className={cn("space-y-2 text-center", isRtl ? "sm:text-right" : "sm:text-left")}>
                    <div className={cn("w-12 h-12 rounded-2xl bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30 flex items-center justify-center mb-3 mx-auto shadow-xs", isRtl ? "sm:mr-0 sm:ml-auto" : "sm:mx-0")}>
                      <Building2 size={22} strokeWidth={2} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12263A] tracking-tight">
                      {t('auth.onboarding.workspace_title', 'Configure your workspace')}
                    </h2>
                    <p className="text-xs sm:text-sm font-medium text-[#57534E] leading-relaxed">
                      {t('auth.onboarding.workspace_subtitle', 'Set up your company workspace profile and choose your primary growth focus.')}
                    </p>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleSaveWorkspace(); }} className="space-y-5">
                    
                    {/* Workspace / Company Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="workspace-name-input" className={cn("block text-[11px] font-bold text-[#57534E] uppercase tracking-wider", isRtl ? "text-right pr-1" : "text-left pl-1")}>
                        {t('auth.onboarding.workspace_name_label', 'Workspace / Company Name')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="workspace-name-input"
                        type="text"
                        value={businessName}
                        onChange={(e) => {
                          setBusinessName(e.target.value);
                          setWorkspaceError(null);
                        }}
                        placeholder={isRtl ? "مثال: شركة النجم للتجارة" : "e.g. Acme Corporation"}
                        className={cn("w-full h-12 bg-white border border-stone-200 focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/15 rounded-xl px-4 text-sm font-semibold text-[#12263A] transition-all outline-none", isRtl ? "text-right" : "text-left")}
                      />
                      {workspaceError && (
                        <p className={cn("text-[11px] font-bold text-rose-600", isRtl ? "pr-1 text-right" : "pl-1 text-left")} role="alert">{workspaceError}</p>
                      )}
                    </div>

                    {/* Industry Selector */}
                    <div className="space-y-1.5">
                      <label htmlFor="industry-select" className={cn("block text-[11px] font-bold text-[#57534E] uppercase tracking-wider", isRtl ? "text-right pr-1" : "text-left pl-1")}>
                        {t('auth.onboarding.industry_label', 'Industry / Business Category')}
                      </label>
                      <select
                        id="industry-select"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className={cn("w-full h-12 bg-white border border-stone-200 focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/15 rounded-xl px-4 text-sm font-semibold text-[#12263A] transition-all outline-none cursor-pointer", isRtl ? "text-right" : "text-left")}
                      >
                        {industries.map((ind) => (
                          <option key={ind.key} value={ind.key}>{ind.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Primary Objective Options */}
                    <div className="space-y-2 pt-1">
                      <label className={cn("block text-[11px] font-bold text-[#57534E] uppercase tracking-wider", isRtl ? "text-right pr-1" : "text-left pl-1")}>
                        {t('auth.onboarding.goal_label', 'Primary Growth Focus')}
                      </label>
                      <div className="space-y-2.5">
                        {goals.map((g) => {
                          const Icon = g.icon;
                          const isSelected = primaryGoal === g.id;
                          return (
                            <button
                              type="button"
                              key={g.id}
                              onClick={() => setPrimaryGoal(g.id)}
                              className={cn(
                                "w-full p-3.5 rounded-xl border transition-all flex items-center gap-3.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#166534]",
                                isRtl ? "text-right flex-row-reverse" : "text-left",
                                isSelected 
                                  ? 'border-[#166534] bg-[#F0FDF4] shadow-xs' 
                                  : 'border-stone-200 hover:border-stone-300 bg-white'
                              )}
                            >
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-[#166534] text-white' : 'bg-stone-100 text-[#57534E]'
                              }`}>
                                <Icon size={18} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-[#12263A]">{g.title}</p>
                                <p className="text-[11px] font-medium text-[#57534E] truncate">{g.desc}</p>
                              </div>
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                isSelected ? 'border-[#166534] bg-[#166534] text-white' : 'border-stone-300'
                              }`}>
                                {isSelected && <CheckCircle2 size={13} strokeWidth={3} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between gap-3 pt-4 border-t border-stone-100 mt-6">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-stone-500 hover:text-[#12263A] rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
                      >
                        <ArrowLeft size={15} className={cn(isRtl && "rotate-180")} />
                        <span>{t('auth.onboarding.back', 'Back')}</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSavingWorkspace || !businessName.trim()}
                        className="h-12 px-6 bg-[#166534] hover:bg-[#14532d] active:bg-[#0f3d21] text-white text-xs font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-[#166534]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#166534]"
                      >
                        {isSavingWorkspace ? (
                          <>
                            <RefreshCw size={15} className="animate-spin text-white" />
                            <span>{t('auth.onboarding.saving_workspace', 'Saving Workspace...')}</span>
                          </>
                        ) : (
                          <>
                            <span>{t('auth.onboarding.continue', 'Continue to Launch')}</span>
                            <ArrowRight size={15} className={cn(isRtl && "rotate-180")} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ------------------------------------------------------------ */}
              {/* STEP 3: SETUP COMPLETE / LAUNCH WORKSPACE                     */}
              {/* ------------------------------------------------------------ */}
              {step === 3 && (
                <motion.div 
                  key="step-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 text-center py-4"
                >
                  {/* Celebratory Checkmark */}
                  <motion.div 
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-[#166534] to-[#22C55E] text-white flex items-center justify-center mx-auto shadow-xl shadow-[#166534]/25"
                  >
                    <CheckCircle2 size={42} strokeWidth={2.5} />
                  </motion.div>

                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12263A] tracking-tight">
                      {t('auth.onboarding.ready_title', 'Workspace Ready!')}
                    </h2>
                    <p className="text-xs sm:text-sm font-medium text-[#57534E] max-w-sm mx-auto leading-relaxed">
                      {isRtl ? (
                        <>تمت تهيئة منظمتك <strong className="text-[#12263A] font-bold">{businessName || user?.businessName || 'مساحة العمل'}</strong> بنجاح.</>
                      ) : (
                        <>Your organization <strong className="text-[#12263A] font-bold">{businessName || user?.businessName || 'Workspace'}</strong> has been initialized successfully.</>
                      )}
                    </p>
                  </div>

                  {/* Confirmed Setup Checklist */}
                  <div className={cn("bg-[#FAFAF9] border border-stone-200/80 rounded-2xl p-4 sm:p-5 max-w-md mx-auto space-y-3", isRtl ? "text-right" : "text-left")}>
                    <div className={cn("flex items-center gap-2.5 text-xs font-semibold text-[#12263A]", isRtl && "flex-row-reverse")}>
                      <CheckCircle2 size={16} className="text-[#166534] shrink-0" />
                      <span>{t('auth.onboarding.checklist_email', 'Email address verified & security confirmed')}</span>
                    </div>
                    <div className={cn("flex items-center gap-2.5 text-xs font-semibold text-[#12263A]", isRtl && "flex-row-reverse")}>
                      <CheckCircle2 size={16} className="text-[#166534] shrink-0" />
                      <span>{t('auth.onboarding.checklist_workspace', 'Dedicated workspace tenant initialized in database')}</span>
                    </div>
                    <div className={cn("flex items-center gap-2.5 text-xs font-semibold text-[#12263A]", isRtl && "flex-row-reverse")}>
                      <CheckCircle2 size={16} className="text-[#166534] shrink-0" />
                      <span>{t('auth.onboarding.checklist_campaigns', 'Lead Discovery & Email Campaign pipelines activated')}</span>
                    </div>
                  </div>

                  {/* Prominent Launch CTA */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleLaunchDashboard}
                      className="w-full h-12 bg-[#166534] hover:bg-[#14532d] active:bg-[#0f3d21] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-[#166534]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#166534]"
                    >
                      <span>{t('auth.onboarding.launch_button', 'Launch Workspace Dashboard')}</span>
                      <Sparkles size={16} className="text-[#22C55E]" />
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Accessible Step Counter Footnote */}
          <p className="text-center text-[11px] font-bold text-stone-400 uppercase tracking-widest">
            {isRtl ? (
              <>الخطوة {step} من 3 • {step === 1 ? 'التحقق الأمني' : step === 2 ? 'تكوين مساحة العمل' : 'إطلاق المنصة'}</>
            ) : (
              <>Step {step} of 3 • {step === 1 ? 'Security Verification' : step === 2 ? 'Workspace Configuration' : 'Platform Launch'}</>
            )}
          </p>
        </div>
      </main>

      {/* Clean, Non-Competing Onboarding Footer */}
      <footer className="py-4 border-t border-stone-200/60 bg-white/50 text-center text-[11px] font-medium text-stone-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} ThrobTech. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-stone-600 transition-colors">
              {isRtl ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </Link>
            <span className="text-stone-300">•</span>
            <Link to="/terms" className="hover:text-stone-600 transition-colors">
              {isRtl ? 'الشروط والأحكام' : 'Terms of Service'}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
