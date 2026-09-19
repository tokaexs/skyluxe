"use client";

import { motion } from "framer-motion";
import GlassNavbar from "@/components/ui/GlassNavbar";
import { ArrowRight, Plane, MapPin, Calendar, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LuxuryDatePicker from "@/components/ui/LuxuryDatePicker";

export default function CommercialSearch() {
  const router = useRouter();
  const [tripType, setTripType] = useState("one-way");
  const [fromCity, setFromCity] = useState("Mumbai (BOM)");
  const [toCity, setToCity] = useState("Dubai (DXB)");
  const [date, setDate] = useState("2026-06-04");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const fromCode = fromCity.match(/\(([^)]+)\)/)?.[1] || "BOM";
    const toCode = toCity.match(/\(([^)]+)\)/)?.[1] || "DXB";
    router.push(`/flights/search?from=${fromCode}&to=${toCode}&date=${date}&type=${tripType}`);
  };

  return (
    <main className="relative min-h-screen bg-[#020202] flex flex-col overflow-x-hidden">
      <GlassNavbar />

      {/* Cinematic Hero */}
      <section className="relative min-h-[85vh] py-24 sm:py-32 flex items-center justify-center px-4 sm:px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020202]/50 to-[#020202] z-10" />
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2500&auto=format&fit=crop" 
            alt="Commercial Aviation" 
            className="w-full h-full object-cover opacity-50" 
          />
        </div>

        <div className="relative z-20 max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12"
          >
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] text-platinum uppercase tracking-widest mb-4 inline-block backdrop-blur-sm">
              Global Commercial Aviation
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white mb-4 sm:mb-6 drop-shadow-2xl">
              Elevate Your <span className="text-gold">Journey.</span>
            </h1>
            <p className="text-base sm:text-xl text-platinum/80 font-light max-w-2xl mx-auto leading-relaxed">
              Book premium economy, business, and first-class tickets across India's leading commercial airlines.
            </p>
          </motion.div>

          {/* Premium Search Engine */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-panel p-4 sm:p-6 md:p-8 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-xl bg-onyx/80 max-w-4xl mx-auto"
          >
            <form onSubmit={handleSearch}>
              {/* Toggle */}
              <div className="flex flex-wrap gap-4 sm:gap-6 mb-6 border-b border-white/10 pb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="tripType" 
                    checked={tripType === "one-way"} 
                    onChange={() => setTripType("one-way")}
                    className="accent-gold" 
                  />
                  <span className={`text-sm font-medium ${tripType === "one-way" ? "text-gold" : "text-white"}`}>One Way</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="tripType" 
                    checked={tripType === "round-trip"} 
                    onChange={() => setTripType("round-trip")}
                    className="accent-gold" 
                  />
                  <span className={`text-sm font-medium ${tripType === "round-trip" ? "text-gold" : "text-white"}`}>Round Trip</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="tripType" 
                    checked={tripType === "multi-city"} 
                    onChange={() => setTripType("multi-city")}
                    className="accent-gold" 
                  />
                  <span className={`text-sm font-medium ${tripType === "multi-city" ? "text-gold" : "text-white"}`}>Multi-City</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-3">
                  <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gold" /> From
                  </label>
                  <select 
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-gold/50 focus:outline-none transition-colors font-medium text-sm appearance-none"
                  >
                    <option value="Mumbai (BOM)">Mumbai (BOM)</option>
                    <option value="Delhi (DEL)">Delhi (DEL)</option>
                    <option value="Bengaluru (BLR)">Bengaluru (BLR)</option>
                    <option value="London (LHR)">London (LHR)</option>
                    <option value="Dubai (DXB)">Dubai (DXB)</option>
                  </select>
                </div>
                <div className="hidden md:flex md:col-span-1 items-center justify-center pb-4 text-platinum/30">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <div className="md:col-span-3">
                  <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gold" /> To
                  </label>
                  <select 
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-gold/50 focus:outline-none transition-colors font-medium text-sm appearance-none"
                  >
                    <option value="Dubai (DXB)">Dubai (DXB)</option>
                    <option value="London (LHR)">London (LHR)</option>
                    <option value="Mumbai (BOM)">Mumbai (BOM)</option>
                    <option value="Delhi (DEL)">Delhi (DEL)</option>
                    <option value="Bengaluru (BLR)">Bengaluru (BLR)</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-2 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-gold" /> Flight Date
                  </label>
                  <LuxuryDatePicker 
                    value={date} 
                    onChange={(newDate) => setDate(newDate)} 
                  />
                </div>
                <div className="md:col-span-2 flex items-end">
                  <button type="submit" className="w-full h-[54px] rounded-xl bg-gradient-to-r from-gold to-gold-light text-onyx font-bold text-base hover:-translate-y-0.5 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 cursor-pointer">
                    <Search className="w-4 h-4" /> Search Flights
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Featured Airlines */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto w-full relative z-10">
        <h2 className="text-xs sm:text-sm text-platinum/50 uppercase tracking-widest mb-8 sm:mb-10 text-center font-mono">Our Commercial Partners</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 items-center justify-items-center opacity-70">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Air_India_Logo.svg/1200px-Air_India_Logo.svg.png" alt="Air India" className="h-8 object-contain filter grayscale hover:grayscale-0 transition-all cursor-pointer" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IndiGo_Airlines_logo.svg/1200px-IndiGo_Airlines_logo.svg.png" alt="IndiGo" className="h-8 object-contain filter grayscale hover:grayscale-0 transition-all cursor-pointer" />
          <img src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Vistara_Logo.svg/1200px-Vistara_Logo.svg.png" alt="Vistara" className="h-8 object-contain filter grayscale hover:grayscale-0 transition-all cursor-pointer" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/1200px-AirAsia_New_Logo.svg.png" alt="AirAsia" className="h-8 object-contain filter grayscale hover:grayscale-0 transition-all cursor-pointer" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/SpiceJet_logo.svg/1200px-SpiceJet_logo.svg.png" alt="SpiceJet" className="h-8 object-contain filter grayscale hover:grayscale-0 transition-all cursor-pointer" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Akasa_Air_logo.svg/1200px-Akasa_Air_logo.svg.png" alt="Akasa Air" className="h-8 object-contain filter grayscale hover:grayscale-0 transition-all cursor-pointer" />
        </div>
      </section>

    </main>
  );
}
