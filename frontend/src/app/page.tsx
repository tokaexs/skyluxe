"use client";

import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowRight, PlaneTakeoff, ShieldCheck, Sparkles, MapPin, Star,
  Clock, Trophy, ChevronLeft, ChevronRight, Phone, Mail, Globe,
  Calendar, Users, Plane, Compass, Zap, Crown, Navigation, Wind,
  Coins, Award, QrCode, LogOut
} from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GlassNavbar from "@/components/ui/GlassNavbar";
import LuxuryDatePicker from "@/components/ui/LuxuryDatePicker";
import { useAuth } from "@/context/AuthContext";
import { useSkyLuxeStore } from "@/store/skyluxeStore";
import { useUser } from "@clerk/nextjs";


// ─── Testimonials ──────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "SkyLuxe has fundamentally changed how our executive board operates. The 6-hour jet guarantee in Dubai is unparalleled.",
    author: "Sir Alistair McCree",
    title: "Chairman, McCree Global",
    avatar: "AM",
  },
  {
    quote: "The AI Concierge predicted a routing delay over the Alps and pre-emptively rescheduled my Maybach transfer. Absolutely brilliant.",
    author: "Vanessa D'Amelio",
    title: "Chief Creative Officer, Lux Vows",
    avatar: "VD",
  },
  {
    quote: "With SkyLuxe Elite Membership, booking a transcontinental flight is as effortless as sending a text. A masterpiece of travel software.",
    author: "Rajesh K. Mehta",
    title: "Managing Director, Mehta Diamond Corp",
    avatar: "RM",
  },
];

