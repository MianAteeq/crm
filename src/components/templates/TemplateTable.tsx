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
          <tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Template Name</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lang</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Updated</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {templates.map((t) => (
            <tr 
              key={t.id} 
              onClick={() => onSelect(t)}
              className="group hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{t.displayName}</span>
                  <span className="text-[10px] text-slate-400 font-mono font-medium">{t.name}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  {t.category}
                </span>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={t.status} />
              </td>
              <td className="px-6 py-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{t.language}</span>
              </td>
              <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {t.edited}
              </td>
              <td className="px-6 py-4 text-right">
                 <button className="p-2 hover:bg-white border hover:border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition-colors inline-flex items-center gap-2">
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
