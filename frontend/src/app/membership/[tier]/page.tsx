"use client";

import { motion } from "framer-motion";
import GlassNavbar from "@/components/ui/GlassNavbar";
import { ArrowRight, Star, ShieldCheck, Zap, PlaneTakeoff, Navigation } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";

const tierData = {
  "silver": {
    name: "Silver Elite",
    price: "$15,000 / year",
    desc: "Essential access to the private aviation ecosystem. Designed for frequent domestic travelers across India and the GCC.",
    bgImage: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2500&auto=format&fit=crop",
    benefits: [
      { icon: Zap, title: "24-Hour Guarantee", desc: "Guaranteed aircraft recovery and deployment within 24 hours." },
      { icon: PlaneTakeoff, title: "Light Jet Access", desc: "Priority access to Light and Midsize jets across India and UAE." },
      { icon: Navigation, title: "Dedicated Advisor", desc: "A personal travel advisor available during business hours." }
    ]
  },
  "executive": {
    name: "Executive Tier",
    price: "$45,000 / year",
    desc: "The ultimate business aviation tool. Precision, speed, and elevated luxury for intercontinental travelers.",
    bgImage: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2500&auto=format&fit=crop",
    benefits: [
      { icon: Zap, title: "12-Hour Guarantee", desc: "Guaranteed aircraft recovery and deployment within 12 hours globally." },
      { icon: ShieldCheck, title: "Heavy Jet Access", desc: "Fixed hourly rates on heavy jets including Challenger 650." },
      { icon: Star, title: "Cortex AI Access", desc: "24/7 access to our AI Concierge for instant predictive itineraries." }
    ]
  },
  "black-elite": {
    name: "Black Elite",
    price: "Invitation Only",
    desc: "The apex of global aviation. Unrestricted access, bespoke experiences, and unparalleled priority.",
    bgImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2500&auto=format&fit=crop",
    benefits: [
      { icon: Zap, title: "6-Hour Guarantee", desc: "Immediate aircraft deployment globally within 6 hours." },
      { icon: PlaneTakeoff, title: "Ultra-Long Range", desc: "Primary access to Global 7500 and Gulfstream G650ER." },
      { icon: Star, title: "Bespoke Lifestyle", desc: "Complimentary helicopter transfers in Dubai and Mumbai." }
    ]
  }
};

export default function MembershipDetail() {
  const params = useParams();
  const tier = typeof params.tier === 'string' ? params.tier : 'silver';
  
  // @ts-ignore
  const data = tierData[tier] || tierData['silver'];

  return (
    <main className="relative min-h-screen bg-onyx flex flex-col overflow-x-hidden">
      <GlassNavbar />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center px-6 lg:px-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-onyx/80 z-10 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-onyx/50 to-onyx z-20" />
          <img src={data.bgImage} alt={data.name} className="w-full h-full object-cover opacity-60" />
        </div>

        <div className="relative z-30 max-w-4xl mx-auto w-full text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-2xl">
              {data.name}
            </h1>
            <p className="text-2xl text-gold font-medium mb-6">{data.price}</p>
            <p className="text-xl text-platinum/80 font-light max-w-2xl mx-auto leading-relaxed">
              {data.desc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-30 py-24 px-6 lg:px-16 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {data.benefits.map((benefit: any, idx: number) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-gold/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-6 border border-gold/20">
                <benefit.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
              <p className="text-platinum/60 font-light leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel p-10 md:p-16 rounded-3xl border border-gold/30 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Secure Your Status</h2>
          <p className="text-platinum/60 font-light max-w-xl mx-auto mb-10">
            Submit your application for the {data.name} tier. Our membership committee will review your profile and contact you within 24 hours.
          </p>
          <Link href={
            tier === "black-elite" 
              ? "/concierge" 
              : `/checkout?type=membership&id=${tier}&price=${tier === "executive" ? 45000 : 15000}`
          }>
            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-gold to-gold-light text-onyx font-bold text-lg hover:-translate-y-1 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center gap-3 mx-auto">
              {tier === "black-elite" ? "Request Executive Invitation" : "Proceed to Secure Checkout"} <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </motion.div>
      </section>

    </main>
  );
}
