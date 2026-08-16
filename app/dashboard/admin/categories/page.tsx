"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api/client";
import { Category } from "@/types";
import toast from "react-hot-toast";
import {
  Layers,
  Plus,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Wrench,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/allCategories");
      const data = Array.isArray(res) ? res : res?.data || [];
      setCategories(data);
    } catch (err: any) {
      console.error("Failed to load categories:", err);
      toast.error(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/admin/categories", {
        name,
        description: description || undefined,
      });

      toast.success("Category created successfully!");
      setName("");
      setDescription("");
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || "Failed to create category");
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
            href="/dashboard/admin"
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Admin Overview
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Service Category Management</h1>
          <p className="text-xs text-slate-400 mt-1">Define platform categories for organizing technician services.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Creation Form */}
        <div className="lg:col-span-1 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Plus className="w-5 h-5 text-indigo-400" /> Create New Category
          </h2>

          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Electrical Repairs"
                required
                className="w-full bg-slate-900 text-white placeholder-slate-500 text-xs rounded-xl p-3 border border-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of services in this category..."
                className="w-full bg-slate-900 text-white placeholder-slate-500 text-xs rounded-xl p-3 border border-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Save Category
                </>
              )}
            </button>
          </form>
        </div>

        {/* Existing Categories Table */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Layers className="w-5 h-5 text-indigo-400" /> Existing Platform Categories
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Category Name</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-right">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-slate-400">Loading categories...</td>
                  </tr>
                ) : categories.length > 0 ? (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-bold text-white flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400">
                          <Wrench className="w-3.5 h-3.5" />
                        </div>
                        {cat.name}
                      </td>
                      <td className="p-3 text-slate-400 max-w-xs truncate">
                        {cat.description || "No description provided."}
                      </td>
                      <td className="p-3 text-right text-slate-500">
                        {new Date(cat.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-slate-400">
                      No categories created yet. Use the form on the left to add one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
