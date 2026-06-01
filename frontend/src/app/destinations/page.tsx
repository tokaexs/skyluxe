"use client";

import { motion } from "framer-motion";
import GlassNavbar from "@/components/ui/GlassNavbar";
import { ArrowRight, MapPin, CloudSun, Compass, ShieldCheck } from "lucide-react";
import Link from "next/link";

const destinations = [
  {
    id: "dubai",
    name: "Dubai, UAE",
    airport: "Al Maktoum Int'l (DWC)",
    weather: "Sunny • 34°C",
    desc: "Seamless VIP clearances, Palm Helipads, and reserved deep-water yacht berths.",
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200"
  },
  {
    id: "maldives",
    name: "Malé, Maldives",
    airport: "Velana Int'l (MLE)",
    weather: "Tropical • 29°C",
    desc: "Private seaplane transfers, exclusive island resort docks, and overwater lounges.",
    img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1200"
  },
  {
    id: "london",
    name: "London, UK",
    airport: "Farnborough FBO (FAB)",
    weather: "Partly Cloudy • 18°C",
    desc: "Dedicated VIP immigration gateways, chauffeured transfer corridors, and Mayfair clubs.",
    img: "https://images.unsplash.com/photo-1513635269975-5969336ac1cb?q=80&w=1200"
  },
  {
    id: "tokyo",
    name: "Tokyo, Japan",
    airport: "Haneda VIP (HND)",
    weather: "Clear • 22°C",
    desc: "Zero-delay clearance, executive helicopter helipads, and Michelin-star partnerships.",
    img: "https://images.unsplash.com/photo-1356762351504-03099e0a754b?q=80&w=1200"
  },
  {
    id: "geneva",
    name: "Geneva, Switzerland",
    airport: "Geneva Cointrin (GVA)",
    weather: "Cool • 15°C",
    desc: "Private banking hub transfers, Swiss Alps helicopter shuttles, and luxury chalets.",
    img: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1200"
  }
];

export default function Destinations() {
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
            Elite <span className="text-gold">Destinations</span>
          </h1>
          <p className="text-xl text-platinum/70 font-light leading-relaxed max-w-2xl mx-auto">
            Discover the hubs of private wealth and luxury, backed by pre-cleared routes and FBO terminal logistics.
          </p>
        </motion.div>
      </section>

      {/* Destination Grid */}
      <section className="py-12 px-6 lg:px-16 max-w-7xl mx-auto w-full relative z-10 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest, idx) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-gold/30 transition-all duration-500 flex flex-col group"
            >
              <div className="h-64 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-transparent z-10" />
                <img src={dest.img} alt={dest.name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5 z-20">
                  <CloudSun className="w-4 h-4 text-gold" />
                  <span className="text-[10px] text-white font-mono">{dest.weather}</span>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">{dest.name}</h3>
                  <p className="text-xs text-gold font-mono tracking-widest uppercase mb-4 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {dest.airport}
                  </p>
                  <p className="text-sm font-light text-platinum/70 leading-relaxed mb-6">{dest.desc}</p>
                </div>
                
                <Link href="/fleet" className="w-full">
                  <button className="w-full py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-gold hover:text-onyx hover:border-gold font-bold transition-all duration-300 flex items-center justify-center gap-2">
                    Chart Fleet Operations <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
