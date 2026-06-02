"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Navigation, Plus, ShieldCheck, Clock, CheckCircle,
  HelpCircle, Shield, ChefHat, Building, Briefcase,
  Luggage, Compass, Heart, AlertCircle, ChevronDown, ChevronUp
} from "lucide-react";
import { useState } from "react";
import { useSkyLuxeStore, ConciergeRequest } from "@/store/skyluxeStore";

const requestTypeDetails: Record<string, { label: string; icon: any; desc: string }> = {
  "Chauffeur": { label: "Ground Chauffeur (Maybach)", icon: Navigation, desc: "Luxury ground transit via private fleet" },
  "Catering": { label: "In-Flight Catering (Michelin)", icon: ChefHat, desc: "Bespoke menu planning by partner chefs" },
  "Helicopter": { label: "Helicopter FBO Shuttle", icon: Compass, desc: "Avoid metropolitan traffic via sky routing" },
  "Security": { label: "Executive Protection Guard", icon: Shield, desc: "Discreet close protection operations" },
  "Private Chef": { label: "Private Chef Service", icon: ChefHat, desc: "Personal Michelin chef in your suite/villa" },
  "Private Security": { label: "Armed Security Convoy", icon: Shield, desc: "Secured tactical ground transport" },
  "Hotel Booking": { label: "Luxury Hotel Securing", icon: Building, desc: "Elite booking at partner luxury brands" },
  "Business Meeting": { label: "Meeting Hub Logistics", icon: Briefcase, desc: "Boardrooms & corporate operations setup" },
  "Airport Assistance": { label: "Airport VIP Escort", icon: Luggage, desc: "Fast-track customs & luggage handling" },
  "VIP Lounge": { label: "FBO Lounge Access", icon: Building, desc: "Priority entry to elite private terminals" },
  "Travel Insurance": { label: "Medical & Flight Indemnity", icon: Heart, desc: "Comprehensive luxury travel assurance" }
};

