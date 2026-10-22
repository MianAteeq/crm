import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, CheckCircle2, Layout, Database, Calendar, Rocket,
  Smartphone, MessageCircle, Info, Sparkles, Wand2,
  Target, Send, Zap, Heart, Flame, ChevronDown, Eye, AlertCircle, Clock, Globe,
  Users, BarChart3, TrendingUp, ShieldCheck, Timer, RefreshCw, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { whatsappApi } from '../../services/whatsappApi';
import { crmApi } from '../../services/crmApi';
import { WhatsAppTemplate } from '../../types/whatsapp';
import AudienceSelector from '../../components/campaigns/builder/AudienceSelector';
import SchedulePicker from '../../components/campaigns/builder/SchedulePicker';
import ComplianceChecklist from '../../components/campaigns/builder/ComplianceChecklist';
import { useI18n } from '../../i18n';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';

export default function CampaignBuilderPage() {
  const navigate = useNavigate();
  const { isRtl } = useI18n();

  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchError, setLaunchError] = useState<string | null>(null);
  const [launchSuccess, setLaunchSuccess] = useState(false);
  
  // Builder State
  const [campaignData, setCampaignData] = useState({
    name: '',
    type: 'Promotional' as 'Promotional' | 'Transactional' | 'Alert' | 'Survey',
    goal: 'Increase Website Traffic',
    audience: { type: 'all' as any, segmentId: '', tagIds: [] as number[], contactIds: [] as number[] },
    template: null as WhatsAppTemplate | null,
    scheduleMethod: 'now' as 'now' | 'scheduled',
    scheduledDate: '',
    scheduledTime: '',
  });

  const [contacts, setContacts] = useState<any[]>([]);
  const [performanceInsights, setPerformanceInsights] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingTemplates(true);
      try {
        const [templatesData, contactsData, insightsData] = await Promise.all([
          whatsappApi.fetchTemplates(),
          crmApi.getContacts(),
          whatsappApi.fetchPerformanceInsights(30).catch(err => {
            console.warn('Failed to load performance insights:', err);
            return null;
          })
        ]);
        setTemplates(templatesData || []);
        setContacts(contactsData || []);
        setPerformanceInsights(insightsData || null);
      } catch (error) {
        console.error('Failed to load builder reference data:', error);
      } finally {
        setIsLoadingTemplates(false);
      }
    };
    loadData();
  }, []);

  const getEstimatedReach = () => {
    if (campaignData.audience.type === 'manual') {
      return (campaignData.audience.contactIds || []).length;
    }
    if (campaignData.audience.type === 'segment') {
      const selectedTagIds = campaignData.audience.tagIds || [];
      if (selectedTagIds.length === 0) return 0;
      return contacts.filter(contact => {
        const contactTagIds = contact.tags?.map((t: any) => Number(t)) || [];
        return contactTagIds.some((id: number) => selectedTagIds.includes(id));
      }).length;
    }
    // Default or All Contacts
    return contacts.length > 0 ? contacts.length : 12450;
  };

  const getStats = () => {
    let deliveryRate = 98;
    let readRate = 68;

    if (campaignData.template && performanceInsights?.top_templates) {
      const templateStats = performanceInsights.top_templates.find((t: any) => 
        String(t.template_name).toLowerCase() === String(campaignData.template?.name).toLowerCase()
      );
      if (templateStats) {
        deliveryRate = templateStats.delivery_rate ?? 98;
        readRate = templateStats.read_rate ?? 68;
      } else if (performanceInsights.stats) {
        deliveryRate = performanceInsights.stats.delivery_rate ?? 98;
        readRate = performanceInsights.stats.read_rate ?? 68;
      }
    } else if (performanceInsights?.stats) {
      deliveryRate = performanceInsights.stats.delivery_rate ?? 98;
      readRate = performanceInsights.stats.read_rate ?? 68;
    }

    const clickRate = Math.round(readRate * 0.35);

    const deliveryLabel = deliveryRate >= 90 
      ? (isRtl ? 'كفاءة عالية' : 'High Efficiency') 
      : (deliveryRate >= 70 ? (isRtl ? 'طبيعي' : 'Normal') : (isRtl ? 'يحتاج تحسين' : 'Needs Optimization'));
    const readLabel = readRate >= 70 
      ? (isRtl ? 'ممتاز' : 'Excellent') 
      : (readRate >= 40 ? (isRtl ? 'متوسط' : 'Average') : (isRtl ? 'تفاعل منخفض' : 'Low Engagement'));
    const clickLabel = clickRate >= 20 
      ? (isRtl ? 'جيد جداً' : 'Good') 
      : (isRtl ? 'يحتاج تحسين' : 'Needs Improvement');

    return {
      deliveryRate,
      readRate,
      clickRate,
      deliveryLabel,
      readLabel,
      clickLabel
    };
  };

  const currentStats = getStats();
  const estimatedReach = getEstimatedReach();

  const handleLaunch = async () => {
    if (!campaignData.name || !campaignData.template) {
      setLaunchError(isRtl ? 'اسم الحملة واختيار القالب مطلوبان للمتابعة.' : 'Campaign name and template selection are required.');
      return;
    }

    setIsLaunching(true);
    setLaunchError(null);
    setLaunchSuccess(false);

    const templateId = Number(campaignData.template.id);
    const scheduledAt = campaignData.scheduleMethod === 'scheduled' && campaignData.scheduledDate && campaignData.scheduledTime
      ? `${campaignData.scheduledDate}T${campaignData.scheduledTime}:00Z`
      : null;

    let payload: any = {
      name: campaignData.name,
      type: 'broadcast',
      template_id: templateId,
      scheduled_at: scheduledAt
    };

    if (campaignData.audience.type === 'segment') {
      payload.audience_type = 'segment';
      payload.tag_ids = campaignData.audience.tagIds || [];
    } else if (campaignData.audience.type === 'manual') {
      payload.audience_type = 'manual';
      payload.contact_ids = campaignData.audience.contactIds || [];
    } else {
      payload.audience_type = 'all_contacts';
    }

    try {
      console.log('[Campaign Builder] Triggering Campaign API Integration POST with payload:', payload);
      const res = await crmApi.createCampaign(payload);
      console.log('[Campaign Builder] Campaign successfully registered on backbones:', res);
      setLaunchSuccess(true);
      setTimeout(() => {
        navigate('/campaigns');
      }, 1500);
    } catch (err: any) {
      console.error('[Campaign Builder] Failed API campaign dispatching:', err);
      setLaunchError(err?.message || (isRtl ? 'فشل إنشاء الحملة. يرجى التأكد من الاتصال وصلاحيات الحساب.' : 'Creation failed. Please confirm connection schema and credentials.'));
    } finally {
      setIsLaunching(false);
    }
  };

  const MobilePreview = () => (
    <div className="w-full max-w-[340px] mx-auto sticky top-8" dir="ltr">
       <div className="text-center mb-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
            {isRtl ? 'معاينة الرسالة' : 'Message Preview'}
          </h3>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tight">
            {isRtl ? 'هكذا ستظهر رسالتك للمستلم على واتساب' : 'This is how your message will appear'}
          </p>
       </div>
       
       <div className="relative mx-auto border-slate-900 bg-slate-900 border-[12px] rounded-[3rem] h-[660px] w-full shadow-2xl overflow-hidden">
          {/* Dynamic Island / Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-900 rounded-b-2xl z-20" />
          
          <div className="w-full h-full bg-[#f0f2f5] flex flex-col pt-6">
             {/* WhatsApp Header */}
             <div className="bg-[#075e54] p-4 pt-6 text-white flex items-center gap-3">
                <ArrowLeft size={18} />
                <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden shrink-0">
                   <img src="https://ui-avatars.com/api/?name=Your+Logo&background=e2e8f0&color=475569" alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-xs font-bold truncate">{isRtl ? 'اسم منشأتك' : 'Your Business'}</p>
                   <p className="text-[9px] opacity-70 font-medium">{isRtl ? 'متصل الآن' : 'online'}</p>
                </div>
                <div className="flex items-center gap-3 opacity-80">
                   <Eye size={16} />
                   <MessageCircle size={16} />
                </div>
             </div>

             {/* WhatsApp Body */}
             <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
                {campaignData.template?.header?.mediaUrl && (
                   <div className="bg-white p-1 rounded-xl shadow-sm overflow-hidden mb-2">
                      <img 
                        src={campaignData.template.header.mediaUrl} 
                        alt="Preview" 
                        className="w-full h-36 object-cover rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                   </div>
                )}
                <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm max-w-[85%] relative border border-slate-100">
                   <div className="absolute top-0 -left-1.5 w-0 h-0 border-t-[8px] border-t-white border-l-[8px] border-l-transparent" />
                   <div className="text-[12px] text-slate-800 whitespace-pre-wrap leading-relaxed font-medium">
                      {campaignData.template?.body?.text || (isRtl ? 'اختر قالباً لمعاينة نص رسالتك...' : 'Select a template to preview your message...')}
                   </div>
                   {campaignData.template?.footer?.text && (
                     <p className="text-[10px] text-slate-400 mt-2 font-medium border-t border-slate-50 pt-2 uppercase tracking-tight">
                       {campaignData.template.footer.text}
                     </p>
                   )}
                   <p className="text-[9px] text-slate-400 text-right mt-1 font-bold">11:30 AM</p>
                </div>

                {campaignData.template?.buttons?.map((btn, idx) => (
                  <div key={idx} className="bg-white/90 backdrop-blur-sm p-2.5 rounded-xl text-[#00a884] text-[11px] font-bold text-center shadow-sm border border-white/20 transition-all hover:bg-white">
                    <div className="flex items-center justify-center gap-2">
                       {btn.type === 'URL' && <Layout size={12} />}
                       {btn.type === 'CALL' && <Smartphone size={12} />}
                       <span>{btn.text}</span>
                    </div>
                  </div>
                ))}
             </div>

             {/* WhatsApp Input */}
             <div className="p-3 bg-slate-50 flex items-center gap-2">
                <div className="flex-1 bg-white rounded-full px-4 py-2 border border-slate-200 text-[11px] text-slate-400">
                   {isRtl ? 'اكتب رسالة' : 'Type a message'}
                </div>
                <div className="w-9 h-9 rounded-full bg-[#128c7e] flex items-center justify-center text-white shadow-lg">
                   <Send size={16} fill="currentColor" />
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Navigation */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/campaigns')}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500 hover:text-slate-900 cursor-pointer"
              title={isRtl ? 'رجوع للحملات' : 'Back to Campaigns'}
            >
              {isRtl ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {isRtl ? 'إنشاء حملة جديدة' : 'Create Campaign'}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {isRtl ? 'اضبط تفاصيل حملتك التسويقية بدقة واحترافية' : 'Set up details for your unique broadcast'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <LanguageSwitcher variant="dropdown" />
             <button 
               onClick={() => navigate('/campaigns')}
               className="h-10 px-4.5 border border-slate-200 bg-white hover:bg-[#F0FDF4] hover:border-[#bbf7d0] text-xs font-semibold text-[#57534E] hover:text-[#166534] rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center"
             >
                {isRtl ? 'إلغاء' : 'Cancel'}
             </button>
             <button 
                onClick={handleLaunch}
                disabled={!campaignData.name || !campaignData.template || isLaunching || launchSuccess}
                className="h-10 px-6 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-[#166534]/15 active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
             >
                {isLaunching && <Loader2 size={12} className="animate-spin text-white" />}
                <span>
                  {launchSuccess 
                    ? (isRtl ? 'تم الإطلاق بنجاح' : 'Launched') 
                    : (isRtl ? 'إطلاق الحملة' : 'Launch Campaign')}
                </span>
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {launchError && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              className="mb-8 p-5 bg-red-500/5 border border-red-200/60 rounded-2xl flex items-center gap-4 text-red-900 shadow-sm"
              key="launch-error"
            >
              <AlertCircle className="text-red-600 shrink-0 stroke-[2.5px]" size={20} />
              <div className="flex-1">
                <p className="text-xs font-black uppercase tracking-widest leading-none">
                  {isRtl ? 'فشل إطلاق الحملة' : 'Campaign Launch Failure'}
                </p>
                <p className="text-[11px] font-medium mt-1.5 text-red-700/95">{launchError}</p>
              </div>
            </motion.div>
          )}

          {launchSuccess && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              className="mb-8 p-5 bg-emerald-500/5 border border-emerald-200/60 rounded-2xl flex items-center gap-4 text-emerald-900 shadow-sm"
              key="launch-success"
            >
              <CheckCircle2 className="text-emerald-600 shrink-0 stroke-[2.5px]" size={20} />
              <div className="flex-1">
                <p className="text-xs font-black uppercase tracking-widest leading-none">
                  {isRtl ? 'تم إطلاق الحملة بنجاح!' : 'Campaign Launched Successfully!'}
                </p>
                <p className="text-[11px] font-medium mt-1.5 text-emerald-700/95">
                  {isRtl 
                    ? 'تم إرسال تدفق حملة واتساب المحددة بنجاح إلى جهات الاتصال المستهدفة.' 
                    : 'Your WhatsApp broadcast stream payload is successfully dispatched to the target nodes.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Form Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Section 1: Basic Details */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-8">
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-1.5 h-6 bg-[#166534] rounded-full" />
                  <h2 className="text-lg font-bold text-slate-900">
                    {isRtl ? 'تفاصيل الحملة' : 'Campaign Details'}
                  </h2>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        {isRtl ? 'اسم الحملة' : 'Campaign Name'}
                     </label>
                     <span className="text-[10px] font-bold text-slate-300">{campaignData.name.length}/100</span>
                  </div>
                  <input 
                    value={campaignData.name}
                    onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
                    placeholder={isRtl ? 'مثال: عروض التخفيضات الموسمية' : 'e.g. Summer Sale Promotion'}
                    maxLength={100}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-5 text-lg font-bold text-slate-900 placeholder:text-slate-200 focus:outline-none focus:border-[#166534] focus:ring-4 focus:ring-[#166534]/5 transition-all shadow-sm"
                  />
               </div>

               <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {isRtl ? 'نوع الحملة' : 'Campaign Type'}
                  </label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                     {[
                       { 
                         id: 'Promotional', 
                         label: isRtl ? 'ترويجية وتسويقية' : 'Promotional', 
                         description: isRtl ? 'ترويج العروض والخصومات' : 'Promote offers, deals', 
                         icon: Flame, 
                         theme: 'emerald' 
                       },
                       { 
                         id: 'Transactional', 
                         label: isRtl ? 'معاملات وتحديثات' : 'Transactional', 
                         description: isRtl ? 'تحديثات الطلبات والحسابات' : 'Order updates', 
                         icon: Database, 
                         theme: 'blue' 
                       },
                       { 
                         id: 'Alert', 
                         label: isRtl ? 'تنبيهات وإشعارات' : 'Alert', 
                         description: isRtl ? 'إشعارات هامة ومباشرة' : 'Important alerts', 
                         icon: Sparkles, 
                         theme: 'purple' 
                       },
                       { 
                         id: 'Survey', 
                         label: isRtl ? 'استبيانات واستطلاع' : 'Survey', 
                         description: isRtl ? 'جمع آراء وتقييمات العملاء' : 'Collect feedback', 
                         icon: Layout, 
                         theme: 'amber' 
                       }
                     ].map(type => {
                       const isSelected = campaignData.type === type.id;
                       const themeMap = {
                         emerald: { border: 'border-emerald-500', bg: 'bg-emerald-50/30', icon: 'bg-emerald-100 text-emerald-600', text: 'text-emerald-700', check: 'bg-emerald-500' },
                         blue: { border: 'border-blue-500', bg: 'bg-blue-50/30', icon: 'bg-blue-100 text-blue-600', text: 'text-blue-700', check: 'bg-blue-500' },
                         purple: { border: 'border-[#166534]', bg: 'bg-[#F0FDF4]', icon: 'bg-[#dcfce7] text-[#166534]', text: 'text-[#166534]', check: 'bg-[#166534]' },
                         amber: { border: 'border-amber-500', bg: 'bg-amber-50/30', icon: 'bg-amber-100 text-amber-600', text: 'text-amber-700', check: 'bg-amber-500' }
                       };
                       const currentTheme = themeMap[type.theme as keyof typeof themeMap];

                       return (
                         <button
                            key={type.id}
                            type="button"
                            onClick={() => setCampaignData({ ...campaignData, type: type.id as any })}
                            className={cn(
                              "relative p-6 rounded-2xl border-2 flex flex-col items-start gap-4 transition-all duration-300 group text-start cursor-pointer",
                              isSelected 
                                ? `${currentTheme.border} ${currentTheme.bg} shadow-md` 
                                : "bg-white border-slate-100 text-slate-900 hover:border-slate-200"
                            )}
                         >
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                              isSelected ? currentTheme.icon : "bg-slate-50 text-slate-400 group-hover:scale-110"
                            )}>
                              <type.icon size={20} />
                            </div>
                            <div>
                               <p className={cn(
                                 "text-sm font-bold tracking-tight",
                                 isSelected ? currentTheme.text : "text-slate-900"
                               )}>{type.label}</p>
                               <p className="text-[10px] font-medium mt-1 leading-relaxed text-slate-400">
                                 {type.description}
                               </p>
                            </div>
                            {isSelected && (
                              <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} animate-in fade-in zoom-in`}>
                                 <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shadow-sm", currentTheme.check)}>
                                    <CheckCircle2 size={12} className="text-white" />
                                 </div>
                              </div>
                            )}
                         </button>
                       );
                     })}
                  </div>
               </div>
            </div>

            {/* Section 2: Template Selection */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-1.5 h-6 bg-[#166534] rounded-full" />
                  <h2 className="text-lg font-bold text-slate-900">
                    {isRtl ? 'اختيار القالب' : 'Select Template'}
                  </h2>
               </div>

               <div className="relative group">
                  <div className={`absolute inset-y-0 ${isRtl ? 'right-5' : 'left-5'} flex items-center pointer-events-none`}>
                     {campaignData.template ? (
                        <div className="w-12 h-8 rounded-lg overflow-hidden border border-slate-200">
                           <img 
                              src={campaignData.template.header?.mediaUrl || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=60&fit=crop'} 
                              alt="" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                           />
                        </div>
                     ) : (
                        <div className="w-10 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300">
                           <Layout size={18} />
                        </div>
                     )}
                  </div>
                  <select 
                    value={campaignData.template?.id || ''}
                    onChange={(e) => {
                      const t = templates.find(temp => temp.id === e.target.value);
                      setCampaignData({ ...campaignData, template: t || null });
                    }}
                    className={`w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-5 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#166534] transition-all appearance-none cursor-pointer ${
                      isRtl ? 'pr-20 pl-10' : 'pl-20 pr-10'
                    }`}
                  >
                     <option value="" disabled>
                       {isRtl ? 'اختر قالباً جاهزاً ومعتمداً...' : 'Choose a pre-built template...'}
                     </option>
                     {templates.map(t => (
                       <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
                     ))}
                  </select>
                  <div className={`absolute inset-y-0 ${isRtl ? 'left-6' : 'right-6'} flex items-center pointer-events-none text-slate-400`}>
                     <ChevronDown size={18} />
                  </div>
               </div>

               {campaignData.template && (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                           <CheckCircle2 size={20} />
                        </div>
                        <div>
                           <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">
                             {isRtl ? 'موثق ومعتمد' : 'Authenticated'}
                           </p>
                           <h4 className="text-xs font-bold text-slate-900 uppercase">{campaignData.template.name}</h4>
                        </div>
                     </div>
                     <button 
                       type="button"
                       className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all shadow-sm cursor-pointer"
                     >
                        <Eye size={12} />
                        <span>{isRtl ? 'معاينة' : 'Preview'}</span>
                     </button>
                  </div>
               )}
            </div>

            {/* Section 3: Campaign Goal */}
             <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                  <h2 className="text-lg font-bold text-slate-900">
                    {isRtl ? 'هدف الحملة' : 'Campaign Goal'}
                  </h2>
               </div>

               <div className="relative">
                  <div className={`absolute inset-y-0 ${isRtl ? 'right-5' : 'left-5'} flex items-center pointer-events-none text-emerald-500`}>
                     <TrendingUp size={20} />
                  </div>
                  <select 
                    value={campaignData.goal}
                    onChange={(e) => setCampaignData({ ...campaignData, goal: e.target.value })}
                    className={`w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-5 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer ${
                      isRtl ? 'pr-14 pl-10' : 'pl-14 pr-10'
                    }`}
                  >
                     {[
                       { id: 'Increase Website Traffic', en: 'Increase Website Traffic', ar: 'زيادة زيارات الموقع الإلكتروني' },
                       { id: 'Drive Sales Conversion', en: 'Drive Sales Conversion', ar: 'زيادة المبيعات والتحويلات' },
                       { id: 'Nurture Lead engagement', en: 'Nurture Lead engagement', ar: 'تنشيط تفاعل العملاء المحتملين' },
                       { id: 'Customer Support Automation', en: 'Customer Support Automation', ar: 'أتمتة خدمة ودعم العملاء' }
                     ].map(g => (
                       <option key={g.id} value={g.id}>{isRtl ? g.ar : g.en}</option>
                     ))}
                  </select>
                  <div className={`absolute inset-y-0 ${isRtl ? 'left-6' : 'right-6'} flex items-center pointer-events-none text-slate-400`}>
                     <ChevronDown size={18} />
                  </div>
               </div>
            </div>

            {/* Section 4: Audience */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mt-8">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-6 bg-[#166534] rounded-full" />
                  <h2 className="text-lg font-bold text-slate-900">
                    {isRtl ? 'تحديد الجمهور المستهدف' : 'Select Audience'}
                  </h2>
               </div>
               <AudienceSelector value={campaignData.audience} onChange={(a) => setCampaignData({ ...campaignData, audience: a })} />
            </div>

            {/* Section 5: Delivery */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mt-8">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
                  <h2 className="text-lg font-bold text-slate-900">
                    {isRtl ? 'جدول الإرسال والتسليم' : 'Delivery Schedule'}
                  </h2>
               </div>
               <SchedulePicker 
                  method={campaignData.scheduleMethod}
                  onMethodChange={(m) => setCampaignData({ ...campaignData, scheduleMethod: m })}
                  date={campaignData.scheduledDate}
                  onDateChange={(d) => setCampaignData({ ...campaignData, scheduledDate: d })}
                  time={campaignData.scheduledTime}
                  onTimeChange={(t) => setCampaignData({ ...campaignData, scheduledTime: t })}
               />
            </div>
            
            {/* Section 6: Compliance */}
            <div className="mt-8">
              <ComplianceChecklist campaignData={campaignData} />
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-4 relative">
            <MobilePreview />
          </div>
        </div>

        {/* Global Stats Footer */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-white shadow-premium rounded-[2.5rem] border border-slate-100">
           <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center shadow-inner shrink-0">
                 <Users size={24} />
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                   {isRtl ? 'الوصول المتوقع' : 'Estimated Reach'}
                 </p>
                 <h4 className="text-2xl font-black text-slate-900">{estimatedReach.toLocaleString()}</h4>
                 <p className="text-[10px] font-bold text-slate-400 uppercase">
                   {isRtl ? 'مستلم' : 'Recipients'}
                 </p>
              </div>
           </div>

           <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-inner shrink-0">
                 <Rocket size={24} />
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                   {isRtl ? 'معدل التسليم' : 'Delivery Rate'}
                 </p>
                 <h4 className="text-2xl font-black text-slate-900">{currentStats.deliveryRate}%</h4>
                 <p className={cn(
                   "text-[10px] font-bold uppercase",
                   currentStats.deliveryRate >= 70 ? "text-emerald-500" : "text-amber-500"
                 )}>{currentStats.deliveryLabel}</p>
              </div>
           </div>

           <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-inner shrink-0">
                 <MessageCircle size={24} />
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                   {isRtl ? 'معدل القراءة' : 'Read Rate'}
                 </p>
                 <h4 className="text-2xl font-black text-slate-900">{currentStats.readRate}%</h4>
                 <p className={cn(
                   "text-[10px] font-bold uppercase",
                   currentStats.readRate >= 40 ? "text-slate-400" : "text-amber-500"
                 )}>{currentStats.readLabel}</p>
              </div>
           </div>

           <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-inner shrink-0">
                 <TrendingUp size={24} />
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                   {isRtl ? 'معدل النقر' : 'Click Rate'}
                 </p>
                 <h4 className="text-2xl font-black text-slate-900">{currentStats.clickRate}%</h4>
                 <p className={cn(
                   "text-[10px] font-bold uppercase",
                   currentStats.clickRate >= 20 ? "text-emerald-500" : "text-amber-500"
                 )}>{currentStats.clickLabel}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
