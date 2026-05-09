import React from 'react';
import { MoreHorizontal, Users, Send, CheckCircle2, AlertCircle, Calendar, ArrowRight } from 'lucide-react';
import { Campaign } from '../../types';
import StatusBadge from './StatusBadge';
import { motion } from 'motion/react';
import { formatSafeDate } from '../../lib/utils';

interface CampaignCardProps {
  campaign: Campaign;
  onClick: (campaign: Campaign) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onClick }) => {
  const deliveryRate = campaign.audienceSize > 0 
    ? Math.round((campaign.delivered / campaign.audienceSize) * 100) 
    : 0;

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      onClick={() => onClick(campaign)}
      className="bg-white border border-slate-200 rounded-xl p-6 cursor-pointer hover:border-slate-300 hover:shadow-md transition-all group flex flex-col"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:bg-slate-100 transition-colors">
          {campaign.type === 'Broadcast' ? <Send size={20} /> : <Calendar size={20} />}
        </div>
        <StatusBadge status={campaign.status} />
      </div>

      <div className="space-y-1 mb-6">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
          {campaign.name}
        </h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          {campaign.type} • {formatSafeDate(campaign.createdAt)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Users size={12} />
            <span className="text-[9px] font-bold uppercase tracking-widest">Audience</span>
          </div>
          <p className="text-base font-bold text-slate-900">{campaign.audienceSize.toLocaleString()}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <CheckCircle2 size={12} />
            <span className="text-[9px] font-bold uppercase tracking-widest">Success</span>
          </div>
          <p className="text-base font-bold text-slate-900">{deliveryRate}%</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
        <div className="flex -space-x-1.5">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-100" />
          ))}
          <div className="w-5 h-5 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center text-[8px] font-bold text-white">
            +
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-blue-600 group-hover:translate-x-1 transition-transform">
          <span className="text-[10px] font-bold uppercase tracking-wider">Details</span>
          <ArrowRight size={12} />
        </div>
      </div>
    </motion.div>
  );
};

export default CampaignCard;
