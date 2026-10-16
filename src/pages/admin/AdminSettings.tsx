import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Loader2,
  Mail,
  Globe,
  Search,
  Send,
  Image as ImageIcon,
  X,
  Activity,
  FileClock,
  Database,
  Trash2,
  Cpu,
  RefreshCw,
  Terminal,
  Clock,
  User,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Info,
  Server,
  Zap,
  Lock,
  Smartphone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { crmApi } from '../../services/crmApi';
import { useBrandingStore } from '../../store/brandingStore';

interface SettingItem {
  id: number;
  key: string;
  value: string | null;
  group: string;
  type: string;
}

interface AuditLogItem {
  id: number;
  action: string;
  key: string;
  old_value: string | null;
  new_value: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user?: {
    name: string;
    email: string;
  } | null;
}

const ALL_TIMEZONES = typeof Intl !== 'undefined' && typeof Intl.supportedValuesOf === 'function'
  ? Intl.supportedValuesOf('timeZone')
  : [
      'UTC', 'Asia/Karachi', 'Asia/Riyadh', 'America/New_York', 'Europe/London', 
      'Europe/Paris', 'Asia/Dubai', 'Asia/Singapore', 'Asia/Tokyo', 'Australia/Sydney'
    ];

type TabType = 'general' | 'contact' | 'smtp' | 'diagnostics' | 'audit';

