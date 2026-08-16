"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
  CreditCard,
} from "lucide-react";

const FALLBACK_SERVICES: Service[] = [
  {
    id: "srv-bd-1",
    technicianId: "tech-bd-1",
    categoryId: "cat-elec",
    title: "DB Box Installation & Full House Rewiring",
    description: "Full diagnostic of distribution box, breaker replacement, and safety grounding certification.",
    price: 35.0,
    durationMinutes: 120,
    createdAt: new Date().toISOString(),
    category: { id: "cat-elec", name: "Electrical Services", createdAt: new Date().toISOString() },
  },
  {
    id: "srv-bd-2",
    technicianId: "tech-bd-1",
    categoryId: "cat-elec",
    title: "IPS & Generator Line Connection & Servicing",
    description: "Instant Power Supply (IPS) wiring, battery fluid check, and automatic changeover switch setup.",
    price: 25.0,
    durationMinutes: 90,
    createdAt: new Date().toISOString(),
    category: { id: "cat-elec", name: "Electrical Services", createdAt: new Date().toISOString() },
  },
  {
    id: "srv-bd-3",
    technicianId: "tech-bd-3",
    categoryId: "cat-hvac",
    title: "Inverter AC Master Jet Wash & Filter Cleaning",
    description: "High-pressure chemical wash of indoor & outdoor units, drain pipe clearing, and airflow optimization.",
    price: 20.0,
    durationMinutes: 60,
    createdAt: new Date().toISOString(),
    category: { id: "cat-hvac", name: "HVAC & AC Service", createdAt: new Date().toISOString() },
  },
  {
    id: "srv-bd-4",
    technicianId: "tech-bd-2",
    categoryId: "cat-plumb",
    title: "Water Submersible Pump Repair & Unblocking",
    description: "Roof tank motor repair, line pressure adjustment, and main underground pipe unblocking.",
    price: 30.0,
    durationMinutes: 90,
    createdAt: new Date().toISOString(),
    category: { id: "cat-plumb", name: "Plumbing & Piping", createdAt: new Date().toISOString() },
  },
  {
    id: "srv-bd-5",
    technicianId: "tech-bd-2",
    categoryId: "cat-plumb",
    title: "Sanitary Fitting & Concealed Pipe Leak Sealing",
    description: "Bathroom commode, basin, concealed shower mixer installation, and high-pressure leak sealing.",
    price: 22.0,
    durationMinutes: 75,
    createdAt: new Date().toISOString(),
    category: { id: "cat-plumb", name: "Plumbing & Piping", createdAt: new Date().toISOString() },
  },
  {
    id: "srv-bd-6",
    technicianId: "tech-bd-4",
    categoryId: "cat-carpentry",
    title: "Modular Kitchen Cabinet Repair & Lock Fitting",
    description: "Soft-close hinge adjustment, hydraulic stay lift installation, and security lock replacement.",
    price: 20.0,
    durationMinutes: 60,
    createdAt: new Date().toISOString(),
    category: { id: "cat-carpentry", name: "Carpentry & Handyman", createdAt: new Date().toISOString() },
  },
];

