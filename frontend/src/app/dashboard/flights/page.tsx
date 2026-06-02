"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PlaneTakeoff, MapPin, Calendar, Users, Map, Download, Clock, X, QrCode, Plane, Eye } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useSkyLuxeStore, FlightBooking } from "@/store/skyluxeStore";

export default function MyFlights() {
  const { flights, profile, formatAmount, cancelBooking } = useSkyLuxeStore();
  const [activeModal, setActiveModal] = useState<"tracking" | "boardingPass" | "cabin3d" | "history" | "cancellation" | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<FlightBooking | null>(null);

  // Group flights into Upcoming (Confirmed) and History (Completed)
  const upcomingFlights = flights.filter(f => f.status === "Confirmed" || f.status === "Pending" || f.status === "Cancelled");
  const pastFlights = flights.filter(f => f.status === "Completed");

  const openModal = (type: "tracking" | "boardingPass" | "cabin3d" | "history", flight: FlightBooking) => {
    setSelectedFlight(flight);
    setActiveModal(type);
  };

  return (
    <div className="space-y-8 pb-12 flex-1">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">My Flights</h1>
          <p className="text-platinum/50 font-light text-sm">Manage your upcoming charters, view boarding passes, and track flight history.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/fleet">
            <button className="px-6 py-2.5 rounded-xl bg-gold text-onyx font-bold hover:bg-gold-light transition-colors text-sm shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              Charter Private Jet
            </button>
          </Link>
          <Link href="/commercial">
            <button className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors text-sm">
              Book Commercial leg
            </button>
          </Link>
        </div>
      </div>

      {/* Upcoming Flights Listing */}
      <div>
        <h3 className="text-xl font-serif font-bold text-white mb-6">Scheduled Missions</h3>
        {upcomingFlights.length > 0 ? (
          <div className="space-y-6">
            {upcomingFlights.map((flight) => (
              <motion.div 
                key={flight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-3xl border border-gold/20 shadow-[0_0_40px_rgba(212,175,55,0.03)] overflow-hidden relative group"
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                
                <div className="relative z-10 p-8 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 ${
                      flight.status === "Cancelled" 
                        ? "border-red-500/30 bg-red-500/10 text-red-400"
                        : "border-gold/30 bg-gold/10 text-gold"
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${flight.status === "Cancelled" ? "bg-red-500" : "bg-gold animate-pulse"}`} />
                      <span className="text-[9px] font-bold tracking-widest uppercase font-mono">
                        {flight.status === "Cancelled" ? "Cancelled Mission" : "Confirmed Mission"}
                      </span>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-white">{flight.departure.city} ({flight.departure.code}) to {flight.arrival.city} ({flight.arrival.code})</h2>
                    <p className="text-platinum/60 text-sm font-light mt-1 flex items-center gap-2 font-mono">
                      <Calendar className="w-4 h-4 text-gold" /> {flight.date} • {flight.departure.time} Local
                    </p>
                  </div>
                  <div className="flex gap-3">
                    {flight.status !== "Cancelled" && (
                      <button 
                        onClick={() => openModal("tracking", flight)}
                        className="px-5 py-2.5 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-colors text-sm flex items-center gap-2"
                      >
                        <Map className="w-4 h-4 text-gold" /> Track Flight
                      </button>
                    )}
                    {flight.status !== "Cancelled" && (
                      <button 
                        onClick={() => openModal("boardingPass", flight)}
                        className="px-5 py-2.5 rounded-xl bg-white text-onyx font-bold hover:bg-platinum transition-colors text-sm flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" /> Boarding Pass
                      </button>
                    )}
                    {flight.status !== "Cancelled" && (
                      <button 
                        onClick={() => openModal("cancellation", flight)}
                        className="px-5 py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-colors text-sm flex items-center gap-2"
                      >
                        <X className="w-4 h-4 text-red-400" /> Cancel Booking
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative z-10 p-8 bg-onyx/40 backdrop-blur-md grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-platinum/40 uppercase tracking-widest mb-1 font-mono">Aircraft</p>
                    <p className="text-white font-medium text-sm">{flight.aircraft}</p>
                    {flight.type === "private" && (
                      <button onClick={() => openModal("cabin3d", flight)} className="text-gold text-xs mt-1 flex items-center gap-1 hover:underline font-mono">
                        <Eye className="w-3 h-3" /> View Cabin 3D
                      </button>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-platinum/40 uppercase tracking-widest mb-1 font-mono">Type & Seat</p>
                    <p className="text-white font-medium text-sm">{flight.type === "private" ? "Private Charter" : `Seat ${flight.seatNumber}`}</p>
                  </div>
                  <div>
                    <p className="text-xs text-platinum/40 uppercase tracking-widest mb-1 font-mono">Departure FBO</p>
                    <p className="text-white font-medium text-sm flex items-center gap-2"><MapPin className="w-4 h-4 text-platinum/50"/> {flight.terminal || "VIP Lounge"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-platinum/40 uppercase tracking-widest mb-1 font-mono">Flight Duration</p>
                    <p className="text-white font-medium text-sm flex items-center gap-2"><Clock className="w-4 h-4 text-platinum/50"/> {flight.duration}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center text-platinum/40 font-light">No upcoming flight missions.</div>
        )}
      </div>

      {/* Flight History */}
      <div>
        <h3 className="text-xl font-serif font-bold text-white mb-6">Flight History</h3>
        {pastFlights.length > 0 ? (
          <div className="space-y-4">
            {pastFlights.map((flight) => (
              <div 
                key={flight.id} 
                onClick={() => openModal("history", flight)}
                className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/20 transition-colors cursor-pointer group bg-white/5 hover:bg-white/10"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                    <PlaneTakeoff className="w-5 h-5 text-platinum/60 group-hover:text-gold transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">{flight.departure.city} ({flight.departure.code}) to {flight.arrival.city} ({flight.arrival.code})</h4>
                    <p className="text-xs text-platinum/50 font-light font-mono">{flight.date} • {flight.aircraft} • {flight.type === "private" ? "Charter" : `Seat ${flight.seatNumber}`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium font-mono">{flight.status}</span>
                  <span className="text-gold text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View Receipt</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 border border-dashed border-white/5 rounded-2xl text-center text-platinum/40 font-light">No historic logs recorded.</div>
        )}
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {activeModal && selectedFlight && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020202]/90 backdrop-blur-md"
          >
            <div className="absolute inset-0" onClick={() => setActiveModal(null)} />
            
            {/* 1. FLIGHT TRACKING MODAL */}
            {activeModal === "tracking" && (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative z-10 w-full max-w-4xl h-[70vh] glass-panel border border-gold/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col bg-onyx"
              >
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40 backdrop-blur-xl absolute top-0 left-0 right-0 z-20">
                  <div className="flex items-center gap-3">
                    <Map className="w-5 h-5 text-gold" />
                    <h3 className="text-lg font-serif font-bold text-white">Live Telemetry: {selectedFlight.id}</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link href={`/track-flight?flight=${selectedFlight.id}`} className="px-3 py-1 rounded-lg bg-gold/20 text-gold text-xs font-mono border border-gold/30 hover:bg-gold hover:text-onyx transition-all">
                      Full Screen Radar
                    </Link>
                    <button onClick={() => setActiveModal(null)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 relative bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000')] bg-cover bg-center">
                  <div className="absolute inset-0 bg-onyx/80 mix-blend-multiply" />
                  {/* Fake glowing route line */}
                  <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gold/30 border-t border-dashed border-gold flex items-center shadow-[0_0_15px_rgba(212,175,55,1)]">
                    <motion.div 
                      animate={{ x: ["0%", "100%"] }} 
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0"
                    >
                      <Plane className="w-6 h-6 text-gold drop-shadow-2xl filter" />
                    </motion.div>
                  </div>
                  
                  {/* Telemetry UI Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between gap-4">
                    <div className="glass-panel p-4 rounded-xl border border-white/20 bg-onyx/80 backdrop-blur-md flex-1">
                      <p className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1 font-mono">Altitude</p>
                      <p className="text-2xl font-bold font-mono text-white">41,000 ft</p>
                    </div>
                    <div className="glass-panel p-4 rounded-xl border border-white/20 bg-onyx/80 backdrop-blur-md flex-1">
                      <p className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1 font-mono">Cruise Mach</p>
                      <p className="text-2xl font-bold font-mono text-white">{selectedFlight.type === "private" ? "0.925" : "0.80"}</p>
                    </div>
                    <div className="glass-panel p-4 rounded-xl border border-white/20 bg-onyx/80 backdrop-blur-md flex-1">
                      <p className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1 font-mono">Scheduled Arrival</p>
                      <p className="text-2xl font-bold font-mono text-gold">{selectedFlight.arrival.time} Local</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. BOARDING PASS MODAL */}
            {activeModal === "boardingPass" && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }}
                className="relative z-10 w-full max-w-md glass-panel rounded-3xl border border-white/10 bg-onyx/90 backdrop-blur-2xl overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.05)]"
              >
                <div className="p-4 flex justify-end">
                  <button onClick={() => setActiveModal(null)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Tear line */}
                <div className="absolute top-[60%] left-0 right-0 border-t-2 border-dashed border-white/10" />
                <div className="absolute top-[60%] -left-3 w-6 h-6 bg-[#020202] rounded-full -translate-y-1/2" />
                <div className="absolute top-[60%] -right-3 w-6 h-6 bg-[#020202] rounded-full -translate-y-1/2" />
                
                <div className="px-8 pb-10">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-gold text-xs font-bold uppercase tracking-widest font-mono">
                      {selectedFlight.type === "private" ? "SkyLuxe Private" : `${selectedFlight.airline} Scheduled`}
                    </span>
                    <span className="text-white/40 text-xs font-mono">PNR: {selectedFlight.id}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <p className="text-4xl font-serif text-white font-bold">{selectedFlight.departure.code}</p>
                      <p className="text-platinum/50 text-xs mt-1">{selectedFlight.departure.city}</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center px-4">
                      <p className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1 font-mono">{selectedFlight.duration}</p>
                      <div className="w-full border-t border-dashed border-gold/50 relative">
                        <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-serif text-white font-bold">{selectedFlight.arrival.code}</p>
                      <p className="text-platinum/50 text-xs mt-1">{selectedFlight.arrival.city}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1 font-mono">Terminal</p>
                      <p className="text-white font-medium text-sm">{selectedFlight.terminal || "VIP Lounge"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1 font-mono">Position</p>
                      <p className="text-white font-medium text-sm">{selectedFlight.type === "commercial" ? `Seat ${selectedFlight.seatNumber}` : "Charter"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1 font-mono">Gate</p>
                      <p className="text-white font-medium text-sm text-gold">{selectedFlight.gate}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 pt-12 bg-white/5 flex flex-col items-center justify-center">
                  <div className="p-3 bg-white rounded-xl mb-4">
                    <QrCode className="w-24 h-24 text-black" />
                  </div>
                  <p className="text-white font-medium">Eashan Sterling</p>
                  <p className="text-platinum/50 text-xs font-mono">Add to Apple Wallet</p>
                </div>
              </motion.div>
            )}

            {/* 3. CABIN 3D VIEW MODAL */}
            {activeModal === "cabin3d" && (
              <motion.div 
                initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="relative z-10 w-[90vw] h-[80vh] glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-[#050505]"
              >
                <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 z-50 p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542289650-84384a51e6cb?q=80&w=2000')] bg-cover bg-center flex flex-col items-center justify-end pb-12">
                  <div className="p-6 bg-onyx/80 backdrop-blur-xl border border-white/10 rounded-2xl max-w-lg text-center">
                    <h3 className="text-2xl font-serif text-white mb-2">{selectedFlight.aircraft} Cabin</h3>
                    <p className="text-platinum/60 font-light text-sm">Interactive 3D stateroom interior. Features hand-stitched leather layflat suites, customized wood trims, and FBO atmospheric air filtering systems.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. HISTORY DETAILS MODAL */}
            {activeModal === "history" && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
                className="relative z-10 w-full max-w-lg glass-panel rounded-3xl border border-white/10 bg-onyx/95 backdrop-blur-3xl overflow-hidden shadow-2xl p-8"
              >
                <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-6">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white mb-1">Receipt Invoice</h3>
                    <p className="text-platinum/50 text-xs font-mono">Invoice reference: {selectedFlight.id}</p>
                  </div>
                  <button onClick={() => setActiveModal(null)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-platinum/60">Leg Route</span>
                    <span className="text-white font-medium">{selectedFlight.departure.city} ({selectedFlight.departure.code}) to {selectedFlight.arrival.city} ({selectedFlight.arrival.code})</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-platinum/60">Execution Date</span>
                    <span className="text-white font-medium">{selectedFlight.date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-platinum/60">Secured Equipment</span>
                    <span className="text-white font-medium">{selectedFlight.aircraft}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-platinum/60">Passengers</span>
                    <span className="text-white font-medium">{selectedFlight.passengers} Guests</span>
                  </div>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 mb-6">
                  <div className="flex justify-between items-end">
                    <span className="text-platinum/60 text-sm">Billed Total</span>
                    <span className="text-3xl font-bold text-gold">${selectedFlight.cost.toLocaleString()}</span>
                  </div>
                </div>

                <button className="w-full py-3 rounded-xl border border-gold/30 text-gold hover:bg-gold/10 transition-colors font-bold text-sm">
                  Download PDF Receipt
                </button>
              </motion.div>
            )}

            {/* 5. CANCELLATION MODAL */}
            {activeModal === "cancellation" && (() => {
              const tier = (profile?.membership || "none").toLowerCase().replace(" ", "_");
              const isPrivate = selectedFlight.type === "private";
              
              // Calculate hours diff
              const departureDate = new Date(selectedFlight.date + "T" + (selectedFlight.departure.time || "09:00"));
              const timeDiff = departureDate.getTime() - Date.now();
              const hoursDiff = timeDiff / (1000 * 3600);
              const isRefundable = hoursDiff >= 24;
              
              // Calculate fees in USD
              let cancellationFee = 0;
              if (isRefundable) {
                if (isPrivate) {
                  if (tier === "black_elite") cancellationFee = 0;
                  else if (tier === "executive") cancellationFee = 250;
                  else cancellationFee = 500;
                } else {
                  if (tier === "black_elite") cancellationFee = 0;
                  else if (tier === "executive") cancellationFee = 50;
                  else cancellationFee = 100;
                }
              } else {
                cancellationFee = selectedFlight.cost;
              }
              
              const refundAmount = Math.max(0, selectedFlight.cost - cancellationFee);
              
              return (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                  animate={{ scale: 1, opacity: 1, y: 0 }} 
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
                  className="relative z-10 w-full max-w-lg glass-panel border border-red-500/30 rounded-3xl overflow-hidden shadow-2xl p-8 bg-onyx"
                >
                  <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-white mb-1">Cancel Booking Mission</h3>
                      <p className="text-platinum/50 text-xs font-mono">Reference: {selectedFlight.id}</p>
                    </div>
                    <button onClick={() => setActiveModal(null)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                      <div className="flex justify-between text-xs text-platinum/50">
                        <span>Route</span>
                        <span className="text-white font-medium">{selectedFlight.departure.city} → {selectedFlight.arrival.city}</span>
                      </div>
                      <div className="flex justify-between text-xs text-platinum/50">
                        <span>Departure Time</span>
                        <span className="text-white font-medium">{selectedFlight.date} • {selectedFlight.departure.time}</span>
                      </div>
                      <div className="flex justify-between text-xs text-platinum/50">
                        <span>Aircraft Class</span>
                        <span className="text-white font-medium">{selectedFlight.aircraft}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-white/5 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-platinum/60">Original Fare</span>
                        <span className="text-white font-medium font-mono">{formatAmount(selectedFlight.cost)}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-platinum/60 flex items-center gap-1.5">
                          Cancellation Penalty
                          {!isRefundable && <span className="text-red-400 text-[10px] font-mono">(Departure &lt; 24h)</span>}
                        </span>
                        <span className="text-red-400 font-medium font-mono">-{formatAmount(cancellationFee)}</span>
                      </div>
                      
                      <div className="border-t border-white/10 pt-3 flex justify-between items-end">
                        <span className="text-white font-medium text-sm">Estimated Refund</span>
                        <span className="text-2xl font-bold text-gold font-mono">{formatAmount(refundAmount)}</span>
                      </div>
                    </div>

                    {/* Tier Benefits Notification */}
                    {isRefundable ? (
                      <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                        tier === "black_elite" 
                          ? "border-gold/30 bg-gold/5 text-gold"
                          : tier === "executive"
                            ? "border-gold/20 bg-gold/5 text-gold/90"
                            : "border-white/15 bg-white/5 text-platinum/70"
                      }`}>
                        {tier === "black_elite" && (
                          <p>✦ <strong>Black Elite Privilege:</strong> Enjoy $0 fee cancellations on all flights. The full booking cost is refunded to your wallet.</p>
                        )}
                        {tier === "executive" && (
                          <p>✦ <strong>Executive Privilege:</strong> Reduced cancellation fee applied. Silver members pay double for cancellations.</p>
                        )}
                        {tier === "silver" && (
                          <p>✦ <strong>Silver Tier:</strong> Standard cancellation fee applied. Upgrade to Executive or Black Elite for reduced or waived fees.</p>
                        )}
                        {tier === "none" && (
                          <p>✦ Upgrade to a SkyLuxe Club membership tier to unlock waived cancellation fees and higher points multipliers.</p>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400/90 text-xs leading-relaxed font-light">
                        ⚠️ <strong>Non-Refundable Window:</strong> Flights cancelled less than 24 hours prior to departure do not qualify for FBO wallet refund credits.
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setActiveModal(null)}
                      className="flex-1 py-3 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-colors font-medium text-sm"
                    >
                      Keep Booking
                    </button>
                    <button 
                      onClick={async () => {
                        const success = await cancelBooking(selectedFlight.id);
                        if (success) {
                          setActiveModal(null);
                        } else {
                          alert("Failed to process flight cancellation. Please contact support.");
                        }
                      }}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-colors font-bold text-sm shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                    >
                      Confirm Cancellation
                    </button>
                  </div>
                </motion.div>
              );
            })()}

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
