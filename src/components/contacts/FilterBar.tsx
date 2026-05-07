import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronDown, Calendar, Users, Target, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Tag as TagType } from '../../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedTag: string;
  onTagChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  lastTouchpoint: string;
  onTouchpointChange: (val: string) => void;
  tags: TagType[];
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

export default function FilterBar({ 
  searchQuery, 
  onSearchChange, 
  selectedTag, 
  onTagChange, 
  selectedStatus,
  onStatusChange,
  lastTouchpoint,
  onTouchpointChange,
  tags,
  onApplyFilters,
  onResetFilters
}: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search by name, phone, tags..."
            value={searchQuery}
            onKeyDown={(e) => e.key === 'Enter' && onApplyFilters()}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select 
              value={selectedTag}
              onChange={(e) => onTagChange(e.target.value)}
              className="w-full md:w-40 appearance-none bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-xs font-bold text-slate-600 cursor-pointer focus:outline-none hover:border-slate-400 transition-all"
            >
              <option value="">All Tags</option>
              {tags.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
            </select>
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>

          <button 
            onClick={onApplyFilters}
            className="flex items-center gap-2 bg-black text-white rounded-xl py-2.5 px-4 text-xs font-bold transition-all shadow-md shadow-black/20 hover:bg-slate-900"
          >
            <Search size={14} />
            <span>Filter</span>
          </button>

          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition-all border ${
              showAdvanced ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
            }`}
          >
            <SlidersHorizontal size={14} />
            <span>Options</span>
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
            <div className="mt-4 p-6 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Status Filter */}
              <div className="space-y-4">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   Life Cycle Status
                 </label>
                 <div className="flex flex-wrap gap-2">
                   {['active', 'inactive'].map(status => (
                     <button 
                        key={status} 
                        type="button"
                        onClick={() => onStatusChange(selectedStatus === status ? '' : status)}
                        className={`px-3 py-1.5 border rounded-lg text-[10px] font-bold transition-all capitalize ${
                          selectedStatus === status 
                          ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-900'
                        }`}
                      >
                       {status}
                     </button>
                   ))}
                 </div>
              </div>

              {/* Activity Filter */}
              <div className="space-y-4">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   Last Touchpoint
                 </label>
                 <select 
                    value={lastTouchpoint}
                    onChange={(e) => onTouchpointChange(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-400 cursor-pointer"
                  >
                   <option value="">Anytime</option>
                   <option value="24_hours">Last 24 Hours</option>
                   <option value="7_days">Last 7 Days</option>
                   <option value="30_days">Last 30 Days</option>
                 </select>
              </div>

              {/* Tags Filter */}
              <div className="lg:col-span-2 space-y-4">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    Available Tags
                 </label>
                 <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto no-scrollbar pb-2">
                    {tags.map(tag => (
                      <button 
                        key={tag.id}
                        type="button"
                        onClick={() => onTagChange(selectedTag === tag.id ? '' : tag.id)}
                        className={`px-3 py-1.5 border rounded-lg text-[10px] font-bold transition-all ${
                          selectedTag === tag.id
                          ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-900'
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="lg:col-span-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                 <button onClick={() => setShowAdvanced(false)} className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all">Dismiss</button>
                 <div className="flex gap-4">
                    <button 
                      onClick={onResetFilters}
                      className="text-[11px] font-bold text-red-500 uppercase tracking-widest hover:underline"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={onApplyFilters}
                      className="px-6 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-slate-800 transition-all"
                    >
                      Apply Filters
                    </button>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
