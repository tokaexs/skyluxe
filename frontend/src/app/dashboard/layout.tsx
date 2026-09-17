"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plane, LayoutDashboard, ShieldCheck, Wallet, User, Bell, LogOut, Gift, Star, Map, Navigation, Sparkles, Activity, Award, Home as HomeIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSkyLuxeStore } from "@/store/skyluxeStore";
import { useUser, UserButton } from "@clerk/nextjs";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { user, isLoaded } = useUser();
  const { notifications, fetchInitialData, profile, currency, setCurrency, syncUserFromClerk } = useSkyLuxeStore();
  
  useEffect(() => {
    if (fetchInitialData) {
      fetchInitialData();
    }
  }, [fetchInitialData]);

  useEffect(() => {
    if (isLoaded && user) {
      syncUserFromClerk(user);
    }
  }, [user, isLoaded, syncUserFromClerk]);

  const unreadNotifCount = notifications.filter(n => n.unread).length;

  const links = [
    { name: "Home", href: "/?landing=true", icon: HomeIcon },
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Flights", href: "/dashboard/flights", icon: Plane },
    { name: "Upcoming Trips", href: "/dashboard/trips", icon: Map },
    { name: "Wallet & Billing", href: "/dashboard/billing", icon: Wallet },
    { name: "Rewards & Coupons", href: "/dashboard/rewards", icon: Gift },
    { name: "Membership Center", href: "/dashboard/membership", icon: Star },
    { name: "Aviation Passport", href: "/dashboard/passport", icon: Award },
    { name: "Concierge Logs", href: "/dashboard/concierge", icon: Navigation },
    { name: "AI Recommendations", href: "/dashboard/recommendations", icon: Sparkles },
    { name: "Travel Analytics", href: "/dashboard/analytics", icon: Activity },
    { name: "Security Center", href: "/dashboard/security", icon: ShieldCheck },
    { name: "Profile & Specs", href: "/dashboard/profile", icon: User },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell, badge: unreadNotifCount },
  ];

  if (profile?.role === "admin") {
    links.push({ name: "Admin Airlines", href: "/dashboard/admin/airlines", icon: ShieldCheck });
  }

  // Allow admin to access the ARIS control tower
  if (profile?.role === "admin" || profile?.role === "executive" || profile?.role === "ceo") {
    links.push({ name: "Reintelligence (ARIS)", href: "/dashboard/aris", icon: Activity });
  }

  return (
    <div className="min-h-screen bg-onyx flex select-none">
      {/* Sidebar */}
      <aside id="tour-db-sidebar" data-lenis-prevent className="w-64 border-r border-white/10 bg-[#020202] flex flex-col relative z-20 shrink-0 h-screen sticky top-0 overflow-y-auto custom-scrollbar">
        <div className="p-8 pb-6">
          <Link href="/" className="text-2xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
            <Plane className="w-6 h-6 text-gold -rotate-45" /> SkyLuxe
          </Link>
          <span className="text-[9px] font-mono text-platinum/30 uppercase tracking-[0.25em] block mt-1">Aviation Operating System</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link key={link.name} href={link.href}>
                <span className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 font-light text-sm cursor-pointer ${isActive ? 'bg-gold/10 text-gold font-medium' : 'text-platinum/60 hover:bg-white/5 hover:text-white'}`}>
                  <span className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : 'text-platinum/40'}`} />
                    {link.name}
                  </span>
                  {link.badge && link.badge > 0 ? (
                    <span className="bg-gold text-onyx text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono">{link.badge}</span>
                  ) : null}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2 bg-black/40">
          <Link href="/?landing=true">
            <span className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gold hover:bg-gold/10 transition-all duration-300 font-medium text-sm cursor-pointer">
              <Plane className="w-4 h-4 -rotate-45" />
              Main Platform
            </span>
          </Link>
          <button onClick={logout} className="w-full text-left">
            <span className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-platinum/60 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 font-light text-sm cursor-pointer">
              <LogOut className="w-4 h-4 text-red-500/50" />
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main data-lenis-prevent className="flex-grow relative h-screen overflow-y-auto bg-onyx flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-10 border-b border-white/10 bg-onyx/85 backdrop-blur-md px-8 py-4 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-serif text-white font-medium">
            Command Center • Welcome, {user?.firstName ? user.firstName : profile?.name ? profile.name.split(" ")[0] : "Member"}
          </h2>
          
          <div className="flex items-center gap-4">
            {/* Membership Tier Badge */}
            {(() => {
              if (!profile || !profile.membership || profile.membership === "none") return null;
              const tier = profile.membership.toLowerCase().replace(" ", "_");
              if (tier === "black_elite") {
                return (
                  <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border border-black/80 bg-gradient-to-r from-neutral-900 to-black text-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                    ✦ Black Elite
                  </span>
                );
              }
              if (tier === "executive") {
                return (
                  <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border border-gold/40 bg-gradient-to-r from-gold/10 to-gold/20 text-gold shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                    ✦ Executive
                  </span>
                );
              }
              if (tier === "silver") {
                return (
                  <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border border-white/20 bg-gradient-to-r from-white/5 to-white/10 text-platinum">
                    ✦ Silver Club
                  </span>
                );
              }
              return null;
            })()}

            {/* Currency Toggle */}
            <div className="flex bg-white/5 border border-white/10 p-0.5 rounded-xl text-[10px]">
              <button 
                onClick={() => setCurrency("USD")}
                className={`px-2.5 py-1 rounded-lg transition-all ${currency === "USD" ? "bg-gold text-onyx font-bold" : "text-platinum/60 hover:text-white"}`}
              >
                USD ($)
              </button>
              <button 
                onClick={() => setCurrency("INR")}
                className={`px-2.5 py-1 rounded-lg transition-all ${currency === "INR" ? "bg-gold text-onyx font-bold" : "text-platinum/60 hover:text-white"}`}
              >
                INR (₹)
              </button>
            </div>

            <Link href="/dashboard/notifications">
              <button className="p-2 rounded-full hover:bg-white/5 text-platinum/60 hover:text-white transition-colors relative">
                <Bell className="w-5 h-5" />
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold rounded-full" />
                )}
              </button>
            </Link>
            
            <Link href="/dashboard/profile" className="flex items-center">
              {user?.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt={user?.fullName || profile?.name || "User Avatar"} 
                  className="w-9 h-9 rounded-full object-cover border border-gold/40 hover:border-gold shadow-[0_0_10px_rgba(212,175,55,0.2)] transition-all cursor-pointer" 
                />
              ) : (
                <div className="w-9 h-9 rounded-full border border-gold/30 bg-gold/10 flex items-center justify-center cursor-pointer hover:border-gold/60 transition-colors">
                  <span className="text-gold text-xs font-bold font-serif">
                    {profile?.avatar || (user?.firstName ? user.firstName[0] : "SL")}
                  </span>
                </div>
              )}
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 max-w-6xl mx-auto w-full flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
