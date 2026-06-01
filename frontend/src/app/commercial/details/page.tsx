"use client";

import { motion } from "framer-motion";
import GlassNavbar from "@/components/ui/GlassNavbar";
import { ArrowRight, Plane, Shield, ShieldCheck, Heart, Coffee, Wifi, Luggage, Star, Compass } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

const flightDetailDB: Record<string, any> = {
  "AI-101": { airline: "Air India", name: "Maharaja Business Suite", aircraft: "Airbus A350-900", price: 350, meal: "Indian Heritage Tasting Menu", lounge: "BOM Lounge Prime", wifi: "High-Speed complimentary" },
  "UK-202": { airline: "Vistara", name: "Premium Club Flatbed", aircraft: "Boeing 787-9 Dreamliner", price: 420, meal: "Michelin Inspired Multi-Course", lounge: "Vistara Signature Lounge", wifi: "Complimentary for Business" },
  "6E-303": { airline: "IndiGo", name: "IndiGo Stretch (Premium Economy)", aircraft: "Airbus A321neo", price: 180, meal: "Snack Box (Gourmet Sandwich)", lounge: "Standard Terminal Lounge (+$45)", wifi: "Offline Streaming Only" },
  "EK-505": { airline: "Emirates", name: "First Class Private Suite", aircraft: "Boeing 777-300ER", price: 780, meal: "Caviar & Dom Perignon Pairing", lounge: "Emirates First Class FBO Lounge", wifi: "Unlimited high-speed" },
  "QP-404": { airline: "Akasa Air", name: "Akasa Economy", aircraft: "Boeing 737 MAX 8", price: 160, meal: "Cafe Akasa Gourmet Box", lounge: "No Lounge Access", wifi: "Offline Media Console" }
};

function DetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const flightId = searchParams.get("flightId") || "AI-101";
  const fromCode = searchParams.get("from") || "BOM";
  const toCode = searchParams.get("to") || "DXB";
  const dateStr = searchParams.get("date") || "2026-06-04";

  const flight = flightDetailDB[flightId] || flightDetailDB["AI-101"];

  return (
    <div className="relative z-10 flex-1 flex flex-col pt-32 pb-12 px-6 lg:px-16 max-w-5xl mx-auto w-full">
      <Link href={`/commercial/results?from=${fromCode}&to=${toCode}&date=${dateStr}`} className="text-platinum/50 hover:text-white transition-colors text-xs font-mono uppercase mb-8 flex items-center gap-2">
        ← Back to Search Manifest
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        {/* Airline Info */}
        <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-8">
          <div>
            <span className="px-3 py-1 rounded-full bg-gold/20 border border-gold/30 text-[10px] text-gold uppercase tracking-widest mb-3 inline-block">
              {flight.name}
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2">{flight.airline} {flightId}</h1>
            <p className="text-platinum/50 text-sm">{flight.aircraft} • Scheduled Flight</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-platinum/50 uppercase tracking-widest block mb-1">Base Tariff</span>
            <span className="text-4xl font-bold text-white">${flight.price}</span>
          </div>
        </div>

        {/* Dynamic Route Info */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 grid grid-cols-3 gap-4 items-center mb-8 text-center">
          <div>
            <h3 className="text-3xl font-serif text-white font-bold">{fromCode}</h3>
            <p className="text-platinum/50 text-xs mt-1">Departure Airport</p>
          </div>
          <div className="flex flex-col items-center">
            <Plane className="w-5 h-5 text-gold mb-1" />
            <div className="w-full border-t border-dashed border-white/20 relative">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-onyx px-2 text-[10px] text-platinum/50">Scheduled Direct</span>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-serif text-white font-bold">{toCode}</h3>
            <p className="text-platinum/50 text-xs mt-1">Arrival Airport</p>
          </div>
        </div>

        {/* Premium Amenities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-serif font-medium text-white mb-4">Cabin Conveniences</h3>
            <div className="space-y-4">
              <AmenityRow icon={Coffee} title="Gastronomy" value={flight.meal} />
              <AmenityRow icon={Wifi} title="In-flight Connectivity" value={flight.wifi} />
              <AmenityRow icon={Luggage} title="Baggage Allowance" value="Checked: 40kg • Cabin: 12kg" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-serif font-medium text-white mb-4">Ground Logistics</h3>
            <div className="space-y-4">
              <AmenityRow icon={Shield} title="Airport Lounge Access" value={flight.lounge} />
              <AmenityRow icon={ShieldCheck} title="Fast-Track Security" value="Priority clearance queues included" />
              <AmenityRow icon={Compass} title="Check-in Options" value="Digital boarding pass generation" />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/commercial/seats?flightId=${flightId}&from=${fromCode}&to=${toCode}&date=${dateStr}`} className="block w-full">
          <button className="w-full py-4 rounded-xl bg-gradient-to-r from-gold to-gold-light text-onyx font-bold text-lg hover:-translate-y-1 transition-transform shadow-[0_0_25px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2">
            Select Your Suite & Seat <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
      </motion.div>
    </div>
  );
}

function AmenityRow({ icon: Icon, title, value }: any) {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
      <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-gold" />
      </div>
      <div>
        <h4 className="text-platinum/50 text-[10px] uppercase tracking-widest">{title}</h4>
        <p className="text-white text-sm font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function FlightDetails() {
  return (
    <main className="relative min-h-screen bg-onyx flex flex-col">
      <GlassNavbar />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#020202] via-onyx to-[#020202] pointer-events-none" />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-white pt-32">Retrieving flight details...</div>}>
        <DetailsContent />
      </Suspense>
    </main>
  );
}
