"use client";

import { motion, AnimatePresence } from "framer-motion";
import GlassNavbar from "@/components/ui/GlassNavbar";
import { ArrowRight, Clock, ShieldCheck, Plane, Check, Sparkles, Filter, SlidersHorizontal, Map } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Full flight database for partner airlines
const mockFlightsDatabase = [
  {
    id: "AI-101",
    airline: "Air India",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Air_India_Logo.svg/120px-Air_India_Logo.svg.png",
    aircraft: "Airbus A350-900",
    departure: { time: "09:00", timestamp: 9.0 },
    arrival: { time: "11:30", timestamp: 11.5 },
    duration: "3h 30m",
    price: 350,
    stops: 0,
    classType: "Business Class",
    tags: ["Direct", "Hot Meal", "Lounge Access"]
  },
  {
    id: "UK-202",
    airline: "Vistara",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Vistara_Logo.svg/120px-Vistara_Logo.svg.png",
    aircraft: "Boeing 787-9 Dreamliner",
    departure: { time: "11:15", timestamp: 11.25 },
    arrival: { time: "13:40", timestamp: 13.66 },
    duration: "3h 25m",
    price: 420,
    stops: 0,
    classType: "Business Class",
    tags: ["Direct", "Flatbed", "Premium Dining"]
  },
  {
    id: "6E-303",
    airline: "IndiGo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IndiGo_Airlines_logo.svg/120px-IndiGo_Airlines_logo.svg.png",
    aircraft: "Airbus A321neo",
    departure: { time: "14:00", timestamp: 14.0 },
    arrival: { time: "16:45", timestamp: 16.75 },
    duration: "3h 45m",
    price: 180,
    stops: 0,
    classType: "Economy",
    tags: ["Direct", "Snack Box"]
  },
  {
    id: "EK-505",
    airline: "Emirates",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/150px-Emirates_logo.svg.png",
    aircraft: "Boeing 777-300ER",
    departure: { time: "16:30", timestamp: 16.5 },
    arrival: { time: "19:00", timestamp: 19.0 },
    duration: "3h 30m",
    price: 780,
    stops: 0,
    classType: "First Class Suite",
    tags: ["Direct", "Shower Spa", "Private Cabin"]
  },
  {
    id: "QP-404",
    airline: "Akasa Air",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Akasa_Air_logo.svg/120px-Akasa_Air_logo.svg.png",
    aircraft: "Boeing 737 MAX 8",
    departure: { time: "07:30", timestamp: 7.5 },
    arrival: { time: "10:15", timestamp: 10.25 },
    duration: "3h 45m",
    price: 160,
    stops: 0,
    classType: "Economy",
    tags: ["Direct", "Snack Box"]
  },
  {
    id: "AI-102",
    airline: "Air India",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Air_India_Logo.svg/120px-Air_India_Logo.svg.png",
    aircraft: "Boeing 777-300ER",
    departure: { time: "22:15", timestamp: 22.25 },
    arrival: { time: "00:45", timestamp: 24.75 },
    duration: "3h 30m",
    price: 890,
    stops: 0,
    classType: "First Class Suite",
    tags: ["Direct", "Lounge Prime", "Private Suite"]
  },
  {
    id: "EK-506",
    airline: "Emirates",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/150px-Emirates_logo.svg.png",
    aircraft: "Airbus A350-900",
    departure: { time: "18:45", timestamp: 18.75 },
    arrival: { time: "22:15", timestamp: 22.25 },
    duration: "3h 30m",
    price: 490,
    stops: 0,
    classType: "Business Class",
    tags: ["Direct", "Onboard Bar", "Flatbed"]
  }
];

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const fromCode = searchParams.get("from") || "BOM";
  const toCode = searchParams.get("to") || "DXB";
  const dateStr = searchParams.get("date") || "2026-06-04";
  const returnDate = searchParams.get("returnDate") || "2026-06-11";
  const tripType = searchParams.get("type") || "one-way";
  const passengers = Number(searchParams.get("passengers")) || 1;
  const initialClass = searchParams.get("class") || "All";

  // Filter States
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedStops, setSelectedStops] = useState<number[]>([]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedClass, setSelectedClass] = useState(initialClass);
  const [selectedAircrafts, setSelectedAircrafts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"price" | "duration" | "departure">("price");

  const formattedDate = new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  // Toggle Airline checklist
  const handleAirlineToggle = (airline: string) => {
    setSelectedAirlines(prev => 
      prev.includes(airline) ? prev.filter(a => a !== airline) : [...prev, airline]
    );
  };

  // Toggle Aircraft checklist
  const handleAircraftToggle = (aircraft: string) => {
    setSelectedAircrafts(prev => 
      prev.includes(aircraft) ? prev.filter(a => a !== aircraft) : [...prev, aircraft]
    );
  };

  // Filter & Sort Logic
  const filteredFlights = mockFlightsDatabase
    .filter(flight => {
      // Airline filter
      if (selectedAirlines.length > 0 && !selectedAirlines.includes(flight.airline)) return false;
      // Stops filter
      if (selectedStops.length > 0 && !selectedStops.includes(flight.stops)) return false;
      // Price filter
      if (flight.price > maxPrice) return false;
      // Class filter
      if (selectedClass !== "All") {
        if (selectedClass === "First" && !flight.classType.includes("First")) return false;
        if (selectedClass === "Business" && !flight.classType.includes("Business")) return false;
        if (selectedClass === "Economy" && !flight.classType.includes("Economy")) return false;
        if (selectedClass.includes("Class") && !flight.classType.toLowerCase().includes(selectedClass.replace(" Class", "").toLowerCase())) return false;
      }
      // Aircraft filter
      if (selectedAircrafts.length > 0) {
        const matches = selectedAircrafts.some(ac => flight.aircraft.toLowerCase().includes(ac.toLowerCase()));
        if (!matches) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "duration") {
        const durA = parseInt(a.duration.split("h")[0]) * 60 + parseInt(a.duration.split(" ")[1]?.replace("m", "") || "0");
        const durB = parseInt(b.duration.split("h")[0]) * 60 + parseInt(b.duration.split(" ")[1]?.replace("m", "") || "0");
        return durA - durB;
      }
      if (sortBy === "departure") return a.departure.timestamp - b.departure.timestamp;
      return 0;
    });

  return (
    <div className="relative z-10 flex-grow flex flex-col pt-32 pb-24 px-6 lg:px-16 max-w-7xl mx-auto w-full">
      {/* Header Overview Card */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-onyx/80">
        <div>
          <div className="flex items-center gap-3 text-white mb-2">
            <h1 className="text-2xl md:text-3xl font-serif font-bold">{fromCode === "BOM" ? "Mumbai" : fromCode} ({fromCode})</h1>
            <ArrowRight className="w-5 h-5 text-gold" />
            <h1 className="text-2xl md:text-3xl font-serif font-bold">{toCode === "DXB" || toCode === "DWC" ? "Dubai" : toCode} ({toCode})</h1>
          </div>
          <p className="text-platinum/50 text-xs font-mono">{formattedDate} • {passengers} Seats • {tripType.toUpperCase()} • Cabin: {selectedClass}</p>
        </div>
        
        <div className="flex gap-2 p-1 bg-white/5 border border-white/5 rounded-xl">
          {["All", "Economy", "Business", "First"].map(cls => (
            <button 
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider font-mono transition-colors ${selectedClass === cls ? 'bg-gold text-onyx shadow-[0_0_12px_rgba(212,175,55,0.3)]' : 'text-platinum/60 hover:text-white'}`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filter Sidebar */}
        <aside className="lg:col-span-3 glass-panel p-6 rounded-3xl border border-white/10 space-y-8 bg-onyx/40">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-white font-serif font-bold text-lg flex items-center gap-2"><Filter className="w-4 h-4 text-gold" /> Filters</h3>
            <span className="text-[10px] text-platinum/40 uppercase tracking-widest font-mono">{filteredFlights.length} found</span>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-platinum/50 uppercase">Max Tariff</span>
              <span className="text-gold font-bold">${maxPrice}</span>
            </div>
            <input 
              type="range" 
              min={100} 
              max={1500} 
              step={50}
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-gold bg-white/10 h-1 rounded"
            />
          </div>

          {/* Airlines Checklist */}
          <div className="space-y-3">
            <h4 className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Airline Partners</h4>
            <div className="space-y-2">
              {["Air India", "Vistara", "IndiGo", "Emirates", "Akasa Air"].map((airline) => (
                <label key={airline} className="flex items-center gap-3 text-sm text-platinum/80 cursor-pointer hover:text-white transition-colors">
                  <input 
                    type="checkbox" 
                    checked={selectedAirlines.includes(airline)}
                    onChange={() => handleAirlineToggle(airline)}
                    className="accent-gold rounded border-white/20 bg-transparent" 
                  />
                  <span>{airline}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Stops */}
          <div className="space-y-3">
            <h4 className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Stopovers</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-3 text-sm text-platinum/80 cursor-pointer hover:text-white transition-colors">
                <input 
                  type="checkbox" 
                  checked={selectedStops.includes(0)}
                  onChange={() => setSelectedStops(prev => prev.includes(0) ? prev.filter(s => s !== 0) : [...prev, 0])}
                  className="accent-gold rounded border-white/20" 
                />
                <span>Direct Flight</span>
              </label>
            </div>
          </div>

          {/* Aircraft types */}
          <div className="space-y-3">
            <h4 className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Aircraft Fleet</h4>
            <div className="space-y-2">
              {["A350", "787", "777", "A321", "737"].map((ac) => {
                const label = ac === "A350" ? "Airbus A350" : ac === "787" ? "Boeing 787" : ac === "777" ? "Boeing 777" : ac === "A321" ? "Airbus A321" : "Boeing 737";
                return (
                  <label key={ac} className="flex items-center gap-3 text-sm text-platinum/80 cursor-pointer hover:text-white transition-colors">
                    <input 
                      type="checkbox" 
                      checked={selectedAircrafts.includes(ac)}
                      onChange={() => handleAircraftToggle(ac)}
                      className="accent-gold rounded border-white/20" 
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Results Side */}
        <div className="lg:col-span-9 space-y-6">
          {/* Sorting Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-xs font-mono text-platinum/50">
            <span className="flex items-center gap-2"><SlidersHorizontal className="w-3.5 h-3.5 text-gold" /> SORT BY</span>
            <div className="flex gap-4">
              <button 
                onClick={() => setSortBy("price")} 
                className={`transition-colors uppercase tracking-wider ${sortBy === "price" ? "text-gold font-bold" : "hover:text-white"}`}
              >
                Price (Low to High)
              </button>
              <span className="opacity-20">|</span>
              <button 
                onClick={() => setSortBy("duration")} 
                className={`transition-colors uppercase tracking-wider ${sortBy === "duration" ? "text-gold font-bold" : "hover:text-white"}`}
              >
                Duration
              </button>
              <span className="opacity-20">|</span>
              <button 
                onClick={() => setSortBy("departure")} 
                className={`transition-colors uppercase tracking-wider ${sortBy === "departure" ? "text-gold font-bold" : "hover:text-white"}`}
              >
                Departure Time
              </button>
            </div>
          </div>

          {/* Map Preview of Route */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden bg-gradient-to-r from-gold/5 to-transparent h-48 flex items-center justify-between">
            <div className="relative z-10 max-w-sm">
              <span className="text-gold text-[10px] uppercase tracking-widest font-mono flex items-center gap-1.5 mb-2">
                <Map className="w-3.5 h-3.5" /> Vector Route Path
              </span>
              <h3 className="text-white font-serif font-bold text-xl mb-2">Flight Operations Live Map</h3>
              <p className="text-platinum/50 text-xs leading-relaxed font-light">
                Direct transcontinental routing between {fromCode} and {toCode} FBO lounges. High-speed jetstream optimization.
              </p>
            </div>
            
            <div className="absolute inset-y-0 right-0 w-1/2 flex items-center justify-center p-4">
              <svg viewBox="0 0 300 120" className="w-full h-full opacity-60">
                <circle cx="50" cy="60" r="4" fill="#D4AF37" />
                <text x="50" y="45" fill="#E5E4E2" fontSize="9" fontFamily="monospace" textAnchor="middle">{fromCode}</text>
                
                <circle cx="250" cy="60" r="4" fill="#D4AF37" />
                <text x="250" y="45" fill="#E5E4E2" fontSize="9" fontFamily="monospace" textAnchor="middle">{toCode}</text>
                
                <path d="M 50 60 Q 150 20 250 60" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="4,4" />
                
                {/* Airplane icon along path */}
                <g transform="translate(142, 38) rotate(5)">
                  <Plane className="w-5 h-5 text-gold" />
                </g>
              </svg>
            </div>
          </div>

          {/* List of Results */}
          <div className="space-y-4">
            {filteredFlights.length > 0 ? (
              filteredFlights.map((flight) => (
                <motion.div 
                  key={flight.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-gold/30 hover:bg-white/[0.01] transition-all duration-300 group flex flex-col md:flex-row gap-6 items-center"
                >
                  {/* Airline Brand */}
                  <div className="w-full md:w-1/4 flex flex-col gap-2">
                    <p className="text-sm font-semibold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-gold" />
                      {flight.airline}
                    </p>
                    <p className="text-[11px] font-mono text-platinum/50">{flight.id} • {flight.aircraft}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {flight.tags.map(tag => (
                        <span key={tag} className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-platinum/60 font-mono">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Flight Timeline */}
                  <div className="flex-grow w-full flex items-center justify-between gap-6 px-4">
                    <div className="text-center">
                      <p className="text-2xl font-serif font-bold text-white leading-tight">{flight.departure.time}</p>
                      <p className="text-xs text-platinum/50 font-mono mt-1">{fromCode}</p>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center">
                      <p className="text-[9px] text-platinum/40 uppercase tracking-widest font-mono mb-2">{flight.duration}</p>
                      <div className="w-full border-t border-dashed border-white/20 relative">
                        <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-gold rotate-90" />
                      </div>
                      <p className="text-[9px] text-gold uppercase tracking-widest font-mono mt-2">{flight.stops === 0 ? "Nonstop" : `${flight.stops} Stop`}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-2xl font-serif font-bold text-white leading-tight">{flight.arrival.time}</p>
                      <p className="text-xs text-platinum/50 font-mono mt-1">{toCode}</p>
                    </div>
                  </div>

                  {/* Price & Book */}
                  <div className="w-full md:w-1/4 flex flex-col items-end md:items-end justify-center border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 gap-3">
                    <div className="text-right w-full flex md:flex-col justify-between items-center md:items-end">
                      <span className="text-[10px] text-platinum/50 font-mono uppercase">{flight.classType}</span>
                      <span className="text-2xl md:text-3xl font-bold text-white font-serif">${flight.price}</span>
                    </div>
                    
                    <Link href={`/flights/${flight.id}?from=${fromCode}&to=${toCode}&date=${dateStr}&passengers=${passengers}&class=${selectedClass}`} className="w-full">
                      <button className="w-full py-3 rounded-xl bg-gold/15 text-gold border border-gold/30 hover:bg-gold hover:text-onyx hover:border-gold font-bold transition-all duration-300 text-sm">
                        Book Now
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="glass-panel p-16 rounded-3xl border border-white/10 text-center">
                <Plane className="w-12 h-12 text-platinum/20 mx-auto mb-4" />
                <h4 className="text-white font-serif text-lg font-bold mb-2">No Matching Manifests</h4>
                <p className="text-platinum/50 text-sm max-w-sm mx-auto font-light">
                  Try adjusting your cabin filters, pricing range, or choosing other airline operations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FlightResults() {
  return (
    <main className="relative min-h-screen bg-onyx flex flex-col selection:bg-gold/30">
      <GlassNavbar />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#020202] via-onyx to-[#020202] pointer-events-none" />
      <Suspense fallback={<div className="flex-grow flex items-center justify-center text-white pt-32">Retrieving flight manifests...</div>}>
        <SearchResultsContent />
      </Suspense>
    </main>
  );
}
