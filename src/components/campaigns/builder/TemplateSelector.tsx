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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search approved templates..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-12 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-900 transition-all shadow-inner"
          />
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {filtered.map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelect(t)}
              className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${
                value === t.id 
                  ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10' 
                  : 'bg-white border-slate-200 text-slate-900 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  value === t.id ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-400'
                }`}>
                  <Layout size={20} />
                </div>
                <div className="text-left">
                  <p className={`text-[10px] font-bold uppercase tracking-widest leading-none mb-1 transition-all ${value === t.id ? 'text-slate-400' : 'text-slate-400'}`}>{t.category}</p>
                  <p className={`text-sm font-bold tracking-tight uppercase ${value === t.id ? 'text-white' : 'text-slate-900'}`}>{t.displayName}</p>
                </div>
              </div>
              {value === t.id && (
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <CheckCircle2 size={18} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Template Preview</h4>
          {selectedTemplate && (
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shadow-sm">
              Approved
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
              className="bg-white border border-slate-200 rounded-[2rem] p-8 min-h-[400px] shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                 <Layout size={120} />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="space-y-2">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Header</p>
                   {selectedTemplate.header.type === 'text' && (
                     <p className="text-xl font-bold text-slate-900">{selectedTemplate.header.text}</p>
                   )}
                   {selectedTemplate.header.type === 'image' && (
                     <div className="aspect-video w-full rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden shadow-inner">
                       <img src={selectedTemplate.header.mediaUrl} alt="Header" className="w-full h-full object-cover" />
                     </div>
                   )}
                   {selectedTemplate.header.type === 'none' && <p className="text-xs text-slate-400 italic">No header</p>}
                </div>

                <div className="space-y-2">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Body Message</p>
                   <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner">
                     <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {selectedTemplate.body.text}
                     </p>
                   </div>
                </div>

                {selectedTemplate.footer && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Footer</p>
                    <p className="text-xs text-slate-400 font-medium italic">{selectedTemplate.footer.text}</p>
                  </div>
                )}

                {selectedTemplate.buttons.type !== 'none' && (
                  <div className="space-y-4 pt-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action Buttons</p>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedTemplate.buttons.cta?.map((btn, i) => (
                        <div key={i} className="p-3 bg-slate-900 border border-slate-900 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest shadow-sm">
                          <Eye size={14} strokeWidth={2.5} /> {btn.label}
                        </div>
                      ))}
                      {selectedTemplate.buttons.quickReplies?.map((btn, i) => (
                        <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-[10px] font-bold text-slate-600 uppercase tracking-widest shadow-sm">
                          {btn.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center h-[400px]">
              <div className="w-20 h-20 rounded-3xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 mb-6 shadow-sm">
                <Layout size={40} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">No Template Selected</h3>
              <p className="text-[11px] text-slate-400 mt-2 font-medium max-w-[240px]">
                Browse your approved WhatsApp templates and select one to start crafting your campaign.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
