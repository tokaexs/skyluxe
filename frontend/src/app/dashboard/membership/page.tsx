"use client";

import { motion } from "framer-motion";
import { Star, ShieldCheck, Zap, ArrowRight, Activity, Calendar } from "lucide-react";
import Link from "next/link";
import { useSkyLuxeStore } from "@/store/skyluxeStore";

export default function MembershipManagement() {
  const { profile } = useSkyLuxeStore();

  return (
    <div className="space-y-8 flex-1 pb-12">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white mb-2">Membership Management</h1>
        <p className="text-platinum/50 font-light text-sm">Manage your active subscription level, review elite benefits, and access exclusive partner programs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Active Card Status */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Elite Card Graphic */}
          <div className="glass-panel rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 via-onyx to-[#020202] p-8 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            
            <div className="flex justify-between items-start mb-16 relative z-10">
              <div>
                <span className="text-gold text-[10px] tracking-[0.25em] font-mono uppercase font-bold">SkyLuxe Sovereignty</span>
                <h3 className="text-3xl font-serif font-bold text-white mt-1">Executive Elite</h3>
              </div>
              <Star className="w-8 h-8 text-gold animate-pulse" />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
              <div>
                <p className="text-platinum/40 text-[10px] uppercase tracking-widest font-mono">Verified Cardholder</p>
                <p className="text-white font-medium text-lg mt-0.5">{profile.name}</p>
              </div>
              <div className="text-right">
                <p className="text-platinum/40 text-[10px] uppercase tracking-widest font-mono">Renewal Date</p>
                <p className="text-white font-medium font-mono text-sm mt-0.5">January 01, 2027</p>
              </div>
            </div>
          </div>

          {/* Active Tiers comparison list */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10">
            <h3 className="text-xl font-serif font-bold text-white mb-6">Upgrade Tier Availability</h3>
            <p className="text-platinum/50 text-xs mb-8">Upgrading triggers the secure payment gateway, instantly securing higher deployment guarantees and priority clearances.</p>
            
            <div className="space-y-6">
              <UpgradeRow tier="Executive Tier" price="$45,000 / year" availability="12-Hour Guarantee" id="executive" currentCost={45000} />
              <UpgradeRow tier="Signature Tier" price="$100,000 / year" availability="6-Hour Guarantee" id="signature" currentCost={100000} />
              <UpgradeRow tier="Founder's Club" price="Invitation Only" availability="Immediate dispatch" id="founders" currentCost={0} disabled />
            </div>
          </div>

        </div>

        {/* Right Column: Perks Log */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-onyx-light flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-serif font-bold text-white mb-6">Active Privileges</h3>
              <div className="space-y-4">
                <PrivilegeItem title="Guaranteed Jet dispatch" desc="Aircraft prepared within 12 hours." />
                <PrivilegeItem title="Michelin-Star Catering" desc="Elite cuisine selections onboard." />
                <PrivilegeItem title="Complimentary Maybach" desc="FBO ground chauffeur transfers." />
                <PrivilegeItem title="Pre-cleared Immigrations" desc="Zero-latency custom entries." />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function UpgradeRow({ tier, price, availability, id, currentCost, disabled }: any) {
  return (
    <div className="p-5 rounded-2xl border border-white/5 bg-white/5 hover:border-gold/30 hover:bg-white/10 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <p className="text-white font-medium">{tier}</p>
        <p className="text-gold text-xs font-mono mt-1">{price} • {availability}</p>
      </div>
      {disabled ? (
        <span className="text-[10px] text-platinum/30 border border-white/10 px-4 py-2 rounded-xl font-mono uppercase">Vetted Entry Only</span>
      ) : (
        <Link href={`/checkout?type=membership&id=${id}&price=${currentCost}`}>
          <button className="px-5 py-2 rounded-xl bg-gold/10 text-gold border border-gold/30 hover:bg-gold hover:text-onyx transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
            Upgrade Tier <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      )}
    </div>
  );
}

function PrivilegeItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center shrink-0 mt-0.5">
        <ShieldCheck className="w-3 h-3 text-gold" />
      </div>
      <div>
        <h4 className="text-white font-medium text-xs">{title}</h4>
        <p className="text-platinum/50 text-[10px] mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
