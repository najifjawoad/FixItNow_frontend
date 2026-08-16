"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-6">
        <AlertTriangle className="w-12 h-12" />
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        {error.message || "An unexpected error occurred while communicating with the FixItNow platform."}
      </p>

      <div className="flex items-center gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors border border-slate-700"
        >
          <Home className="w-4 h-4" /> Return Home
        </Link>
      </div>
    </div>
  );
}
