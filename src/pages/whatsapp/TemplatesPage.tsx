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
  ChevronLeft,
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
import { useI18n } from '../../i18n';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';

const getMockTemplates = (isRtl: boolean): WhatsAppTemplate[] => [
  {
    id: 't1',
    name: isRtl ? 'عرض_التخفيضات_الموسمية' : 'summer_promo_flash_sale',
    category: 'MARKETING',
    status: 'APPROVED',
    language: isRtl ? 'ar' : 'en_US',
    updatedAt: '2024-05-20T10:00:00Z',
    header: { type: 'IMAGE' },
    body: { 
      text: isRtl 
        ? "تخفيضات موسمية كبرى! احصل على خصم 20% على كامل مشترياتك باستخدام الرمز FLASH20 عند إتمام الدفع." 
        : "Flash Sale! Get 20% off with code FLASH20", 
      variables: [] 
    },
    buttons: [{ id: 'b1', type: 'URL', text: isRtl ? 'تسوق الآن' : 'Shop Now' }]
  },
  {
    id: 't2',
    name: isRtl ? 'تحديث_شحن_الطلب' : 'order_update_shipped',
    category: 'UTILITY',
    status: 'PENDING',
    language: isRtl ? 'ar' : 'en_US',
    updatedAt: '2024-05-21T12:30:00Z',
    header: { type: 'TEXT', text: isRtl ? 'تم شحن طلبك' : 'Order Shipped' },
    body: { 
      text: isRtl 
        ? "مرحباً بك! تم شحن طلبك رقم {{1}} بنجاح وهو الآن في طريقه إليك." 
        : "Your order {{1}} has been shipped!", 
      variables: ['order_id'] 
    },
    buttons: []
  },
  {
    id: 't3',
    name: isRtl ? 'إشعار_اكتمال_الصيانة' : 'service_alert_update',
    category: 'UTILITY',
    status: 'APPROVED',
    language: isRtl ? 'ar' : 'en_US',
    updatedAt: '2024-05-22T09:15:00Z',
    header: { type: 'NONE' },
    body: { 
      text: isRtl 
        ? "تمت ترقية وصيانة النظام بنجاح. كافة الخدمات تعمل الآن بكفاءة كاملة. شكراً لصبركم." 
        : "System maintenance is complete. Thank you for your patience.", 
      variables: [] 
    },
    buttons: [{ id: 'b2', type: 'URL', text: isRtl ? 'عرض حالة النظام' : 'View Status', url: 'https://status.example.com' }]
  }
];

