import React from 'react';
import { Calendar, Clock, Globe, Zap, Timer, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../../lib/utils';

interface SchedulePickerProps {
  method: 'now' | 'scheduled';
  onMethodChange: (method: 'now' | 'scheduled') => void;
  date: string;
  onDateChange: (date: string) => void;
  time: string;
  onTimeChange: (time: string) => void;
}

export default function SchedulePicker({ 
  method, onMethodChange, date, onDateChange, time, onTimeChange 
}: SchedulePickerProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-6">
        <button
          onClick={() => onMethodChange('now')}
          className={cn(
            "p-8 rounded-2xl border-2 text-left transition-all relative overflow-hidden group shadow-sm flex flex-col items-start gap-4",
            method === 'now' 
              ? 'bg-white border-brand shadow-md' 
              : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:text-slate-900'
          )}
        >
          <div className={cn(
             "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
             method === 'now' ? 'bg-brand/10 text-brand' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'
          )}>
            <Zap size={24} />
          </div>
          <div>
            <h3 className={cn(
              "text-sm font-bold tracking-tight mb-2 uppercase tracking-wide",
              method === 'now' ? 'text-brand' : 'text-slate-900'
            )}>Send Now</h3>
            <p className="text-[10px] font-medium leading-relaxed text-slate-400">
              Dispatch immediately once you confirm.
            </p>
          </div>
          {method === 'now' && (
             <div className="absolute top-4 right-4 animate-in fade-in zoom-in">
                <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center">
                   <CheckCircle2 size={12} className="text-white" />
                </div>
             </div>
          )}
        </button>

        <button
          onClick={() => onMethodChange('scheduled')}
          className={cn(
            "p-8 rounded-2xl border-2 text-left transition-all relative overflow-hidden group shadow-sm flex flex-col items-start gap-4",
            method === 'scheduled' 
              ? 'bg-white border-slate-900 shadow-md' 
              : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:text-slate-900'
          )}
        >
          <div className={cn(
             "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
             method === 'scheduled' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'
          )}>
            <Calendar size={24} />
          </div>
          <div>
            <h3 className={cn(
              "text-sm font-bold tracking-tight mb-2 uppercase tracking-wide",
              method === 'scheduled' ? 'text-slate-900' : 'text-slate-900'
            )}>Schedule</h3>
            <p className="text-[10px] font-medium leading-relaxed text-slate-400">
              Choose a specific date and time.
            </p>
          </div>
          {method === 'scheduled' && (
             <div className="absolute top-4 right-4 animate-in fade-in zoom-in">
                <div className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center">
                   <CheckCircle2 size={12} className="text-white" />
                </div>
             </div>
          )}
        </button>
      </div>

      <AnimatePresence>
        {method === 'scheduled' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-8 bg-slate-50 border border-slate-200 rounded-3xl space-y-8 overflow-hidden"
          >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar size={12} /> Delivery Date
              </label>
              <input 
                type="date"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-brand transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Clock size={12} /> Delivery Time
              </label>
              <input 
                type="time"
                value={time}
                onChange={(e) => onTimeChange(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-brand transition-all"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
             <div className="flex items-center gap-3 text-slate-400">
                <Globe size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Pakistan (GMT +5)</span>
             </div>
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Timezone synchronized
             </p>
          </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4 shadow-sm hover:border-brand/20 transition-all group">
           <div className="flex items-center gap-3">
              <Timer size={18} className="text-slate-400 group-hover:text-brand" />
              <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Throttling</h4>
           </div>
           <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
              Limit frequency to avoid account flags. Recommended: 60/min.
           </p>
           <div className="flex items-center gap-3 pt-1">
              <input type="checkbox" id="throttle" defaultChecked className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand" />
              <label htmlFor="throttle" className="text-[10px] font-bold text-slate-900 uppercase">Active Throttling</label>
           </div>
        </div>

        <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4 shadow-sm hover:border-brand/20 transition-all group">
           <div className="flex items-center gap-3">
              <Clock size={18} className="text-slate-400 group-hover:text-brand" />
              <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Retry System</h4>
           </div>
           <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
              Auto-retry failed messages due to network errors.
           </p>
           <div className="flex items-center gap-3 pt-1">
              <input type="checkbox" id="retry" className="w-4 h-4 rounded border-slate-300 text-brand focus:ring-brand" />
              <label htmlFor="retry" className="text-[10px] font-bold text-slate-900 uppercase">Enable Auto-Retry</label>
           </div>
        </div>
      </div>
    </div>
  );
}

function RefreshCw({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
