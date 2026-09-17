"use client";

import React from "react";
import GlassNavbar from "@/components/ui/GlassNavbar";
import { motion } from "framer-motion";
import { TrendingUp, Globe2, ShieldCheck, Download, Award, ArrowUpRight, Building, Sparkles } from "lucide-react";

export default function InvestorsPage() {
  const metrics = [
    { label: "Annual Gross Flight Volume", value: "$142M+", growth: "+184% YoY", detail: "Charter & commercial premium seat transactions" },
    { label: "Active Elite Members", value: "14,850+", growth: "+92% YoY", detail: "Centurion, Black Tier, and Sovereign members" },
    { label: "AI Route Efficiency", value: "99.4%", growth: "ARIS v2.4", detail: "Real-time airspace optimization engine" },
    { label: "Global Fleet Access", value: "1,200+", growth: "54 Countries", detail: "Partnered Gulfstream, Bombardier, Dassault operators" },
  ];

  const highlights = [
    {
      title: "Autonomous Aviation Engine (ARIS)",
      description: "Our proprietary multi-agent AI system manages dynamic flight routing, empty leg auctions, and personalized VIP passenger concierge with zero human latency.",
      tag: "Deep Tech Moat"
    },
    {
      title: "High-Margin Recurring Ecosystem",
      description: "Blended revenue across tiered membership subscriptions ($2,500 - $25,000/yr), charter brokerage commissions (8-12%), and concierge marketplace transactions.",
      tag: "Financial Model"
    },
    {
      title: "Institutional Backing & Governance",
      description: "Audited aviation compliance across FAA Part 135, EASA, and DGCA international safety corridors with end-to-end sovereign encryption.",
      tag: "Safety & Compliance"
    }
  ];

  return (
    <main className="min-h-screen bg-onyx text-white relative selection:bg-gold/30">
      <GlassNavbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/10 rounded-full blur-[140px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-mono tracking-widest uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5" /> SkyLuxe Global Holdings
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white tracking-tight mb-6 leading-tight">
            Pioneering the Future of <span className="bg-gradient-to-r from-gold via-gold-light to-white bg-clip-text text-transparent">Luxury Aviation</span>
          </h1>
          <p className="text-platinum/70 text-base sm:text-lg font-light leading-relaxed mb-8">
            SkyLuxe is scaling the world&apos;s most sophisticated private aviation network, combining institutional aerospace logistics with proprietary generative AI.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#metrics"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-black font-bold text-sm tracking-wide hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2 cursor-pointer"
            >
              Key Metrics <TrendingUp className="w-4 h-4" />
            </a>
            <a
              href="mailto:ir@skyluxe.aero"
              className="px-8 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm tracking-wide transition-all flex items-center gap-2 cursor-pointer"
            >
              Investor Concierge <ArrowUpRight className="w-4 h-4 text-gold" />
            </a>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div id="metrics" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {metrics.map((m, idx) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-gold/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono text-gold px-2.5 py-1 rounded-full bg-gold/10 border border-gold/20">
                  {m.growth}
                </span>
                <TrendingUp className="w-4 h-4 text-platinum/40 group-hover:text-gold transition-colors" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-white mb-2">{m.value}</h3>
              <p className="text-sm font-medium text-platinum/90 mb-1">{m.label}</p>
              <p className="text-xs text-platinum/50 font-light">{m.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Strategic Pillars */}
      <section className="py-20 px-6 lg:px-16 max-w-7xl mx-auto border-t border-white/10 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono text-gold uppercase tracking-widest">Investment Thesis</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2">Built for Global Scale & High Margins</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((h, i) => (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="p-8 rounded-3xl bg-[#09090c]/80 border border-white/10 hover:border-gold/40 transition-all flex flex-col justify-between shadow-2xl"
            >
              <div>
                <span className="text-[10px] font-mono text-platinum/40 uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/5 inline-block mb-4">
                  {h.tag}
                </span>
                <h3 className="text-xl font-serif font-bold text-white mb-3">{h.title}</h3>
                <p className="text-sm text-platinum/70 font-light leading-relaxed">{h.description}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-gold text-xs font-mono gap-1">
                <span>Enterprise Grade</span>
                <ShieldCheck className="w-3.5 h-3.5 ml-auto" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Data Room / Deck Access */}
      <section className="py-20 px-6 lg:px-16 max-w-5xl mx-auto">
        <div className="p-10 rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-gold/30 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gold/5 blur-3xl pointer-events-none" />
          <Award className="w-12 h-12 text-gold mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3">Institutional Investor Data Room</h2>
          <p className="text-platinum/70 text-sm max-w-xl mx-auto mb-8 font-light">
            Accredited funds and sovereign wealth entities may request authenticated access to our Series B Confidential Information Memorandum (CIM) and audited financials.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:investors@skyluxe.aero?subject=Request%20Confidential%20Data%20Room%20Access"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-black font-bold text-sm tracking-wide hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all cursor-pointer"
            >
              Request Data Room Access
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
