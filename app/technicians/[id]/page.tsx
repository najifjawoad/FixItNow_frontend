"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { useAuth } from "@/context/AuthContext";
import { TechnicianProfile, Availability, Service } from "@/types";
import toast from "react-hot-toast";
import {
  Wrench,
  Star,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Award,
  ArrowRight,
  Loader2,
  X,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

export default function TechnicianDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const technicianId = params.id as string;
  const preselectedServiceId = searchParams.get("serviceId");

  const [technician, setTechnician] = useState<TechnicianProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(preselectedServiceId || "");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    async function fetchTechnician() {
      try {
        setLoading(true);
        const res = await api.get(`/users/technicians/${technicianId}`);
        const data = res?.data || res;
        setTechnician(data);

        // Auto-select first service if available
        if (data?.services && data.services.length > 0 && !preselectedServiceId) {
          setSelectedServiceId(data.services[0].id);
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to load technician profile");
      } finally {
        setLoading(false);
      }
    }
    if (technicianId) {
      fetchTechnician();
    }
  }, [technicianId, preselectedServiceId]);

  const handleOpenModal = (slotId?: string) => {
    if (!user) {
      toast.error("Please sign in as a customer to book services.");
      router.push(`/auth/login?redirect=/technicians/${technicianId}`);
      return;
    }

    if (user.role !== "CUSTOMER") {
      toast.error("Only customers can create booking requests.");
      return;
    }

    if (slotId) {
      setSelectedSlotId(slotId);
    }
    setIsModalOpen(true);
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId) {
      toast.error("Please select a service");
      return;
    }
    if (!selectedSlotId) {
      toast.error("Please choose an available time slot");
      return;
    }
    if (!address.trim()) {
      toast.error("Please provide your service address");
      return;
    }

    setBookingLoading(true);
    try {
      await api.post("/bookings", {
        serviceId: selectedServiceId,
        availabilityId: selectedSlotId,
        address,
        notes: notes || undefined,
      });

      toast.success("Booking request submitted! Technician will review your request.");
      setIsModalOpen(false);
      router.push("/dashboard/customer");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit booking request.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-3" />
        <p className="text-sm text-slate-400">Loading technician profile & schedule...</p>
      </div>
    );
  }

  if (!technician) {
    return (
      <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Technician Not Found</h2>
        <p className="text-sm text-slate-400">The technician profile you are looking for does not exist.</p>
      </div>
    );
  }

  const selectedService = technician.services?.find((s) => s.id === selectedServiceId);

  return (
    <div className="space-y-8 pb-12">
      {/* Profile Banner Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-extrabold text-3xl flex items-center justify-center shadow-xl shadow-indigo-600/25 shrink-0">
              {technician.user?.name ? technician.user.name.charAt(0) : "T"}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {technician.user?.name || "Verified Technician"}
                </h1>
                {technician.verified && (
                  <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400" title="Verified Technician">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {technician.avgRating > 0 ? technician.avgRating.toFixed(1) : "5.0"} Rating
                </span>
                <span className="flex items-center gap-1 text-indigo-400">
                  <Award className="w-4 h-4" /> {technician.experienceYears} Years Experience
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <MessageSquare className="w-4 h-4" /> {technician.reviews?.length || 0} Reviews
                </span>
              </div>

              <p className="text-xs text-slate-400 max-w-xl pt-1">
                {technician.bio || "Certified technician specializing in home maintenance, electrical fixes, and plumbing."}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {technician.skills?.map((skill, idx) => (
                  <span key={idx} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-800 text-indigo-300 border border-slate-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 shrink-0 hover:scale-105"
          >
            <Calendar className="w-4 h-4" /> Book Appointment Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Services & Availability */}
        <div className="lg:col-span-2 space-y-8">
          {/* Service Offerings */}
          <section className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-indigo-400" /> Offered Services & Rates
            </h2>

            {technician.services && technician.services.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {technician.services.map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => {
                      setSelectedServiceId(srv.id);
                      handleOpenModal();
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedServiceId === srv.id
                        ? "bg-indigo-600/15 border-indigo-500 shadow-md"
                        : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300">
                        {srv.category?.name || "Service"}
                      </span>
                      <span className="text-base font-extrabold text-white">${Number(srv.price).toFixed(2)}</span>
                    </div>
                    <h3 className="font-bold text-slate-100 text-sm">{srv.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{srv.description}</p>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {srv.durationMinutes} minutes
                      </span>
                      <span className="text-indigo-400 font-semibold flex items-center gap-0.5">
                        Select <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No specific service packages configured yet.</p>
            )}
          </section>

          {/* Real-time Open Availability Slots */}
          <section className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" /> Interactive Schedule & Open Slots
              </h2>
              <span className="text-xs text-slate-400">Click a slot to reserve</span>
            </div>

            {technician.availability && technician.availability.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {technician.availability.map((slot) => {
                  const dateFormatted = new Date(slot.date).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  });
                  return (
                    <button
                      key={slot.id}
                      onClick={() => handleOpenModal(slot.id)}
                      className={`p-3 rounded-xl border text-left transition-all group ${
                        selectedSlotId === slot.id
                          ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30"
                          : "bg-slate-900 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800 text-slate-200"
                      }`}
                    >
                      <div className="text-[11px] font-semibold text-slate-400 group-hover:text-indigo-300">
                        {dateFormatted}
                      </div>
                      <div className="text-sm font-extrabold flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        {slot.startTime} - {slot.endTime}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-slate-900/60 text-center border border-slate-800">
                <p className="text-xs text-slate-400">
                  No open availability slots currently published by this technician. Check back soon or contact support.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Customer Reviews Sidebar */}
        <aside className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Verified Customer Reviews
            </h3>

            {technician.reviews && technician.reviews.length > 0 ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {technician.reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{rev.customer?.name || "Verified Customer"}</span>
                      <div className="flex items-center text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                        {rev.rating}/5
                      </div>
                    </div>
                    {rev.comment && <p className="text-xs text-slate-400 leading-relaxed italic">&quot;{rev.comment}&quot;</p>}
                    <span className="text-[10px] text-slate-500 block">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No reviews submitted yet for this technician.</p>
            )}
          </div>
        </aside>
      </div>

      {/* Booking Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl relative space-y-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" /> Book Service Appointment
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Technician: <strong className="text-slate-200">{technician.user?.name}</strong>
              </p>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4">
              {/* Select Service */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Package *
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  required
                  className="w-full bg-slate-900 text-white text-xs rounded-xl px-3 py-3 border border-slate-800 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">Choose a Service Package</option>
                  {technician.services?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} (${Number(s.price).toFixed(2)}) - {s.durationMinutes} mins
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Time Slot */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Time Slot *
                </label>
                <select
                  value={selectedSlotId}
                  onChange={(e) => setSelectedSlotId(e.target.value)}
                  required
                  className="w-full bg-slate-900 text-white text-xs rounded-xl px-3 py-3 border border-slate-800 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">Choose Available Date & Time</option>
                  {technician.availability?.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {new Date(slot.date).toLocaleDateString()} | {slot.startTime} - {slot.endTime}
                    </option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Service Address *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, Apartment 4B"
                  required
                  className="w-full bg-slate-900 text-white placeholder-slate-500 text-xs rounded-xl px-3 py-3 border border-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Special Notes / Request (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Please call upon arrival or bring specific wiring tools..."
                  className="w-full bg-slate-900 text-white placeholder-slate-500 text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {selectedService && (
                <div className="p-3.5 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-between text-xs">
                  <span className="text-slate-300">Total Price:</span>
                  <span className="font-extrabold text-white text-base">${Number(selectedService.price).toFixed(2)}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {bookingLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting Request...
                  </>
                ) : (
                  <>
                    Confirm & Submit Booking Request <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
