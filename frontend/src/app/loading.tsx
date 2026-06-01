"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-onyx flex flex-col items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-24 h-24 rounded-full border-2 border-gold/30 flex items-center justify-center relative mb-8"
      >
        <div className="absolute inset-0 rounded-full border-t-2 border-gold animate-spin" style={{ animationDuration: "3s" }} />
        <div className="absolute inset-0 rounded-full border-b-2 border-gold-light animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }} />
        <Sparkles className="w-8 h-8 text-gold animate-pulse" />
      </motion.div>
      <h2 className="text-2xl font-serif font-bold text-white mb-2 tracking-widest uppercase">
        Initializing SkyLuxe OS
      </h2>
      <p className="text-platinum/50 font-light text-sm tracking-widest uppercase animate-pulse">
        Establishing Secure Connection...
      </p>
    </div>
  );
}
