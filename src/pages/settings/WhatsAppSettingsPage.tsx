import React from 'react';
import { motion } from 'motion/react';
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
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-4 bg-brand text-black rounded-[1.25rem] shadow-xl shadow-brand/20">
            <MessageSquare size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">WhatsApp API</h1>
            <p className="text-[11px] font-black text-brand uppercase tracking-[0.3em] mt-1 pl-1">Infrastructure • Meta Cloud API v18.0</p>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-12">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
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
        <div className="xl:col-span-7 space-y-8">
           <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
           >
              <CredentialsForm config={config} onSave={saveConfig} />
           </motion.div>

           <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
           >
              <WebhookPanel config={config} />
           </motion.div>
        </div>

        {/* Right Column: Testing & Logs */}
        <div className="xl:col-span-5 space-y-8">
           <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
           >
              <TestMessageBox onSend={sendTest} isLoading={isLoading} />
           </motion.div>

           <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
           >
              <ApiLogsViewer logs={logs} />
           </motion.div>

           {/* Security Warning */}
           <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-[2rem] flex items-start gap-4">
              <Shield size={20} className="text-rose-500 shrink-0" />
              <div>
                 <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Security Enforcement</p>
                 <p className="text-[9px] font-medium text-text-muted uppercase leading-relaxed">
                   API tokens are encrypted and handled exclusively by our secure node gateway. We never store raw tokens in public databases. All communication is TLS 1.3 secured.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