const FALLBACK_TECHNICIANS: TechnicianProfile[] = [
  {
    id: "tech-bd-1",
    userId: "u-tech-bd-1",
    bio: "Certified Electrical Engineer with 9 years of experience in Dhaka. Specialist in DB box installation, home rewiring, IPS/UPS setup, and emergency short-circuit repair.",
    experienceYears: 9,
    skills: ["Electrical", "IPS & Generator", "Circuit Repair", "DB Box Setup"],
    avgRating: 4.9,
    verified: true,
    createdAt: new Date().toISOString(),
    user: { id: "u-tech-bd-1", name: "Engr. Tanvir Ahmed", email: "tanvir.electric@gmail.com", phone: "+880 1712-345678", role: "TECHNICIAN", status: "ACTIVE", createdAt: new Date().toISOString() },
    reviews: [{ id: "r1", bookingId: "b1", customerId: "c1", technicianId: "tech-bd-1", rating: 5, comment: "Re-wired our DB box perfectly!", createdAt: new Date().toISOString() }],
  },
  {
    id: "tech-bd-2",
    userId: "u-tech-bd-2",
    bio: "Professional plumber serving Gulshan, Banani, and Dhanmondi areas. Expert in sanitary fitting, water pump repair, pipeline leak fixing, and gas line inspection.",
    experienceYears: 7,
    skills: ["Plumbing", "Sanitary Fitting", "Water Pump", "Pipe Leak Repair"],
    avgRating: 4.8,
    verified: true,
    createdAt: new Date().toISOString(),
    user: { id: "u-tech-bd-2", name: "Md. Rafiqul Islam", email: "rafiq.plumbing@gmail.com", phone: "+880 1819-876543", role: "TECHNICIAN", status: "ACTIVE", createdAt: new Date().toISOString() },
    reviews: [{ id: "r2", bookingId: "b2", customerId: "c2", technicianId: "tech-bd-2", rating: 5, comment: "Unblocked our underground water line quickly.", createdAt: new Date().toISOString() }],
  },
  {
    id: "tech-bd-3",
    userId: "u-tech-bd-3",
    bio: "Certified Inverter AC technician with 8 years of experience. Specialist in jet wash master service, gas refill (R32/R410a), compressor repair, and split AC installation.",
    experienceYears: 8,
    skills: ["HVAC", "AC Master Wash", "Gas Refill", "Compressor Repair"],
    avgRating: 4.9,
    verified: true,
    createdAt: new Date().toISOString(),
    user: { id: "u-tech-bd-3", name: "Kazi Mahmud Hasan", email: "mahmud.acservice@gmail.com", phone: "+880 1911-234567", role: "TECHNICIAN", status: "ACTIVE", createdAt: new Date().toISOString() },
    reviews: [{ id: "r3", bookingId: "b3", customerId: "c3", technicianId: "tech-bd-3", rating: 5, comment: "Master jet wash made the AC cooling like new!", createdAt: new Date().toISOString() }],
  },
  {
    id: "tech-bd-4",
    userId: "u-tech-bd-4",
    bio: "Skilled artisan with 10 years of experience in custom door fitting, modular kitchen cabinet crafting, furniture repair, and door lock installation.",
    experienceYears: 10,
    skills: ["Carpentry", "Kitchen Cabinet", "Door Lock Repair", "Furniture Polish"],
    avgRating: 5.0,
    verified: true,
    createdAt: new Date().toISOString(),
    user: { id: "u-tech-bd-4", name: "Naimur Rahman", email: "naimur.carpenter@gmail.com", phone: "+880 1615-998877", role: "TECHNICIAN", status: "ACTIVE", createdAt: new Date().toISOString() },
    reviews: [{ id: "r4", bookingId: "b4", customerId: "c4", technicianId: "tech-bd-4", rating: 5, comment: "Top quality woodwork and cabinet lock fitting.", createdAt: new Date().toISOString() }],
  },
];

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
          setServices(sData.length > 0 ? sData : FALLBACK_SERVICES);
        } else {
          setServices(FALLBACK_SERVICES);
        }

        if (techniciansRes.status === "fulfilled" && techniciansRes.value) {
          const tData = Array.isArray(techniciansRes.value)
            ? techniciansRes.value
            : techniciansRes.value.data || [];
          setTechnicians(tData.length > 0 ? tData : FALLBACK_TECHNICIANS);
        } else {
          setTechnicians(FALLBACK_TECHNICIANS);
        }

        if (categoriesRes.status === "fulfilled" && categoriesRes.value) {
          const cData = Array.isArray(categoriesRes.value)
            ? categoriesRes.value
            : categoriesRes.value.data || [];
          setCategories(cData);
        }
      } catch (err) {
        console.error("Error loading home page data:", err);
        setServices(FALLBACK_SERVICES);
        setTechnicians(FALLBACK_TECHNICIANS);
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
            <Sparkles className="w-4 h-4 text-indigo-400" /> #1 Home Services Marketplace in Bangladesh
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Certified Experts For Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-amber-300">Every Home Need</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            From emergency electrical fixes & IPS rewiring to AC jet wash and water pump repairs, connect with verified Bangladeshi technicians and book time slots instantly.
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
                  placeholder="What service do you need? (e.g. AC Jet Wash, IPS Wiring)..."
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
              <span>100% Background Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-400" />
              <span>Stripe Payment Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>4.9/5 Average Customer Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Explore Categories</h2>
            <p className="text-sm text-slate-400 mt-1">Select a category to view specialized Bangladeshi experts</p>
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
              { name: "Electrical Services", desc: "DB box, IPS setup, wiring, breaker repairs" },
              { name: "Plumbing & Piping", desc: "Water pump, concealed pipe leak, sanitary fittings" },
              { name: "HVAC & AC Service", desc: "Inverter AC jet wash, gas refill, compressor repair" },
              { name: "Carpentry & Handyman", desc: "Kitchen cabinet craft, door locks, furniture polish" },
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

                  <Link
                    href={service.technician ? `/technicians/${service.technician.id}` : "/auth/login"}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-all shadow-md shadow-indigo-600/20"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {/* Top Technicians Section */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Top-Rated Technicians</h2>
            <p className="text-sm text-slate-400 mt-1">Hire verified Bangladeshi professionals with proven customer reviews</p>
          </div>
        </div>

        {technicians.length > 0 && (
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
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{tech.user?.phone || ""}</p>
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
                    View Profile & Schedule
                  </Link>
                </div>
              </div>
            ))}
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
