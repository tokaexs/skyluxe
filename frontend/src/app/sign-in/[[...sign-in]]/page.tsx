"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Plane, ArrowLeft, ShieldCheck, Sparkles, Compass, Radio, Activity, Zap, CheckCircle2, PhoneCall } from "lucide-react";
import { skyluxeClerkAppearance } from "@/lib/clerkTheme";

export default function SignInPage() {
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
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[160px] pointer-events-none -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gold/5 rounded-full blur-[180px] pointer-events-none translate-x-1/4 translate-y-1/4" />
      <div className="absolute top-1/2 left-1/4 w-[450px] h-[450px] bg-white/[0.015] rounded-full blur-[140px] pointer-events-none" />

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
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-mono text-platinum/70 uppercase tracking-wider">
            ARIS Airspace Engine <span className="text-gold font-bold">Online</span>
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
              <span className="block text-[9px] font-mono tracking-[0.25em] text-gold/80 uppercase">Aviation Terminal</span>
            </div>
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold text-[11px] font-mono tracking-wider uppercase mb-6 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sovereign Executive Access</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-serif font-bold text-white leading-[1.15] tracking-tight mb-5">
            Sovereign Airspace. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-white">
              Instant Fleet Dispatch.
            </span>
          </h1>

          <p className="text-platinum/70 text-base font-light leading-relaxed max-w-lg mb-8">
            Enter the private aviation portal for sub-second Gulfstream and Bombardier dispatches, ARIS dynamic pricing index, and 24/7 dedicated FBO concierge support.
          </p>

          {/* Live Fleet Telemetry Widget */}
          <div className="glass-panel p-5 rounded-3xl border border-gold/20 bg-black/40 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-lg mb-8 space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-gold">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                <span className="uppercase tracking-wider">Live Fleet Operations</span>
              </div>
              <span className="text-[10px] font-mono text-platinum/50 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                BOM • DXB • LHR • FAB
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-white">Gulfstream G650ER</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">READY</span>
                </div>
                <p className="text-[11px] text-platinum/50 font-mono">BOM Terminal 2 FBO</p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-white">Global 7500</span>
                  <span className="text-[10px] font-mono text-gold font-bold">DISPATCH</span>
                </div>
                <p className="text-[11px] text-platinum/50 font-mono">DXB VIP Apron</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-platinum/60 font-mono">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-gold" />
                Average Quote Latency: <strong className="text-white">420ms</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-amber-400" />
                Dispatches: <strong className="text-white">Part 135</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 gap-4 my-4 max-w-lg">
          <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-gold/30 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center mb-2.5 group-hover:border-gold transition-colors">
              <Compass className="w-4 h-4 text-gold" />
            </div>
            <h4 className="text-xs font-semibold text-white tracking-wide">ARIS Predictive AI</h4>
            <p className="text-[11px] text-platinum/50 mt-1 font-light leading-snug">
              Instant dynamic route optimization & demand forecasting.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-gold/30 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center mb-2.5 group-hover:border-gold transition-colors">
              <ShieldCheck className="w-4 h-4 text-gold" />
            </div>
            <h4 className="text-xs font-semibold text-white tracking-wide">Sovereign Vault</h4>
            <p className="text-[11px] text-platinum/50 mt-1 font-light leading-snug">
              256-bit encryption with multi-factor biometric authentication.
            </p>
          </div>
        </div>

        {/* Bottom Trust Stamp */}
        <div className="flex items-center justify-between pt-6 border-t border-white/5 text-xs text-platinum/40 font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold" />
            <span>ARG/US Platinum • Wyvern Wingman Certified</span>
          </div>
          <span>EST. 2026</span>
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
          <p className="text-xs text-platinum/60 font-light">Sovereign Executive Sign-In</p>
        </div>

        {/* Quick Navigation Tabs: Sign-In vs Sign-Up */}
        <div className="w-full max-w-[460px] mb-6 p-1 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex items-center gap-1 shadow-inner">
          <button 
            type="button" 
            className="flex-1 py-2.5 rounded-xl bg-gold/15 border border-gold/40 text-gold text-xs font-mono font-bold tracking-wider uppercase text-center shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all"
          >
            Sign In
          </button>
          <Link 
            href="/sign-up" 
            className="flex-1 py-2.5 rounded-xl text-platinum/60 hover:text-white hover:bg-white/5 text-xs font-mono tracking-wider uppercase text-center transition-all"
          >
            Create Account
          </Link>
        </div>

        {/* Clerk Sign In Box */}
        <div className="w-full max-w-[460px] flex justify-center">
          <SignIn appearance={skyluxeClerkAppearance} />
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
