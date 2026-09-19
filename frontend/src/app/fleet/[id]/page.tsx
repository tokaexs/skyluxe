"use client";

import { motion } from "framer-motion";
import GlassNavbar from "@/components/ui/GlassNavbar";
import { ArrowRight, Plane, Users, Zap, ShieldCheck, Plus, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSkyLuxeStore } from "@/store/skyluxeStore";
import LuxuryDatePicker from "@/components/ui/LuxuryDatePicker";

const jetDatabase: Record<string, any> = {
  "gulfstream-g700": { name: "Gulfstream G700", class: "Ultra Long Range", pax: 19, range: "7,500 nm", speed: "Mach 0.925", hourlyRate: 14000, img: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2500" },
  "global-7500": { name: "Bombardier Global 7500", class: "Ultra Long Range", pax: 19, range: "7,700 nm", speed: "Mach 0.925", hourlyRate: 15000, img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2500" },
  "falcon-8x": { name: "Dassault Falcon 8X", class: "Heavy Jet", pax: 14, range: "6,450 nm", speed: "Mach 0.90", hourlyRate: 11000, img: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=2500" },
  "challenger-650": { name: "Bombardier Challenger 650", class: "Super Midsize", pax: 12, range: "4,000 nm", speed: "Mach 0.85", hourlyRate: 8500, img: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=2500" },
  "praetor-600": { name: "Embraer Praetor 600", class: "Super Midsize", pax: 9, range: "4,018 nm", speed: "Mach 0.83", hourlyRate: 7500, img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2500" },
  "boeing-bbj": { name: "Boeing Business Jet", class: "VIP Airliner", pax: 25, range: "6,000 nm", speed: "Mach 0.82", hourlyRate: 20000, img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2500" },
};

export default function JetConfiguration() {
  const params = useParams();
  const router = useRouter();
  const { formatAmount } = useSkyLuxeStore();
  const id = typeof params.id === 'string' ? params.id : 'gulfstream-g700';
  const jet = jetDatabase[id] || jetDatabase["gulfstream-g700"];

  const [legs, setLegs] = useState([{ from: "BOM", to: "DWC", date: "2026-06-04" }]);
  const [catering, setCatering] = useState("Standard VIP Catering");
  const [chauffeur, setChauffeur] = useState("No Transport Required");
  const [security, setSecurity] = useState("Standard Terminal Security");
  const [passengers, setPassengers] = useState(3);
  const [price, setPrice] = useState(0);

  // Recalculate price dynamically when configuration parameters alter
  useEffect(() => {
    const hoursPerLeg = 3.5;
    const baseJetCost = legs.length * hoursPerLeg * jet.hourlyRate;
    
    let optionsCost = 0;
    if (catering.includes("Michelin")) optionsCost += 1500;
    if (catering.includes("Caviar")) optionsCost += 3000;
    
    if (chauffeur.includes("Maybach")) optionsCost += 800;
    if (chauffeur.includes("Helicopter")) optionsCost += 2500;
    
    if (security.includes("Executive")) optionsCost += 1200;

    setPrice(baseJetCost + optionsCost);
  }, [legs, catering, chauffeur, security, jet]);

  const addLeg = () => {
    if (legs.length < 6) {
      setLegs([...legs, { from: "", to: "", date: "" }]);
    }
  };

  const removeLeg = (index: number) => {
    if (legs.length > 1) {
      setLegs(legs.filter((_, i) => i !== index));
    }
  };

  const handleLegChange = (index: number, field: string, value: string) => {
    const updatedLegs = legs.map((leg, i) => {
      if (i === index) {
        return { ...leg, [field]: value };
      }
      return leg;
    });
    setLegs(updatedLegs);
  };

  const handleBookRequest = () => {
    const legsStr = encodeURIComponent(JSON.stringify(legs));
    router.push(`/checkout?type=private&id=${id}&legs=${legsStr}&catering=${encodeURIComponent(catering)}&chauffeur=${encodeURIComponent(chauffeur)}&security=${encodeURIComponent(security)}&passengers=${passengers}&price=${price}`);
  };

  return (
    <main className="relative min-h-screen bg-onyx flex flex-col">
      <GlassNavbar />

      {/* Cinematic Header */}
      <section className="relative min-h-[50vh] flex items-end pb-12 sm:pb-16 px-4 sm:px-6 lg:px-16 pt-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-onyx/50 to-onyx z-10" />
          <img src={jet.img} alt={jet.name} className="w-full h-full object-cover opacity-70" />
        </div>

        <div className="relative z-20 w-full max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="px-3 py-1 rounded-full bg-gold/20 border border-gold/30 text-[10px] text-gold uppercase tracking-widest mb-4 inline-block font-mono">
              {jet.class}
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif font-bold text-white mb-4 sm:mb-6 drop-shadow-2xl">
              {jet.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur px-3 sm:px-4 py-2 rounded-xl border border-white/10 text-xs sm:text-sm">
                <Users className="w-4 h-4 text-gold" /> <span className="text-white">{jet.pax} Passengers</span>
              </div>
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur px-3 sm:px-4 py-2 rounded-xl border border-white/10 text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-gold" /> <span className="text-white">{jet.range} Range</span>
              </div>
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur px-3 sm:px-4 py-2 rounded-xl border border-white/10 text-xs sm:text-sm">
                <Zap className="w-4 h-4 text-gold" /> <span className="text-white">{jet.speed} Top Cruise</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Advanced Booking Configuration */}
      <section className="relative z-20 py-8 sm:py-12 px-4 sm:px-6 lg:px-16 max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Flight Operations Form */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-panel p-5 sm:p-8 rounded-3xl border border-white/10">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mb-6">Flight Itinerary</h2>
              
              <div className="space-y-4">
                {legs.map((leg, index) => (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    key={index} 
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 items-end"
                  >
                    <div className="md:col-span-3">
                      <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1 block font-mono">Departure {index + 1}</label>
                      <input 
                        type="text" 
                        required
                        value={leg.from}
                        onChange={(e) => handleLegChange(index, "from", e.target.value)}
                        placeholder="City or ICAO (e.g. BOM)" 
                        className="w-full bg-transparent border-b border-white/20 pb-2 text-white placeholder-platinum/30 focus:outline-none focus:border-gold transition-colors font-light" 
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1 block font-mono">Destination {index + 1}</label>
                      <input 
                        type="text" 
                        required
                        value={leg.to}
                        onChange={(e) => handleLegChange(index, "to", e.target.value)}
                        placeholder="City or ICAO (e.g. DWC)" 
                        className="w-full bg-transparent border-b border-white/20 pb-2 text-white placeholder-platinum/30 focus:outline-none focus:border-gold transition-colors font-light" 
                      />
                    </div>
                    <div className="md:col-span-5">
                      <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1 block font-mono">Flight Date</label>
                      <LuxuryDatePicker 
                        value={leg.date}
                        onChange={(newDate) => handleLegChange(index, "date", newDate)}
                      />
                    </div>
                    <div className="md:col-span-1 flex justify-center pb-1">
                      {legs.length > 1 && (
                        <button type="button" onClick={() => removeLeg(index)} className="p-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {legs.length < 6 && (
                <button onClick={addLeg} className="mt-6 flex items-center gap-2 text-gold text-sm hover:text-gold-light transition-colors font-medium">
                  <Plus className="w-4 h-4" /> Add Destination Leg
                </button>
              )}
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/10">
              <h2 className="text-2xl font-serif font-bold text-white mb-6">Concierge & Lifestyle Preferences</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block font-mono">In-Flight Catering</label>
                  <select 
                    value={catering}
                    onChange={(e) => setCatering(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-gold/50 transition-colors appearance-none font-light outline-none [&>option]:bg-onyx [&>option]:text-white"
                  >
                    <option value="Standard VIP Catering" className="bg-zinc-900 text-white">Standard VIP Catering</option>
                    <option value="Michelin-Grade Fine Dining" className="bg-zinc-900 text-white">Michelin-Grade Fine Dining (+{formatAmount(1500)})</option>
                    <option value="Caviar & Champagne Tier" className="bg-zinc-900 text-white">Caviar & Champagne Tier (+{formatAmount(3000)})</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block font-mono">Ground Transportation</label>
                  <select 
                    value={chauffeur}
                    onChange={(e) => setChauffeur(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-gold/50 transition-colors appearance-none font-light outline-none [&>option]:bg-onyx [&>option]:text-white"
                  >
                    <option value="No Transport Required" className="bg-zinc-900 text-white">No Transport Required</option>
                    <option value="Maybach S-Class Chauffeur" className="bg-zinc-900 text-white">Maybach S-Class Chauffeur (+{formatAmount(800)})</option>
                    <option value="Helicopter Terminal Transfer" className="bg-zinc-900 text-white">Helicopter Terminal Transfer (+{formatAmount(2500)})</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block font-mono">Security Detail</label>
                  <select 
                    value={security}
                    onChange={(e) => setSecurity(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-gold/50 transition-colors appearance-none font-light outline-none [&>option]:bg-onyx [&>option]:text-white"
                  >
                    <option value="Standard Terminal Security" className="bg-zinc-900 text-white">Standard Terminal Security</option>
                    <option value="Executive Protection Officer" className="bg-zinc-900 text-white">Executive Protection Officer (+{formatAmount(1200)})</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block font-mono">Passenger Count</label>
                  <select 
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-gold/50 transition-colors appearance-none font-light outline-none"
                  >
                    {Array.from({ length: jet.pax }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} Pax</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Summary Panel */}
          <div className="lg:col-span-4">
            <div className="glass-panel p-8 rounded-3xl border border-gold/30 bg-gold/5 sticky top-32 shadow-[0_0_50px_rgba(212,175,55,0.05)]">
              <h3 className="text-xl font-serif font-bold text-white mb-6">Mission Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-platinum/60">Aircraft</span>
                  <span className="text-white font-medium">{jet.name}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-platinum/60">Total Legs</span>
                  <span className="text-white font-medium">{legs.length} Route(s)</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-platinum/60">Est. Flight Time</span>
                  <span className="text-white font-medium">{legs.length * 3.5} Hours</span>
                </div>
                <div className="w-full h-px bg-white/10 my-4" />
                <div className="flex justify-between items-center">
                  <span className="text-platinum/80">Estimated Price</span>
                  <span className="text-2xl font-bold text-gold">{formatAmount(price)}</span>
                </div>
                <p className="text-[10px] text-platinum/40 font-light mt-1 text-right font-mono">
                  Includes landing fees, fuel surcharges, and selected upgrades.
                </p>
              </div>

              <button 
                onClick={handleBookRequest}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-gold to-gold-light text-onyx font-bold text-lg hover:-translate-y-1 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2"
              >
                Request Secure Checkout <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
