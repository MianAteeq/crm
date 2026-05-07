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
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Campaign Name</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Audience</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Analytics</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {campaigns.map((campaign) => (
            <tr 
              key={campaign.id} 
              className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
              onClick={() => onView(campaign)}
            >
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                    {campaign.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {campaign.scheduledAt ? new Date(campaign.scheduledAt).toLocaleString() : 'Not scheduled'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-600">
                  {campaign.type}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-bold text-slate-900">{campaign.audienceSize.toLocaleString()}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">{campaign.sent}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Sent</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">{campaign.delivered}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Deliv.</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">{campaign.read}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Read</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={campaign.status} />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                  <button className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
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
