"use client";

import { motion } from "framer-motion";
import { Plane, Calendar, CreditCard, ArrowUpRight, Clock, ShieldAlert, Navigation, LogOut } from "lucide-react";
import Link from "next/link";
import { useSkyLuxeStore } from "@/store/skyluxeStore";
import { useAuth } from "@/context/AuthContext";

export default function DashboardOverview() {
  const { walletBalance, flights, profile } = useSkyLuxeStore();
  const { logout } = useAuth();
  
  // Find next upcoming flight
  const upcomingFlights = flights.filter(f => f.status === "Confirmed");
  const nextFlight = upcomingFlights[0] || null;

  // Calculate total flight hours based on flights list
  const totalFlightHours = flights.reduce((sum, f) => {
    const hours = Number(f.duration.replace("h", "").replace("m", "").split(" ")[0]) || 3.5;
    return sum + (f.status === "Completed" ? hours : 0);
  }, 0) + 120; // baseline of 120 hours + dynamic completed hours

  const formattedBalance = `$${walletBalance.toLocaleString()}`;

  return (
    <div className="space-y-8 flex-1">
      {/* Top Header section */}
      <div className="flex justify-between items-center bg-white/5 border border-white/10 p-6 rounded-3xl">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Dashboard Overview</h2>
          <p className="text-platinum/50 text-xs font-light mt-1">Manage flight dispatches, credentials, and wallet settlements.</p>
        </div>
        <button 
          onClick={logout}
          className="px-4 py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
      {/* Metrics Row */}
      <div id="tour-db-metrics" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Total Flight Hours Secured" value={`${totalFlightHours} hrs`} trend="+12 hours this month" icon={Clock} />
        <MetricCard title="Upcoming Missions" value={upcomingFlights.length.toString()} trend={nextFlight ? `Next: ${nextFlight.arrival.city}` : "No missions scheduled"} icon={Plane} />
        <MetricCard title="Aviation Wallet Balance" value={formattedBalance} trend="Settlement Autopay Active" icon={CreditCard} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Next Flight Card */}
        <div id="tour-db-active-flight" className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
          
          {nextFlight ? (
            <>
              <div className="flex justify-between items-start mb-12">
                <div>
                  <div className="inline-flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                    <span className="text-gold text-xs font-semibold tracking-widest uppercase font-mono">Next Active Mission</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white">{nextFlight.departure.city} ({nextFlight.departure.code}) to {nextFlight.arrival.city} ({nextFlight.arrival.code})</h3>
                  <p className="text-platinum/50 text-sm mt-1 flex items-center gap-2 font-mono"><Calendar className="w-4 h-4 text-gold"/> {nextFlight.date} • {nextFlight.departure.time} Local</p>
                </div>
                <span className="px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-medium font-mono">{nextFlight.status}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-xs text-platinum/40 uppercase tracking-widest mb-1 font-mono">Aircraft</p>
                  <p className="text-white font-medium text-sm">{nextFlight.aircraft}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-xs text-platinum/40 uppercase tracking-widest mb-1 font-mono">Passengers</p>
                  <p className="text-white font-medium text-sm">{nextFlight.passengers} Guests</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-xs text-platinum/40 uppercase tracking-widest mb-1 font-mono">Terminal</p>
                  <p className="text-white font-medium text-sm">{nextFlight.terminal || "VIP Lounge"}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Link href="/dashboard/trips">
                  <button className="px-6 py-3 rounded-xl bg-gold text-onyx font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:bg-gold-light transition-colors text-sm">
                    Track Telemetry & Route
                  </button>
                </Link>
                <Link href="/dashboard/flights">
                  <button className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors text-sm">
                    View Boarding Pass
                  </button>
                </Link>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col justify-center items-center py-12 text-center">
              <ShieldAlert className="w-12 h-12 text-gold/30 mb-4 animate-pulse" />
              <h3 className="text-2xl font-serif text-white mb-2">No Active Flight Missions</h3>
              <p className="text-platinum/50 text-sm max-w-sm font-light mb-8">Search the commercial catalog or request an executive private charter jet configuration.</p>
              <div className="flex gap-4">
                <Link href="/fleet"><button className="px-6 py-2.5 bg-gold text-onyx font-bold rounded-lg text-sm">Book Private Jet</button></Link>
                <Link href="/commercial"><button className="px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg text-sm">Search Flights</button></Link>
              </div>
            </div>
          )}
        </div>

        {/* Membership Status */}
        <div className="glass-panel p-8 rounded-3xl border border-gold/20 shadow-[0_0_30px_rgba(212,175,55,0.05)] flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-serif font-bold text-white mb-2">Signature Elite Membership</h3>
            <p className="text-platinum/50 text-sm font-light mb-6">Autopay billing configuration: Active.</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-platinum/70 text-sm font-light">Renewal Date</span>
                <span className="text-white text-sm font-mono">Jan 01, 2027</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-platinum/70 text-sm font-light">Priority Tier</span>
                <span className="text-gold text-sm font-medium">Level 1 (Immediate VIP)</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-platinum/70 text-sm font-light">FBO Access Lounge</span>
                <span className="text-white text-sm">Complimentary Global Lounge</span>
              </div>
            </div>
          </div>

          <Link href="/dashboard/membership" className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors font-medium text-sm">
            Manage Sovereignty Card <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, icon: Icon }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-4">
        <p className="text-platinum/50 text-sm font-light">{title}</p>
        <div className="p-2 rounded-lg bg-white/5 text-gold">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-serif font-bold text-white mb-2">{value}</h3>
        <p className="text-platinum/40 text-xs tracking-wide font-mono">{trend}</p>
      </div>
    </motion.div>
  );
}