export default function AdminSettings() {
  const loadBranding = useBrandingStore(state => state.loadBranding);
  const [settings, setSettings] = useState<Record<string, SettingItem[]>>({});
  const [flatSettings, setFlatSettings] = useState<SettingItem[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});

  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  // SMTP Test Email modal
  const [isSmtpModalOpen, setIsSmtpModalOpen] = useState(false);
  const [testRecipient, setTestRecipient] = useState('');
  const [smtpTesting, setSmtpTesting] = useState(false);
  const [smtpStatus, setSmtpStatus] = useState<'success' | 'error' | null>(null);
  const [smtpError, setSmtpError] = useState<string | null>(null);

  // Diagnostics actions state
  const [clearingCache, setClearingCache] = useState(false);
  const [optimizingSystem, setOptimizingSystem] = useState(false);
  const [diagActionStatus, setDiagActionStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Audit trail state
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [auditPage, setAuditPage] = useState(1);
  const [auditLastPage, setAuditLastPage] = useState(1);
  const [auditTotal, setAuditTotal] = useState(0);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [errorAudit, setErrorAudit] = useState<string | null>(null);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await crmApi.getSystemSettings();
      if (res.success) {
        setSettings(res.settings);
        const flat: SettingItem[] = [];
        const initialValues: Record<string, string> = {};
        
        Object.values(res.settings).forEach((groupList: any) => {
          groupList.forEach((item: SettingItem) => {
            flat.push(item);
            initialValues[item.key] = item.value || '';
          });
        });
        
        setFlatSettings(flat);
        setValues(initialValues);
      }
    } catch (err) {
      console.error('Failed to load system settings', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAuditLogs = async (p: number) => {
    setLoadingAudit(true);
    setErrorAudit(null);
    try {
      const res = await crmApi.getSettingsAuditLogs(p);
      if (res.success) {
        setAuditLogs(res.logs.data || []);
        setAuditPage(res.logs.current_page || 1);
        setAuditLastPage(res.logs.last_page || 1);
        setAuditTotal(res.logs.total || 0);
      } else {
        setErrorAudit('Failed to retrieve change logs.');
      }
    } catch (err) {
      console.error(err);
      setErrorAudit('API connection timed out.');
    } finally {
      setLoadingAudit(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (activeTab === 'audit') {
      loadAuditLogs(auditPage);
    }
  }, [activeTab, auditPage]);

  const handleFieldChange = (key: string, val: string) => {
    setValues(prev => ({ ...prev, [key]: val }));
  };

  const handleFileChange = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFiles(prev => ({ ...prev, [key]: file }));
    setPreviews(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveStatus(null);

    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      const settingItem = flatSettings.find(item => item.key === k);
      if (settingItem?.type === 'file') {
        return;
      }
      const requestKey = k.replace(/\./g, '_');
      formData.append(requestKey, v as string);
    });

    Object.entries(files).forEach(([k, file]) => {
      const requestKey = k.replace(/\./g, '_');
      formData.append(requestKey, file as File);
    });

    try {
      const res = await crmApi.updateSystemSettings(formData);
      if (res.success) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(null), 2500);
        loadSettings();
        loadBranding();
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestSmtp = async (e: FormEvent) => {
    e.preventDefault();
    setSmtpTesting(true);
    setSmtpStatus(null);
    setSmtpError(null);

    try {
      const payload = {
        smtp_host: values['email.smtp_host'],
        smtp_port: values['email.smtp_port'],
        smtp_username: values['email.smtp_username'],
        smtp_password: values['email.smtp_password'],
        smtp_encryption: values['email.smtp_encryption'],
        sender_name: values['email.sender_name'],
        sender_email: values['email.sender_email'],
        test_recipient: testRecipient
      };

      const res = await crmApi.testSmtpConnection(payload);
      if (res.success) {
        setSmtpStatus('success');
        setTimeout(() => {
          setIsSmtpModalOpen(false);
          setTestRecipient('');
          setSmtpStatus(null);
        }, 2000);
      } else {
        throw new Error(res.message);
      }
    } catch (err: any) {
      console.error(err);
      setSmtpStatus('error');
      setSmtpError(err.message || 'SMTP Handshake rejected.');
    } finally {
      setSmtpTesting(false);
    }
  };

  const handleClearCache = async () => {
    setClearingCache(true);
    setDiagActionStatus(null);
    try {
      const res = await crmApi.clearSystemCache();
      if (res.success) {
        setDiagActionStatus({ type: 'success', message: 'Application route, configuration, and view cache flushed successfully!' });
      } else {
        throw new Error(res.message);
      }
    } catch (err: any) {
      setDiagActionStatus({ type: 'error', message: err.message || 'Failed to clear system cache.' });
    } finally {
      setClearingCache(false);
      setTimeout(() => setDiagActionStatus(null), 4000);
    }
  };

  const handleOptimizeSystem = async () => {
    setOptimizingSystem(true);
    setDiagActionStatus(null);
    try {
      const res = await crmApi.optimizeSystem();
      if (res.success) {
        setDiagActionStatus({ type: 'success', message: 'Core system optimized. Compiled route and configuration files loaded successfully!' });
      } else {
        throw new Error(res.message);
      }
    } catch (err: any) {
      setDiagActionStatus({ type: 'error', message: err.message || 'Failed to optimize core system.' });
    } finally {
      setOptimizingSystem(false);
      setTimeout(() => setDiagActionStatus(null), 4000);
    }
  };

  // Filter settings based on search query
  const filteredSettings = flatSettings.filter(item => {
    if (item.group !== 'general' && item.group !== 'contact' && item.group !== 'email') {
      return false;
    }
    const label = item.key.replace(/\./g, ' ').toUpperCase();
    return label.includes(searchQuery.toUpperCase()) || (item.value || '').toUpperCase().includes(searchQuery.toUpperCase());
  });

  const getActionBadgeColor = (action: string) => {
    if (action.includes('delete') || action.includes('revoke')) return 'bg-rose-50 border-rose-100 text-rose-600';
    if (action.includes('create') || action.includes('add')) return 'bg-emerald-50 border-emerald-100 text-emerald-600';
    return 'bg-blue-50 border-blue-100 text-blue-600';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 size={32} className="animate-spin text-[#166534]" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Querying SaaS settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl pb-16">
      {/* Header section with atmospheric mesh pattern */}
      <div className="relative overflow-hidden bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-[#166534]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 -mb-16 w-48 h-48 bg-[#166534]/10 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 text-xs text-[#22C55E] font-bold tracking-widest uppercase mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span>Gateway Administrator</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">SaaS Settings Management</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Configure global workspace parameters, SMTP relay connections, and audit logging parameters. All operations are signed and tracked.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl shrink-0 backdrop-blur-md">
            <ShieldCheck size={16} className="text-[#22C55E]" />
            <div className="text-left select-none">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gate Status</p>
              <p className="text-xs font-black text-white leading-none mt-0.5 uppercase tracking-wide">
                Audit Trail Active
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Control bar with tab switches and search query */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col xl:flex-row items-center justify-between gap-4 shadow-sm">
        
        {/* Search Input */}
        <div className="relative w-full xl:max-w-xs">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search key or value..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/60 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all"
          />
        </div>

        {/* Tab triggers */}
        {!searchQuery ? (
          <div className="flex flex-wrap gap-1.5 self-start xl:self-auto">
            {[
              { id: 'general', label: 'General & SEO', icon: Globe },
              { id: 'contact', label: 'Contact coordinates', icon: Mail },
              { id: 'smtp', label: 'SMTP Email Configuration', icon: Send },
              { id: 'diagnostics', label: 'Diagnostics Health', icon: Activity },
              { id: 'audit', label: 'Audit Logs Trail', icon: FileClock }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-3.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#166534] text-white shadow-md shadow-[#166534]/15'
                    : 'bg-slate-50 hover:bg-[#F0FDF4] border border-slate-200/80 text-slate-600 hover:text-[#166534] hover:border-[#bbf7d0]'
                }`}
              >
                <tab.icon size={13} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 rounded-xl transition-all self-start xl:self-auto cursor-pointer"
          >
            Reset filter
          </button>
        )}
      </div>

      {/* Audit Action Banner */}
      <AnimatePresence>
        {diagActionStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl border flex items-start gap-3 shadow-sm ${
              diagActionStatus.type === 'success' 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                : 'bg-rose-50 border-rose-100 text-rose-800'
            }`}
          >
            {diagActionStatus.type === 'success' ? <CheckCircle size={18} className="shrink-0 mt-0.5" /> : <AlertCircle size={18} className="shrink-0 mt-0.5" />}
            <div>
              <p className="text-xs font-bold leading-normal">{diagActionStatus.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Configurations Container */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
        
        {searchQuery ? (
          /* Search Matches View */
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Active Filtered Results</h3>
              <p className="text-xs text-slate-450 mt-0.5">Showing keys matching search parameters</p>
            </div>
            <div className="w-full h-px bg-slate-100" />
            {filteredSettings.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">No matching config items found</div>
            ) : (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredSettings.map(item => (
                    <div key={item.id} className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">{item.key.replace(/\./g, ' ')}</label>
                      <input
                        type="text"
                        value={values[item.key] || ''}
                        onChange={(e) => handleFieldChange(item.key, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all"
                      />
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
                  <div />
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-[#166534] hover:bg-[#14532d] text-xs font-bold text-white rounded-xl transition-all flex items-center gap-2 shadow-sm hover:shadow-[#166534]/15 active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {saving && <Loader2 size={13} className="animate-spin" />}
                    <span>Save Configurations</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* Tabbed standard layouts */
          <div className="p-6 md:p-8">
            
            {/* 1. GENERAL TAB */}
            {activeTab === 'general' && (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-[#F0FDF4] flex items-center justify-center text-[#166534] border border-[#bbf7d0]/50 shadow-inner">
                    <Globe size={18} />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">General settings & SEO</h3>
                    <p className="text-xs text-slate-450 mt-0.5">Define site-wide titles, favicons, active currencies, and maintenance state indicators.</p>
                  </div>
                </div>
                <div className="w-full h-px bg-slate-100" />

                {/* Logo & Favicon uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Logo Card */}
                  <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex items-center gap-4 hover:border-slate-200 transition-colors">
                    <div className="w-16 h-16 bg-white border border-slate-200/80 rounded-xl flex items-center justify-center text-slate-400 overflow-hidden shadow-inner relative">
                      {previews['general.website_logo'] || values['general.website_logo'] ? (
                        <img src={previews['general.website_logo'] || values['general.website_logo']} alt="Logo" className="w-full h-full object-contain p-1" />
                      ) : (
                        <ImageIcon size={24} />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-800">Website Identity Logo</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">PNG or SVG, light theme format.</p>
                      <label className="mt-2.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-350 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-650 hover:bg-slate-50 cursor-pointer shadow-sm inline-block transition-colors">
                        Select Asset
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange('general.website_logo', e)} />
                      </label>
                    </div>
                  </div>

                  {/* Favicon Card */}
                  <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex items-center gap-4 hover:border-slate-200 transition-colors">
                    <div className="w-16 h-16 bg-white border border-slate-200/80 rounded-xl flex items-center justify-center text-slate-400 overflow-hidden shadow-inner relative">
                      {previews['general.website_favicon'] || values['general.website_favicon'] ? (
                        <img src={previews['general.website_favicon'] || values['general.website_favicon']} alt="Favicon" className="w-full h-full object-contain p-2" />
                      ) : (
                        <ImageIcon size={24} />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-800">Browser Favicon Icon</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Strict square format, PNG/ICO.</p>
                      <label className="mt-2.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-350 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-650 hover:bg-slate-50 cursor-pointer shadow-sm inline-block transition-colors">
                        Select Icon
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange('general.website_favicon', e)} />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Text fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">Website Title Name</label>
                    <input
                      type="text"
                      value={values['general.website_name'] || ''}
                      onChange={(e) => handleFieldChange('general.website_name', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">Metadata Header Title</label>
                    <input
                      type="text"
                      value={values['general.website_title'] || ''}
                      onChange={(e) => handleFieldChange('general.website_title', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">Metadata SEO Description</label>
                  <textarea
                    rows={3}
                    value={values['general.website_description'] || ''}
                    onChange={(e) => handleFieldChange('general.website_description', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest font-sans">Timezone Coordinates</label>
                    <select
                      value={values['general.timezone'] || 'UTC'}
                      onChange={(e) => handleFieldChange('general.timezone', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-sans"
                    >
                      {ALL_TIMEZONES.map(tz => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">System Date Format</label>
                    <select
                      value={values['general.date_format'] || 'Y-m-d'}
                      onChange={(e) => handleFieldChange('general.date_format', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-mono"
                    >
                      <option value="Y-m-d">YYYY-MM-DD (e.g. 2026-06-22)</option>
                      <option value="d-m-Y">DD-MM-YYYY (e.g. 22-06-2026)</option>
                      <option value="m/d/Y">MM/DD/YYYY (e.g. 06/22/2026)</option>
                      <option value="F j, Y">Month Day, YYYY (e.g. June 22, 2026)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">Active Localization Language</label>
                    <select
                      value={values['general.website_language'] || 'en'}
                      onChange={(e) => handleFieldChange('general.website_language', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-sans"
                    >
                      <option value="en">English (US)</option>
                      <option value="es">Español (ES)</option>
                      <option value="fr">Français (FR)</option>
                      <option value="ur">اردو (PK)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">Global Currency standard</label>
                    <select
                      value={values['general.currency_code'] || 'USD'}
                      onChange={(e) => handleFieldChange('general.currency_code', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-sans"
                    >
                      <option value="PKR">PKR (Rs.)</option>
                      <option value="SAR">SAR (ر.س)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">Footer Copyright parameter</label>
                    <input
                      type="text"
                      value={values['general.footer_copyright'] || ''}
                      onChange={(e) => handleFieldChange('general.footer_copyright', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all"
                    />
                  </div>
                </div>

                {/* Maintenance Toggle */}
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#166534]" />
                      <p className="text-xs font-extrabold text-slate-900">System Maintenance Mode</p>
                    </div>
                    <p className="text-[10px] text-slate-450 mt-0.5 leading-relaxed">
                      Lock workspace logins temporarily. The system will serve a static maintenance page during the upgrade window.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleFieldChange('general.maintenance_mode', values['general.maintenance_mode'] === 'true' ? 'false' : 'true')}
                    className={`relative inline-flex h-6.5 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      values['general.maintenance_mode'] === 'true' ? 'bg-[#166534]' : 'bg-slate-250'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        values['general.maintenance_mode'] === 'true' ? 'translate-x-5.5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Action Row */}
                <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
                  <div>
                    {saveStatus === 'success' && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle size={14} /> Site settings committed
                      </span>
                    )}
                    {saveStatus === 'error' && (
                      <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} /> Failed to commit variables
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={saving || saveStatus === 'success'}
                    className="px-5 py-2.5 bg-[#166534] hover:bg-[#14532d] text-xs font-bold text-white rounded-xl transition-all flex items-center gap-2 shadow-sm hover:shadow-[#166534]/15 active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {saving && <Loader2 size={13} className="animate-spin text-white" />}
                    <span>Save general changes</span>
                  </button>
                </div>
              </form>
            )}

            {/* 2. CONTACT TAB */}
            {activeTab === 'contact' && (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-[#F0FDF4] flex items-center justify-center text-[#166534] border border-[#bbf7d0]/50 shadow-inner">
                    <Mail size={18} />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Contact & social parameters</h3>
                    <p className="text-xs text-slate-450 mt-0.5">Control organization details, phone lines, social handles, and Google maps embeds.</p>
                  </div>
                </div>
                <div className="w-full h-px bg-slate-100" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">Organization Name</label>
                    <input
                      type="text"
                      value={values['contact.company_name'] || ''}
                      onChange={(e) => handleFieldChange('contact.company_name', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">Public Contact Email</label>
                    <input
                      type="email"
                      value={values['contact.contact_email'] || ''}
                      onChange={(e) => handleFieldChange('contact.contact_email', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">Technical Support Email</label>
                    <input
                      type="email"
                      value={values['contact.support_email'] || ''}
                      onChange={(e) => handleFieldChange('contact.support_email', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">Phone Hot-line</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                      <input
                        type="text"
                        value={values['contact.phone_number'] || ''}
                        onChange={(e) => handleFieldChange('contact.phone_number', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">WhatsApp Support Line</label>
                    <div className="relative">
                      <Send className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                      <input
                        type="text"
                        value={values['contact.whatsapp_number'] || ''}
                        onChange={(e) => handleFieldChange('contact.whatsapp_number', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">Physical Head Office Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 text-slate-400" size={13} />
                      <textarea
                        rows={3}
                        value={values['contact.physical_address'] || ''}
                        onChange={(e) => handleFieldChange('contact.physical_address', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">Google Maps Embed link</label>
                    <textarea
                      rows={3}
                      value={values['contact.google_maps_embed'] || ''}
                      onChange={(e) => handleFieldChange('contact.google_maps_embed', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="w-full h-px bg-slate-100" />
                <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-widest select-none flex items-center gap-1.5">
                  <Globe size={12} />
                  <span>Social Media Network Handles</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Facebook */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Facebook</label>
                    <div className="relative">
                      <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                      <input
                        type="text"
                        value={values['social.facebook'] || ''}
                        onChange={(e) => handleFieldChange('social.facebook', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Instagram</label>
                    <div className="relative">
                      <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                      <input
                        type="text"
                        value={values['social.instagram'] || ''}
                        onChange={(e) => handleFieldChange('social.instagram', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">LinkedIn</label>
                    <div className="relative">
                      <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                      <input
                        type="text"
                        value={values['social.linkedin'] || ''}
                        onChange={(e) => handleFieldChange('social.linkedin', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* Twitter */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Twitter / X</label>
                    <div className="relative">
                      <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                      <input
                        type="text"
                        value={values['social.twitter'] || ''}
                        onChange={(e) => handleFieldChange('social.twitter', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* YouTube */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">YouTube</label>
                    <div className="relative">
                      <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                      <input
                        type="text"
                        value={values['social.youtube'] || ''}
                        onChange={(e) => handleFieldChange('social.youtube', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* TikTok */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">TikTok</label>
                    <div className="relative">
                      <Send className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                      <input
                        type="text"
                        value={values['social.tiktok'] || ''}
                        onChange={(e) => handleFieldChange('social.tiktok', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Row */}
                <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
                  <div>
                    {saveStatus === 'success' && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle size={14} /> Contact configurations committed
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={saving || saveStatus === 'success'}
                    className="px-5 py-2.5 bg-[#166534] hover:bg-[#14532d] text-xs font-bold text-white rounded-xl transition-all flex items-center gap-2 shadow-sm hover:shadow-[#166534]/15 active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {saving && <Loader2 size={13} className="animate-spin text-white" />}
                    <span>Save Contact Changes</span>
                  </button>
                </div>
              </form>
            )}

            {/* 3. SMTP TAB */}
            {activeTab === 'smtp' && (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-[#F0FDF4] flex items-center justify-center text-[#166534] border border-[#bbf7d0]/50 shadow-inner">
                      <Send size={18} />
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">SMTP dispatch mailer</h3>
                      <p className="text-xs text-slate-450 mt-0.5">Customize global SMTP delivery endpoints and run diagnostic handshakes.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSmtpModalOpen(true)}
                    className="px-4 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold transition-all hover:shadow-[#166534]/15 cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Send size={13} />
                    <span>Send Test Email</span>
                  </button>
                </div>
                <div className="w-full h-px bg-slate-100" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">SMTP Relay Host</label>
                    <input
                      type="text"
                      value={values['email.smtp_host'] || ''}
                      onChange={(e) => handleFieldChange('email.smtp_host', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">SMTP Target Port</label>
                    <input
                      type="text"
                      value={values['email.smtp_port'] || ''}
                      onChange={(e) => handleFieldChange('email.smtp_port', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">Authentication Username</label>
                    <input
                      type="text"
                      value={values['email.smtp_username'] || ''}
                      onChange={(e) => handleFieldChange('email.smtp_username', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest font-sans">Authentication Passphrase</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                      <input
                        type="password"
                        value={values['email.smtp_password'] || ''}
                        onChange={(e) => handleFieldChange('email.smtp_password', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">Encryption Protocol</label>
                    <select
                      value={values['email.smtp_encryption'] || 'tls'}
                      onChange={(e) => handleFieldChange('email.smtp_encryption', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-sans"
                    >
                      <option value="tls">TLS Protocol</option>
                      <option value="ssl">SSL Protocol</option>
                      <option value="none">Unencrypted Connection</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">Sender Display Name</label>
                    <input
                      type="text"
                      value={values['email.sender_name'] || ''}
                      onChange={(e) => handleFieldChange('email.sender_name', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">Sender Dispatch Email</label>
                    <input
                      type="email"
                      value={values['email.sender_email'] || ''}
                      onChange={(e) => handleFieldChange('email.sender_email', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Action Row */}
                <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
                  <div>
                    {saveStatus === 'success' && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle size={14} /> Mail configurations updated
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={saving || saveStatus === 'success'}
                    className="px-5 py-2.5 bg-[#166534] hover:bg-[#14532d] text-xs font-bold text-white rounded-xl transition-all flex items-center gap-2 shadow-sm hover:shadow-[#166534]/15 active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {saving && <Loader2 size={13} className="animate-spin text-white" />}
                    <span>Save SMTP Changes</span>
                  </button>
                </div>
              </form>
            )}

            {/* 4. DIAGNOSTICS HEALTH TAB */}
            {activeTab === 'diagnostics' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-[#F0FDF4] flex items-center justify-center text-[#166534] border border-[#bbf7d0]/50 shadow-inner">
                    <Activity size={18} />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">System Health & Telemetry</h3>
                    <p className="text-xs text-slate-450 mt-0.5">Flush routes configurations cache files and optimize core database autoloader operations.</p>
                  </div>
                </div>
                <div className="w-full h-px bg-slate-100" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Flush cache */}
                  <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-250 transition-all shadow-sm">
                    <div className="space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                        <Trash2 size={16} />
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Flush System Caches</h4>
                      <p className="text-[11px] text-slate-450 leading-relaxed font-medium">
                        Triggers clear parameters across Laravel routes, application configurations, views compiling buffers, and global cache tables.
                      </p>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={handleClearCache}
                        disabled={clearingCache}
                        className="w-full py-2.5 border border-orange-550/20 bg-orange-50 hover:bg-orange-100 text-orange-650 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                      >
                        {clearingCache ? (
                          <Loader2 size={13} className="animate-spin text-orange-600" />
                        ) : (
                          <RefreshCw size={13} />
                        )}
                        <span>Flush Application Cache</span>
                      </button>
                    </div>
                  </div>

                  {/* Optimize Autoloaders */}
                  <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-250 transition-all shadow-sm">
                    <div className="space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                        <Zap size={16} />
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Run System Optimization</h4>
                      <p className="text-[11px] text-slate-450 leading-relaxed font-medium">
                        Compiles application config variables and routes tables into static cache structures for accelerated framework dispatch velocities.
                      </p>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={handleOptimizeSystem}
                        disabled={optimizingSystem}
                        className="w-full py-2.5 border border-emerald-500/20 bg-emerald-55/10 hover:bg-emerald-50 text-emerald-650 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                      >
                        {optimizingSystem ? (
                          <Loader2 size={13} className="animate-spin text-emerald-600" />
                        ) : (
                          <Cpu size={13} />
                        )}
                        <span>Run Optimization Tasks</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Checklist Diagnostic details */}
                <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 select-none">
                    <Server size={13} />
                    <span>Real-time Host environment diagnostics</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold">
                    <div className="bg-white border border-slate-150 p-4 rounded-xl flex items-center justify-between">
                      <span className="text-slate-500">Database Connection</span>
                      <span className="text-emerald-600 flex items-center gap-1"><CheckCircle size={13} /> OK</span>
                    </div>
                    <div className="bg-white border border-slate-150 p-4 rounded-xl flex items-center justify-between">
                      <span className="text-slate-500">WebSocket Broadcasts</span>
                      <span className="text-emerald-600 flex items-center gap-1"><CheckCircle size={13} /> ACTIVE</span>
                    </div>
                    <div className="bg-white border border-slate-150 p-4 rounded-xl flex items-center justify-between">
                      <span className="text-slate-500">SMTP Handshake Dispatch</span>
                      <span className="text-emerald-600 flex items-center gap-1"><CheckCircle size={13} /> READY</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. AUDIT LOGS TAB */}
            {activeTab === 'audit' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-[#F0FDF4] flex items-center justify-center text-[#166534] border border-[#bbf7d0]/50 shadow-inner">
                      <FileClock size={18} />
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Configuration change audit trail</h3>
                      <p className="text-xs text-slate-450 mt-0.5">Chronological ledger of security parameters updates, SMTP alterations, and site config edits.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => loadAuditLogs(1)}
                    disabled={loadingAudit}
                    className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {loadingAudit ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={12} />}
                    <span>Reload Trail</span>
                  </button>
                </div>
                <div className="w-full h-px bg-slate-100" />

                {loadingAudit && auditLogs.length === 0 ? (
                  <div className="py-16 text-center flex flex-col items-center gap-2">
                    <Loader2 size={24} className="animate-spin text-[#166534]" />
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Reading change logs ledger...</p>
                  </div>
                ) : errorAudit ? (
                  <div className="py-12 text-center text-red-500 text-xs font-semibold">{errorAudit}</div>
                ) : auditLogs.length === 0 ? (
                  <div className="py-12 text-center text-slate-450 text-xs font-semibold">No change parameters cataloged yet.</div>
                ) : (
                  <div className="space-y-4">
                    {/* Log table */}
                    <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm bg-white">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest select-none">
                              <th className="py-4 px-6">Identity</th>
                              <th className="py-4 px-6">Parameter Changed</th>
                              <th className="py-4 px-6">Operation</th>
                              <th className="py-4 px-6">Previous State</th>
                              <th className="py-4 px-6">Committed State</th>
                              <th className="py-4 px-6">Device Coordinates</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {auditLogs.map((log) => (
                              <tr key={log.id} className="hover:bg-slate-50/30 transition-colors text-xs font-medium">
                                <td className="py-4.5 px-6">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-[#F0FDF4] text-[#166534] flex items-center justify-center font-extrabold text-[10px]">
                                      <User size={13} />
                                    </div>
                                    <div>
                                      <p className="font-extrabold text-slate-900 leading-none">{log.user?.name || 'System Operator'}</p>
                                      <p className="text-[9px] text-slate-450 font-semibold mt-1 font-mono">{log.user?.email || 'console@daemon'}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4.5 px-6 font-mono text-[10px] text-[#166534]">
                                  <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-100">
                                    {log.key}
                                  </span>
                                </td>
                                <td className="py-4.5 px-6">
                                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border leading-none ${getActionBadgeColor(log.action)}`}>
                                    {log.action}
                                  </span>
                                </td>
                                <td className="py-4.5 px-6 text-slate-400 font-semibold truncate max-w-[120px] font-mono text-[10px] italic">
                                  {log.old_value !== null ? (
                                    <span className="line-through text-rose-500/80 bg-rose-50 border border-rose-100/50 px-1.5 py-0.5 rounded">
                                      {log.old_value}
                                    </span>
                                  ) : (
                                    <span className="text-slate-350">empty</span>
                                  )}
                                </td>
                                <td className="py-4.5 px-6 text-slate-800 font-extrabold truncate max-w-[120px] font-mono text-[10px]">
                                  {log.new_value !== null ? (
                                    <span className="text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-1.5 py-0.5 rounded">
                                      {log.new_value}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400">revoked</span>
                                  )}
                                </td>
                                <td className="py-4.5 px-6">
                                  <div>
                                    <p className="text-[10px] font-black text-slate-850 font-mono tracking-tight">{log.ip_address || 'unknown'}</p>
                                    <p className="text-[9px] text-slate-400 font-medium truncate max-w-[150px] mt-0.5" title={log.user_agent || ''}>
                                      {log.user_agent || 'unknown OS'}
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Pagination */}
                    {auditLastPage > 1 && (
                      <div className="bg-slate-50 border border-slate-100 px-6 py-4.5 rounded-2xl flex items-center justify-between shadow-sm">
                        <span className="text-xs font-semibold text-slate-500">
                          Showing audit page <strong className="text-slate-800">{auditPage}</strong> of <strong className="text-slate-800">{auditLastPage}</strong> ({auditTotal} entries logged)
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            disabled={auditPage === 1}
                            onClick={() => setAuditPage(prev => Math.max(prev - 1, 1))}
                            className="w-8.5 h-8.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center cursor-pointer text-slate-650 transition-all active:scale-95"
                          >
                            <ChevronLeft size={15} />
                          </button>
                          <button
                            disabled={auditPage === auditLastPage}
                            onClick={() => setAuditPage(prev => Math.min(prev + 1, auditLastPage))}
                            className="w-8.5 h-8.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center cursor-pointer text-slate-650 transition-all active:scale-95"
                          >
                            <ChevronRight size={15} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>

      {/* SMTP Test Connection Form Modal */}
      <AnimatePresence>
        {isSmtpModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => !smtpTesting && setIsSmtpModalOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-sm bg-white border border-slate-250 rounded-3xl shadow-2xl overflow-hidden z-[110]"
            >
              <form onSubmit={handleSendTestSmtp} className="flex flex-col">
                <div className="bg-slate-55 border-b border-slate-100 p-5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8.5 h-8.5 rounded-xl bg-[#166534]/10 flex items-center justify-center text-[#166534]">
                      <Send size={14} />
                    </span>
                    <div>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">Test SMTP Connection</h3>
                      <p className="text-[10px] text-slate-450 mt-0.5">Send a test validation email</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSmtpModalOpen(false)}
                    disabled={smtpTesting}
                    className="w-7 h-7 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-650 transition-all cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">Test Recipient Address</label>
                    <input
                      type="email"
                      required
                      value={testRecipient}
                      onChange={(e) => setTestRecipient(e.target.value)}
                      placeholder="recipient@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 transition-all"
                    />
                  </div>
                  
                  {smtpError && (
                    <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-[10px] font-semibold font-mono leading-relaxed overflow-x-auto max-h-32 shadow-inner">
                      {smtpError}
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 border-t border-slate-100 px-5 py-3.5 flex items-center justify-between">
                  <div>
                    {smtpStatus === 'success' && (
                      <p className="text-[10px] font-black text-emerald-650 flex items-center gap-1 uppercase tracking-wider animate-pulse">
                        <CheckCircle size={13} /> Dispatched!
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSmtpModalOpen(false)}
                      disabled={smtpTesting}
                      className="px-4.5 py-2.5 border border-slate-200 bg-white hover:bg-[#F0FDF4] hover:border-[#bbf7d0] text-xs font-bold text-[#57534E] hover:text-[#166534] rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={smtpTesting || smtpStatus === 'success'}
                      className="px-5 py-2.5 bg-[#166534] hover:bg-[#14532d] text-xs font-bold text-white rounded-xl transition-all flex items-center gap-2 shadow-sm hover:shadow-[#166534]/15 active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      {smtpTesting && <Loader2 size={13} className="animate-spin text-white" />}
                      <span>Dispatch Test</span>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
