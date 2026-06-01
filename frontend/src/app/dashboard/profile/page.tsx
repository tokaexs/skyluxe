"use client";

import { motion } from "framer-motion";
import { User, Globe, Coffee, Briefcase, Camera, Check } from "lucide-react";

export default function Profile() {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white mb-2">Profile & Preferences</h1>
        <p className="text-platinum/50 font-light text-sm">Manage your personal details, travel documents, and concierge preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center relative">
            <div className="w-32 h-32 mx-auto rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center relative mb-6">
              <span className="text-4xl font-serif text-gold">ES</span>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-onyx border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white mb-1">Eashan Sterling</h2>
            <p className="text-platinum/50 text-sm mb-4">Founder's Club Member</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
              <Check className="w-3 h-3" /> Identity Verified
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/10">
            <h3 className="text-lg font-serif font-bold text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-gold" /> Travel Documents
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-xs text-platinum/50 uppercase tracking-widest mb-1">Primary Passport</p>
                <p className="text-white text-sm">United States • ••••••892</p>
                <p className="text-platinum/40 text-xs mt-1">Exp: Oct 2030</p>
              </div>
              <button className="w-full py-2.5 rounded-xl border border-dashed border-white/20 text-platinum/60 hover:text-white hover:bg-white/5 transition-colors text-sm">
                + Add Visa / Secondary Passport
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Preferences Form */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="glass-panel p-8 rounded-3xl border border-white/10">
            <h3 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-platinum/60" /> Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block">Full Name</label>
                <input type="text" defaultValue="Eashan Sterling" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold/50 outline-none" />
              </div>
              <div>
                <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block">Email Address</label>
                <input type="email" defaultValue="eashan@company.com" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold/50 outline-none" />
              </div>
              <div>
                <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block">Phone Number</label>
                <input type="tel" defaultValue="+1 (555) 019-9233" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold/50 outline-none" />
              </div>
              <div>
                <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block">Primary Residence</label>
                <input type="text" defaultValue="Mumbai, IND" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold/50 outline-none" />
              </div>
            </div>
            <button className="py-3 px-6 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors text-sm">
              Save Changes
            </button>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/10">
            <h3 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2">
              <Coffee className="w-5 h-5 text-platinum/60" /> Concierge & In-Flight Preferences
            </h3>
            <div className="space-y-6">
              <div>
                <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block">Dietary Requirements</label>
                <input type="text" defaultValue="No shellfish. Preferred sparkling water." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold/50 outline-none" />
              </div>
              <div>
                <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block">Favorite Beverages</label>
                <input type="text" defaultValue="Macallan 18, San Pellegrino, Espresso" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold/50 outline-none" />
              </div>
              <div>
                <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block">Ground Transportation</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold/50 outline-none appearance-none">
                  <option>Luxury SUV (Cadillac Escalade / Range Rover)</option>
                  <option>Executive Sedan (Mercedes S-Class)</option>
                  <option>Helicopter Transfer (Where Available)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block">Cabin Ambiance</label>
                <textarea rows={3} defaultValue="Dimmed lighting during night flights. Temperature set to 21°C." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold/50 outline-none resize-none" />
              </div>
            </div>
            <button className="mt-6 py-3 px-6 rounded-xl bg-gold text-onyx font-bold hover:bg-gold-light transition-colors text-sm shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              Update Preferences
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
