"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Smartphone, Key, History, AlertTriangle, Monitor, Fingerprint } from "lucide-react";

export default function Security() {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white mb-2">Security Center</h1>
        <p className="text-platinum/50 font-light text-sm">Manage your authentication methods, active sessions, and account protection settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Two-Factor Authentication */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                <Smartphone className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-white mb-1">Two-Factor Authentication (2FA)</h3>
                <p className="text-platinum/50 text-sm font-light leading-relaxed">Protect your account with an extra layer of security. Once configured, you'll be required to enter both your password and an authentication code from your mobile phone in order to sign in.</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-white font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Authenticator App
                </p>
                <p className="text-platinum/50 text-sm mt-1">Configured on iPhone 15 Pro</p>
              </div>
              <button className="px-5 py-2 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-colors text-sm">
                Manage App
              </button>
            </div>
          </div>

          {/* Password Management */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <Key className="w-6 h-6 text-platinum/70" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-white mb-1">Password</h3>
                <p className="text-platinum/50 text-sm font-light">Last changed 4 months ago.</p>
              </div>
            </div>

            <form className="space-y-4 max-w-md">
              <div>
                <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold/50 outline-none" />
              </div>
              <div>
                <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold/50 outline-none" />
              </div>
              <button type="button" className="py-3 px-6 rounded-xl bg-gold text-onyx font-bold hover:bg-gold-light transition-colors mt-2">
                Update Password
              </button>
            </form>
          </div>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Active Sessions */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10">
            <h3 className="text-lg font-serif font-bold text-white mb-6 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-gold" /> Active Sessions
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 border-b border-white/5 pb-4">
                <Monitor className="w-8 h-8 text-platinum/50 shrink-0" />
                <div>
                  <p className="text-white text-sm font-medium">MacBook Pro 16"</p>
                  <p className="text-platinum/50 text-xs mt-1">Mumbai, IND • Current Session</p>
                  <p className="text-green-400 text-xs mt-1">Active Now</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Smartphone className="w-8 h-8 text-platinum/50 shrink-0" />
                <div>
                  <p className="text-white text-sm font-medium">iPhone 15 Pro Max</p>
                  <p className="text-platinum/50 text-xs mt-1">Dubai, UAE • Safari Browser</p>
                  <p className="text-platinum/40 text-xs mt-1">Active 2 hours ago</p>
                </div>
                <button className="ml-auto text-xs text-red-400 hover:text-red-300">Revoke</button>
              </div>
            </div>
            
            <button className="w-full mt-6 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium">
              Sign Out All Other Devices
            </button>
          </div>

          {/* Security Alert Log */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-onyx-light">
            <h3 className="text-lg font-serif font-bold text-white mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-platinum/50" /> Recent Security Events
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Fingerprint className="w-4 h-4 text-gold mt-0.5" />
                <div>
                  <p className="text-white text-sm">Biometric Login</p>
                  <p className="text-platinum/50 text-xs">Today at 09:41 AM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-white text-sm">New Device Recognized</p>
                  <p className="text-platinum/50 text-xs">Oct 01, 2026 at 14:20 PM</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
