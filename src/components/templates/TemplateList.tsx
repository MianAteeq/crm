import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText,
  Tag,
  Languages,
  Calendar,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Template } from '@/src/data/templates';
import { motion } from 'motion/react';

interface TemplateListProps {
  templates: Template[];
  activeId: string;
  onSelect: (template: Template) => void;
  currentStatus: string;
  onStatusChange: (status: string) => void;
}

const statusConfig = {
  approved: { color: 'text-brand bg-brand/10', icon: CheckCircle2 },
  pending: { color: 'text-yellow-500 bg-yellow-500/10', icon: Clock },
  rejected: { color: 'text-red-500 bg-red-500/10', icon: AlertCircle },
  draft: { color: 'text-zinc-500 bg-zinc-500/10', icon: FileText }
};

const filterOptions = ['all', 'approved', 'pending', 'rejected', 'draft'];

export default function TemplateList({ 
  templates, 
  activeId, 
  onSelect, 
  currentStatus, 
  onStatusChange 
}: TemplateListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-bg-surface/50 border-b border-border flex items-center justify-between">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Inventory</h2>
        <span className="bg-bg-surface3 px-2 py-0.5 rounded-full text-[9px] font-bold border border-border text-text-muted">
          {templates.length} UNITS
        </span>
      </div>

      <div className="px-2 py-2 bg-bg-surface/30 border-b border-border flex items-center gap-1 overflow-x-auto custom-scrollbar no-scrollbar">
        {filterOptions.map((status) => (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
              currentStatus === status 
                ? "bg-bg-surface3 text-white shadow-sm border border-border" 
                : "text-text-muted hover:text-text-primary hover:bg-bg-surface3/50"
            )}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {templates.map((template, idx) => {
          const Config = statusConfig[template.status];
          const isActive = activeId === template.id;

          return (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              key={template.id}
              onClick={() => onSelect(template)}
              className={cn(
                "group relative p-5 border-b border-border/50 cursor-pointer transition-all hover:bg-bg-surface3/30",
                isActive && "bg-bg-surface3/50 border-l-4 border-l-brand"
              )}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-1">
                  <h3 className={cn(
                    "text-xs font-bold transition-colors truncate max-w-[180px]",
                    isActive ? "text-white" : "text-text-muted group-hover:text-text-primary"
                  )}>
                    {template.displayName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-text-muted transition-opacity group-hover:opacity-100 opacity-60">
                      {template.name}
                    </span>
                  </div>
                </div>
                <div className={cn("p-1.5 rounded-lg", Config.color)}>
                  <Config.icon size={12} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-bg-surface3 rounded-md text-[9px] font-bold text-text-muted border border-border/50 uppercase tracking-tighter">
                  <Tag size={10} />
                  {template.category}
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-bg-surface3 rounded-md text-[9px] font-bold text-text-muted border border-border/50 uppercase tracking-tighter">
                  <Languages size={10} />
                  {template.language}
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between text-[9px] font-bold text-text-muted/60 uppercase tracking-widest">
                <div className="flex items-center gap-1">
                  <Calendar size={10} />
                  {template.edited}
                </div>
                <div className="group-hover:opacity-100 opacity-0 transition-opacity">
                  <MoreVertical size={12} />
                </div>
              </div>

              {isActive && (
                <motion.div 
                  layoutId="active-blob"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-brand"
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
