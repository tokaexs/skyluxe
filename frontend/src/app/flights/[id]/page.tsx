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
  Info,
  Utensils,
  Zap,
  Tv,
  Leaf,
  Award,
  Calendar,
  Check
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { api } from "@/lib/api";
import { useSkyLuxeStore } from "@/store/skyluxeStore";
import { getAirportByCode } from "@/lib/airports";

const flightDetailDB: Record<string, any> = {
  "AI": { airline: "Air India", name: "Air India Sovereign Service", aircraft: "Airbus A350-900", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Air_India_Logo.svg/240px-Air_India_Logo.svg.png", brandColor: "#e01d23", meal: "Indian Heritage Tasting Menu", lounge: "Maharaja Lounge Prime", wifi: "High-Speed complimentary", stops: "Nonstop" },
  "6E": { airline: "IndiGo", name: "IndiGo 6E Prime", aircraft: "Airbus A321neo", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IndiGo_Airlines_logo.svg/240px-IndiGo_Airlines_logo.svg.png", brandColor: "#001d6c", meal: "Gourmet Snack Box & Beverage", lounge: "Terminal Lounge Access (+$30)", wifi: "In-flight Streaming", stops: "Nonstop" },
  "UK": { airline: "Vistara", name: "Vistara Club Premium", aircraft: "Boeing 787-9 Dreamliner", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Vistara_Logo.svg/240px-Vistara_Logo.svg.png", brandColor: "#5f2545", meal: "Michelin-Inspired Multi-Course", lounge: "Vistara Signature Lounge", wifi: "Complimentary High-Speed", stops: "Nonstop" },
  "QP": { airline: "Akasa Air", name: "Akasa Air SkyComfort", aircraft: "Boeing 737 MAX 8", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Akasa_Air_logo.svg/240px-Akasa_Air_logo.svg.png", brandColor: "#ff6f00", meal: "Cafe Akasa Fresh Food Box", lounge: "Standard Terminal Lounge", wifi: "Offline Media Console", stops: "Nonstop" },
  "SG": { airline: "SpiceJet", name: "SpiceJet SpiceMax", aircraft: "Boeing 737-800", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/SpiceJet_logo.svg/240px-SpiceJet_logo.svg.png", brandColor: "#c8102e", meal: "Hot Meals & Refreshments", lounge: "SpiceJet Priority Lounge", wifi: "SpicEngage In-flight Portal", stops: "Nonstop" },
  "EK": { airline: "Emirates", name: "Emirates First & Business Suite", aircraft: "Airbus A380-800", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/240px-Emirates_logo.svg.png", brandColor: "#d71920", meal: "Caviar & Gourmet Arabic Cuisine", lounge: "Emirates First Class FBO Lounge", wifi: "Unlimited high-speed", stops: "Nonstop" },
  "QR": { airline: "Qatar Airways", name: "Qatar Airways Qsuite", aircraft: "Airbus A350-1000", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Qatar_Airways_logo.svg/240px-Qatar_Airways_logo.svg.png", brandColor: "#5c0632", meal: "Michelin-Curated On-Demand Dining", lounge: "Al Mourjan Business Lounge", wifi: "Super Wi-Fi Onboard", stops: "Nonstop" },
  "SQ": { airline: "Singapore Airlines", name: "Singapore Airlines SilverKris", aircraft: "Airbus A350-900", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Singapore_Airlines_Logo_2.svg/240px-Singapore_Airlines_Logo_2.svg.png", brandColor: "#1d2c5c", meal: "Book the Cook World Gourmet Menu", lounge: "SilverKris Signature Lounge", wifi: "Complimentary Unlimited", stops: "Nonstop" },
  "BA": { airline: "British Airways", name: "British Airways Club World", aircraft: "Boeing 787-10", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/British_Airways_Logo.svg/240px-British_Airways_Logo.svg.png", brandColor: "#072286", meal: "Traditional British Roast & Fine Wines", lounge: "Concorde & Galleries Lounge", wifi: "High-Speed In-flight", stops: "Nonstop" }
};

const aircraftData: Record<string, any> = {
  "Airbus A350-900": {
    name: "Airbus A350-900",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800",
    specs: { range: "8,100 nm (15,000 km)", speed: "Mach 0.89 (950 km/h)", capacity: "325 passengers", length: "66.8 m", wingspan: "64.7 m" },
    layout: "First Suite (1-2-1) • Business (1-2-1) • Premium Economy (2-4-2)"
  },
  "Airbus A350-1000": {
    name: "Airbus A350-1000",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800",
    specs: { range: "8,700 nm (16,100 km)", speed: "Mach 0.89 (950 km/h)", capacity: "380 passengers", length: "73.8 m", wingspan: "64.7 m" },
    layout: "Qsuite Private Cabins (1-2-1) • Economy (3-3-3)"
  },
  "Boeing 787-9 Dreamliner": {
    name: "Boeing 787-9 Dreamliner",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800",
    specs: { range: "7,530 nm (13,950 km)", speed: "Mach 0.85 (903 km/h)", capacity: "296 passengers", length: "62.8 m", wingspan: "60.1 m" },
    layout: "Business Suite (1-2-1) • Premium Economy (2-3-2) • Economy (3-3-3)"
  },
  "Boeing 787-10": {
    name: "Boeing 787-10",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800",
    specs: { range: "6,430 nm (11,910 km)", speed: "Mach 0.85 (903 km/h)", capacity: "336 passengers", length: "68.3 m", wingspan: "60.1 m" },
    layout: "Club Suite (1-2-1) • World Traveller Plus (2-3-2) • Economy (3-3-3)"
  },
  "Boeing 777-300ER": {
    name: "Boeing 777-300ER",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800",
    specs: { range: "7,370 nm (13,650 km)", speed: "Mach 0.84 (892 km/h)", capacity: "396 passengers", length: "73.9 m", wingspan: "64.8 m" },
    layout: "First Suite (1-2-1) • Business Flatbed (2-2-2) • Economy (3-4-3)"
  },
  "Airbus A380-800": {
    name: "Airbus A380-800 Superjumbo",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800",
    specs: { range: "8,000 nm (14,800 km)", speed: "Mach 0.85 (903 km/h)", capacity: "517 passengers", length: "72.7 m", wingspan: "79.8 m" },
    layout: "First Class Private Suites & Shower Spa • Business Class Bar Lounge"
  },
  "Airbus A321neo": {
    name: "Airbus A321neo",
    image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=800",
    specs: { range: "4,000 nm (7,400 km)", speed: "Mach 0.78 (833 km/h)", capacity: "220 passengers", length: "44.5 m", wingspan: "35.8 m" },
    layout: "Business Class (2-2) • Economy Class (3-3)"
  },
  "Airbus A320neo": {
    name: "Airbus A320neo",
    image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=800",
    specs: { range: "3,500 nm (6,500 km)", speed: "Mach 0.78 (833 km/h)", capacity: "186 passengers", length: "37.6 m", wingspan: "35.8 m" },
    layout: "Business Class (2-2) • Economy Class (3-3)"
  },
  "Boeing 737 MAX 8": {
    name: "Boeing 737 MAX 8",
    image: "https://images.unsplash.com/photo-1520437358207-3dbf5879e3c6?q=80&w=800",
    specs: { range: "3,550 nm (6,570 km)", speed: "Mach 0.79 (842 km/h)", capacity: "178 passengers", length: "39.5 m", wingspan: "35.9 m" },
    layout: "Business Class (2-2) • Economy Class (3-3)"
  },
  "Boeing 737-800": {
    name: "Boeing 737-800",
    image: "https://images.unsplash.com/photo-1520437358207-3dbf5879e3c6?q=80&w=800",
    specs: { range: "3,115 nm (5,765 km)", speed: "Mach 0.785 (838 km/h)", capacity: "189 passengers", length: "39.5 m", wingspan: "35.8 m" },
    layout: "SpiceMax Extra Legroom (3-3) • Standard Economy (3-3)"
  }
};

function DetailsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currency, formatAmount } = useSkyLuxeStore();

  const flightId = (params?.id as string) || "SG-101";
  const fromCode = (searchParams.get("from") || "BOM").toUpperCase();
  const toCode = (searchParams.get("to") || "DEL").toUpperCase();
  const dateStr = searchParams.get("date") || (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  })();
  const passengers = Number(searchParams.get("passengers")) || 1;
  
  // Normalise cabin class: Default to economy unless explicitly business or first
  const rawClass = (searchParams.get("class") || "economy").toLowerCase();
  const cabinClass = rawClass === "all" ? "economy" : ['economy', 'business', 'first'].includes(rawClass) ? rawClass : 'economy';
  
  // Quick hydration from search parameters
  const queryPrice = Number(searchParams.get("price")) || 0;
  const queryAirline = searchParams.get("airline");
  const queryAircraft = searchParams.get("aircraft");

  // Carrier prefix lookup (e.g., SG-342 -> SG)
  const carrierPrefix = flightId.split("-")[0]?.toUpperCase() || "SG";
  const staticFlight = flightDetailDB[carrierPrefix] || flightDetailDB["SG"] || flightDetailDB["AI"];

  // Backend Flight State
  const [flightData, setFlightData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFlight = async () => {
      try {
        setIsLoading(true);
        const data = await api.get<any>(`/flights/${flightId}?from=${fromCode}&to=${toCode}&date=${dateStr}`);
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
  }, [flightId, fromCode, toCode, dateStr]);

  const originAirport = getAirportByCode(fromCode);
  const destAirport = getAirportByCode(toCode);

  const airlineObj = flightData?.airline && typeof flightData.airline === "object" ? flightData.airline : null;
  const airlineName = queryAirline || (airlineObj ? airlineObj.airlineName : staticFlight.airline);
  const logoUrl = airlineObj ? airlineObj.logoUrl : staticFlight.logo;
  const brandColor = airlineObj ? (airlineObj.brandColor || staticFlight.brandColor || "#D4AF37") : (staticFlight.brandColor || "#D4AF37");
  const aircraft = queryAircraft || flightData?.aircraft || staticFlight.aircraft;
  const stops = flightData?.stops === 0 ? "Nonstop" : flightData?.stops ? `${flightData.stops} Stop` : staticFlight.stops;
  
  // Price computation: Priority -> queryPrice -> API response for specific cabin -> static multiplier
  const selectedClassKey = cabinClass as 'economy' | 'business' | 'first';
  const price = queryPrice > 0 
    ? queryPrice 
    : (flightData?.price?.[selectedClassKey] || flightData?.price?.economy || 65);
  
  const fareTotal = price * passengers;
  const fboFee = Math.round(price * 0.05 * passengers);
  const taxes = Math.round(price * 0.12 * passengers);
  const totalDue = fareTotal + fboFee + taxes;

  const [activeTab, setActiveTab] = useState<"specs" | "baggage" | "fare" | "rules">("specs");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(!logoUrl);
  }, [logoUrl]);

  const aircraftInfo = aircraftData[aircraft] || aircraftData["Airbus A321neo"] || aircraftData["Boeing 737-800"];

  // Custom descriptions for carriers
  const getAirlineDescription = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("spicejet")) {
      return "SpiceJet is one of India's favorite airlines, providing extensive domestic and international network connectivity with SpiceMax premium extra legroom seats and warm onboard hospitality.";
    } else if (n.includes("air india")) {
      return "Air India is the premier full-service flag carrier of India, offering classic Maharaja hospitality, chef-curated meals, and direct global connectivity.";
    } else if (n.includes("indigo")) {
      return "IndiGo is India's largest and most punctual airline, recognized globally for seamless boarding, reliable operations, and expansive route frequencies.";
    } else if (n.includes("emirates")) {
      return "Emirates is the award-winning luxury international airline of Dubai, famous for its private suites, onboard dining, and world-class in-flight entertainment.";
    } else if (n.includes("qatar")) {
      return "Qatar Airways is widely acclaimed for its ultra-luxury Qsuite private business cabins, 5-star Michelin-inspired service, and modern fuel-efficient fleet.";
    } else if (n.includes("singapore")) {
      return "Singapore Airlines stands as a global symbol of refined hospitality, elegant cabin aesthetics, and world-class passenger comfort.";
    } else if (n.includes("akasa")) {
      return "Akasa Air offers modern, eco-friendly air travel with plush ergonomic seating, USB fast-charging, and delicious Café Akasa dining.";
    } else if (n.includes("vistara")) {
      return "Vistara was a legendary full-service joint venture between Tata Sons and Singapore Airlines, establishing new heights in luxury dining and customer-first service.";
    } else if (n.includes("british")) {
      return "British Airways connects the world to the United Kingdom with Club World suites, dedicated lounge access, and British hospitality.";
    }
    return "Official premium code-share partner of SkyLuxe Aviation, offering custom pre-check clearance and fast-track terminal privileges.";
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
        <p className="text-sm font-mono text-platinum/50 uppercase tracking-widest">Loading {airlineName} manifest...</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex-grow flex flex-col pt-32 pb-24 px-4 sm:px-6 lg:px-16 max-w-5xl mx-auto w-full">
      <Link 
        href={`/flights/search?from=${fromCode}&to=${toCode}&date=${dateStr}&class=${cabinClass}`} 
        className="text-platinum/50 hover:text-white transition-colors text-xs font-mono uppercase mb-8 flex items-center gap-2"
      >
        ← Back to Search Results
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 sm:p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden bg-onyx/90"
        style={{ borderTop: `6px solid ${brandColor}` }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        {/* Flight Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 border-b border-white/10 pb-8">
          <div className="flex gap-4 items-center">
            {imageError ? (
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white font-mono text-base shadow-lg shrink-0 border border-white/10"
                style={{ backgroundColor: brandColor }}
              >
                {getInitials(airlineName)}
              </div>
            ) : (
              <img 
                src={logoUrl} 
                alt={airlineName} 
                onError={() => setImageError(true)}
                className="w-14 h-14 rounded-2xl object-contain bg-white/10 p-2 border border-white/10 shrink-0 shadow-md"
              />
            )}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">{airlineName}</h1>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full border border-gold/30 bg-gold/10 text-gold uppercase tracking-wider">
                  {flightId}
                </span>
              </div>
              <p className="text-xs font-mono text-platinum/60 mt-1">
                {aircraft} • {stops} • {cabinClass.toUpperCase()} CLASS
              </p>
            </div>
          </div>

          <div className="flex flex-col md:items-end">
            <span className="text-xs font-mono text-platinum/50 uppercase tracking-widest">Guaranteed Total</span>
            <span className="text-3xl font-serif font-bold text-gold tracking-tight">{formatAmount(totalDue)}</span>
            <span className="text-[10px] font-mono text-platinum/40">Includes all taxes & airport fees for {passengers} passenger{passengers > 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Route Visualizer Card */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left w-full md:w-auto">
            <span className="text-[10px] font-mono text-gold uppercase tracking-wider">Origin ({fromCode})</span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">{originAirport?.city || fromCode}</h3>
            <p className="text-xs text-platinum/60">{originAirport?.name || `${fromCode} Airport`}</p>
            <span className="text-xs font-mono text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20 inline-block mt-1">
              Terminal {flightData?.departure?.terminal || "T2"}
            </span>
          </div>

          <div className="flex flex-col items-center flex-1 w-full px-4">
            <span className="text-[10px] font-mono text-platinum/50 uppercase tracking-widest mb-1.5">
              {flightData?.duration ? `${Math.floor(flightData.duration / 60)}h ${flightData.duration % 60}m` : "2h 15m"} Flight Time
            </span>
            <div className="w-full border-t border-dashed border-white/20 relative flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-gold absolute -left-1" />
              <div className="w-2 h-2 rounded-full bg-gold absolute -right-1" />
              <Plane className="w-4 h-4 text-gold rotate-90 bg-onyx px-0.5" />
            </div>
            <span className="text-[10px] font-mono text-emerald-400 mt-1.5 uppercase tracking-wider">Direct Jetstream Routing</span>
          </div>

          <div className="text-right w-full md:w-auto">
            <span className="text-[10px] font-mono text-gold uppercase tracking-wider">Destination ({toCode})</span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">{destAirport?.city || toCode}</h3>
            <p className="text-xs text-platinum/60">{destAirport?.name || `${toCode} Airport`}</p>
            <span className="text-xs font-mono text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20 inline-block mt-1">
              Terminal {flightData?.arrival?.terminal || "T3"}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-white/10 pb-4 mb-6 overflow-x-auto">
          {[
            { id: "specs", label: "Aircraft & Layout" },
            { id: "baggage", label: "Baggage Allowances" },
            { id: "fare", label: "Transparent Price Breakdown" },
            { id: "rules", label: "Cancellation & Rules" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? "bg-gold text-onyx font-bold shadow-[0_0_12px_rgba(212,175,55,0.3)]" 
                  : "bg-white/5 text-platinum/60 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Specs */}
        {activeTab === "specs" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-mono text-gold uppercase tracking-wider">Aircraft Specifications</h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1.5 border-b border-white/5"><span className="text-platinum/50">Model</span><span className="text-white font-bold">{aircraft}</span></div>
                  <div className="flex justify-between py-1.5 border-b border-white/5"><span className="text-platinum/50">Range</span><span className="text-white">{aircraftInfo.specs.range}</span></div>
                  <div className="flex justify-between py-1.5 border-b border-white/5"><span className="text-platinum/50">Cruising Speed</span><span className="text-white">{aircraftInfo.specs.speed}</span></div>
                  <div className="flex justify-between py-1.5 border-b border-white/5"><span className="text-platinum/50">Cabin Layout</span><span className="text-white">{aircraftInfo.layout}</span></div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-mono text-gold uppercase tracking-wider">About {airlineName}</h4>
                <p className="text-xs text-platinum/70 leading-relaxed">{getAirlineDescription(airlineName)}</p>
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
                  <Leaf className="w-4 h-4 shrink-0" />
                  <span>Eco-Optimized: 14% less fuel consumption and lower CO₂ per seat.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Baggage */}
        {activeTab === "baggage" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <p className="text-xs font-mono text-gold uppercase tracking-wider font-semibold">Personal Item</p>
              <p className="text-sm font-bold text-white">1 Laptop / Handbag</p>
              <p className="text-xs text-platinum/50">Fits under seat (up to 40x30x15 cm).</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <p className="text-xs font-mono text-gold uppercase tracking-wider font-semibold">Cabin Baggage</p>
              <p className="text-sm font-bold text-white">7 kg (1 pc)</p>
              <p className="text-xs text-platinum/50">Complimentary cabin luggage.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <p className="text-xs font-mono text-gold uppercase tracking-wider font-semibold">Checked-In Luggage</p>
              <p className="text-sm font-bold text-white">{cabinClass === "first" ? "50 kg" : cabinClass === "business" ? "30 kg" : "15 kg"}</p>
              <p className="text-xs text-platinum/50">Included in this booking manifest.</p>
            </div>
          </div>
        )}

        {/* Tab 3: Fare Breakdown */}
        {activeTab === "fare" && (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono text-platinum/70 pb-2 border-b border-white/5">
              <span>Base Airfare ({passengers}x Passenger)</span>
              <span className="text-white">{formatAmount(fareTotal)}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono text-platinum/70 pb-2 border-b border-white/5">
              <span>FBO Terminal Clearance & Priority Handling</span>
              <span className="text-white">{formatAmount(fboFee)}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono text-platinum/70 pb-2 border-b border-white/5">
              <span>Airport Development Fee (ADF) & Government Taxes</span>
              <span className="text-white">{formatAmount(taxes)}</span>
            </div>
            <div className="flex justify-between items-center text-base font-mono font-bold text-gold pt-2 border-t border-white/10">
              <span>Total Guaranteed Amount</span>
              <span>{formatAmount(totalDue)}</span>
            </div>
          </div>
        )}

        {/* Tab 4: Rules */}
        {activeTab === "rules" && (
          <div className="space-y-4 text-xs font-mono text-platinum/70">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
              <p className="text-white font-bold uppercase">24-Hour Free Cancellation</p>
              <p>You can cancel this booking within 24 hours of booking confirmation for a 100% full refund.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
              <p className="text-white font-bold uppercase">Date Rescheduling</p>
              <p>Change your flight date up to 4 hours before departure with zero airline fee (fare difference may apply).</p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-platinum/60">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Instant confirmation with SkyLuxe e-Ticket</span>
          </div>

          <Link 
            href={`/checkout?type=commercial&id=${flightId}&flightId=${flightId}&from=${fromCode}&to=${toCode}&date=${dateStr}&passengers=${passengers}&class=${cabinClass}&price=${totalDue}&total=${totalDue}&airline=${encodeURIComponent(airlineName)}&aircraft=${encodeURIComponent(aircraft)}`}
            className="w-full sm:w-auto"
          >
            <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gold text-onyx font-bold text-xs uppercase font-mono tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:brightness-110 transition-all cursor-pointer">
              Proceed to Passenger & Seat Selection →
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function FlightDetails() {
  return (
    <main className="relative min-h-screen bg-onyx flex flex-col selection:bg-gold/30">
      <GlassNavbar />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#020202] via-onyx to-[#020202] pointer-events-none" />
      <Suspense fallback={<div className="flex-grow flex items-center justify-center text-white pt-32 font-mono text-sm">Loading flight details...</div>}>
        <DetailsContent />
      </Suspense>
    </main>
  );
}
