import React from 'react';
import { CampaignRecipient } from '../../../types';
import { Search, Filter, Download, User, Smartphone, Clock, AlertCircle, CheckCircle2, Eye, Send } from 'lucide-react';

interface RecipientTableProps {
  recipients: CampaignRecipient[];
}

export default function RecipientTable({ recipients }: RecipientTableProps) {
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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={16} />
          <input 
            placeholder="Search recipients by name or phone..."
            className="w-full bg-bg-surface3 border border-border rounded-xl p-4 pl-12 text-xs font-bold text-white focus:outline-none focus:border-brand/40 transition-all shadow-inner"
          />
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-5 py-4 bg-bg-surface border border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-white transition-all">
              <Filter size={14} /> Filter
           </button>
           <button className="flex items-center gap-2 px-5 py-4 bg-bg-surface border border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-white transition-all">
              <Download size={14} /> Export CSV
           </button>
        </div>
      </div>

      <div className="bg-bg-surface border border-border rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-bg-surface2/30">
              <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Contact</th>
              <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Delivery</th>
              <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Timestamp</th>
              <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Error Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {recipients.map((r) => (
              <tr key={r.id} className="hover:bg-bg-surface2/30 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-bg-surface3 border border-border flex items-center justify-center text-text-muted">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-tight leading-none">{r.contactName}</p>
                      <p className="text-[10px] text-text-muted font-bold mt-1">ID: {r.contactId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(r.status)}
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      r.status === 'read' ? 'text-violet-500' :
                      r.status === 'delivered' ? 'text-emerald-500' :
                      r.status === 'sent' ? 'text-blue-500' : 'text-rose-500'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3 text-text-muted">
                     <Clock size={14} />
                     <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(r.timestamp).toLocaleString()}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  {r.error ? (
                    <span className="text-[10px] font-bold text-rose-500/80 bg-rose-500/5 px-3 py-1.5 rounded-lg border border-rose-500/10">
                      {r.error}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-text-muted opacity-40">—</span>
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
