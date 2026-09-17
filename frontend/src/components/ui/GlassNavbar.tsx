"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { Plane } from "lucide-react";
import { Show, UserButton } from "@clerk/nextjs";
import { useSkyLuxeStore } from "@/store/skyluxeStore";

export default function GlassNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { currency, setCurrency } = useSkyLuxeStore();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-onyx/80 backdrop-blur-md border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <Link id="tour-logo" href="/" className="flex items-center gap-3 group">
          <Plane className="w-8 h-8 text-gold -rotate-45 group-hover:rotate-0 transition-transform duration-500 ease-out" />
          <span className="text-2xl font-serif font-bold text-white tracking-tight">SkyLuxe</span>
        </Link>

        <div id="tour-nav" className="hidden md:flex items-center gap-8">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/fleet">Private Jets</NavLink>
          <NavLink href="/commercial">Commercial Flights</NavLink>
          <NavLink href="/concierge">Concierge AI</NavLink>
          <NavLink href="/membership">Elite Membership</NavLink>

          {/* Currency Toggle */}
          <div id="tour-currency" className="flex bg-white/5 border border-white/10 p-0.5 rounded-xl text-[10px] ml-4">
            <button 
              onClick={() => setCurrency("USD")}
              className={`px-2.5 py-1 rounded-lg transition-all ${currency === "USD" ? "bg-gold text-onyx font-bold" : "text-platinum/60 hover:text-white"}`}
            >
              USD ($)
            </button>
            <button 
              onClick={() => setCurrency("INR")}
              className={`px-2.5 py-1 rounded-lg transition-all ${currency === "INR" ? "bg-gold text-onyx font-bold" : "text-platinum/60 hover:text-white"}`}
            >
              INR (₹)
            </button>
          </div>

          {/* Clerk Auth Controls */}
          <Show when="signed-out">
            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <button id="tour-signin" className="px-5 py-2 text-sm text-platinum/80 hover:text-white font-medium transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/sign-up">
                <button id="tour-signup" className="px-5 py-2 rounded-full bg-gradient-to-r from-gold to-gold-light text-onyx font-semibold text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:-translate-y-0.5 transition-all duration-300">
                  Sign Up
                </button>
              </Link>
            </div>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <button id="tour-dashboard" className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white font-medium text-sm transition-all">
                  Dashboard
                </button>
              </Link>
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9 border border-gold/40 shadow-[0_0_10px_rgba(212,175,55,0.3)]",
                  }
                }}
              />
            </div>
          </Show>
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm font-medium text-platinum/80 hover:text-gold transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}
