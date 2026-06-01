"use client";

import { motion } from "framer-motion";
import GlassNavbar from "@/components/ui/GlassNavbar";
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  return (
    <main className="relative min-h-screen bg-[#020202] flex flex-col overflow-x-hidden selection:bg-gold/30">
      <GlassNavbar />

      {/* Cinematic Hero */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[150px] mix-blend-screen" />
          <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] mix-blend-screen" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight drop-shadow-2xl">
            Connect with <br/><span className="text-gold">Elite Aviation.</span>
          </h1>
          <p className="text-xl text-platinum/70 max-w-2xl mx-auto font-light leading-relaxed mb-12">
            Whether inquiring about our private fleet, seeking concierge assistance, or exploring enterprise partnerships, our global team is at your disposal 24/7.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
            <ContactCard icon={Phone} title="Global Support" detail="+1 (800) 555-0199" sub="Available 24/7" />
            <ContactCard icon={Mail} title="Charter Inquiry" detail="charter@skyluxe.com" sub="Response within 15 mins" />
            <ContactCard icon={MapPin} title="Headquarters" detail="Dubai, UAE" sub="Boulevard Plaza, Tower 1" />
          </div>
        </motion.div>
      </section>

      {/* Main Form & Global Offices */}
      <section className="relative py-20 px-6 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 glass-panel p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-[#FFF8DC] to-gold opacity-50" />
            <h2 className="text-3xl font-serif font-bold text-white mb-2">Submit an Inquiry</h2>
            <p className="text-platinum/50 font-light mb-8">Our aviation advisors will construct a tailored proposal.</p>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block font-medium">Full Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white placeholder-platinum/30 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all font-light outline-none" placeholder="Julian Sterling" />
                </div>
                <div>
                  <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block font-medium">Email Address</label>
                  <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white placeholder-platinum/30 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all font-light outline-none" placeholder="julian@company.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block font-medium">Inquiry Type</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all font-light outline-none appearance-none">
                    <option value="charter">Private Jet Charter</option>
                    <option value="membership">Elite Membership</option>
                    <option value="concierge">Concierge Services</option>
                    <option value="enterprise">Enterprise Partnership</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block font-medium">Preferred Aircraft</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all font-light outline-none appearance-none">
                    <option value="any">AI Recommended (Any)</option>
                    <option value="g650">Gulfstream G650ER</option>
                    <option value="global7500">Global 7500</option>
                    <option value="falcon8x">Falcon 8X</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-platinum/50 uppercase tracking-widest mb-2 block font-medium">Message & Special Requests</label>
                <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white placeholder-platinum/30 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all font-light outline-none resize-none" placeholder="Specify routing, catering preferences, or ground transportation requirements..."></textarea>
              </div>

              <button type="button" className="w-full py-5 rounded-xl bg-gold hover:bg-gold-light text-onyx font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 group mt-4">
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Transmit Request
              </button>
            </form>
          </motion.div>

          {/* Global Offices */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <h3 className="text-2xl font-serif font-bold text-white mb-2">Global Operations</h3>
            <p className="text-platinum/50 font-light mb-4">Our strategic hubs powering the aviation network.</p>

            <OfficeCard city="Dubai, UAE" desc="Global Headquarters & Fleet Operations. Boulevard Plaza." img="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop" />
            <OfficeCard city="London, UK" desc="European Hub & Concierge Management. Mayfair." img="https://images.unsplash.com/photo-1513635269975-5969336ac1cb?q=80&w=800&auto=format&fit=crop" />
            <OfficeCard city="New York, USA" desc="Americas Logistics & Financial Base. Manhattan." img="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop" />
          </motion.div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-32 px-6 bg-onyx z-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <HelpCircle className="w-12 h-12 text-gold mx-auto mb-6" />
            <h2 className="text-4xl font-serif font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-platinum/50 font-light">Direct answers regarding operations, billing, and memberships.</p>
          </div>

          <div className="space-y-4">
            <FAQItem question="How fast can an aircraft be deployed?" answer="For Signature and Founder's Club members, aircraft are guaranteed within 6 to 12 hours globally. Non-members typically require 24 to 48 hours notice depending on routing." />
            <FAQItem question="Are catering and ground transportation included?" answer="Standard catering is included on all flights. Elite Tier memberships include Michelin-star requested dining and complimentary helicopter or luxury chauffeur transfers at both departure and arrival." />
            <FAQItem question="How does the AI Concierge integrate with booking?" answer="Our Cortex AI analyzes your historical preferences, optimizing routes and automatically handling catering, hotel, and visa requirements without you needing to explicitly request them." />
            <FAQItem question="Do you accept cryptocurrency payments?" answer="Yes. Through our secure fintech gateway, we accept wire transfers, major credit cards, and select cryptocurrencies (USDC, BTC, ETH) for charter payments and membership dues." />
          </div>
        </div>
      </section>

    </main>
  );
}

function ContactCard({ icon: Icon, title, detail, sub }: any) {
  return (
    <div className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-gold/30 transition-colors group text-left">
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-gold/10 transition-colors">
        <Icon className="w-5 h-5 text-platinum/70 group-hover:text-gold transition-colors" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-gold font-medium mb-2">{detail}</p>
      <p className="text-platinum/40 text-xs font-light">{sub}</p>
    </div>
  );
}

function OfficeCard({ city, desc, img }: { city: string, desc: string, img: string }) {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 group flex h-32 hover:border-gold/30 transition-colors cursor-pointer">
      <div className="w-1/3 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2500&auto=format&fit=crop')] bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay" />
        <img src={img} alt={city} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" />
      </div>
      <div className="w-2/3 p-6 flex flex-col justify-center bg-onyx">
        <h4 className="text-xl font-serif text-white mb-1">{city}</h4>
        <p className="text-xs text-platinum/50 font-light leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full p-6 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
      >
        <span className="text-white font-medium">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-6 pt-0 text-platinum/60 font-light leading-relaxed border-t border-white/5 mt-2">
          {answer}
        </div>
      )}
    </div>
  );
}
