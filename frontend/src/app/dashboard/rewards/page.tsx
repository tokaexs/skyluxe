"use client";

import { motion } from "framer-motion";
import { Gift, Lock, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { useSkyLuxeStore } from "@/store/skyluxeStore";

export default function RewardsEcosystem() {
  const { coins, coupons, redeemCoupon } = useSkyLuxeStore();

  const handleRedeem = (brand: string) => {
    redeemCoupon(brand);
  };

  return (
    <div className="space-y-8 flex-1 pb-12">
      {/* Cinematic Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-10 rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">SkyLuxe Loyalty Core</h1>
            <p className="text-platinum/60 font-light max-w-md">
              Earn exclusive SkyCoins on every private charter, commercial flight, and membership renewal. 
            </p>
          </div>
          <div className="mt-6 md:mt-0 text-right">
            <p className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1 font-mono">Current Balance</p>
            <div className="flex items-center justify-end gap-3">
              <Sparkles className="w-8 h-8 text-gold animate-pulse" />
              <span className="text-6xl font-bold font-serif text-white">{coins.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-10">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs text-gold font-medium">Silver Elite Status</span>
            <span className="text-xs text-platinum/50 font-mono">{coins} / 1500 (Next Unlock Tier)</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((coins / 1500) * 100, 100)}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-gold/50 to-gold rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Rewards Grid */}
      <div>
        <h2 className="text-lg font-serif font-medium text-white mb-6">Exclusive Partner Unlocks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((reward, idx) => {
            const isLocked = coins < reward.points;
            
            return (
              <motion.div 
                key={reward.brand}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`glass-panel rounded-2xl overflow-hidden border ${isLocked ? 'border-white/5' : 'border-gold/30 shadow-[0_0_20px_rgba(212,175,55,0.1)]'} relative group flex flex-col justify-between`}
              >
                {/* Background Image */}
                <div className="relative h-32">
                  <div className={`absolute inset-0 bg-onyx/40 z-10 ${isLocked ? 'backdrop-blur-md' : ''}`} />
                  <img src={reward.img} alt={reward.brand} className={`w-full h-full object-cover ${isLocked ? 'grayscale opacity-30' : 'opacity-80 group-hover:scale-105 transition-transform duration-700'}`} />
                  
                  {isLocked && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                      <Lock className="w-6 h-6 text-platinum/50 mb-2" />
                      <span className="text-xs font-mono text-platinum/50 uppercase tracking-widest">{reward.points} Coins Required</span>
                    </div>
                  )}
                </div>

                <div className="p-6 relative z-30 bg-onyx/90 backdrop-blur-xl flex-1 flex flex-col justify-between">
                  <div className="mb-6">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isLocked ? 'text-platinum/40' : 'text-gold'} mb-1 block`}>
                      {reward.brand}
                    </span>
                    <h3 className={`text-lg font-serif font-medium ${isLocked ? 'text-white/40' : 'text-white'}`}>{reward.offer}</h3>
                  </div>
                  
                  <div className="mt-auto">
                    {!isLocked ? (
                      reward.redeemed ? (
                        <div className="w-full py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 font-medium flex justify-center items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4" /> Redeemed Voucher!
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleRedeem(reward.brand)}
                          className="w-full py-3 rounded-xl bg-gold/10 text-gold border border-gold/30 hover:bg-gold hover:text-onyx transition-all duration-300 font-medium text-sm flex justify-center items-center gap-2"
                        >
                          Redeem Reward <ArrowRight className="w-4 h-4" />
                        </button>
                      )
                    ) : (
                      <div>
                        <div className="flex justify-between text-[9px] text-platinum/40 mb-1.5 font-mono">
                          <span>Accumulation</span>
                          <span>{Math.round((coins / reward.points) * 100)}% Complete</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-white/20" style={{ width: `${Math.min((coins / reward.points) * 100, 100)}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
