"use client";

import { motion } from "framer-motion";
import { 
  Globe, Compass, ShieldCheck, MapPin, Award, Plane, Clock,
  Calendar, CheckCircle, Lock, Star, Landmark
} from "lucide-react";
import { useSkyLuxeStore } from "@/store/skyluxeStore";
import AtmosphericGlobe from "@/components/3d/AtmosphericGlobe";

export default function AviationPassport() {
  const { profile } = useSkyLuxeStore();
  const stats = profile?.passportStats || {
    countriesVisited: [],
    favoriteDestinations: [],
    privateJetHours: 0,
    flightsTaken: 0,
    stamps: []
  };

  const achievementsList = [
    {
      id: "first_flight",
      title: "First Flight",
      desc: "Inaugural takeoff logged with SkyLuxe",
      icon: Plane
    },
    {
      id: "first_international",
      title: "Global Citizen",
      desc: "Crossed borders on a commercial or private leg",
      icon: Globe
    },
    {
      id: "10_flights",
      title: "Decathlon Jetsetter",
      desc: "Logged 10 flight missions in the operating system",
      icon: CheckCircle
    },
    {
      id: "dubai_explorer",
      title: "Dubai Explorer",
      desc: "Landed at Dubai Al Maktoum VIP Lounge",
      icon: Landmark
    },
    {
      id: "luxury_traveler",
      title: "Luxury Traveler",
      desc: "Secured Maybach ground chauffeur transfers",
      icon: ShieldCheck
    },
    {
      id: "jet_setter",
      title: "Jet Setter",
      desc: "Logged 25+ hours of private jet charter flight time",
      icon: Clock
    },
    {
      id: "global_voyager",
      title: "Global Voyager",
      desc: "Visited 3 or more countries on the world map",
      icon: Compass
    },
    {
      id: "black_elite_veteran",
      title: "Black Elite Veteran",
      desc: "Acquired Black Titanium elite club credentials",
      icon: Star
    }
  ];

  // Helper to format stamp style dynamically
  const getStampClasses = (stampId: string) => {
    switch(stampId) {
      case 'stamp_bom':
        return "border-emerald-500/40 text-emerald-400 bg-emerald-500/5 rotate-[-4deg]";
      case 'stamp_dwc':
        return "border-gold/40 text-gold bg-gold/5 rotate-[6deg]";
      case 'stamp_lhr':
        return "border-cyan-500/40 text-cyan-400 bg-cyan-500/5 rotate-[-2deg]";
      default:
        return "border-white/20 text-platinum/70 bg-white/5 rotate-[2deg]";
    }
  };

  return (
    <div className="space-y-8 flex-1 pb-12">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white mb-2">SkyLuxe Aviation Passport</h1>
        <p className="text-platinum/50 font-light text-sm">
          Track countries visited, view custom FBO entry stamps, and review unlock status of achievements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3D Globe & Travel Legacy Stats */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col items-center">
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            
            <h3 className="text-sm font-mono text-platinum/40 uppercase tracking-widest self-start mb-4">Interactive Flight Radar</h3>
            
            <div className="w-full max-w-[420px] aspect-square flex items-center justify-center">
              <AtmosphericGlobe />
            </div>

            {/* Passport Badges grid */}
            <div className="grid grid-cols-3 gap-4 w-full mt-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                <Globe className="w-5 h-5 text-gold mx-auto mb-1" />
                <p className="text-xl font-bold font-mono text-white">{stats.countriesVisited?.length || 0}</p>
                <p className="text-[10px] text-platinum/40 uppercase tracking-widest font-mono mt-0.5">Countries</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                <Plane className="w-5 h-5 text-gold mx-auto mb-1" />
                <p className="text-xl font-bold font-mono text-white">{stats.flightsTaken || 0}</p>
                <p className="text-[10px] text-platinum/40 uppercase tracking-widest font-mono mt-0.5">Flights Taken</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                <Clock className="w-5 h-5 text-gold mx-auto mb-1" />
                <p className="text-xl font-bold font-mono text-white">{stats.privateJetHours || 0}h</p>
                <p className="text-[10px] text-platinum/40 uppercase tracking-widest font-mono mt-0.5">Jet Hours</p>
              </div>
            </div>
          </div>

          {/* Stamps Collection */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10">
            <h3 className="text-lg font-serif font-bold text-white mb-6">Customs Stamps Registry</h3>
            
            {stats.stamps?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {stats.stamps.map((stamp: any, idx: number) => (
                  <motion.div 
                    key={stamp.stampId || idx}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`border-2 border-dashed p-4 rounded-2xl flex flex-col items-center justify-center text-center aspect-[5/4] ${getStampClasses(stamp.stampId)}`}
                  >
                    <span className="text-[8px] font-mono tracking-widest uppercase opacity-75">{stamp.country}</span>
                    <h4 className="text-xs font-serif font-bold my-1 tracking-tight uppercase leading-snug">{stamp.title}</h4>
                    <span className="text-[8px] font-mono mt-0.5 opacity-60">
                      {new Date(stamp.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-8 border border-dashed border-white/5 rounded-2xl text-center text-platinum/40 font-light">
                No customs stamps recorded yet. Subscribing to club tiers or completing flights awards stamps.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Achievements Registry */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-onyx-light">
            <h3 className="text-lg font-serif font-bold text-white mb-2">Aviation Milestones</h3>
            <p className="text-xs text-platinum/40 mb-6 leading-relaxed">
              Complete flights, unlock higher memberships, and travel globally to unlock legendary badges.
            </p>

            <div className="space-y-4">
              {achievementsList.map((badge) => {
                const isUnlocked = profile?.achievements?.includes(badge.id);
                const Icon = badge.icon;
                
                return (
                  <div 
                    key={badge.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                      isUnlocked 
                        ? "border-gold/30 bg-gold/5 text-white" 
                        : "border-white/5 bg-white/5 text-platinum/40"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isUnlocked ? "bg-gold/25 text-gold" : "bg-white/5 text-platinum/30"
                    }`}>
                      {isUnlocked ? (
                        <Icon className="w-5 h-5 text-gold" />
                      ) : (
                        <Lock className="w-4 h-4 text-platinum/30" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className={`text-xs font-semibold ${isUnlocked ? "text-white" : "text-platinum/50"}`}>{badge.title}</h4>
                        {isUnlocked && (
                          <span className="text-[8px] font-mono font-bold text-gold uppercase tracking-wider">Unlocked</span>
                        )}
                      </div>
                      <p className="text-[10px] text-platinum/40 mt-0.5 leading-relaxed">{badge.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
