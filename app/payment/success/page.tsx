"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { api } from "@/lib/api/client";
import { useAuth } from "@/context/AuthContext";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const bookingId = searchParams.get("bookingId");
  const [syncing, setSyncing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const syncAndRedirect = async () => {
      try {
        // Trigger backend payment status sync to turn ACCEPTED -> PAID
        await api.get("/payments/my-payments").catch(() => {});
        if (isMounted) {
          toast.success("Payment completed! Booking status updated to PAID.");
        }
      } catch (err) {
        console.error("Payment status sync error:", err);
      } finally {
        if (isMounted) {
          setSyncing(false);
          const targetDashboard = user?.role === "TECHNICIAN" ? "/dashboard/technician" : "/dashboard/customer";
          const redirectUrl = `${targetDashboard}?paymentSuccess=true${bookingId ? `&bookingId=${bookingId}` : ""}`;
          
          setTimeout(() => {
            router.replace(redirectUrl);
          }, 1200);
        }
      }
    };

    syncAndRedirect();

    return () => {
      isMounted = false;
    };
  }, [bookingId, router, user]);

  const targetDashboard = user?.role === "TECHNICIAN" ? "/dashboard/technician" : "/dashboard/customer";
  const dashboardUrl = `${targetDashboard}?paymentSuccess=true${bookingId ? `&bookingId=${bookingId}` : ""}`;

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="glass-card w-full max-w-md rounded-3xl p-8 border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          {syncing ? (
            <Loader2 className="w-10 h-10 animate-spin text-emerald-400" />
          ) : (
            <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
          )}
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
            {syncing ? "Syncing Payment..." : "Payment Verified"}
          </span>
          <h1 className="text-2xl font-extrabold text-white">
            {syncing ? "Processing Transaction..." : "Booking Status Updated!"}
          </h1>
          <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
            {syncing
              ? "Confirming payment with gateway and updating your booking status to PAID..."
              : "Taking you straight to your user dashboard to view your updated status."}
          </p>
        </div>

        {bookingId && (
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-400 text-left space-y-1">
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Booking Reference</span>
            <span className="text-emerald-300 font-bold block truncate">{bookingId}</span>
          </div>
        )}

        <div className="pt-2">
          <Link
            href={dashboardUrl}
            className="w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            Go to User Dashboard <ArrowRight className="w-4 h-4" />
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
          <p className="text-sm text-slate-400">Loading payment verification...</p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
