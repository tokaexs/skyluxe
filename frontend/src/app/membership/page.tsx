"use client";

import { motion } from "framer-motion";
import GlassNavbar from "@/components/ui/GlassNavbar";
import { Check } from "lucide-react";
import Link from "next/link";

export default function Membership() {
  return (
    <main className="relative min-h-screen bg-onyx flex flex-col pb-24">
      <GlassNavbar />

      {/* Atmospheric Runway Background Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-45">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/runway-membership-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-onyx/75 to-onyx" />
      </div>

      <div className="relative z-10 pt-40 px-6 lg:px-16 max-w-7xl mx-auto w-full text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-serif font-bold text-white mb-6"
        >
          The <span className="text-gold">Inner Circle</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-platinum/70 max-w-2xl mx-auto mb-20 font-light"
        >
          Exclusive access to the world's most premium aviation network, reserved for the elite few.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <MembershipCard 
            tier="Silver"
            price="$15,000"
            delay={0.4}
            features={[
              "Guaranteed availability in 24 hours",
              "Access to light jets (India/UAE)",
              "Dedicated travel advisor",
              "Standard catering"
            ]}
          />
          <MembershipCard 
            tier="Executive"
            price="$45,000"
            isPopular
            delay={0.5}
            features={[
              "Guaranteed availability in 12 hours",
              "Access to heavy jets",
              "24/7 Personal Concierge AI",
              "Michelin-star catering",
              "Complimentary airport transfers"
            ]}
          />
          <MembershipCard 
            tier="Black Elite"
            price="Invite Only"
            delay={0.6}
            features={[
              "Guaranteed availability in 6 hours",
              "Access to Ultra-Long Range Jets",
              "Helicopter transfers in Dubai",
              "Empty leg complimentary flights",
              "Bespoke global experiences"
            ]}
          />
        </div>
      </div>
    </main>
  );
}

function MembershipCard({ tier, price, features, isPopular, delay }: { tier: string, price: string, features: string[], isPopular?: boolean, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ y: -10, scale: 1.02 }}
      className={`relative p-8 rounded-3xl text-left border ${isPopular ? 'glass-panel-gold shadow-[0_0_40px_rgba(212,175,55,0.15)]' : 'glass-panel border-white/10'}`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold to-gold-light text-onyx text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full">
          Most Popular
        </div>
      )}
      
      <h3 className="text-2xl font-serif font-bold text-white mb-2">{tier}</h3>
      <div className="flex items-baseline gap-2 mb-8">
        <span className="text-4xl font-bold text-gold">{price}</span>
        {price !== "Invite Only" && <span className="text-platinum/50 text-sm">/ year</span>}
      </div>

      <ul className="space-y-4 mb-10 flex-1">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-gold shrink-0 mt-0.5" />
            <span className="text-platinum/80 text-sm font-light leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>

      <Link href={`/membership/${tier.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
        <button className={`w-full py-4 rounded-full font-bold transition-all duration-300 ${isPopular ? 'bg-gold text-onyx hover:bg-gold-light shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}>
          {price === "Invite Only" ? "Request Invitation" : "View Details"}
        </button>
      </Link>
    </motion.div>
  );
}
