import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smartphone, MessageSquare, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface TestMessageBoxProps {
  onSend: (phone: string) => Promise<boolean>;
  isLoading: boolean;
}

export default function TestMessageBox({ onSend, isLoading }: TestMessageBoxProps) {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleTest = async () => {
    if (!phone) return;
    setStatus('idle');
    try {
      const success = await onSend(phone);
      if (success) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <div className="p-8 bg-white border border-slate-100 rounded-3xl space-y-8 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center border border-slate-100">
          <Send size={18} />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Test Connectivity</h3>
          <p className="text-xs font-medium text-slate-400">Send a direct message to verify your connection</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Recipient Number</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative group">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={16} />
              <input 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all placeholder:text-slate-300"
              />
            </div>
            <button 
              onClick={handleTest}
              disabled={!phone || isLoading}
              className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-3 min-w-[160px]"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              <span>{isLoading ? 'Sending...' : 'Dispatch Test'}</span>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {status === 'success' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl"
            >
               <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
               <p className="text-[11px] font-black text-emerald-700 uppercase tracking-wider">Test message sent successfully</p>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl"
            >
               <AlertCircle size={18} className="text-red-500 shrink-0" />
               <p className="text-[11px] font-black text-red-700 uppercase tracking-wider">Failed to send message</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
