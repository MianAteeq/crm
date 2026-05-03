import React from 'react';
import { Layout, CheckCircle2, Eye, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { templates as mockTemplates, Template } from '../../../data/templates';

interface TemplateSelectorProps {
  value: string;
  onChange: (templateId: string) => void;
}

export default function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  const [search, setSearch] = React.useState('');
  const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(
    mockTemplates.find(t => t.id === value) || null
  );

  const filtered = mockTemplates.filter(t => 
    t.status === 'approved' && 
    (t.displayName.toLowerCase().includes(search.toLowerCase()) || 
     t.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelect = (template: Template) => {
    onChange(template.id);
    setSelectedTemplate(template);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="space-y-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={16} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search approved templates..."
            className="w-full bg-bg-surface3 border border-border rounded-2xl p-4 pl-12 text-sm font-bold text-white focus:outline-none focus:border-brand/40 transition-all shadow-inner"
          />
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {filtered.map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelect(t)}
              className={`w-full p-4 rounded-3xl border flex items-center justify-between transition-all ${
                value === t.id 
                  ? 'bg-brand/5 border-brand shadow-[0_0_20px_rgba(var(--brand-rgb),0.05)]' 
                  : 'bg-bg-surface border-border hover:border-brand/30'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  value === t.id ? 'bg-brand text-white' : 'bg-bg-surface3 text-text-muted'
                }`}>
                  <Layout size={20} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-brand uppercase tracking-widest leading-none mb-1">{t.category}</p>
                  <p className="text-sm font-black text-white uppercase tracking-tight">{t.displayName}</p>
                </div>
              </div>
              {value === t.id && (
                <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                  <CheckCircle2 size={20} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Template Preview</h4>
          {selectedTemplate && (
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Official Approval
            </span>
          )}
        </div>

        <AnimatePresence mode="wait">
          {selectedTemplate ? (
            <motion.div 
              key={selectedTemplate.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-bg-surface2 border border-border rounded-[2.5rem] p-8 min-h-[400px] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Layout size={120} />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="space-y-2">
                   <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Header</p>
                   {selectedTemplate.header.type === 'text' && (
                     <p className="text-lg font-black text-white">{selectedTemplate.header.text}</p>
                   )}
                   {selectedTemplate.header.type === 'image' && (
                     <div className="aspect-video w-full rounded-2xl bg-bg-surface3 border border-border overflow-hidden">
                       <img src={selectedTemplate.header.mediaUrl} alt="Header" className="w-full h-full object-cover" />
                     </div>
                   )}
                   {selectedTemplate.header.type === 'none' && <p className="text-xs text-text-muted italic">No header</p>}
                </div>

                <div className="space-y-2">
                   <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Body Message</p>
                   <div className="p-6 bg-bg-surface3 border border-border rounded-2xl">
                     <p className="text-sm font-medium text-white leading-relaxed whitespace-pre-wrap">
                        {selectedTemplate.body.text}
                     </p>
                   </div>
                </div>

                {selectedTemplate.footer && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Footer</p>
                    <p className="text-xs text-text-muted font-medium italic">{selectedTemplate.footer.text}</p>
                  </div>
                )}

                {selectedTemplate.buttons.type !== 'none' && (
                  <div className="space-y-4 pt-4">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Action Buttons</p>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedTemplate.buttons.cta?.map((btn, i) => (
                        <div key={i} className="p-3 bg-brand/10 border border-brand/20 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black text-brand uppercase tracking-widest">
                          <Eye size={14} /> {btn.label}
                        </div>
                      ))}
                      {selectedTemplate.buttons.quickReplies?.map((btn, i) => (
                        <div key={i} className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-[10px] font-black text-white uppercase tracking-widest opacity-60">
                          {btn.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="bg-bg-surface2/30 border border-dashed border-border rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center h-[400px]">
              <div className="w-20 h-20 rounded-3xl bg-bg-surface3 flex items-center justify-center text-text-muted mb-6">
                <Layout size={40} />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">No Template Selected</h3>
              <p className="text-[11px] text-text-muted mt-2 font-medium max-w-[240px]">
                Browse your approved WhatsApp templates and select one to start crafting your campaign.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
