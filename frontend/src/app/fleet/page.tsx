"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassNavbar from "@/components/ui/GlassNavbar";
import {
  ArrowRight,
  Plane,
  Users,
  Zap,
  ShieldCheck,
  Sparkles,
  Wind,
  Globe,
  Utensils,
  Award,
  Clock,
  ChevronRight,
  Crown,
  Compass,
  CheckCircle2,
  Sliders,
  Scale,
  X,
  Luggage,
  Volume2,
  Maximize,
  Calculator,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useSkyLuxeStore } from "@/store/skyluxeStore";

const PrivateJetModelViewer = dynamic(
  () => import("@/components/3d/PrivateJetModelViewer"),
  {
    ssr: false,
    loading: () => null,
  }
);

interface JetItem {
  id: string;
  name: string;
  class: string;
  category: "ultra" | "heavy" | "midsize" | "vip";
  passengers: number;
  range: string;
  speed: string;
  hourlyRate: number;
  image: string;
  description: string;
  amenities: string[];
  cabinLength: string;
  cabinWidth: string;
  cabinHeight: string;
  baggage: string;
  soundLevel: string;
  takeoffDist: string;
}

const privateJets: JetItem[] = [
  {
    id: "gulfstream-g700",
    name: "Gulfstream G700",
    class: "Ultra Long Range",
    category: "ultra",
    passengers: 19,
    range: "7,500 nm",
    speed: "Mach 0.925",
    hourlyRate: 14000,
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1500&auto=format&fit=crop",
    description: "The pinnacle of executive aviation featuring up to 5 bespoke living areas, master stateroom with en-suite shower, and ultra-high-speed Ka-band connectivity.",
    amenities: ["Master Stateroom", "JetBed Lie-Flat", "Ka-Band Wifi", "Full Galley"],
    cabinLength: "56 ft 11 in",
    cabinWidth: "8 ft 2 in",
    cabinHeight: "6 ft 3 in",
    baggage: "195 cu ft",
    soundLevel: "46 dBA",
    takeoffDist: "5,995 ft",
  },
  {
    id: "global-7500",
    name: "Bombardier Global 7500",
    class: "Ultra Long Range",
    category: "ultra",
    passengers: 19,
    range: "7,700 nm",
    speed: "Mach 0.925",
    hourlyRate: 15000,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1500&auto=format&fit=crop",
    description: "Industry-leading range connecting non-stop city pairs like New York to Hong Kong, paired with the revolutionary Nuage deep-recline seating system.",
    amenities: ["Nuage Seating", "Soleil Lighting", "Pur Air HEPA", "Crew Suite"],
    cabinLength: "54 ft 5 in",
    cabinWidth: "8 ft 0 in",
    cabinHeight: "6 ft 2 in",
    baggage: "195 cu ft",
    soundLevel: "47 dBA",
    takeoffDist: "5,800 ft",
  },
  {
    id: "falcon-8x",
    name: "Dassault Falcon 8X",
    class: "Heavy Jet",
    category: "heavy",
    passengers: 14,
    range: "6,450 nm",
    speed: "Mach 0.90",
    hourlyRate: 11000,
    image: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=1500&auto=format&fit=crop",
    description: "Exceptional tri-jet agility allowing access to challenging short-runway airports like London City and Aspen, with an ultra-quiet acoustic signature.",
    amenities: ["Tri-Jet Redundancy", "Whisper Quiet", "FalconEye HUD", "VIP Lounge"],
    cabinLength: "42 ft 8 in",
    cabinWidth: "7 ft 8 in",
    cabinHeight: "6 ft 2 in",
    baggage: "140 cu ft",
    soundLevel: "45 dBA",
    takeoffDist: "5,880 ft",
  },
  {
    id: "challenger-650",
    name: "Bombardier Challenger 650",
    class: "Super Midsize",
    category: "midsize",
    passengers: 12,
    range: "4,000 nm",
    speed: "Mach 0.85",
    hourlyRate: 8500,
    image: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=1500&auto=format&fit=crop",
    description: "Widest-in-class cabin offering executive boardroom comfort, transcontinental capability, and industry-benchmark reliability for regional operations.",
    amenities: ["Widebody Cabin", "HD Audio/Video", "Conference Table", "Michelin Dining"],
    cabinLength: "28 ft 5 in",
    cabinWidth: "7 ft 11 in",
    cabinHeight: "6 ft 0 in",
    baggage: "115 cu ft",
    soundLevel: "49 dBA",
    takeoffDist: "5,640 ft",
  },
  {
    id: "praetor-600",
    name: "Embraer Praetor 600",
    class: "Super Midsize",
    category: "midsize",
    passengers: 9,
    range: "4,018 nm",
    speed: "Mach 0.83",
    hourlyRate: 7500,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1500&auto=format&fit=crop",
    description: "The most disruptive super-midsize aircraft with full fly-by-wire turbulence reduction technology, non-stop London to New York capability.",
    amenities: ["Fly-By-Wire", "Active Turbulence", "5,800ft Cabin Alt", "Direct Baggage Access"],
    cabinLength: "26 ft 8 in",
    cabinWidth: "6 ft 10 in",
    cabinHeight: "6 ft 0 in",
    baggage: "155 cu ft",
    soundLevel: "48 dBA",
    takeoffDist: "4,717 ft",
  },
  {
    id: "boeing-bbj",
    name: "Boeing Business Jet (BBJ)",
    class: "VIP Airliner",
    category: "vip",
    passengers: 25,
    range: "6,000 nm",
    speed: "Mach 0.82",
    hourlyRate: 20000,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1500&auto=format&fit=crop",
    description: "Palatial presidential widebody offering private dining rooms, king-size staterooms with rain showers, and space for large delegations.",
    amenities: ["Private Stateroom", "Rain Shower", "Conference Room", "Dining Room"],
    cabinLength: "79 ft 2 in",
    cabinWidth: "11 ft 6 in",
    cabinHeight: "7 ft 1 in",
    baggage: "640 cu ft",
    soundLevel: "48 dBA",
    takeoffDist: "6,400 ft",
  },
];

