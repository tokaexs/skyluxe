"use client";

import { motion } from "framer-motion";
import { Activity, Clock, Leaf, DollarSign, Sparkles } from "lucide-react";

export default function TravelAnalytics() {
  return (
    <div className="space-y-8 flex-1 pb-12">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white mb-2">Travel Analytics & Ledger</h1>
        <p className="text-platinum/50 font-light text-sm">Analyze flight metrics, carbon offsets, regional logistics, and financial spending profiles.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AnalyticsCard icon={Clock} title="Secured Hours" value="124 hrs" desc="Quarterly flight log target" />
        <AnalyticsCard icon={Leaf} title="Carbon Offset" value="48.5 tons" desc="100% Offset via SkyLuxe Eco" />
        <AnalyticsCard icon={DollarSign} title="Total Secured" value="$165,500" desc="Aviation FBO charge accounts" />
        <AnalyticsCard icon={Activity} title="Missions Logged" value="14" desc="Completed private & commercial legs" />
      </div>

      {/* Interactive Charts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SVG Spend Chart */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden bg-onyx">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-[45px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <h3 className="text-xl font-serif font-bold text-white mb-6">Secured Flight Hours per Quarter</h3>
          
          {/* Simple custom SVG chart layout */}
          <div className="relative h-64 w-full flex items-end justify-between px-4 pb-6 border-b border-white/10 font-mono text-[10px] text-platinum/50">
            <div className="absolute left-0 bottom-6 right-0 h-px bg-white/5" />
            <div className="absolute left-0 bottom-24 right-0 h-px bg-white/5" />
            <div className="absolute left-0 bottom-40 right-0 h-px bg-white/5" />

            <div className="flex flex-col items-center gap-2 z-10">
              <span className="text-white font-bold">24 hrs</span>
              <div className="w-12 bg-white/5 border border-white/10 rounded-t-lg transition-all h-24 group hover:bg-gold/30 hover:border-gold/30 cursor-pointer" />
              <span>Q1 2026</span>
            </div>
            
            <div className="flex flex-col items-center gap-2 z-10">
              <span className="text-white font-bold">40 hrs</span>
              <div className="w-12 bg-white/5 border border-white/10 rounded-t-lg transition-all h-36 group hover:bg-gold/30 hover:border-gold/30 cursor-pointer" />
              <span>Q2 2026</span>
            </div>

            <div className="flex flex-col items-center gap-2 z-10">
              <span className="text-white font-bold">52 hrs</span>
              <div className="w-12 bg-gradient-to-t from-gold/50 to-gold rounded-t-lg transition-all h-48 group hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] cursor-pointer" />
              <span className="text-gold font-medium">Q3 2026</span>
            </div>

            <div className="flex flex-col items-center gap-2 z-10">
              <span className="text-white font-bold">12 hrs</span>
              <div className="w-12 bg-white/5 border border-white/10 rounded-t-lg transition-all h-12 group hover:bg-gold/30 hover:border-gold/30 cursor-pointer" />
              <span>Q4 2026</span>
            </div>
          </div>
        </div>

        {/* Regional logs progress bars */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10">
          <h3 className="text-xl font-serif font-bold text-white mb-6">Regional Operations Vetting</h3>
          
          <div className="space-y-6">
            <RegionProgressBar label="India & South Asia Network (BOM / DEL)" percentage={55} />
            <RegionProgressBar label="Gulf & GCC Corridors (DWC / DXB)" percentage={30} />
            <RegionProgressBar label="European Airspace routes (LHR / GVA)" percentage={15} />
          </div>
        </div>

      </div>
    </div>
  );
}

function AnalyticsCard({ icon: Icon, title, value, desc }: any) {
  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between group hover:border-gold/30 transition-all duration-500">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs text-platinum/50 uppercase tracking-widest font-mono">{title}</span>
        <div className="p-2 bg-white/5 rounded-lg text-gold group-hover:bg-gold/10 transition-colors">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-serif font-bold text-white mb-1">{value}</h3>
        <p className="text-[10px] text-platinum/40 font-light leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function RegionProgressBar({ label, percentage }: { label: string; percentage: number }) {
  return (
    <div>
      <div className="flex justify-between items-center text-sm mb-2">
        <span className="text-platinum/80 font-light">{label}</span>
        <span className="text-gold font-bold font-mono">{percentage}%</span>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gold rounded-full"
        />
      </div>
    </div>
  );
}
