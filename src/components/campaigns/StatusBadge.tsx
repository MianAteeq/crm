import React from 'react';
import { Campaign } from '../../types';
import { cn } from '../../lib/utils';

interface StatusBadgeProps {
  status: Campaign['status'];
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    Draft: 'bg-slate-100 text-slate-600 border-slate-200/50',
    Scheduled: 'bg-blue-50 text-blue-600 border-blue-200/50',
    Running: 'bg-indigo-50 text-indigo-600 border-indigo-200/50',
    Completed: 'bg-emerald-50 text-emerald-600 border-emerald-200/50',
    Failed: 'bg-rose-50 text-rose-600 border-rose-200/50',
  };

  const dotColors = {
    Draft: 'bg-slate-400',
    Scheduled: 'bg-blue-400',
    Running: 'bg-indigo-400 animate-pulse',
    Completed: 'bg-emerald-400',
    Failed: 'bg-rose-400',
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
      styles[status]
    )}>
      <div className={cn("w-1.5 h-1.5 rounded-full", dotColors[status])} />
      {status}
    </span>
  );
}
