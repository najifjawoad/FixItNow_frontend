import React from "react";
import { BookingStatus, PaymentStatus, UserStatus } from "@/types";

interface StatusBadgeProps {
  status: BookingStatus | PaymentStatus | UserStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let styles = "bg-slate-800 text-slate-300 border-slate-700";

  switch (status) {
    case "REQUESTED":
      styles = "bg-amber-500/15 text-amber-400 border-amber-500/30";
      break;
    case "ACCEPTED":
      styles = "bg-blue-500/15 text-blue-400 border-blue-500/30";
      break;
    case "DECLINED":
      styles = "bg-red-500/15 text-red-400 border-red-500/30";
      break;
    case "PAID":
      styles = "bg-purple-500/15 text-purple-400 border-purple-500/30";
      break;
    case "IN_PROGRESS":
      styles = "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      break;
    case "COMPLETED":
      styles = "bg-slate-500/20 text-slate-300 border-slate-500/30";
      break;
    case "CANCELLED":
      styles = "bg-rose-950/40 text-rose-400 border-rose-800/40";
      break;
    case "ACTIVE":
      styles = "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      break;
    case "BANNED":
      styles = "bg-rose-500/20 text-rose-400 border-rose-500/30 font-bold";
      break;
    case "PENDING":
      styles = "bg-amber-500/15 text-amber-400 border-amber-500/30";
      break;
    case "FAILED":
      styles = "bg-red-500/15 text-red-400 border-red-500/30";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider ${styles}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {status.replace("_", " ")}
    </span>
  );
}
