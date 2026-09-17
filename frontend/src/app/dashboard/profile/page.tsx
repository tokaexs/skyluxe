"use client";

import { motion } from "framer-motion";
import { User, Globe, Coffee, Briefcase, Camera, Check, Loader2 } from "lucide-react";
import { useSkyLuxeStore } from "@/store/skyluxeStore";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Profile() {
  const { user, isLoaded } = useUser();
  const { profile, updateProfile, updatePreferences, syncUserFromClerk } = useSkyLuxeStore();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [residence, setResidence] = useState("");
  
  const [dietary, setDietary] = useState("");
  const [beverages, setBeverages] = useState("");
  const [groundTransport, setGroundTransport] = useState("");
  const [cabinAmbiance, setCabinAmbiance] = useState("");

  const [savingDetails, setSavingDetails] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Sync component state with Clerk user & global store profile on mount/change
  useEffect(() => {
    if (isLoaded && user) {
      syncUserFromClerk(user);
    }
  }, [user, isLoaded, syncUserFromClerk]);

  useEffect(() => {
    const clerkName = user?.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.username;
    const clerkEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress;
    const clerkPhone = user?.primaryPhoneNumber?.phoneNumber || user?.phoneNumbers?.[0]?.phoneNumber;

    setName(profile.name || clerkName || "");
    setEmail(profile.email || clerkEmail || "");
    setPhone(profile.phone || clerkPhone || "");
    setResidence(profile.residence || "Mumbai, IND");
    setDietary(profile.preferences?.dietary || "");
    setBeverages(profile.preferences?.beverages || "");
    setGroundTransport(profile.preferences?.groundTransport || "Luxury SUV (Cadillac Escalade / Range Rover)");
    setCabinAmbiance(profile.preferences?.cabinAmbiance || "");
  }, [profile, user]);

  const handleSaveDetails = async () => {
    setSavingDetails(true);
    try {
      await updateProfile({ name, phone, residence });
      if (user && name) {
        const nameParts = name.trim().split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";
        try {
          await user.update({ firstName, lastName });
        } catch (clerkErr) {
          console.log("Clerk name sync note:", clerkErr);
        }
      }
      setSuccessMsg("Personal details updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e) {
      console.error("Failed to update profile", e);
    } finally {
      setSavingDetails(false);
    }
  };

  const handleSavePrefs = async () => {
    setSavingPrefs(true);
    try {
      await updatePreferences({ dietary, beverages, groundTransport, cabinAmbiance });
      setSuccessMsg("In-flight preferences updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e) {
      console.error("Failed to update preferences", e);
    } finally {
      setSavingPrefs(false);
    }
  };

  const displayName = name || user?.fullName || profile?.name || "SkyLuxe Member";
  const initials = displayName 
    ? displayName.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().substring(0, 2) 
    : (email ? email.substring(0, 2).toUpperCase() : "SL");

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white mb-2">Profile & Preferences</h1>
        <p className="text-platinum/50 font-light text-sm">Manage your personal details, travel documents, and concierge preferences.</p>
      </div>

      {successMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gold/10 border border-gold/30 rounded-xl text-gold text-sm font-medium"
        >
          {successMsg}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center relative">
            <div className="w-32 h-32 mx-auto rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center relative mb-6 overflow-hidden">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-serif text-gold">{initials}</span>
              )}
            </div>
            <h2 className="text-2xl font-serif font-bold text-white mb-1">{displayName}</h2>
            <p className="text-platinum/50 text-sm mb-4">
              {profile?.membership && profile.membership !== "none" ? profile.membership.toUpperCase() : "Member"}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-medium border border-gold/20">
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
                <p className="text-white text-sm">{profile?.passport || "United States • ••••••892"}</p>
                <p className="text-platinum/40 text-xs mt-1">Exp: Oct 2030</p>
              </div>
              <button className="w-full py-2.5 rounded-xl border border-dashed border-white/20 text-platinum/60 hover:text-white hover:bg-white/5 transition-colors text-sm">
                + Add Visa / Secondary Passport
              </button>
            </div>
          </div>

          {/* Passport Summary & Achievements Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10">
            <h3 className="text-lg font-serif font-bold text-white mb-4 flex items-center justify-between">
              <span>Aviation Legacy</span>
              <Link href="/dashboard/passport" className="text-gold text-xs font-medium hover:underline">
                View Passport
              </Link>
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-white/5 rounded-xl text-center">
                <p className="text-lg font-bold text-white font-mono">{profile?.passportStats?.stamps?.length || 0}</p>
                <p className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Customs Stamps</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl text-center">
                <p className="text-lg font-bold text-white font-mono">{profile?.achievements?.length || 0}</p>
                <p className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Milestones</p>
              </div>
            </div>

            {/* Render 3 latest achievements */}
            <div className="space-y-3">
              <p className="text-[10px] text-platinum/40 uppercase tracking-widest font-mono">Unlocked Milestones</p>
              {profile?.achievements && profile.achievements.length > 0 ? (
                profile.achievements.slice(0, 3).map((ach: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-platinum/70 bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <span className="text-gold text-[10px]">✦</span>
                    <span className="font-medium text-white capitalize">{ach.replace(/_/g, " ")}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-platinum/40 italic">No milestones unlocked yet.</p>
              )}
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
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold/50 outline-none" 
                />
              </div>
              <div>
                <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-platinum/50 outline-none cursor-not-allowed" 
                />
              </div>
              <div>
                <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold/50 outline-none" 
                />
              </div>
              <div>
                <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block">Primary Residence</label>
                <input 
                  type="text" 
                  value={residence} 
                  onChange={(e) => setResidence(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold/50 outline-none" 
                />
              </div>
            </div>
            <button 
              onClick={handleSaveDetails}
              disabled={savingDetails}
              className="py-3 px-6 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors text-sm flex items-center gap-2"
            >
              {savingDetails && <Loader2 className="w-4 h-4 animate-spin text-white" />}
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
                <input 
                  type="text" 
                  value={dietary} 
                  onChange={(e) => setDietary(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold/50 outline-none" 
                />
              </div>
              <div>
                <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block">Favorite Beverages</label>
                <input 
                  type="text" 
                  value={beverages} 
                  onChange={(e) => setBeverages(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold/50 outline-none" 
                />
              </div>
              <div>
                <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block">Ground Transportation</label>
                <select 
                  value={groundTransport} 
                  onChange={(e) => setGroundTransport(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold/50 outline-none appearance-none"
                >
                  <option value="Luxury SUV (Cadillac Escalade / Range Rover)">Luxury SUV (Cadillac Escalade / Range Rover)</option>
                  <option value="Executive Sedan (Mercedes S-Class)">Executive Sedan (Mercedes S-Class)</option>
                  <option value="Helicopter Transfer (Where Available)">Helicopter Transfer (Where Available)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block">Cabin Ambiance</label>
                <textarea 
                  rows={3} 
                  value={cabinAmbiance} 
                  onChange={(e) => setCabinAmbiance(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold/50 outline-none resize-none" 
                />
              </div>
            </div>
            <button 
              onClick={handleSavePrefs}
              disabled={savingPrefs}
              className="mt-6 py-3 px-6 rounded-xl bg-gold text-onyx font-bold hover:bg-gold-light transition-colors text-sm shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center gap-2"
            >
              {savingPrefs && <Loader2 className="w-4 h-4 animate-spin text-onyx" />}
              Update Preferences
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
