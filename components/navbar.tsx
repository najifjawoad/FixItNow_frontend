"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Wrench,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ShieldCheck,
  Briefcase,
  Search,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return "/auth/login";
    switch (user.role) {
      case "ADMIN":
        return "/dashboard/admin";
      case "TECHNICIAN":
        return "/dashboard/technician";
      case "CUSTOMER":
      default:
        return "/dashboard/customer";
    }
  };

  const getRoleBadge = () => {
    if (!user) return null;
    switch (user.role) {
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> Admin
          </span>
        );
      case "TECHNICIAN":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20">
            <Briefcase className="w-3.5 h-3.5" /> Provider
          </span>
        );
      case "CUSTOMER":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/20">
            <UserIcon className="w-3.5 h-3.5" /> Customer
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-indigo-500/20 shadow-xl shadow-indigo-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-all duration-300">
              <Wrench className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white flex items-center gap-1">
                FixIt<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Now</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 ml-1 pulse-badge text-emerald-400 inline-block" />
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">
                Home Services Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/services"
              className={`text-sm font-semibold transition-all flex items-center gap-2 px-3 py-2 rounded-xl ${
                pathname === "/services"
                  ? "text-white bg-indigo-500/20 border border-indigo-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Search className="w-4 h-4 text-indigo-400" />
              Browse Services
            </Link>

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-slate-800/80">
                {getRoleBadge()}

                <Link
                  href={getDashboardLink()}
                  className={`text-sm font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
                    pathname.startsWith("/dashboard")
                      ? "glow-btn-primary text-white shadow-lg"
                      : "bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80 hover:border-indigo-500/40"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <div className="flex items-center gap-3 pl-2">
                  <div className="text-right hidden lg:block">
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate max-w-[130px]">
                      {user.email}
                    </p>
                  </div>

                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-800/80">
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-xl transition-colors hover:bg-slate-800/60"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="glow-btn-primary text-sm font-bold text-white px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" /> Get Started
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white py-2.5 px-3 rounded-xl bg-slate-900/60 border border-slate-800"
          >
            <Search className="w-4 h-4 text-indigo-400" /> Browse Services
          </Link>

          {user ? (
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div>
                  <p className="text-sm font-bold text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
                {getRoleBadge()}
              </div>

              <Link
                href={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full text-sm font-bold glow-btn-primary text-white py-3 rounded-xl shadow-lg"
              >
                Go to Dashboard
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="flex items-center justify-center gap-2 w-full text-sm font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 py-2.5 rounded-xl"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2.5">
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-sm font-semibold text-slate-300 bg-slate-900 border border-slate-800 py-2.5 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-sm font-bold glow-btn-primary text-white py-3 rounded-xl shadow-lg"
              >
                Register Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
