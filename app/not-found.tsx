import React from "react";
import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-6">
        <FileQuestion className="w-12 h-12" />
      </div>

      <h1 className="text-4xl font-extrabold text-white mb-2">404</h1>
      <h2 className="text-xl font-semibold text-slate-200 mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-400 max-w-md mb-6">
        The requested service page or resource could not be found on FixItNow.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home Page
      </Link>
    </div>
  );
}
