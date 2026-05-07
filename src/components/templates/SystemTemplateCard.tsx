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
      className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-slate-400 transition-all cursor-default group flex flex-col h-full relative overflow-hidden shadow-sm"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Sparkles size={64} className="text-slate-900" />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded text-[8px] font-bold uppercase tracking-widest">Verified Blueprint</span>
        <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[8px] font-bold text-slate-400 uppercase tracking-widest">{template.category}</span>
      </div>

      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-2">
        {template.displayName}
      </h3>
      
      <p className="text-[10px] text-slate-500 leading-relaxed font-medium mb-6 line-clamp-2">
        {template.body?.text}
      </p>

      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
         <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Efficiency Rating</span>
            <div className="flex gap-1">
               {[1, 2, 3, 4, 5].map(i => (
                 <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-900 shadow-sm" />
               ))}
            </div>
         </div>
         <button 
           onClick={() => onUse(template)}
           className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
         >
           <PlusCircle size={14} />
           Use Template
         </button>
      </div>
    </motion.div>
  );
}
