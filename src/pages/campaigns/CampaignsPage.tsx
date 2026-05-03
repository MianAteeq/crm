import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Filter, LayoutGrid, List, ChevronDown, 
  Send, Zap, Calendar, TrendingUp, MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockCampaigns } from '../../data/mockCampaigns';
import { Campaign } from '../../types';
import CampaignCard from '../../components/campaigns/CampaignCard';
import CampaignTable from '../../components/campaigns/CampaignTable';

export default function CampaignsPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredCampaigns = useMemo(() => {
    return mockCampaigns.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesType = typeFilter === 'all' || c.type.toLowerCase() === typeFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [search, statusFilter, typeFilter]);

  const stats = [
    { label: 'Active Campaigns', value: '12', change: '+2', trend: 'up', icon: Send },
    { label: 'Messages Sent', value: '8.4k', change: '+12%', trend: 'up', icon: Zap },
    { label: 'Avg Read Rate', value: '72%', change: '-3%', trend: 'down', icon: TrendingUp },
  ];

  return (
    <div className="space-y-10 min-h-screen pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Campaigns</h1>
           <p className="text-text-muted mt-2 font-medium tracking-wide">Orchestrate and analyze your WhatsApp outreach</p>
        </div>
        <button 
          onClick={() => navigate('/campaigns/create')}
          className="bg-brand hover:brightness-110 text-black px-8 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center gap-3 shadow-[0_10px_40px_rgba(var(--brand-rgb),0.2)] active:scale-95 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
          <Plus size={18} strokeWidth={3} />
          Create Campaign
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-8 bg-bg-surface border border-border rounded-[2.5rem] flex items-center justify-between group hover:border-brand/30 transition-all">
             <div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-3">
                   <h3 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
                   <span className={`text-[10px] font-black uppercase tracking-widest ${stat.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {stat.change}
                   </span>
                </div>
             </div>
             <div className="w-14 h-14 rounded-2xl bg-bg-surface3 border border-border flex items-center justify-center text-text-muted group-hover:text-brand transition-colors">
                <stat.icon size={28} />
             </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-6 p-6 bg-bg-surface border border-border rounded-[2.5rem] shadow-xl">
        <div className="relative group flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={16} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full bg-bg-surface3 border border-border rounded-2xl p-4 pl-12 text-sm font-bold text-white focus:outline-none focus:border-brand/40 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <div className="flex items-center gap-2 bg-bg-surface3 border border-border rounded-2xl p-2">
              {(['grid', 'table'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2.5 rounded-xl transition-all ${
                    viewMode === mode ? 'bg-bg-surface border border-border text-brand' : 'text-text-muted hover:text-white'
                  }`}
                >
                  {mode === 'grid' ? <LayoutGrid size={18} /> : <List size={18} />}
                </button>
              ))}
           </div>

           <div className="h-10 w-px bg-border mx-2 hidden lg:block" />

           <select 
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
             className="bg-bg-surface3 border border-border rounded-2xl px-5 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest focus:outline-none focus:border-brand/40 transition-all appearance-none pr-10 relative cursor-pointer hover:border-brand/30"
           >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
           </select>

           <select 
             value={typeFilter}
             onChange={(e) => setTypeFilter(e.target.value)}
             className="bg-bg-surface3 border border-border rounded-2xl px-5 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest focus:outline-none focus:border-brand/40 transition-all appearance-none pr-10 relative cursor-pointer hover:border-brand/30"
           >
              <option value="all">All Types</option>
              <option value="broadcast">Broadcast</option>
              <option value="automation">Automation</option>
           </select>

           <button className="flex items-center gap-3 px-6 py-4 bg-bg-surface border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-white transition-all">
              Latest <ChevronDown size={14} />
           </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {filteredCampaigns.map((campaign: Campaign) => (
              <CampaignCard 
                key={campaign.id} 
                campaign={campaign} 
                onClick={(c: Campaign) => { navigate(`/campaigns/${c.id}`); }}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CampaignTable 
              campaigns={filteredCampaigns} 
              onView={(c) => navigate(`/campaigns/${c.id}`)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {filteredCampaigns.length === 0 && (
        <div className="py-20 flex flex-col items-center text-center">
           <div className="w-24 h-24 rounded-[2rem] bg-bg-surface3 border border-border flex items-center justify-center text-text-muted mb-8">
              <Send size={40} />
           </div>
           <h3 className="text-2xl font-black text-white uppercase tracking-tight">No Campaigns Found</h3>
           <p className="text-text-muted mt-2 font-medium max-w-[320px]">
              Try adjusting your search filters or create your first campaign to get started.
           </p>
        </div>
      )}
    </div>
  );
}
