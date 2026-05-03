import React from 'react';
import { Database, Link, AlertCircle } from 'lucide-react';
import { templates as mockTemplates } from '../../../data/templates';

interface VariableMapperProps {
  templateId: string;
  mapping: Record<string, string>;
  onChange: (mapping: Record<string, string>) => void;
}

export default function VariableMapper({ templateId, mapping, onChange }: VariableMapperProps) {
  const template = mockTemplates.find(t => t.id === templateId);
  const variables = template?.body.variables || [];

  const contactFields = [
    { value: 'name', label: 'Full Name' },
    { value: 'first_name', label: 'First Name' },
    { value: 'phone', label: 'Phone Number' },
    { value: 'company', label: 'Company Name' },
    { value: 'city', label: 'City' },
    { value: 'custom_1', label: 'Custom Field 1' },
  ];

  if (!template) return null;

  return (
    <div className="space-y-10">
      <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-[2rem] flex gap-6 items-start">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
          <Database size={24} />
        </div>
        <div>
          <h4 className="text-sm font-black text-white uppercase tracking-tight mb-1">Variable Mapping</h4>
          <p className="text-[11px] text-text-muted font-medium leading-relaxed max-w-2xl">
            Match the placeholders in your template (*{"{{1}}"}*, *{"{{2}}"}*, etc.) with real contact data from your database. This ensures every message is personalized.
          </p>
        </div>
      </div>

      <div className="bg-bg-surface border border-border rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-bg-surface2/30">
              <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Variable</th>
              <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] text-center w-24">Link</th>
              <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Contact Source</th>
              <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Sample Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {variables.map((v, i) => {
              const varNum = (i + 1).toString();
              return (
                <tr key={i} className="hover:bg-bg-surface2/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-[10px] font-black text-brand">
                        {varNum}
                      </div>
                      <span className="text-sm font-bold text-white uppercase tracking-tight">{v.label}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <Link size={16} className="text-text-muted inline-block" />
                  </td>
                  <td className="px-8 py-6">
                    <select 
                      value={mapping[varNum] || ''}
                      onChange={(e) => onChange({ ...mapping, [varNum]: e.target.value })}
                      className="w-full bg-bg-surface3 border border-border rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-brand/40 transition-all"
                    >
                      <option value="">Select Field...</option>
                      {contactFields.map(cf => (
                        <option key={cf.value} value={cf.value}>{cf.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-8 py-6 text-text-muted text-xs italic">
                    Ex: {v.sample}
                  </td>
                </tr>
              );
            })}
            {variables.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-12 text-center text-text-muted italic text-xs">
                  This template has no dynamic variables.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3 text-brand/60 px-4">
        <AlertCircle size={14} />
        <p className="text-[10px] font-black uppercase tracking-widest leading-none">
          Ensure all variables are mapped before proceeding to scheduling.
        </p>
      </div>
    </div>
  );
}
