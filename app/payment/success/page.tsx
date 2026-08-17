"use client";

import React, { useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import { api } from "@/lib/api/client";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const hasExecuted = useRef(false);

  const redirectUrl = `/dashboard/customer?paymentSuccess=true${bookingId ? `&bookingId=${bookingId}` : ""}`;

  useEffect(() => {
    if (hasExecuted.current) return;
    hasExecuted.current = true;

    const performSyncAndRedirect = async () => {
      try {
        // Trigger backend payment status sync (with 1.5s max wait)
        const syncPromise = api.get("/payments/my-payments").catch(() => {});
        const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 1500));
        await Promise.race([syncPromise, timeoutPromise]);
      } catch (err) {
        console.error("Payment status sync error:", err);
      } finally {
        // Unconditionally redirect browser to customer dashboard
        window.location.href = redirectUrl;
      }
    };

    performSyncAndRedirect();

    // Absolute fallback timer: redirect after 2.5s no matter what
    const fallbackTimer = setTimeout(() => {
      window.location.href = redirectUrl;
    }, 2500);

    return () => clearTimeout(fallbackTimer);
  }, [bookingId, redirectUrl]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="glass-card w-full max-w-md rounded-3xl p-8 border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-400" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
            Payment Verified
          </span>
          <h1 className="text-2xl font-extrabold text-white">Redirecting to Dashboard...</h1>
          <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
            Payment verified successfully. Taking you straight to your user dashboard to view updated status.
          </p>
        </div>

        {bookingId && (
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-400 text-left space-y-1">
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Booking Reference</span>
            <span className="text-emerald-300 font-bold block truncate">{bookingId}</span>
          </div>
        )}

        <div className="pt-2">
          <a
            href={redirectUrl}
            className="w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            Go to User Dashboard <ArrowRight className="w-4 h-4" />
          </a>
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
          <p className="text-sm text-slate-400">Loading payment verification...</p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
