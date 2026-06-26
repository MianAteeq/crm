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
  ArrowLeftRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuthStore } from '../../store/authStore';
import { useBrandingStore } from '../../store/brandingStore';

const adminMenuItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
  { icon: Building2, label: 'Workspaces', path: '/admin/tenants' },
  { icon: Users2, label: 'System Users', path: '/admin/users' },
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
    <div className="min-h-screen bg-slate-100 text-slate-900 overflow-x-hidden flex">
      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed top-6 right-6 z-[60] w-11 h-11 bg-white text-slate-700 rounded-xl shadow-lg flex items-center justify-center border border-slate-200"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 bg-slate-900 text-slate-300 transform transition-all duration-300 ease-in-out lg:translate-x-0 border-r border-slate-800 flex flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        isCollapsed ? "w-20" : "w-64"
      )}>
        {/* Collapsible Trigger */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute right-[-12px] top-9 z-50 w-6 h-6 bg-slate-900 border border-slate-800 rounded-full text-slate-500 hover:text-slate-200 items-center justify-center cursor-pointer shadow-md"
        >
          <ChevronLeft size={12} className={cn("transition-transform duration-300", isCollapsed && "rotate-180")} />
        </button>

        {/* Brand Logo */}
        <div className={cn("p-6 flex items-center gap-3 border-b border-slate-800", isCollapsed ? "justify-center" : "")}>
          {websiteLogo ? (
            <img src={websiteLogo} alt="Logo" className="w-10 h-10 object-contain rounded-xl shrink-0" />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-900/30">
              <Cpu size={20} />
            </div>
          )}
          {!isCollapsed && (
            <div className="flex flex-col select-none max-w-[150px]">
              <span className="text-sm font-bold text-white tracking-tight uppercase truncate">{websiteName}</span>
              <span className="text-[10px] font-bold text-indigo-400 mt-0.5 tracking-wider uppercase">SaaS Controller</span>
            </div>
          )}
        </div>

        {/* User Card */}
        {!isCollapsed && (
          <div className="p-4 mx-3 my-4 bg-slate-800/40 rounded-xl border border-slate-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500 text-white font-bold text-sm flex items-center justify-center">
              SU
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'SaaS Admin'}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Super Admin</p>
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
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <item.icon size={16} className="shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
              {isCollapsed && (
                <div className="absolute left-[70px] top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 bg-slate-950 text-white rounded-md px-2.5 py-1.5 whitespace-nowrap text-xs font-semibold shadow-lg z-[70]">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Sign Out */}
        <div className="border-t border-slate-800 p-3">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center rounded-xl text-xs font-bold uppercase tracking-wider text-rose-500 hover:text-rose-400 hover:bg-rose-950/20 transition-all duration-150",
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
