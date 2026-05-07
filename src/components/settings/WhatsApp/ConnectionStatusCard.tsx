import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Building2, CheckCircle2, AlertCircle, Clock, Globe, Copy, RefreshCw, Unlink } from 'lucide-react';
import { WhatsAppSettings } from '../../../types';
import { cn } from '../../../lib/utils';

interface ConnectionStatusCardProps {
  settings: WhatsAppSettings | null;
  onDisconnect: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export default function ConnectionStatusCard({ settings, onDisconnect, onRefresh, isLoading }: ConnectionStatusCardProps) {
  const isConnected = settings?.status === 'connected';
  const isPending = settings?.status === 'pending';
  const isError = settings?.status === 'error';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
      <div className="p-8 border-b border-slate-50 bg-slate-50/50">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
              isConnected ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : 
              isError ? "bg-red-500 text-white shadow-lg shadow-red-500/20" :
              isPending ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" :
              "bg-slate-200 text-slate-400"
            )}>
              <Smartphone size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">WhatsApp Account</h3>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                  isConnected ? "bg-emerald-100 text-emerald-600" :
                  isError ? "bg-red-100 text-red-600" :
                  isPending ? "bg-amber-100 text-amber-600" :
                  "bg-slate-100 text-slate-500"
                )}>
                  {settings?.status || 'Disconnected'}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-400 mt-0.5">
                {isConnected ? 'API connected and active' : 'Connect your Meta Business account'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 hover:shadow-sm disabled:opacity-50"
              title="Sync Status"
            >
              <RefreshCw size={18} className={cn(isLoading && "animate-spin")} />
            </button>
            {isConnected && (
              <button 
                onClick={onDisconnect}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm"
              >
                <Unlink size={16} /> Disconnect
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-8">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-dashed border-slate-200">
               <Globe size={32} className="text-slate-300" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Ready to expand your reach?</h4>
            <p className="text-sm text-slate-500 max-w-sm mb-8 leading-relaxed">
              Connect your WhatsApp Business Cloud API account to start sending messages, automations, and more.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Business Presence</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                    <Building2 size={18} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{settings.business_name || 'N/A'}</p>
                    <p className="text-[10px] font-medium text-slate-500 mt-0.5">{settings.phone_number || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Integration ID</p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group">
                  <span className="text-xs font-mono font-medium text-slate-600 truncate mr-2">{settings.phone_number_id}</span>
                  <button onClick={() => copyToClipboard(settings.phone_number_id)} className="text-slate-400 hover:text-slate-900 transition-colors">
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">WABA Settings</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Account Active</p>
                    <p className="text-[10px] font-medium text-slate-500 mt-0.5">ID: {settings.business_account_id}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Webhook Health</p>
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    settings.webhook_status === 'active' ? "bg-emerald-500" : "bg-red-500"
                  )} />
                  <span className="text-sm font-bold text-slate-900 uppercase">
                    {settings.webhook_status === 'active' ? 'Operational' : 'Disconnected'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 rounded-2xl p-6 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Clock size={64} />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Last Synchronization</p>
              <h5 className="text-2xl font-black mb-1">{settings.last_synced ? new Date(settings.last_synced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</h5>
              <p className="text-[10px] font-bold text-slate-500 uppercase">{settings.last_synced ? new Date(settings.last_synced).toLocaleDateString() : 'Never'}</p>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={12} strokeWidth={3} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tight">Security Verified</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
