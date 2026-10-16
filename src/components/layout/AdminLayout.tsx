import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users2,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Coins,
  Cpu,
  ArrowLeftRight,
  Globe
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuthStore } from '../../store/authStore';
import { useBrandingStore } from '../../store/brandingStore';

const adminMenuItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
  { icon: Building2, label: 'Workspaces', path: '/admin/tenants' },
  { icon: Users2, label: 'System Users', path: '/admin/users' },
  { icon: Globe, label: 'Sending Domains', path: '/admin/sending-domains' },
  { icon: Coins, label: 'Plans & Limits', path: '/admin/plans' },
  { icon: Settings, label: 'Global Settings', path: '/admin/settings' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const { websiteName, websiteLogo } = useBrandingStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'superadmin') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#12263A] overflow-x-hidden flex">
      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed top-6 right-6 z-[120] w-11 h-11 bg-white text-stone-700 rounded-xl shadow-lg flex items-center justify-center border border-stone-200"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-[110] bg-[#12263A] text-stone-300 transform transition-all duration-300 ease-in-out lg:translate-x-0 border-r border-[#166534]/30 flex flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        isCollapsed ? "w-20" : "w-64"
      )}>
        {/* Collapsible Trigger */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute right-[-12px] top-9 z-[120] w-6 h-6 bg-[#12263A] border border-[#166534]/40 rounded-full text-stone-400 hover:text-white items-center justify-center cursor-pointer shadow-md"
        >
          <ChevronLeft size={12} className={cn("transition-transform duration-300", isCollapsed && "rotate-180")} />
        </button>

        {/* Brand Logo */}
        <div className={cn("p-6 flex items-center gap-3 border-b border-white/10", isCollapsed ? "justify-center" : "")}>
          {websiteLogo ? (
            <img src={websiteLogo} alt="Logo" className="w-10 h-10 object-contain rounded-xl shrink-0" />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-[#12263A] to-[#166534] border border-[#22C55E]/30 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md">
              <Cpu size={20} className="text-[#22C55E]" />
            </div>
          )}
          {!isCollapsed && (
            <div className="flex flex-col select-none max-w-[150px]">
              <span className="text-sm font-bold text-white tracking-tight uppercase truncate">{websiteName}</span>
              <span className="text-[10px] font-bold text-[#22C55E] mt-0.5 tracking-wider uppercase">SaaS Controller</span>
            </div>
          )}
        </div>

        {/* User Card */}
        {!isCollapsed && (
          <div className="p-4 mx-3 my-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#166534] text-white font-bold text-sm flex items-center justify-center shadow-xs">
              SU
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'SaaS Admin'}</p>
              <p className="text-[10px] font-bold text-[#22C55E] uppercase mt-0.5">Super Admin</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {adminMenuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 group relative",
                isCollapsed ? "p-3.5 justify-center" : "px-4 py-3 gap-3.5",
                isActive
                  ? "bg-[#166534] text-white shadow-md shadow-[#166534]/25"
                  : "text-stone-300 hover:text-white hover:bg-white/10"
              )}
            >
              <item.icon size={16} className="shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
              {isCollapsed && (
                <div className="absolute left-[70px] top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 bg-[#12263A] text-white rounded-md px-2.5 py-1.5 whitespace-nowrap text-xs font-semibold shadow-lg z-[70] border border-[#166534]/40">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Sign Out */}
        <div className="border-t border-white/10 p-3">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center rounded-xl text-xs font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-all duration-150 cursor-pointer",
              isCollapsed ? "p-3.5 justify-center" : "px-4 py-3 gap-3.5"
            )}
          >
            <LogOut size={16} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={cn(
        "flex flex-col min-h-screen flex-1 transition-all duration-300",
        isCollapsed ? "lg:pl-20" : "lg:pl-64"
      )}>
        <main className="p-6 md:p-8 xl:p-10 max-w-7xl w-full mx-auto flex-1">
          <Outlet />
        </main>
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
    </div>
  );
}
