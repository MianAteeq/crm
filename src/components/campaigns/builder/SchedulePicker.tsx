import React from 'react';
import { Calendar, Clock, Globe, Zap, Timer } from 'lucide-react';
import { motion } from 'motion/react';

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
    <div className="space-y-12">
      <div className="grid grid-cols-2 gap-8">
        <button
          onClick={() => onMethodChange('now')}
          className={`p-10 rounded-[2.5rem] border text-left transition-all ${
            method === 'now' 
              ? 'bg-brand border-brand text-white shadow-xl shadow-brand/20' 
              : 'bg-bg-surface3 border-border text-text-muted hover:border-brand/30'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              method === 'now' ? 'bg-white/20' : 'bg-bg-surface border border-border'
            }`}>
              <Zap size={28} />
            </div>
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight mb-2">Send Now</h3>
          <p className="text-[11px] font-medium opacity-80 leading-relaxed">
            Dispatch your messages immediately once you confirm the campaign details.
          </p>
        </button>

        <button
          onClick={() => onMethodChange('scheduled')}
          className={`p-10 rounded-[2.5rem] border text-left transition-all ${
            method === 'scheduled' 
              ? 'bg-brand border-brand text-white shadow-xl shadow-brand/20' 
              : 'bg-bg-surface3 border-border text-text-muted hover:border-brand/30'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              method === 'scheduled' ? 'bg-white/20' : 'bg-bg-surface border border-border'
            }`}>
              <Calendar size={28} />
            </div>
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight mb-2">Schedule Message</h3>
          <p className="text-[11px] font-medium opacity-80 leading-relaxed">
            Choose a specific date and time to automatically launch your broadcast.
          </p>
        </button>
      </div>

      {method === 'scheduled' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-10 bg-bg-surface border border-border rounded-[2.5rem] space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <Calendar size={12} className="text-brand" /> Delivery Date
              </label>
              <input 
                type="date"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full bg-bg-surface3 border border-border rounded-2xl p-5 text-sm font-bold text-white focus:outline-none focus:border-brand/40 transition-all font-mono"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <Clock size={12} className="text-brand" /> Delivery Time
              </label>
              <input 
                type="time"
                value={time}
                onChange={(e) => onTimeChange(e.target.value)}
                className="w-full bg-bg-surface3 border border-border rounded-2xl p-5 text-sm font-bold text-white focus:outline-none focus:border-brand/40 transition-all font-mono"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-border flex items-center justify-between">
             <div className="flex items-center gap-4 text-text-muted">
                <Globe size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Pakistan (GMT+5)</span>
             </div>
             <p className="text-[10px] font-black text-brand uppercase tracking-widest leading-none">
                Adjust according to your target audience time zone
             </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-bg-surface2/30 border border-border rounded-[2rem] space-y-4">
           <div className="flex items-center gap-3">
              <Timer size={18} className="text-brand" />
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">Throttling Settings</h4>
           </div>
           <p className="text-[11px] text-text-muted font-medium leading-relaxed">
              Limit message frequency to avoid Meta account flags. Recommended: 60 messages/min.
           </p>
           <div className="flex items-center gap-3 pt-2">
              <input type="checkbox" id="throttle" defaultChecked className="w-5 h-5 rounded-lg border-border bg-bg-surface3 text-brand" />
              <label htmlFor="throttle" className="text-xs font-bold text-white uppercase tracking-tight">Active Safe Throttling</label>
           </div>
        </div>

        <div className="p-8 bg-bg-surface2/30 border border-border rounded-[2rem] space-y-4">
           <div className="flex items-center gap-3">
              <RefreshCw size={18} className="text-brand" />
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">Auto-Retry System</h4>
           </div>
           <p className="text-[11px] text-text-muted font-medium leading-relaxed">
              Automatically re-attempt failed messages due to network errors up to 3 times.
           </p>
           <div className="flex items-center gap-3 pt-2">
              <input type="checkbox" id="retry" className="w-5 h-5 rounded-lg border-border bg-bg-surface3 text-brand" />
              <label htmlFor="retry" className="text-xs font-bold text-white uppercase tracking-tight">Enable Intelligent Retry</label>
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
