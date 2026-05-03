import { cn } from '@/src/lib/utils';
import { CheckCircle2, Clock, AlertCircle, FileText } from 'lucide-react';

interface StatusBadgeProps {
  status: 'approved' | 'pending' | 'rejected' | 'draft';
  className?: string;
}

const statusConfig = {
  approved: { color: 'text-brand bg-brand/10 border-brand/20', icon: CheckCircle2, label: 'Approved' },
  pending: { color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', icon: Clock, label: 'Pending' },
  rejected: { color: 'text-red-500 bg-red-500/10 border-red-500/20', icon: AlertCircle, label: 'Rejected' },
  draft: { color: 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20', icon: FileText, label: 'Draft' }
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest",
      config.color,
      className
    )}>
      <Icon size={10} />
      {config.label}
    </div>
  );
}
