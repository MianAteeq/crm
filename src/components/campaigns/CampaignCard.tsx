import React from 'react';
import { MoreHorizontal, Users, Send, CheckCircle2, AlertCircle, Calendar, ArrowRight } from 'lucide-react';
import { Campaign } from '../../types';
import StatusBadge from './StatusBadge';
import { motion } from 'motion/react';

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
      whileHover={{ y: -4 }}
      onClick={() => onClick(campaign)}
      className="bg-bg-surface border border-border rounded-[2.5rem] p-8 cursor-pointer hover:border-brand/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-8">
        <div className="w-14 h-14 rounded-2xl bg-brand/5 border border-brand/10 flex items-center justify-center text-brand">
          {campaign.type === 'Broadcast' ? <Send size={24} /> : <Calendar size={24} />}
        </div>
        <StatusBadge status={campaign.status} />
      </div>

      <div className="space-y-1 mb-8">
        <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-brand transition-colors">
          {campaign.name}
        </h3>
        <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">
          {campaign.type} • Created {new Date(campaign.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-bg-surface3 rounded-2xl border border-border">
          <div className="flex items-center gap-2 text-text-muted mb-1">
            <Users size={12} />
            <span className="text-[9px] font-black uppercase tracking-widest">Audience</span>
          </div>
          <p className="text-lg font-black text-white">{campaign.audienceSize.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-bg-surface3 rounded-2xl border border-border">
          <div className="flex items-center gap-2 text-text-muted mb-1">
            <CheckCircle2 size={12} />
            <span className="text-[9px] font-black uppercase tracking-widest">Delivery</span>
          </div>
          <p className="text-lg font-black text-white">{deliveryRate}%</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-border mt-auto">
        <div className="flex -space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-6 h-6 rounded-full border-2 border-bg-surface bg-bg-surface3" />
          ))}
          <div className="w-6 h-6 rounded-full border-2 border-bg-surface bg-brand flex items-center justify-center text-[8px] font-black text-white">
            +
          </div>
        </div>
        <div className="flex items-center gap-2 text-brand group-hover:translate-x-1 transition-transform">
          <span className="text-[10px] font-black uppercase tracking-widest">Analytics</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </motion.div>
  );
};

export default CampaignCard;
