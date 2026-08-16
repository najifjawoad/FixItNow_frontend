import React from "react";
import Link from "next/link";
import { Wrench, Shield, Heart, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white">FixItNow</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Connecting homeowners with certified home service professionals. Book on-demand electrical, plumbing, HVAC, and handyman services with verified quality.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="hover:text-indigo-400 transition-colors">
                  Browse All Services
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-indigo-400 transition-colors">
                  Join as Technician
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-indigo-400 transition-colors">
                  Customer Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Top Categories</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white transition-colors">Electrical Repairs & Upgrades</li>
              <li className="hover:text-white transition-colors">Plumbing & Pipe Installation</li>
              <li className="hover:text-white transition-colors">HVAC & AC Maintenance</li>
              <li className="hover:text-white transition-colors">Carpentry & Furniture Assembly</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Platform Security</h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2 text-emerald-400 font-medium">
                <Shield className="w-4 h-4" /> Verified Technicians
              </p>
              <p className="text-slate-400">
                Stripe Payments Secured. Guaranteed booking protection and customer review system.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FixItNow Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Crafted for excellence <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
