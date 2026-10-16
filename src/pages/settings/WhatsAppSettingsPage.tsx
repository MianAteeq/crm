import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  Smartphone,
  Loader2,
  CheckCircle2,
  XCircle,
  Copy,
  Send,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  Unlink,
  Zap,
  ExternalLink,
  Info,
  ArrowRight,
  Globe,
  Lock,
  Link as LinkIcon,
  User,
  UploadCloud,
  Image,
  Bot,
  Sparkles,
} from 'lucide-react';
import { crmApi } from '../../services/crmApi';
import { WhatsAppSettings } from '../../types';
import { FormSkeleton } from '../../components/ui/Skeleton';

// ─── Types ───────────────────────────────────────────────────────────────────
type Status = 'connected' | 'disconnected' | 'pending' | 'error';

interface LocalConfig {
  accessToken: string;
  phoneNumberId: string;
  businessAccountId: string;
  phoneNumber: string;
  businessName: string;
}

interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const WEBHOOK_URL   = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.origin
  ? `${window.location.origin}/api/webhook/whatsapp`
  : 'https://crm.talkinexx.com/api/webhook/whatsapp';
const VERIFY_TOKEN  = 'crm-throbtech-verify-token';
const STEPS = [
  { num: 1, label: 'Meta Developer Portal', desc: 'Create an app on developers.facebook.com' },
  { num: 2, label: 'WhatsApp Product',       desc: 'Add WhatsApp to your Meta app' },
  { num: 3, label: 'Get Credentials',        desc: 'Copy Access Token, Phone ID & WABA ID' },
  { num: 4, label: 'Configure Here',         desc: 'Enter credentials below and save' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function useCopy(timeoutMs = 2000) {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), timeoutMs);
    });
  };
  return { copied, copy };
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-bold text-[#12263A] mb-1.5">
      {children}
      {required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
  );
}

