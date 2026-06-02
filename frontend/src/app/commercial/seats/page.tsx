"use client";

import { motion } from "framer-motion";
import GlassNavbar from "@/components/ui/GlassNavbar";
import { ArrowRight, Check, Compass, Users } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useSkyLuxeStore } from "@/store/skyluxeStore";

const seatTypes = {
  first: { label: "First Class Suite", surcharge: 150, color: "bg-gold border-gold/40 text-onyx" },
  business: { label: "Business Flatbed", surcharge: 80, color: "bg-blue-600 border-blue-400 text-white" },
  economy: { label: "Premium Economy", surcharge: 0, color: "bg-white/10 border-white/20 text-white hover:bg-white/20" }
};

const cabinLayout = [
  // First Class
  { row: 1, seats: ["1A", "1B", "1E", "1F"], type: "first" },
  { row: 2, seats: ["2A", "2B", "2E", "2F"], type: "first" },
  // Business Class
  { row: 4, seats: ["4A", "4B", "4D", "4E", "4F", "4J"], type: "business" },
  { row: 5, seats: ["5A", "5B", "5D", "5E", "5F", "5J"], type: "business" },
  { row: 6, seats: ["6A", "6B", "6D", "6E", "6F", "6J"], type: "business" },
  // Economy
  { row: 8, seats: ["8A", "8B", "8C", "8D", "8E", "8F"], type: "economy" },
  { row: 9, seats: ["9A", "9B", "9C", "9D", "9E", "9F"], type: "economy" },
  { row: 10, seats: ["10A", "10B", "10C", "10D", "10E", "10F"], type: "economy" },
];

const takenSeats = ["1B", "4E", "5A", "9C", "10F"];

function SeatsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currency, formatAmount } = useSkyLuxeStore();
  const flightId = searchParams.get("flightId") || "AI-101";
  const fromCode = searchParams.get("from") || "BOM";
  const toCode = searchParams.get("to") || "DXB";
  const dateStr = searchParams.get("date") || "2026-06-04";

  const basePrice = flightId === "EK-505" ? 780 : flightId === "UK-202" ? 420 : flightId === "AI-101" ? 350 : 180;
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [surcharge, setSurcharge] = useState(0);

  const handleSeatClick = (seatCode: string, type: string) => {
    if (takenSeats.includes(seatCode)) return;
    setSelectedSeat(seatCode);
    // @ts-ignore
    setSurcharge(seatTypes[type].surcharge);
  };

  const totalPrice = basePrice + surcharge;

  const handleConfirm = () => {
    if (!selectedSeat) return;
    router.push(`/checkout?type=commercial&id=${flightId}&seat=${selectedSeat}&price=${totalPrice}&from=${fromCode}&to=${toCode}&date=${dateStr}`);
  };

  return (
    <div className="relative z-10 flex-1 flex flex-col pt-32 pb-12 px-6 lg:px-16 max-w-6xl mx-auto w-full">
      <Link href={`/commercial/details?flightId=${flightId}&from=${fromCode}&to=${toCode}&date=${dateStr}`} className="text-platinum/50 hover:text-white transition-colors text-xs font-mono uppercase mb-8 flex items-center gap-2">
        ← Back to Flight Logistics
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Seating map card */}
        <div className="lg:col-span-8 glass-panel p-8 rounded-3xl border border-white/10 flex flex-col items-center">
          <h2 className="text-xl font-serif font-bold text-white mb-2">Interactive Cabin Configuration</h2>
          <p className="text-platinum/50 text-xs mb-8">Tap an available suite or flatbed to assign your position.</p>
          
          {/* Seating map layout container */}
          <div className="w-full max-w-sm border border-white/10 bg-black/40 rounded-3xl p-6 relative overflow-hidden flex flex-col gap-6">
            <div className="absolute top-0 left-0 right-0 h-4 bg-white/5 border-b border-white/10 text-[8px] tracking-widest text-center text-platinum/30 pt-1 font-mono uppercase">Cockpit / Flight Deck</div>
            
            <div className="h-4" /> {/* spacing */}

            {cabinLayout.map((rowLayout) => (
              <div key={rowLayout.row} className="flex justify-between gap-4 items-center">
                <span className="text-[10px] font-mono text-platinum/30 w-4">{rowLayout.row}</span>
                
                <div className="flex-1 grid grid-cols-6 gap-2">
                  {rowLayout.seats.map((seat) => {
                    const isTaken = takenSeats.includes(seat);
                    const isSelected = selectedSeat === seat;
                    // @ts-ignore
                    const typeConfig = seatTypes[rowLayout.type];
                    
                    return (
                      <button
                        key={seat}
                        disabled={isTaken}
                        onClick={() => handleSeatClick(seat, rowLayout.type)}
                        className={`aspect-square rounded-lg border text-[9px] font-mono font-bold flex items-center justify-center transition-all ${
                          isTaken 
                            ? "bg-white/5 border-white/5 text-platinum/20 cursor-not-allowed" 
                            : isSelected 
                              ? "bg-gold border-gold text-onyx shadow-[0_0_12px_rgba(212,175,55,0.6)]" 
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
          </div>

          {/* Seat Legends */}
          <div className="flex gap-6 mt-8 flex-wrap justify-center">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-gold border border-gold/30" />
              <span className="text-xs text-platinum/70">First Class Suite (+{formatAmount(150)})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-blue-600 border border-blue-400" />
              <span className="text-xs text-platinum/70">Business Flatbed (+{formatAmount(80)})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-white/10 border border-white/20" />
              <span className="text-xs text-platinum/70">Premium Economy</span>
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-8 rounded-3xl border border-gold/30 bg-gold/5 shadow-2xl relative">
            <h3 className="text-lg font-serif font-bold text-white mb-6">Reservation Core</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-platinum/60">Flight</span>
                <span className="text-white font-medium">{flightId}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-platinum/60">Route</span>
                <span className="text-white font-medium">{fromCode} → {toCode}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-platinum/60">Date</span>
                <span className="text-white font-medium">{dateStr}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-platinum/60">Seat Selected</span>
                <span className={`font-bold ${selectedSeat ? "text-gold" : "text-platinum/40"}`}>
                  {selectedSeat || "None selected"}
                </span>
              </div>
              <div className="w-full h-px bg-white/10 my-4" />
              <div className="flex justify-between items-end">
                <span className="text-platinum/80 text-sm">Total Price</span>
                <span className="text-3xl font-bold text-white">{formatAmount(totalPrice)}</span>
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
        </div>
      </div>
    </div>
  );
}

export default function SeatSelection() {
  return (
    <main className="relative min-h-screen bg-onyx flex flex-col">
      <GlassNavbar />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#020202] via-onyx to-[#020202] pointer-events-none" />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-white pt-32">Configuring seat charts...</div>}>
        <SeatsContent />
      </Suspense>
    </main>
  );
}
