import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function OnboardingPage() {
  const { user, updateOnboarding, updateProfile, verifyEmail, resendVerification } = useAuthStore();
  const navigate = useNavigate();

  // Determine initial step: if user's email is already verified, allow moving to workspace
  const isInitiallyVerified = Boolean(user?.emailVerified || user?.email_verified_at);
  const [step, setStep] = useState<number>(isInitiallyVerified ? 2 : 1);
  
  // Workspace Setup State
  const defaultWorkspaceName = user?.businessName && user.businessName !== 'Workspace' && user.businessName !== 'Talkinexx Workspace'
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
    // Only accept numeric characters
    const numericChar = value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = numericChar.slice(-1);
    setOtp(newOtp);
    setVerifyError(null);

    // Auto-advance to next input if numeric digit entered
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
      setVerifyError('Please enter all 6 digits of your verification code.');
      return;
    }

    setIsVerifying(true);
    setVerifyError(null);

    try {
      await verifyEmail(fullCode);
      setIsVerified(true);
      // Advance to Workspace step upon confirmed verification
      setTimeout(() => {
        setStep(2);
      }, 600);
    } catch (err: any) {
      console.error('Email verification error:', err);
      const msg = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        'Invalid or expired verification code. Please check your inbox and try again.';
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
      setResendMessage('A fresh verification code has been dispatched to your email.');
      setTimeout(() => setResendMessage(null), 5000);
    } catch (err: any) {
      console.error('Resend error:', err);
      const msg = err.response?.data?.message || 'Failed to dispatch new verification code. Please try again.';
      setResendError(msg);
    } finally {
      setIsResending(false);
    }
  };

  // Save workspace and continue
  const handleSaveWorkspace = async () => {
    const trimmed = businessName.trim();
    if (!trimmed) {
      setWorkspaceError('Please enter a name for your workspace.');
      return;
    }

    setIsSavingWorkspace(true);
    setWorkspaceError(null);

    try {
      // Persist workspace name to backend
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
      // Fallback: still update local store if network blips but proceed
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
    { number: 1, title: 'Email Verify', icon: Mail },
    { number: 2, title: 'Workspace', icon: Building2 },
    { number: 3, title: 'Ready', icon: CheckCircle2 },
  ];

  const industries = [
    'Technology & SaaS',
    'Marketing & Advertising Agency',
    'Real Estate & Property',
    'E-Commerce & D2C',
    'Healthcare, Medical & Clinics',
    'Financial, Legal & Professional Services',
    'Education & Training',
    'Hospitality & Tourism',
    'Other Business Services'
  ];

  const goals = [
    {
      id: 'Email Marketing & Lead Discovery',
      title: 'Email Marketing & Lead Discovery',
      desc: 'Discover business leads, inspect contact pages & launch verified email sequences.',
      icon: Compass
    },
    {
      id: 'Customer Relationship Management',
      title: 'Customer Directory & Segmentation',
      desc: 'Centralize contacts, organize tags, track activities & manage pipeline deals.',
      icon: Users
    },
    {
      id: 'AI Marketing Automation',
      title: 'AI Campaign Orchestration',
      desc: 'Deploy AI agents to craft personalized B2B outreach with verified deliverability.',
      icon: Bot
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col justify-between font-sans selection:bg-[#F0FDF4] selection:text-[#166534]">
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
                className="absolute left-8 top-1/2 -translate-y-1/2 h-[2px] bg-[#166534] -z-10 transition-all duration-500 ease-out" 
                style={{ width: `calc(${(step - 1) / 2} * calc(100% - 64px))` }}
              />
              
              {steps.map((s) => {
                const isCompleted = step > s.number || (s.number === 1 && isVerified);
                const isCurrent = step === s.number;
                const Icon = s.icon;
                return (
                  <li 
                    key={s.title} 
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
                  <div className="space-y-2 text-center sm:text-left">
                    <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30 flex items-center justify-center mb-3 mx-auto sm:mx-0 shadow-xs">
                      <Mail size={22} strokeWidth={2} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12263A] tracking-tight">
                      Verify your email address
                    </h2>
                    <p className="text-xs sm:text-sm font-medium text-[#57534E] leading-relaxed">
                      We've dispatched a 6-digit verification code to{' '}
                      <strong className="text-[#12263A] font-bold break-all">{user?.email || 'your email'}</strong>.
                      Enter it below to confirm your account ownership.
                    </p>
                  </div>

                  {/* 6 Digit Numeric OTP Inputs */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-[11px] font-bold text-[#57534E] uppercase tracking-wider text-center sm:text-left">
                      6-Digit Verification Code
                    </label>
                    <div 
                      className="grid grid-cols-6 gap-2 sm:gap-3 max-w-sm mx-auto sm:mx-0"
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
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-left flex items-start gap-2.5 animate-fade-in" role="alert">
                      <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                      <p className="text-xs font-bold text-rose-700 leading-snug">{verifyError}</p>
                    </div>
                  )}

                  {/* Resend Success Notification */}
                  {resendMessage && (
                    <div className="p-3.5 bg-[#F0FDF4] border border-[#22C55E]/30 rounded-xl text-left flex items-start gap-2.5 animate-fade-in" role="status">
                      <CheckCircle2 size={16} className="text-[#166534] shrink-0 mt-0.5" />
                      <p className="text-xs font-bold text-[#166534] leading-snug">{resendMessage}</p>
                    </div>
                  )}

                  {resendError && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-left flex items-start gap-2.5 animate-fade-in" role="alert">
                      <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                      <p className="text-xs font-bold text-rose-700 leading-snug">{resendError}</p>
                    </div>
                  )}

                  {/* Trust Footer & Resend Link */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs border-t border-stone-100 mt-6">
                    <div className="flex items-center gap-1.5 font-medium text-[#57534E]">
                      <ShieldCheck size={16} className="text-[#166534]" />
                      <span>Enterprise deliverability protection</span>
                    </div>
                    <div>
                      {canResend ? (
                        <button
                          type="button"
                          onClick={handleResendCode}
                          disabled={isResending}
                          className="font-bold text-[#166534] hover:text-[#12263A] underline cursor-pointer disabled:opacity-50"
                        >
                          {isResending ? 'Dispatching...' : 'Resend Code'}
                        </button>
                      ) : (
                        <span className="text-stone-400 font-medium">
                          Resend code in <strong className="text-[#12263A] font-bold">{resendCooldown}s</strong>
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
                          <span>Verifying Code...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify & Continue</span>
                          <ArrowRight size={15} />
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
                  <div className="space-y-2 text-center sm:text-left">
                    <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30 flex items-center justify-center mb-3 mx-auto sm:mx-0 shadow-xs">
                      <Building2 size={22} strokeWidth={2} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12263A] tracking-tight">
                      Configure your workspace
                    </h2>
                    <p className="text-xs sm:text-sm font-medium text-[#57534E] leading-relaxed">
                      Set up your company workspace profile and choose your primary growth focus.
                    </p>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleSaveWorkspace(); }} className="space-y-5">
                    
                    {/* Workspace / Company Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="workspace-name-input" className="block text-[11px] font-bold text-[#57534E] uppercase tracking-wider pl-1">
                        Workspace / Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="workspace-name-input"
                        type="text"
                        value={businessName}
                        onChange={(e) => {
                          setBusinessName(e.target.value);
                          setWorkspaceError(null);
                        }}
                        placeholder="e.g. Acme Corporation"
                        className="w-full h-12 bg-white border border-stone-200 focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/15 rounded-xl px-4 text-sm font-semibold text-[#12263A] transition-all outline-none"
                      />
                      {workspaceError && (
                        <p className="text-[11px] font-bold text-rose-600 pl-1" role="alert">{workspaceError}</p>
                      )}
                    </div>

                    {/* Industry Selector */}
                    <div className="space-y-1.5">
                      <label htmlFor="industry-select" className="block text-[11px] font-bold text-[#57534E] uppercase tracking-wider pl-1">
                        Industry / Business Category
                      </label>
                      <select
                        id="industry-select"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full h-12 bg-white border border-stone-200 focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/15 rounded-xl px-4 text-sm font-semibold text-[#12263A] transition-all outline-none cursor-pointer"
                      >
                        {industries.map((ind) => (
                          <option key={ind} value={ind}>{ind}</option>
                        ))}
                      </select>
                    </div>

                    {/* Primary Objective Options */}
                    <div className="space-y-2 pt-1">
                      <label className="block text-[11px] font-bold text-[#57534E] uppercase tracking-wider pl-1">
                        Primary Growth Focus
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
                              className={`w-full p-3.5 rounded-xl border transition-all text-left flex items-center gap-3.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] ${
                                isSelected 
                                  ? 'border-[#166534] bg-[#F0FDF4] shadow-xs' 
                                  : 'border-stone-200 hover:border-stone-300 bg-white'
                              }`}
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
                        <ArrowLeft size={15} />
                        <span>Back</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSavingWorkspace || !businessName.trim()}
                        className="h-12 px-6 bg-[#166534] hover:bg-[#14532d] active:bg-[#0f3d21] text-white text-xs font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-[#166534]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#166534]"
                      >
                        {isSavingWorkspace ? (
                          <>
                            <RefreshCw size={15} className="animate-spin text-white" />
                            <span>Saving Workspace...</span>
                          </>
                        ) : (
                          <>
                            <span>Continue to Launch</span>
                            <ArrowRight size={15} />
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
                      Workspace Ready!
                    </h2>
                    <p className="text-xs sm:text-sm font-medium text-[#57534E] max-w-sm mx-auto leading-relaxed">
                      Your organization <strong className="text-[#12263A] font-bold">{businessName || user?.businessName || 'Workspace'}</strong> has been initialized successfully.
                    </p>
                  </div>

                  {/* Confirmed Setup Checklist */}
                  <div className="bg-[#FAFAF9] border border-stone-200/80 rounded-2xl p-4 sm:p-5 max-w-md mx-auto text-left space-y-3">
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-[#12263A]">
                      <CheckCircle2 size={16} className="text-[#166534] shrink-0" />
                      <span>Email address verified & security confirmed</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-[#12263A]">
                      <CheckCircle2 size={16} className="text-[#166534] shrink-0" />
                      <span>Dedicated workspace tenant initialized in database</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-[#12263A]">
                      <CheckCircle2 size={16} className="text-[#166534] shrink-0" />
                      <span>Lead Discovery & Email Campaign pipelines activated</span>
                    </div>
                  </div>

                  {/* Prominent Launch CTA */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleLaunchDashboard}
                      className="w-full h-12 bg-[#166534] hover:bg-[#14532d] active:bg-[#0f3d21] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-[#166534]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#166534]"
                    >
                      <span>Launch Workspace Dashboard</span>
                      <Sparkles size={16} className="text-[#22C55E]" />
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Accessible Step Counter Footnote */}
          <p className="text-center text-[11px] font-bold text-stone-400 uppercase tracking-widest">
            Step {step} of 3 • {step === 1 ? 'Security Verification' : step === 2 ? 'Workspace Configuration' : 'Platform Launch'}
          </p>
        </div>
      </main>

      {/* Clean, Non-Competing Onboarding Footer */}
      <footer className="py-4 border-t border-stone-200/60 bg-white/50 text-center text-[11px] font-medium text-stone-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Talkinexx. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-stone-600 transition-colors">Privacy Policy</a>
            <span className="text-stone-300">•</span>
            <a href="/terms" className="hover:text-stone-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
