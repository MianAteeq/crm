import React from 'react';
import { cn } from '../../lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-200/70 dark:bg-slate-800/50', className)}
      {...props}
    />
  );
}

export function KpiSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between h-36">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 w-full min-h-[300px] flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-60" />
        </div>
        <Skeleton className="h-8 w-20 rounded-xl" />
      </div>
      <div className="flex-1 flex items-end gap-3 pt-6 min-h-[180px]">
        {/* Render simulated chart bars */}
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full rounded-t-lg bg-gradient-to-t from-slate-100 to-slate-200"
            style={{ height: `${20 + Math.random() * 70}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between pt-2 border-t border-slate-50">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Table Header */}
      <div className="flex border-b border-slate-200 bg-slate-50/50 p-4 gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Table Rows */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex p-4 items-center gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className="flex-1 flex items-center gap-3">
                {c === 0 && <Skeleton className="w-8 h-8 rounded-full shrink-0" />}
                <Skeleton className="h-3.5 w-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2 pt-2 border-t border-slate-50">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 ml-1" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-3 w-24 ml-1" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16 ml-1" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-24 ml-1" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ConversationListSkeleton() {
  return (
    <div className="divide-y divide-slate-100 animate-pulse">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-200/60 shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex justify-between items-center">
              <div className="h-3 w-1/3 bg-slate-200/60 rounded-md" />
              <div className="h-2 w-10 bg-slate-200/60 rounded-md" />
            </div>
            <div className="h-2.5 w-2/3 bg-slate-200/60 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
