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
  Copy,
  Trash2 as Trash,
  FileText
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import TemplateAnalytics from '../../components/whatsapp/dashboard/TemplateAnalytics';
import WhatsAppPreview from '../../components/whatsapp/preview/WhatsAppPreview';
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
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'analytics' | 'categories' | 'rules'>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedTemplateForPreview, setSelectedTemplateForPreview] = useState<WhatsAppTemplate | null>(null);

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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      return;
    }

    try {
      await whatsappApi.deleteTemplate(id);
      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete template. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="shrink-0 bg-white border-b border-slate-200 px-10 py-10 relative">
        <AnimatePresence>
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white rounded-full px-6 py-2 shadow-lg flex items-center gap-2 border border-emerald-400"
            >
              <CheckCircle size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">{successMessage}</span>
              <button 
                onClick={() => setSuccessMessage(null)}
                className="ml-2 hover:bg-emerald-600 rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="max-w-[1600px] mx-auto flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">WhatsApp Templates</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">Marketing & Automation Control</p>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
               onClick={handleSync}
               disabled={isSyncing}
               className={cn(
                 "flex items-center gap-3 px-6 py-5 bg-white border border-slate-200 rounded-3xl font-black uppercase tracking-widest text-[10px] text-slate-600 hover:text-slate-900 transition-all shadow-sm active:scale-95",
                 isSyncing && "opacity-50 cursor-not-allowed"
               )}
             >
               <RefreshCw size={14} className={cn("text-blue-500", isSyncing && "animate-spin")} />
               {isSyncing ? 'Syncing...' : 'Sync from Meta'}
             </button>
             <button 
               onClick={() => navigate('/templates/builder')}
               className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-4 shadow-2xl shadow-slate-900/20 active:scale-95 group"
             >
               <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
               Create Template
             </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-[1600px] mx-auto mt-12 flex items-center gap-12">
           {[
             { id: 'all', label: 'All Templates' },
             { id: 'analytics', label: 'Performance Insight' },
             { id: 'categories', label: 'By Category' },
             { id: 'rules', label: 'Policy Center' },
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={cn(
                 "relative py-2 text-sm font-black uppercase tracking-widest transition-all",
                 activeTab === tab.id ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
               )}
             >
               {tab.label}
               {activeTab === tab.id && (
                 <motion.div layoutId="activeTab" className="absolute -bottom-2 left-0 right-0 h-1 bg-slate-900 rounded-full" />
               )}
             </button>
           ))}
        </div>
      </header>

      {/* Main Content Area */}
       <main className="flex-1 max-w-[1600px] mx-auto w-full px-10 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'analytics' ? (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
               <TemplateAnalytics />
            </motion.div>
          ) : activeTab === 'categories' ? (
            <motion.div 
              key="categories"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center min-h-[400px] flex-col gap-4 text-center"
            >
               <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center">
                  <Filter size={32} />
               </div>
               <h3 className="text-xl font-black text-slate-900">Categories View coming soon</h3>
               <p className="text-slate-500 max-w-sm">We are refining the category management interface to provide better insights into your message types.</p>
            </motion.div>
          ) : activeTab === 'rules' ? (
            <motion.div 
              key="rules"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center min-h-[400px] flex-col gap-4 text-center"
            >
               <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center">
                  <AlertCircle size={32} />
               </div>
               <h3 className="text-xl font-black text-slate-900">Policy Center coming soon</h3>
               <p className="text-slate-500 max-w-sm">Stay compliant with Meta's business policies using our automated rule checker and transparency logs.</p>
            </motion.div>
          ) : (
            <motion.div 
              key="all"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
               {/* Controls Bar */}
               <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                     <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="text" 
                          placeholder="Search templates..."
                          className="pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl w-80 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all" 
                        />
                     </div>
                     <button className="flex items-center gap-3 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">
                        <Filter size={18} />
                        Filter
                     </button>
                  </div>

                  <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200">
                     <button 
                       onClick={() => setView('list')}
                       className={cn("p-2 rounded-xl transition-all", view === 'list' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600")}
                     ><List size={18} /></button>
                     <button 
                       onClick={() => setView('grid')}
                       className={cn("p-2 rounded-xl transition-all", view === 'grid' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600")}
                     ><Grid size={18} /></button>
                  </div>
               </div>

               {isLoading ? (
                 <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                    <Loader2 className="w-12 h-12 text-slate-200 animate-spin" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading templates...</p>
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
               ) : templates.length === 0 ? (
                 <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 text-center">
                    <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-[2.5rem] flex items-center justify-center">
                       <MessageSquare size={40} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900">No templates found</h3>
                       <p className="text-slate-500 max-w-sm mt-2">Sync from Meta or create a new template to get started.</p>
                    </div>
                    <button 
                       onClick={() => navigate('/templates/builder')}
                       className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-900/20 active:scale-95 transition-all"
                    >
                       Create New Template
                    </button>
                 </div>
               ) : view === 'list' ? (
                 /* Table / List View */
                 <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/20">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Template Identity</th>
                          <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                          <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                          <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Last Updated</th>
                          <th className="px-10 py-6 text-right"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {templates.map((template, i) => (
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
                               <div className="flex items-center justify-end gap-3">
                                  <button 
                                    onClick={() => setSelectedTemplateForPreview(template)}
                                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 bg-slate-50/50 rounded-xl transition-all shadow-sm border border-transparent hover:border-blue-100 group/btn"
                                    title="View Preview"
                                  >
                                    <Eye size={18} className="transition-transform group-hover/btn:scale-110" />
                                  </button>
                                  <button 
                                    onClick={() => navigate(`/templates/builder?id=${template.id}`)}
                                    disabled={template.status === 'PENDING'}
                                    className={cn(
                                      "w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-sm border border-transparent group/btn",
                                      template.status === 'PENDING' 
                                        ? "text-slate-200 bg-slate-50 cursor-not-allowed" 
                                        : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 bg-slate-50/50 hover:border-emerald-100"
                                    )}
                                    title={template.status === 'PENDING' ? "Cannot edit pending template" : "Edit Template"}
                                  >
                                    <Edit2 size={18} className="transition-transform group-hover/btn:scale-110" />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(template.id)}
                                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 bg-slate-50/50 rounded-xl transition-all shadow-sm border border-transparent hover:border-red-100 group/btn"
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
                   {templates.map((template, i) => (
                     <motion.div 
                       key={template.id}
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ delay: i * 0.05 }}
                       className="group bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all"
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
                           <div className="flex gap-2">
                              <button 
                                onClick={() => setSelectedTemplateForPreview(template)}
                                className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition-all group/btn"
                                title="View Preview"
                              >
                                <Eye size={18} className="transition-transform group-hover/btn:scale-110" />
                              </button>
                              <button 
                                onClick={() => handleDelete(template.id)}
                                className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all group/btn"
                                title="Delete"
                              >
                                <Trash size={18} className="transition-transform group-hover/btn:scale-110" />
                              </button>
                              <button 
                                onClick={() => navigate(`/templates/builder?id=${template.id}`)}
                                disabled={template.status === 'PENDING'}
                                className={cn(
                                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-95 group/btn",
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
                      

                    </div>
                  </div>

                  {/* Sidebar Actions */}
                  <div className="mt-auto pt-10 grid grid-cols-2 gap-3 shrink-0">
                    <button 
                      onClick={() => navigate(`/templates/builder?id=${selectedTemplateForPreview.id}`)}
                      disabled={selectedTemplateForPreview.status === 'PENDING'}
                      className={cn(
                        "flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95",
                        selectedTemplateForPreview.status === 'PENDING'
                          ? "bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed"
                          : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400"
                      )}
                      title={selectedTemplateForPreview.status === 'PENDING' ? "Cannot edit pending template" : "Edit"}
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3.5 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 hover:text-slate-900 hover:border-slate-400 transition-all active:scale-95">
                      <Copy size={14} />
                      Clone
                    </button>
                    <button 
                      onClick={() => {
                        handleDelete(selectedTemplateForPreview.id);
                        setSelectedTemplateForPreview(null);
                      }}
                      className="col-span-2 flex items-center justify-center gap-2 py-3.5 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95"
                    >
                      <Trash size={14} />
                      Delete Template
                    </button>
                  </div>
                </div>

                {/* Right Side: Primary Focus Preview */}
                <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden relative">
                  {/* Subtle Background Elements */}
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

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
    </div>
  );
}
