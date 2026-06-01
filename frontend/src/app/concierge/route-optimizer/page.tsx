"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Navigation, Plane, Calendar, Users, Briefcase, DollarSign, 
  Wind, Sun, CloudRain, Zap, ArrowRight, Clock, Award, ShieldCheck 
} from "lucide-react";
import Link from "next/link";

interface RouteOption {
  id: string;
  name: string;
  type: "Fastest" | "Most Luxurious" | "Most Efficient";
  duration: string;
  cost: number;
  aircraft: string;
  operator: string;
  amenities: string[];
  weather: string;
  windSpeed: string;
  bookingUrl: string;
}

export default function RouteOptimizer() {
  const [fromCode, setFromCode] = useState("BOM");
  const [toCode, setToCode] = useState("DWC");
  const [date, setDate] = useState("2026-06-04");
  const [passengers, setPassengers] = useState(3);
  const [purpose, setPurpose] = useState("Business");
  const [budget, setBudget] = useState(60000);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimized, setOptimized] = useState(false);

  const [options, setOptions] = useState<RouteOption[]>([]);

  const handleOptimize = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOptimizing(true);

    setTimeout(() => {
      setIsOptimizing(false);
      setOptimized(true);
      setOptions([
        {
          id: "opt-1",
          name: "Direct Private Charter",
          type: "Fastest",
          duration: "3h 15m",
          cost: 52500,
          aircraft: "Gulfstream G700",
          operator: "SkyLuxe Private",
          amenities: ["Private Bedroom", "Michelin Dining", "FBO Luxury Lounge Access"],
          weather: "Clear Skies",
          windSpeed: "12 kts tailwind",
          bookingUrl: `/checkout?type=private&id=gulfstream-g700&from=${fromCode}&to=${toCode}&date=${date}&passengers=${passengers}&price=52500`
        },
        {
          id: "opt-2",
          name: "VVIP Commercial Flight",
          type: "Most Luxurious",
          duration: "3h 30m",
          cost: 4500,
          aircraft: "Boeing 777-300ER (First)",
          operator: "Emirates First Class",
          amenities: ["Shower Spa", "Onboard Lounge", "Private Suite"],
          weather: "Clear Skies",
          windSpeed: "14 kts tailwind",
          bookingUrl: `/checkout?type=commercial&id=EK-505&from=${fromCode}&to=${toCode}&date=${date}&passengers=${passengers}&price=4500&seat=1A`
        },
        {
          id: "opt-3",
          name: "Executive Jet Share",
          type: "Most Efficient",
          duration: "3h 45m",
          cost: 18500,
          aircraft: "Falcon 8X (Co-ownership)",
          operator: "SkyLuxe Fleet Share",
          amenities: ["Executive Dining", "High-speed Wi-Fi", "Express VIP Customs"],
          weather: "Moderate Winds",
          windSpeed: "18 kts tailwind",
          bookingUrl: `/checkout?type=private&id=falcon-8x&from=${fromCode}&to=${toCode}&date=${date}&passengers=${passengers}&price=18500`
        }
      ]);
    }, 1800);
  };

  return (
    <div className="p-8 space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white mb-2">Aviation Route Optimizer</h1>
        <p className="text-platinum/50 font-light text-sm">
          Optimize flight trajectories, avoid regional congestion, and compare travel configurations dynamically.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="xl:col-span-4">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden bg-onyx">
            <h3 className="text-lg font-serif font-bold text-white mb-6 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-gold" /> Search Parameters
            </h3>

            <form onSubmit={handleOptimize} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1.5 block font-mono">Origin FBO</label>
                  <select 
                    value={fromCode}
                    onChange={(e) => setFromCode(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white focus:border-gold/50 appearance-none font-light outline-none text-sm"
                  >
                    <option value="BOM">Mumbai (BOM)</option>
                    <option value="DEL">Delhi (DEL)</option>
                    <option value="LHR">London (LHR)</option>
                    <option value="JFK">New York (JFK)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1.5 block font-mono">Destination FBO</label>
                  <select 
                    value={toCode}
                    onChange={(e) => setToCode(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white focus:border-gold/50 appearance-none font-light outline-none text-sm"
                  >
                    <option value="DWC">Dubai (DWC)</option>
                    <option value="NCE">Nice (NCE)</option>
                    <option value="CDG">Paris (CDG)</option>
                    <option value="MLE">Maldives (MLE)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1.5 block font-mono">Departure Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                  <input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 pl-12 text-white focus:border-gold/50 outline-none text-sm font-light"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1.5 block font-mono">Passengers</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                    <input 
                      type="number"
                      min={1}
                      max={19}
                      value={passengers}
                      onChange={(e) => setPassengers(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 pl-12 text-white focus:border-gold/50 outline-none text-sm font-light"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1.5 block font-mono">Trip Purpose</label>
                  <select 
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white focus:border-gold/50 appearance-none font-light outline-none text-sm"
                  >
                    <option value="Business">Business</option>
                    <option value="Leisure">Leisure</option>
                    <option value="Diplomatic">Diplomatic</option>
                    <option value="Executive Retreat">Retreat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1.5 block font-mono">Target Budget Limit ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                  <input 
                    type="number"
                    step={5000}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 pl-12 text-white focus:border-gold/50 outline-none text-sm font-light"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isOptimizing}
                className="w-full py-4 rounded-xl bg-gold text-onyx font-bold hover:bg-gold-light transition-colors text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              >
                {isOptimizing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-onyx border-t-transparent rounded-full animate-spin" />
                    Calculating Flight Paths...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" /> Synthesize Options
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Visual Flight Map and Results */}
        <div className="xl:col-span-8 space-y-8">
          {/* Visual Flight Route Panel */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-onyx/40 overflow-hidden relative min-h-[300px] flex flex-col justify-between">
            {/* Visual Vector Route Map */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex items-center justify-center">
              <svg className="w-full h-full max-h-[280px]" viewBox="0 0 800 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Connection Line */}
                <path 
                  d="M 200 150 Q 400 50 600 150" 
                  stroke="#D4AF37" 
                  strokeWidth="2" 
                  strokeDasharray="6 6"
                  className={optimized ? "animate-[dash_10s_linear_infinite]" : ""}
                />
                
                {/* Jet Radar Dot */}
                {optimized && (
                  <circle r="4" fill="#D4AF37">
                    <animateMotion dur="6s" repeatCount="indefinite" path="M 200 150 Q 400 50 600 150" />
                  </circle>
                )}

                {/* Cities */}
                <circle cx="200" cy="150" r="6" fill="#fff" stroke="#D4AF37" strokeWidth="2" />
                <circle cx="600" cy="150" r="6" fill="#fff" stroke="#D4AF37" strokeWidth="2" />
              </svg>
            </div>

            <div className="relative z-10 flex justify-between items-center mb-6">
              <div>
                <p className="text-xs text-platinum/40 uppercase tracking-widest font-mono">Flight Trajectory Vector</p>
                <h4 className="text-xl font-serif text-white font-semibold mt-1">
                  {fromCode} <span className="text-gold">→</span> {toCode}
                </h4>
              </div>
              {optimized && (
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl">
                    <Sun className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-white font-mono">Clear Destination</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl">
                    <Wind className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-white font-mono">No Headwinds</span>
                  </div>
                </div>
              )}
            </div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6 mt-16">
              <div className="text-left">
                <p className="text-[10px] text-platinum/40 uppercase tracking-widest font-mono">Origin Airport</p>
                <p className="text-white text-lg font-light">{fromCode === "BOM" ? "Mumbai Chhatrapati Shivaji" : fromCode === "DEL" ? "Delhi Indira Gandhi" : fromCode === "LHR" ? "London Heathrow" : "New York JFK"}</p>
              </div>
              <div className="hidden md:flex flex-col items-center flex-grow px-8 pb-2">
                <Plane className="w-5 h-5 text-gold/60 transform rotate-90" />
                <div className="w-full border-t border-white/10 mt-2" />
              </div>
              <div className="text-right">
                <p className="text-[10px] text-platinum/40 uppercase tracking-widest font-mono">Destination Airport</p>
                <p className="text-white text-lg font-light">{toCode === "DWC" ? "Dubai Al Maktoum FBO" : toCode === "NCE" ? "Nice Côte d'Azur VIP" : toCode === "CDG" ? "Paris Charles de Gaulle" : "Malé Velana International"}</p>
              </div>
            </div>
          </div>

          {/* Results Comparison Grid */}
          {optimized ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-serif font-bold text-white">Synthesized Flight Configurations</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {options.map((opt) => {
                  const Icon = opt.type === "Fastest" ? Clock : opt.type === "Most Luxurious" ? Award : ShieldCheck;
                  return (
                    <div 
                      key={opt.id} 
                      className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/5 hover:border-gold/30 hover:bg-gold/5 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-medium ${
                            opt.type === "Fastest" 
                              ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                              : opt.type === "Most Luxurious" 
                                ? "bg-gold/10 text-gold border border-gold/20" 
                                : "bg-green-500/10 text-green-400 border border-green-500/20"
                          }`}>
                            {opt.type}
                          </span>
                          <Icon className="w-4 h-4 text-gold/70" />
                        </div>

                        <h4 className="text-white font-medium text-base mb-1">{opt.name}</h4>
                        <p className="text-platinum/40 text-xs font-mono">{opt.aircraft}</p>
                        <p className="text-2xl font-serif text-white font-bold my-4">${opt.cost.toLocaleString()}</p>

                        <div className="space-y-3 pt-2 border-t border-white/5">
                          <div className="flex justify-between text-xs">
                            <span className="text-platinum/50 font-light">Duration:</span>
                            <span className="text-white font-mono">{opt.duration}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-platinum/50 font-light">Weather:</span>
                            <span className="text-white">{opt.weather}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
                          {opt.amenities.map((amenity, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[11px] text-platinum/60">
                              <span className="w-1 h-1 bg-gold rounded-full" />
                              <span>{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6">
                        <Link href={opt.bookingUrl} className="block">
                          <button className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-gold hover:text-onyx border border-white/10 hover:border-gold transition-all text-xs font-semibold text-white flex items-center justify-center gap-1">
                            Secure Configuration <ArrowRight className="w-3 h-3" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <div className="border border-dashed border-white/5 rounded-3xl p-16 text-center">
              <Plane className="w-10 h-10 text-platinum/20 mx-auto mb-4 animate-pulse" />
              <p className="text-white/60 text-sm font-medium">No trajectory simulated yet.</p>
              <p className="text-platinum/40 text-xs mt-1">Configure parameters on the left and synthesize route models.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
