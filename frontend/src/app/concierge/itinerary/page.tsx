"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, MapPin, DollarSign, Compass, Briefcase, 
  ArrowRight, Check, Download, Bookmark, Sparkles, PieChart 
} from "lucide-react";
import { useSkyLuxeStore } from "@/store/skyluxeStore";
import { useSearchParams } from "next/navigation";

function ItineraryBuilderContent() {
  const searchParams = useSearchParams();
  const initialDest = searchParams.get("destination") || "";
  const initialStyle = searchParams.get("style") || "luxury";

  const { addSavedTrip } = useSkyLuxeStore();

  const [destination, setDestination] = useState(initialDest);
  const [dates, setDates] = useState("2026-06-10 to 2026-06-14");
  const [budget, setBudget] = useState(85000);
  const [style, setStyle] = useState(initialStyle);
  const [tripType, setTripType] = useState("executive");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [saved, setSaved] = useState(false);

  const [itineraryDays, setItineraryDays] = useState<{ day: number; activities: string[] }[]>([]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setSaved(false);

    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
      setItineraryDays([
        {
          day: 1,
          activities: [
            "VIP Private Jet Arrival & FBO Fast-Track Customs Clearance.",
            "Maybach Chauffeur Transfer to Luxury Presidential Suite.",
            "Private Dining & Wine Pairing Experience with personal sommelier."
          ]
        },
        {
          day: 2,
          activities: [
            "Sunrise Yacht Charter & Coastal cruise with private chef breakfast.",
            "High-stakes afternoon meetings at private boardroom hub.",
            "VIP Sky Deck Lounge access & Networking gala dinner."
          ]
        },
        {
          day: 3,
          activities: [
            "Luxury Helicopter transfer to regional landmarks.",
            "Art gallery private viewing & curated shopping tour.",
            "Premium spa treatment & molecular gastronomy dining."
          ]
        },
        {
          day: 4,
          activities: [
            "Morning leisure stroll or executive check-in preparation.",
            "VVIP departure lounge escort & boarding protocol.",
            "Return Private Charter Flight back home."
          ]
        }
      ]);
    }, 1800);
  };

  const handleSaveTrip = () => {
    addSavedTrip({
      title: `Grand ${destination || "Global"} Tour`,
      destination: destination || "Global",
      dates,
      budget: `$${budget.toLocaleString()}`,
      style,
      itinerary: itineraryDays
    });
    setSaved(true);
  };

  return (
    <div className="p-8 space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white mb-2">AI Itinerary Architect</h1>
        <p className="text-platinum/50 font-light text-sm">
          Map your goals, dates, and destinations. The SkyLuxe AI will model a comprehensive schedule containing travel, dining, and boardrooms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Panel */}
        <div className="lg:col-span-4">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-onyx">
            <h3 className="text-lg font-serif font-bold text-white mb-6 flex items-center gap-2">
              <Compass className="w-5 h-5 text-gold" /> Plan Parameters
            </h3>

            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1.5 block font-mono">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                  <input 
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Dubai Marina, Maldives"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 pl-12 text-white placeholder-platinum/30 focus:border-gold/50 outline-none text-sm font-light"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1.5 block font-mono">Date Range</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                  <input 
                    type="text"
                    required
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                    placeholder="e.g. June 10 - June 14"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 pl-12 text-white placeholder-platinum/30 focus:border-gold/50 outline-none text-sm font-light"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1.5 block font-mono">Estimated Budget Limit ($)</label>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1.5 block font-mono">Travel Style</label>
                  <select 
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white focus:border-gold/50 appearance-none font-light outline-none text-sm"
                  >
                    <option value="luxury">Ultra Luxury</option>
                    <option value="business">High Stakes Business</option>
                    <option value="wellness">Wellness Retreat</option>
                    <option value="adventure">Private Adventure</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1.5 block font-mono">Trip Type</label>
                  <select 
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white focus:border-gold/50 appearance-none font-light outline-none text-sm"
                  >
                    <option value="solo">Solo Executive</option>
                    <option value="executive">Corporate Delegation</option>
                    <option value="family">Private Family</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isGenerating}
                className="w-full py-4 rounded-xl bg-gold text-onyx font-bold hover:bg-gold-light transition-colors text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              >
                {isGenerating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-onyx border-t-transparent rounded-full animate-spin" />
                    Modeling Schedule...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Formulate Itinerary
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-8 space-y-8">
          <AnimatePresence mode="wait">
            {generated ? (
              <motion.div
                key="itinerary-results"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8"
              >
                {/* Timeline Column */}
                <div className="md:col-span-7 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-serif font-bold text-white">Your Day-by-Day Schedule</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleSaveTrip}
                        disabled={saved}
                        className={`p-2.5 rounded-xl border flex items-center justify-center transition-all text-xs font-semibold ${
                          saved 
                            ? "bg-green-500/10 border-green-500/30 text-green-400" 
                            : "bg-white/5 border-white/10 hover:bg-white/10 text-platinum/60 hover:text-white"
                        }`}
                        title="Save Trip to Dashboard"
                      >
                        {saved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => alert("PDF formulation initialized. Document will download shortly.")}
                        className="p-2.5 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 text-platinum/60 hover:text-white flex items-center justify-center transition-all"
                        title="Export Itinerary"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="relative border-l border-gold/20 pl-6 ml-3 space-y-8">
                    {itineraryDays.map((day) => (
                      <div key={day.day} className="relative">
                        {/* Timeline Bullet */}
                        <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-onyx border-2 border-gold flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                        
                        <h4 className="text-gold font-serif font-bold text-lg mb-3">Day {day.day}</h4>
                        
                        <div className="space-y-4">
                          {day.activities.map((act, i) => (
                            <div key={i} className="glass-panel p-4 rounded-xl border border-white/5 bg-white/5">
                              <p className="text-white text-xs font-light leading-relaxed">{act}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget Column */}
                <div className="md:col-span-5 space-y-6">
                  <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-gold" /> Budget Allocation
                  </h3>

                  <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-onyx flex flex-col items-center">
                    {/* Pure CSS circular pie chart */}
                    <div className="relative w-44 h-44 rounded-full bg-gradient-to-tr from-gold to-yellow-600 border border-white/10 flex items-center justify-center shadow-lg">
                      <div className="absolute w-32 h-32 bg-[#0a0a0a] rounded-full flex flex-col items-center justify-center">
                        <span className="text-[10px] text-platinum/40 uppercase tracking-widest font-mono">Total Budget</span>
                        <span className="text-white font-serif font-bold text-lg">${budget.toLocaleString()}</span>
                      </div>
                      
                      {/* Pie Segments overlay mockup */}
                      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500/50 border-r-indigo-500/50 pointer-events-none" />
                    </div>

                    <div className="w-full space-y-3 mt-8">
                      {[
                        { label: "Flight Charters", pct: "60%", color: "bg-gold" },
                        { label: "Elite Lodging", pct: "25%", color: "bg-yellow-600" },
                        { label: "VVIP Dining", pct: "10%", color: "bg-blue-500" },
                        { label: "Ground Support", pct: "5%", color: "bg-indigo-500" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                            <span className="text-platinum/70 font-light">{item.label}</span>
                          </div>
                          <span className="text-white font-mono font-medium">{item.pct}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="border border-dashed border-white/5 rounded-3xl p-24 text-center">
                <Compass className="w-10 h-10 text-platinum/20 mx-auto mb-4" />
                <p className="text-white/60 text-sm font-medium">No schedule mapped yet.</p>
                <p className="text-platinum/40 text-xs mt-1">Submit travel parameters on the left to synthesize the luxury schedule.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function ItineraryBuilder() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Loading Itinerary Architect...</div>}>
      <ItineraryBuilderContent />
    </Suspense>
  );
}
