import React from 'react';
import { Shield, ShieldCheck, RefreshCw, Unlink, Loader2 } from 'lucide-react';
import { WhatsAppConfig } from '../../../types';
import { formatSafeDateTime } from '../../../lib/utils';

interface ApiStatusCardProps {
  config: WhatsAppConfig;
  onConnect: () => void;
  onDisconnect: () => void;
  isLoading?: boolean;
}

export default function ApiStatusCard({ config, onConnect, onDisconnect, isLoading }: ApiStatusCardProps) {
  const isConnected = config.status === 'connected';

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl transition-all duration-500 ${isConnected ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
            {isConnected ? <ShieldCheck size={24} /> : <Shield size={24} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Connection Status</h3>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${isConnected ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                {config.status}
              </span>
            </div>
            <p className="text-slate-500 text-xs font-medium mt-0.5">
              {isConnected 
                ? (config.lastSync ? `Last synced: ${formatSafeDateTime(config.lastSync)}` : 'Connected')
                : 'Configure credentials to establish connection'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isConnected ? (
            <button 
              onClick={onDisconnect}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={14} /> : <Unlink size={14} />} 
              {isLoading ? 'Disconnecting...' : 'Disconnect'}
            </button>
          ) : (
            <button 
              onClick={onConnect}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition-all shadow-sm"
            >
              {isLoading ? <Loader2 className="animate-spin" size={14} /> : <ShieldCheck size={14} />} 
              {isLoading ? 'Connecting...' : 'Connect API'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
