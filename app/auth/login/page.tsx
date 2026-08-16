"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api/client";
import toast from "react-hot-toast";
import { Wrench, Mail, Lock, ArrowRight, ShieldCheck, UserCheck, Briefcase, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "";
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Enter a valid email address";
    if (!password) errors.password = "Password is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      
      const accessToken = res.accessToken;
      const refreshToken = res.refreshToken;

      if (!accessToken) {
        throw new Error("Invalid response from server: Missing token");
      }

      await login(accessToken, refreshToken);
      toast.success("Welcome back! Logged in successfully.");

      // Redirect based on query param or role default
      if (redirectPath) {
        router.push(redirectPath);
      } else {
        // Will be redirected by AuthContext or profile fetch
        router.push("/dashboard/customer");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (demoEmail: string, demoPass = "password123") => {
    setEmail(demoEmail);
    setPassword(demoPass);
    toast.success(`Filled credentials for ${demoEmail}`);
  };

  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center py-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-4 shadow-inner">
            <Wrench className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Sign In to FixItNow</h1>
          <p className="text-sm text-slate-400 mt-2">
            Access your service bookings, manage jobs, or oversee platform activities.
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  placeholder="e.g. user@example.com"
                  className={`w-full bg-slate-900/90 text-white placeholder-slate-500 rounded-xl pl-11 pr-4 py-3 text-sm border focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.email
                      ? "border-rose-500/80 focus:ring-rose-500/50"
                      : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/30"
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-rose-400 mt-1.5 font-medium">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  placeholder="Enter your account password"
                  className={`w-full bg-slate-900/90 text-white placeholder-slate-500 rounded-xl pl-11 pr-4 py-3 text-sm border focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.password
                      ? "border-rose-500/80 focus:ring-rose-500/50"
                      : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/30"
                  }`}
                />
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-rose-400 mt-1.5 font-medium">{fieldErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying Credentials...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center">
              Quick Demo Logins (Click to Autofill)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fillQuickDemo("tech@fixitnow.com")}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/30 text-amber-400 transition-all group"
              >
                <Briefcase className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Technician Demo</span>
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo("customer@fixitnow.com")}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 hover:bg-indigo-500/10 border border-slate-800 hover:border-indigo-500/30 text-indigo-400 transition-all group"
              >
                <UserCheck className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Customer Demo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Don&apos;t have an account yet?{" "}
          <Link href="/auth/register" className="font-semibold text-indigo-400 hover:text-indigo-300 underline">
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
}
