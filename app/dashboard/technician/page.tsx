"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api/client";
import { Booking, BookingStatus } from "@/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableRowSkeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Play,
  Plus,
  TrendingUp,
  Star,
  MessageSquare,
} from "lucide-react";

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchTechnicianBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users/get-my-bookings");
      const data = Array.isArray(res) ? res : res?.data || [];
      setBookings(data);
    } catch (err: any) {
      console.error("Failed to load technician bookings:", err);
      toast.error(err.message || "Failed to load booking requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicianBookings();
  }, []);

  // Update Booking Status Handler
  const handleUpdateStatus = async (bookingId: string, newStatus: BookingStatus) => {
    setUpdatingId(bookingId);
    try {
      await api.patch(`/technician/bookings/status/${bookingId}`, {
        status: newStatus,
      });

      toast.success(`Booking status updated to ${newStatus.replace("_", " ")}`);
      fetchTechnicianBookings();
    } catch (err: any) {
      toast.error(err.message || `Failed to update status to ${newStatus}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingRequests = bookings.filter((b) => b.status === "REQUESTED");
  const upcomingJobs = bookings.filter(
    (b) => b.status === "ACCEPTED" || b.status === "PAID" || b.status === "IN_PROGRESS"
  );
  const completedJobs = bookings.filter((b) => b.status === "COMPLETED");

  const totalEarnings = bookings
    .filter((b) => b.status === "PAID" || b.status === "IN_PROGRESS" || b.status === "COMPLETED")
    .reduce((sum, b) => sum + Number(b.service?.price || 0), 0);

  // Extract Reviews Received across all jobs
  const reviewsList = bookings.flatMap((b) => {
    const rawReviews = (b as any).reviews || ((b as any).review ? [(b as any).review] : []);
    return rawReviews.map((r: any) => ({
      ...r,
      serviceTitle: b.service?.title || "Service Job",
      customerName: r.customer?.name || b.customer?.name || "Verified Customer",
    }));
  });

  const avgReceivedRating =
    reviewsList.length > 0
      ? (reviewsList.reduce((sum, r) => sum + Number(r.rating || 5), 0) / reviewsList.length).toFixed(1)
      : "5.0";

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
            Provider Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Technician Portal: {user?.name}</h1>
          <p className="text-xs text-slate-400 mt-1">Manage incoming booking requests, update job statuses, and track your customer reviews.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/technician/availability"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs transition-colors border border-slate-700 flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" /> Manage Availability
          </Link>
          <Link
            href="/dashboard/technician/services"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs transition-all shadow-lg shadow-amber-600/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add New Service
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-amber-500/20 text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Pending</span>
            <span className="text-2xl font-extrabold text-white">{pendingRequests.length}</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-blue-500/20 text-blue-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Active / Paid</span>
            <span className="text-2xl font-extrabold text-white">{upcomingJobs.length}</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Completed</span>
            <span className="text-2xl font-extrabold text-white">{completedJobs.length}</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-purple-500/20 text-purple-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Total Earnings</span>
            <span className="text-2xl font-extrabold text-white">${totalEarnings.toFixed(2)}</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-yellow-500/20 text-yellow-400">
            <Star className="w-6 h-6 fill-yellow-400" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Avg Rating</span>
            <span className="text-2xl font-extrabold text-white">{avgReceivedRating}★</span>
          </div>
        </div>
      </div>

      {/* Booking Requests Table */}
      <section className="glass-card rounded-2xl border border-slate-800 overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-400" /> Incoming Booking Requests & Jobs
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Accept customer requests, start work, and mark completed</p>
          </div>
          <button
            onClick={fetchTechnicianBookings}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Refresh List
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Service Package</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Address & Notes</th>
                <th className="p-3.5">Scheduled Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 font-semibold text-white">
                      <div>{booking.service?.title || "Service"}</div>
                      <div className="text-[11px] text-amber-400 font-bold">
                        ${Number(booking.service?.price || 0).toFixed(2)}
                      </div>
                    </td>
                    <td className="p-3.5 font-medium text-slate-200">
                      <div>{booking.customer?.name || "Customer"}</div>
                      <div className="text-[10px] text-slate-400">{booking.customer?.phone || ""}</div>
                    </td>
                    <td className="p-3.5 text-slate-300 max-w-xs">
                      <div className="truncate font-medium">{booking.address}</div>
                      {booking.notes && <div className="text-[10px] text-slate-400 italic truncate">&quot;{booking.notes}&quot;</div>}
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {new Date(booking.scheduledAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-3.5">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      {/* REQUESTED -> ACCEPT or DECLINE */}
                      {booking.status === "REQUESTED" && (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleUpdateStatus(booking.id, "ACCEPTED")}
                            disabled={updatingId === booking.id}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(booking.id, "DECLINED")}
                            disabled={updatingId === booking.id}
                            className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-semibold text-xs transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {/* ACCEPTED -> Waiting for customer to pay */}
                      {booking.status === "ACCEPTED" && (
                        <span className="text-[11px] text-blue-400 italic">Waiting for Customer Payment</span>
                      )}

                      {/* PAID -> Start Job (IN_PROGRESS) */}
                      {booking.status === "PAID" && (
                        <button
                          onClick={() => handleUpdateStatus(booking.id, "IN_PROGRESS")}
                          disabled={updatingId === booking.id}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all inline-flex items-center gap-1"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" /> Start Job
                        </button>
                      )}

                      {/* IN_PROGRESS -> Mark Completed */}
                      {booking.status === "IN_PROGRESS" && (
                        <button
                          onClick={() => handleUpdateStatus(booking.id, "COMPLETED")}
                          disabled={updatingId === booking.id}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-emerald-300 font-bold text-xs transition-all inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                        </button>
                      )}

                      {booking.status === "COMPLETED" && (
                        <span className="text-[11px] text-slate-500 font-medium">Job Finished</span>
                      )}

                      {booking.status === "DECLINED" && (
                        <span className="text-[11px] text-rose-500 font-medium">Declined</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No booking requests assigned yet. Make sure your availability slots are set!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* NEW: Customer Reviews & Ratings Received Segment */}
      <section className="glass-card rounded-2xl border border-slate-800 overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Customer Reviews & Ratings Received
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Specifications of customer feedback for your completed service jobs</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
            Avg {avgReceivedRating} ★ ({reviewsList.length} reviews)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Customer Name</th>
                <th className="p-3.5">Service Job</th>
                <th className="p-3.5">Rating Given</th>
                <th className="p-3.5">Customer Comment</th>
                <th className="p-3.5 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {reviewsList.length > 0 ? (
                reviewsList.map((rev: any, index: number) => (
                  <tr key={rev.id || index} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 font-bold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-600/30 text-indigo-300 text-xs flex items-center justify-center font-bold">
                        {rev.customerName.charAt(0)}
                      </div>
                      {rev.customerName}
                    </td>
                    <td className="p-3.5 font-medium text-slate-200">
                      {rev.serviceTitle}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center text-amber-400 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                        {rev.rating || 5} / 5
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-300 max-w-sm">
                      {rev.comment ? (
                        <p className="italic text-slate-300">&quot;{rev.comment}&quot;</p>
                      ) : (
                        <span className="text-slate-500 italic">No text comment left</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right text-slate-400">
                      {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : "Recent"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-300">No Customer Reviews Received Yet</p>
                    <p className="text-xs text-slate-500 mt-1">
                      When customers submit feedback for your completed jobs, their ratings and reviews will appear here!
                    </p>
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
