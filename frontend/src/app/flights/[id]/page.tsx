"use client";

import { motion } from "framer-motion";
import GlassNavbar from "@/components/ui/GlassNavbar";
import { 
  ArrowRight, 
  Plane, 
  Shield, 
  ShieldCheck, 
  Coffee, 
  Wifi, 
  Luggage, 
  Star, 
  Compass, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  Info
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

const flightDetailDB: Record<string, any> = {
  "AI-101": { airline: "Air India", name: "Maharaja Business Suite", aircraft: "Airbus A350-900", price: 350, meal: "Indian Heritage Tasting Menu", lounge: "BOM Lounge Prime", wifi: "High-Speed complimentary", stops: "Nonstop" },
  "UK-202": { airline: "Vistara", name: "Premium Club Flatbed", aircraft: "Boeing 787-9 Dreamliner", price: 420, meal: "Michelin Inspired Multi-Course", lounge: "Vistara Signature Lounge", wifi: "Complimentary for Business", stops: "Nonstop" },
  "6E-303": { airline: "IndiGo", name: "IndiGo Stretch (Premium Economy)", aircraft: "Airbus A321neo", price: 180, meal: "Snack Box (Gourmet Sandwich)", lounge: "Standard Terminal Lounge (+$45)", wifi: "Offline Streaming Only", stops: "Nonstop" },
  "EK-505": { airline: "Emirates", name: "First Class Private Suite", aircraft: "Boeing 777-300ER", price: 780, meal: "Caviar & Dom Perignon Pairing", lounge: "Emirates First Class FBO Lounge", wifi: "Unlimited high-speed", stops: "Nonstop" },
  "QP-404": { airline: "Akasa Air", name: "Akasa Economy", aircraft: "Boeing 737 MAX 8", price: 160, meal: "Cafe Akasa Gourmet Box", lounge: "No Lounge Access", wifi: "Offline Media Console", stops: "Nonstop" },
  "AI-102": { airline: "Air India", name: "Maharaja First Class Suite", aircraft: "Boeing 777-300ER", price: 890, meal: "Heritage Tasting Menu & Vintage Pairings", lounge: "Air India Sovereign Lounge", wifi: "High-speed complimentary", stops: "Nonstop" },
  "EK-506": { airline: "Emirates", name: "Emirates Business Class", aircraft: "Airbus A350-900", price: 490, meal: "Gourmet Arabic Fusion", lounge: "Emirates Premium Lounge", wifi: "Complimentary for members", stops: "Nonstop" }
};

const aircraftData: Record<string, any> = {
  "Airbus A350-900": {
    name: "Airbus A350-900",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800",
    specs: {
      range: "8,100 nm (15,000 km)",
      speed: "Mach 0.89 (950 km/h)",
      capacity: "325 passengers",
      length: "66.8 m",
      wingspan: "64.7 m"
    },
    layout: "First Suite (1-2-1) • Business (1-2-1) • Premium Economy (2-4-2)"
  },
  "Boeing 787-9 Dreamliner": {
    name: "Boeing 787-9 Dreamliner",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800",
    specs: {
      range: "7,530 nm (13,950 km)",
      speed: "Mach 0.85 (903 km/h)",
      capacity: "296 passengers",
      length: "62.8 m",
      wingspan: "60.1 m"
    },
    layout: "Business Suite (1-2-1) • Premium Economy (2-3-2) • Economy (3-3-3)"
  },
  "Boeing 777-300ER": {
    name: "Boeing 777-300ER",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800",
    specs: {
      range: "7,370 nm (13,650 km)",
      speed: "Mach 0.84 (892 km/h)",
      capacity: "396 passengers",
      length: "73.9 m",
      wingspan: "64.8 m"
    },
    layout: "First Suite (1-2-1) • Business Flatbed (2-2-2) • Economy (3-4-3)"
  },
  "Airbus A321neo": {
    name: "Airbus A321neo",
    image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=800",
    specs: {
      range: "4,000 nm (7,400 km)",
      speed: "Mach 0.78 (833 km/h)",
      capacity: "220 passengers",
      length: "44.5 m",
      wingspan: "35.8 m"
    },
    layout: "Business Class (2-2) • Economy Class (3-3)"
  },
  "Boeing 737 MAX 8": {
    name: "Boeing 737 MAX 8",
    image: "https://images.unsplash.com/photo-1520437358207-3dbf5879e3c6?q=80&w=800",
    specs: {
      range: "3,550 nm (6,570 km)",
      speed: "Mach 0.79 (842 km/h)",
      capacity: "178 passengers",
      length: "39.5 m",
      wingspan: "35.9 m"
    },
    layout: "Business Class (2-2) • Economy Class (3-3)"
  }
};

function DetailsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const flightId = (params?.id as string) || "AI-101";
  const fromCode = searchParams.get("from") || "BOM";
  const toCode = searchParams.get("to") || "DXB";
  const dateStr = searchParams.get("date") || "2026-06-04";
  const passengers = Number(searchParams.get("passengers")) || 1;

  const flight = flightDetailDB[flightId] || flightDetailDB["AI-101"];
  const aircraftInfo = aircraftData[flight.aircraft] || aircraftData["Airbus A350-900"];

  const fareTotal = flight.price * passengers;
  const fboFee = 45 * passengers;
  const taxes = Math.round(flight.price * 0.12 * passengers);
  const totalDue = fareTotal + fboFee + taxes;

  const [activeTab, setActiveTab] = useState<"specs" | "baggage" | "fare" | "rules">("specs");

  return (
    <div className="relative z-10 flex-grow flex flex-col pt-32 pb-24 px-6 lg:px-16 max-w-5xl mx-auto w-full">
      <Link href={`/flights/search?from=${fromCode}&to=${toCode}&date=${dateStr}`} className="text-platinum/50 hover:text-white transition-colors text-xs font-mono uppercase mb-8 flex items-center gap-2">
        ← Back to Search Manifests
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden bg-onyx/85"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        {/* Flight Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 border-b border-white/5 pb-8">
          <div>
            <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-[10px] text-gold uppercase tracking-widest mb-3 inline-block font-mono">
              {flight.name}
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2">{flight.airline} {flightId}</h1>
            <p className="text-platinum/50 text-sm">{flight.aircraft} • Scheduled Carrier</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-platinum/50 uppercase tracking-widest block mb-1 font-mono">Base Tariff</span>
            <span className="text-4xl font-bold text-white font-serif">${flight.price}</span>
          </div>
        </div>

        {/* Flight Overview Grid */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-10 text-center">
          <div>
            <h3 className="text-3xl font-serif text-white font-bold">{fromCode}</h3>
            <p className="text-platinum/50 text-xs mt-1">Departure FBO</p>
            <p className="text-white text-sm font-medium mt-2 font-mono">09:00 AM</p>
          </div>
          <div className="flex flex-col items-center">
            <Plane className="w-5 h-5 text-gold mb-1" />
            <div className="w-full border-t border-dashed border-white/20 relative my-2">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-onyx-light border border-white/5 px-3 py-0.5 rounded-full text-[9px] text-platinum/50 font-mono">{flight.stops}</span>
            </div>
            <p className="text-[10px] text-platinum/40 font-mono">Duration: 3h 30m</p>
          </div>
          <div>
            <h3 className="text-3xl font-serif text-white font-bold">{toCode}</h3>
            <p className="text-platinum/50 text-xs mt-1">Arrival FBO</p>
            <p className="text-white text-sm font-medium mt-2 font-mono">11:30 AM</p>
          </div>
        </div>

        {/* Seat Availability Notification */}
        <div className="mb-10 p-4 rounded-xl bg-gold/5 border border-gold/20 flex items-center gap-3 text-gold text-xs leading-relaxed font-light">
          <Info className="w-5 h-5 shrink-0" />
          <div>
            <span className="font-bold">Premium Seat Availability Alert:</span> Only 3 vacant suites remain in First & Business cabins. Select seat layout on next page to lock your cabin coordinates.
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 mb-8 overflow-x-auto whitespace-nowrap">
          {[
            { id: "specs", label: "Aircraft Specs" },
            { id: "baggage", label: "Baggage Rules" },
            { id: "fare", label: "Fare Breakdown" },
            { id: "rules", label: "Cancellation & Rules" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-6 font-mono text-xs uppercase tracking-wider border-b-2 font-bold transition-colors ${
                activeTab === tab.id ? "border-gold text-gold" : "border-transparent text-platinum/50 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="min-h-[220px] mb-12">
          {activeTab === "specs" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-lg font-serif font-bold text-white mb-4">{aircraftInfo.name} Specifications</h4>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                    <span className="text-platinum/50">Mission Range</span>
                    <span className="text-white font-medium font-mono">{aircraftInfo.specs.range}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                    <span className="text-platinum/50">Cruise Velocity</span>
                    <span className="text-white font-medium font-mono">{aircraftInfo.specs.speed}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                    <span className="text-platinum/50">Cabin Layout</span>
                    <span className="text-white font-medium font-mono">{aircraftInfo.layout}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                    <span className="text-platinum/50">Seating Capacity</span>
                    <span className="text-white font-medium font-mono">{aircraftInfo.specs.capacity}</span>
                  </div>
                </div>
              </div>
              <div className="h-48 rounded-2xl overflow-hidden border border-white/10 relative">
                <img src={aircraftInfo.image} alt={aircraftInfo.name} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 text-xs font-mono text-platinum/50">SkyLuxe Flight Ops Fleet Model</div>
              </div>
            </motion.div>
          )}

          {activeTab === "baggage" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex gap-4">
                  <Luggage className="w-8 h-8 text-gold shrink-0" />
                  <div>
                    <h5 className="text-white font-bold text-sm">Checked Baggage Allowance</h5>
                    <p className="text-platinum/50 text-xs mt-1 leading-relaxed">40kg (88lbs) per seat. Maximum of 3 pieces allowed. Priority red-tag handling included.</p>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex gap-4">
                  <Luggage className="w-8 h-8 text-gold shrink-0" />
                  <div>
                    <h5 className="text-white font-bold text-sm">Cabin Baggage Allowance</h5>
                    <p className="text-platinum/50 text-xs mt-1 leading-relaxed">12kg (26lbs) cabin carry-on plus 1 laptop sleeve or premium handbag.</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-xs text-platinum/60 font-light flex items-center gap-2">
                <Shield className="w-4 h-4 text-gold shrink-0" />
                Sovereign baggage clearances are pre-routed through private terminal scanners to bypass standard queues.
              </div>
            </motion.div>
          )}

          {activeTab === "fare" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-w-md">
              <h4 className="text-white font-serif font-bold text-md mb-2">Detailed Fare Ledger</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-platinum/50">Base Fare ({passengers} Passenger(s))</span>
                  <span className="text-white font-mono">${fareTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-platinum/50">FBO Fast-Track Clearance Surcharges</span>
                  <span className="text-white font-mono">${fboFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-platinum/50">Aeronautical Taxes & Duties (12%)</span>
                  <span className="text-white font-mono">${taxes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 text-md font-bold">
                  <span className="text-white font-serif">Total Settlement Due</span>
                  <span className="text-gold font-mono">${totalDue.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "rules" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-sm font-light leading-relaxed text-platinum/70">
              <div className="flex gap-3 items-start p-4 bg-white/5 rounded-2xl border border-white/5">
                <AlertTriangle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-white font-bold text-sm mb-1">Cancellation Protocols</h5>
                  <p className="text-xs">Cancellations executed at least 24 hours prior to scheduled departure time are subject to a flat fee of $100. Inside 24 hours, bookings are non-refundable.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start p-4 bg-white/5 rounded-2xl border border-white/5">
                <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-white font-bold text-sm mb-1">Flight Change Policies</h5>
                  <p className="text-xs">Schedule adjustments are permitted up to 12 hours before takeoff. Flight modifications incur a difference in fare plus an administrative charge of $50.</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Boarding Info & Amenities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 border-t border-white/5 pt-8">
          <div>
            <h3 className="text-lg font-serif font-medium text-white mb-4">Cabin Conveniences</h3>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <Coffee className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="text-platinum/50 text-[10px] uppercase tracking-widest font-mono">Gastronomy</h4>
                  <p className="text-white text-sm font-medium mt-0.5">{flight.meal}</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <Wifi className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="text-platinum/50 text-[10px] uppercase tracking-widest font-mono">Connectivity</h4>
                  <p className="text-white text-sm font-medium mt-0.5">{flight.wifi}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-serif font-medium text-white mb-4">Ground Logistics</h3>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="text-platinum/50 text-[10px] uppercase tracking-widest font-mono">Airport Lounge</h4>
                  <p className="text-white text-sm font-medium mt-0.5">{flight.lounge}</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="text-platinum/50 text-[10px] uppercase tracking-widest font-mono">Clearance queues</h4>
                  <p className="text-white text-sm font-medium mt-0.5">Priority terminal fast-track included</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/flights/${flightId}/seats?from=${fromCode}&to=${toCode}&date=${dateStr}&passengers=${passengers}`} className="block w-full">
          <button className="w-full py-4 rounded-xl bg-gradient-to-r from-gold to-gold-light text-onyx font-bold text-lg hover:-translate-y-1 transition-transform shadow-[0_0_25px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2">
            Select Your Suite & Seat <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
      </motion.div>
    </div>
  );
}

export default function FlightDetails() {
  return (
    <main className="relative min-h-screen bg-onyx flex flex-col selection:bg-gold/30">
      <GlassNavbar />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#020202] via-onyx to-[#020202] pointer-events-none" />
      <Suspense fallback={<div className="flex-grow flex items-center justify-center text-white pt-32">Retrieving flight details...</div>}>
        <DetailsContent />
      </Suspense>
    </main>
  );
}
