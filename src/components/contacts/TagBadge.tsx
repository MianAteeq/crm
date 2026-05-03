import React from 'react';

interface TagBadgeProps {
  tag: string;
  className?: string;
  key?: string | number;
}

export default function TagBadge({ tag, className }: TagBadgeProps) {
  const getTagStyles = (tag: string) => {
    const t = tag.toLowerCase();
    if (t.includes('vip')) return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    if (t.includes('new')) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    if (t.includes('wholesale')) return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    if (t.includes('complaint') || t.includes('inactive')) return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    return 'bg-bg-surface3 text-text-muted border-border';
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getTagStyles(tag)} ${className}`}>
      {tag}
    </span>
  );
}
