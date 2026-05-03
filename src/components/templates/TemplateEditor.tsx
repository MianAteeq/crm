import { 
  Type, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Plus, 
  Trash2,
  AlertTriangle,
  Info,
  ExternalLink,
  Variable
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Template } from '@/src/data/templates';
import { motion, AnimatePresence } from 'motion/react';

interface TemplateEditorProps {
  template: Template;
  onUpdate: (updates: Partial<Template>) => void;
}

export default function TemplateEditor({ template, onUpdate }: TemplateEditorProps) {
  if (!template) return null;

  const headerType = template.header?.type || 'none';
  const buttonType = template.buttons?.type || 'none';

  return (
    <div className="space-y-12 pb-24">
      {/* Policy Warnings if Rejected */}
      <AnimatePresence>
        {template.status === 'rejected' && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-4 items-start">
               <div className="p-2 bg-red-500/20 rounded-xl text-red-500 mt-0.5">
                  <AlertTriangle size={20} />
               </div>
               <div className="space-y-1">
                  <h4 className="text-sm font-bold text-red-500">Template Rejected by Meta</h4>
                  <p className="text-xs text-red-400 leading-relaxed font-medium">
                    {template.rejectReason}
                  </p>
                  <button className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline mt-2 flex items-center gap-1">
                    Appeal Decision <ExternalLink size={10} />
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Basic Configuration */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted shrink-0">Standard Identity</h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Display Name</label>
            <input 
              value={template.displayName || ''}
              onChange={(e) => onUpdate({ displayName: e.target.value })}
              className="w-full bg-bg-surface border border-border rounded-xl p-3.5 text-xs font-bold text-white focus:outline-none focus:border-brand/40 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Meta Identifier</label>
            <input 
              value={template.name || ''}
              readOnly
              className="w-full bg-bg-surface3/50 border border-border rounded-xl p-3.5 text-xs font-mono text-text-muted cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Category</label>
            <select 
              value={template.category}
              onChange={(e) => onUpdate({ category: e.target.value as Template['category'] })}
              className="w-full bg-bg-surface border border-border rounded-xl p-3.5 text-xs font-bold text-white focus:outline-none focus:border-brand/40 appearance-none transition-all cursor-pointer"
            >
              <option value="Marketing">Marketing</option>
              <option value="Utility">Utility</option>
              <option value="Authentication">Authentication</option>
            </select>
          </div>
        </div>
      </section>

      {/* Header Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
           <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
             <div className="p-1.5 bg-bg-surface rounded-lg text-brand border border-border">
                <Type size={16} />
             </div>
             Rich Header
           </h3>
           <div className="flex bg-bg-surface border border-border rounded-xl p-1 gap-1">
             {(['none', 'text', 'image', 'video', 'document'] as const).map(type => (
               <button
                 key={type}
                 onClick={() => onUpdate({ header: { ...template.header, type } })}
                 className={cn(
                   "px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                   headerType === type ? "bg-bg-surface3 text-white shadow-sm border border-border" : "text-text-muted hover:text-text-primary"
                 )}
               >
                 {type}
               </button>
             ))}
           </div>
        </div>

        {headerType === 'text' && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
             <input 
               placeholder="Header text content..."
               value={template.header?.text || ''}
               onChange={(e) => onUpdate({ header: { ...template.header!, text: e.target.value } })}
               className="w-full bg-bg-surface border border-border rounded-xl p-4 text-sm font-bold text-white focus:outline-none focus:border-brand/40 transition-all"
             />
             <p className="text-[10px] text-text-muted font-medium ml-2">Variables are not supported in headers.</p>
          </motion.div>
        )}

        {(['image', 'video', 'document'].includes(headerType)) && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-10 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center gap-4 bg-bg-surface2/30 hover:bg-bg-surface2/50 transition-colors cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-bg-surface3 border border-border flex items-center justify-center text-text-muted group-hover:text-brand group-hover:scale-110 transition-all">
                {headerType === 'image' && <ImageIcon size={24} />}
                {headerType === 'video' && <Video size={24} />}
                {headerType === 'document' && <FileText size={24} />}
              </div>
              <div className="text-center">
                 <p className="text-xs font-bold uppercase tracking-widest text-text-primary">Upload Sample {headerType}</p>
                 <p className="text-[10px] text-text-muted mt-1">Direct URL or file required for Meta validation</p>
              </div>
          </motion.div>
        )}
      </section>

      {/* Message Body Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
           <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
             <div className="p-1.5 bg-bg-surface rounded-lg text-brand border border-border">
                <FileText size={16} />
             </div>
             Drafting Core Body
           </h3>
           <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted bg-bg-surface px-3 py-1.5 rounded-xl border border-border">
             <Variable size={12} className="text-brand" />
             {template.body?.variables?.length || 0} Variables detected
           </div>
        </div>

        <div className="space-y-4">
          <textarea 
            rows={5}
            value={template.body?.text || ''}
            onChange={(e) => onUpdate({ body: { ...template.body!, text: e.target.value } })}
            placeholder="Compose your message here... Use {{1}}, {{2}} for variables. Use *bold* and _italic_ for formatting."
            className="w-full bg-bg-surface border border-border rounded-3xl p-6 text-sm leading-relaxed text-white focus:outline-none focus:border-brand/40 transition-all custom-scrollbar resize-none font-medium placeholder:text-text-muted/40"
          />

          {/* Variable Mapping */}
          <AnimatePresence>
            {template.body?.variables && template.body.variables.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {template.body.variables.map((v, i) => (
                  <div key={i} className="p-4 bg-bg-surface/50 border border-border rounded-2xl flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-brand uppercase tracking-widest">Variable {"{{" + (i + 1) + "}}"}</span>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Sample Data</label>
                       <input 
                         placeholder="Ex: Sara"
                         value={v.sample}
                         className="w-full bg-bg-surface border border-border rounded-lg px-3 py-2 text-xs font-bold focus:outline-none"
                       />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Buttons Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
           <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
             <div className="p-1.5 bg-bg-surface rounded-lg text-brand border border-border">
                <Plus size={16} />
             </div>
             Active Engagement
           </h3>
           <div className="flex bg-bg-surface border border-border rounded-xl p-1 gap-1">
             {(['none', 'cta', 'quick_reply', 'mixed'] as const).map(type => (
               <button
                 key={type}
                 onClick={() => onUpdate({ buttons: { ...template.buttons, type } })}
                 className={cn(
                   "px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                   buttonType === type ? "bg-bg-surface3 text-white shadow-sm border border-border" : "text-text-muted hover:text-text-primary"
                 )}
               >
                 {type.replace('_', ' ')}
               </button>
             ))}
           </div>
        </div>

        {buttonType === 'none' ? (
          <div className="p-8 border border-dashed border-border rounded-3xl text-center">
             <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">No buttons attached to this template</p>
          </div>
        ) : (
          <div className="space-y-4">
             {/* Render Specific Button Editors here - simplified for brevity */}
             <div className="p-6 bg-bg-surface/40 border border-border rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-brand/10 text-brand rounded-xl">
                      <Plus size={18} />
                   </div>
                   <div>
                      <p className="text-xs font-bold uppercase tracking-widest">Configure Interaction</p>
                      <p className="text-[10px] text-text-muted">Maximum buttons allowed: {buttonType === 'quick_reply' ? 3 : 2}</p>
                   </div>
                </div>
                <button className="px-4 py-2 bg-bg-surface border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-bg-surface3 transition-colors">
                   Customize Buttons
                </button>
             </div>
          </div>
        )}
      </section>

      {/* Persistence Controls */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-40">
         <button className="px-8 py-3 bg-bg-surface2 border border-border rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-bg-surface3 shadow-2xl transition-all active:scale-95">
            Reset Draft
         </button>
         <button className="px-10 py-3 bg-brand text-black rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-[0_0_40px_var(--color-brand-glow)] hover:brightness-110 transition-all active:scale-95">
            Sync To Meta
         </button>
      </div>
    </div>
  );
}
