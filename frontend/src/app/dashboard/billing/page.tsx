"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Wallet, ArrowUpRight, ArrowDownRight, FileText, Plus, Zap, Loader2, X, Trash2 } from "lucide-react";
import { useSkyLuxeStore } from "@/store/skyluxeStore";
import { useState, useEffect } from "react";
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

export default function Billing() {
  const { walletBalance, transactions, savedCards, addFunds, fetchInitialData, profile, addSavedCard, removeSavedCard, withdrawFunds, currency, setCurrency, formatAmount } = useSkyLuxeStore();
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [fundAmount, setFundAmount] = useState(currency === "USD" ? "50000" : "4150000");
  const [isFunding, setIsFunding] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [showWithdrawFunds, setShowWithdrawFunds] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawErrorMsg, setWithdrawErrorMsg] = useState("");

  useEffect(() => {
    setFundAmount(currency === "USD" ? "50000" : "4150000");
  }, [currency]);

  const handleWithdrawFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawErrorMsg("Please enter a valid positive amount.");
      return;
    }
    const balanceInActiveCurrency = currency === "USD" ? walletBalance : walletBalance * 83;
    if (amount > balanceInActiveCurrency) {
      setWithdrawErrorMsg(`Withdrawal amount cannot exceed available balance of ${formatAmount(walletBalance)}.`);
      return;
    }
    setIsWithdrawing(true);
    setWithdrawErrorMsg("");
    try {
      const usdAmount = currency === "USD" ? amount : amount / 83;
      const success = await withdrawFunds(usdAmount);
      if (success) {
        setShowWithdrawFunds(false);
        setWithdrawAmount("");
      } else {
        setWithdrawErrorMsg("Failed to process withdrawal. Please try again.");
      }
    } catch (err: any) {
      setWithdrawErrorMsg(err.message || "Withdrawal failed. Please try again.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const [showAddCard, setShowAddCard] = useState(false);
  const [paymentType, setPaymentType] = useState<"card" | "upi" | "netbanking">("card");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [isPrimary, setIsPrimary] = useState(false);
  const [cardError, setCardError] = useState("");

  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    setCardError("");

    if (paymentType === "card") {
      if (!cardHolder.trim() || !cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
        setCardError("All card fields are required.");
        return;
      }
      const cleanNum = cardNumber.replace(/\s+/g, "");
      if (cleanNum.length < 12 || isNaN(Number(cleanNum))) {
        setCardError("Please enter a valid card number.");
        return;
      }
      if (!cardExpiry.includes("/")) {
        setCardError("Expiry must be in MM/YY format.");
        return;
      }
      
      const last4Digits = cleanNum.slice(-4);
      let brandName = "VISA";
      if (cleanNum.startsWith("5")) brandName = "Mastercard";
      else if (cleanNum.startsWith("3")) brandName = "AMEX";
      
      addSavedCard({
        brand: brandName,
        last4: last4Digits,
        exp: cardExpiry,
        primary: isPrimary
      });
    } else if (paymentType === "upi") {
      if (!upiId.trim() || !upiId.includes("@")) {
        setCardError("Please enter a valid UPI ID (e.g. name@upi).");
        return;
      }
      addSavedCard({
        brand: "UPI ID",
        last4: upiId.trim(),
        exp: "Instant UPI",
        primary: isPrimary
      });
    } else if (paymentType === "netbanking") {
      addSavedCard({
        brand: "Netbanking",
        last4: selectedBank,
        exp: "Direct Debit",
        primary: isPrimary
      });
    }

    setShowAddCard(false);
    setCardHolder("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setUpiId("");
    setSelectedBank("HDFC Bank");
    setIsPrimary(false);
  };

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMsg("Please enter a valid positive amount.");
      return;
    }
    setIsFunding(true);
    setErrorMsg("");
    try {
      if (!profile || !profile.id) {
        throw new Error("User profile not loaded. Please wait or log in again.");
      }

      // 1. Create order on backend
      const orderRes = await api.post<any>("/payments/create-order", {
        amount: currency === "USD" ? amount : amount / 83,
        type: "topup",
        userId: profile.id
      });

      const { orderId, amount: rzpAmount, currency: orderCurrency, keyId } = orderRes;

      const handleVerification = async (verifyPayload: any) => {
        const verifyRes = await api.post<any>("/payments/verify", verifyPayload);
        if (verifyRes.success) {
          await fetchInitialData();
          setShowAddFunds(false);
          setFundAmount("50000");
        } else {
          throw new Error(verifyRes.message || "Payment verification failed.");
        }
      };

      // 2. Sandbox bypass check
      if (orderId.startsWith("order_mock_")) {
        await handleVerification({
          razorpay_order_id: orderId,
          razorpay_payment_id: `pay_mock_${Date.now().toString().slice(-6)}`,
          razorpay_signature: "sandbox_signature_bypass"
        });
        return;
      }

      // 3. Load script & launch Razorpay Checkout Modal
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay payment gateway script.");
      }

      const options = {
        key: keyId,
        amount: rzpAmount,
        currency: orderCurrency,
        name: "SkyLuxe Aviation",
        description: "FBO Wallet Funding",
        order_id: orderId,
        handler: async function (response: any) {
          setIsFunding(true);
          try {
            await handleVerification({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
          } catch (err: any) {
            setErrorMsg(err.message || "Payment verification failed.");
          } finally {
            setIsFunding(false);
          }
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
            setIsFunding(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      setErrorMsg(err.message || "Top-up failed. Please try again.");
    } finally {
      setIsFunding(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Wallet & Billing</h1>
          <p className="text-platinum/50 font-light text-sm">Manage payment methods, view transaction history, and fund your aviation wallet.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Currency Toggle */}
          <div className="flex bg-white/5 border border-white/10 p-0.5 rounded-xl text-xs">
            <button 
              onClick={() => setCurrency("USD")}
              className={`px-3 py-1.5 rounded-lg transition-all ${currency === "USD" ? "bg-gold text-onyx font-bold" : "text-platinum/60 hover:text-white"}`}
            >
              USD ($)
            </button>
            <button 
              onClick={() => setCurrency("INR")}
              className={`px-3 py-1.5 rounded-lg transition-all ${currency === "INR" ? "bg-gold text-onyx font-bold" : "text-platinum/60 hover:text-white"}`}
            >
              INR (₹)
            </button>
          </div>
          <button className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors text-sm flex items-center gap-2">
            <DownloadIcon className="w-4 h-4" /> Download Statement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Wallet Balance & Cards */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Wallet Balance */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-8 rounded-3xl border border-gold/30 bg-gradient-to-br from-onyx to-onyx-light relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/4" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-platinum/60 mb-2">
                <Wallet className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest font-medium">Available Balance</span>
              </div>
              <h2 className="text-5xl font-bold text-white tracking-tight mb-6">
                {formatAmount(walletBalance)}
              </h2>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowAddFunds(true)}
                  className="flex-1 py-3 rounded-xl bg-gold text-onyx font-bold hover:bg-gold-light transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)] flex justify-center items-center gap-2 cursor-pointer text-sm"
                >
                  <Plus className="w-4 h-4" /> Add Funds
                </button>
                <button 
                  onClick={() => setShowWithdrawFunds(true)}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors flex justify-center items-center gap-2 cursor-pointer text-sm"
                >
                  <ArrowUpRight className="w-4 h-4" /> Withdraw
                </button>
              </div>
            </div>
          </motion.div>

          {/* Saved Cards */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-serif font-bold text-white">Payment Methods</h3>
              <button 
                onClick={() => setShowAddCard(true)}
                className="text-gold text-xs font-medium hover:text-white transition-colors"
              >
                Add New
              </button>
            </div>
            
            <div className="space-y-4">
              {savedCards.map((card) => (
                <div key={card.id} className="p-5 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between group hover:border-gold/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-[#000000] rounded flex items-center justify-center relative overflow-hidden">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{card.brand} {card.last4 && `•••• ${card.last4}`}</p>
                      <p className="text-platinum/50 text-xs">{card.exp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {card.primary && (
                      <div className="w-4 h-4 rounded-full border-2 border-gold flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-gold" />
                      </div>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSavedCard(card.id);
                      }}
                      className="p-2 rounded-lg text-platinum/40 hover:text-red-400 hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Delete payment method"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Transaction History */}
        <div className="lg:col-span-2">
          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-serif font-bold text-white">Transaction History</h3>
              <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none">
                <option>All Transactions</option>
                <option>Charter Flights</option>
                <option>Membership Dues</option>
                <option>Wallet Funding</option>
              </select>
            </div>
            
            <div className="divide-y divide-white/5">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <TransactionRow 
                    key={tx.id}
                    title={tx.title} 
                    date={tx.date} 
                    amount={tx.amount > 0 ? `+${formatAmount(tx.amount)}` : formatAmount(tx.amount)} 
                    type={tx.type} 
                    invoice={tx.invoice}
                  />
                ))
              ) : (
                <div className="p-8 text-center text-platinum/30">No transactions recorded.</div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Wire Transfer Top-Up Modal */}
      <AnimatePresence>
        {showAddFunds && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddFunds(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel w-full max-w-md p-8 rounded-3xl border border-white/10 bg-onyx relative z-10 overflow-hidden"
            >
              <button 
                onClick={() => setShowAddFunds(false)}
                className="absolute top-6 right-6 text-platinum/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-serif font-bold text-white mb-2 flex items-center gap-2">
                <Wallet className="text-gold w-6 h-6" /> Fund FBO Wallet
              </h3>
              <p className="text-platinum/50 text-sm mb-6">Instant deposit via Razorpay secure checkout (UPI, Card, Net Banking).</p>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleAddFunds} className="space-y-6">
                <div>
                  <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block">Transfer Amount ({currency})</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-platinum/50 font-medium">
                      {currency === "USD" ? "$" : "₹"}
                    </span>
                    <input 
                      type="number" 
                      value={fundAmount} 
                      onChange={(e) => setFundAmount(e.target.value)}
                      placeholder={currency === "USD" ? "50000" : "4150000"}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-8 pr-4 text-white font-medium focus:border-gold/50 outline-none text-lg" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {["25000", "50000", "100000"].map((preset) => {
                    const presetVal = currency === "USD" ? preset : (parseInt(preset) * 83).toString();
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setFundAmount(presetVal)}
                        className={`py-2 rounded-lg border text-xs font-semibold transition-all ${
                          fundAmount === presetVal 
                            ? "border-gold bg-gold/10 text-gold" 
                            : "border-white/10 bg-white/5 text-platinum/60 hover:bg-white/10"
                        }`}
                      >
                        {formatAmount(parseInt(preset))}
                      </button>
                    );
                  })}
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-xs text-platinum/40 space-y-1">
                  <p>• Secured using Razorpay payment gateway services.</p>
                  <p>• Settlement is instant for approved VIP members.</p>
                </div>

                <button 
                  type="submit"
                  disabled={isFunding}
                  className="w-full py-4 rounded-xl bg-gold text-onyx font-bold hover:bg-gold-light transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)] flex justify-center items-center gap-2 cursor-pointer text-sm"
                >
                  {isFunding ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Authorizing Gateway...
                    </>
                  ) : (
                    <>
                      Confirm Payment via Razorpay
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Payment Method Modal */}
      <AnimatePresence>
        {showAddCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddCard(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel w-full max-w-md p-8 rounded-3xl border border-white/10 bg-onyx relative z-10 overflow-hidden"
            >
              <button 
                onClick={() => setShowAddCard(false)}
                className="absolute top-6 right-6 text-platinum/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-serif font-bold text-white mb-2 flex items-center gap-2">
                <CreditCard className="text-gold w-6 h-6" /> Add Payment Method
              </h3>
              <p className="text-platinum/50 text-sm mb-6">Link a new credit/debit card, UPI ID, or netbanking account.</p>

              {cardError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-light">
                  {cardError}
                </div>
              )}

              {/* Payment Type Selection Tabs */}
              <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl mb-6">
                {[
                  { id: "card", label: "Card" },
                  { id: "upi", label: "UPI" },
                  { id: "netbanking", label: "Net Banking" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => { setPaymentType(tab.id as any); setCardError(""); }}
                    className={`flex-1 py-2 text-center text-xs font-medium rounded-lg transition-all ${
                      paymentType === tab.id 
                        ? "bg-gold text-onyx font-bold" 
                        : "text-platinum/60 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                {paymentType === "card" && (
                  <>
                    <div>
                      <label className="text-xs text-platinum/50 uppercase tracking-widest mb-1.5 block">Cardholder Name</label>
                      <input 
                        type="text" 
                        required
                        value={cardHolder} 
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Eashan Sterling"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-gold/50 outline-none" 
                      />
                    </div>

                    <div>
                      <label className="text-xs text-platinum/50 uppercase tracking-widest mb-1.5 block">Card Number</label>
                      <input 
                        type="text" 
                        required
                        value={cardNumber} 
                        onChange={(e) => {
                          const v = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
                          const matches = v.match(/\d{4,16}/g);
                          const match = matches && matches[0] || "";
                          const parts = [];

                          for (let i = 0, len = match.length; i < len; i += 4) {
                            parts.push(match.substring(i, i + 4));
                          }

                          if (parts.length > 0) {
                            setCardNumber(parts.join(" "));
                          } else {
                            setCardNumber(v);
                          }
                        }}
                        maxLength={19}
                        placeholder="4111 2222 3333 4444"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-gold/50 outline-none font-mono" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-platinum/50 uppercase tracking-widest mb-1.5 block">Expiry Date</label>
                        <input 
                          type="text" 
                          required
                          value={cardExpiry} 
                          onChange={(e) => {
                            let val = e.target.value.replace(/[^0-9/]/g, "");
                            if (val.length === 2 && !val.includes("/")) {
                              val += "/";
                            }
                            setCardExpiry(val);
                          }}
                          maxLength={5}
                          placeholder="MM/YY"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-gold/50 outline-none font-mono" 
                        />
                      </div>
                      <div>
                        <label className="text-xs text-platinum/50 uppercase tracking-widest mb-1.5 block">CVV</label>
                        <input 
                          type="password" 
                          required
                          value={cardCvv} 
                          onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ""))}
                          maxLength={4}
                          placeholder="•••"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-gold/50 outline-none font-mono" 
                        />
                      </div>
                    </div>
                  </>
                )}

                {paymentType === "upi" && (
                  <div>
                    <label className="text-xs text-platinum/50 uppercase tracking-widest mb-1.5 block">UPI ID / VPA</label>
                    <input 
                      type="text" 
                      required
                      value={upiId} 
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="eashan@upi"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white text-sm focus:border-gold/50 outline-none font-mono" 
                    />
                    <p className="text-[10px] text-platinum/40 mt-1.5 leading-relaxed">
                      Accepts Google Pay, PhonePe, Paytm, and BHIM virtual payment addresses.
                    </p>
                  </div>
                )}

                {paymentType === "netbanking" && (
                  <div>
                    <label className="text-xs text-platinum/50 uppercase tracking-widest mb-1.5 block">Select Popular Bank</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-gold/50 outline-none select-nb-bank"
                    >
                      <option value="HDFC Bank" className="bg-onyx">HDFC Bank</option>
                      <option value="State Bank of India" className="bg-onyx">State Bank of India</option>
                      <option value="ICICI Bank" className="bg-onyx">ICICI Bank</option>
                      <option value="Axis Bank" className="bg-onyx">Axis Bank</option>
                      <option value="Kotak Mahindra Bank" className="bg-onyx">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {/* Primary Switch */}
                <div className="flex items-center gap-3 pt-2">
                  <input 
                    type="checkbox" 
                    id="primary-switch"
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 accent-gold" 
                  />
                  <label htmlFor="primary-switch" className="text-xs text-platinum/70 cursor-pointer select-none">
                    Set as primary payment method
                  </label>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gold text-onyx font-bold hover:bg-gold-light transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)] flex justify-center items-center gap-2 cursor-pointer text-sm mt-6"
                >
                  Save Payment Method
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Withdraw Funds Modal */}
      <AnimatePresence>
        {showWithdrawFunds && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWithdrawFunds(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel w-full max-w-md p-8 rounded-3xl border border-white/10 bg-onyx relative z-10 overflow-hidden"
            >
              <button 
                onClick={() => setShowWithdrawFunds(false)}
                className="absolute top-6 right-6 text-platinum/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-serif font-bold text-white mb-2 flex items-center gap-2">
                <ArrowUpRight className="text-gold w-6 h-6" /> Withdraw Funds
              </h3>
              <p className="text-platinum/50 text-sm mb-6">Transfer funds from your FBO Wallet back to your primary payment method.</p>

              {withdrawErrorMsg && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
                  {withdrawErrorMsg}
                </div>
              )}

              <form onSubmit={handleWithdrawFunds} className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs text-platinum/50 uppercase tracking-widest block">Withdraw Amount ({currency})</label>
                    <span className="text-xs text-gold/80">Max: {formatAmount(walletBalance)}</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-platinum/50 font-medium">
                      {currency === "USD" ? "$" : "₹"}
                    </span>
                    <input 
                      type="number" 
                      value={withdrawAmount} 
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder={currency === "USD" ? "10000" : "830000"}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-8 pr-4 text-white font-medium focus:border-gold/50 outline-none text-lg" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[0.25, 0.5, 1.0].map((ratio) => {
                    const amtInUSD = Math.floor(walletBalance * ratio);
                    const amtInActiveCurrency = currency === "USD" ? amtInUSD : Math.round(amtInUSD * 83);
                    return (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setWithdrawAmount(amtInActiveCurrency.toString())}
                        className="py-2 rounded-lg border border-white/10 bg-white/5 text-platinum/60 hover:bg-white/10 text-xs font-semibold transition-all"
                      >
                        {ratio * 100}% ({formatAmount(amtInUSD)})
                      </button>
                    );
                  })}
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-xs text-platinum/40 space-y-1">
                  <p>• Funds will be returned to your original source account.</p>
                  <p>• Processing may take 2-3 business days depending on the bank.</p>
                </div>

                <button 
                  type="submit"
                  disabled={isWithdrawing || !withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > (currency === "USD" ? walletBalance : walletBalance * 83)}
                  className="w-full py-4 rounded-xl bg-gold text-onyx font-bold hover:bg-gold-light disabled:bg-white/10 disabled:text-platinum/40 disabled:cursor-not-allowed transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)] flex justify-center items-center gap-2 cursor-pointer text-sm"
                >
                  {isWithdrawing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing Withdrawal...
                    </>
                  ) : (
                    <>
                      Confirm Withdrawal
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TransactionRow({ title, date, amount, type, invoice }: any) {
  const isCredit = type === "credit";
  return (
    <div className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCredit ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-platinum'}`}>
          {isCredit ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
        </div>
        <div>
          <p className="text-white font-medium">{title}</p>
          <p className="text-platinum/50 text-xs">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className={`font-bold ${isCredit ? 'text-green-400' : 'text-white'}`}>{amount}</span>
        {invoice ? (
          <button className="flex items-center gap-2 text-platinum/50 hover:text-gold transition-colors text-xs font-medium border border-white/10 px-3 py-1.5 rounded-lg bg-white/5">
            <FileText className="w-3 h-3" /> {invoice}
          </button>
        ) : (
          <div className="w-24" /> // placeholder for alignment
        )}
      </div>
    </div>
  );
}

function DownloadIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" x2="12" y1="15" y2="3"/>
    </svg>
  );
}
