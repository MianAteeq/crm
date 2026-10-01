import { ReactNode, useState, useEffect, useRef, ChangeEvent } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
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
  Cpu
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuthStore } from '../../store/authStore';
import { useBrandingStore } from '../../store/brandingStore';
import { motion, AnimatePresence } from 'motion/react';
import { crmApi } from '../../services/crmApi';
import { whatsappApi } from '../../services/whatsappApi';
import { Contact, Campaign } from '../../types';
import { WhatsAppTemplate } from '../../types/whatsapp';

const menuItems = [
  { group: 'Main', items: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: MessageSquare, label: 'Conversations', path: '/inbox' },
    { icon: Users, label: 'Contacts', path: '/contacts' },
  ]},
  { group: 'Engagement', items: [
    { icon: Send, label: 'Campaigns', path: '/campaigns' },
    { icon: LayoutIcon, label: 'Templates', path: '/templates' },
    { icon: Zap, label: 'Automation', path: '/automation' },
    { icon: Smartphone, label: 'WhatsApp Numbers', path: '/whatsapp/connect' },
  ]},
  { group: 'System', items: [
    { icon: Settings, label: 'Settings', path: '/settings/whatsapp' },
  ]}
];

const GRADIENTS = {
  royal: "from-indigo-500 to-purple-600 shadow-indigo-500/20 bg-gradient-to-br text-white",
  neon: "from-pink-500 to-rose-600 shadow-rose-500/20 bg-gradient-to-br text-white",
  flare: "from-amber-500 to-orange-500 shadow-orange-500/20 bg-gradient-to-br text-white",
  ocean: "from-blue-600 to-cyan-500 shadow-blue-500/20 bg-gradient-to-br text-white",
  emerald: "from-emerald-500 to-teal-600 shadow-emerald-500/20 bg-gradient-to-br text-white",
  charcoal: "from-slate-700 to-zinc-900 shadow-slate-500/10 bg-gradient-to-br text-white",
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
  const { logout, user, updateProfile } = useAuthStore();
  const { websiteName, websiteLogo } = useBrandingStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        "fixed inset-y-0 left-0 z-[110] bg-white transform transition-all duration-300 ease-in-out lg:translate-x-0 border-r border-slate-200 flex flex-col overflow-visible",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        isCollapsed ? "w-20" : "w-72"
      )}>
        {/* Collapsible Trigger for Desktop */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute right-[-12px] top-9 z-[120] w-6 h-6 bg-white hover:bg-slate-50 border border-slate-200 rounded-full text-slate-400 hover:text-slate-700 items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-sm"
        >
          <ChevronLeft size={12} className={cn("transition-transform duration-300", isCollapsed && "rotate-180")} />
        </button>

        {/* 1. Logo Section */}
        <div className={cn("transition-all duration-300", isCollapsed ? "p-4 flex justify-center" : "px-6 pt-7 pb-5")}>
          <div className={cn("flex items-center gap-3 cursor-pointer", isCollapsed ? "justify-center" : "")} onClick={() => navigate('/dashboard')}>
            {websiteLogo ? (
              <img src={websiteLogo} alt="Logo" className="w-10 h-10 object-contain rounded-xl shrink-0" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-[#6D4AFF] to-[#8B5CF6] text-white rounded-xl flex items-center justify-center shadow-sm shadow-[#6D4AFF]/30 shrink-0">
                <Cpu size={20} />
              </div>
            )}
            {!isCollapsed && (
              <div className="flex flex-col select-none max-w-[150px]">
                <span className="text-lg font-bold text-slate-900 tracking-tight leading-none truncate">{websiteName}</span>
                <span className="text-xs font-medium text-slate-400 mt-1">WhatsApp CRM</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. User / workspace card */}
        <div className={cn("px-4 mb-3 select-none", isCollapsed ? "flex justify-center" : "")}>
          <div
            onClick={() => setIsProfileModalOpen(true)}
            className={cn(
              "bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center cursor-pointer group transition-all duration-200 rounded-xl",
              isCollapsed ? "p-2 justify-center w-12 h-12" : "p-2.5 gap-3 w-full"
            )}
          >
            <div className={cn(
              "rounded-lg flex items-center justify-center font-bold transition-all duration-200 shrink-0 relative overflow-hidden",
              isCollapsed ? "w-8 h-8 text-sm" : "w-9 h-9 text-sm",
              isImageAvatar(user?.avatar) ? "bg-slate-100" : GRADIENTS[(user?.avatar as keyof typeof GRADIENTS) || 'royal']
            )}>
              {isImageAvatar(user?.avatar) ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name ? user.name.substring(0, 1).toUpperCase() : 'A'
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-slate-900 truncate leading-tight">{businessName || 'Workspace'}</p>
                <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{name || 'View profile'}</p>
              </div>
            )}
            {!isCollapsed && <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />}
          </div>
        </div>

        {/* 3. Navigation */}
        <div className="flex-1 px-3 overflow-y-auto custom-scrollbar">
          <div className="space-y-5 py-2">
            {menuItems.map((group) => (
              <div key={group.group} className="space-y-1">
                {!isCollapsed ? (
                  <p className="px-3 mb-1 text-xs font-semibold text-slate-400 tracking-wide select-none">{group.group}</p>
                ) : (
                  <div className="w-full h-px bg-slate-100 my-3" />
                )}
                <nav className="space-y-0.5">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.label}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) => cn(
                        "flex items-center rounded-xl text-sm font-medium transition-all duration-200 group relative cursor-pointer",
                        isCollapsed ? "p-2.5 justify-center" : "px-3 py-2.5 gap-3",
                        isActive
                          ? "bg-gradient-to-r from-[#6D4AFF] to-[#8B5CF6] text-white font-semibold shadow-sm shadow-[#6D4AFF]/30"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      )}
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon size={18} strokeWidth={2} className={cn("shrink-0 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />

                          {!isCollapsed && (
                            <span className="flex-1">{item.label}</span>
                          )}

                          {/* Hover Tooltips for Collapsed state */}
                          {isCollapsed && (
                            <div className="absolute left-[64px] top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 translate-x-[-6px] transition-all duration-200 bg-slate-900 text-white rounded-md px-2.5 py-1.5 whitespace-nowrap text-xs font-medium shadow-lg z-[70]">
                              {item.label}
                            </div>
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}
                </nav>
              </div>
            ))}
            {user?.role === 'superadmin' && (
              <div className="space-y-1 pt-2">
                {!isCollapsed ? (
                  <p className="px-3 mb-1 text-xs font-semibold text-indigo-650 tracking-wide select-none">System Controller</p>
                ) : (
                  <div className="w-full h-px bg-slate-100 my-3" />
                )}
                <nav className="space-y-0.5">
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => cn(
                      "flex items-center rounded-xl text-sm font-medium transition-all duration-200 group relative cursor-pointer",
                      isCollapsed ? "p-2.5 justify-center" : "px-3 py-2.5 gap-3",
                      isActive
                        ? "bg-gradient-to-r from-[#6D4AFF] to-[#8B5CF6] text-white font-semibold shadow-sm"
                        : "text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50"
                    )}
                  >
                    <Cpu size={18} strokeWidth={2} className="shrink-0 text-indigo-500 group-hover:text-indigo-650" />
                    {!isCollapsed && <span className="flex-1">Admin Panel</span>}
                    {isCollapsed && (
                      <div className="absolute left-[64px] top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 translate-x-[-6px] transition-all duration-200 bg-slate-900 text-white rounded-md px-2.5 py-1.5 whitespace-nowrap text-xs font-medium shadow-lg z-[70]">
                        Admin Panel
                      </div>
                    )}
                  </NavLink>
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* 4. Health Score Card */}
        {!isCollapsed && (
          <div className="px-4 pb-1">
            <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck size={15} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">Health Score</span>
                </div>
                <span className="text-sm font-bold text-slate-900">92%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#6D4AFF] to-[#8B5CF6]" style={{ width: '92%' }} />
              </div>
              <p className="text-[11px] font-medium text-emerald-600 mt-2">Excellent</p>
            </div>
          </div>
        )}

        {/* 5. Bottom sign out area */}
        <div className="border-t border-slate-200 p-3 mt-2">
          {!isCollapsed ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer"
            >
              <LogOut size={18} strokeWidth={2} className="shrink-0" />
              Sign Out
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="w-10 h-10 mx-auto flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer group relative"
            >
              <LogOut size={18} strokeWidth={2} />
              <div className="absolute left-[52px] top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 translate-x-[-6px] transition-all duration-200 bg-slate-900 text-white rounded-md px-2.5 py-1.5 whitespace-nowrap text-xs font-medium shadow-lg z-[70]">
                Sign Out
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
                      <h3 className="text-sm font-bold text-slate-900">Profile Settings</h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Update your name, business and avatar</p>
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
                        <p className="text-xs font-bold text-slate-500 text-center sm:text-left">Profile Picture</p>
                        <div className="flex gap-2 justify-center sm:justify-start">
                          <label className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm">
                            Upload Photo
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
                              Remove Photo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Gradient color option if not uploaded image */}
                    {!tempAvatar && (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-500">Or select a color theme</p>
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
                      <label className="block mb-2 text-xs font-semibold text-slate-500">Full Name</label>
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="E.g. Jane Doe"
                          className="w-full bg-slate-50 border border-slate-200/65 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-xs font-semibold text-slate-500">Business Name</label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                          type="text"
                          required
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="Corporate Organization"
                          className="w-full bg-slate-50 border border-slate-200/65 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1.5 text-xs font-semibold text-slate-500">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                          <input
                            type="email"
                            disabled
                            value={email}
                            className="w-full bg-slate-100/80 border border-slate-200/40 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-[#555] cursor-not-allowed"
                          />
                          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 opacity-60" size={10} />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1.5 text-xs font-semibold text-slate-500">Tenant ID</label>
                        <button
                          type="button"
                          onClick={handleCopyTenantId}
                          className="w-full bg-slate-100/80 hover:bg-slate-200/50 border border-slate-200/40 rounded-xl py-3 px-4 text-xs font-bold text-[#555] flex items-center justify-between transition-all group cursor-pointer"
                        >
                          <span className="font-mono text-slate-500">{user?.tenantId || 'Tenant-1'}</span>
                          {isCopied ? (
                            <span className="text-[8.5px] font-black text-indigo-600 uppercase tracking-widest">Copied</span>
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
                      className="flex items-center justify-between w-full text-left text-xs font-black text-[#6D4AFF] hover:text-[#8B5CF6] uppercase tracking-widest cursor-pointer hover:underline"
                    >
                      <span>🔒 Change Password</span>
                      <span>{showPasswordFields ? 'Hide' : 'Show'}</span>
                    </button>

                    {showPasswordFields && (
                      <div className="space-y-4 pt-1 animate-none">
                        <div>
                          <label className="block mb-2 text-xs font-semibold text-slate-500">Current Password</label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-50 border border-slate-200/65 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-2 text-xs font-semibold text-slate-500">New Password</label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Min. 6 characters"
                              className="w-full bg-slate-50 border border-slate-200/65 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block mb-2 text-xs font-semibold text-slate-500">Confirm New Password</label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirm password"
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
                            "Update Password"
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
                        Profile saved
                      </p>
                    )}
                    {showStatus === 'error' && (
                      <p className="text-xs font-semibold text-red-500 flex items-center gap-1.5">
                        <X size={14} />
                        Update failed
                      </p>
                    )}
                    {!showStatus && (
                      <span className="text-xs text-slate-400 font-medium">Changes are saved automatically</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => setIsProfileModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving || showStatus !== null}
                      className="relative min-w-[120px] px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 border border-indigo-600 text-xs font-semibold text-white shadow-sm active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                    >
                      {isSaving ? (
                        <Loader2 size={14} className="animate-spin text-white" />
                      ) : (
                        "Save Changes"
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
          <Sparkles size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6D4AFF] transition-all" strokeWidth={2.2}/>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Ask AI anything about contacts, campaigns, or conversations..."
            className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-11 pr-12 text-[13px] font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-[#6D4AFF] focus:ring-4 focus:ring-[#6D4AFF]/10 shadow-sm transition-all placeholder:text-slate-400"
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
                        <p className="px-2 mb-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">🧭 SYSTEM SHORTCUTS</p>
                        <div className="space-y-1">
                          <button 
                            onClick={() => handleSelectResult('/dashboard')}
                            className="w-full flex items-center justify-between p-2 rounded-lg text-slate-600 hover:text-indigo-950 text-[11px] font-semibold hover:bg-slate-50 transition-all"
                          >
                            <span className="flex items-center gap-2"><Compass size={14} /> Insights Center</span>
                            <span className="text-[9px] tracking-widest text-slate-300">GO/INSIGHTS</span>
                          </button>
                          <button 
                            onClick={() => handleSelectResult('/contacts')}
                            className="w-full flex items-center justify-between p-2 rounded-lg text-slate-600 hover:text-indigo-950 text-[11px] font-semibold hover:bg-slate-50 transition-all"
                          >
                            <span className="flex items-center gap-2"><Users size={14} /> CRM Audience Database</span>
                            <span className="text-[9px] tracking-widest text-slate-300">GO/CONTACTS</span>
                          </button>
                          <button 
                            onClick={() => handleSelectResult('/campaigns')}
                            className="w-full flex items-center justify-between p-2 rounded-lg text-slate-600 hover:text-indigo-950 text-[11px] font-semibold hover:bg-slate-50 transition-all"
                          >
                            <span className="flex items-center gap-2"><Send size={14} /> Engagement Campaigns</span>
                            <span className="text-[9px] tracking-widest text-slate-300">GO/CAMPAIGNS</span>
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
                          <p className="text-[11px] font-bold text-slate-500">No indexing matches found for "{query}"</p>
                          <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-1.5 hover:underline cursor-pointer flex items-center justify-center gap-1.5" onClick={() => handleSelectResult('/contacts', query)}>
                            <span>Force Search in CRM Contacts</span>
                            <ChevronRight size={10} />
                          </p>
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
        {/* Date selector */}
        <button className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[13px] font-medium text-slate-600 transition-all cursor-pointer">
          <Calendar size={15} className="text-slate-400" />
          <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <ChevronDown size={13} className="text-slate-400" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "relative w-10 h-10 flex items-center justify-center rounded-xl transition-all group cursor-pointer",
              showNotifications
                ? "bg-[#6D4AFF]/10 text-[#6D4AFF] border border-[#6D4AFF]/20"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
            )}
          >
            <Bell size={19} strokeWidth={2.2} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 min-w-[16px] h-4 px-1 flex items-center justify-center bg-rose-500 text-white text-[9px] font-bold rounded-full border-2 border-white">
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
                className="absolute right-0 mt-3 w-96 bg-white border border-slate-250/95 rounded-2xl shadow-floating overflow-hidden z-50 flex flex-col"
              >
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Alert Center</span>
                    {unreadCount > 0 && (
                      <span className="bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-[9.5px] font-black text-indigo-600 hover:text-indigo-900 uppercase tracking-widest transition-colors cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-[360px] overflow-y-auto custom-scrollbar divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="py-12 px-6 text-center select-none">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-3 border border-emerald-100">
                        <CheckCircle2 size={16} strokeWidth={2.5} />
                      </div>
                      <p className="text-[11px] font-bold text-slate-900">All Core Systems Nominal</p>
                      <p className="text-[9.5px] font-semibold text-slate-400 mt-1 uppercase tracking-wide">No pending action items or alerts</p>
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
                            "p-4 flex items-start gap-3.5 transition-all cursor-pointer group hover:bg-slate-50 relative",
                            n.unread ? "bg-indigo-50/15" : ""
                          )}
                        >
                          {/* Left icon wrapper */}
                          <div className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border",
                            n.category === 'campaign' && "bg-indigo-500/5 text-indigo-600 border-indigo-500/10",
                            n.category === 'whatsapp' && "bg-amber-500/5 text-amber-600 border-amber-500/10",
                            n.category === 'inbox' && "bg-rose-500/5 text-rose-600 border-rose-500/10",
                            n.category === 'system' && "bg-emerald-500/5 text-emerald-600 border-emerald-500/10"
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

                {/* Simulator Footer */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-wider">Interactive Sandbox Alert</span>
                  <button
                    onClick={() => {
                      const id = Date.now();
                      const mockAlerts = [
                        { id, title: 'Inbound WhatsApp Reply', desc: 'New system event: incoming broadcast query from lead +33 605 2921.', category: 'inbox', time: 'Just now', unread: true },
                        { id, title: 'Network Backup Triggered', desc: 'Secure database backup accomplished on high frequency node.', category: 'system', time: 'Just now', unread: true },
                        { id, title: 'High Peak Engagement', desc: 'Real-time campaign open rate exceeded target matrix.', category: 'campaign', time: 'Just now', unread: true }
                      ];
                      const selectedAlert = mockAlerts[Math.floor(Math.random() * mockAlerts.length)];
                      setNotifications(prev => [selectedAlert, ...prev]);
                    }}
                    className="flex items-center gap-1 bg-white border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 text-slate-500 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-sm"
                  >
                    <Plus size={9} strokeWidth={3} />
                    <span>Trigger Mock Alert</span>
                  </button>
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
                className="absolute right-0 mt-3 w-56 bg-white border border-slate-200/90 rounded-2xl shadow-floating overflow-hidden z-[60] py-1"
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
                    Sign Out
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-[#6D4AFF] selection:text-white overflow-x-hidden">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={toggleCollapsed} />
      <div className={cn(
        "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
        isCollapsed ? "lg:pl-20" : "lg:pl-72"
      )}>
        <Header />
        <main className="p-5 md:p-6 xl:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
