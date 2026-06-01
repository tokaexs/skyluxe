"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, CreditCard, Lock, Zap, CheckCircle, QrCode, Plane, Star } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSkyLuxeStore, FlightBooking } from "@/store/skyluxeStore";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const type = searchParams.get("type") || "private";
  const itemId = searchParams.get("id") || "gulfstream-g700";
  const seat = searchParams.get("seat") || "";
  const queryPrice = Number(searchParams.get("price")) || 51500;
  const fromCode = searchParams.get("from") || "BOM";
  const toCode = searchParams.get("to") || "DWC";
  const dateStr = searchParams.get("date") || "2026-06-04";
  const catering = searchParams.get("catering") || "Standard VIP Catering";
  const chauffeur = searchParams.get("chauffeur") || "No Transport Required";
  const security = searchParams.get("security") || "Standard Terminal Security";
  const passengers = Number(searchParams.get("passengers")) || 3;
  
  let legsList = [];
  try {
    const rawLegs = searchParams.get("legs");
    if (rawLegs) {
      legsList = JSON.parse(decodeURIComponent(rawLegs));
    }
  } catch (e) {
    legsList = [{ from: fromCode, to: toCode, date: dateStr }];
  }

  const { walletBalance, chargeWallet, addCoins, bookFlight } = useSkyLuxeStore();
  const [checkoutState, setCheckoutState] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [generatedTicket, setGeneratedTicket] = useState<FlightBooking | null>(null);
  const [coinsEarned, setCoinsEarned] = useState(0);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutState("processing");
    
    try {
      // 1. Check wallet funds
      if (walletBalance < queryPrice) {
        setCheckoutState("error");
        setErrorMessage("Insufficient funds in your FBO aviation wallet. Please top-up via your dashboard.");
        return;
      }

      // 2. Charge wallet / Create booking
      let description = "";
      let coins = Math.max(10, Math.floor(queryPrice * 0.01));
      
      if (type === "private") {
        description = `Private Jet Charter: ${itemId.toUpperCase()} (${legsList.length} Leg(s))`;
      } else if (type === "commercial") {
        description = `Commercial Flight: ${itemId.toUpperCase()} (Seat ${seat})`;
      } else if (type === "membership") {
        description = `Membership Elite Tier: ${itemId.toUpperCase()}`;
      }

      setCoinsEarned(coins);

      if (type === "membership") {
        const chargeSuccess = await chargeWallet(queryPrice, description);
        if (!chargeSuccess) {
          setCheckoutState("error");
          setErrorMessage("Transaction authorization failed. Contact ground logistics.");
          return;
        }
      } else {
        const flightInput = {
          type: type as "commercial" | "private",
          airline: type === "commercial" 
            ? (itemId.startsWith("AI") ? "Air India" : itemId.startsWith("6E") ? "IndiGo" : itemId.startsWith("EK") ? "Emirates" : itemId.startsWith("QP") ? "Akasa Air" : "Vistara") 
            : undefined,
          logo: type === "commercial"
            ? (itemId.startsWith("AI") ? "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Air_India_Logo.svg/120px-Air_India_Logo.svg.png" : itemId.startsWith("6E") ? "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IndiGo_Airlines_logo.svg/120px-IndiGo_Airlines_logo.svg.png" : itemId.startsWith("EK") ? "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/150px-Emirates_logo.svg.png" : itemId.startsWith("QP") ? "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Akasa_Air_logo.svg/120px-Akasa_Air_logo.svg.png" : "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Vistara_Logo.svg/120px-Vistara_Logo.svg.png")
            : undefined,
          aircraft: type === "commercial" 
            ? (itemId.includes("350") ? "Airbus A350-900" : itemId.includes("787") ? "Boeing 787-9 Dreamliner" : itemId.includes("777") ? "Boeing 777-300ER" : itemId.includes("321") ? "Airbus A321neo" : "Boeing 737 MAX 8") 
            : itemId.toUpperCase(),
          departure: { time: "09:00", code: fromCode, city: fromCode === "BOM" ? "Mumbai" : fromCode },
          arrival: { time: "11:30", code: toCode, city: toCode === "DWC" ? "Dubai Al Maktoum" : toCode === "DXB" ? "Dubai" : toCode },
          duration: type === "commercial" ? "3h 30m" : `${legsList.length * 3.5}h`,
          seatNumber: type === "commercial" ? seat : undefined,
          passengers,
          cost: queryPrice,
          date: dateStr,
          catering,
          chauffeur,
          security,
          legs: type === "private" ? legsList : undefined
        };
        const booked = await bookFlight(flightInput);
        setGeneratedTicket(booked);
      }

      setCheckoutState("success");
    } catch (err: any) {
      setCheckoutState("error");
      setErrorMessage(err.message || "An unexpected error occurred during authorization.");
    }
  };

  return (
    <>
      <AnimatePresence>
        {checkoutState === "idle" && (
          <Link href={type === "commercial" ? "/commercial" : "/fleet"} className="absolute top-8 left-8 z-50 flex items-center gap-2 text-platinum/50 hover:text-white transition-colors text-sm font-light">
            <ArrowLeft className="w-4 h-4" /> Cancel Booking
          </Link>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {checkoutState === "idle" ? (
          <motion.div 
            key="checkout-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full flex flex-col md:flex-row absolute inset-0 z-10"
          >
            {/* Left Panel: Invoice Details */}
            <div className="w-full md:w-5/12 p-8 md:p-16 flex flex-col justify-center border-r border-white/5 bg-onyx/40 backdrop-blur-3xl h-full">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/30 bg-gold/5 backdrop-blur-md mb-8">
                  <Lock className="w-4 h-4 text-gold" />
                  <span className="text-gold text-xs font-semibold tracking-wider uppercase">Secure Gateway</span>
                </div>
                
                {type === "private" && (
                  <>
                    <h1 className="text-4xl font-serif font-bold text-white mb-2">{itemId.toUpperCase().replace("-", " ")}</h1>
                    <p className="text-platinum/50 font-light mb-12">{legsList[0]?.from} — {legsList[legsList.length - 1]?.to} ({legsList.length} leg(s))</p>

                    <div className="space-y-6 border-b border-white/10 pb-8 mb-8">
                      <div className="flex justify-between items-center text-platinum/80 font-light text-sm">
                        <span>Charter rate ({legsList.length * 3.5} Flight Hours)</span>
                        <span className="text-white">${(queryPrice - (catering.includes("Standard") ? 0 : 1500) - (chauffeur.includes("No") ? 0 : 800) - (security.includes("Standard") ? 0 : 1200)).toLocaleString()}</span>
                      </div>
                      {!catering.includes("Standard") && (
                        <div className="flex justify-between items-center text-platinum/80 font-light text-sm">
                          <span>{catering}</span>
                          <span className="text-white">$1,500</span>
                        </div>
                      )}
                      {!chauffeur.includes("No") && (
                        <div className="flex justify-between items-center text-platinum/80 font-light text-sm">
                          <span>{chauffeur}</span>
                          <span className="text-white">$800</span>
                        </div>
                      )}
                      {!security.includes("Standard") && (
                        <div className="flex justify-between items-center text-platinum/80 font-light text-sm">
                          <span>{security}</span>
                          <span className="text-white">$1,200</span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {type === "commercial" && (
                  <>
                    <h1 className="text-4xl font-serif font-bold text-white mb-2">{itemId.toUpperCase()} Commercial</h1>
                    <p className="text-platinum/50 font-light mb-12">{fromCode} — {toCode} (Seat {seat})</p>

                    <div className="space-y-6 border-b border-white/10 pb-8 mb-8">
                      <div className="flex justify-between items-center text-platinum/80 font-light text-sm">
                        <span>Scheduled Ticket Base Price</span>
                        <span className="text-white">${(queryPrice - (seat.startsWith("1") ? 150 : seat.startsWith("4") || seat.startsWith("5") || seat.startsWith("6") ? 80 : 0))}</span>
                      </div>
                      {seat.startsWith("1") && (
                        <div className="flex justify-between items-center text-platinum/80 font-light text-sm">
                          <span>First Class Suite Allocation</span>
                          <span className="text-white">$150</span>
                        </div>
                      )}
                      {(seat.startsWith("4") || seat.startsWith("5") || seat.startsWith("6")) && (
                        <div className="flex justify-between items-center text-platinum/80 font-light text-sm">
                          <span>Business Flatbed Surcharge</span>
                          <span className="text-white">$80</span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {type === "membership" && (
                  <>
                    <h1 className="text-4xl font-serif font-bold text-white mb-2">{itemId.toUpperCase()} Membership</h1>
                    <p className="text-platinum/50 font-light mb-12">Yearly Aviation Subscription</p>

                    <div className="space-y-6 border-b border-white/10 pb-8 mb-8">
                      <div className="flex justify-between items-center text-platinum/80 font-light text-sm">
                        <span>Elite Access & Hourly Cost Caps</span>
                        <span className="text-white">${queryPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-platinum/50 uppercase tracking-widest mb-1 font-mono">Total Billed</p>
                    <h2 className="text-5xl font-bold text-white tracking-tight">${queryPrice.toLocaleString()}</h2>
                  </div>
                  <p className="text-gold text-sm font-medium">USD</p>
                </div>
              </motion.div>
            </div>

            {/* Right Panel: Payments */}
            <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center items-center h-full">
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full max-w-lg"
              >
                {/* Credit Card graphic */}
                <div className="w-full aspect-[1.586] rounded-3xl mb-10 relative overflow-hidden p-8 flex flex-col justify-between shadow-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620121478247-ec786b9be2fa?q=80&w=1000&auto=format&fit=crop')] opacity-20 mix-blend-overlay" />
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gold/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
                  
                  <div className="relative z-10 flex justify-between items-start">
                    <Zap className="w-8 h-8 text-gold" />
                    <div className="flex gap-2">
                      <span className="w-8 h-8 rounded-full bg-red-500/80 mix-blend-screen" />
                      <span className="w-8 h-8 rounded-full bg-yellow-500/80 mix-blend-screen -ml-4" />
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <p className="text-white/60 font-mono text-sm mb-2 tracking-[0.2em]">•••• •••• •••• 4242</p>
                    <div className="flex justify-between items-end">
                      <p className="text-white font-medium uppercase tracking-widest text-sm">Eashan Sterling</p>
                      <p className="text-white/60 font-mono text-sm">12/28</p>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={handlePayment}>
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" className="py-4 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-platinum transition-colors">
                      Pay with <span className="font-serif">Apple Pay</span>
                    </button>
                    <button type="button" className="py-4 rounded-xl bg-[#000000] border border-white/20 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
                      Wire Transfer
                    </button>
                  </div>

                  <div className="relative flex items-center py-4">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink-0 mx-4 text-platinum/40 text-xs uppercase tracking-widest font-mono">Secure Settlement</span>
                    <div className="flex-grow border-t border-white/10"></div>
                  </div>

                  <div className="bg-white/5 p-5 rounded-2xl border border-white/10 flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium text-sm">Corporate Flight Wallet</p>
                      <p className="text-platinum/50 text-xs mt-1">Available balance: ${walletBalance.toLocaleString()}</p>
                    </div>
                    <span className="text-gold font-bold text-lg">${queryPrice.toLocaleString()}</span>
                  </div>

                  <button type="submit" className="w-full py-5 rounded-xl bg-gold hover:bg-gold-light text-onyx font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 group mt-8">
                    <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Authorize Settlement
                  </button>
                  
                  <p className="text-center text-platinum/40 text-xs font-light flex items-center justify-center gap-2 mt-4 font-mono">
                    <ShieldCheck className="w-4 h-4 text-gold/50" /> End-to-end military grade secure connection.
                  </p>
                </form>
              </motion.div>
            </div>
          </motion.div>
        ) : checkoutState === "processing" ? (
          <motion.div 
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-onyx flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 border-4 border-white/10 border-t-gold rounded-full animate-spin mb-6" />
            <h2 className="text-2xl font-serif text-white mb-2">Processing Secure Settlement</h2>
            <p className="text-platinum/50 font-light">Updating private ledger networks...</p>
          </motion.div>
        ) : checkoutState === "error" ? (
          <motion.div 
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-50 bg-onyx flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-16 h-16 bg-red-500/20 border border-red-500/50 rounded-full flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-serif text-white mb-2">Payment Authorization Rejected</h2>
            <p className="text-platinum/60 max-w-md mb-8">{errorMessage}</p>
            <button onClick={() => setCheckoutState("idle")} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all">
              Try Alternative Method
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 bg-[#020202] flex flex-col items-center justify-center p-6 overflow-y-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-gold/10 to-transparent pointer-events-none" />
            
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.4, duration: 1 }}
              className="relative z-10 w-full max-w-md my-8"
            >
              <div className="text-center mb-8">
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}
                  className="w-20 h-20 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </motion.div>
                <h1 className="text-4xl font-serif font-bold text-white mb-2">Settlement Confirmed</h1>
                <p className="text-platinum/60 text-sm">Your flight profile has been secured.</p>
              </div>

              {type !== "membership" && generatedTicket && (
                /* Digital Boarding Pass */
                <div className="glass-panel rounded-3xl border border-white/10 bg-onyx/80 backdrop-blur-xl overflow-hidden shadow-2xl relative mb-6">
                  {/* Tear line */}
                  <div className="absolute top-[65%] left-0 right-0 border-t-2 border-dashed border-white/10" />
                  <div className="absolute top-[65%] -left-3 w-6 h-6 bg-[#020202] rounded-full -translate-y-1/2" />
                  <div className="absolute top-[65%] -right-3 w-6 h-6 bg-[#020202] rounded-full -translate-y-1/2" />
                  
                  <div className="p-8 pb-10">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-gold text-xs font-bold uppercase tracking-widest font-mono">
                        {type === "private" ? "SkyLuxe Private" : `${generatedTicket.airline} Scheduled`}
                      </span>
                      <span className="text-white/40 text-xs font-mono">PNR: {generatedTicket.id}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <p className="text-4xl font-serif text-white font-bold">{generatedTicket.departure.code}</p>
                        <p className="text-platinum/50 text-xs mt-1">{generatedTicket.departure.city}</p>
                      </div>
                      <div className="flex-1 flex flex-col items-center px-4">
                        <p className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1 font-mono">{generatedTicket.duration}</p>
                        <div className="w-full border-t border-dashed border-gold/50 relative">
                          <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-serif text-white font-bold">{generatedTicket.arrival.code}</p>
                        <p className="text-platinum/50 text-xs mt-1">{generatedTicket.arrival.city}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1 font-mono">Terminal</p>
                        <p className="text-white font-medium text-sm">{generatedTicket.terminal}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1 font-mono">Position</p>
                        <p className="text-white font-medium text-sm">{type === "commercial" ? `Seat ${generatedTicket.seatNumber}` : "Charter"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1 font-mono">Gate</p>
                        <p className="text-white font-medium text-sm text-gold">{generatedTicket.gate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 pt-10 flex items-center justify-between bg-white/5 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-lg">
                        <QrCode className="w-12 h-12 text-black" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white mb-0.5">Passenger</p>
                        <p className="text-xs text-platinum/50 font-mono">Eashan Sterling</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {type === "membership" && (
                /* Membership Card */
                <div className="glass-panel rounded-3xl border border-gold/30 bg-gold/5 p-8 relative overflow-hidden shadow-2xl mb-6">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/20 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/4" />
                  <span className="text-gold text-xs font-mono uppercase tracking-[0.2em] mb-4 block">SkyLuxe Sovereignty</span>
                  <h3 className="text-2xl font-serif font-bold text-white mb-6">{itemId.toUpperCase()} ACCESS</h3>
                  <div className="space-y-4 font-light text-sm text-platinum/80">
                    <p className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-gold" /> Guaranteed private availability</p>
                    <p className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-gold" /> Autopay settlement configuration active</p>
                  </div>
                </div>
              )}

              {/* Loyalty Update */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className="mt-4 p-4 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-gold" />
                  <span className="text-sm text-gold font-medium">SkyCoins Earned</span>
                </div>
                <span className="text-white font-bold">+{coinsEarned} Coins</span>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-8">
                <Link href="/dashboard" className="block w-full">
                  <button className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors">
                    Access Executive Dashboard
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Checkout() {
  return (
    <main className="relative min-h-screen bg-[#020202] flex flex-col md:flex-row overflow-hidden selection:bg-gold/30">
      <div className="absolute inset-0 pointer-events-none z-0 flex">
        <div className="w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity" />
        <div className="w-1/2 h-full bg-gradient-to-l from-onyx via-onyx to-transparent" />
      </div>
      <Suspense fallback={<div className="flex-grow flex items-center justify-center text-white">Loading secure payment gate...</div>}>
        <CheckoutContent />
      </Suspense>
    </main>
  );
}
