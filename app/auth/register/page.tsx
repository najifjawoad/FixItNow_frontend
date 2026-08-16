"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import toast from "react-hot-toast";
import { Role } from "@/types";
import {
  Wrench,
  User,
  Mail,
  Lock,
  Phone,
  Briefcase,
  Award,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<Role>("CUSTOMER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // Technician-specific fields
  const [bio, setBio] = useState("");
  const [experienceYears, setExperienceYears] = useState<number>(2);
  const [skillsInput, setSkillsInput] = useState("Electrical, Plumbing, Wiring");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full Name is required";
    if (!email.trim()) errs.email = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email address";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters";

    if (role === "TECHNICIAN") {
      if (!bio.trim()) errs.bio = "Technician bio is required";
      if (experienceYears < 0) errs.experienceYears = "Experience must be 0 or more";
      if (!skillsInput.trim()) errs.skillsInput = "At least one skill is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload: any = {
        name,
        email,
        password,
        phone: phone || undefined,
        role,
      };

      if (role === "TECHNICIAN") {
        const skillsArray = skillsInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

        payload.bio = bio;
        payload.experienceYears = Number(experienceYears);
        payload.skills = skillsArray;
      }

      await api.post("/auth/register", payload);

      toast.success("Account created successfully! Please sign in.");
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-8">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-3 shadow-inner">
            <Wrench className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Your FixItNow Account</h1>
          <p className="text-sm text-slate-400 mt-1">
            Choose your account role to access personalized services or list your technical expertise.
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Role Selection Toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("CUSTOMER")}
                  className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-sm font-semibold transition-all ${
                    role === "CUSTOMER"
                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-lg shadow-indigo-500/10"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <User className="w-4 h-4" /> Customer / Tenant
                </button>
                <button
                  type="button"
                  onClick={() => setRole("TECHNICIAN")}
                  className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-sm font-semibold transition-all ${
                    role === "TECHNICIAN"
                      ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Briefcase className="w-4 h-4" /> Technician / Provider
                </button>
              </div>
            </div>

            {/* Standard User Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className={`w-full bg-slate-900/90 text-white placeholder-slate-500 rounded-xl pl-9 pr-3 py-2.5 text-sm border focus:outline-none focus:ring-2 ${
                      errors.name ? "border-rose-500/80" : "border-slate-800 focus:border-indigo-500"
                    }`}
                  />
                </div>
                {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className={`w-full bg-slate-900/90 text-white placeholder-slate-500 rounded-xl pl-9 pr-3 py-2.5 text-sm border focus:outline-none focus:ring-2 ${
                      errors.email ? "border-rose-500/80" : "border-slate-800 focus:border-indigo-500"
                    }`}
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full bg-slate-900/90 text-white placeholder-slate-500 rounded-xl pl-9 pr-3 py-2.5 text-sm border focus:outline-none focus:ring-2 ${
                      errors.password ? "border-rose-500/80" : "border-slate-800 focus:border-indigo-500"
                    }`}
                  />
                </div>
                {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-0199"
                    className="w-full bg-slate-900/90 text-white placeholder-slate-500 rounded-xl pl-9 pr-3 py-2.5 text-sm border border-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Technician Profile Details (Conditional) */}
            {role === "TECHNICIAN" && (
              <div className="pt-4 border-t border-amber-500/20 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                  <Award className="w-4 h-4" /> Technician Profile Credentials
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Professional Bio *
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your technical background, certifications, and specialties..."
                    className={`w-full bg-slate-900/90 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 text-sm border focus:outline-none focus:ring-2 ${
                      errors.bio ? "border-rose-500/80" : "border-slate-800 focus:border-amber-500"
                    }`}
                  />
                  {errors.bio && <p className="text-xs text-rose-400 mt-1">{errors.bio}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Experience (Years) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full bg-slate-900/90 text-white rounded-xl px-3 py-2.5 text-sm border border-slate-800 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Skills (Comma Separated) *
                    </label>
                    <input
                      type="text"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      placeholder="Electrical, Wiring, HVAC"
                      className={`w-full bg-slate-900/90 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 text-sm border focus:outline-none ${
                        errors.skillsInput ? "border-rose-500/80" : "border-slate-800 focus:border-amber-500"
                      }`}
                    />
                    {errors.skillsInput && (
                      <p className="text-xs text-rose-400 mt-1">{errors.skillsInput}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 ${
                role === "TECHNICIAN"
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-amber-600/20 hover:from-amber-500 hover:to-orange-500"
                  : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-600/30 hover:from-indigo-500 hover:to-violet-500"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating Account...
                </>
              ) : (
                <>
                  Complete Registration <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-indigo-400 hover:text-indigo-300 underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
