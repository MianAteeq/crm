import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Library, UserCircle, LayoutGrid, Info, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { templates as initialTemplates, systemTemplates, Template } from '@/src/data/templates';
import { cn } from '@/src/lib/utils';
import TemplateCard from '@/src/components/templates/TemplateCard';
import TemplateTable from '@/src/components/templates/TemplateTable';
import SystemTemplateCard from '@/src/components/templates/SystemTemplateCard';
import TemplateDrawer from '@/src/components/templates/TemplateDrawer';
import FilterBar from '@/src/components/templates/FilterBar';
import MetaSyncModal from '@/src/components/templates/MetaSyncModal';

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [activeTab, setActiveTab] = useState<'my' | 'system'>('my');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ status: 'all', category: 'all', language: 'all' });
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesSearch = t.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.status === 'all' || t.status === filters.status;
      const matchesCategory = filters.category === 'all' || t.category === filters.category;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchQuery, filters, templates]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleUseSystemTemplate = (template: Partial<Template>) => {
    // Navigate to create page with pre-filled state
    navigate('/templates/create', { state: { template } });
  };

  const handleSyncComplete = (newTemplates: Template[]) => {
    setTemplates(prev => [...newTemplates, ...prev]);
  };

  return (
    <div className="space-y-10 min-h-screen pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-900 rounded-2xl shadow-lg shadow-slate-900/10">
                 <Library size={24} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Templates</h1>
           </div>
           
           <div className="flex p-1 bg-slate-50 border border-slate-200 rounded-xl w-fit">
              <button 
                onClick={() => setActiveTab('my')}
                className={cn(
                  "px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                  activeTab === 'my' ? "bg-white text-slate-900 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <UserCircle size={14} />
                My Templates
              </button>
              <button 
                onClick={() => setActiveTab('system')}
                className={cn(
                  "px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                  activeTab === 'system' ? "bg-white text-slate-900 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <SparklesIcon />
                Meta Library
              </button>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <button 
            onClick={() => setIsSyncModalOpen(true)}
            className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:border-slate-900 transition-all active:scale-95 group shadow-sm"
           >
            <RefreshCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
            Sync from Meta
           </button>

           <button 
            onClick={() => navigate('/templates/create')}
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all flex items-center gap-3 shadow-lg shadow-slate-900/10 active:scale-95 group"
           >
            <Plus size={18} strokeWidth={2} />
            Create Template
           </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'my' ? (
          <motion.div
            key="my-templates"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <FilterBar 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            {filteredTemplates.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredTemplates.map(t => (
                    <TemplateCard key={t.id} template={t} onClick={setSelectedTemplate} />
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <TemplateTable templates={filteredTemplates} onSelect={setSelectedTemplate} />
                </div>
              )
            ) : (
              <div className="py-32 flex flex-col items-center justify-center space-y-6 text-center bg-slate-50/50 border border-slate-200 rounded-3xl">
                 <div className="w-20 h-20 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center text-slate-300 group">
                    <Library size={32} className="group-hover:scale-110 group-hover:text-slate-900 transition-all" />
                 </div>
                 <div className="space-y-2">
                    <p className="text-xl font-bold text-slate-900 tracking-tight">No Templates Found</p>
                    <p className="text-sm text-slate-500 font-medium max-w-xs">Try adjusting your filters or create a new template to get started.</p>
                 </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="system-templates"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
             <div className="p-8 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm">
                   <Info size={20} />
                </div>
                <div className="space-y-2">
                   <h4 className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">About Meta System Library</h4>
                   <p className="text-xs text-blue-800 font-medium leading-relaxed max-w-4xl">
                     Accelerate your workflow with pre-approved blueprints. These templates adhere strictly to Meta's Business Messaging Policies and are designed for maximum engagement. Selecting a template will pre-fill the Forge Workspace.
                   </p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {systemTemplates.map(t => (
                  <SystemTemplateCard key={t.id} template={t} onUse={handleUseSystemTemplate} />
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <TemplateDrawer 
        template={selectedTemplate} 
        onClose={() => setSelectedTemplate(null)} 
      />

      <MetaSyncModal 
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onSync={handleSyncComplete}
      />
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M19 3v4"/><path d="M21 5h-4"/>
    </svg>
  );
}
