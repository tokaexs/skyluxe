"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Compass, ShieldCheck } from "lucide-react";
import Link from "next/link";

const recommendations = [
  {
    id: "g700-rec",
    title: "Gulfstream G700 Availability",
    category: "Aircraft Recommendation",
    desc: "Voted optimal for your scheduled London trips. Restructures seating configs to fit your typical 5-passenger board manifests.",
    cta: "Configure Jet",
    link: "/fleet/gulfstream-g700"
  },
  {
    id: "burj-rec",
    title: "Burj Al Arab Suite Upgrade",
    category: "Resort Partnership",
    desc: "Founder's Club benefits allow complimentary upgrade to the Royal Suite on your next landing at Dubai (DWC).",
    cta: "Consult Concierge",
    link: "/concierge"
  },
  {
    id: "route-rec",
    title: "Seasonal Monsoon Routing",
    category: "Airspace Optimization",
    desc: "Cortex AI indicates weather systems over Mumbai airspace. Suggests alternate morning flight blocks to bypass delays.",
    cta: "View Operational Map",
    link: "/dashboard/trips"
  }
];

export default function AIRecommendations() {
  return (
    <div className="space-y-8 flex-1 pb-12">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white mb-2">Cortex AI Recommendations</h1>
        <p className="text-platinum/50 font-light text-sm">Review hyper-personalized route updates, matching private jets, and FBO hotel partnerships.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.map((rec) => (
          <div key={rec.id} className="glass-panel p-8 rounded-3xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent flex flex-col justify-between group">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                <span className="text-[10px] text-gold uppercase tracking-widest font-mono">{rec.category}</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-3">{rec.title}</h3>
              <p className="text-sm font-light text-platinum/70 leading-relaxed mb-6">{rec.desc}</p>
            </div>
            
            <Link href={rec.link} className="w-full">
              <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-gold hover:text-onyx hover:border-gold font-bold transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
                {rec.cta} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
