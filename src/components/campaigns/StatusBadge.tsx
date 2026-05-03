import React from 'react';
import { Campaign } from '../../types';

interface StatusBadgeProps {
  status: Campaign['status'];
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    Draft: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    Scheduled: 'bg-blue-50 text-blue-600 border-blue-200',
    Running: 'bg-amber-50 text-amber-600 border-amber-200',
    Completed: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    Failed: 'bg-rose-50 text-rose-600 border-rose-200',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
      {status}
    </span>
  );
}
