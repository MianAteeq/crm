import { useState, useEffect, useMemo } from 'react';
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
  Clock,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Play,
  StopCircle,
  Sparkles,
  ChevronDown,
  Info,
  ShieldCheck
} from 'lucide-react';
import { crmApi } from '../../services/crmApi';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from '../../components/ui/Toast';
import { useI18n } from '../../i18n';

interface ExecutionLogItem {
  id?: number | string;
  step_name?: string;
  status?: string;
  outcome?: string;
  message?: string;
  input_snapshot?: any;
  output_snapshot?: any;
  skip_reason?: string | null;
  error?: string | null;
  retry_count?: number;
  execution_time_ms?: number;
  created_at?: string | null;
}

interface Execution {
  id: string;
  raw_id?: number | string;
  workflow: string;
  workflow_id?: number | string;
  workflow_version?: string | null;
  contact: string;
  contact_id?: number | string;
  status: string;
  time: string;
  duration: string;
  step_count?: number;
  created_at?: string | null;
  started_at?: string | null;
  finished_at?: string | null;
  logs?: ExecutionLogItem[];
  last_error?: string | null;
  completion_reason?: string | null;
  cancellation_reason?: string | null;
}

export default function ExecutionsPage() {
  const navigate = useNavigate();
  const { isRtl, language } = useI18n();
  
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed' | 'running' | 'cancelled'>('all');
  const [selectedLog, setSelectedLog] = useState<Execution | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Troubleshooting Assistant State
  const [isTroubleshooting, setIsTroubleshooting] = useState(false);
  const [troubleshootData, setTroubleshootData] = useState<any | null>(null);
  const [isLoadingTroubleshoot, setIsLoadingTroubleshoot] = useState(false);

  // Expanded log steps state
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});

  const fetchExecutions = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await crmApi.getAutomationLogs();
      if (Array.isArray(data)) {
        setExecutions(data);
      } else if (Array.isArray(data?.data)) {
        setExecutions(data.data);
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

  const openExecution = async (execution: Execution) => {
    setSelectedLog(execution);
    setTroubleshootData(null);
    setExpandedSteps({});
    if (!execution.raw_id) return;
    setIsLoadingDetail(true);
    try {
      const detail = await crmApi.getAutomationExecution(execution.raw_id);
      setSelectedLog(detail);
    } catch (err) {
      console.error('[Automation] Failed to load execution detail:', err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleRetry = async () => {
    if (!selectedLog?.raw_id) return;
    setIsRetrying(true);
    try {
      const response = await crmApi.retryExecution(selectedLog.raw_id);
      toast.success(
        language === 'ar' ? 'تمت إعادة المحاولة' : 'Retry Dispatched',
        language === 'ar' ? 'تم جدولة إعادة تشغيل مسار العمل بنجاح.' : 'Workflow retry scheduled in background queue.'
      );
      if (response?.data) {
        setSelectedLog(response.data);
      }
      fetchExecutions();
    } catch (err: any) {
      toast.error(
        language === 'ar' ? 'خطأ' : 'Error',
        err?.message || (language === 'ar' ? 'فشل إعادة تشغيل المسار.' : 'Failed to retry execution.')
      );
    } finally {
      setIsRetrying(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedLog?.raw_id) return;
    setIsCancelling(true);
    try {
      const response = await crmApi.cancelExecution(selectedLog.raw_id);
      toast.success(
        language === 'ar' ? 'تم الإلغاء' : 'Execution Cancelled',
        language === 'ar' ? 'تم إلغاء عملية التنفيذ الحالية.' : 'Execution marked as cancelled.'
      );
      if (response?.data) {
        setSelectedLog(response.data);
      }
      fetchExecutions();
    } catch (err: any) {
      toast.error(
        language === 'ar' ? 'خطأ' : 'Error',
        err?.message || (language === 'ar' ? 'تعذر إلغاء التنفيذ.' : 'Failed to cancel execution.')
      );
    } finally {
      setIsCancelling(false);
    }
  };

  const handleTroubleshoot = async () => {
    if (!selectedLog?.raw_id) return;
    setIsLoadingTroubleshoot(true);
    try {
      const res = await crmApi.getExecutionTroubleshoot(selectedLog.raw_id);
      setTroubleshootData(res);
      setIsTroubleshooting(true);
    } catch (err: any) {
      toast.error(
        language === 'ar' ? 'خطأ في التحليل' : 'Analysis Error',
        err?.message || (language === 'ar' ? 'تعذر تشخيص حالة التنفيذ.' : 'Unable to diagnose execution.')
      );
    } finally {
      setIsLoadingTroubleshoot(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success(
      language === 'ar' ? 'تم النسخ' : 'Copied',
      language === 'ar' ? `تم نسخ ${text} إلى الحافظة.` : `Copied ${text} to clipboard.`
    );
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleStepExpanded = (idx: number) => {
    setExpandedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Mask sensitive values in snapshot JSON
  const redactSensitiveData = (data: any): string => {
    if (!data) return '—';
    try {
      const str = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      return str.replace(/("?(token|password|secret|key|access_token|authorization)"?\s*:\s*)"([^"]+)"/gi, '$1"***REDACTED***"');
    } catch {
      return String(data);
    }
  };

  useEffect(() => {
    fetchExecutions();
  }, []);

  const filteredLogs = useMemo(() => {
    return executions.filter(l => {
      const term = search.toLowerCase().trim();
      const matchesSearch = !term ||
        (l.workflow && l.workflow.toLowerCase().includes(term)) || 
        (l.id && l.id.toLowerCase().includes(term)) ||
        (l.contact && l.contact.toLowerCase().includes(term));
      
      const status = (l.status || '').toLowerCase();
      const isSuccess = status === 'completed' || status === 'success';
      const isFailed = status === 'failed' || status === 'error';
      const isRunning = status === 'pending' || status === 'running' || status === 'waiting';
      const isCancelled = status === 'cancelled';

      const matchesStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'success' && isSuccess) ||
        (statusFilter === 'failed' && isFailed) ||
        (statusFilter === 'running' && isRunning) ||
        (statusFilter === 'cancelled' && isCancelled);
        
      return matchesSearch && matchesStatus;
    });
  }, [executions, search, statusFilter]);

  const stats = useMemo(() => {
    let success = 0;
    let failed = 0;
    let running = 0;
    let cancelled = 0;
    executions.forEach(e => {
      const s = (e.status || '').toLowerCase();
      if (s === 'completed' || s === 'success') success++;
      else if (s === 'failed' || s === 'error') failed++;
      else if (s === 'cancelled') cancelled++;
      else running++;
    });
    return { total: executions.length, success, failed, running, cancelled };
  }, [executions]);

  const renderStatusBadge = (statusStr: string) => {
    const s = (statusStr || '').toLowerCase();
    if (s === 'completed' || s === 'success') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border bg-[#F0FDF4] text-[#15803D] border-[#22C55E]/30">
          <CheckCircle2 size={12} className="text-[#22C55E]" />
          {language === 'ar' ? 'مكتمل' : 'Completed'}
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
    if (s === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border bg-slate-100 text-slate-700 border-slate-300">
          <StopCircle size={12} className="text-slate-500" />
          {language === 'ar' ? 'ملغي' : 'Cancelled'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border bg-blue-50 text-[#1D4ED8] border-blue-200">
        <Clock size={12} className="text-blue-500 animate-spin" />
        {language === 'ar' ? 'قيد المعالجة' : (statusStr || 'Running')}
      </span>
    );
  };

  return (
    <div className={cn("space-y-6 bg-white min-h-[600px]", isRtl && "text-right")} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Title Header with Quick Reconciled Totals */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#12263A]">
            {language === 'ar' ? 'سجلات التنفيذ وتتبع المسارات' : 'Executions & Debugging'}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 font-medium">
            {language === 'ar' 
              ? 'مراقبة فورية وسجل تفصيلي خطوة بخطوة لجميع رسائل وأحداث مسارات العمل.' 
              : 'Real-time monitoring, step-by-step trace timelines, and troubleshooting for automation workflows.'}
          </p>
        </div>
        <button
          onClick={fetchExecutions}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#12263A] hover:text-[#166534] bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <RotateCw size={14} className={cn("text-[#166534]", isLoading && "animate-spin")} />
          {language === 'ar' ? 'تحديث السجلات' : 'Refresh Logs'}
        </button>
      </div>

      {/* Reconciled Totals Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
              {language === 'ar' ? 'إجمالي التنفيذات' : 'Total Executions'}
            </span>
            <span className="text-lg font-bold text-[#12263A] mt-0.5 block">{stats.total}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B]">
            <History size={16} />
          </div>
        </div>

        <div className="p-3.5 bg-[#F0FDF4] border border-[#22C55E]/30 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#166534] uppercase tracking-wider block">
              {language === 'ar' ? 'ناجحة / مكتملة' : 'Completed'}
            </span>
            <span className="text-lg font-bold text-[#166534] mt-0.5 block">{stats.success}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-white border border-[#22C55E]/40 flex items-center justify-center text-[#166534]">
            <CheckCircle2 size={16} />
          </div>
        </div>

        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block">
              {language === 'ar' ? 'فاشلة / أخطاء' : 'Failed / Errors'}
            </span>
            <span className="text-lg font-bold text-red-600 mt-0.5 block">{stats.failed}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-white border border-red-300 flex items-center justify-center text-red-600">
            <AlertCircle size={16} />
          </div>
        </div>

        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
              {language === 'ar' ? 'قيد التشغيل' : 'In Progress'}
            </span>
            <span className="text-lg font-bold text-blue-600 mt-0.5 block">{stats.running}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-white border border-blue-300 flex items-center justify-center text-blue-600">
            <Clock size={16} />
          </div>
        </div>
      </div>

      {/* Filter panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 border border-[#E2E8F0] rounded-2xl shadow-xs">
        
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
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['all', 'success', 'failed', 'running', 'cancelled'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border",
                statusFilter === tab
                  ? "bg-[#166534] text-white border-[#166534] shadow-xs"
                  : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:text-[#12263A] hover:bg-[#F1F5F9]"
              )}
            >
              {tab === 'all' && (language === 'ar' ? `الكل (${stats.total})` : `All (${stats.total})`)}
              {tab === 'success' && (language === 'ar' ? `ناجحة (${stats.success})` : `Success (${stats.success})`)}
              {tab === 'failed' && (language === 'ar' ? `فاشلة (${stats.failed})` : `Failed (${stats.failed})`)}
              {tab === 'running' && (language === 'ar' ? `جارية (${stats.running})` : `Running (${stats.running})`)}
              {tab === 'cancelled' && (language === 'ar' ? `ملغية (${stats.cancelled})` : `Cancelled (${stats.cancelled})`)}
            </button>
          ))}
        </div>

      </div>

      {/* Logs Table / States Container */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden">
        
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

        {/* Zero Records Empty State */}
        {!isLoading && !errorMessage && executions.length === 0 && (
          <div className="text-center py-16 sm:py-20 px-6 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-[#F0FDF4] border border-[#22C55E]/30 rounded-2xl flex items-center justify-center text-[#166534] mx-auto shadow-xs">
              <History size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#12263A]">
                {language === 'ar' ? 'لا توجد سجلات تنفيذ حتى الآن' : 'No executions recorded yet'}
              </h3>
              <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
                {language === 'ar' 
                  ? 'ستظهر هنا سجلات مسارات الأتمتة فور تشغيل المهام وسير العمل.' 
                  : 'Workflow executions will appear here immediately as triggers fire and actions run.'}
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
                    {language === 'ar' ? 'اسم سير العمل' : 'Workflow'}
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#12263A]">
                    {language === 'ar' ? 'المستلم / جهة الاتصال' : 'Recipient Contact'}
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#12263A]">
                    {language === 'ar' ? 'المدة' : 'Duration'}
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#12263A]">
                    {language === 'ar' ? 'الحالة' : 'Status'}
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#12263A]">
                    {language === 'ar' ? 'الخطوات' : 'Steps'}
                  </th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-[#12263A]">
                    {language === 'ar' ? 'وقت التنفيذ' : 'Executed'}
                  </th>
                  <th className={cn("p-4 w-12", isRtl ? "pl-6 pr-4" : "pr-6 pl-4")}></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredLogs.map((log) => (
                  <tr 
                    key={log.id}
                    onClick={() => openExecution(log)}
                    className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                  >
                    <td className={cn("p-4 text-xs font-mono font-bold text-[#166534]", isRtl ? "pr-6 pl-4" : "pl-6 pr-4")}>
                      <span className="flex items-center gap-1.5">
                        {log.id}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(log.id, log.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[#64748B] hover:text-[#12263A]"
                          title={language === 'ar' ? 'نسخ المعرّف' : 'Copy ID'}
                        >
                          {copiedId === log.id ? <Check size={12} className="text-[#166534]" /> : <Copy size={12} />}
                        </button>
                      </span>
                    </td>
                    <td className="p-4 text-xs font-bold text-[#12263A] leading-tight">
                      <div className="flex items-center gap-1.5">
                        <span>{log.workflow}</span>
                        {log.workflow_version && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                            v{log.workflow_version}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-xs font-medium text-[#12263A]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono">{log.contact}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-medium font-mono text-[#64748B]">
                      {log.duration}
                    </td>
                    <td className="p-4">
                      {renderStatusBadge(log.status)}
                    </td>
                    <td className="p-4 text-xs font-mono font-bold text-[#64748B]">
                      {log.step_count ?? (log.logs ? log.logs.length : '—')}
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

      {/* Advanced Execution Detail Drawer */}
      <AnimatePresence>
        {selectedLog && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" 
              onClick={() => setSelectedLog(null)} 
            />
            <motion.div
              initial={{ x: isRtl ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className={cn(
                "fixed top-0 bottom-0 w-full sm:w-[540px] bg-white shadow-2xl z-50 flex flex-col",
                isRtl ? "left-0 border-r border-[#E2E8F0]" : "right-0 border-l border-[#E2E8F0]"
              )}
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] border border-[#22C55E]/30 text-[#166534] flex items-center justify-center shrink-0">
                    <FileCode size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#12263A] uppercase tracking-wider block">
                        {language === 'ar' ? 'سجل تتبع التنفيذ' : 'Execution Trace'}
                      </span>
                      {renderStatusBadge(selectedLog.status)}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] font-mono font-bold text-[#166534]">{selectedLog.id}</span>
                      <button
                        onClick={() => copyToClipboard(selectedLog.id, 'drawer-id')}
                        className="text-[#64748B] hover:text-[#12263A] p-0.5 rounded cursor-pointer"
                        title={language === 'ar' ? 'نسخ المعرّف' : 'Copy ID'}
                      >
                        {copiedId === 'drawer-id' ? <Check size={11} className="text-[#166534]" /> : <Copy size={11} />}
                      </button>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#12263A] hover:bg-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Functional Actions Ribbon */}
              <div className="p-3 bg-white border-b border-[#E2E8F0] flex items-center gap-2 overflow-x-auto custom-scrollbar">
                {/* Retry Failed Execution */}
                {(selectedLog.status === 'failed' || selectedLog.status === 'error') && (
                  <button
                    onClick={handleRetry}
                    disabled={isRetrying}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-lg text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    <Play size={12} className={cn(isRetrying && "animate-spin")} />
                    <span>{isRetrying ? (language === 'ar' ? 'جاري الإعادة...' : 'Retrying...') : (language === 'ar' ? 'إعادة تشغيل التنفيذ' : 'Retry Execution')}</span>
                  </button>
                )}

                {/* Cancel Pending/Active Execution */}
                {(selectedLog.status === 'pending' || selectedLog.status === 'running') && (
                  <button
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    <StopCircle size={12} />
                    <span>{isCancelling ? (language === 'ar' ? 'جاري الإلغاء...' : 'Cancelling...') : (language === 'ar' ? 'إلغاء التنفيذ' : 'Cancel Execution')}</span>
                  </button>
                )}

                {/* Troubleshooting Assistant Button */}
                <button
                  onClick={handleTroubleshoot}
                  disabled={isLoadingTroubleshoot}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#12263A] rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0"
                >
                  <Sparkles size={12} className={cn("text-amber-500", isLoadingTroubleshoot && "animate-spin")} />
                  <span>{isLoadingTroubleshoot ? (language === 'ar' ? 'جاري الفحص...' : 'Analyzing...') : (language === 'ar' ? 'مساعد استكشاف الأخطاء' : 'Troubleshoot Assistant')}</span>
                </button>

                {/* Open Workflow Builder */}
                {selectedLog.workflow_id && (
                  <button
                    onClick={() => navigate(`/automation/workflows/builder/${selectedLog.workflow_id}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#12263A] rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0"
                  >
                    <ExternalLink size={12} className="text-[#64748B]" />
                    <span>{language === 'ar' ? 'فتح سير العمل' : 'Open Workflow'}</span>
                  </button>
                )}

                {/* Open WhatsApp Conversation */}
                {selectedLog.contact && (
                  <button
                    onClick={() => navigate(`/inbox`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#12263A] rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0"
                  >
                    <MessageSquare size={12} className="text-[#166534]" />
                    <span>{language === 'ar' ? 'محادثة الواتساب' : 'Open Chat'}</span>
                  </button>
                )}
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-white">
                {isLoadingDetail && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] py-2">
                    <RotateCw size={13} className="animate-spin text-[#166534]" />
                    <span>{language === 'ar' ? 'جاري جلب تفاصيل الخطوات...' : 'Fetching execution logs & trace tree...'}</span>
                  </div>
                )}

                {/* Troubleshooting Diagnosis Panel */}
                <AnimatePresence>
                  {isTroubleshooting && troubleshootData && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                          <Sparkles size={14} className="text-amber-600" />
                          <span>{language === 'ar' ? 'تقرير فحص المساعد الذكي' : 'Diagnostic Analysis'}</span>
                        </div>
                        <button 
                          onClick={() => setIsTroubleshooting(false)} 
                          className="text-amber-700 hover:text-amber-900 p-0.5 rounded cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <div className="text-xs text-amber-950 leading-relaxed font-medium">
                        {troubleshootData.summary}
                      </div>

                      {troubleshootData.stopped_reason && (
                        <div className="p-2.5 bg-white/80 rounded-lg border border-amber-200/60 text-xs font-mono text-red-700">
                          <span className="font-bold">{language === 'ar' ? 'سبب التوقف: ' : 'Stop Reason: '}</span>
                          {troubleshootData.stopped_reason}
                        </div>
                      )}

                      {troubleshootData.issues && troubleshootData.issues.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                            {language === 'ar' ? 'المشكلات المكتشفة والتوصيات' : 'Detected Issues & Recommendations'}
                          </span>
                          {troubleshootData.issues.map((issue: any, idx: number) => (
                            <div key={idx} className="p-2.5 bg-white rounded-lg border border-amber-200 text-xs space-y-1">
                              <div className="font-bold text-[#12263A]">{issue.step}</div>
                              <div className="text-red-600 font-mono text-[11px]">{issue.reason}</div>
                              <div className="text-[#166534] text-[11px] font-medium pt-0.5 flex items-start gap-1">
                                <Info size={12} className="shrink-0 mt-0.5" />
                                <span>{issue.suggestion}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="text-[10px] text-amber-700 flex items-center gap-1 pt-1 border-t border-amber-200/60">
                        <ShieldCheck size={12} />
                        <span>{language === 'ar' ? 'فحص تشخيصي للعرض فقط. لا يتم تعديل مسار العمل تلقائياً.' : 'Read-only diagnosis. Workflows are never modified automatically.'}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Metadata Card */}
                <div className="grid grid-cols-2 gap-3 bg-[#F8FAFC] p-4 border border-[#E2E8F0] rounded-xl text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                      {language === 'ar' ? 'سير العمل' : 'Workflow'}
                    </span>
                    <span className="font-bold text-[#12263A] mt-1 block truncate">{selectedLog.workflow}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                      {language === 'ar' ? 'إصدار المسار' : 'Version'}
                    </span>
                    <span className="font-mono font-bold text-[#166534] mt-1 block">
                      {selectedLog.workflow_version ? `v${selectedLog.workflow_version}` : 'Draft / Latest'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                      {language === 'ar' ? 'المستلم' : 'Recipient'}
                    </span>
                    <span className="font-mono font-medium text-[#12263A] mt-1 block truncate">{selectedLog.contact}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                      {language === 'ar' ? 'المدة الإجمالية' : 'Total Duration'}
                    </span>
                    <span className="font-mono font-semibold text-[#12263A] mt-1 block">{selectedLog.duration}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                      {language === 'ar' ? 'تاريخ البدء' : 'Started At'}
                    </span>
                    <span className="font-mono text-[#64748B] mt-1 block text-[11px]">{selectedLog.started_at ? new Date(selectedLog.started_at).toLocaleString() : selectedLog.time}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                      {language === 'ar' ? 'تاريخ الانتهاء' : 'Finished At'}
                    </span>
                    <span className="font-mono text-[#64748B] mt-1 block text-[11px]">{selectedLog.finished_at ? new Date(selectedLog.finished_at).toLocaleString() : '—'}</span>
                  </div>
                </div>

                {/* Error Banner if execution failed */}
                {selectedLog.last_error && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-700">
                      <AlertCircle size={14} /> {language === 'ar' ? 'رسالة الخطأ الأخيرة' : 'Failure Reason'}
                    </div>
                    <p className="text-xs text-red-600 font-mono leading-relaxed break-words">{selectedLog.last_error}</p>
                  </div>
                )}

                {/* Cancellation Banner */}
                {selectedLog.cancellation_reason && (
                  <div className="p-3 bg-slate-100 border border-slate-300 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-700">
                      <StopCircle size={13} /> {language === 'ar' ? 'سبب الإلغاء' : 'Cancellation Reason'}
                    </div>
                    <p className="text-slate-600 font-medium">{selectedLog.cancellation_reason}</p>
                  </div>
                )}

                {/* Step-by-Step Interactive Timeline */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#12263A] uppercase tracking-wider block">
                      {language === 'ar' ? 'الجدول الزمني للخطوات' : 'Step-by-Step Timeline'}
                    </span>
                    <span className="text-[11px] text-[#64748B] font-mono">
                      {selectedLog.logs ? `${selectedLog.logs.length} ${language === 'ar' ? 'خطوات مسجلة' : 'steps recorded'}` : ''}
                    </span>
                  </div>

                  {selectedLog.logs && selectedLog.logs.length > 0 ? (
                    <div className="space-y-2.5 relative before:absolute before:top-3 before:bottom-3 before:left-3 before:w-0.5 before:bg-[#E2E8F0]">
                      {selectedLog.logs.map((step, idx) => {
                        const isSuccess = step.status === 'success' || step.outcome === 'success';
                        const isFailed = step.status === 'failed' || step.outcome === 'failed';
                        const isExpanded = !!expandedSteps[idx];

                        return (
                          <div 
                            key={idx} 
                            className={cn(
                              "relative pl-8 pr-3 py-3 bg-white border rounded-xl text-xs space-y-2 transition-all shadow-2xs",
                              isFailed ? "border-red-200 bg-red-50/30" : "border-[#E2E8F0] hover:border-[#166534]/40"
                            )}
                          >
                            {/* Step Indicator Dot */}
                            <div className={cn(
                              "absolute top-3.5 left-1.5 w-3.5 h-3.5 rounded-full border-2 bg-white flex items-center justify-center -translate-x-1/2",
                              isSuccess ? "border-[#22C55E]" : isFailed ? "border-red-500" : "border-slate-300"
                            )}>
                              <div className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                isSuccess ? "bg-[#22C55E]" : isFailed ? "bg-red-500" : "bg-slate-400"
                              )} />
                            </div>

                            {/* Step Header */}
                            <div className="flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <span className="font-bold text-[#12263A] block truncate">
                                  {step.step_name || (language === 'ar' ? `الخطوة #${idx + 1}` : `Step #${idx + 1}`)}
                                </span>
                                {step.created_at && (
                                  <span className="text-[10px] text-[#64748B] font-mono block">
                                    {new Date(step.created_at).toLocaleTimeString()}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {step.execution_time_ms !== undefined && (
                                  <span className="text-[10px] text-[#64748B] font-mono px-1.5 py-0.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                                    {step.execution_time_ms}ms
                                  </span>
                                )}
                                <span className={cn(
                                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                  isSuccess ? "bg-[#F0FDF4] text-[#15803D]" : isFailed ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-700"
                                )}>
                                  {step.status}
                                </span>
                                <button
                                  onClick={() => toggleStepExpanded(idx)}
                                  className="text-[#64748B] hover:text-[#12263A] p-1 rounded hover:bg-[#F8FAFC] cursor-pointer"
                                  title={isExpanded ? 'Collapse' : 'Expand'}
                                >
                                  <ChevronDown size={14} className={cn("transition-transform", isExpanded && "rotate-180")} />
                                </button>
                              </div>
                            </div>

                            {/* Message / Skip Reason */}
                            {step.message && (
                              <p className="text-[11px] text-[#64748B] font-medium leading-relaxed">
                                {step.message}
                              </p>
                            )}

                            {step.skip_reason && (
                              <div className="p-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-[10px] font-medium">
                                <span className="font-bold">{language === 'ar' ? 'تم التخطي: ' : 'Skipped: '}</span>
                                {step.skip_reason}
                              </div>
                            )}

                            {step.error && (
                              <div className="p-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-[10px] font-mono">
                                {step.error}
                              </div>
                            )}

                            {/* Expandable Snapshots */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="pt-2 border-t border-[#E2E8F0] space-y-2 text-[10px] font-mono"
                                >
                                  {step.input_snapshot && (
                                    <div>
                                      <span className="font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                                        {language === 'ar' ? 'لقطة المدخلات (Input Snapshot):' : 'Input Snapshot:'}
                                      </span>
                                      <pre className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#12263A] overflow-x-auto max-h-32 custom-scrollbar">
                                        {redactSensitiveData(step.input_snapshot)}
                                      </pre>
                                    </div>
                                  )}

                                  {step.output_snapshot && (
                                    <div>
                                      <span className="font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                                        {language === 'ar' ? 'لقطة المخرجات (Output Snapshot):' : 'Output Snapshot:'}
                                      </span>
                                      <pre className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#12263A] overflow-x-auto max-h-32 custom-scrollbar">
                                        {redactSensitiveData(step.output_snapshot)}
                                      </pre>
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-center text-xs text-[#64748B]">
                      {language === 'ar' ? 'لا توجد خطوات فرعية مسجلة لهذا التنفيذ.' : 'No step-level traces recorded for this execution.'}
                    </div>
                  )}
                </div>

                {/* Raw Trace Console Box */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-[#12263A] uppercase tracking-wider block">
                    {language === 'ar' ? 'سجل المحطة الطرفية' : 'Execution Terminal Log'}
                  </span>
                  <div className="p-3.5 bg-[#12263A] text-slate-200 rounded-xl border border-[#12263A] text-[10px] font-mono leading-relaxed overflow-x-auto custom-scrollbar" dir="ltr">
                    <p className="text-slate-400">[{selectedLog.started_at || '00:00:00'}] [INFO] Initialized flow execution for "{selectedLog.workflow}"</p>
                    <p className="text-slate-400">[{selectedLog.started_at || '00:00:00'}] [INFO] Contact recipient context: {selectedLog.contact}</p>
                    {selectedLog.logs?.map((l, i) => (
                      <p key={i} className={cn(l.status === 'failed' ? "text-red-400" : "text-slate-300")}>
                        [STEP {i + 1}] {l.step_name}: {l.status} {l.message ? `(${l.message})` : ''}
                      </p>
                    ))}
                    {selectedLog.status === 'failed' || selectedLog.status === 'error' ? (
                      <p className="text-red-400 mt-1">[ERROR] Pipeline failed: {selectedLog.last_error || 'Execution halted.'}</p>
                    ) : selectedLog.status === 'cancelled' ? (
                      <p className="text-amber-400 mt-1">[ABORT] Pipeline cancelled by user.</p>
                    ) : (
                      <p className="text-emerald-400 mt-1">[SUCCESS] Pipeline execution finished in {selectedLog.duration}.</p>
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
