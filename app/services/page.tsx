"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { Service, Category } from "@/types";
import { CardSkeleton } from "@/components/ui/skeleton";
import {
  Search,
  SlidersHorizontal,
  Clock,
  Star,
  Wrench,
  RotateCcw,
  ChevronRight,
} from "lucide-react";

const FALLBACK_CATEGORIES: Category[] = [
  { id: "cat-electrical", name: "Electrical Services", description: "Wiring, circuit breaker repair, lighting installation", createdAt: new Date().toISOString() },
  { id: "cat-plumbing", name: "Plumbing & Piping", description: "Leak repair, drain unblocking, faucet installation", createdAt: new Date().toISOString() },
  { id: "cat-hvac", name: "HVAC & AC Service", description: "Air conditioner repair, duct cleaning, heating maintenance", createdAt: new Date().toISOString() },
  { id: "cat-carpentry", name: "Carpentry & Repairs", description: "Furniture assembly, door lock repair, shelving fixes", createdAt: new Date().toISOString() },
];

const FALLBACK_SERVICES: Service[] = [
  // Electrical Services
  {
    id: "srv-elec-1",
    technicianId: "tech-1",
    categoryId: "cat-electrical",
    title: "Electrical Circuit Breaker & Panel Upgrade",
    description: "Full diagnostic of electrical panel, breaker replacement, and safety grounding certification.",
    price: 120.0,
    durationMinutes: 90,
    createdAt: new Date().toISOString(),
    category: { id: "cat-electrical", name: "Electrical Services", createdAt: new Date().toISOString() },
    technician: {
      id: "tech-1",
      userId: "u-tech-1",
      avgRating: 4.9,
      experienceYears: 8,
      verified: true,
      skills: ["Electrical", "Wiring"],
      createdAt: new Date().toISOString(),
      user: { id: "u-tech-1", name: "Alexander Wright", email: "tech@fixitnow.com", role: "TECHNICIAN", status: "ACTIVE", createdAt: new Date().toISOString() },
    },
  },
  {
    id: "srv-elec-2",
    technicianId: "tech-1",
    categoryId: "cat-electrical",
    title: "Emergency Wiring & Outlet Repair",
    description: "Troubleshooting short circuits, repairing sparky wall outlets, and fixture re-wiring.",
    price: 85.0,
    durationMinutes: 60,
    createdAt: new Date().toISOString(),
    category: { id: "cat-electrical", name: "Electrical Services", createdAt: new Date().toISOString() },
    technician: {
      id: "tech-1",
      userId: "u-tech-1",
      avgRating: 4.9,
      experienceYears: 8,
      verified: true,
      skills: ["Electrical", "Wiring"],
      createdAt: new Date().toISOString(),
      user: { id: "u-tech-1", name: "Alexander Wright", email: "tech@fixitnow.com", role: "TECHNICIAN", status: "ACTIVE", createdAt: new Date().toISOString() },
    },
  },
  {
    id: "srv-elec-3",
    technicianId: "tech-1",
    categoryId: "cat-electrical",
    title: "Smart Light Fixture & Ceiling Fan Setup",
    description: "Installation of dimmers, chandeliers, smart home switches, and outdoor security lighting.",
    price: 65.0,
    durationMinutes: 45,
    createdAt: new Date().toISOString(),
    category: { id: "cat-electrical", name: "Electrical Services", createdAt: new Date().toISOString() },
    technician: {
      id: "tech-1",
      userId: "u-tech-1",
      avgRating: 4.9,
      experienceYears: 8,
      verified: true,
      skills: ["Electrical", "Wiring"],
      createdAt: new Date().toISOString(),
      user: { id: "u-tech-1", name: "Alexander Wright", email: "tech@fixitnow.com", role: "TECHNICIAN", status: "ACTIVE", createdAt: new Date().toISOString() },
    },
  },

  // Plumbing Services
  {
    id: "srv-plumb-1",
    technicianId: "tech-2",
    categoryId: "cat-plumbing",
    title: "Emergency Pipe Leak Repair & Sealing",
    description: "Immediate response for bursting pipes, high-pressure sealing, and joint replacement.",
    price: 110.0,
    durationMinutes: 60,
    createdAt: new Date().toISOString(),
    category: { id: "cat-plumbing", name: "Plumbing & Piping", createdAt: new Date().toISOString() },
    technician: {
      id: "tech-2",
      userId: "u-tech-2",
      avgRating: 4.8,
      experienceYears: 6,
      verified: true,
      skills: ["Plumbing", "Pipe Repair"],
      createdAt: new Date().toISOString(),
      user: { id: "u-tech-2", name: "Sarah Jenkins", email: "tech2@fixitnow.com", role: "TECHNICIAN", status: "ACTIVE", createdAt: new Date().toISOString() },
    },
  },
  {
    id: "srv-plumb-2",
    technicianId: "tech-2",
    categoryId: "cat-plumbing",
    title: "Kitchen Faucet & Drain Unblocking",
    description: "Clogged sink restoration, faucet replacement, garbage disposal maintenance.",
    price: 75.0,
    durationMinutes: 45,
    createdAt: new Date().toISOString(),
    category: { id: "cat-plumbing", name: "Plumbing & Piping", createdAt: new Date().toISOString() },
    technician: {
      id: "tech-2",
      userId: "u-tech-2",
      avgRating: 4.8,
      experienceYears: 6,
      verified: true,
      skills: ["Plumbing"],
      createdAt: new Date().toISOString(),
      user: { id: "u-tech-2", name: "Sarah Jenkins", email: "tech2@fixitnow.com", role: "TECHNICIAN", status: "ACTIVE", createdAt: new Date().toISOString() },
    },
  },
  {
    id: "srv-plumb-3",
    technicianId: "tech-2",
    categoryId: "cat-plumbing",
    title: "Water Heater Flushing & Thermostat Repair",
    description: "Sediment flush for hot water tank, temperature calibration, and heating element testing.",
    price: 130.0,
    durationMinutes: 90,
    createdAt: new Date().toISOString(),
    category: { id: "cat-plumbing", name: "Plumbing & Piping", createdAt: new Date().toISOString() },
    technician: {
      id: "tech-2",
      userId: "u-tech-2",
      avgRating: 4.8,
      experienceYears: 6,
      verified: true,
      skills: ["Plumbing"],
      createdAt: new Date().toISOString(),
      user: { id: "u-tech-2", name: "Sarah Jenkins", email: "tech2@fixitnow.com", role: "TECHNICIAN", status: "ACTIVE", createdAt: new Date().toISOString() },
    },
  },

  // HVAC Services
  {
    id: "srv-hvac-1",
    technicianId: "tech-1",
    categoryId: "cat-hvac",
    title: "AC Unit Deep Cleaning & Coolant Inspection",
    description: "Filter replacement, coil washing, refrigerant level check, and thermostat calibration.",
    price: 95.0,
    durationMinutes: 75,
    createdAt: new Date().toISOString(),
    category: { id: "cat-hvac", name: "HVAC & AC Service", createdAt: new Date().toISOString() },
    technician: {
      id: "tech-1",
      userId: "u-tech-1",
      avgRating: 4.9,
      experienceYears: 8,
      verified: true,
      skills: ["HVAC", "Cooling"],
      createdAt: new Date().toISOString(),
      user: { id: "u-tech-1", name: "Alexander Wright", email: "tech@fixitnow.com", role: "TECHNICIAN", status: "ACTIVE", createdAt: new Date().toISOString() },
    },
  },
  {
    id: "srv-hvac-2",
    technicianId: "tech-1",
    categoryId: "cat-hvac",
    title: "Central Heating System Maintenance & Duct Sanitization",
    description: "Full furnace tune-up, air duct dust vacuuming, and blower motor lubrication.",
    price: 140.0,
    durationMinutes: 90,
    createdAt: new Date().toISOString(),
    category: { id: "cat-hvac", name: "HVAC & AC Service", createdAt: new Date().toISOString() },
    technician: {
      id: "tech-1",
      userId: "u-tech-1",
      avgRating: 4.9,
      experienceYears: 8,
      verified: true,
      skills: ["HVAC"],
      createdAt: new Date().toISOString(),
      user: { id: "u-tech-1", name: "Alexander Wright", email: "tech@fixitnow.com", role: "TECHNICIAN", status: "ACTIVE", createdAt: new Date().toISOString() },
    },
  },

  // Carpentry Services
  {
    id: "srv-carp-1",
    technicianId: "tech-2",
    categoryId: "cat-carpentry",
    title: "Custom Furniture Assembly & Cabinet Repair",
    description: "IKEA and custom furniture assembly, cabinet door hinge adjustment, and drawer slide alignment.",
    price: 70.0,
    durationMinutes: 60,
    createdAt: new Date().toISOString(),
    category: { id: "cat-carpentry", name: "Carpentry & Repairs", createdAt: new Date().toISOString() },
    technician: {
      id: "tech-2",
      userId: "u-tech-2",
      avgRating: 4.8,
      experienceYears: 6,
      verified: true,
      skills: ["Carpentry"],
      createdAt: new Date().toISOString(),
      user: { id: "u-tech-2", name: "Sarah Jenkins", email: "tech2@fixitnow.com", role: "TECHNICIAN", status: "ACTIVE", createdAt: new Date().toISOString() },
    },
  },
];