// ─── Fleet Data ─────────────────────────────────────────────────────────────
const FLEET = [
  { id: "gulfstream-g700", name: "Gulfstream G700", type: "Ultra Long Range", range: "7,500 nm", speed: "Mach 0.925", img: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1200&auto=format&fit=crop" },
  { id: "global-7500", name: "Bombardier Global 7500", type: "Ultra Long Range", range: "7,700 nm", speed: "Mach 0.925", img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format&fit=crop" },
  { id: "gulfstream-g650er", name: "Gulfstream G650ER", type: "Long Range", range: "7,500 nm", speed: "Mach 0.925", img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop" },
  { id: "falcon-8x", name: "Dassault Falcon 8X", type: "Long Range", range: "6,450 nm", speed: "Mach 0.90", img: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?q=80&w=1200&auto=format&fit=crop" },
  { id: "boeing-bbj", name: "Boeing Business Jet", type: "VVIP Widebody", range: "10,200 nm", speed: "Mach 0.85", img: "https://images.unsplash.com/photo-1587019158091-1a103c5dd17f?q=80&w=1200&auto=format&fit=crop" },
  { id: "airbus-acj", name: "Airbus Corporate Jet", type: "VVIP Widebody", range: "12,000 nm", speed: "Mach 0.82", img: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?q=80&w=1200&auto=format&fit=crop" },
];

// ─── Destinations ─────────────────────────────────────────────────────────
const DESTINATIONS = [
  { name: "Dubai", country: "UAE", code: "DWC", weather: "Sunny • 34°C", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800" },
  { name: "Mumbai", country: "India", code: "BOM", weather: "Humid • 28°C", img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800" },
  { name: "Maldives", country: "MV", code: "MLE", weather: "Tropical • 29°C", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800" },
  { name: "London", country: "UK", code: "FAB", weather: "Cloudy • 14°C", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800" },
  { name: "Tokyo", country: "Japan", code: "HND", weather: "Clear • 22°C", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800" },
  { name: "New York", country: "USA", code: "TEB", weather: "Partly Cloudy • 18°C", img: "https://images.unsplash.com/photo-1522083165195-3424ed129620?q=80&w=800" },
];

// ─── Animated Particle ────────────────────────────────────────────────────
function Particle({ x, y, size, duration, delay }: { x: number; y: number; size: number; duration: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-gold/40 pointer-events-none"
      style={{ left: `${x.toFixed(4)}%`, top: `${y.toFixed(4)}%`, width: `${size.toFixed(4)}px`, height: `${size.toFixed(4)}px` }}
      animate={{ y: [-20, -80, -20], opacity: [0, 0.8, 0], scale: [0.5, 1, 0.5] }}
      transition={{ duration, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

// ─── Seeded pseudo-random (stable SSR/client) ─────────────────────────────
function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// ─── Animated Cloud ──────────────────────────────────────────────────────
function Cloud({ top, duration, opacity, scale }: { top: number; duration: number; opacity: number; scale: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ top: `${top}%`, opacity }}
      animate={{ x: ["120vw", "-40vw"] }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <svg width={300 * scale} height={80 * scale} viewBox="0 0 300 80" fill="none">
        <ellipse cx="150" cy="55" rx="140" ry="25" fill="rgba(255,255,255,0.03)" />
        <ellipse cx="100" cy="40" rx="80" ry="30" fill="rgba(255,255,255,0.04)" />
        <ellipse cx="200" cy="45" rx="70" ry="25" fill="rgba(255,255,255,0.03)" />
        <ellipse cx="150" cy="30" rx="60" ry="28" fill="rgba(255,255,255,0.05)" />
      </svg>
    </motion.div>
  );
}

// ─── Route Line SVG Animation ────────────────────────────────────────────
function AnimatedRouteLine({ x1, y1, x2, y2, delay }: { x1: number; y1: number; x2: number; y2: number; delay: number }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  useEffect(() => {
    if (pathRef.current) setPathLength(pathRef.current.getTotalLength());
  }, []);

  const cx = (x1 + x2) / 2;
  const cy = Math.min(y1, y2) - 40;
  const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`grd-${delay}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(212,175,55,0)" />
          <stop offset="50%" stopColor="rgba(212,175,55,0.6)" />
          <stop offset="100%" stopColor="rgba(212,175,55,0)" />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke={`url(#grd-${delay})`}
        strokeWidth="1"
        strokeDasharray={`${pathLength} ${pathLength}`}
        strokeDashoffset={pathLength}
        style={{
          animation: `drawRoute 4s ease-in-out ${delay}s infinite`,
        }}
      />
      <circle cx={x1} cy={y1} r="3" fill="#D4AF37" opacity="0.8" />
      <circle cx={x2} cy={y2} r="3" fill="#D4AF37" opacity="0.8" />
    </svg>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────
function HomeContent() {
  const { user } = useUser();
  const { isAuthenticated, logout, isLoading } = useAuth();
  const { profile, flights, formatAmount, walletBalance, fetchInitialData, coins, syncUserFromClerk } = useSkyLuxeStore();
  const searchParams = useSearchParams();
  const forceLanding = searchParams.get("landing") === "true";
  
  useEffect(() => {
    if (user) {
      syncUserFromClerk(user);
    }
  }, [user, syncUserFromClerk]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchInitialData();
    }
  }, [isAuthenticated, fetchInitialData]);

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 600], [0, -150]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.08]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const textParallax = useTransform(scrollY, [0, 400], [0, -60]);

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [contactForm, setContactForm] = useState({ name: "", email: "", msg: "", sent: false });
  const [stats, setStats] = useState({ flights: 0, routes: 0, members: 0, countries: 0 });
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsTriggered, setStatsTriggered] = useState(false);
  const [fromCity, setFromCity] = useState("Mumbai (BOM)");
  const [toCity, setToCity] = useState("Dubai (DXB)");
  const [departDate, setDepartDate] = useState("2026-06-04");
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState("Business Class");
  const [tripType, setTripType] = useState("one-way");
  const [hoveredJet, setHoveredJet] = useState<number | null>(null);

  // Mouse parallax for hero aircraft
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const aircraftX = useTransform(smoothMouseX, [-300, 300], [-18, 18]);
  const aircraftY = useTransform(smoothMouseY, [-300, 300], [-10, 10]);
  const aircraftRotate = useTransform(smoothMouseX, [-300, 300], [-4, 4]);

  const particles = Array.from({ length: 24 }, (_, i) => ({
    x: seededRand(i * 7) * 100,
    y: seededRand(i * 7 + 1) * 100,
    size: seededRand(i * 7 + 2) * 3 + 1,
    duration: seededRand(i * 7 + 3) * 4 + 3,
    delay: seededRand(i * 7 + 4) * 4,
  }));

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting && !statsTriggered) setStatsTriggered(true); }, { threshold: 0.1 });
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [statsTriggered]);

  useEffect(() => {
    if (!statsTriggered) return;
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setStats({
        flights: Math.min(Math.floor((125000 / steps) * step), 125000),
        routes: Math.min(Math.floor((3500 / steps) * step), 3500),
        members: Math.min(Math.floor((50000 / steps) * step), 50000),
        countries: Math.min(Math.floor((80 / steps) * step), 80),
      });
      if (step >= steps) clearInterval(timer);
    }, 2000 / steps);
    return () => clearInterval(timer);
  }, [statsTriggered]);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const handleCommercialSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const fromCode = fromCity.match(/\(([^)]+)\)/)?.[1] || "BOM";
    const toCode = toCity.match(/\(([^)]+)\)/)?.[1] || "DXB";
    router.push(`/flights/search?from=${fromCode}&to=${toCode}&date=${departDate}&passengers=${passengers}&class=${cabinClass}&type=${tripType}`);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactForm(p => ({ ...p, sent: true }));
    setTimeout(() => setContactForm({ name: "", email: "", msg: "", sent: false }), 4000);
  };
  const activeTier = (profile?.membership || "none").toLowerCase().replace(" ", "_");
  const isMember = activeTier !== "none";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-onyx flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold mb-4"></div>
        <p className="text-sm font-light text-platinum/60">Opening security terminals...</p>
      </div>
    );
  }

  if (isAuthenticated && isMember && !forceLanding) {
    // Choose card details
    let cardGradient = "from-zinc-800 via-zinc-700 to-zinc-900";
    let cardTextColor = "text-zinc-300";
    let cardTitle = "Guest Aviator";
    if (activeTier === "silver") {
      cardGradient = "from-slate-300 via-slate-100 to-slate-400";
      cardTextColor = "text-slate-800";
      cardTitle = "Silver Club";
    } else if (activeTier === "executive") {
      cardGradient = "from-amber-400 via-amber-100 to-amber-600";
      cardTextColor = "text-amber-950";
      cardTitle = "Executive Club";
    } else if (activeTier === "black_elite" || activeTier === "black_elite") {
      cardGradient = "from-neutral-900 via-neutral-800 to-black";
      cardTextColor = "text-gold";
      cardTitle = "Black Elite Club";
    }

    const stats = profile?.passportStats || { countriesVisited: [], flightsTaken: 0, privateJetHours: 0 };
    const upcoming = flights.filter(f => f.status === "Confirmed" || f.status === "Pending").slice(0, 2);

    return (
      <div className="min-h-screen bg-onyx flex flex-col relative select-none">
        {/* Glowing Background Accent */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[140px] pointer-events-none" />
        
        <GlassNavbar />

        <main className="max-w-7xl mx-auto px-6 pt-36 pb-20 w-full flex-1 flex flex-col gap-12">
          {/* Welcome Greeting */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-gold/20 text-gold uppercase tracking-wider font-mono">
                  Sovereign Member Hub
                </span>
                <span className="text-white/30 text-xs">• Operating System Online</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
                Welcome back, {profile?.name || "Aviator"}
              </h1>
              <p className="text-platinum/50 font-light text-sm mt-2 max-w-2xl">
                Review your digital flight credentials, track active dispatches, and check recent travel stats.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Link href="/commercial">
                <button className="px-5 py-2.5 rounded-xl bg-gold text-onyx font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:bg-gold-light transition-all">
                  Book Commercial Leg
                </button>
              </Link>
              <Link href="/fleet">
                <button className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-white font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all">
                  Charter Private Jet
                </button>
              </Link>
            </div>
          </div>

          {/* Hub Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Block: Digital Credentials & Stats (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Digital Club Card */}
              <div className={`w-full h-64 rounded-3xl p-6 relative overflow-hidden shadow-2xl border bg-gradient-to-br ${cardGradient} ${
                activeTier === "black_elite" ? "border-gold/30" : "border-white/10"
              }`}>
                <div className="absolute -top-1/4 -right-1/4 w-80 h-80 rounded-full bg-white/5 blur-[80px] pointer-events-none" />
                
                <div className="h-full flex flex-col justify-between relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`text-[8px] tracking-[0.25em] font-mono uppercase font-bold ${
                        activeTier === "silver" ? "text-slate-600" : activeTier === "executive" ? "text-amber-800" : "text-gold/70"
                      }`}>
                        SkyLuxe Sovereignty
                      </span>
                      <h3 className={`text-2xl font-serif font-bold mt-0.5 ${cardTextColor}`}>
                        {cardTitle}
                      </h3>
                    </div>
                    <Star className={`w-6 h-6 ${cardTextColor}`} />
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="space-y-3">
                      <div>
                        <p className={`text-[8px] uppercase tracking-widest font-mono ${
                          activeTier === "silver" ? "text-slate-600" : "text-platinum/40"
                        }`}>
                          Verified Member
                        </p>
                        <p className={`font-semibold text-sm ${
                          activeTier === "silver" ? "text-slate-900" : "text-white"
                        }`}>{profile.name}</p>
                      </div>

                      <div className="flex gap-6">
                        <div>
                          <p className={`text-[7px] uppercase tracking-widest font-mono ${
                            activeTier === "silver" ? "text-slate-500" : "text-platinum/40"
                          }`}>
                            Member ID
                          </p>
                          <p className={`font-mono text-[10px] ${
                            activeTier === "silver" ? "text-slate-800" : "text-white"
                          }`}>
                            SL-{profile.id ? profile.id.slice(-6).toUpperCase() : "GUEST"}
                          </p>
                        </div>
                        <div>
                          <p className={`text-[7px] uppercase tracking-widest font-mono ${
                            activeTier === "silver" ? "text-slate-500" : "text-platinum/40"
                          }`}>
                            SkyCoins
                          </p>
                          <p className={`font-mono text-[10px] font-bold ${
                            activeTier === "silver" ? "text-slate-800" : "text-gold"
                          }`}>
                            {(coins || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <div className="p-1 bg-white/95 rounded-md shadow-md">
                        <QrCode className="w-9 h-9 text-black" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick statistics */}
              <div className="grid grid-cols-3 gap-4">
                <Link href="/dashboard/passport" className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center hover:border-gold/30 hover:bg-white/10 transition-all">
                  <Globe className="w-5 h-5 text-gold mx-auto mb-1" />
                  <p className="text-lg font-bold font-mono text-white">{stats.countriesVisited?.length || 0}</p>
                  <p className="text-[9px] text-platinum/40 uppercase tracking-widest font-mono mt-0.5">Countries</p>
                </Link>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <Plane className="w-5 h-5 text-gold mx-auto mb-1" />
                  <p className="text-lg font-bold font-mono text-white">{stats.flightsTaken || 0}</p>
                  <p className="text-[9px] text-platinum/40 uppercase tracking-widest font-mono mt-0.5">Missions</p>
                </div>
                <Link href="/dashboard/passport" className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center hover:border-gold/30 hover:bg-white/10 transition-all">
                  <Clock className="w-5 h-5 text-gold mx-auto mb-1" />
                  <p className="text-lg font-bold font-mono text-white">{stats.privateJetHours || 0}h</p>
                  <p className="text-[9px] text-platinum/40 uppercase tracking-widest font-mono mt-0.5">Jet Hours</p>
                </Link>
              </div>

              {/* Wallet Card */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-onyx/40 flex justify-between items-center">
                <div>
                  <p className="text-xs text-platinum/40 uppercase tracking-widest font-mono">FBO Wallet Balance</p>
                  <h4 className="text-2xl font-bold text-white mt-1 font-mono">{formatAmount(walletBalance)}</h4>
                </div>
                <Link href="/dashboard/billing">
                  <button className="px-4 py-2 rounded-xl bg-gold text-onyx font-bold hover:bg-gold-light transition-all text-xs uppercase tracking-wider">
                    Wallet Settings
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Block: Missions, Lounges, Concierge (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Scheduled Missions */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                    <PlaneTakeoff className="w-5 h-5 text-gold" /> Active Flight Dispatches
                  </h3>
                  <Link href="/dashboard/flights" className="text-gold text-xs font-medium hover:underline">
                    All Flights ({flights.length})
                  </Link>
                </div>

                {upcoming.length > 0 ? (
                  <div className="space-y-4">
                    {upcoming.map((flight) => (
                      <div key={flight.id} className="p-5 rounded-2xl border border-white/5 bg-white/5 flex justify-between items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-gold/10 text-gold uppercase tracking-wider font-mono">
                              {flight.type === "private" ? "Charter" : "Commercial"}
                            </span>
                            <span className="text-white/40 text-[10px] font-mono">PNR: {flight.id}</span>
                          </div>
                          <h4 className="text-white font-medium text-sm mt-1.5">{flight.departure.city} ({flight.departure.code}) to {flight.arrival.city} ({flight.arrival.code})</h4>
                          <p className="text-xs text-platinum/50 font-light mt-0.5">{flight.date} at {flight.departure.time}</p>
                        </div>
                        <Link href="/dashboard/flights">
                          <button className="px-4 py-2 rounded-xl border border-white/15 text-white hover:bg-white/5 transition-all text-xs font-medium">
                            Manage
                          </button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 border border-dashed border-white/5 rounded-2xl text-center text-platinum/40 font-light text-xs">
                    No active dispatches. Book a commercial leg or charter a private jet to start a mission.
                  </div>
                )}
              </div>

              {/* Lounge and Concierge Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gated lounge access */}
                <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between gap-6">
                  <div>
                    <h4 className="text-white font-serif font-bold text-base flex items-center gap-2">
                      <Compass className="w-5 h-5 text-gold" /> Gated Club Lounge
                    </h4>
                    <p className="text-platinum/50 text-xs mt-2 leading-relaxed">
                      Access member-only travel reports, partner perks, and private lounge updates.
                    </p>
                  </div>
                  <Link href="/member-lounge">
                    <button className="w-full py-2.5 rounded-xl bg-gold/10 text-gold border border-gold/30 hover:bg-gold hover:text-onyx transition-colors text-xs font-bold uppercase tracking-wider">
                      Enter Lounge Room
                    </button>
                  </Link>
                </div>

                {/* AI Concierge quick chat */}
                <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between gap-6">
                  <div>
                    <h4 className="text-white font-serif font-bold text-base flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-gold" /> AI Concierge Desk
                    </h4>
                    <p className="text-platinum/50 text-xs mt-2 leading-relaxed">
                      Consult the Cortex travel assistant regarding routing options, transfers, and dining.
                    </p>
                  </div>
                  <Link href="/concierge">
                    <button className="w-full py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-white font-medium text-xs uppercase tracking-wider">
                      Open Chat Channel
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Centered Sign Out Action */}
          <div className="flex justify-center mt-12 pt-8 border-t border-white/10 w-full">
            <button
              onClick={logout}
              className="px-8 py-3.5 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all duration-300 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out from Sovereign Platform
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <main ref={containerRef} className="relative bg-[#020202] overflow-x-hidden selection:bg-gold/30">
      <style>{`
        @keyframes drawRoute { 0% { stroke-dashoffset: var(--pl, 1000); } 50% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: calc(-1 * var(--pl, 1000)); } }
        @keyframes floatAircraft { 0%, 100% { transform: translateY(0px) rotate(-0.5deg); } 50% { transform: translateY(-18px) rotate(0.5deg); } }
        @keyframes runwayLight { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes cloudDrift { from { transform: translateX(110vw); } to { transform: translateX(-50vw); } }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 30px rgba(212,175,55,0.2); } 50% { box-shadow: 0 0 60px rgba(212,175,55,0.5); } }
        @keyframes dash { to { stroke-dashoffset: -100; } }
        .aircraft-float { animation: floatAircraft 7s ease-in-out infinite; }
        .pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }
      `}</style>
      <GlassNavbar />

      {/* ═══════════════════════════════════════════════
          HERO SECTION — FULL CINEMATIC EXPERIENCE
      ═══════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* DEEP ATMOSPHERIC BACKGROUND */}
        <motion.div className="absolute inset-0 z-0" style={{ scale: heroScale }}>
          {/* Multi-layer gradient sky */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#01010a] via-[#030a1a] to-[#020202]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(10,20,60,0.8),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_70%,rgba(212,175,55,0.04),transparent)]" />

          {/* Stars field */}
          {Array.from({ length: 80 }).map((_, i) => {
            const size = (seededRand(i * 5 + 2) * 2 + 0.5).toFixed(4);
            const opacity = (seededRand(i * 5 + 3) * 0.6 + 0.1).toFixed(4);
            return (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${(seededRand(i * 5) * 100).toFixed(4)}%`,
                  top: `${(seededRand(i * 5 + 1) * 60).toFixed(4)}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity: Number(opacity),
                }}
              />
            );
          })}

          {/* Animated Clouds */}
          <Cloud top={8} duration={55} opacity={0.6} scale={1.4} />
          <Cloud top={15} duration={75} opacity={0.4} scale={1.8} />
          <Cloud top={5} duration={45} opacity={0.3} scale={1} />

          {/* Horizon glow line */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020202] to-transparent" />
        </motion.div>

        {/* RUNWAY ENVIRONMENT */}
        <div className="absolute inset-x-0 bottom-0 z-[1] h-[45vh] pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, transparent 0%, rgba(5,8,15,0.8) 40%, rgba(3,5,10,0.95) 100%)",
            }}
          />
          {/* Runway surface */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 400" preserveAspectRatio="none">
            <defs>
              <linearGradient id="runwayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(10,15,25,0)" />
                <stop offset="60%" stopColor="rgba(5,8,15,0.95)" />
                <stop offset="100%" stopColor="rgba(2,2,2,1)" />
              </linearGradient>
              <linearGradient id="centerLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(212,175,55,0)" />
                <stop offset="30%" stopColor="rgba(212,175,55,0.6)" />
                <stop offset="70%" stopColor="rgba(212,175,55,0.6)" />
                <stop offset="100%" stopColor="rgba(212,175,55,0)" />
              </linearGradient>
            </defs>
            {/* Perspective runway */}
            <path d="M 680 0 L 760 0 L 1440 400 L 0 400 Z" fill="rgba(8,12,20,0.6)" />
            <rect x="0" y="0" width="1440" height="400" fill="url(#runwayGrad)" />
            {/* Center line dashes */}
            {[0, 60, 120, 180, 240, 300].map((offset, i) => (
              <rect
                key={i}
                x="714"
                y={offset}
                width="12"
                height="40"
                fill="url(#centerLineGrad)"
                opacity="0.5"
                style={{ animation: `runwayLight ${1 + i * 0.15}s ease-in-out ${i * 0.1}s infinite` }}
              />
            ))}
            {/* Runway edge lights */}
            {Array.from({ length: 12 }).map((_, i) => {
              const progress = i / 11;
              const lx = 680 - (680 - 50) * progress;
              const rx = 760 + (1390 - 760) * progress;
              const y = progress * 380 + 20;
              return (
                <g key={i}>
                  <circle cx={lx} cy={y} r={3 + progress * 4} fill="rgba(212,175,55,0.7)"
                    style={{ animation: `runwayLight ${1.5}s ease-in-out ${i * 0.12}s infinite` }} />
                  <circle cx={rx} cy={y} r={3 + progress * 4} fill="rgba(212,175,55,0.7)"
                    style={{ animation: `runwayLight ${1.5}s ease-in-out ${i * 0.12}s infinite` }} />
                </g>
              );
            })}
          </svg>
        </div>

        {/* ANIMATED ROUTE LINES */}
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
          <AnimatedRouteLine x1={200} y1={280} x2={700} y2={180} delay={0} />
          <AnimatedRouteLine x1={700} y1={180} x2={1200} y2={250} delay={1.5} />
          <AnimatedRouteLine x1={300} y1={320} x2={900} y2={200} delay={0.8} />
        </div>

        {/* FLOATING PARTICLES */}
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
          {particles.map((p, i) => <Particle key={i} {...p} />)}
        </div>

        {/* MAIN HERO CONTENT */}
        <motion.div style={{ y: textParallax, opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-7xl mx-auto w-full flex flex-col items-center">

          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gold/10 border border-gold/30 backdrop-blur-md mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-gold text-xs uppercase tracking-[0.25em] font-mono font-medium">AI-Powered Aviation Operating System</span>
            <Sparkles className="w-3.5 h-3.5 text-gold" />
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-bold text-white leading-[0.95] tracking-tight mb-6"
          >
            The Future of<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold via-[#FFF8DC] to-gold drop-shadow-[0_0_40px_rgba(212,175,55,0.5)]">
              Luxury Aviation.
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-lg md:text-xl text-platinum/70 max-w-2xl mx-auto font-light leading-relaxed mb-10"
          >
            Commercial cabins. Private charters. AI concierge. Elite memberships.
            One sovereign platform for the world's most discerning travelers.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-16"
          >
            <Link href="/commercial">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-gold to-gold-light text-onyx font-bold text-base overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.7)] transition-shadow"
              >
                <span className="flex items-center gap-3">
                  Book a Flight <PlaneTakeoff className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
              </motion.button>
            </Link>
            <Link href="/fleet">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group px-8 py-4 rounded-full glass-panel border border-gold/30 text-gold font-medium text-base hover:bg-gold/10 transition-all"
              >
                <span className="flex items-center gap-3">
                  Private Jet Fleet <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </Link>
            <Link href="/concierge">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group px-8 py-4 rounded-full glass-panel border border-white/10 text-platinum/80 font-medium text-base hover:border-white/30 hover:text-white transition-all"
              >
                <span className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-gold" /> AI Concierge
                </span>
              </motion.button>
            </Link>
          </motion.div>

          {/* CINEMATIC AIRCRAFT — Centerpiece */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ x: aircraftX, y: aircraftY, rotate: aircraftRotate }}
            className="aircraft-float relative w-full max-w-4xl mx-auto"
          >
            {/* Gold glow halo */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-32 bg-gold/15 rounded-full blur-[60px]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-20 bg-blue-400/10 rounded-full blur-[40px]" />
            </div>
            {/* Shadow on runway */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-6 bg-black/60 rounded-full blur-xl" />
            <img
              src="/hero-aircraft.png"
              alt="SkyLuxe Private Jet"
              className="w-full h-auto object-contain drop-shadow-[0_20px_60px_rgba(212,175,55,0.3)]"
              draggable={false}
            />
          </motion.div>
        </motion.div>

        {/* Quick Navigation Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6"
        >
          {[
            { label: "Commercial", href: "/commercial", icon: Plane },
            { label: "Private Jets", href: "/fleet", icon: Wind },
            { label: "AI Concierge", href: "/concierge", icon: Sparkles },
            { label: "Membership", href: "/membership", icon: Crown },
          ].map(({ label, href, icon: Icon }) => (
            <Link key={label} href={href}>
              <motion.div
                whileHover={{ y: -4, scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/10 hover:border-gold/40 transition-all cursor-pointer"
              >
                <Icon className="w-3.5 h-3.5 text-gold" />
                <span className="text-xs text-platinum/70 hover:text-white transition-colors">{label}</span>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════
          LIVE AVIATION STATISTICS
      ═══════════════════════════════════════════════ */}
      <section ref={statsRef} className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Plane, label: "Flights Booked", value: stats.flights.toLocaleString() + "+" },
            { icon: Compass, label: "Private Routes", value: stats.routes.toLocaleString() + "+" },
            { icon: Users, label: "Global Members", value: stats.members.toLocaleString() + "+" },
            { icon: Globe, label: "Countries Served", value: stats.countries + "+" },
          ].map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="group p-8 glass-panel rounded-3xl border border-white/5 hover:border-gold/20 transition-all duration-500 text-center relative overflow-hidden cursor-default"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4 group-hover:border-gold/50 transition-colors">
                <Icon className="w-6 h-6 text-gold" />
              </div>
              <p className="text-4xl font-serif font-bold text-white mb-2">{value}</p>
              <p className="text-platinum/50 uppercase tracking-widest text-[10px] font-mono">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          COMMERCIAL FLIGHT BOOKING
      ═══════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.06),transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="text-gold text-xs font-mono uppercase tracking-[0.25em] mb-3 block">Commercial Operations</span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-5">Book Commercial Network</h2>
              <p className="text-lg text-platinum/60 font-light max-w-2xl mx-auto">
                Premium cabin access across our sovereign carrier network — with priority terminals, seat locking, and concierge add-ons.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-7 md:p-9 rounded-3xl border border-white/10 shadow-2xl bg-gradient-to-br from-onyx/80 to-black/60 max-w-5xl mx-auto mb-12 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            <form onSubmit={handleCommercialSearch} className="space-y-6">
              <div className="flex gap-6 border-b border-white/5 pb-4">
                {["one-way", "round-trip", "multi-city"].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="tripType" checked={tripType === type} onChange={() => setTripType(type)} className="accent-gold h-4 w-4" />
                    <span className={`text-xs font-mono uppercase tracking-wider transition-colors ${tripType === type ? "text-gold" : "text-platinum/40 hover:text-white"}`}>
                      {type.replace("-", " ")}
                    </span>
                  </label>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                <div className="md:col-span-3">
                  <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-2 flex items-center gap-1.5 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-gold" /> Origin FBO
                  </label>
                  <select value={fromCity} onChange={(e) => setFromCity(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-gold/50 focus:outline-none transition-all text-sm appearance-none cursor-pointer hover:border-white/20">
                    <option value="Mumbai (BOM)">Mumbai (BOM)</option>
                    <option value="Delhi (DEL)">Delhi (DEL)</option>
                    <option value="Bengaluru (BLR)">Bengaluru (BLR)</option>
                    <option value="London (LHR)">London (LHR)</option>
                    <option value="Dubai (DXB)">Dubai (DXB)</option>
                  </select>
                </div>
                <div className="hidden md:flex md:col-span-1 items-center justify-center pb-4">
                  <div className="w-8 h-8 rounded-full border border-gold/30 bg-gold/10 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-gold" />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-2 flex items-center gap-1.5 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-gold" /> Destination FBO
                  </label>
                  <select value={toCity} onChange={(e) => setToCity(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-gold/50 focus:outline-none transition-all text-sm appearance-none cursor-pointer hover:border-white/20">
                    <option value="Dubai (DXB)">Dubai (DXB)</option>
                    <option value="London (LHR)">London (LHR)</option>
                    <option value="Mumbai (BOM)">Mumbai (BOM)</option>
                    <option value="Delhi (DEL)">Delhi (DEL)</option>
                    <option value="Bengaluru (BLR)">Bengaluru (BLR)</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-2 flex items-center gap-1.5 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-gold" /> Departure
                  </label>
                  <LuxuryDatePicker 
                    value={departDate} 
                    onChange={(d) => setDepartDate(d)} 
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-2 flex items-center gap-1.5 font-mono">
                    <Users className="w-3.5 h-3.5 text-gold" /> Seats
                  </label>
                  <select value={passengers} onChange={(e) => setPassengers(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-gold/50 focus:outline-none transition-all text-sm appearance-none cursor-pointer font-mono hover:border-white/20">
                    {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-2 flex items-center gap-1.5 font-mono">
                    <Star className="w-3.5 h-3.5 text-gold" /> Cabin Tier
                  </label>
                  <select value={cabinClass} onChange={(e) => setCabinClass(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-gold/50 focus:outline-none transition-all text-sm appearance-none cursor-pointer hover:border-white/20">
                    <option>Economy</option>
                    <option>Premium Economy</option>
                    <option>Business Class</option>
                    <option>First Class Suite</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-10 h-14 rounded-xl bg-gradient-to-r from-gold to-gold-light text-onyx font-bold shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] transition-shadow flex items-center gap-2"
                >
                  Search Flight Manifests <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Partner Carriers */}
          <div className="text-center">
            <p className="text-xs text-platinum/30 uppercase tracking-widest font-mono mb-6">Integrated Sovereign Carriers</p>
            <div className="flex flex-wrap justify-center gap-10 items-center opacity-50">
              {["Air India", "Emirates", "Vistara", "IndiGo", "Akasa Air"].map((name) => (
                <span key={name} className="text-white font-serif text-xl font-bold tracking-wider hover:opacity-100 hover:text-gold transition-all cursor-default">{name}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          PRIVATE JET FLEET SHOWCASE — 6 AIRCRAFT
      ═══════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(212,175,55,0.02)] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-14">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-gold text-xs font-mono uppercase tracking-[0.25em] mb-3 block">The Fleet</span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">Command the Sky.</h2>
              <p className="text-xl text-platinum/60 font-light max-w-xl">Ultra-long-range executive aircraft, integrated with ground logistics and concierge services.</p>
            </motion.div>
            <Link href="/fleet" className="text-gold hover:text-gold-light transition-colors flex items-center gap-2 font-medium group mt-6 md:mt-0 shrink-0">
              Full Fleet Marketplace <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FLEET.map((jet, i) => (
              <Link key={jet.id} href={`/fleet/${jet.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  whileHover={{ y: -10 }}
                  onHoverStart={() => setHoveredJet(i)}
                  onHoverEnd={() => setHoveredJet(null)}
                  className="group glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-gold/40 transition-all duration-500 cursor-pointer relative"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={jet.img}
                      alt={jet.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-75 group-hover:opacity-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent" />
                    {hoveredJet === i && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-t from-gold/20 to-transparent"
                      />
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur border border-gold/30 text-gold text-[10px] font-mono uppercase tracking-widest">
                        {jet.type}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-2xl font-serif font-bold text-white group-hover:text-gold transition-colors">{jet.name}</h3>
                    </div>
                  </div>
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex gap-4">
                      <div>
                        <p className="text-[10px] text-platinum/40 font-mono uppercase">Range</p>
                        <p className="text-sm text-white font-medium">{jet.range}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-platinum/40 font-mono uppercase">Speed</p>
                        <p className="text-sm text-white font-medium">{jet.speed}</p>
                      </div>
                    </div>
                    <span className="text-gold text-xs font-bold flex items-center gap-1 group-hover:text-white transition-colors">
                      Configure <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          AI CONCIERGE SHOWCASE
      ═══════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-gradient-to-b from-transparent via-[#030510]/60 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(15,20,60,0.5),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Futuristic AI Interface Preview */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="glass-panel rounded-3xl border border-gold/20 bg-gradient-to-br from-onyx/80 to-black/60 overflow-hidden relative shadow-[0_0_60px_rgba(212,175,55,0.08)]">
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center pulse-glow">
                    <Sparkles className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">SkyLuxe Cortex</p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-[10px] text-green-400 font-mono">Intelligence Online</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-platinum/40 bg-white/5 px-3 py-1 rounded-full">CORTEX v4.2</span>
              </div>

              {/* AI Messages */}
              <div className="p-6 space-y-4">
                <div className="flex gap-3 max-w-[90%]">
                  <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-gold" />
                  </div>
                  <div className="glass-panel p-4 rounded-2xl rounded-tl-sm border border-white/10 bg-onyx/60">
                    <p className="text-white text-sm font-light leading-relaxed">Good evening. I&apos;ve identified an optimal departure window — <span className="text-gold">Thursday 09:00 BOM→DWC</span> on the Gulfstream G650ER. Weather corridor clear, 0% delay probability.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gold/5 border border-gold/20 mx-2">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gold text-[10px] font-mono uppercase tracking-widest">Proposed Itinerary</span>
                    <span className="text-platinum/40 text-[10px] font-mono">SXL-892</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center"><p className="text-xl font-serif text-white">BOM</p><p className="text-[10px] text-platinum/50">09:00</p></div>
                    <div className="flex-1 flex flex-col items-center">
                      <PlaneTakeoff className="w-4 h-4 text-gold mb-1" />
                      <div className="w-full border-t border-dashed border-gold/40 relative">
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#111] px-2 text-[9px] text-platinum/60">3h 30m</span>
                      </div>
                    </div>
                    <div className="text-center"><p className="text-xl font-serif text-white">DWC</p><p className="text-[10px] text-platinum/50">12:30</p></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mx-2">
                  {[
                    { label: "Chauffeur", val: "Maybach S-Class" },
                    { label: "Catering", val: "Michelin Grade" },
                    { label: "Hotel", val: "Atlantis Royal" },
                  ].map(({ label, val }) => (
                    <div key={label} className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                      <p className="text-[9px] text-platinum/40 font-mono uppercase mb-1">{label}</p>
                      <p className="text-xs text-white font-medium">{val}</p>
                    </div>
                  ))}
                </div>

                {/* Typing indicator */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-gold animate-spin" style={{ animationDuration: "3s" }} />
                  </div>
                  <div className="glass-panel p-4 rounded-2xl rounded-tl-sm border border-white/10 bg-onyx/60 flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce delay-75" />
                      <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce delay-150" />
                    </div>
                    <span className="text-[10px] text-gold font-mono uppercase tracking-widest">Synthesizing luxury upgrades...</span>
                  </div>
                </div>
              </div>

              {/* Input bar */}
              <div className="px-6 py-4 border-t border-white/10 bg-black/30 flex items-center gap-3">
                <div className="flex-1 bg-white/5 rounded-xl px-4 py-2.5 text-platinum/40 text-sm font-light border border-white/5">
                  Initiate a command...
                </div>
                <button className="w-9 h-9 rounded-xl bg-gold flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                  <ArrowRight className="w-4 h-4 text-onyx" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right: Description */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="text-gold text-xs font-mono uppercase tracking-[0.25em] mb-4 block">Artificial Intelligence</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">Cognitive Flight<br />Logistics.</h2>
            <p className="text-lg text-platinum/70 font-light leading-relaxed mb-8">
              SkyLuxe Cortex is your personal aviation intelligence system — not a chatbot. It proactively predicts, plans, and perfects every aspect of your journey.
            </p>
            <div className="space-y-4 mb-10">
              {[
                { title: "Predictive Rerouting", desc: "Saves avg. 18 mins by anticipating congestion corridors across 80+ countries." },
                { title: "Identity Clearances", desc: "Pre-clears flight plans directly with airport security and FBO terminals." },
                { title: "Lifestyle Coordination", desc: "Manages chauffeurs, catering, hotels, and yacht transfers in one command." },
                { title: "Proactive Recommendations", desc: "Notifies you of reward opportunities, upgrade windows, and price drops." },
              ].map(({ title, desc }) => (
                <div key={title} className="flex gap-4 items-start group">
                  <div className="w-6 h-6 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-gold/60 transition-colors">
                    <Zap className="w-3 h-3 text-gold" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">{title}</h4>
                    <p className="text-platinum/50 text-xs mt-1 font-light">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/concierge">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                className="group px-8 py-4 rounded-full bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/40 text-gold font-medium hover:bg-gold/20 transition-all flex items-center gap-3"
              >
                <Sparkles className="w-4 h-4" />
                Launch AI Concierge <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          MEMBERSHIP TIERS
      ═══════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.04),transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="text-gold text-xs font-mono uppercase tracking-[0.25em] mb-3 block">The Inner Circle</span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-5">Elite Membership Programs</h2>
              <p className="text-lg text-platinum/60 font-light max-w-2xl mx-auto">
                Unlock guaranteed aircraft availability, fixed hourly rates, and exclusive global lifestyle privileges.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Silver */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              whileHover={{ y: -8 }}
              className="group p-8 rounded-3xl border border-white/10 glass-panel flex flex-col justify-between relative overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div>
                <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-6">
                  <Star className="w-6 h-6 text-platinum" />
                </div>
                <p className="text-xs font-mono text-platinum/40 uppercase tracking-widest mb-2">Tier 1</p>
                <h3 className="text-3xl font-serif font-bold text-white mb-1">Silver</h3>
                <p className="text-3xl font-bold text-white font-serif mb-6">$15,000<span className="text-sm text-platinum/40 font-light">/yr</span></p>
                <ul className="space-y-3 mb-8">
                  {["24-Hour Jet Guarantee", "Light Jets Access", "Priority FBO Lounge", "500 SkyCoins/month", "Dedicated Support Line"].map(b => (
                    <li key={b} className="flex items-center gap-3 text-sm text-platinum/80 font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-platinum/60" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/membership" className="w-full">
                <button className="w-full py-3.5 rounded-xl bg-white/5 border border-white/15 text-white font-bold hover:bg-white/10 transition-all text-sm">
                  Explore Silver Tier
                </button>
              </Link>
            </motion.div>

            {/* Executive — Popular */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group p-8 rounded-3xl border border-gold/40 glass-panel-gold flex flex-col justify-between relative overflow-hidden cursor-pointer shadow-[0_0_40px_rgba(212,175,55,0.15)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent" />
              <div className="absolute top-4 right-4 bg-gold text-onyx text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest font-mono">Most Popular</div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                  <Crown className="w-6 h-6 text-gold" />
                </div>
                <p className="text-xs font-mono text-gold/70 uppercase tracking-widest mb-2">Tier 2</p>
                <h3 className="text-3xl font-serif font-bold text-white mb-1">Executive</h3>
                <p className="text-3xl font-bold text-gold font-serif mb-6">$45,000<span className="text-sm text-gold/50 font-light">/yr</span></p>
                <ul className="space-y-3 mb-8">
                  {["12-Hour Jet Guarantee", "Heavy Jets + Midsize", "AI Operator Access", "Priority Customs Clearance", "2,000 SkyCoins/month", "Helicopter Transfers"].map(b => (
                    <li key={b} className="flex items-center gap-3 text-sm text-platinum/90 font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/membership" className="w-full relative z-10">
                <button className="w-full py-3.5 rounded-xl bg-gold text-onyx font-bold hover:bg-gold-light transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] text-sm">
                  Join Executive Program
                </button>
              </Link>
            </motion.div>

            {/* Black Elite */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -8 }}
              className="group p-8 rounded-3xl border border-white/10 glass-panel flex flex-col justify-between relative overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a]/80 to-transparent" />
              <div>
                <div className="w-12 h-12 rounded-full bg-black border border-white/20 flex items-center justify-center mb-6 relative">
                  <Crown className="w-6 h-6 text-white" />
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent)] " />
                </div>
                <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-2 relative z-10">Tier 3 • By Invitation</p>
                <h3 className="text-3xl font-serif font-bold text-white mb-1 relative z-10">Black Elite</h3>
                <p className="text-3xl font-bold text-white font-serif mb-6 relative z-10">Private<span className="text-sm text-white/40 font-light"> rate</span></p>
                <ul className="space-y-3 mb-8 relative z-10">
                  {["6-Hour Jet Guarantee", "Ultra-Long Range Fleet", "Boeing / Airbus VIP", "Dedicated Flight Crew", "5,000 SkyCoins/month", "Global Private Security"].map(b => (
                    <li key={b} className="flex items-center gap-3 text-sm text-platinum/80 font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/60" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/membership/black-elite" className="w-full relative z-10">
                <button className="w-full py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all text-sm">
                  Request Invitation
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          LUXURY DESTINATIONS — 6 CARDS
      ═══════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="text-gold text-xs font-mono uppercase tracking-[0.25em] mb-3 block">Curated Voyages</span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-5">Luxury Destinations</h2>
              <p className="text-lg text-platinum/60 font-light max-w-2xl mx-auto">Pre-cleared entry lanes, five-star helipad transfers, and exclusive yacht charters at the world's most elite terminals.</p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DESTINATIONS.map((dest, i) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className="group glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-gold/30 transition-all duration-500 cursor-pointer"
              >
                <div className="h-52 relative overflow-hidden">
                  <img src={dest.img} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/20 to-transparent" />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] text-white font-mono">{dest.weather}</div>
                  <div className="absolute bottom-4 left-4">
                    <span className="text-xs font-mono text-gold uppercase tracking-widest">{dest.code}</span>
                    <h3 className="text-2xl font-serif font-bold text-white">{dest.name}</h3>
                    <p className="text-xs text-platinum/50">{dest.country}</p>
                  </div>
                </div>
                <div className="p-5">
                  <Link href="/destinations">
                    <button className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-gold hover:text-onyx hover:border-gold font-bold transition-all duration-300 text-sm flex items-center justify-center gap-2 text-white">
                      Explore Destination <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          REWARDS & LOYALTY
      ═══════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/3 via-transparent to-gold/3 pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-gold text-xs font-mono uppercase tracking-[0.25em] mb-4 block">Loyalty Ecosystem</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">SkyCoins &amp; Premium Upgrades.</h2>
            <p className="text-lg text-platinum/70 font-light leading-relaxed mb-8">
              Earn coins for every flight. Redeem for Apple hardware, luxury hotel nights, first-class cabin upgrades, and exclusive experiences.
            </p>
            <div className="flex gap-4">
              <Link href="/rewards">
                <motion.button whileHover={{ scale: 1.03, y: -2 }} className="px-8 py-4 rounded-xl border border-gold/30 text-gold hover:bg-gold/10 transition-colors font-bold text-sm flex items-center gap-2">
                  Explore Reward Tiers <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden bg-gradient-to-br from-gold/5 to-transparent"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/4" />
            <h3 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2 relative z-10">
              <Trophy className="w-5 h-5 text-gold" /> Loyalty Rewards Engine
            </h3>
            <div className="space-y-3 relative z-10">
              {[
                { name: "Zara Premium Voucher", points: "500 Coins", locked: false },
                { name: "Apple AirPods Pro", points: "1,000 Coins", locked: false },
                { name: "Burj Al Arab Suite Night", points: "5,000 Coins", locked: true },
                { name: "VIP Helicopter Transfer", points: "3,000 Coins", locked: true },
              ].map(({ name, points, locked }) => (
                <div key={name} className={`flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 transition-opacity ${locked ? "opacity-50" : ""}`}>
                  <div>
                    <p className="text-white text-sm font-medium">{name}</p>
                    <p className="text-platinum/50 text-xs font-mono">{points}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-mono border ${locked ? "text-platinum/50 border-white/10" : "text-green-400 bg-green-500/10 border-green-500/20"}`}>
                    {locked ? "Locked" : "Unlocked"}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#010108] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.04),transparent_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-gold text-xs font-mono uppercase tracking-[0.25em] mb-3 block">Client Journals</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-14">Trusted by Sovereign Leaders</h2>
          <div className="relative min-h-[220px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.5 }}
                className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                <div className="text-5xl text-gold/20 font-serif mb-4">"</div>
                <p className="text-white text-lg md:text-xl font-light italic leading-relaxed mb-8">{TESTIMONIALS[activeTestimonial].quote}</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-bold text-sm shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                    {TESTIMONIALS[activeTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium text-sm">{TESTIMONIALS[activeTestimonial].author}</p>
                    <p className="text-platinum/50 text-xs">{TESTIMONIALS[activeTestimonial].title}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex justify-center gap-3 mt-8">
            <button onClick={() => setActiveTestimonial(p => (p === 0 ? TESTIMONIALS.length - 1 : p - 1))}
              className="p-3 rounded-full border border-white/10 text-white hover:bg-white/5 hover:border-gold/40 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeTestimonial ? "bg-gold w-6" : "bg-white/20 hover:bg-white/40"}`} />
              ))}
            </div>
            <button onClick={() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length)}
              className="p-3 rounded-full border border-white/10 text-white hover:bg-white/5 hover:border-gold/40 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          GLOBAL PRESENCE
      ═══════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.04),transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-gold text-xs font-mono uppercase tracking-[0.25em] mb-4 block">World Operations</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Global FBO Infrastructure</h2>
            <p className="text-lg text-platinum/70 font-light leading-relaxed mb-8">SkyLuxe controls flight operations across 80+ countries with dedicated dispatch staff, ramp agents, and private FBO lounges in key capitals.</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: "80+", label: "Sovereign Nations" },
                { val: "320+", label: "Private Lounge Hubs" },
                { val: "15 min", label: "Fast-Track Vetting" },
                { val: "24/7/365", label: "Control Dispatch" },
              ].map(({ val, label }) => (
                <motion.div key={label} whileHover={{ scale: 1.03 }} className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-gold/20 transition-all cursor-default">
                  <h4 className="text-white font-bold text-2xl font-serif mb-1">{val}</h4>
                  <p className="text-platinum/50 text-xs uppercase tracking-widest font-mono">{label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden bg-onyx/80 aspect-[4/3] flex items-center justify-center"
          >
            <style>{`@keyframes dash { to { stroke-dashoffset: -100; } }`}</style>
            <svg viewBox="0 0 800 500" className="w-full h-full opacity-90">
              {[
                { cx: 200, cy: 180, label: "London (FAB)", dur: 3 },
                { cx: 380, cy: 220, label: "Dubai (DWC)", dur: 2.5 },
                { cx: 430, cy: 260, label: "Mumbai (BOM)", dur: 3.5 },
                { cx: 620, cy: 200, label: "Tokyo (HND)", dur: 4 },
                { cx: 100, cy: 250, label: "New York (TEB)", dur: 3.2 },
              ].map(({ cx, cy, label, dur }) => (
                <g key={label}>
                  <circle cx={cx} cy={cy} r="8" fill="rgba(212,175,55,0.15)" className="animate-ping" style={{ animationDuration: `${dur}s` }} />
                  <circle cx={cx} cy={cy} r="4" fill="#D4AF37" />
                  <text x={cx} y={cy - 14} fill="rgba(255,255,255,0.7)" fontSize="10" fontFamily="monospace" textAnchor="middle">{label}</text>
                </g>
              ))}
              <path d="M 200 180 Q 290 150 380 220" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="5,5" style={{ animation: "dash 12s linear infinite" }} opacity="0.6" />
              <path d="M 380 220 Q 405 240 430 260" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="5,5" style={{ animation: "dash 8s linear infinite" }} opacity="0.6" />
              <path d="M 430 260 Q 525 210 620 200" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="5,5" style={{ animation: "dash 15s linear infinite" }} opacity="0.6" />
              <path d="M 100 250 Q 290 130 620 200" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" style={{ animation: "dash 20s linear infinite" }} />
              <path d="M 100 250 Q 150 215 200 180" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="5,5" style={{ animation: "dash 10s linear infinite" }} opacity="0.6" />
            </svg>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)] rounded-3xl pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CONTACT CTA
      ═══════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <span className="text-gold text-xs font-mono uppercase tracking-[0.25em] mb-4 block">Inquiries</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Begin Your Flight Profile.</h2>
            <p className="text-lg text-platinum/70 font-light leading-relaxed mb-8">Submit your information. Our aviation advisors will vet your profile and coordinate credentials within 24 hours.</p>
            <div className="space-y-4 text-platinum/80 text-sm font-light">
              <p className="flex items-center gap-3"><Phone className="w-4 h-4 text-gold" /> +1 (800) 555-0199</p>
              <p className="flex items-center gap-3"><Mail className="w-4 h-4 text-gold" /> support@skyluxe.com</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 glass-panel p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
            <h3 className="text-2xl font-serif font-bold text-white mb-2">Request Consultation</h3>
            <p className="text-platinum/50 font-light text-sm mb-8">Establish your security clearance parameters.</p>
            <AnimatePresence mode="wait">
              {!contactForm.sent ? (
                <motion.form key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-2 block font-mono">Full Name</label>
                      <input type="text" required value={contactForm.name} onChange={(e) => setContactForm(p => ({ ...p, name: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none transition-all hover:border-white/20"
                        placeholder="Eashan Sterling" />
                    </div>
                    <div>
                      <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-2 block font-mono">Corporate Email</label>
                      <input type="email" required value={contactForm.email} onChange={(e) => setContactForm(p => ({ ...p, email: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none transition-all hover:border-white/20"
                        placeholder="eashan@sterling.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-2 block font-mono">Detailed Request</label>
                    <textarea rows={4} required value={contactForm.msg} onChange={(e) => setContactForm(p => ({ ...p, msg: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none transition-all resize-none hover:border-white/20"
                      placeholder="Specify routing legs, catering constraints, or elite membership interests..." />
                  </div>
                  <motion.button whileHover={{ scale: 1.01, y: -1 }} type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-gold to-gold-light text-onyx font-bold text-lg shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transition-shadow">
                    Transmit Secure Connection
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="w-8 h-8 text-green-400" />
                  </div>
                  <h4 className="text-2xl font-serif text-white mb-2">Transmission Secure</h4>
                  <p className="text-platinum/60 text-sm font-light max-w-sm mx-auto">Your profile request is under review. An FBO advisor will call within 24 hours.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          PREMIUM FOOTER
      ═══════════════════════════════════════════════ */}
      <footer className="relative bg-[#010105] border-t border-white/10 pt-24 pb-12 px-6">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="font-serif text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                SKY<span className="text-gold">LUXE</span>
              </span>
            </Link>
            <p className="text-sm font-light text-platinum/50 leading-relaxed max-w-sm mb-8">The sovereign aviation operating system. Synchronizing ultra-long-range private charters, commercial premium cabins, and bespoke lifestyle logistics.</p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-platinum/60 hover:text-gold hover:border-gold/50 transition-all">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>
          {[
            { heading: "Ecosystems", links: [{ label: "Commercial Booking", href: "/commercial" }, { label: "Private Fleet", href: "/fleet" }, { label: "AI Concierge", href: "/concierge" }, { label: "Elite Memberships", href: "/membership" }] },
            { heading: "Exploration", links: [{ label: "Luxury Destinations", href: "/destinations" }, { label: "Experiences", href: "/experiences" }, { label: "SkyCoins Loyalty", href: "/rewards" }, { label: "Flight Tracker", href: "/track-flight" }] },
            { heading: "Operations", links: [{ label: "Request Advisor", href: "/contact" }, { label: "Client Portal", href: "/dashboard" }, { label: "FBO: Gate V3", href: "#" }, { label: "+1 (800) 555-0199", href: "#" }] },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <h4 className="text-white font-medium text-xs tracking-[0.2em] uppercase mb-6 font-mono">{heading}</h4>
              <ul className="space-y-4">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-sm font-light text-platinum/50 hover:text-gold transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-platinum/30">
          <p>© {new Date().getFullYear()} SKYLUXE AVIATION INC. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            {["SECURITY PARAMETERS", "TERMS OF CARRIAGE", "PRIVACY SHIELD"].map(label => (
              <a key={label} href="#" className="hover:text-gold transition-colors">{label}</a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020202] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
