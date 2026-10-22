import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ChevronRight, 
  X, 
  FileCode,
  AlertCircle,
  History,
  RotateCw,
  GitFork,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { crmApi } from '../../services/crmApi';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../../i18n';

interface ExecutionLogItem {
  id?: number | string;
  step_name?: string;
  status?: string;
  message?: string;
  execution_time_ms?: number;
  created_at?: string | null;
}

interface Execution {
  id: string;
  raw_id?: number | string;
  workflow: string;
  contact: string;
  status: string;
  time: string;
  duration: string;
  created_at?: string | null;
  started_at?: string | null;
  finished_at?: string | null;
  logs?: ExecutionLogItem[];
  last_error?: string | null;
}

export default function ExecutionsPage() {
  const navigate = useNavigate();
  const { isRtl, language } = useI18n();
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed'>('all');
  const [selectedLog, setSelectedLog] = useState<Execution | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchExecutions = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await crmApi.getAutomationLogs();
      if (Array.isArray(data)) {
        setExecutions(data);
      } else {
        setExecutions([]);
      }
    } catch (err: any) {
      console.error('[Automation] Failed to load executions:', err);
      setErrorMessage(
        err?.message || 
        (language === 'ar' ? 'تعذر تحميل سجل التنفيذ من الخادم.' : 'Unable to load execution history.')
      );
      setExecutions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExecutions();
  }, []);

  const filteredLogs = executions.filter(l => {
    const term = search.toLowerCase().trim();
    const matchesSearch = !term ||
      (l.workflow && l.workflow.toLowerCase().includes(term)) || 
      (l.id && l.id.toLowerCase().includes(term)) ||
      (l.contact && l.contact.toLowerCase().includes(term));
    
    const status = (l.status || '').toLowerCase();
    const isSuccess = status === 'completed' || status === 'success';
    const isFailed = status === 'failed' || status === 'error';

    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'success' && isSuccess) ||
      (statusFilter === 'failed' && isFailed);
      
    return matchesSearch && matchesStatus;
  });

  const successCount = executions.filter(e => {
    const s = (e.status || '').toLowerCase();
    return s === 'completed' || s === 'success';
  }).length;

  const failedCount = executions.filter(e => {
    const s = (e.status || '').toLowerCase();
    return s === 'failed' || s === 'error';
  }).length;

  const renderStatusBadge = (statusStr: string) => {
    const s = (statusStr || '').toLowerCase();
    if (s === 'completed' || s === 'success') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border bg-[#F0FDF4] text-[#15803D] border-[#22C55E]/30">
          <CheckCircle2 size={12} className="text-[#22C55E]" />
          {language === 'ar' ? 'ناجح' : 'Success'}
        </span>
      );
    }
    if (s === 'failed' || s === 'error') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border bg-red-50 text-[#DC2626] border-red-200">
          <AlertCircle size={12} className="text-red-500" />
          {language === 'ar' ? 'فاشل' : 'Failed'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border bg-blue-50 text-[#1D4ED8] border-blue-200">
        <Clock size={12} className="text-blue-500" />
        {language === 'ar' ? 'قيد التشغيل' : (statusStr || 'Running')}
      </span>
    );
  };

  return (
    <div className={cn("space-y-6 bg-[#FFFFFF]", isRtl && "text-right")} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#12263A]">
            {language === 'ar' ? 'سجلات التنفيذ' : 'Execution Logs'}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 font-medium">
            {language === 'ar' 
              ? 'السجلات التاريخية لمسارات تنفيذ مهام الأتمتة المكتملة.' 
              : 'Historical records of completed workflow execution pipelines.'}
          </p>
        </div>
        <button
          onClick={fetchExecutions}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#12263A] hover:text-[#166534] bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <RotateCw size={14} className={cn("text-[#166534]", isLoading && "animate-spin")} />
          {language === 'ar' ? 'تحديث' : 'Refresh'}
        </button>
      </div>

      {/* Filter panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-4 border border-[#E2E8F0] rounded-2xl shadow-xs">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search size={15} className={cn("absolute top-1/2 -translate-y-1/2 text-[#64748B]", isRtl ? "right-3.5" : "left-3.5")} />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'ar' ? 'بحث برقم التنفيذ، جهة الاتصال، سير العمل...' : 'Search execution ID, contact, workflow...'}
            className={cn(
              "w-full h-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#12263A] focus:outline-none focus:ring-4 focus:ring-[#166534]/10 focus:border-[#166534] focus:bg-white transition-all placeholder:text-[#64748B]",
              isRtl ? "pr-10 pl-9 text-right" : "pl-10 pr-9 text-left"
            )}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className={cn("absolute top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#12263A]", isRtl ? "left-3" : "right-3")}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border",
              statusFilter === 'all'
                ? "bg-[#166534] text-white border-[#166534] shadow-xs"
                : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:text-[#12263A] hover:bg-[#F1F5F9]"
            )}
          >
            {language === 'ar' ? `الكل (${executions.length})` : `All (${executions.length})`}
          </button>
          <button
            onClick={() => setStatusFilter('success')}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border",
              statusFilter === 'success'
                ? "bg-[#166534] text-white border-[#166534] shadow-xs"
                : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:text-[#12263A] hover:bg-[#F1F5F9]"
            )}
          >
            {language === 'ar' ? `الناجحة (${successCount})` : `Success (${successCount})`}
          </button>
          <button
            onClick={() => setStatusFilter('failed')}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border",
              statusFilter === 'failed'
                ? "bg-[#166534] text-white border-[#166534] shadow-xs"
                : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:text-[#12263A] hover:bg-[#F1F5F9]"
            )}
          >
            {language === 'ar' ? `الفاشلة (${failedCount})` : `Failed (${failedCount})`}
          </button>
        </div>

      </div>

      {/* Logs Table / States Container */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
        
        {/* Loading State */}
        {isLoading && (
          <div className="p-8 sm:p-12 space-y-4">
            <div className="flex items-center justify-center gap-3 text-sm font-semibold text-[#64748B]">
              <RotateCw size={18} className="animate-spin text-[#166534]" />
              <span>{language === 'ar' ? 'جاري تحميل سجلات التنفيذ…' : 'Loading execution records…'}</span>
            </div>
            <div className="space-y-3 pt-4 max-w-4xl mx-auto">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && errorMessage && (
          <div className="text-center py-16 px-6 max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center text-red-600 mx-auto shadow-xs">
              <AlertCircle size={28} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#12263A]">
                {language === 'ar' ? 'تعذر تحميل سجل التنفيذ' : 'Unable to load execution history'}
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed">{errorMessage}</p>
            </div>
            <button
              onClick={fetchExecutions}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <RotateCw size={13} /> {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        )}

        {/* Zero Records Empty State (True empty history) */}
        {!isLoading && !errorMessage && executions.length === 0 && (
          <div className="text-center py-16 sm:py-20 px-6 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-[#F0FDF4] border border-[#22C55E]/30 rounded-2xl flex items-center justify-center text-[#166534] mx-auto shadow-xs">
              <History size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#12263A]">
                {language === 'ar' ? 'لا توجد سجلات تنفيذ حتى الآن' : 'No executions yet'}
              </h3>
              <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
                {language === 'ar' 
                  ? 'ستظهر هنا سجلات مسارات الأتمتة فور تشغيل المهام وسير العمل.' 
                  : 'Your workflow execution history will appear here after your workflows run.'}
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => navigate('/automation/workflows')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <GitFork size={14} /> {language === 'ar' ? 'الانتقال إلى سير العمل' : 'Go to Workflows'}
              </button>
            </div>
          </div>
        )}

        {/* Filtered 0-result State */}
        {!isLoading && !errorMessage && executions.length > 0 && filteredLogs.length === 0 && (
          <div className="text-center py-16 px-6 max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex items-center justify-center text-[#64748B] mx-auto">
              <Search size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#12263A]">
                {language === 'ar' ? 'لا توجد سجلات مطابقة' : 'No matching executions'}
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                {language === 'ar' 
                  ? 'لم يتم العثور على سجلات تنفيذ تطابق معايير الفلترة الحالية.' 
                  : 'No execution records found matching your active filter criteria.'}
              </p>
            </div>
            <button
              onClick={() => { setSearch(''); setStatusFilter('all'); }}
              className="text-xs font-semibold text-[#166534] hover:underline cursor-pointer"
            >
              {language === 'ar' ? 'مسح الفلاتر' : 'Clear filters'}
            </button>
          </div>
        )}

        {/* Populated Table */}
        {!isLoading && !errorMessage && filteredLogs.length > 0 && (
          <div className="overflow-x-auto custom-scrollbar">
            <table className={cn("w-full border-collapse", isRtl ? "text-right" : "text-left")}>
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <th className={cn("p-4 text-[11px] font-bold uppercase tracking-wider text-[#12263A]", isRtl ? "pr-6 pl-4" : "pl-6 pr-4")}>
                    {language === 'ar' ? 'معرّف التنفيذ' : 'Execution ID'}
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#12263A]">
                    {language === 'ar' ? 'اسم سير العمل' : 'Workflow Name'}
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#12263A]">
                    {language === 'ar' ? 'المستلم / جهة الاتصال' : 'Contact Recipient'}
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#12263A]">
                    {language === 'ar' ? 'المدة' : 'Duration'}
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#12263A]">
                    {language === 'ar' ? 'الحالة' : 'Status'}
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#12263A]">
                    {language === 'ar' ? 'وقت التنفيذ' : 'Execution Time'}
                  </th>
                  <th className={cn("p-4 w-12", isRtl ? "pl-6 pr-4" : "pr-6 pl-4")}></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredLogs.map((log) => (
                  <tr 
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                  >
                    <td className={cn("p-4 text-xs font-mono font-bold text-[#166534]", isRtl ? "pr-6 pl-4" : "pl-6 pr-4")}>
                      {log.id}
                    </td>
                    <td className="p-4 text-xs font-bold text-[#12263A] leading-tight">
                      {log.workflow}
                    </td>
                    <td className="p-4 text-xs font-medium text-[#12263A]">
                      {log.contact}
                    </td>
                    <td className="p-4 text-xs font-medium font-mono text-[#64748B]">
                      {log.duration}
                    </td>
                    <td className="p-4">
                      {renderStatusBadge(log.status)}
                    </td>
                    <td className="p-4 text-xs font-mono text-[#64748B]">
                      {log.time}
                    </td>
                    <td className={cn("p-4", isRtl ? "pl-6 pr-4 text-left" : "pr-6 pl-4 text-right")}>
                      <ChevronRight size={15} className={cn("text-[#64748B] group-hover:text-[#12263A] transition-colors inline-block", isRtl && "rotate-180")} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Detail Drawer */}
      <AnimatePresence>
        {selectedLog && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40" 
              onClick={() => setSelectedLog(null)} 
            />
            <motion.div
              initial={{ x: isRtl ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className={cn(
                "fixed top-0 bottom-0 w-full sm:w-[420px] bg-[#FFFFFF] shadow-2xl z-50 flex flex-col",
                isRtl ? "left-0 border-r border-[#E2E8F0]" : "right-0 border-l border-[#E2E8F0]"
              )}
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] border border-[#22C55E]/30 text-[#166534] flex items-center justify-center">
                    <FileCode size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#12263A] uppercase tracking-wider block">
                      {language === 'ar' ? 'تفاصيل التنفيذ' : 'Execution Details'}
                    </span>
                    <span className="text-[10px] font-mono font-medium text-[#64748B]">{selectedLog.id}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#12263A] hover:bg-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#FFFFFF]">
                
                {/* Metadata Card */}
                <div className="grid grid-cols-2 gap-4 bg-[#F8FAFC] p-4 border border-[#E2E8F0] rounded-xl">
                  <div>
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                      {language === 'ar' ? 'معرّف التنفيذ' : 'Execution ID'}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#12263A] mt-1 block">{selectedLog.id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                      {language === 'ar' ? 'الحالة' : 'Status'}
                    </span>
                    <div className="mt-1">
                      {renderStatusBadge(selectedLog.status)}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                      {language === 'ar' ? 'المدة' : 'Duration'}
                    </span>
                    <span className="text-xs font-mono font-semibold text-[#12263A] mt-1 block">{selectedLog.duration}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                      {language === 'ar' ? 'تاريخ التنفيذ' : 'Executed'}
                    </span>
                    <span className="text-xs font-medium text-[#12263A] mt-1 block">{selectedLog.time}</span>
                  </div>
                </div>

                {/* Target Workflow Info */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#12263A] uppercase tracking-wider block">
                    {language === 'ar' ? 'سير العمل المستهدف' : 'Target Workflow'}
                  </span>
                  <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                    <p className="text-sm font-bold text-[#12263A]">{selectedLog.workflow}</p>
                    <p className="text-xs text-[#64748B]">
                      {language === 'ar' ? 'المستلم:' : 'Recipient:'}{' '}
                      <span className="font-semibold text-[#12263A]">{selectedLog.contact}</span>
                    </p>
                  </div>
                </div>

                {/* Sub-step logs if present */}
                {selectedLog.logs && selectedLog.logs.length > 0 ? (
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-[#12263A] uppercase tracking-wider block">
                      {language === 'ar' ? 'خطوات المسار' : 'Pipeline Steps'}
                    </span>
                    <div className="space-y-2">
                      {selectedLog.logs.map((step, idx) => (
                        <div key={idx} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#12263A]">
                              {step.step_name || (language === 'ar' ? `الخطوة #${idx + 1}` : `Step #${idx + 1}`)}
                            </span>
                            <span className={cn(
                              "text-[10px] font-bold uppercase",
                              step.status === 'success' ? "text-[#15803D]" : "text-[#DC2626]"
                            )}>
                              {step.status === 'success' 
                                ? (language === 'ar' ? 'ناجح' : 'success') 
                                : (language === 'ar' ? 'فاشل' : 'failed')}
                            </span>
                          </div>
                          {step.message && (
                            <p className="text-[11px] text-[#64748B] font-mono leading-relaxed">{step.message}</p>
                          )}
                          {step.execution_time_ms !== undefined && (
                            <span className="text-[10px] text-[#64748B] font-mono block">{step.execution_time_ms}ms</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Error Banner if execution failed */}
                {selectedLog.last_error && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-700">
                      <AlertCircle size={14} /> {language === 'ar' ? 'تفاصيل الخطأ' : 'Error Details'}
                    </div>
                    <p className="text-xs text-red-600 font-mono leading-relaxed">{selectedLog.last_error}</p>
                  </div>
                )}

                {/* Trace Log Output */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#12263A] uppercase tracking-wider block">
                    {language === 'ar' ? 'سجل تتبع التنفيذ' : 'Execution Trace Log'}
                  </span>
                  <div className="p-4 bg-[#12263A] text-slate-200 rounded-xl border border-[#12263A] text-[11px] font-mono leading-relaxed overflow-x-auto custom-scrollbar" dir="ltr">
                    <p className="text-slate-400">[INFO] Pipeline execution initialized for workflow "{selectedLog.workflow}".</p>
                    <p className="text-slate-400">[INFO] Context recipient target: {selectedLog.contact}</p>
                    {selectedLog.status === 'failed' || selectedLog.status === 'error' ? (
                      <p className="text-red-400 mt-1">[ERROR] Execution failed: {selectedLog.last_error || 'Execution halted on error step.'}</p>
                    ) : (
                      <p className="text-emerald-400 mt-1">[SUCCESS] Execution finished successfully in {selectedLog.duration}.</p>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
