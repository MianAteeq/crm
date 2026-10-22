import React from 'react';
import { MoreHorizontal, Eye, Copy, Trash2, Pause, Play, ChevronRight, ChevronLeft, Zap, Target } from 'lucide-react';
import { Campaign } from '../../types';
import StatusBadge from './StatusBadge';
import { formatSafeDateTime } from '../../lib/utils';
import { cn } from '../../lib/utils';
import { useI18n } from '../../i18n';

interface CampaignTableProps {
  campaigns: Campaign[];
  onView: (campaign: Campaign) => void;
  onDelete?: (campaign: Campaign) => void;
}

export default function CampaignTable({ campaigns = [], onView, onDelete }: CampaignTableProps) {
  const { isRtl } = useI18n();

  return (
    <div className="bg-white border border-slate-200/60 rounded-[2rem] overflow-hidden shadow-premium" dir={isRtl ? 'rtl' : 'ltr'}>
      <table className={`w-full border-collapse ${isRtl ? 'text-right' : 'text-left'}`}>
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/30">
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {isRtl ? 'الحملة' : 'Campaign'}
            </th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {isRtl ? 'النوع' : 'Type'}
            </th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
              {isRtl ? 'الوصول' : 'Reach'}
            </th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {isRtl ? 'الأداء' : 'Performance'}
            </th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {isRtl ? 'الحالة' : 'Status'}
            </th>
            <th className={`px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ${isRtl ? 'text-left' : 'text-right'}`}>
              {isRtl ? 'الإجراءات' : 'Actions'}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/50">
          {(campaigns || []).map((campaign) => {
            const typeLabel = campaign.type === 'Broadcast' 
              ? (isRtl ? 'بث مباشر' : 'Broadcast') 
              : (isRtl ? 'أتمتة' : 'Automation');
            return (
              <tr 
                key={campaign.id} 
                className="hover:bg-slate-50/50 transition-all group cursor-pointer"
                onClick={() => onView(campaign)}
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 shrink-0",
                      campaign.type === 'Broadcast' ? "bg-indigo-50 border-indigo-100 text-indigo-500" : "bg-purple-50 border-purple-100 text-purple-500"
                    )}>
                      {campaign.type === 'Broadcast' ? <Zap size={18} /> : <Target size={18} />}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-slate-900 tracking-tight truncate group-hover:text-[#166534] transition-colors">
                        {campaign.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                        {campaign.scheduledAt ? formatSafeDateTime(campaign.scheduledAt) : (isRtl ? 'تسليم فوري' : 'Immediate Delivery')}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200/50 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    {typeLabel}
                  </span>
                </td>
                <td className="px-8 py-6 text-center">
                  <span className="text-sm font-black text-slate-900 tracking-tight italic">{campaign.audienceSize.toLocaleString()}</span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-900">{campaign.delivered}</span>
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                        {isRtl ? 'مستلم' : 'Deliv.'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-900">{campaign.read}</span>
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                        {isRtl ? 'مقروء' : 'Read'}
                      </span>
                    </div>
                    <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#166534] rounded-full" 
                        style={{ width: `${Math.min(100, (campaign.read / (campaign.delivered || 1)) * 100)}%` }} 
                      />
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <StatusBadge status={campaign.status} />
                </td>
                <td className={`px-8 py-6 ${isRtl ? 'text-left' : 'text-right'}`}>
                  <div className={`flex items-center gap-2 ${isRtl ? 'justify-start' : 'justify-end'}`} onClick={e => e.stopPropagation()}>
                    <button 
                      onClick={() => onView(campaign)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all pointer-events-auto cursor-pointer"
                      title={isRtl ? 'عرض تفاصيل الحملة' : 'View Campaign Details'}
                    >
                      <Eye size={16} />
                    </button>
                    {onDelete && (
                      <button 
                        onClick={() => onDelete(campaign)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all cursor-pointer"
                        title={isRtl ? 'حذف الحملة' : 'Delete Campaign'}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
