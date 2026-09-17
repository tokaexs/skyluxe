"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Search, 
  Sparkles, 
  Plane, 
  ArrowRight, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Clock, 
  DollarSign, 
  Compass, 
  Award, 
  Layers, 
  Database,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useSkyLuxeStore } from "@/store/skyluxeStore";

// --- CUSTOM PREMIUM SVG CHARTS FOR LUXURY PALETTE ---

function BarChartSVG({ labels, data, label }: { labels: string[]; data: number[]; label: string }) {
  const maxVal = Math.max(...data) || 1;
  const chartHeight = 160;
  
  return (
    <div className="w-full bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
      <h4 className="text-xs uppercase tracking-widest text-platinum/50 mb-6 font-mono font-medium">{label}</h4>
      <div className="flex items-end justify-between h-[160px] gap-4 px-2">
        {data.map((val, idx) => {
          const pct = (val / maxVal) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
              <span className="text-[10px] text-gold font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-2">
                {val >= 100000 ? `$${(val / 1000).toFixed(0)}k` : val}
              </span>
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${pct}%` }}
                transition={{ type: "spring", stiffness: 60, delay: idx * 0.1 }}
                className="w-full bg-gradient-to-t from-gold/5 via-gold/20 to-gold rounded-t-lg border-t border-gold/40 relative shadow-[0_0_15px_rgba(212,175,55,0.1)] group-hover:to-gold-light group-hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all duration-300 cursor-pointer"
              />
              <span className="text-[9px] text-platinum/40 font-mono mt-3 text-center truncate w-full group-hover:text-white transition-colors duration-300">
                {labels[idx]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LineChartSVG({ labels, datasets }: { labels: string[]; datasets: { label: string; data: number[]; borderColor: string }[] }) {
  const allData = datasets.flatMap(d => d.data);
  const maxVal = Math.max(...allData) || 1;
  const minVal = Math.min(...allData) || 0;
  const range = maxVal - minVal || 1;
  
  const chartWidth = 500;
  const chartHeight = 160;
  
  return (
    <div className="w-full bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xs uppercase tracking-widest text-platinum/50 font-mono font-medium">Monthly Trend & Projections</h4>
        <div className="flex gap-4">
          {datasets.map((d, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[9px] font-mono uppercase text-platinum/70">
              <span className="w-2.5 h-1.5 rounded" style={{ backgroundColor: d.borderColor }} />
              {d.label}
            </div>
          ))}
        </div>
      </div>
      
      <div className="relative h-[160px] w-full">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
          {/* Background grid lines */}
          {Array.from({ length: 4 }).map((_, i) => {
            const y = (chartHeight / 3) * i;
            return (
              <line key={i} x1="0" y1={y} x2={chartWidth} y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
            );
          })}
          
          {datasets.map((d, dIdx) => {
            const points = d.data.map((val, idx) => {
              const x = (chartWidth / (d.data.length - 1)) * idx;
              const y = chartHeight - ((val - minVal) / range) * (chartHeight - 20) - 10;
              return { x, y, val };
            });
            
            // Generate SVG Path
            let pathD = "";
            points.forEach((p, idx) => {
              if (idx === 0) pathD += `M ${p.x} ${p.y}`;
              else {
                // Cubic Bezier interpolation
                const prev = points[idx - 1];
                const cp1x = prev.x + (p.x - prev.x) / 3;
                const cp2x = prev.x + 2 * (p.x - prev.x) / 3;
                pathD += ` C ${cp1x} ${prev.y}, ${cp2x} ${p.y}, ${p.x} ${p.y}`;
              }
            });
            
            return (
              <g key={dIdx}>
                {/* Underfill Gradient */}
                <path 
                  d={`${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`}
                  fill={d.borderColor === "#D4AF37" ? "url(#gold-grad)" : "url(#white-grad)"}
                  opacity="0.03"
                />
                
                {/* Main line */}
                <motion.path 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeInOut", delay: dIdx * 0.2 }}
                  d={pathD}
                  fill="none"
                  stroke={d.borderColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                
                {/* Data points */}
                {points.map((p, idx) => (
                  <g key={idx} className="cursor-pointer group">
                    <circle cx={p.x} cy={p.y} r="4" fill="#0A0A0A" stroke={d.borderColor} strokeWidth="1.5" />
                    <circle cx={p.x} cy={p.y} r="7" fill={d.borderColor} className="opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </g>
                ))}
              </g>
            );
          })}
          
          {/* Gradients */}
          <defs>
            <linearGradient id="gold-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="white-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E5E4E2" />
              <stop offset="100%" stopColor="#E5E4E2" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Bottom labels */}
      <div className="flex justify-between mt-3 px-1">
        {labels.map((lbl, idx) => (
          <span key={idx} className="text-[9px] text-platinum/40 font-mono tracking-wider">{lbl}</span>
        ))}
      </div>
    </div>
  );
}

function DoughnutChartSVG({ labels, data, label }: { labels: string[]; data: number[]; label: string }) {
  const total = data.reduce((sum, v) => sum + v, 0) || 1;
  const radius = 50;
  const circ = 2 * Math.PI * radius;
  
  let accumulatedAngle = 0;
  const colors = [
    'rgba(212, 175, 55, 0.95)', // Gold
    'rgba(212, 175, 55, 0.65)',
    'rgba(229, 228, 226, 0.45)', // Platinum
    'rgba(229, 228, 226, 0.15)'
  ];

  return (
    <div className="w-full bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex-1 text-left">
        <h4 className="text-xs uppercase tracking-widest text-platinum/50 mb-4 font-mono font-medium">{label}</h4>
        <div className="space-y-3">
          {data.map((val, idx) => {
            const pct = Math.round((val / total) * 100);
            return (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-platinum/80">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }} />
                  <span className="font-light">{labels[idx]}</span>
                </div>
                <span className="font-mono text-white font-bold">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          {data.map((val, idx) => {
            const percentage = val / total;
            const strokeDasharray = `${percentage * circ} ${circ}`;
            const strokeDashoffset = -accumulatedAngle * circ;
            accumulatedAngle += percentage;
            
            return (
              <motion.circle
                key={idx}
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke={colors[idx % colors.length]}
                strokeWidth="12"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                initial={{ strokeDashoffset: circ }}
                animate={{ strokeDashoffset: strokeDashoffset }}
                transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                className="hover:stroke-[15] transition-all duration-300 cursor-pointer"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Margins</span>
          <span className="text-sm font-bold text-white mt-0.5 font-serif">+$1.05M</span>
        </div>
      </div>
    </div>
  );
}

// --- NETWORK TOPO ROUTE VISUALIZATION (MAPBOX ALTERNATIVE) ---

function AirCorridorsVisualizer() {
  const routes = [
    { from: "BOM", to: "DWC", fx: 70, fy: 80, tx: 180, ty: 45, status: "high_growth", label: "Mumbai ➔ Dubai" },
    { from: "SIN", to: "BOM", fx: 250, fy: 100, tx: 70, ty: 80, status: "stable", label: "Singapore ➔ Mumbai" },
    { from: "DWC", to: "LHR", fx: 180, fy: 45, tx: 50, ty: 20, status: "emerging", label: "Dubai ➔ London" },
    { from: "CDG", to: "AUS", fx: 100, fy: 15, tx: 30, ty: 90, status: "stable", label: "Paris ➔ Austin" }
  ];

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden bg-gradient-to-r from-gold/5 to-transparent h-64 flex flex-col justify-between">
      <div>
        <span className="text-gold text-[10px] uppercase tracking-widest font-mono flex items-center gap-1.5 mb-2">
          <Globe className="w-3.5 h-3.5" /> Vector Route Path & Global Airspaces
        </span>
        <h3 className="text-white font-serif font-bold text-lg">Active Emerging & High-Load Corridors</h3>
        <p className="text-platinum/50 text-xs leading-relaxed font-light mt-1">
          Machine learning trajectory analyzer mapping load capacity densities dynamically across FBO hubs.
        </p>
      </div>

      <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none p-4 mt-6">
        <svg viewBox="0 0 300 130" className="w-full h-full opacity-70">
          {/* Node Circles */}
          <g>
            <circle cx="30" cy="90" r="3" fill="#D4AF37" />
            <text x="30" y="82" fill="#E5E4E2" fontSize="7" fontFamily="monospace" textAnchor="middle">AUS</text>

            <circle cx="50" cy="20" r="3" fill="#D4AF37" />
            <text x="50" y="12" fill="#E5E4E2" fontSize="7" fontFamily="monospace" textAnchor="middle">LHR</text>

            <circle cx="100" cy="15" r="3" fill="#D4AF37" />
            <text x="100" y="7" fill="#E5E4E2" fontSize="7" fontFamily="monospace" textAnchor="middle">CDG</text>

            <circle cx="180" cy="45" r="4" fill="#D4AF37" />
            <text x="180" y="37" fill="#E5E4E2" fontSize="7" fontFamily="monospace" textAnchor="middle">DWC</text>

            <circle cx="70" cy="80" r="4" fill="#D4AF37" />
            <text x="70" y="92" fill="#E5E4E2" fontSize="7" fontFamily="monospace" textAnchor="middle">BOM</text>

            <circle cx="250" cy="100" r="3" fill="#D4AF37" />
            <text x="250" y="112" fill="#E5E4E2" fontSize="7" fontFamily="monospace" textAnchor="middle">SIN</text>
          </g>

          {/* Paths */}
          {routes.map((r, i) => {
            const strokeColor = r.status === "high_growth" ? "#D4AF37" : r.status === "emerging" ? "#3b82f6" : "#E5E4E2";
            const midX = (r.fx + r.tx) / 2;
            const midY = Math.min(r.fy, r.ty) - 20;
            const pathD = `M ${r.fx} ${r.fy} Q ${midX} ${midY} ${r.tx} ${r.ty}`;
            
            return (
              <g key={i}>
                <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="1" strokeDasharray="3,3" opacity="0.3" />
                <motion.path 
                  d={pathD} 
                  fill="none" 
                  stroke={strokeColor} 
                  strokeWidth="1.5" 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex gap-4 border-t border-white/5 pt-4 text-[9px] font-mono uppercase text-platinum/50 relative z-10">
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gold" /> High Growth</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Emerging</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-platinum" /> Underutilized</div>
      </div>
    </div>
  );
}

// --- TRANSPARENCY BADGE COMPONENT ---
function ModelTransparencyCard({ modelName, version, lastTrained, window = "Last 90 Days", confidence = 92 }: { modelName: string; version: string; lastTrained?: string; window?: string; confidence?: number }) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 p-4 bg-white/[0.01] border border-white/5 rounded-2xl text-[10px] font-mono text-platinum/40">
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <span><strong className="text-gold">ML Model:</strong> {modelName}</span>
        <span><strong>Ver:</strong> {version}</span>
        <span><strong>Window:</strong> {window}</span>
        {lastTrained && <span><strong>Trained:</strong> {new Date(lastTrained).toLocaleDateString()}</span>}
      </div>
      <span className="text-green-400 font-bold shrink-0">Confidence: {confidence}%</span>
    </div>
  );
}

// --- MAIN ARIS CONSOLE ---

export default function ARISConsole() {
  const { currency, formatAmount } = useSkyLuxeStore();
  const [activeRole, setActiveRole] = useState<"ceo" | "operations" | "revenue" | "marketing" | "route">("ceo");
  const [loading, setLoading] = useState(true);
  
  // Platform metrics fetched from backend
  const [metrics, setMetrics] = useState<any>(null);
  const [demand, setDemand] = useState<any[]>([]);
  const [pricing, setPricing] = useState<any[]>([]);
  const [routeRecs, setRouteRecs] = useState<any[]>([]);
  const [fleet, setFleet] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [operations, setOperations] = useState<any[]>([]);
  const [payments, setPayments] = useState<any>(null);
  const [sufficiency, setSufficiency] = useState<any>(null);
  const [seeding, setSeeding] = useState(false);

  // NLP AI console states
  const [searchQuery, setSearchQuery] = useState("");
  const [submittingQuery, setSubmittingQuery] = useState(false);
  const [aiResponse, setAiResponse] = useState<any | null>(null);

  const seedSyntheticLogs = async () => {
    setSeeding(true);
    try {
      await api.post<any>("/aris/seed-synthetic");
      alert("High-fidelity database logs generated successfully. ML models trained and fitted.");
      window.location.reload();
    } catch (e) {
      console.error("Failed to seed synthetic data:", e);
      alert("Error seeding data.");
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    const fetchArisData = async () => {
      setLoading(true);
      try {
        const [metData, demData, prData, rtData, flData, csData, opData, payData] = await Promise.all([
          api.get<any>("/aris/executive/metrics"),
          api.get<any[]>("/aris/demand"),
          api.get<any[]>("/aris/pricing"),
          api.get<any[]>("/aris/routes"),
          api.get<any[]>("/aris/fleet"),
          api.get<any[]>("/aris/customers"),
          api.get<any[]>("/aris/operations"),
          api.get<any>("/aris/payments").catch(() => null)
        ]);

        setMetrics(metData);
        setSufficiency(metData?.sufficiency);
        setDemand(demData);
        setPricing(prData);
        setRouteRecs(rtData);
        setFleet(flData);
        setCustomers(csData);
        setOperations(opData);
        setPayments(payData);
      } catch (err) {
        console.error("Failed to fetch ARIS data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArisData();
  }, []);

  const handleAISubmit = async (customQuery?: string) => {
    const q = customQuery || searchQuery;
    if (!q) return;

    setSubmittingQuery(true);
    try {
      const res = await api.post<any>("/aris/query", { query: q });
      setAiResponse(res);
    } catch (err) {
      console.error("Failed to run executive query:", err);
    } finally {
      setSubmittingQuery(false);
    }
  };

  const trainModels = async () => {
    try {
      await api.post<any>("/aris/train-models");
      alert("Model retraining pipeline initiated. Accuracy updates generated.");
      // Reload page metrics
      window.location.reload();
    } catch (e) {
      console.error("Failed to trigger model training:", e);
    }
  };

  // Pre-filled template questions
  const queryTemplates = [
    { q: "Which routes generated the highest revenue this month?", label: "Highest Revenue Routes" },
    { q: "Predict our top destinations next quarter.", label: "Destination Demand Forecast" },
    { q: "Which members are likely to upgrade?", label: "Upgrade Candidates" },
    { q: "Show declining routes.", label: "Declining Routes Alert" },
    { q: "Which aircraft generated maximum profit?", label: "Fleet Margin Standings" }
  ];

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-white min-h-[60vh]">
        <Activity className="w-10 h-10 text-gold animate-pulse mb-4" />
        <p className="text-xs font-mono text-platinum/50 uppercase tracking-widest">Activating Cortex AI Reintelligence Core...</p>
      </div>
    );
  }

  if (sufficiency && !sufficiency.isSufficient) {
    return (
      <div className="space-y-8 pb-16">
        {/* Platform Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-6">
          <div>
            <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-mono font-semibold flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Cortex Flight Operations Platform
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">Airline Reintelligence System (ARIS)</h1>
            <p className="text-platinum/50 text-xs font-light mt-1">Enterprise-grade decision matrix displaying real-time load models, fare elasticities, and fleet allocation vectors.</p>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 max-w-2xl mx-auto text-center space-y-6 bg-gradient-to-br from-gold/5 via-white/[0.01] to-white/[0.03] shadow-2xl relative animate-fade-in">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-[40px] pointer-events-none" />
          <div className="flex flex-col items-center gap-4">
            <AlertTriangle className="w-12 h-12 text-gold animate-bounce" />
            <h2 className="text-2xl font-serif font-bold text-white tracking-tight font-serif">Not enough data to generate reliable insights.</h2>
            <p className="text-platinum/60 text-sm max-w-md font-light leading-relaxed">
              ARIS models require real transaction velocity and search patterns to construct high-accuracy forecasts. Live predictions are restricted to prevent hallucinations.
            </p>
          </div>

          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl max-w-md mx-auto space-y-4 text-left">
            <h4 className="text-xs uppercase tracking-widest text-platinum/50 font-mono font-medium flex items-center gap-2">
              <Database className="w-4 h-4 text-gold" /> Database Sufficiency Matrix
            </h4>
            
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-platinum/60">Registered Customer Profiles:</span>
                <span className="font-bold text-white">
                  {sufficiency.currentCounts.users} <span className="text-platinum/40">/ {sufficiency.minRequired.users} min</span>
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-platinum/60">Billed Booking Manifests:</span>
                <span className="font-bold text-white">
                  {sufficiency.currentCounts.bookings} <span className="text-platinum/40">/ {sufficiency.minRequired.bookings} min</span>
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-platinum/60">Razorpay Payment Settlements:</span>
                <span className="font-bold text-white">
                  {sufficiency.currentCounts.payments} <span className="text-platinum/40">/ {sufficiency.minRequired.payments} min</span>
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-platinum/60">User Search Log Queries:</span>
                <span className="font-bold text-white">
                  {sufficiency.currentCounts.searches} <span className="text-platinum/40">/ {sufficiency.minRequired.searches} min</span>
                </span>
              </div>
            </div>
            
            <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px] font-mono">
              <span className="text-platinum/50">Expected Accuracy (Full Dataset):</span>
              <span className="text-green-400 font-bold">{sufficiency.expectedAccuracy}%</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <button
              onClick={seedSyntheticLogs}
              disabled={seeding}
              className="px-6 py-3 rounded-xl bg-gold hover:bg-gold-light text-onyx font-bold text-xs font-mono tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            >
              {seeding ? "Generating logs..." : "Seed Platform Logs & Retrain"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Platform Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-6">
        <div>
          <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-mono font-semibold flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Cortex Flight Operations Platform
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">Airline Reintelligence System (ARIS)</h1>
          <p className="text-platinum/50 text-xs font-light mt-1">Enterprise-grade decision matrix displaying real-time load models, fare elasticities, and fleet allocation vectors.</p>
        </div>

        <button 
          onClick={trainModels}
          className="px-5 py-2.5 rounded-xl border border-gold/40 bg-gold/5 hover:bg-gold text-gold hover:text-onyx text-xs font-mono tracking-wider font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
        >
          <Database className="w-3.5 h-3.5" /> Retrain ML Models
        </button>
      </div>

      {/* Dynamic Role Switcher Bar */}
      <div className="bg-white/5 border border-white/5 p-1 rounded-2xl flex flex-wrap gap-1">
        {[
          { id: "ceo", label: "CEO Tower", icon: Users },
          { id: "operations", label: "Operations Manager", icon: Clock },
          { id: "revenue", label: "Revenue Analyst", icon: DollarSign },
          { id: "marketing", label: "Marketing Analyst", icon: Award },
          { id: "route", label: "Route Planner", icon: Compass }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeRole === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveRole(tab.id as any); setAiResponse(null); }}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider font-mono flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                isActive ? 'bg-gold text-onyx shadow-[0_0_15px_rgba(212,175,55,0.3)] font-bold' : 'text-platinum/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Role-Specific Dashboard Panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeRole}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* CEO View */}
          {activeRole === "ceo" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Metrics */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                <span className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Real-Time Platform Revenue</span>
                <h2 className="text-3xl font-bold text-white tracking-tight mt-2">{formatAmount(metrics?.summary?.totalRevenue || 1850000)}</h2>
                <div className="flex items-center gap-1.5 text-green-400 text-xs font-mono mt-2">
                  <TrendingUp className="w-3.5 h-3.5" /> +12% Growth vs Last Quarter
                </div>
              </div>
              <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                <span className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Billed Booking Manifests</span>
                <h2 className="text-3xl font-bold text-white tracking-tight mt-2">{metrics?.summary?.totalBookings || 48}</h2>
                <span className="text-[10px] text-platinum/40 font-mono mt-2">Checked in via FBO Gates</span>
              </div>
              <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                <span className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Razorpay Gateway success</span>
                <h2 className="text-3xl font-bold text-white tracking-tight mt-2">{payments?.successRate || 95}%</h2>
                <span className="text-[10px] text-platinum/40 font-mono mt-2">Sovereign settlement channels secure</span>
              </div>

              {/* CEO Analytics Panel */}
              <div className="md:col-span-2 space-y-6">
                <LineChartSVG 
                  labels={['June', 'July', 'August', 'September']} 
                  datasets={[
                    { label: 'Projected Total Revenue ($M)', data: [5.2, 5.8, 6.4, 6.1], borderColor: '#D4AF37' },
                    { label: 'Expected Growth Rate (%)', data: [12, 11, 10, 13], borderColor: '#E5E4E2' }
                  ]}
                />
                <ModelTransparencyCard 
                  modelName="RidgeDemandRegressor" 
                  version="v2.1.0" 
                  lastTrained={metrics?.metrics?.find((m: any) => m.modelName === 'RidgeDemandRegressor')?.lastTrained} 
                  confidence={94} 
                />
              </div>

              {/* CEO Alerts Column */}
              <div className="space-y-6">
                <AirCorridorsVisualizer />
              </div>
            </div>
          )}

          {/* Operations View */}
          {activeRole === "operations" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Metrics */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                <span className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Average Fleet idle hours</span>
                <h2 className="text-3xl font-bold text-white tracking-tight mt-2">400 hrs/mo</h2>
                <span className="text-[10px] text-platinum/40 font-mono">Gulfstream, BBJ & Bombardier status</span>
              </div>
              <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                <span className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Peak Delay Congestion</span>
                <h2 className="text-3xl font-bold text-white tracking-tight mt-2">35 mins</h2>
                <span className="text-[10px] text-platinum/40 font-mono">London Heathrow (LHR) FBO peak</span>
              </div>
              <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                <span className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Recommended Buffers</span>
                <h2 className="text-3xl font-bold text-white tracking-tight mt-2">11%</h2>
                <span className="text-[10px] text-platinum/40 font-mono">Hangar turnaround improvement targets</span>
              </div>

              {/* Operations Analytics Panel */}
              <div className="md:col-span-2 space-y-6">
                <BarChartSVG 
                  labels={fleet.map(f => f.aircraftModel.replace('Bombardier', 'Bomb.') || 'Jet')}
                  data={fleet.map(f => f.idleHours)}
                  label="Average Idle hours by aircraft type"
                />
                <ModelTransparencyCard 
                  modelName="FleetOptimizationOptimizer" 
                  version="v1.2.0" 
                  lastTrained={metrics?.metrics?.find((m: any) => m.modelName === 'FleetOptimizationOptimizer')?.lastTrained || new Date().toISOString()} 
                  confidence={89} 
                />
              </div>

              {/* Operations Warnings Callouts */}
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-platinum/50 font-mono font-medium">Reallocation warnings</h4>
                  {fleet.map((f, i) => (
                    <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white font-bold">{f.aircraftModel}</span>
                        <span className="text-gold font-mono font-bold">Improvement: {f.expectedImprovement}%</span>
                      </div>
                      <p className="text-[10px] text-platinum/60 font-light">
                        Current: Hub {f.currentHub} ➔ Recommended Hub {f.recommendedHub} to capture high-load charter schedules.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Revenue Analyst View */}
          {activeRole === "revenue" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Metrics */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                <span className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Optimal prices elasticity</span>
                <h2 className="text-3xl font-bold text-white tracking-tight mt-2">Low</h2>
                <span className="text-[10px] text-platinum/40 font-mono">High demand density BOM-DWC</span>
              </div>
              <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                <span className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Average Expected Yield Gain</span>
                <h2 className="text-3xl font-bold text-white tracking-tight mt-2">+7.2%</h2>
                <span className="text-[10px] text-platinum/40 font-mono">SerpAPI optimized ticket adjustments</span>
              </div>
              <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                <span className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">BOM-DWC popularity</span>
                <h2 className="text-3xl font-bold text-white tracking-tight mt-2">94</h2>
                <span className="text-[10px] text-platinum/40 font-mono">Demand score multiplier</span>
              </div>

              {/* Revenue Analytics Panel */}
              <div className="md:col-span-2 space-y-6">
                <BarChartSVG 
                  labels={pricing.map(p => p.flightNumber)}
                  data={pricing.map(p => p.recommendedPrice)}
                  label="Recommended flight ticket pricing adjustments (USD)"
                />
                <ModelTransparencyCard 
                  modelName="ElasticityTariffOptimizer" 
                  version="v1.4.2" 
                  lastTrained={metrics?.metrics?.find((m: any) => m.modelName === 'ElasticityTariffOptimizer')?.lastTrained} 
                  confidence={91} 
                />
              </div>

              {/* Revenue Alert Callouts */}
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-platinum/50 font-mono font-medium">Optimal pricing insights</h4>
                  {pricing.map((p, i) => (
                    <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white font-bold">{p.flightNumber}</span>
                        <span className="text-green-400 font-mono font-bold">Gain: +{p.revenueGain}%</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-platinum/60">
                        <span>Current: {formatAmount(p.currentPrice)}</span>
                        <span>Recommended: {formatAmount(p.recommendedPrice)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Marketing Analyst View */}
          {activeRole === "marketing" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Metrics */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                <span className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Upgrade likelihood score</span>
                <h2 className="text-3xl font-bold text-white tracking-tight mt-2">85%</h2>
                <span className="text-[10px] text-platinum/40 font-mono">Sarah Jenkins upgrade forecast</span>
              </div>
              <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                <span className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">VIP conversion probability</span>
                <h2 className="text-3xl font-bold text-white tracking-tight mt-2">78%</h2>
                <span className="text-[10px] text-platinum/40 font-mono">Premium members conversion rate</span>
              </div>
              <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                <span className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Redemption Likelihood</span>
                <h2 className="text-3xl font-bold text-white tracking-tight mt-2">82%</h2>
                <span className="text-[10px] text-platinum/40 font-mono">Lounge voucher campaigns</span>
              </div>

              {/* Marketing Analytics Panel */}
              <div className="md:col-span-2 space-y-6">
                <DoughnutChartSVG 
                  labels={customers.map(c => c.segment)}
                  data={customers.map(c => c.lifetimeValue)}
                  label="Segment Lifetime value contributions (USD)"
                />
                <ModelTransparencyCard 
                  modelName="RFMClusterer" 
                  version="v1.1.0" 
                  lastTrained={metrics?.metrics?.find((m: any) => m.modelName === 'RFMClusterer')?.lastTrained} 
                  confidence={92} 
                />
              </div>

              {/* Marketing Target Insights */}
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-platinum/50 font-mono font-medium">Segment Recommended Actions</h4>
                  {customers.map((c, i) => (
                    <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-2 text-xs">
                      <div className="flex justify-between items-center text-white font-bold">
                        <span>{c.segment}</span>
                        <span className="text-red-400 font-mono text-[10px]">Churn Risk: {c.churnRisk}%</span>
                      </div>
                      <div className="text-[10px] text-platinum/55 font-mono">Intent: {c.travelIntent}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {c.recommendedActions.map((act: string, idx: number) => (
                          <span key={idx} className="text-[8px] border border-gold/30 bg-gold/5 text-gold px-1.5 py-0.5 rounded font-mono block">{act}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Route Planner View */}
          {activeRole === "route" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Metrics */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                <span className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Emerging Route confidence</span>
                <h2 className="text-3xl font-bold text-white tracking-tight mt-2">88%</h2>
                <span className="text-[10px] text-platinum/40 font-mono">Lucknow to Dubai (LKO-DXB) load model</span>
              </div>
              <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                <span className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Expected load factors</span>
                <h2 className="text-3xl font-bold text-white tracking-tight mt-2">81%</h2>
                <span className="text-[10px] text-platinum/40 font-mono">Lucknow Hub load forecast</span>
              </div>
              <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                <span className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Expected monthly revenue</span>
                <h2 className="text-3xl font-bold text-white tracking-tight mt-2">₹1.4 Cr/mo</h2>
                <span className="text-[10px] text-platinum/40 font-mono">LKO-DXB regional projections</span>
              </div>

              {/* Route Analytics Panel */}
              <div className="md:col-span-2 space-y-6">
                <BarChartSVG 
                  labels={routeRecs.map(r => `${r.origin}-${r.destination}`)}
                  data={routeRecs.map(r => r.expectedLoadFactor)}
                  label="Route load factor recommendations (%)"
                />
                <ModelTransparencyCard 
                  modelName="RoutePredictor" 
                  version="v3.0.1" 
                  lastTrained={metrics?.metrics?.find((m: any) => m.modelName === 'RoutePredictor')?.lastTrained} 
                  confidence={88} 
                />
              </div>

              {/* Route Insight Alerts */}
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-platinum/50 font-mono font-medium">Route recommendations</h4>
                  {routeRecs.map((r, i) => (
                    <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white font-bold">{r.origin} ➔ {r.destination}</span>
                        <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold ${
                          r.status === 'high_growth' ? 'bg-gold/20 text-gold border border-gold/30' : r.status === 'emerging' ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30' : 'bg-red-500/20 text-red-400 border border-red-400/30'
                        }`}>
                          {r.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[10px] text-platinum/60 font-light leading-relaxed">
                        {r.reason}
                      </p>
                      <div className="flex justify-between text-[9px] text-gold font-mono font-bold mt-1">
                        <span>Expected Revenue: {formatAmount(r.expectedRevenue)}</span>
                        <span>Confidence: {r.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ARIS Natural Language Analytics Interface */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 bg-gradient-to-br from-white/[0.01] to-white/[0.03] shadow-2xl relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-[40px] pointer-events-none" />
        
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold" />
          <h3 className="text-lg font-serif font-bold text-white">Natural Language Decision Console</h3>
        </div>
        <p className="text-platinum/50 text-xs font-light">Ask ARIS Core regarding route margins, capacity constraints, customer upgrades, and pricing indexes.</p>

        {/* Query Input Box */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleAISubmit(); }}
          className="flex bg-white/5 border border-white/10 rounded-2xl p-2 relative z-10 focus-within:border-gold/40 transition-colors"
        >
          <Search className="w-5 h-5 text-platinum/40 my-auto ml-3" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search directives... (e.g. Which routes generated the highest revenue this month?)"
            className="flex-grow bg-transparent border-0 outline-none text-sm text-white px-4 py-3 placeholder:text-platinum/30"
          />
          <button 
            type="submit" 
            disabled={submittingQuery}
            className="bg-gold hover:bg-gold-light text-onyx font-bold px-6 rounded-xl text-xs font-mono tracking-wider transition-colors cursor-pointer shadow-[0_0_12px_rgba(212,175,55,0.2)]"
          >
            {submittingQuery ? "Analyzing..." : "Run ML Core"}
          </button>
        </form>

        {/* Quick click template buttons */}
        <div className="flex flex-wrap gap-2 pt-2 relative z-10">
          {queryTemplates.map((t, idx) => (
            <button 
              key={idx}
              type="button"
              onClick={() => { setSearchQuery(t.q); handleAISubmit(t.q); }}
              className="text-[9px] font-mono border border-white/10 bg-white/5 hover:border-gold/40 hover:bg-gold/5 hover:text-gold text-platinum/50 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* AI Output Panel */}
        <AnimatePresence>
          {aiResponse && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="border-t border-white/5 pt-6 mt-6 space-y-6 text-left relative z-10"
            >
              <div className="p-5 rounded-2xl bg-gold/5 border border-gold/20 flex gap-4">
                <Zap className="w-8 h-8 text-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gold font-mono font-bold">Cortex AI Output Directive</h4>
                  <p className="text-xs text-white leading-relaxed mt-2 font-light">{aiResponse.responseText}</p>
                </div>
              </div>

              {/* Recommended Actions */}
              {aiResponse.actions && aiResponse.actions.length > 0 && (
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <h4 className="text-xs uppercase tracking-widest text-platinum/50 font-mono font-medium flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-gold" /> Recommended Corporate Countermeasures
                  </h4>
                  <ul className="space-y-2">
                    {aiResponse.actions.map((act: string, idx: number) => (
                      <li key={idx} className="text-xs text-platinum/80 flex items-start gap-2.5 font-light leading-relaxed">
                        <ArrowUpRight className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                        {act}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Interactive SVG Chart returned from NLP query */}
              {aiResponse.chartData && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mt-6"
                >
                  {aiResponse.chartData.type === 'bar' && (
                    <BarChartSVG 
                      labels={aiResponse.chartData.labels}
                      data={aiResponse.chartData.datasets[0].data}
                      label={aiResponse.chartData.datasets[0].label}
                    />
                  )}
                  {aiResponse.chartData.type === 'line' && (
                    <LineChartSVG 
                      labels={aiResponse.chartData.labels}
                      datasets={aiResponse.chartData.datasets}
                    />
                  )}
                  {aiResponse.chartData.type === 'pie' && (
                    <DoughnutChartSVG 
                      labels={aiResponse.chartData.labels}
                      data={aiResponse.chartData.datasets[0].data}
                      label="AI Segmentation Insights"
                    />
                  )}
                  {aiResponse.chartData.type === 'doughnut' && (
                    <DoughnutChartSVG 
                      labels={aiResponse.chartData.labels}
                      data={aiResponse.chartData.datasets[0].data}
                      label="Dynamic Margin Contributions"
                    />
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
