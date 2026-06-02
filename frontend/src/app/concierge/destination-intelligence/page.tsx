"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, MapPin, Calendar, Compass, ShieldCheck, 
  Utensils, Hotel, ArrowRight, X, Sparkles, AlertCircle 
} from "lucide-react";
import Link from "next/link";

interface DestinationBrief {
  id: string;
  name: string;
  region: string;
  img: string;
  overview: string;
  bestTime: string;
  airport: string;
  hotels: string[];
  dining: string[];
  experiences: string[];
  aiNotes: string;
  itineraryUrl: string;
}

const destinationsData: Record<string, DestinationBrief> = {
  "dubai-marina": {
    id: "dubai-marina",
    name: "Dubai Marina",
    region: "United Arab Emirates",
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800",
    overview: "A premium waterfront community known for its high-rise luxury towers, yacht charters, and premium shopping walks.",
    bestTime: "November to March (24°C average)",
    airport: "Al Maktoum International (DWC) - VIP Terminal",
    hotels: ["The Ritz-Carlton Dubai", "Address Beach Resort", "Grosvenor House"],
    dining: ["Marina Social by Jason Atherton", "Buddha-Bar", "Asia Asia"],
    experiences: ["Private Yacht Charter", "Skydiving over Palm Jumeirah", "Dinner in the Sky"],
    aiNotes: "Highly recommended for business travel extensions. Direct helicopter transfer from DWC FBO takes 6 minutes.",
    itineraryUrl: "/concierge/itinerary?destination=Dubai%20Marina&style=luxury"
  },
  "palm-jumeirah": {
    id: "palm-jumeirah",
    name: "Palm Jumeirah",
    region: "United Arab Emirates",
    img: "https://images.unsplash.com/photo-1582948632812-d0c3c6f8515e?q=80&w=800",
    overview: "The world-famous tree-shaped artificial archipelago featuring premium luxury villas, private beach clubs, and ultra-high-end resorts.",
    bestTime: "October to April",
    airport: "Dubai International (DXB) or Al Maktoum (DWC)",
    hotels: ["Atlantis The Royal", "One&Only The Palm", "Jumeirah Zabeel Saray"],
    dining: ["Ossiano (Michelin Star)", "Nobu The Palm", "Tasca by José Avillez"],
    experiences: ["Helicopter Island Flyover", "Private Beach Club Cabana", "Yacht Cruise Around the Outer Crescent"],
    aiNotes: "Maximum exclusivity. Atlantis The Royal penthouse suite booking includes complimentary Rolls-Royce Phantom chauffeur.",
    itineraryUrl: "/concierge/itinerary?destination=Palm%20Jumeirah&style=leisure"
  },
  "downtown-dubai": {
    id: "downtown-dubai",
    name: "Downtown Dubai",
    region: "United Arab Emirates",
    img: "https://images.unsplash.com/photo-1546412414-e1885261b951?q=80&w=800",
    overview: "The bustling core of Dubai's luxury shopping, dining, and landmarks, anchored by the iconic Burj Khalifa.",
    bestTime: "November to February",
    airport: "Dubai International (DXB) - Executive Lounge",
    hotels: ["Armani Hotel Dubai", "The Palace Downtown", "Address Boulevard"],
    dining: ["At.mosphere Burj Khalifa", "L'Olivo at Al Mahara", "Coya Dubai"],
    experiences: ["Burj Khalifa Sky Lounge VIP Access", "Dubai Mall Private Personal Shopper Tour", "Dubai Fountain Private Boardwalk Tour"],
    aiNotes: "Ideal for fast-paced diplomatic or investment summits. Core financial centers are within 5 minutes transit.",
    itineraryUrl: "/concierge/itinerary?destination=Downtown%20Dubai&style=business"
  },
  "mumbai": {
    id: "mumbai",
    name: "Colaba & Marine Drive",
    region: "Mumbai, India",
    img: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=800",
    overview: "Historic South Mumbai featuring Victorian-gothic architecture, active art districts, and iconic views along the Arabian Sea.",
    bestTime: "December to February",
    airport: "Chhatrapati Shivaji Maharaj (BOM) - General Aviation Terminal",
    hotels: ["The Taj Mahal Palace", "The Oberoi Mumbai", "InterContinental Marine Drive"],
    dining: ["Wasabi by Morimoto", "Ziya", "The Table Colaba"],
    experiences: ["Elephanta Caves Private Yacht Charter", "Heritage Architectural Walk", "Art Gallery Private Viewings"],
    aiNotes: "Taj Palace suite bookings include private butler service. FBO handling at BOM accommodates instant baggage customs clearance.",
    itineraryUrl: "/concierge/itinerary?destination=Mumbai&style=culture"
  },
  "delhi": {
    id: "delhi",
    name: "Lutyens' Delhi",
    region: "Delhi, India",
    img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800",
    overview: "The elite political and diplomatic center of India's capital, styled with grand avenues and monumental architectural landmarks.",
    bestTime: "November to March",
    airport: "Indira Gandhi International (DEL) - VIP Terminal 3",
    hotels: ["The Leela Palace New Delhi", "The Imperial New Delhi", "The Oberoi New Delhi"],
    dining: ["Indian Accent (Asia's Top 50)", "Bukhara", "Orient Express"],
    experiences: ["Humayun's Tomb Private Sunrise Visit", "National Gallery of Modern Art Private Tour", "Presidential Estate VIP Access"],
    aiNotes: "Maximum security zone. SkyLuxe can coordinate bulletproof Mercedes-Maybach convoys for diplomatic delegations.",
    itineraryUrl: "/concierge/itinerary?destination=Delhi&style=diplomatic"
  },
  "goa": {
    id: "goa",
    name: "North Goa Beaches",
    region: "Goa, India",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
    overview: "Sought-after beach retreats featuring high-end private villas, luxury wellness resorts, and vibrant beachfront dining.",
    bestTime: "November to February",
    airport: "Mopa International (GOX) - VIP Lounge",
    hotels: ["W Goa", "Taj Exotica Resort & Spa", "St. Regis Goa Resort"],
    dining: ["Gunpowder", "Thalassa", "Cavatina Cuchina"],
    experiences: ["Private Catamaran Charter", "Old Goa Heritage Church Private Flyover", "Spiritual Healing Beach Retreat"],
    aiNotes: "Recommended for leisure and corporate retreats. Mopa Airport VIP handling offers quick helicopter shuttles to South Goa.",
    itineraryUrl: "/concierge/itinerary?destination=Goa&style=leisure"
  },
  "udaipur": {
    id: "udaipur",
    name: "Lake Pichola",
    region: "Udaipur, India",
    img: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?q=80&w=800",
    overview: "The 'Venice of the East', famed for grand palaces rising from deep blue lakes, ancient temples, and dramatic Mewar history.",
    bestTime: "October to March",
    airport: "Maharana Pratap Airport (UDR) - Ground Support Handling",
    hotels: ["Taj Lake Palace", "The Oberoi Udaivilas", "Raffles Udaipur"],
    dining: ["Sheesh Mahal (Al Fresco Lakefront)", "Ambrai Restaurant", "Upre by 1559 AD"],
    experiences: ["Royal Lake Pichola Boat Cruise", "City Palace Museum Private VIP Curator Tour", "Jagmandir Island Royal Banquet"],
    aiNotes: "Udaivilas features helipads on-site. SkyLuxe can arrange direct helicopter transfers from BOM/DEL to Udaipur.",
    itineraryUrl: "/concierge/itinerary?destination=Udaipur&style=heritage"
  },
  "bangalore": {
    id: "bangalore",
    name: "Indiranagar & CBD",
    region: "Bangalore, India",
    img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=800",
    overview: "The technology capital of India, presenting a blend of greenery, high-tech industrial parks, and high-end modern microbreweries.",
    bestTime: "September to February",
    airport: "Kempegowda International (BLR) - General Aviation Terminal",
    hotels: ["The Ritz-Carlton Bangalore", "The Leela Palace Bangalore", "Four Seasons at Embassy ONE"],
    dining: ["The Leela Lantern", "Karavalli", "Riwaz"],
    experiences: ["Private Flight Academy Day Tour", "Bannerghatta National Park VIP Safari Tour", "Artisanal Coffee Estate Day Charter"],
    aiNotes: "Perfect for venture capital summits. BLR FBO features automated visa checks for fast-track international arrivals.",
    itineraryUrl: "/concierge/itinerary?destination=Bangalore&style=business"
  }
};

