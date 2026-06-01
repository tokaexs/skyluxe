"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, Mail, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function Recover() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="relative min-h-screen bg-[#020202] flex flex-col justify-center items-center overflow-hidden selection:bg-gold/30">
      
      {/* Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2500&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-900/10 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gold/10 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <Link href="/auth/login" className="absolute top-8 left-8 flex items-center gap-2 text-platinum/50 hover:text-white transition-colors text-sm font-light z-20">
        <ArrowLeft className="w-4 h-4" /> Back to Sign In
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md glass-panel p-10 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
        
        <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-6">
          <ShieldAlert className="w-6 h-6 text-gold" />
        </div>

        <h1 className="text-3xl font-serif font-bold text-white mb-2">Account Recovery</h1>
        
        {!submitted ? (
          <>
            <p className="text-platinum/50 font-light text-sm mb-8">Enter the email associated with your SkyLuxe account. We will transmit a secure reset protocol to your inbox.</p>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
              <div>
                <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block font-medium">Corporate Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-platinum/30" />
                  <input type="email" required placeholder="name@company.com" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-platinum/30 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all font-light outline-none" />
                </div>
              </div>

              <button type="submit" className="w-full py-4 rounded-xl bg-gold hover:bg-gold-light text-onyx font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                Transmit Protocol <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6"
          >
            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Protocol Transmitted</h2>
            <p className="text-platinum/50 text-sm font-light mb-8">If an account exists for that email, you will receive a highly-secure reset link valid for 15 minutes.</p>
            <Link href="/auth/login" className="w-full block py-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors">
              Return to Sign In
            </Link>
          </motion.div>
        )}

      </motion.div>
    </main>
  );
}
