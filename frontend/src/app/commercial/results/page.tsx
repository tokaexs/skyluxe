"use client";

import { motion } from "framer-motion";
import GlassNavbar from "@/components/ui/GlassNavbar";
import { ArrowRight, Clock, ShieldCheck, Plane, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const mockFlightsDatabase = [
  {
    id: "AI-101",
    airline: "Air India",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Air_India_Logo.svg/120px-Air_India_Logo.svg.png",
    aircraft: "Airbus A350-900",
    departure: { time: "09:00" },
    arrival: { time: "11:30" },
    duration: "3h 30m",
    price: 350,
    classType: "Business Class",
    tags: ["Direct", "Hot Meal", "Lounge Access"]
  },
  {
    id: "UK-202",
    airline: "Vistara",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Vistara_Logo.svg/120px-Vistara_Logo.svg.png",
    aircraft: "Boeing 787-9 Dreamliner",
    departure: { time: "11:15" },
    arrival: { time: "13:40" },
    duration: "3h 25m",
    price: 420,
    classType: "Business Class",
    tags: ["Direct", "Flatbed", "Premium Dining"]
  },
  {
    id: "6E-303",
    airline: "IndiGo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IndiGo_Airlines_logo.svg/120px-IndiGo_Airlines_logo.svg.png",
    aircraft: "Airbus A321neo",
    departure: { time: "14:00" },
    arrival: { time: "16:45" },
    duration: "3h 45m",
    price: 180,
    classType: "Economy",
    tags: ["Direct", "Snack Box"]
  },
  {
    id: "EK-505",
    airline: "Emirates",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/150px-Emirates_logo.svg.png",
    aircraft: "Boeing 777-300ER",
    departure: { time: "16:30" },
    arrival: { time: "19:00" },
    duration: "3h 30m",
    price: 780,
    classType: "First Class Suite",
    tags: ["Direct", "Shower Spa", "Private Cabin"]
  },
  {
    id: "QP-404",
    airline: "Akasa Air",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Akasa_Air_logo.svg/120px-Akasa_Air_logo.svg.png",
    aircraft: "Boeing 737 MAX 8",
    departure: { time: "07:30" },
    arrival: { time: "10:15" },
    duration: "3h 45m",
    price: 160,
    classType: "Economy",
    tags: ["Direct", "Snack Box"]
  }
];

function ResultsContent() {
  const searchParams = useSearchParams();
  const fromCode = searchParams.get("from") || "BOM";
  const toCode = searchParams.get("to") || "DXB";
  const dateStr = searchParams.get("date") || "2026-06-04";
  const tripType = searchParams.get("type") || "one-way";

  const [selectedClass, setSelectedClass] = useState("All");

  const formattedDate = new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="relative z-10 flex-1 flex flex-col pt-32 pb-12 px-6 lg:px-16 max-w-7xl mx-auto w-full">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 text-white mb-2">
            <h1 className="text-3xl font-serif font-bold">{fromCode === "BOM" ? "Mumbai" : fromCode} ({fromCode})</h1>
            <ArrowRight className="w-6 h-6 text-gold" />
            <h1 className="text-3xl font-serif font-bold">{toCode === "DXB" || toCode === "DWC" ? "Dubai" : toCode} ({toCode})</h1>
          </div>
          <p className="text-platinum/50 text-sm">{formattedDate} • 1 Passenger • {tripType.toUpperCase()}</p>
        </div>
        
        <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
          {["All", "Economy", "Business", "First"].map(cls => (
            <button 
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedClass === cls ? 'bg-gold text-onyx' : 'text-platinum/60 hover:text-white'}`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-6">
        {mockFlightsDatabase
          .filter(f => selectedClass === "All" || f.classType.includes(selectedClass) || (selectedClass === "First" && f.classType.includes("Suite")))
          .map((flight, idx) => (
            <motion.div 
              key={flight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 hover:border-gold/30 transition-all shadow-xl group flex flex-col md:flex-row gap-8 items-center"
            >
              {/* Airline Info */}
              <div className="w-full md:w-1/4 flex flex-col gap-2">
                <p className="text-sm font-medium text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold" />
                  {flight.airline}
                </p>
                <p className="text-xs text-platinum/50">{flight.aircraft}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {flight.tags.map(tag => (
                    <span key={tag} className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-platinum/60">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="flex-1 w-full flex items-center justify-between gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white font-serif">{flight.departure.time}</p>
                  <p className="text-sm text-platinum/50">{fromCode}</p>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <p className="text-[10px] text-platinum/50 uppercase tracking-widest mb-2">{flight.duration}</p>
                  <div className="w-full border-t border-dashed border-white/20 relative">
                    <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white font-serif">{flight.arrival.time}</p>
                  <p className="text-sm text-platinum/50">{toCode}</p>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="w-full md:w-1/4 flex flex-col items-end md:items-end justify-center border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 gap-4">
                <div className="text-right w-full flex md:flex-col justify-between items-center md:items-end">
                  <span className="text-xs text-platinum/50">{flight.classType}</span>
                  <span className="text-3xl font-bold text-white">${flight.price}</span>
                </div>
                <Link href={`/commercial/details?flightId=${flight.id}&from=${fromCode}&to=${toCode}&date=${dateStr}`} className="w-full">
                  <button className="w-full py-3 rounded-xl bg-gold/10 text-gold border border-gold/30 font-bold hover:bg-gold hover:text-onyx transition-colors">
                    Configure & Book
                  </button>
                </Link>
              </div>

            </motion.div>
          ))}
      </div>
    </div>
  );
}

export default function FlightResults() {
  return (
    <main className="relative min-h-screen bg-onyx flex flex-col">
      <GlassNavbar />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#020202] via-onyx to-[#020202] pointer-events-none" />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-white pt-32">Retrieving flight manifests...</div>}>
        <ResultsContent />
      </Suspense>
    </main>
  );
}
