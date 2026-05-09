import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Settings as SettingsIcon, Database, Terminal, Shield } from 'lucide-react';
import { useWhatsAppApi } from '../../hooks/useWhatsAppApi';
import ApiStatusCard from '../../components/settings/WhatsApp/ApiStatusCard';
import CredentialsForm from '../../components/settings/WhatsApp/CredentialsForm';
import WebhookPanel from '../../components/settings/WhatsApp/WebhookPanel';
import TestMessageBox from '../../components/settings/WhatsApp/TestMessageBox';
import ApiLogsViewer from '../../components/settings/WhatsApp/ApiLogsViewer';

export default function WhatsAppSettingsPage() {
  const { 
    config, 
    logs, 
    isLoading, 
    saveConfig, 
    connect, 
    disconnect, 
    sendTest 
  } = useWhatsAppApi();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (e: any) {
      alert(e.message || 'Failed to connect. Check your credentials.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-sm">
          <MessageSquare size={24} strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">WhatsApp API</h1>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-0.5">Meta Cloud API v18.0</p>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-12">
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
            >
               <ApiStatusCard 
                  config={config} 
                  onConnect={handleConnect} 
                  onDisconnect={disconnect}
                  isLoading={isLoading}
               />
            </motion.div>
        </div>

        {/* Left Column: Configuration */}
        <div className="xl:col-span-12 lg:xl:col-span-7 space-y-6">
           <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
           >
              <CredentialsForm config={config} onSave={saveConfig} isLoading={isLoading} />
           </motion.div>

           <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
           >
              <WebhookPanel config={config} />
           </motion.div>
        </div>

        {/* Right Column: Testing & Logs */}
        <div className="xl:col-span-12 lg:xl:col-span-5 space-y-6">
           <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
           >
              <TestMessageBox onSend={sendTest} isLoading={isLoading} />
           </motion.div>

           <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
           >
              <ApiLogsViewer logs={logs} />
           </motion.div>

           {/* Security Warning */}
           <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-4">
              <Shield size={18} className="text-slate-400 shrink-0 mt-0.5" />
              <div>
                 <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">Security Enforcement</p>
                 <p className="text-xs font-medium text-slate-500 leading-relaxed">
                   API tokens are encrypted and handled exclusively by our secure node gateway. We never store raw tokens in public databases. All communication is TLS 1.3 secured.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

