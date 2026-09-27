"use client";

import { motion, AnimatePresence } from "framer-motion";
import GlassNavbar from "@/components/ui/GlassNavbar";
import {
  ArrowRight,
  Plane,
  MapPin,
  Calendar,
  Search,
  Crown,
  Sparkles,
  ShieldCheck,
  Coffee,
  Utensils,
  Wifi,
  Luggage,
  Award,
  Globe,
  CheckCircle2,
  Tv,
  Wine,
  Sliders,
  Maximize2,
  ChevronRight,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LuxuryDatePicker from "@/components/ui/LuxuryDatePicker";
import CityAirportSelect from "@/components/ui/CityAirportSelect";
import { useSkyLuxeStore } from "@/store/skyluxeStore";
import Link from "next/link";

interface CabinTier {
  id: string;
  name: string;
  badge: string;
  image: string;
  tagline: string;
  pitch: string;
  bed: string;
  dining: string;
  baggage: string;
  perks: string[];
}

const cabinTiers: CabinTier[] = [
  {
    id: "first",
    name: "First Class Suites",
    badge: "Pinnacle Luxury",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1500&auto=format&fit=crop",
    tagline: "Private enclosed stateroom with sliding doors, lie-flat bed, and vintage champagne cellar.",
    pitch: "82-84 inches",
    bed: "180° Full Lie-Flat Bed",
    dining: "Caviar & Dom Pérignon on Demand",
    baggage: "64 kg + 2 Cabin Bags",
    perks: ["Private Suite Sliding Door", "Bvlgari Amenity Kit", "First Class Lounge & Spa", "Tarmac Chauffeur Transfer"],
  },
  {
    id: "business",
    name: "Lie-Flat Business Class",
    badge: "Executive Standard",
    image: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=1500&auto=format&fit=crop",
    tagline: "Direct aisle access, 180-degree flatbed suites, multi-course dining, and noise-canceling headsets.",
    pitch: "76-79 inches",
    bed: "180° Flatbed with Mattress",
    dining: "Multi-Course Gourmet Menu",
    baggage: "40 kg + 2 Cabin Bags",
    perks: ["Direct Aisle Access (1-2-1)", "Pre-Flight Lounge Access", "High-Speed Ka-Band WiFi", "Priority Fast-Track Security"],
  },
  {
    id: "premium-economy",
    name: "Premium Economy",
    badge: "Elevated Comfort",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1500&auto=format&fit=crop",
    tagline: "Dedicated quiet cabin with 8 inches extra legroom, wider leather seats, and premium dining service.",
    pitch: "38-40 inches",
    bed: "8-inch Deep Recline & Footrest",
    dining: "Plated Chef Meals & Fine Wine",
    baggage: "35 kg + 1 Cabin Bag",
    perks: ["Dedicated Cabin Section", "Priority Check-in & Boarding", "Noise-Canceling Audio", "Universal In-Seat Power"],
  },
];

const trendingRoutes = [
  {
    from: "BOM",
    fromCity: "Mumbai (BOM)",
    to: "DXB",
    toCity: "Dubai (DXB)",
    price: 450,
    airline: "Emirates",
    aircraft: "Airbus A380-800",
    cabin: "Business Class Suite",
    flightTime: "3h 30m",
  },
  {
    from: "DEL",
    fromCity: "Delhi (DEL)",
    to: "LHR",
    toCity: "London (LHR)",
    price: 1850,
    airline: "Air India / Virgin",
    aircraft: "Boeing 787-9 Dreamliner",
    cabin: "Lie-Flat Business",
    flightTime: "9h 15m",
  },
  {
    from: "BOM",
    fromCity: "Mumbai (BOM)",
    to: "SIN",
    toCity: "Singapore (SIN)",
    price: 680,
    airline: "Singapore Airlines",
    aircraft: "Airbus A350-900",
    cabin: "First Class Suite",
    flightTime: "5h 25m",
  },
  {
    from: "JFK",
    fromCity: "New York (JFK)",
    to: "CDG",
    toCity: "Paris (CDG)",
    price: 2400,
    airline: "Air France",
    aircraft: "Boeing 777-300ER",
    cabin: "La Première Suite",
    flightTime: "7h 10m",
  },
];

const prestigeAirlines = [
  { name: "Emirates", alliance: "Global Partner", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/1200px-Emirates_logo.svg.png" },
  { name: "Singapore Airlines", alliance: "Star Alliance", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/1200px-Singapore_Airlines_Logo_2.svg.png" },
  { name: "Qatar Airways", alliance: "oneworld", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Qatar_Airways_Logo.svg/1200px-Qatar_Airways_Logo.svg.png" },
  { name: "Air India", alliance: "Star Alliance", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Air_India_Logo.svg/1200px-Air_India_Logo.svg.png" },
  { name: "Vistara", alliance: "SkyLuxe Preferred", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Vistara_Logo.svg/1200px-Vistara_Logo.svg.png" },
  { name: "Etihad Airways", alliance: "Global Partner", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Etihad_Airways_logo.svg/1200px-Etihad_Airways_logo.svg.png" },
];

export default function CommercialSearch() {
  const router = useRouter();
  const { formatAmount } = useSkyLuxeStore();
  const [tripType, setTripType] = useState("one-way");
  const [fromCity, setFromCity] = useState("Mumbai (BOM)");
  const [toCity, setToCity] = useState("Dubai (DXB)");
  const [selectedCabin, setSelectedCabin] = useState<string>("business");
  const [passengers, setPassengers] = useState(1);
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const fromCode = fromCity.match(/\(([^)]+)\)/)?.[1] || "BOM";
    const toCode = toCity.match(/\(([^)]+)\)/)?.[1] || "DXB";
    router.push(
      `/flights/search?from=${fromCode}&to=${toCode}&date=${date}&type=${tripType}&class=${selectedCabin}&passengers=${passengers}`
    );
  };

  const selectTrendingRoute = (r: typeof trendingRoutes[0]) => {
    setFromCity(r.fromCity);
    setToCity(r.toCity);
    const fromCode = r.from;
    const toCode = r.to;
    router.push(
      `/flights/search?from=${fromCode}&to=${toCode}&date=${date}&type=one-way&class=business&passengers=1`
    );
  };

  return (
    <main className="relative min-h-screen bg-[#020202] flex flex-col overflow-x-hidden selection:bg-gold/30 selection:text-white">
      <GlassNavbar />

      {/* Cinematic Commercial Aviation Hero Section */}
      <section className="relative min-h-[95vh] pt-32 sm:pt-36 pb-20 flex items-center justify-center px-4 sm:px-6 lg:px-12 w-full overflow-hidden">
        {/* Background Video / Atmospheric Image with Ambient Vignette */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#020202] z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] z-10 pointer-events-none" />
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2500&auto=format&fit=crop"
            alt="First Class Commercial Aviation"
            className="w-full h-full object-cover opacity-35 scale-105"
          />
        </div>

        <div className="relative z-20 max-w-6xl mx-auto w-full flex flex-col items-center">
          {/* Header Title & Live Status */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-8 sm:mb-10 max-w-4xl"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-5 backdrop-blur-md shadow-2xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-gold font-medium">
                Global Network • 180+ Airlines • First & Business Class Suites
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white tracking-tight leading-[1.08] mb-5 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
              The Art of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-[#FFF8DC] to-gold">
                Commercial Luxury
              </span>
            </h1>

            <p className="text-base sm:text-lg text-platinum/80 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-md">
              Discover unparalleled comfort across the world’s most prestigious airlines. Reserve private enclosed suites, lie-flat business flatbeds, and priority lounge access worldwide.
            </p>
          </motion.div>

          {/* Ultra-Luxury Commercial Search Engine */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="w-full glass-panel p-6 sm:p-8 rounded-3xl border border-gold/30 shadow-[0_0_60px_rgba(212,175,55,0.12)] backdrop-blur-2xl bg-onyx/85 max-w-5xl"
          >
            <form onSubmit={handleSearch}>
              {/* Trip Type & Cabin Class Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
                {/* Trip Type Radios */}
                <div className="flex flex-wrap gap-4 sm:gap-6 font-mono text-xs uppercase tracking-wider">
                  {[
                    { id: "one-way", label: "One Way" },
                    { id: "round-trip", label: "Round Trip" },
                    { id: "multi-city", label: "Multi-City" },
                  ].map((t) => (
                    <label
                      key={t.id}
                      className="flex items-center gap-2 cursor-pointer text-platinum/70 hover:text-white transition-colors"
                    >
                      <input
                        type="radio"
                        name="tripType"
                        checked={tripType === t.id}
                        onChange={() => setTripType(t.id)}
                        className="accent-[#D4AF37]"
                      />
                      <span className={tripType === t.id ? "text-gold font-bold" : ""}>{t.label}</span>
                    </label>
                  ))}
                </div>

                {/* Cabin Class Selector Pills */}
                <div className="flex flex-wrap gap-1.5 p-1 bg-white/[0.03] border border-white/10 rounded-2xl">
                  {[
                    { id: "first", label: "First Suite" },
                    { id: "business", label: "Business" },
                    { id: "premium-economy", label: "Premium Eco" },
                    { id: "economy", label: "Economy" },
                  ].map((cabin) => (
                    <button
                      type="button"
                      key={cabin.id}
                      onClick={() => setSelectedCabin(cabin.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                        selectedCabin === cabin.id
                          ? "bg-gold text-onyx font-bold shadow-[0_0_15px_rgba(212,175,55,0.35)]"
                          : "text-platinum/60 hover:text-white"
                      }`}
                    >
                      {cabin.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-4">
                  <CityAirportSelect
                    label="Departure Airport"
                    value={fromCity}
                    onChange={(val) => setFromCity(val)}
                  />
                </div>

                <div className="md:col-span-4">
                  <CityAirportSelect
                    label="Arrival Destination"
                    value={toCity}
                    onChange={(val) => setToCity(val)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-2 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-gold" /> Travel Date
                  </label>
                  <LuxuryDatePicker
                    value={date}
                    onChange={(newDate) => setDate(newDate)}
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full h-[54px] rounded-xl bg-gradient-to-r from-gold via-gold-light to-gold text-onyx font-bold text-sm shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Flights</span>
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Trending Commercial Luxury Routes */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-gold block mb-2">
              Curated Fares
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
              Trending Global Business & First Routes
            </h2>
          </div>
          <span className="text-xs font-mono text-platinum/50">
            Real-time live pricing with SkyLuxe Elite privileges
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingRoutes.map((route, rIdx) => (
            <motion.div
              key={rIdx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: rIdx * 0.08 }}
              onClick={() => selectTrendingRoute(route)}
              className="p-6 rounded-3xl bg-onyx/60 border border-white/10 hover:border-gold/50 transition-all duration-300 group cursor-pointer hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col justify-between backdrop-blur-xl"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-platinum/50 mb-3">
                  <span>{route.airline}</span>
                  <span className="text-gold font-bold">{route.cabin}</span>
                </div>

                <div className="flex items-center justify-between text-white font-serif font-bold text-xl mb-1">
                  <span>{route.from}</span>
                  <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
                  <span>{route.to}</span>
                </div>

                <p className="text-xs text-platinum/60 font-light mb-4">
                  {route.aircraft} • {route.flightTime}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono uppercase text-platinum/40 block">From</span>
                  <span className="text-lg font-serif font-bold text-white">
                    {formatAmount(route.price)}
                  </span>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gold text-xs font-mono group-hover:bg-gold group-hover:text-onyx transition-all">
                  Book →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The 4 Commercial Cabin Standards Showcase */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-gold block mb-3">
            Cabin Tier Masterclasses
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
            The SkyLuxe Commercial Standard
          </h2>
          <p className="text-platinum/60 text-base font-light">
            Every booking is backed by full seat-map inspection, bespoke meal selection, and seamless airport fast-track handling.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {cabinTiers.map((tier, tIdx) => (
            <div
              key={tier.id}
              className="rounded-3xl border border-white/10 bg-onyx/70 backdrop-blur-2xl overflow-hidden flex flex-col hover:border-gold/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(212,175,55,0.15)] group"
            >
              {/* Image Showcase */}
              <div className="relative h-60 overflow-hidden">
                <img
                  src={tier.image}
                  alt={tier.name}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-black/70 border border-white/15 text-[10px] text-gold uppercase tracking-widest font-mono">
                    {tier.badge}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-2 group-hover:text-gold transition-colors">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-platinum/70 font-light leading-relaxed mb-6">
                    {tier.tagline}
                  </p>

                  <div className="space-y-3 pb-6 border-b border-white/10 text-xs font-mono">
                    <div className="flex justify-between text-platinum/80">
                      <span className="text-platinum/40">Seat Pitch:</span>
                      <span className="text-white font-bold">{tier.pitch}</span>
                    </div>
                    <div className="flex justify-between text-platinum/80">
                      <span className="text-platinum/40">Bed Type:</span>
                      <span className="text-gold font-bold">{tier.bed}</span>
                    </div>
                    <div className="flex justify-between text-platinum/80">
                      <span className="text-platinum/40">Gastronomy:</span>
                      <span className="text-white font-bold">{tier.dining}</span>
                    </div>
                    <div className="flex justify-between text-platinum/80">
                      <span className="text-platinum/40">Baggage:</span>
                      <span className="text-white font-bold">{tier.baggage}</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="pt-6 space-y-2 mb-6">
                    {tier.perks.map((perk, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2 text-xs text-platinum/70">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedCabin(tier.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full py-3.5 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-gold hover:text-onyx hover:border-gold font-bold text-xs uppercase tracking-wider font-mono transition-all flex items-center justify-center gap-2"
                >
                  <span>Search {tier.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Global Airline Alliances & Commercial Partners */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full relative z-10 border-t border-white/10">
        <div className="text-center mb-12">
          <span className="text-xs font-mono text-gold uppercase tracking-[0.25em] block mb-2">
            Global Airline Alliances
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            180+ World-Class Commercial Airlines
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 items-center">
          {prestigeAirlines.map((airline, aIdx) => (
            <div
              key={aIdx}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-gold/40 transition-all flex flex-col items-center text-center group"
            >
              <img
                src={airline.logo}
                alt={airline.name}
                className="h-10 object-contain filter grayscale group-hover:grayscale-0 transition-all mb-3 opacity-75 group-hover:opacity-100"
              />
              <span className="text-xs font-bold text-white block">{airline.name}</span>
              <span className="text-[10px] font-mono text-platinum/40 block mt-0.5">{airline.alliance}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

