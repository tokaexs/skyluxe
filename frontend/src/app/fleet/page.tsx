"use client";

import { motion } from "framer-motion";
import GlassNavbar from "@/components/ui/GlassNavbar";
import { ArrowRight, Plane, Users, Zap, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import AtmosphericGlobe from "@/components/3d/AtmosphericGlobe";
import dynamic from "next/dynamic";

const RealisticJetModel = dynamic(() => import("@/components/3d/RealisticJetModel"), {
  ssr: false,
  loading: () => null
});
import { Canvas } from "@react-three/fiber";

const privateJets = [
  {
    id: "gulfstream-g700",
    name: "Gulfstream G700",
    class: "Ultra Long Range",
    passengers: 19,
    range: "7,500 nm",
    speed: "Mach 0.925",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1500&auto=format&fit=crop"
  },
  {
    id: "global-7500",
    name: "Bombardier Global 7500",
    class: "Ultra Long Range",
    passengers: 19,
    range: "7,700 nm",
    speed: "Mach 0.925",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1500&auto=format&fit=crop"
  },
  {
    id: "falcon-8x",
    name: "Dassault Falcon 8X",
    class: "Heavy Jet",
    passengers: 14,
    range: "6,450 nm",
    speed: "Mach 0.90",
    image: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=1500&auto=format&fit=crop"
  },
  {
    id: "challenger-650",
    name: "Bombardier Challenger 650",
    class: "Super Midsize",
    passengers: 12,
    range: "4,000 nm",
    speed: "Mach 0.85",
    image: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=1500&auto=format&fit=crop"
  },
  {
    id: "praetor-600",
    name: "Embraer Praetor 600",
    class: "Super Midsize",
    passengers: 9,
    range: "4,018 nm",
    speed: "Mach 0.83",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1500&auto=format&fit=crop"
  },
  {
    id: "boeing-bbj",
    name: "Boeing Business Jet (BBJ)",
    class: "VIP Airliner",
    passengers: 25,
    range: "6,000 nm",
    speed: "Mach 0.82",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1500&auto=format&fit=crop"
  }
];

export default function FleetShowcase() {
  return (
    <main className="relative min-h-screen bg-[#020202] flex flex-col overflow-x-hidden">
      <GlassNavbar />

      {/* Cinematic Hero */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-auto z-0">
          <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 4, 15], fov: 45 }}>
            <RealisticJetModel />
          </Canvas>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020202]/50 to-[#020202] pointer-events-none" />
        </div>

        <div className="relative z-10 text-center px-6 pointer-events-none mt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-2xl">
              The SkyLuxe <span className="text-gold">Fleet</span>
            </h1>
            <p className="text-xl text-platinum/70 font-light max-w-2xl mx-auto leading-relaxed">
              Explore our curated selection of ultra-long-range jets, heavy jets, and VIP airliners for charter.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Jet Marketplace */}
      <section className="relative z-10 py-12 px-6 lg:px-16 max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {privateJets.map((jet, idx) => (
            <motion.div 
              key={jet.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="glass-panel rounded-3xl border border-white/10 overflow-hidden group hover:border-gold/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-transparent z-10" />
                <img 
                  src={jet.image} 
                  alt={jet.name} 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 mix-blend-luminosity group-hover:mix-blend-normal" 
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-gold uppercase tracking-widest">
                    {jet.class}
                  </span>
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-serif font-bold text-white mb-4">{jet.name}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-gold" />
                    <span className="text-sm text-platinum/70">{jet.passengers} Pax</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-gold" />
                    <span className="text-sm text-platinum/70">{jet.range}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-gold" />
                    <span className="text-sm text-platinum/70">{jet.speed}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Plane className="w-4 h-4 text-gold" />
                    <span className="text-sm text-platinum/70">Wifi & Catering</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <Link href={`/fleet/${jet.id}`}>
                    <button className="w-full py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-gold hover:text-onyx hover:border-gold font-bold transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                      Explore & Configure <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </main>
  );
}
