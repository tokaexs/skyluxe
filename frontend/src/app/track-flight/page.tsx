"use client";

import { motion, AnimatePresence } from "framer-motion";
import GlassNavbar from "@/components/ui/GlassNavbar";
import { 
  Search, 
  Plane, 
  MapPin, 
  CloudSun, 
  Activity, 
  Navigation, 
  Clock, 
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const trackingDatabase: Record<string, any> = {
  "AI-101": {
    flightNo: "AI-101",
    airline: "Air India",
    aircraft: "Airbus A350-900",
    status: "In Air",
    progress: 72,
    departure: { code: "BOM", city: "Mumbai", airport: "Chhatrapati Shivaji", time: "09:00 AM", weather: "Humid • 32°C" },
    arrival: { code: "DXB", city: "Dubai", airport: "Dubai International", time: "11:30 AM", weather: "Sunny • 35°C" },
    altitude: "38,000 ft",
    speed: "510 knots",
    heading: "284° NW",
    eta: "45 mins",
    timeline: [
      { event: "Flight Confirmed", time: "08:00 AM", status: "completed" },
      { event: "Boarding Completed", time: "08:45 AM", status: "completed" },
      { event: "Departed (Pushback)", time: "09:02 AM", status: "completed" },
      { event: "Climbed to Cruise Altitude", time: "09:20 AM", status: "completed" },
      { event: "Estimated Landing", time: "11:30 AM", status: "pending" }
    ]
  },
  "EK-505": {
    flightNo: "EK-505",
    airline: "Emirates",
    aircraft: "Boeing 777-300ER",
    status: "Boarding",
    progress: 5,
    departure: { code: "DEL", city: "Delhi", airport: "Indira Gandhi Int'l", time: "04:30 PM", weather: "Clear • 38°C" },
    arrival: { code: "DXB", city: "Dubai", airport: "Dubai International", time: "07:00 PM", weather: "Sunny • 35°C" },
    altitude: "0 ft",
    speed: "0 knots",
    heading: "0° N",
    eta: "2h 30m (Scheduled)",
    timeline: [
      { event: "Flight Confirmed", time: "03:00 PM", status: "completed" },
      { event: "Boarding Started", time: "03:55 PM", status: "active" },
      { event: "Gate Closed", time: "04:15 PM", status: "pending" },
      { event: "Estimated Departure", time: "04:30 PM", status: "pending" }
    ]
  },
  "UK-202": {
    flightNo: "UK-202",
    airline: "Vistara",
    aircraft: "Boeing 787-9 Dreamliner",
    status: "Arrived",
    progress: 100,
    departure: { code: "BOM", city: "Mumbai", airport: "Chhatrapati Shivaji", time: "11:15 AM", weather: "Humid • 32°C" },
    arrival: { code: "DXB", city: "Dubai", airport: "Dubai International", time: "01:40 PM", weather: "Sunny • 35°C" },
    altitude: "0 ft",
    speed: "0 knots",
    heading: "0° N",
    eta: "Landed (On Time)",
    timeline: [
      { event: "Flight Confirmed", time: "10:15 AM", status: "completed" },
      { event: "Boarding Completed", time: "11:00 AM", status: "completed" },
      { event: "Departed", time: "11:18 AM", status: "completed" },
      { event: "Landed & Arrived at Gate", time: "01:40 PM", status: "completed" }
    ]
  }
};

function TrackContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("flight") || "";
  const [query, setQuery] = useState(initialQuery);
  const [activeFlight, setActiveFlight] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      handleSearchFlight(initialQuery);
    }
  }, [initialQuery]);

  const handleSearchFlight = (flightCode: string) => {
    const code = flightCode.toUpperCase().trim();
    const result = trackingDatabase[code];
    if (result) {
      setActiveFlight(result);
    } else {
      // Create a default random mock state if it's a random flight number so the button never fails
      setActiveFlight({
        flightNo: code,
        airline: code.startsWith("AI") ? "Air India" : code.startsWith("6E") ? "IndiGo" : "SkyLuxe Private",
        aircraft: "Boeing 787 Dreamliner",
        status: "Scheduled",
        progress: 0,
        departure: { code: "BOM", city: "Mumbai", airport: "Chhatrapati Shivaji", time: "10:30 PM", weather: "Cloudy • 30°C" },
        arrival: { code: "LHR", city: "London", airport: "Heathrow Airport", time: "03:45 AM", weather: "Rain • 12°C" },
        altitude: "0 ft",
        speed: "0 knots",
        heading: "0° N",
        eta: "8h 15m (Scheduled)",
        timeline: [
          { event: "Flight Confirmed", time: "08:30 PM", status: "completed" },
          { event: "Security Clearances Checked", time: "09:15 PM", status: "completed" },
          { event: "Check-in Open", time: "09:30 PM", status: "active" },
          { event: "Scheduled Boarding", time: "10:00 PM", status: "pending" }
        ]
      });
    }
    setSearched(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) handleSearchFlight(query);
  };

  return (
    <div className="relative z-10 flex-grow flex flex-col pt-32 pb-24 px-6 lg:px-16 max-w-5xl mx-auto w-full">
      <div className="text-center mb-12">
        <span className="text-gold text-xs font-mono uppercase tracking-[0.2em] mb-4 block">Operations Control</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">SkyLuxe Flight Tracker</h1>
        <p className="text-platinum/60 font-light max-w-xl mx-auto text-sm leading-relaxed">
          Input your commercial flight number (e.g. AI-101, EK-505, UK-202) or private charter PNR code to retrieve real-time ADS-B transponder telemetry.
        </p>
      </div>

      {/* Search Input Widget */}
      <form onSubmit={handleFormSubmit} className="glass-panel p-4 rounded-2xl border border-white/10 max-w-xl mx-auto w-full mb-12 flex gap-3 bg-onyx/80">
        <div className="flex-grow flex items-center gap-3 px-3">
          <Search className="w-5 h-5 text-gold shrink-0" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Flight Number (e.g. AI-101)" 
            className="w-full bg-transparent border-none text-white focus:outline-none placeholder-platinum/30 text-sm font-mono uppercase" 
          />
        </div>
        <button type="submit" className="px-6 py-3 bg-gold hover:bg-gold-light text-onyx font-bold rounded-xl transition-all font-mono text-xs uppercase">
          Track Status
        </button>
      </form>

      <AnimatePresence mode="wait">
        {searched && activeFlight && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Main Telemetry Panel */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden bg-onyx/90 shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
              
              {/* Header Status Bar */}
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-1">{activeFlight.airline} {activeFlight.flightNo}</h3>
                  <p className="text-platinum/50 text-xs font-mono">{activeFlight.aircraft} Fleet Operations</p>
                </div>
                
                <span className={`px-4 py-1.5 rounded-full border text-xs font-mono uppercase font-bold tracking-widest flex items-center gap-2 ${
                  activeFlight.status === "In Air" 
                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                    : activeFlight.status === "Boarding"
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      : activeFlight.status === "Arrived"
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                        : "bg-white/5 border-white/10 text-platinum/50"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    activeFlight.status === "In Air" ? "bg-green-500 animate-pulse" : activeFlight.status === "Boarding" ? "bg-amber-500 animate-pulse" : "bg-blue-400"
                  }`} />
                  {activeFlight.status}
                </span>
              </div>

              {/* Progress Slider */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-xs font-mono text-platinum/50">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gold" /> {activeFlight.departure.city} ({activeFlight.departure.code})</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gold" /> {activeFlight.arrival.city} ({activeFlight.arrival.code})</span>
                </div>
                
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden relative">
                  <div 
                    className="bg-gold h-full rounded-full transition-all duration-1000"
                    style={{ width: `${activeFlight.progress}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs font-mono text-platinum/40">
                  <span>DEP: {activeFlight.departure.time}</span>
                  <span>ARR: {activeFlight.arrival.time}</span>
                </div>
              </div>

              {/* Vector SVG Path */}
              <div className="h-40 border border-white/5 rounded-2xl bg-white/[0.01] flex items-center justify-center p-6 mb-8 overflow-hidden relative">
                <svg viewBox="0 0 500 120" className="w-full h-full opacity-80">
                  <circle cx="50" cy="60" r="4" fill="#D4AF37" />
                  <text x="50" y="45" fill="#E5E4E2" fontSize="9" fontFamily="monospace" textAnchor="middle">{activeFlight.departure.code}</text>
                  
                  <circle cx="450" cy="60" r="4" fill="#D4AF37" />
                  <text x="450" y="45" fill="#E5E4E2" fontSize="9" fontFamily="monospace" textAnchor="middle">{activeFlight.arrival.code}</text>
                  
                  <path d="M 50 60 Q 250 15 450 60" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="5,5" />
                  
                  {/* Plane Icon mapped along path percentage */}
                  {activeFlight.progress > 0 && (
                    <g transform={`translate(${50 + (activeFlight.progress * 4.0)}, ${60 - (Math.sin((activeFlight.progress / 100) * Math.PI) * 45)}) rotate(${(50 - activeFlight.progress) * 0.3})`}>
                      <Plane className="w-5 h-5 text-gold -rotate-45" />
                    </g>
                  )}
                </svg>
                <div className="absolute bottom-3 left-3 text-[9px] font-mono text-platinum/30 uppercase tracking-widest flex items-center gap-1.5"><Activity className="w-3 h-3 text-gold" /> transponder radar active</div>
              </div>

              {/* Grid telemetry parameters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-t border-white/5 pt-8">
                <div className="space-y-1">
                  <span className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono flex items-center justify-center gap-1"><Navigation className="w-3 h-3 text-gold" /> Altitude</span>
                  <p className="text-white text-lg font-bold font-serif">{activeFlight.altitude}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono flex items-center justify-center gap-1"><Activity className="w-3 h-3 text-gold" /> Ground Speed</span>
                  <p className="text-white text-lg font-bold font-serif">{activeFlight.speed}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono flex items-center justify-center gap-1"><Clock className="w-3 h-3 text-gold" /> EST / Landing</span>
                  <p className="text-white text-lg font-bold font-serif">{activeFlight.eta}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono flex items-center justify-center gap-1"><CloudSun className="w-3 h-3 text-gold" /> Target Weather</span>
                  <p className="text-white text-sm font-medium">{activeFlight.arrival.weather}</p>
                </div>
              </div>
            </div>

            {/* Flight Milestones & Timeline Log */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-onyx/40">
              <h4 className="text-lg font-serif font-bold text-white mb-6">Flight Milestones & Operations Timeline</h4>
              
              <div className="relative border-l border-white/10 pl-6 space-y-6">
                {activeFlight.timeline.map((log: any, index: number) => (
                  <div key={index} className="relative">
                    <span className={`absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 ${
                      log.status === "completed" 
                        ? "bg-gold border-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]" 
                        : log.status === "active"
                          ? "bg-amber-500 border-amber-500 animate-pulse" 
                          : "bg-onyx border-white/20"
                    }`} />
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className={`text-sm font-medium ${log.status === "completed" ? "text-white" : log.status === "active" ? "text-amber-400" : "text-platinum/40"}`}>{log.event}</p>
                        <p className="text-platinum/50 text-[10px] font-mono mt-1">{log.time}</p>
                      </div>
                      
                      {log.status === "completed" ? (
                        <CheckCircle className="w-4 h-4 text-gold" />
                      ) : log.status === "active" ? (
                        <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-widest">Active</span>
                      ) : (
                        <span className="text-[9px] font-mono text-platinum/30 uppercase tracking-widest">Pending</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TrackFlight() {
  return (
    <main className="relative min-h-screen bg-onyx flex flex-col selection:bg-gold/30">
      <GlassNavbar />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#020202] via-onyx to-[#020202] pointer-events-none" />
      <Suspense fallback={<div className="flex-grow flex items-center justify-center text-white pt-32">Retrieving flight transponder feeds...</div>}>
        <TrackContent />
      </Suspense>
    </main>
  );
}
