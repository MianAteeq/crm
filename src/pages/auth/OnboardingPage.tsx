import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, Terminal, Smartphone, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, MessageCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

export default function OnboardingPage() {
  const { user, updateOnboarding } = useAuthStore();
  const [step, setStep] = useState(user?.onboardingStep || 1);
  const [businessName, setBusinessName] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 4) {
      const nextStep = step + 1;
      updateOnboarding(nextStep, step === 1 ? { businessName } : undefined);
      setStep(nextStep);
    } else {
      updateOnboarding(4);
      navigate('/inbox');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const steps = [
    { title: 'Workspace', icon: Building2 },
    { title: 'Connection', icon: Terminal },
    { title: 'Number', icon: Smartphone },
    { title: 'Ready', icon: CheckCircle2 },
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Building2 size={24} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Name your workspace</h2>
              <p className="text-sm text-slate-500 mt-2">This is the name of your company or organization on our platform.</p>
            </div>
            
            <div className="space-y-3">
               <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Business Name</label>
               <input 
                 autoFocus
                 value={businessName}
                 onChange={(e) => setBusinessName(e.target.value)}
                 placeholder="e.g. Acme Corporation"
                 className="input-premium text-lg"
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' && businessName.trim()) {
                     handleNext();
                   }
                 }}
               />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Terminal size={24} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Connect Meta API</h2>
              <p className="text-sm text-slate-500 mt-2">Connect your WhatsApp Cloud API tokens to enable messaging.</p>
            </div>

            <div className="p-8 bg-slate-50 border border-slate-200/60 border-dashed rounded-[2rem] text-center flex flex-col items-center group hover:border-indigo-300 transition-colors duration-300">
               <div className="w-16 h-16 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                 <MessageCircle size={28} className="text-[#25D366]" />
               </div>
               <h3 className="text-sm font-bold text-slate-900 mb-2">WhatsApp Cloud API</h3>
               <p className="text-xs font-medium text-slate-500 max-w-[280px] leading-relaxed mb-6">
                  You can connect your tokens now, or skip this step and configure it later in your dashboard.
               </p>
               <button className="btn-premium-secondary text-xs">
                  Configure API Later
               </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Smartphone size={24} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Select sending number</h2>
              <p className="text-sm text-slate-500 mt-2">Choose the primary WhatsApp number for your campaigns.</p>
            </div>
            
            <div className="space-y-3">
               {['+1 (555) 012-3456', 'Register new number'].map((item, idx) => (
                  <button key={item} className="w-full p-5 bg-white border border-slate-200 rounded-2xl text-left flex items-center justify-between group hover:border-indigo-400 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                     <span className={cn("text-sm font-bold", idx === 0 ? "text-slate-900" : "text-indigo-600")}>{item}</span>
                     <CheckCircle2 size={20} className={cn("transition-colors duration-300", idx === 0 ? "text-indigo-600" : "text-slate-300 group-hover:text-indigo-400")} />
                  </button>
               ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 text-center py-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
              className="w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/30"
            >
               <CheckCircle2 size={56} strokeWidth={2.5} />
            </motion.div>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">You're all set!</h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[320px] mx-auto">
               Your workspace is fully configured and ready to go. Let's start building your first intelligent campaign.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      <Navbar />
      
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[120px] pointer-events-none" />

      <main className="flex-1 flex items-center justify-center p-6 pt-32 pb-20 z-10 w-full">
        <div className="w-full max-w-[640px] space-y-8">
          
          {/* Progress Bar */}
          <div className="flex items-center justify-between px-6 mb-12 relative">
             <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-[2px] bg-slate-200 -z-10" />
             <div 
               className="absolute left-10 top-1/2 -translate-y-1/2 h-[2px] bg-indigo-600 -z-10 transition-all duration-700 ease-in-out" 
               style={{ width: `calc(${(step - 1) / 3} * calc(100% - 80px))` }}
             />
             
             {steps.map((s, i) => {
               const isCompleted = step > i + 1;
               const isCurrent = step === i + 1;
               return (
                 <div key={s.title} className="flex flex-col items-center gap-3 relative bg-slate-50 px-2">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                      isCompleted ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : 
                      isCurrent ? "bg-white border-2 border-indigo-600 text-indigo-600 shadow-md" : 
                      "bg-white border-2 border-slate-200 text-slate-400"
                    )}>
                       <s.icon size={18} strokeWidth={isCurrent || isCompleted ? 2.5 : 2} />
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wider absolute -bottom-6 w-max text-center transition-colors duration-300",
                      isCurrent ? "text-indigo-600" : isCompleted ? "text-slate-700" : "text-slate-400"
                    )}>
                      {s.title}
                    </span>
                 </div>
               )
             })}
          </div>

          {/* Main Card */}
          <div className="premium-card p-10 md:p-14 relative overflow-hidden bg-white/80 backdrop-blur-xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div 
                 key={step}
                 initial={{ opacity: 0, x: 15, filter: 'blur(4px)' }}
                 animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                 exit={{ opacity: 0, x: -15, filter: 'blur(4px)' }}
                 transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {/* Footer Controls */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-100">
               {step > 1 && step < 4 ? (
                 <button onClick={handleBack} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors px-4 py-2 -ml-4 rounded-lg hover:bg-slate-50">
                    <ArrowLeft size={18} /> Back
                 </button>
               ) : <div />}

               <button 
                  onClick={handleNext} 
                  disabled={step === 1 && !businessName.trim()}
                  className={cn(
                    "btn-premium-primary ml-auto flex items-center gap-2",
                    step === 4 ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25 border-none" : ""
                  )}
               >
                  {step === 4 ? (
                    <>Go to Dashboard <Sparkles size={16} /></>
                  ) : (
                    <>Continue <ArrowRight size={16} /></>
                  )}
               </button>
            </div>
          </div>

          <p className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-8">
             Step {step} of 4 • Welcome {user?.name || 'Back'}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
