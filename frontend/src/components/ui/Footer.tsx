"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  
  // Hide footer on full-screen immersive pages
  if (pathname === '/fleet' || pathname === '/concierge') {
    return null;
  }

  return (
    <footer className="border-t border-white/10 bg-[#020202] pt-24 pb-12 z-20 relative">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-1">
          <span className="text-2xl font-serif font-bold text-white tracking-tight mb-6 block">SkyLuxe</span>
          <p className="text-platinum/50 text-sm font-light leading-relaxed">
            The world's most advanced luxury aviation platform. Elevating travel through artificial intelligence and unparalleled service.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-6">Ecosystem</h4>
          <ul className="space-y-4 text-platinum/50 text-sm font-light">
            <li><Link href="/fleet" className="hover:text-gold transition-colors">Private Jets</Link></li>
            <li><Link href="/concierge" className="hover:text-gold transition-colors">AI Concierge</Link></li>
            <li><Link href="/membership" className="hover:text-gold transition-colors">Elite Memberships</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-6">Company</h4>
          <ul className="space-y-4 text-platinum/50 text-sm font-light">
            <li><Link href="/about" className="hover:text-gold transition-colors">About Us</Link></li>
            <li><Link href="/investors" className="hover:text-gold transition-colors">Investor Relations</Link></li>
            <li><Link href="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-6">Global Offices</h4>
          <div className="space-y-4 text-platinum/50 text-sm font-light">
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gold"/> Dubai, UAE</p>
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gold"/> London, UK</p>
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gold"/> New York, USA</p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-platinum/40">
        <p>© 2026 SkyLuxe Aviation. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
