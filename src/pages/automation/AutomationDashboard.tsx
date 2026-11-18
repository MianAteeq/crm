import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlayCircle, 
  Send, 
  CheckCircle2, 
  Activity,
  GitFork,
  ChevronRight,
  History,
  AlertTriangle,
  PauseCircle,
  Users,
  MessageSquare,
  ArrowUpRight,
  Sparkles,
  Plus,
  RefreshCw,
  Loader2,
  AlertCircle,
  Clock,
  ExternalLink,
  Zap,
  TrendingUp,
  X
} from 'lucide-react';
import { crmApi } from '../../services/crmApi';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../../i18n';
import { toast } from '../../components/ui/Toast';

interface DashboardStatsData {
  totalWorkflows: number;
  activeWorkflows: number;
  pausedWorkflows: number;
  errorWorkflows: number;
  activeEnrollments: number;
  messagesSentToday: number;
  completionRate: number;
  customerReplyRate: number;
  failedExecutions: number;
  recentExecutions?: any[];
  workflowsRequiringAttention?: any[];
  bestPerformingWorkflows?: any[];
}

export default function AutomationDashboard() {
  const navigate = useNavigate();
  const { isRtl } = useI18n();

  const [stats, setStats] = useState<DashboardStatsData>({
    totalWorkflows: 0,
    activeWorkflows: 0,
    pausedWorkflows: 0,
    errorWorkflows: 0,
    activeEnrollments: 0,
    messagesSentToday: 0,
    completionRate: 0,
    customerReplyRate: 0,
    failedExecutions: 0,
    recentExecutions: [],
    workflowsRequiringAttention: [],
    bestPerformingWorkflows: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Quick Test Dialog
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [selectedWorkflowForTest, setSelectedWorkflowForTest] = useState<number | null>(null);
  const [workflowOptions, setWorkflowOptions] = useState<any[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const statsData = await crmApi.getAutomationDashboardStats();
      if (statsData) {
        setStats(statsData);
      }
    } catch (err) {
      console.error('Failed to load automation dashboard stats:', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenTestModal = async () => {
    try {
      const workflows = await crmApi.getWorkflows();
      const list = Array.isArray(workflows) ? workflows : (workflows?.data || []);
      setWorkflowOptions(list);
      if (list.length > 0) {
        setSelectedWorkflowForTest(list[0].id);
      }
      setIsTestModalOpen(true);
    } catch (e: any) {
      toast.error(isRtl ? 'خطأ' : 'Error', 'Could not load workflows for testing.');
    }
  };

  const handleRunIsolatedTest = async () => {
    if (!selectedWorkflowForTest) return;
    setIsTesting(true);
    try {
      const res = await crmApi.testWorkflow(selectedWorkflowForTest, {
        trigger: 'dashboard_isolated_test',
        timestamp: new Date().toISOString()
      });
      toast.success(
        isRtl ? 'تم الاختبار بنجاح' : 'Test Finished',
        res?.message || (isRtl ? 'تمت عملية الاختبار المعزولة بنجاح دون أخطاء.' : 'Isolated dry run completed with no errors.')
      );
      setIsTestModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(isRtl ? 'خطأ في الاختبار' : 'Test Error', err?.message || 'Dry run test encountered an error.');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className={cn("space-y-6 bg-white font-sans", isRtl && "text-right")} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#12263A]">
            {isRtl ? 'نظرة عامة على أتمتة واتساب' : 'WhatsApp Automation Overview'}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 font-medium">
            {isRtl ? 'مؤشرات الأداء الحية، حالات التشغيل ومسارات العمل التي تتطلب انتباهاً.' : 'Real-time pipeline metrics, live throughput, and execution telemetry.'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2 border border-[#E2E8F0] rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh statistics"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin text-[#166534]" : ""} />
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F0FDF4] border border-[#22C55E]/30 rounded-xl text-[#166534] text-xs font-bold uppercase tracking-wider">
            <Activity size={13} className="animate-pulse" /> 
            {isRtl ? 'نظام حي ونشط' : 'Live Monitor'}
          </div>
        </div>
      </div>

      {/* Functional Quick Actions Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => navigate('/automation/workflows')}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#166534] text-white hover:bg-[#15803d] transition-all shadow-sm text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Plus size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold">{isRtl ? 'مسار عمل جديد' : 'New Workflow'}</h4>
            <p className="text-[10px] text-white/80">{isRtl ? 'إنشاء مسار فارغ' : 'Build from scratch'}</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/automation/templates')}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-amber-300 hover:bg-amber-50/40 transition-all shadow-sm text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Sparkles size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#12263A]">{isRtl ? 'استخدام قالب' : 'Use Template'}</h4>
            <p className="text-[10px] text-slate-500">{isRtl ? '14 قالب واتساب معتمد' : '14 WhatsApp playbooks'}</p>
          </div>
        </button>

        <button
          onClick={handleOpenTestModal}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-emerald-300 hover:bg-emerald-50/40 transition-all shadow-sm text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] text-[#166534] flex items-center justify-center shrink-0">
            <PlayCircle size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#12263A]">{isRtl ? 'اختبار مسار' : 'Test Workflow'}</h4>
            <p className="text-[10px] text-slate-500">{isRtl ? 'تشغيل بيئة محاكاة معزولة' : 'Isolated dry run'}</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/automation/executions?status=failed')}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-red-300 hover:bg-red-50/40 transition-all shadow-sm text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#12263A]">{isRtl ? 'التشغيل الفاشل' : 'Failed Executions'}</h4>
            <p className="text-[10px] text-slate-500">
              {stats.failedExecutions} {isRtl ? 'حالات فشل مسجلة' : 'errors to inspect'}
            </p>
          </div>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Total Workflows */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-[11px] font-bold uppercase tracking-wider">{isRtl ? 'إجمالي المسارات' : 'Total Workflows'}</span>
            <GitFork size={15} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#12263A]">{stats.totalWorkflows}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {stats.activeWorkflows} {isRtl ? 'نشط حالياً' : 'active'}
          </p>
        </div>

        {/* Active Workflows */}
        <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#22C55E]/30">
          <div className="flex items-center justify-between text-[#166534]">
            <span className="text-[11px] font-bold uppercase tracking-wider">{isRtl ? 'المسارات النشطة' : 'Active'}</span>
            <CheckCircle2 size={15} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#166534]">{stats.activeWorkflows}</span>
          </div>
          <p className="text-[10px] text-[#166534]/80 mt-1">
            {stats.pausedWorkflows} {isRtl ? 'متوقف مؤقتاً' : 'paused'}
          </p>
        </div>

        {/* Active Enrollments */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-[11px] font-bold uppercase tracking-wider">{isRtl ? 'المسجلون حالياً' : 'Enrollments'}</span>
            <Users size={15} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#12263A]">{stats.activeEnrollments}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {isRtl ? 'جهات اتصال قيد المسار' : 'Contacts in progress'}
          </p>
        </div>

        {/* Messages Sent Today */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-[11px] font-bold uppercase tracking-wider">{isRtl ? 'رسائل اليوم' : 'Sent Today'}</span>
            <Send size={15} className="text-[#166534]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#12263A]">{stats.messagesSentToday}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {isRtl ? 'رسائل واتساب صادرة' : 'WhatsApp dispatches'}
          </p>
        </div>

        {/* Completion Rate */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-[11px] font-bold uppercase tracking-wider">{isRtl ? 'نسبة الإكمال' : 'Completion Rate'}</span>
            <TrendingUp size={15} className="text-[#166534]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#12263A]">{stats.completionRate}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#166534] h-full rounded-full" style={{ width: `${Math.min(stats.completionRate, 100)}%` }} />
          </div>
        </div>

        {/* Customer Reply Rate */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-[11px] font-bold uppercase tracking-wider">{isRtl ? 'نسبة الردود' : 'Reply Rate'}</span>
            <MessageSquare size={15} className="text-[#166534]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#166534]">{stats.customerReplyRate}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#22C55E] h-full rounded-full" style={{ width: `${Math.min(stats.customerReplyRate, 100)}%` }} />
          </div>
        </div>

      </div>

      {/* Two Column Layout: Workflows Requiring Attention & Best Performing Workflows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Workflows Requiring Attention */}
        <div className="border border-[#E2E8F0] rounded-2xl p-5 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <AlertCircle size={15} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#12263A]">
                  {isRtl ? 'مسارات تتطلب الانتباه' : 'Workflows Requiring Attention'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isRtl ? 'مسارات تواجه حالات فشل أو مسجلة بحالة خطأ' : 'Pipelines with logged execution errors or retry spikes'}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/automation/workflows?status=error')}
              className="text-xs font-bold text-[#166534] hover:underline flex items-center gap-1"
            >
              {isRtl ? 'عرض الكل' : 'View All'} <ChevronRight size={13} />
            </button>
          </div>

          {(!stats.workflowsRequiringAttention || stats.workflowsRequiringAttention.length === 0) ? (
            <div className="py-8 text-center text-slate-400">
              <CheckCircle2 size={24} className="mx-auto text-emerald-500 mb-2" />
              <p className="text-xs font-bold text-slate-700">{isRtl ? 'كل المسارات تعمل بكفاءة' : 'All workflows operating cleanly'}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{isRtl ? 'لا توجد أخطاء حرجة مسجلة حالياً.' : 'No active errors or failure alerts.'}</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {stats.workflowsRequiringAttention.map((w: any) => (
                <div 
                  key={w.id} 
                  className="p-3 bg-red-50/50 border border-red-100 rounded-xl flex items-center justify-between hover:bg-red-50 transition-colors"
                >
                  <div className="space-y-0.5">
                    <button
                      onClick={() => navigate(`/automation/workflows/builder/${w.id}`)}
                      className="text-xs font-bold text-[#12263A] hover:text-[#166534] text-left block"
                    >
                      {w.name}
                    </button>
                    <p className="text-[10px] text-red-600 font-semibold">
                      {w.failureCount || 1} {isRtl ? 'عمليات تنفيذ فاشلة مؤخراً' : 'failures recorded'}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/automation/executions?workflow_id=${w.id}&status=failed`)}
                    className="px-2.5 py-1 bg-white border border-red-200 rounded-lg text-[11px] font-bold text-red-700 hover:bg-red-50"
                  >
                    {isRtl ? 'تشخيص' : 'Inspect'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Best Performing Workflows */}
        <div className="border border-[#E2E8F0] rounded-2xl p-5 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#F0FDF4] text-[#166534] flex items-center justify-center">
                <TrendingUp size={15} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#12263A]">
                  {isRtl ? 'أفضل المسارات أداءً' : 'Best Performing Workflows'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isRtl ? 'مسارات تحقق أعلى معدلات إكمال وتفاعل' : 'Highest completion and engagement rates'}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/automation/workflows')}
              className="text-xs font-bold text-[#166534] hover:underline flex items-center gap-1"
            >
              {isRtl ? 'عرض الكل' : 'View All'} <ChevronRight size={13} />
            </button>
          </div>

          {(!stats.bestPerformingWorkflows || stats.bestPerformingWorkflows.length === 0) ? (
            <div className="py-8 text-center text-slate-400">
              <GitFork size={24} className="mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-700">{isRtl ? 'لا توجد بيانات تشغيل كافية' : 'No execution data yet'}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{isRtl ? 'قم بنشر مسار لبدء تسجيل مؤشرات الأداء.' : 'Publish active workflows to observe performance metrics.'}</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {stats.bestPerformingWorkflows.map((w: any) => (
                <div 
                  key={w.id} 
                  className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center justify-between hover:bg-slate-100/70 transition-colors"
                >
                  <div className="space-y-0.5">
                    <button
                      onClick={() => navigate(`/automation/workflows/builder/${w.id}`)}
                      className="text-xs font-bold text-[#12263A] hover:text-[#166534] text-left block"
                    >
                      {w.name}
                    </button>
                    <p className="text-[10px] text-slate-500">
                      {w.totalExecutions || 0} {isRtl ? 'تشغيل' : 'runs'} · {w.completionRate || 100}% {isRtl ? 'إكمال' : 'completion'}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-[#F0FDF4] border border-[#22C55E]/30 text-[#166534] rounded-lg text-[11px] font-bold">
                    {w.replyRate || 0}% {isRtl ? 'ردود' : 'replies'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Recent Executions Log Preview */}
      <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden bg-white shadow-sm space-y-3 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <History size={15} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#12263A]">
                {isRtl ? 'سجلات التنفيذ الأخيرة' : 'Recent Workflow Executions'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isRtl ? 'متابعة العمليات المنفذة في الوقت الفعلي' : 'Real-time trace of completed and in-flight executions'}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/automation/executions')}
            className="text-xs font-bold text-[#166534] hover:underline flex items-center gap-1"
          >
            {isRtl ? 'عرض كافة السجلات' : 'View Full History'} <ChevronRight size={13} />
          </button>
        </div>

        {(!stats.recentExecutions || stats.recentExecutions.length === 0) ? (
          <div className="py-12 text-center text-slate-400">
            <History size={24} className="mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-700">{isRtl ? 'لا توجد سجلات تشغيل حديثة' : 'No execution logs recorded yet'}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{isRtl ? 'ستظهر السجلات هنا فور بدء تشغيل مسارات العمل.' : 'Incoming trigger dispatches will populate this timeline.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[#64748B] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-2.5">{isRtl ? 'المعرف' : 'Execution ID'}</th>
                  <th className="p-2.5">{isRtl ? 'مسار العمل' : 'Workflow'}</th>
                  <th className="p-2.5">{isRtl ? 'جهة الاتصال' : 'Contact'}</th>
                  <th className="p-2.5">{isRtl ? 'الحالة' : 'Status'}</th>
                  <th className="p-2.5">{isRtl ? 'المدة' : 'Duration'}</th>
                  <th className="p-2.5">{isRtl ? 'التوقيت' : 'Time'}</th>
                  <th className="p-2.5 text-center">{isRtl ? 'إجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {stats.recentExecutions.map((e: any) => (
                  <tr key={e.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="p-2.5 font-mono text-[11px] text-slate-500">{e.id}</td>
                    <td className="p-2.5 font-bold text-[#12263A]">{e.workflow}</td>
                    <td className="p-2.5 text-slate-600 font-mono text-[11px]">{e.contact}</td>
                    <td className="p-2.5">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                        e.status === 'completed' && "bg-[#F0FDF4] text-[#166534]",
                        e.status === 'failed' && "bg-red-50 text-red-700",
                        e.status === 'running' && "bg-amber-50 text-amber-700 animate-pulse",
                        e.status === 'pending' && "bg-slate-100 text-slate-600"
                      )}>
                        {e.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-500 text-[11px] font-mono">{e.duration}</td>
                    <td className="p-2.5 text-slate-500 text-[11px]">{e.time}</td>
                    <td className="p-2.5 text-center">
                      <button
                        onClick={() => navigate(`/automation/executions?id=${e.raw_id || e.id}`)}
                        className="text-slate-400 hover:text-[#166534] p-1"
                        title="View details"
                      >
                        <ExternalLink size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: Isolated Workflow Test Run */}
      <AnimatePresence>
        {isTestModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#166534] flex items-center justify-center">
                    <PlayCircle size={17} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#12263A]">{isRtl ? 'تشغيل اختبار معزول' : 'Run Isolated Dry Test'}</h3>
                    <p className="text-[11px] text-slate-500">{isRtl ? 'يحاكي تنفيذ المسار دون إرسال رسائل حقيقية للعملاء' : 'Executes workflow graph without dispatching external messages'}</p>
                  </div>
                </div>
                <button onClick={() => setIsTestModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={17} />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRtl ? 'اختر مسار العمل للاختبار' : 'Select Target Workflow'}
                </label>
                <select
                  value={selectedWorkflowForTest || ''}
                  onChange={(e) => setSelectedWorkflowForTest(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#166534]"
                >
                  {workflowOptions.map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.status})</option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600">
                <p className="font-bold text-[#12263A] mb-1">{isRtl ? 'ملاحظة الأمان:' : 'Sandbox Safety Guarantee:'}</p>
                {isRtl ? 'لا يتم إرسال رسائل WhatsApp حقيقية أو تعديل جهات الاتصال الإنتاجية أثناء الاختبار المعزول.' : 'Live WhatsApp network dispatches and contact mutators are safely simulated during this sandbox run.'}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsTestModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  disabled={!selectedWorkflowForTest || isTesting}
                  onClick={handleRunIsolatedTest}
                  className="px-4 py-2 bg-[#166534] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isTesting && <Loader2 size={13} className="animate-spin" />}
                  {isRtl ? 'بدء الاختبار الآن' : 'Execute Test Run'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
