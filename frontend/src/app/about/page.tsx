"use client";

import { motion } from "framer-motion";
import GlassNavbar from "@/components/ui/GlassNavbar";
import { ShieldCheck, Target, Globe, Award, Sparkles, TrendingUp } from "lucide-react";
import Image from "next/image";

export default function About() {
  return (
    <main className="relative min-h-screen bg-[#020202] flex flex-col overflow-x-hidden selection:bg-gold/30">
      <GlassNavbar />

      {/* Cinematic Hero */}
      <section className="relative h-screen flex items-center justify-center pt-24">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2500&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020202]/30 via-transparent to-[#020202]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-gold/10 rounded-full blur-[150px] mix-blend-screen" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/30 bg-gold/5 backdrop-blur-md mb-8">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-gold text-xs font-semibold tracking-wider uppercase">The SkyLuxe Vision</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-6 tracking-tight drop-shadow-2xl leading-[1.1]">
            Redefining <br/> Elite Global Aviation.
          </h1>
          <p className="text-xl md:text-2xl text-platinum/70 max-w-3xl mx-auto font-light leading-relaxed">
            We are not just a charter company. We are a billion-dollar technology ecosystem engineered to perfect the art of private travel.
          </p>
        </motion.div>
      </section>

      {/* The Story & Philosophy */}
      <section className="relative py-32 px-6 bg-onyx z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-sm text-gold uppercase tracking-widest font-semibold mb-4">Our Genesis</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8 leading-tight">Born from the relentless pursuit of perfection.</h3>
            <div className="space-y-6 text-platinum/70 font-light leading-relaxed text-lg">
              <p>
                SkyLuxe was founded on a singular premise: the private aviation industry was fragmented, antiquated, and lacking true technological intelligence. We set out to build the world's first AI-native aviation ecosystem.
              </p>
              <p>
                By combining an exclusive fleet of ultra-long-range jets with our proprietary Cortex AI infrastructure, we have eliminated the friction of global travel. We memorize your catering preferences, predict your route adjustments based on high-altitude weather patterns, and secure your airspace with end-to-end encryption.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative h-[600px] rounded-3xl overflow-hidden glass-panel border border-white/10"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1500&auto=format&fit=crop')] bg-cover bg-center opacity-80 mix-blend-luminosity" />
            <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-transparent" />
            <div className="absolute bottom-10 left-10 p-6 glass-panel-gold rounded-2xl max-w-sm backdrop-blur-2xl">
              <ShieldCheck className="w-8 h-8 text-gold mb-4" />
              <h4 className="text-white font-serif text-xl mb-2">Uncompromising Privacy</h4>
              <p className="text-platinum/80 text-sm font-light">Your identity, itinerary, and transactions are shielded by military-grade security protocols.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Global Statistics */}
      <section className="relative py-24 bg-[#020202] border-t border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2500&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-screen" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard value="300+" label="Aircraft In Fleet" />
          <StatCard value="142" label="Countries Reached" />
          <StatCard value="12,000+" label="Missions Executed" />
          <StatCard value="$2.4B" label="Asset Valuation" />
        </div>
      </section>

      {/* Leadership Team */}
      <section className="relative py-32 px-6 bg-onyx z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-sm text-gold uppercase tracking-widest font-semibold mb-4">The Architects</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-white">Leadership & Vision</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <LeaderCard 
              name="Julian Sterling" 
              role="Chief Executive Officer" 
              desc="Former aviation executive and tech visionary. Scaled SkyLuxe from a boutique firm to a global unicorn."
            />
            <LeaderCard 
              name="Dr. Elena Rostova" 
              role="Chief Intelligence Officer" 
              desc="Pioneer in predictive neural networks. Architect of the SkyLuxe Cortex AI Concierge system."
            />
            <LeaderCard 
              name="Marcus Vance" 
              role="Head of Global Operations" 
              desc="Veteran of elite private aviation. Oversees fleet logistics and Michelin-grade service standards."
            />
          </div>
        </div>
      </section>

      {/* Investor & Enterprise Vision */}
      <section className="relative py-32 px-6 bg-[#020202] z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-gold/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center">
          <TrendingUp className="w-12 h-12 text-gold mx-auto mb-8" />
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">Enterprise & Investor Relations</h2>
          <p className="text-xl text-platinum/70 font-light leading-relaxed mb-12">
            SkyLuxe is rapidly expanding its global infrastructure. We are continually integrating newer, greener, and faster ultra-long-range jets into our ecosystem, powered by highly scalable AI systems designed to capture the majority market share of the $35B luxury travel sector.
          </p>
          <button className="px-8 py-4 rounded-full bg-white text-onyx font-bold text-lg hover:bg-gold transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Download Investor Prospectus
          </button>
        </div>
      </section>
    </main>
  );
}

function StatCard({ value, label }: { value: string, label: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-panel p-8 rounded-3xl border border-white/5 text-center group"
    >
      <h4 className="text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold to-white mb-2">{value}</h4>
      <p className="text-platinum/50 text-sm uppercase tracking-widest font-medium group-hover:text-gold transition-colors">{label}</p>
    </motion.div>
  );
}

function LeaderCard({ name, role, desc }: { name: string, role: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="glass-panel rounded-3xl overflow-hidden border border-white/10 group"
    >
      <div className="h-80 bg-onyx-light relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-onyx to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-50 mix-blend-luminosity group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" />
      </div>
      <div className="p-8 relative z-20 bg-onyx">
        <h4 className="text-2xl font-serif font-bold text-white mb-1">{name}</h4>
        <p className="text-gold text-sm font-medium mb-4">{role}</p>
        <p className="text-platinum/60 font-light text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}
