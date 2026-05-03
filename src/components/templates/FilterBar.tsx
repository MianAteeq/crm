import { Search, Filter, ChevronDown, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  filters: {
    status: string;
    category: string;
    language: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export default function FilterBar({ 
  searchQuery, 
  onSearchChange, 
  viewMode, 
  onViewModeChange,
  filters,
  onFilterChange
}: FilterBarProps) {
  return (
    <div className="bg-bg-surface border border-border rounded-3xl p-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
      <div className="flex flex-1 w-full lg:w-auto items-center gap-4">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-brand" size={16} />
          <input 
            type="text" 
            placeholder="Search templates by name or identifier..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-bg-base border border-border rounded-2xl pl-12 pr-4 py-3 text-[11px] font-bold text-white focus:outline-none focus:border-brand/40 transition-all placeholder:text-text-muted/50"
          />
        </div>

        <div className="h-8 w-px bg-border hidden lg:block" />

        <div className="flex items-center gap-2">
           <select 
             value={filters.status}
             onChange={(e) => onFilterChange('status', e.target.value)}
             className="bg-bg-base border border-border rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted focus:outline-none focus:border-brand/40 appearance-none cursor-pointer hover:text-white transition-colors min-w-[120px]"
           >
              <option value="all">Status: All</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
           </select>
           
           <select 
             value={filters.category}
             onChange={(e) => onFilterChange('category', e.target.value)}
             className="bg-bg-base border border-border rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted focus:outline-none focus:border-brand/40 appearance-none cursor-pointer hover:text-white transition-colors min-w-[140px]"
           >
              <option value="all">Category: All</option>
              <option value="Marketing">Marketing</option>
              <option value="Utility">Utility</option>
              <option value="Authentication">Authentication</option>
           </select>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full lg:w-auto border-t border-border lg:border-t-0 pt-4 lg:pt-0">
        <div className="bg-bg-base border border-border rounded-2xl p-1 flex gap-1">
          <button 
            onClick={() => onViewModeChange('grid')}
            className={cn(
              "p-2 rounded-xl transition-all",
              viewMode === 'grid' ? "bg-bg-surface3 text-brand shadow-sm" : "text-text-muted hover:text-white"
            )}
          >
            <LayoutGrid size={16} />
          </button>
          <button 
            onClick={() => onViewModeChange('table')}
            className={cn(
              "p-2 rounded-xl transition-all",
              viewMode === 'table' ? "bg-bg-surface3 text-brand shadow-sm" : "text-text-muted hover:text-white"
            )}
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
