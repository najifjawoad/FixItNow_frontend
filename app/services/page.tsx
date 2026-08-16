"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { Service, Category } from "@/types";
import { CardSkeleton } from "@/components/ui/skeleton";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Clock,
  Star,
  Wrench,
  DollarSign,
  RotateCcw,
  ChevronRight,
} from "lucide-react";

export default function ServicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "desc");

  // Meta
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalServices, setTotalServices] = useState(0);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/admin/allCategories");
      const data = Array.isArray(res) ? res : res?.data || [];
      setCategories(data);
    } catch (e) {
      console.error("Failed to load categories:", e);
    }
  };

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.set("search", search);
      if (categoryId) query.set("categoryId", categoryId);
      if (minPrice) query.set("minPrice", minPrice);
      if (maxPrice) query.set("maxPrice", maxPrice);
      if (minRating) query.set("minRating", minRating);
      if (sortBy) query.set("sortBy", sortBy);
      if (sortOrder) query.set("sortOrder", sortOrder);
      query.set("page", String(page));
      query.set("limit", "9");

      const res = await api.get(`/users/services?${query.toString()}`);

      if (res) {
        if (Array.isArray(res)) {
          setServices(res);
          setTotalServices(res.length);
          setTotalPages(1);
        } else {
          setServices(res.data || []);
          if (res.meta) {
            setTotalPages(res.meta.totalPages || 1);
            setTotalServices(res.meta.total || 0);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [search, categoryId, minPrice, maxPrice, minRating, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleResetFilters = () => {
    setSearch("");
    setCategoryId("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setSortBy("newest");
    setSortOrder("desc");
    setPage(1);
    router.push("/services");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
          <Wrench className="w-4 h-4" /> Service Marketplace
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Browse Home Services</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Filter by category, price, or technician rating to find the perfect expert for your home maintenance task.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" /> Filter Services
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Search query input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Search Title
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="e.g. Electrical, Plumbing..."
                  className="w-full bg-slate-900 text-white placeholder-slate-500 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-900 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:border-indigo-500 focus:outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Price Range ($)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPage(1);
                  }}
                  className="bg-slate-900 text-white placeholder-slate-500 text-xs rounded-xl px-3 py-2 border border-slate-800 focus:border-indigo-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPage(1);
                  }}
                  className="bg-slate-900 text-white placeholder-slate-500 text-xs rounded-xl px-3 py-2 border border-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Min Technician Rating
              </label>
              <select
                value={minRating}
                onChange={(e) => {
                  setMinRating(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-900 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5★ & Above</option>
                <option value="4.0">4.0★ & Above</option>
                <option value="3.0">3.0★ & Above</option>
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Sort By
              </label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [by, order] = e.target.value.split("-");
                  setSortBy(by);
                  setSortOrder(order);
                  setPage(1);
                }}
                className="w-full bg-slate-900 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:border-indigo-500 focus:outline-none"
              >
                <option value="newest-desc">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Rated</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Services Main Grid */}
        <main className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing <strong className="text-white">{services.length}</strong> of{" "}
              <strong className="text-white">{totalServices || services.length}</strong> available services
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {service.category?.name || "General Service"}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {service.durationMinutes} m
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-white leading-snug">{service.title}</h3>
                    
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {service.description || "Expert technician available for scheduled home repairs."}
                    </p>

                    {service.technician && (
                      <div className="pt-2 flex items-center gap-2 border-t border-slate-800/60">
                        <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 text-[10px] font-bold flex items-center justify-center">
                          {service.technician.user?.name ? service.technician.user.name.charAt(0) : "T"}
                        </div>
                        <span className="text-xs text-slate-300 font-medium truncate">
                          {service.technician.user?.name || "Technician"}
                        </span>
                        <div className="ml-auto flex items-center gap-1 text-amber-400 text-xs font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{service.technician.avgRating > 0 ? service.technician.avgRating.toFixed(1) : "5.0"}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-4 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Price</span>
                      <span className="text-lg font-extrabold text-white">${Number(service.price).toFixed(2)}</span>
                    </div>

                    {service.technician ? (
                      <Link
                        href={`/technicians/${service.technician.id}?serviceId=${service.id}`}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1"
                      >
                        Book Now <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-500 font-medium text-xs cursor-not-allowed"
                      >
                        Unavailable
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-4">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 w-fit mx-auto">
                <Wrench className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">No services found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try adjusting your search criteria or resetting filters to view all available service offerings.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-slate-800 text-indigo-300 font-medium text-xs hover:bg-slate-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-slate-400 font-medium px-3">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
