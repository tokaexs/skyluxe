"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plane, Users, Navigation, DollarSign, Sparkles, 
  ShieldCheck, Zap, ArrowRight, ArrowLeft, RefreshCw, BarChart2 
} from "lucide-react";
import Link from "next/link";

interface JetSpec {
  id: string;
  name: string;
  class: string;
  passengers: number;
  range: string;
  speed: string;
  hourlyRate: number;
  description: string;
  img: string;
  matchScore: number;
}

const aircraftDatabase: Record<string, JetSpec> = {
  "gulfstream-g700": {
    id: "gulfstream-g700",
    name: "Gulfstream G700",
    class: "Ultra Long Range",
    passengers: 19,
    range: "7,500 nm",
    speed: "Mach 0.925",
    hourlyRate: 14000,
    description: "The peak of executive long-haul aviation, featuring an spacious cabin, advanced wings, and state-of-the-art air purification systems.",
    img: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800",
    matchScore: 98
  },
  "global-7500": {
    id: "global-7500",
    name: "Bombardier Global 7500",
    class: "Ultra Long Range",
    passengers: 19,
    range: "7,700 nm",
    speed: "Mach 0.925",
    hourlyRate: 15000,
    description: "The largest and longest-range business jet. Features four distinct living zones, a full kitchen, and crew suites.",
    img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800",
    matchScore: 95
  },
  "falcon-8x": {
    id: "falcon-8x",
    name: "Dassault Falcon 8X",
    class: "Heavy Jet",
    passengers: 14,
    range: "6,450 nm",
    speed: "Mach 0.90",
    hourlyRate: 11000,
    description: "Known for short-field landing capabilities and fuel efficiency. Excellent for landing at restrictive FBO locations.",
    img: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=800",
    matchScore: 91
  },
  "challenger-650": {
    id: "challenger-650",
    name: "Bombardier Challenger 650",
    class: "Super Midsize",
    passengers: 12,
    range: "4,000 nm",
    speed: "Mach 0.85",
    hourlyRate: 8500,
    description: "An industry workhorse offering top reliability and a wider cabin for enhanced in-flight meetings.",
    img: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=800",
    matchScore: 88
  },
  "praetor-600": {
    id: "praetor-600",
    name: "Embraer Praetor 600",
    class: "Super Midsize",
    passengers: 9,
    range: "4,018 nm",
    speed: "Mach 0.83",
    hourlyRate: 7500,
    description: "Highly advanced fly-by-wire controls. Ideal for mid-range intercontinental hops with supreme active turbulence reduction.",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
    matchScore: 84
  },
  "boeing-bbj": {
    id: "boeing-bbj",
    name: "Boeing Business Jet",
    class: "VIP Airliner",
    passengers: 25,
    range: "6,000 nm",
    speed: "Mach 0.82",
    hourlyRate: 20000,
    description: "A commercial airliner converted into a penthouse suite. Includes luxury dining rooms, master bedrooms, and showers.",
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800",
    matchScore: 92
  }
};

