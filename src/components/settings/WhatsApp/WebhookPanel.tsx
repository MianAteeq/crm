import React from 'react';
import { Network, Copy, Check, RefreshCw, Terminal } from 'lucide-react';
import { WhatsAppConfig } from '../../../types';

interface WebhookPanelProps {
  config: WhatsAppConfig;
}

export default function WebhookPanel({ config }: WebhookPanelProps) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="p-8 bg-bg-surface border border-border rounded-[2.5rem] space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand/10 text-brand rounded-xl">
            <Network size={20} />
          </div>
          <div>
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Webhook Configuration</h3>
            <p className="text-[9px] font-medium text-text-muted uppercase">Real-time event integration</p>
          </div>
        </div>
        <span className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-500 uppercase tracking-widest">
           <Terminal size={10} /> Active
        </span>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Callback URL</label>
          <div className="flex gap-2">
            <div className="flex-1 bg-bg-surface3 border border-border rounded-xl p-4 font-mono text-[11px] text-white overflow-hidden text-ellipsis whitespace-nowrap shadow-inner">
              {config.webhookUrl}
            </div>
            <button 
              onClick={() => copyToClipboard(config.webhookUrl, 'url')}
              className="px-4 bg-bg-surface3 border border-border rounded-xl text-text-muted hover:text-white transition-all flex items-center justify-center shrink-0"
            >
              {copiedField === 'url' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Verify Token</label>
          <div className="flex gap-2">
            <div className="flex-1 bg-bg-surface3 border border-border rounded-xl p-4 font-mono text-[11px] text-white shadow-inner">
              {config.verifyToken}
            </div>
            <button 
              onClick={() => copyToClipboard(config.verifyToken, 'token')}
              className="px-4 bg-bg-surface3 border border-border rounded-xl text-text-muted hover:text-white transition-all flex items-center justify-center shrink-0"
            >
              {copiedField === 'token' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            </button>
            <button className="px-4 bg-bg-surface3 border border-border rounded-xl text-text-muted hover:text-brand transition-all flex items-center justify-center shrink-0">
               <RefreshCw size={14} />
            </button>
          </div>
        </div>

        <div className="bg-brand/5 border border-brand/20 rounded-2xl p-6 mt-4">
           <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-brand text-black flex items-center justify-center shrink-0">
                 <Terminal size={14} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Configuration Required</p>
                 <p className="text-[9px] font-medium text-text-muted uppercase leading-relaxed">
                   Copy these details to your Meta App Settings under <span className="text-white">WhatsApp → Configuration → Webhooks</span> to receive messages and status updates instantly.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
