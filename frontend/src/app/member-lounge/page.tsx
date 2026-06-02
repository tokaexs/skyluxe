"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Star, Lock, ShieldAlert, ArrowLeft, ArrowRight, MessageSquare, 
  MapPin, Gift, Compass, BookOpen, Send, CheckCircle, Flame
} from "lucide-react";
import Link from "next/link";
import { useSkyLuxeStore } from "@/store/skyluxeStore";
import GlassNavbar from "@/components/ui/GlassNavbar";

export default function MemberLounge() {
  const { profile, formatAmount } = useSkyLuxeStore();
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([
    { sender: "desk", text: "Good day, Mr. Sterling. Welcome back to the SkyLuxe lead aviation desk. How may we assist your upcoming journey?" }
  ]);

  const activeTier = (profile?.membership || "none").toLowerCase().replace(" ", "_");
  const isGuest = activeTier === "none";

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text: chatMessage }]);
    const userMsg = chatMessage;
    setChatMessage("");

    // Simulate concierge response
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          sender: "desk", 
          text: `Understood, Mr. Sterling. I have logged your request regarding "${userMsg}" and forwarded it directly to the local FBO operations desk.` 
        }
      ]);
    }, 1200);
  };

  // 1. LOCKED / GUEST EXPERIENCE
  if (isGuest) {
    return (
      <div className="min-h-screen bg-onyx flex flex-col justify-center items-center p-6 relative bg-[url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2000')] bg-cover bg-center">
        <div className="absolute inset-0 bg-[#020202]/90 backdrop-blur-md" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-lg glass-panel border border-white/10 rounded-3xl p-8 md:p-12 text-center bg-black/40 shadow-2xl flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
            <Lock className="w-6 h-6 text-red-400" />
          </div>
          <span className="text-red-400 text-[10px] tracking-[0.3em] font-mono uppercase font-bold mb-2">Restricted Access</span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">SkyLuxe Member Lounge</h2>
          <p className="text-platinum/60 text-sm font-light leading-relaxed mb-8">
            Access to our digital lounges is reserved exclusively for validated Club Members. Elevate your travel credentials to unlock partner perks, concierge channels, and route insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link href="/dashboard" className="flex-1">
              <button className="w-full py-3.5 rounded-xl border border-white/15 hover:border-white/20 text-white font-medium text-xs uppercase tracking-wider transition-colors">
                Back to Command Center
              </button>
            </Link>
            <Link href="/dashboard/membership" className="flex-1">
              <button className="w-full py-3.5 rounded-xl bg-gold text-onyx font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-gold-light transition-all">
                Acquire Membership <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. EXCLUSIVE MEMBER LOUNGES BY TIER
  return (
    <div className="min-h-screen bg-onyx flex flex-col relative select-none">
      {/* Decorative background gradients based on Tier */}
      {activeTier === "black_elite" ? (
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      ) : activeTier === "executive" ? (
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      ) : (
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-400/5 rounded-full blur-[120px] pointer-events-none" />
      )}

      {/* Header / Navbar */}
      <GlassNavbar />

      <main className="max-w-7xl mx-auto px-6 pt-36 pb-20 w-full flex-1 flex flex-col gap-12">
        {/* Lounge Identity Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider font-mono ${
                activeTier === "black_elite" 
                  ? "bg-gold/25 text-gold border border-gold/30" 
                  : activeTier === "executive" 
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/20"
                    : "bg-slate-500/20 text-slate-300 border border-slate-500/20"
              }`}>
                {activeTier === "black_elite" ? "✦ Black Elite Sanctuary" : activeTier === "executive" ? "✦ Executive Clubroom" : "✦ Silver Member Lounge"}
              </span>
              <span className="text-white/30 text-xs">• Verified Sovereign Space</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
              {activeTier === "black_elite" ? "The Obsidian Sanctuary" : activeTier === "executive" ? "The Amber Room" : "The Aluminum Club"}
            </h1>
            <p className="text-platinum/50 font-light text-sm mt-2 max-w-2xl">
              Welcome back to your sovereign digital space. Access private dispatches, luxury destination reviews, and chat with your dedicated lead aviation coordinator.
            </p>
          </div>
          <Link href="/dashboard">
            <button className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Leave Lounge
            </button>
          </Link>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Block (Lounge Curated Reports & Partner Offers): 7 cols */}
          <div className="lg:col-span-7 space-y-8">
            {/* Curated Reports / Articles */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gold" /> Exclusive Destination Reports
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ArticleCard 
                  title="St. Barts Escape Guide" 
                  tag="VIP Access" 
                  desc="Review landing parameters for Gustaf III Airport, FBO custom services, and luxury yacht charters."
                  img="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800"
                />
                <ArticleCard 
                  title="Dubai VIP Concierge Upgrades" 
                  tag="Elite Dining" 
                  desc="Discover premium lounge locations inside DWC VIP Terminal and direct luxury transfers to Burj Al Arab."
                  img="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800"
                />
              </div>
            </div>

            {/* Partner Perks */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-gold" /> Elite Partner Benefits
              </h3>

              <div className="space-y-4">
                <PerkItem 
                  title="Aman Resorts & Spas" 
                  desc="Complimentary room upgrade to next suite class, welcome bottle of aged champagne, and $200 resort credit per booking."
                  tierRequirement="Executive & Black Elite only"
                />
                <PerkItem 
                  title="LXR Luxury Transportation" 
                  desc="Immediate priority dispatch for chauffeur luxury SUV ground transfers (Maybach S-Class or Escalade) in 40+ destinations."
                  tierRequirement="All Members"
                />
                {activeTier === "black_elite" && (
                  <PerkItem 
                    title="Exclusive Yacht Charters" 
                    desc="Elite reservation privileges on luxury mega-yachts in Monaco, St. Tropez, and Miami Beach. Complete concierge integration."
                    tierRequirement="Black Elite Exclusive"
                    special
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Block (Priority Concierge Desk): 5 cols */}
          <div className="lg:col-span-5">
            <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden flex flex-col h-[520px] bg-onyx-light">
              <div className="p-5 border-b border-white/10 bg-black/40 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center border border-gold/30">
                    <MessageSquare className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <h4 className="text-xs font-serif font-bold text-white">Lead Aviation Desk</h4>
                    <p className="text-[9px] text-green-400 font-mono tracking-wider">Priority Queue Connected</p>
                  </div>
                </div>
                {activeTier === "black_elite" ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[8px] font-bold bg-gold/20 text-gold uppercase tracking-wider font-mono">Instant Dispatch</span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[8px] font-bold bg-white/5 text-platinum/50 uppercase tracking-wider font-mono">10m Callback</span>
                )}
              </div>

              {/* Messages viewport */}
              <div data-lenis-prevent className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar bg-black/10">
                {messages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === "user" 
                        ? "bg-gold text-onyx font-medium rounded-tr-none" 
                        : "bg-white/5 border border-white/10 text-white rounded-tl-none"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-[#020202]/30 flex gap-2">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Request private helicopter transfer, catering overrides..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-gold/50 outline-none placeholder:text-platinum/30"
                />
                <button 
                  type="submit"
                  className="p-2.5 rounded-xl bg-gold text-onyx hover:bg-gold-light transition-all flex items-center justify-center shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ArticleCard({ title, tag, desc, img }: any) {
  return (
    <div className="group rounded-2xl border border-white/5 bg-white/5 overflow-hidden hover:border-white/10 transition-colors flex flex-col">
      <div className="h-32 bg-cover bg-center relative" style={{ backgroundImage: `url('${img}')` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-onyx to-transparent" />
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[8px] font-bold bg-gold text-onyx uppercase tracking-wider font-mono">{tag}</span>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-white font-medium text-sm group-hover:text-gold transition-colors">{title}</h4>
          <p className="text-platinum/50 text-[10px] mt-1.5 leading-relaxed">{desc}</p>
        </div>
        <span className="text-[9px] text-gold font-bold uppercase tracking-widest flex items-center gap-1 mt-4 cursor-pointer group-hover:underline">
          Read Report <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}

function PerkItem({ title, desc, tierRequirement, special }: any) {
  return (
    <div className={`p-4 rounded-xl border flex gap-4 items-start ${
      special 
        ? "border-gold/30 bg-gold/5 text-white" 
        : "border-white/5 bg-white/5 text-platinum"
    }`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
        special ? "bg-gold/20 text-gold" : "bg-white/5 text-gold/80"
      }`}>
        {special ? <Flame className="w-4.5 h-4.5" /> : <Compass className="w-4.5 h-4.5" />}
      </div>
      <div>
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h4 className="text-xs font-semibold text-white">{title}</h4>
          <span className="text-[8px] font-mono text-gold uppercase tracking-wider font-bold">{tierRequirement}</span>
        </div>
        <p className="text-[10px] text-platinum/50 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
