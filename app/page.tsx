"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api/client";
import { Service, TechnicianProfile, Category } from "@/types";
import { CardSkeleton } from "@/components/ui/skeleton";
import {
  Wrench,
  Zap,
  ShieldCheck,
  Star,
  Search,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
  Calendar,
  CreditCard,
} from "lucide-react";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [servicesRes, techniciansRes, categoriesRes] = await Promise.allSettled([
          api.get("/users/services?limit=6"),
          api.get("/users/technicians?limit=4"),
          api.get("/admin/allCategories"),
        ]);

        if (servicesRes.status === "fulfilled" && servicesRes.value) {
          const sData = Array.isArray(servicesRes.value)
            ? servicesRes.value
            : servicesRes.value.data || [];
          setServices(sData);
        }

        if (techniciansRes.status === "fulfilled" && techniciansRes.value) {
          const tData = Array.isArray(techniciansRes.value)
            ? techniciansRes.value
            : techniciansRes.value.data || [];
          setTechnicians(tData);
        }

        if (categoriesRes.status === "fulfilled" && categoriesRes.value) {
          const cData = Array.isArray(categoriesRes.value)
            ? categoriesRes.value
            : categoriesRes.value.data || [];
          setCategories(cData);
        }
      } catch (err) {
        console.error("Error loading home page data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 p-8 sm:p-12 lg:p-16">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/80 via-slate-900/60 to-violet-950/40 -z-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-indigo-400" /> #1 Home Services Marketplace
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Certified Experts For Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-amber-300">Every Home Need</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            From emergency electrical fixes and pipe repairs to HVAC maintenance, connect with background-verified technicians and book guaranteed time slots.
          </p>

          {/* Quick Search Bar */}
          <div className="pt-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery) window.location.href = `/services?search=${encodeURIComponent(searchQuery)}`;
              }}
              className="flex flex-col sm:flex-row items-center gap-3 p-2 bg-slate-900/90 rounded-2xl border border-slate-700/80 shadow-2xl"
            >
              <div className="relative flex-1 w-full">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What service do you need? (e.g. Electrical, Plumbing)..."
                  className="w-full bg-transparent text-white placeholder-slate-400 text-sm pl-12 pr-4 py-3 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                Search Services <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Stat Pills */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Background Checked</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-400" />
              <span>Stripe Payment Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>4.9/5 Average Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Explore Categories</h2>
            <p className="text-sm text-slate-400 mt-1">Select a category to view specialized solutions</p>
          </div>
          <Link href="/services" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.length > 0 ? (
            categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/services?categoryId=${cat.id}`}
                className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 group flex flex-col justify-between"
              >
                <div className="p-3 rounded-xl bg-indigo-600/15 text-indigo-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {cat.description || "Certified technicians available."}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            // Default categories fallback
            [
              { name: "Electrical Services", desc: "Wiring, circuit breaker repair, outlet installs" },
              { name: "Plumbing & Piping", desc: "Leak fixes, pipe replacements, drain clearing" },
              { name: "HVAC & AC Service", desc: "Air conditioning, furnace repair, duct cleaning" },
              { name: "Carpentry & Repairs", desc: "Custom furniture repair, door & lock installation" },
            ].map((cat, idx) => (
              <Link
                key={idx}
                href="/services"
                className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 group"
              >
                <div className="p-3 rounded-xl bg-indigo-600/15 text-indigo-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{cat.desc}</p>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Featured Services</h2>
            <p className="text-sm text-slate-400 mt-1">Book top-rated services with upfront pricing</p>
          </div>
          <Link href="/services" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            Browse Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service) => (
              <div
                key={service.id}
                className="glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {service.category?.name || "Service"}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {service.durationMinutes} mins
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-white leading-snug">{service.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {service.description || "High-quality professional service by certified technician."}
                  </p>
                </div>

                <div className="px-6 py-4 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Starting At</span>
                    <span className="text-xl font-extrabold text-white">${Number(service.price).toFixed(2)}</span>
                  </div>

                  {service.technician ? (
                    <Link
                      href={`/technicians/${service.technician.id}`}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-all shadow-md shadow-indigo-600/20"
                    >
                      Book Now
                    </Link>
                  ) : (
                    <Link
                      href="/services"
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-8 text-center rounded-2xl border border-slate-800">
            <p className="text-sm text-slate-400">No active services listed yet. Technicians can create new services from their dashboard.</p>
          </div>
        )}
      </section>

      {/* Top Technicians Section */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Top-Rated Technicians</h2>
            <p className="text-sm text-slate-400 mt-1">Hire verified professionals with proven customer reviews</p>
          </div>
        </div>

        {technicians.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicians.map((tech) => (
              <div
                key={tech.id}
                className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between text-center"
              >
                <div className="space-y-3">
                  <div className="relative w-20 h-20 mx-auto rounded-full bg-slate-800 border-2 border-indigo-500/40 flex items-center justify-center text-xl font-bold text-indigo-300 overflow-hidden">
                    {tech.user?.name ? tech.user.name.charAt(0) : "T"}
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base">{tech.user?.name || "Verified Technician"}</h3>
                    <p className="text-xs text-indigo-400 font-medium">{tech.experienceYears} Years Experience</p>
                  </div>

                  <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-semibold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{tech.avgRating > 0 ? tech.avgRating.toFixed(1) : "5.0"}</span>
                    <span className="text-slate-500">({tech.reviews?.length || 1} reviews)</span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {tech.bio || "Specialized in home repairs, electrical installations, and emergency plumbing."}
                  </p>

                  <div className="flex flex-wrap justify-center gap-1 pt-1">
                    {tech.skills?.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800">
                  <Link
                    href={`/technicians/${tech.id}`}
                    className="w-full block py-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-semibold text-xs transition-all border border-slate-700"
                  >
                    View Profile & Availability
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-8 text-center rounded-2xl border border-slate-800">
            <p className="text-sm text-slate-400">Technicians will appear here as they set up their availability.</p>
          </div>
        )}
      </section>

      {/* How FixItNow Works */}
      <section className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800 text-center space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How FixItNow Works</h2>
          <p className="text-sm text-slate-400 mt-1 max-w-lg mx-auto">
            Book professional services in 4 simple steps with real-time tracking
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center mx-auto">
              1
            </div>
            <h3 className="font-bold text-white text-sm">Select Service</h3>
            <p className="text-xs text-slate-400">Browse categories and choose the exact service you need.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center mx-auto">
              2
            </div>
            <h3 className="font-bold text-white text-sm">Choose Time Slot</h3>
            <p className="text-xs text-slate-400">Pick an open time slot from technician&apos;s real-time scheduler.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center mx-auto">
              3
            </div>
            <h3 className="font-bold text-white text-sm">Stripe Payment</h3>
            <p className="text-xs text-slate-400">Secure Checkout redirect after technician accepts your request.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center mx-auto">
              4
            </div>
            <h3 className="font-bold text-white text-sm">Job Done & Review</h3>
            <p className="text-xs text-slate-400">Technician completes job; rate experience with stars & feedback.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
