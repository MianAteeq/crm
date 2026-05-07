import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  ShieldCheck, 
  Terminal, 
  HelpCircle, 
  ExternalLink, 
  Info,
  ChevronRight,
  Zap,
  Lock,
  Globe
} from 'lucide-react';
import { useWhatsAppQuery } from '../../hooks/useWhatsAppQuery';
import OnboardingProgress from '../../components/settings/WhatsApp/OnboardingProgress';
import ConnectionStatusCard from '../../components/settings/WhatsApp/ConnectionStatusCard';
import MetaSignupButton from '../../components/settings/WhatsApp/MetaSignupButton';
import TestMessageBox from '../../components/settings/WhatsApp/TestMessageBox';
import ApiLogsViewer from '../../components/settings/WhatsApp/ApiLogsViewer';
import { WhatsAppSettings } from '../../types';

export default function WhatsAppSettingsPage() {
  const { 
    settings, 
    isLoading, 
    embeddedSignup, 
    disconnect, 
    refetch,
    testConnection,
    isSigningUp,
    isDisconnecting,
    isTesting
  } = useWhatsAppQuery();

  const handleEmbeddedSignup = async (code: string) => {
    try {
      await embeddedSignup(code);
    } catch (error: any) {
      alert(error.message || 'Failed to complete Embedded Signup');
    }
  };

  const handleDisconnect = async () => {
    if (confirm('Are you sure you want to disconnect your WhatsApp account? This will stop all messaging and automations.')) {
      try {
        await disconnect();
      } catch (error: any) {
        alert(error.message || 'Failed to disconnect');
      }
    }
  };

  const handleTest = async (phone: string): Promise<boolean> => {
    try {
      const response = await testConnection(phone);
      return !!response.success;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const isConnected = settings?.status === 'connected';

  return (
    <div className="max-w-6xl mx-auto pb-24 px-4 sm:px-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pt-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-soft">
                <MessageSquare size={20} />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Integrations</p>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Connect WhatsApp</h1>
          <p className="text-slate-500 font-medium max-w-xl leading-relaxed">
            Link your Meta Business account to enable official WhatsApp messaging. 
            Automate customer engagement and support with the Cloud API.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <HelpCircle size={14} /> Documentation
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             <ExternalLink size={14} /> Meta Console
          </button>
        </div>
      </div>

      {/* Onboarding Flow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <OnboardingProgress currentStep={isConnected ? 3 : 1} />
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Main Connection Area */}
        <div className="xl:col-span-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ConnectionStatusCard 
              settings={settings as WhatsAppSettings} 
              onDisconnect={handleDisconnect}
              onRefresh={() => refetch()}
              isLoading={isLoading || isDisconnecting}
            />
          </motion.div>

          <AnimatePresence mode="wait">
            {!isConnected && !isLoading && (
              <motion.div
                key="signup-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gradient-to-br from-white to-slate-50/50 p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/20 text-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                  <Zap size={200} fill="currentColor" />
                </div>
                
                <div className="relative z-10 max-w-lg mx-auto">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Zap size={32} fill="currentColor" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Ready to verify your account?</h2>
                  <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                    By connecting through Meta Embedded Signup, you gain access to the official WhatsApp Cloud API, 
                    enabling higher message throughput and verified business branding.
                  </p>
                  
                  <MetaSignupButton onSuccess={handleEmbeddedSignup} isLoading={isSigningUp} />
                  
                  <div className="mt-8 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Secure Connection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock size={14} className="text-emerald-500" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">End-to-End Encrypted</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isConnected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TestMessageBox onSend={handleTest} isLoading={isTesting} />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ApiLogsViewer logs={[]} /> {/* Assuming logs come from another source or we add them to WhatsAppSettings */}
          </motion.div>
        </div>

        {/* Info Column */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                <Info size={16} />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Before you start</h4>
            </div>
            
            <div className="space-y-4">
               {[
                 { title: 'Meta Business Portfolio', desc: 'Ensure you have an active Meta Business account.' },
                 { title: 'Verified Number', desc: 'Use a phone number that is not linked to a personal WhatsApp app.' },
                 { title: 'Compliance', desc: 'Your business must adhere to the WhatsApp Commerce Policy.' }
               ].map((item, idx) => (
                 <div key={idx} className="flex gap-4">
                   <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                     <Check size={12} className="text-emerald-500" strokeWidth={3} />
                   </div>
                   <div>
                     <p className="text-xs font-bold text-slate-900">{item.title}</p>
                     <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">{item.desc}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-8 h-8 bg-white/10 text-white rounded-lg flex items-center justify-center">
                <ShieldCheck size={16} />
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight">Enterprise Security</h4>
            </div>
            
            <p className="text-xs font-medium text-slate-400 leading-relaxed relative z-10">
              Our integration uses official Meta Cloud API protocols. 
              Tokens are never exposed to the client and remain encrypted at rest.
            </p>
            
            <div className="pt-4 border-t border-white/10 relative z-10">
               <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  <span>API Uptime</span>
                  <span className="text-emerald-400">99.9%</span>
               </div>
               <div className="w-full bg-white/10 h-1 rounded-full mt-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '99%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-emerald-400 h-full" 
                  />
               </div>
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-3xl border border-indigo-500 shadow-xl shadow-indigo-500/20 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal size={16} />
              Developer Tools
            </h4>
            <p className="text-xs font-medium text-indigo-100/80 leading-relaxed">
              Access raw API metadata and connection strings for advanced workflows.
            </p>
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all">
               Open Debug Console
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Check({ size, className, strokeWidth }: { size: number, className: string, strokeWidth: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

