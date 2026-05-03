import React, { useState } from 'react';
import { Key, Smartphone, Building2, Eye, EyeOff, Save } from 'lucide-react';
import { WhatsAppConfig } from '../../../types';

interface CredentialsFormProps {
  config: WhatsAppConfig;
  onSave: (data: Partial<WhatsAppConfig>) => void;
}

export default function CredentialsForm({ config, onSave }: CredentialsFormProps) {
  const [showToken, setShowToken] = useState(false);
  const [localConfig, setLocalConfig] = useState(config);

  const handleSave = () => {
    onSave(localConfig);
  };

  return (
    <div className="p-8 bg-bg-surface border border-border rounded-[2.5rem] space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-brand/10 text-brand rounded-xl">
           <Key size={20} />
        </div>
        <div>
           <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">API Credentials</h3>
           <p className="text-[9px] font-medium text-text-muted uppercase">Meta Cloud API configuration</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Phone Number ID</label>
            <div className="relative group">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={16} />
              <input 
                value={localConfig.phoneNumberId}
                onChange={(e) => setLocalConfig({...localConfig, phoneNumberId: e.target.value})}
                placeholder="1092837465..."
                className="w-full bg-bg-surface3 border border-border rounded-xl p-4 pl-12 text-xs font-bold text-white focus:outline-none focus:border-brand/40 transition-all shadow-inner"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Business Account ID</label>
            <div className="relative group">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={16} />
              <input 
                 value={localConfig.businessAccountId}
                 onChange={(e) => setLocalConfig({...localConfig, businessAccountId: e.target.value})}
                 placeholder="9876543210..."
                 className="w-full bg-bg-surface3 border border-border rounded-xl p-4 pl-12 text-xs font-bold text-white focus:outline-none focus:border-brand/40 transition-all shadow-inner"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">System User Access Token</label>
          <div className="relative group">
            <Key className="absolute left-4 top-4 text-text-muted group-focus-within:text-brand transition-colors" size={16} />
            <textarea 
              value={localConfig.accessToken}
              onChange={(e) => setLocalConfig({...localConfig, accessToken: e.target.value})}
              rows={3}
              placeholder="EAAGz..."
              className={`w-full bg-bg-surface3 border border-border rounded-xl p-4 pl-12 text-xs font-mono text-white focus:outline-none focus:border-brand/40 transition-all shadow-inner resize-none ${!showToken ? 'blur-[3px] select-none pointer-events-none' : ''}`}
            />
            {!showToken && (
              <div className="absolute inset-0 flex items-center justify-center bg-transparent backdrop-blur-[2px] rounded-xl cursor-pointer" onClick={() => setShowToken(true)}>
                 <span className="bg-bg-surface3 border border-border px-4 py-2 rounded-lg text-[9px] font-black text-brand uppercase tracking-widest hover:brightness-110">Reveal Token</span>
              </div>
            )}
            <button 
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-4 top-4 text-text-muted hover:text-white"
            >
              {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-[9px] font-medium text-text-muted pl-1 uppercase leading-relaxed">
            Generate this token in your <a href="#" className="text-brand underline decoration-brand/20 underline-offset-4">Meta App Dashboard</a> under WhatsApp Configuration.
          </p>
        </div>

        <div className="flex justify-end pt-4">
          <button 
             onClick={handleSave}
             className="flex items-center gap-2 px-8 py-4 bg-bg-surface3 border border-border text-white hover:text-brand hover:border-brand/40 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg group"
          >
             <Save size={16} className="group-hover:scale-110 transition-transform" /> Save Credentials
          </button>
        </div>
      </div>
    </div>
  );
}
