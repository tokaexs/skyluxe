"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, ShieldCheck, Zap, DollarSign, Calendar, 
  ArrowRight, Sparkles, TrendingUp, Award, CheckCircle 
} from "lucide-react";
import Link from "next/link";

interface MembershipTier {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  savings: number;
  multiplier: string;
  benefits: string[];
  description: string;
  color: string;
}

const membershipTiers: Record<string, MembershipTier> = {
  "silver": {
    id: "silver",
    name: "Silver Tier",
    price: "$15,000 / year",
    priceNum: 15000,
    savings: 3800,
    multiplier: "1.2x SkyCoins",
    benefits: ["Priority commercial bookings", "Access to shared private jet flights", "15,000 SkyCoins signup bonus", "24/7 digital AI concierge service"],
    description: "Designed for premium commercial travelers looking to dip their toes into private charter benefits.",
    color: "text-slate-400"
  },
  "executive": {
    id: "executive",
    name: "Executive Tier",
    price: "$45,000 / year",
    priceNum: 45000,
    savings: 18500,
    multiplier: "2.0x SkyCoins",
    benefits: ["Guaranteed 24-hour jet availability", "Zero black-out dates", "Helicopter airport transfer credits", "Michelin-star catering customization", "50,000 SkyCoins signup bonus"],
    description: "The gold standard for frequent corporate travelers requiring flexible on-demand regional travel assets.",
    color: "text-gold"
  },
  "black-elite": {
    id: "black-elite",
    name: "Black Elite",
    price: "$120,000 / year",
    priceNum: 120000,
    savings: 52000,
    multiplier: "3.5x SkyCoins",
    benefits: ["Guaranteed 6-hour private jet availability", "Fully customized cabin configurations", "Unlimited VVIP helicopter airport shuttles", "Diplomatic ground security convoys", "150,000 SkyCoins signup bonus"],
    description: "The ultimate tier of aviation exclusivity, reserved for diplomats, global executives, and heads of state.",
    color: "text-[#E5E4E2]"
  }
};

export default function MembershipAdvisor() {
  const [frequency, setFrequency] = useState("mixed");
  const [tripsPerYear, setTripsPerYear] = useState(12);
  const [spend, setSpend] = useState(50000);
  const [primaryNeed, setPrimaryNeed] = useState("availability");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<MembershipTier | null>(null);
  const [savingsCounter, setSavingsCounter] = useState(0);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      let recommended: MembershipTier;
      if (spend >= 100000 || primaryNeed === "security" || tripsPerYear > 24) {
        recommended = membershipTiers["black-elite"];
      } else if (spend >= 30000 || primaryNeed === "availability" || frequency === "private") {
        recommended = membershipTiers["executive"];
      } else {
        recommended = membershipTiers["silver"];
      }
      setResult(recommended);
    }, 1500);
  };

  useEffect(() => {
    if (!result) return;
    setSavingsCounter(0);
    const duration = 1200; // ms
    const steps = 60;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const current = Math.min(Math.round((result.savings / steps) * step), result.savings);
      setSavingsCounter(current);
      if (step >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [result]);

  return (
    <div className="p-8 space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white mb-2">Membership Elite Advisor</h1>
        <p className="text-platinum/50 font-light text-sm">
          Optimize your annual flight budget. Receive personalized recommendations mapping flight frequencies to the ideal membership program.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Panel */}
        <div className="lg:col-span-5">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-onyx">
            <h3 className="text-lg font-serif font-bold text-white mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-gold" /> Traveler Profile
            </h3>

            <form onSubmit={handleAnalyze} className="space-y-5">
              <div>
                <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1.5 block font-mono">Travel Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Commercial", value: "commercial" },
                    { label: "Private Jet", value: "private" },
                    { label: "Mixed Mode", value: "mixed" }
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setFrequency(item.value)}
                      className={`py-2.5 px-2 rounded-xl text-xs border text-center transition-all ${
                        frequency === item.value 
                          ? "bg-gold/10 border-gold text-gold font-medium" 
                          : "bg-white/5 border-white/10 text-platinum/60 hover:bg-white/10"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1.5 block font-mono">Annual Trips ({tripsPerYear})</label>
                <input 
                  type="range"
                  min={1}
                  max={50}
                  value={tripsPerYear}
                  onChange={(e) => setTripsPerYear(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold"
                />
                <div className="flex justify-between text-[10px] text-platinum/40 font-mono mt-1">
                  <span>1 trip</span>
                  <span>50+ trips</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1.5 block font-mono">Estimated Annual Flight Spend ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                  <input 
                    type="number"
                    step={10000}
                    value={spend}
                    onChange={(e) => setSpend(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 pl-12 text-white focus:border-gold/50 outline-none text-sm font-light"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1.5 block font-mono">Primary Operational Requirement</label>
                <select 
                  value={primaryNeed}
                  onChange={(e) => setPrimaryNeed(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white focus:border-gold/50 appearance-none font-light outline-none text-sm"
                >
                  <option value="savings">Optimizing costs and discounts</option>
                  <option value="availability">Guaranteed aircraft dispatch availability</option>
                  <option value="catering">Michelin custom dining & cabin options</option>
                  <option value="security">VVIP security & airport VIP lanes</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={isAnalyzing}
                className="w-full py-4 rounded-xl bg-gold text-onyx font-bold hover:bg-gold-light transition-colors text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              >
                {isAnalyzing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-onyx border-t-transparent rounded-full animate-spin" />
                    Analyzing Travel Manifests...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" /> Synthesize Recommendation
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Recommendation Panel */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                {/* Recommender Card */}
                <div className="glass-panel p-8 rounded-3xl border border-gold/20 bg-onyx bg-gradient-to-br from-gold/5 to-transparent relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/4" />
                  
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-8 h-8 text-gold" />
                    <div>
                      <p className="text-[10px] text-gold uppercase tracking-[0.2em] font-mono">Cortex Optimized Tier</p>
                      <h3 className={`text-2xl font-serif font-bold ${result.color}`}>{result.name}</h3>
                    </div>
                  </div>

                  <p className="text-white font-light text-sm leading-relaxed mb-6">
                    {result.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-6 mb-6">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-gold shrink-0" />
                      <div>
                        <p className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Est. Annual Savings</p>
                        <p className="text-white font-serif font-bold text-lg">${savingsCounter.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                      <Zap className="w-5 h-5 text-gold shrink-0" />
                      <div>
                        <p className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">SkyCoins Reward</p>
                        <p className="text-white font-serif font-bold text-lg">{result.multiplier}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono mb-3">Key Tier Advantages</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {result.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-platinum/70 leading-relaxed">
                          <CheckCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-left">
                      <p className="text-[10px] text-platinum/40 font-mono">Subscription Rate</p>
                      <p className="text-white font-serif text-lg font-bold">{result.price}</p>
                    </div>
                    <Link href={`/membership/${result.id}`} className="w-full md:w-auto">
                      <button className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-gold text-onyx font-bold hover:bg-gold-light transition-all text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                        Upgrade manifest now <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="border border-dashed border-white/5 rounded-3xl p-24 text-center">
                <Award className="w-10 h-10 text-platinum/20 mx-auto mb-4" />
                <p className="text-white/60 text-sm font-medium">No recommendation calculated.</p>
                <p className="text-platinum/40 text-xs mt-1">Submit traveler parameters on the left to analyze the ideal membership tier.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
