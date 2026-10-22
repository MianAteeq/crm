import React from 'react';
import { Calendar, Clock, Globe, Zap, Timer, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../../lib/utils';
import { useI18n } from '../../../i18n';

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
  const { isRtl } = useI18n();

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button
          type="button"
          onClick={() => onMethodChange('now')}
          className={cn(
            "p-8 rounded-2xl border-2 text-start transition-all relative overflow-hidden group shadow-sm flex flex-col items-start gap-4 cursor-pointer",
            method === 'now' 
              ? 'bg-white border-[#166534] shadow-md' 
              : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:text-slate-900'
          )}
        >
          <div className={cn(
             "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
             method === 'now' ? 'bg-[#F0FDF4] text-[#166534]' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'
          )}>
            <Zap size={24} />
          </div>
          <div>
            <h3 className={cn(
              "text-sm font-bold tracking-tight mb-2 uppercase tracking-wide",
              method === 'now' ? 'text-[#166534]' : 'text-slate-900'
            )}>
              {isRtl ? 'إرسال فوري الآن' : 'Send Now'}
            </h3>
            <p className="text-[10px] font-medium leading-relaxed text-slate-400">
              {isRtl ? 'إطلاق الحملة فوراً بعد التأكيد دون أي تأخير.' : 'Dispatch immediately once you confirm.'}
            </p>
          </div>
          {method === 'now' && (
             <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} animate-in fade-in zoom-in`}>
                <div className="w-5 h-5 rounded-full bg-[#166534] flex items-center justify-center">
                   <CheckCircle2 size={12} className="text-white" />
                </div>
             </div>
          )}
        </button>

        <button
          type="button"
          onClick={() => onMethodChange('scheduled')}
          className={cn(
            "p-8 rounded-2xl border-2 text-start transition-all relative overflow-hidden group shadow-sm flex flex-col items-start gap-4 cursor-pointer",
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
            )}>
              {isRtl ? 'جدولة لوقت لاحق' : 'Schedule for Later'}
            </h3>
            <p className="text-[10px] font-medium leading-relaxed text-slate-400">
              {isRtl ? 'حدد تاريخاً ووقتاً دقيقاً للإرسال التلقائي.' : 'Pick a specific date and time.'}
            </p>
          </div>
          {method === 'scheduled' && (
             <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} animate-in fade-in zoom-in`}>
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
            className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-6 overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  <Calendar size={13} className="inline mr-1" />
                  {isRtl ? 'تاريخ الإرسال' : 'Delivery Date'}
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#166534] transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  <Clock size={13} className="inline mr-1" />
                  {isRtl ? 'وقت الإرسال' : 'Delivery Time'}
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => onTimeChange(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#166534] transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-200/60">
              <Globe size={14} className="text-[#166534]" />
              <span>{isRtl ? 'المنطقة الزمنية: توقيت مكة المكرمة (GMT+3)' : 'Timezone: Local System / Riyadh (GMT+3)'}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
