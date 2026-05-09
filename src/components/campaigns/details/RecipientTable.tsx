import React from 'react';
import { CampaignRecipient } from '../../../types';
import { Search, Filter, Download, User, Smartphone, Clock, AlertCircle, CheckCircle2, Eye, Send } from 'lucide-react';
import { formatSafeDateTime } from '../../../lib/utils';

interface RecipientTableProps {
  recipients: CampaignRecipient[];
}

export default function RecipientTable({ recipients = [] }: RecipientTableProps) {
  const getStatusIcon = (status: CampaignRecipient['status']) => {
    switch (status) {
      case 'read': return <Eye size={14} className="text-violet-500" />;
      case 'delivered': return <CheckCircle2 size={14} className="text-emerald-500" />;
      case 'sent': return <Send size={14} className="text-blue-500" />;
      case 'failed': return <AlertCircle size={14} className="text-rose-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
          <input 
            placeholder="Search recipients by name or phone..."
            className="w-full bg-white border border-slate-200 rounded-xl p-4 pl-12 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-5 py-4 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all shadow-sm">
              <Filter size={14} /> Filter
           </button>
           <button className="flex items-center gap-2 px-5 py-4 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all shadow-sm">
              <Download size={14} /> Export CSV
           </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact</th>
              <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Delivery</th>
              <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</th>
              <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Error Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {(recipients || []).map((r) => (
              <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 tracking-tight leading-none uppercase">{r.contactName}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">ID: {r.contactId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(r.status)}
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      r.status === 'read' ? 'text-indigo-600' :
                      r.status === 'delivered' ? 'text-emerald-600' :
                      r.status === 'sent' ? 'text-blue-600' : 'text-rose-600'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3 text-slate-400">
                     <Clock size={14} />
                     <span className="text-[10px] font-bold uppercase tracking-widest">{formatSafeDateTime(r.timestamp)}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  {r.error ? (
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                      {r.error}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-300">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