export default function TemplatesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, isRtl } = useI18n();
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
      if (Array.isArray(data) && data.length > 0) {
        setTemplates(data as WhatsAppTemplate[]);
      } else {
        setTemplates(getMockTemplates(isRtl));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : (isRtl ? 'تعذر تحميل القوالب من الخادم، يتم عرض البيانات النموذجية.' : 'Failed to load templates. Please try again later.'));
      setTemplates(getMockTemplates(isRtl)); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isRtl]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await whatsappApi.syncTemplatesFromMeta();
      await fetchData();
      setSuccessMessage(isRtl ? 'تمت مزامنة القوالب من Meta بنجاح' : 'Templates synced from Meta successfully');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Sync failed:', err);
      alert(isRtl ? 'فشلت المزامنة من Meta' : 'Failed to sync templates from Meta');
    } finally {
      setIsSyncing(false);
    }
  };

  const formatUpdateDate = (dateString?: string) => {
    if (!dateString) return isRtl ? 'غير متوفر' : 'N/A';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(isRtl ? 'ar-EG' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return isRtl ? 'غير متوفر' : 'N/A';
    }
  };

  const formatUpdateTime = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(isRtl ? 'ar-EG' : 'en-US', {
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
      setSuccessMessage(isRtl ? 'تم حذف القالب بنجاح' : 'Template deleted successfully');
      setTemplateToDelete(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Delete failed:', err);
      const errorMessage = err instanceof Error ? err.message : (isRtl ? 'فشل حذف القالب' : 'Failed to delete template');
      setDeleteError(errorMessage);
      setError(errorMessage);
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

  const getCategoryLabel = (category: string) => {
    if (isRtl) {
      switch (category) {
        case 'MARKETING': return 'تسويقي';
        case 'UTILITY': return 'خدمي';
        case 'AUTHENTICATION': return 'مصادقة';
        default: return category;
      }
    }
    return category;
  };

  const getStatusLabel = (status: string) => {
    if (isRtl) {
      switch (status) {
        case 'APPROVED': return 'معتمد';
        case 'PENDING': return 'قيد المراجعة';
        case 'REJECTED': return 'مرفوض';
        default: return status;
      }
    }
    switch (status) {
      case 'APPROVED': return 'Approved';
      case 'PENDING': return 'Pending';
      case 'REJECTED': return 'Rejected';
      default: return status;
    }
  };

  return (
    <div className={cn("min-h-screen bg-slate-50 flex flex-col font-sans", isRtl && "text-right")} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="shrink-0 pt-10 pb-14 relative bg-white/70 border-b border-slate-100 backdrop-blur-md">
        <AnimatePresence>
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-xl"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
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
              <AlertCircle size={18} className="shrink-0" />
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

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 px-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
               <span className="px-3.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-emerald-200">
                 {isRtl ? 'إدارة الموارد والقوالب' : 'Resource Management'}
               </span>
               <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md">
                 WhatsApp Meta Cloud
               </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-none mb-3">
              {isRtl ? 'مختبر قوالب واتساب' : 'Template Lab'}
            </h1>
            <p className="text-sm font-semibold text-slate-400">
              {isRtl ? 'تكوين، إدارة ومزامنة أصول المراسلة الاستراتيجية المعتمدة من ميتا' : 'Configure Strategic Messaging Assets & Meta Templates'}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
             <LanguageSwitcher variant="dropdown" />
             <button 
               onClick={handleSync}
               disabled={isSyncing}
               className={cn(
                 "flex items-center gap-3 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl font-black uppercase tracking-wider text-[11px] text-slate-700 hover:text-slate-950 transition-all shadow-sm hover:shadow active:scale-95",
                 isSyncing && "opacity-50 cursor-not-allowed"
               )}
             >
               <RefreshCw size={15} className={cn("text-emerald-600", isSyncing && "animate-spin")} />
               {isSyncing 
                 ? (isRtl ? 'جارٍ المزامنة...' : 'Synchronizing...') 
                 : (isRtl ? 'مزامنة من Meta' : 'Sync from Meta')}
             </button>
             <button 
               onClick={() => navigate('/templates/builder')}
               className="bg-slate-950 hover:bg-slate-900 text-white px-7 py-3.5 rounded-2xl font-black uppercase tracking-wider text-xs transition-all flex items-center gap-3 shadow-xl shadow-slate-950/15 active:scale-95 group"
             >
               <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
               {isRtl ? 'تصميم قالب جديد' : 'Architect Template'}
             </button>
          </div>
        </div>

        {/* Tab Orbit */}
        <div className="flex items-center gap-8 sm:gap-12 border-b border-slate-100 px-8 overflow-x-auto custom-scrollbar">
           {[
             { id: 'all', label: isRtl ? 'كافة القوالب' : 'All Modules' },
             { id: 'analytics', label: isRtl ? 'الأداء والتحليلات' : 'Performance' },
             { id: 'categories', label: isRtl ? 'التصنيفات' : 'Categories' },
             { id: 'rules', label: isRtl ? 'الامتثال والسياسات' : 'Compliance' },
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={cn(
                 "relative py-4 text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap",
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
              className="px-8 pt-8"
            >
               <TemplateAnalytics />
            </motion.div>
          ) : activeTab === 'categories' ? (
            <motion.div 
               key="categories"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="px-8 flex items-center justify-center min-h-[440px] flex-col gap-4 text-center"
            >
               <div className="w-20 h-20 bg-emerald-50 text-emerald-700 rounded-3xl flex items-center justify-center mb-2 shadow-sm border border-emerald-100">
                  <Tag size={32} strokeWidth={2.5} />
               </div>
               <h3 className="text-2xl font-black text-slate-950 tracking-tight">
                 {isRtl ? 'تصنيف المجموعات والقوالب' : 'Category Clustering'}
               </h3>
               <p className="text-slate-500 font-medium max-w-md text-sm leading-relaxed">
                 {isRtl 
                   ? 'تنظيم قوالب الرسائل حسب الهدف الاستراتيجي (تسويقي Marketing، إشعارات وخدمات Utility، مصادقة Authentication) وتصنيفات الامتثال المعتمدة لدى Meta.' 
                   : 'Organize your messaging architecture by strategic purpose and compliance classification.'}
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 w-full max-w-2xl">
                 <div className="p-5 bg-white rounded-2xl border border-slate-200 text-center shadow-sm">
                   <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 font-black">M</div>
                   <h4 className="font-black text-slate-900 text-sm">{isRtl ? 'تسويقي (Marketing)' : 'Marketing'}</h4>
                   <p className="text-xs text-slate-400 mt-1">{isRtl ? 'عروض ترويجية وتخفيضات' : 'Promotions & announcements'}</p>
                 </div>
                 <div className="p-5 bg-white rounded-2xl border border-slate-200 text-center shadow-sm">
                   <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 font-black">U</div>
                   <h4 className="font-black text-slate-900 text-sm">{isRtl ? 'خدمي (Utility)' : 'Utility'}</h4>
                   <p className="text-xs text-slate-400 mt-1">{isRtl ? 'تحديثات الشحن والطلبات' : 'Order updates & receipts'}</p>
                 </div>
                 <div className="p-5 bg-white rounded-2xl border border-slate-200 text-center shadow-sm">
                   <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-2 font-black">A</div>
                   <h4 className="font-black text-slate-900 text-sm">{isRtl ? 'مصادقة (Authentication)' : 'Authentication'}</h4>
                   <p className="text-xs text-slate-400 mt-1">{isRtl ? 'رموز التحقق OTP والأمان' : 'One-time passwords & 2FA'}</p>
                 </div>
               </div>
            </motion.div>
          ) : activeTab === 'rules' ? (
            <motion.div 
              key="rules"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-8 flex items-center justify-center min-h-[440px] flex-col gap-6 text-center"
            >
               <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-2 shadow-sm border border-rose-100">
                  <AlertCircle size={32} strokeWidth={2.5} />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-slate-950 tracking-tight">
                    {isRtl ? 'درع الامتثال ومراجعة السياسات' : 'Compliance Shield'}
                  </h3>
                  <p className="text-slate-500 font-medium max-w-md mt-2 text-sm leading-relaxed">
                    {isRtl 
                      ? 'التحقق الآلي من السياسات وإرشادات Meta Business Suite لحماية حسابك من الحظر وضمان أعلى معدلات التسليم.' 
                      : 'Automated policy validation and Meta Business Suite integrity checks protect your delivery reputation.'}
                  </p>
               </div>
               <div className="p-6 bg-white rounded-2xl border border-slate-200 text-left max-w-lg w-full shadow-sm text-sm" dir={isRtl ? 'rtl' : 'ltr'}>
                 <div className="flex items-center gap-3 text-emerald-700 font-bold mb-2">
                   <CheckCircle size={18} />
                   <span>{isRtl ? 'حالة حساب Meta Cloud API: متصل ونشط' : 'Meta Cloud API Account: Connected & Active'}</span>
                 </div>
                 <p className="text-slate-500 text-xs">
                   {isRtl 
                     ? 'كافة القوالب المرسلة تخضع تلقائياً لمطابقة المتغيرات والتحقق من عدم احتوائها على كلمات محظورة أو عبارات مضللة.' 
                     : 'Templates are screened for proper variables formatting, opt-out tags, and spam compliance prior to submission.'}
                 </p>
               </div>
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
               <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mt-8 px-8">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                     <div className="relative flex-1 max-w-md group">
                        <Search className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-all", isRtl ? "right-5" : "left-5")} size={18} strokeWidth={2.5} />
                        <input 
                          type="text" 
                          placeholder={isRtl ? "البحث في القوالب والمحتوى..." : "Search intelligence cache..."}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={cn(
                            "w-full py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5 shadow-sm transition-all placeholder:text-slate-300",
                            isRtl ? "pr-14 pl-5 text-right" : "pl-14 pr-5 text-left"
                          )} 
                        />
                     </div>
                     <div className="flex gap-3">
                        <select 
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="px-5 py-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-wider text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm cursor-pointer"
                        >
                          <option value="ALL">{isRtl ? 'جميع الحالات' : 'Global Status'}</option>
                          <option value="APPROVED">{isRtl ? 'معتمد' : 'Approved'}</option>
                          <option value="PENDING">{isRtl ? 'قيد المراجعة' : 'Syncing'}</option>
                          <option value="REJECTED">{isRtl ? 'مرفوض' : 'Offline'}</option>
                        </select>
                        <select 
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="px-5 py-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-wider text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm cursor-pointer"
                        >
                          <option value="ALL">{isRtl ? 'جميع الفئات' : 'Strategy Class'}</option>
                          <option value="MARKETING">{isRtl ? 'تسويقي (Marketing)' : 'Growth'}</option>
                          <option value="UTILITY">{isRtl ? 'خدمي (Utility)' : 'Operational'}</option>
                          <option value="AUTHENTICATION">{isRtl ? 'مصادقة (Auth)' : 'Security'}</option>
                        </select>
                     </div>
                  </div>

                  <div className="flex items-center gap-3">
                     <span className="text-xs font-bold text-slate-400">
                       {isRtl ? `إجمالي القوالب: ${filteredTemplates.length}` : `Total Templates: ${filteredTemplates.length}`}
                     </span>
                     <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                        <button 
                          type="button"
                          onClick={() => setView('list')}
                          className={cn("w-10 h-10 rounded-xl transition-all flex items-center justify-center", view === 'list' ? "bg-slate-950 text-white shadow" : "text-slate-400 hover:text-slate-600")}
                          title={isRtl ? 'عرض كجدول' : 'Table View'}
                        ><List size={18} /></button>
                        <button 
                          type="button"
                          onClick={() => setView('grid')}
                          className={cn("w-10 h-10 rounded-xl transition-all flex items-center justify-center", view === 'grid' ? "bg-slate-950 text-white shadow" : "text-slate-400 hover:text-slate-600")}
                          title={isRtl ? 'عرض كشبكة' : 'Grid View'}
                        ><Grid size={18} /></button>
                     </div>
                  </div>
               </div>

               <div className="px-8 pb-32">
               {isLoading ? (
                 <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
                    <Loader2 className="w-12 h-12 text-slate-300 animate-spin" strokeWidth={2.5}/>
                    <p className="text-slate-400 font-black uppercase tracking-widest text-[11px] animate-pulse">
                      {isRtl ? 'جارٍ تحميل القوالب وتفاصيلها...' : 'Accessing Intelligence Layer...'}
                    </p>
                 </div>
               ) : error ? (
                 <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 text-center">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center">
                       <AlertCircle size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">{isRtl ? 'تنبيه المزامنة' : 'Sync Required'}</h3>
                      <p className="text-slate-500 max-w-sm mt-2 text-sm">{error}</p>
                    </div>
                    <button 
                      onClick={fetchData}
                      className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-wider text-[11px] hover:bg-slate-800 transition-all shadow-md active:scale-95"
                    >
                      {isRtl ? 'إعادة المحاولة' : 'Retry Connection'}
                    </button>
                 </div>
               ) : filteredTemplates.length === 0 ? (
                 <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 text-center">
                    <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-3xl flex items-center justify-center">
                       <MessageSquare size={36} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900">{isRtl ? 'لا توجد قوالب مطابقة' : 'No matching templates'}</h3>
                       <p className="text-slate-500 max-w-sm mt-2 text-sm">
                         {isRtl ? 'قم بتعديل الفلاتر أو عبارة البحث للعثور على القالب المطلوب.' : 'Adjust your filters or search query to find what you\'re looking for.'}
                       </p>
                    </div>
                    {(searchQuery !== '' || statusFilter !== 'ALL' || categoryFilter !== 'ALL') ? (
                      <button 
                        onClick={() => {
                          setSearchQuery('');
                          setStatusFilter('ALL');
                          setCategoryFilter('ALL');
                        }}
                        className="px-8 py-3 bg-slate-100 text-slate-700 rounded-2xl font-black uppercase tracking-wider text-xs hover:bg-slate-200 transition-all"
                      >
                        {isRtl ? 'مسح التصفية' : 'Clear Filters'}
                      </button>
                    ) : (
                      <button 
                         onClick={() => navigate('/templates/builder')}
                         className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-wider text-xs shadow-xl active:scale-95 transition-all"
                      >
                         {isRtl ? 'إنشاء قالب جديد' : 'Create New Template'}
                      </button>
                    )}
                 </div>
               ) : view === 'list' ? (
                 /* Table / List View */
                 <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className={cn("w-full font-sans", isRtl ? "text-right" : "text-left")}>
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/70">
                           <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-wider">{isRtl ? 'معرّف القالب' : 'Identity Core'}</th>
                           <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-wider">{isRtl ? 'الفئة' : 'Strategy Class'}</th>
                           <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-wider">{isRtl ? 'الحالة' : 'Integrity Status'}</th>
                           <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-wider">{isRtl ? 'تاريخ التحديث' : 'Sync Timestamp'}</th>
                           <th className="px-8 py-6"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredTemplates.map((template) => (
                          <tr key={template.id} className="hover:bg-slate-50/60 transition-colors group">
                            <td className="px-8 py-5">
                               <div className="flex items-center gap-4">
                                  <div className={cn(
                                    "w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shrink-0",
                                    template.category === 'MARKETING' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : 
                                    template.category === 'UTILITY' ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-purple-50 text-purple-600 border border-purple-100"
                                  )}>
                                     <MessageSquare size={18} />
                                  </div>
                                  <div>
                                     <p className="text-sm font-black text-slate-900 font-mono tracking-tight">{template.name}</p>
                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                                       {template.language?.toUpperCase() || 'EN'} • {template.header.type}
                                     </p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-5">
                               <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                  {getCategoryLabel(template.category)}
                                </span>
                            </td>
                            <td className="px-6 py-5">
                               <div className="flex items-center gap-2">
                                  {template.status === 'APPROVED' ? (
                                    <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[10px] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                       <CheckCircle size={13} />
                                       {getStatusLabel(template.status)}
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5 text-amber-600 font-black text-[10px] uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                                       <Clock size={13} />
                                       {getStatusLabel(template.status)}
                                    </div>
                                  )}
                               </div>
                            </td>
                            <td className="px-6 py-5">
                               <p className="text-xs font-bold text-slate-600">{formatUpdateDate(template.updatedAt)}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{formatUpdateTime(template.updatedAt)}</p>
                            </td>
                            <td className="px-8 py-5">
                               <div className="flex items-center justify-end gap-2">
                                  <button 
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedTemplateForPreview(template);
                                    }}
                                    className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100 cursor-pointer"
                                    title={isRtl ? 'معاينة القالب' : 'View Preview'}
                                  >
                                    <Eye size={17} />
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setTemplateToSend(template);
                                    }}
                                    disabled={template.status !== 'APPROVED'}
                                    className={cn(
                                      "w-9 h-9 flex items-center justify-center rounded-xl transition-all border border-transparent cursor-pointer",
                                      template.status !== 'APPROVED' 
                                        ? "text-slate-200 bg-slate-50 cursor-not-allowed" 
                                        : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100"
                                    )}
                                    title={template.status !== 'APPROVED' 
                                      ? (isRtl ? 'يمكن فقط إرسال القوالب المعتمدة' : 'Only approved templates can be sent') 
                                      : (isRtl ? 'إرسال إلى جهة اتصال' : 'Send Template')}
                                  >
                                    <Send size={16} />
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/templates/builder?id=${template.id}`);
                                    }}
                                    disabled={template.status === 'PENDING'}
                                    className={cn(
                                      "w-9 h-9 flex items-center justify-center rounded-xl transition-all border border-transparent cursor-pointer",
                                      template.status === 'PENDING' 
                                        ? "text-slate-200 bg-slate-50 cursor-not-allowed" 
                                        : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100"
                                    )}
                                    title={template.status === 'PENDING' 
                                      ? (isRtl ? 'لا يمكن تعديل قالب قيد المراجعة' : 'Cannot edit pending template') 
                                      : (isRtl ? 'تعديل القالب' : 'Edit Template')}
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setTemplateToDelete(template);
                                    }}
                                    className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 cursor-pointer"
                                    title={isRtl ? 'حذف القالب' : 'Delete Template'}
                                  >
                                    <Trash size={16} />
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
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {filteredTemplates.map((template, i) => (
                     <motion.div 
                       key={template.id}
                       initial={{ opacity: 0, scale: 0.98 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ delay: i * 0.04 }}
                       className="group bg-white rounded-3xl border border-slate-200 p-7 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
                       onClick={() => setSelectedTemplateForPreview(template)}
                     >
                        <div>
                          <div className="flex items-start justify-between mb-5">
                             <div className={cn(
                               "w-13 h-13 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105",
                               template.category === 'MARKETING' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : 
                               template.category === 'UTILITY' ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-purple-50 text-purple-600 border border-purple-100"
                             )}>
                                <MessageSquare size={22} />
                             </div>
                             <div className="flex items-center gap-2">
                               {template.status === 'APPROVED' ? (
                                 <span className="flex items-center gap-1.5 text-emerald-600 font-black text-[10px] uppercase tracking-wider bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                   <CheckCircle size={12} />
                                   {getStatusLabel(template.status)}
                                 </span>
                               ) : (
                                 <span className="flex items-center gap-1.5 text-amber-600 font-black text-[10px] uppercase tracking-wider bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                                   <Clock size={12} />
                                   {getStatusLabel(template.status)}
                                 </span>
                               )}
                             </div>
                          </div>

                          <div className="space-y-2 mb-5">
                             <h3 className="text-base font-black text-slate-900 font-mono tracking-tight truncate" title={template.name}>
                               {template.name}
                             </h3>
                             <div className="flex flex-wrap gap-1.5">
                               <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase">
                                 {getCategoryLabel(template.category)}
                               </span>
                               <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] font-bold uppercase">
                                 {template.header.type}
                               </span>
                               <span className="px-2.5 py-0.5 bg-slate-100 text-slate-400 rounded-md text-[10px] font-bold uppercase">
                                 {template.language?.toUpperCase() || 'EN'}
                               </span>
                             </div>
                          </div>

                          <div className="p-4 bg-slate-50 rounded-2xl mb-6 line-clamp-3 text-slate-600 text-xs font-medium leading-relaxed border border-slate-100">
                            "{template.body.text}"
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                           <div className="flex flex-col">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                               {isRtl ? 'آخر تحديث' : 'Last Updated'}
                             </span>
                             <span className="text-xs font-black text-slate-800">{formatUpdateDate(template.updatedAt)}</span>
                           </div>
                           <div className="flex gap-1.5 relative z-10" onClick={(e) => e.stopPropagation()}>
                              <button 
                                type="button"
                                onClick={() => setSelectedTemplateForPreview(template)}
                                className="w-9 h-9 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition-all cursor-pointer"
                                title={isRtl ? 'معاينة القالب' : 'View Preview'}
                              >
                                <Eye size={16} />
                              </button>
                              <button 
                                type="button"
                                onClick={() => setTemplateToSend(template)}
                                disabled={template.status !== 'APPROVED'}
                                className={cn(
                                  "w-9 h-9 border border-slate-200 rounded-xl flex items-center justify-center transition-all cursor-pointer",
                                  template.status !== 'APPROVED' 
                                    ? "text-slate-200 bg-slate-50 cursor-not-allowed" 
                                    : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100"
                                )}
                                title={template.status !== 'APPROVED' 
                                  ? (isRtl ? 'يمكن فقط إرسال القوالب المعتمدة' : 'Only approved templates can be sent') 
                                  : (isRtl ? 'إرسال إلى جهة اتصال' : 'Send Template')}
                              >
                                <Send size={15} />
                              </button>
                              <button 
                                type="button"
                                onClick={() => setTemplateToDelete(template)}
                                className="w-9 h-9 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all cursor-pointer"
                                title={isRtl ? 'حذف القالب' : 'Delete'}
                              >
                                <Trash size={15} />
                              </button>
                              <button 
                                type="button"
                                onClick={() => navigate(`/templates/builder?id=${template.id}`)}
                                disabled={template.status === 'PENDING'}
                                className={cn(
                                  "w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm",
                                  template.status === 'PENDING'
                                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                                    : "bg-slate-900 text-white hover:bg-slate-800"
                                )}
                                title={template.status === 'PENDING' 
                                  ? (isRtl ? 'قيد المراجعة' : 'Pending') 
                                  : (isRtl ? 'تعديل' : 'Edit')}
                              >
                                {isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-slate-950/40 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                className={cn(
                  "bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-full max-h-[850px] overflow-hidden flex flex-col lg:flex-row relative border border-slate-100",
                  isRtl && "text-right"
                )}
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                {/* Left Side: Professional Info Panel */}
                <div className={cn(
                  "flex flex-col w-full lg:w-[380px] bg-white p-6 sm:p-8 shrink-0",
                  isRtl ? "border-l border-slate-100" : "border-r border-slate-100"
                )}>
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-1">
                       <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shrink-0">
                          <Eye size={18} />
                       </div>
                       <div>
                          <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                            {isRtl ? 'تفاصيل القالب' : 'Template Details'}
                          </h3>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                            {isRtl ? 'فاحص القوالب التفاعلي' : 'Premium Inspector'}
                          </p>
                       </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
                    {/* Identity Group */}
                    <div className="space-y-5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 mt-0.5">
                          <FileText size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                            {isRtl ? 'الاسم الداخلي' : 'Internal Name'}
                          </span>
                          <p className="text-sm font-bold text-slate-900 break-words leading-tight font-mono">{selectedTemplateForPreview.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                          <Tag size={16} />
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                            {isRtl ? 'الفئة' : 'Category'}
                          </span>
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border",
                            selectedTemplateForPreview.category === 'MARKETING' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            selectedTemplateForPreview.category === 'UTILITY' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            'bg-purple-50 text-purple-700 border-purple-100'
                          )}>
                            {getCategoryLabel(selectedTemplateForPreview.category)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                          <Globe size={16} />
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                            {isRtl ? 'اللغة' : 'Language'}
                          </span>
                          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">{selectedTemplateForPreview.language || 'English (US)'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                          <Activity size={16} />
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                            {isRtl ? 'حالة النشر' : 'Publish Status'}
                          </span>
                          <div className="flex items-center gap-2">
                             <div className={cn(
                               "w-2 h-2 rounded-full",
                               selectedTemplateForPreview.status === 'APPROVED' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'
                             )} />
                             <span className="text-xs font-black text-slate-700 uppercase">
                               {getStatusLabel(selectedTemplateForPreview.status)}
                             </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 space-y-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                          <Calendar size={16} />
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                            {isRtl ? 'آخر تحديث' : 'Last Updated'}
                          </span>
                          <p className="text-xs font-bold text-slate-800">
                            {formatUpdateDate(selectedTemplateForPreview.updatedAt)} {formatUpdateTime(selectedTemplateForPreview.updatedAt)}
                          </p>
                        </div>
                      </div>

                      {selectedTemplateForPreview.status === 'APPROVED' && (
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                               {isRtl ? 'الأداء (30 يوماً)' : 'Performance (30D)'}
                             </span>
                             <div className={cn(
                               "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border",
                               templatePerformance?.hero_insight?.quality_score === 'Needs Improvement' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                             )}>
                               {isLoadingPerformance 
                                 ? (isRtl ? 'جارٍ التحميل...' : 'Loading...') 
                                 : (templatePerformance?.hero_insight?.quality_score || (isRtl ? 'ممتاز' : 'Optimal'))}
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
                                  {isRtl ? 'معدل القراءة' : 'Open Rate'}
                                </p>
                                <p className="text-base font-black text-slate-900 leading-none">
                                  {isLoadingPerformance ? '...' : (templatePerformance?.stats?.read_rate ? `${templatePerformance.stats.read_rate}%` : '0%')}
                                </p>
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
                                  {isRtl ? 'تم التسليم' : 'Delivered'}
                                </p>
                                <p className="text-base font-black text-slate-900 leading-none">
                                  {isLoadingPerformance ? '...' : (templatePerformance?.stats?.total_delivered?.toLocaleString() || '0')}
                                </p>
                             </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sidebar Actions */}
                  <div className="mt-auto pt-6 flex flex-col gap-2.5 shrink-0">
                    <button 
                      onClick={() => setTemplateToSend(selectedTemplateForPreview)}
                      disabled={selectedTemplateForPreview.status !== 'APPROVED'}
                      className={cn(
                        "flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95",
                        selectedTemplateForPreview.status !== 'APPROVED'
                          ? "bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed"
                          : "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
                      )}
                    >
                      <Send size={15} />
                      {isRtl ? 'إرسال إلى جهة اتصال' : 'Send to Contact'}
                    </button>
                    <button 
                      onClick={() => navigate(`/templates/builder?id=${selectedTemplateForPreview.id}`)}
                      disabled={selectedTemplateForPreview.status === 'PENDING'}
                      className={cn(
                        "flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95",
                        selectedTemplateForPreview.status === 'PENDING'
                          ? "bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed"
                          : "bg-slate-900 text-white shadow-md hover:bg-slate-800"
                      )}
                    >
                      <Edit2 size={15} />
                      {isRtl ? 'تعديل القالب' : 'Edit Template'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setTemplateToDelete(selectedTemplateForPreview);
                      }}
                      className="flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-red-100 transition-all active:scale-95 cursor-pointer"
                    >
                      <Trash size={15} />
                      {isRtl ? 'حذف القالب' : 'Delete Template'}
                    </button>
                  </div>
                </div>

                {/* Right Side: Primary Focus Preview */}
                <div className="flex-1 flex flex-col h-full bg-slate-50/70 overflow-hidden relative">
                  <div className="px-8 py-5 flex items-center justify-between shrink-0 z-20 border-b border-slate-100 bg-white/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                       <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                         {isRtl ? 'معاينة الرسالة الحية' : 'Message Visualization'}
                       </span>
                    </div>
                    <button 
                      onClick={() => setSelectedTemplateForPreview(null)}
                      className="w-10 h-10 flex items-center justify-center bg-white shadow-sm border border-slate-200 text-slate-400 hover:text-slate-900 rounded-xl transition-all active:scale-90"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  {/* Phone Centerpiece */}
                  <div className="flex-1 flex items-center justify-center overflow-y-auto p-6 relative z-10">
                    <div className="scale-[0.85] lg:scale-[0.95] xl:scale-100 transition-all duration-300">
                       <WhatsAppPreview template={selectedTemplateForPreview} />
                    </div>
                  </div>

                  {/* Mobile Footer */}
                  <div className="p-4 shrink-0 lg:hidden bg-white border-t border-slate-100 flex gap-2">
                     <button 
                       onClick={() => setSelectedTemplateForPreview(null)}
                       className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow"
                     >
                       {isRtl ? 'إغلاق المعاينة' : 'Close Preview'}
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
                setSuccessMessage(isRtl ? `تم إرسال القالب "${templateToSend.name}" بنجاح` : `Template "${templateToSend.name}" sent successfully`);
                setTimeout(() => setSuccessMessage(null), 5000);
              }}
            />
          )}
        </AnimatePresence>
        
        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {templateToDelete && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm" dir={isRtl ? 'rtl' : 'ltr'}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className={cn("bg-white rounded-3xl p-7 max-w-md w-full shadow-2xl border border-slate-100", isRtl && "text-right")}
              >
                <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-5">
                  <Trash size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  {isRtl ? 'حذف هذا القالب؟' : 'Delete Template?'}
                </h3>
                <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                  {isRtl 
                    ? <>هل أنت متأكد من رغبتك في حذف القالب <span className="text-slate-900 font-bold">"{templateToDelete.name}"</span>؟ هذا الإجراء دائم ولا يمكن التراجع عنه عبر ميتا.</>
                    : <>Are you sure you want to delete <span className="text-slate-900 font-bold">"{templateToDelete.name}"</span>? This action is permanent and cannot be undone via Meta.</>}
                </p>

                {deleteError && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3"
                  >
                    <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-black text-red-600 uppercase tracking-wider mb-1">
                        {isRtl ? 'خطأ في العملية' : 'Status Error'}
                      </p>
                      <p className="text-xs font-medium text-red-900 leading-tight">{deleteError}</p>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setTemplateToDelete(null)}
                    disabled={isDeleting}
                    className="py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isRtl ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button 
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="py-3.5 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash size={14} />
                    )}
                    {isRtl ? 'تأكيد الحذف' : 'Confirm Delete'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
    </div>
  );
}