const availableAirports = [
  { code: "DWC", city: "Dubai", country: "UAE", name: "Al Maktoum Int'l (DWC)" },
  { code: "FAB", city: "London", country: "UK", name: "Farnborough VIP (FAB)" },
  { code: "TEB", city: "New York", country: "USA", name: "Teterboro VIP (TEB)" },
  { code: "BOM", city: "Mumbai", country: "India", name: "Chhatrapati Shivaji (BOM)" },
  { code: "LBG", city: "Paris", country: "France", name: "Le Bourget VIP (LBG)" },
  { code: "HND", city: "Tokyo", country: "Japan", name: "Haneda Executive (HND)" },
  { code: "ZRH", city: "Zurich", country: "Switzerland", name: "Zurich Private (ZRH)" },
  { code: "SIN", city: "Singapore", country: "Singapore", name: "Seletar Executive (XSP)" },
  { code: "NCE", city: "Nice", country: "France", name: "Nice Côte d'Azur (NCE)" },
];

const standards = [
  {
    icon: Utensils,
    title: "Michelin Gastronomy",
    desc: "Custom culinary experiences curated by Michelin-starred partners, paired with sommelier vintage reserves and rare single malts.",
  },
  {
    icon: ShieldCheck,
    title: "Discrete FBO Handling",
    desc: "Zero security lines. Direct tarmac limousine escort, VIP lounge access, and expedited international customs clearance.",
  },
  {
    icon: Award,
    title: "ARG/US Platinum Safety",
    desc: "Every aircraft and pilot in our network adheres to top 1% global safety accreditations, exceeding FAA and EASA standards.",
  },
  {
    icon: Wind,
    title: "High-Altitude Wellness",
    desc: "100% fresh HEPA-filtered cabin air exchange every 2 minutes with industry-lowest cabin pressure altitudes for zero jet lag.",
  },
];

