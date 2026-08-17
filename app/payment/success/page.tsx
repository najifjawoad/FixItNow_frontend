"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    toast.success("Payment completed successfully!");
    // Immediate navigation to Customer Dashboard where status auto-syncs
    if (typeof window !== "undefined") {
      window.location.href = "/dashboard/customer";
    } else {
      router.replace("/dashboard/customer");
    }
  }, [bookingId, router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="glass-card w-full max-w-md rounded-3xl p-8 border border-slate-800 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
            Payment Verified
          </span>
          <h1 className="text-2xl font-extrabold text-white">Redirecting to Dashboard...</h1>
          <p className="text-xs text-slate-300">
            Taking you straight to your customer dashboard.
          </p>
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
          <p className="text-sm text-slate-400">Loading...</p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