export default function ConciergeRequests() {
  const { conciergeRequests, addConciergeRequest } = useSkyLuxeStore();
  const [requestType, setRequestType] = useState<ConciergeRequest["type"]>("Chauffeur");
  const [detailsText, setDetailsText] = useState("");
  const [success, setSuccess] = useState(false);

  // Filtering and details state
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [expandedReq, setExpandedReq] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailsText.trim()) return;

    addConciergeRequest({
      type: requestType,
      details: detailsText,
    });

    setDetailsText("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const filteredRequests = statusFilter === "All"
    ? conciergeRequests
    : conciergeRequests.filter(req => req.status === statusFilter);

  return (
    <div className="space-y-8 flex-1 pb-12">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white mb-2">Concierge Log & Requests</h1>
        <p className="text-platinum/50 font-light text-sm">Monitor active FBO support assignments and coordinate ground handling logistics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column: Active Support Log */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-xl font-serif font-bold text-white">Active Support Deployments</h3>

            {/* Status Filter Chips */}
            <div className="flex flex-wrap gap-1.5 bg-white/5 border border-white/10 p-1 rounded-xl">
              {["All", "Pending", "Assigned", "In Progress", "Completed"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all ${statusFilter === st
                      ? "bg-gold text-onyx font-bold"
                      : "text-platinum/60 hover:text-white"
                    }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {filteredRequests.length > 0 ? (
            <div className="space-y-4">
              {filteredRequests.map((req) => {
                const isCompleted = req.status === "Completed";
                const isInProgress = req.status === "In Progress" || req.status === "In Transit" || req.status === "Assigned";
                const isExpanded = expandedReq === req.id;
                const typeData = requestTypeDetails[req.type] || { label: req.type, icon: Navigation, desc: "Special VIP Request" };
                const Icon = typeData.icon;

                return (
                  <div
                    key={req.id}
                    className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/5 hover:border-white/10 transition-all cursor-pointer"
                    onClick={() => setExpandedReq(isExpanded ? null : req.id)}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{typeData.label}</p>
                          <p className="text-platinum/50 text-xs mt-1 font-light leading-relaxed">{typeData.desc}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-auto">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-medium font-mono uppercase tracking-wider ${isCompleted
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : isInProgress
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse"
                              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          }`}>
                          {req.status}
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-platinum/50" /> : <ChevronDown className="w-4 h-4 text-platinum/50" />}
                      </div>
                    </div>

                    {/* Expanding Detail Block */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mt-6 pt-6 border-t border-white/5"
                        >
                          <div className="space-y-4 text-xs font-light text-platinum/70 leading-relaxed">
                            <div>
                              <p className="text-[10px] text-platinum/40 uppercase tracking-widest font-mono mb-1">Details & Scope</p>
                              <p className="text-white bg-white/5 p-4 rounded-xl border border-white/5 font-mono">{req.details}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-[10px] text-platinum/40 uppercase tracking-widest font-mono mb-1">Assigned Dispatcher</p>
                                <p className="text-white font-medium">SkyLuxe FBO Hub Agent</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-platinum/40 uppercase tracking-widest font-mono mb-1">Response Target</p>
                                <p className="text-white font-medium">Under 10 Minutes</p>
                              </div>
                            </div>

                            <div className="pt-4">
                              <p className="text-[10px] text-platinum/40 uppercase tracking-widest font-mono mb-3">Service Pipeline Activity</p>
                              <div className="relative border-l border-white/10 pl-4 ml-2 space-y-4">
                                <div className="relative">
                                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-green-500" />
                                  <p className="text-[10px] text-platinum/50 font-mono">17:27 — Request Logged</p>
                                  <p className="text-white text-xs mt-0.5 font-light">Sent to SkyLuxe Cortex operations</p>
                                </div>
                                <div className="relative">
                                  <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ${req.status !== "Pending" ? "bg-green-500" : "bg-white/10"}`} />
                                  <p className="text-[10px] text-platinum/50 font-mono">Pending — Dispatcher Assign</p>
                                  <p className="text-white text-xs mt-0.5 font-light">Ground handling agent matching</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-16 border border-dashed border-white/5 rounded-3xl text-center">
              <AlertCircle className="w-10 h-10 text-platinum/20 mx-auto mb-4" />
              <p className="text-white/60 text-sm font-medium">No matching support tasks assigned.</p>
              <p className="text-platinum/40 text-xs mt-1">Submit inquiries on the right, or filters above.</p>
            </div>
          )}
        </div>

        {/* Right Column: Submit Request Form */}
        <div className="lg:col-span-4">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 relative bg-onyx bg-gradient-to-br from-gold/5 to-transparent">
            <h3 className="text-lg font-serif font-bold text-white mb-6">Inquire Ground Support</h3>

            {success ? (
              <div className="py-8 text-center space-y-4">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto animate-pulse" />
                <h4 className="text-white font-medium">Request Logged</h4>
                <p className="text-platinum/50 text-xs font-light">Ground handling agents are updating your profile manifest.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1.5 block font-mono">Service Category</label>
                  <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white focus:border-gold/50 appearance-none font-light outline-none text-sm"
                  >
                    {Object.entries(requestTypeDetails).map(([key, item]) => (
                      <option key={key} value={key}>{item.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-1.5 block font-mono">Operational Details</label>
                  <textarea
                    rows={5}
                    required
                    value={detailsText}
                    onChange={(e) => setDetailsText(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-platinum/30 focus:border-gold/50 outline-none resize-none font-light text-sm"
                    placeholder="Specify flight PNR, guest counts, dietary constraints, or destination coordinates..."
                  />
                </div>
                <button type="submit" className="w-full py-4 rounded-xl bg-gold text-onyx font-bold hover:bg-gold-light transition-colors text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                  <Plus className="w-4 h-4" /> Dispatch Request
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
