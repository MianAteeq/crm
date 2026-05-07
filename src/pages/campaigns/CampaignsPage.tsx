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
    <div className="space-y-8 min-h-screen pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Campaigns</h1>
           <p className="text-slate-500 mt-1 font-medium text-sm">Orchestrate and analyze your WhatsApp outreach campaigns</p>
        </div>
        <button 
          onClick={() => navigate('/campaigns/create')}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm active:scale-95 group"
        >
          <Plus size={18} strokeWidth={2} />
          Create Campaign
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-sm group hover:border-slate-300 transition-all">
             <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                   <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
                   <span className={`text-[10px] font-bold ${stat.trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} px-2 py-0.5 rounded-full`}>
                      {stat.change}
                   </span>
                </div>
             </div>
             <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-900 transition-colors">
                <stat.icon size={20} />
             </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="relative group flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={16} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
           <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-lg p-1">
              {(['grid', 'table'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === mode ? 'bg-white border border-slate-200 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {mode === 'grid' ? <LayoutGrid size={16} /> : <List size={16} />}
                </button>
              ))}
           </div>

           <select 
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
             className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-xs font-bold text-slate-600 hover:border-slate-300 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-100"
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
             className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-xs font-bold text-slate-600 hover:border-slate-300 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-100"
           >
              <option value="all">All Types</option>
              <option value="broadcast">Broadcast</option>
              <option value="automation">Automation</option>
           </select>
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
           <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-6 shadow-sm">
              <Send size={32} />
           </div>
           <h3 className="text-xl font-bold text-slate-900 tracking-tight">No Campaigns Found</h3>
           <p className="text-slate-500 mt-2 font-medium max-w-[320px] text-sm leading-relaxed">
              Try adjusting your search filters or create your first campaign to get started.
           </p>
        </div>
      )}
    </div>
  );
}