export default function DestinationIntelligence() {
  const [selectedDest, setSelectedDest] = useState<DestinationBrief | null>(null);

  return (
    <div className="p-8 space-y-8 pb-20 relative">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white mb-2">Destination Intelligence</h1>
        <p className="text-platinum/50 font-light text-sm">
          Get real-time operational insights, curated luxury recommendations, and travel guidelines for major hubs.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.values(destinationsData).map((dest) => (
          <div 
            key={dest.id}
            onClick={() => setSelectedDest(dest)}
            className="glass-panel rounded-3xl border border-white/5 bg-white/5 overflow-hidden group cursor-pointer hover:border-gold/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-300 flex flex-col"
          >
            <div className="h-44 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/30 to-transparent z-10" />
              <img 
                src={dest.img} 
                alt={dest.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 mix-blend-luminosity group-hover:mix-blend-normal"
              />
              <span className="absolute top-4 left-4 z-20 px-2 py-0.5 rounded bg-black/50 border border-white/10 text-[9px] text-platinum/50 uppercase tracking-widest font-mono">
                {dest.region}
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-white font-medium text-lg font-serif mb-2 group-hover:text-gold transition-colors">{dest.name}</h4>
                <p className="text-platinum/60 text-xs font-light leading-relaxed line-clamp-2">{dest.overview}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gold font-medium">
                <span>View Intelligence Brief</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-In Details Panel */}
      <AnimatePresence>
        {selectedDest && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDest(null)}
              className="fixed inset-0 bg-black z-[100] cursor-pointer pt-20"
            />
            {/* Sheet */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-[#090909]/95 backdrop-blur-2xl border-l border-white/10 z-[101] shadow-2xl overflow-y-auto pt-28 pb-12 px-8 flex flex-col justify-between custom-scrollbar"
              data-lenis-prevent
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] text-gold uppercase tracking-widest font-mono">Hub Analytics Summary</span>
                  <button 
                    onClick={() => setSelectedDest(null)}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-platinum/50 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="h-64 rounded-2xl overflow-hidden relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent z-10" />
                  <img src={selectedDest.img} alt={selectedDest.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="text-gold text-[10px] uppercase tracking-widest font-mono block mb-1">{selectedDest.region}</span>
                    <h2 className="text-3xl font-serif font-bold text-white">{selectedDest.name}</h2>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-platinum/50 text-xs uppercase tracking-widest font-mono mb-2">Overview</p>
                    <p className="text-white font-light text-sm leading-relaxed">{selectedDest.overview}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <Calendar className="w-4 h-4 text-gold mb-2" />
                      <p className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">Best Season</p>
                      <p className="text-white text-xs font-medium mt-0.5">{selectedDest.bestTime}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <Compass className="w-4 h-4 text-gold mb-2" />
                      <p className="text-[10px] text-platinum/50 uppercase tracking-widest font-mono">FBO Airport Hub</p>
                      <p className="text-white text-xs font-medium mt-0.5">{selectedDest.airport}</p>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-6 space-y-4">
                    <div>
                      <h5 className="text-sm font-serif font-medium text-white flex items-center gap-2 mb-3">
                        <Hotel className="w-4 h-4 text-gold" /> Curated Hospitality
                      </h5>
                      <ul className="space-y-2">
                        {selectedDest.hotels.map((hotel, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-platinum/70">
                            <span className="w-1.5 h-1.5 bg-gold rounded-full shrink-0" />
                            {hotel}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-sm font-serif font-medium text-white flex items-center gap-2 mb-3">
                        <Utensils className="w-4 h-4 text-gold" /> Gastronomy Picks
                      </h5>
                      <ul className="space-y-2">
                        {selectedDest.dining.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-platinum/70">
                            <span className="w-1.5 h-1.5 bg-gold rounded-full shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-6">
                    <div className="p-4 rounded-2xl bg-gold/5 border border-gold/15 flex gap-3">
                      <Sparkles className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gold font-medium">Cortex Advisor Intelligence</p>
                        <p className="text-platinum/60 text-xs mt-1 leading-relaxed font-light">{selectedDest.aiNotes}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <Link href={selectedDest.itineraryUrl} className="block">
                  <button className="w-full py-4 rounded-xl bg-gold text-onyx font-bold hover:bg-gold-light transition-colors text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                    Generate Curated Itinerary <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
