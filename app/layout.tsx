import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Providers from "@/components/providers";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "FixItNow | Home Services Marketplace",
  description:
    "Book verified technicians, electricians, plumbers, and home service experts in minutes. Transparent pricing & secure Stripe payments.",
  keywords: ["home services", "handyman", "electrician", "plumber", "fixitnow", "booking"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${plusJakarta.className} bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased relative selection:bg-indigo-500 selection:text-white`}>
        {/* Ambient Glow Orbs */}
        <div className="ambient-glow-1" />
        <div className="ambient-glow-2" />

        <Providers>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
