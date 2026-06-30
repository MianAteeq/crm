import { useState, useEffect } from 'react';
import { 
  PauseCircle, 
  PlayCircle, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Activity,
  Workflow,
  ChevronRight
} from 'lucide-react';
import { crmApi } from '../../services/crmApi';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface Stats {
  totalWorkflows: number;
  activeWorkflows: number;
  messagesSentToday: number;
  totalExecutions: number;
}

interface Execution {
  id: string;
  workflow: string;
  contact: string;
  status: string;
  time: string;
  duration: string;
}

export default function AutomationDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalWorkflows: 0,
    activeWorkflows: 0,
    messagesSentToday: 0,
    totalExecutions: 0
  });
  
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const statsData = await crmApi.getAutomationDashboardStats();
        const execData = await crmApi.getAutomationLogs();
        if (statsData) setStats(statsData);
        if (execData) setExecutions(execData);
      } catch (err) {
        console.error('Failed to load automation dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Automation Overview</h1>
          <p className="text-xs text-slate-405 dark:text-slate-500 font-semibold mt-1 uppercase tracking-wider">Metrics and recent orchestration runs</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/60 rounded-xl text-indigo-650 text-[10px] font-black uppercase tracking-wider">
          <Activity size={12} className="animate-pulse" /> Live monitor
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Workflows', value: stats.totalWorkflows, icon: Workflow, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/40' },
          { label: 'Active Workflows', value: stats.activeWorkflows, icon: PlayCircle, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40' },
          { label: 'Messages Sent Today', value: stats.messagesSentToday, icon: Send, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/40' },
          { label: 'Total Executions', value: stats.totalExecutions, icon: CheckCircle2, color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/20 border-violet-100 dark:border-violet-900/40' },
        ].map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-750/70 rounded-2xl p-5 flex items-center justify-between shadow-sm relative group hover:border-indigo-500 transition-all"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-widest block">{card.label}</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white leading-none block">
                {isLoading ? '...' : card.value.toLocaleString()}
              </span>
            </div>
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border shrink-0", card.color)}>
              <card.icon size={18} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Executions list */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-750/70 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Recent Executions</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Chronological lists of active step pipelines</p>
          </div>
          <a href="/automation/executions" className="text-[10px] font-bold text-indigo-600 uppercase hover:underline flex items-center gap-0.5">
            View All Runs <ChevronRight size={12} />
          </a>
        </div>

        <div className="space-y-2.5 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
          {isLoading ? (
            <div className="text-center py-8 text-xs font-semibold text-slate-400">Loading recent runs...</div>
          ) : executions.length === 0 ? (
            <div className="text-center py-8 text-xs font-semibold text-slate-405">No executions found. Try deploying a workflow!</div>
          ) : (
            executions.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-50 dark:bg-slate-900/30 border border-slate-150/70 dark:border-slate-800 rounded-xl flex items-center justify-between gap-4"
              >
                <div className="min-w-0 flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full shrink-0 animate-pulse",
                    log.status === 'completed' || log.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                  )} />
                  <div className="min-w-0">
                    <p className="text-[11.5px] font-extrabold text-slate-900 dark:text-white truncate">{log.workflow}</p>
                    <p className="text-[9.5px] font-semibold text-slate-450 mt-0.5 flex items-center gap-1.5">
                      <span>Recipient: {log.contact}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>ID: {log.id}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={cn(
                    "px-2.5 py-1 text-[8.5px] font-black uppercase tracking-wider rounded-lg block text-center leading-none",
                    log.status === 'completed' || log.status === 'success' 
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-100 dark:border-emerald-900/20' 
                      : 'bg-red-50 dark:bg-red-950/20 text-red-650 border border-red-100 dark:border-red-900/20'
                  )}>
                    {log.status}
                  </span>
                  <span className="text-[8.5px] font-bold text-slate-400 mt-1 block font-mono">{log.time} ({log.duration})</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
