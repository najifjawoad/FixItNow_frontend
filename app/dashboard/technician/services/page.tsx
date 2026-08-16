"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api/client";
import { Category } from "@/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Wrench,
  Plus,
  ArrowLeft,
  Loader2,
  DollarSign,
  Clock,
  Layers,
} from "lucide-react";

export default function CreateServicePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  // Form fields
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoadingCats(true);
        const res = await api.get("/technician/allCategories");
        const data = Array.isArray(res) ? res : res?.data || [];
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(data[0].id);
        }
      } catch (err: any) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoadingCats(false);
      }
    }
    fetchCategories();
  }, []);

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Service title is required");
      return;
    }
    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }
    if (!price || Number(price) <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/technician/services", {
        categoryId,
        title,
        description: description || undefined,
        price: Number(price),
        durationMinutes: Number(durationMinutes),
      });

      toast.success("New service package created successfully! Redirecting to dashboard...");
      router.push("/dashboard/technician");
    } catch (err: any) {
      toast.error(err.message || "Failed to create service package");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/technician"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Create Service Package</h1>
          <p className="text-xs text-slate-400 mt-1">List your technical services, pricing, and duration for customers.</p>
        </div>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <form onSubmit={handleCreateService} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Service Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Electrical Circuit Breaker Repair & Wiring"
              required
              className="w-full bg-slate-900 text-white placeholder-slate-500 text-sm rounded-xl p-3 border border-slate-800 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Category *
            </label>
            {loadingCats ? (
              <div className="text-xs text-slate-400">Loading categories...</div>
            ) : (
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full bg-slate-900 text-white text-xs rounded-xl p-3 border border-slate-800 focus:border-amber-500 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Service Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what is included in this service package..."
              className="w-full bg-slate-900 text-white placeholder-slate-500 text-xs rounded-xl p-3 border border-slate-800 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="75.00"
                required
                className="w-full bg-slate-900 text-white text-sm rounded-xl p-3 border border-slate-800 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Estimated Duration (Minutes) *
              </label>
              <input
                type="number"
                step="15"
                min="15"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                required
                className="w-full bg-slate-900 text-white text-sm rounded-xl p-3 border border-slate-800 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Publishing Package...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Publish Service Offering
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
