import { Template } from '@/src/data/templates';
import StatusBadge from './StatusBadge';
import { MoreVertical, Copy, Edit, Trash2, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface TemplateCardProps {
  template: Template;
  onClick: (template: Template) => void;
  key?: string | number;
}

export default function TemplateCard({ template, onClick }: TemplateCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => onClick(template)}
      className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-400 transition-all cursor-pointer group flex flex-col h-full shadow-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <StatusBadge status={template.status} />
        <button className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
          <MoreVertical size={14} />
        </button>
      </div>

      <div className="space-y-1 mb-4 flex-1">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors uppercase">
          {template.displayName}
        </h3>
        <p className="text-[10px] text-slate-400 font-mono font-medium">{template.name}</p>
      </div>

      <div className="bg-slate-50 rounded-xl p-3 mb-4 flex-1 border border-slate-100">
        <p className="text-[10px] text-slate-500 line-clamp-3 leading-relaxed italic font-medium">
          "{template.body.text}"
        </p>
      </div>

      <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-slate-400 border-t border-slate-50 pt-4">
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <span className="text-slate-900 opacity-60">CAT:</span> {template.category}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-900 opacity-60">LN:</span> {template.language}
          </div>
        </div>
        <span>{template.edited}</span>
      </div>
    </motion.div>
  );
}