export default function AircraftAdvisor() {
  const [step, setStep] = useState(1);
  const [paxGroup, setPaxGroup] = useState<number | null>(null);
  const [rangeGroup, setRangeGroup] = useState<string | null>(null);
  const [budgetGroup, setBudgetGroup] = useState<string | null>(null);
  const [purposeGroup, setPurposeGroup] = useState<string | null>(null);

  const [recommendations, setRecommendations] = useState<JetSpec[]>([]);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Calculate matches
      let matches: JetSpec[] = [];
      
      if (paxGroup === 19) {
        matches = [
          aircraftDatabase["gulfstream-g700"],
          aircraftDatabase["global-7500"],
          aircraftDatabase["boeing-bbj"]
        ];
      } else if (paxGroup === 12) {
        matches = [
          aircraftDatabase["falcon-8x"],
          aircraftDatabase["challenger-650"],
          aircraftDatabase["praetor-600"]
        ];
      } else {
        matches = [
          aircraftDatabase["praetor-600"],
          aircraftDatabase["challenger-650"],
          aircraftDatabase["falcon-8x"]
        ];
      }

      setRecommendations(matches);
      setStep(5);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const resetAdvisor = () => {
    setStep(1);
    setPaxGroup(null);
    setRangeGroup(null);
    setBudgetGroup(null);
    setPurposeGroup(null);
    setRecommendations([]);
  };

  return (
    <div className="p-8 space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white mb-2">Aircraft Fleet Advisor</h1>
        <p className="text-platinum/50 font-light text-sm">
          Describe your corporate missions or personal trips, and the SkyLuxe intelligence advisor will model the ideal aircraft configuration.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {step <= 4 ? (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="glass-panel p-10 rounded-3xl border border-white/10 bg-onyx flex flex-col justify-between min-h-[400px]"
            >
              {/* Progress Indicator */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] text-gold font-mono uppercase tracking-[0.2em]">Step {step} of 4</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className={`h-1 w-8 rounded-full transition-all duration-300 ${
                        i <= step ? "bg-gold" : "bg-white/10"
                      }`} 
                    />
                  ))}
                </div>
              </div>

              {/* Step Contents */}
              <div className="flex-1 flex flex-col justify-center">
                {step === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-serif text-white font-medium text-center">How many passengers are expected?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: "Light Travel (1 - 4 pax)", value: 4, desc: "Sleek midsize cabins" },
                        { label: "Medium Group (5 - 12 pax)", value: 12, desc: "Spacious heavy jets" },
                        { label: "Large delegation (13 - 19+ pax)", value: 19, desc: "VIP airliners and ultra long range" }
                      ].map((item) => (
                        <button
                          key={item.value}
                          onClick={() => setPaxGroup(item.value)}
                          className={`p-6 rounded-2xl border text-left transition-all duration-200 ${
                            paxGroup === item.value 
                              ? "bg-gold/10 border-gold shadow-[0_0_20px_rgba(212,175,55,0.1)]" 
                              : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                          }`}
                        >
                          <Users className={`w-6 h-6 mb-3 ${paxGroup === item.value ? "text-gold" : "text-platinum/40"}`} />
                          <p className="text-white font-medium text-sm">{item.label}</p>
                          <p className="text-platinum/50 text-xs mt-1 font-light">{item.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-serif text-white font-medium text-center">What is the estimated flight distance?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: "Short Hop (under 2,000 nm)", value: "short", desc: "Regional domestic charters" },
                        { label: "Continental (2,000 - 5,000 nm)", value: "mid", desc: "Cross-country and regional flights" },
                        { label: "Intercontinental (5,000+ nm)", value: "long", desc: "Ultra-long range luxury flights" }
                      ].map((item) => (
                        <button
                          key={item.value}
                          onClick={() => setRangeGroup(item.value)}
                          className={`p-6 rounded-2xl border text-left transition-all duration-200 ${
                            rangeGroup === item.value 
                              ? "bg-gold/10 border-gold shadow-[0_0_20px_rgba(212,175,55,0.1)]" 
                              : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                          }`}
                        >
                          <Navigation className={`w-6 h-6 mb-3 ${rangeGroup === item.value ? "text-gold" : "text-platinum/40"}`} />
                          <p className="text-white font-medium text-sm">{item.label}</p>
                          <p className="text-platinum/50 text-xs mt-1 font-light">{item.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-serif text-white font-medium text-center">Select target hourly budget rate</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: "Standard Executive ($5k - $9k/hr)", value: "standard", desc: "Comfortable and dependable" },
                        { label: "Premium Heavy ($10k - $15k/hr)", value: "premium", desc: "Flagship luxury experience" },
                        { label: "Presidential VIP ($16k+/hr)", value: "vip", desc: "Penthouse size & VVIP service" }
                      ].map((item) => (
                        <button
                          key={item.value}
                          onClick={() => setBudgetGroup(item.value)}
                          className={`p-6 rounded-2xl border text-left transition-all duration-200 ${
                            budgetGroup === item.value 
                              ? "bg-gold/10 border-gold shadow-[0_0_20px_rgba(212,175,55,0.1)]" 
                              : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                          }`}
                        >
                          <DollarSign className={`w-6 h-6 mb-3 ${budgetGroup === item.value ? "text-gold" : "text-platinum/40"}`} />
                          <p className="text-white font-medium text-sm">{item.label}</p>
                          <p className="text-platinum/50 text-xs mt-1 font-light">{item.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-serif text-white font-medium text-center">What is the nature of the trip?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: "Corporate Mission", value: "corp", desc: "In-flight meetings, global connectivity" },
                        { label: "Leisure Escape", value: "leisure", desc: "Bedrooms, relaxation, family travel" },
                        { label: "Diplomatic Delegation", value: "diplomatic", desc: "Supreme security and guest accommodations" }
                      ].map((item) => (
                        <button
                          key={item.value}
                          onClick={() => setPurposeGroup(item.value)}
                          className={`p-6 rounded-2xl border text-left transition-all duration-200 ${
                            purposeGroup === item.value 
                              ? "bg-gold/10 border-gold shadow-[0_0_20px_rgba(212,175,55,0.1)]" 
                              : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                          }`}
                        >
                          <Sparkles className={`w-6 h-6 mb-3 ${purposeGroup === item.value ? "text-gold" : "text-platinum/40"}`} />
                          <p className="text-white font-medium text-sm">{item.label}</p>
                          <p className="text-platinum/50 text-xs mt-1 font-light">{item.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div className="mt-12 pt-6 border-t border-white/5 flex justify-between items-center">
                <button
                  onClick={handleBack}
                  disabled={step === 1}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-platinum/50 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !paxGroup) ||
                    (step === 2 && !rangeGroup) ||
                    (step === 3 && !budgetGroup) ||
                    (step === 4 && !purposeGroup)
                  }
                  className="px-6 py-2.5 rounded-xl bg-gold text-onyx font-bold hover:bg-gold-light transition-colors text-xs flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {step === 4 ? "Analyze Profile" : "Continue"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Primary Recommended Jet */}
              {recommendations.length > 0 && (
                <div className="glass-panel rounded-3xl border border-gold/20 overflow-hidden bg-onyx shadow-[0_0_50px_rgba(212,175,55,0.05)] grid grid-cols-1 md:grid-cols-12">
                  <div className="md:col-span-5 relative min-h-[300px]">
                    <img 
                      src={recommendations[0].img} 
                      alt={recommendations[0].name} 
                      className="absolute inset-0 w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#090909]/40 to-[#090909] hidden md:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent md:hidden" />
                  </div>
                  <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-[10px] text-gold uppercase tracking-widest font-mono">
                          {recommendations[0].class}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-green-400 font-mono">
                          <ShieldCheck className="w-4 h-4" /> {recommendations[0].matchScore}% Match
                        </div>
                      </div>

                      <h2 className="text-3xl font-serif font-bold text-white mb-2">{recommendations[0].name}</h2>
                      <p className="text-platinum/50 text-xs font-mono mb-4">Charter Rate: ${recommendations[0].hourlyRate.toLocaleString()} / Hour</p>
                      
                      <p className="text-white font-light text-sm leading-relaxed mb-6">
                        {recommendations[0].description}
                      </p>

                      <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
                        <div>
                          <p className="text-[10px] text-platinum/40 uppercase tracking-widest font-mono">Capacity</p>
                          <p className="text-white font-medium mt-0.5">{recommendations[0].passengers} Passengers</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-platinum/40 uppercase tracking-widest font-mono">Range</p>
                          <p className="text-white font-medium mt-0.5">{recommendations[0].range}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-platinum/40 uppercase tracking-widest font-mono">Max Speed</p>
                          <p className="text-white font-medium mt-0.5">{recommendations[0].speed}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                      <Link href={`/fleet/${recommendations[0].id}`} className="flex-1">
                        <button className="w-full py-3.5 rounded-xl bg-gold text-onyx font-bold hover:bg-gold-light transition-colors text-sm flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                          Configure & Book <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                      <button 
                        onClick={resetAdvisor}
                        className="px-5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-platinum/60 hover:text-white"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Comparison Section */}
              <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-onyx/40">
                <h3 className="text-lg font-serif font-bold text-white mb-6 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-gold" /> Fleet Matching Grid
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-platinum/50 text-[10px] uppercase tracking-widest font-mono">
                        <th className="pb-3">Aircraft</th>
                        <th className="pb-3">Class</th>
                        <th className="pb-3">Range</th>
                        <th className="pb-3">Capacity</th>
                        <th className="pb-3">Hourly Rate</th>
                        <th className="pb-3">Match</th>
                        <th className="pb-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {recommendations.map((jet) => (
                        <tr key={jet.id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 text-white font-medium">{jet.name}</td>
                          <td className="py-4 text-platinum/60 font-light">{jet.class}</td>
                          <td className="py-4 text-white font-mono">{jet.range}</td>
                          <td className="py-4 text-platinum/60">{jet.passengers} Pax</td>
                          <td className="py-4 text-white font-mono">${jet.hourlyRate.toLocaleString()}/hr</td>
                          <td className="py-4 text-gold font-mono font-medium">{jet.matchScore}%</td>
                          <td className="py-4 text-right">
                            <Link href={`/fleet/${jet.id}`}>
                              <button className="text-xs text-gold hover:text-white transition-colors font-medium flex items-center gap-0.5 ml-auto">
                                View <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
