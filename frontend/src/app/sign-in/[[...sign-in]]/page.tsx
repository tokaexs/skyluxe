"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Plane, ArrowLeft, ShieldCheck, Sparkles, Compass, CheckCircle2 } from "lucide-react";
import { skyluxeClerkAppearance } from "@/lib/clerkTheme";

export default function SignInPage() {
  return (
    <main className="relative min-h-screen bg-[#030303] text-platinum flex flex-col lg:flex-row items-stretch justify-between overflow-hidden selection:bg-gold/30">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[140px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[160px] pointer-events-none translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <div className="absolute top-6 left-6 z-30">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-gold/40 text-platinum/70 hover:text-white transition-all text-xs font-mono group backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-gold" />
          <span>Return to SkyLuxe</span>
        </Link>
      </div>

      {/* Left Brand Experience Column (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 lg:p-16 relative border-r border-white/5 bg-gradient-to-br from-white/[0.02] via-transparent to-black/60">
        {/* Brand Header */}
        <div className="pt-10">
          <Link href="/" className="inline-flex items-center gap-3 group mb-12">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center group-hover:border-gold transition-colors">
              <Plane className="w-5 h-5 text-gold -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
            </div>
            <span className="text-2xl font-serif font-bold text-white tracking-tight">
              Sky<span className="text-gold">Luxe</span>
            </span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-gold text-[11px] font-mono tracking-wider uppercase mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sovereign Executive Terminal</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-serif font-bold text-white leading-tight tracking-tight mb-6">
            Autonomous Airspace & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-white">
              Bespoke Jet Charters
            </span>
          </h1>

          <p className="text-platinum/70 text-base font-light leading-relaxed max-w-md">
            Sign in to unlock real-time Gulfstream dispatches, ARIS predictive flight pricing, and 24/7 dedicated FBO concierge access.
          </p>
        </div>

        {/* Feature Highlights Card */}
        <div className="space-y-4 my-8">
          <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-start gap-4 hover:border-gold/20 transition-all bg-white/[0.02]">
            <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 mt-0.5">
              <Compass className="w-4 h-4 text-gold" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">ARIS Intelligence Suite</h4>
              <p className="text-xs text-platinum/50 mt-0.5 font-light">
                Sub-second dynamic routing and executive demand forecasting.
              </p>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-start gap-4 hover:border-gold/20 transition-all bg-white/[0.02]">
            <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 mt-0.5">
              <Plane className="w-4 h-4 text-gold" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Heavy Jet Fleet Access</h4>
              <p className="text-xs text-platinum/50 mt-0.5 font-light">
                Global 7500 & Gulfstream G650ER ready for immediate dispatch.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Trust Stamp */}
        <div className="flex items-center justify-between pt-6 border-t border-white/5 text-xs text-platinum/40 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gold" />
            <span>256-Bit TLS Sovereign Aviation Security</span>
          </div>
          <span>BOM • DXB • LHR • FAB</span>
        </div>
      </div>

      {/* Right Column: Clerk Sign In Component */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 pt-24 lg:pt-16 relative z-10 min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <Plane className="w-6 h-6 text-gold -rotate-45" />
            <span className="text-xl font-serif font-bold text-white">SkyLuxe</span>
          </Link>
          <p className="text-xs text-platinum/60 font-light">Executive Sovereign Sign-In</p>
        </div>

        {/* Clerk Sign In Box */}
        <div className="w-full max-w-[460px] flex justify-center">
          <SignIn appearance={skyluxeClerkAppearance} />
        </div>

        {/* Footer Support Text */}
        <p className="text-center text-[11px] text-platinum/40 font-mono mt-8">
          Protected by SkyLuxe Multi-Layer Identity Protocol
        </p>
      </div>
    </main>
  );
}
