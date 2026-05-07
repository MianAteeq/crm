import React from 'react';

import { Tag as TagType } from '../../types';

interface TagBadgeProps {
  tag: string;
  availableTags?: TagType[];
  className?: string;
  key?: string | number;
}

export default function TagBadge({ tag, availableTags, className }: TagBadgeProps) {
  // Handle if tag is an object (common in API responses with relationships)
  const isObject = typeof tag === 'object' && tag !== null;
  const tagId = isObject ? (tag as any).id : tag;
  const tagObjName = isObject ? (tag as any).name : null;

  const resolvedTag = availableTags?.find(t => t.id === tagId || t.name === tagId);
  const tagName = resolvedTag ? resolvedTag.name : (tagObjName || tag);

  const getTagStyles = (label: any) => {
    const t = String(label || "").toLowerCase();
    if (t.includes('vip')) return 'bg-amber-50 text-amber-700 border-amber-100';
    if (t.includes('new')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (t.includes('wholesale')) return 'bg-blue-50 text-blue-700 border-blue-100';
    if (t.includes('complaint') || t.includes('inactive')) return 'bg-red-50 text-red-700 border-red-100';
    return 'bg-slate-50 text-slate-500 border-slate-200';
  };

  return (
    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border ${getTagStyles(tagName)} ${className}`}>
      {tagName}
    </span>
  );
}
