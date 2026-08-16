"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api/client";
import { Booking, Payment } from "@/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableRowSkeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import {
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  Star,
  DollarSign,
  AlertCircle,
  ExternalLink,
  Loader2,
  X,
  MessageSquare,
  Wrench,
} from "lucide-react";

export default function CustomerDashboard() {
  const { user } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);

  // Review Modal States
  const [reviewModalBooking, setReviewModalBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Payment Processing State
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const res = await api.get("/users/get-my-bookings");
      const data = Array.isArray(res) ? res : res?.data || [];
      setBookings(data);
    } catch (err: any) {
      console.error("Failed to load customer bookings:", err);
      toast.error(err.message || "Failed to load bookings");
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchPayments = async () => {
    try {
      setLoadingPayments(true);
      const res = await api.get("/payments/my-payments");
      const data = Array.isArray(res) ? res : res?.data || [];
      setPayments(data);
    } catch (err: any) {
      console.error("Failed to load customer payments:", err);
    } finally {
      setLoadingPayments(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchPayments();
  }, []);

  // Initiate Stripe Payment Flow
  const handleInitiatePayment = async (bookingId: string) => {
    setPayingBookingId(bookingId);
    try {
      const res = await api.post("/payments/create", { bookingId });
      
      const checkoutUrl = res.checkoutUrl || res.data?.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error("Payment session URL was not returned by gateway");
      }

      toast.success("Redirecting to Stripe Checkout...");
      window.location.href = checkoutUrl;
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate payment flow.");
      setPayingBookingId(null);
    }
  };

  // Submit Review Modal Handler
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalBooking) return;

    setSubmittingReview(true);
    try {
      await api.post("/users/review", {
        bookingId: reviewModalBooking.id,
        rating: Number(rating),
        comment: comment || undefined,
      });

      toast.success("Thank you! Review submitted successfully.");
      setReviewModalBooking(null);
      setComment("");
      fetchBookings();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const activeBookingsCount = bookings.filter(
    (b) => b.status !== "COMPLETED" && b.status !== "CANCELLED" && b.status !== "DECLINED"
  ).length;

  const totalSpent = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Welcome back, {user?.name}!</h1>
          <p className="text-xs text-slate-400 mt-1">Track your service bookings, manage payments, and rate completed jobs.</p>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-indigo-600/20 text-indigo-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Active Jobs</span>
            <span className="text-2xl font-extrabold text-white">{activeBookingsCount}</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-500/20 text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Completed Bookings</span>
            <span className="text-2xl font-extrabold text-white">
              {bookings.filter((b) => b.status === "COMPLETED").length}
            </span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-purple-500/20 text-purple-400">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Total Spent</span>
            <span className="text-2xl font-extrabold text-white">${totalSpent.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* My Bookings Table */}
      <section className="glass-card rounded-2xl border border-slate-800 overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" /> My Booking Requests & Jobs
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Real-time status updates for all home service appointments</p>
          </div>
          <button
            onClick={fetchBookings}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Service Details</th>
                <th className="p-3.5">Technician</th>
                <th className="p-3.5">Scheduled Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loadingBookings ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 font-semibold text-white">
                      <div>{booking.service?.title || "Home Service"}</div>
                      <div className="text-[11px] text-slate-400 font-normal truncate max-w-xs">{booking.address}</div>
                    </td>
                    <td className="p-3.5 font-medium text-slate-200">
                      {booking.technician?.user?.name || "Technician"}
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {new Date(booking.scheduledAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-3.5">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      {/* Action buttons based on status */}
                      {booking.status === "ACCEPTED" && (
                        <button
                          onClick={() => handleInitiatePayment(booking.id)}
                          disabled={payingBookingId === booking.id}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all inline-flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {payingBookingId === booking.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing...
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-3.5 h-3.5" /> Pay Now (${Number(booking.service?.price || 0).toFixed(2)})
                            </>
                          )}
                        </button>
                      )}

                      {booking.status === "COMPLETED" && (
                        <button
                          onClick={() => {
                            setReviewModalBooking(booking);
                            setRating(5);
                            setComment("");
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold text-xs transition-colors inline-flex items-center gap-1"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Leave Review
                        </button>
                      )}

                      {(booking.status === "REQUESTED" || booking.status === "ACCEPTED") && (
                        <span className="text-[11px] text-slate-500 italic">
                          {booking.status === "REQUESTED" ? "Awaiting acceptance" : "Ready for payment"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No booking requests found. Browse our services catalog to create your first appointment!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Payment History Table */}
      <section className="glass-card rounded-2xl border border-slate-800 overflow-hidden space-y-4 p-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-400" /> Payment Transactions History
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Summary of all Stripe gateway checkout transactions</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Transaction ID</th>
                <th className="p-3.5">Service</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loadingPayments ? (
                <TableRowSkeleton />
              ) : payments.length > 0 ? (
                payments.map((pmt) => (
                  <tr key={pmt.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 font-mono text-[11px] text-indigo-300 truncate max-w-[150px]">
                      {pmt.transactionId}
                    </td>
                    <td className="p-3.5 font-semibold text-white">
                      {pmt.booking?.service?.title || "Service Payment"}
                    </td>
                    <td className="p-3.5 font-bold text-white">${Number(pmt.amount).toFixed(2)}</td>
                    <td className="p-3.5">
                      <StatusBadge status={pmt.status} />
                    </td>
                    <td className="p-3.5 text-right text-slate-400">
                      {new Date(pmt.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No payment history recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Review Modal */}
      {reviewModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl relative space-y-5">
            <button
              onClick={() => setReviewModalBooking(null)}
              className="absolute right-5 top-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Rate Your Service
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Booking: <strong className="text-slate-200">{reviewModalBooking.service?.title}</strong>
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2 justify-center py-2 bg-slate-900/90 rounded-2xl border border-slate-800">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-2xl transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? "text-amber-400 fill-amber-400 drop-shadow-md"
                            : "text-slate-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Review / Feedback
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about technician quality, punctuality, and service accuracy..."
                  className="w-full bg-slate-900 text-white placeholder-slate-500 text-xs rounded-xl p-3 border border-slate-800 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {submittingReview ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting Review...
                  </>
                ) : (
                  "Post Review"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
