"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle, RefreshCw, Home, Loader2 } from "lucide-react";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="glass-card w-full max-w-lg rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="w-20 h-20 rounded-full bg-rose-500/20 text-rose-400 border-2 border-rose-500/40 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
          <XCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
            Transaction Cancelled
          </span>
          <h1 className="text-3xl font-extrabold text-white">Payment Not Completed</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            The checkout session was cancelled or timed out. Your booking remains in <strong className="text-blue-400 uppercase">ACCEPTED</strong> status and can be paid anytime from your dashboard.
          </p>
        </div>

        {bookingId && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-400 text-left space-y-1">
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Booking ID</span>
            <span className="text-rose-300 font-bold block truncate">{bookingId}</span>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard/customer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Retry Payment on Dashboard
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors border border-slate-700 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
          <Loader2 className="w-8 h-8 text-rose-400 animate-spin mb-2" />
          <p className="text-sm text-slate-400">Loading details...</p>
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
