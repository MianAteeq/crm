import React from 'react';
import { MoreHorizontal, Eye, Copy, Trash2, Pause, Play } from 'lucide-react';
import { Campaign } from '../../types';
import StatusBadge from './StatusBadge';

interface CampaignTableProps {
  campaigns: Campaign[];
  onView: (campaign: Campaign) => void;
}

export default function CampaignTable({ campaigns, onView }: CampaignTableProps) {
  return (
    <div className="bg-bg-surface border border-border rounded-[2.5rem] overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-bg-surface2/30">
            <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Campaign Name</th>
            <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Type</th>
            <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Audience</th>
            <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Analytics (S/D/R)</th>
            <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Status</th>
            <th className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {campaigns.map((campaign) => (
            <tr 
              key={campaign.id} 
              className="hover:bg-bg-surface2/50 transition-colors group cursor-pointer"
              onClick={() => onView(campaign)}
            >
              <td className="px-8 py-6">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-white uppercase tracking-tight group-hover:text-brand transition-colors">
                    {campaign.name}
                  </span>
                  <span className="text-[10px] text-text-muted font-bold mt-1">
                    Scheduled: {campaign.scheduledAt ? new Date(campaign.scheduledAt).toLocaleString() : 'Not set'}
                  </span>
                </div>
              </td>
              <td className="px-8 py-6">
                <span className="px-3 py-1 rounded-lg bg-bg-surface3 border border-border text-[9px] font-black text-text-muted uppercase tracking-widest">
                  {campaign.type}
                </span>
              </td>
              <td className="px-8 py-6">
                <span className="text-sm font-black text-white">{campaign.audienceSize.toLocaleString()}</span>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white tracking-tight">{campaign.sent}</span>
                    <span className="text-[9px] text-text-muted uppercase font-black tracking-tighter">Sent</span>
                  </div>
                  <div className="w-px h-6 bg-border" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white tracking-tight">{campaign.delivered}</span>
                    <span className="text-[9px] text-text-muted uppercase font-black tracking-tighter">Deliv.</span>
                  </div>
                  <div className="w-px h-6 bg-border" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white tracking-tight">{campaign.read}</span>
                    <span className="text-[9px] text-text-muted uppercase font-black tracking-tighter">Read</span>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <StatusBadge status={campaign.status} />
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  <button className="p-3 rounded-xl bg-bg-surface3 border border-border text-text-muted hover:text-white transition-all">
                    <Eye size={16} />
                  </button>
                  <button className="p-3 rounded-xl bg-bg-surface3 border border-border text-text-muted hover:text-white transition-all">
                    <Copy size={16} />
                  </button>
                  <button className="p-3 rounded-xl bg-bg-surface3 border border-border text-text-muted hover:text-rose-500 hover:border-rose-500/30 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
