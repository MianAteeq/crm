import React from 'react';
import { Database, Shield, Lock, Copy } from 'lucide-react';
import { WhatsAppConfig } from '../../../types';

interface WebhookPanelProps {
  config: WhatsAppConfig;
}

export default function WebhookPanel({ config }: WebhookPanelProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-slate-100 text-slate-900 rounded-lg">
          <Database size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Webhook Configuration</h3>
          <p className="text-xs font-medium text-slate-500">Public visibility settings for real-time events</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 pl-1">Callback URL</label>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between group">
            <span className="text-xs font-mono font-medium text-slate-600 truncate mr-2">{config.webhookUrl}</span>
            <button onClick={() => copyToClipboard(config.webhookUrl)} className="text-slate-400 hover:text-slate-900 transition-colors">
              <Copy size={14} />
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 pl-1">Verify Token</label>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between group">
            <span className="text-xs font-mono font-medium text-slate-600 truncate mr-2">{config.verifyToken}</span>
            <button onClick={() => copyToClipboard(config.verifyToken)} className="text-slate-400 hover:text-slate-900 transition-colors">
              <Copy size={14} />
            </button>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
          <Shield size={16} className="text-blue-600 shrink-0 mt-0.5" />
          <p className="text-[11px] font-medium text-blue-800 leading-relaxed">
            Ensure your Webhook URL is publicly accessible. Meta Cloud API will probe this URL with a GET challenge containing the Verify Token.
          </p>
        </div>
      </div>
    </div>
  );
}
