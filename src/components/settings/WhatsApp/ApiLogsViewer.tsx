import React from 'react';
import { Terminal, Shield, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { ApiLog } from '../../../types';
import { formatSafeTime } from '../../../lib/utils';

interface ApiLogsViewerProps {
  logs: ApiLog[];
}

export default function ApiLogsViewer({ logs }: ApiLogsViewerProps) {
  return (
    <div className="p-8 bg-white border border-slate-100 rounded-3xl space-y-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center border border-slate-100">
             <Terminal size={18} />
          </div>
          <div>
             <h3 className="text-base font-bold text-slate-900 tracking-tight">System Logs</h3>
             <p className="text-xs font-medium text-slate-400">Real-time API communication events</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest">Listening</span>
        </div>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {(!logs || logs.length === 0) ? (
          <div className="py-20 text-center opacity-40">
             <Shield size={48} className="mx-auto mb-6 text-slate-200" />
             <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">No active events logged</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-slate-300 transition-all group">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                     <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${log.method === 'POST' ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'}`}>
                        {log.method}
                     </span>
                     <span className="text-[11px] font-mono font-bold text-slate-600">{log.endpoint}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-black ${log.status >= 200 && log.status < 300 ? 'text-emerald-600' : 'text-red-600'}`}>
                       STATUS {log.status}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                       {formatSafeTime(log.timestamp, { hour12: false })}
                    </span>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <ArrowUpRight size={12} className="text-slate-300" /> Payload
                     </div>
                     <pre className="p-4 bg-white border border-slate-100 rounded-xl text-[10px] font-mono text-slate-500 overflow-x-auto shadow-inner">
                        {JSON.stringify(log.request, null, 2)}
                     </pre>
                  </div>
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <ArrowDownLeft size={12} className="text-slate-300" /> Server Data
                     </div>
                     <pre className="p-4 bg-white border border-slate-100 rounded-xl text-[10px] font-mono text-slate-500 overflow-x-auto shadow-inner">
                        {JSON.stringify(log.response, null, 2)}
                     </pre>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