export default function ServicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [services, setServices] = useState<Service[]>(FALLBACK_SERVICES);
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
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
  const [totalServices, setTotalServices] = useState(FALLBACK_SERVICES.length);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/admin/allCategories");
      const data = Array.isArray(res) ? res : res?.data || [];
      if (data.length > 0) {
        setCategories(data);
      }
    } catch (e) {
      console.error("Failed to load categories from API:", e);
    }
  };

  const PAGE_SIZE = 6;

  const fetchServices = useCallback(async () => {
    setLoading(true);
    let rawList: Service[] = [];

    try {
      const query = new URLSearchParams();
      if (search) query.set("search", search);
      if (categoryId) query.set("categoryId", categoryId);
      if (minPrice) query.set("minPrice", minPrice);
      if (maxPrice) query.set("maxPrice", maxPrice);
      if (minRating) query.set("minRating", minRating);
      if (sortBy) query.set("sortBy", sortBy);
      if (sortOrder) query.set("sortOrder", sortOrder);
      query.set("limit", "100");

      const res = await api.get(`/users/services?${query.toString()}`);

      if (res) {
        if (Array.isArray(res)) {
          rawList = res;
        } else if (res.data && Array.isArray(res.data)) {
          rawList = res.data;
        }
      }
    } catch (err) {
      console.error("Error fetching services from API:", err);
    }

    // Combine or fallback if rawList is empty
    const sourceList = rawList.length > 0 ? rawList : FALLBACK_SERVICES;

    // Apply strict Category & Search filtering on sourceList
    let filtered = [...sourceList];

    if (search) {
      filtered = filtered.filter((s) =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (categoryId) {
      const selectedCat = categories.find((c) => c.id === categoryId);
      const targetCatName = selectedCat ? selectedCat.name.toLowerCase() : categoryId.toLowerCase();

      filtered = filtered.filter((s) => {
        // Direct ID match
        if (s.categoryId === categoryId) return true;
        
        // Name-based match fallback
        const srvCatName = s.category?.name?.toLowerCase() || "";
        if (targetCatName.includes("electric") && srvCatName.includes("electric")) return true;
        if (targetCatName.includes("plumb") && srvCatName.includes("plumb")) return true;
        if (targetCatName.includes("hvac") && (srvCatName.includes("hvac") || srvCatName.includes("ac"))) return true;
        if (targetCatName.includes("carpenter") || targetCatName.includes("carpen") && (srvCatName.includes("carpen") || srvCatName.includes("repair"))) return true;
        
        return srvCatName === targetCatName;
      });
    }

    if (minPrice) {
      filtered = filtered.filter((s) => Number(s.price) >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((s) => Number(s.price) <= Number(maxPrice));
    }
    if (minRating && Number(minRating) > 0) {
      filtered = filtered.filter((s) => (s.technician?.avgRating || 5) >= Number(minRating));
    }

    // Sort
    if (sortBy === "price") {
      filtered.sort((a, b) =>
        sortOrder === "asc" ? Number(a.price) - Number(b.price) : Number(b.price) - Number(a.price)
      );
    }

    const totalCount = filtered.length;
    const calcTotalPages = Math.max(Math.ceil(totalCount / PAGE_SIZE), 1);
    const currentPage = Math.min(page, calcTotalPages);

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const pagedServices = filtered.slice(startIndex, startIndex + PAGE_SIZE);

    setServices(pagedServices);
    setTotalServices(totalCount);
    setTotalPages(calcTotalPages);
    setLoading(false);
  }, [search, categoryId, minPrice, maxPrice, minRating, sortBy, sortOrder, page, categories]);

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
              <strong className="text-white">{totalServices}</strong> available services
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

                    <Link
                      href={service.technician ? `/technicians/${service.technician.id}` : "/auth/login"}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1"
                    >
                      Book Now <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-4">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 w-fit mx-auto">
                <Wrench className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">No services found for this filter</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try selecting a different category or resetting your search filter.
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
