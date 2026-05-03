import { useState, useEffect } from 'react';
import { 
  Check, 
  Settings, 
  ExternalLink, 
  Plus, 
  X, 
  Eye, 
  EyeOff, 
  Copy, 
  CheckCircle2, 
  MoreHorizontal, 
  Info,
  ArrowRight,
  Shield,
  Smartphone,
  MessageSquare,
  Activity,
  Play,
  FileText,
  HelpCircle,
  MessagesSquare,
  RefreshCcw,
  Unlink,
  Link2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function APIIntegrationContent() {
  const [isConnected, setIsConnected] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [healthStatus, setHealthStatus] = useState({
    meta: 'Operational',
    webhook: 'Receiving',
    sync: 0
  });

  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setHealthStatus(prev => ({
        ...prev,
        sync: prev.sync + 1
      }));
    }, 60000); // Every minute
    return () => clearInterval(interval);
  }, []);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsConnected(true);
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setShowForm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Connection Status Card */}
      <div className="glass-card p-1">
        <div className="bg-zinc-950/50 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5">
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg z-10">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div className="w-6 h-[2px] bg-zinc-800 flex items-center justify-center -mx-1 relative z-0">
                <Link2 size={10} className="text-zinc-600" />
              </div>
              <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg z-10">
                <MessageSquare size={20} />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Stack Status</p>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  isConnected ? "bg-brand animate-pulse" : "bg-zinc-700"
                )} />
                <span className={cn(
                  "text-base font-bold",
                  isConnected ? "text-white" : "text-zinc-500"
                )}>
                  {isConnected ? 'API Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>

          {!isConnected ? (
            <button 
              onClick={() => setShowForm(!showForm)}
              className="bg-brand hover:bg-brand-dark text-black px-6 py-2.5 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 shadow-lg active:scale-95"
            >
              <Plus size={16} strokeWidth={2.5} />
              Configure API
            </button>
          ) : (
            <button 
              onClick={handleDisconnect}
              className="p-3 text-zinc-500 hover:text-red-500 transition-colors"
              title="Disconnect API"
            >
              <Unlink size={18} />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showForm && !isConnected && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-8 space-y-8 rounded-3xl border border-white/5">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Settings size={18} className="text-brand" />
                  Cloud API Configuration
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">WABA ID</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 109283746509182"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-brand/40 transition-all font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Phone Number ID</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 837465091827364"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-brand/40 transition-all font-mono"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Access Token</label>
                  <textarea 
                    rows={3}
                    placeholder="Paste your system user access token here..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-400 focus:outline-none focus:border-brand/40 transition-all resize-none"
                  />
                </div>
              </div>

              <button 
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full py-4 bg-brand hover:bg-brand-dark text-black rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.99]"
              >
                {isVerifying ? (
                  <>
                    <RefreshCcw className="animate-spin" size={16} />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Check size={16} strokeWidth={3} />
                    Verify & Save Connection
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isConnected && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Success Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 bg-brand/[0.02] border-brand/10 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Connection Health</p>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-brand/10 text-brand rounded-full text-[9px] font-bold uppercase">
                   <Activity size={10} /> Operational
                </div>
              </div>
              <p className="text-sm font-medium text-zinc-300">Your connection to Meta Cloud API is active and receiving webhooks.</p>
            </div>

            <div className="glass-card p-6 space-y-4">
               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Messaging Tiers</p>
               <div className="flex gap-2">
                 <span className="px-2.5 py-1 bg-zinc-800 rounded-lg text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Tier 1</span>
                 <span className="px-2.5 py-1 bg-brand/10 text-brand rounded-lg text-[10px] font-bold uppercase tracking-widest">1,000 msg / 24h</span>
               </div>
            </div>
          </div>

          {/* Webhook Config */}
          <div className="glass-card p-8 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <RefreshCcw size={18} className="text-zinc-400" />
              Webhook Receiver
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Callback URL</label>
                <div className="flex gap-2">
                  <input readOnly value="https://api.zappify.io/webhook/meta/8271" className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono tracking-tighter" />
                  <button 
                    onClick={() => handleCopy("https://api.zappify.io/webhook/meta/8271")}
                    className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-400 transition-colors"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Phone Numbers Table */}
          <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
             <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white">Registered Identifiers</h3>
                <button className="text-[10px] font-bold text-brand uppercase tracking-widest hover:underline">+ Add Phone</button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-zinc-900/50 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      <tr>
                         <th className="px-6 py-4">Number</th>
                         <th className="px-6 py-4">Status</th>
                         <th className="px-6 py-4">Quality</th>
                      </tr>
                   </thead>
                   <tbody className="text-xs divide-y divide-white/5">
                      <tr>
                         <td className="px-6 py-4 font-mono">+1 (555) 000-1234</td>
                         <td className="px-6 py-4">
                            <span className="text-brand font-bold">Connected</span>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex gap-0.5">
                               {[1,2,3,4,5].map(i => <div key={i} className="w-3 h-1 bg-brand rounded-sm" />)}
                            </div>
                         </td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="p-6 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800 flex items-start gap-4">
         <div className="p-2 bg-zinc-800 rounded-lg text-zinc-500">
            <HelpCircle size={20} />
         </div>
         <div className="space-y-1">
            <h4 className="text-sm font-bold">Need help with integration?</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Check our <a href="#" className="text-brand hover:underline">Setup Documentation</a> or reach out to our technical support team for assistance with Meta Business Manager configuration.
            </p>
         </div>
      </div>
    </motion.div>
  );
}
