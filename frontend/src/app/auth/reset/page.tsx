"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function ResetPassword() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="relative min-h-screen bg-[#020202] flex flex-col justify-center items-center overflow-hidden selection:bg-gold/30">
      
      {/* Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2500&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/10 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md glass-panel p-10 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
        
        <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-6">
          <ShieldCheck className="w-6 h-6 text-gold" />
        </div>

        <h1 className="text-3xl font-serif font-bold text-white mb-2">Secure Reset</h1>
        
        {!submitted ? (
          <>
            <p className="text-platinum/50 font-light text-sm mb-8">Establish a new highly-secure password for your SkyLuxe account. Do not share this with your concierge.</p>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
              <div>
                <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block font-medium">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-platinum/30" />
                  <input type="password" required placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-platinum/30 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all font-light outline-none" />
                </div>
                {/* Password Strength Indicator */}
                <div className="flex gap-1 mt-3">
                  <div className="h-1 flex-1 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                  <div className="h-1 flex-1 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                  <div className="h-1 flex-1 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                  <div className="h-1 flex-1 rounded-full bg-white/10" />
                </div>
              </div>

              <div>
                <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block font-medium">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-platinum/30" />
                  <input type="password" required placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-platinum/30 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all font-light outline-none" />
                </div>
              </div>

              <button type="submit" className="w-full py-4 rounded-xl bg-gold hover:bg-gold-light text-onyx font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                Initialize Key <ArrowRight className="w-5 h-5" />
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
            <h2 className="text-xl font-bold text-white mb-2">Key Updated Successfully</h2>
            <p className="text-platinum/50 text-sm font-light mb-8">Your new security credentials have been established and synced across all global servers.</p>
            <Link href="/auth/login" className="w-full block py-4 rounded-xl bg-gold text-onyx font-bold hover:bg-gold-light transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              Sign In Now
            </Link>
          </motion.div>
        )}

      </motion.div>
    </main>
  );
}
