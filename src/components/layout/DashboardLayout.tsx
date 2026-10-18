import { ReactNode, useState, useEffect, useRef, ChangeEvent } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layout as LayoutIcon,
  MessageSquare,
  Send,
  Users,
  Settings,
  LogOut,
  Radio,
  Menu,
  X,
  Smartphone,
  Bell,
  ChevronDown,
  Sparkles,
  Command,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Plus,
  Compass,
  BarChart3,
  FileText,
  Plug,
  Calendar,
  MousePointerClick,
  User as UserIcon,
  Mail,
  Briefcase,
  Copy,
  CheckCircle2,
  Lock,
  Zap,
  ShieldCheck,
  Cpu,
  Globe
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuthStore } from '../../store/authStore';
import { useBrandingStore } from '../../store/brandingStore';
import darkLogoImg from '../../assets/logo.png';
import favIconImg from '../../assets/fav-icon.png';
import { motion, AnimatePresence } from 'motion/react';
import { crmApi } from '../../services/crmApi';
import { whatsappApi } from '../../services/whatsappApi';
import { Contact, Campaign } from '../../types';
import { WhatsAppTemplate } from '../../types/whatsapp';
import { useI18n } from '../../i18n';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

const getMenuItems = (t: (key: string, params?: any, fallback?: string) => string) => [
  { group: t('app.dashboard.main_eb814b', undefined, 'Main'), items: [
    { icon: LayoutDashboard, label: t('app.dashboard.dashboard_67b696', undefined, 'Dashboard'), path: '/dashboard' },
    { icon: MessageSquare, label: t('app.dashboard.conversations_1d432f', undefined, 'Conversations'), path: '/inbox' },
    { icon: Users, label: t('app.dashboard.contacts_b45064', undefined, 'Contacts'), path: '/contacts' },
    { icon: Compass, label: t('app.dashboard.business_scraper_198a88', undefined, 'Business Scraper'), path: '/scraper' },
  ]},
  { group: t('app.dashboard.email_marketing_e6eecf', undefined, 'Email Marketing'), items: [
    { icon: Sparkles, label: t('app.dashboard.ai_marketing_agent_d02ae6', undefined, 'AI Marketing Agent'), path: '/email-campaigns/ai-agent' },
    { icon: Mail, label: t('app.dashboard.email_campaigns_bca45a', undefined, 'Email Campaigns'), path: '/email-campaigns' },
    { icon: FileText, label: t('app.dashboard.email_templates_d83b17', undefined, 'Email Templates'), path: '/email-templates' },
    { icon: Globe, label: t('app.dashboard.sending_domains_7a4d67', undefined, 'Sending Domains'), path: '/settings/email' },
  ]},
  { group: t('app.dashboard.whatsapp_marketing_b93ac6', undefined, 'WhatsApp Marketing'), items: [
    { icon: Send, label: t('app.dashboard.whatsapp_campaigns_c8204e', undefined, 'WhatsApp Campaigns'), path: '/campaigns' },
    { icon: LayoutIcon, label: t('app.dashboard.whatsapp_templates_431349', undefined, 'WhatsApp Templates'), path: '/templates' },
    { icon: Smartphone, label: t('app.dashboard.whatsapp_numbers_53ab7d', undefined, 'WhatsApp Numbers'), path: '/whatsapp/connect' },
    { icon: Settings, label: t('app.dashboard.whatsapp_settings_37faf3', undefined, 'WhatsApp Settings'), path: '/settings/whatsapp' },
  ]},
  { group: t('app.dashboard.automation_d90975', undefined, 'Automation'), items: [
    { icon: Zap, label: t('app.dashboard.workflows_automation_daecf7', undefined, 'Workflows & Automation'), path: '/automation' },
  ]}
];

const GRADIENTS = {
  royal: "from-slate-800 to-[#12263A] shadow-[#12263A]/20 bg-gradient-to-br text-white",
  forest: "from-[#12263A] to-[#166534] shadow-[#166534]/20 bg-gradient-to-br text-white",
  emerald: "from-[#166534] to-[#22C55E] shadow-[#22C55E]/20 bg-gradient-to-br text-white",
  ocean: "from-[#1c3650] to-[#12263A] shadow-[#12263A]/20 bg-gradient-to-br text-white",
  stone: "from-[#57534E] to-[#292524] shadow-[#57534E]/20 bg-gradient-to-br text-white",
  charcoal: "from-[#12263A] to-slate-900 shadow-slate-900/10 bg-gradient-to-br text-white",
};

const isImageAvatar = (avatarStr?: string) => {
  if (!avatarStr) return false;
  return avatarStr.startsWith('http') || avatarStr.startsWith('/') || avatarStr.startsWith('data:');
};

