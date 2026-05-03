import React, { useState, useEffect } from 'react';
import { X, RefreshCcw, ShieldCheck, Key, Database, AlertCircle, CheckCircle2, Globe, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Template } from '../../data/templates';

interface MetaSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSync: (templates: Template[]) => void;
}

type SyncStep = 'config' | 'searching' | 'importing' | 'complete';

export default function MetaSyncModal({ isOpen, onClose, onSync }: MetaSyncModalProps) {
  const [step, setStep] = useState<SyncStep>('config');
  const [wabaId, setWabaId] = useState('');
  const [token, setToken] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setStep('config');
      setProgress(0);
      setError(null);
    }
  }, [isOpen]);

  const handleStartSync = () => {
    if (!wabaId || !token) {
      setError('Please provide both WABA ID and Access Token');
      return;
    }
    setError(null);
    setStep('searching');
    
    // Simulate searching
    setTimeout(() => {
      setStep('importing');
      simulateProgress();
    }, 1500);
  };

  const simulateProgress = () => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 15;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(handleComplete, 800);
      }
      setProgress(current);
    }, 200);
  };

  const handleComplete = () => {
    // Mock templates fetched from Meta
    const metaTemplates: Template[] = [
      {
        id: 'meta_' + Math.random().toString(36).substring(7),
        name: "seasonal_greeting_meta",
        displayName: "Seasonal Greeting (Meta API)",
        category: "Marketing",
        language: "en",
        status: "approved",
        edited: "Synced just now",
        header: { type: "text", text: "Warm Wishes! ❄️" },
        body: {
          text: "Hi {{1}}, happy holidays from the throbtech team! We've added a special gift to your account.",
          variables: [{ label: "User Name", sample: "Mike" }]
        },
        buttons: {
          type: "quick_reply",
          quickReplies: [{ text: "Claim Gift" }, { text: "Unsubscribe" }]
        }
      },
      {
        id: 'meta_' + Math.random().toString(36).substring(7),
        name: "delivery_update_official",
        displayName: "Delivery Update (Meta API)",
        category: "Utility",
        language: "en",
        status: "approved",
        edited: "Synced just now",
        header: { type: "none" },
        body: {
          text: "Your order #{{1}} is out for delivery. Our courier {{2}} will arrive at your address within 2 hours.",
          variables: [{ label: "Order #", sample: "ZM-990" }, { label: "Courier Name", sample: "Ali" }]
        },
        buttons: {
          type: "cta",
          cta: [{ type: "url", label: "Live Track", value: "https://track.zappify.io" }]
        }
      }
    ];

    setStep('complete');
    setTimeout(() => {
      onSync(metaTemplates);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1001]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-bg-surface border border-border z-[1002] rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-border bg-bg-surface2/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                  <RefreshCcw size={24} className={step === 'searching' || step === 'importing' ? 'animate-spin' : ''} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">Meta Official Sync</h2>
                  <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">Connect your Meta Business Account</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 rounded-2xl bg-bg-surface3 border border-border text-text-muted hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              {step === 'config' && (
                <div className="space-y-6">
                  <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex gap-4 items-start">
                    <AlertCircle size={18} className="text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed text-text-muted font-medium">
                      Templates created directly in the Meta Business Manager are not automatically synced. Provide your credentials to import them into throbtech Workshop.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Globe size={12} className="text-brand" /> WhatsApp Business Account ID (WABA)
                      </label>
                      <input 
                        type="text"
                        value={wabaId}
                        onChange={(e) => setWabaId(e.target.value)}
                        placeholder="Ex: 109823476512390"
                        className="w-full bg-bg-surface3 border border-border rounded-2xl p-4 text-xs font-bold text-white focus:outline-none focus:border-brand/40 transition-all font-mono"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Key size={12} className="text-brand" /> Permanent System User Token
                      </label>
                      <div className="relative">
                        <input 
                          type="password"
                          value={token}
                          onChange={(e) => setToken(e.target.value)}
                          placeholder="Your Meta Graph API Token"
                          className="w-full bg-bg-surface3 border border-border rounded-2xl p-4 text-xs font-bold text-white focus:outline-none focus:border-brand/40 transition-all font-mono"
                        />
                        <Server size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted" />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl text-[10px] font-bold text-rose-500 text-center"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="pt-2">
                    <button 
                      onClick={handleStartSync}
                      className="w-full py-4 bg-brand text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-brand/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      <RefreshCcw size={16} />
                      Begin Repository Sync
                    </button>
                    <div className="mt-4 flex items-center justify-center gap-6 text-text-muted opacity-40">
                      <div className="flex items-center gap-1.5 grayscale">
                        <ShieldCheck size={14} />
                        <span className="text-[9px] font-black uppercase tracking-tighter">AES-256 Encrypted</span>
                      </div>
                      <div className="flex items-center gap-1.5 grayscale">
                        <Database size={14} />
                        <span className="text-[9px] font-black uppercase tracking-tighter">Direct Meta Link</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(step === 'searching' || step === 'importing') && (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="relative w-24 h-24 mb-8">
                    <svg className="w-full h-full rotate-[-90deg]">
                      <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-bg-surface3" />
                      <motion.circle 
                        cx="48" 
                        cy="48" 
                        r="44" 
                        stroke="currentColor" 
                        strokeWidth="8" 
                        fill="transparent" 
                        className="text-brand" 
                        strokeDasharray={276.46}
                        animate={{ strokeDashoffset: 276.46 * (1 - progress / 100) }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xl font-display font-black text-white">
                      {Math.round(progress)}<span className="text-xs text-brand ml-0.5">%</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight transition-all">
                    {step === 'searching' ? 'Authenticating with Meta...' : 'Syncing Templates...'}
                  </h3>
                  <p className="text-[11px] text-text-muted mt-2 font-medium max-w-[280px]">
                    {step === 'searching' 
                      ? 'Establishing secure tunnel through Graph API v20.0' 
                      : 'Extracting metadata, category status, and language assets'
                    }
                  </p>
                </div>
              )}

              {step === 'complete' && (
                <div className="py-12 flex flex-col items-center text-center">
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-6"
                  >
                    <CheckCircle2 size={40} />
                  </motion.div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Sync Successful</h3>
                  <p className="text-[11px] text-text-muted mt-2 font-medium">
                    2 Official Meta templates have been imported into your workspace.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
