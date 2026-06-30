import { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronRight, 
  X, 
  FileCode,
  AlertCircle
} from 'lucide-react';
import { crmApi } from '../../services/crmApi';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Execution {
  id: string;
  workflow: string;
  contact: string;
  status: string;
  time: string;
  duration: string;
}

export default function ExecutionsPage() {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<Execution | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExecutions = async () => {
    try {
      const data = await crmApi.getAutomationLogs();
      if (data && Array.isArray(data)) {
        setExecutions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExecutions();
  }, []);

  const filteredLogs = executions.filter(l => {
    const matchesSearch = l.workflow.toLowerCase().includes(search.toLowerCase()) || 
                          l.id.toLowerCase().includes(search.toLowerCase()) ||
                          l.contact.includes(search);
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'success' && (l.status === 'completed' || l.status === 'success')) ||
      (statusFilter === 'failed' && l.status === 'failed');
      
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Execution Logs</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1 uppercase tracking-wider">Historical records of completed workflow execution pipelines</p>
        </div>
      </div>

      {/* Filter panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 border border-slate-200/80 dark:border-slate-750/70 rounded-2xl shadow-sm">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search execution ID, contact, workflow..."
            className="w-full h-10 pl-10 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all placeholder:text-slate-450"
          />
        </div>

        {/* Status filters */}
        <div className="flex gap-2">
          {['all', 'success', 'failed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
                statusFilter === st
                  ? "bg-slate-900 dark:bg-indigo-650 text-white shadow-sm"
                  : "text-slate-550 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900"
              )}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-750/70 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          {isLoading ? (
            <div className="text-center py-16 text-xs font-semibold text-slate-400">Loading logs...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-16 text-xs font-semibold text-slate-400">No logs found matching criteria.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/10">
                  <th className="p-4 text-[9.5px] font-black uppercase tracking-wider text-slate-400">Execution ID</th>
                  <th className="p-4 text-[9.5px] font-black uppercase tracking-wider text-slate-400">Workflow Name</th>
                  <th className="p-4 text-[9.5px] font-black uppercase tracking-wider text-slate-400">Contact Recipient</th>
                  <th className="p-4 text-[9.5px] font-black uppercase tracking-wider text-slate-400">Duration</th>
                  <th className="p-4 text-[9.5px] font-black uppercase tracking-wider text-slate-400">Status</th>
                  <th className="p-4 text-[9.5px] font-black uppercase tracking-wider text-slate-400">Execution Time</th>
                  <th className="p-4 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => {
                  const isSuccess = log.status === 'completed' || log.status === 'success';
                  return (
                    <tr 
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors cursor-pointer"
                    >
                      <td className="p-4 text-xs font-mono font-bold text-indigo-600">{log.id}</td>
                      <td className="p-4 text-xs font-extrabold text-slate-800 dark:text-white leading-tight">{log.workflow}</td>
                      <td className="p-4 text-xs font-bold text-slate-650 dark:text-slate-305">{log.contact}</td>
                      <td className="p-4 text-xs font-bold font-mono text-slate-500">{log.duration}</td>
                      <td className="p-4">
                        <span className={cn(
                          "px-2.5 py-0.5 text-[8.5px] font-black uppercase tracking-wider rounded-md border",
                          isSuccess ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/10' : 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:border-red-900/10'
                        )}>
                          {log.status}
                        </span>
                      </td>
                      <td className="p-4 text-[10.5px] font-bold text-slate-400 font-mono">{log.time}</td>
                      <td className="p-4 text-right">
                        <ChevronRight size={14} className="text-slate-350" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Log Detail Drawer */}
      <AnimatePresence>
        {selectedLog && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setSelectedLog(null)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-96 bg-white dark:bg-slate-850 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-30 flex flex-col"
            >
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode size={15} className="text-indigo-600" />
                  <span className="text-[10px] font-black text-slate-850 dark:text-white uppercase tracking-widest">Execution Path Details</span>
                </div>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-200"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                
                {/* Meta details list */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/40 p-4 border border-slate-150/70 dark:border-slate-800 rounded-2xl">
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-widest block leading-none">Execution ID</span>
                    <span className="text-[11.5px] font-mono font-bold text-slate-900 dark:text-white mt-1.5 block leading-none">{selectedLog.id}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest block leading-none">Status</span>
                    <span className={cn(
                      "px-2.5 py-0.5 text-[8.5px] font-black uppercase tracking-wider rounded-md border mt-1.5 inline-block leading-none",
                      (selectedLog.status === 'completed' || selectedLog.status === 'success') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                    )}>
                      {selectedLog.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block leading-none">Duration</span>
                    <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 mt-1.5 block leading-none">{selectedLog.duration}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block leading-none">Executed</span>
                    <span className="text-xs font-bold text-slate-850 dark:text-slate-205 mt-1.5 block leading-none">{selectedLog.time}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block leading-none">Target Workflow Flow</span>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl">
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white leading-normal">{selectedLog.workflow}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Recipient: {selectedLog.contact}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block leading-none">Trace Log Output</span>
                  <div className="p-3.5 bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 text-[10.5px] font-mono leading-relaxed overflow-x-auto">
                    {`[INFO] Starting execution for workflow "${selectedLog.workflow}"...\n`}
                    {`[INFO] Node triggers matched successfully.\n`}
                    {`[INFO] Executing Action: Send Template Message.\n`}
                    {selectedLog.status === 'failed' ? (
                      <span className="text-red-400">{`[ERROR] Failed step send: User number is not registered on WhatsApp servers.`}</span>
                    ) : (
                      <span className="text-emerald-400">{`[SUCCESS] Workflow execution completed in ${selectedLog.duration}`}</span>
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
