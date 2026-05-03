import { Template } from '@/src/data/templates';
import StatusBadge from './StatusBadge';
import { MoreHorizontal, ExternalLink } from 'lucide-react';

interface TemplateTableProps {
  templates: Template[];
  onSelect: (template: Template) => void;
}

export default function TemplateTable({ templates, onSelect }: TemplateTableProps) {
  return (
    <div className="w-full overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Template Name</th>
            <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Category</th>
            <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Status</th>
            <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Lang</th>
            <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Last Updated</th>
            <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {templates.map((t) => (
            <tr 
              key={t.id} 
              onClick={() => onSelect(t)}
              className="group hover:bg-bg-surface/50 transition-colors cursor-pointer"
            >
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white group-hover:text-brand transition-colors">{t.displayName}</span>
                  <span className="text-[10px] text-text-muted font-mono">{t.name}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-0.5 bg-bg-surface2 border border-border rounded text-[9px] font-bold text-text-muted uppercase tracking-widest">
                  {t.category}
                </span>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={t.status} />
              </td>
              <td className="px-6 py-4">
                <span className="text-[10px] font-bold text-text-muted uppercase">{t.language}</span>
              </td>
              <td className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                {t.edited}
              </td>
              <td className="px-6 py-4 text-right">
                 <button className="p-2 hover:bg-bg-surface3 rounded-lg text-text-muted transition-colors inline-flex items-center gap-2">
                    <ExternalLink size={14} />
                    <MoreHorizontal size={14} />
                 </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
