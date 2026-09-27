"use client";

import { motion } from "framer-motion";
import GlassNavbar from "@/components/ui/GlassNavbar";
import { ArrowRight, Clock, ShieldCheck, Plane, Check, Sparkles, Luggage, Wifi, Utensils, Leaf } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSkyLuxeStore } from "@/store/skyluxeStore";
import { api } from "@/lib/api";

function CommercialLogo({ logoUrl, airlineName }: { logoUrl?: string; airlineName: string }) {
  const [err, setErr] = useState(!logoUrl);
  const initials = airlineName.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();

  if (err || !logoUrl) {
    return (
      <div className="w-11 h-11 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center font-bold text-gold text-xs font-mono shrink-0">
        {initials}
      </div>
    );
  }
  return (
    <img
      src={logoUrl}
      alt={airlineName}
      onError={() => setErr(true)}
      className="w-11 h-11 rounded-2xl object-contain bg-white/10 p-1.5 border border-white/10 shrink-0 shadow-sm"
    />
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const { formatAmount } = useSkyLuxeStore();
  const fromCode = searchParams.get("from") || "BOM";
  const toCode = searchParams.get("to") || "DXB";
  const dateStr = searchParams.get("date") || (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  })();
  const tripType = searchParams.get("type") || "one-way";
  const passengers = Number(searchParams.get("passengers")) || 1;

  const [selectedClass, setSelectedClass] = useState("All");
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      try {
        const cabinClass = selectedClass === "All" ? "business" : selectedClass.toLowerCase();
        const results = await api.post<any[]>("/flights/search", {
          from: fromCode,
          to: toCode === "DXB" ? "Dubai Al Maktoum" : toCode === "Dubai" ? "Dubai Al Maktoum" : toCode,
          date: dateStr,
          passengers,
          class: ['economy', 'business', 'first'].includes(cabinClass) ? cabinClass : 'business',
          type: tripType
        });

        if (results && Array.isArray(results) && results.length > 0) {
          const mapped = results.map(f => {
            const mappedCabin = ['economy', 'business', 'first'].includes(cabinClass) ? cabinClass : 'business';
            const airlineObj = f.airline && typeof f.airline === 'object' ? f.airline : null;
            const airlineName = airlineObj ? airlineObj.airlineName : (typeof f.airline === 'string' ? f.airline : "SkyLuxe Partner");
            const logoUrl = airlineObj ? airlineObj.logoUrl : (f.airlineLogo || "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Air_India_Logo.svg/120px-Air_India_Logo.svg.png");
            
            const depTime = f.departure?.time ? new Date(f.departure.time) : new Date();
            const arrTime = f.arrival?.time ? new Date(f.arrival.time) : new Date(Date.now() + 3.5 * 3600 * 1000);
            const durationMins = typeof f.duration === 'number' ? f.duration : 210;

            const priceVal = f.price && typeof f.price === 'object'
              ? (f.price[mappedCabin as 'economy' | 'business' | 'first'] || f.price.business || 450)
              : (typeof f.price === 'number' ? f.price : 450);

            return {
              id: f.flightNumber || f.id || `FL-${Math.floor(100 + Math.random() * 900)}`,
              flightNumber: f.flightNumber || `FL-${Math.floor(100 + Math.random() * 900)}`,
              airline: airlineName,
              logo: logoUrl,
              aircraft: f.aircraft || "Boeing 787-9 Dreamliner",
              departure: { 
                time: !isNaN(depTime.getTime()) ? depTime.toLocaleTimeString("en-US", {hour: '2-digit', minute:'2-digit', hour12: false}) : "09:00",
                terminal: f.departure?.terminal || "T2"
              },
              arrival: { 
                time: !isNaN(arrTime.getTime()) ? arrTime.toLocaleTimeString("en-US", {hour: '2-digit', minute:'2-digit', hour12: false}) : "12:30",
                terminal: f.arrival?.terminal || "T3"
              },
              duration: `${Math.floor(durationMins / 60)}h ${durationMins % 60}m`,
              price: priceVal,
              classType: mappedCabin === 'first' ? 'First Class Suite' : mappedCabin === 'business' ? 'Business Class' : 'Economy',
              tags: f.tags || ["Direct", "Hot Meal", "Lounge Access"],
              baggage: f.baggage || { cabin: "7 kg", checkinEconomy: "15 kg" },
              eco: f.eco || { diffPercent: -14 }
            };
          });
          setFlights(mapped);
        } else {
          setFlights([]);
        }
      } catch (err) {
        console.error("Failed to fetch commercial flights:", err);
        setFlights([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, [fromCode, toCode, dateStr, passengers, selectedClass, tripType]);

  const formattedDate = new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="relative z-10 flex-1 flex flex-col pt-32 pb-16 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto w-full">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 glass-panel p-6 rounded-3xl border border-white/10 bg-onyx/80">
        <div>
          <div className="flex flex-wrap items-center gap-3 text-white mb-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold">{fromCode === "BOM" ? "Mumbai" : fromCode} ({fromCode})</h1>
            <ArrowRight className="w-5 h-5 text-gold" />
            <h1 className="text-2xl sm:text-3xl font-serif font-bold">{toCode === "DXB" || toCode === "DWC" ? "Dubai" : toCode} ({toCode})</h1>
          </div>
          <p className="text-platinum/50 text-xs sm:text-sm font-mono">{formattedDate} • {passengers} Passenger{passengers > 1 ? "s" : ""} • {tripType.toUpperCase()} • Cabin: {selectedClass}</p>
        </div>
        
        <div className="flex gap-1.5 p-1 bg-white/5 border border-white/10 rounded-2xl">
          {["All", "Economy", "Business", "First"].map(cls => (
            <button 
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider font-mono transition-all ${selectedClass === cls ? 'bg-gold text-onyx shadow-[0_0_15px_rgba(212,175,55,0.4)] font-bold' : 'text-platinum/60 hover:text-white'}`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {loading ? (
          <div className="glass-panel p-16 rounded-3xl border border-white/10 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
            <p className="text-platinum/60 text-xs font-mono uppercase tracking-widest">Querying Live Airline Schedules...</p>
          </div>
        ) : flights.length > 0 ? (
          flights
            .filter(f => selectedClass === "All" || f.classType.includes(selectedClass) || (selectedClass === "First" && f.classType.includes("Suite")))
            .map((flight, idx) => (
              <motion.div 
                key={flight.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 hover:border-gold/40 transition-all shadow-xl group flex flex-col md:flex-row gap-5 md:gap-8 items-start md:items-center bg-onyx/80 backdrop-blur-2xl"
              >
                {/* Airline Info */}
                <div className="w-full md:w-1/4 flex items-center gap-3.5">
                  <CommercialLogo logoUrl={flight.logo} airlineName={flight.airline} />
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-bold text-white truncate group-hover:text-gold transition-colors">{flight.airline}</p>
                    <p className="text-[11px] font-mono text-platinum/50 truncate">{flight.flightNumber} • {flight.aircraft}</p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                        <Leaf className="w-2.5 h-2.5" /> {flight.eco?.diffPercent || -14}% CO₂
                      </span>
                      <span className="text-[9px] bg-gold/10 text-gold border border-gold/20 px-1.5 py-0.5 rounded font-mono">
                        Fast-Track FBO
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex-1 w-full flex items-center justify-between gap-4 border-y md:border-y-0 border-white/5 py-3 md:py-0">
                  <div className="text-left min-w-[65px]">
                    <p className="text-xl sm:text-2xl font-bold text-white font-serif">{flight.departure.time}</p>
                    <p className="text-xs font-mono text-platinum/60">{fromCode} <span className="text-gold text-[10px]">{flight.departure.terminal}</span></p>
                  </div>

                  <div className="flex-1 flex flex-col items-center px-2">
                    <p className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono mb-1">{flight.duration}</p>
                    <div className="w-full border-t border-dashed border-gold/30 relative">
                      <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-gold rotate-90" />
                    </div>
                    <p className="text-[9px] text-emerald-400 font-mono uppercase tracking-widest mt-1">Non-stop • Priority Gate</p>
                  </div>

                  <div className="text-right min-w-[65px]">
                    <p className="text-xl sm:text-2xl font-bold text-white font-serif">{flight.arrival.time}</p>
                    <p className="text-xs font-mono text-platinum/60">{toCode} <span className="text-gold text-[10px]">{flight.arrival.terminal}</span></p>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="w-full md:w-1/4 flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-6 gap-3">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-gold font-mono uppercase font-bold block">{flight.classType}</span>
                    <span className="text-2xl sm:text-3xl font-bold text-white font-serif">{formatAmount(flight.price)}</span>
                  </div>
                  
                  <Link 
                    href={`/flights/${flight.id}?from=${fromCode}&to=${toCode}&date=${dateStr}&passengers=${passengers}&class=${selectedClass === "All" ? "economy" : selectedClass.toLowerCase()}&price=${flight.price}&airline=${encodeURIComponent(flight.airline)}&aircraft=${encodeURIComponent(flight.aircraft)}`} 
                    className="w-full sm:w-auto md:w-full"
                  >
                    <button className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-gold via-gold-light to-gold text-onyx font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all text-xs font-mono uppercase tracking-wider cursor-pointer shadow-md flex items-center justify-center gap-1.5">
                      <span>Reserve Suite</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))
        ) : (
          <div className="glass-panel p-12 md:p-16 rounded-3xl border border-white/10 text-center">
            <Plane className="w-12 h-12 text-platinum/20 mx-auto mb-4" />
            <h4 className="text-white font-serif text-xl font-bold mb-2">No Matching Flights Found</h4>
            <p className="text-platinum/50 text-sm max-w-md mx-auto font-light mb-6">
              No live commercial flights found for {fromCode} → {toCode} on {formattedDate}.
            </p>
            <Link href="/flights/search">
              <button className="px-6 py-3 rounded-xl bg-gold text-onyx font-bold text-xs uppercase font-mono hover:bg-gold-light transition-all">
                Search All Flights
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FlightResults() {
  return (
    <main className="relative min-h-screen bg-onyx flex flex-col selection:bg-gold/30">
      <GlassNavbar />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#020202] via-onyx to-[#020202] pointer-events-none" />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-white pt-32 font-mono text-sm">Retrieving flight manifests...</div>}>
        <ResultsContent />
      </Suspense>
    </main>
  );
}
