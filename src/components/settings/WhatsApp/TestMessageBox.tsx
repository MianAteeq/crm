import React, { useState } from 'react';
import { Send, Smartphone, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';

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
      await onSend(phone);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <div className="p-8 bg-bg-surface border border-border rounded-[2.5rem] space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-brand/10 text-brand rounded-xl">
          <MessageSquare size={20} />
        </div>
        <div>
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Test Connectivity</h3>
          <p className="text-[9px] font-medium text-text-muted uppercase">Verify outbound message path</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Recipient Phone Number</label>
          <div className="flex gap-3">
            <div className="flex-1 relative group">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={16} />
              <input 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                className="w-full bg-bg-surface3 border border-border rounded-xl p-4 pl-12 text-xs font-bold text-white focus:outline-none focus:border-brand/40 transition-all shadow-inner"
              />
            </div>
            <button 
              onClick={handleTest}
              disabled={!phone || isLoading}
              className="px-8 bg-brand text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 disabled:opacity-50 transition-all shadow-lg flex items-center gap-2"
            >
              <Send size={14} strokeWidth={3} /> Send Test
            </button>
          </div>
        </div>

        {status === 'success' && (
          <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
             <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
             <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Message dispatched successfully via Graph API</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
             <AlertCircle size={16} className="text-rose-500 shrink-0" />
             <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Failed to dispatch message. Check API credentials.</p>
          </div>
        )}
      </div>
    </div>
  );
}
