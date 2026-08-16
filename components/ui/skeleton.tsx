import React from "react";

export function Skeleton({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-800/60 ${className}`}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-4 border border-slate-800">
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-slate-800/60">
      <td className="p-4"><Skeleton className="h-5 w-24" /></td>
      <td className="p-4"><Skeleton className="h-5 w-32" /></td>
      <td className="p-4"><Skeleton className="h-5 w-20" /></td>
      <td className="p-4"><Skeleton className="h-5 w-16" /></td>
      <td className="p-4 text-right"><Skeleton className="h-8 w-20 ml-auto rounded-lg" /></td>
    </tr>
  );
}
