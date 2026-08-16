"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api/client";
import { useAuth } from "@/context/AuthContext";
import { Availability } from "@/types";
import toast from "react-hot-toast";
import {
  Calendar,
  Clock,
  Plus,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function TechnicianAvailabilityPage() {
  const { user } = useAuth();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [submitting, setSubmitting] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profile = await api.get("/auth/me");
      if (profile?.technicianProfile?.id) {
        const techRes = await api.get(`/users/technicians/${profile.technicianProfile.id}`);
        setAvailabilities(techRes?.availability || []);
      }
    } catch (err: any) {
      console.error("Failed to load availability schedule:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    // Default date to today formatted YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    if (startTime >= endTime) {
      toast.error("Start time must be strictly before end time");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/technician/availability", {
        date,
        startTime,
        endTime,
      });

      toast.success("New availability slot published successfully!");
      fetchProfile();
    } catch (err: any) {
      toast.error(err.message || "Failed to add availability slot");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/technician"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Availability Scheduler</h1>
          <p className="text-xs text-slate-400 mt-1">Set working hours and open time slots for customer bookings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Panel */}
        <div className="lg:col-span-1 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Plus className="w-5 h-5 text-amber-400" /> Post New Slot
          </h2>

          <form onSubmit={handleAddAvailability} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Working Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-slate-900 text-white text-xs rounded-xl p-3 border border-slate-800 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Start Time *
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full bg-slate-900 text-white text-xs rounded-xl p-3 border border-slate-800 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  End Time *
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full bg-slate-900 text-white text-xs rounded-xl p-3 border border-slate-800 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Publishing Slot...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Add Working Slot
                </>
              )}
            </button>
          </form>
        </div>

        {/* Existing Schedule Grid */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Calendar className="w-5 h-5 text-indigo-400" /> Published Time Slots
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            </div>
          ) : availabilities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availabilities.map((slot) => (
                <div
                  key={slot.id}
                  className={`p-4 rounded-xl border space-y-2 ${
                    slot.isBooked
                      ? "bg-purple-950/20 border-purple-800/40"
                      : "bg-slate-900/80 border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">
                      {new Date(slot.date).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {slot.isBooked ? (
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold text-[10px] uppercase">
                        Booked
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[10px] uppercase">
                        Open Slot
                      </span>
                    )}
                  </div>

                  <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    {slot.startTime} - {slot.endTime}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              No working slots published yet. Use the form on the left to add your first open time slot.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
