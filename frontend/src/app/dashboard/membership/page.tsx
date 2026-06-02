"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, ShieldCheck, Zap, ArrowRight, QrCode, Sparkles, 
  Map, Award, Calendar, Check, Compass, MessageSquare, 
  Lock, AlertTriangle, Coins, RefreshCw
} from "lucide-react";
import Link from "next/link";
import { useSkyLuxeStore } from "@/store/skyluxeStore";
import { api } from "@/lib/api";

export default function MembershipManagement() {
  const { profile, formatAmount, fetchInitialData, walletBalance } = useSkyLuxeStore();
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  
  // Welcome reveal states
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeTier, setWelcomeTier] = useState({ id: "", name: "" });

  const activeTier = (profile?.membership || "none").toLowerCase().replace(" ", "_");

  const plans = [
    {
      id: "silver",
      name: "Silver Club",
      price: 999,
      multiplier: "1.25x Reward Multiplier",
      color: "from-slate-300 via-slate-100 to-slate-400",
      textColor: "text-slate-800",
      accentColor: "text-slate-400",
      glowColor: "rgba(226, 232, 240, 0.15)",
      benefits: [
        "Personal Brushed Aluminum Card",
        "Digital Aviation Travel Passport",
        "1.25x SkyCoins reward multiplier",
        "Silver Lounge gated dashboard access",
        "Monthly curated destination guides",
        "Priority commercial check-in slots",
        "Standard concierge support access"
      ]
    },
    {
      id: "executive",
      name: "Executive Club",
      price: 9999,
      multiplier: "1.75x Reward Multiplier",
      color: "from-amber-400 via-amber-100 to-amber-600",
      textColor: "text-amber-950",
      accentColor: "text-amber-500",
      glowColor: "rgba(245, 158, 11, 0.25)",
      benefits: [
        "Everything in Silver Tier plus:",
        "Personal Champagne Gold Card",
        "1.75x SkyCoins reward multiplier",
        "Executive Room lounge access",
        "Premium Concierge support (Priority queue)",
        "VIP Experiences marketplace",
        "Airport Lounge recommendation engine",
        "Detailed flight analytics reporting"
      ]
    },
    {
      id: "black_elite",
      name: "Black Elite Club",
      price: 25000,
      multiplier: "2.50x Reward Multiplier",
      color: "from-neutral-900 via-neutral-800 to-black",
      textColor: "text-gold",
      accentColor: "text-gold",
      glowColor: "rgba(212, 175, 55, 0.4)",
      benefits: [
        "Everything in Executive Tier plus:",
        "Personal Black Titanium Card",
        "2.50x SkyCoins reward multiplier",
        "Waived cancellation fees ($0 Penalties)",
        "Black Elite Sanctuary lounge access",
        "24/7 dedicated private flight dispatches",
        "Direct chat with Lead Aviation Desk",
        "Exclusive luxury destination clearances"
      ]
    }
  ];

  // Card Mouse tilt logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    setRotate({
      x: -y / 12,
      y: x / 12
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const handleSubscribe = async (planId: string, planName: string) => {
    setLoadingPlan(planId);
    try {
      await api.post(`/memberships/subscribe?user_id=${profile.id}`, { plan_id: planId });
      await fetchInitialData();
      setWelcomeTier({ id: planId, name: planName });
      setShowWelcome(true);
    } catch (err: any) {
      alert(err.message || "Failed to upgrade membership.");
    } finally {
      setLoadingPlan(null);
    }
  };

  // Get active tier details for rendering the main card
  const getActivePlanDetails = () => {
    const active = plans.find(p => p.id === activeTier);
    if (active) return active;
    // Fallback card (non-member)
    return {
      id: "none",
      name: "SkyLuxe Guest",
      price: 0,
      multiplier: "1.00x Rewards",
      color: "from-zinc-800 via-zinc-700 to-zinc-900",
      textColor: "text-zinc-300",
      accentColor: "text-zinc-500",
      glowColor: "rgba(255,255,255,0.05)",
      benefits: []
    };
  };

  const currentPlan = getActivePlanDetails();

  return (
    <div className="space-y-8 flex-1 pb-12 relative z-10">
      {/* Atmospheric Runway Background Overlay */}
      <div className="absolute inset-0 -m-8 z-0 pointer-events-none overflow-hidden rounded-3xl opacity-45">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/runway-membership-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-onyx/75 to-onyx" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Sovereign Membership Club</h1>
          <p className="text-platinum/50 font-light text-sm">
            Access private lounge facilities, track active rewards multipliers, and view your authenticated digital credentials.
          </p>
        </div>
        
        {activeTier !== "none" && (
          <div className="flex gap-3">
            <Link href="/member-lounge">
              <button className="px-5 py-2.5 rounded-xl border border-gold/30 hover:border-gold bg-gold/5 text-gold font-medium text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all">
                <Compass className="w-3.5 h-3.5" /> Enter Club Lounge
              </button>
            </Link>
            <Link href="/dashboard/passport">
              <button className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-white font-medium text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all">
                <Award className="w-3.5 h-3.5 text-gold" /> Aviation Passport
              </button>
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Digital Member Card Display */}
        <div className="lg:col-span-6 space-y-6">
          <h3 className="text-sm font-mono text-platinum/40 uppercase tracking-widest">Active Club Credentials</h3>
          
          {/* Card Wrapper with 3D Tilt */}
          <div className="perspective-1000">
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                transformStyle: "preserve-3d"
              }}
              className={`w-full h-80 rounded-3xl p-8 relative overflow-hidden shadow-2xl border transition-all duration-100 bg-gradient-to-br ${currentPlan.color} ${
                activeTier === "black_elite" ? "border-gold/30" : "border-white/15"
              }`}
            >
              {/* Animated Inner Reflective Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-y-full hover:translate-y-full transition-transform duration-1000 pointer-events-none" />
              
              {/* Glow Highlights */}
              <div 
                className="absolute -top-1/4 -right-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-all duration-500"
                style={{ backgroundColor: currentPlan.glowColor }}
              />

              <div className="h-full flex flex-col justify-between relative z-10 select-none">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-[10px] tracking-[0.25em] font-mono uppercase font-bold ${
                      activeTier === "silver" ? "text-slate-600" : activeTier === "executive" ? "text-amber-800" : "text-gold/70"
                    }`}>
                      SkyLuxe Aviation Club
                    </span>
                    <h3 className={`text-3xl font-serif font-bold mt-1 ${currentPlan.textColor}`}>
                      {currentPlan.name}
                    </h3>
                  </div>
                  <Star className={`w-8 h-8 ${currentPlan.textColor} ${activeTier !== "none" ? "animate-pulse" : ""}`} />
                </div>

                <div className="flex justify-between items-end gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className={`text-[9px] uppercase tracking-widest font-mono ${
                        activeTier === "silver" ? "text-slate-600" : activeTier === "executive" ? "text-amber-800" : "text-platinum/40"
                      }`}>
                        Club Member
                      </p>
                      <p className={`font-semibold text-lg ${
                        activeTier === "silver" ? "text-slate-900" : "text-white"
                      }`}>{profile.name}</p>
                    </div>

                    <div className="flex gap-8">
                      <div>
                        <p className={`text-[8px] uppercase tracking-widest font-mono ${
                          activeTier === "silver" ? "text-slate-500" : "text-platinum/40"
                        }`}>
                          Member ID
                        </p>
                        <p className={`font-mono text-xs ${
                          activeTier === "silver" ? "text-slate-800" : "text-white"
                        }`}>
                          SL-{profile.id ? profile.id.slice(-6).toUpperCase() : "GUEST"}
                        </p>
                      </div>
                      <div>
                        <p className={`text-[8px] uppercase tracking-widest font-mono ${
                          activeTier === "silver" ? "text-slate-500" : "text-platinum/40"
                        }`}>
                          SkyCoins Balance
                        </p>
                        <p className={`font-mono text-xs flex items-center gap-1 font-bold ${
                          activeTier === "silver" ? "text-slate-800" : "text-gold"
                        }`}>
                          <Coins className="w-3.5 h-3.5" />
                          {(profile.coins || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="p-1.5 bg-white/95 rounded-lg shadow-md border border-white/20">
                      <QrCode className="w-12 h-12 text-black" />
                    </div>
                    <span className={`text-[8px] font-mono uppercase tracking-wider ${
                      activeTier === "silver" ? "text-slate-500" : "text-platinum/40"
                    }`}>
                      Clearance QR Secure
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Wallet Balance Check */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-onyx/40 flex justify-between items-center">
            <div>
              <p className="text-xs text-platinum/40 uppercase tracking-widest font-mono">FBO Wallet Balance</p>
              <h4 className="text-2xl font-bold text-white mt-1 font-mono">{formatAmount(walletBalance)}</h4>
            </div>
            <Link href="/dashboard/billing">
              <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all text-xs">
                Add Funds
              </button>
            </Link>
          </div>
        </div>

        {/* Right Column: Premium Tiers Selection & Upgrade Portal */}
        <div className="lg:col-span-6 space-y-6">
          <h3 className="text-sm font-mono text-platinum/40 uppercase tracking-widest">Select Club Level</h3>

          <div className="space-y-4">
            {plans.map((plan) => {
              const isActive = activeTier === plan.id;
              const hasInsufficientBalance = walletBalance < plan.price;
              
              return (
                <div 
                  key={plan.id}
                  className={`glass-panel p-6 rounded-3xl border transition-all ${
                    isActive 
                      ? "border-gold/40 bg-gold/5 shadow-[0_0_20px_rgba(212,175,55,0.05)]" 
                      : "border-white/10 bg-onyx/20 hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-serif font-bold text-white">{plan.name}</h4>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-gold/20 text-gold uppercase tracking-wider font-mono">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gold font-mono mt-1">{plan.multiplier}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-white font-mono">${plan.price.toLocaleString()}</p>
                      <p className="text-[10px] text-platinum/40 uppercase tracking-widest font-mono">Per Year</p>
                    </div>
                  </div>

                  {/* Benefits Grid */}
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                    {plan.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[11px] text-platinum/60 font-light leading-relaxed">
                        <Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Purchase/Status Button */}
                  {!isActive && (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleSubscribe(plan.id, plan.name)}
                        disabled={loadingPlan !== null || hasInsufficientBalance}
                        className={`w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                          hasInsufficientBalance
                            ? "bg-white/5 border border-white/5 text-platinum/30 cursor-not-allowed"
                            : "bg-gold text-onyx hover:bg-gold-light shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]"
                        }`}
                      >
                        {loadingPlan === plan.id ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying Credentials...
                          </>
                        ) : hasInsufficientBalance ? (
                          <>
                            <Lock className="w-3.5 h-3.5 text-platinum/30" /> Insufficient Balance
                          </>
                        ) : (
                          <>
                            Acquire {plan.name} Credentials <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                      
                      {hasInsufficientBalance && (
                        <p className="text-[10px] text-red-400/80 flex items-center gap-1 justify-center mt-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          Required: ${plan.price.toLocaleString()} (Short: ${(plan.price - walletBalance).toLocaleString()})
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PREMIUM WELCOME ONBOARDING REVEAL OVERLAY */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-[#020202]/95 backdrop-blur-xl"
          >
            <div className="absolute inset-0" onClick={() => setShowWelcome(false)} />
            
            <motion.div 
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              className="relative z-10 w-full max-w-2xl glass-panel border border-gold/30 rounded-3xl overflow-hidden p-8 md:p-12 text-center bg-gradient-to-b from-onyx-light to-[#020202] shadow-[0_0_80px_rgba(212,175,55,0.15)] flex flex-col items-center"
            >
              {/* Shimmer Ambient Glow */}
              <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
              
              <div className="w-20 h-20 rounded-full border border-gold/40 bg-gold/10 flex items-center justify-center mb-8 animate-bounce">
                <Star className="w-10 h-10 text-gold" />
              </div>

              <span className="text-gold text-[10px] tracking-[0.4em] font-mono uppercase font-bold mb-2">Clearance Confirmed</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                Welcome to the {welcomeTier.name}
              </h2>
              
              <p className="text-platinum/60 text-sm font-light max-w-lg mb-8 leading-relaxed">
                Your credentials have been securely registered under the SkyLuxe Sovereignty Accord. Your new elite status is immediately active across all command hubs.
              </p>

              {/* Digital Card Reveal Animation */}
              <motion.div
                initial={{ rotateY: 180, scale: 0.8 }}
                animate={{ rotateY: 0, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className={`w-72 h-44 rounded-2xl p-6 mb-8 bg-gradient-to-br flex flex-col justify-between text-left shadow-2xl border border-white/10 ${
                  welcomeTier.id === "silver" 
                    ? "from-slate-300 via-slate-100 to-slate-400"
                    : welcomeTier.id === "executive"
                      ? "from-amber-400 via-amber-100 to-amber-600"
                      : "from-neutral-900 via-neutral-800 to-black"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-[8px] font-mono tracking-widest uppercase ${
                      welcomeTier.id === "silver" ? "text-slate-600" : welcomeTier.id === "executive" ? "text-amber-800" : "text-gold/70"
                    }`}>SkyLuxe Sovereignty</p>
                    <p className={`font-serif font-bold text-sm ${
                      welcomeTier.id === "silver" ? "text-slate-800" : welcomeTier.id === "executive" ? "text-amber-950" : "text-white"
                    }`}>{welcomeTier.name}</p>
                  </div>
                  <Star className={`w-5 h-5 ${
                    welcomeTier.id === "silver" ? "text-slate-800" : welcomeTier.id === "executive" ? "text-amber-950" : "text-gold"
                  }`} />
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className={`text-[7px] font-mono uppercase ${
                      welcomeTier.id === "silver" ? "text-slate-600" : "text-platinum/40"
                    }`}>Member</p>
                    <p className={`font-medium text-xs ${
                      welcomeTier.id === "silver" ? "text-slate-900" : "text-white"
                    }`}>{profile.name}</p>
                  </div>
                  <QrCode className={`w-8 h-8 ${
                    welcomeTier.id === "silver" ? "text-slate-800" : "text-white"
                  }`} />
                </div>
              </motion.div>

              {/* Privilege Unlocks */}
              <div className="grid grid-cols-3 gap-4 w-full mb-8">
                <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex flex-col items-center">
                  <Coins className="w-5 h-5 text-gold mb-2" />
                  <p className="text-[10px] text-white font-medium">SkyCoins Credit</p>
                  <p className="text-[9px] text-platinum/40 mt-0.5">Awarded Instantly</p>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex flex-col items-center">
                  <Compass className="w-5 h-5 text-gold mb-2" />
                  <p className="text-[10px] text-white font-medium">Club Lounge</p>
                  <p className="text-[9px] text-platinum/40 mt-0.5">Clearance Active</p>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex flex-col items-center">
                  <Award className="w-5 h-5 text-gold mb-2" />
                  <p className="text-[10px] text-white font-medium">Passport Stamp</p>
                  <p className="text-[9px] text-platinum/40 mt-0.5">Welcome Stamp Issued</p>
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setShowWelcome(false)}
                  className="flex-1 py-3.5 rounded-xl border border-white/10 hover:border-white/20 text-white font-medium text-xs uppercase tracking-wider transition-colors"
                >
                  Dismiss Reveal
                </button>
                <Link href="/member-lounge" className="flex-1">
                  <button className="w-full py-3.5 rounded-xl bg-gold text-onyx font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-gold-light transition-all">
                    Access Lounge Hub <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