function CopyField({ label, value, fieldKey, copied, onCopy }: {
  label: string;
  value: string;
  fieldKey: string;
  copied: string | null;
  onCopy: (v: string, k: string) => void;
}) {
  return (
    <div className="space-y-1.5 text-left">
      <label className="text-xs font-bold text-[#64748B]">{label}</label>
      <div className="flex items-center gap-2 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl group">
        <code className="flex-1 text-xs font-mono text-[#12263A] truncate select-all">{value}</code>
        <button
          onClick={() => onCopy(value, fieldKey)}
          className="shrink-0 p-1.5 rounded-lg hover:bg-white text-[#64748B] hover:text-[#12263A] transition-all border border-transparent hover:border-[#E2E8F0]"
          title="Copy to clipboard"
        >
          {copied === fieldKey
            ? <CheckCircle2 size={14} className="text-[#22C55E]" />
            : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  const map: Record<Status, { bg: string; dot: string; label: string }> = {
    connected:    { bg: 'bg-[#F0FDF4] text-[#166534] border-[#22C55E]/30', dot: 'bg-[#22C55E]', label: 'Connected' },
    disconnected: { bg: 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]',   dot: 'bg-slate-400',  label: 'Disconnected' },
    pending:      { bg: 'bg-[#FFFBEB] text-[#B45309] border-amber-200',   dot: 'bg-amber-500',  label: 'Pending' },
    error:        { bg: 'bg-rose-50 text-rose-700 border-rose-200',       dot: 'bg-rose-500',   label: 'Error' },
  };
  const { bg, dot, label } = map[status] ?? map.disconnected;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${bg}`}>
      <span className={`w-2 h-2 rounded-full ${dot} ${status === 'connected' ? 'animate-pulse' : ''}`} />
      {label}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function WhatsAppSettingsPage() {
  const { copied, copy } = useCopy();
  const navigate = useNavigate();
  const [toasts, setToasts]           = useState<Toast[]>([]);
  const [status, setStatus]           = useState<Status>('disconnected');
  const [isFetching, setIsFetching]   = useState(true);
  const [isSaving, setIsSaving]       = useState(false);
  const [isTesting, setIsTesting]     = useState(false);
  const [testPhone, setTestPhone]     = useState('');
  const [lastSynced, setLastSynced]   = useState<string | null>(null);
  const [businessInfo, setBusinessInfo] = useState({ name: '', phone: '' });
  const [messagingLimit, setMessagingLimit] = useState<string>('TIER_250');

  const [profileDesc, setProfileDesc] = useState('');
  const [profileAbout, setProfileAbout] = useState('');
  const [profileLogoUrl, setProfileLogoUrl] = useState('');
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isWabaSubscribed, setIsWabaSubscribed] = useState(false);
  const [isSubscribingWaba, setIsSubscribingWaba] = useState(false);
  const [wabaSubscriptionError, setWabaSubscriptionError] = useState<string | null>(null);
  const [wabaAppName, setWabaAppName] = useState<string | null>(null);

  const [form, setForm] = useState<LocalConfig>({
    accessToken: '',
    phoneNumberId: '',
    businessAccountId: '',
    phoneNumber: '',
    businessName: '',
  });
  const [dirty, setDirty] = useState(false);
  const [openaiKey, setOpenaiKey] = useState('');
  const [companyPrompt, setCompanyPrompt] = useState('');
  const [isSavingAi, setIsSavingAi] = useState(false);
  const toastCounter = useRef(0);

  // ── Toast helpers ──
  const addToast = (type: Toast['type'], message: string) => {
    const id = ++toastCounter.current;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
  };

  // ── WhatsApp Profile Management ──
  const fetchProfile = async () => {
    setIsFetchingProfile(true);
    try {
      const res = await crmApi.getWhatsAppProfile();
      if (res && res.success && res.data) {
        setProfileDesc(res.data.description || '');
        setProfileAbout(res.data.about || '');
        setProfileLogoUrl(res.data.profile_picture_url || '');
      }
    } catch (err) {
      console.error('[CRM] Failed to load WhatsApp profile info:', err);
    } finally {
      setIsFetchingProfile(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsSavingProfile(true);
    try {
      const res = await crmApi.updateWhatsAppProfile(profileDesc, profileAbout);
      if (res.success) {
        addToast('success', 'WhatsApp profile details updated successfully!');
      } else {
        addToast('error', res.message || 'Failed to update profile.');
      }
    } catch (err: any) {
      addToast('error', err?.message || 'Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('error', 'Please select an image file (PNG/JPEG).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('error', 'Image size must be less than 5MB.');
      return;
    }

    setIsUploadingLogo(true);
    try {
      const res = await crmApi.uploadWhatsAppLogo(file);
      if (res.success) {
        addToast('success', 'WhatsApp profile picture updated!');
        if (res.profile_picture_url) {
          setProfileLogoUrl(res.profile_picture_url);
        } else {
          fetchProfile();
        }
      } else {
        addToast('error', res.message || 'Failed to upload logo.');
      }
    } catch (err: any) {
      addToast('error', err?.message || 'Failed to upload logo.');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // ── Load existing settings ──
  useEffect(() => { fetchSettings(true); }, []);

  const fetchSettings = async (forceSync = false) => {
    setIsFetching(true);
    try {
      const res = await crmApi.getWhatsAppSettings(forceSync);
      if (res) {
        setForm({
          accessToken:        res.access_token         || '',
          phoneNumberId:      res.phone_number_id      || '',
          businessAccountId:  res.business_account_id  || '',
          phoneNumber:        (res as any).phone_number || '',
          businessName:       (res as any).business_name || '',
        });
        setOpenaiKey(res.openai_key || '');
        setCompanyPrompt(res.company_prompt || '');
        const currentStatus = (res.status as Status) || 'disconnected';
        setStatus(currentStatus);
        const registered = !!res.is_registered;
        setIsRegistered(registered);
        setIsWabaSubscribed(!!(res as any).is_waba_subscribed);
        setWabaSubscriptionError((res as any).waba_subscription_error || null);
        setLastSynced((res as any).last_synced || null);
        setBusinessInfo({
          name:  (res as any).business_name  || '',
          phone: (res as any).phone_number   || '',
        });
        setMessagingLimit((res as any).messaging_limit_tier || 'TIER_250');
        if (currentStatus === 'connected') {
          fetchProfile();
        }
      }
    } catch {
      // silent
    } finally {
      setIsFetching(false);
    }
  };

  // ── WABA Subscription Handler ──
  const handleSubscribeWaba = async () => {
    if (isSubscribingWaba) return;
    setIsSubscribingWaba(true);
    setWabaSubscriptionError(null);
    try {
      addToast('info', 'Subscribing WhatsApp Business Account to Meta app...');
      const res = await crmApi.subscribeWaba();
      if (res.success && res.is_subscribed) {
        setIsWabaSubscribed(true);
        setWabaSubscriptionError(null);
        if (res.app_name) setWabaAppName(res.app_name);
        addToast('success', 'Webhook subscription confirmed!');
        fetchSettings(false);
      } else {
        setIsWabaSubscribed(false);
        const errMsg = res.message || 'Meta WABA subscription failed.';
        setWabaSubscriptionError(errMsg);
        addToast('error', errMsg);
      }
    } catch (err: any) {
      setIsWabaSubscribed(false);
      const errMsg = err?.message || 'Failed to subscribe WABA to Meta App.';
      setWabaSubscriptionError(errMsg);
      addToast('error', errMsg);
    } finally {
      setIsSubscribingWaba(false);
    }
  };

  const handleSaveAiSettings = async () => {
    if (!companyPrompt.trim()) {
      addToast('error', 'Company prompt / context is required.');
      return;
    }

    setIsSavingAi(true);
    try {
      const res = await crmApi.saveAiSettings(openaiKey || undefined, companyPrompt);
      if (res.success) {
        addToast('success', 'AI settings updated successfully!');
        if (res.data) {
          setOpenaiKey(res.data.openai_key || '');
          setCompanyPrompt(res.data.company_prompt || '');
        }
      } else {
        addToast('error', res.message || 'Failed to update AI settings.');
      }
    } catch (err: any) {
      addToast('error', err?.message || 'An error occurred while saving AI settings.');
    } finally {
      setIsSavingAi(false);
    }
  };

  // ── Automatic Background Registration & WABA Subscription ──
  useEffect(() => {
    let active = true;
    const autoRegister = async () => {
      if (status === 'connected' && !isRegistered && !isRegistering && !isFetching) {
        setIsRegistering(true);
        try {
          addToast('info', 'Registering WhatsApp phone number automatically...');
          const regRes = await crmApi.registerWhatsAppNumber('123456');
          if (regRes.success && active) {
            setIsRegistered(true);
            addToast('success', 'WhatsApp number registered and verified successfully!');
            fetchProfile();

            if (regRes.waba_subscription?.is_subscribed) {
              setIsWabaSubscribed(true);
              setWabaSubscriptionError(null);
              addToast('success', 'Webhook subscription confirmed!');
            } else {
              // Trigger explicit subscription
              handleSubscribeWaba();
            }
          } else if (active) {
            addToast('error', regRes.message || 'Auto-registration failed.');
          }
        } catch (err: any) {
          if (active) {
            console.error('[CRM] Auto-registration error:', err);
            addToast('error', err?.message || 'Auto-registration failed.');
          }
        } finally {
          if (active) {
            setIsRegistering(false);
          }
        }
      }
    };

    autoRegister();
    return () => { active = false; };
  }, [status, isRegistered, isFetching]);

  // ── Auto-subscribe WABA if connected but not yet confirmed ──
  useEffect(() => {
    let active = true;
    const autoSubscribe = async () => {
      if (
        status === 'connected' &&
        !isWabaSubscribed &&
        !isSubscribingWaba &&
        !isFetching
      ) {
        setIsSubscribingWaba(true);
        try {
          addToast('info', 'Subscribing WABA to Meta app automatically...');
          const res = await crmApi.subscribeWaba();
          if (active) {
            if (res.success && res.is_subscribed) {
              setIsWabaSubscribed(true);
              setWabaSubscriptionError(null);
              if (res.app_name) setWabaAppName(res.app_name);
              addToast('success', 'Webhook subscription confirmed!');
            } else {
              setIsWabaSubscribed(false);
              setWabaSubscriptionError(res.message || 'Auto-subscription failed.');
            }
          }
        } catch (err: any) {
          if (active) {
            setIsWabaSubscribed(false);
            setWabaSubscriptionError(err?.message || 'Auto-subscription failed.');
          }
        } finally {
          if (active) {
            setIsSubscribingWaba(false);
          }
        }
      }
    };

    autoSubscribe();
    return () => { active = false; };
  }, [status, isWabaSubscribed, isFetching]);

  // ── Polling for Registration Status ──
  useEffect(() => {
    if (status !== 'connected' || isRegistered) return;

    const interval = setInterval(async () => {
      try {
        const res = await crmApi.getWhatsAppSettings();
        if (res && res.is_registered) {
          setIsRegistered(true);
          addToast('success', 'WhatsApp number registration verified!');
          fetchProfile();
        }
      } catch (err) {
        // silent
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [status, isRegistered]);

  const handleChange = (field: keyof LocalConfig, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  // ── Save credentials ──
  const handleSave = async () => {
    if (!form.accessToken || !form.phoneNumberId || !form.businessAccountId) {
      addToast('error', 'Access Token, Phone Number ID, and Business Account ID are required.');
      return;
    }
    setIsSaving(true);
    try {
      const payload: WhatsAppSettings & { phone_number?: string; business_name?: string } = {
        access_token:         form.accessToken,
        phone_number_id:      form.phoneNumberId,
        business_account_id:  form.businessAccountId,
        phone_number:         form.phoneNumber || undefined,
        business_name:        form.businessName || undefined,
        status:               'connected',
      };
      const saveRes = await crmApi.saveWhatsAppSettings(payload as any);
      const isReg = !!(saveRes as any)?.data?.is_registered;
      setIsRegistered(isReg);
      setStatus('connected');
      setDirty(false);
      setLastSynced(new Date().toISOString());
      setBusinessInfo({ name: form.businessName, phone: form.phoneNumber });
      setMessagingLimit((saveRes as any)?.data?.messaging_limit_tier || 'TIER_250');
      addToast('success', 'WhatsApp API credentials saved and connected!');
      fetchProfile();
    } catch (err: any) {
      addToast('error', err?.message || 'Failed to save credentials.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Disconnect ──
  const handleDisconnect = async () => {
    if (!confirm('Disconnect your WhatsApp API? This will stop all messaging.')) return;
    try {
      await crmApi.disconnectWhatsApp();
      setStatus('disconnected');
      addToast('info', 'WhatsApp API disconnected.');
    } catch {
      addToast('error', 'Failed to disconnect.');
    }
  };

  // ── Test connection ──
  const handleTest = async () => {
    if (!testPhone.trim()) { addToast('error', 'Enter a phone number to test.'); return; }
    if (status !== 'connected') { addToast('error', 'Connect first before testing.'); return; }
    setIsTesting(true);
    try {
      const res = await crmApi.testWhatsAppConnection(testPhone.trim());
      if (res.success) addToast('success', 'Test message delivered successfully!');
      else addToast('error', 'Test message failed. Check your credentials.');
    } catch {
      addToast('error', 'Test failed — please verify your credentials.');
    } finally {
      setIsTesting(false);
    }
  };

  const isConnected = status === 'connected';
  const [activeTab, setActiveTab] = useState<'profile' | 'sandbox' | 'ai'>('profile');

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-full bg-[#FFFFFF] font-sans pb-16">
      {/* ─ Toast Stack ─ */}
      <div className="fixed top-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0,  scale: 1   }}
              exit   ={{ opacity: 0, x: 60, scale: 0.9 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold max-w-sm bg-white
                ${t.type === 'success' ? 'border-emerald-200 text-emerald-800 shadow-emerald-500/10'
                : t.type === 'error'   ? 'border-rose-200 text-rose-800 shadow-rose-500/10'
                                       : 'border-blue-200 text-blue-800 shadow-blue-500/10'}`}
            >
              {t.type === 'success' && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
              {t.type === 'error'   && <XCircle      size={16} className="text-rose-500 shrink-0"    />}
              {t.type === 'info'    && <Info         size={16} className="text-blue-500 shrink-0"    />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        
        {/* ─ Header & Action row ─ */}
        <motion.div 
          initial={{ opacity: 0, y: -12 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-4 border-b border-[#E2E8F0]"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#F0FDF4] border border-[#22C55E]/30 rounded-2xl flex items-center justify-center text-[#166534] shadow-xs shrink-0">
              <Zap size={24} className="text-[#166534]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#12263A] tracking-tight">WhatsApp API Setup</h1>
              <p className="text-sm text-[#64748B] mt-1">Configure and manage your Meta Cloud API connection and business details.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isFetching ? (
              <div className="flex items-center gap-2 text-[#64748B] text-xs font-semibold bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 shadow-xs">
                <Loader2 size={13} className="animate-spin text-[#166534]" /> Loading setup…
              </div>
            ) : (
              <StatusPill status={status} />
            )}
            {isConnected && (
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-rose-600 border border-rose-200 bg-white hover:bg-rose-50 rounded-xl transition-all shadow-xs active:scale-[0.98] cursor-pointer"
              >
                <Unlink size={13} /> Disconnect API
              </button>
            )}
          </div>
        </motion.div>

        {isFetching ? (
          <div className="pt-4">
            <FormSkeleton />
          </div>
        ) : (
          <>
            {/* ─ Connection Banner ─ */}
            <AnimatePresence>
              {isConnected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden space-y-3"
                >
                  <div className="bg-[#F0FDF4] border border-[#22C55E]/30 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#22C55E] rounded-xl flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                        <CheckCircle2 size={18} className="text-white" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-[#166534] text-sm tracking-wide">
                            {businessInfo.name ? `${businessInfo.name} — WhatsApp Connected` : 'WhatsApp API Connected Successfully'}
                          </p>
                          {isWabaSubscribed ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]">
                              <CheckCircle2 size={11} /> Webhook subscription confirmed
                            </span>
                          ) : isSubscribingWaba ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                              <Loader2 size={11} className="animate-spin" /> Subscribing WABA to Meta App...
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                              <AlertCircle size={11} /> Webhook Pending Subscription
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#166534]/90 font-medium">
                          {businessInfo.phone && (
                            <span className="inline-flex items-center gap-1">
                              <Smartphone size={12} className="text-[#166534]" />
                              <strong>Connected Number:</strong> {businessInfo.phone}
                            </span>
                          )}
                          <span>•</span>
                          <span>{isRegistered ? 'Number Registered & Active' : 'Number Registration Pending'}</span>
                          {lastSynced && (
                            <>
                              <span>•</span>
                              <span>Synced: {new Date(lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!isWabaSubscribed && (
                        <button
                          onClick={handleSubscribeWaba}
                          disabled={isSubscribingWaba}
                          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] disabled:opacity-50 rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
                        >
                          {isSubscribingWaba ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />} 
                          {isSubscribingWaba ? 'Subscribing...' : 'Subscribe WABA'}
                        </button>
                      )}
                      <button
                        onClick={() => fetchSettings(true)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#166534] border border-[#22C55E]/30 bg-white rounded-xl hover:bg-[#F0FDF4] transition-all shadow-xs active:scale-95 cursor-pointer"
                      >
                        <RefreshCw size={12} className="text-[#166534]" /> Refresh Profile
                      </button>
                    </div>
                  </div>

                  {/* Actionable Error & Retry Banner if subscription failed */}
                  {wabaSubscriptionError && !isWabaSubscribed && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-red-900">WABA Webhook Subscription Unconfirmed</p>
                          <p className="text-xs text-red-700 mt-0.5 leading-relaxed">{wabaSubscriptionError}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleSubscribeWaba}
                        disabled={isSubscribingWaba}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
                      >
                        {isSubscribingWaba ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                        Retry Subscription
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─ Clean Light Tab Selection Bar ─ */}
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-3"
            >
              <div className="flex flex-wrap gap-1.5 p-1.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs transition-all relative cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30 font-bold shadow-xs'
                      : 'text-[#64748B] hover:text-[#12263A] hover:bg-white border border-transparent font-medium'
                  }`}
                >
                  <User size={14} />
                  Business Profile
                  {isConnected && <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" />}
                </button>
                <button
                  onClick={() => setActiveTab('sandbox')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                    activeTab === 'sandbox'
                      ? 'bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30 font-bold shadow-xs'
                      : 'text-[#64748B] hover:text-[#12263A] hover:bg-white border border-transparent font-medium'
                  }`}
                >
                  <Send size={14} />
                  Sandbox & Steps
                </button>
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                    activeTab === 'ai'
                      ? 'bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30 font-bold shadow-xs'
                      : 'text-[#64748B] hover:text-[#12263A] hover:bg-white border border-transparent font-medium'
                  }`}
                >
                  <Bot size={14} />
                  AI Auto-Reply
                </button>
              </div>

              {!isConnected && (
                <div className="flex items-center gap-2 px-3.5 py-2 bg-[#FFFBEB] border border-amber-200 rounded-xl">
                  <AlertTriangle size={14} className="text-[#B45309]" />
                  <span className="text-xs font-bold text-[#B45309] uppercase tracking-wide">Offline Configuration</span>
                </div>
              )}
            </motion.div>

            {/* ─ Main Tab Panels ─ */}
            <AnimatePresence mode="wait">

              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {!isConnected ? (
                    /* Redesigned API Connection Required Card */
                    <div className="flex flex-col items-center justify-center py-14 sm:py-16 px-6 sm:px-10 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl text-center space-y-5 max-w-xl mx-auto shadow-sm">
                      <div className="w-16 h-16 bg-[#FFFBEB] border border-amber-200/80 rounded-2xl flex items-center justify-center text-[#B45309] shadow-xs">
                        <AlertTriangle size={30} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-[#12263A]">API Connection Required</h3>
                        <p className="text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
                          You need to connect your WhatsApp account using the official connection wizard before managing your Business Profile details.
                        </p>
                      </div>
                      <button 
                        onClick={() => navigate('/whatsapp/connect')}
                        className="bg-[#166534] hover:bg-[#14532d] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#166534]/20 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-sm hover:shadow transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Zap size={14} className="text-[#22C55E]" />
                        GO TO WHATSAPP CONNECT
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                      
                      {/* Left Form: Inputs */}
                      <div className="flex-1 w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-[#F0FDF4] border border-[#22C55E]/30 text-[#166534] rounded-xl flex items-center justify-center shadow-xs">
                              <User size={16} />
                            </div>
                            <div>
                              <h2 className="text-sm font-bold text-[#12263A] tracking-wide uppercase">WhatsApp Business Profile</h2>
                              <p className="text-xs text-[#64748B] mt-0.5">Manage logo, description, and status info like WhatsApp Manager</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-6 space-y-6">
                          {isFetchingProfile ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-3 text-[#64748B]">
                              <Loader2 size={24} className="animate-spin text-[#166534]" />
                              <p className="text-xs font-semibold">Loading profile information…</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              
                              {/* Alert Banner when not registered */}
                              {!isRegistered && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="p-4 bg-[#FFFBEB] border border-amber-200 rounded-xl flex items-start gap-3"
                                >
                                  {isRegistering ? (
                                    <Loader2 size={16} className="text-[#B45309] animate-spin shrink-0 mt-0.5" />
                                  ) : (
                                    <AlertTriangle size={16} className="text-[#B45309] shrink-0 mt-0.5" />
                                  )}
                                  <div className="flex-1">
                                    <p className="text-xs font-bold text-[#B45309]">
                                      {isRegistering ? 'Verification In Progress' : 'Phone Number Not Registered for Cloud API'}
                                    </p>
                                    <p className="text-[11px] text-[#B45309]/90 mt-0.5 leading-normal">
                                      {isRegistering 
                                        ? 'Attempting automatic 2FA registration with Meta API...'
                                        : 'Meta requires registering your number before profile updates can take effect. Auto-registering in background...'}
                                    </p>
                                  </div>
                                </motion.div>
                              )}

                              {/* Logo Upload Section */}
                              <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                                <div className="relative group w-20 h-20 rounded-2xl overflow-hidden border border-[#E2E8F0] bg-white flex items-center justify-center shrink-0 shadow-xs">
                                  {profileLogoUrl ? (
                                    <img
                                      src={profileLogoUrl}
                                      alt="WhatsApp Logo"
                                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                  ) : (
                                    <div className="flex flex-col items-center text-slate-400 gap-1 p-2 text-center">
                                      <Image size={20} strokeWidth={1.5} className="text-[#64748B]" />
                                      <span className="text-[8px] font-bold text-[#64748B] tracking-wider uppercase">No Logo</span>
                                    </div>
                                  )}

                                  {/* Upload Overlay */}
                                  {!isRegistered ? (
                                    <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center gap-1 text-white">
                                      <Lock size={16} className="text-slate-300" />
                                      <span className="text-[8px] font-bold tracking-wider uppercase text-center px-1">Locked</span>
                                    </div>
                                  ) : (
                                    <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 text-white cursor-pointer transition-all duration-200">
                                      {isUploadingLogo ? (
                                        <Loader2 size={15} className="animate-spin text-white" />
                                      ) : (
                                        <UploadCloud size={16} className="text-white" />
                                      )}
                                      <span className="text-[8px] font-bold tracking-widest uppercase text-center px-1">
                                        {isUploadingLogo ? 'Uploading…' : 'Upload'}
                                      </span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleLogoChange}
                                        disabled={isUploadingLogo}
                                      />
                                    </label>
                                  )}
                                </div>
                                <div className="flex-1 space-y-1 text-center sm:text-left">
                                  <p className="text-xs font-bold text-[#12263A]">Business Avatar / Brand Icon</p>
                                  <p className="text-xs text-[#64748B] leading-normal max-w-sm">
                                    Square JPEG/PNG image up to 5MB. Recommended: 640x640px. This avatar is displayed publicly on WhatsApp chats.
                                  </p>
                                </div>
                              </div>

                              {/* Form Inputs */}
                              <div className="space-y-4">
                                <div>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <FieldLabel>About / Tagline</FieldLabel>
                                    <span className="text-[10px] text-[#64748B] font-mono">{profileAbout.length}/139</span>
                                  </div>
                                  <input
                                    type="text"
                                    maxLength={139}
                                    value={profileAbout}
                                    onChange={(e) => setProfileAbout(e.target.value)}
                                    placeholder="e.g. Fast, reliable real estate solutions."
                                    disabled={!isRegistered || isSavingProfile}
                                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-sm text-[#12263A] focus:outline-none focus:ring-4 focus:ring-[#166534]/10 focus:border-[#166534] focus:bg-white transition-all placeholder:text-[#64748B]/60 disabled:opacity-60 disabled:cursor-not-allowed font-medium"
                                  />
                                  <p className="text-[10px] text-[#64748B] mt-1 ml-1">Displayed in the 'About' section in WhatsApp contacts (up to 139 characters).</p>
                                </div>

                                <div>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <FieldLabel>Business Description</FieldLabel>
                                    <span className="text-[10px] text-[#64748B] font-mono">{profileDesc.length}/512</span>
                                  </div>
                                  <textarea
                                    rows={4}
                                    maxLength={512}
                                    value={profileDesc}
                                    onChange={(e) => setProfileDesc(e.target.value)}
                                    placeholder="Describe your business services, catalog, or support hours..."
                                    disabled={!isRegistered || isSavingProfile}
                                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-sm text-[#12263A] focus:outline-none focus:ring-4 focus:ring-[#166534]/10 focus:border-[#166534] focus:bg-white transition-all placeholder:text-[#64748B]/60 resize-none font-medium leading-relaxed disabled:opacity-60 disabled:cursor-not-allowed"
                                  />
                                  <p className="text-[10px] text-[#64748B] mt-1 ml-1">Visible on your official WhatsApp Business details profile page (up to 512 characters).</p>
                                </div>
                              </div>

                              <div className="pt-2 flex items-center justify-between border-t border-[#E2E8F0]">
                                <div className="text-[11px] text-[#64748B] flex items-center gap-1.5 font-medium">
                                  <Zap size={13} className="text-[#22C55E]" /> Real-time Meta Graph API Sync
                                </div>
                                <button
                                  type="button"
                                  onClick={handleUpdateProfile}
                                  disabled={!isRegistered || isSavingProfile}
                                  className="bg-[#166534] hover:bg-[#14532d] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                  {isSavingProfile ? (
                                    <>
                                      <Loader2 size={13} className="animate-spin" /> Saving Profile...
                                    </>
                                  ) : (
                                    <>
                                      <Check size={13} /> Update Profile Info
                                    </>
                                  )}
                                </button>
                              </div>

                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Mock Preview: Phone Screen */}
                      <div className="w-full lg:w-80 shrink-0 space-y-4">
                        <div className="flex items-center justify-between px-1">
                          <p className="text-xs font-bold text-[#12263A] uppercase tracking-wider flex items-center gap-1.5">
                            <Smartphone size={14} className="text-[#166534]" /> WhatsApp Live Preview
                          </p>
                          <span className="text-[10px] font-semibold text-[#22C55E] bg-[#F0FDF4] px-2 py-0.5 rounded-full border border-[#22C55E]/30">Verified</span>
                        </div>

                        {/* Phone Container */}
                        <div className="w-full max-w-[290px] mx-auto bg-slate-900 rounded-[36px] p-3 shadow-xl border-4 border-slate-700/80 relative flex flex-col aspect-[9/18]">
                          {/* Notch */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-800 rounded-b-xl z-20 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-950/80 mr-2" />
                            <div className="w-10 h-1 rounded-full bg-slate-950/60" />
                          </div>

                          {/* Screen Header */}
                          <div className="bg-[#128C7E] pt-7 pb-2.5 px-3 rounded-t-[26px] text-white flex items-center justify-between text-xs z-10 shadow-xs">
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-white/80">&larr;</span>
                              <span className="font-bold text-xs truncate max-w-[150px]">{form.businessName || 'Business Profile'}</span>
                            </div>
                            <span className="text-white/80 text-[10px]">&vellip;</span>
                          </div>

                          {/* Screen Body */}
                          <div className="flex-1 bg-[#ECE5DD] overflow-y-auto custom-scrollbar p-2.5 space-y-2.5">
                            
                            {/* Profile Info Card */}
                            <div className="bg-white rounded-lg shadow-xs p-3.5 flex flex-col items-center text-center space-y-2.5 border border-slate-200/50">
                              <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-50 border-2 border-[#128C7E] flex items-center justify-center shadow-inner">
                                {profileLogoUrl ? (
                                  <img src={profileLogoUrl} alt="Mock Profile" className="w-full h-full object-cover" />
                                ) : (
                                  <Image size={24} className="text-slate-300" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900 text-xs truncate max-w-[190px]">
                                  {form.businessName || 'Business Name'}
                                </h4>
                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                                  {form.phoneNumber || '+92 300 1234567'}
                                </p>
                              </div>
                              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded-full">
                                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                <span className="text-[9px] font-bold text-emerald-700">Official Account</span>
                              </div>
                            </div>

                            {/* About Card */}
                            <div className="bg-white rounded-lg shadow-xs p-3.5 space-y-2.5 border border-slate-200/50 text-left">
                              <div>
                                <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wide block">About</span>
                                <p className="text-xs text-slate-800 leading-normal font-semibold mt-0.5">
                                  {profileAbout || 'Hello there! We are on WhatsApp.'}
                                </p>
                              </div>
                              <div className="h-px bg-slate-100" />
                              <div>
                                <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wide block">Description</span>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium italic mt-0.5">
                                  {profileDesc || 'Enter a detailed profile description on the left to see how customers view your business details page.'}
                                </p>
                              </div>
                            </div>

                            {/* Chat preview bubble */}
                            <div className="bg-white rounded-lg shadow-xs p-3 border border-slate-200/50 text-left">
                              <span className="text-[8px] font-black text-slate-400 tracking-wide block mb-1.5">Live Message Box</span>
                              <div className="p-2 bg-[#E1FFC7] rounded-lg shadow-xs border border-slate-200/30 max-w-[85%] ml-auto text-right">
                                <p className="text-[11px] text-slate-800 leading-tight">
                                  Hello! How can we assist you today?
                                </p>
                                <span className="text-[8px] text-slate-400 block mt-0.5">10:14 AM ✓✓</span>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'ai' && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
                >
                  {/* AI Auto-Reply configuration */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
                      <div className="flex items-center gap-3 px-6 py-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#F0FDF4] border border-[#22C55E]/30 text-[#166534]">
                          <Bot size={16} />
                        </div>
                        <div>
                          <h2 className="text-sm font-bold text-[#12263A] uppercase tracking-wide">AI Auto-Reply Configuration</h2>
                          <p className="text-xs text-[#64748B]">Configure your DeepSeek model to reply automatically to incoming messages</p>
                        </div>
                      </div>

                      <div className="p-6 space-y-5">
                        {/* Universal DeepSeek Status Banner */}
                        <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#22C55E]/30 flex items-start gap-3.5">
                          <div className="w-8 h-8 rounded-xl bg-[#166534] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                            <Sparkles size={16} />
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-[#166534] uppercase tracking-wider">Universal Platform DeepSeek Active</h4>
                              <span className="px-2 py-0.5 bg-[#dcfce7] text-[#14532d] text-[10px] font-extrabold rounded-full">Managed For All Vendors</span>
                            </div>
                            <p className="text-xs text-[#166534] leading-relaxed font-medium">
                              DeepSeek AI is pre-configured and provided centrally by the platform. You do not need to purchase, add, or manage an API key. Simply provide your company knowledge and FAQs below!
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <FieldLabel required>Company Idea / Context (AI Knowledge Base)</FieldLabel>
                            <textarea
                              rows={8}
                              value={companyPrompt}
                              onChange={e => setCompanyPrompt(e.target.value)}
                              placeholder="Describe your company, products, services, FAQs, and any rules or tone the AI should follow when replying to customers. Be detailed!"
                              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 text-sm text-[#12263A] focus:outline-none focus:ring-4 focus:ring-[#22C55E]/10 focus:border-[#166534] focus:bg-white transition-all placeholder:text-[#64748B]/60"
                            />
                            <p className="text-[10px] text-[#64748B] mt-1">Provide all details the AI needs to answer customer questions about pricing, features, support, hours, etc.</p>
                          </div>
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            onClick={handleSaveAiSettings}
                            disabled={isSavingAi}
                            className="px-5 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            {isSavingAi ? (
                              <>
                                <Loader2 size={13} className="animate-spin" />
                                Saving AI Settings...
                              </>
                            ) : (
                              <>
                                <Check size={13} />
                                Save AI Settings
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Info sidebar */}
                  <div className="space-y-6">
                    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-sm p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] border border-[#22C55E]/30 flex items-center justify-center text-[#166534]">
                          <Zap size={18} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#12263A]">Smart AI Responses</h3>
                          <p className="text-xs text-[#64748B]">Automated customer messaging</p>
                        </div>
                      </div>
                      <p className="text-xs text-[#64748B] leading-relaxed">
                        When active, customers messaging your WhatsApp number receive conversational, intelligent replies matching your knowledge base rules.
                      </p>
                      <div className="p-3.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl text-xs text-[#1D4ED8] space-y-1">
                        <p className="font-bold">✨ Instant Response</p>
                        <p>Works 24/7 without manual staff intervention.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'sandbox' && (
                <motion.div
                  key="sandbox"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
                >
                  {/* Test connection & message console */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
                      <div className="flex items-center gap-3 px-6 py-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isConnected ? 'bg-[#F0FDF4] border border-[#22C55E]/30 text-[#166534]' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                          <Send size={16} />
                        </div>
                        <div>
                          <h2 className="text-sm font-bold text-[#12263A] uppercase tracking-wide">Test Sandbox Console</h2>
                          <p className="text-xs text-[#64748B]">Trigger test messages to verify API connection logs</p>
                        </div>
                      </div>

                      <div className="p-6 space-y-5">
                        {!isConnected && (
                          <div className="flex items-center gap-2.5 p-4 bg-[#FFFBEB] border border-amber-200 rounded-xl">
                            <AlertTriangle size={15} className="text-[#B45309] shrink-0" />
                            <p className="text-xs text-[#B45309] font-medium">
                              Please connect your API credentials first to enable test sandbox messages.
                            </p>
                          </div>
                        )}

                        <div className="space-y-4">
                          <div>
                            <FieldLabel required>Test Recipient Phone Number</FieldLabel>
                            <div className="relative group">
                              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] group-focus-within:text-[#166534] transition-colors" size={15} />
                              <input
                                id="test-phone-number"
                                value={testPhone}
                                onChange={e => setTestPhone(e.target.value)}
                                placeholder="e.g. +923001234567"
                                disabled={!isConnected}
                                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 pl-10 pr-3 text-sm text-[#12263A] focus:outline-none focus:ring-4 focus:ring-[#166534]/10 focus:border-[#166534] focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all placeholder:text-[#64748B]/60"
                              />
                            </div>
                            <p className="text-[10px] text-[#64748B] mt-1 ml-1">Use international format starting with country code</p>
                          </div>

                          {/* Mock log display terminal */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#64748B]">Sandbox Dispatch Logs</label>
                            <div className="bg-[#12263A] rounded-xl p-4 font-mono text-xs text-slate-200 space-y-2 border border-[#12263A] shadow-inner">
                              <div className="flex items-center justify-between text-[9px] text-slate-400 border-b border-slate-700/60 pb-2 mb-2 font-sans font-bold uppercase tracking-wider">
                                <span>API Console Terminal</span>
                                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-[#22C55E] animate-pulse' : 'bg-slate-500'}`} />
                              </div>
                              {isTesting ? (
                                <div className="space-y-1">
                                  <p className="text-[#22C55E] animate-pulse">&gt; Preparing request payload (text message: "Hello from CRM! Connection verified successfully")...</p>
                                  <p className="text-slate-400">&gt; Target WABA ID: {form.businessAccountId}</p>
                                  <p className="text-slate-400">&gt; Target Phone ID: {form.phoneNumberId}</p>
                                  <p className="text-amber-400 animate-pulse">&gt; Executing POST request to graph.facebook.com/v21.0/{form.phoneNumberId}/messages...</p>
                                </div>
                              ) : (
                                <div className="space-y-1 text-slate-400">
                                  <p className="text-slate-400">// Ready to trigger test dispatch.</p>
                                  <p>&gt; Connection Status: {status.toUpperCase()}</p>
                                  {testPhone && <p className="text-emerald-400">&gt; Target Phone: {testPhone}</p>}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-[#E2E8F0]">
                            <button
                              id="test-whatsapp-connection"
                              onClick={handleTest}
                              disabled={isTesting || !isConnected || !testPhone.trim()}
                              className="w-full bg-[#166534] hover:bg-[#14532d] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                              {isTesting ? (
                                <><Loader2 size={15} className="animate-spin" /> Sending Test Message…</>
                              ) : (
                                <><Send size={15} /> Dispatch Sandbox Message</>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Setup Checklist & Webhook Config */}
                  <div className="space-y-6">
                    {/* Webhook Config */}
                    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#F0FDF4] border border-[#22C55E]/30 text-[#166534] rounded-lg flex items-center justify-center">
                            <Globe size={15} />
                          </div>
                          <div>
                            <h2 className="text-sm font-bold text-[#12263A]">Webhook Config</h2>
                            <p className="text-xs text-[#64748B]">Values to configure in Meta App dashboard</p>
                          </div>
                        </div>
                        {isConnected && (
                          <div>
                            {isWabaSubscribed ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-[#DCFCE7] text-[#15803D] rounded-full border border-[#86EFAC]">
                                <CheckCircle2 size={11} /> Verified & Active
                              </span>
                            ) : (
                              <button
                                onClick={handleSubscribeWaba}
                                disabled={isSubscribingWaba}
                                className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-[#166534] bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-[#22C55E]/40 rounded-lg transition-all cursor-pointer"
                              >
                                {isSubscribingWaba ? <Loader2 size={11} className="animate-spin" /> : <Zap size={11} />}
                                {isSubscribingWaba ? 'Verifying...' : 'Verify Subscription'}
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="p-6 space-y-4">
                        <CopyField label="Callback URL" value={WEBHOOK_URL}  fieldKey="webhookUrl"  copied={copied} onCopy={copy} />
                        <CopyField label="Verify Token" value={VERIFY_TOKEN} fieldKey="verifyToken" copied={copied} onCopy={copy} />

                        <div className="flex items-start gap-3 p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl">
                          <Info size={15} className="text-[#1D4ED8] shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-[#1D4ED8]">How to configure webhooks</p>
                            <p className="text-[11px] text-[#1D4ED8]/90 leading-relaxed">
                              In your Meta app, go to <strong>WhatsApp › Configuration</strong>, click <strong>Edit</strong>, 
                              paste the Callback URL and Verify Token above, then subscribe to <strong>messages</strong> events.
                            </p>
                            <a
                              href="https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks"
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1D4ED8] hover:underline mt-1"
                            >
                              Meta Webhook Docs <ExternalLink size={10} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Setup Checklist */}
                    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
                      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                        <div className="w-8 h-8 bg-[#166534] text-white rounded-lg flex items-center justify-center shadow-xs">
                          <ArrowRight size={15} />
                        </div>
                        <div>
                          <h2 className="text-sm font-bold text-[#12263A]">Quick Setup Checklist</h2>
                          <p className="text-xs text-[#64748B]">Steps to complete integration</p>
                        </div>
                      </div>

                      <div className="p-5 space-y-4">
                        {STEPS.map((step, idx) => (
                          <div key={step.num} className="flex items-start gap-3">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                              isConnected && idx < 3
                                ? 'bg-[#22C55E] text-white'
                                : 'bg-[#F1F5F9] text-[#64748B]'
                            }`}>
                              {isConnected && idx < 3 ? <CheckCircle2 size={13} /> : step.num}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#12263A]">{step.label}</p>
                              <p className="text-xs text-[#64748B] mt-0.5 leading-normal">{step.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="px-5 pb-5">
                        <a
                          href="https://developers.facebook.com/apps/"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center w-full h-10 px-4 rounded-xl font-semibold text-xs text-[#12263A] bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs transition-colors"
                        >
                          <LinkIcon size={12} className="mr-1" /> Open Meta Portal
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

      </div>
    </div>
  );
}
