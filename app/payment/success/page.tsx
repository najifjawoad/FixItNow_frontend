"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, Calendar, Loader2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api/client";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");

  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const syncPaymentStatusAndRedirect = async () => {
      try {
        // Trigger backend payment history fetch which auto-syncs ACCEPTED -> PAID bookings
        await api.get("/payments/my-payments");
        if (isMounted) {
          setIsSyncing(false);
          toast.success("Payment successful! Your booking status is updated to PAID.");
          router.replace("/dashboard/customer");
        }
      } catch (err) {
        console.error("Payment status sync warning:", err);
        if (isMounted) {
          setIsSyncing(false);
          toast.success("Payment completed successfully!");
          router.replace("/dashboard/customer");
        }
      }
    };

    syncPaymentStatusAndRedirect();

    return () => {
      isMounted = false;
    };
  }, [bookingId, router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="glass-card w-full max-w-lg rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

        <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce" style={{ animationDuration: "2s" }}>
          {isSyncing ? (
            <Loader2 className="w-10 h-10 animate-spin text-emerald-400" />
          ) : (
            <CheckCircle2 className="w-10 h-10" />
          )}
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            {isSyncing ? "Verifying Transaction..." : "Redirecting to Dashboard..."}
          </span>
          <h1 className="text-3xl font-extrabold text-white">Payment Successful!</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Your booking payment has been authorized and status updated to <strong className="text-emerald-400 uppercase font-bold">PAID</strong>. Taking you to your dashboard...
          </p>
        </div>

        {bookingId && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-400 text-left space-y-1">
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Booking ID</span>
            <span className="text-indigo-300 font-bold block truncate">{bookingId}</span>
          </div>
        )}

        <div className="pt-2">
          <Link
            href="/dashboard/customer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/30 inline-flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" /> Go to Dashboard Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-2" />
          <p className="text-sm text-slate-400">Loading payment status...</p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
