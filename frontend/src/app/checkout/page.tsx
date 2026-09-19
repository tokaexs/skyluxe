"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, CreditCard, Lock, Zap, CheckCircle, QrCode, Plane, Star } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSkyLuxeStore, FlightBooking } from "@/store/skyluxeStore";
import { useUser } from "@clerk/nextjs";
import { api } from "@/lib/api";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

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
  const seatRow = seat ? parseInt(seat.match(/^(\d+)/)?.[1] || "0") : 0;

  let legsList = [];
  try {
    const rawLegs = searchParams.get("legs");
    if (rawLegs) {
      legsList = JSON.parse(decodeURIComponent(rawLegs));
    }
  } catch (e) {
    legsList = [{ from: fromCode, to: toCode, date: dateStr }];
  }

  const { walletBalance, chargeWallet, addCoins, bookFlight, fetchInitialData, profile, currency, setCurrency, formatAmount } = useSkyLuxeStore();
  const [checkoutState, setCheckoutState] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [generatedTicket, setGeneratedTicket] = useState<FlightBooking | null>(null);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [logoError, setLogoError] = useState(false);
  const [paymentOption, setPaymentOption] = useState<"wallet" | "gateway">("wallet");

  useEffect(() => {
    if (generatedTicket) {
      setLogoError(!generatedTicket.logo);
    }
  }, [generatedTicket]);

  const getTicketInitials = () => {
    if (!generatedTicket) return "SL";
    const name = generatedTicket.airline || "SkyLuxe Private";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const handleDownloadPDF = () => {
    if (!generatedTicket || !generatedTicket.bookingDbId) return;
    window.open(`http://localhost:5000/api/v1/bookings/${generatedTicket.bookingDbId}/boarding-pass/download`, "_blank");
  };

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutState("processing");

    try {
      if (!profile || !profile.id) {
        setCheckoutState("error");
        setErrorMessage("User profile is not loaded yet. Please wait or log in again.");
        return;
      }

      if (paymentOption === "wallet") {
        if (walletBalance < queryPrice) {
          setCheckoutState("error");
          setErrorMessage(`Insufficient FBO Wallet funds. Required: ${formatAmount(queryPrice)}, Balance: ${formatAmount(walletBalance)}`);
          return;
        }

        const endpoint = type === "commercial" ? "/bookings" : "/bookings/charter";
        const payload = type === "commercial" ? {
          flight_id: itemId,
          total_amount: queryPrice,
          seat_number: seat,
          class: seatRow > 0 && seatRow <= 3 ? "first" : seatRow >= 4 && seatRow <= 7 ? "business" : "economy",
          passengers: [{
            firstName: user?.firstName || profile?.name?.split(" ")[0] || "SkyLuxe",
            lastName: user?.lastName || profile?.name?.split(" ").slice(1).join(" ") || "Member",
            age: 35,
            passportNumber: "US892347234",
            nationality: "United States"
          }]
        } : {
          aircraft_id: itemId,
          legs: legsList,
          catering,
          chauffeur,
          security,
          price: queryPrice
        };

        const bookingData = await api.post<any>(`${endpoint}?user_id=${profile.id}`, payload);
        if (bookingData) {
          const mapped: FlightBooking = {
            id: bookingData._id.substring(0, 8).toUpperCase(),
            type: bookingData.type as "commercial" | "private",
            airline: bookingData.type === "commercial"
              ? (bookingData.flight?.airline?.airlineName || "Air India")
              : "SkyLuxe Private",
            logo: bookingData.type === "commercial"
              ? bookingData.flight?.airline?.logoUrl
              : undefined,
            brandColor: bookingData.flight?.airline?.brandColor || "#D4AF37",
            iataCode: bookingData.flight?.airline?.iataCode || "AI",
            pnr: bookingData.bookingReference,
            passengerName: (bookingData.passengers?.[0]?.firstName 
              ? `${bookingData.passengers[0].firstName} ${bookingData.passengers[0].lastName || ""}`
              : (user?.fullName || profile?.name || "SKYLUXE MEMBER")).toUpperCase(),
            fareClass: bookingData.class ? bookingData.class.toUpperCase() : "FIRST CLASS",
            boardingGroup: bookingData.class?.toLowerCase().includes("first") ? "GROUP A" : bookingData.class?.toLowerCase().includes("business") ? "GROUP B" : "GROUP C",
            bookingDbId: bookingData._id,
            aircraft: bookingData.type === "commercial"
              ? (bookingData.flight?.aircraft || "Airbus A350-900")
              : (bookingData.aircraftModel || "Gulfstream G700"),
            departure: { time: "09:00", code: fromCode, city: fromCode === "BOM" ? "Mumbai" : fromCode },
            arrival: { time: "11:30", code: toCode, city: toCode === "DWC" ? "Dubai Al Maktoum" : toCode === "DXB" ? "Dubai" : toCode },
            duration: bookingData.type === "commercial" ? "3h 30m" : `${legsList.length * 3.5}h`,
            seatNumber: bookingData.type === "commercial" ? seat : undefined,
            passengers: passengers,
            cost: queryPrice,
            status: bookingData.status || "Confirmed",
            date: dateStr,
            catering: bookingData.catering,
            chauffeur: bookingData.chauffeur,
            security: bookingData.security,
            legs: legsList,
            boardingTime: bookingData.boardingPass?.boardingTime || "08:15",
            gate: bookingData.boardingPass?.gate || "B3",
            terminal: bookingData.boardingPass?.terminal || "Terminal 3"
          };
          setGeneratedTicket(mapped);
          const coins = Math.max(10, Math.floor(queryPrice * 0.01));
          setCoinsEarned(coins);
          await fetchInitialData();
          setCheckoutState("success");
        }
        return;
      }

      // 1. Create order on backend
      const orderRes = await api.post<any>("/payments/create-order", {
        amount: queryPrice,
        type: type,
        itemId: itemId,
        userId: profile.id
      });

      const { orderId, amount, currency, keyId } = orderRes;

      const coins = Math.max(10, Math.floor(queryPrice * 0.01));
      setCoinsEarned(coins);

      const bookingDetails = {
        itemId,
        class: type === "commercial" ? (seatRow > 0 && seatRow <= 3 ? "first" : seatRow >= 4 && seatRow <= 7 ? "business" : "economy") : undefined,
        seat: type === "commercial" ? seat : undefined,
        legs: type === "private" ? legsList : undefined,
        catering: type === "private" ? catering : undefined,
        chauffeur: type === "private" ? chauffeur : undefined,
        security: type === "private" ? security : undefined
      };

      const handleVerification = async (verifyPayload: any) => {
        setCheckoutState("processing");
        try {
          const verifyRes = await api.post<any>("/payments/verify", verifyPayload);
          if (verifyRes.success) {
            if (verifyRes.bookingId) {
              try {
                const bookingData = await api.get<any>(`/bookings/${verifyRes.bookingId}`);
                if (bookingData) {
                  const mapped: FlightBooking = {
                    id: bookingData._id.substring(0, 8).toUpperCase(),
                    type: bookingData.type as "commercial" | "private",
                    airline: bookingData.type === "commercial"
                      ? (bookingData.flight?.airline?.airlineName || "Air India")
                      : "SkyLuxe Private",
                    logo: bookingData.type === "commercial"
                      ? bookingData.flight?.airline?.logoUrl
                      : undefined,
                    brandColor: bookingData.flight?.airline?.brandColor || "#D4AF37",
                    iataCode: bookingData.flight?.airline?.iataCode || "AI",
                    pnr: bookingData.bookingReference,
                    passengerName: (bookingData.passengers?.[0]?.firstName 
                      ? `${bookingData.passengers[0].firstName} ${bookingData.passengers[0].lastName || ""}`
                      : (user?.fullName || profile?.name || "SKYLUXE MEMBER")).toUpperCase(),
                    fareClass: bookingData.class ? bookingData.class.toUpperCase() : "FIRST CLASS",
                    boardingGroup: bookingData.class?.toLowerCase().includes("first") ? "GROUP A" : bookingData.class?.toLowerCase().includes("business") ? "GROUP B" : "GROUP C",
                    bookingDbId: bookingData._id,
                    aircraft: bookingData.type === "commercial"
                      ? (bookingData.flight?.aircraft || "Airbus A350-900")
                      : (bookingData.aircraftModel || "Gulfstream G700"),
                    departure: { time: "09:00", code: fromCode, city: fromCode === "BOM" ? "Mumbai" : fromCode },
                    arrival: { time: "11:30", code: toCode, city: toCode === "DWC" ? "Dubai Al Maktoum" : toCode === "DXB" ? "Dubai" : toCode },
                    duration: bookingData.type === "commercial" ? "3h 30m" : `${legsList.length * 3.5}h`,
                    seatNumber: bookingData.type === "commercial" ? seat : undefined,
                    passengers: passengers,
                    cost: queryPrice,
                    status: bookingData.status || "Confirmed",
                    date: dateStr,
                    catering: bookingData.catering,
                    chauffeur: bookingData.chauffeur,
                    security: bookingData.security,
                    legs: legsList,
                    boardingTime: bookingData.boardingPass?.boardingTime || "08:15",
                    gate: bookingData.boardingPass?.gate || "B3",
                    terminal: bookingData.boardingPass?.terminal || "Terminal 3"
                  };
                  setGeneratedTicket(mapped);
                }
              } catch (err) {
                console.error("Failed to fetch booking details for pass:", err);
                setGeneratedTicket({
                  id: verifyRes.bookingId.substring(0, 8).toUpperCase(),
                  type: type as "commercial" | "private",
                  aircraft: itemId.toUpperCase(),
                  departure: { time: "09:00", code: fromCode, city: fromCode === "BOM" ? "Mumbai" : fromCode },
                  arrival: { time: "11:30", code: toCode, city: toCode === "DWC" ? "Dubai Al Maktoum" : toCode },
                  duration: type === "commercial" ? "3h 30m" : `${legsList.length * 3.5}h`,
                  seatNumber: type === "commercial" ? seat : undefined,
                  passengers,
                  cost: queryPrice,
                  status: "Confirmed",
                  date: dateStr,
                  legs: type === "private" ? legsList : undefined,
                  brandColor: "#D4AF37",
                  pnr: `SKL${verifyRes.bookingId.substring(0, 6)}`,
                  passengerName: (user?.fullName || profile?.name || "SKYLUXE MEMBER").toUpperCase(),
                  fareClass: "FIRST CLASS",
                  boardingGroup: "GROUP A",
                  bookingDbId: verifyRes.bookingId
                });
              }
            }
            await fetchInitialData();
            setCheckoutState("success");
          } else {
            setCheckoutState("error");
            setErrorMessage(verifyRes.message || "Payment verification failed.");
          }
        } catch (err: any) {
          setCheckoutState("error");
          setErrorMessage(err.message || "Payment signature verification failed.");
        }
      };

      // 2. Sandbox bypass check
      if (orderId.startsWith("order_mock_")) {
        await handleVerification({
          razorpay_order_id: orderId,
          razorpay_payment_id: `pay_mock_${Date.now().toString().slice(-6)}`,
          razorpay_signature: "sandbox_signature_bypass",
          bookingDetails
        });
        return;
      }

      // 3. Load script & launch Razorpay Checkout Modal
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setCheckoutState("error");
        setErrorMessage("Failed to load Razorpay payment gateway script. Check your internet connection.");
        return;
      }

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "SkyLuxe Aviation",
        description: `Secure Settlement - ${type.toUpperCase()}`,
        order_id: orderId,
        handler: async function (response: any) {
          await handleVerification({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            bookingDetails
          });
        },
        prefill: {
          name: profile.name,
          email: profile.email,
          contact: profile.phone
        },
        theme: {
          color: "#D4AF37"
        },
        modal: {
          ondismiss: function () {
            setCheckoutState("idle");
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      setCheckoutState("error");
      setErrorMessage(err.message || "An unexpected error occurred during authorization.");
    }
  };

  return (
    <>
      <AnimatePresence>
        {checkoutState === "idle" && (
          <Link href={type === "commercial" ? "/commercial" : "/fleet"} className="absolute top-6 sm:top-8 left-6 sm:left-8 z-50 flex items-center gap-2 text-platinum/50 hover:text-white transition-colors text-xs sm:text-sm font-light">
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
            className="w-full min-h-screen flex flex-col md:flex-row relative z-10 pt-16 md:pt-0"
          >
            {/* Left Panel: Invoice Details */}
            <div className="w-full md:w-5/12 p-6 sm:p-8 md:p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5 bg-onyx/40 backdrop-blur-3xl">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/30 bg-gold/5 backdrop-blur-md mb-6 sm:mb-8">
                  <Lock className="w-4 h-4 text-gold" />
                  <span className="text-gold text-xs font-semibold tracking-wider uppercase">Secure Gateway</span>
                </div>

                {type === "private" && (
                  <>
                    <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-2">{itemId.toUpperCase().replace("-", " ")}</h1>
                    <p className="text-platinum/50 font-light mb-8 sm:mb-12">{legsList[0]?.from} — {legsList[legsList.length - 1]?.to} ({legsList.length} leg(s))</p>

                    <div className="space-y-4 sm:space-y-6 border-b border-white/10 pb-6 sm:pb-8 mb-6 sm:mb-8">
                      <div className="flex justify-between items-center text-platinum/80 font-light text-xs sm:text-sm">
                        <span>Charter rate ({legsList.length * 3.5} Flight Hours)</span>
                        <span className="text-white font-mono">{formatAmount(queryPrice - (catering.includes("Michelin") ? 1500 : catering.includes("Caviar") ? 3000 : 0) - (chauffeur.includes("Maybach") ? 800 : chauffeur.includes("Helicopter") ? 2500 : 0) - (security.includes("Executive") ? 1200 : 0))}</span>
                      </div>
                      {!catering.includes("Standard") && (
                        <div className="flex justify-between items-center text-platinum/80 font-light text-xs sm:text-sm">
                          <span>{catering}</span>
                          <span className="text-white font-mono">{formatAmount(catering.includes("Michelin") ? 1500 : 3000)}</span>
                        </div>
                      )}
                      {!chauffeur.includes("No") && (
                        <div className="flex justify-between items-center text-platinum/80 font-light text-xs sm:text-sm">
                          <span>{chauffeur}</span>
                          <span className="text-white font-mono">{formatAmount(chauffeur.includes("Maybach") ? 800 : 2500)}</span>
                        </div>
                      )}
                      {!security.includes("Standard") && (
                        <div className="flex justify-between items-center text-platinum/80 font-light text-xs sm:text-sm">
                          <span>{security}</span>
                          <span className="text-white font-mono">{formatAmount(1200)}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {type === "commercial" && (
                  <>
                    <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-2">{itemId.toUpperCase()} Commercial</h1>
                    <p className="text-platinum/50 font-light mb-8 sm:mb-12">{fromCode} — {toCode} (Seat {seat})</p>

                    <div className="space-y-4 sm:space-y-6 border-b border-white/10 pb-6 sm:pb-8 mb-6 sm:mb-8">
                      <div className="flex justify-between items-center text-platinum/80 font-light text-xs sm:text-sm">
                        <span>Scheduled Ticket Base Price</span>
                        <span className="text-white font-mono">{formatAmount(queryPrice - (seatRow > 0 && seatRow <= 3 ? 150 : seatRow >= 4 && seatRow <= 7 ? 80 : 0))}</span>
                      </div>
                      {seatRow > 0 && seatRow <= 3 && (
                        <div className="flex justify-between items-center text-platinum/80 font-light text-xs sm:text-sm">
                          <span>First Class Suite Allocation</span>
                          <span className="text-white font-mono">{formatAmount(150)}</span>
                        </div>
                      )}
                      {seatRow >= 4 && seatRow <= 7 && (
                        <div className="flex justify-between items-center text-platinum/80 font-light text-xs sm:text-sm">
                          <span>Business Flatbed Surcharge</span>
                          <span className="text-white font-mono">{formatAmount(80)}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {type === "membership" && (
                  <>
                    <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-2">{itemId.toUpperCase()} Membership</h1>
                    <p className="text-platinum/50 font-light mb-8 sm:mb-12">Yearly Aviation Subscription</p>

                    <div className="space-y-4 sm:space-y-6 border-b border-white/10 pb-6 sm:pb-8 mb-6 sm:mb-8">
                      <div className="flex justify-between items-center text-platinum/80 font-light text-xs sm:text-sm">
                        <span>Elite Access & Hourly Cost Caps</span>
                        <span className="text-white font-mono">{formatAmount(queryPrice)}</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-platinum/50 uppercase tracking-widest mb-1 font-mono">Total Billed</p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">{formatAmount(queryPrice)}</h2>
                  </div>
                  <p className="text-gold text-sm font-medium">{currency}</p>
                </div>
              </motion.div>
            </div>

            {/* Right Panel: Payments */}
            <div className="w-full md:w-7/12 p-6 sm:p-8 md:p-16 flex flex-col justify-center items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full max-w-lg"
              >
                {/* Credit Card graphic */}
                <div className="w-full aspect-[1.586] rounded-2xl sm:rounded-3xl mb-8 sm:mb-10 relative overflow-hidden p-5 sm:p-8 flex flex-col justify-between shadow-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl">
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
                      <p className="text-white font-medium uppercase tracking-widest text-sm">{user?.fullName || profile?.name || "SKYLUXE MEMBER"}</p>
                      <p className="text-white/60 font-mono text-sm">12/28</p>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={handlePayment}>
                  {/* Payment Option Tabs */}
                  <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl mb-6">
                    <button
                      type="button"
                      onClick={() => setPaymentOption("wallet")}
                      className={`flex-1 py-3 text-center text-xs font-medium rounded-lg transition-all ${paymentOption === "wallet"
                        ? "bg-gold text-onyx font-bold"
                        : "text-platinum/60 hover:text-white"
                        }`}
                    >
                      FBO Wallet Balance
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentOption("gateway")}
                      className={`flex-1 py-3 text-center text-xs font-medium rounded-lg transition-all ${paymentOption === "gateway"
                        ? "bg-gold text-onyx font-bold"
                        : "text-platinum/60 hover:text-white"
                        }`}
                    >
                      Razorpay Secure
                    </button>
                  </div>

                  {paymentOption === "wallet" ? (
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium text-sm">FBO Account Wallet</span>
                        <span className="text-gold text-[10px] uppercase font-mono tracking-wider font-semibold border border-gold/30 bg-gold/5 px-2 py-0.5 rounded">Corporate Ledger</span>
                      </div>
                      <p className="text-xs text-platinum/60 font-light leading-relaxed">
                        Settle this booking instantly using your accrued FBO wallet balance.
                      </p>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-xs text-platinum/60 font-light">Available Balance</span>
                        <span className="text-white font-mono font-medium">{formatAmount(walletBalance)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-xs text-platinum/60 font-light">Required Funds</span>
                        <span className="text-white font-mono font-medium">{formatAmount(queryPrice)}</span>
                      </div>
                      {walletBalance < queryPrice && (
                        <p className="text-red-400 text-xs mt-2 leading-relaxed bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                          Insufficient FBO Wallet funds. Please fund your wallet or select Razorpay Secure instead.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium text-sm">Payment Gateway</span>
                        <span className="text-gold text-[10px] uppercase font-mono tracking-wider font-semibold border border-gold/30 bg-gold/5 px-2 py-0.5 rounded">Razorpay Secure</span>
                      </div>
                      <p className="text-xs text-platinum/60 font-light leading-relaxed">
                        Instant settlement using UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and wallet integrations.
                      </p>
                      <div className="flex gap-2 items-center flex-wrap pt-2">
                        <span className="text-[10px] text-platinum/50 bg-white/5 border border-white/10 px-2 py-1 rounded">Google Pay</span>
                        <span className="text-[10px] text-platinum/50 bg-white/5 border border-white/10 px-2 py-1 rounded">PhonePe</span>
                        <span className="text-[10px] text-platinum/50 bg-white/5 border border-white/10 px-2 py-1 rounded">Paytm</span>
                        <span className="text-[10px] text-platinum/50 bg-white/5 border border-white/10 px-2 py-1 rounded">Cards / Netbanking</span>
                      </div>
                    </div>
                  )}

                  <div className="bg-white/5 p-5 rounded-2xl border border-white/10 flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium text-sm">Aviation Settlement Value</p>
                      <p className="text-platinum/50 text-xs mt-1">Conversion automatically processed to local currency</p>
                    </div>
                    <span className="text-gold font-bold text-lg">{formatAmount(queryPrice)}</span>
                  </div>

                  {paymentOption === "wallet" ? (
                    <button
                      type="submit"
                      disabled={walletBalance < queryPrice}
                      className={`w-full py-5 rounded-xl text-onyx font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 group mt-8 ${walletBalance >= queryPrice
                        ? "bg-gold hover:bg-gold-light shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer"
                        : "bg-white/10 text-platinum/40 cursor-not-allowed border border-white/5"
                        }`}
                    >
                      <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Confirm Wallet Settlement
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="w-full py-5 rounded-xl bg-gold hover:bg-gold-light text-onyx font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 group mt-8 cursor-pointer"
                    >
                      <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Pay via Razorpay Secure
                    </button>
                  )}

                  <p className="text-center text-platinum/40 text-xs font-light flex items-center justify-center gap-2 mt-4 font-mono">
                    <ShieldCheck className="w-4 h-4 text-gold/50" /> End-to-end secure gateway settlement.
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
            data-lenis-prevent
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
                <div className="w-full flex flex-col gap-4">
                  {/* Digital Boarding Pass */}
                  <div
                    className="glass-panel rounded-3xl border border-white/10 bg-[#121212]/90 backdrop-blur-xl overflow-hidden shadow-2xl relative transition-all duration-500 text-left"
                    style={{ borderTop: `6px solid ${generatedTicket.brandColor || '#D4AF37'}` }}
                  >
                    {/* Tear line cuts */}
                    <div className="absolute top-[68%] -left-3 w-6 h-6 bg-[#020202] rounded-full -translate-y-1/2 border-r border-white/5" />
                    <div className="absolute top-[68%] -right-3 w-6 h-6 bg-[#020202] rounded-full -translate-y-1/2 border-l border-white/5" />
                    <div className="absolute top-[68%] left-4 right-4 border-t-2 border-dashed border-white/10" />

                    <div className="p-8 pb-10">
                      {/* Brand Header */}
                      <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                          {logoError ? (
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white font-mono text-xs shadow-md shrink-0"
                              style={{ backgroundColor: generatedTicket.brandColor || "#D4AF37" }}
                            >
                              {getTicketInitials()}
                            </div>
                          ) : (
                            <img
                              src={generatedTicket.logo}
                              alt={generatedTicket.airline}
                              onError={() => setLogoError(true)}
                              className="w-10 h-10 rounded-xl object-contain bg-white/10 p-1.5 border border-white/10 shrink-0"
                            />
                          )}
                          <div>
                            <span className="text-white font-serif font-bold text-sm leading-tight block">
                              {generatedTicket.airline || "SkyLuxe Private"}
                            </span>
                            <span className="text-[9px] font-mono text-platinum/40 uppercase tracking-wider block mt-0.5">
                              {generatedTicket.type === "commercial" ? "Scheduled Carrier" : "Private Jet Operations"}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-platinum/40 uppercase tracking-widest font-mono block">Booking Reference</span>
                          <span className="text-gold font-mono font-bold text-sm tracking-widest">{generatedTicket.pnr || generatedTicket.id}</span>
                        </div>
                      </div>

                      {/* Flight Route */}
                      <div className="flex justify-between items-center mb-8 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div>
                          <p className="text-3xl font-serif text-white font-bold leading-none">{generatedTicket.departure.code}</p>
                          <p className="text-platinum/50 text-[10px] uppercase font-mono mt-1">{generatedTicket.departure.city}</p>
                        </div>
                        <div className="flex-grow px-4 flex flex-col items-center">
                          <span className="text-[9px] text-platinum/40 font-mono tracking-widest mb-1.5 uppercase">{generatedTicket.duration}</span>
                          <div className="w-full border-t border-dashed border-gold/40 relative">
                            <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-gold rotate-90" />
                          </div>
                          <span className="text-[9px] text-gold font-mono tracking-wider mt-1.5 uppercase">
                            {generatedTicket.type === "commercial" ? "Nonstop" : "VIP Route"}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-serif text-white font-bold leading-none">{generatedTicket.arrival.code}</p>
                          <p className="text-platinum/50 text-[10px] uppercase font-mono mt-1">{generatedTicket.arrival.city}</p>
                        </div>
                      </div>

                      {/* Flight Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 text-xs border-t border-white/5 pt-6">
                        <div>
                          <p className="text-[9px] text-platinum/40 uppercase tracking-widest font-mono mb-1">Passenger</p>
                          <p className="text-white font-bold tracking-wide truncate">{generatedTicket.passengerName || user?.fullName || profile?.name || "SkyLuxe Member"}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-platinum/40 uppercase tracking-widest font-mono mb-1">Flight No</p>
                          <p className="text-white font-bold font-mono">{generatedTicket.id}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-platinum/40 uppercase tracking-widest font-mono mb-1">Gate / Terminal</p>
                          <p className="text-white font-bold">{generatedTicket.gate || "B3"} ({generatedTicket.terminal || "Terminal 3"})</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-platinum/40 uppercase tracking-widest font-mono mb-1">Position / Seat</p>
                          <p className="text-gold font-bold font-mono">{generatedTicket.type === "commercial" ? `Seat ${generatedTicket.seatNumber}` : "VIP Lounge"}</p>
                        </div>

                        <div className="pt-2 border-t border-white/5">
                          <p className="text-[9px] text-platinum/40 uppercase tracking-widest font-mono mb-1">Date</p>
                          <p className="text-white font-bold font-mono">{generatedTicket.date}</p>
                        </div>
                        <div className="pt-2 border-t border-white/5">
                          <p className="text-[9px] text-platinum/40 uppercase tracking-widest font-mono mb-1">Boarding Time</p>
                          <p className="text-white font-bold font-mono">{generatedTicket.boardingTime || "08:15"}</p>
                        </div>
                        <div className="pt-2 border-t border-white/5">
                          <p className="text-[9px] text-platinum/40 uppercase tracking-widest font-mono mb-1">Boarding Group</p>
                          <p className="text-white font-bold">{generatedTicket.boardingGroup || "GROUP A"}</p>
                        </div>
                        <div className="pt-2 border-t border-white/5">
                          <p className="text-[9px] text-platinum/40 uppercase tracking-widest font-mono mb-1">Fare Class</p>
                          <p className="text-white font-bold truncate">{generatedTicket.fareClass || "FIRST CLASS"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Tear-off Bottom Barcode Section */}
                    <div className="px-8 py-6 bg-white/[0.02] flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5 relative z-10">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="p-2 bg-white rounded-xl shrink-0">
                          <QrCode className="w-14 h-14 text-black" />
                        </div>
                        <div className="text-left">
                          <p className="text-[9px] text-platinum/40 uppercase tracking-widest font-mono">Operations Clearance</p>
                          <p className="text-white text-xs font-semibold mt-0.5">Civil Aviation Compliant</p>
                          <p className="text-[10px] text-platinum/60 font-mono mt-1">Lounge Access Verified</p>
                        </div>
                      </div>

                      {/* Barcode rendering */}
                      <div className="flex flex-col items-center w-full md:w-56">
                        <div className="h-10 w-full bg-white flex items-stretch border border-white/10 rounded overflow-hidden p-1.5">
                          {Array.from({ length: 48 }).map((_, i) => {
                            const isBlack = (i * 7 + 13) % 3 !== 0;
                            const width = (i % 5 === 0) ? "w-[3px]" : (i % 3 === 0) ? "w-[2px]" : "w-[1px]";
                            return (
                              <div
                                key={i}
                                className={`${isBlack ? "bg-black" : "bg-transparent"} ${width} shrink-0`}
                              />
                            );
                          })}
                        </div>
                        <p className="text-[9px] font-mono text-platinum/40 mt-1 uppercase tracking-widest">*{generatedTicket.pnr || generatedTicket.id}*</p>
                      </div>
                    </div>
                  </div>

                  {/* PDF Download Button */}
                  <button
                    onClick={handleDownloadPDF}
                    className="w-full py-4 bg-gold hover:bg-gold-light text-onyx font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.25)] flex items-center justify-center gap-2 text-sm mt-2"
                  >
                    Download Official Boarding Pass (PDF)
                  </button>
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
