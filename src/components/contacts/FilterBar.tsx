import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronDown, Mail, Layers, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tag as TagType, Category } from '../../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedTag: string;
  onTagChange: (val: string) => void;
  selectedCategory?: string;
  onCategoryChange?: (val: string) => void;
  categories?: Category[];
  selectedEmailStatus?: string;
  onEmailStatusChange?: (val: string) => void;
  selectedCampaign?: string;
  onCampaignChange?: (val: string) => void;
  campaigns?: { id: number | string; name: string }[];
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
  selectedCategory = '',
  onCategoryChange,
  categories = [],
  selectedEmailStatus = '',
  onEmailStatusChange,
  selectedCampaign = '',
  onCampaignChange,
  campaigns = [],
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
      <div className="flex flex-col lg:flex-row items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
          <input 
            type="text"
            placeholder="Search contacts, business, phone, email..."
            value={searchQuery}
            onKeyDown={(e) => e.key === 'Enter' && onApplyFilters()}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#FAFAF9] border border-stone-200 rounded-xl py-2.5 pl-11 pr-4 text-xs font-medium text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#166534] focus:bg-white transition-all placeholder:text-stone-400"
          />
        </div>

        {/* Category Selector (Requirement 1 & 13) */}
        {onCategoryChange && (
          <div className="relative w-full sm:w-auto min-w-[170px]">
            <select 
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-xl py-2.5 pl-9 pr-8 text-xs font-bold text-[#12263A] cursor-pointer focus:outline-none hover:border-[#166534]/50 transition-all"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={14} />
          </div>
        )}

        {/* Email Status Selector (Requirement 13) */}
        {onEmailStatusChange && (
          <div className="relative w-full sm:w-auto min-w-[160px]">
            <select 
              value={selectedEmailStatus}
              onChange={(e) => onEmailStatusChange(e.target.value)}
              className="w-full appearance-none bg-white border border-stone-200 rounded-xl py-2.5 pl-9 pr-8 text-xs font-bold text-[#12263A] cursor-pointer focus:outline-none hover:border-[#166534]/50 transition-all"
            >
              <option value="">Email: All</option>
              <option value="never_sent">Never Sent</option>
              <option value="sent">Sent</option>
              <option value="delivered">Delivered</option>
              <option value="bounced">Bounced</option>
              <option value="failed">Failed</option>
              <option value="unsubscribed">Unsubscribed</option>
            </select>
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={14} />
          </div>
        )}

        {/* Tags Selector */}
        <div className="relative w-full sm:w-auto min-w-[130px]">
          <select 
            value={selectedTag}
            onChange={(e) => onTagChange(e.target.value)}
            className="w-full appearance-none bg-white border border-stone-200 rounded-xl py-2.5 pl-9 pr-8 text-xs font-bold text-[#12263A] cursor-pointer focus:outline-none hover:border-[#166534]/50 transition-all"
          >
            <option value="">All Tags</option>
            {tags.map(tag => (
              <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
          </select>
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={14} />
        </div>

        {/* Filter Button */}
        <button 
          onClick={onApplyFilters}
          className="flex items-center gap-2 bg-[#12263A] text-white rounded-xl py-2.5 px-4 text-xs font-bold transition-all shadow-sm hover:bg-[#166534] whitespace-nowrap cursor-pointer"
        >
          <Search size={14} />
          <span>Filter</span>
        </button>

        {/* Options / Advanced Dropdown Button */}
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition-all border whitespace-nowrap cursor-pointer ${
            showAdvanced ? 'bg-[#166534] text-white border-[#166534] shadow-sm' : 'bg-white border-stone-200 text-[#57534E] hover:border-[#166534]'
          }`}
        >
          <SlidersHorizontal size={14} />
          <span>Options</span>
        </button>
      </div>

      <AnimatePresence>
        {showAdvanced && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-6 bg-[#FAFAF9] border border-stone-200 rounded-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Campaign Filter (Requirement 13 & 15) */}
              {onCampaignChange && (
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                    <Megaphone size={12} /> Target Campaign
                  </label>
                  <select 
                    value={selectedCampaign}
                    onChange={(e) => onCampaignChange(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-lg p-2.5 text-xs font-bold text-[#12263A] focus:outline-none focus:border-[#166534] cursor-pointer"
                  >
                    <option value="">All Campaigns</option>
                    {campaigns.map(camp => (
                      <option key={camp.id} value={camp.id}>{camp.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Status Filter */}
              <div className="space-y-2">
                 <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                   Life Cycle Status
                 </label>
                 <div className="flex flex-wrap gap-2">
                   {['active', 'inactive', 'unsubscribed'].map(status => (
                     <button 
                        key={status} 
                        type="button"
                        onClick={() => onStatusChange(selectedStatus === status ? '' : status)}
                        className={`px-3 py-1.5 border rounded-lg text-[10px] font-bold transition-all capitalize ${
                          selectedStatus === status 
                          ? 'bg-[#166534] border-[#166534] text-white shadow-sm' 
                          : 'bg-white border-stone-200 text-[#57534E] hover:border-[#166534]'
                        }`}
                      >
                       {status}
                     </button>
                   ))}
                 </div>
              </div>

              {/* Activity Filter */}
              <div className="space-y-2">
                 <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                   Last Touchpoint
                 </label>
                 <select 
                    value={lastTouchpoint}
                    onChange={(e) => onTouchpointChange(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-lg p-2.5 text-xs font-bold text-[#12263A] focus:outline-none focus:border-[#166534] cursor-pointer"
                  >
                   <option value="">Anytime</option>
                   <option value="24_hours">Last 24 Hours</option>
                   <option value="7_days">Last 7 Days</option>
                   <option value="30_days">Last 30 Days</option>
                 </select>
              </div>

              {/* Tag Selection list */}
              <div className="space-y-2">
                 <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                    Quick Tag Select
                 </label>
                 <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
                    {tags.map(tag => (
                      <button 
                        key={tag.id}
                        type="button"
                        onClick={() => onTagChange(selectedTag === tag.id ? '' : tag.id)}
                        className={`px-2.5 py-1 border rounded-lg text-[10px] font-bold transition-all ${
                          selectedTag === tag.id
                          ? 'bg-[#166534] border-[#166534] text-white shadow-sm'
                          : 'bg-white border-stone-200 text-[#57534E] hover:border-[#166534]'
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="lg:col-span-4 pt-4 border-t border-stone-200 flex items-center justify-between">
                 <button onClick={() => setShowAdvanced(false)} className="text-[11px] font-bold text-stone-400 uppercase tracking-widest hover:text-[#12263A] transition-all cursor-pointer">Dismiss</button>
                 <div className="flex gap-4">
                    <button 
                      onClick={onResetFilters}
                      className="text-[11px] font-bold text-red-600 uppercase tracking-widest hover:underline cursor-pointer"
                    >
                      Reset All
                    </button>
                    <button 
                      onClick={onApplyFilters}
                      className="px-6 py-2 bg-[#12263A] hover:bg-[#166534] text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
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
