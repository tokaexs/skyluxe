"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plane, Menu, X, Sparkles, Crown, Wind, Navigation, Star } from "lucide-react";
import { Show, UserButton } from "@clerk/nextjs";
import { useSkyLuxeStore } from "@/store/skyluxeStore";

export default function GlassNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { currency, setCurrency } = useSkyLuxeStore();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // Close mobile menu on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Private Jets", href: "/fleet", icon: Wind },
    { name: "Commercial Flights", href: "/commercial", icon: Plane },
    { name: "Concierge AI", href: "/concierge", icon: Sparkles },
    { name: "Elite Membership", href: "/membership", icon: Crown },
    { name: "Track Flight", href: "/track-flight", icon: Navigation },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || mobileMenuOpen
            ? "bg-onyx/90 backdrop-blur-md border-b border-white/5 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between">
          <Link id="tour-logo" href="/" className="flex items-center gap-3 group">
            <Plane className="w-7 h-7 sm:w-8 sm:h-8 text-gold -rotate-45 group-hover:rotate-0 transition-transform duration-500 ease-out" />
            <span className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">SkyLuxe</span>
          </Link>

          {/* Desktop Nav */}
          <div id="tour-nav" className="hidden lg:flex items-center gap-7">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/fleet">Private Jets</NavLink>
            <NavLink href="/commercial">Commercial Flights</NavLink>
            <NavLink href="/concierge">Concierge AI</NavLink>
            <NavLink href="/membership">Elite Membership</NavLink>

            {/* Currency Toggle */}
            <div id="tour-currency" className="flex bg-white/5 border border-white/10 p-0.5 rounded-xl text-[10px] ml-2">
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
                  <button id="tour-signin" className="px-4 py-2 text-sm text-platinum/80 hover:text-white font-medium transition-colors">
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

          {/* Mobile Right Controls & Hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* Quick currency on mobile bar */}
            <div className="flex bg-white/5 border border-white/10 p-0.5 rounded-lg text-[10px]">
              <button 
                onClick={() => setCurrency("USD")}
                className={`px-2 py-0.5 rounded-md transition-all font-mono ${currency === "USD" ? "bg-gold text-onyx font-bold" : "text-platinum/60"}`}
              >
                $
              </button>
              <button 
                onClick={() => setCurrency("INR")}
                className={`px-2 py-0.5 rounded-md transition-all font-mono ${currency === "INR" ? "bg-gold text-onyx font-bold" : "text-platinum/60"}`}
              >
                ₹
              </button>
            </div>

            <Show when="signed-in">
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8 border border-gold/40 shadow-[0_0_8px_rgba(212,175,55,0.3)]",
                  }
                }}
              />
            </Show>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-platinum hover:text-white hover:border-gold/40 transition-colors focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-gold" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 top-20 sm:top-24 z-40 bg-[#070709]/95 backdrop-blur-2xl lg:hidden flex flex-col justify-between p-6 overflow-y-auto border-t border-white/10"
          >
            <div className="space-y-2 py-4">
              <p className="text-[10px] font-mono text-platinum/40 uppercase tracking-widest px-3 mb-2">Navigation</p>
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                      isActive
                        ? "bg-gold/15 text-gold font-bold border border-gold/30"
                        : "text-platinum/80 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-3 text-base">
                      {Icon && <Icon className={`w-4 h-4 ${isActive ? "text-gold" : "text-platinum/50"}`} />}
                      {link.name}
                    </span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-gold" />}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Auth & Footer CTA */}
            <div className="border-t border-white/10 pt-6 mt-4 space-y-4">
              <Show when="signed-out">
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <button className="w-full py-3.5 rounded-xl border border-white/15 bg-white/5 text-white font-medium text-sm hover:bg-white/10 transition-colors">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-onyx font-bold text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                      Sign Up
                    </button>
                  </Link>
                </div>
              </Show>

              <Show when="signed-in">
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full block">
                  <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-onyx font-bold text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2">
                    <Star className="w-4 h-4" /> Open Member Dashboard
                  </button>
                </Link>
              </Show>

              <div className="flex items-center justify-between text-xs text-platinum/40 pt-2 font-mono">
                <span>SkyLuxe Aviation OS</span>
                <div className="flex gap-2">
                  <button onClick={() => setCurrency("USD")} className={`px-2 py-0.5 rounded ${currency === "USD" ? "text-gold font-bold" : "text-platinum/50"}`}>USD</button>
                  <span>•</span>
                  <button onClick={() => setCurrency("INR")} className={`px-2 py-0.5 rounded ${currency === "INR" ? "text-gold font-bold" : "text-platinum/50"}`}>INR</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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

