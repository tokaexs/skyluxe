"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import GlassNavbar from "@/components/ui/GlassNavbar";
import {
  Sparkles, Navigation, Globe, Plane, Star, MapPin,
  Cpu, Calendar, Gift, ChevronRight, Zap
} from "lucide-react";
import { useSkyLuxeStore } from "@/store/skyluxeStore";

const conciergeNav = [
  { label: "AI Command Center", href: "/concierge", icon: Sparkles },
  { label: "Route Optimizer", href: "/concierge/route-optimizer", icon: Navigation },
  { label: "Destination Intel", href: "/concierge/destination-intelligence", icon: Globe },
  { label: "Aircraft Advisor", href: "/concierge/aircraft-advisor", icon: Plane },
  { label: "Membership Advisor", href: "/concierge/membership-advisor", icon: Star },
  { label: "Itinerary Builder", href: "/concierge/itinerary", icon: Calendar },
  { label: "Luxury Experiences", href: "/concierge/experiences", icon: Gift },
];

export default function ConciergeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { savedTrips, coins } = useSkyLuxeStore();

  return (
    <div className="relative min-h-screen bg-[#020202] flex flex-col">
      <GlassNavbar />

      {/* Neural background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="neural-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="1" fill="#D4AF37" />
              <line x1="40" y1="40" x2="80" y2="40" stroke="#D4AF37" strokeWidth="0.3" />
              <line x1="40" y1="40" x2="40" y2="80" stroke="#D4AF37" strokeWidth="0.3" />
              <line x1="40" y1="40" x2="80" y2="80" stroke="#D4AF37" strokeWidth="0.15" strokeDasharray="2 4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-grid)" />
        </svg>
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="flex flex-1 pt-20 relative z-10">
        {/* Left Sidebar */}
        <aside data-lenis-prevent className="w-72 shrink-0 h-[calc(100vh-5rem)] sticky top-20 overflow-y-auto border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col custom-scrollbar">
          {/* AI Status */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-gold" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">SkyLuxe Cortex</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[10px] text-green-400 font-mono uppercase tracking-widest">Intelligence Online</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gold/60 to-gold w-[78%] rounded-full" />
              </div>
              <span className="text-[10px] text-platinum/40 font-mono">78% Capacity</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 flex-1">
            <p className="text-[10px] text-platinum/30 uppercase tracking-[0.2em] font-mono mb-3 px-2">Modules</p>
            <div className="space-y-1">
              {conciergeNav.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer ${
                      isActive
                        ? "bg-gold/10 border border-gold/20"
                        : "hover:bg-white/5 border border-transparent"
                    }`}>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? "text-gold" : "text-platinum/40 group-hover:text-platinum/70"}`} />
                        <span className={`text-sm ${isActive ? "text-gold font-medium" : "text-platinum/60 group-hover:text-white"}`}>
                          {item.label}
                        </span>
                      </div>
                      {isActive && <ChevronRight className="w-3 h-3 text-gold/60" />}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Saved Trips */}
            {savedTrips.length > 0 && (
              <div className="mt-6">
                <p className="text-[10px] text-platinum/30 uppercase tracking-[0.2em] font-mono mb-3 px-2">Saved Trips</p>
                <div className="space-y-1">
                  {savedTrips.slice(0, 3).map((trip) => (
                    <div key={trip.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-all group">
                      <MapPin className="w-3.5 h-3.5 text-platinum/30 group-hover:text-gold transition-colors shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-platinum/60 group-hover:text-white truncate transition-colors">{trip.title}</p>
                        <p className="text-[10px] text-platinum/30">{trip.dates}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Coins footer */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gold/5 border border-gold/15">
              <Zap className="w-4 h-4 text-gold shrink-0" />
              <div>
                <p className="text-xs text-platinum/50 font-mono">Aviation Coins</p>
                <p className="text-white font-bold text-sm">{coins.toLocaleString()} SKY</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main data-lenis-prevent className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-5rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
