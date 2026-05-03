import React from 'react';
import { Shield, ShieldCheck, RefreshCw, Unlink } from 'lucide-react';
import { WhatsAppConfig } from '../../../types';

interface ApiStatusCardProps {
  config: WhatsAppConfig;
  onConnect: () => void;
  onDisconnect: () => void;
  isLoading: boolean;
}

export default function ApiStatusCard({ config, onConnect, onDisconnect, isLoading }: ApiStatusCardProps) {
  const isConnected = config.status === 'connected';

  return (
    <div className={`p-8 rounded-[2rem] border transition-all ${
      isConnected 
        ? 'bg-emerald-500/5 border-emerald-500/20' 
        : 'bg-bg-surface3 border-border shadow-inner'
    }`}>
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all ${
            isConnected ? 'bg-emerald-500 text-black' : 'bg-bg-surface border border-border text-text-muted'
          }`}>
            {isConnected ? <ShieldCheck size={32} /> : <Shield size={32} />}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Connection Status</h3>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-[0.15em] ${
                isConnected ? 'bg-emerald-500 text-black' : 'bg-rose-500 text-white'
              }`}>
                {isConnected ? 'Active' : 'Offline'}
              </span>
            </div>
            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mt-1">
              {isConnected 
                ? `Last synced: ${new Date(config.lastSync).toLocaleString()}` 
                : 'Not connected to Meta Graph API'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isConnected ? (
            <button 
              onClick={onDisconnect}
              className="flex items-center gap-2 px-6 py-3 bg-bg-surface border border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg"
            >
              <Unlink size={14} /> Disconnect
            </button>
          ) : (
            <button 
              onClick={onConnect}
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-3 bg-brand text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 disabled:opacity-50 transition-all shadow-xl shadow-brand/20"
            >
              {isLoading ? <RefreshCw className="animate-spin" size={14} /> : <ShieldCheck size={14} />} 
              Establish Connection
            </button>
          )}
        </div>
      </div>

      {isConnected && (
        <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-emerald-500/10">
          <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
             <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Phone Number ID</p>
             <p className="font-mono text-xs text-white break-all">{config.phoneNumberId}</p>
          </div>
          <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
             <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Business Account ID</p>
             <p className="font-mono text-xs text-white break-all">{config.businessAccountId}</p>
          </div>
        </div>
      )}
    </div>
  );
}