export function Sidebar({ 
  isCollapsed = false, 
  setIsCollapsed = () => {} 
}: { 
  isCollapsed?: boolean; 
  setIsCollapsed?: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, updateProfile } = useAuthStore();
  const { websiteName, websiteLogo, websiteFavicon } = useBrandingStore();
  const { t, isRtl } = useI18n();
  const menuItems = getMenuItems(t);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isItemActive = (isActive: boolean, itemPath: string) => {
    if (!isActive) return false;
    if (itemPath === '/email-campaigns' && location.pathname.startsWith('/email-campaigns/ai-agent')) {
      return false;
    }
    return true;
  };

  // Profile modal state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [selectedGradient, setSelectedGradient] = useState<keyof typeof GRADIENTS>('royal');
  const [isSaving, setIsSaving] = useState(false);
  const [showStatus, setShowStatus] = useState<'success' | 'error' | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Profile image upload state
  const [tempAvatar, setTempAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Password fields state
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // AI Co-pilot State
  const [aiStep, setAiStep] = useState<'idle' | 'simulating' | 'done'>('idle');
  const [aiLogs, setAiLogs] = useState<string[]>([]);

  // Sync data with store
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setBusinessName(user.businessName || '');
      if (isImageAvatar(user.avatar)) {
        setTempAvatar(user.avatar);
      } else {
        setTempAvatar(null);
        setSelectedGradient((user.avatar as keyof typeof GRADIENTS) || 'royal');
      }
    }
  }, [user, isProfileModalOpen]);

  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setTempAvatar(localUrl);
    setAvatarFile(file);
  };

  const handleSaveProfile = async (e: any) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      let finalAvatar = user?.avatar;

      // 1. Upload photo if selected
      if (avatarFile) {
        const uploadRes = await crmApi.uploadAvatar(avatarFile);
        if (uploadRes.success) {
          finalAvatar = uploadRes.avatar;
          setAvatarFile(null);
        }
      } else if (tempAvatar === null) {
        // If avatar photo was removed
        finalAvatar = selectedGradient;
      }

      // 2. Save profile info on backend
      const res = await crmApi.updateProfile({
        name: name.trim(),
        business_name: businessName.trim(),
        avatar: finalAvatar
      });

      if (res.success) {
        updateProfile({
          name: res.user.name,
          businessName: res.user.tenant?.name || businessName.trim(),
          avatar: res.user.avatar,
        });
        setShowStatus('success');
        setTimeout(() => {
          setShowStatus(null);
          setIsProfileModalOpen(false);
        }, 1200);
      } else {
        throw new Error(res.message || 'Profile update failed');
      }
    } catch (err: any) {
      console.error(err);
      setShowStatus('error');
      setTimeout(() => setShowStatus(null), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsChangingPassword(true);
    setPasswordError(null);
    try {
      const res = await crmApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword
      });

      if (res.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordFields(false);
        setShowStatus('success');
        setTimeout(() => setShowStatus(null), 2000);
      } else {
        throw new Error(res.message || 'Password update failed');
      }
    } catch (err: any) {
      console.error(err);
      setPasswordError(err.message || 'Incorrect current password or update failed.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCopyTenantId = () => {
    if (!user?.tenantId) return;
    navigator.clipboard.writeText(user.tenantId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const triggerAiPilot = () => {
    setAiStep('simulating');
    setAiLogs(['Booting THROB AI Cortex...', 'Resolving OS endpoints...']);
    
    setTimeout(() => {
      setAiLogs(prev => [...prev, 'Mapping CRM segment patterns...']);
    }, 450);

    setTimeout(() => {
      setAiLogs(prev => [...prev, 'Optimal delivery slot computed.']);
    }, 950);

    setTimeout(() => {
      setAiLogs(prev => [...prev, 'OS Orchestration COMPLETE ✔']);
      setAiStep('done');
    }, 1400);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed top-6 right-6 z-[120] w-11 h-11 bg-white text-slate-700 rounded-xl shadow-lg flex items-center justify-center transition-all active:scale-95 border border-slate-200"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isMobileMenuOpen ? 'close' : 'open'}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </motion.div>
        </AnimatePresence>
      </button>

      <aside className={cn(
        "fixed inset-y-0 z-[110] bg-white transform transition-all duration-300 ease-in-out lg:translate-x-0 flex flex-col overflow-visible",
        isRtl ? "right-0 border-l border-slate-200" : "left-0 border-r border-slate-200",
        isMobileMenuOpen ? "translate-x-0" : (isRtl ? "translate-x-full" : "-translate-x-full"),
        isCollapsed ? "w-20" : "w-72"
      )}>
        {/* Collapsible Trigger for Desktop */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "hidden lg:flex absolute top-9 z-[120] w-6 h-6 bg-white hover:bg-slate-50 border border-slate-200 rounded-full text-slate-400 hover:text-slate-700 items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-sm",
            isRtl ? "left-[-12px]" : "right-[-12px]"
          )}
        >
          {isRtl ? (
            <ChevronRight size={12} className={cn("transition-transform duration-300", isCollapsed && "rotate-180")} />
          ) : (
            <ChevronLeft size={12} className={cn("transition-transform duration-300", isCollapsed && "rotate-180")} />
          )}
        </button>

        {/* 1. Logo Section */}
        <div className={cn("transition-all duration-300", isCollapsed ? "p-4 flex justify-center" : "px-6 pt-5 pb-3")}>
          <div className={cn("flex items-center cursor-pointer", isCollapsed ? "justify-center" : "")} onClick={() => navigate('/dashboard')}>
            {isCollapsed ? (
              <img
                src={favIconImg}
                alt="Logo"
                className="w-8 h-8 object-contain rounded-xl shrink-0 hover:scale-105 transition-transform"
              />
            ) : (
              <img
                src={darkLogoImg}
                alt={websiteName || "ThrobTech"}
                className="h-8 md:h-9 w-auto max-w-[190px] object-contain shrink-0 hover:opacity-90 transition-opacity"
              />
            )}
          </div>
        </div>

        {/* 2. User / workspace card */}
        <div className={cn("px-4 mb-2 select-none", isCollapsed ? "flex justify-center" : "")}>
          <div
            onClick={() => setIsProfileModalOpen(true)}
            className={cn(
              "bg-slate-50 hover:bg-[#F0FDF4] border border-slate-200 hover:border-[#bbf7d0] flex items-center cursor-pointer group transition-all duration-200 rounded-xl",
              isCollapsed ? "p-2 justify-center w-11 h-11" : "p-2 gap-2.5 w-full"
            )}
          >
            <div className={cn(
              "rounded-lg flex items-center justify-center font-bold transition-all duration-200 shrink-0 relative overflow-hidden",
              isCollapsed ? "w-7 h-7 text-xs" : "w-8 h-8 text-xs",
              isImageAvatar(user?.avatar) ? "bg-slate-100" : GRADIENTS[(user?.avatar as keyof typeof GRADIENTS) || 'royal']
            )}>
              {isImageAvatar(user?.avatar) ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name ? user.name.substring(0, 1).toUpperCase() : 'A'
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-bold text-slate-900 truncate leading-tight group-hover:text-[#166534] transition-colors">{businessName || 'Workspace'}</p>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{name || 'View profile'}</p>
              </div>
            )}
            {!isCollapsed && <ChevronDown size={13} className="text-slate-400 group-hover:text-[#166534] transition-colors shrink-0" />}
          </div>
        </div>

        {/* 3. Navigation */}
        <div className="flex-1 px-3 overflow-y-auto custom-scrollbar flex flex-col justify-between">
          <div className="space-y-3.5 py-1">
            {menuItems.map((group) => (
              <div key={group.group} className="space-y-0.5">
                {!isCollapsed ? (
                  <p className="px-3 mb-1 text-[11px] font-bold uppercase tracking-wider text-[#57534E]/70 select-none">{group.group}</p>
                ) : (
                  <div className="w-full h-px bg-[#e7e5e4] my-2" />
                )}
                <nav className="space-y-0.5">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.label}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) => {
                        const active = isItemActive(isActive, item.path);
                        return cn(
                          "flex items-center rounded-xl text-xs sm:text-[13px] font-semibold transition-all duration-200 group relative cursor-pointer",
                          isCollapsed ? "p-2 justify-center" : "px-3 py-2 gap-2.5",
                          active
                            ? "bg-[#166534] text-white shadow-sm shadow-[#166534]/25"
                            : "text-[#57534E] hover:text-[#12263A] hover:bg-[#F0FDF4]"
                        );
                      }}
                    >
                      {({ isActive }) => {
                        const active = isItemActive(isActive, item.path);
                        return (
                          <>
                            <item.icon size={17} strokeWidth={2} className={cn("shrink-0 transition-colors", active ? "text-white" : "text-[#57534E]/75 group-hover:text-[#12263A]")} />

                            {!isCollapsed && (
                              <span className="flex-1">{item.label}</span>
                            )}

                            {/* Hover Tooltips for Collapsed state */}
                            {isCollapsed && (
                              <div className={cn(
                                "absolute top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 translate-x-[-6px] transition-all duration-200 bg-[#12263A] text-white rounded-md px-2.5 py-1.5 whitespace-nowrap text-xs font-medium shadow-lg z-[70]",
                                isRtl ? "right-[64px]" : "left-[64px]"
                              )}>
                                {item.label}
                              </div>
                            )}
                          </>
                        );
                      }}
                    </NavLink>
                  ))}
                </nav>
              </div>
            ))}
            {user?.role === 'superadmin' && (
              <div className="space-y-0.5 pt-1">
                {!isCollapsed ? (
                  <p className="px-3 mb-1 text-[11px] font-bold uppercase tracking-wider text-[#166534] select-none">
                    {isRtl ? 'الإدارة' : 'Administration'}
                  </p>
                ) : (
                  <div className="w-full h-px bg-[#e7e5e4] my-2" />
                )}
                <nav className="space-y-0.5">
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => cn(
                      "flex items-center rounded-xl text-xs sm:text-[13px] font-semibold transition-all duration-200 group relative cursor-pointer",
                      isCollapsed ? "p-2 justify-center" : "px-3 py-2 gap-2.5",
                      isActive
                        ? "bg-[#166534] text-white shadow-sm shadow-[#166534]/25"
                        : "text-[#12263A] hover:text-[#166534] hover:bg-[#F0FDF4]"
                    )}
                  >
                    <Cpu size={17} strokeWidth={2} className="shrink-0 text-[#166534] group-hover:text-[#14532d]" />
                    {!isCollapsed && <span className="flex-1">{isRtl ? 'لوحة الإدارة' : 'Admin Panel'}</span>}
                    {isCollapsed && (
                      <div className={cn(
                        "absolute top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 translate-x-[-6px] transition-all duration-200 bg-[#12263A] text-white rounded-md px-2.5 py-1.5 whitespace-nowrap text-xs font-medium shadow-lg z-[70]",
                        isRtl ? "right-[64px]" : "left-[64px]"
                      )}>
                        {isRtl ? 'لوحة الإدارة' : 'Admin Panel'}
                      </div>
                    )}
                  </NavLink>
                </nav>
              </div>
            )}
          </div>

          {/* Support & Resource Card inside scroll stream */}
          {!isCollapsed && (
            <div className="pt-4 pb-2">
              <div className="bg-[#FAFAF9] border border-[#e7e5e4] rounded-xl p-3 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#F0FDF4] text-[#166534] flex items-center justify-center shrink-0 border border-[#bbf7d0]">
                    <FileText size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#12263A] truncate">{isRtl ? 'المساعدة والوثائق' : 'Help & Docs'}</p>
                    <p className="text-[10px] text-[#57534E] truncate">{isRtl ? 'أدلة ومراجع شاملة' : 'Guides & resources'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/resources')}
                  className="h-7 px-3 text-[11px] font-bold text-[#166534] hover:text-[#14532d] bg-white hover:bg-[#F0FDF4] border border-slate-200 hover:border-[#bbf7d0] rounded-lg transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
                >
                  {isRtl ? 'عرض' : 'View'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. Bottom sign out area */}
        <div className="border-t border-slate-200 p-2.5">
          {!isCollapsed ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50/80 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer active:scale-98"
            >
              <LogOut size={16} strokeWidth={2} className="shrink-0" />
              {t('app.dashboard.sign_out_0b184b', undefined, 'Sign Out')}
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="w-9 h-9 mx-auto flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer group relative active:scale-90"
            >
              <LogOut size={16} strokeWidth={2} />
              <div className={cn(
                "absolute top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 translate-x-[-6px] transition-all duration-200 bg-slate-900 text-white rounded-md px-2.5 py-1.5 whitespace-nowrap text-xs font-medium shadow-lg z-[70]",
                isRtl ? "right-[52px]" : "left-[52px]"
              )}>
                {t('app.dashboard.sign_out_0b184b', undefined, 'Sign Out')}
              </div>
            </button>
          )}
        </div>
      </aside>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Profile Settings Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Soft Backdrop blur overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSaving) setIsProfileModalOpen(false);
              }}
              className="fixed inset-0 bg-slate-950/65 backdrop-blur-md"
            />

            {/* Modal Body Container */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
              className="relative w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl shadow-xl overflow-hidden z-[110]"
            >
              <form onSubmit={handleSaveProfile} className="flex flex-col">
                {/* Header Profile Title */}
                <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-650"><Settings size={16} /></span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{t('account.profile.title')}</h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{t('account.profile.description')}</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsProfileModalOpen(false)}
                    disabled={isSaving}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  {/* Avatar Profile Preview & File Upload / Gradient Selector */}
                  <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black transition-all duration-300 shadow-md shrink-0 overflow-hidden",
                        isImageAvatar(tempAvatar || undefined) ? "bg-slate-100" : GRADIENTS[selectedGradient as keyof typeof GRADIENTS]
                      )}>
                        {isImageAvatar(tempAvatar || undefined) ? (
                          <img src={tempAvatar!} alt="Avatar Preview" className="w-full h-full object-cover" />
                        ) : (
                          name ? name.substring(0, 1).toUpperCase() : 'A'
                        )}
                      </div>
                      <div className="flex-1 w-full space-y-2">
                        <p className={cn("text-xs font-bold text-slate-500", isRtl ? "text-center sm:text-right" : "text-center sm:text-left")}>{t('account.profile.picture_label')}</p>
                        <div className={cn("flex gap-2 justify-center", isRtl ? "sm:justify-start" : "sm:justify-start")}>
                          <label className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm">
                            {t('account.profile.upload_photo')}
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleAvatarUpload}
                            />
                          </label>
                          {tempAvatar && (
                            <button
                              type="button"
                              onClick={() => {
                                setTempAvatar(null);
                                setAvatarFile(null);
                                setSelectedGradient('royal');
                              }}
                              className="px-4 py-2 border border-red-200 bg-red-50 hover:bg-red-105 text-red-650 rounded-xl text-xs font-bold transition-all cursor-pointer"
                            >
                              {isRtl ? 'إزالة الصورة' : 'Remove Photo'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Gradient color option if not uploaded image */}
                    {!tempAvatar && (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-500">{t('account.profile.color_theme')}</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.keys(GRADIENTS).map((key) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setSelectedGradient(key as keyof typeof GRADIENTS)}
                              className={cn(
                                "w-8 h-8 rounded-lg cursor-pointer transition-all duration-300 relative border-2 flex items-center justify-center hover:scale-105 active:scale-95 shadow-sm",
                                GRADIENTS[key as keyof typeof GRADIENTS],
                                selectedGradient === key ? "border-indigo-600 scale-110 shadow" : "border-transparent opacity-85 hover:opacity-100"
                              )}
                            >
                              {selectedGradient === key && <CheckCircle2 size={12} className="text-white drop-shadow" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Form Inputs */}
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-xs font-semibold text-slate-500">{t('account.profile.full_name')}</label>
                      <div className="relative">
                        <UserIcon className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-4" : "left-4")} size={14} />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t('account.profile.full_name_placeholder', undefined, 'E.g. Jane Doe')}
                          className={`w-full bg-slate-50 border border-slate-200/65 rounded-xl py-3 ${isRtl ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'} text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-xs font-semibold text-slate-500">{isRtl ? 'اسم المؤسسة / العمل' : 'Business Name'}</label>
                      <div className="relative">
                        <Briefcase className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-4" : "left-4")} size={14} />
                        <input
                          type="text"
                          required
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder={t('account.profile.business_placeholder', undefined, 'Corporate Organization')}
                          className={`w-full bg-slate-50 border border-slate-200/65 rounded-xl py-3 ${isRtl ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'} text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1.5 text-xs font-semibold text-slate-500">{isRtl ? 'البريد الإلكتروني' : 'Email'}</label>
                        <div className="relative">
                          <Mail className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-4" : "left-4")} size={13} />
                          <input
                            type="email"
                            disabled
                            value={email}
                            dir="ltr"
                            className={`w-full bg-slate-100/80 border border-slate-200/40 rounded-xl py-3 ${isRtl ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'} text-xs font-bold text-[#555] cursor-not-allowed`}
                          />
                          <Lock className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400 opacity-60", isRtl ? "left-4" : "right-4")} size={10} />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1.5 text-xs font-semibold text-slate-500">{t('account.profile.tenant_id')}</label>
                        <button
                          type="button"
                          onClick={handleCopyTenantId}
                          className="w-full bg-slate-100/80 hover:bg-slate-200/50 border border-slate-200/40 rounded-xl py-3 px-4 text-xs font-bold text-[#555] flex items-center justify-between transition-all group cursor-pointer"
                        >
                          <span className="font-mono text-slate-500" dir="ltr">{user?.tenantId || 'Tenant-1'}</span>
                          {isCopied ? (
                            <span className="text-[8.5px] font-black text-indigo-600 uppercase tracking-widest">{isRtl ? 'تم النسخ' : 'Copied'}</span>
                          ) : (
                            <Copy size={11} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Change Password Toggle & Fields */}
                  <div className="border-t border-slate-100 pt-5 space-y-4">
                    <button
                      type="button"
                      onClick={() => setShowPasswordFields(!showPasswordFields)}
                      className="flex items-center justify-between w-full text-left text-xs font-black text-[#166534] hover:text-[#14532d] uppercase tracking-widest cursor-pointer hover:underline"
                    >
                      <span>🔒 {t('account.profile.change_password')}</span>
                      <span>{showPasswordFields ? t('account.profile.hide') : t('account.profile.show')}</span>
                    </button>

                    {showPasswordFields && (
                      <div className="space-y-4 pt-1 animate-none">
                        <div>
                          <label className="block mb-2 text-xs font-semibold text-slate-500">{t('account.profile.current_password')}</label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            dir="ltr"
                            className="w-full bg-slate-50 border border-slate-200/65 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-2 text-xs font-semibold text-slate-500">{t('account.profile.new_password')}</label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder={t('account.profile.password_minimum_placeholder', undefined, 'Min. 6 characters')}
                              dir="ltr"
                              className="w-full bg-slate-50 border border-slate-200/65 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block mb-2 text-xs font-semibold text-slate-500">{t('account.profile.confirm_new_password')}</label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder={t('account.profile.confirm_password_placeholder', undefined, 'Confirm password')}
                              dir="ltr"
                              className="w-full bg-slate-50 border border-slate-200/65 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
                            />
                          </div>
                        </div>
                        {passwordError && (
                          <p className="text-xs text-red-500 font-semibold">{passwordError}</p>
                        )}
                        <button
                          type="button"
                          disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                          onClick={handleSavePassword}
                          className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                        >
                          {isChangingPassword ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            t('account.profile.update_password')
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="bg-slate-50 border-t border-slate-100 px-8 py-5 flex items-center justify-between">
                  <div>
                    {showStatus === 'success' && (
                      <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                        <CheckCircle2 size={14} />
                        {isRtl ? 'تم حفظ الملف الشخصي بنجاح' : 'Profile saved'}
                      </p>
                    )}
                    {showStatus === 'error' && (
                      <p className="text-xs font-semibold text-red-500 flex items-center gap-1.5">
                        <X size={14} />
                        {isRtl ? 'فشل التحديث' : 'Update failed'}
                      </p>
                    )}
                    {!showStatus && (
                      <span className="text-xs text-slate-400 font-medium">{t('account.profile.auto_save_hint')}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => setIsProfileModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      {isRtl ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving || showStatus !== null}
                      className="relative min-w-[120px] px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 border border-indigo-600 text-xs font-semibold text-white shadow-sm active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                    >
                      {isSaving ? (
                        <Loader2 size={14} className="animate-spin text-white" />
                      ) : (
                        isRtl ? 'حفظ التغييرات' : "Save Changes"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { t, isRtl, formatDate } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedIndex, setHasLoadedIndex] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifications = async () => {
    try {
      const data = await crmApi.getNotifications();
      
      const dismissedIds = JSON.parse(localStorage.getItem('dismissed_notifications') || '[]');
      const readIds = JSON.parse(localStorage.getItem('read_notifications') || '[]');
      
      const parsedNotifications = data
        .filter((n: any) => !dismissedIds.includes(n.id))
        .map((n: any) => ({
          ...n,
          unread: readIds.includes(n.id) ? false : n.unread
        }));
        
      setNotifications(parsedNotifications);
    } catch (e) {
      console.warn('Failed to load notifications:', e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(fetchNotifications, 30000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    const readIds = JSON.parse(localStorage.getItem('read_notifications') || '[]');
    notifications.forEach(n => {
      if (!readIds.includes(n.id)) {
        readIds.push(n.id);
      }
    });
    localStorage.setItem('read_notifications', JSON.stringify(readIds));
  };

  const clearNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    const dismissedIds = JSON.parse(localStorage.getItem('dismissed_notifications') || '[]');
    if (!dismissedIds.includes(id)) {
      dismissedIds.push(id);
    }
    localStorage.setItem('dismissed_notifications', JSON.stringify(dismissedIds));
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    const readIds = JSON.parse(localStorage.getItem('read_notifications') || '[]');
    if (!readIds.includes(id)) {
      readIds.push(id);
    }
    localStorage.setItem('read_notifications', JSON.stringify(readIds));
    
    const notif = notifications.find(n => n.id === id);
    if (notif?.action_path) {
      navigate(notif.action_path);
    }
  };

  // Search source indexes
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);

  // Keyboard shortcut listener to focus search (Cmd/Ctrl + K and ESC to blur)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsFocused(true);
      }
      if (e.key === 'Escape') {
        setIsFocused(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loadSearchIndexes = async () => {
    if (hasLoadedIndex) return;
    setIsLoading(true);
    try {
      const [contRes, campRes, tempRes] = await Promise.allSettled([
        crmApi.getContacts(),
        crmApi.getCampaignsList(),
        whatsappApi.fetchTemplates()
      ]);

      if (contRes.status === 'fulfilled') {
        setContacts(contRes.value || []);
      }
      if (campRes.status === 'fulfilled') {
        const value = campRes.value;
        const arrayList = Array.isArray(value) 
          ? value 
          : (value?.data || value?.campaigns || []);
        
        // Map raw database attributes if needed
        const mappedCampaigns = arrayList.map((c: any) => ({
          id: String(c.id),
          name: c.name || 'Untitled Campaign',
          type: c.type || 'Broadcast',
          status: c.status || 'Draft',
          messageContent: c.message_content || c.messageContent || ''
        }));
        setCampaigns(mappedCampaigns);
      }
      if (tempRes.status === 'fulfilled') {
        setTemplates(tempRes.value || []);
      }
      setHasLoadedIndex(true);
    } catch (err) {
      console.warn('Failed to construct live search index:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadSearchIndexes();
    }
  }, [isFocused]);

  // Filtering lists
  const matchStr = query.trim().toLowerCase();
  
  const filteredContacts = matchStr 
    ? contacts.filter(c => 
        (c.name || '').toLowerCase().includes(matchStr) ||
        (c.phone || '').toLowerCase().includes(matchStr) ||
        (c.email || '').toLowerCase().includes(matchStr) ||
        (c.company || '').toLowerCase().includes(matchStr)
      ).slice(0, 5)
    : [];

  const filteredCampaigns = matchStr 
    ? campaigns.filter(c => 
        (c.name || '').toLowerCase().includes(matchStr) ||
        (c.status || '').toLowerCase().includes(matchStr) ||
        (c.messageContent || '').toLowerCase().includes(matchStr)
      ).slice(0, 4)
    : [];

  const filteredTemplates = matchStr 
    ? templates.filter(t => 
        (t.name || '').toLowerCase().includes(matchStr) ||
        (t.category || '').toLowerCase().includes(matchStr) ||
        (t.body?.text || '').toLowerCase().includes(matchStr)
      ).slice(0, 4)
    : [];

  const hasResults = filteredContacts.length > 0 || filteredCampaigns.length > 0 || filteredTemplates.length > 0;

  const handleSelectResult = (path: string, searchParam?: string) => {
    setQuery('');
    setIsFocused(false);
    if (searchParam) {
      navigate(`${path}?search=${encodeURIComponent(searchParam)}`);
    } else {
      navigate(path);
    }
  };

  return (
    <header className="h-[72px] flex items-center justify-between px-6 lg:px-8 bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40">
      {/* Click-away overlay when search results are open */}
      {isFocused && (
        <div 
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setIsFocused(false)}
        />
      )}

      <div className="flex items-center gap-6 flex-1 relative z-50">
        <div className="relative max-w-xl w-full hidden md:block group">
          <Sparkles size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#166534] transition-all" strokeWidth={2.2}/>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search contacts, campaigns, or ask a question..."
            className="w-full bg-[#FAFAF9] border border-[#e7e5e4] rounded-full py-2.5 pl-11 pr-12 text-[13px] font-medium text-[#12263A] focus:outline-none focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#22C55E]/10 shadow-sm transition-all placeholder:text-[#57534E]/60"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white px-2 py-1 rounded-lg text-[10px] font-semibold text-slate-400 border border-slate-200 pointer-events-none">
            <Command size={10} strokeWidth={3} className="-mt-0.5" />
            <span>K</span>
          </div>

          <AnimatePresence>
            {isFocused && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 right-0 mt-4 bg-white border border-slate-200/85 rounded-2xl shadow-floating max-h-[500px] overflow-y-auto z-50 overflow-x-hidden custom-scrollbar flex flex-col"
              >
                {/* Search Meta Info */}
                <div className="bg-slate-50 border-b border-slate-100 px-5 py-3 flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <span>✨ Universal OS Intelligence</span>
                  {isLoading ? (
                    <span className="flex items-center gap-2 text-indigo-600">
                      <Loader2 size={10} className="animate-spin" />
                      Constructing Index...
                    </span>
                  ) : (
                    <span className="text-slate-500">
                      {query ? 'Filter Matches' : 'Command Centre'}
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-4">
                  {/* Empty Query - Quick Shortcuts */}
                  {!query && (
                    <div className="space-y-4">
                      <div>
                        <p className="px-2 mb-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">⚡ QUICK PILOTS</p>
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => handleSelectResult('/contacts/add')}
                            className="flex items-center gap-3 p-3 text-left rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 hover:border-indigo-100 text-[11px] font-bold text-slate-700 hover:text-indigo-950 transition-all duration-300"
                          >
                            <span className="w-6 h-6 rounded-lg bg-white flex items-center justify-center border border-slate-100 text-indigo-500 group-hover:scale-110 shadow-sm"><Plus size={14} /></span>
                            <span>Add Contact</span>
                          </button>
                          <button 
                            onClick={() => handleSelectResult('/campaigns/add')}
                            className="flex items-center gap-3 p-3 text-left rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 hover:border-indigo-100 text-[11px] font-bold text-slate-700 hover:text-indigo-950 transition-all duration-300"
                          >
                            <span className="w-6 h-6 rounded-lg bg-white flex items-center justify-center border border-slate-100 text-purple-500 group-hover:scale-110 shadow-sm"><Send size={12} /></span>
                            <span>Broadcast Setup</span>
                          </button>
                          <button 
                            onClick={() => handleSelectResult('/templates/add')}
                            className="flex items-center gap-3 p-3 text-left rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 hover:border-indigo-100 text-[11px] font-bold text-slate-700 hover:text-indigo-950 transition-all duration-300"
                          >
                            <span className="w-6 h-6 rounded-lg bg-white flex items-center justify-center border border-slate-100 text-emerald-500 group-hover:scale-110 shadow-sm"><LayoutIcon size={12} /></span>
                            <span>Create Template</span>
                          </button>
                          <button 
                            onClick={() => handleSelectResult('/inbox')}
                            className="flex items-center gap-3 p-3 text-left rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 hover:border-indigo-100 text-[11px] font-bold text-slate-700 hover:text-indigo-950 transition-all duration-300"
                          >
                            <span className="w-6 h-6 rounded-lg bg-white flex items-center justify-center border border-slate-100 text-amber-500 group-hover:scale-110 shadow-sm"><MessageSquare size={12} /></span>
                            <span>Live Inbox</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="px-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">Quick Navigation</p>
                        <div className="space-y-1">
                          <button 
                            onClick={() => handleSelectResult('/dashboard')}
                            className="w-full flex items-center justify-between p-2 rounded-lg text-slate-600 hover:text-indigo-950 text-xs font-medium hover:bg-slate-50 transition-all"
                          >
                            <span className="flex items-center gap-2"><Compass size={14} /> Dashboard Overview</span>
                            <span className="text-[10px] text-slate-400">Jump to</span>
                          </button>
                          <button 
                            onClick={() => handleSelectResult('/contacts')}
                            className="w-full flex items-center justify-between p-2 rounded-lg text-slate-600 hover:text-indigo-950 text-xs font-medium hover:bg-slate-50 transition-all"
                          >
                            <span className="flex items-center gap-2"><Users size={14} /> Contacts</span>
                            <span className="text-[10px] text-slate-400">Jump to</span>
                          </button>
                          <button 
                            onClick={() => handleSelectResult('/campaigns')}
                            className="w-full flex items-center justify-between p-2 rounded-lg text-slate-600 hover:text-indigo-950 text-xs font-medium hover:bg-slate-50 transition-all"
                          >
                            <span className="flex items-center gap-2"><Send size={14} /> Campaigns</span>
                            <span className="text-[10px] text-slate-400">Jump to</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Active Query - Search Results */}
                  {query && (
                    <div className="space-y-4">
                      {/* Contacts Results */}
                      {filteredContacts.length > 0 && (
                        <div>
                          <p className="px-2 mb-2 text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                            <span>Contacts ({filteredContacts.length})</span>
                            <Users size={12} />
                          </p>
                          <div className="space-y-1">
                            {filteredContacts.map(c => (
                              <button
                                key={c.id}
                                onClick={() => handleSelectResult('/contacts', c.name)}
                                className="w-full flex items-center justify-between p-2 text-left rounded-xl hover:bg-slate-50 transition-all flex-row group animate-none"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-[10px] font-black uppercase">
                                    {c.name?.substring(0, 1) || 'A'}
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-bold text-slate-900 leading-tight">{c.name}</p>
                                    <p className="text-[9px] font-semibold text-slate-500">{c.phone}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {c.company && (
                                    <span className="hidden sm:inline bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md text-[9px] font-black tracking-tight uppercase leading-none border border-slate-250">
                                      {c.company}
                                    </span>
                                  )}
                                  <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Campaigns Results */}
                      {filteredCampaigns.length > 0 && (
                        <div>
                          <p className="px-2 mb-2 text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                            <span>Campaigns ({filteredCampaigns.length})</span>
                            <Send size={11} />
                          </p>
                          <div className="space-y-1">
                            {filteredCampaigns.map(c => (
                              <button
                                key={c.id}
                                onClick={() => handleSelectResult('/campaigns', c.name)}
                                className="w-full flex items-center justify-between p-2 text-left rounded-xl hover:bg-slate-50 transition-all group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-600 flex items-center justify-center text-[10px] font-black uppercase">
                                    <Send size={12} />
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-bold text-slate-900 leading-tight">{c.name}</p>
                                    <p className="text-[9px] font-semibold text-pink-500 uppercase tracking-widest mt-0.5">{c.type}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[8.5px] font-bold tracking-widest uppercase leading-none border",
                                    c.status === 'Running' || c.status === 'Completed' 
                                      ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                      : 'bg-amber-50 border-amber-100 text-amber-600'
                                  )}>
                                    {c.status}
                                  </span>
                                  <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Templates Results */}
                      {filteredTemplates.length > 0 && (
                        <div>
                          <p className="px-2 mb-2 text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                            <span>Templates ({filteredTemplates.length})</span>
                            <LayoutIcon size={12} />
                          </p>
                          <div className="space-y-1">
                            {filteredTemplates.map(t => (
                              <button
                                key={t.id}
                                onClick={() => handleSelectResult('/templates', t.name)}
                                className="w-full flex items-center justify-between p-2 text-left rounded-xl hover:bg-slate-50 transition-all group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center text-[10px] font-black uppercase">
                                    <LayoutIcon size={12} />
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-bold text-slate-900 leading-tight">{t.name}</p>
                                    <p className="text-[9px] font-semibold text-slate-400 mt-0.5 uppercase tracking-wide">{t.category}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md text-[9px] font-mono leading-none border border-slate-200 lowercase">
                                    {t.language}
                                  </span>
                                  <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Not Found state */}
                      {!hasResults && (
                        <div className="py-8 px-4 text-center">
                          <p className="text-xs font-medium text-slate-500">No results found for "{query}"</p>
                          <button
                            type="button"
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 mt-2 hover:underline cursor-pointer inline-flex items-center gap-1"
                            onClick={() => handleSelectResult('/contacts', query)}
                          >
                            <span>Search Contacts for "{query}"</span>
                            <ChevronRight size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between mt-auto animate-none">
                  <span className="flex items-center gap-1.5">
                    <MousePointerClick size={10} />
                    Click element to navigate
                  </span>
                  <span className="flex items-center gap-1 bg-white border border-slate-200 text-slate-400 px-1 py-0.5 rounded-md">
                    <span>ESC TO DISMISS</span>
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Click-away overlay when notifications are open */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setShowNotifications(false)}
        />
      )}

      <div className="flex items-center gap-3 relative z-50">
        {/* Language Switcher */}
        <LanguageSwitcher variant="dropdown" />

        {/* Date selector */}
        <button className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[13px] font-medium text-slate-600 transition-all cursor-pointer">
          <Calendar size={15} className="text-slate-400" />
          <span>{formatDate(new Date(), { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <ChevronDown size={13} className="text-slate-400" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "relative w-10 h-10 flex items-center justify-center rounded-xl transition-all group cursor-pointer",
              showNotifications
                ? "bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30"
                : "text-[#57534E] hover:text-[#12263A] hover:bg-[#FAFAF9] border border-transparent"
            )}
          >
            <Bell size={19} strokeWidth={2.2} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 min-w-[16px] h-4 px-1 flex items-center justify-center bg-[#22C55E] text-white text-[9px] font-bold rounded-full border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className={cn(
                  "absolute mt-3 w-96 bg-white border border-[#e7e5e4] rounded-2xl shadow-floating overflow-hidden z-50 flex flex-col",
                  isRtl ? "left-0" : "right-0"
                )}
              >
                {/* Header */}
                <div className="px-5 py-3.5 border-b border-[#e7e5e4] bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#12263A]">
                      {isRtl ? 'الإشعارات' : 'Notifications'}
                    </span>
                    {unreadCount > 0 && (
                      <span className="bg-[#166534] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-xs font-semibold text-[#166534] hover:text-[#14532d] transition-colors cursor-pointer"
                    >
                      {isRtl ? 'تحديد الكل كمقروء' : 'Mark all as read'}
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-[360px] overflow-y-auto custom-scrollbar divide-y divide-[#e7e5e4]">
                  {notifications.length === 0 ? (
                    <div className="py-12 px-6 text-center select-none">
                      <div className="w-10 h-10 rounded-full bg-[#F0FDF4] text-[#166534] flex items-center justify-center mx-auto mb-3 border border-[#22C55E]/20">
                        <CheckCircle2 size={18} strokeWidth={2} />
                      </div>
                      <p className="text-xs font-semibold text-[#12263A]">You're all caught up</p>
                      <p className="text-[11px] text-[#57534E] mt-1">No new notifications right now</p>
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const Icon = n.category === 'campaign' ? Send 
                                 : n.category === 'whatsapp' ? LayoutIcon 
                                 : n.category === 'inbox' ? MessageSquare 
                                 : Zap;
                      return (
                        <div 
                          key={n.id}
                          onClick={() => handleNotificationClick(n.id)}
                          className={cn(
                            "p-4 flex items-start gap-3.5 transition-all cursor-pointer group hover:bg-[#FAFAF9] relative",
                            n.unread ? "bg-[#F0FDF4]" : ""
                          )}
                        >
                          {/* Left icon wrapper */}
                          <div className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border",
                            n.category === 'campaign' && "bg-[#F0FDF4] text-[#166534] border-[#166534]/15",
                            n.category === 'whatsapp' && "bg-emerald-50 text-emerald-700 border-emerald-200/40",
                            n.category === 'inbox' && "bg-[#FAFAF9] text-[#12263A] border-[#12263A]/15",
                            n.category === 'system' && "bg-[#F0FDF4] text-[#22C55E] border-[#22C55E]/20"
                          )}>
                            <Icon size={14} strokeWidth={2.5} />
                          </div>

                          {/* Info content */}
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-baseline justify-between gap-2">
                              <p className={cn(
                                "text-[11px] leading-tight truncate",
                                n.unread ? "font-extrabold text-slate-900" : "font-semibold text-slate-700"
                              )}>
                                {n.title}
                              </p>
                              <span className="text-[8.5px] font-bold text-slate-400 uppercase whitespace-nowrap shrink-0">{n.time}</span>
                            </div>
                            <p className="text-[9.5px] text-slate-500 font-medium leading-relaxed mt-0.5">{n.desc}</p>
                          </div>

                          {/* Quick dismiss button */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              clearNotification(n.id);
                            }}
                            className="absolute right-3.5 top-4 opacity-0 group-hover:opacity-100 hover:bg-slate-250/20 p-1 rounded-md text-slate-400 hover:text-slate-700 transition-all cursor-pointer focus:outline-none"
                          >
                            <X size={12} strokeWidth={3} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="h-8 w-px bg-slate-200 mx-1" />

        <div className="relative z-50">
          {/* Click-away overlay when profile menu is open */}
          {showProfileMenu && (
            <div 
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setShowProfileMenu(false)}
            />
          )}

          <div 
            className="flex items-center gap-3 pl-1 cursor-pointer group"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="hidden sm:block text-right">
              <p className="text-[13px] font-semibold text-slate-900 leading-tight">{user?.name || 'Welcome'}</p>
              <p className="text-[11px] text-slate-400">{user?.businessName || 'Workspace'}</p>
            </div>
            <div className="relative">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden",
                isImageAvatar(user?.avatar) ? "bg-slate-100" : GRADIENTS[(user?.avatar as keyof typeof GRADIENTS) || 'royal']
              )}>
                {isImageAvatar(user?.avatar) ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.name ? user.name.substring(0, 1).toUpperCase() : 'A'
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
          </div>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className={cn(
                  "absolute mt-3 w-56 bg-white border border-slate-200/90 rounded-2xl shadow-floating overflow-hidden z-[60] py-1",
                  isRtl ? "left-0" : "right-0"
                )}
              >
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="py-1 px-1.5">
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut size={16} />
                    {t('app.dashboard.sign_out_0b184b', undefined, 'Sign Out')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export function Layout({ children }: { children?: ReactNode }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { isRtl } = useI18n();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem('sidebar_is_collapsed');
    return stored === 'true';
  });

  useEffect(() => {
    if (user && user.role === 'superadmin') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const toggleCollapsed = (val: boolean) => {
    setIsCollapsed(val);
    localStorage.setItem('sidebar_is_collapsed', String(val));
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#12263A] selection:bg-[#F0FDF4] selection:text-[#166534] overflow-x-hidden">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={toggleCollapsed} />
      <div className={cn(
        "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
        isRtl
          ? (isCollapsed ? "lg:pr-20 lg:pl-0" : "lg:pr-72 lg:pl-0")
          : (isCollapsed ? "lg:pl-20 lg:pr-0" : "lg:pl-72 lg:pr-0")
      )}>
        <Header />
        <main className="p-5 md:p-6 xl:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
