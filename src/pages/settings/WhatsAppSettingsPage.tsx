import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  Key,
  Smartphone,
  Building2,
  Eye,
  EyeOff,
  Save,
  Loader2,
  CheckCircle2,
  XCircle,
  Copy,
  Shield,
  Send,
  AlertTriangle,
  RefreshCw,
  Unlink,
  Zap,
  ExternalLink,
  MessageSquare,
  Info,
  ArrowRight,
  Globe,
  Lock,
  Link as LinkIcon,
  User,
  UploadCloud,
  Image,
  Bot,
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
const WEBHOOK_URL   = 'https://crm.throbtech.com/api/webhook/whatsapp';
const VERIFY_TOKEN  = 'CRM_VERIFY_TOKEN_XYZ';
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
    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
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
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</label>
      <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl group">
        <code className="flex-1 text-xs font-mono text-slate-700 dark:text-slate-300 truncate select-all">{value}</code>
        <button
          onClick={() => onCopy(value, fieldKey)}
          className="shrink-0 p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          title="Copy to clipboard"
        >
          {copied === fieldKey
            ? <CheckCircle2 size={14} className="text-emerald-500" />
            : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  const map: Record<Status, { bg: string; dot: string; label: string }> = {
    connected:    { bg: 'bg-emerald-100/80 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50',  dot: 'bg-emerald-500', label: 'Connected'    },
    disconnected: { bg: 'bg-slate-100 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700',        dot: 'bg-slate-400',   label: 'Disconnected' },
    pending:      { bg: 'bg-amber-100/80 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',        dot: 'bg-amber-500',   label: 'Pending'      },
    error:        { bg: 'bg-rose-100/80 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/50',           dot: 'bg-rose-500',    label: 'Error'        },
  };
  const { bg, dot, label } = map[status] ?? map.disconnected;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} ${status === 'connected' ? 'animate-pulse' : ''}`} />
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

  // ── Automatic Background Registration ──
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
    <div className="relative min-h-full bg-slate-50/50 dark:bg-slate-900/40 overflow-hidden font-sans pb-16">
      {/* Premium Ambient Background Orbs */}
      <div className="absolute top-[-250px] left-[-150px] w-[600px] h-[600px] rounded-full bg-indigo-200/10 dark:bg-indigo-900/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[700px] h-[700px] rounded-full bg-purple-200/10 dark:bg-purple-900/10 blur-[150px] pointer-events-none" />

      {/* ─ Toast Stack ─ */}
      <div className="fixed top-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0,  scale: 1   }}
              exit   ={{ opacity: 0, x: 60, scale: 0.9 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold max-w-sm backdrop-blur-md
                ${t.type === 'success' ? 'bg-white/95 dark:bg-slate-800/95 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 shadow-emerald-500/5'
                : t.type === 'error'   ? 'bg-white/95 dark:bg-slate-800/95 border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 shadow-rose-500/5'
                                       : 'bg-white/95 dark:bg-slate-800/95 border-blue-200 dark:border-blue-900/50 text-blue-800 dark:text-blue-300 shadow-blue-500/5'}`}
            >
              {t.type === 'success' && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
              {t.type === 'error'   && <XCircle      size={16} className="text-rose-500 shrink-0"    />}
              {t.type === 'info'    && <Info         size={16} className="text-blue-500 shrink-0"    />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        
        {/* ─ Header & Action row ─ */}
        <motion.div 
          initial={{ opacity: 0, y: -12 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-2"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#6D4AFF] to-[#8B5CF6] rounded-2xl flex items-center justify-center shadow-lg shadow-[#6D4AFF]/25 transition-transform hover:scale-105 duration-300">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">WhatsApp API Setup</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure and manage your Meta Cloud API connection and business details</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isFetching ? (
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-3 py-2 shadow-sm">
                <Loader2 size={13} className="animate-spin text-[#6D4AFF]" /> Loading setup…
              </div>
            ) : (
              <StatusPill status={status} />
            )}
            {isConnected && (
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-950 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100/70 hover:border-rose-300 rounded-xl transition-all shadow-sm shadow-rose-100/10 active:scale-[0.98]"
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
              className="overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#6D4AFF]/5 via-emerald-50/30 to-emerald-50/70 dark:from-emerald-950/10 dark:via-emerald-950/5 dark:to-slate-900 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm shadow-emerald-500/5">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/10">
                  <CheckCircle2 size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-emerald-800 dark:text-emerald-350 text-sm tracking-wide">
                    {businessInfo.name ? `${businessInfo.name} — WhatsApp Connected` : 'WhatsApp API Connected Successfully'}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                    {businessInfo.phone && `Number: ${businessInfo.phone} · `}
                    {lastSynced && `Last Synced: ${new Date(lastSynced).toLocaleString()}`}
                  </p>
                </div>
                <button
                  onClick={() => fetchSettings(true)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40 bg-white dark:bg-slate-800 rounded-xl hover:bg-emerald-50/50 dark:hover:bg-slate-700 hover:border-emerald-300 transition-all shrink-0 shadow-sm active:scale-95"
                >
                  <RefreshCw size={12} className="text-emerald-600 dark:text-emerald-500" /> Refresh Profile
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─ Premium Tab Selection Bar ─ */}
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-2"
        >
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                activeTab === 'profile'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/10 dark:border-slate-700/50'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40'
              }`}
            >
              <User size={14} />
              Business Profile
              {isConnected && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
            </button>
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'sandbox'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/10 dark:border-slate-700/50'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40'
              }`}
            >
              <Send size={14} />
              Sandbox & Steps
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'ai'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/10 dark:border-slate-700/50'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40'
              }`}
            >
              <Bot size={14} />
              AI Auto-Reply
            </button>
          </div>

          {!isConnected && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl">
              <AlertTriangle size={13} className="text-amber-600 dark:text-amber-400" />
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">Offline Configuration</span>
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
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl text-center space-y-4 max-w-xl mx-auto shadow-sm">
                  <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900 rounded-2xl flex items-center justify-center text-amber-500">
                    <AlertTriangle size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">API Connection Required</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                    You need to connect your WhatsApp account using the official connection wizard before managing your Business Profile details.
                  </p>
                  <button 
                    onClick={() => navigate('/whatsapp/connect')}
                    className="btn-premium-primary text-xs"
                  >
                    Go to WhatsApp Connect
                  </button>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  
                  {/* Left Form: Inputs */}
                  <div className="flex-1 w-full premium-card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-purple-50 dark:bg-purple-950/30 text-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                          <User size={16} />
                        </div>
                        <div>
                          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-wide uppercase">WhatsApp Business Profile</h2>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Manage logo, description, and status info like WhatsApp Manager</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {isFetchingProfile ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-3 text-slate-400">
                          <Loader2 size={24} className="animate-spin text-[#6D4AFF]" />
                          <p className="text-xs font-semibold">Loading profile information…</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          
                          {/* Alert Banner when not registered */}
                          {!isRegistered && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl flex items-start gap-3"
                            >
                              {isRegistering ? (
                                <Loader2 size={16} className="text-amber-500 animate-spin shrink-0 mt-0.5" />
                              ) : (
                                <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                              )}
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                                  {isRegistering ? 'Registration In Progress' : 'Registration Pending'}
                                </p>
                                <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
                                  {isRegistering 
                                    ? 'Your WhatsApp phone number is connected but not registered on Meta. We are automatically registering the number using PIN 123456 now. Please wait...' 
                                    : 'Your WhatsApp phone number is connected but not registered on Meta. We are automatically attempting registration. Business profile fields will remain locked until registration is complete.'}
                                </p>
                              </div>
                            </motion.div>
                          )}

                          {/* Image upload row */}
                          <div className="bg-slate-50 dark:bg-slate-900/45 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center gap-5">
                            <div className="relative group w-24 h-24 rounded-full border-2 border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 flex items-center justify-center shadow-inner transition-all duration-300 hover:border-[#6D4AFF]/50 hover:shadow-lg">
                              {profileLogoUrl ? (
                                <img
                                  src={profileLogoUrl}
                                  alt="WhatsApp Logo"
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex flex-col items-center text-slate-400 gap-1 p-2 text-center">
                                  <Image size={20} strokeWidth={1.5} className="text-slate-400 dark:text-slate-300" />
                                  <span className="text-[8px] font-bold text-slate-500 dark:text-slate-300 tracking-wider uppercase">No Logo</span>
                                </div>
                              )}

                              {/* Upload Overlay */}
                              {!isRegistered ? (
                                <div className="absolute inset-0 bg-slate-950/50 flex flex-col items-center justify-center gap-1 text-white/90 backdrop-blur-[1px]">
                                  <Lock size={16} className="text-slate-300" />
                                  <span className="text-[8px] font-black tracking-wider uppercase text-center px-1">Locked</span>
                                </div>
                              ) : (
                                <label className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 text-white cursor-pointer transition-all duration-300 backdrop-blur-[2px]">
                                  {isUploadingLogo ? (
                                    <Loader2 size={15} className="animate-spin text-white" />
                                  ) : (
                                    <UploadCloud size={16} className="text-white animate-bounce" />
                                  )}
                                  <span className="text-[8px] font-black tracking-widest uppercase text-center px-1">
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
                              <p className="text-xs font-bold text-slate-800 dark:text-white">Business Avatar / Brand Icon</p>
                              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal max-w-[320px]">
                                Square JPEG/PNG image up to 5MB. Recommended: 640x640px. This avatar is displayed publicly on WhatsApp chats.
                              </p>
                            </div>
                          </div>

                          {/* Meta Messaging Limits Tier Card */}
                          <div className="p-5 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/10 dark:to-purple-950/10 border border-indigo-100 dark:border-indigo-950/55 rounded-2xl space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                                  <Shield size={16} />
                                </div>
                                <div>
                                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Meta Messaging Limits</h4>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Limits on unique recipient conversations in a rolling 24-hour window</p>
                                </div>
                              </div>
                              <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 bg-indigo-100/50 dark:bg-indigo-950/30 px-3 py-1 rounded-full border border-indigo-200/30">
                                {messagingLimit}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-1">
                              <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                                <p className="text-[9px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-widest leading-none">Daily Rolling Limit</p>
                                <p className="text-lg font-black text-slate-900 dark:text-white mt-1.5 leading-none">
                                  {messagingLimit === 'TIER_250' && '250'}
                                  {(messagingLimit === 'TIER_1K' || messagingLimit === 'TIER_1000') && '1,000'}
                                  {(messagingLimit === 'TIER_2K' || messagingLimit === 'TIER_2000') && '2,000'}
                                  {messagingLimit === 'TIER_10K' && '10,000'}
                                  {messagingLimit === 'TIER_100K' && '100,000'}
                                  {messagingLimit === 'TIER_UNLIMITED' && 'Unlimited'}
                                </p>
                                <p className="text-[9px] text-slate-500 mt-1">Unique contacts / day</p>
                              </div>

                              <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                                <p className="text-[9px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-widest leading-none">Monthly Estimate</p>
                                <p className="text-lg font-black text-slate-900 dark:text-white mt-1.5 leading-none">
                                  {messagingLimit === 'TIER_250' && '7,500'}
                                  {(messagingLimit === 'TIER_1K' || messagingLimit === 'TIER_1000') && '30,000'}
                                  {(messagingLimit === 'TIER_2K' || messagingLimit === 'TIER_2000') && '60,000'}
                                  {messagingLimit === 'TIER_10K' && '300,000'}
                                  {messagingLimit === 'TIER_100K' && '3.0M'}
                                  {messagingLimit === 'TIER_UNLIMITED' && 'Unlimited'}
                                </p>
                                <p className="text-[9px] text-slate-500 mt-1">Estimated monthly cap</p>
                              </div>
                            </div>

                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                              Meta updates your messaging limit automatically based on the volume and quality rating of outbound template campaigns you dispatch over the last 7 days.
                            </p>
                          </div>

                          {/* Inputs description & about */}
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between items-baseline mb-1.5">
                                <FieldLabel>Business Description</FieldLabel>
                                <span className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-md">
                                  {profileDesc.length} / 512
                                </span>
                              </div>
                              <textarea
                                value={profileDesc}
                                onChange={e => setProfileDesc(e.target.value.substring(0, 512))}
                                disabled={!isRegistered}
                                placeholder={isRegistered ? "Enter a comprehensive business description to show customers..." : "Registering number... profile settings locked."}
                                rows={3}
                                className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#6D4AFF]/5 focus:border-[#6D4AFF] focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none font-medium leading-relaxed disabled:opacity-60 disabled:cursor-not-allowed"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between items-baseline mb-1.5">
                                <FieldLabel>About Status</FieldLabel>
                                <span className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-md">
                                  {profileAbout.length} / 139
                                </span>
                              </div>
                              <input
                                value={profileAbout}
                                onChange={e => setProfileAbout(e.target.value.substring(0, 139))}
                                disabled={!isRegistered}
                                placeholder={isRegistered ? "e.g. Hello there! We are on WhatsApp." : "Registering number... profile settings locked."}
                                className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#6D4AFF]/5 focus:border-[#6D4AFF] focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                              />
                            </div>

                            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-700">
                              <button
                                onClick={handleUpdateProfile}
                                disabled={isSavingProfile || isFetchingProfile || !isRegistered}
                                className="btn-premium-gradient"
                              >
                                {isSavingProfile ? (
                                  <><Loader2 size={13} className="animate-spin mr-1" /> Saving Details…</>
                                ) : (
                                  <><Save size={13} className="mr-1" /> Update Profile Info</>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Mockup: Live Preview */}
                  <div className="hidden md:flex flex-col items-center space-y-4 self-stretch shrink-0">
                    <p className="text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-widest">WhatsApp Device Preview</p>
                    
                    {/* Mockup Frame */}
                    <div className="w-[290px] h-[510px] bg-slate-900 rounded-[36px] border-[6px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col font-sans text-slate-800 shrink-0 select-none">
                      {/* Speaker / Camera bar */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-800 rounded-b-xl z-20 flex items-center justify-center">
                        <div className="w-10 h-1 bg-slate-900 rounded-full" />
                      </div>
                      
                      {/* Screen Header */}
                      <div className="bg-[#075E54] text-white pt-7 pb-2.5 px-3 flex items-center justify-between shadow shrink-0">
                        <div className="flex items-center gap-1.5">
                          <ArrowRight className="rotate-180 text-white/80" size={15} />
                          <span className="font-bold text-xs">Business details</span>
                        </div>
                        <div className="flex gap-2.5 text-white/80">
                          <MessageSquare size={13} />
                          <Globe size={13} />
                        </div>
                      </div>
                      
                      {/* Screen Body */}
                      <div className="flex-1 bg-[#ECE5DD] overflow-y-auto custom-scrollbar p-2.5 space-y-2.5">
                        
                        {/* Profile Info Card */}
                        <div className="bg-white rounded-lg shadow-sm p-3.5 flex flex-col items-center text-center space-y-2.5 border border-slate-200/50">
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
                        <div className="bg-white rounded-lg shadow-sm p-3.5 space-y-2.5 border border-slate-200/50 text-left">
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
                        <div className="bg-white rounded-lg shadow-sm p-3 border border-slate-200/50 text-left">
                          <span className="text-[8px] font-black text-slate-400 tracking-wide block mb-1.5">Live Message Box</span>
                          <div className="p-2 bg-[#E1FFC7] rounded-lg shadow-sm border border-slate-200/30 max-w-[85%] ml-auto text-right">
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
                <div className="premium-card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/30 text-[#6D4AFF]">
                      <Bot size={16} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">AI Auto-Reply Configuration</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Configure your OpenAI model to reply automatically to incoming messages</p>
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Universal OpenAI Status Banner */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <Sparkles size={16} />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">Universal Platform OpenAI Key Active</h4>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full">One Key For All Vendors</span>
                        </div>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-300 leading-relaxed font-medium">
                          OpenAI is centrally configured on the server for all vendors. You do not need to purchase or connect an OpenAI account. Simply specify your business information and FAQs below!
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
                          className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#6D4AFF]/5 focus:border-[#6D4AFF] focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Provide all details the AI needs to answer questions about pricing, features, support, hours, etc.</p>
                      </div>

                      <div>
                        <FieldLabel>Custom OpenAI API Key (Optional Override)</FieldLabel>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6D4AFF] transition-colors" size={15} />
                          <input
                            type="password"
                            value={openaiKey}
                            onChange={e => setOpenaiKey(e.target.value)}
                            placeholder={openaiKey && openaiKey.includes('•') ? '••••••••••••••••••••••••' : 'Using Universal Platform Key'}
                            className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#6D4AFF]/5 focus:border-[#6D4AFF] focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Leave empty to use the platform's universal OpenAI key shared across all vendors.</p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSaveAiSettings}
                        disabled={isSavingAi}
                        className="px-5 py-2.5 bg-[#6D4AFF] hover:bg-[#5a3ae6] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#6D4AFF]/10 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

              {/* Sidebar Guide */}
              <div className="space-y-6">
                <div className="premium-card bg-gradient-to-br from-indigo-50/30 to-purple-50/30 dark:from-indigo-950/10 dark:to-purple-950/10 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">How it works</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-extrabold">1</div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Universal OpenAI Active</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Central platform OpenAI (gpt-4o-mini) is shared for all vendors automatically.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-[#6D4AFF] flex items-center justify-center shrink-0 text-xs font-extrabold">2</div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Provide Company Idea</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Describe your business, services, pricing, and FAQ. This prompt will serve as the AI's knowledge base.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-[#6D4AFF] flex items-center justify-center shrink-0 text-xs font-extrabold">3</div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Auto-Reply is ON</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Once you save the company prompt, auto-reply starts working automatically for conversations.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-[#6D4AFF] flex items-center justify-center shrink-0 text-xs font-extrabold">4</div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Toggle Per Chat</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Open any chat window in the Inbox. Toggle AI Auto-reply ON or OFF for each conversation as needed.</p>
                      </div>
                    </div>
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
                <div className="premium-card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isConnected ? 'bg-indigo-50 dark:bg-indigo-950/30 text-[#6D4AFF]' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}>
                      <Send size={16} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">Test Sandbox Console</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Trigger test messages to verify API connection logs</p>
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    {!isConnected && (
                      <div className="flex items-center gap-2.5 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 rounded-xl">
                        <AlertTriangle size={15} className="text-amber-500 shrink-0" />
                        <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                          Please connect your API credentials first to enable test sandbox messages.
                        </p>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <FieldLabel required>Test Recipient Phone Number</FieldLabel>
                        <div className="relative group">
                          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6D4AFF] transition-colors" size={15} />
                          <input
                            id="test-phone-number"
                            value={testPhone}
                            onChange={e => setTestPhone(e.target.value)}
                            placeholder="e.g. +923001234567"
                            disabled={!isConnected}
                            className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#6D4AFF]/5 focus:border-[#6D4AFF] focus:bg-white dark:focus:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 ml-1">Use international format starting with country code (no + sign or zeroes needed for Meta Sandbox)</p>
                      </div>

                      {/* Mock log display terminal */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Sandbox Dispatch Logs</label>
                        <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2 border border-slate-900 shadow-inner">
                          <div className="flex items-center justify-between text-[9px] text-slate-500 border-b border-slate-900 pb-2 mb-2 font-sans font-bold uppercase tracking-wider">
                            <span>API Console Terminal</span>
                            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                          </div>
                          {isTesting ? (
                            <div className="space-y-1">
                              <p className="text-[#6D4AFF] animate-pulse">&gt; Preparing request payload (text message: "Hello from CRM! Connection verified successfully")...</p>
                              <p className="text-slate-400">&gt; Target WABA ID: {form.businessAccountId}</p>
                              <p className="text-slate-400">&gt; Target Phone ID: {form.phoneNumberId}</p>
                              <p className="text-amber-500 animate-pulse">&gt; Executing POST request to graph.facebook.com/v21.0/{form.phoneNumberId}/messages...</p>
                            </div>
                          ) : (
                            <div className="space-y-1 text-slate-400">
                              <p className="text-slate-500">// Ready to trigger test dispatch.</p>
                              <p>&gt; Connection Status: {status.toUpperCase()}</p>
                              {testPhone && <p className="text-indigo-400">&gt; Target Phone: {testPhone}</p>}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                        <button
                          id="test-whatsapp-connection"
                          onClick={handleTest}
                          disabled={isTesting || !isConnected || !testPhone.trim()}
                          className="w-full btn-premium-primary"
                        >
                          {isTesting ? (
                            <><Loader2 size={15} className="animate-spin mr-1" /> Sending Test Message…</>
                          ) : (
                            <><Send size={15} className="mr-1" /> Dispatch Sandbox Message</>
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
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-350 rounded-lg flex items-center justify-center">
                      <Globe size={15} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">Webhook Config</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Values to configure in Meta App dashboard</p>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <CopyField label="Callback URL" value={WEBHOOK_URL}  fieldKey="webhookUrl"  copied={copied} onCopy={copy} />
                    <CopyField label="Verify Token" value={VERIFY_TOKEN} fieldKey="verifyToken" copied={copied} onCopy={copy} />

                    <div className="flex items-start gap-3 p-4 bg-blue-50/80 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                      <Info size={15} className="text-blue-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">How to configure webhooks</p>
                        <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
                          In your Meta app, go to <strong>WhatsApp › Configuration</strong>, click <strong>Edit</strong>, 
                          paste the Callback URL and Verify Token above, then subscribe to <strong>messages</strong> events.
                        </p>
                        <a
                          href="https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-500 hover:underline mt-1"
                        >
                          Meta Webhook Docs <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Setup Checklist */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60">
                    <div className="w-8 h-8 bg-[#6D4AFF] text-white rounded-lg flex items-center justify-center shadow-sm">
                      <ArrowRight size={15} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">Quick Setup Checklist</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Steps to complete integration</p>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    {STEPS.map((step, idx) => (
                      <div key={step.num} className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${
                          isConnected && idx < 3
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                        }`}>
                          {isConnected && idx < 3 ? <CheckCircle2 size={13} /> : step.num}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-white">{step.label}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-5 pb-5">
                    <a
                      href="https://developers.facebook.com/apps/"
                      target="_blank"
                      rel="noreferrer"
                      className="btn-premium-secondary w-full text-center"
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
