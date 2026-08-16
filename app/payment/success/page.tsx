"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Calendar, ShieldCheck, Home } from "lucide-react";
import toast from "react-hot-toast";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    toast.success("Payment completed successfully!");
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="glass-card w-full max-w-lg rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

        <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce" style={{ animationDuration: "2s" }}>
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
            Stripe Transaction Confirmed
          </span>
          <h1 className="text-3xl font-extrabold text-white">Payment Successful!</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Your booking payment has been authorized. The status has been updated to <strong className="text-purple-300 uppercase">PAID</strong> and your technician has been notified to proceed.
          </p>
        </div>

        {bookingId && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-400 text-left space-y-1">
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Booking ID</span>
            <span className="text-indigo-300 font-bold block truncate">{bookingId}</span>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard/customer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" /> View Booking Status <ArrowRight className="w-4 h-4" />
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
