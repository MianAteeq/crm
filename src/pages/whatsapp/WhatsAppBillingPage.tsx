import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Copy,
  Check,
  Building2,
  Smartphone,
  Globe,
  Clock,
  Info,
  ShieldAlert,
  Sparkles,
  X,
  HelpCircle,
  Coins,
  FileCheck2,
  PauseCircle,
  Lock
} from 'lucide-react';
import { whatsappApi } from '../../services/whatsappApi';
import { WhatsAppBillingProfile, WhatsAppBillingStatus } from '../../types/whatsapp';
import { useI18n } from '../../i18n';
import { toast } from '../../components/ui/Toast';
import { cn } from '../../lib/utils';

type RedirectTarget = 'payment_methods' | 'currency' | 'billing_hub' | 'whatsapp_manager' | 'business_settings';

export default function WhatsAppBillingPage() {
  const { isRtl } = useI18n();
  const [profile, setProfile] = useState<WhatsAppBillingProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState<RedirectTarget>('payment_methods');
  const [pendingUrl, setPendingUrl] = useState<string>('');

  useEffect(() => {
    loadBillingProfile();
  }, []);

  const loadBillingProfile = async () => {
    try {
      setIsLoading(true);
      const data = await whatsappApi.getBillingProfile();
      setProfile(data);
    } catch (err: any) {
      console.error('Failed to load billing profile:', err);
      toast.error(
        isRtl ? 'فشل تحميل بيانات الفوترة' : 'Failed to load billing profile',
        err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const res = await whatsappApi.refreshBillingStatus();
      if (res.profile) {
        setProfile(res.profile);
      } else {
        await loadBillingProfile();
      }
      toast.success(
        isRtl ? 'تم تحديث حالة الفوترة' : 'Billing status refreshed',
        res.message || (isRtl ? 'تم التحقق بنجاح من بيانات Meta الرسمية' : 'Successfully checked Meta official records.')
      );
    } catch (err: any) {
      console.error('Failed to refresh billing status:', err);
      toast.error(
        isRtl ? 'فشل التحديث من خوادم Meta' : 'Failed to refresh from Meta',
        err.message || (isRtl ? 'يرجى التأكد من اتصال الحساب والمحاولة مجدداً' : 'Please check account connection and try again.')
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOpenMetaBilling = async (target: RedirectTarget) => {
    try {
      setRedirectTarget(target);
      const res = await whatsappApi.getMetaBillingUrl(target);
      if (res.url) {
        setPendingUrl(res.url);
        setShowRedirectModal(true);
      }
    } catch (err: any) {
      console.error('Failed to generate Meta billing link:', err);
      toast.error(
        isRtl ? 'تعذر توليد رابط الفوترة' : 'Could not generate billing link',
        err.message
      );
    }
  };

  const handleConfirmRedirect = () => {
    if (pendingUrl) {
      window.open(pendingUrl, '_blank', 'noopener,noreferrer');
      setShowRedirectModal(false);
      toast.info(
        isRtl ? 'تم فتح منصة Meta الرسمية' : 'Opened official Meta portal',
        isRtl
          ? 'بعد إكمال ضبط البطاقة والعملة، انقر فوق "تحديث حالة الفوترة"'
          : 'After completing payment and currency setup in Meta, click "Refresh Billing Status".'
      );
    }
  };

  const handleDismissError = async () => {
    try {
      await whatsappApi.dismissBillingError();
      await loadBillingProfile();
      toast.success(
        isRtl ? 'تم تجاهل التنبيه' : 'Alert acknowledged',
        isRtl ? 'تم تحديث السجل' : 'Billing profile updated.'
      );
    } catch (err: any) {
      toast.error(isRtl ? 'فشل الإجراء' : 'Action failed', err.message);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
    toast.success(
      isRtl ? 'تم النسخ إلى الحافظة' : 'Copied to clipboard',
      text
    );
  };

  const getStatusBadge = (status: WhatsAppBillingStatus | undefined) => {
    switch (status) {
      case 'Operational':
        return {
          label: isRtl ? 'تشغيلي ونشط' : 'Operational',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
          dot: 'bg-emerald-500',
          icon: CheckCircle2,
        };
      case 'Configuration Required':
        return {
          label: isRtl ? 'يتطلب الإعداد (العملة)' : 'Configuration Required',
          color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
          dot: 'bg-amber-500',
          icon: AlertTriangle,
        };
      case 'Payment Attention Required':
        return {
          label: isRtl ? 'يتطلب مراجعة الدفع' : 'Payment Attention Required',
          color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800',
          dot: 'bg-rose-500',
          icon: AlertCircle,
        };
      case 'Pending Verification':
        return {
          label: isRtl ? 'بانتظار التحقق' : 'Pending Verification',
          color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
          dot: 'bg-blue-500',
          icon: Clock,
        };
      case 'Restricted':
        return {
          label: isRtl ? 'مقيد من Meta' : 'Restricted',
          color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800',
          dot: 'bg-red-500',
          icon: ShieldAlert,
        };
      case 'Not Configured':
      default:
        return {
          label: isRtl ? 'غير مهيأ' : 'Not Configured',
          color: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
          dot: 'bg-slate-400',
          icon: HelpCircle,
        };
    }
  };

  const isError131042 = profile?.last_error_code === '131042' ||
    (profile?.last_error_message && profile.last_error_message.includes('131042')) ||
    (profile?.last_error_message && profile.last_error_message.toLowerCase().includes('currency'));

  const statusConfig = getStatusBadge(profile?.billing_status);
  const StatusIcon = statusConfig.icon;
  const hasOperationalPaymentEvidence = Boolean(
    profile?.payment_method_status === 'configured' ||
    profile?.payment_method_status === 'active' ||
    (profile?.billing_status === 'Operational' && profile?.currency && profile?.last_successful_message_at)
  );
  const paymentNeedsAttention = profile?.payment_method_status === 'attention_required' || Boolean(profile?.last_error_code);
  const paymentLabel = hasOperationalPaymentEvidence
    ? (isRtl ? 'نشطة عبر Meta' : 'Active in Meta')
    : paymentNeedsAttention
      ? (isRtl ? 'تتطلب إجراءً' : 'Action Required')
      : profile?.currency
        ? (isRtl ? 'تدار عبر Meta' : 'Managed in Meta')
        : (isRtl ? 'الإعداد مطلوب' : 'Setup Required');
  const paymentNote = hasOperationalPaymentEvidence
    ? (isRtl
        ? 'تم تأكيد الفوترة من خلال إرسال ناجح. تبقى تفاصيل البطاقة محفوظة لدى Meta.'
        : 'Confirmed by successful messaging. Card details remain securely managed by Meta.')
    : profile?.payment_verification_note || (isRtl
        ? 'تتم إدارة طريقة الدفع مباشرة في Meta.'
        : 'Payment methods are managed directly in Meta.');

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800" />
          ))}
        </div>
        <div className="h-80 bg-slate-100 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-800" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-[1440px] mx-auto space-y-6 font-sans transition-colors">
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-white via-white to-emerald-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60 shadow-sm">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {isRtl ? 'إدارة فواتير ومدفوعات واتساب' : 'WhatsApp Billing & Payments'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {isRtl
                  ? 'إدارة إعدادات الفوترة وبطاقات الدفع الخاصة بحساب Meta WhatsApp Business الخاص بشركتك'
                  : 'Manage Meta WhatsApp Business Account billing configuration, currency, and payment methods'}
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin text-emerald-600')} />
            <span>{isRefreshing ? (isRtl ? 'جارٍ الفحص...' : 'Checking Meta...') : (isRtl ? 'تحديث حالة الفوترة' : 'Refresh Billing Status')}</span>
          </button>

          <button
            onClick={() => handleOpenMetaBilling('payment_methods')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer hover:shadow-md"
          >
            <CreditCard className="w-4 h-4" />
            <span>{isRtl ? 'إدارة طريقة الدفع في Meta' : 'Manage Payment Method'}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </div>

      {/* 2. Critical Alert Banner (Special Highlight for Error 131042) */}
      <AnimatePresence>
        {isError131042 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 shadow-sm space-y-4"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-200/80 dark:bg-amber-800/80 text-amber-900 dark:text-amber-200">
                    {isRtl ? 'خطأ عدم إعداد العملة: كود 131042' : 'Meta Error Code: 131042'}
                  </span>
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                    {isRtl ? 'مشكلة أهلية النشاط التجاري للدفع' : 'Business Eligibility Payment Issue'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-amber-950 dark:text-amber-100">
                  {isRtl
                    ? 'لم يتم تحديد العملة الرسمية لحساب واتساب للأعمال (WABA)'
                    : 'WhatsApp Business Account Currency is Not Configured'}
                </h3>
                <p className="text-xs sm:text-sm text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                  {isRtl
                    ? 'تشترط Meta تعيين عملة النشاط التجاري والدولة قبل إرسال الرسائل التسويقية. تم إيقاف الحملات النشطة مؤقتاً لحماية حسابك من فشل التسليم. يرجى ضبط العملة في منصة Meta ثم النقر على "تحديث حالة الفوترة".'
                    : 'Meta requires each WhatsApp Business Account (WABA) to configure its operating currency and business country before dispatching paid marketing templates. Affected campaigns have been safely paused.'}
                </p>
                {profile?.last_error_message && (
                  <div className="p-3 bg-amber-100/60 dark:bg-amber-900/40 rounded-xl font-mono text-xs text-amber-900 dark:text-amber-200 mt-2">
                    {profile.last_error_message}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-amber-200/60 dark:border-amber-800/60 justify-end flex-wrap">
              <button
                onClick={handleDismissError}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors cursor-pointer"
              >
                {isRtl ? 'تجاهل التنبيه' : 'Acknowledge Alert'}
              </button>
              <button
                onClick={() => handleOpenMetaBilling('currency')}
                className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Coins className="w-4 h-4" />
                <span>{isRtl ? 'ضبط العملة في Meta Business Suite' : 'Configure Currency in Meta'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generic Error Banner if not 131042 */}
      {!isError131042 && profile?.last_error_code && (
        <div className="p-5 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 shadow-sm flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-800 dark:text-rose-300">
                  {isRtl ? `خطأ الفوترة [${profile.last_error_code}]` : `Billing Issue [Code: ${profile.last_error_code}]`}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-rose-900 dark:text-rose-200 mt-1 font-mono">
                {profile.last_error_message || (isRtl ? 'تعذر إتمام الدفع أو معالجة الفوترة في Meta.' : 'Payment issue encountered with Meta.')}
              </p>
            </div>
          </div>
          <button
            onClick={handleDismissError}
            className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg dark:hover:bg-rose-900/40 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. KPI Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Billing Status */}
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {isRtl ? 'حالة الفوترة' : 'Billing Status'}
            </span>
            <div className={cn('p-2 rounded-xl', statusConfig.color)}>
              <StatusIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn('w-2.5 h-2.5 rounded-full animate-pulse', statusConfig.dot)} />
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">
              {statusConfig.label}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1">
            {profile?.last_checked_at
              ? (isRtl ? `آخر فحص: ${new Date(profile.last_checked_at).toLocaleTimeString()}` : `Checked: ${new Date(profile.last_checked_at).toLocaleTimeString()}`)
              : (isRtl ? 'بانتظار الفحص الأولي' : 'Pending initial sync')}
          </p>
        </div>

        {/* Card 2: Currency */}
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-blue-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {isRtl ? 'عملة الحساب' : 'WABA Currency'}
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {profile?.currency || (isRtl ? 'غير محددة' : 'Not Set')}
            </span>
            {profile?.currency && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                {isRtl ? 'مؤكدة' : 'Active'}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            {profile?.currency
              ? (isRtl ? 'تم ضبط العملة في منصة Meta' : 'Configured in Meta Business Suite')
              : (isRtl ? 'يتطلب التعيين في Meta' : 'Must be configured in Meta')}
          </p>
        </div>

        {/* Card 3: Payment Method Status */}
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-violet-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {isRtl ? 'طريقة الدفع' : 'Payment Method'}
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {paymentLabel}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-2">
            {paymentNote}
          </p>
        </div>

        {/* Card 4: Messaging Eligibility */}
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-teal-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {isRtl ? 'أهلية إرسال الرسائل' : 'Messaging Eligibility'}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {profile?.billing_status === 'Operational'
                ? (isRtl ? 'مؤهل ونشط' : 'Eligible & Active')
                : profile?.billing_status === 'Configuration Required'
                  ? (isRtl ? 'موقوف مؤقتاً' : 'Action Required')
                  : (isRtl ? 'قيد المراجعة' : 'In Review')}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            {profile?.last_successful_message_at
              ? (isRtl ? `آخر رسالة ناجحة: ${new Date(profile.last_successful_message_at).toLocaleDateString()}` : `Last sent: ${new Date(profile.last_successful_message_at).toLocaleDateString()}`)
              : (isRtl ? 'بانتظار أول إرسال ناجح' : 'Awaiting first message delivery')}
          </p>
        </div>
      </div>

      {/* 4. Detailed Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Account Overview */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {isRtl ? 'تفاصيل حساب واتساب للأعمال' : 'WhatsApp Account Details'}
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            {/* Business Name */}
            <div>
              <span className="text-slate-400 block mb-1">{isRtl ? 'اسم النشاط التجاري' : 'Business Name'}</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">
                {profile?.business_name || (isRtl ? 'غير متوفر' : 'Not Available')}
              </p>
            </div>

            {/* Display Phone */}
            <div>
              <span className="text-slate-400 block mb-1">{isRtl ? 'رقم الهاتف المسجل' : 'Registered Phone Number'}</span>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-slate-400" />
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {profile?.phone_number || (isRtl ? 'غير متوفر' : 'Not Available')}
                </span>
              </div>
            </div>

            {/* WABA ID with copy */}
            <div>
              <span className="text-slate-400 block mb-1">{isRtl ? 'معرف حساب واتساب (WABA ID)' : 'WABA ID'}</span>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 font-mono text-slate-700 dark:text-slate-300">
                <span className="truncate mr-2">{profile?.waba_id || (isRtl ? 'غير متصل' : 'Not Connected')}</span>
                {profile?.waba_id && (
                  <button
                    onClick={() => copyToClipboard(profile.waba_id!, 'waba_id')}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
                    title={isRtl ? 'نسخ' : 'Copy'}
                  >
                    {copiedField === 'waba_id' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                )}
              </div>
            </div>

            {/* Business Portfolio ID with copy */}
            <div>
              <span className="text-slate-400 block mb-1">{isRtl ? 'معرف محفظة أعمال Meta (Portfolio ID)' : 'Meta Business Portfolio ID'}</span>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 font-mono text-slate-700 dark:text-slate-300">
                <span className="truncate mr-2">{profile?.business_id || (isRtl ? 'يتم جلبه من Meta' : 'Fetched via Graph API')}</span>
                {profile?.business_id && (
                  <button
                    onClick={() => copyToClipboard(profile.business_id!, 'business_id')}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
                    title={isRtl ? 'نسخ' : 'Copy'}
                  >
                    {copiedField === 'business_id' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                )}
              </div>
            </div>

            {/* Connection status */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">{isRtl ? 'حالة الاتصال' : 'Connection Status'}</span>
              <span className={cn(
                'px-2 py-0.5 text-[11px] font-bold rounded-full',
                profile?.is_connected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
              )}>
                {profile?.is_connected ? (isRtl ? 'متصل' : 'Connected') : (isRtl ? 'غير متصل' : 'Disconnected')}
              </span>
            </div>
          </div>
        </div>

        {/* Column 2 & 3: Payment Management & Currency Action Hub */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Card: Manage Payment Methods */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {isRtl ? 'إدارة طرق الدفع وبطاقات الائتمان في Meta' : 'Meta Payment Method Management'}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {isRtl
                    ? 'يتم الدفع لشركة Meta مباشرة. لا يقوم نظام الـ CRM بطلب أو تخزين تفاصيل بطاقاتك الائتمانية لحماية أمان بياناتك البنكية.'
                    : 'Meta collects WhatsApp Cloud API messaging fees directly from your card. Our CRM never collects or stores your credit card details.'}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
                <button
                  onClick={() => handleOpenMetaBilling('payment_methods')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer hover:shadow-md"
                >
                  <span>{isRtl ? 'مركز الفوترة (Billing Hub)' : 'Meta Billing Hub'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleOpenMetaBilling('whatsapp_manager')}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                  title={isRtl ? 'فتح مدير واتساب' : 'Open WhatsApp Manager'}
                >
                  <span>{isRtl ? 'مدير واتساب' : 'WhatsApp Manager'}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {isRtl
                  ? 'يتم نقلك بأمان إلى مركز فوترة Meta الرسمي المقترن بحسابك لإضافة بطاقة ائتمان أو خط ائتمان شهري.'
                  : 'You will be securely routed to official Meta Billing Hub to attach a payment card or monthly invoicing line.'}
              </p>
            </div>
          </div>

          {/* Show setup guidance only when currency is missing or Meta reported 131042. */}
          {!profile?.currency || isError131042 ? (
          <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-600" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {isRtl ? 'إعداد عملة الفوترة الرسمية لحساب واتساب' : 'WABA Currency & Country Configuration'}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {isRtl
                    ? 'لحماية حسابك من خطأ Meta 131042، تأكد من اختيار العملة (مثل USD أو SAR أو AED) والدولة في إعدادات محفظة أعمال Meta.'
                    : 'Prevent Error 131042 by ensuring an official operating currency (e.g. USD, SAR, AED, EUR) is assigned to your Business Portfolio.'}
                </p>
              </div>

              <button
                onClick={() => handleOpenMetaBilling('currency')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer shrink-0"
              >
                <span>{isRtl ? 'إعداد العملة في Meta' : 'Configure Currency'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">1. {isRtl ? 'فتح الرابط' : 'Open Meta'}</span>
                <p className="text-slate-500 dark:text-slate-400">{isRtl ? 'انتقل إلى إعدادات محفظة الأعمال في Meta' : 'Navigate to your Meta Business Portfolio'}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">2. {isRtl ? 'حفظ العملة' : 'Set Currency'}</span>
                <p className="text-slate-500 dark:text-slate-400">{isRtl ? 'اختر الدولة والعملة وقم بحفظ التغييرات' : 'Select legal country & primary currency'}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">3. {isRtl ? 'تحديث الفوترة' : 'Sync Status'}</span>
                <p className="text-slate-500 dark:text-slate-400">{isRtl ? 'انقر على "تحديث حالة الفوترة" هنا للتحقق' : 'Return and click "Refresh Billing Status"'}</p>
              </div>
            </div>
          </div>
          ) : (
            <div className="rounded-3xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 text-emerald-600 shadow-sm border border-emerald-100 dark:border-emerald-800">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-emerald-950 dark:text-emerald-100">
                      {isRtl ? 'إعداد الفوترة مكتمل' : 'Billing setup is healthy'}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-emerald-800/80 dark:text-emerald-300/80">
                      {isRtl
                        ? `تم ضبط العملة على ${profile.currency} وحساب واتساب مؤهل للإرسال.`
                        : `${profile.currency} is configured and this WhatsApp account is eligible for messaging.`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenMetaBilling('business_settings')}
                  className="px-4 py-2.5 rounded-xl bg-white/90 dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>{isRtl ? 'عرض إعدادات Meta' : 'View Meta Settings'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Security & Multi-Tenant Assurance Card */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <Lock className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                {isRtl ? 'الأمان وعزل المستأجرين (Tenant Isolation)' : 'Security & Tenant Isolation Guarantee'}
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isRtl
                ? 'يعمل نظامنا وفق معايير الخصوصية الصارمة: كل مستأجر يملك حسابه التجاري الخاص في Meta. لا يملك أي مستأجر آخر حق الوصول إلى إعداداتك، ولا يتم تخزين أية أرقام بطاقات دفع داخل قواعد بيانات CRM.'
                : 'Each customer maintains their own Meta WABA and Business Portfolio. All billing links are verified against strict domain whitelists (business.facebook.com) and scoped strictly to your authenticated tenant credentials.'}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Safe Meta External Redirection Confirmation Modal */}
      <AnimatePresence>
        {showRedirectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {redirectTarget === 'currency'
                      ? (isRtl ? 'إعداد عملة ودولة النشاط التجاري في Meta' : 'Meta Business Portfolio - Currency Setup')
                      : redirectTarget === 'whatsapp_manager'
                      ? (isRtl ? 'مدير واتساب للأعمال (WhatsApp Manager)' : 'Meta WhatsApp Manager (WABA)')
                      : (isRtl ? 'مركز الفوترة وطرق الدفع في Meta' : 'Meta Billing Hub - Payment Methods')}
                  </h3>
                </div>
                <button
                  onClick={() => setShowRedirectModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <p>
                  {redirectTarget === 'currency'
                    ? (isRtl
                        ? 'سيتم فتح إعدادات محفظة أعمال Meta. يرجى اختيار الدولة والعملة الرسمية وحفظ الإعدادات لحل الخطأ 131042:'
                        : 'You will be redirected to Meta Business Info to select your business legal country and currency to resolve Error 131042:')
                    : redirectTarget === 'whatsapp_manager'
                    ? (isRtl
                        ? 'سيتم فتح صفحة حساب واتساب للأعمال (WABA) الرسمي في Meta لمراجعة حالة الحساب وجودة الرسائل:'
                        : 'You will be redirected to your WhatsApp Business Account dashboard in Meta Business Manager:')
                    : (isRtl
                        ? 'سيتم فتح مركز الفوترة الرسمي في Meta Business Suite لإضافة أو تحديث بطاقة الائتمان الخاصة برسائل واتساب:'
                        : 'You will be redirected to Meta Business Suite Billing Hub to add or manage your credit/debit card for WhatsApp Cloud API messaging:')}
                </p>
                <div className="relative group">
                  <div className="p-3 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 break-all border border-slate-200/60 dark:border-slate-700/60">
                    {pendingUrl}
                  </div>
                  <button
                    onClick={() => copyToClipboard(pendingUrl, 'meta_url')}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-500 hover:text-slate-700 dark:text-slate-300 shadow-xs cursor-pointer"
                    title={isRtl ? 'نسخ الرابط' : 'Copy URL'}
                  >
                    {copiedField === 'meta_url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    {isRtl
                      ? 'ملاحظة: بعد إكمال عملية إضافة البطاقة أو ضبط العملة في Meta، يرجى العودة إلى هذه الصفحة والنقر على "تحديث حالة الفوترة" للمزامنة والتحقق.'
                      : 'Important: Once you add your payment method or save your currency in Meta, return here and click "Refresh Billing Status" to synchronize.'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setShowRedirectModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  onClick={handleConfirmRedirect}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-all cursor-pointer hover:shadow-md"
                >
                  <span>{isRtl ? 'المتابعة إلى Meta' : 'Continue to Meta'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

