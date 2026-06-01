"use client";

import { motion } from "framer-motion";
import GlassNavbar from "@/components/ui/GlassNavbar";
import { ArrowRight, Check, Compass, Users, Info, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

const seatTypes = {
  first: { label: "First Class Suite", surcharge: 150, color: "bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30" },
  business: { label: "Business Flatbed", surcharge: 80, color: "bg-blue-600/20 border-blue-400/40 text-blue-300 hover:bg-blue-600/30" },
  premium: { label: "Premium Seat", surcharge: 30, color: "bg-purple-600/20 border-purple-400/40 text-purple-300 hover:bg-purple-600/30" },
  economy: { label: "Economy Seat", surcharge: 0, color: "bg-white/10 border-white/20 text-white hover:bg-white/20" }
};

// Seating layout mapping with different classes, emergency exits, and premium statuses
const cabinLayout = [
  // First Class Suites
  { row: 1, seats: ["1A", "1B", "1E", "1F"], type: "first", isPremium: true },
  { row: 2, seats: ["2A", "2B", "2E", "2F"], type: "first", isPremium: true },
  
  // Business Class Flatbeds
  { row: 4, seats: ["4A", "4B", "4D", "4E", "4F", "4J"], type: "business" },
  { row: 5, seats: ["5A", "5B", "5D", "5E", "5F", "5J"], type: "business" },
  { row: 6, seats: ["6A", "6B", "6D", "6E", "6F", "6J"], type: "business" },
  
  // Emergency Exit row with warning parameters
  { row: 8, seats: ["8A", "8B", "8C", "8D", "8E", "8F"], type: "premium", isEmergency: true },
  
  // Economy Class
  { row: 9, seats: ["9A", "9B", "9C", "9D", "9E", "9F"], type: "economy" },
  { row: 10, seats: ["10A", "10B", "10C", "10D", "10E", "10F"], type: "economy" },
];

const takenSeats = ["1B", "4E", "5A", "9C", "10F"];

function SeatsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const flightId = (params?.id as string) || "AI-101";
  const fromCode = searchParams.get("from") || "BOM";
  const toCode = searchParams.get("to") || "DXB";
  const dateStr = searchParams.get("date") || "2026-06-04";
  const passengers = Number(searchParams.get("passengers")) || 1;

  const basePrice = flightId === "EK-505" ? 780 : flightId === "UK-202" ? 420 : flightId === "AI-101" ? 350 : 180;
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [surcharge, setSurcharge] = useState(0);
  const [seatLabel, setSeatLabel] = useState("");

  const handleSeatClick = (seatCode: string, type: string, isEmergency: boolean) => {
    if (takenSeats.includes(seatCode)) return;
    setSelectedSeat(seatCode);
    
    // Calculate surcharge
    // @ts-ignore
    const config = seatTypes[type];
    let charge = config.surcharge;
    if (isEmergency) charge += 15; // extra emergency exit fee
    setSurcharge(charge);
    setSeatLabel(config.label + (isEmergency ? " (Emergency Exit)" : ""));
  };

  const totalPrice = (basePrice + surcharge) * passengers;

  const handleConfirm = () => {
    if (!selectedSeat) return;
    router.push(`/checkout?type=commercial&id=${flightId}&seat=${selectedSeat}&price=${totalPrice}&from=${fromCode}&to=${toCode}&date=${dateStr}&passengers=${passengers}`);
  };

  return (
    <div className="relative z-10 flex-grow flex flex-col pt-32 pb-24 px-6 lg:px-16 max-w-6xl mx-auto w-full">
      <Link href={`/flights/${flightId}?from=${fromCode}&to=${toCode}&date=${dateStr}`} className="text-platinum/50 hover:text-white transition-colors text-xs font-mono uppercase mb-8 flex items-center gap-2">
        ← Back to Flight Details
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Seating map card */}
        <div className="lg:col-span-8 glass-panel p-8 rounded-3xl border border-white/10 flex flex-col items-center bg-onyx/40">
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Interactive Seating Blueprint</h2>
          <p className="text-platinum/50 text-xs mb-8 font-light">Choose your cabin coordinates. Premium options and exits are marked below.</p>
          
          {/* Seating map layout container */}
          <div className="w-full max-w-md border border-white/10 bg-black/60 rounded-3xl p-8 relative overflow-hidden flex flex-col gap-6">
            <div className="absolute top-0 left-0 right-0 h-4 bg-white/5 border-b border-white/10 text-[8px] tracking-widest text-center text-platinum/30 pt-1 font-mono uppercase">Cockpit / Flight Deck</div>
            
            <div className="h-6" />

            {cabinLayout.map((rowLayout) => (
              <div key={rowLayout.row} className="flex justify-between gap-4 items-center">
                <span className="text-[10px] font-mono text-platinum/30 w-4 text-center">{rowLayout.row}</span>
                
                <div className="flex-1 grid grid-cols-6 gap-2 relative">
                  {/* Emergency exit visual indicators */}
                  {rowLayout.isEmergency && (
                    <div className="absolute inset-y-0 -left-6 -right-6 border-t border-b border-dashed border-red-500/30 bg-red-500/5 pointer-events-none flex items-center justify-between px-2">
                      <span className="text-[7px] text-red-400 font-mono tracking-widest uppercase">EXIT</span>
                      <span className="text-[7px] text-red-400 font-mono tracking-widest uppercase">EXIT</span>
                    </div>
                  )}

                  {rowLayout.seats.map((seat) => {
                    const isTaken = takenSeats.includes(seat);
                    const isSelected = selectedSeat === seat;
                    // @ts-ignore
                    const typeConfig = seatTypes[rowLayout.type];
                    
                    return (
                      <button
                        key={seat}
                        disabled={isTaken}
                        onClick={() => handleSeatClick(seat, rowLayout.type, !!rowLayout.isEmergency)}
                        className={`aspect-square rounded-lg border text-[10px] font-mono font-bold flex items-center justify-center transition-all ${
                          isTaken 
                            ? "bg-white/5 border-white/5 text-platinum/20 cursor-not-allowed" 
                            : isSelected 
                              ? "bg-gold border-gold text-onyx shadow-[0_0_12px_rgba(212,175,55,0.7)]" 
                              : typeConfig.color
                        }`}
                      >
                        {seat}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            
            <div className="h-4" />
          </div>

          {/* Seat Legends */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 w-full border-t border-white/5 pt-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-amber-500/20 border border-amber-500/40" />
              <span className="text-[10px] font-mono text-platinum/60">First Class Suite</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-blue-600/20 border border-blue-400/40" />
              <span className="text-[10px] font-mono text-platinum/60">Business Flatbed</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-purple-600/20 border border-purple-400/40" />
              <span className="text-[10px] font-mono text-platinum/60">Premium Exit</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-white/10 border border-white/20" />
              <span className="text-[10px] font-mono text-platinum/60">Economy Cabin</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-white/5 border-white/5" />
              <span className="text-[10px] font-mono text-platinum/30">Occupied Seat</span>
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-8 rounded-3xl border border-gold/30 bg-gold/5 shadow-2xl relative">
            <h3 className="text-lg font-serif font-bold text-white mb-6">Reservation Details</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-platinum/60">Flight Identifier</span>
                <span className="text-white font-medium font-mono">{flightId}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-platinum/60">Airspace Corridor</span>
                <span className="text-white font-medium font-mono">{fromCode} → {toCode}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-platinum/60">Departure Date</span>
                <span className="text-white font-medium font-mono">{dateStr}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-platinum/60">Passenger count</span>
                <span className="text-white font-medium font-mono">{passengers} Seat(s)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-platinum/60">Position coordinate</span>
                <span className={`font-bold font-mono ${selectedSeat ? "text-gold" : "text-platinum/40"}`}>
                  {selectedSeat || "Select seat"}
                </span>
              </div>
              {selectedSeat && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-platinum/40 font-mono">Seat category</span>
                  <span className="text-white font-light">{seatLabel}</span>
                </div>
              )}
              <div className="w-full h-px bg-white/10 my-4" />
              <div className="flex justify-between items-end">
                <span className="text-platinum/80 text-sm">Total Settlement</span>
                <span className="text-3xl font-bold text-white font-serif">${totalPrice}</span>
              </div>
            </div>

            <button 
              onClick={handleConfirm}
              disabled={!selectedSeat}
              className="w-full py-4 rounded-xl bg-gold hover:bg-gold-light text-onyx font-bold text-lg hover:-translate-y-0.5 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Confirm & Pay <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          {selectedSeat && selectedSeat.startsWith("8") && (
            <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/5 text-xs text-red-300 flex items-start gap-3 leading-relaxed">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Emergency Exit Row Agreement:</span> By booking seat {selectedSeat}, you confirm you are willing and able to assist flight crew during an evacuation procedure.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SeatSelection() {
  return (
    <main className="relative min-h-screen bg-onyx flex flex-col selection:bg-gold/30">
      <GlassNavbar />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#020202] via-onyx to-[#020202] pointer-events-none" />
      <Suspense fallback={<div className="flex-grow flex items-center justify-center text-white pt-32">Configuring seat charts...</div>}>
        <SeatsContent />
      </Suspense>
    </main>
  );
}
