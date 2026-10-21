import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronDown, Mail, Layers, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tag as TagType, Category } from '../../types';
import { useI18n } from '../../i18n';
import { cn } from '../../lib/utils';

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
  const { t, isRtl } = useI18n();
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 w-full">
          <Search className={cn("absolute top-1/2 -translate-y-1/2 text-stone-400", isRtl ? "right-4" : "left-4")} size={16} />
          <input 
            type="text"
            placeholder={t('app.contacts.search_contacts_business_phone_email_0b0caa', 'Search contacts, business, phone, email...')}
            value={searchQuery}
            onKeyDown={(e) => e.key === 'Enter' && onApplyFilters()}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              "w-full bg-[#FAFAF9] border border-stone-200 rounded-xl py-2.5 text-xs font-medium text-[#12263A] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#166534] focus:bg-white transition-all placeholder:text-stone-400",
              isRtl ? "pr-11 pl-4 text-right" : "pl-11 pr-4 text-left"
            )}
          />
        </div>

        {/* Category Selector (Requirement 1 & 13) */}
        {onCategoryChange && (
          <div className="relative w-full sm:w-auto min-w-[170px]">
            <select 
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className={cn(
                "w-full appearance-none bg-white border border-stone-200 rounded-xl py-2.5 text-xs font-bold text-[#12263A] cursor-pointer focus:outline-none hover:border-[#166534]/50 transition-all",
                isRtl ? "pr-9 pl-8 text-right" : "pl-9 pr-8 text-left"
              )}
            >
              <option value="">{t('app.contacts.all_categories_fe3b58', 'All Categories')}</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <Layers className={cn("absolute top-1/2 -translate-y-1/2 text-stone-400", isRtl ? "right-3" : "left-3")} size={14} />
            <ChevronDown className={cn("absolute top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none", isRtl ? "left-3" : "right-3")} size={14} />
          </div>
        )}

        {/* Email Status Selector (Requirement 13) */}
        {onEmailStatusChange && (
          <div className="relative w-full sm:w-auto min-w-[160px]">
            <select 
              value={selectedEmailStatus}
              onChange={(e) => onEmailStatusChange(e.target.value)}
              className={cn(
                "w-full appearance-none bg-white border border-stone-200 rounded-xl py-2.5 text-xs font-bold text-[#12263A] cursor-pointer focus:outline-none hover:border-[#166534]/50 transition-all",
                isRtl ? "pr-9 pl-8 text-right" : "pl-9 pr-8 text-left"
              )}
            >
              <option value="">{t('app.contacts.email_all_6c036d', 'Email: All')}</option>
              <option value="never_sent">{t('app.contacts.never_sent_2eaf3b', 'Never Sent')}</option>
              <option value="sent">{t('app.contacts.sent_c16bc8', 'Sent')}</option>
              <option value="delivered">{t('app.contacts.delivered_906115', 'Delivered')}</option>
              <option value="bounced">{t('app.contacts.bounced_b23b4c', 'Bounced')}</option>
              <option value="failed">{t('app.contacts.failed_031a8f', 'Failed')}</option>
              <option value="unsubscribed">{t('app.contacts.unsubscribed_ecd78e', 'Unsubscribed')}</option>
            </select>
            <Mail className={cn("absolute top-1/2 -translate-y-1/2 text-stone-400", isRtl ? "right-3" : "left-3")} size={14} />
            <ChevronDown className={cn("absolute top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none", isRtl ? "left-3" : "right-3")} size={14} />
          </div>
        )}

        {/* Tags Selector */}
        <div className="relative w-full sm:w-auto min-w-[130px]">
          <select 
            value={selectedTag}
            onChange={(e) => onTagChange(e.target.value)}
            className={cn(
              "w-full appearance-none bg-white border border-stone-200 rounded-xl py-2.5 text-xs font-bold text-[#12263A] cursor-pointer focus:outline-none hover:border-[#166534]/50 transition-all",
              isRtl ? "pr-9 pl-8 text-right" : "pl-9 pr-8 text-left"
            )}
          >
            <option value="">{t('app.contacts.all_tags_2b488c', 'All Tags')}</option>
            {tags.map(tag => (
              <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
          </select>
          <Filter className={cn("absolute top-1/2 -translate-y-1/2 text-stone-400", isRtl ? "right-3" : "left-3")} size={14} />
          <ChevronDown className={cn("absolute top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none", isRtl ? "left-3" : "right-3")} size={14} />
        </div>

        {/* Filter Button */}
        <button 
          onClick={onApplyFilters}
          className="flex items-center gap-2 bg-[#12263A] text-white rounded-xl py-2.5 px-4 text-xs font-bold transition-all shadow-sm hover:bg-[#166534] whitespace-nowrap cursor-pointer active:scale-95"
        >
          <Search size={14} />
          <span>{t('app.contacts.filter_638e24', 'Filter')}</span>
        </button>

        {/* Options / Advanced Dropdown Button */}
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition-all border whitespace-nowrap cursor-pointer active:scale-95 ${
            showAdvanced ? 'bg-[#166534] text-white border-[#166534] shadow-sm' : 'bg-white border-stone-200 text-[#57534E] hover:border-[#166534]'
          }`}
        >
          <SlidersHorizontal size={14} />
          <span>{t('app.contacts.options_d0db8b', 'Options')}</span>
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
                    <Megaphone size={12} /> {isRtl ? 'الحملة المستهدفة' : 'Target Campaign'}
                  </label>
                  <select 
                    value={selectedCampaign}
                    onChange={(e) => onCampaignChange(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-lg p-2.5 text-xs font-bold text-[#12263A] focus:outline-none focus:border-[#166534] cursor-pointer"
                  >
                    <option value="">{isRtl ? 'جميع الحملات' : 'All Campaigns'}</option>
                    {campaigns.map(camp => (
                      <option key={camp.id} value={camp.id}>{camp.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Status Filter */}
              <div className="space-y-2">
                 <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                   {isRtl ? 'حالة دورة الحياة' : 'Life Cycle Status'}
                 </label>
                 <div className="flex flex-wrap gap-2">
                   {[
                     { key: 'active', label: t('app.contacts.active_923406', 'Active') },
                     { key: 'inactive', label: isRtl ? 'غير نشط' : 'Inactive' },
                     { key: 'unsubscribed', label: t('app.contacts.unsubscribed_ecd78e', 'Unsubscribed') }
                   ].map(statusItem => (
                     <button 
                        key={statusItem.key} 
                        type="button"
                        onClick={() => onStatusChange(selectedStatus === statusItem.key ? '' : statusItem.key)}
                        className={`px-3 py-1.5 border rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          selectedStatus === statusItem.key 
                          ? 'bg-[#166534] border-[#166534] text-white shadow-sm' 
                          : 'bg-white border-stone-200 text-[#57534E] hover:border-[#166534]'
                        }`}
                      >
                       {statusItem.label}
                     </button>
                   ))}
                 </div>
              </div>

              {/* Activity Filter */}
              <div className="space-y-2">
                 <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                   {isRtl ? 'آخر نقطة اتصال' : 'Last Touchpoint'}
                 </label>
                 <select 
                    value={lastTouchpoint}
                    onChange={(e) => onTouchpointChange(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-lg p-2.5 text-xs font-bold text-[#12263A] focus:outline-none focus:border-[#166534] cursor-pointer"
                  >
                   <option value="">{isRtl ? 'في أي وقت' : 'Anytime'}</option>
                   <option value="24_hours">{isRtl ? 'آخر 24 ساعة' : 'Last 24 Hours'}</option>
                   <option value="7_days">{isRtl ? 'آخر 7 أيام' : 'Last 7 Days'}</option>
                   <option value="30_days">{isRtl ? 'آخر 30 يوماً' : 'Last 30 Days'}</option>
                 </select>
              </div>

              {/* Tag Selection list */}
              <div className="space-y-2">
                 <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                    {isRtl ? 'اختيار وسم سريع' : 'Quick Tag Select'}
                 </label>
                 <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
                    {tags.map(tag => (
                      <button 
                        key={tag.id}
                        type="button"
                        onClick={() => onTagChange(selectedTag === tag.id ? '' : tag.id)}
                        className={`px-2.5 py-1 border rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
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
                 <button onClick={() => setShowAdvanced(false)} className="text-[11px] font-bold text-stone-400 uppercase tracking-widest hover:text-[#12263A] transition-all cursor-pointer">
                   {isRtl ? 'إغلاق' : 'Dismiss'}
                 </button>
                 <div className="flex gap-4">
                    <button 
                      onClick={onResetFilters}
                      className="text-[11px] font-bold text-red-600 uppercase tracking-widest hover:underline cursor-pointer"
                    >
                      {isRtl ? 'إعادة ضبط الكل' : 'Reset All'}
                    </button>
                    <button 
                      onClick={onApplyFilters}
                      className="px-6 py-2 bg-[#12263A] hover:bg-[#166534] text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      {isRtl ? 'تطبيق الفلاتر' : 'Apply Filters'}
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
