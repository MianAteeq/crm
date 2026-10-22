import React from 'react';
import { MoreHorizontal, Users, Send, CheckCircle2, AlertCircle, Calendar, ArrowRight, ArrowLeft, Zap, Target, TrendingUp, Trash2 } from 'lucide-react';
import { Campaign } from '../../types';
import StatusBadge from './StatusBadge';
import { motion } from 'motion/react';
import { formatSafeDate } from '../../lib/utils';
import { cn } from '../../lib/utils';
import { useI18n } from '../../i18n';

interface CampaignCardProps {
  campaign: Campaign;
  onClick: (campaign: Campaign) => void;
  onDelete?: (e: React.MouseEvent, campaign: Campaign) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onClick, onDelete }) => {
  const { isRtl } = useI18n();

  const deliveryRate = campaign.audienceSize > 0 
    ? Math.round((campaign.delivered / campaign.audienceSize) * 100) 
    : 0;

  const typeLabel = campaign.type === 'Broadcast' 
    ? (isRtl ? 'بث مباشر' : 'Broadcast') 
    : (isRtl ? 'أتمتة' : 'Automation');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onClick={() => onClick(campaign)}
      className="group relative bg-white border border-slate-200/60 rounded-[2rem] p-8 cursor-pointer shadow-premium transition-all duration-500 hover:shadow-floating hover:border-[#166534]/20 flex flex-col overflow-hidden"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Background Gradient Glow */}
      <div className={`absolute -top-24 ${isRtl ? '-left-24' : '-right-24'} w-48 h-48 bg-[#166534]/5 blur-[80px] rounded-full group-hover:bg-[#166534]/10 transition-colors duration-500`} />
      
      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm border",
          campaign.type === 'Broadcast' 
            ? "bg-indigo-50 border-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white" 
            : "bg-purple-50 border-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white"
        )}>
          {campaign.type === 'Broadcast' ? <Zap size={24} /> : <Target size={24} />}
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={campaign.status} />
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(e, campaign);
              }}
              className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm cursor-pointer"
              title={isRtl ? 'حذف الحملة' : 'Delete Campaign'}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-8 relative z-10">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-[#166534] transition-colors duration-300">
          {campaign.name}
        </h3>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
             {typeLabel}
           </span>
           <div className="w-1 h-1 rounded-full bg-slate-300" />
           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
             {formatSafeDate(campaign.createdAt)}
           </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
        <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 group-hover:bg-white group-hover:border-slate-200 transition-all duration-300">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Users size={12} className="group-hover:text-[#166534] transition-colors" />
            <span className="text-[9px] font-black uppercase tracking-widest leading-none">
              {isRtl ? 'الجمهور المستهدف' : 'Audience'}
            </span>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight leading-none">{campaign.audienceSize.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 group-hover:bg-white group-hover:border-slate-200 transition-all duration-300">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <TrendingUp size={12} className="group-hover:text-emerald-500 transition-colors" />
            <span className="text-[9px] font-black uppercase tracking-widest leading-none">
              {isRtl ? 'نسبة القراءة' : 'Read Rate'}
            </span>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight leading-none">{deliveryRate}%</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
           <span>{isRtl ? 'معدل التسليم' : 'Delivery Progress'}</span>
           <span className="text-slate-900">{deliveryRate}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${deliveryRate}%` }}
             transition={{ duration: 1.5, ease: "easeOut" }}
             className={cn(
               "h-full rounded-full transition-all duration-500",
               deliveryRate > 80 ? "bg-emerald-500" : "bg-[#166534]"
             )}
           />
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-slate-100/60 mt-auto relative z-10">
        <div className="flex -space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 shadow-sm" />
          ))}
          <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center text-[8px] font-bold text-white shadow-sm">
            +
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-2 text-[#166534] font-black transition-transform duration-300",
          isRtl ? "group-hover:-translate-x-2" : "group-hover:translate-x-2"
        )}>
          <span className="text-[10px] uppercase tracking-widest">
            {isRtl ? 'عرض التحليلات' : 'View Analytics'}
          </span>
          {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
        </div>
      </div>
    </motion.div>
  );
};

export default CampaignCard;
