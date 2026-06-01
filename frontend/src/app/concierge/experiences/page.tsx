"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gift, Filter, Star, Clock, Compass, 
  ArrowRight, ShieldCheck, Check, Sparkles 
} from "lucide-react";
import { useSkyLuxeStore } from "@/store/skyluxeStore";

interface ExperienceItem {
  id: string;
  title: string;
  category: "Sea" | "Air" | "Gastronomy" | "Land" | "Wellness";
  cost: number;
  duration: string;
  rating: number;
  img: string;
  description: string;
  conciergeType: "Catering" | "Chauffeur" | "Security" | "Helicopter" | "Private Chef" | "Private Security" | "Hotel Booking" | "Business Meeting" | "Airport Assistance" | "VIP Lounge" | "Travel Insurance";
}

const experiencesList: ExperienceItem[] = [
  {
    id: "yacht-charter",
    title: "VVIP Private Yacht Charter",
    category: "Sea",
    cost: 3500,
    duration: "4 Hours",
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=600",
    description: "Cruise the coastline on an 85ft executive yacht with a dedicated deck crew, champagne reception, and custom sushi platters.",
    conciergeType: "Catering"
  },
  {
    id: "heli-shuttle",
    title: "Helicopter Airport FBO Shuttle",
    category: "Air",
    cost: 1200,
    duration: "15 Minutes",
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=600",
    description: "Avoid urban congestion. Board our Airbus ACH130 helicopter from the FBO tarmac directly to urban rooftop heliports.",
    conciergeType: "Helicopter"
  },
  {
    id: "michelin-chef",
    title: "Private Michelin-Star Chef Dinner",
    category: "Gastronomy",
    cost: 2500,
    duration: "3 Hours",
    rating: 5.0,
    img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600",
    description: "Secure a world-class chef to design a custom 7-course degustation menu in your private villa or corporate suite.",
    conciergeType: "Private Chef"
  },
  {
    id: "maybach-rental",
    title: "Supercar or Maybach Fleet Charter",
    category: "Land",
    cost: 1500,
    duration: "24 Hours",
    rating: 4.7,
    img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600",
    description: "Select from our Mercedes-Maybach S-Class or Lamborghini Aventador options, fully fueled and delivered to your FBO terminal.",
    conciergeType: "Chauffeur"
  },
  {
    id: "desert-safari",
    title: "VIP Royal Desert Safari",
    category: "Land",
    cost: 1800,
    duration: "6 Hours",
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600",
    description: "Dune driving in luxury Range Rovers, followed by a private royal oasis camp banquet, falconry shows, and live music.",
    conciergeType: "Hotel Booking"
  },
  {
    id: "resort-wellness",
    title: "Exclusive Cliffside Wellness Retreat",
    category: "Wellness",
    cost: 2800,
    duration: "Day Pass",
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600",
    description: "Spend a day at our partner cliffside sanctuary with therapeutic thermal springs, massage therapies, and organic menus.",
    conciergeType: "Hotel Booking"
  }
];

export default function LuxuryExperiences() {
  const { addConciergeRequest } = useSkyLuxeStore();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [successItem, setSuccessItem] = useState<string | null>(null);

  const filteredItems = activeCategory === "All" 
    ? experiencesList 
    : experiencesList.filter(item => item.category === activeCategory);

  const handleRequest = (item: ExperienceItem) => {
    addConciergeRequest({
      type: item.conciergeType,
      details: `Inquired luxury experience: ${item.title}. Duration: ${item.duration}. Total cost: $${item.cost.toLocaleString()}. Please coordinate bookings.`,
    });

    setSuccessItem(item.id);
    setTimeout(() => setSuccessItem(null), 3000);
  };

  return (
    <div className="p-8 space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Luxury Experiences</h1>
          <p className="text-platinum/50 font-light text-sm">
            Access private yacht charters, helicopter shuttles, Michelin chefs, and royal safari banquets curated by our FBO partners.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {["All", "Sea", "Air", "Gastronomy", "Land", "Wellness"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs border transition-all ${
                activeCategory === cat 
                  ? "bg-gold text-onyx font-bold border-gold" 
                  : "bg-white/5 border-white/10 text-platinum/60 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Experiences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isSuccess = successItem === item.id;
          return (
            <div 
              key={item.id}
              className="glass-panel rounded-3xl border border-white/5 bg-white/5 overflow-hidden hover:border-gold/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="h-48 relative overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-4 left-4 px-2 py-0.5 rounded bg-black/50 border border-white/10 text-[9px] text-platinum/50 uppercase tracking-widest font-mono">
                    {item.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-center text-xs text-platinum/40 font-mono">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gold" /> {item.duration}</span>
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-gold text-gold" /> {item.rating}</span>
                  </div>

                  <h3 className="text-white font-serif font-bold text-lg">{item.title}</h3>
                  <p className="text-platinum/60 text-xs font-light leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="flex justify-between items-center mb-4 pt-3 border-t border-white/5">
                  <span className="text-xs text-platinum/40 font-mono">Estimated cost</span>
                  <span className="text-white font-serif font-bold">${item.cost.toLocaleString()}</span>
                </div>

                <button 
                  onClick={() => handleRequest(item)}
                  disabled={isSuccess}
                  className={`w-full py-3 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-2 ${
                    isSuccess 
                      ? "bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]" 
                      : "bg-white/5 border border-white/10 hover:border-gold hover:bg-gold hover:text-onyx text-white"
                  }`}
                >
                  {isSuccess ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Concierge Log
                    </>
                  ) : (
                    <>
                      Request via Concierge <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
