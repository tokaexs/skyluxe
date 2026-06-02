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
import { api } from "@/lib/api";
import { useSkyLuxeStore } from "@/store/skyluxeStore";

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
  const { currency, formatAmount } = useSkyLuxeStore();

  const flightId = (params?.id as string) || "AI-101";
  const fromCode = searchParams.get("from") || "BOM";
  const toCode = searchParams.get("to") || "DXB";
  const dateStr = searchParams.get("date") || "2026-06-04";
  const passengers = Number(searchParams.get("passengers")) || 1;
  const cabinClass = searchParams.get("class") || "Business";

  // Backend Flight State
  const [flightData, setFlightData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFlight = async () => {
      try {
        setIsLoading(true);
        const data = await api.get<any>(`/flights/${flightId}`);
        if (data) {
          setFlightData(data);
        }
      } catch (err) {
        console.error("Failed to load flight details from backend:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadFlight();
  }, [flightId]);

  // Fallback to static DB mapping if backend is loading/failed
  const staticFlight = flightDetailDB[flightId] || flightDetailDB["AI-101"];
  
  const airlineObj = flightData?.airline && typeof flightData.airline === "object" ? flightData.airline : null;
  const airlineName = airlineObj ? airlineObj.airlineName : (flightData?.airline || staticFlight.airline);
  const logoUrl = airlineObj ? airlineObj.logoUrl : staticFlight.logo;
  const brandColor = airlineObj ? (airlineObj.brandColor || "#D4AF37") : "#D4AF37";
  const aircraft = flightData?.aircraft || staticFlight.aircraft;
  const stops = flightData?.stops === 0 ? "Nonstop" : flightData?.stops ? `${flightData.stops} Stop` : staticFlight.stops;
  
  const selectedClassKey = ['economy', 'business', 'first'].includes(cabinClass.toLowerCase()) ? cabinClass.toLowerCase() : 'business';
  const price = flightData?.price?.[selectedClassKey as 'economy' | 'business' | 'first'] || staticFlight.price || 1200;
  
  const fareTotal = price * passengers;
  const fboFee = 45 * passengers;
  const taxes = Math.round(price * 0.12 * passengers);
  const totalDue = fareTotal + fboFee + taxes;

  const [activeTab, setActiveTab] = useState<"specs" | "baggage" | "fare" | "rules">("specs");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(!logoUrl);
  }, [logoUrl]);

  const aircraftInfo = aircraftData[aircraft] || aircraftData["Airbus A350-900"];

  // Custom descriptions for seeded carriers
  const getAirlineDescription = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("air india")) {
      return "Air India is the premier full-service carrier of India. Under the stewardship of the Tata Group, it is transitioning into a world-class global airline with state-of-the-art passenger comfort and classic Maharaja hospitality.";
    } else if (n.includes("indigo")) {
      return "IndiGo is India's largest and most reliable low-fare carrier, recognized globally for its high standards of operational safety, on-time arrivals, and hassle-free transit experience.";
    } else if (n.includes("emirates")) {
      return "Emirates is the award-winning international airline of Dubai. It sets the benchmark for luxury long-haul air travel with its iconic double-decker A380s, private suites, and onboard shower spas.";
    } else if (n.includes("qatar")) {
      return "Qatar Airways is the state-owned airline of Qatar. It is highly regarded for its ultra-premium Qsuite business class configurations, 5-star service, and award-winning catering.";
    } else if (n.includes("singapore")) {
      return "Singapore Airlines is the flag carrier of Singapore. It stands as a symbol of elegance, consistency, and premium cabin design, regularly voted the world's best airline.";
    } else if (n.includes("akasa")) {
      return "Akasa Air is a fast-growing Indian airline offering green-conscious flight operations, comfortable seats, and fresh in-flight selections from Café Akasa.";
    } else if (n.includes("vistara")) {
      return "Vistara was a legendary full-service joint venture between Tata Sons and Singapore Airlines, establishing new heights in luxury dining and customer-first service.";
    }
    return "Official premium code-share partner of SkyLuxe Aviation, offering custom pre-check clearance and fast-track lounge privileges.";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-white min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-white/10 border-t-gold rounded-full animate-spin mb-4" />
        <p className="text-sm font-mono text-platinum/50 uppercase tracking-widest">Loading flight details...</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex-grow flex flex-col pt-32 pb-24 px-6 lg:px-16 max-w-5xl mx-auto w-full">
      <Link href={`/flights/search?from=${fromCode}&to=${toCode}&date=${dateStr}&class=${cabinClass}`} className="text-platinum/50 hover:text-white transition-colors text-xs font-mono uppercase mb-8 flex items-center gap-2">
        ← Back to Search Manifests
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden bg-onyx/85"
        style={{ borderTop: `6px solid ${brandColor}` }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        {/* Flight Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 border-b border-white/5 pb-8">
          <div className="flex gap-4 items-center">
            {imageError ? (
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-white font-mono text-lg shadow-lg"
                style={{ backgroundColor: brandColor }}
              >
                {getInitials(airlineName)}
              </div>
            ) : (
              <img 
                src={logoUrl} 
                alt={airlineName} 
                onError={() => setImageError(true)}
                className="w-16 h-16 rounded-2xl object-contain bg-white/10 p-2 border border-white/10" 
              />
            )}
            <div>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-platinum/70 uppercase tracking-widest mb-1.5 inline-block font-mono">
                {cabinClass} Class Suitability
              </span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-1">{airlineName} {flightId}</h1>
              <p className="text-platinum/50 text-xs font-mono">{aircraft} • Scheduled Carrier</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-platinum/50 uppercase tracking-widest block mb-1 font-mono">Tariff / Passenger</span>
            <span className="text-4xl font-bold text-white font-serif">{formatAmount(price)}</span>
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
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1c1c1e] border border-white/5 px-3 py-0.5 rounded-full text-[9px] text-platinum/50 font-mono">{stops}</span>
            </div>
            <p className="text-[10px] text-platinum/40 font-mono">Duration: 3h 30m</p>
          </div>
          <div>
            <h3 className="text-3xl font-serif text-white font-bold">{toCode}</h3>
            <p className="text-platinum/50 text-xs mt-1">Arrival FBO</p>
            <p className="text-white text-sm font-medium mt-2 font-mono">11:30 AM</p>
          </div>
        </div>

        {/* Airline Description */}
        <div className="mb-10 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
          <h4 className="text-white font-serif font-bold text-sm mb-2">About The Carrier</h4>
          <p className="text-platinum/60 text-xs leading-relaxed font-light">{getAirlineDescription(airlineName)}</p>
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
              style={{ borderColor: activeTab === tab.id ? brandColor : "transparent", color: activeTab === tab.id ? brandColor : "" }}
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
                    <p className="text-platinum/50 text-xs mt-1 leading-relaxed">
                      {selectedClassKey === "first" ? "50kg (110lbs)" : selectedClassKey === "business" ? "40kg (88lbs)" : "25kg (55lbs)"} per seat. Priority tag delivery included.
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex gap-4">
                  <Luggage className="w-8 h-8 text-gold shrink-0" />
                  <div>
                    <h5 className="text-white font-bold text-sm">Cabin Baggage Allowance</h5>
                    <p className="text-platinum/50 text-xs mt-1 leading-relaxed">
                      {selectedClassKey === "first" ? "2 pieces up to 15kg" : selectedClassKey === "business" ? "2 pieces up to 12kg" : "1 piece up to 8kg"} cabin carry-on plus handbag.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-xs text-platinum/60 font-light flex items-center gap-2">
                <Shield className="w-4 h-4 text-gold shrink-0" />
                All checked assets are cleared through VIP security screening automatically.
              </div>
            </motion.div>
          )}

          {activeTab === "fare" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-w-md">
              <h4 className="text-white font-serif font-bold text-md mb-2">Detailed Fare Ledger</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-platinum/50">Base Fare ({passengers} Passenger(s))</span>
                  <span className="text-white font-mono">{formatAmount(fareTotal)}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-platinum/50">FBO Fast-Track Clearance Surcharges</span>
                  <span className="text-white font-mono">{formatAmount(fboFee)}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-platinum/50">Aeronautical Taxes & Duties (12%)</span>
                  <span className="text-white font-mono">{formatAmount(taxes)}</span>
                </div>
                <div className="flex justify-between pt-2 text-md font-bold">
                  <span className="text-white font-serif">Total Settlement Due</span>
                  <span className="text-gold font-mono">{formatAmount(totalDue)}</span>
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
                  <p className="text-xs">Cancellations executed at least 24 hours prior to scheduled departure time are subject to a flat fee of {formatAmount(100)}. Inside 24 hours, bookings are non-refundable.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start p-4 bg-white/5 rounded-2xl border border-white/5">
                <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-white font-bold text-sm mb-1">Flight Change Policies</h5>
                  <p className="text-xs">Schedule adjustments are permitted up to 12 hours before takeoff. Flight modifications incur a difference in fare plus an administrative charge of {formatAmount(50)}.</p>
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
                  <h4 className="text-platinum/50 text-[10px] uppercase tracking-widest font-mono">Meal Information</h4>
                  <p className="text-white text-sm font-medium mt-0.5">
                    {selectedClassKey === "first" ? "Premium 5-Course Caviar Menu" : selectedClassKey === "business" ? "Michelin-Inspired A La Carte" : "Gourmet Hot Meal Selection"}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <Wifi className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="text-platinum/50 text-[10px] uppercase tracking-widest font-mono">Cabin Amenities</h4>
                  <p className="text-white text-sm font-medium mt-0.5">
                    {selectedClassKey === "first" ? "High-Speed Wi-Fi • Bulgari Amenity Kit • Flatbed" : selectedClassKey === "business" ? "Complimentary Wi-Fi • Executive Kit" : "In-flight Entertainment Console"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-serif font-medium text-white mb-4">Ground Logistics & Loyalty</h3>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="text-platinum/50 text-[10px] uppercase tracking-widest font-mono">Airport Lounge</h4>
                  <p className="text-white text-sm font-medium mt-0.5">
                    {selectedClassKey === "first" ? `${airlineName} First Class Sovereign Lounge` : selectedClassKey === "business" ? `${airlineName} Business Lounge Access` : "Standard Lounge Entry (Chargeable)"}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="text-platinum/50 text-[10px] uppercase tracking-widest font-mono">Loyalty Program</h4>
                  <p className="text-white text-sm font-medium mt-0.5">
                    {airlineObj?.alliance && airlineObj.alliance !== "None" 
                      ? `${airlineObj.alliance} Points & SkyCoins credited` 
                      : `${airlineName} Member Miles Registry`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/flights/${flightId}/seats?from=${fromCode}&to=${toCode}&date=${dateStr}&passengers=${passengers}&class=${cabinClass}`} className="block w-full">
          <button 
            className="w-full py-4 rounded-xl text-onyx font-bold text-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            style={{ backgroundColor: brandColor, boxShadow: `0 0 25px ${brandColor}40` }}
          >
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
