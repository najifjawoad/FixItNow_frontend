"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api/client";
import { Booking, BookingStatus, Service } from "@/types";
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
  Wrench,
  Pencil,
  Trash2,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react";

export default function TechnicianDashboard() {
  const { user } = useAuth();

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // My Services state
  const [myServices, setMyServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDuration, setEditDuration] = useState(60);
  const [editDescription, setEditDescription] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTechnicianBookings = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else if (bookings.length === 0) setLoading(true);

      const res = await api.get("/users/get-my-bookings");
      const data = Array.isArray(res) ? res : res?.data || [];
      setBookings(data);
      if (isManualRefresh) {
        toast.success("Booking requests updated!");
      }
    } catch (err: any) {
      console.error("Failed to load technician bookings:", err);
      if (isManualRefresh) {
        toast.error(err.message || "Failed to load booking requests");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchMyServices = async () => {
    try {
      setLoadingServices(true);
      const res = await api.get("/technician/my-services");
      const data = Array.isArray(res) ? res : res?.data || [];
      setMyServices(data);
    } catch (err: any) {
      console.error("Failed to load technician services:", err);
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    fetchTechnicianBookings();
    fetchMyServices();

    // Auto-refetch when window gains focus or on periodic interval (every 15s)
    const handleFocus = () => fetchTechnicianBookings();
    window.addEventListener("focus", handleFocus);

    const intervalId = setInterval(() => {
      fetchTechnicianBookings();
    }, 15000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(intervalId);
    };
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

  // Edit Service Handler
  const handleOpenEditModal = (service: Service) => {
    setEditingService(service);
    setEditTitle(service.title);
    setEditPrice(String(service.price));
    setEditDuration(service.durationMinutes);
    setEditDescription(service.description || "");
  };

  const handleSaveServiceEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    if (!editTitle.trim()) {
      toast.error("Service title is required");
      return;
    }
    if (!editPrice || Number(editPrice) <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    setSavingEdit(true);
    try {
      await api.patch(`/technician/services/${editingService.id}`, {
        title: editTitle,
        price: Number(editPrice),
        durationMinutes: Number(editDuration),
        description: editDescription || undefined,
      });

      toast.success("Service package updated successfully!");
      setEditingService(null);
      fetchMyServices();
    } catch (err: any) {
      toast.error(err.message || "Failed to update service package");
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete Service Handler
  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service package?")) return;
    setDeletingId(serviceId);
    try {
      await api.delete(`/technician/services/${serviceId}`);
      toast.success("Service package deleted successfully!");
      fetchMyServices();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete service package");
    } finally {
      setDeletingId(null);
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
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
            Provider Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Technician Portal: {user?.name}</h1>
          <p className="text-xs text-slate-400 mt-1">Manage incoming booking requests, update job statuses, and edit your service offerings.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => fetchTechnicianBookings(true)}
            disabled={refreshing}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-xs transition-colors border border-slate-700 flex items-center gap-1.5 shadow-sm"
            title="Refresh booking requests"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-400 ${refreshing ? "animate-spin" : ""}`} /> Refresh Requests
          </button>
          <button
            onClick={() => {
              const el = document.getElementById("my-services-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold text-xs transition-colors border border-slate-700 flex items-center gap-1.5 shadow-sm"
          >
            <Wrench className="w-4 h-4 text-indigo-400" /> My Services ({myServices.length})
          </button>
          <Link
            href="/dashboard/technician/availability"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs transition-colors border border-slate-700 flex items-center gap-1.5 shadow-sm"
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

      {/* NEW: My Published Services & Job Postings Section */}
      <section id="my-services-section" className="glass-card rounded-2xl border border-slate-800 overflow-hidden space-y-4 p-6 scroll-mt-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-indigo-400" /> My Published Services & Job Postings
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Manage your active service packages, edit pricing, or remove outdated listings</p>
          </div>

          <Link
            href="/dashboard/technician/services"
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Post New Service
          </Link>
        </div>

        {loadingServices ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading your published service packages...</div>
        ) : myServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myServices.map((service) => (
              <div key={service.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {service.category?.name || "Service"}
                    </span>
                    <span className="text-base font-extrabold text-white">${Number(service.price).toFixed(2)}</span>
                  </div>

                  <h3 className="font-bold text-white text-sm leading-snug">{service.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{service.description || "No description provided."}</p>
                  
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" /> {service.durationMinutes} mins estimated duration
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEditModal(service)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold text-xs transition-colors flex items-center gap-1 border border-slate-700"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>

                  <button
                    onClick={() => handleDeleteService(service.id)}
                    disabled={deletingId === service.id}
                    className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-semibold text-xs transition-colors flex items-center gap-1 border border-rose-800/50 disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> {deletingId === service.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
            <Wrench className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="font-semibold text-slate-300 text-sm">No Published Services Found</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You haven&apos;t published any custom service packages yet. Click &quot;Post New Service&quot; to list your rates!
            </p>
          </div>
        )}
      </section>

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
            onClick={() => fetchTechnicianBookings(true)}
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

      {/* Customer Reviews & Ratings Received Segment */}
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

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl relative space-y-6">
            <button
              onClick={() => setEditingService(null)}
              className="absolute right-5 top-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Pencil className="w-5 h-5 text-indigo-400" /> Edit Service Offering
              </h2>
              <p className="text-xs text-slate-400 mt-1">Update title, pricing, and duration for your service package</p>
            </div>

            <form onSubmit={handleSaveServiceEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full bg-slate-900 text-white text-xs rounded-xl p-3 border border-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    required
                    className="w-full bg-slate-900 text-white text-xs rounded-xl p-3 border border-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Duration (Mins) *
                  </label>
                  <input
                    type="number"
                    step="15"
                    min="15"
                    value={editDuration}
                    onChange={(e) => setEditDuration(Number(e.target.value))}
                    required
                    className="w-full bg-slate-900 text-white text-xs rounded-xl p-3 border border-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-slate-900 text-white text-xs rounded-xl p-3 border border-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={savingEdit}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50"
              >
                {savingEdit ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                  </>
                ) : (
                  "Save & Update Service Offering"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
