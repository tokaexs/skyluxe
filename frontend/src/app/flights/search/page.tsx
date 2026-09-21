"use client";

import { motion, AnimatePresence } from "framer-motion";
import GlassNavbar from "@/components/ui/GlassNavbar";
import { 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Plane, 
  Check, 
  Sparkles, 
  Filter, 
  SlidersHorizontal, 
  Map, 
  Loader2, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Luggage, 
  Wifi, 
  Zap, 
  Utensils, 
  Tv, 
  Leaf, 
  TrendingDown, 
  Bell, 
  Info,
  Calendar,
  Layers,
  Award,
  CircleDot
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useSkyLuxeStore } from "@/store/skyluxeStore";
import { getAirportByCode, calculateDistanceKm } from "@/lib/airports";

// Fallback logo helper with initials
function SearchCardLogo({ logoUrl, airlineName, brandColor }: { logoUrl?: string; airlineName: string; brandColor?: string }) {
  const [imageError, setImageError] = useState(!logoUrl);
  
  useEffect(() => {
    setImageError(!logoUrl);
  }, [logoUrl]);

  const initials = airlineName
    .split(" ")
    .map(n => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  if (imageError) {
    return (
      <div 
        className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white font-mono text-sm shadow-md shrink-0 border border-white/10"
        style={{ backgroundColor: brandColor || "#D4AF37" }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={airlineName}
      onError={() => setImageError(true)}
      className="w-12 h-12 rounded-2xl object-contain bg-white/10 p-2 border border-white/10 shrink-0 shadow-sm"
    />
  );
}

function SearchResultsContent() {
  const router = useRouter();
  const { currency, formatAmount } = useSkyLuxeStore();
  const searchParams = useSearchParams();
  
  const fromCode = (searchParams.get("from") || "BOM").toUpperCase();
  const toCode = (searchParams.get("to") || "DWC").toUpperCase();
  const dateStr = searchParams.get("date") || (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  })();
  const tripType = searchParams.get("type") || "one-way";
  const passengers = Number(searchParams.get("passengers")) || 1;
  const initialClass = searchParams.get("class") || "All";

  // API loading & results states
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDate, setActiveDate] = useState(dateStr);

  // Accordion Expand state per flight ID
  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<Record<string, "timeline" | "baggage" | "amenities" | "fare">>(
    {}
  );

  // Filter States
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedStops, setSelectedStops] = useState<number[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(4000);
  const [selectedClass, setSelectedClass] = useState(initialClass);
  const [selectedAircrafts, setSelectedAircrafts] = useState<string[]>([]);
  const [refundableOnly, setRefundableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"best" | "price" | "duration" | "departure">("best");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [priceAlertActive, setPriceAlertActive] = useState(false);

  // Airport details
  const originAirport = useMemo(() => getAirportByCode(fromCode), [fromCode]);
  const destAirport = useMemo(() => getAirportByCode(toCode), [toCode]);
  const routeDistanceKm = useMemo(() => calculateDistanceKm(fromCode, toCode), [fromCode, toCode]);

  // Sync activeDate with query param
  useEffect(() => {
    setActiveDate(dateStr);
  }, [dateStr]);

  // Fetch flights when origin, dest, activeDate, passengers, or class changes
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const cabinClass = selectedClass === "All" ? "economy" : selectedClass.toLowerCase();
        
        const results = await api.post<any[]>("/flights/search", {
          from: fromCode,
          to: toCode === "DXB" ? "Dubai Al Maktoum" : toCode === "Dubai" ? "Dubai Al Maktoum" : toCode,
          date: activeDate,
          passengers,
          class: ['economy', 'business', 'first'].includes(cabinClass) ? cabinClass : 'economy',
          type: tripType
        });

        if (results && Array.isArray(results) && results.length > 0) {
          const mapped = results.map(f => {
            const mappedCabin = ['economy', 'business', 'first'].includes(cabinClass) ? cabinClass : 'economy';
            const airlineObj = f.airline && typeof f.airline === 'object' ? f.airline : null;
            const airlineName = airlineObj ? airlineObj.airlineName : (typeof f.airline === 'string' ? f.airline : "SkyLuxe Partner");
            const logoUrl = airlineObj ? airlineObj.logoUrl : (f.airlineLogo || "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Air_India_Logo.svg/120px-Air_India_Logo.svg.png");
            const brandColor = airlineObj ? (airlineObj.brandColor || "#D4AF37") : "#D4AF37";
            const iataCode = airlineObj ? airlineObj.iataCode : (f.airlineCode || "SL");

            const depTime = f.departure?.time ? new Date(f.departure.time) : new Date();
            const arrTime = f.arrival?.time ? new Date(f.arrival.time) : new Date(Date.now() + 3.5 * 3600 * 1000);
            const durationMins = typeof f.duration === 'number' ? f.duration : 210;

            const priceVal = f.price && typeof f.price === 'object'
              ? (f.price[mappedCabin as 'economy' | 'business' | 'first'] || f.price.business || 450)
              : (typeof f.price === 'number' ? f.price : 450);

            const depHours = !isNaN(depTime.getTime()) ? depTime.getHours() : 9;

            return {
              id: f.flightNumber || f.id || `FL-${Math.floor(100 + Math.random() * 900)}`,
              flightNumber: f.flightNumber || `FL-${Math.floor(100 + Math.random() * 900)}`,
              airline: airlineName,
              logo: logoUrl,
              brandColor: brandColor,
              iataCode: iataCode,
              aircraft: f.aircraft || "Boeing 787-9 Dreamliner",
              seatLayout: f.seatLayout || "3-3-3 Direct Aisle Access",
              departure: { 
                time: !isNaN(depTime.getTime()) ? depTime.toLocaleTimeString("en-US", {hour: '2-digit', minute:'2-digit', hour12: false}) : "09:00", 
                rawTime: depTime,
                hours: depHours,
                timestamp: !isNaN(depTime.getTime()) ? depTime.getHours() + depTime.getMinutes()/60 : 9.0,
                terminal: f.departure?.terminal || "T2",
                gate: f.departure?.gate || "Gate A12",
                airportName: f.departure?.name || originAirport?.name || `${fromCode} Airport`,
                city: f.departure?.city || originAirport?.city || fromCode
              },
              arrival: { 
                time: !isNaN(arrTime.getTime()) ? arrTime.toLocaleTimeString("en-US", {hour: '2-digit', minute:'2-digit', hour12: false}) : "12:30", 
                rawTime: arrTime,
                timestamp: !isNaN(arrTime.getTime()) ? arrTime.getHours() + arrTime.getMinutes()/60 : 12.5,
                terminal: f.arrival?.terminal || "T3",
                airportName: f.arrival?.name || destAirport?.name || `${toCode} Airport`,
                city: f.arrival?.city || destAirport?.city || toCode
              },
              duration: `${Math.floor(durationMins / 60)}h ${durationMins % 60}m`,
              durationMins: durationMins,
              price: priceVal,
              priceBreakdown: f.price && typeof f.price === 'object' ? f.price : { economy: priceVal, business: priceVal * 2.8, first: priceVal * 5.5 },
              stops: typeof f.stops === 'number' ? f.stops : 0,
              classType: mappedCabin === 'first' ? 'First Class Suite' : mappedCabin === 'business' ? 'Business Class' : 'Economy',
              tags: f.tags || ["Direct", "Hot Meal", "Lounge Access"],
              baggage: f.baggage || {
                cabin: "7 kg (1 pc) + Laptop",
                checkinEconomy: "15 kg",
                checkinBusiness: "30 kg",
                checkinFirst: "50 kg"
              },
              amenities: f.amenities || {
                wifi: "High-Speed Wi-Fi",
                power: "AC & USB-C Ports",
                meal: "Complimentary Hot Gourmet Meal",
                entertainment: "13.3-inch 4K OLED Screen",
                seatPitch: {
                  economy: "32 in",
                  business: "78 in Lie-Flat",
                  first: "82 in Private Suite"
                }
              },
              eco: f.eco || {
                co2Kg: Math.round(routeDistanceKm * 0.09),
                diffPercent: -14,
                label: "14% less CO₂ than route average"
              },
              onTime: f.onTime || {
                rate: "95%",
                status: "Highly punctual"
              },
              fareRules: f.fareRules || {
                isRefundable: true,
                freeCancellationHours: 24,
                rescheduleFee: "$0 up to 4 hrs before flight"
              },
              availableSeats: f.availableSeats || { economy: 42, business: 8, first: 2 }
            };
          });
          setFlights(mapped);
        } else {
          setFlights([]);
        }
      } catch (e) {
        console.error("Flight search API failed:", e);
        setFlights([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [fromCode, toCode, activeDate, passengers, selectedClass, originAirport, destAirport, routeDistanceKm, tripType]);

  // Generate 7-Day Adjacent Date Ribbon
  const dateStrip = useMemo(() => {
    const base = new Date(activeDate && !isNaN(new Date(activeDate).getTime()) ? activeDate : Date.now());
    const days = [];
    for (let offset = -3; offset <= 3; offset++) {
      const d = new Date(base);
      d.setDate(base.getDate() + offset);
      const iso = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const dayNum = d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
      
      // Calculate realistic price differential based on day of week
      const isWeekend = d.getDay() === 0 || d.getDay() === 6 || d.getDay() === 5;
      const dayMultiplier = isWeekend ? 1.15 : (d.getDay() === 2 || d.getDay() === 3 ? 0.92 : 1.0);
      const baseEstimate = Math.max(75, Math.round((routeDistanceKm * 0.055 + 30) * dayMultiplier));

      days.push({
        iso,
        dayName,
        dayNum,
        priceEstimate: baseEstimate,
        isCurrent: iso === activeDate,
        isCheapest: d.getDay() === 2 // Tuesday often cheapest
      });
    }
    return days;
  }, [activeDate, routeDistanceKm]);

  // Toggle Airline checklist
  const handleAirlineToggle = (airline: string) => {
    setSelectedAirlines(prev => 
      prev.includes(airline) ? prev.filter(a => a !== airline) : [...prev, airline]
    );
  };

  // Toggle Time slot checklist
  const handleTimeSlotToggle = (slot: string) => {
    setTimeSlots(prev => 
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
  };

  // Toggle Aircraft checklist
  const handleAircraftToggle = (aircraft: string) => {
    setSelectedAircrafts(prev => 
      prev.includes(aircraft) ? prev.filter(a => a !== aircraft) : [...prev, aircraft]
    );
  };

  // Change Date Handler
  const handleDateSelect = (newDateIso: string) => {
    setActiveDate(newDateIso);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("date", newDateIso);
    router.replace(`/flights/search?${newParams.toString()}`, { scroll: false });
  };

  // Toggle Flight Accordion Drawer
  const toggleFlightAccordion = (id: string) => {
    setExpandedFlightId(prev => (prev === id ? null : id));
  };

  // Filter & Sort Logic
  const filteredFlights = useMemo(() => {
    return flights
      .filter(flight => {
        if (selectedAirlines.length > 0 && !selectedAirlines.includes(flight.airline)) return false;
        if (selectedStops.length > 0 && !selectedStops.includes(flight.stops)) return false;
        if (flight.price > maxPrice) return false;
        if (refundableOnly && !flight.fareRules.isRefundable) return false;
        
        // Time slot filter
        if (timeSlots.length > 0) {
          const h = flight.departure.hours;
          const matches = timeSlots.some(slot => {
            if (slot === "morning") return h >= 6 && h < 12;
            if (slot === "afternoon") return h >= 12 && h < 18;
            if (slot === "evening") return h >= 18 && h < 24;
            if (slot === "night") return h >= 0 && h < 6;
            return false;
          });
          if (!matches) return false;
        }

        if (selectedAircrafts.length > 0) {
          const matches = selectedAircrafts.some(ac => flight.aircraft.toLowerCase().includes(ac.toLowerCase()));
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "best") {
          // Score formula: price + (duration * $0.4) - airline bonus
          const scoreA = a.price + a.durationMins * 0.5 - (a.airline.includes("Emirates") || a.airline.includes("Singapore") ? 50 : 0);
          const scoreB = b.price + b.durationMins * 0.5 - (b.airline.includes("Emirates") || b.airline.includes("Singapore") ? 50 : 0);
          return scoreA - scoreB;
        }
        if (sortBy === "price") return a.price - b.price;
        if (sortBy === "duration") return a.durationMins - b.durationMins;
        if (sortBy === "departure") return a.departure.timestamp - b.departure.timestamp;
        return 0;
      });
  }, [flights, selectedAirlines, selectedStops, maxPrice, refundableOnly, timeSlots, selectedAircrafts, sortBy]);

  // Unique airlines for filter
  const availableAirlines = useMemo(() => {
    const set = new Set<string>();
    flights.forEach(f => set.add(f.airline));
    return Array.from(set);
  }, [flights]);

  // Render Filter Content for Desktop & Mobile Sheet
  const renderFilterContent = () => (
    <div className="space-y-6">
      {/* Price Range Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-platinum/50 uppercase tracking-wider">Max Fare</span>
          <span className="text-gold font-bold">{formatAmount(maxPrice)}</span>
        </div>
        <input 
          type="range" 
          min={currency === "USD" ? 50 : 50 * 83} 
          max={currency === "USD" ? 4000 : 4000 * 83} 
          step={currency === "USD" ? 25 : 25 * 83}
          value={currency === "USD" ? maxPrice : Math.round(maxPrice * 83)} 
          onChange={(e) => {
            const val = Number(e.target.value);
            setMaxPrice(currency === "USD" ? val : val / 83);
          }}
          className="w-full accent-gold bg-white/10 h-1.5 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-platinum/40">
          <span>{formatAmount(50)}</span>
          <span>{formatAmount(4000)}</span>
        </div>
      </div>

      {/* Departure Time Slots */}
      <div className="space-y-3">
        <h4 className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Departure Times</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "morning", label: "Morning", time: "06:00 - 12:00" },
            { id: "afternoon", label: "Afternoon", time: "12:00 - 18:00" },
            { id: "evening", label: "Evening", time: "18:00 - 24:00" },
            { id: "night", label: "Night", time: "00:00 - 06:00" }
          ].map(slot => (
            <button
              key={slot.id}
              type="button"
              onClick={() => handleTimeSlotToggle(slot.id)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                timeSlots.includes(slot.id) 
                  ? "bg-gold/15 border-gold/50 text-white" 
                  : "bg-white/[0.02] border-white/10 text-platinum/60 hover:border-white/20"
              }`}
            >
              <p className="text-xs font-semibold text-white">{slot.label}</p>
              <p className="text-[10px] font-mono text-platinum/50">{slot.time}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Stopovers */}
      <div className="space-y-3">
        <h4 className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Stops</h4>
        <div className="space-y-2">
          <label className="flex items-center justify-between text-sm text-platinum/80 cursor-pointer hover:text-white transition-colors">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={selectedStops.includes(0)}
                onChange={() => setSelectedStops(prev => prev.includes(0) ? prev.filter(s => s !== 0) : [...prev, 0])}
                className="accent-gold rounded border-white/20 w-4 h-4" 
              />
              <span>Non-stop Only</span>
            </div>
            <span className="text-[10px] font-mono text-platinum/40">Direct</span>
          </label>
        </div>
      </div>

      {/* Airlines Checklist */}
      <div className="space-y-3">
        <h4 className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Airlines</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {availableAirlines.map((airline) => (
            <label key={airline} className="flex items-center justify-between text-sm text-platinum/80 cursor-pointer hover:text-white transition-colors">
              <div className="flex items-center gap-3 truncate">
                <input 
                  type="checkbox" 
                  checked={selectedAirlines.includes(airline)}
                  onChange={() => handleAirlineToggle(airline)}
                  className="accent-gold rounded border-white/20 w-4 h-4" 
                />
                <span className="truncate">{airline}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Refundable & Policy Options */}
      <div className="space-y-3">
        <h4 className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Fare Flexibility</h4>
        <label className="flex items-center gap-3 text-sm text-platinum/80 cursor-pointer hover:text-white transition-colors">
          <input 
            type="checkbox" 
            checked={refundableOnly}
            onChange={(e) => setRefundableOnly(e.target.checked)}
            className="accent-gold rounded border-white/20 w-4 h-4" 
          />
          <span>Free Cancellation Only</span>
        </label>
      </div>

      {/* Aircraft fleet */}
      <div className="space-y-3">
        <h4 className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Aircraft Models</h4>
        <div className="space-y-2">
          {["A350", "787", "777", "A321", "737", "A380"].map((ac) => {
            const label = ac === "A350" ? "Airbus A350" : ac === "787" ? "Boeing 787" : ac === "777" ? "Boeing 777" : ac === "A321" ? "Airbus A321" : ac === "A380" ? "Airbus A380" : "Boeing 737";
            return (
              <label key={ac} className="flex items-center gap-3 text-sm text-platinum/80 cursor-pointer hover:text-white transition-colors">
                <input 
                  type="checkbox" 
                  checked={selectedAircrafts.includes(ac)}
                  onChange={() => handleAircraftToggle(ac)}
                  className="accent-gold rounded border-white/20 w-4 h-4" 
                />
                <span>{label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative z-10 flex-grow flex flex-col pt-28 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto w-full">
      
      {/* Route Header Banner */}
      <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-white/10 mb-6 bg-onyx/80 backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3.5 text-white mb-2">
              <span className="text-xl sm:text-2xl md:text-3xl font-serif font-bold tracking-tight">
                {originAirport?.city || fromCode}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 font-mono text-platinum/70">{fromCode}</span>
              
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gold mx-1" />
              
              <span className="text-xl sm:text-2xl md:text-3xl font-serif font-bold tracking-tight">
                {destAirport?.city || toCode}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 font-mono text-platinum/70">{toCode}</span>
            </div>
            
            <p className="text-platinum/60 text-xs sm:text-sm font-light flex flex-wrap items-center gap-2">
              <span>{new Date(activeDate).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}</span>
              <span>•</span>
              <span>{passengers} Passenger{passengers > 1 ? "s" : ""}</span>
              <span>•</span>
              <span>{tripType.toUpperCase()}</span>
              <span>•</span>
              <span className="text-gold font-medium">{routeDistanceKm} km Distance</span>
            </p>
          </div>
          
          {/* Cabin Class Switcher Pills */}
          <div className="flex items-center gap-2">
            <div className="flex flex-wrap gap-1 p-1 bg-white/5 border border-white/10 rounded-2xl">
              {["All", "Economy", "Business", "First"].map(cls => (
                <button 
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider font-mono transition-all ${
                    selectedClass === cls 
                      ? 'bg-gold text-onyx shadow-[0_0_15px_rgba(212,175,55,0.4)] font-bold' 
                      : 'text-platinum/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 7-Day Date & Price Strip Carousel (Google Flights / Skyscanner style) */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-mono text-platinum/50 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gold" /> Flexible Date Fare Calendar
            </span>
            <span className="text-[10px] font-mono text-gold/80">Click any day to refresh results</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 overflow-x-auto pb-1">
            {dateStrip.map((day) => (
              <button
                key={day.iso}
                onClick={() => handleDateSelect(day.iso)}
                className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer text-center relative ${
                  day.isCurrent
                    ? "bg-gold/20 border-gold shadow-[0_0_15px_rgba(212,175,55,0.25)] text-white"
                    : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.05] text-platinum/70"
                }`}
              >
                {day.isCheapest && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-black font-bold text-[8px] px-1.5 py-0.2 rounded-full font-mono uppercase">
                    Cheapest
                  </span>
                )}
                <span className="text-[11px] font-semibold">{day.dayName}</span>
                <span className="text-[10px] font-mono opacity-60 mb-1">{day.dayNum}</span>
                <span className={`text-xs font-mono font-bold ${day.isCurrent ? "text-gold" : "text-white"}`}>
                  {formatAmount(day.priceEstimate)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Filter Sidebar (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 glass-panel p-6 rounded-3xl border border-white/10 space-y-7 bg-onyx/50 sticky top-28">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-white font-serif font-bold text-lg flex items-center gap-2">
              <Filter className="w-4 h-4 text-gold" /> Filter Results
            </h3>
            <span className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">
              {filteredFlights.length} found
            </span>
          </div>

          {renderFilterContent()}

          {(selectedAirlines.length > 0 || selectedStops.length > 0 || timeSlots.length > 0 || selectedAircrafts.length > 0 || refundableOnly) && (
            <button
              onClick={() => {
                setSelectedAirlines([]);
                setSelectedStops([]);
                setTimeSlots([]);
                setSelectedAircrafts([]);
                setRefundableOnly(false);
                setMaxPrice(4000);
              }}
              className="w-full py-2.5 rounded-xl border border-white/10 hover:border-gold/30 text-xs font-mono text-platinum hover:text-white uppercase transition-colors"
            >
              Reset All Filters
            </button>
          )}
        </aside>

        {/* Right Search Results Column */}
        <div className="lg:col-span-9 space-y-5">
          
          {/* Mobile Filter Trigger Bar */}
          <div className="lg:hidden flex items-center justify-between gap-3 bg-white/[0.03] border border-white/10 p-3.5 rounded-2xl">
            <span className="text-xs font-mono text-platinum/70">
              Showing <strong className="text-white">{filteredFlights.length}</strong> flight options
            </span>
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/15 text-gold border border-gold/30 text-xs font-bold font-mono uppercase tracking-wider"
            >
              <Filter className="w-3.5 h-3.5" /> Filters ({selectedAirlines.length + selectedStops.length + timeSlots.length})
            </button>
          </div>

          {/* Quick Sort Tabs (Google Flights style: Best / Cheapest / Fastest / Earliest) */}
          <div className="glass-panel p-2 rounded-2xl border border-white/10 bg-onyx/40 flex flex-wrap gap-1.5 sm:gap-2">
            {[
              { id: "best", label: "Best Experience", desc: "Optimal duration & carrier" },
              { id: "price", label: "Cheapest Fare", desc: "Lowest price first" },
              { id: "duration", label: "Fastest Flight", desc: "Shortest duration" },
              { id: "departure", label: "Earliest Departure", desc: "Morning flights first" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSortBy(tab.id as any)}
                className={`flex-1 min-w-[130px] p-2.5 sm:p-3 rounded-xl text-left transition-all ${
                  sortBy === tab.id
                    ? "bg-gold text-onyx font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                    : "bg-white/[0.02] text-platinum/70 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <p className="text-xs font-bold tracking-tight">{tab.label}</p>
                <p className={`text-[10px] font-mono leading-none mt-0.5 ${sortBy === tab.id ? "text-onyx/70" : "text-platinum/40"}`}>
                  {tab.desc}
                </p>
              </button>
            ))}
          </div>

          {/* Price Insights & Live Intelligence Card */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <TrendingDown className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white text-xs sm:text-sm font-medium flex items-center gap-2">
                  <span>Prices are currently <strong className="text-emerald-400 font-semibold">Typical for this Route</strong></span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold uppercase">Great Value</span>
                </p>
                <p className="text-platinum/50 text-[11px] font-light">
                  Direct non-stop service between {fromCode} and {toCode} with premium onboard dining.
                </p>
              </div>
            </div>

            <button
              onClick={() => setPriceAlertActive(prev => !prev)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono flex items-center gap-2 border transition-all shrink-0 ${
                priceAlertActive
                  ? "bg-emerald-500 text-black border-emerald-400 font-bold"
                  : "bg-white/5 border-white/10 text-platinum hover:text-white"
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{priceAlertActive ? "Tracking Active" : "Track Prices"}</span>
            </button>
          </div>

          {/* Flight Search Results List */}
          <div className="space-y-4">
            {loading ? (
              <div className="glass-panel p-16 rounded-3xl border border-white/10 text-center flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-gold animate-spin mb-4" />
                <h4 className="text-white text-base font-serif font-bold mb-1">Scanning Global Airline Manifests</h4>
                <p className="text-platinum/50 text-xs font-mono">Fetching live fares, real-time terminals, and baggage rules...</p>
              </div>
            ) : filteredFlights.length > 0 ? (
              filteredFlights.map((flight) => {
                const isExpanded = expandedFlightId === flight.id;
                const currentTab = activeDetailTab[flight.id] || "timeline";

                return (
                  <motion.div 
                    key={flight.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`glass-panel rounded-3xl border transition-all duration-300 overflow-hidden ${
                      isExpanded 
                        ? "border-gold/50 shadow-[0_0_25px_rgba(212,175,55,0.15)] bg-[#0c0c10]" 
                        : "border-white/10 hover:border-gold/30 hover:bg-white/[0.015]"
                    }`}
                    style={{ borderLeft: `5px solid ${flight.brandColor || '#D4AF37'}` }}
                  >
                    {/* Main Flight Overview Row */}
                    <div className="p-5 sm:p-6 flex flex-col lg:flex-row gap-5 lg:gap-6 items-start lg:items-center justify-between">
                      
                      {/* Airline & Aircraft Meta */}
                      <div className="w-full lg:w-1/4 flex items-center gap-3.5">
                        <SearchCardLogo 
                          logoUrl={flight.logo} 
                          airlineName={flight.airline} 
                          brandColor={flight.brandColor} 
                        />
                        <div className="flex flex-col min-w-0">
                          <p className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                            {flight.airline}
                          </p>
                          <p className="text-[11px] font-mono text-platinum/60 truncate">
                            {flight.flightNumber} • {flight.aircraft}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono font-semibold flex items-center gap-1">
                              <Leaf className="w-2.5 h-2.5" /> {flight.eco.diffPercent}% CO₂
                            </span>
                            <span className="text-[9px] bg-white/5 text-platinum/60 px-1.5 py-0.5 rounded font-mono">
                              {flight.onTime.rate} on-time
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Flight Timeline & Terminals */}
                      <div className="flex-grow w-full flex items-center justify-between gap-3 sm:gap-6 px-1 sm:px-4 py-3 lg:py-0 border-y lg:border-y-0 border-white/5">
                        {/* Origin */}
                        <div className="text-left min-w-[70px]">
                          <p className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
                            {flight.departure.time}
                          </p>
                          <p className="text-xs font-bold text-platinum mt-0.5">{fromCode}</p>
                          <span className="text-[10px] font-mono text-gold bg-gold/10 px-1.5 py-0.5 rounded border border-gold/20 inline-block mt-0.5">
                            {flight.departure.terminal}
                          </span>
                        </div>
                        
                        {/* Route Line */}
                        <div className="flex-1 flex flex-col items-center px-2">
                          <p className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono mb-1">
                            {flight.duration}
                          </p>
                          <div className="w-full border-t border-dashed border-white/20 relative flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-gold/50 absolute -left-1" />
                            <div className="w-2 h-2 rounded-full bg-gold/50 absolute -right-1" />
                            <Plane className="w-4 h-4 text-gold rotate-90 bg-onyx px-0.5" />
                          </div>
                          <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-mono mt-1 font-semibold">
                            {flight.stops === 0 ? "Non-stop" : `${flight.stops} Stop`}
                          </p>
                        </div>
                        
                        {/* Destination */}
                        <div className="text-right min-w-[70px]">
                          <p className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
                            {flight.arrival.time}
                          </p>
                          <p className="text-xs font-bold text-platinum mt-0.5">{toCode}</p>
                          <span className="text-[10px] font-mono text-gold bg-gold/10 px-1.5 py-0.5 rounded border border-gold/20 inline-block mt-0.5">
                            {flight.arrival.terminal}
                          </span>
                        </div>
                      </div>

                      {/* Pricing & CTA */}
                      <div className="w-full lg:w-1/4 flex flex-row lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-white/5 pt-3 lg:pt-0 lg:pl-6 gap-3">
                        <div className="text-left lg:text-right">
                          <span className="text-[10px] text-platinum/50 font-mono uppercase block">
                            {flight.classType}
                          </span>
                          <span className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
                            {formatAmount(flight.price)}
                          </span>
                          <span className="text-[10px] text-platinum/40 font-mono block">incl. all taxes & fees</span>
                        </div>
                        
                        <div className="flex items-center gap-2 w-full sm:w-auto lg:w-full">
                          <button
                            onClick={() => toggleFlightAccordion(flight.id)}
                            className="p-2.5 rounded-xl border border-white/10 hover:border-gold/30 text-platinum hover:text-white text-xs font-mono flex items-center justify-center transition-colors"
                            title="Toggle Details"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-gold" /> : <ChevronDown className="w-4 h-4" />}
                          </button>

                          <Link 
                            href={`/flights/${flight.id}?from=${fromCode}&to=${toCode}&date=${activeDate}&passengers=${passengers}&class=${selectedClass === "All" ? "economy" : selectedClass.toLowerCase()}&price=${flight.price}&airline=${encodeURIComponent(flight.airline)}&aircraft=${encodeURIComponent(flight.aircraft)}`} 
                            className="flex-1"
                          >
                            <button className="w-full py-2.5 px-4 rounded-xl bg-gold/20 text-gold border border-gold/40 hover:bg-gold hover:text-onyx hover:border-gold font-bold text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-[0_0_12px_rgba(212,175,55,0.15)]">
                              Select Flight
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Inclusions Micro-Ribbon */}
                    <div className="px-5 sm:px-6 py-2 bg-white/[0.02] border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-platinum/60">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1"><Luggage className="w-3 h-3 text-gold" /> Cabin: {flight.baggage.cabin}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Luggage className="w-3 h-3 text-platinum/70" /> Check-in: {flight.baggage.checkinEconomy}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Utensils className="w-3 h-3 text-gold" /> {flight.amenities.meal.split(" ")[0]} Included</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-platinum/70" /> {flight.amenities.wifi}</span>
                      </div>

                      <button
                        onClick={() => toggleFlightAccordion(flight.id)}
                        className="text-gold/80 hover:text-gold text-[10px] uppercase font-mono tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        {isExpanded ? "Hide Manifest Breakdown" : "View Full Details & Inclusions"}
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>

                    {/* Expandable Accordion Drawer */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gold/20 bg-black/40 p-5 sm:p-7 space-y-6"
                        >
                          {/* Accordion Tabs */}
                          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
                            {[
                              { id: "timeline", label: "Flight Timeline & Gates", icon: Clock },
                              { id: "baggage", label: "Baggage & Inclusions", icon: Luggage },
                              { id: "amenities", label: "Aircraft & Cabin Comfort", icon: Sparkles },
                              { id: "fare", label: "Transparent Price Breakdown", icon: Layers }
                            ].map(tab => {
                              const Icon = tab.icon;
                              const isCurrent = currentTab === tab.id;
                              return (
                                <button
                                  key={tab.id}
                                  onClick={() => setActiveDetailTab(prev => ({ ...prev, [flight.id]: tab.id as any }))}
                                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all ${
                                    isCurrent 
                                      ? "bg-gold text-onyx font-bold shadow-[0_0_10px_rgba(212,175,55,0.3)]" 
                                      : "bg-white/5 text-platinum/60 hover:text-white"
                                  }`}
                                >
                                  <Icon className="w-3.5 h-3.5" />
                                  <span>{tab.label}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Tab 1: Detailed Timeline */}
                          {currentTab === "timeline" && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                              <div className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono text-gold uppercase tracking-wider">Departure Hub</span>
                                  <span className="text-xs font-mono font-bold text-white">{flight.departure.terminal}</span>
                                </div>
                                <p className="text-base font-serif font-bold text-white">{flight.departure.city} ({fromCode})</p>
                                <p className="text-xs text-platinum/60">{flight.departure.airportName}</p>
                                <p className="text-xs font-mono text-gold mt-2">Boarding Gate: {flight.departure.gate}</p>
                              </div>

                              <div className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-center text-center">
                                <span className="text-[10px] font-mono text-platinum/50 uppercase tracking-widest">Cruising Phase</span>
                                <p className="text-sm font-semibold text-white">{flight.aircraft}</p>
                                <p className="text-xs font-mono text-emerald-400">Direct Flight Path • 38,000 ft</p>
                                <p className="text-xs font-mono text-platinum/50">CO₂: {flight.eco.co2Kg} kg ({flight.eco.diffPercent}% vs route avg)</p>
                              </div>

                              <div className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono text-gold uppercase tracking-wider">Arrival Hub</span>
                                  <span className="text-xs font-mono font-bold text-white">{flight.arrival.terminal}</span>
                                </div>
                                <p className="text-base font-serif font-bold text-white">{flight.arrival.city} ({toCode})</p>
                                <p className="text-xs text-platinum/60">{flight.arrival.airportName}</p>
                                <p className="text-xs font-mono text-emerald-400 mt-2">Expected Carousel: Belt 4</p>
                              </div>
                            </div>
                          )}

                          {/* Tab 2: Baggage Details */}
                          {currentTab === "baggage" && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                                <p className="text-xs font-mono text-gold uppercase tracking-wider font-semibold">Personal Item</p>
                                <p className="text-sm font-bold text-white">1 Laptop / Handbag</p>
                                <p className="text-xs text-platinum/50">Fits under seat in front of you (max 40x30x15 cm).</p>
                              </div>
                              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                                <p className="text-xs font-mono text-gold uppercase tracking-wider font-semibold">Cabin Baggage</p>
                                <p className="text-sm font-bold text-white">{flight.baggage.cabin}</p>
                                <p className="text-xs text-platinum/50">Overhead bin compliant (55x40x23 cm).</p>
                              </div>
                              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                                <p className="text-xs font-mono text-gold uppercase tracking-wider font-semibold">Checked In Baggage</p>
                                <p className="text-sm font-bold text-white">{flight.baggage.checkinEconomy}</p>
                                <p className="text-xs text-platinum/50">Complimentary check-in allowance included in this fare.</p>
                              </div>
                            </div>
                          )}

                          {/* Tab 3: Amenities & Aircraft */}
                          {currentTab === "amenities" && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                                <div className="flex items-center gap-2 text-gold"><Utensils className="w-4 h-4" /> <span className="text-xs font-bold uppercase font-mono">Dining</span></div>
                                <p className="text-xs text-white font-medium">{flight.amenities.meal}</p>
                              </div>
                              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                                <div className="flex items-center gap-2 text-gold"><Zap className="w-4 h-4" /> <span className="text-xs font-bold uppercase font-mono">Power</span></div>
                                <p className="text-xs text-white font-medium">{flight.amenities.power}</p>
                              </div>
                              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                                <div className="flex items-center gap-2 text-gold"><Tv className="w-4 h-4" /> <span className="text-xs font-bold uppercase font-mono">Entertainment</span></div>
                                <p className="text-xs text-white font-medium">{flight.amenities.entertainment}</p>
                              </div>
                              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                                <div className="flex items-center gap-2 text-gold"><Wifi className="w-4 h-4" /> <span className="text-xs font-bold uppercase font-mono">Connectivity</span></div>
                                <p className="text-xs text-white font-medium">{flight.amenities.wifi}</p>
                              </div>
                            </div>
                          )}

                          {/* Tab 4: Fare Breakdown */}
                          {currentTab === "fare" && (
                            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                              <div className="flex justify-between items-center text-xs font-mono text-platinum/70 pb-2 border-b border-white/5">
                                <span>Base Airfare ({passengers}x Passenger)</span>
                                <span className="text-white">{formatAmount(Math.round(flight.price * 0.76))}</span>
                              </div>
                              <div className="flex justify-between items-center text-xs font-mono text-platinum/70 pb-2 border-b border-white/5">
                                <span>Airline Fuel Surcharge (YQ)</span>
                                <span className="text-white">{formatAmount(Math.round(flight.price * 0.12))}</span>
                              </div>
                              <div className="flex justify-between items-center text-xs font-mono text-platinum/70 pb-2 border-b border-white/5">
                                <span>Airport Development Fee & Government Taxes</span>
                                <span className="text-white">{formatAmount(Math.round(flight.price * 0.12))}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm font-mono font-bold text-gold pt-1">
                                <span>Total Fare Guaranteed</span>
                                <span>{formatAmount(flight.price)}</span>
                              </div>
                            </div>
                          )}

                          {/* Quick Upgrade Callout */}
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-gold/15 via-gold/5 to-transparent border border-gold/30">
                            <div className="flex items-center gap-3">
                              <Award className="w-5 h-5 text-gold shrink-0" />
                              <div>
                                <p className="text-xs font-bold text-white">Upgrade to Business Class</p>
                                <p className="text-[11px] text-platinum/60">Lie-flat beds, lounge access, and 30kg check-in baggage.</p>
                              </div>
                            </div>
                            <Link 
                              href={`/flights/${flight.id}?from=${fromCode}&to=${toCode}&date=${activeDate}&passengers=${passengers}&class=business`}
                            >
                              <button className="px-4 py-2 rounded-xl bg-gold text-onyx font-bold text-xs font-mono uppercase tracking-wider shadow-[0_0_12px_rgba(212,175,55,0.3)] hover:brightness-110">
                                View Business ({formatAmount(flight.priceBreakdown.business)})
                              </button>
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <div className="glass-panel p-16 rounded-3xl border border-white/10 text-center">
                <Plane className="w-12 h-12 text-platinum/20 mx-auto mb-4" />
                <h4 className="text-white font-serif text-lg font-bold mb-2">No Matching Flights Found</h4>
                <p className="text-platinum/50 text-sm max-w-sm mx-auto font-light mb-6">
                  Try clearing your airline or pricing filters, or select a neighboring day from the 7-day calendar above.
                </p>
                <button
                  onClick={() => {
                    setSelectedAirlines([]);
                    setSelectedStops([]);
                    setTimeSlots([]);
                    setSelectedAircrafts([]);
                    setRefundableOnly(false);
                    setMaxPrice(4000);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gold text-onyx font-bold text-xs font-mono uppercase"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal Bottom Sheet */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#09090c] border-t border-gold/30 rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <h3 className="text-white font-serif font-bold text-lg flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gold" /> Filter Flights
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 rounded-full bg-white/5 text-platinum/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {renderFilterContent()}

              <div className="pt-6 border-t border-white/10 mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setSelectedAirlines([]);
                    setSelectedStops([]);
                    setTimeSlots([]);
                    setSelectedAircrafts([]);
                    setRefundableOnly(false);
                    setMaxPrice(4000);
                  }}
                  className="flex-1 py-3 rounded-xl border border-white/15 text-xs text-platinum font-mono uppercase"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-gold text-onyx font-bold text-xs font-mono uppercase shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                >
                  Apply Filters ({filteredFlights.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FlightResults() {
  return (
    <main className="relative min-h-screen bg-onyx flex flex-col selection:bg-gold/30">
      <GlassNavbar />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#020202] via-onyx to-[#020202] pointer-events-none" />
      <Suspense fallback={<div className="flex-grow flex items-center justify-center text-white pt-32 font-mono text-sm">Retrieving flight manifests...</div>}>
        <SearchResultsContent />
      </Suspense>
    </main>
  );
}
