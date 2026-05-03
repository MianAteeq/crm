import { Template } from '@/src/data/templates';
import { PlusCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface SystemTemplateCardProps {
  template: Partial<Template>;
  onUse: (template: Partial<Template>) => void;
  key?: string | number;
}

export default function SystemTemplateCard({ template, onUse }: SystemTemplateCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="bg-bg-surface border border-border rounded-3xl p-6 hover:border-brand/30 transition-all cursor-default group flex flex-col h-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
        <Sparkles size={64} className="text-brand" />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-0.5 bg-brand/10 text-brand border border-brand/20 rounded text-[8px] font-black uppercase tracking-[0.2em]">Verified Blueprint</span>
        <span className="px-2 py-0.5 bg-bg-surface2 border border-border rounded text-[8px] font-bold text-text-muted uppercase tracking-widest">{template.category}</span>
      </div>

      <h3 className="text-sm font-black text-white uppercase tracking-tight mb-2">
        {template.displayName}
      </h3>
      
      <p className="text-[10px] text-text-muted leading-relaxed font-medium mb-6 line-clamp-2">
        {template.body?.text}
      </p>

      <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
         <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Efficiency Rating</span>
            <div className="flex gap-0.5">
               {[1, 2, 3, 4, 5].map(i => (
                 <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand" />
               ))}
            </div>
         </div>
         <button 
           onClick={() => onUse(template)}
           className="bg-brand hover:bg-brand-dark text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-brand/10"
         >
           <PlusCircle size={14} />
           Use Template
         </button>
      </div>
    </motion.div>
  );
}
