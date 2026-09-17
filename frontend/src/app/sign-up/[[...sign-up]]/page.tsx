"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Plane, ArrowLeft, ShieldCheck, Sparkles, Star, CheckCircle2 } from "lucide-react";
import { skyluxeClerkAppearance } from "@/lib/clerkTheme";

export default function SignUpPage() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-between text-platinum selection:bg-gold/30 overflow-x-hidden">
      {/* Cinematic Aviation Background Image & Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/auth-bg.jpg"
          alt="SkyLuxe Private Aviation"
          fill
          priority
          className="object-cover object-center scale-105 animate-fade-in duration-1000"
        />
        {/* Layered cinematic dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/95 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08)_0%,_transparent_70%)]" />
      </div>

      {/* Top Floating Header */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/40 border border-white/10 hover:border-gold/50 text-platinum/80 hover:text-white transition-all text-xs font-mono group backdrop-blur-xl shadow-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-gold" />
          <span>Return to SkyLuxe</span>
        </Link>

        {/* Brand Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center group-hover:border-gold group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all">
            <Plane className="w-4 h-4 text-gold -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
          </div>
          <span className="text-xl font-serif font-bold text-white tracking-tight hidden sm:inline-block">
            Sky<span className="text-gold">Luxe</span>
          </span>
        </Link>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/50 border border-gold/25 backdrop-blur-xl shadow-md">
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="text-[11px] font-mono text-platinum/80 uppercase tracking-wider hidden sm:inline-block">
            Tier: <span className="text-gold font-bold">Black Elite</span>
          </span>
        </div>
      </header>

      {/* Centered Glassmorphic Authentication Card */}
      <section className="relative z-20 w-full flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Glow halo behind the card */}
        <div className="absolute w-[360px] sm:w-[480px] h-[360px] sm:h-[480px] bg-gold/15 rounded-full blur-[120px] pointer-events-none -translate-y-6" />

        <div className="w-full max-w-[460px] flex flex-col items-center">
          {/* Executive Access Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold/40 bg-black/60 text-gold text-[10px] font-mono tracking-[0.2em] uppercase mb-4 backdrop-blur-xl shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            <Sparkles className="w-3 h-3 text-gold" />
            <span>Membership Onboarding Protocol</span>
          </div>

          {/* Luxury Switcher Tab */}
          <div className="w-full mb-6 p-1 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-2xl flex items-center gap-1 shadow-2xl">
            <Link 
              href="/sign-in" 
              className="flex-1 py-2.5 rounded-xl text-platinum/60 hover:text-white hover:bg-white/5 text-xs font-mono tracking-wider uppercase text-center transition-all"
            >
              Sign In
            </Link>
            <button 
              type="button" 
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-gold/20 via-gold/10 to-transparent border border-gold/40 text-gold text-xs font-mono font-bold tracking-wider uppercase text-center shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all"
            >
              Create Account
            </button>
          </div>

          {/* Clerk Component Box */}
          <div className="w-full flex justify-center drop-shadow-2xl">
            <SignUp appearance={skyluxeClerkAppearance} />
          </div>

          {/* Trust Certifications Footer */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] font-mono text-platinum/50">
            <span className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-gold" />
              1,250 Welcome SkyCoins
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
              Dedicated FBO Escort
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              Part 135 Certified
            </span>
          </div>

          {/* Dedicated VIP Concierge Phone */}
          <p className="mt-3 text-center text-xs font-mono text-platinum/60">
            24/7 FBO Concierge: <a href="tel:+912261234567" className="text-gold hover:underline font-bold">+91 (022) 6123-LUXE</a>
          </p>
        </div>
      </section>

      {/* Bottom Subtle Terminal Bar */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-[11px] font-mono text-platinum/40 border-t border-white/5">
        <span>© {new Date().getFullYear()} SkyLuxe Aviation Group</span>
        <span className="hidden sm:inline">Executive Hub: BOM • DXB • LHR • FAB</span>
      </footer>
    </main>
  );
}
