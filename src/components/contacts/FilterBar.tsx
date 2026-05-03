import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronDown, Calendar, Users, Target, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedTag: string;
  onTagChange: (val: string) => void;
  tags: string[];
}

export default function FilterBar({ searchQuery, onSearchChange, selectedTag, onTagChange, tags }: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="py-6 space-y-4">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input 
            type="text"
            placeholder="Search by name, phone, tags or campaign..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-bg-surface/50 border border-border rounded-2xl py-3 pl-12 pr-4 text-xs font-semibold focus:outline-none focus:border-brand/40 focus:bg-bg-surface transition-all placeholder:text-text-muted/40"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select 
              value={selectedTag}
              onChange={(e) => onTagChange(e.target.value)}
              className="w-full md:w-48 appearance-none bg-bg-surface/50 border border-border rounded-2xl py-3 pl-10 pr-10 text-[10px] font-black uppercase tracking-widest cursor-pointer focus:outline-none hover:bg-bg-surface transition-all"
            >
              <option value="">All Tags</option>
              {tags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={14} />
          </div>

          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-2 rounded-2xl py-3 px-4 text-[10px] font-black uppercase tracking-widest transition-all border ${
              showAdvanced ? 'bg-brand text-white border-brand' : 'bg-bg-surface/50 border-border text-text-muted hover:bg-bg-surface'
            }`}
          >
            <SlidersHorizontal size={14} />
            <span>Advanced</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showAdvanced && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-bg-surface2/30 border border-border rounded-[2rem] grid grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Status Filter */}
              <div className="space-y-3">
                 <label className="text-[9px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                   <Target size={12} className="text-brand" /> Status
                 </label>
                 <div className="flex flex-wrap gap-2">
                   {['Active', 'Inactive', 'Blocked'].map(status => (
                     <button key={status} className="px-3 py-1.5 bg-bg-surface border border-border rounded-xl text-[9px] font-bold text-text-muted hover:border-brand hover:text-brand transition-all">
                       {status}
                     </button>
                   ))}
                 </div>
              </div>

              {/* Activity Filter */}
              <div className="space-y-3">
                 <label className="text-[9px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                   <Calendar size={12} className="text-brand" /> Last Activity
                 </label>
                 <select className="w-full bg-bg-surface border border-border rounded-xl p-2.5 text-[10px] font-bold text-white focus:outline-none focus:border-brand/40">
                   <option>Anytime</option>
                   <option>Last 24 Hours</option>
                   <option>Last 7 Days</option>
                   <option>Last 30 Days</option>
                 </select>
              </div>

              {/* Campaign Filter */}
              <div className="space-y-3">
                 <label className="text-[9px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                   <Inbox size={12} className="text-brand" /> Campaign Engagement
                 </label>
                 <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1.5 bg-bg-surface border border-border rounded-xl text-[9px] font-bold text-text-muted hover:border-emerald-500 hover:text-emerald-500 transition-all">Read</button>
                    <button className="px-3 py-1.5 bg-bg-surface border border-border rounded-xl text-[9px] font-bold text-text-muted hover:border-blue-500 hover:text-blue-500 transition-all">Delivered</button>
                 </div>
              </div>

              {/* Owner Filter */}
              <div className="space-y-3">
                 <label className="text-[9px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                   <Users size={12} className="text-brand" /> Assignee/Owner
                 </label>
                 <button className="w-full flex items-center justify-between bg-bg-surface border border-border rounded-xl p-2.5 text-[10px] font-bold text-text-muted">
                    Selection...
                    <ChevronDown size={12} />
                 </button>
              </div>

              <div className="lg:col-span-4 pt-4 border-t border-border flex justify-between">
                 <button className="text-[9px] font-black uppercase text-rose-500 hover:underline">Clear all filters</button>
                 <button className="px-6 py-2 bg-brand text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Apply Search</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
