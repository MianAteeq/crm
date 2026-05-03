import { Template } from '@/src/data/templates';
import StatusBadge from './StatusBadge';
import PhonePreview from './PhonePreview';
import { X, Copy, Edit2, Trash2, ShieldAlert, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TemplateDrawerProps {
  template: Template | null;
  onClose: () => void;
}

export default function TemplateDrawer({ template, onClose }: TemplateDrawerProps) {
  if (!template) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Drawer Content */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-2xl bg-bg-base border-l border-border h-full flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between bg-bg-surface/30 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-lg font-black text-white uppercase tracking-tight">{template.displayName}</h2>
                <StatusBadge status={template.status} />
              </div>
              <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">{template.name}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-bg-surface3 rounded-xl text-text-muted transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left Side: Details */}
              <div className="space-y-8">
                {template.status === 'rejected' && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3">
                    <ShieldAlert className="text-red-500 shrink-0" size={18} />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Rejection Reason</p>
                      <p className="text-[11px] text-red-400 font-medium leading-relaxed">{template.rejectReason}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Configuration</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-bg-surface border border-border rounded-2xl">
                      <p className="text-[9px] font-black text-brand uppercase tracking-widest mb-1">Category</p>
                      <p className="text-xs font-bold text-white uppercase">{template.category}</p>
                    </div>
                    <div className="p-4 bg-bg-surface border border-border rounded-2xl">
                      <p className="text-[9px] font-black text-brand uppercase tracking-widest mb-1">Language</p>
                      <p className="text-xs font-bold text-white uppercase">{template.language}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">History</h3>
                   <div className="p-4 bg-bg-surface2 rounded-2xl border border-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <History size={16} className="text-text-muted" />
                         <span className="text-[11px] font-bold text-white uppercase tracking-wider line-clamp-1">Last edited {template.edited}</span>
                      </div>
                      <button className="text-[9px] font-black text-brand uppercase tracking-widest hover:underline whitespace-nowrap ml-4">
                         View Logs
                      </button>
                   </div>
                </div>

                <div className="pt-8 border-t border-border flex items-center gap-4">
                   <button className="flex-1 px-4 py-3 bg-brand text-black rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-brand/10 transition-all active:scale-95">
                      Edit Blueprint
                   </button>
                   <button className="p-3 bg-bg-surface border border-border rounded-2xl text-text-muted hover:text-white transition-colors">
                      <Copy size={18} />
                   </button>
                   <button className="p-3 bg-bg-surface border border-border rounded-2xl text-text-muted hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                   </button>
                </div>
              </div>

              {/* Right Side: Virtual Preview */}
              <div className="flex flex-col items-center">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-6">High-Fidelity Preview</h3>
                 <div className="scale-90 origin-top">
                    <PhonePreview template={template} />
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
