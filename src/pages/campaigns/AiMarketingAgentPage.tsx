import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ShieldCheck, 
  Eye, 
  FileText, 
  Users, 
  Building2, 
  Layers, 
  RotateCcw, 
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  Settings, 
  BookOpen, 
  TrendingUp, 
  Briefcase, 
  Info,
  Check,
  Play,
  Filter,
  BarChart3,
  Bot,
  Edit3,
  Save,
  Palette,
  ExternalLink,
  Code2,
  Lock,
  Tag,
  Undo2,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  MousePointerClick,
  Plus,
  User,
  Building,
  Mail,
  X
} from 'lucide-react';
import { 
  aiMarketingAgentApi, 
  AiAgentRun, 
  CampaignPlan, 
  MarketingKnowledge, 
  MarketingService 
} from '../../services/aiMarketingAgentApi';
import { 
  EMAIL_TEMPLATE_THEMES, 
  wrapEmailWithTemplate, 
  extractBodyContent, 
  renderPreviewVariables,
  renderThemeHeader,
  renderThemeFooter,
  EmailTemplateTheme
} from '../../utils/emailTemplateFrames';
import { toast } from '../../components/ui/Toast';
import { useI18n } from '../../i18n';
import { cn } from '../../lib/utils';

export default function AiMarketingAgentPage() {
  const { t, isRtl } = useI18n();
  const [activeTab, setActiveTab] = useState<'console' | 'history' | 'knowledge' | 'settings'>('console');
  
  // Prompt & Run state
  const [prompt, setPrompt] = useState('');
  const [isPlanning, setIsPlanning] = useState(false);
  const [currentRun, setCurrentRun] = useState<AiAgentRun | null>(null);
  const [pastRuns, setPastRuns] = useState<AiAgentRun[]>([]);
  const [isLoadingRuns, setIsLoadingRuns] = useState(false);

  // Template Theme & Live View State
  const [selectedTheme, setSelectedTheme] = useState<string>('executive');
  const [previewMode, setPreviewMode] = useState<'simulated' | 'tags'>('simulated');

  // Email In-Place Editing State (Requirement: User can edit the email and proper template)
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editSubject, setEditSubject] = useState('');
  const [editPreheader, setEditPreheader] = useState('');
  const [editFromName, setEditFromName] = useState('');
  const [editCtaText, setEditCtaText] = useState('');
  const [editCtaUrl, setEditCtaUrl] = useState('');
  const [editBodyHtml, setEditBodyHtml] = useState('');
  const [isSavingEmailEdits, setIsSavingEmailEdits] = useState(false);

  // Visual Editor Refs & State
  const visualEditorRef = useRef<HTMLDivElement>(null);
  const lastSavedRangeRef = useRef<Range | null>(null);

  // CTA Button Modal State
  const [isButtonModalOpen, setIsButtonModalOpen] = useState(false);
  const [buttonText, setButtonText] = useState('Book a Demo');
  const [buttonUrl, setButtonUrl] = useState('https://calendly.com');
  const [buttonColor, setButtonColor] = useState('#2563eb');
  const [buttonAlign, setButtonAlign] = useState<'left' | 'center'>('left');

  // Modals & Panels
  const [showEmailPreviewModal, setShowEmailPreviewModal] = useState(false);
  const [showAudienceModal, setShowAudienceModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [isApproving, setIsApproving] = useState(false);

  // Post-campaign analysis state
  const [analyzingRunId, setAnalyzingRunId] = useState<number | null>(null);
  const [selectedRunForAnalysis, setSelectedRunForAnalysis] = useState<AiAgentRun | null>(null);

  // Knowledge & Settings state
  const [knowledge, setKnowledge] = useState<MarketingKnowledge | null>(null);
  const [services, setServices] = useState<MarketingService[]>([]);
  const [isLoadingKnowledge, setIsLoadingKnowledge] = useState(false);
  const [isSavingKnowledge, setIsSavingKnowledge] = useState(false);

  // Sample quick prompts
  const samplePrompts = isRtl ? [
    "أرسل بريداً إلكترونياً إلى شركات العقارات حول خدمة الشات بوت بالذكاء الاصطناعي.",
    "أنشئ حملة تسويقية لعيادات الأسنان للترويج لموظف الاستقبال الافتراضي الذكي.",
    "تواصل مع منشآت قطاع السيارات التي لم يسبق لها استلام بريد تسويقي منا.",
    "أرسل رسالة متابعة لجهات اتصال العقارات التي استلمت حملتنا السابقة.",
    "روّج لخدمة أتمتة الردود على الواتساب للمراكز الطبية والعيادات المحلية.",
  ] : [
    "Send an email to real estate businesses about our AI chatbot service.",
    "Create a campaign for dental clinics promoting our AI receptionist.",
    "Contact businesses in the Automotive category that have never received an email from us.",
    "Send a follow-up to real estate contacts who received our previous campaign.",
    "Promote our WhatsApp automation service to local clinics in Lahore.",
  ];

  const getThemeLabel = (themeId: string, fallback: string) => {
    if (!isRtl) return fallback;
    switch (themeId) {
      case 'executive': return 'تنفيذي حديث';
      case 'minimal': return 'بسيط وأنيق';
      case 'corporate': return 'شركات رسمي';
      case 'bold': return 'جريء وبارز';
      case 'modern': return 'عصري متطور';
      default: return fallback;
    }
  };

  const getStatusBadge = (status: string) => {
    if (!isRtl) return status.replace('_', ' ');
    switch (status) {
      case 'awaiting_approval': return 'بانتظار الموافقة';
      case 'running': return 'قيد التنفيذ';
      case 'completed': return 'مكتمل';
      case 'failed': return 'فشل';
      case 'scheduled': return 'مجدول';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  // Fetch initial knowledge and past runs
  useEffect(() => {
    loadKnowledge();
    loadRuns();
  }, []);

  // When a run is loaded or set, initialize the editable email state
  useEffect(() => {
    if (currentRun?.campaign_plan) {
      const plan = currentRun.campaign_plan;
      setEditSubject(plan.subject || '');
      setEditPreheader(plan.preheader || '');
      setEditFromName(plan.from_name || '');
      setEditCtaText(plan.cta_text || 'Book a Demo');
      setEditCtaUrl(knowledge?.demo_link || 'https://example.com/demo');
      const extracted = extractBodyContent(plan.html_preview || '');
      setEditBodyHtml(extracted);
      if (visualEditorRef.current) {
        visualEditorRef.current.innerHTML = extracted;
      }
      if ((plan as any).template_theme) {
        setSelectedTheme((plan as any).template_theme);
      }
    }
  }, [currentRun, knowledge]);

  // Sync visual editor HTML content when entering edit mode
  useEffect(() => {
    if (isEditingEmail && visualEditorRef.current) {
      if (visualEditorRef.current.innerHTML !== editBodyHtml) {
        visualEditorRef.current.innerHTML = editBodyHtml;
      }
    }
  }, [isEditingEmail]);

  const loadKnowledge = async () => {
    try {
      setIsLoadingKnowledge(true);
      const [kRes, sRes] = await Promise.all([
        aiMarketingAgentApi.getKnowledge(),
        aiMarketingAgentApi.getServices(),
      ]);
      if (kRes.success) setKnowledge(kRes.data);
      if (sRes.success) setServices(sRes.data);
    } catch (err: any) {
      console.error('Failed to load marketing knowledge:', err);
    } finally {
      setIsLoadingKnowledge(false);
    }
  };

  const loadRuns = async () => {
    try {
      setIsLoadingRuns(true);
      const res = await aiMarketingAgentApi.getRuns({ per_page: 20 });
      if (res.success) {
        setPastRuns(res.data);
        if (!currentRun && res.data.length > 0) {
          const latest = res.data[0];
          if (latest.status === 'awaiting_approval' || latest.status === 'running') {
            setCurrentRun(latest);
          }
        }
      }
    } catch (err: any) {
      console.error('Failed to load past runs:', err);
    } finally {
      setIsLoadingRuns(false);
    }
  };

  const handlePlanCampaign = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const promptToSend = customPrompt || prompt;
    if (!promptToSend.trim()) {
      toast.error('Please enter a marketing instruction.');
      return;
    }

    try {
      setIsPlanning(true);
      setCurrentRun(null);
      setIsEditingEmail(false);
      const res = await aiMarketingAgentApi.planCampaign(promptToSend.trim());
      if (res.success && res.data) {
        setCurrentRun(res.data);
        toast.success(res.message || 'Campaign plan created!');
        loadRuns();
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Failed to process campaign instruction.';
      toast.error(msg);
    } finally {
      setIsPlanning(false);
    }
  };

  // Selection tracking for visual contentEditable
  const saveVisualEditorSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (visualEditorRef.current && visualEditorRef.current.contains(range.commonAncestorContainer)) {
        lastSavedRangeRef.current = range.cloneRange();
        return;
      }
    }
    lastSavedRangeRef.current = null;
  };

  const applyVisualFormat = (command: string, value: string | undefined = undefined) => {
    if (visualEditorRef.current) {
      visualEditorRef.current.focus();

      if (
        (command === 'insertUnorderedList' || command === 'insertOrderedList') &&
        (!visualEditorRef.current.innerHTML || visualEditorRef.current.innerHTML.trim() === '' || visualEditorRef.current.innerHTML.trim() === '<br>')
      ) {
        const tag = command === 'insertUnorderedList' ? 'ul' : 'ol';
        visualEditorRef.current.innerHTML = `<${tag}><li>List item</li></${tag}>`;
        setEditBodyHtml(visualEditorRef.current.innerHTML);
        return;
      }

      document.execCommand(command, false, value);
      setEditBodyHtml(visualEditorRef.current.innerHTML);
    }
  };

  const handleOpenButtonModal = () => {
    saveVisualEditorSelection();
    const currentThemeObj = EMAIL_TEMPLATE_THEMES.find(t => t.id === selectedTheme);
    if (currentThemeObj) {
      setButtonColor(currentThemeObj.buttonBg);
    }
    if (editCtaText) {
      setButtonText(editCtaText);
    }
    if (editCtaUrl) {
      setButtonUrl(editCtaUrl);
    }
    setIsButtonModalOpen(true);
  };

  const handleInsertButtonSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const label = buttonText.trim() || 'Book a Demo';
    const url = buttonUrl.trim() || 'https://';
    const color = buttonColor || '#2563eb';
    const align = buttonAlign || 'left';

    const buttonHtml = `&nbsp;<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: 18px ${align === 'center' ? 'auto' : '0'}; border-collapse: separate; display: inline-table;"><tr><td align="center" bgcolor="${color}" style="border-radius: 8px; background-color: ${color};"><a href="${url}" target="_blank" style="font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: bold; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; display: inline-block; mso-padding-alt: 0; border: 1px solid ${color};">${label} &rarr;</a></td></tr></table>&nbsp;`;

    if (visualEditorRef.current) {
      visualEditorRef.current.focus();
      const sel = window.getSelection();
      let inserted = false;
      if (lastSavedRangeRef.current && sel) {
        try {
          sel.removeAllRanges();
          sel.addRange(lastSavedRangeRef.current);
          document.execCommand('insertHTML', false, buttonHtml);
          inserted = true;
        } catch (err) {
          // fallback
        }
      }
      if (!inserted) {
        visualEditorRef.current.innerHTML += `<p><br/>${buttonHtml}<br/></p>`;
      }
      setEditBodyHtml(visualEditorRef.current.innerHTML);
      toast.success('CTA button added');
    }
    setIsButtonModalOpen(false);
  };

  // Requirement: Variable should be name, business name
  const insertVariableIntoEditor = (variableTag: string, label: string) => {
    if (visualEditorRef.current) {
      visualEditorRef.current.focus();
      const sel = window.getSelection();
      let inserted = false;
      if (lastSavedRangeRef.current && sel) {
        try {
          sel.removeAllRanges();
          sel.addRange(lastSavedRangeRef.current);
          document.execCommand('insertText', false, ` ${variableTag} `);
          inserted = true;
        } catch (err) {
          // fallback
        }
      }
      if (!inserted) {
        document.execCommand('insertText', false, ` ${variableTag} `);
      }
      setEditBodyHtml(visualEditorRef.current.innerHTML);
      toast.success(`Inserted ${label} (${variableTag})`);
    } else {
      setEditBodyHtml(prev => prev + ` ${variableTag} `);
      toast.success(`Inserted ${label} (${variableTag})`);
    }
  };

  // User Save Email Edits
  const handleSaveEmailEdits = async () => {
    if (!currentRun) return;
    try {
      setIsSavingEmailEdits(true);

      const currentContent = visualEditorRef.current ? visualEditorRef.current.innerHTML : editBodyHtml;

      // Re-wrap edited body with the chosen template frame
      const framedHtml = wrapEmailWithTemplate(currentContent, selectedTheme, {
        fromName: editFromName || (currentRun.campaign_plan?.from_name || 'Marketing Team'),
        companyName: knowledge?.company_name || 'Our Company',
        ctaText: editCtaText,
        ctaUrl: editCtaUrl,
        unsubscribeUrl: '#test-unsubscribe'
      });

      const res = await aiMarketingAgentApi.updateRunCampaign(currentRun.id, {
        subject: editSubject.trim(),
        preheader: editPreheader.trim(),
        from_name: editFromName.trim(),
        from_email: currentRun.campaign_plan?.from_email || '',
        cta_text: editCtaText.trim(),
        html_preview: framedHtml,
        text_preview: extractBodyContent(currentContent).replace(/<[^>]*>?/gm, ''),
        template_theme: selectedTheme,
      });

      if (res.success && res.data) {
        setCurrentRun(res.data);
        const updatedBody = extractBodyContent(res.data.campaign_plan?.html_preview || currentContent);
        setEditBodyHtml(updatedBody);
        if (visualEditorRef.current) {
          visualEditorRef.current.innerHTML = updatedBody;
        }
        setIsEditingEmail(false);
        toast.success('Email template & campaign updated successfully!');
        loadRuns();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save email modifications.');
    } finally {
      setIsSavingEmailEdits(false);
    }
  };

  const handleInsertMergeTag = (tag: string) => {
    insertVariableIntoEditor(tag, tag);
  };

  const handleApproveAndSend = async (sendNow: boolean = true) => {
    if (!currentRun) return;
    try {
      setIsApproving(true);
      const res = await aiMarketingAgentApi.approveCampaign(currentRun.id, {
        send_now: sendNow,
        scheduled_at: !sendNow ? scheduleDate : undefined,
      });

      if (res.success && res.data) {
        setCurrentRun(res.data);
        setShowScheduleModal(false);
        toast.success(sendNow ? 'Campaign approved & queued for delivery!' : 'Campaign scheduled successfully!');
        loadRuns();
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Failed to launch campaign.';
      toast.error(msg);
    } finally {
      setIsApproving(false);
    }
  };

  const handleCancelRun = async () => {
    if (!currentRun) return;
    if (!confirm('Are you sure you want to cancel this AI Agent run?')) return;
    try {
      const res = await aiMarketingAgentApi.cancelRun(currentRun.id);
      if (res.success && res.data) {
        setCurrentRun(res.data);
        toast.info('Agent run cancelled.');
        loadRuns();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to cancel run.');
    }
  };

  const handleRunAnalysis = async (runId: number) => {
    try {
      setAnalyzingRunId(runId);
      const res = await aiMarketingAgentApi.analyzeCampaign(runId);
      if (res.success) {
        toast.success('Performance analyzed with AI Engine!');
        loadRuns();
        if (currentRun && currentRun.id === runId) {
          setCurrentRun({
            ...currentRun,
            performance_analysis: res.data,
          });
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Analysis failed.');
    } finally {
      setAnalyzingRunId(null);
    }
  };

  const handleSaveKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!knowledge) return;
    try {
      setIsSavingKnowledge(true);
      const res = await aiMarketingAgentApi.updateKnowledge(knowledge);
      if (res.success) {
        setKnowledge(res.data);
        toast.success('Marketing knowledge and autonomous limits saved!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save settings.');
    } finally {
      setIsSavingKnowledge(false);
    }
  };

  const plan = currentRun?.campaign_plan;

  // Build rendered HTML for the preview
  const activeFramedHtml = wrapEmailWithTemplate(
    isEditingEmail ? editBodyHtml : extractBodyContent(plan?.html_preview || ''),
    selectedTheme,
    {
      fromName: (isEditingEmail ? editFromName : plan?.from_name) || 'Marketing Team',
      companyName: knowledge?.company_name || 'Our Company',
      ctaText: (isEditingEmail ? editCtaText : plan?.cta_text) || 'Book a Demo',
      ctaUrl: editCtaUrl || knowledge?.demo_link || 'https://example.com/demo',
    }
  );

  const finalDisplayHtml = previewMode === 'simulated'
    ? renderPreviewVariables(activeFramedHtml, plan?.sample_eligible?.[0] as any)
    : activeFramedHtml;

  return (
    <div className={cn("space-y-6 max-w-7xl mx-auto pb-12", isRtl && "font-arabic")}>
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30 rounded-2xl flex items-center justify-center shadow-xs shrink-0">
            <Sparkles size={24} strokeWidth={2} className="text-[#166534]" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#12263A] tracking-tight">
                {isRtl ? 'مساعد التسويق بالذكاء الاصطناعي' : 'AI Email Marketing Agent'}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                {isRtl ? 'محرك ذكاء اصطناعي • مسار تسليم موثق ومعتمد' : 'AI Engine • Verified Delivery Pipeline'}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#57534E] max-w-2xl leading-relaxed">
              {isRtl
                ? 'اكتب هدفك التسويقي باللغة الطبيعية. يقوم المساعد الذكي بفحص جمهورك في CRM، واختيار النطاقات الموثقة، وصياغة رسائل B2B مخصصة، ومراجعة ضوابط الأمان، ثم جدولة وإرسال الحملة.'
                : 'Type a marketing objective. The AI agent inspects your CRM audience, selects verified domains, crafts personalized emails, checks safety limits, and delivers campaigns.'}
            </p>
          </div>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-1 bg-stone-100 p-1.5 rounded-2xl border border-stone-200/80 self-start lg:self-center shadow-xs flex-wrap">
          <button
            onClick={() => setActiveTab('console')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'console'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'text-[#57534E] hover:text-[#12263A] hover:bg-stone-200/50'
            }`}
          >
            {isRtl ? 'لوحة تحكم الوكيل' : 'Agent Console'}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'text-[#57534E] hover:text-[#12263A] hover:bg-stone-200/50'
            }`}
          >
            {isRtl ? 'سجل العمليات' : 'Run History'}
          </button>
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'knowledge'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'text-[#57534E] hover:text-[#12263A] hover:bg-stone-200/50'
            }`}
          >
            {isRtl ? 'المعرفة والخدمات' : 'Knowledge & Services'}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'text-[#57534E] hover:text-[#12263A] hover:bg-stone-200/50'
            }`}
          >
            {isRtl ? 'ضوابط الأمان' : 'Safety Limits'}
          </button>
        </div>
      </div>

      {/* TAB 1: AGENT CONSOLE */}
      {activeTab === 'console' && (
        <div className="space-y-6">
          {/* Natural Language Prompt Input */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[#12263A] flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#166534]" />
                {isRtl ? 'ما هي الحملة التسويقية التي ترغب في إنشائها؟' : 'What marketing campaign would you like me to create?'}
              </label>
              <span className="text-xs text-[#57534E]">
                {isRtl ? 'الوضع: ' : 'Mode: '}
                <strong className="text-[#166534] uppercase font-semibold">
                  {knowledge?.approval_mode === 'manual'
                    ? (isRtl ? 'يدوي' : 'Manual')
                    : knowledge?.approval_mode === 'autonomous'
                    ? (isRtl ? 'تلقائي بالكامل' : 'Autonomous')
                    : (isRtl ? 'موافقة' : 'Approval')}
                </strong>
              </span>
            </div>

            <form onSubmit={handlePlanCampaign} className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={isRtl ? 'مثال: أرسل بريداً إلى شركات العقارات حول خدمة الشات بوت بالذكاء الاصطناعي...' : 'Example: Send an email to real estate businesses about our AI chatbot service...'}
                rows={3}
                disabled={isPlanning}
                className={cn(
                  "w-full rounded-xl border border-stone-200 p-4 text-[#12263A] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#166534] text-sm resize-none bg-[#FAFAF9]",
                  isRtl ? "pl-36 pr-4 text-right" : "pr-36 pl-4"
                )}
              />
              <div className={cn("absolute bottom-4 flex items-center gap-2", isRtl ? "left-3" : "right-3")}>
                <button
                  type="submit"
                  disabled={isPlanning || !prompt.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#12263A] hover:bg-[#166534] text-white rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isPlanning ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                      {isRtl ? 'جارٍ التحليل والتخطيط...' : 'Analyzing...'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#22C55E]" />
                      {isRtl ? 'إنشاء الحملة' : 'Create Campaign'}
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Inspiration Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-400 font-medium">{isRtl ? 'جرّب:' : 'Try:'}</span>
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrompt(p);
                    handlePlanCampaign(undefined, p);
                  }}
                  className={cn(
                    "px-3 py-1 bg-[#FAFAF9] hover:bg-[#F0FDF4] hover:text-[#166534] hover:border-[#166534]/30 text-[#57534E] rounded-lg text-xs border border-stone-200/80 transition-colors",
                    isRtl ? "text-right" : "text-left"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Active Plan / Loading State */}
          {isPlanning && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30 animate-pulse">
                <Sparkles className="w-6 h-6 animate-spin text-[#22C55E]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-[#12263A]">
                  {isRtl ? 'محرك الذكاء الاصطناعي قيد المعالجة والتخطيط' : 'AI Agent Orchestrator Running'}
                </h3>
                <p className="text-xs text-[#57534E] max-w-md mx-auto">
                  {isRtl
                    ? 'فهم القصد التسويقي • تصفية فئات CRM • فحص نطاقات الإرسال المعتمدة • صياغة محتوى تسويقي B2B متقدم...'
                    : 'Understanding intent • Filtering CRM categories • Checking sending domain • Generating B2B copy with AI...'}
                </p>
              </div>
            </div>
          )}

          {/* Active AI Campaign Plan or Result */}
          {currentRun && (
            <div className="w-full">
              {currentRun.errors && (
                <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span><strong>{isRtl ? 'خطأ:' : 'Error:'}</strong> {currentRun.errors}</span>
                </div>
              )}

              {/* Structured Campaign Plan & PROPER EMAIL TEMPLATE */}
              {plan && currentRun.status === 'awaiting_approval' ? (
                <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 space-y-6 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30 rounded-md text-xs font-semibold mb-1">
                        <Sparkles className="w-3 h-3 text-[#22C55E]" />
                        {isRtl ? 'خطة الحملة الذكية' : 'AI CAMPAIGN PLAN'}
                      </div>
                      <h2 className="text-lg font-bold text-[#12263A]">{plan.campaign_name}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#57534E]">{isRtl ? 'الحالة:' : 'Status:'}</span>
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
                        {isRtl ? 'جاهز للمراجعة والاعتماد' : 'Ready for Review'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentRun(null);
                          setIsEditingEmail(false);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-1"
                        title={isRtl ? 'إغلاق الخطة' : 'Dismiss Plan'}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[11px] text-slate-400 block">{isRtl ? 'القطاع' : 'Industry'}</span>
                      <span className="text-xs font-semibold text-slate-800">{plan.category}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">{isRtl ? 'الخدمة' : 'Service'}</span>
                      <span className="text-xs font-semibold text-slate-800">{plan.service}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">{isRtl ? 'الهدف' : 'Objective'}</span>
                      <span className="text-xs font-semibold text-slate-800">{plan.objective}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">{isRtl ? 'الموقع' : 'Location'}</span>
                      <span className="text-xs font-semibold text-slate-800">{plan.location}</span>
                    </div>
                  </div>

                  {/* Audience Stats Breakdown */}
                  <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-indigo-600" />
                        {isRtl ? 'تفصيل أهلية واستحقاق الجمهور' : 'Audience Eligibility Breakdown'}
                      </h4>
                      <button
                        onClick={() => setShowAudienceModal(true)}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isRtl ? 'عرض عينة من جهات الاتصال' : 'View Sample Contacts'}</span>
                        {isRtl ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                      <div className="p-2.5 bg-slate-50 rounded-lg">
                        <span className="text-[10px] text-slate-400 block">{isRtl ? 'الإجمالي في الفئة' : 'Total In Category'}</span>
                        <span className="text-sm font-bold text-slate-800">{plan.total_contacts.toLocaleString(isRtl ? 'ar-SA' : 'en-US')}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-lg">
                        <span className="text-[10px] text-slate-400 block">{isRtl ? 'يتوفر بريد إلكتروني' : 'With Email'}</span>
                        <span className="text-sm font-bold text-slate-800">{plan.contacts_with_email.toLocaleString(isRtl ? 'ar-SA' : 'en-US')}</span>
                      </div>
                      <div className="p-2.5 bg-amber-50 rounded-lg text-amber-800">
                        <span className="text-[10px] text-amber-600 block">{isRtl ? 'مستبعد / غير صالح' : 'Suppressed / Invalid'}</span>
                        <span className="text-sm font-bold">{((plan.exclusion_reasons?.suppressed || 0) + (plan.exclusion_reasons?.unsubscribed || 0)).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-lg text-slate-700">
                        <span className="text-[10px] text-slate-400 block">{isRtl ? 'مستبعد بفترة التهدئة' : 'Cooldown Excluded'}</span>
                        <span className="text-sm font-bold">{(plan.exclusion_reasons?.recently_contacted_cooldown || 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}</span>
                      </div>
                      <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-800 border border-emerald-200">
                        <span className="text-[10px] text-emerald-600 block font-semibold">{isRtl ? 'مؤهل للإرسال' : 'Eligible To Send'}</span>
                        <span className="text-base font-extrabold">{plan.eligible_count.toLocaleString(isRtl ? 'ar-SA' : 'en-US')}</span>
                      </div>
                    </div>
                  </div>

                  {/* PROPER EMAIL TEMPLATE PREVIEW & USER EDIT SECTION */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          {isRtl ? 'قالب البريد الإلكتروني المخصص' : 'Personalized Email Template'}
                        </h4>
                      </div>

                      {/* Header controls: Edit Toggle, Preview Mode, Fullscreen */}
                      <div className="flex items-center gap-2">
                        {/* Simulated vs Merge Tags toggle */}
                        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-[11px] font-semibold">
                          <button
                            type="button"
                            onClick={() => setPreviewMode('simulated')}
                            className={`px-2.5 py-1 rounded-md transition-all ${
                              previewMode === 'simulated'
                                ? 'bg-white text-indigo-700 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {isRtl ? 'عرض محاكاة' : 'Simulated View'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewMode('tags')}
                            className={`px-2.5 py-1 rounded-md transition-all ${
                              previewMode === 'tags'
                                ? 'bg-white text-indigo-700 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {isRtl ? 'عرض علامات الدمج' : 'Merge Tags View'}
                          </button>
                        </div>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => setIsEditingEmail(!isEditingEmail)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            isEditingEmail
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          {isEditingEmail 
                            ? (isRtl ? 'إغلاق المحرر' : 'Close Editor') 
                            : (isRtl ? 'تعديل البريد' : 'Edit Email')}
                        </button>

                        {/* Full screen */}
                        <button
                          type="button"
                          onClick={() => setShowEmailPreviewModal(true)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-50 border border-slate-200"
                          title={isRtl ? 'معاينة ملء الشاشة' : 'Full Screen Preview'}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Template Theme Selector Chips */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                        <Palette className="w-3 h-3" /> {isRtl ? 'نمط القالب:' : 'Template Style:'}
                      </span>
                      {EMAIL_TEMPLATE_THEMES.map((theme) => (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => setSelectedTheme(theme.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                            selectedTheme === theme.id
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                              : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          {getThemeLabel(theme.id, theme.name)}
                        </button>
                      ))}
                    </div>

                    {/* EDIT MODE: Visual WYSIWYG Editor */}
                    {isEditingEmail ? (
                      <div className="bg-white border-2 border-indigo-500/30 rounded-2xl p-5 shadow-xl space-y-5">
                        {/* Editor Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                          <div>
                            <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <Edit3 className="w-4 h-4 text-indigo-600" />
                              {isRtl ? 'محرر البريد المرئي ومخصص القالب' : 'Visual Email Editor & Template Customizer'}
                            </span>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {isRtl 
                                ? 'انقر مباشرة داخل نص البريد الإلكتروني أدناه للكتابة والتنسيق بصرياً. استخدم متغيرات الاسم واسم الشركة للتخصيص.' 
                                : 'Click directly in the email body below to write and format visually. Use Name and Business Name variables to personalize.'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setIsEditingEmail(false)}
                              className="px-3.5 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold"
                            >
                              {isRtl ? 'إلغاء' : 'Cancel'}
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveEmailEdits}
                              disabled={isSavingEmailEdits}
                              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/20"
                            >
                              <Save className="w-3.5 h-3.5" />
                              {isSavingEmailEdits 
                                ? (isRtl ? 'جارٍ الحفظ...' : 'Saving...') 
                                : (isRtl ? 'حفظ وتحديث الحملة' : 'Save & Update Campaign')}
                            </button>
                          </div>
                        </div>

                        {/* Metadata Fields: Subject, Preheader, From Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs font-semibold text-slate-700">
                                {isRtl ? 'سطر الموضوع' : 'Subject Line'}
                              </label>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => setEditSubject(prev => prev + ' {{name}}')}
                                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold px-1 rounded hover:bg-indigo-50"
                                  title={isRtl ? 'إضافة {{name}} إلى الموضوع' : 'Add {{name}} to subject'}
                                >
                                  {isRtl ? '+ الاسم' : '+ Name'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditSubject(prev => prev + ' {{business_name}}')}
                                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold px-1 rounded hover:bg-indigo-50"
                                  title={isRtl ? 'إضافة {{business_name}} إلى الموضوع' : 'Add {{business_name}} to subject'}
                                >
                                  {isRtl ? '+ الشركة' : '+ Business'}
                                </button>
                              </div>
                            </div>
                            <input
                              type="text"
                              value={editSubject}
                              onChange={(e) => setEditSubject(e.target.value)}
                              placeholder={isRtl ? 'مثال: استفسار سريع بخصوص {{business_name}}' : 'e.g. Quick question regarding {{business_name}}'}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 text-xs focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              {isRtl ? 'نص المعاينة (Preheader)' : 'Preheader Text'}
                            </label>
                            <input
                              type="text"
                              value={editPreheader}
                              onChange={(e) => setEditPreheader(e.target.value)}
                              placeholder={isRtl ? 'مقتطف المعاينة في صندوق وارد المستلم...' : "Preview snippet in recipient's inbox..."}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 text-xs focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              {isRtl ? 'اسم المرسل' : 'Sender From Name'}
                            </label>
                            <input
                              type="text"
                              value={editFromName}
                              onChange={(e) => setEditFromName(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 text-xs focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                        </div>

                        {/* VISUAL FORMATTING & MERGE VARIABLE TOOLBAR */}
                        <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl flex flex-wrap items-center gap-2">
                          {/* HERO MERGE VARIABLES */}
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
                            <Tag className="w-3 h-3 text-indigo-600" /> {isRtl ? 'إدراج متغير:' : 'Insert Variable:'}
                          </span>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => insertVariableIntoEditor('{{name}}', 'Name')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
                            title={isRtl ? 'إدراج اسم جهة الاتصال الشخصي' : "Insert contact's personal name"}
                          >
                            <User className="w-3.5 h-3.5" />
                            <span>{isRtl ? 'الاسم' : 'Name'}</span>
                            <code className="text-[10px] bg-white/20 px-1 py-0.5 rounded font-mono font-normal">{"{{name}}"}</code>
                          </button>

                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => insertVariableIntoEditor('{{business_name}}', 'Business Name')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
                            title={isRtl ? 'إدراج اسم شركة المستلم' : "Insert recipient's business / company name"}
                          >
                            <Building className="w-3.5 h-3.5" />
                            <span>{isRtl ? 'اسم الشركة' : 'Business Name'}</span>
                            <code className="text-[10px] bg-white/20 px-1 py-0.5 rounded font-mono font-normal">{"{{business_name}}"}</code>
                          </button>
                          <div className="h-5 w-px bg-slate-300 mx-1 hidden sm:block" />

                          {/* Formatting Tools */}
                          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                            <button
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => applyVisualFormat('bold')}
                              className="p-1.5 rounded hover:bg-slate-100 text-slate-700"
                              title={isRtl ? 'عريض' : 'Bold'}
                            >
                              <Bold size={14} />
                            </button>
                            <button
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => applyVisualFormat('italic')}
                              className="p-1.5 rounded hover:bg-slate-100 text-slate-700"
                              title={isRtl ? 'مائل' : 'Italic'}
                            >
                              <Italic size={14} />
                            </button>
                            <button
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => applyVisualFormat('underline')}
                              className="p-1.5 rounded hover:bg-slate-100 text-slate-700"
                              title={isRtl ? 'تسطير' : 'Underline'}
                            >
                              <Underline size={14} />
                            </button>

                            <div className="h-4 w-px bg-slate-200 mx-0.5" />

                            <button
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => applyVisualFormat('insertUnorderedList')}
                              className="p-1.5 rounded hover:bg-slate-100 text-slate-700"
                              title={isRtl ? 'قائمة نقطية' : 'Bullet List'}
                            >
                              <List size={14} />
                            </button>
                            <button
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => applyVisualFormat('insertOrderedList')}
                              className="p-1.5 rounded hover:bg-slate-100 text-slate-700"
                              title={isRtl ? 'قائمة مرقمة' : 'Numbered List'}
                            >
                              <ListOrdered size={14} />
                            </button>

                            <div className="h-4 w-px bg-slate-200 mx-0.5" />

                            <button
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => applyVisualFormat('justifyLeft')}
                              className="p-1.5 rounded hover:bg-slate-100 text-slate-700"
                              title={isRtl ? 'محاذاة لليسار' : 'Align Left'}
                            >
                              <AlignLeft size={14} />
                            </button>
                            <button
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => applyVisualFormat('justifyCenter')}
                              className="p-1.5 rounded hover:bg-slate-100 text-slate-700"
                              title={isRtl ? 'محاذاة للوسط' : 'Align Center'}
                            >
                              <AlignCenter size={14} />
                            </button>
                            <button
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => applyVisualFormat('justifyRight')}
                              className="p-1.5 rounded hover:bg-slate-100 text-slate-700"
                              title={isRtl ? 'محاذاة لليمين' : 'Align Right'}
                            >
                              <AlignRight size={14} />
                            </button>
                          </div>

                          <div className="h-5 w-px bg-slate-300 mx-1 hidden sm:block" />

                          {/* Button CTA Action */}
                          <button
                            type="button"
                            onMouseDown={() => saveVisualEditorSelection()}
                            onClick={handleOpenButtonModal}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
                          >
                            <MousePointerClick size={14} className="text-indigo-600" />
                            <span>{isRtl ? '+ إضافة زر إجراء (CTA)' : '+ Add CTA Button'}</span>
                          </button>
                        </div>

                        {/* WYSIWYG CANVAS: Real Template Frame with Locked Header & Footer */}
                        <div className="p-6 rounded-2xl bg-slate-100 flex justify-center">
                          <div className="w-full max-w-[600px] bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
                            {/* Scoped CSS for rich text inside visual canvas */}
                            <style>{`
                              .email-visual-canvas p { margin: 0 0 16px 0; }
                              .email-visual-canvas ul { list-style-type: disc; padding-left: 24px; margin: 12px 0; }
                              .email-visual-canvas ol { list-style-type: decimal; padding-left: 24px; margin: 12px 0; }
                              .email-visual-canvas a { color: #2563eb; text-decoration: underline; }
                              .email-visual-canvas table { margin: 16px 0; }
                              .email-visual-canvas:focus { outline: none; }
                            `}</style>

                            {/* Locked Header */}
                            <div className="relative group select-none">
                              <div dangerouslySetInnerHTML={{ __html: renderThemeHeader(selectedTheme, knowledge?.company_name || 'Our Company') }} />
                              <div className={cn(
                                "absolute top-2 bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1",
                                isRtl ? "left-2" : "right-2"
                              )}>
                                <Lock size={10} />
                                {isRtl ? 'رأس القالب المحمي' : 'Locked Template Header'}
                              </div>
                            </div>

                            {/* VISUAL EDITABLE BODY CANVAS */}
                            <div className="p-8 bg-white">
                              <div
                                ref={visualEditorRef}
                                contentEditable
                                suppressContentEditableWarning
                                onInput={() => {
                                  if (visualEditorRef.current) {
                                    setEditBodyHtml(visualEditorRef.current.innerHTML);
                                  }
                                }}
                                onBlur={saveVisualEditorSelection}
                                onKeyUp={saveVisualEditorSelection}
                                onMouseUp={saveVisualEditorSelection}
                                className="email-visual-canvas min-h-[260px] text-slate-800 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded p-1"
                                style={{
                                  lineHeight: '1.7',
                                  color: '#1e293b',
                                  fontSize: '14px',
                                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
                                }}
                              />
                            </div>

                            {/* Locked Footer */}
                            <div className="relative group select-none">
                              <div dangerouslySetInnerHTML={{ __html: renderThemeFooter(selectedTheme, knowledge?.company_name || 'Our Company', editFromName || plan.from_name, '#unsubscribe') }} />
                              <div className={cn(
                                "absolute bottom-2 bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1",
                                isRtl ? "left-2" : "right-2"
                              )}>
                                <Lock size={10} />
                                {isRtl ? 'تذييل الامتثال المحمي' : 'Locked Compliance Footer'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Save & Cancel Bar */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs text-slate-400">
                            {isRtl 
                              ? 'سيتم تطبيق تعديلات القالب على جميع المستلمين فور الموافقة.' 
                              : 'Template edits will be rendered for all recipients upon approval.'}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setIsEditingEmail(false)}
                              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold"
                            >
                              {isRtl ? 'إلغاء' : 'Cancel'}
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveEmailEdits}
                              disabled={isSavingEmailEdits}
                              className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/20"
                            >
                              <Save className="w-3.5 h-3.5" />
                              {isSavingEmailEdits 
                                ? (isRtl ? 'جارٍ حفظ التغييرات...' : 'Saving Changes...') 
                                : (isRtl ? 'حفظ وتحديث الحملة' : 'Save & Update Campaign')}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* PROPER EMAIL CLIENT PREVIEW CARD (when not editing) */
                      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-slate-100">
                        {/* Email Client Window Chrome */}
                        <div className="bg-slate-800 text-white px-4 py-3 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                            </div>
                            <span className="text-slate-300 font-mono text-[11px] truncate max-w-sm">
                              {isRtl ? 'الموضوع:' : 'Subject:'} {isEditingEmail ? editSubject : plan.subject}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <Lock className="w-3 h-3 text-emerald-400" />
                            <span>{isRtl ? 'TLS 1.3 • تم التحقق من SPF/DKIM' : 'TLS 1.3 • SPF/DKIM Verified'}</span>
                          </div>
                        </div>

                        {/* Client Envelope Meta */}
                        <div className="bg-white px-6 py-3 border-b border-slate-200 text-xs space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 w-14 shrink-0">{isRtl ? 'من:' : 'From:'}</span>
                            <span className="font-semibold text-slate-800">
                              {isEditingEmail ? editFromName : plan.from_name} &lt;{plan.from_email}&gt;
                            </span>
                            <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 rounded text-[10px] font-semibold border border-emerald-200">
                              {isRtl ? 'نطاق إرسال موثوق' : 'Verified Sending Domain'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 w-14 shrink-0">{isRtl ? 'إلى:' : 'To:'}</span>
                            <span className="text-slate-600">
                              {previewMode === 'simulated' ? 'Sarah Sterling <prospect.realestate@brickandmortar.pk>' : '{{name}} <{{email}}>'}
                            </span>
                          </div>
                        </div>

                        {/* Rendered HTML Container */}
                        <div className="p-4 sm:p-6 overflow-x-auto bg-slate-100 flex justify-center">
                          <div 
                            className="w-full max-w-[600px] bg-white rounded-xl shadow-md overflow-hidden"
                            dangerouslySetInnerHTML={{ __html: finalDisplayHtml }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons (Requirement 16 & 17) */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={handleCancelRun}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition-colors"
                    >
                      {isRtl ? 'إلغاء التشغيل' : 'Cancel Run'}
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowScheduleModal(true)}
                        disabled={isApproving}
                        className="inline-flex items-center gap-1.5 px-4 py-2 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        {isRtl ? 'جدولة لاحقاً' : 'Schedule Later'}
                      </button>

                      <button
                        onClick={() => handleApproveAndSend(true)}
                        disabled={isApproving}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                      >
                        {isApproving ? (
                          <>
                            <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                            {isRtl ? 'جارٍ الإرسال...' : 'Dispatching...'}
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            {isRtl 
                              ? `الموافقة والإرسال الآن (${plan.eligible_count.toLocaleString('ar-SA')})` 
                              : `Approve & Send Now (${plan.eligible_count.toLocaleString('en-US')})`}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : currentRun.status === 'completed' || currentRun.status === 'running' ? (
                <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 p-8 space-y-6 w-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5 max-w-md">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold uppercase tracking-wider">
                      {currentRun.status === 'running' 
                        ? (isRtl ? 'جارٍ إرسال الحملة' : 'Campaign Dispatching') 
                        : (isRtl ? 'تم إرسال الحملة' : 'Campaign Dispatched')}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">
                      {currentRun.campaign_name || (isRtl ? 'تم إرسال الحملة بنجاح' : 'Campaign Dispatched Successfully')}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isRtl 
                        ? 'تمت الموافقة على حملتك وإدراجها في قائمة انتظار التسليم. تم إغلاق عرض الخطة. يمكنك متابعة مؤشرات الأداء في سجل التشغيل.' 
                        : 'Your campaign has been approved and queued for delivery. The plan view has been closed. You can track performance metrics in the Run History tab.'}
                    </p>
                  </div>

                  {currentRun.campaign_plan && (
                    <div className={cn("grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-md", isRtl ? "text-right" : "text-left")}>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">{isRtl ? 'المستلمون' : 'Recipients'}</span>
                        <span className="text-sm font-bold text-slate-800">{currentRun.campaign_plan.eligible_count.toLocaleString(isRtl ? 'ar-SA' : 'en-US')}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">{isRtl ? 'الفئة' : 'Category'}</span>
                        <span className="text-sm font-bold text-slate-800">{currentRun.campaign_plan.category}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-slate-400 block">{isRtl ? 'محرك التسليم' : 'Delivery Engine'}</span>
                        <span className="text-sm font-bold text-emerald-600">{isRtl ? 'مسار تسليم موثوق' : 'Verified Pipeline'}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setActiveTab('history')}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                    >
                      {isRtl ? 'عرض في سجل التشغيل' : 'View in Run History'}
                    </button>
                    <button
                      onClick={() => {
                        setCurrentRun(null);
                        setPrompt('');
                        setIsEditingEmail(false);
                      }}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {isRtl ? 'إنشاء حملة أخرى' : 'Create Another Campaign'}
                    </button>
                  </div>
                </div>
              ) : currentRun.status === 'scheduled' ? (
                <div className="bg-white rounded-2xl shadow-sm border border-indigo-200 p-8 space-y-6 w-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5 max-w-md">
                    <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold uppercase tracking-wider">
                      {isRtl ? 'تمت جدولة الحملة' : 'Campaign Scheduled'}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">
                      {currentRun.campaign_name || (isRtl ? 'تمت جدولة الحملة' : 'Campaign Scheduled')}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isRtl 
                        ? `تم إغلاق عرض الخطة. سيتم إرسال هذه الحملة تلقائياً في ${currentRun.campaign_plan?.scheduled_at || scheduleDate || 'الموعد المحدد'}.`
                        : `The plan view is now closed. This campaign will automatically be dispatched on ${currentRun.campaign_plan?.scheduled_at || scheduleDate || 'the scheduled date'}.`}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setActiveTab('history')}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                    >
                      {isRtl ? 'عرض في سجل التشغيل' : 'View in Run History'}
                    </button>
                    <button
                      onClick={() => {
                        setCurrentRun(null);
                        setPrompt('');
                        setIsEditingEmail(false);
                      }}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {isRtl ? 'إنشاء حملة أخرى' : 'Create Another Campaign'}
                    </button>
                  </div>
                </div>
              ) : currentRun.status === 'cancelled' ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6 w-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm">
                    <XCircle className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5 max-w-md">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                      {isRtl ? 'تم إلغاء التشغيل' : 'Run Cancelled'}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">
                      {isRtl ? 'تم إلغاء خطة الحملة' : 'Campaign Plan Cancelled'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isRtl 
                        ? 'تم إلغاء خطة الحملة وإغلاقها. لم يتم إرسال أي رسائل بريد إلكتروني.' 
                        : 'The campaign plan has been cancelled and closed. No emails were sent.'}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setCurrentRun(null);
                        setPrompt('');
                        setIsEditingEmail(false);
                      }}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {isRtl ? 'بدء حملة جديدة' : 'Start New Campaign'}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AUDIT RUN HISTORY & POST-CAMPAIGN ANALYSIS */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isRtl ? 'سجل تشغيل حملات مساعد الذكاء الاصطناعي' : 'AI Agent Campaign Run History'}
              </h2>
              <p className="text-xs text-slate-500">
                {isRtl 
                  ? 'سجلات تنفيذ قابلة للتدقيق لجميع الطلبات الطبيعية والخطط وعمليات التسليم.' 
                  : 'Auditable execution records of all natural-language requests, plans, and deliveries.'}
              </p>
            </div>
            <button
              onClick={loadRuns}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" /> {isRtl ? 'تحديث' : 'Refresh'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className={cn("w-full text-xs", isRtl ? "text-right" : "text-left")}>
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">{isRtl ? 'معرف التشغيل' : 'Run ID'}</th>
                  <th className="py-3 px-4">{isRtl ? 'الطلب / التعليمات' : 'Instruction'}</th>
                  <th className="py-3 px-4">{isRtl ? 'الفئة / الخدمة' : 'Category / Service'}</th>
                  <th className="py-3 px-4">{isRtl ? 'المستلمون المؤهلون' : 'Eligible Recipients'}</th>
                  <th className="py-3 px-4">{isRtl ? 'الحالة' : 'Status'}</th>
                  <th className="py-3 px-4">{isRtl ? 'نتائج التسليم' : 'Delivery Results'}</th>
                  <th className={cn("py-3 px-4", isRtl ? "text-left" : "text-right")}>{isRtl ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pastRuns.map((r) => {
                  const camp = r.campaign;
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-500">#{r.id}</td>
                      <td className="py-3 px-4 font-medium text-slate-800 max-w-xs truncate">
                        {r.user_request}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {r.interpreted_intent?.category || '—'} / {r.interpreted_intent?.service || '—'}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {(r.recipients_selected || 0).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full font-semibold text-[10px] uppercase ${
                          r.status === 'awaiting_approval' ? 'bg-amber-100 text-amber-800' :
                          r.status === 'running' ? 'bg-blue-100 text-blue-800' :
                          r.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                          r.status === 'failed' ? 'bg-rose-100 text-rose-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {getStatusBadge(r.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {camp ? (
                          <div className="space-y-0.5 text-[11px]">
                            <span>
                              {isRtl 
                                ? `أُرسلت: ${camp.sent_count.toLocaleString('ar-SA')} | سُلّمت: ${camp.delivered_count.toLocaleString('ar-SA')}` 
                                : `Sent: ${camp.sent_count.toLocaleString('en-US')} | Delivered: ${camp.delivered_count.toLocaleString('en-US')}`}
                            </span>
                            {camp.bounced_count > 0 && (
                              <span className="text-rose-600 block">
                                {isRtl 
                                  ? `مرتدة: ${camp.bounced_count.toLocaleString('ar-SA')}` 
                                  : `Bounced: ${camp.bounced_count.toLocaleString('en-US')}`}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className={cn("py-3 px-4 space-x-2", isRtl ? "text-left space-x-reverse" : "text-right")}>
                        <button
                          onClick={() => {
                            setCurrentRun(r);
                            setActiveTab('console');
                          }}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded font-semibold"
                        >
                          {isRtl ? 'عرض الخطة' : 'View Plan'}
                        </button>

                        {camp && (
                          <button
                            onClick={() => {
                              setSelectedRunForAnalysis(r);
                              handleRunAnalysis(r.id);
                            }}
                            disabled={analyzingRunId === r.id}
                            className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded font-semibold inline-flex items-center gap-1"
                          >
                            <TrendingUp className="w-3 h-3" />
                            {analyzingRunId === r.id 
                              ? (isRtl ? 'جارٍ التحليل...' : 'Analyzing...') 
                              : (isRtl ? 'رؤى الذكاء الاصطناعي' : 'AI Insights')}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Post-Campaign AI Analysis Modal/Card */}
          {selectedRunForAnalysis?.performance_analysis && (
            <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-purple-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  {isRtl 
                    ? `تحليل أداء الحملة بالذكاء الاصطناعي (تشغيل #${selectedRunForAnalysis.id})` 
                    : `AI Post-Campaign Performance Analysis (Run #${selectedRunForAnalysis.id})`}
                </h3>
                <button
                  onClick={() => setSelectedRunForAnalysis(null)}
                  className="text-xs text-purple-600 hover:text-purple-800 font-semibold"
                >
                  {isRtl ? 'إغلاق' : 'Close'}
                </button>
              </div>

              {/* Rates */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 bg-white rounded-xl shadow-xs">
                  <span className="text-[10px] text-slate-400 block">{isRtl ? 'معدل التسليم' : 'Delivery Rate'}</span>
                  <span className="text-base font-bold text-slate-800">
                    {selectedRunForAnalysis.performance_analysis.metrics.delivery_rate}%
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl shadow-xs">
                  <span className="text-[10px] text-slate-400 block">{isRtl ? 'معدل الارتداد' : 'Bounce Rate'}</span>
                  <span className="text-base font-bold text-slate-800">
                    {selectedRunForAnalysis.performance_analysis.metrics.bounce_rate}%
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl shadow-xs">
                  <span className="text-[10px] text-slate-400 block">{isRtl ? 'معدل الفتح' : 'Open Rate'}</span>
                  <span className="text-base font-bold text-slate-800">
                    {selectedRunForAnalysis.performance_analysis.metrics.open_rate}%
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl shadow-xs">
                  <span className="text-[10px] text-slate-400 block">{isRtl ? 'معدل النقر' : 'Click Rate'}</span>
                  <span className="text-base font-bold text-slate-800">
                    {selectedRunForAnalysis.performance_analysis.metrics.click_rate}%
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl shadow-xs">
                  <span className="text-[10px] text-slate-400 block">{isRtl ? 'معدل إلغاء الاشتراك' : 'Unsubscribe Rate'}</span>
                  <span className="text-base font-bold text-slate-800">
                    {selectedRunForAnalysis.performance_analysis.metrics.unsubscribe_rate}%
                  </span>
                </div>
              </div>

              {/* DeepSeek Insights */}
              <div className="space-y-3 text-xs bg-white p-5 rounded-xl border border-purple-100">
                <p className="text-slate-800 font-semibold">
                  {selectedRunForAnalysis.performance_analysis.ai_insights.summary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <h5 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                      {isRtl ? 'الدروس المستفادة الرئيسية' : 'Key Learnings'}
                    </h5>
                    <ul className={cn("space-y-1 text-slate-600", isRtl ? "list-disc pr-4" : "list-disc pl-4")}>
                      {selectedRunForAnalysis.performance_analysis.ai_insights.key_learnings?.map((l: string, i: number) => (
                        <li key={i}>{l}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                      {isRtl ? 'التعديلات الموصى بها' : 'Recommended Changes'}
                    </h5>
                    <ul className={cn("space-y-1 text-slate-600", isRtl ? "list-disc pr-4" : "list-disc pl-4")}>
                      {selectedRunForAnalysis.performance_analysis.ai_insights.recommended_changes?.map((c: string, i: number) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Follow up prompt generator */}
                {selectedRunForAnalysis.performance_analysis.ai_insights.follow_up_recommendation?.recommended && (
                  <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-800 uppercase block">
                        {isRtl ? 'فرصة المتابعة' : 'Follow-Up Opportunity'}
                      </span>
                      <span className="text-indigo-900">
                        {selectedRunForAnalysis.performance_analysis.ai_insights.follow_up_recommendation.suggested_angle}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const rec = selectedRunForAnalysis.performance_analysis?.ai_insights.follow_up_recommendation;
                        const p = isRtl
                          ? `أرسل رسالة متابعة لجهات الاتصال التي استلمت حملة ${selectedRunForAnalysis.interpreted_intent?.category || ''} باستخدام الزاوية: ${rec?.suggested_angle}`
                          : `Follow up with contacts who received our ${selectedRunForAnalysis.interpreted_intent?.category} campaign using angle: ${rec?.suggested_angle}`;
                        setPrompt(p);
                        setActiveTab('console');
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-semibold shrink-0"
                    >
                      {isRtl ? 'صياغة المتابعة' : 'Draft Follow-Up'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MARKETING KNOWLEDGE & SERVICES */}
      {activeTab === 'knowledge' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Services Catalog */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                {isRtl ? 'دليل الخدمات النشطة' : 'Active Services Catalog'}
              </h3>
              <span className="text-xs text-slate-400">
                {isRtl ? `${services.length} خدمة` : `${services.length} Services`}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              {isRtl 
                ? 'يرجع مساعد التسويق بالذكاء الاصطناعي إلى هذه الخدمات لتجنب اختلاق ميزات أو أسعار وهمية أو ادعاءات غير دقيقة.' 
                : 'The AI Marketing Agent references these services to avoid inventing features, fake pricing, or false claims.'}
            </p>

            <div className="space-y-3">
              {services.map((svc) => (
                <div key={svc.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{svc.name}</span>
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded text-[10px] font-semibold">
                      {svc.cta_text}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] line-clamp-2">{svc.description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {svc.target_industries?.map((ind, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-600">
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company Knowledge Editor */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                {isRtl ? 'قاعدة المعرفة التسويقية للشركة' : 'Company Marketing Knowledge Base'}
              </h2>
              <p className="text-xs text-slate-500">
                {isRtl 
                  ? 'توجيه مساعد الذكاء الاصطناعي بنبرة علامتك التجارية الحقيقية وروابطها وقيمتها المقترحة.' 
                  : 'Ground the AI agent in your authentic brand voice, links, and value propositions.'}
              </p>
            </div>

            {knowledge && (
              <form onSubmit={handleSaveKnowledge} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      {isRtl ? 'اسم الشركة / العلامة التجارية' : 'Company / Brand Name'}
                    </label>
                    <input
                      type="text"
                      value={knowledge.company_name || ''}
                      onChange={(e) => setKnowledge({ ...knowledge, company_name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      {isRtl ? 'نبرة العلامة التجارية' : 'Brand Voice'}
                    </label>
                    <input
                      type="text"
                      value={knowledge.brand_voice || ''}
                      onChange={(e) => setKnowledge({ ...knowledge, brand_voice: e.target.value })}
                      placeholder={isRtl ? 'مثال: استشارية، موثوقة، موجهة نحو النتائج' : 'e.g. Consultative, authoritative, outcome-oriented'}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {isRtl ? 'وصف الشركة' : 'Company Description'}
                  </label>
                  <textarea
                    rows={2}
                    value={knowledge.company_description || ''}
                    onChange={(e) => setKnowledge({ ...knowledge, company_description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      {isRtl ? 'رابط الموقع الإلكتروني' : 'Website URL'}
                    </label>
                    <input
                      type="url"
                      value={knowledge.website || ''}
                      onChange={(e) => setKnowledge({ ...knowledge, website: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      {isRtl ? 'رابط العرض التوضيحي / الحجز' : 'Demo / Booking Link'}
                    </label>
                    <input
                      type="url"
                      value={knowledge.demo_link || ''}
                      onChange={(e) => setKnowledge({ ...knowledge, demo_link: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      {isRtl ? 'بريد استلام الاستفسارات' : 'Inquiry Reply Email'}
                    </label>
                    <input
                      type="email"
                      value={knowledge.contact_email || ''}
                      onChange={(e) => setKnowledge({ ...knowledge, contact_email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {isRtl ? 'نظرة عامة على الأسعار / القواعد' : 'Pricing Overview / Rules'}
                  </label>
                  <textarea
                    rows={2}
                    value={knowledge.pricing_overview || ''}
                    onChange={(e) => setKnowledge({ ...knowledge, pricing_overview: e.target.value })}
                    placeholder={isRtl ? 'مثال: باقة النمو تبدأ من 199 دولار/شهر؛ عروض مخصصة للمؤسسات.' : 'e.g. Growth tier starts at $199/mo; custom quotes for enterprise.'}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs resize-none"
                  />
                </div>

                <div className={cn("flex pt-2", isRtl ? "justify-start" : "justify-end")}>
                  <button
                    type="submit"
                    disabled={isSavingKnowledge}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs transition-colors"
                  >
                    {isSavingKnowledge 
                      ? (isRtl ? 'جارٍ الحفظ...' : 'Saving...') 
                      : (isRtl ? 'حفظ قاعدة المعرفة' : 'Save Knowledge Base')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: AUTONOMOUS SAFETY LIMITS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 max-w-3xl">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {isRtl ? 'الوضع الذاتي وحدود الأمان' : 'Autonomous Mode & Safety Limits'}
            </h2>
            <p className="text-xs text-slate-500">
              {isRtl 
                ? 'التحكم في استقلالية إرسال حملات الذكاء الاصطناعي، وحماية منع التكرار، وضوابط المستلمين اليومية.' 
                : 'Control AI campaign sending autonomy, duplicate send protections, and daily recipient safeguards.'}
            </p>
          </div>

          {knowledge && (
            <form onSubmit={handleSaveKnowledge} className="space-y-6 text-xs">
              {/* Approval Modes */}
              <div className="space-y-3">
                <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  {isRtl ? 'وضع الموافقة' : 'Approval Mode'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    knowledge.approval_mode === 'manual'
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="approval_mode"
                      value="manual"
                      checked={knowledge.approval_mode === 'manual'}
                      onChange={() => setKnowledge({ ...knowledge, approval_mode: 'manual' })}
                      className="sr-only"
                    />
                    <div className="font-bold text-slate-800 mb-1">
                      {isRtl ? 'الوضع 1: يدوي' : 'MODE 1: MANUAL'}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {isRtl 
                        ? 'يقوم الذكاء الاصطناعي بصياغة مسودة الحملة. يجب عليك المراجعة والضغط على إرسال يدوياً في كل مرة.' 
                        : 'AI crafts campaign draft. You must manually review and hit send every time.'}
                    </p>
                  </label>

                  <label className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    knowledge.approval_mode === 'approval'
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="approval_mode"
                      value="approval"
                      checked={knowledge.approval_mode === 'approval'}
                      onChange={() => setKnowledge({ ...knowledge, approval_mode: 'approval' })}
                      className="sr-only"
                    />
                    <div className="font-bold text-slate-800 mb-1">
                      {isRtl ? 'الوضع 2: بالموافقة (افتراضي)' : 'MODE 2: APPROVAL (Default)'}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {isRtl 
                        ? 'يقوم الذكاء الاصطناعي بتخطيط الحملة والتحقق منها. ينتظر موافقة بشرية بنقرة واحدة قبل الإرسال.' 
                        : 'AI plans and validates campaign. Awaits one-click human approval before dispatch.'}
                    </p>
                  </label>

                  <label className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    knowledge.approval_mode === 'autonomous'
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="approval_mode"
                      value="autonomous"
                      checked={knowledge.approval_mode === 'autonomous'}
                      onChange={() => setKnowledge({ ...knowledge, approval_mode: 'autonomous' })}
                      className="sr-only"
                    />
                    <div className="font-bold text-slate-800 mb-1">
                      {isRtl ? 'الوضع 3: تلقائي بالكامل' : 'MODE 3: AUTONOMOUS'}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {isRtl 
                        ? 'يقوم الذكاء الاصطناعي بالتخطيط والتوليد والتحقق والإرسال تلقائياً إذا كانت ضمن حدود الأمان.' 
                        : 'AI plans, generates, validates, and automatically dispatches if within safety limits.'}
                    </p>
                  </label>
                </div>
              </div>

              {/* Safety Caps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {isRtl ? 'الحد الأقصى للرسائل لكل حملة' : 'Max Emails Per Campaign'}
                  </label>
                  <input
                    type="number"
                    value={knowledge.max_emails_per_campaign}
                    onChange={(e) => setKnowledge({ ...knowledge, max_emails_per_campaign: parseInt(e.target.value) || 500 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                  <span className="text-[10px] text-slate-400">
                    {isRtl ? 'إيقاف إلزامي إذا تجاوز حجم الجمهور هذا الحد.' : 'Hard stop cap if audience exceeds this size.'}
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {isRtl ? 'الحد الأقصى للرسائل يومياً' : 'Max Emails Per Day'}
                  </label>
                  <input
                    type="number"
                    value={knowledge.max_emails_per_day}
                    onChange={(e) => setKnowledge({ ...knowledge, max_emails_per_day: parseInt(e.target.value) || 1000 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {isRtl ? 'طلب موافقة إذا تجاوز المستلمون هذا الرقم' : 'Require Approval Above X Recipients'}
                  </label>
                  <input
                    type="number"
                    value={knowledge.require_approval_above_recipients}
                    onChange={(e) => setKnowledge({ ...knowledge, require_approval_above_recipients: parseInt(e.target.value) || 250 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                  <span className="text-[10px] text-slate-400">
                    {isRtl 
                      ? 'حتى في الوضع التلقائي، ستفرض الموافقة البشرية إذا تم تجاوز هذا العدد.' 
                      : 'Even in autonomous mode, human approval will be forced above this.'}
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {isRtl ? 'فترة التهدئة للجهات الاتصال (بالأيام)' : 'Contact Cooldown Period (Days)'}
                  </label>
                  <input
                    type="number"
                    value={knowledge.cooldown_days_per_contact}
                    onChange={(e) => setKnowledge({ ...knowledge, cooldown_days_per_contact: parseInt(e.target.value) || 7 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                  <span className="text-[10px] text-slate-400">
                    {isRtl 
                      ? 'يمنع مراسلة نفس العميل المحتمل بشكل متكرر خلال عدد الأيام المحدد.' 
                      : 'Prevents contacting the same lead repeatedly within X days.'}
                  </span>
                </div>
              </div>

              <div className={cn("flex pt-4 border-t border-slate-100", isRtl ? "justify-start" : "justify-end")}>
                <button
                  type="submit"
                  disabled={isSavingKnowledge}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs transition-colors"
                >
                  {isSavingKnowledge 
                    ? (isRtl ? 'جارٍ الحفظ...' : 'Saving...') 
                    : (isRtl ? 'حفظ حدود الأمان' : 'Save Safety Limits')}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* MODAL 1: FULL SCREEN EMAIL PREVIEW & EDITOR */}
      {showEmailPreviewModal && plan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 space-y-4 max-h-[92vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {isRtl ? 'معاينة قالب حملة البريد الإلكتروني' : 'Email Campaign Template Preview'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingEmail(!isEditingEmail)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  {isEditingEmail 
                    ? (isRtl ? 'إغلاق المحرر' : 'Close Editor') 
                    : (isRtl ? 'تعديل البريد' : 'Edit Email')}
                </button>
                <button
                  onClick={() => setShowEmailPreviewModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  {isRtl ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-100 rounded-xl flex justify-center">
              <div 
                className="w-full max-w-[620px] bg-white rounded-xl shadow-md overflow-hidden"
                dangerouslySetInnerHTML={{ __html: finalDisplayHtml }}
              />
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <div className="text-xs text-slate-400">
                {isRtl ? 'نمط القالب:' : 'Template Theme:'}{' '}
                <strong className="text-slate-700 capitalize">
                  {getThemeLabel(selectedTheme, selectedTheme)}
                </strong>
              </div>
              <button
                onClick={() => setShowEmailPreviewModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                {isRtl ? 'إغلاق المعاينة' : 'Close Preview'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: AUDIENCE PREVIEW */}
      {showAudienceModal && plan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {isRtl ? 'عينة من جهات الاتصال المؤهلة' : 'Sample Eligible Contacts'}
              </h3>
              <button
                onClick={() => setShowAudienceModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                {isRtl ? 'إغلاق' : 'Close'}
              </button>
            </div>
            <div className="space-y-2 text-xs">
              {plan.sample_eligible && plan.sample_eligible.length > 0 ? (
                plan.sample_eligible.map((c) => (
                  <div key={c.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800 block">
                        {c.name || (isRtl ? 'جهة اتصال غير محددة' : 'Anonymous Contact')}
                      </span>
                      <span className="text-slate-500 text-[11px]">{c.email}</span>
                    </div>
                    {c.company && (
                      <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-600">
                        {c.company}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-xs">
                  {isRtl ? 'لا توجد جهات اتصال تجريبية متاحة.' : 'No sample contacts available.'}
                </p>
              )}
            </div>
            <div className={cn("flex pt-2", isRtl ? "justify-start" : "justify-end")}>
              <button
                onClick={() => setShowAudienceModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                {isRtl ? 'تم' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SCHEDULE CAMPAIGN */}
      {showScheduleModal && plan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              {isRtl ? 'جدولة حملة الذكاء الاصطناعي' : 'Schedule AI Campaign'}
            </h3>
            <p className="text-xs text-slate-500">
              {isRtl 
                ? 'اختر التاريخ والوقت الذي يجب إرسال هذه الحملة فيه تلقائياً.' 
                : 'Pick the date and time when this campaign should automatically be dispatched.'}
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isRtl ? 'تاريخ ووقت الإرسال' : 'Dispatch Date & Time'}
              </label>
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div className={cn("flex items-center gap-2 pt-2", isRtl ? "justify-start" : "justify-end")}>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => handleApproveAndSend(false)}
                disabled={!scheduleDate || isApproving}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
              >
                {isRtl ? 'تأكيد الجدولة' : 'Confirm Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: INSERT CTA BUTTON MODAL */}
      {isButtonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MousePointerClick className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {isRtl ? 'إضافة زر إجراء (CTA)' : 'Add Call-To-Action Button'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsButtonModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleInsertButtonSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isRtl ? 'نص الزر' : 'Button Label'}
                </label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder={isRtl ? 'مثال: حجز موعد استشاري' : 'e.g. Book a Demo'}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isRtl ? 'الرابط المقصود' : 'Destination URL'}
                </label>
                <input
                  type="url"
                  value={buttonUrl}
                  onChange={(e) => setButtonUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isRtl ? 'لون الزر' : 'Button Color'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={buttonColor}
                      onChange={(e) => setButtonColor(e.target.value)}
                      className="w-8 h-8 rounded border border-slate-200 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={buttonColor}
                      onChange={(e) => setButtonColor(e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isRtl ? 'المحاذاة' : 'Alignment'}
                  </label>
                  <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
                    <button
                      type="button"
                      onClick={() => setButtonAlign('left')}
                      className={`flex-1 py-1 rounded text-center font-medium transition-all ${
                        buttonAlign === 'left' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      {isRtl ? 'يسار' : 'Left'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setButtonAlign('center')}
                      className={`flex-1 py-1 rounded text-center font-medium transition-all ${
                        buttonAlign === 'center' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      {isRtl ? 'وسط' : 'Center'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  {isRtl ? 'معاينة في البريد:' : 'Preview in Email:'}
                </span>
                <div style={{ textAlign: buttonAlign }}>
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: buttonColor,
                      color: '#ffffff',
                      padding: '10px 22px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      fontFamily: 'sans-serif'
                    }}
                  >
                    {buttonText || (isRtl ? 'نص الزر' : 'Button Text')} {isRtl ? '←' : '→'}
                  </span>
                </div>
              </div>

              <div className={cn("flex items-center gap-2 pt-2 border-t border-slate-100", isRtl ? "justify-start" : "justify-end")}>
                <button
                  type="button"
                  onClick={() => setIsButtonModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  {isRtl ? 'إدراج الزر' : 'Insert Button'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
