"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { Plane } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function GlassNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { isAuthenticated, logout, isLoading } = useAuth();

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
        <Link href="/" className="flex items-center gap-3 group">
          <Plane className="w-8 h-8 text-gold -rotate-45 group-hover:rotate-0 transition-transform duration-500 ease-out" />
          <span className="text-2xl font-serif font-bold text-white tracking-tight">SkyLuxe</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/fleet">Private Jets</NavLink>
          <NavLink href="/commercial">Commercial Flights</NavLink>
          <NavLink href="/concierge">Concierge AI</NavLink>
          <NavLink href="/membership">Elite Membership</NavLink>

          {/* Auth State Simulation - Links to Dashboard */}
          {!isLoading && isAuthenticated ? (
            <div className="flex items-center gap-4 ml-4">
              <Link href="/dashboard">
                <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-onyx font-semibold shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:-translate-y-0.5 transition-all duration-300">
                  Access Dashboard
                </button>
              </Link>
            </div>
          ) : !isLoading && (
            <Link href="/auth/login">
              <button className="ml-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-onyx font-semibold shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:-translate-y-0.5 transition-all duration-300">
                Sign In
              </button>
            </Link>
          )}
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