export default function FleetShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [cabinModalOpen, setCabinModalOpen] = useState(false);
  
  // Interactive Charter Cost Calculator State
  const [calcOrigin, setCalcOrigin] = useState("DWC");
  const [calcDest, setCalcDest] = useState("FAB");
  const [calcPax, setCalcPax] = useState(4);
  const [calcJetId, setCalcJetId] = useState("gulfstream-g700");

  const { formatAmount } = useSkyLuxeStore();

  const selectedJet = privateJets.find((j) => j.id === calcJetId) || privateJets[0];

  // Route calculation heuristics
  const estimatedHours = calcOrigin === calcDest ? 1.5 : calcOrigin === "DWC" && calcDest === "FAB" ? 7.2 : calcOrigin === "BOM" && calcDest === "DWC" ? 3.5 : calcOrigin === "TEB" && calcDest === "LBG" ? 7.8 : 5.5;
  const estimatedNauticalMiles = Math.round(estimatedHours * 480);
  const calculatedCost = Math.round(selectedJet.hourlyRate * estimatedHours);

  const filteredJets =
    selectedCategory === "all"
      ? privateJets
      : privateJets.filter((j) => j.category === selectedCategory);

  const scrollToCatalog = () => {
    const el = document.getElementById("fleet-catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };


  return (
    <main className="relative min-h-screen bg-[#020202] flex flex-col overflow-x-hidden selection:bg-gold/30 selection:text-white">
      <GlassNavbar />

      {/* Composed Full-Bleed 3D Hero Section */}
      <section className="relative min-h-[92vh] lg:min-h-[98vh] flex flex-col justify-between overflow-hidden pt-32 sm:pt-36 pb-8 px-4 sm:px-6 lg:px-12 w-full">
        {/* Layer 0 & 1: 3D Model & Interactive Angle Toolbar */}
        <PrivateJetModelViewer />

        {/* Layer 10: Foreground Header Content (Directly over the aircraft) */}
        <div className="relative z-10 text-center max-w-4xl mx-auto flex-1 flex flex-col justify-center items-center pointer-events-none mt-2 sm:mt-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            {/* Live Operations Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-5 backdrop-blur-md pointer-events-auto shadow-[0_0_25px_rgba(0,0,0,0.8)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-gold font-medium">
                6-Hour Global Dispatch • Discrete FBO Boarding
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.08] mb-5 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
              The SkyLuxe{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-[#FFF8DC] to-gold">
                Fleet
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-platinum/80 font-light leading-relaxed max-w-2xl mb-8 drop-shadow-[0_2px_15px_rgba(0,0,0,0.95)]">
              Enter the vanguard of private aviation. A masterwork fleet of ultra-long-range jets, heavy executive flagships, and VIP widebodies curated for non-stop transcontinental voyages.
            </p>

            {/* Executive KPI Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 p-4 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-2xl mb-8 max-w-2xl w-full pointer-events-auto shadow-2xl">
              <div className="text-center">
                <span className="text-[10px] font-mono text-platinum/50 uppercase tracking-widest block mb-0.5">Max Speed</span>
                <span className="text-base sm:text-lg font-serif font-bold text-white">Mach 0.925</span>
              </div>
              <div className="text-center border-l border-white/10 pl-2 sm:pl-4">
                <span className="text-[10px] font-mono text-platinum/50 uppercase tracking-widest block mb-0.5">Nonstop Range</span>
                <span className="text-base sm:text-lg font-serif font-bold text-gold">7,700 nm</span>
              </div>
              <div className="text-center border-l border-white/10 pl-2 sm:pl-4">
                <span className="text-[10px] font-mono text-platinum/50 uppercase tracking-widest block mb-0.5">Cabin Capacity</span>
                <span className="text-base sm:text-lg font-serif font-bold text-white">Up to 25 Pax</span>
              </div>
              <div className="text-center border-l border-white/10 pl-2 sm:pl-4">
                <span className="text-[10px] font-mono text-platinum/50 uppercase tracking-widest block mb-0.5">Safety Audit</span>
                <span className="text-base sm:text-lg font-serif font-bold text-white">ARG/US Plat</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pointer-events-auto">
              <button
                onClick={scrollToCatalog}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-onyx font-bold text-sm shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_45px_rgba(212,175,55,0.65)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 group"
              >
                <span>Explore Aircraft Fleet</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setCompareModalOpen(true)}
                className="px-7 py-4 rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/15 text-white font-medium text-sm transition-all duration-300 flex items-center gap-2 hover:border-gold/40 backdrop-blur-md shadow-lg"
              >
                <Scale className="w-4 h-4 text-gold" />
                <span>Compare Flagships</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Layer 10: Hero Bottom Edge (Drag hint) */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-2 flex justify-end items-center text-[11px] font-mono text-platinum/40 pointer-events-none select-none pt-4">
          <span className="text-[11px] font-mono tracking-widest text-platinum/40 uppercase">
            Drag to explore aircraft & cabin
          </span>
        </div>
      </section>

      {/* VIP Empty-Leg & Repositioning Flash Opportunities */}
      <section className="relative z-10 py-8 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto w-full">
        <div className="rounded-2xl p-4 sm:p-6 bg-gradient-to-r from-gold/15 via-[#1A160D] to-gold/10 border border-gold/40 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_0_40px_rgba(212,175,55,0.15)]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-gold font-bold">
                  Exclusive Empty-Leg Repositioning
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Save up to 55%
                </span>
              </div>
              <p className="text-xs text-platinum/70 font-light mt-0.5">
                Immediate dispatch routes: <strong className="text-white">Dubai (DWC) ➔ London (FAB)</strong> • <strong className="text-white">New York (TEB) ➔ Nice (NCE)</strong> • Private cabin buyout.
              </p>
            </div>
          </div>

          <Link href="/flights/search?type=charter&emptylegs=true" className="shrink-0 w-full md:w-auto">
            <button className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gold text-onyx font-bold text-xs uppercase tracking-wider hover:bg-gold-light transition-all shadow-md flex items-center justify-center gap-1.5">
              <span>View Empty Legs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </section>

      {/* Jet Marketplace Catalog */}
      <section id="fleet-catalog" className="relative z-10 py-16 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto w-full">
        {/* Section Header & Category Filter Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-[10px] text-gold uppercase tracking-widest font-mono mb-3">
              Charter Inventory
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-2">
              Curated Private Aircraft
            </h2>
            <p className="text-platinum/60 text-sm sm:text-base font-light max-w-xl">
              Select any aircraft to customize passenger manifests, bespoke catering menus, and private chauffeur connections.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Fleet (6)" },
              { id: "ultra", label: "Ultra Long Range (2)" },
              { id: "heavy", label: "Heavy Jet (1)" },
              { id: "midsize", label: "Super Midsize (2)" },
              { id: "vip", label: "VIP Airliner (1)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                  selectedCategory === tab.id
                    ? "bg-gold text-onyx font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                    : "bg-white/[0.03] text-platinum/70 border border-white/10 hover:border-gold/40 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Aircraft Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredJets.map((jet, idx) => (
              <motion.div
                key={jet.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="glass-panel rounded-3xl border border-white/10 overflow-hidden group hover:border-gold/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(212,175,55,0.18)] flex flex-col bg-onyx/50 backdrop-blur-2xl"
              >
                {/* Aircraft Image Showcase */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-10" />
                  <img
                    src={jet.image}
                    alt={jet.name}
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 mix-blend-luminosity group-hover:mix-blend-normal"
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] text-gold uppercase tracking-widest font-mono">
                      {jet.class}
                    </span>
                  </div>

                  {/* Hourly Rate Estimate */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-gold/30 text-[11px] text-white font-mono font-medium">
                      from {formatAmount(jet.hourlyRate)}<span className="text-platinum/50 text-[10px]">/hr</span>
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-7 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-serif font-bold text-white group-hover:text-gold transition-colors">
                      {jet.name}
                    </h3>
                  </div>

                  <p className="text-xs text-platinum/60 font-light leading-relaxed mb-6 line-clamp-2">
                    {jet.description}
                  </p>

                  {/* Specs Matrix */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-white/[0.02] border border-white/5 mb-6">
                    <div className="text-center">
                      <span className="text-[9px] font-mono text-platinum/40 uppercase block">Pax</span>
                      <span className="text-xs font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                        <Users className="w-3 h-3 text-gold" /> {jet.passengers}
                      </span>
                    </div>
                    <div className="text-center border-l border-white/10">
                      <span className="text-[9px] font-mono text-platinum/40 uppercase block">Range</span>
                      <span className="text-xs font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                        <Globe className="w-3 h-3 text-gold" /> {jet.range}
                      </span>
                    </div>
                    <div className="text-center border-l border-white/10">
                      <span className="text-[9px] font-mono text-platinum/40 uppercase block">Speed</span>
                      <span className="text-xs font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                        <Zap className="w-3 h-3 text-gold" /> {jet.speed}
                      </span>
                    </div>
                  </div>

                  {/* Amenities Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {jet.amenities.map((amenity, aIdx) => (
                      <span
                        key={aIdx}
                        className="px-2.5 py-0.5 rounded-md bg-white/[0.03] border border-white/5 text-[10px] text-platinum/70 font-mono"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  {/* Configure Button */}
                  <div className="mt-auto">
                    <Link href={`/fleet/${jet.id}`}>
                      <button className="w-full py-3.5 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-gold hover:text-onyx hover:border-gold font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-md">
                        <span>Configure & Charter</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Global Nonstop Reach & Range Visualizer */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto w-full border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-gold block mb-3">
            Global Transcontinental Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
            Nonstop Global Reach
          </h2>
          <p className="text-platinum/60 text-base font-light">
            With over 7,700 nautical miles of non-stop endurance, connect any two economic capitals on earth without intermediate refueling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              hub: "London (Farnborough FAB)",
              destinations: [
                { city: "New York (TEB)", dist: "3,000 nm", time: "6h 45m", aircraft: "Gulfstream G700" },
                { city: "Tokyo (HND)", dist: "5,180 nm", time: "11h 20m", aircraft: "Global 7500" },
                { city: "Dubai (DWC)", dist: "2,980 nm", time: "6h 30m", aircraft: "Falcon 8X" },
                { city: "Singapore (XSP)", dist: "5,880 nm", time: "12h 40m", aircraft: "Global 7500" },
              ],
            },
            {
              hub: "Dubai (Al Maktoum DWC)",
              destinations: [
                { city: "New York (TEB)", dist: "5,950 nm", time: "13h 10m", aircraft: "Global 7500" },
                { city: "London (FAB)", dist: "2,980 nm", time: "6h 30m", aircraft: "Praetor 600" },
                { city: "Tokyo (HND)", dist: "4,280 nm", time: "9h 15m", aircraft: "Gulfstream G700" },
                { city: "Sydney (SYD)", dist: "6,500 nm", time: "14h 00m", aircraft: "Global 7500" },
              ],
            },
            {
              hub: "New York (Teterboro TEB)",
              destinations: [
                { city: "Paris (LBG)", dist: "3,150 nm", time: "7h 00m", aircraft: "Gulfstream G700" },
                { city: "Hong Kong (HKG)", dist: "7,020 nm", time: "15h 25m", aircraft: "Global 7500" },
                { city: "Los Angeles (VNY)", dist: "2,130 nm", time: "4h 45m", aircraft: "Challenger 650" },
                { city: "Buenos Aires (EZE)", dist: "4,600 nm", time: "10h 10m", aircraft: "Falcon 8X" },
              ],
            },
          ].map((pair, pIdx) => (
            <div
              key={pIdx}
              className="p-7 rounded-3xl bg-onyx/60 border border-white/10 hover:border-gold/40 transition-all duration-300 backdrop-blur-2xl"
            >
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
                <Compass className="w-5 h-5 text-gold" />
                <h3 className="font-serif font-bold text-lg text-white">{pair.hub}</h3>
              </div>
              <div className="space-y-4">
                {pair.destinations.map((dest, dIdx) => (
                  <div key={dIdx} className="flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-white font-bold block">{dest.city}</span>
                      <span className="text-platinum/40 text-[10px]">{dest.dist} • {dest.aircraft}</span>
                    </div>
                    <span className="text-gold font-bold bg-gold/10 px-2 py-1 rounded border border-gold/20">
                      {dest.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bespoke Cabin Atelier & Handcrafted Living Quarters */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto w-full border-t border-white/10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-gold block mb-3">
              Bespoke Interior Atelier
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-6 leading-tight">
              A Private Sanctuary Above the Weather
            </h2>
            <p className="text-platinum/70 text-base font-light leading-relaxed mb-6">
              Our flagship aircraft feature bespoke multi-zone cabins designed in collaboration with master European ateliers. From hand-stitched Poltrona Frau leather and open-pore Italian walnut to Lalique stemware and full stateroom rain showers.
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-gold font-bold block mb-1">Soleil Circadian Rhythm</span>
                <span className="text-platinum/60">Dynamic biological lighting aligned with arrival timezones.</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-gold font-bold block mb-1">WhisperQuiet Acoustics</span>
                <span className="text-platinum/60">Under 46 dBA cabin sound levels for restorative sleep.</span>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden h-60 border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1500&auto=format&fit=crop"
                alt="Executive Master Suite"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-serif font-bold text-white">Nuage Deep-Recline Suite</span>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-60 border border-white/10 mt-6">
              <img
                src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1500&auto=format&fit=crop"
                alt="VIP Boardroom Dining"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-serif font-bold text-white">Executive Conference Lounge</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Bespoke Route & Charter Cost Calculator */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto w-full border-t border-white/10">
        <div className="rounded-3xl p-8 sm:p-12 bg-onyx/80 border border-gold/30 backdrop-blur-2xl shadow-[0_0_60px_rgba(212,175,55,0.12)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-[10px] text-gold uppercase tracking-widest font-mono mb-3">
                <Calculator className="w-3 h-3 text-gold" />
                Live Charter Estimator
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                Bespoke Flight Estimator
              </h2>
              <p className="text-platinum/60 text-sm font-light mt-1">
                Configure customized city pairs, passenger headcount, and flagship aircraft in real time.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> 100% SAF Carbon Offset Included
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Origin & Destination Pair */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-platinum/50 block mb-2">
                    Departure FBO
                  </label>
                  <select
                    value={calcOrigin}
                    onChange={(e) => setCalcOrigin(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-gold"
                  >
                    {availableAirports.map((apt) => (
                      <option key={apt.code} value={apt.code} className="bg-[#111114] text-white">
                        {apt.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-platinum/50 block mb-2">
                    Arrival FBO
                  </label>
                  <select
                    value={calcDest}
                    onChange={(e) => setCalcDest(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-gold"
                  >
                    {availableAirports.map((apt) => (
                      <option key={apt.code} value={apt.code} className="bg-[#111114] text-white">
                        {apt.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Aircraft Model Selector */}
              <div>
                <label className="text-xs font-mono uppercase tracking-widest text-platinum/50 block mb-2">
                  Select Flagship Aircraft
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {privateJets.map((jet) => (
                    <button
                      key={jet.id}
                      onClick={() => setCalcJetId(jet.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        calcJetId === jet.id
                          ? "bg-gold/15 border-gold text-white shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                          : "bg-white/[0.02] border-white/10 text-platinum/70 hover:border-white/20"
                      }`}
                    >
                      <span className="text-xs font-serif font-bold block text-white truncate">{jet.name}</span>
                      <span className="text-[10px] font-mono text-gold block">{formatAmount(jet.hourlyRate)}/hr</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Passengers Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-mono uppercase tracking-widest text-platinum/50">
                    Manifest Passengers
                  </label>
                  <span className="text-xs font-mono text-gold font-bold">{calcPax} Passengers</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={selectedJet.passengers}
                  value={calcPax}
                  onChange={(e) => setCalcPax(Number(e.target.value))}
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
              </div>
            </div>

            {/* Calculated Output Card */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#12110C] via-[#0A0A0A] to-onyx border border-gold/30 shadow-[0_0_50px_rgba(212,175,55,0.15)]">
              <div>
                {/* Live Animated Flight Radar Path */}
                <div className="p-4 rounded-xl bg-black/60 border border-white/10 mb-5 relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-white font-bold">{calcOrigin}</span>
                    </div>
                    <div className="text-[10px] text-gold uppercase tracking-wider font-mono">
                      FL490 • Mach 0.90 Direct
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{calcDest}</span>
                      <span className="w-2 h-2 rounded-full bg-gold" />
                    </div>
                  </div>

                  {/* Visual Flight Arc */}
                  <div className="relative h-6 flex items-center justify-center">
                    <div className="w-full border-t border-dashed border-gold/40 relative">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black border border-gold text-[9px] font-mono text-gold flex items-center gap-1">
                        <Plane className="w-3 h-3 text-gold" />
                        <span>{estimatedHours}h Non-Stop</span>
                      </div>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono uppercase tracking-widest text-platinum/40 block mb-1">
                  Estimated Charter Investment
                </span>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
                  {formatAmount(calculatedCost)}
                  <span className="text-xs font-mono text-platinum/50 font-normal ml-2">Total Direct</span>
                </div>

                <div className="space-y-3 pb-6 border-b border-white/10 text-xs font-mono">
                  <div className="flex justify-between text-platinum/70">
                    <span>Flight Time (Mach 0.90):</span>
                    <span className="text-white font-bold">{estimatedHours} hrs non-stop</span>
                  </div>
                  <div className="flex justify-between text-platinum/70">
                    <span>Estimated Distance:</span>
                    <span className="text-white font-bold">{estimatedNauticalMiles.toLocaleString()} nm</span>
                  </div>
                  <div className="flex justify-between text-platinum/70">
                    <span>Selected Aircraft:</span>
                    <span className="text-gold font-bold">{selectedJet.name}</span>
                  </div>
                  <div className="flex justify-between text-platinum/70">
                    <span>VIP Ground Handling:</span>
                    <span className="text-white font-bold">Discrete FBO Included</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-3">
                <Link href={`/fleet/${selectedJet.id}`}>
                  <button className="w-full py-4 rounded-xl bg-gradient-to-r from-gold via-gold-light to-gold text-onyx font-bold text-sm shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] transition-all flex items-center justify-center gap-2">
                    <span>Proceed to Custom Configuration</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <button
                  onClick={() => setCabinModalOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-platinum text-xs font-mono transition-all flex items-center justify-center gap-2"
                >
                  <Maximize className="w-3.5 h-3.5 text-gold" />
                  <span>Inspect Master Cabin & Stateroom Layout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The SkyLuxe Aviation Standard: Bespoke Experience Pillars */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto w-full border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-gold block mb-3">
            Prestige & Precision
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
            The SkyLuxe Standard
          </h2>
          <p className="text-platinum/60 text-base font-light">
            Every flight is an uncompromising sanctuary of luxury, privacy, and absolute operational perfection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {standards.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-gold/40 transition-all duration-300 flex flex-col group hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]"
              >
                <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-6 shadow-[0_0_20px_rgba(212,175,55,0.15)] group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-white mb-3">{s.title}</h3>
                <p className="text-sm text-platinum/60 font-light leading-relaxed">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* VIP Private Aviation Jet Card & Membership Programs */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto w-full border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-gold block mb-3">
            Bespoke Access Programs
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
            Aviation Membership Tiers
          </h2>
          <p className="text-platinum/60 text-base font-light">
            Guaranteed aircraft availability with as little as 6 hours notice worldwide. Fixed hourly rates and zero repositioning fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              tier: "SkyLuxe 25-Hour Jet Card",
              price: "$225,000",
              sub: "Pre-purchased flight hours",
              features: [
                "Guaranteed availability with 24hr notice",
                "Fixed all-inclusive hourly rate",
                "No repositioning or ferry fees",
                "Complimentary cabin catering tier 1",
              ],
              cta: "Acquire Jet Card",
              popular: false,
            },
            {
              tier: "SkyLuxe Sovereign Club",
              price: "$495,000",
              sub: "Flagship global access",
              features: [
                "Guaranteed availability with 6hr notice",
                "Dedicated private flight director",
                "Rolls-Royce tarmac transfers",
                "Michelin star culinary curation",
                "Complimentary empty-leg allocations",
              ],
              cta: "Apply for Sovereign",
              popular: true,
            },
            {
              tier: "Bespoke Tail Allocation",
              price: "Custom",
              sub: "Dedicated tail ownership & management",
              features: [
                "Custom livery and interior customization",
                "100% bespoke flight crew allocation",
                "Charter revenue offset program",
                "Turnkey maintenance and hangarage",
              ],
              cta: "Consult Aviation Director",
              popular: false,
            },
          ].map((prog, pIdx) => (
            <div
              key={pIdx}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                prog.popular
                  ? "bg-gradient-to-b from-[#1E1A0F] to-onyx border-2 border-gold shadow-[0_0_50px_rgba(212,175,55,0.25)]"
                  : "bg-white/[0.02] border border-white/10 hover:border-gold/40"
              }`}
            >
              {prog.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gold text-onyx font-bold text-[10px] uppercase font-mono tracking-widest shadow-md">
                  Most Requested Tier
                </div>
              )}
              <div>
                <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-2">{prog.tier}</span>
                <div className="text-3xl font-serif font-bold text-white mb-1">{prog.price}</div>
                <span className="text-xs text-platinum/50 font-mono block mb-6">{prog.sub}</span>

                <div className="space-y-3 pb-8 border-b border-white/10 text-xs">
                  {prog.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2.5 text-platinum/80">
                      <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <Link href="/membership">
                  <button
                    className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                      prog.popular
                        ? "bg-gold text-onyx hover:bg-gold-light shadow-lg"
                        : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    {prog.cta}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VIP Charter Advisory Banner */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto w-full">
        <div className="relative rounded-3xl overflow-hidden border border-gold/30 p-8 sm:p-14 bg-gradient-to-r from-onyx via-[#14120B] to-onyx shadow-[0_0_50px_rgba(212,175,55,0.15)] flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Decorative ambient gold glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(212,175,55,0.12)_0%,transparent_70%)] blur-3xl pointer-events-none" />

          <div className="max-w-2xl relative z-10">
            <span className="px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-[10px] text-gold uppercase tracking-widest font-mono inline-block mb-4">
              Executive Flight Operations
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4 leading-tight">
              Ready for Departure?
            </h2>
            <p className="text-platinum/70 text-base font-light leading-relaxed">
              Connect with your dedicated SkyLuxe Aviation Director for custom global fleet charters, diplomatic transfers, or private aircraft acquisition.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto relative z-10">
            <Link href="/contact" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold text-onyx font-bold text-sm shadow-[0_0_30px_rgba(212,175,55,0.35)] hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] transition-all duration-300 text-center">
                Speak with an Advisor
              </button>
            </Link>
            <Link href="/membership" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/15 text-white font-medium text-sm transition-all duration-300 text-center">
                Explore Memberships
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Flagship Aircraft Comparison Modal Dialog */}
      <AnimatePresence>
        {compareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCompareModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0C0C0F] border border-gold/40 p-6 sm:p-10 shadow-[0_0_80px_rgba(212,175,55,0.2)] custom-scrollbar"
            >
              <div className="flex justify-between items-center pb-6 border-b border-white/10 mb-8">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold block">
                    Engineering & Cabin Architecture
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    Flagship Aircraft Comparison
                  </h3>
                </div>
                <button
                  onClick={() => setCompareModalOpen(false)}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-platinum hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-platinum/50 uppercase tracking-wider">
                      <th className="py-4 pr-6">Specification</th>
                      {privateJets.slice(0, 3).map((jet) => (
                        <th key={jet.id} className="py-4 px-4 text-white font-serif text-sm">
                          {jet.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-platinum/80">
                    <tr>
                      <td className="py-3.5 pr-6 text-platinum/50">Class Category</td>
                      {privateJets.slice(0, 3).map((j) => (
                        <td key={j.id} className="py-3.5 px-4 text-gold font-bold">{j.class}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-6 text-platinum/50">Max Nonstop Range</td>
                      {privateJets.slice(0, 3).map((j) => (
                        <td key={j.id} className="py-3.5 px-4 font-bold text-white">{j.range}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-6 text-platinum/50">Max Cruise Speed</td>
                      {privateJets.slice(0, 3).map((j) => (
                        <td key={j.id} className="py-3.5 px-4">{j.speed}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-6 text-platinum/50">Pax Capacity</td>
                      {privateJets.slice(0, 3).map((j) => (
                        <td key={j.id} className="py-3.5 px-4">{j.passengers} Passengers</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-6 text-platinum/50">Cabin Dimensions (L × W × H)</td>
                      {privateJets.slice(0, 3).map((j) => (
                        <td key={j.id} className="py-3.5 px-4">{j.cabinLength} × {j.cabinWidth} × {j.cabinHeight}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-6 text-platinum/50">Baggage Capacity</td>
                      {privateJets.slice(0, 3).map((j) => (
                        <td key={j.id} className="py-3.5 px-4">{j.baggage}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-6 text-platinum/50">Acoustic Signature</td>
                      {privateJets.slice(0, 3).map((j) => (
                        <td key={j.id} className="py-3.5 px-4 text-emerald-400 font-bold">{j.soundLevel}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-6 text-platinum/50">Required Takeoff Distance</td>
                      {privateJets.slice(0, 3).map((j) => (
                        <td key={j.id} className="py-3.5 px-4">{j.takeoffDist}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 pr-6 text-platinum/50">Direct Charter</td>
                      {privateJets.slice(0, 3).map((j) => (
                        <td key={j.id} className="py-4 px-4">
                          <Link href={`/fleet/${j.id}`} onClick={() => setCompareModalOpen(false)}>
                            <button className="px-3 py-1.5 rounded-lg bg-gold text-onyx font-bold text-xs hover:bg-gold-light transition-all">
                              Configure →
                            </button>
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cabin Stateroom Atelier Modal Dialog */}
      <AnimatePresence>
        {cabinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCabinModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0D0D10] border border-gold/40 p-6 sm:p-10 shadow-[0_0_80px_rgba(212,175,55,0.25)] custom-scrollbar"
            >
              <div className="flex justify-between items-center pb-6 border-b border-white/10 mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold block">
                    Bespoke Multi-Zone Architecture
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    {selectedJet.name} — Cabin Stateroom Deck Plan
                  </h3>
                </div>
                <button
                  onClick={() => setCabinModalOpen(false)}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-platinum hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Master Stateroom Visual */}
              <div className="relative rounded-2xl overflow-hidden h-72 border border-white/15 mb-6">
                <img
                  src={selectedJet.image}
                  alt={selectedJet.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end p-6">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-[10px] font-mono uppercase tracking-widest text-gold mb-2 inline-block">
                      Private Master Suite
                    </span>
                    <h4 className="text-xl font-serif font-bold text-white">
                      Acoustic Isolation & Restorative Bedding
                    </h4>
                  </div>
                </div>
              </div>

              {/* Cabin Zones Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <span className="text-xs font-mono text-gold font-bold block mb-1">Zone 1: Forward Galley</span>
                  <p className="text-xs text-platinum/70">Convection oven, espresso bar, sommelier wine cellar, and crew rest area.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <span className="text-xs font-mono text-gold font-bold block mb-1">Zone 2: Executive Club</span>
                  <p className="text-xs text-platinum/70">Four Nuage wide-body seats with fold-out conference table and 4K display.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <span className="text-xs font-mono text-gold font-bold block mb-1">Zone 3: Master Suite</span>
                  <p className="text-xs text-platinum/70">Lie-flat JetBed stateroom with en-suite shower and direct baggage access.</p>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <Link href={`/fleet/${selectedJet.id}`} onClick={() => setCabinModalOpen(false)}>
                  <button className="px-6 py-3 rounded-xl bg-gold text-onyx font-bold text-xs uppercase tracking-wider hover:bg-gold-light transition-all flex items-center gap-2">
                    <span>Configure Full Interior & Manifest</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
