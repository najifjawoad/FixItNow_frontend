"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api/client";
import { User, UserStatus } from "@/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableRowSkeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  Users,
  Calendar,
  Layers,
  Search,
  Ban,
  CheckCircle2,
  Filter,
  Loader2,
  Plus,
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [totalBookingsCount, setTotalBookingsCount] = useState(0);
  const [totalCategoriesCount, setTotalCategoriesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersRes, bookingsRes, catsRes] = await Promise.allSettled([
        api.get("/admin/allUsers"),
        api.get("/admin/allBookings"),
        api.get("/admin/allCategories"),
      ]);

      if (usersRes.status === "fulfilled" && usersRes.value) {
        const uData = Array.isArray(usersRes.value) ? usersRes.value : usersRes.value.data || [];
        setUsers(uData);
      }

      if (bookingsRes.status === "fulfilled" && bookingsRes.value) {
        const bData = Array.isArray(bookingsRes.value) ? bookingsRes.value : bookingsRes.value.data || [];
        setTotalBookingsCount(bData.length);
      }

      if (catsRes.status === "fulfilled" && catsRes.value) {
        const cData = Array.isArray(catsRes.value) ? catsRes.value : catsRes.value.data || [];
        setTotalCategoriesCount(cData.length);
      }
    } catch (err: any) {
      console.error("Failed to load admin data:", err);
      toast.error(err.message || "Failed to load admin moderation panel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Ban / Unban Toggle Handler
  const handleToggleUserStatus = async (targetUser: User) => {
    const newStatus: UserStatus = targetUser.status === "BANNED" ? "ACTIVE" : "BANNED";
    setTogglingId(targetUser.id);
    try {
      await api.patch(`/admin/updateUserStatus/${targetUser.id}`, {
        status: newStatus,
      });

      toast.success(`User status updated to ${newStatus}`);
      fetchAdminData();
    } catch (err: any) {
      toast.error(err.message || `Failed to update status for ${targetUser.name}`);
    } finally {
      setTogglingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block mb-1">
            Admin Moderation Panel
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Platform Health & Governance</h1>
          <p className="text-xs text-slate-400 mt-1">Manage user accounts, ban violating profiles, and organize service categories.</p>
        </div>

        <Link
          href="/dashboard/admin/categories"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
        >
          <Layers className="w-4 h-4" /> Service Categories UI
        </Link>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-indigo-600/20 text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Total Registered Users</span>
            <span className="text-2xl font-extrabold text-white">{users.length}</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Total Bookings Executed</span>
            <span className="text-2xl font-extrabold text-white">{totalBookingsCount}</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-amber-500/20 text-amber-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Active Categories</span>
            <span className="text-2xl font-extrabold text-white">{totalCategoriesCount}</span>
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <section className="glass-card rounded-2xl border border-slate-800 overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-rose-400" /> Platform User Management
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Filter registered accounts and trigger ban/unban moderation</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user name/email..."
                className="bg-slate-900 text-white placeholder-slate-500 text-xs rounded-xl pl-8 pr-3 py-2 border border-slate-800 focus:border-indigo-500 focus:outline-none w-44 sm:w-56"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-900 text-white text-xs rounded-xl px-3 py-2 border border-slate-800 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">All Roles</option>
              <option value="CUSTOMER">Customer</option>
              <option value="TECHNICIAN">Technician</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">User Identity</th>
                <th className="p-3.5">Email Address</th>
                <th className="p-3.5">Account Role</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 font-bold text-white">
                      <div>{u.name}</div>
                      {u.phone && <div className="text-[10px] text-slate-400 font-normal">{u.phone}</div>}
                    </td>
                    <td className="p-3.5 text-slate-300 font-mono text-[11px]">{u.email}</td>
                    <td className="p-3.5 font-semibold">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase ${
                          u.role === "ADMIN"
                            ? "bg-rose-500/20 text-rose-300"
                            : u.role === "TECHNICIAN"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-indigo-500/20 text-indigo-300"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="p-3.5 text-right">
                      {u.role !== "ADMIN" ? (
                        <button
                          onClick={() => handleToggleUserStatus(u)}
                          disabled={togglingId === u.id}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ml-auto disabled:opacity-50 ${
                            u.status === "BANNED"
                              ? "bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300"
                              : "bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300"
                          }`}
                        >
                          {togglingId === u.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : u.status === "BANNED" ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> Unban User
                            </>
                          ) : (
                            <>
                              <Ban className="w-3.5 h-3.5" /> Ban User
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">Protected</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No users matched your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
