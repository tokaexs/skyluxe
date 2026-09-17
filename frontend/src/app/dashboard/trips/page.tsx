"use client";

import { motion } from "framer-motion";
import { Plane, Calendar, MapPin, Compass, ShieldAlert, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSkyLuxeStore } from "@/store/skyluxeStore";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Coordinate mappings for major hubs
const AIRPORT_COORDINATES: Record<string, [number, number]> = {
  BOM: [72.8656, 19.0896],
  DWC: [55.1613, 24.8962],
  DXB: [55.3657, 25.2532],
  LHR: [-0.4543, 51.4700],
  DEL: [77.1000, 28.5562],
  SIN: [103.9915, 1.3644],
  JFK: [-73.7781, 40.6413],
  CDG: [2.5479, 49.0097]
};

export default function TripsTelemetry() {
  const { flights } = useSkyLuxeStore();
  const upcomingFlights = flights.filter(f => f.status === "Confirmed");
  const nextFlight = upcomingFlights[0] || null;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapboxTokenActive, setMapboxTokenActive] = useState(false);

  // Extract route codes
  const fromCode = nextFlight ? (nextFlight.type === 'commercial' ? nextFlight.departure?.code : nextFlight.legs?.[0]?.from) || "BOM" : "BOM";
  const toCode = nextFlight ? (nextFlight.type === 'commercial' ? nextFlight.arrival?.code : nextFlight.legs?.[nextFlight.legs.length - 1]?.to) || "DWC" : "DWC";

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token || !mapContainerRef.current || !nextFlight) {
      setMapboxTokenActive(false);
      return;
    }

    setMapboxTokenActive(true);
    mapboxgl.accessToken = token;

    try {
      const fromCoords = AIRPORT_COORDINATES[fromCode.toUpperCase()] || [72.8656, 19.0896];
      const toCoords = AIRPORT_COORDINATES[toCode.toUpperCase()] || [55.1613, 24.8962];

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [(fromCoords[0] + toCoords[0]) / 2, (fromCoords[1] + toCoords[1]) / 2],
        zoom: 3.5,
        attributionControl: false
      });

      map.on("load", () => {
        // Draw route Line
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [fromCoords, toCoords]
            }
          }
        });

        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round"
          },
          paint: {
            "line-color": "#D4AF37", // SkyLuxe Gold
            "line-width": 2.5,
            "line-dasharray": [2, 2]
          }
        });

        // Add markers
        // Departure Gold Dot
        const depEl = document.createElement("div");
        depEl.className = "w-4 h-4 rounded-full bg-gold border border-white shadow-[0_0_10px_rgba(212,175,55,0.8)]";
        new mapboxgl.Marker(depEl).setLngLat(fromCoords).addTo(map);

        // Arrival Gold Dot
        const arrEl = document.createElement("div");
        arrEl.className = "w-4 h-4 rounded-full bg-gold border border-white shadow-[0_0_10px_rgba(212,175,55,0.8)]";
        new mapboxgl.Marker(arrEl).setLngLat(toCoords).addTo(map);

        // Fit boundaries smoothly
        const bounds = new mapboxgl.LngLatBounds()
          .extend(fromCoords)
          .extend(toCoords);
        map.fitBounds(bounds, { padding: 80, duration: 1500 });
      });

      return () => {
        map.remove();
      };
    } catch (err) {
      console.error("Mapbox load error:", err);
      setMapboxTokenActive(false);
    }
  }, [fromCode, toCode, nextFlight]);

  return (
    <div className="space-y-8 flex-1 pb-12">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white mb-2">Upcoming Trips & Telemetry</h1>
        <p className="text-platinum/50 font-light text-sm">Monitor active aircraft positioning, flight paths, and FBO handling status.</p>
      </div>

      {nextFlight ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tracking Map Screen */}
          <div className="lg:col-span-8 glass-panel border border-white/10 rounded-3xl overflow-hidden h-[60vh] flex flex-col relative bg-[#020202]">
            
            {/* Map Container Element */}
            <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" style={{ display: mapboxTokenActive ? "block" : "none" }} />

            {/* Premium Mock Map Fallback if Mapbox token is missing */}
            {!mapboxTokenActive && (
              <>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000')] bg-cover bg-center opacity-40 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-transparent pointer-events-none" />

                {/* Glowing route line SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 20 80 Q 50 20 80 50" fill="none" stroke="rgba(212,175,55,0.7)" strokeWidth="0.5" strokeDasharray="1 1" />
                  <motion.circle 
                    cx="20" cy="80" r="1.5" fill="#D4AF37"
                    animate={{ r: [1.5, 3, 1.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.circle 
                    cx="80" cy="50" r="1.5" fill="#D4AF37"
                    animate={{ r: [1.5, 3, 1.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </svg>

                {/* Tracking Airplane animated */}
                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <motion.div 
                    animate={{ y: [-5, 5, -5] }} 
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-12 h-12 rounded-full bg-onyx border border-gold/40 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                  >
                    <Plane className="w-6 h-6 text-gold -rotate-45" />
                  </motion.div>
                  <span className="text-[9px] font-mono text-gold mt-2 bg-black/60 px-2 py-0.5 rounded border border-gold/20 tracking-wider">TELEMETRY LOCK</span>
                </div>

                {/* Setup Tip Alert */}
                <div className="absolute top-6 right-6 bg-gold/15 border border-gold/30 px-3 py-1.5 rounded-lg text-[10px] text-gold uppercase tracking-wider font-mono flex items-center gap-1.5 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5" /> Configure Mapbox Token for Interactive radar
                </div>
              </>
            )}

            {/* FBO terminal badge */}
            <div className="absolute top-6 left-6 bg-black/60 backdrop-blur border border-white/10 px-4 py-2 rounded-xl z-10">
              <p className="text-[9px] text-platinum/50 uppercase tracking-widest font-mono">FBO Status</p>
              <p className="text-white text-xs font-medium mt-0.5">Pre-flight vetting completed</p>
            </div>

            {/* Live readout strip */}
            <div className="absolute bottom-6 left-6 right-6 flex gap-4 z-10">
              <Readout label="Target Altitude" value="41,000 ft" />
              <Readout label="Ground Speed" value="520 kts" />
              <Readout label="E.T.A." value={`${nextFlight.arrival?.time || "11:30"} Local`} />
            </div>
          </div>

          {/* Logistics specs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-8 rounded-3xl border border-gold/30 bg-gold/5 shadow-xl">
              <h3 className="text-lg font-serif font-bold text-white mb-6">Mission Directives</h3>
              <div className="space-y-4 text-sm mb-8 font-light">
                <div className="flex justify-between">
                  <span className="text-platinum/50">Scheduled Equipment</span>
                  <span className="text-white font-medium">{nextFlight.aircraft}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-platinum/50">Origin FBO</span>
                  <span className="text-white font-medium">{nextFlight.terminal || "VIP Terminal 1"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-platinum/50">Departure Date</span>
                  <span className="text-white font-medium font-mono">{nextFlight.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-platinum/50">Departure Time</span>
                  <span className="text-white font-medium font-mono">{nextFlight.departure?.time || "09:00"} Local</span>
                </div>
                {nextFlight.catering && (
                  <div className="flex justify-between">
                    <span className="text-platinum/50 font-sans">Catering Tier</span>
                    <span className="text-white font-medium">{nextFlight.catering.split(" (")[0]}</span>
                  </div>
                )}
                {nextFlight.chauffeur && (
                  <div className="flex justify-between">
                    <span className="text-platinum/50 font-sans">Ground Chauffeur</span>
                    <span className="text-white font-medium">{nextFlight.chauffeur.split(" (")[0]}</span>
                  </div>
                )}
              </div>

              <button 
                onClick={() => window.location.href='/dashboard/flights'}
                className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-bold transition-all text-sm cursor-pointer"
              >
                View Flight Boarding Pass
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel py-20 rounded-3xl border border-white/5 flex flex-col justify-center items-center text-center max-w-2xl mx-auto">
          <ShieldAlert className="w-12 h-12 text-gold/30 mb-6 animate-pulse" />
          <h2 className="text-2xl font-serif text-white mb-2">No Active Voyages</h2>
          <p className="text-platinum/50 text-sm max-w-sm font-light mb-8">Deploy a private jet or select a premium commercial flight to monitor live telemetry.</p>
          <div className="flex gap-4">
            <Link href="/fleet"><button className="px-6 py-2.5 bg-gold text-onyx font-bold rounded-lg text-sm cursor-pointer">Deploy Fleet</button></Link>
            <Link href="/commercial"><button className="px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg text-sm cursor-pointer">Search Commercial</button></Link>
          </div>
        </div>
      )}
    </div>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-panel p-4 rounded-xl border border-white/20 bg-onyx/85 backdrop-blur-md flex-1">
      <p className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono mb-1">{label}</p>
      <p className="text-xl font-bold font-mono text-white">{value}</p>
    </div>
  );
}
