"use client";

import { motion } from "framer-motion";
import GlassNavbar from "@/components/ui/GlassNavbar";
import { ArrowRight, Trophy, Sparkles, Star, ShieldCheck, Lock } from "lucide-react";
import Link from "next/link";

const rewardsMarket = [
  { brand: "Zara Vouchers", points: "500 Coins", desc: "Premium ₹5,000 fashion vouchers.", icon: Star },
  { brand: "Apple Hardware", points: "1,000 Coins", desc: "AirPods Pro (2nd Gen) with wireless case.", icon: Star },
  { brand: "Airline Upgrades", points: "1,500 Coins", desc: "Complimentary Air India or Vistara Business upgrades.", icon: Star },
  { brand: "Helicopter Transfers", points: "3,000 Coins", desc: "FBO-to-city private helicopter connections.", icon: Star },
  { brand: "Resort Nights", points: "5,000 Coins", desc: "Burj Al Arab suite voucher (1 night).", icon: Star }
];

export default function RewardsPublic() {
  return (
    <main className="relative min-h-screen bg-[#020202] flex flex-col overflow-x-hidden selection:bg-gold/30">
      <GlassNavbar />

      {/* Cinematic Hero */}
      <section className="relative pt-40 pb-20 px-6 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/30 bg-gold/5 backdrop-blur-md mb-8">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-gold text-xs font-semibold tracking-wider uppercase font-mono">Loyalty Protocol</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
            SkyLuxe <span className="text-gold">Rewards</span>
          </h1>
          <p className="text-xl text-platinum/70 font-light leading-relaxed max-w-2xl mx-auto">
            Earn premium SkyCoins on every flight mission, private charter, and membership renewal. Redeemed for top hardware, resort nights, and airspace transfers.
          </p>
        </motion.div>
      </section>

      {/* Earn Mechanics */}
      <section className="py-12 px-6 lg:px-16 max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <EarnCard title="Private Jet Charter" coins="1,000 Coins" detail="Earned for every custom leg configuration flight." />
        <EarnCard title="International Flight" coins="300 Coins" detail="Earned on commercial premium and business class bookings." />
        <EarnCard title="Domestic Flight" coins="100 Coins" detail="Earned on standard commercial network connections." />
      </section>

      {/* Reward Showcase Tiers */}
      <section className="py-20 px-6 lg:px-16 max-w-5xl mx-auto w-full relative z-10 mb-24">
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden bg-onyx bg-gradient-to-br from-gold/5 to-transparent">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          
          <h2 className="text-3xl font-serif font-bold text-white mb-8 text-center flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-gold" /> The Premium Rewards Marketplace
          </h2>
          
          <div className="space-y-4">
            {rewardsMarket.map((reward, idx) => (
              <div key={reward.brand} className="p-5 rounded-2xl border border-white/5 bg-white/5 hover:border-gold/30 hover:bg-white/10 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <reward.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{reward.brand}</h4>
                    <p className="text-platinum/50 text-xs mt-1 font-light leading-relaxed">{reward.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-gold font-bold text-sm font-mono block mb-1">{reward.points}</span>
                  <span className="text-[9px] text-platinum/40 uppercase tracking-widest block font-mono">Unlock Requirement</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/auth/register">
              <button className="px-8 py-4 bg-gradient-to-r from-gold to-gold-light text-onyx font-bold text-lg rounded-xl hover:-translate-y-1 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center gap-2 mx-auto">
                Request Elite Account Vetting <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function EarnCard({ title, coins, detail }: any) {
  return (
    <div className="glass-panel p-8 rounded-3xl border border-white/10 relative text-left group hover:border-gold/30 transition-all duration-500">
      <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-6">
        <Sparkles className="w-5 h-5 text-gold animate-pulse" />
      </div>
      <h3 className="text-white font-serif text-xl mb-2">{title}</h3>
      <p className="text-gold font-bold text-2xl font-serif mb-4">{coins}</p>
      <p className="text-platinum/60 text-sm font-light leading-relaxed">{detail}</p>
    </div>
  );
}
