import { useState, useEffect } from 'react';
import { 
  Settings, 
  Clock, 
  ShieldCheck, 
  Bot, 
  Link2, 
  Bell, 
  Plus, 
  Copy, 
  CheckCircle2, 
  Trash2, 
  AlertCircle, 
  Loader2, 
  Save, 
  ExternalLink,
  Smartphone,
  Calendar,
  RefreshCw,
  Sliders,
  Filter
} from 'lucide-react';
import { crmApi } from '../../services/crmApi';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from '../../components/ui/Toast';
import { useI18n } from '../../i18n';

type SettingsTab = 'general' | 'links' | 'bots' | 'alerts';

export default function AutomationSettingsPage() {
  const { isRtl } = useI18n();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  // Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Tab 1: General Policy Defaults
  const [defaultReentryPolicy, setDefaultReentryPolicy] = useState('after_completion');
  const [reentryCooldown, setReentryCooldown] = useState(60);
  const [stopOnResponse, setStopOnResponse] = useState(true);
  const [timezoneMode, setTimezoneMode] = useState<'contact' | 'tenant'>('contact');
  const [executionStartTime, setExecutionStartTime] = useState('09:00');
  const [executionEndTime, setExecutionEndTime] = useState('18:00');
  const [readStateBehavior, setReadStateBehavior] = useState('mark_read');

  // Tab 2: Tracked Links
  const [trackedLinks, setTrackedLinks] = useState<any[]>([]);
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [repeatClickPolicy, setRepeatClickPolicy] = useState('every');
  const [triggerWorkflows, setTriggerWorkflows] = useState(true);
  const [isCreatingLink, setIsCreatingLink] = useState(false);

  // Tab 3: Bot Filtering Rules
  const [botRules, setBotRules] = useState<any[]>([]);
  const [newBotRuleName, setNewBotRuleName] = useState('');
  const [newBotPattern, setNewBotPattern] = useState('');
  const [newBotSignalType, setNewBotSignalType] = useState('user_agent');
  const [isCreatingBotRule, setIsCreatingBotRule] = useState(false);

  // Tab 4: Alert Notifications
  const [alertEnabled, setAlertEnabled] = useState(false);
  const [alertRecipients, setAlertRecipients] = useState('');
  const [repeatSuppressionMinutes, setRepeatSuppressionMinutes] = useState(60);
  const [hourlyLimit, setHourlyLimit] = useState(20);

  // Load active tab data
  const loadTabData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'links') {
        const res = await crmApi.getTrackedLinks();
        setTrackedLinks(Array.isArray(res) ? res : (res?.data || []));
      } else if (activeTab === 'bots') {
        const res = await crmApi.getAutomationBotRules();
        setBotRules(Array.isArray(res) ? res : (res?.data || []));
      } else if (activeTab === 'alerts') {
        const res = await crmApi.getAlertSettings();
        if (res) {
          setAlertEnabled(Boolean(res.enabled));
          setAlertRecipients(Array.isArray(res.recipient_user_ids) ? res.recipient_user_ids.join(', ') : '');
          setRepeatSuppressionMinutes(res.repeat_suppression_minutes || 60);
          setHourlyLimit(res.hourly_limit || 20);
        }
      }
    } catch (err: any) {
      toast.error(isRtl ? 'خطأ' : 'Error', 'Failed to load settings data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTabData();
  }, [activeTab]);

  // Save General Defaults
  const handleSaveGeneral = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success(
        isRtl ? 'تم حفظ الإعدادات' : 'Saved',
        isRtl ? 'تم تحديث سياسات الأتمتة الافتراضية بنجاح.' : 'Global automation policies updated.'
      );
    }, 400);
  };

  // Create Tracked Link
  const handleCreateTrackedLink = async () => {
    if (!newLinkName.trim() || !newLinkUrl.trim()) return;
    setIsCreatingLink(true);
    try {
      await crmApi.createTrackedLink({
        name: newLinkName.trim(),
        destination_url: newLinkUrl.trim(),
        repeat_click_policy: repeatClickPolicy,
        trigger_workflows: triggerWorkflows
      });
      toast.success(isRtl ? 'تم إنشاء الرابط' : 'Link Created', 'Tracked WhatsApp link ready.');
      setNewLinkName('');
      setNewLinkUrl('');
      loadTabData();
    } catch (err: any) {
      toast.error(isRtl ? 'فشل' : 'Failed', err?.message || 'Could not create link.');
    } finally {
      setIsCreatingLink(false);
    }
  };

  // Create Bot Rule
  const handleCreateBotRule = async () => {
    if (!newBotRuleName.trim() || !newBotPattern.trim()) return;
    setIsCreatingBotRule(true);
    try {
      await crmApi.createAutomationBotRule({
        name: newBotRuleName.trim(),
        signal_type: newBotSignalType,
        pattern: newBotPattern.trim(),
        classification: 'bot',
        enabled: true
      });
      toast.success(isRtl ? 'تمت إضافة القاعدة' : 'Rule Added', 'Bot filtering rule activated.');
      setNewBotRuleName('');
      setNewBotPattern('');
      loadTabData();
    } catch (err: any) {
      toast.error(isRtl ? 'فشل' : 'Failed', err?.message || 'Could not create bot rule.');
    } finally {
      setIsCreatingBotRule(false);
    }
  };

  // Save Alerts
  const handleSaveAlerts = async () => {
    setIsSaving(true);
    try {
      const recipientIds = alertRecipients
        .split(',')
        .map(s => Number(s.trim()))
        .filter(n => !isNaN(n) && n > 0);

      await crmApi.saveAlertSettings({
        enabled: alertEnabled,
        recipient_user_ids: recipientIds,
        repeat_suppression_minutes: repeatSuppressionMinutes,
        hourly_limit: hourlyLimit
      });
      toast.success(isRtl ? 'تم التحديث' : 'Alerts Updated', 'Error alert notifications saved.');
    } catch (err: any) {
      toast.error(isRtl ? 'خطأ' : 'Error', err?.message || 'Could not save alerts.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={cn("space-y-6 bg-white font-sans", isRtl && "text-right")} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#12263A]">
            {isRtl ? 'إعدادات وقواعد الأتمتة' : 'Automation Settings & Rules'}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 font-medium">
            {isRtl 
              ? 'تكوين سياسات إعادة الدخول، فلاتر الروبوتات، روابط التتبع وإشعارات الأعطال.' 
              : 'Configure re-entry limits, bot filtering, tracked link attribution, and failure alerts.'}
          </p>
        </div>

        <button
          onClick={loadTabData}
          className="p-2 border border-[#E2E8F0] rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
          title="Refresh"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin text-[#166534]" : ""} />
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl w-fit text-xs font-bold">
        <button
          onClick={() => setActiveTab('general')}
          className={cn(
            "flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all",
            activeTab === 'general'
              ? "bg-white text-[#166534] shadow-sm border border-[#E2E8F0]"
              : "text-slate-600 hover:text-[#12263A]"
          )}
        >
          <Sliders size={14} />
          {isRtl ? 'السياسات العامة' : 'General Policies'}
        </button>

        <button
          onClick={() => setActiveTab('links')}
          className={cn(
            "flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all",
            activeTab === 'links'
              ? "bg-white text-[#166534] shadow-sm border border-[#E2E8F0]"
              : "text-slate-600 hover:text-[#12263A]"
          )}
        >
          <Link2 size={14} />
          {isRtl ? 'روابط التتبع' : 'Tracked Links'}
        </button>

        <button
          onClick={() => setActiveTab('bots')}
          className={cn(
            "flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all",
            activeTab === 'bots'
              ? "bg-white text-[#166534] shadow-sm border border-[#E2E8F0]"
              : "text-slate-600 hover:text-[#12263A]"
          )}
        >
          <Bot size={14} />
          {isRtl ? 'فلترة الروبوتات' : 'Bot Filtering'}
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={cn(
            "flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all",
            activeTab === 'alerts'
              ? "bg-white text-[#166534] shadow-sm border border-[#E2E8F0]"
              : "text-slate-600 hover:text-[#12263A]"
          )}
        >
          <Bell size={14} />
          {isRtl ? 'إشعارات الأعطال' : 'Failure Alerts'}
        </button>
      </div>

      {/* Tab 1: General Policies */}
      {activeTab === 'general' && (
        <div className="space-y-6 max-w-3xl">
          <div className="border border-[#E2E8F0] rounded-2xl p-6 bg-white shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-bold text-[#12263A]">
                {isRtl ? 'سياسات إعادة الدخول للمسارات' : 'Workflow Re-entry & Enrollment Policy'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isRtl ? 'تحديد كيفية تعامل المسارات مع جهات الاتصال التي سبق تسجيلها.' : 'Control how dispatches prevent duplicate customer enrollments.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isRtl ? 'سياسة إعادة الدخول الافتراضية' : 'Default Re-entry Policy'}
                </label>
                <select
                  value={defaultReentryPolicy}
                  onChange={(e) => setDefaultReentryPolicy(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#166534]"
                >
                  <option value="never">{isRtl ? 'منع إعادة الدخول نهائياً (مرة واحدة)' : 'Never (Single enrollment per lifetime)'}</option>
                  <option value="after_completion">{isRtl ? 'السماح بعد اكتمال المسار السابق' : 'Allow re-entry after completion'}</option>
                  <option value="always">{isRtl ? 'السماح دائماً (توازي)' : 'Always allow concurrent'}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isRtl ? 'فترة التهدئة قبل إعادة الدخول (دقائق)' : 'Re-entry Cooldown (Minutes)'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={reentryCooldown}
                  onChange={(e) => setReentryCooldown(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166534]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs font-bold text-[#12263A] block">
                  {isRtl ? 'إيقاف المسار عند رد العميل' : 'Stop on Customer Response'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {isRtl ? 'إلغاء الخطوات التسويقية التلقائية التالية فور استلام رد بشري على واتساب.' : 'Automatically pause or halt ongoing automated workflow when a human replies.'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={stopOnResponse}
                onChange={(e) => setStopOnResponse(e.target.checked)}
                className="w-4 h-4 accent-[#166534]"
              />
            </div>

            <div className="border-t border-slate-100 pt-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#12263A]">
                  {isRtl ? 'ساعات التشغيل والمنطقة الزمنية' : 'Operating Hours & Timezone'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isRtl ? 'منع إرسال رسائل واتساب خارج أوقات العمل لتفادي إزعاج العملاء.' : 'Restrict WhatsApp dispatches to respect client business hours and sleep windows.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isRtl ? 'أسبقية المنطقة الزمنية' : 'Timezone Precedence'}
                  </label>
                  <select
                    value={timezoneMode}
                    onChange={(e: any) => setTimezoneMode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#166534]"
                  >
                    <option value="contact">{isRtl ? 'المنطقة الزمنية للعميل أولاً' : 'Contact Timezone'}</option>
                    <option value="tenant">{isRtl ? 'المنطقة الزمنية لحساب الشركة' : 'Workspace Timezone'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isRtl ? 'بداية ساعات الإرسال' : 'Allowed Start Time'}
                  </label>
                  <input
                    type="time"
                    value={executionStartTime}
                    onChange={(e) => setExecutionStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166534]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isRtl ? 'نهاية ساعات الإرسال' : 'Allowed End Time'}
                  </label>
                  <input
                    type="time"
                    value={executionEndTime}
                    onChange={(e) => setExecutionEndTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166534]"
                  />
                </div>
              </div>
            </div>

            {/* Auto-Reply Policy Card */}
            <div className="border-t border-[#E2E8F0] pt-6 space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#12263A]">
                    {isRtl ? 'سياسات الرد الآلي للدردشة (Chat Auto-Reply Policies)' : 'Chat Auto-Reply Policies & Defaults'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30">
                    Live Chat Integration
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isRtl 
                    ? 'التحكم في الرد الآلي التلقائي على محادثات واتساب الواردة وسلوك الإيقاف المؤقت عند تدخل الموظفين.' 
                    : 'Configure default auto-reply behavior on incoming chats and automatic pause when human agents reply.'}
                </p>
              </div>

              <div className="space-y-3 bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] text-xs">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-[#12263A] block">
                      {isRtl ? 'تفعيل الرد الآلي افتراضياً في المحادثات الجديدة' : 'Default Auto-Reply on New Inbound Conversations'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {isRtl 
                        ? 'تكون المحادثات الجديدة مفعلاً بها الرد الآلي افتراضياً حتى يوقفه الموظف يدوياً.' 
                        : 'New inbound customer chats start with Auto-Reply active until manually paused by an agent.'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    readOnly
                    className="w-4 h-4 accent-[#166534] rounded cursor-default"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-slate-200/60 pt-2.5">
                  <div>
                    <span className="font-bold text-[#12263A] block">
                      {isRtl ? 'إيقاف الرد الآلي مؤقتاً عند رد موظف بشري' : 'Pause Auto-Reply on Human Agent Manual Reply'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {isRtl 
                        ? 'عندما يقوم أحد موظفي الفريق بإرسال رسالة يدوية، يتم تحويل حالة الرد الآلي للمحادثة إلى (موقوف).' 
                        : 'Automatically pauses automated replies for a contact once a staff member sends a manual message.'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={stopOnResponse}
                    onChange={(e) => setStopOnResponse(e.target.checked)}
                    className="w-4 h-4 accent-[#166534] rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-200/60 rounded-xl text-xs flex items-center justify-between">
                <span className="text-[#166534] font-medium text-[11px]">
                  {isRtl 
                    ? 'يمكن لموظفي خدمة العملاء تفعيل أو إيقاف الرد الآلي لأي عميل بنقرة زر واحدة مباشرة من شريط رأس الدردشة.' 
                    : 'Agents can toggle Auto-Reply ON or PAUSED for any chat instantly using the bot toggle in the chat header.'}
                </span>
                <a
                  href="/settings/whatsapp"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#166534] hover:underline shrink-0 ml-2"
                >
                  <span>{isRtl ? 'إعدادات الذكاء الاصطناعي' : 'AI Prompt Settings'}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                disabled={isSaving}
                onClick={handleSaveGeneral}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#166534] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {isRtl ? 'حفظ السياسات' : 'Save Policies'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Tracked Links */}
      {activeTab === 'links' && (
        <div className="space-y-6 max-w-4xl">
          {/* Create Link Card */}
          <div className="border border-[#E2E8F0] rounded-2xl p-5 bg-[#F8FAFC] space-y-4">
            <h3 className="text-sm font-bold text-[#12263A]">
              {isRtl ? 'إنشاء رابط واتساب متتبع جديد' : 'Create Tracked WhatsApp Trigger Link'}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <input
                type="text"
                value={newLinkName}
                onChange={(e) => setNewLinkName(e.target.value)}
                placeholder={isRtl ? 'اسم الرابط (مثال: رابط تحميل العرض)' : 'Link name (e.g. VIP Catalog Link)'}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#166534]"
              />
              <input
                type="url"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://destination-website.com"
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#166534]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={triggerWorkflows}
                  onChange={(e) => setTriggerWorkflows(e.target.checked)}
                  className="w-4 h-4 accent-[#166534]"
                />
                {isRtl ? 'تشغيل أحداث مسارات العمل عند النقر' : 'Trigger workflow click events'}
              </label>

              <button
                disabled={isCreatingLink || !newLinkName.trim() || !newLinkUrl.trim()}
                onClick={handleCreateTrackedLink}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#166534] text-white rounded-xl text-xs font-bold disabled:opacity-50"
              >
                {isCreatingLink ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                {isRtl ? 'إنشاء الرابط' : 'Generate Tracked Link'}
              </button>
            </div>
          </div>

          {/* Links List */}
          <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden bg-white shadow-sm">
            {trackedLinks.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Link2 size={24} className="mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-700">{isRtl ? 'لا توجد روابط متتبعة بعد' : 'No tracked links created yet'}</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">{isRtl ? 'الاسم' : 'Name'}</th>
                    <th className="p-3">{isRtl ? 'الوجهة' : 'Destination'}</th>
                    <th className="p-3 text-center">{isRtl ? 'النقرات الإجمالية' : 'Raw Clicks'}</th>
                    <th className="p-3 text-center">{isRtl ? 'النقرات البشرية' : 'Human Clicks'}</th>
                    <th className="p-3 text-center">{isRtl ? 'نسخ الرابط' : 'Copy'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {trackedLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-[#F8FAFC]">
                      <td className="p-3 font-bold text-[#12263A]">{link.name}</td>
                      <td className="p-3 text-slate-500 font-mono text-[11px] truncate max-w-xs">{link.destination_url}</td>
                      <td className="p-3 text-center font-bold text-slate-700">{link.raw_clicks || 0}</td>
                      <td className="p-3 text-center font-bold text-[#166534]">{link.human_clicks || 0}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/api/t/${link.public_token}`);
                            toast.success(isRtl ? 'تم النسخ' : 'Copied', 'Tracking URL copied to clipboard.');
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                          title="Copy tracked URL"
                        >
                          <Copy size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Bot Filtering Rules */}
      {activeTab === 'bots' && (
        <div className="space-y-6 max-w-4xl">
          <div className="border border-[#E2E8F0] rounded-2xl p-5 bg-[#F8FAFC] space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#12263A]">
                {isRtl ? 'قواعد استبعاد الروبوتات والزواحف' : 'Bot & Crawler Exclusion Rules'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isRtl ? 'منع نقرات فحص الروابط التلقائية من WhatsApp أو الخوادم من تشغيل مسارات العمل.' : 'Ensure automated preview crawlers never trigger customer WhatsApp workflows.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <input
                type="text"
                value={newBotRuleName}
                onChange={(e) => setNewBotRuleName(e.target.value)}
                placeholder={isRtl ? 'اسم القاعدة (مثال: Meta Crawler)' : 'Rule name'}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#166534]"
              />

              <select
                value={newBotSignalType}
                onChange={(e) => setNewBotSignalType(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#166534]"
              >
                <option value="user_agent">User-Agent Regex</option>
                <option value="ip_pattern">IP Subnet Pattern</option>
                <option value="rate_limit">Visit Velocity Surge</option>
              </select>

              <input
                type="text"
                value={newBotPattern}
                onChange={(e) => setNewBotPattern(e.target.value)}
                placeholder="/facebookexternalhit|whatsapp/i"
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-[#166534]"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                disabled={isCreatingBotRule || !newBotRuleName.trim() || !newBotPattern.trim()}
                onClick={handleCreateBotRule}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#166534] text-white rounded-xl text-xs font-bold disabled:opacity-50"
              >
                {isCreatingBotRule ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                {isRtl ? 'إضافة القاعدة' : 'Add Rule'}
              </button>
            </div>
          </div>

          <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden bg-white shadow-sm">
            {botRules.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Bot size={24} className="mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-700">{isRtl ? 'لا توجد قواعد مخصصة مضافة' : 'Default system bot heuristics are active'}</p>
                <p className="text-[11px] text-slate-500">{isRtl ? 'يتم فحص معرّفات WhatsApp وزواحف Meta تلقائياً.' : 'Standard Meta and preview crawlers are automatically filtered.'}</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">{isRtl ? 'القاعدة' : 'Rule Name'}</th>
                    <th className="p-3">{isRtl ? 'النوع' : 'Signal Type'}</th>
                    <th className="p-3">{isRtl ? 'النمط' : 'Pattern'}</th>
                    <th className="p-3 text-center">{isRtl ? 'الحالة' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {botRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-[#F8FAFC]">
                      <td className="p-3 font-bold text-[#12263A]">{rule.name}</td>
                      <td className="p-3 text-slate-600 font-mono text-[11px]">{rule.signal_type}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-600">{rule.pattern}</td>
                      <td className="p-3 text-center">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                          rule.enabled ? "bg-emerald-50 text-[#166534]" : "bg-slate-100 text-slate-500"
                        )}>
                          {rule.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Failure Alerts */}
      {activeTab === 'alerts' && (
        <div className="space-y-6 max-w-3xl">
          <div className="border border-[#E2E8F0] rounded-2xl p-6 bg-white shadow-sm space-y-5">
            <div>
              <h3 className="text-sm font-bold text-[#12263A]">
                {isRtl ? 'إشعارات أعطال وأخطاء التنفيذ' : 'Execution Failure Alerts'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isRtl ? 'تنبيه مسؤولي النظام عند فشل إرسال قوالب واتساب أو حدوث خطأ في المنطق.' : 'Receive automated notifications when workflow executions breach failure thresholds.'}
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs font-bold text-[#12263A] block">
                  {isRtl ? 'تفعيل تنبيهات الأعطال' : 'Enable Failure Notifications'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {isRtl ? 'إرسال تنبيهات فورية للمستخدمين المعينين.' : 'Dispatch alerts to specified staff users upon execution failure.'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={alertEnabled}
                onChange={(e) => setAlertEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#166534]"
              />
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isRtl ? 'معرفات المستخدمين المستلمين (مفصولة بفاصلة)' : 'Recipient User IDs (Comma separated)'}
                </label>
                <input
                  type="text"
                  value={alertRecipients}
                  onChange={(e) => setAlertRecipients(e.target.value)}
                  placeholder="1, 2"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166534]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isRtl ? 'فترة كبت تكرار التنبيه (دقائق)' : 'Repeat Suppression (Minutes)'}
                  </label>
                  <input
                    type="number"
                    min="5"
                    value={repeatSuppressionMinutes}
                    onChange={(e) => setRepeatSuppressionMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166534]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isRtl ? 'الحد الأقصى للتنبيهات بالساعة' : 'Max Hourly Alert Limit'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={hourlyLimit}
                    onChange={(e) => setHourlyLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166534]"
                  />
                </div>
              </div>
            </div>

            {/* Auto-Reply Policy Card */}
            <div className="border-t border-[#E2E8F0] pt-6 space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#12263A]">
                    {isRtl ? 'سياسات الرد الآلي للدردشة (Chat Auto-Reply Policies)' : 'Chat Auto-Reply Policies & Defaults'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30">
                    Live Chat Integration
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isRtl 
                    ? 'التحكم في الرد الآلي التلقائي على محادثات واتساب الواردة وسلوك الإيقاف المؤقت عند تدخل الموظفين.' 
                    : 'Configure default auto-reply behavior on incoming chats and automatic pause when human agents reply.'}
                </p>
              </div>

              <div className="space-y-3 bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] text-xs">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-[#12263A] block">
                      {isRtl ? 'تفعيل الرد الآلي افتراضياً في المحادثات الجديدة' : 'Default Auto-Reply on New Inbound Conversations'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {isRtl 
                        ? 'تكون المحادثات الجديدة مفعلاً بها الرد الآلي افتراضياً حتى يوقفه الموظف يدوياً.' 
                        : 'New inbound customer chats start with Auto-Reply active until manually paused by an agent.'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    readOnly
                    className="w-4 h-4 accent-[#166534] rounded cursor-default"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-slate-200/60 pt-2.5">
                  <div>
                    <span className="font-bold text-[#12263A] block">
                      {isRtl ? 'إيقاف الرد الآلي مؤقتاً عند رد موظف بشري' : 'Pause Auto-Reply on Human Agent Manual Reply'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {isRtl 
                        ? 'عندما يقوم أحد موظفي الفريق بإرسال رسالة يدوية، يتم تحويل حالة الرد الآلي للمحادثة إلى (موقوف).' 
                        : 'Automatically pauses automated replies for a contact once a staff member sends a manual message.'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={stopOnResponse}
                    onChange={(e) => setStopOnResponse(e.target.checked)}
                    className="w-4 h-4 accent-[#166534] rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-200/60 rounded-xl text-xs flex items-center justify-between">
                <span className="text-[#166534] font-medium text-[11px]">
                  {isRtl 
                    ? 'يمكن لموظفي خدمة العملاء تفعيل أو إيقاف الرد الآلي لأي عميل بنقرة زر واحدة مباشرة من شريط رأس الدردشة.' 
                    : 'Agents can toggle Auto-Reply ON or PAUSED for any chat instantly using the bot toggle in the chat header.'}
                </span>
                <a
                  href="/settings/whatsapp"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#166534] hover:underline shrink-0 ml-2"
                >
                  <span>{isRtl ? 'إعدادات الذكاء الاصطناعي' : 'AI Prompt Settings'}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                disabled={isSaving}
                onClick={handleSaveAlerts}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#166534] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {isRtl ? 'حفظ إعدادات التنبيه' : 'Save Alert Settings'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

