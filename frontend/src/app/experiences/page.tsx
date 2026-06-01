"use client";

import { motion } from "framer-motion";
import GlassNavbar from "@/components/ui/GlassNavbar";
import { ArrowRight, Star, Heart, Compass, ShieldCheck } from "lucide-react";
import Link from "next/link";

const experiences = [
  {
    id: "yacht-monaco",
    name: "Monaco Superyacht Charter",
    location: "Montec Carlo, Monaco",
    category: "Yachting",
    price: "$45,000 / week",
    desc: "Charter the custom 42m Benetti superyacht. Fully staffed with Michelin-trained chefs, scuba gear, and VIP tender transfers.",
    img: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=1200"
  },
  {
    id: "safari-kenya",
    name: "Private Helicopter Safari",
    location: "Maasai Mara, Kenya",
    category: "Adventure",
    price: "$18,500 / guest",
    desc: "Ascend over active volcanoes, land on isolated ridges, and enjoy luxury luxury lodge stays accessible only by private helicopter.",
    img: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1200"
  },
  {
    id: "island-bora",
    name: "Overwater Private Atoll",
    location: "Bora Bora, Polynesia",
    category: "Island Retreat",
    price: "$28,000 / night",
    desc: "Unrestricted access to a private motu with glass-floored suites, customized FBO clearances, and tailored diving operators.",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200"
  }
];

export default function Experiences() {
  return (
    <main className="relative min-h-screen bg-[#020202] flex flex-col overflow-x-hidden selection:bg-gold/30">
      <GlassNavbar />

      {/* Cinematic Hero */}
      <section className="relative pt-40 pb-20 px-6 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
            Elite <span className="text-gold">Experiences</span>
          </h1>
          <p className="text-xl text-platinum/70 font-light leading-relaxed max-w-2xl mx-auto">
            Curated travel masterpieces beyond aviation. Reserved exclusively for SkyLuxe elite members.
          </p>
        </motion.div>
      </section>

      {/* Experiences Grid */}
      <section className="py-12 px-6 lg:px-16 max-w-7xl mx-auto w-full relative z-10 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {experiences.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-gold/30 transition-all duration-500 flex flex-col group"
            >
              <div className="h-64 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-transparent z-10" />
                <img src={exp.img} alt={exp.name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute top-4 right-4 bg-gold/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gold/30 text-[10px] text-gold font-mono uppercase tracking-widest z-20">
                  {exp.category}
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">{exp.name}</h3>
                  <p className="text-xs text-platinum/50 font-mono tracking-widest uppercase mb-4 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-gold" /> {exp.location}
                  </p>
                  <p className="text-sm font-light text-platinum/70 leading-relaxed mb-6">{exp.desc}</p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                    <span className="text-platinum/50 text-xs font-mono uppercase">Costing Parameters</span>
                    <span className="text-gold font-bold text-lg font-serif">{exp.price}</span>
                  </div>
                  <Link href="/concierge" className="w-full">
                    <button className="w-full py-3.5 rounded-xl bg-gold text-onyx font-bold transition-all duration-300 flex items-center justify-center gap-2">
                      Inquire via AI Concierge <ArrowRight className="w-4 h-4" />
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
