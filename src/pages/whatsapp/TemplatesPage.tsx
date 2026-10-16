import React, { useState, useEffect } from 'react';
import { 
  Plus,
  RefreshCw,
  Search, 
  Filter, 
  MoreVertical, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  Eye,
  Grid,
  List,
  Loader2,
  X,
  Tag,
  Globe,
  Activity,
  Calendar,
  User,
  Edit2,
  Trash2 as Trash,
  FileText,
  Send
} from 'lucide-react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import TemplateAnalytics from '../../components/whatsapp/dashboard/TemplateAnalytics';
import WhatsAppPreview from '../../components/whatsapp/preview/WhatsAppPreview';
import SendTemplateModal from '../../components/whatsapp/modals/SendTemplateModal';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { WhatsAppTemplate } from '../../types/whatsapp';
import { whatsappApi } from '../../services/whatsappApi';

const mockTemplates: WhatsAppTemplate[] = [
  {
    id: 't1',
    name: 'summer_promo_flash_sale',
    category: 'MARKETING',
    status: 'APPROVED',
    language: 'en_US',
    updatedAt: '2024-05-20T10:00:00Z',
    header: { type: 'IMAGE' },
    body: { text: "Flash Sale! Get 20% off with code FLASH20", variables: [] },
    buttons: [{ id: 'b1', type: 'URL', text: 'Shop Now' }]
  },
  {
    id: 't2',
    name: 'order_update_shipped',
    category: 'UTILITY',
    status: 'PENDING',
    language: 'en_US',
    updatedAt: '2024-05-21T12:30:00Z',
    header: { type: 'TEXT', text: 'Order Shipped' },
    body: { text: "Your order {{1}} has been shipped!", variables: ['order_id'] },
    buttons: []
  },
  {
    id: 't3',
    name: 'service_alert_update',
    category: 'UTILITY',
    status: 'APPROVED',
    language: 'en_US',
    updatedAt: '2024-05-22T09:15:00Z',
    header: { type: 'NONE' },
    body: { text: "System maintenance is complete. Thank you for your patience.", variables: [] },
    buttons: [{ id: 'b2', type: 'URL', text: 'View Status', url: 'https://status.example.com' }]
  }
];

