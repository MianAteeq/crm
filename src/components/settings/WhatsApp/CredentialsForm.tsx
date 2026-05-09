import React, { useState, useEffect } from 'react';
import { Key, Smartphone, Building2, Eye, EyeOff, Save, Loader2, ShieldCheck } from 'lucide-react';
import { WhatsAppConfig } from '../../../types';

interface CredentialsFormProps {
  config: WhatsAppConfig;
  onSave: (data: Partial<WhatsAppConfig>) => void;
  isLoading?: boolean;
}

export default function CredentialsForm({ config, onSave, isLoading }: CredentialsFormProps) {
  const [showToken, setShowToken] = useState(false);
  const [localConfig, setLocalConfig] = useState(config);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync local state when prop changes (e.g. after fetching from API)
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleSave = async () => {
    try {
      await onSave(localConfig);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      // Error handled by parent or console
    }
  };

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-slate-900 text-white rounded-lg">
          <Key size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">API Configuration</h3>
          <p className="text-xs font-medium text-slate-500">Configure your Meta Cloud API permanent credentials</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 pl-1">Phone Number ID</label>
            <div className="relative group">
              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={16} />
              <input 
                value={localConfig.phoneNumberId}
                onChange={(e) => setLocalConfig({...localConfig, phoneNumberId: e.target.value})}
                placeholder="Enter ID"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 pl-10 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 pl-1">Business Account ID</label>
            <div className="relative group">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={16} />
              <input 
                value={localConfig.businessAccountId}
                onChange={(e) => setLocalConfig({...localConfig, businessAccountId: e.target.value})}
                placeholder="Enter ID"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 pl-10 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 pl-1">System User Access Token</label>
          <div className="relative group">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={16} />
            <input 
              type={showToken ? 'text' : 'password'}
              value={localConfig.accessToken}
              onChange={(e) => setLocalConfig({...localConfig, accessToken: e.target.value})}
              placeholder="EAA..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 pl-10 pr-10 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all"
            />
            <button 
              onClick={() => setShowToken(!showToken)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button 
             onClick={handleSave}
             disabled={isLoading}
             className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-bold transition-all shadow-sm group disabled:opacity-70 disabled:cursor-not-allowed"
          >
             {isLoading ? (
               <Loader2 size={14} className="animate-spin" />
             ) : saveSuccess ? (
               <ShieldCheck size={14} className="text-emerald-400" />
             ) : (
               <Save size={14} className="group-hover:scale-110 transition-transform" />
             )}
             {isLoading ? 'Saving...' : saveSuccess ? 'Saved successfully' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
