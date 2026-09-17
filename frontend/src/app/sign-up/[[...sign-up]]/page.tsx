"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Plane, ArrowLeft, ShieldCheck, Sparkles, Award, Star, Gift, CheckCircle2, PhoneCall } from "lucide-react";
import { skyluxeClerkAppearance } from "@/lib/clerkTheme";

export default function SignUpPage() {
  return (
    <main className="relative min-h-screen bg-[#030303] text-platinum flex flex-col lg:flex-row items-stretch justify-between overflow-x-hidden selection:bg-gold/30">
      {/* Aeronautical Background Grid & Ambient Glows */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(rgba(212, 175, 55, 0.4) 1px, transparent 1px)`,
          backgroundSize: "32px 32px"
        }}
      />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[160px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gold/5 rounded-full blur-[180px] pointer-events-none -translate-x-1/4 translate-y-1/4" />
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-white/[0.015] rounded-full blur-[140px] pointer-events-none" />

      {/* Top Floating Navigation Bar */}
      <header className="absolute top-5 left-5 right-5 sm:top-6 sm:left-8 sm:right-8 z-30 flex items-center justify-between pointer-events-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 hover:border-gold/40 text-platinum/80 hover:text-white transition-all text-xs font-mono group backdrop-blur-xl shadow-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-gold" />
          <span>Return to SkyLuxe</span>
        </Link>

        <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/40 border border-gold/20 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="text-[11px] font-mono text-platinum/70 uppercase tracking-wider">
            Tier: <span className="text-gold font-bold">Black Elite Membership</span>
          </span>
        </div>
      </header>

      {/* Left Brand Experience Column (Desktop) */}
      <div className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 xl:p-16 relative border-r border-white/5 bg-gradient-to-br from-white/[0.02] via-transparent to-black/80 z-10">
        {/* Brand Header */}
        <div className="pt-12">
          <Link href="/" className="inline-flex items-center gap-3 group mb-8">
            <div className="w-11 h-11 rounded-2xl bg-gold/10 border border-gold/40 flex items-center justify-center group-hover:border-gold group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300">
              <Plane className="w-5 h-5 text-gold -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold text-white tracking-tight">
                Sky<span className="text-gold">Luxe</span>
              </span>
              <span className="block text-[9px] font-mono tracking-[0.25em] text-gold/80 uppercase">Elite Membership</span>
            </div>
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold text-[11px] font-mono tracking-wider uppercase mb-6 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Membership Onboarding Protocol</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-serif font-bold text-white leading-[1.15] tracking-tight mb-5">
            Begin Your Journey into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-white">
              Sovereign Aviation.
            </span>
          </h1>

          <p className="text-platinum/70 text-base font-light leading-relaxed max-w-lg mb-8">
            Create your SkyLuxe credentials to claim your complimentary 1,250 welcome SkyCoins, access unlisted empty legs, and receive bespoke FBO chauffeur escorts.
          </p>

          {/* Welcome Membership Rewards Card */}
          <div className="glass-panel p-5 rounded-3xl border border-gold/20 bg-black/40 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-lg mb-8 space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-gold">
                <Gift className="w-3.5 h-3.5 text-gold animate-bounce" />
                <span className="uppercase tracking-wider">Welcome Onboarding Package</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full font-bold">
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-white">SkyCoins Gift</span>
                  <span className="text-[10px] font-mono text-gold font-bold">+1,250 PTS</span>
                </div>
                <p className="text-[11px] text-platinum/50 font-mono">Instant Account Credit</p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-white">Empty Leg Access</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">UP TO 75% OFF</span>
                </div>
                <p className="text-[11px] text-platinum/50 font-mono">Private Jet Repositioning</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-platinum/60 font-mono">
              <span className="flex items-center gap-1.5">
                <Star className="w-3 h-3 text-gold" />
                Tier Status: <strong className="text-white">Centurion Gold</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-3 h-3 text-amber-400" />
                FBO Transfer: <strong className="text-white">Included</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 gap-4 my-4 max-w-lg">
          <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-gold/30 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center mb-2.5 group-hover:border-gold transition-colors">
              <Star className="w-4 h-4 text-gold" />
            </div>
            <h4 className="text-xs font-semibold text-white tracking-wide">Global Lounge Access</h4>
            <p className="text-[11px] text-platinum/50 mt-1 font-light leading-snug">
              Access 650+ VIP private terminals and partner aviation lounges.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-gold/30 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center mb-2.5 group-hover:border-gold transition-colors">
              <ShieldCheck className="w-4 h-4 text-gold" />
            </div>
            <h4 className="text-xs font-semibold text-white tracking-wide">Guaranteed Fleet Quality</h4>
            <p className="text-[11px] text-platinum/50 mt-1 font-light leading-snug">
              Every aircraft inspected with Part 135 strict flight logs.
            </p>
          </div>
        </div>

        {/* Bottom Trust Stamp */}
        <div className="flex items-center justify-between pt-6 border-t border-white/5 text-xs text-platinum/40 font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold" />
            <span>Black Elite & Sovereign Tier Certified</span>
          </div>
          <span>BOM • DXB • LHR • FAB</span>
        </div>
      </div>

      {/* Right Column: High-End Auth Portal */}
      <div className="w-full lg:w-[48%] flex flex-col items-center justify-center p-6 sm:p-10 xl:p-16 pt-24 lg:pt-16 relative z-10 min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden text-center mb-6 pt-6">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center">
              <Plane className="w-4 h-4 text-gold -rotate-45" />
            </div>
            <span className="text-xl font-serif font-bold text-white">SkyLuxe</span>
          </Link>
          <p className="text-xs text-platinum/60 font-light">Create Elite Sovereign Account</p>
        </div>

        {/* Quick Navigation Tabs: Sign-In vs Sign-Up */}
        <div className="w-full max-w-[460px] mb-6 p-1 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex items-center gap-1 shadow-inner">
          <Link 
            href="/sign-in" 
            className="flex-1 py-2.5 rounded-xl text-platinum/60 hover:text-white hover:bg-white/5 text-xs font-mono tracking-wider uppercase text-center transition-all"
          >
            Sign In
          </Link>
          <button 
            type="button" 
            className="flex-1 py-2.5 rounded-xl bg-gold/15 border border-gold/40 text-gold text-xs font-mono font-bold tracking-wider uppercase text-center shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all"
          >
            Create Account
          </button>
        </div>

        {/* Clerk Sign Up Box */}
        <div className="w-full max-w-[460px] flex justify-center">
          <SignUp appearance={skyluxeClerkAppearance} />
        </div>

        {/* Dedicated 24/7 VIP Concierge Support Footer */}
        <div className="mt-8 text-center space-y-2">
          <p className="inline-flex items-center gap-2 text-xs text-platinum/60 font-mono">
            <PhoneCall className="w-3.5 h-3.5 text-gold" />
            <span>24/7 FBO Concierge: <strong className="text-white">+91 (022) 6123-LUXE</strong></span>
          </p>
          <p className="text-[10px] text-platinum/40 font-mono">
            SkyLuxe Sovereign Security Architecture • TLS 1.3 Certified
          </p>
        </div>
      </div>
    </main>
  );
}