export default function TemplatesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('search') || '';

  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'analytics' | 'categories' | 'rules'>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedTemplateForPreview, setSelectedTemplateForPreview] = useState<WhatsAppTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<WhatsAppTemplate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [templatePerformance, setTemplatePerformance] = useState<any>(null);
  const [isLoadingPerformance, setIsLoadingPerformance] = useState(false);
  const [templateToSend, setTemplateToSend] = useState<WhatsAppTemplate | null>(null);

  useEffect(() => {
    if (selectedTemplateForPreview && selectedTemplateForPreview.status === 'APPROVED') {
      const fetchTemplateStats = async () => {
        setIsLoadingPerformance(true);
        try {
          const stats = await whatsappApi.fetchPerformanceInsights(30, selectedTemplateForPreview.id);
          setTemplatePerformance(stats);
        } catch (e) {
          console.error('Failed to fetch template stats', e);
          setTemplatePerformance(null);
        } finally {
          setIsLoadingPerformance(false);
        }
      };
      fetchTemplateStats();
    } else {
      setTemplatePerformance(null);
    }
  }, [selectedTemplateForPreview]);

  useEffect(() => {
    if (!templateToDelete) {
      setDeleteError(null);
    }
  }, [templateToDelete]);

  useEffect(() => {
    const query = searchParams.get('search') || '';
    if (query !== searchQuery) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
    if (location.state?.error) {
      setError(location.state.error);
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await whatsappApi.fetchTemplates();
      // Ensure the data conforms to WhatsAppTemplate type if the API returns slightly different structure
      setTemplates(data as WhatsAppTemplate[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates. Please try again later.');
      // Fallback to mock data for demo purposes
      setTemplates(mockTemplates); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await whatsappApi.syncTemplatesFromMeta();
      await fetchData(); // Refresh list after sync
    } catch (err) {
      console.error('Sync failed:', err);
      alert('Failed to sync templates from Meta');
    } finally {
      setIsSyncing(false);
    }
  };

  const formatUpdateDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return 'N/A';
    }
  };

  const formatUpdateTime = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(date);
    } catch (e) {
      return '';
    }
  };

  const handleDelete = async () => {
    if (!templateToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);
    try {
      await whatsappApi.deleteTemplate(templateToDelete.id);
      setTemplates(prev => prev.filter(t => t.id !== templateToDelete.id));
      setSuccessMessage('Template deleted successfully');
      setTemplateToDelete(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Delete failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete template';
      setDeleteError(errorMessage);
      setError(errorMessage);
      // We don't clear the error automatically here so the user can see why it failed in the modal
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         template.body.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || template.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || template.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="shrink-0 pt-12 pb-16 relative">
        <AnimatePresence>
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-xl"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                 <CheckCircle size={18} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.1em]">{successMessage}</span>
              <button onClick={() => setSuccessMessage(null)} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
                <X size={16} />
              </button>
            </motion.div>
          )}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-red-500 text-white rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-xl"
            >
              <AlertCircle size={18} />
              <span className="text-[11px] font-black uppercase tracking-[0.1em]">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="ml-2 hover:bg-red-600 rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 px-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
               <span className="px-3 py-1 bg-[#F0FDF4] text-[#166534] text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-[#bbf7d0]">Resource Management</span>
            </div>
            <h1 className="text-6xl font-black text-slate-950 tracking-tighter leading-none mb-4">Template Lab</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">Configure Strategic Messaging Assets</p>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
               onClick={handleSync}
               disabled={isSyncing}
               className={cn(
                 "flex items-center gap-4 px-8 py-5 bg-white border border-slate-200 rounded-[2rem] font-black uppercase tracking-widest text-[10px] text-slate-600 hover:text-slate-900 transition-all shadow-premium hover:shadow-floating active:scale-95",
                 isSyncing && "opacity-50 cursor-not-allowed"
               )}
             >
               <RefreshCw size={16} className={cn("text-[#166534]", isSyncing && "animate-spin")} />
               {isSyncing ? 'Synchronizing Cluster...' : 'Sync from Meta'}
             </button>
             <button 
               onClick={() => navigate('/templates/builder')}
               className="bg-slate-950 hover:bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all flex items-center gap-4 shadow-2xl shadow-slate-900/20 active:scale-95 group"
             >
               <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
               Architect Template
             </button>
          </div>
        </div>

        {/* Tab Orbit */}
        <div className="flex items-center gap-12 border-b border-slate-100 px-8">
           {[
             { id: 'all', label: 'All Modules' },
             { id: 'analytics', label: 'Performance' },
             { id: 'categories', label: 'Categories' },
             { id: 'rules', label: 'Compliance' },
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={cn(
                 "relative py-6 text-[10px] font-black uppercase tracking-[0.25em] transition-all",
                 activeTab === tab.id ? "text-slate-950" : "text-slate-400 hover:text-slate-600"
               )}
             >
               {tab.label}
               {activeTab === tab.id && (
                 <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-slate-950 rounded-full" />
               )}
             </button>
           ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50 relative custom-scrollbar pb-32">
        <AnimatePresence mode="wait">
          {activeTab === 'analytics' ? (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-8"
            >
               <TemplateAnalytics />
            </motion.div>
          ) : activeTab === 'categories' ? (
            <motion.div 
               key="categories"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="px-8 flex items-center justify-center min-h-[400px] flex-col gap-4 text-center"
            >
               <div className="w-20 h-20 bg-[#F0FDF4] text-[#166534] rounded-[2.5rem] flex items-center justify-center mb-4">
                  <Tag size={32} strokeWidth={2.5} />
               </div>
               <h3 className="text-2xl font-black text-slate-950 tracking-tighter uppercase">Category Clustering</h3>
               <p className="text-slate-400 font-medium max-w-sm text-sm">Organize your messaging architecture by strategic purpose and compliance classification.</p>
            </motion.div>
          ) : activeTab === 'rules' ? (
            <motion.div 
              key="rules"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-8 flex items-center justify-center min-h-[400px] flex-col gap-6 text-center"
            >
               <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2.5rem] flex items-center justify-center mb-4">
                  <AlertCircle size={32} strokeWidth={2.5} />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-slate-950 tracking-tighter uppercase">Compliance Shield</h3>
                  <p className="text-slate-400 font-medium max-w-sm mt-4 text-sm leading-relaxed">Automated policy validation and Meta Business Suite integrity checks are pending synchronization.</p>
               </div>
            </motion.div>
          ) : (
            <motion.div 
              key="all"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
               {/* Controls Bar */}
               <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mt-12 px-8">
                  <div className="flex flex-col sm:flex-row gap-6 flex-1">
                     <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-all" size={20} strokeWidth={2.5} />
                        <input 
                          type="text" 
                          placeholder="Search intelligence cache..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-16 pr-6 py-5 bg-white border border-slate-200 rounded-[2rem] text-[11px] font-black uppercase tracking-widest text-slate-900 focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5 shadow-premium transition-all placeholder:text-slate-300" 
                        />
                     </div>
                     <div className="flex gap-4">
                        <select 
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="px-8 py-5 bg-white border border-slate-200 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-premium cursor-pointer"
                        >
                          <option value="ALL">Global Status</option>
                          <option value="APPROVED">Approved</option>
                          <option value="PENDING">Syncing</option>
                          <option value="REJECTED">Offline</option>
                        </select>
                        <select 
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="px-8 py-5 bg-white border border-slate-200 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-premium cursor-pointer"
                        >
                          <option value="ALL">Strategy Class</option>
                          <option value="MARKETING">Growth</option>
                          <option value="UTILITY">Operational</option>
                          <option value="AUTHENTICATION">Security</option>
                        </select>
                     </div>
                  </div>

                  <div className="flex bg-white p-2 rounded-[1.5rem] border border-slate-200 shadow-premium">
                     <button 
                       type="button"
                       onClick={() => setView('list')}
                       className={cn("w-12 h-12 rounded-xl transition-all flex items-center justify-center", view === 'list' ? "bg-slate-950 text-white shadow-lg" : "text-slate-400 hover:text-slate-600")}
                     ><List size={20} /></button>
                     <button 
                       type="button"
                       onClick={() => setView('grid')}
                       className={cn("w-12 h-12 rounded-xl transition-all flex items-center justify-center", view === 'grid' ? "bg-slate-950 text-white shadow-lg" : "text-slate-400 hover:text-slate-600")}
                     ><Grid size={20} /></button>
                  </div>
               </div>

               <div className="px-8 pb-32">
               {isLoading ? (
                 <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
                    <Loader2 className="w-16 h-16 text-slate-200 animate-spin" strokeWidth={2.5}/>
                    <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Accessing Intelligence Layer...</p>
                 </div>
               ) : error ? (
                 <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 text-center">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center">
                       <AlertCircle size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Sync Required</h3>
                      <p className="text-slate-500 max-w-sm mt-2">{error}</p>
                    </div>
                    <button 
                      onClick={fetchData}
                      className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all"
                    >
                      Retry Connection
                    </button>
                 </div>
               ) : filteredTemplates.length === 0 ? (
                 <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 text-center">
                    <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-[2.5rem] flex items-center justify-center">
                       <MessageSquare size={40} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900">No matching templates</h3>
                       <p className="text-slate-500 max-w-sm mt-2">Adjust your filters or search query to find what you're looking for.</p>
                    </div>
                    {(searchQuery !== '' || statusFilter !== 'ALL' || categoryFilter !== 'ALL') ? (
                      <button 
                        onClick={() => {
                          setSearchQuery('');
                          setStatusFilter('ALL');
                          setCategoryFilter('ALL');
                        }}
                        className="px-8 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all font-mono"
                      >
                        Clear Filters
                      </button>
                    ) : (
                      <button 
                         onClick={() => navigate('/templates/builder')}
                         className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-900/20 active:scale-95 transition-all"
                      >
                         Create New Template
                      </button>
                    )}
                 </div>
               ) : view === 'list' ? (
                 /* Table / List View */
                 <div className="bg-white rounded-[3.5rem] border border-slate-200 overflow-hidden shadow-premium">
                    <table className="w-full text-left font-sans">
                      <thead>
                        <tr className="border-b border-slate-50">
                           <th className="px-12 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Identity Core</th>
                           <th className="px-8 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Strategy Class</th>
                           <th className="px-8 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Integrity Status</th>
                           <th className="px-8 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Sync Timestamp</th>
                           <th className="px-12 py-8 text-right"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTemplates.map((template, i) => (
                          <tr key={template.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-10 py-6">
                               <div className="flex items-center gap-4">
                                  <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                                    template.category === 'MARKETING' ? "bg-emerald-50 text-emerald-600" : 
                                    template.category === 'UTILITY' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                                  )}>
                                     <MessageSquare size={20} />
                                  </div>
                                  <div>
                                     <p className="text-sm font-black text-slate-900 font-mono tracking-tight">{template.name}</p>
                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">EN • {template.header.type}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-6">
                               <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                  {template.category}
                               </span>
                            </td>
                            <td className="px-6 py-6">
                               <div className="flex items-center gap-2">
                                  {template.status === 'APPROVED' ? (
                                    <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[10px] uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                       <CheckCircle size={14} />
                                       Approved
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5 text-amber-600 font-black text-[10px] uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                                       <Clock size={14} />
                                       Pending
                                    </div>
                                  )}
                               </div>
                            </td>
                            <td className="px-6 py-6">
                               <p className="text-xs font-bold text-slate-400">{formatUpdateDate(template.updatedAt)}</p>
                               <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">{formatUpdateTime(template.updatedAt)}</p>
                            </td>
                            <td className="px-10 py-6 text-right">
                               <div className="flex items-center justify-end gap-3 relative z-10">
                                  <button 
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedTemplateForPreview(template);
                                    }}
                                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 bg-slate-50/50 rounded-xl transition-all shadow-sm border border-transparent hover:border-blue-100 group/btn cursor-pointer"
                                    title="View Preview"
                                  >
                                    <Eye size={18} className="transition-transform group-hover/btn:scale-110" />
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setTemplateToSend(template);
                                    }}
                                    disabled={template.status !== 'APPROVED'}
                                    className={cn(
                                      "w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-sm border border-transparent group/btn cursor-pointer",
                                      template.status !== 'APPROVED' 
                                        ? "text-slate-200 bg-slate-50 cursor-not-allowed" 
                                        : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 bg-slate-50/50 hover:border-emerald-100"
                                    )}
                                    title={template.status !== 'APPROVED' ? "Only approved templates can be sent" : "Send Template"}
                                  >
                                    <Send size={18} className="transition-transform group-hover/btn:scale-110" />
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/templates/builder?id=${template.id}`);
                                    }}
                                    disabled={template.status === 'PENDING'}
                                    className={cn(
                                      "w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-sm border border-transparent group/btn cursor-pointer",
                                      template.status === 'PENDING' 
                                        ? "text-slate-200 bg-slate-50 cursor-not-allowed" 
                                        : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 bg-slate-50/50 hover:border-emerald-100"
                                    )}
                                    title={template.status === 'PENDING' ? "Cannot edit pending template" : "Edit Template"}
                                  >
                                    <Edit2 size={18} className="transition-transform group-hover/btn:scale-110" />
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setTemplateToDelete(template);
                                    }}
                                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 bg-slate-50/50 rounded-xl transition-all shadow-sm border border-transparent hover:border-red-100 group/btn cursor-pointer"
                                    title="Delete Template"
                                  >
                                    <Trash size={18} className="transition-transform group-hover/btn:scale-110" />
                                  </button>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
               ) : (
                 /* Grid View */
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {filteredTemplates.map((template, i) => (
                     <motion.div 
                       key={template.id}
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ delay: i * 0.05 }}
                       className="group bg-white rounded-[3.5rem] border border-slate-200 p-10 shadow-premium hover:shadow-floating transition-all duration-500 cursor-pointer overflow-hidden relative"
                     >
                        <div className="flex items-start justify-between mb-8">
                           <div className={cn(
                             "w-16 h-16 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110",
                             template.category === 'MARKETING' ? "bg-emerald-50 text-emerald-600" : 
                             template.category === 'UTILITY' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                           )}>
                              <MessageSquare size={28} />
                           </div>
                           <div className="flex items-center gap-2">
                             {template.status === 'APPROVED' ? (
                               <span className="flex items-center gap-1.5 text-emerald-600 font-black text-[9px] uppercase tracking-wider bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                 <CheckCircle size={12} />
                                 Approved
                               </span>
                             ) : (
                               <span className="flex items-center gap-1.5 text-amber-600 font-black text-[9px] uppercase tracking-wider bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                                 <Clock size={12} />
                                 Pending
                               </span>
                             )}
                             <button className="p-2 text-slate-400 hover:text-slate-900 rounded-xl transition-all"><MoreVertical size={18} /></button>
                           </div>
                        </div>

                        <div className="space-y-2 mb-8">
                           <h3 className="text-lg font-black text-slate-900 font-mono tracking-tight truncate" title={template.name}>
                             {template.name}
                           </h3>
                           <div className="flex gap-2">
                             <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded text-[10px] font-bold uppercase tracking-widest">{template.category}</span>
                             <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded text-[10px] font-bold uppercase tracking-widest">{template.header.type}</span>
                           </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl mb-8 line-clamp-2 text-slate-600 text-xs font-medium leading-relaxed italic border border-slate-100">
                          "{template.body.text}"
                        </div>

                        <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                           <div className="flex items-center gap-3">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Updated</span>
                                <span className="text-sm font-black text-slate-900">{formatUpdateDate(template.updatedAt)}</span>
                              </div>
                           </div>
                           <div className="flex gap-2 relative z-10">
                              <button 
                                type="button"
                                onClick={() => setSelectedTemplateForPreview(template)}
                                className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition-all group/btn cursor-pointer"
                                title="View Preview"
                              >
                                <Eye size={18} className="transition-transform group-hover/btn:scale-110" />
                              </button>
                              <button 
                                type="button"
                                onClick={() => setTemplateToSend(template)}
                                disabled={template.status !== 'APPROVED'}
                                className={cn(
                                  "w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center transition-all group/btn cursor-pointer",
                                  template.status !== 'APPROVED' 
                                    ? "text-slate-200 bg-slate-50 cursor-not-allowed" 
                                    : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100"
                                )}
                                title={template.status !== 'APPROVED' ? "Only approved templates can be sent" : "Send Template"}
                              >
                                <Send size={18} className="transition-transform group-hover/btn:scale-110" />
                              </button>
                              <button 
                                type="button"
                                onClick={() => setTemplateToDelete(template)}
                                className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all group/btn cursor-pointer"
                                title="Delete"
                              >
                                <Trash size={18} className="transition-transform group-hover/btn:scale-110" />
                              </button>
                              <button 
                                type="button"
                                onClick={() => navigate(`/templates/builder?id=${template.id}`)}
                                disabled={template.status === 'PENDING'}
                                className={cn(
                                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-95 group/btn cursor-pointer",
                                  template.status === 'PENDING'
                                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                                    : "bg-slate-900 text-white hover:bg-slate-800"
                                )}
                                title={template.status === 'PENDING' ? "Cannot edit pending template" : "Edit"}
                              >
                                <ChevronRight size={18} className="transition-transform group-hover/btn:translate-x-0.5" />
                              </button>
                           </div>
                        </div>
                     </motion.div>
                   ))}
                 </div>
               )}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
       </main>

        {/* Preview Modal */}
        <AnimatePresence>
          {selectedTemplateForPreview && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-slate-950/40 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] w-full max-w-6xl h-full max-h-[850px] overflow-hidden flex flex-col lg:flex-row relative border border-slate-100"
              >
                {/* Left Side: Professional Info Panel */}
                <div className="flex flex-col w-full lg:w-[380px] border-r border-slate-100 bg-white p-8 sm:p-10 shrink-0">
                  <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                          <Eye size={20} />
                       </div>
                       <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Template Details</h3>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Premium Inspector</p>
                       </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                    {/* Identity Group */}
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                          <FileText size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Internal Name</span>
                          <p className="text-sm font-bold text-slate-900 break-words leading-tight">{selectedTemplateForPreview.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                          <Tag size={16} />
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Category</span>
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                            selectedTemplateForPreview.category === 'MARKETING' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            selectedTemplateForPreview.category === 'UTILITY' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            'bg-purple-50 text-purple-700 border-purple-100'
                          )}>
                            {selectedTemplateForPreview.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                          <Globe size={16} />
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Language</span>
                          <p className="text-sm font-bold text-slate-900 uppercase tracking-widest">{selectedTemplateForPreview.language || 'English (US)'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                          <Activity size={16} />
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Publish Status</span>
                          <div className="flex items-center gap-2">
                             <div className={cn(
                               "w-2 h-2 rounded-full",
                               selectedTemplateForPreview.status === 'APPROVED' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'
                             )} />
                             <span className="text-xs font-black text-slate-700 uppercase tracking-widest">
                               {selectedTemplateForPreview.status}
                             </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                          <Calendar size={16} />
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Last Updated</span>
                          <p className="text-sm font-bold text-slate-900">
                            {formatUpdateDate(selectedTemplateForPreview.updatedAt)} {formatUpdateTime(selectedTemplateForPreview.updatedAt)}
                          </p>
                        </div>
                      </div>

                      {selectedTemplateForPreview.status === 'APPROVED' && (
                        <div className="p-5 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-4">
                          <div className="flex items-center justify-between">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance (30D)</span>
                             <div className={cn(
                               "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border",
                               templatePerformance?.hero_insight?.quality_score === 'Needs Improvement' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                             )}>
                               {isLoadingPerformance ? 'Loading...' : (templatePerformance?.hero_insight?.quality_score || 'Optimal')}
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Open Rate</p>
                                <p className="text-lg font-black text-slate-900 leading-none">
                                  {isLoadingPerformance ? '...' : (templatePerformance?.stats?.read_rate ? `${templatePerformance.stats.read_rate}%` : '0%')}
                                </p>
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Delivered</p>
                                <p className="text-lg font-black text-slate-900 leading-none">
                                  {isLoadingPerformance ? '...' : (templatePerformance?.stats?.total_delivered?.toLocaleString() || '0')}
                                </p>
                             </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Sidebar Actions */}
                  <div className="mt-auto pt-10 flex flex-col gap-3 shrink-0">
                    <button 
                      onClick={() => setTemplateToSend(selectedTemplateForPreview)}
                      disabled={selectedTemplateForPreview.status !== 'APPROVED'}
                      className={cn(
                        "flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95",
                        selectedTemplateForPreview.status !== 'APPROVED'
                          ? "bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed"
                          : "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 hover:bg-emerald-600"
                      )}
                    >
                      <Send size={16} />
                      Send to Contact
                    </button>
                    <button 
                      onClick={() => navigate(`/templates/builder?id=${selectedTemplateForPreview.id}`)}
                      disabled={selectedTemplateForPreview.status === 'PENDING'}
                      className={cn(
                        "flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95",
                        selectedTemplateForPreview.status === 'PENDING'
                          ? "bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed"
                          : "bg-slate-900 text-white shadow-xl shadow-slate-900/10 hover:bg-slate-800"
                      )}
                      title={selectedTemplateForPreview.status === 'PENDING' ? "Cannot edit pending template" : "Edit"}
                    >
                      <Edit2 size={16} />
                      Edit Template
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setTemplateToDelete(selectedTemplateForPreview);
                      }}
                      className="flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95 cursor-pointer"
                    >
                      <Trash size={16} />
                      Delete Template
                    </button>
                  </div>
                </div>

                {/* Right Side: Primary Focus Preview */}
                <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden relative">
                  {/* Subtle Background Elements */}
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#F0FDF4]0/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

                  {/* Header Bar */}
                  <div className="px-8 py-6 flex items-center justify-between shrink-0 z-20">
                    <div className="flex items-center gap-4">
                       <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                          <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none">Message Visualization</span>
                       </div>
                    </div>
                    <button 
                      onClick={() => setSelectedTemplateForPreview(null)}
                      className="w-12 h-12 flex items-center justify-center bg-white shadow-sm border border-slate-200 text-slate-400 hover:text-slate-900 rounded-2xl transition-all active:scale-90"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  
                  {/* Phone Centerpiece */}
                  <div className="flex-1 flex items-center justify-center overflow-y-auto p-8 relative z-10">
                    <div className="scale-[0.8] lg:scale-[0.9] xl:scale-100 transition-all duration-500 ease-out">
                       <WhatsAppPreview template={selectedTemplateForPreview} />
                    </div>
                  </div>

                  {/* Mobile Footer (Collapse Sidebar Actions) */}
                  <div className="p-6 shrink-0 lg:hidden bg-white border-t border-slate-100 flex gap-3">
                     <button 
                       onClick={() => setSelectedTemplateForPreview(null)}
                       className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 shadow-slate-900/20"
                     >
                       Close Preview
                     </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {templateToSend && (
            <SendTemplateModal 
              template={templateToSend}
              onClose={() => setTemplateToSend(null)}
              onSuccess={() => {
                setSuccessMessage(`Template "${templateToSend.name}" sent successfully`);
                setTimeout(() => setSuccessMessage(null), 5000);
              }}
            />
          )}
        </AnimatePresence>
        
        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {templateToDelete && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-slate-100"
              >
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                  <Trash size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Delete Template?</h3>
                <p className="text-slate-500 mb-8 font-medium leading-relaxed">
                  Are you sure you want to delete <span className="text-slate-900 font-bold">"{templateToDelete.name}"</span>? 
                  This action is permanent and cannot be undone via Meta.
                </p>

                {deleteError && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3"
                  >
                    <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">Status Error</p>
                      <p className="text-sm font-medium text-red-900 leading-tight">{deleteError}</p>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setTemplateToDelete(null)}
                    disabled={isDeleting}
                    className="py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash size={14} />
                    )}
                    Confirm Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
    </div>
  );
}
