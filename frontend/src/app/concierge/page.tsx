"use client";

import { motion, AnimatePresence } from "framer-motion";
import GlassNavbar from "@/components/ui/GlassNavbar";
import { Mic, Send, Sparkles, MapPin, Calendar, PlaneTakeoff, Navigation, Wind, ShieldCheck, ArrowRight, X, Activity } from "lucide-react";
import AtmosphericGlobe from "@/components/3d/AtmosphericGlobe";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  widget?: 'itinerary' | 'approval';
};

export default function ConciergeAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: 'ai',
      text: "Good evening, Mr. Sterling. I have analyzed your upcoming schedule. You have an executive summit in Dubai next Tuesday. I have pre-calculated the logistics from Mumbai (BOM) to Dubai (DWC).",
      widget: 'itinerary'
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [activeModal, setActiveModal] = useState<'routeOptimization' | 'approveRoute' | 'destinationBrief' | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setInputValue("");
    
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userMessage }]);
    setIsTyping(true);

    // Simulate AI thinking and responding
    setTimeout(() => {
      setIsTyping(false);
      
      let aiResponseText = "I have processed your request. The Gulfstream G650ER is available for immediate deployment.";
      let widgetType: any = undefined;

      if (userMessage.toLowerCase().includes("book") || userMessage.toLowerCase().includes("approve")) {
        aiResponseText = "Excellent. I have initiated the booking protocol for the Mumbai to Dubai route. Shall I finalize the transaction?";
        widgetType = 'approval';
      } else if (userMessage.toLowerCase().includes("hotel") || userMessage.toLowerCase().includes("stay")) {
        aiResponseText = "I highly recommend the Burj Al Arab or the Atlantis The Royal for your stay in Dubai. I can secure the Royal Suite immediately with your Founder's Club privileges.";
      }

      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: aiResponseText,
        widget: widgetType
      }]);
    }, 2500);
  };

  return (
    <div className="relative p-6 flex flex-col min-h-full selection:bg-gold/30">
      {/* Cinematic Globe Background inside layout */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] max-w-[1000px] max-h-[1000px] opacity-10 mix-blend-screen">
          <AtmosphericGlobe />
        </div>
      </div>

      <div className="flex-1 flex flex-col relative z-10">
        
        {/* Top Neural Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-between items-end mb-8 border-b border-white/10 pb-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-gold animate-pulse" />
              <span className="text-gold tracking-[0.2em] text-xs uppercase font-medium">SkyLuxe Cortex Intelligence</span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Executive AI Operator</h1>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs text-platinum/40 uppercase tracking-widest font-mono mb-1">System Status</p>
            <div className="flex items-center gap-2 text-sm text-green-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Intelligence Online
            </div>
          </div>
        </motion.div>

        {/* Multi-Panel AI Workspace */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
          
          {/* Left Panel: Proactive Intelligence */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar"
            data-lenis-prevent
          >
            <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/4" />
              <h3 className="text-xs text-platinum/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Navigation className="w-3 h-3 text-gold" /> Route Optimization
              </h3>
              <p className="text-white text-sm font-light mb-3 leading-relaxed">
                Congestion detected over the Arabian Sea. Rerouting BOM-DWC flight path to save 22 minutes and optimize fuel burn.
              </p>
              <button 
                onClick={() => setActiveModal('routeOptimization')}
                className="text-gold text-xs font-medium hover:text-white transition-colors flex items-center gap-1"
              >
                View Analytics & Optimize <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h3 className="text-xs text-platinum/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Wind className="w-3 h-3 text-gold" /> Destination Analytics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white text-sm">Dubai (DWC)</span>
                  <span className="text-platinum/50 text-xs">Clear • 28°C</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-gold rounded-full" />
                </div>
                <p className="text-xs text-platinum/60 font-light">Optimal VFR landing conditions at DWC for next 48 hours.</p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h3 className="text-xs text-platinum/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-gold" /> Membership Insight
              </h3>
              <div className="p-4 rounded-xl border border-gold/20 bg-gold/5 cursor-pointer hover:bg-gold/10 transition-colors" onClick={() => window.location.href='/membership/black-elite'}>
                <p className="text-gold text-sm font-medium mb-1">Black Elite Upgrade</p>
                <p className="text-platinum/60 text-xs font-light">Upgrading secures guaranteed 6-hour jet availability in Mumbai.</p>
              </div>
            </div>
          </motion.div>

          {/* Center Panel: The Intelligence Interface */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-6 glass-panel rounded-3xl border border-gold/20 shadow-[0_0_50px_rgba(212,175,55,0.05)] flex flex-col overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 pointer-events-none" />

            {/* Neural Chat History */}
            <div ref={chatRef} data-lenis-prevent className="flex-1 p-8 overflow-y-auto flex flex-col gap-8 relative z-10 custom-scrollbar scroll-smooth">
              
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${msg.sender === 'user' ? 'self-end flex-row-reverse max-w-[80%]' : 'max-w-[95%]'}`}
                  >
                    {msg.sender === 'ai' ? (
                      <div className="w-10 h-10 rounded-full bg-onyx border border-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.2)] flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-gold" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-bold">ES</span>
                      </div>
                    )}

                    <div className={`p-5 rounded-2xl ${msg.sender === 'ai' ? 'glass-panel border-white/10 rounded-tl-sm backdrop-blur-xl bg-onyx/60' : 'bg-gradient-to-br from-onyx-light to-onyx border border-white/10 rounded-tr-sm shadow-xl'}`}>
                      <p className="text-white leading-relaxed font-light">{msg.text}</p>
                      
                      {/* Widgets */}
                      {msg.widget === 'itinerary' && (
                        <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-gold text-xs uppercase tracking-widest font-mono">Proposed Itinerary</span>
                            <span className="text-platinum/40 text-xs font-mono">ID: SXL-892</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <div className="text-center">
                              <p className="text-2xl font-serif text-white">BOM</p>
                              <p className="text-xs text-platinum/50">Mumbai</p>
                            </div>
                            <div className="flex-1 flex flex-col items-center">
                              <PlaneTakeoff className="w-5 h-5 text-gold mb-1" />
                              <div className="w-full border-t border-dashed border-gold/30 relative">
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#111] px-2 text-[10px] text-platinum/60">3h 15m</span>
                              </div>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-serif text-white">DWC</p>
                              <p className="text-xs text-platinum/50">Dubai</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {msg.widget === 'approval' && (
                        <div className="mt-4">
                          <button 
                            onClick={() => setActiveModal('approveRoute')}
                            className="w-full py-3 rounded-xl bg-gold text-onyx font-bold hover:bg-gold-light transition-colors text-sm shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2"
                          >
                            Approve Flight Operations <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Processing Animation */}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-onyx border border-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.2)] flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-gold animate-spin-slow" />
                  </div>
                  <div className="glass-panel border-white/10 px-5 py-4 rounded-2xl rounded-tl-sm flex flex-col justify-center gap-2 w-64 bg-onyx/60">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce delay-75" />
                        <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce delay-150" />
                      </div>
                      <span className="text-xs text-gold uppercase tracking-widest font-mono">Synthesizing...</span>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>

            {/* Futuristic Input Console */}
            <div className="p-6 relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-2xl">
              <div className="flex gap-2 mb-4">
                <button onClick={() => setInputValue("Book a flight from Mumbai to Dubai for next week.")} className="px-3 py-1.5 rounded-full border border-white/10 text-platinum/60 hover:text-gold hover:border-gold/30 transition-colors text-xs font-light bg-white/5">
                  ✈️ Mumbai to Dubai
                </button>
                <button onClick={() => setInputValue("Recommend luxury hotels near Burj Al Arab.")} className="px-3 py-1.5 rounded-full border border-white/10 text-platinum/60 hover:text-gold hover:border-gold/30 transition-colors text-xs font-light bg-white/5">
                  🏨 Dubai Hotels
                </button>
              </div>
              <form onSubmit={handleSend} className="relative flex items-center">
                <button type="button" className="absolute left-4 p-2 text-gold hover:text-gold-light transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Initiate command, request a flight, or ask for global intelligence..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-16 text-white placeholder-platinum/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all font-light shadow-inner"
                />
                <button type="submit" disabled={!inputValue.trim()} className="absolute right-3 p-2.5 rounded-xl bg-gold text-onyx hover:bg-gold-light transition-colors shadow-[0_0_15px_rgba(212,175,55,0.4)] disabled:opacity-50">
                  <Send className="w-5 h-5 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>

          {/* Right Panel: Live Assets & Visuals */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto pl-2 custom-scrollbar"
            data-lenis-prevent
          >
            <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden relative group">
              <div className="h-40 bg-[url('https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-80 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <span className="px-2 py-1 rounded bg-black/50 backdrop-blur border border-white/10 text-[10px] text-gold uppercase tracking-widest mb-2 inline-block">Asset Ready</span>
                <h4 className="text-white font-serif text-xl">Global 7500</h4>
                <p className="text-xs text-platinum/50 mt-1">Available at Mumbai (BOM) VIP Terminal</p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-[100px] font-serif font-black text-white/5 rotate-12">DXB</div>
              <h3 className="text-xs text-platinum/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                <MapPin className="w-3 h-3 text-gold" /> Destination Brief
              </h3>
              <h4 className="text-2xl font-serif text-white mb-2">Dubai Marina</h4>
              <p className="text-sm text-platinum/70 font-light leading-relaxed mb-4">
                Global luxury hub. VIP terminals at Al Maktoum (DWC) are fully operational. Elite helicopter transfers to Palm Jumeirah available.
              </p>
              <button 
                onClick={() => setActiveModal('destinationBrief')}
                className="text-gold text-xs border-b border-gold/30 pb-0.5 hover:border-gold transition-colors"
              >
                View Full Briefing
              </button>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === 'routeOptimization' && (
          <ModalOverlay onClose={() => setActiveModal(null)} title="Intelligence: Route Optimization">
            <div className="p-6">
              <div className="relative h-64 rounded-2xl overflow-hidden border border-white/10 mb-6">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1500&auto=format&fit=crop')] bg-cover bg-center opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-onyx/90" />
                
                {/* SVG Route Line */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 20 80 Q 50 20 80 50" fill="none" stroke="rgba(212,175,55,0.8)" strokeWidth="0.5" strokeDasharray="1 1" className="animate-pulse" />
                  <circle cx="20" cy="80" r="1.5" fill="#D4AF37" />
                  <circle cx="80" cy="50" r="1.5" fill="#D4AF37" />
                </svg>

                <div className="absolute bottom-4 left-4 right-4 flex justify-between text-white">
                  <div>
                    <p className="text-2xl font-serif">BOM</p>
                    <p className="text-xs text-platinum/50">Mumbai, India</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-serif">DWC</p>
                    <p className="text-xs text-platinum/50">Dubai, UAE</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <Activity className="w-5 h-5 text-gold mb-2" />
                  <p className="text-xs text-platinum/50 uppercase">Fuel Efficiency</p>
                  <p className="text-lg text-green-400 font-medium">+14% Optimized</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <Wind className="w-5 h-5 text-gold mb-2" />
                  <p className="text-xs text-platinum/50 uppercase">Flight Time</p>
                  <p className="text-lg text-white font-medium">-22 Minutes</p>
                </div>
              </div>
            </div>
          </ModalOverlay>
        )}

        {activeModal === 'approveRoute' && (
          <ModalOverlay onClose={() => setActiveModal(null)} title="Approve Flight Operations">
            <div className="p-6 space-y-6">
              <div className="glass-panel p-5 rounded-2xl border border-gold/30 bg-gold/5 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">BOM <ArrowRight className="w-4 h-4 inline mx-1 text-gold" /> DWC</p>
                  <p className="text-xs text-platinum/50 mt-1">Gulfstream G650ER • 4 Passengers</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">$45,500</p>
                  <p className="text-xs text-platinum/50 mt-1">Estimated Cost</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-white">Concierge Add-ons</h4>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:border-gold/30 cursor-pointer transition-colors">
                  <input type="checkbox" className="accent-gold w-4 h-4" defaultChecked />
                  <div className="flex-1">
                    <p className="text-sm text-white">Helicopter Transfer to Palm Jumeirah</p>
                    <p className="text-xs text-platinum/50">+$2,100</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:border-gold/30 cursor-pointer transition-colors">
                  <input type="checkbox" className="accent-gold w-4 h-4" defaultChecked />
                  <div className="flex-1">
                    <p className="text-sm text-white">Michelin-grade In-Flight Catering</p>
                    <p className="text-xs text-platinum/50">Complimentary (Elite Tier)</p>
                  </div>
                </label>
              </div>

              <button 
                onClick={() => window.location.href='/checkout'}
                className="w-full py-4 rounded-xl bg-gold text-onyx font-bold text-lg hover:bg-gold-light transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                Proceed to Secure Checkout
              </button>
            </div>
          </ModalOverlay>
        )}

        {activeModal === 'destinationBrief' && (
          <ModalOverlay onClose={() => setActiveModal(null)} title="Intelligence: Dubai Marina Brief">
            <div className="relative h-48">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1500&auto=format&fit=crop')] bg-cover bg-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-onyx to-transparent" />
            </div>
            <div className="p-6 relative z-10 -mt-10">
              <h3 className="text-3xl font-serif font-bold text-white mb-2">Dubai, UAE</h3>
              <p className="text-platinum/60 text-sm leading-relaxed mb-6">
                The global epicenter of luxury. Al Maktoum International (DWC) offers seamless VIP clearance. We have secured priority landing slots for SkyLuxe members avoiding commercial airspace congestion.
              </p>
              <h4 className="text-sm font-medium text-gold mb-3 uppercase tracking-widest">SkyLuxe Partner Experiences</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-white">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold" /> VIP Access to Burj Al Arab helipad
                </li>
                <li className="flex items-center gap-3 text-sm text-white">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold" /> Reserved docking at Dubai Marina Yacht Club
                </li>
                <li className="flex items-center gap-3 text-sm text-white">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold" /> Exclusive tables at CE LA VI
                </li>
              </ul>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>

    </div>
  );
}

function ModalOverlay({ children, onClose, title }: { children: React.ReactNode, onClose: () => void, title: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="w-full max-w-lg glass-panel rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-onyx/80">
          <h3 className="text-sm font-medium text-platinum/80 uppercase tracking-widest">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div data-lenis-prevent className="overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
