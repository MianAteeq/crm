import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, Smartphone, Terminal, LayoutDashboard, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

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
    { title: 'Business Info', icon: Building2 },
    { title: 'API Connection', icon: Terminal },
    { title: 'Communication Settings', icon: Smartphone },
    { title: 'Success', icon: CheckCircle2 },
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Your Business</h2>
            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">Help us personalize your workspace</p>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Business Registered Name</label>
               <input 
                 autoFocus
                 value={businessName}
                 onChange={(e) => setBusinessName(e.target.value)}
                 placeholder="e.g. Acme Marketing Co."
                 className="w-full bg-bg-surface3 border border-border rounded-2xl p-5 text-sm font-bold text-white focus:outline-none focus:border-brand/40 transition-all shadow-inner"
               />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Meta Cloud API</h2>
            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">throbtech works directly with Meta Infrastructure</p>
            <div className="p-8 bg-black/40 border border-border border-dashed rounded-[2rem] text-center">
               <Terminal size={40} className="mx-auto mb-4 text-brand" />
               <p className="text-[10px] font-black text-white uppercase tracking-widest mb-2">API Connection Placeholder</p>
               <p className="text-[9px] font-medium text-text-muted uppercase max-w-[280px] mx-auto leading-relaxed">
                  You can connect your WhatsApp Cloud API tokens now or skip and do it later in your dashboard settings.
               </p>
               <button className="mt-6 px-6 py-3 bg-bg-surface3 border border-border text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:border-brand/40 transition-all">
                  Get My Tokens
               </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Preferred Number</h2>
            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">Choose your primary sending number</p>
            <div className="space-y-4">
               {['+92 300 123 4567', 'Register new number'].map((item) => (
                  <button key={item} className="w-full p-6 bg-bg-surface3 border border-border rounded-2xl text-left flex items-center justify-between group hover:border-brand/40 transition-all">
                     <span className="text-[11px] font-black text-white uppercase tracking-widest">{item}</span>
                     <CheckCircle2 size={18} className="text-text-muted group-hover:text-brand" />
                  </button>
               ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="w-24 h-24 bg-brand/10 text-brand border border-brand/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-[0_20px_50px_rgba(40,_255,_191,_0.1)]">
               <CheckCircle2 size={48} strokeWidth={3} />
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">You're Ready!</h2>
            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest leading-relaxed max-w-[320px] mx-auto">
               Your workspace is fully configured and ready to scale. Let's start by sending your first campaign.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-bg-surface flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] overflow-hidden">
      <div className="w-full max-w-[600px] space-y-12">
        {/* Progress Bar */}
        <div className="flex items-center justify-between gap-4 px-10">
           {steps.map((s, i) => (
             <div key={s.title} className="flex-1 relative">
                <div className={`h-1.5 rounded-full transition-all duration-700 ${step > i ? 'bg-brand' : 'bg-bg-surface3'}`} />
                <div className={`absolute -top-10 left-1/2 -translate-x-1/2 transition-colors ${step === i + 1 ? 'text-brand' : 'text-text-muted opacity-40'}`}>
                   <s.icon size={20} />
                </div>
             </div>
           ))}
        </div>

        <motion.div 
           key={step}
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -20 }}
           className="bg-bg-surface2 border border-border p-12 rounded-[3.5rem] shadow-2xl relative"
        >
          {renderStep()}

          <div className="flex items-center justify-between mt-12 pt-10 border-t border-border/50">
             {step > 1 && step < 4 ? (
               <button onClick={handleBack} className="flex items-center gap-2 text-[10px] font-black text-text-muted hover:text-white uppercase tracking-widest transition-all">
                  <ArrowLeft size={16} /> Back
               </button>
             ) : <div />}

             <button 
                onClick={handleNext} 
                disabled={step === 1 && !businessName}
                className="px-10 py-5 bg-brand text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:brightness-110 disabled:opacity-50 transition-all shadow-lg flex items-center gap-3"
             >
                {step === 4 ? 'Go to Dashboard' : 'Continue'} <ArrowRight size={16} />
             </button>
          </div>
        </motion.div>

        <p className="text-center text-[9px] font-black text-text-muted uppercase tracking-[0.4em] opacity-40">
           Step {step} of 4 • Welcome {user?.name}
        </p>
      </div>
    </div>
  );
}
