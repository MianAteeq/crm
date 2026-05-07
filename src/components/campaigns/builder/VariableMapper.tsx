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
      <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl flex gap-6 items-start shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/10 shrink-0">
          <Database size={24} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 tracking-tight mb-1">Variable Mapping</h4>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-2xl">
            Match the placeholders in your template (*{"{{1}}"}*, *{"{{2}}"}*, etc.) with real contact data from your database. This ensures every message is personalized for the recipient.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Variable</th>
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center w-24">Link</th>
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Source</th>
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sample Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {variables.map((v, i) => {
              const varNum = (i + 1).toString();
              return (
                <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                        {varNum}
                      </div>
                      <span className="text-sm font-bold text-slate-900 tracking-tight uppercase">{v.label}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <Link size={16} className="text-slate-300 inline-block" />
                  </td>
                  <td className="px-8 py-5">
                    <select 
                      value={mapping[varNum] || ''}
                      onChange={(e) => onChange({ ...mapping, [varNum]: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900 transition-all shadow-inner"
                    >
                      <option value="">Select Field...</option>
                      {contactFields.map(cf => (
                        <option key={cf.value} value={cf.value}>{cf.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-8 py-5 text-slate-400 text-xs italic font-medium">
                    Ex: {v.sample}
                  </td>
                </tr>
              );
            })}
            {variables.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-12 text-center text-slate-400 italic text-xs font-medium">
                  This template has no dynamic variables.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2.5 text-slate-400 px-4">
        <AlertCircle size={14} />
        <p className="text-[10px] font-bold uppercase tracking-widest leading-none">
          Ensure all variables are mapped before proceeding to scheduling.
        </p>
      </div>
    </div>
  );
}
