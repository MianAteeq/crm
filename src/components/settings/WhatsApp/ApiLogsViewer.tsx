import React from 'react';
import { Terminal, Shield, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { ApiLog } from '../../../types';

interface ApiLogsViewerProps {
  logs: ApiLog[];
}

export default function ApiLogsViewer({ logs }: ApiLogsViewerProps) {
  return (
    <div className="p-8 bg-black/40 border border-border rounded-[2.5rem] space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-bg-surface3 text-text-muted rounded-xl">
             <Terminal size={20} />
          </div>
          <div>
             <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">API Request Logs</h3>
             <p className="text-[9px] font-medium text-text-muted uppercase">Real-time communication debug</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black text-emerald-500/80 uppercase tracking-widest">Listening</span>
           </div>
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {logs.length === 0 ? (
          <div className="py-12 text-center opacity-30">
             <Shield size={40} className="mx-auto mb-4 text-text-muted" />
             <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">No API events captured yet</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="p-4 bg-bg-surface3/50 border border-border/50 rounded-xl hover:border-brand/20 transition-all group">
               <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                     <span className={`px-2 py-0.5 rounded text-[8px] font-black ${log.method === 'POST' ? 'bg-brand text-black' : 'bg-blue-500 text-white'}`}>
                        {log.method}
                     </span>
                     <span className="text-[10px] font-mono text-white/80">{log.endpoint}</span>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${log.status === 200 ? 'text-emerald-500' : 'text-rose-500'}`}>
                     HTTP {log.status}
                  </span>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <div className="flex items-center gap-1.5 text-[8px] font-black text-text-muted uppercase tracking-widest">
                        <ArrowUpRight size={10} /> Request Payload
                     </div>
                     <pre className="p-3 bg-black/40 rounded-lg text-[9px] font-mono text-white/60 overflow-x-auto">
                        {JSON.stringify(log.request, null, 2)}
                     </pre>
                  </div>
                  <div className="space-y-1.5">
                     <div className="flex items-center gap-1.5 text-[8px] font-black text-text-muted uppercase tracking-widest">
                        <ArrowDownLeft size={10} /> Meta Response
                     </div>
                     <pre className="p-3 bg-black/40 rounded-lg text-[9px] font-mono text-emerald-500/60 overflow-x-auto">
                        {JSON.stringify(log.response, null, 2)}
                     </pre>
                  </div>
               </div>

               <div className="mt-3 pt-3 border-t border-white/5 flex justify-end">
                  <span className="text-[8px] font-black text-text-muted uppercase tracking-tighter">
                     {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
