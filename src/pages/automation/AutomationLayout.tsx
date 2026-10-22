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
import { useI18n } from '../../i18n';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';

export default function AutomationLayout() {
  const location = useLocation();
  const { isRtl } = useI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const subMenuItems = [
    { 
      label: isRtl ? 'نظرة عامة' : 'Overview', 
      path: '/automation', 
      icon: LayoutDashboard, 
      desc: isRtl ? 'الرؤى والملخص العام' : 'Insights and summary' 
    },
    { 
      label: isRtl ? 'مسارات العمل' : 'Workflows', 
      path: '/automation/workflows', 
      icon: GitFork, 
      desc: isRtl ? 'مسارات وأنابيب الأتمتة' : 'Automation pipelines' 
    },
    { 
      label: isRtl ? 'سجلات التنفيذ' : 'Executions', 
      path: '/automation/executions', 
      icon: History, 
      desc: isRtl ? 'سجلات تشغيل العمليات' : 'Workflow execution records' 
    },
  ];

  const activeItem = subMenuItems.find(item => {
    if (item.path === '/automation') {
      return location.pathname === '/automation';
    }
    return location.pathname.startsWith(item.path);
  }) || subMenuItems[0];

  return (
    <div className={cn("min-h-[calc(100vh-112px)] flex flex-col lg:flex-row bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm relative select-none font-sans", isRtl && "text-right")} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Mobile submenu header */}
      <div className="lg:hidden p-4 bg-white border-b border-[#E2E8F0] flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] text-[#166534] border border-[#22C55E]/30 flex items-center justify-center">
            <activeItem.icon size={16} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#12263A] uppercase tracking-wider">{activeItem.label}</h3>
            <p className="text-[10px] text-[#64748B] font-medium mt-0.5">{activeItem.desc}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher variant="dropdown" />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#12263A] transition-all cursor-pointer border border-[#E2E8F0]"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Sidebar navigation */}
      <div className={cn(
        "lg:block w-full lg:w-[260px] shrink-0 bg-[#FFFFFF] flex-col transition-all duration-300 lg:translate-x-0 absolute lg:relative inset-y-0 z-30 lg:z-10",
        isRtl ? "right-0 lg:border-l border-[#E2E8F0]" : "left-0 lg:border-r border-[#E2E8F0]",
        isMobileMenuOpen 
          ? "translate-x-0 flex" 
          : (isRtl ? "translate-x-full lg:flex hidden" : "-translate-x-full lg:flex hidden")
      )}>
        <div className="lg:hidden p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
          <span className="text-xs font-bold text-[#12263A] uppercase tracking-wider">
            {isRtl ? 'قائمة الأتمتة' : 'Automation Menu'}
          </span>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[#64748B] hover:text-[#12263A]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="hidden lg:flex p-5 border-b border-[#E2E8F0] bg-white items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#12263A] tracking-tight">
              {isRtl ? 'لوحة الأتمتة والعمليات' : 'Automation Panel'}
            </h2>
            <p className="text-[11px] text-[#64748B] font-medium mt-0.5">
              {isRtl ? 'التحكم في المسارات' : 'Flow Controller'}
            </p>
          </div>
        </div>

        <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto custom-scrollbar bg-white">
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
                  "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer group relative",
                  isActive
                    ? "bg-[#166534] text-white shadow-sm font-bold"
                    : "text-[#64748B] hover:text-[#12263A] hover:bg-[#F0FDF4]"
                )}
              >
                <item.icon size={16} className={cn("shrink-0 transition-colors", isActive ? "text-white" : "text-[#64748B] group-hover:text-[#166534]")} />
                <div className="flex-1 min-w-0">
                  <span className="block truncate">{item.label}</span>
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Desktop Language Switcher Footer in sidebar */}
        <div className="hidden lg:flex p-3.5 border-t border-[#E2E8F0] bg-slate-50/50 justify-between items-center">
          <span className="text-[11px] font-bold text-slate-500">{isRtl ? 'اللغة' : 'Language'}</span>
          <LanguageSwitcher variant="dropdown" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-[#FFFFFF]">
        <main className="flex-1 p-5 md:p-6.5 overflow-y-auto custom-scrollbar relative min-h-0 bg-[#FFFFFF]">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
