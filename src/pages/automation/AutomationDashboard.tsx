import { useState, useEffect } from 'react';
import { 
  PlayCircle, 
  Send, 
  CheckCircle2, 
  Activity,
  Workflow,
  ChevronRight,
  History
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
        if (Array.isArray(execData)) setExecutions(execData);
      } catch (err) {
        console.error('Failed to load automation dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6 bg-[#FFFFFF]">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#12263A]">Automation Overview</h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 font-medium">Metrics and recent orchestration runs.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F0FDF4] border border-[#22C55E]/30 rounded-xl text-[#166534] text-xs font-bold uppercase tracking-wider">
          <Activity size={13} className="animate-pulse" /> Live monitor
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Workflows', value: stats.totalWorkflows, icon: Workflow, color: 'text-[#166534] bg-[#F0FDF4] border-[#22C55E]/30' },
          { label: 'Active Workflows', value: stats.activeWorkflows, icon: PlayCircle, color: 'text-[#15803D] bg-[#F0FDF4] border-[#22C55E]/30' },
          { label: 'Messages Sent Today', value: stats.messagesSentToday, icon: Send, color: 'text-blue-600 bg-blue-50 border-blue-200' },
          { label: 'Total Executions', value: stats.totalExecutions, icon: CheckCircle2, color: 'text-violet-600 bg-violet-50 border-violet-200' },
        ].map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 flex items-center justify-between shadow-xs hover:shadow-sm transition-all"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">{card.label}</span>
              <span className="text-2xl font-bold text-[#12263A] leading-none block font-mono">
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
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-sm font-bold text-[#12263A] uppercase tracking-wider">Recent Executions</h3>
            <p className="text-xs text-[#64748B] mt-0.5">Chronological list of workflow executions</p>
          </div>
          <a href="/automation/executions" className="text-xs font-bold text-[#166534] uppercase hover:underline flex items-center gap-1">
            View All Runs <ChevronRight size={13} />
          </a>
        </div>

        <div className="space-y-2.5 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
          {isLoading ? (
            <div className="text-center py-8 text-xs font-semibold text-[#64748B]">Loading recent runs...</div>
          ) : executions.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <div className="w-10 h-10 bg-[#F0FDF4] border border-[#22C55E]/30 rounded-xl flex items-center justify-center text-[#166534] mx-auto">
                <History size={20} />
              </div>
              <p className="text-xs font-semibold text-[#12263A]">No executions recorded yet</p>
              <p className="text-[11px] text-[#64748B]">Workflows will log their runs here once triggered.</p>
            </div>
          ) : (
            executions.map((log) => (
              <div
                key={log.id}
                className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between gap-4 hover:bg-[#F1F5F9] transition-colors"
              >
                <div className="min-w-0 flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    log.status === 'completed' || log.status === 'success' ? 'bg-[#22C55E]' : 'bg-red-500'
                  )} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#12263A] truncate">{log.workflow}</p>
                    <p className="text-[11px] text-[#64748B] mt-0.5 flex items-center gap-2">
                      <span>Recipient: {log.contact}</span>
                      <span>•</span>
                      <span className="font-mono text-[#166534] font-semibold">{log.id}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={cn(
                    "px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md border block text-center leading-normal",
                    log.status === 'completed' || log.status === 'success' 
                      ? 'bg-[#F0FDF4] text-[#15803D] border-[#22C55E]/30' 
                      : 'bg-red-50 text-[#DC2626] border-red-200'
                  )}>
                    {log.status}
                  </span>
                  <span className="text-[10px] text-[#64748B] mt-1 block font-mono">{log.time} ({log.duration})</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
