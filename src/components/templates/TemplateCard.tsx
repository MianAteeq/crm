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
      className="bg-bg-surface border border-border rounded-2xl p-5 hover:border-brand/40 transition-colors cursor-pointer group flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <StatusBadge status={template.status} />
        <button className="p-1 hover:bg-bg-surface3 rounded-lg text-text-muted transition-colors">
          <MoreVertical size={14} />
        </button>
      </div>

      <div className="space-y-1 mb-4 flex-1">
        <h3 className="text-xs font-bold text-white uppercase tracking-tight group-hover:text-brand transition-colors">
          {template.displayName}
        </h3>
        <p className="text-[10px] text-text-muted font-mono">{template.name}</p>
      </div>

      <div className="bg-bg-surface2/50 rounded-xl p-3 mb-4 flex-1">
        <p className="text-[10px] text-text-muted line-clamp-3 leading-relaxed italic">
          "{template.body.text}"
        </p>
      </div>

      <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-text-muted border-t border-border pt-4">
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <span className="text-brand opacity-60">CAT:</span> {template.category}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-brand opacity-60">LN:</span> {template.language}
          </div>
        </div>
        <span>{template.edited}</span>
      </div>
    </motion.div>
  );
}
