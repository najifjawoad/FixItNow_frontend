import React from "react";
import { Wrench } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center animate-pulse">
          <Wrench className="w-8 h-8 text-indigo-400 animate-spin" style={{ animationDuration: "3s" }} />
        </div>
        <div className="absolute -inset-1 bg-indigo-500/20 rounded-3xl filter blur-xl animate-pulse" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Loading FixItNow</h3>
      <p className="text-sm text-slate-400 max-w-sm">
        Preparing your experience with real-time service listings & certified technicians...
      </p>
    </div>
  );
}
