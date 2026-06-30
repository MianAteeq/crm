import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GitFork, 
  History, 
  Menu, 
  X 
} from 'lucide-react';
import { cn } from '../../lib/utils';

const subMenuItems = [
  { label: 'Overview', path: '/automation', icon: LayoutDashboard, desc: 'Insights and summary' },
  { label: 'Workflows', path: '/automation/workflows', icon: GitFork, desc: 'Automation pipelines' },
  { label: 'Executions', path: '/automation/executions', icon: History, desc: 'Workflow execution records' },
];

export default function AutomationLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeItem = subMenuItems.find(item => {
    if (item.path === '/automation') {
      return location.pathname === '/automation';
    }
    return location.pathname.startsWith(item.path);
  }) || subMenuItems[0];

  return (
    <div className="min-h-[calc(100vh-112px)] flex flex-col lg:flex-row bg-[#F8FAFC] dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm relative select-none">
      
      {/* Mobile submenu header */}
      <div className="lg:hidden p-4 bg-white dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-55 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:bg-indigo-950/40 text-indigo-650 flex items-center justify-center">
            <activeItem.icon size={16} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{activeItem.label}</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">{activeItem.desc}</p>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-350 transition-all cursor-pointer"
        >
          {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Sidebar navigation */}
      <div className={cn(
        "lg:block w-full lg:w-[260px] shrink-0 bg-white dark:bg-slate-850 lg:border-r border-slate-200/80 dark:border-slate-800 flex-col transition-all duration-300 lg:translate-x-0 absolute lg:relative inset-y-0 left-0 z-30 lg:z-10",
        isMobileMenuOpen ? "translate-x-0 flex" : "-translate-x-full lg:flex hidden"
      )}>
        <div className="lg:hidden p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-black text-slate-450 uppercase tracking-widest">Automation Menu</span>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-slate-450 hover:text-slate-900 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="hidden lg:block p-5 border-b border-slate-150/70 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/10">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">Automation Panel</h2>
          <p className="text-[10.5px] text-slate-400 dark:text-slate-505 font-semibold uppercase tracking-wider mt-1">Flow Controller</p>
        </div>

        <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto custom-scrollbar">
          {subMenuItems.map((item) => {
            const isActive = item.path === '/automation' 
              ? location.pathname === '/automation' 
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === '/automation'}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer group relative",
                  isActive
                    ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-450 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40"
                )}
              >
                <item.icon size={15} className={cn("shrink-0 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-650 dark:group-hover:text-slate-300")} />
                <div className="flex-1 min-w-0">
                  <span className="block truncate">{item.label}</span>
                </div>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-[#F8FAFC] dark:bg-slate-900">
        <main className="flex-1 p-5 md:p-6.5 overflow-y-auto custom-scrollbar relative min-h-0">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
