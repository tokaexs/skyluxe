"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sliders, ToggleLeft, ToggleRight, Link as LinkIcon, Globe, MapPin, RefreshCw, X, Check, Edit3 } from "lucide-react";
import { api } from "@/lib/api";

interface Airline {
  id: string;
  airlineCode: string;
  airlineName: string;
  iataCode: string;
  icaoCode: string;
  logoUrl?: string;
  brandColor?: string;
  country: string;
  website?: string;
  alliance?: string;
  isActive: boolean;
}

export default function AdminAirlinesPage() {
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAirline, setEditingAirline] = useState<Airline | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    airlineCode: "",
    airlineName: "",
    iataCode: "",
    icaoCode: "",
    logoUrl: "",
    brandColor: "#D4AF37",
    country: "",
    website: "",
    alliance: "None"
  });

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const fetchAirlines = async () => {
    try {
      setIsLoading(true);
      const data = await api.get<Airline[]>("/admin/airlines");
      setAirlines(data || []);
    } catch (error) {
      console.error("Failed to load airlines:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAirlines();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAirlines();
    setIsRefreshing(false);
  };

  const handleToggleActive = async (airline: Airline) => {
    try {
      const updated = await api.patch<Airline>(`/admin/airlines/${airline.id}`, {
        isActive: !airline.isActive
      });
      if (updated) {
        setAirlines(prev => prev.map(a => a.id === airline.id ? { ...a, isActive: updated.isActive } : a));
      }
    } catch (error) {
      console.error("Failed to toggle active state:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!formData.airlineCode || !formData.airlineName || !formData.iataCode || !formData.icaoCode || !formData.country) {
      setFormError("Please fill out all required fields.");
      return;
    }

    try {
      const newAirline = await api.post<Airline>("/admin/airlines", formData);
      if (newAirline) {
        setFormSuccess("Airline registered successfully!");
        setAirlines(prev => [...prev, newAirline].sort((a, b) => a.airlineName.localeCompare(b.airlineName)));
        setFormData({
          airlineCode: "",
          airlineName: "",
          iataCode: "",
          icaoCode: "",
          logoUrl: "",
          brandColor: "#D4AF37",
          country: "",
          website: "",
          alliance: "None"
        });
        setTimeout(() => {
          setIsFormOpen(false);
          setFormSuccess("");
        }, 1500);
      }
    } catch (error: any) {
      setFormError(error.message || "Failed to create airline. Ensure codes are unique.");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAirline) return;
    setFormError("");
    setFormSuccess("");

    try {
      const updated = await api.patch<Airline>(`/admin/airlines/${editingAirline.id}`, {
        airlineName: editingAirline.airlineName,
        logoUrl: editingAirline.logoUrl,
        brandColor: editingAirline.brandColor,
        country: editingAirline.country,
        website: editingAirline.website,
        alliance: editingAirline.alliance
      });
      if (updated) {
        setFormSuccess("Airline branding updated successfully!");
        setAirlines(prev => prev.map(a => a.id === updated.id ? updated : a));
        setTimeout(() => {
          setEditingAirline(null);
          setFormSuccess("");
        }, 1500);
      }
    } catch (error: any) {
      setFormError(error.message || "Failed to update airline.");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Image load error fallback component
  const AirlineLogo = ({ logoUrl, airlineName, brandColor }: { logoUrl?: string; airlineName: string; brandColor?: string }) => {
    const [imageError, setImageError] = useState(!logoUrl);

    useEffect(() => {
      setImageError(!logoUrl);
    }, [logoUrl]);

    if (imageError) {
      return (
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white font-mono text-sm shadow-md"
          style={{ backgroundColor: brandColor || "#D4AF37" }}
        >
          {getInitials(airlineName)}
        </div>
      );
    }

    return (
      <img
        src={logoUrl}
        alt={airlineName}
        onError={() => setImageError(true)}
        className="w-12 h-12 rounded-xl object-contain bg-white/10 p-1 border border-white/10"
      />
    );
  };

  return (
    <div className="space-y-8 select-none">
      {/* Title block */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-white font-bold tracking-tight">Airline Registry Control</h1>
          <p className="text-platinum/50 text-sm mt-1">Configure brand parameters, colors, high-res logos, and global alliance statuses.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className={`p-3 rounded-xl border border-white/10 bg-white/5 text-platinum hover:text-white transition-all duration-300 ${isRefreshing ? 'animate-spin text-gold' : ''}`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => { setIsFormOpen(true); setEditingAirline(null); }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gold hover:bg-gold-light text-onyx font-bold transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.25)]"
          >
            <Plus className="w-5 h-5" /> Add Carrier
          </button>
        </div>
      </div>

      {/* Main Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-2 border-white/10 border-t-gold rounded-full animate-spin" />
        </div>
      ) : airlines.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/5">
          <Sliders className="w-12 h-12 text-platinum/30 mx-auto mb-4" />
          <h3 className="text-white font-serif text-lg font-bold">No Airlines Registered</h3>
          <p className="text-platinum/50 text-sm mt-1 max-w-sm mx-auto">Seed the database or use the Add Carrier button to create active airline listings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {airlines.map((airline) => (
            <motion.div
              key={airline.id}
              whileHover={{ y: -4 }}
              className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-gold/30 bg-onyx/40 backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between"
              style={{ borderLeft: `4px solid ${airline.brandColor || '#D4AF37'}` }}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <AirlineLogo
                    logoUrl={airline.logoUrl}
                    airlineName={airline.airlineName}
                    brandColor={airline.brandColor}
                  />
                  <div className="flex gap-2">
                    <span className="text-[10px] font-mono bg-white/5 border border-white/10 text-platinum/70 px-2 py-0.5 rounded">
                      IATA: {airline.iataCode}
                    </span>
                    <span className="text-[10px] font-mono bg-white/5 border border-white/10 text-platinum/70 px-2 py-0.5 rounded">
                      ICAO: {airline.icaoCode}
                    </span>
                  </div>
                </div>

                <h3 className="text-white font-serif font-bold text-lg mb-1 leading-snug">{airline.airlineName}</h3>
                <p className="text-platinum/40 text-xs font-mono mb-4">{airline.alliance || "No Alliance"}</p>

                <div className="space-y-2 border-t border-white/5 pt-4 text-xs text-platinum/60">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gold/60" />
                    <span>Country: {airline.country}</span>
                  </div>
                  {airline.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-gold/60" />
                      <a
                        href={`https://${airline.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline hover:text-white transition-colors"
                      >
                        {airline.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: airline.brandColor }} />
                    <span>Brand Hex: <span className="font-mono">{airline.brandColor}</span></span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-white/5 mt-6 pt-4">
                <button
                  onClick={() => handleToggleActive(airline)}
                  className="flex items-center gap-2 text-xs font-medium transition-colors"
                >
                  {airline.isActive ? (
                    <>
                      <ToggleRight className="w-6 h-6 text-green-500" />
                      <span className="text-green-500">Active</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-6 h-6 text-platinum/30" />
                      <span className="text-platinum/50">Disabled</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setEditingAirline(airline)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-gold bg-white/5 text-platinum hover:text-white transition-all text-xs font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 bg-[#000000]/70 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-onyx border border-white/10 rounded-2xl shadow-2xl p-8 relative overflow-hidden"
            >
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-6 right-6 p-1 text-platinum/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-serif text-white font-bold mb-2">Register Airline Brand</h2>
              <p className="text-platinum/50 text-xs mb-6">Create a new registry index. Values automatically update flight list representations.</p>

              {formError && (
                <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="p-3 mb-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2">
                  <Check className="w-4 h-4" /> {formSuccess}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-platinum/50 font-semibold tracking-wider uppercase mb-1 font-mono">Airline Code *</label>
                    <input
                      type="text"
                      placeholder="e.g. AI"
                      value={formData.airlineCode}
                      onChange={e => setFormData(prev => ({ ...prev, airlineCode: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-white rounded-xl focus:border-gold transition-colors outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-platinum/50 font-semibold tracking-wider uppercase mb-1 font-mono">Airline Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Air India"
                      value={formData.airlineName}
                      onChange={e => setFormData(prev => ({ ...prev, airlineName: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-white rounded-xl focus:border-gold transition-colors outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-platinum/50 font-semibold tracking-wider uppercase mb-1 font-mono">IATA Code *</label>
                    <input
                      type="text"
                      placeholder="e.g. AI"
                      value={formData.iataCode}
                      onChange={e => setFormData(prev => ({ ...prev, iataCode: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-white rounded-xl focus:border-gold transition-colors outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-platinum/50 font-semibold tracking-wider uppercase mb-1 font-mono">ICAO Code *</label>
                    <input
                      type="text"
                      placeholder="e.g. AIC"
                      value={formData.icaoCode}
                      onChange={e => setFormData(prev => ({ ...prev, icaoCode: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-white rounded-xl focus:border-gold transition-colors outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-platinum/50 font-semibold tracking-wider uppercase mb-1 font-mono">Logo URL</label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="https://..."
                        value={formData.logoUrl}
                        onChange={e => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-white rounded-xl focus:border-gold transition-colors outline-none text-sm"
                      />
                      <LinkIcon className="w-4 h-4 text-platinum/40 absolute left-3.5 top-3.5" />
                    </div>
                    {formData.logoUrl && (
                      <div className="shrink-0">
                        <AirlineLogo logoUrl={formData.logoUrl} airlineName={formData.airlineName} brandColor={formData.brandColor} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-platinum/50 font-semibold tracking-wider uppercase mb-1 font-mono">Brand Color (Hex)</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={formData.brandColor}
                        onChange={e => setFormData(prev => ({ ...prev, brandColor: e.target.value }))}
                        className="w-10 h-10 border border-white/10 bg-transparent rounded cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        placeholder="#D4AF37"
                        value={formData.brandColor}
                        onChange={e => setFormData(prev => ({ ...prev, brandColor: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white rounded-xl focus:border-gold transition-colors outline-none text-sm font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-platinum/50 font-semibold tracking-wider uppercase mb-1 font-mono">Country *</label>
                    <input
                      type="text"
                      placeholder="e.g. India"
                      value={formData.country}
                      onChange={e => setFormData(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-white rounded-xl focus:border-gold transition-colors outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-platinum/50 font-semibold tracking-wider uppercase mb-1 font-mono">Website</label>
                    <input
                      type="text"
                      placeholder="e.g. airindia.com"
                      value={formData.website}
                      onChange={e => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-white rounded-xl focus:border-gold transition-colors outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-platinum/50 font-semibold tracking-wider uppercase mb-1 font-mono">Alliance</label>
                    <select
                      value={formData.alliance}
                      onChange={e => setFormData(prev => ({ ...prev, alliance: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-white rounded-xl focus:border-gold transition-colors outline-none text-sm select-dark"
                    >
                      <option value="None">None</option>
                      <option value="Star Alliance">Star Alliance</option>
                      <option value="oneworld">oneworld</option>
                      <option value="SkyTeam">SkyTeam</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gold hover:bg-gold-light text-onyx font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] mt-6 text-sm"
                >
                  Submit Registry Record
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingAirline && (
          <div className="fixed inset-0 z-50 bg-[#000000]/70 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-onyx border border-white/10 rounded-2xl shadow-2xl p-8 relative overflow-hidden"
            >
              <button
                onClick={() => setEditingAirline(null)}
                className="absolute top-6 right-6 p-1 text-platinum/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-serif text-white font-bold mb-2">Edit {editingAirline.airlineName} branding</h2>
              <p className="text-platinum/50 text-xs mb-6">Modify airline properties and identity details. All updates propagate instantly.</p>

              {formError && (
                <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="p-3 mb-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2">
                  <Check className="w-4 h-4" /> {formSuccess}
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-platinum/50 font-semibold tracking-wider uppercase mb-1 font-mono">Airline Name *</label>
                  <input
                    type="text"
                    value={editingAirline.airlineName}
                    onChange={e => setEditingAirline(prev => prev ? { ...prev, airlineName: e.target.value } : null)}
                    className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-white rounded-xl focus:border-gold transition-colors outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-platinum/50 font-semibold tracking-wider uppercase mb-1 font-mono">Logo URL</label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={editingAirline.logoUrl || ""}
                        onChange={e => setEditingAirline(prev => prev ? { ...prev, logoUrl: e.target.value } : null)}
                        className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-white rounded-xl focus:border-gold transition-colors outline-none text-sm"
                      />
                      <LinkIcon className="w-4 h-4 text-platinum/40 absolute left-3.5 top-3.5" />
                    </div>
                    <div className="shrink-0">
                      <AirlineLogo logoUrl={editingAirline.logoUrl} airlineName={editingAirline.airlineName} brandColor={editingAirline.brandColor} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-platinum/50 font-semibold tracking-wider uppercase mb-1 font-mono">Brand Color (Hex)</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={editingAirline.brandColor || "#D4AF37"}
                        onChange={e => setEditingAirline(prev => prev ? { ...prev, brandColor: e.target.value } : null)}
                        className="w-10 h-10 border border-white/10 bg-transparent rounded cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={editingAirline.brandColor || ""}
                        onChange={e => setEditingAirline(prev => prev ? { ...prev, brandColor: e.target.value } : null)}
                        className="w-full bg-white/5 border border-white/10 px-4 py-2 text-white rounded-xl focus:border-gold transition-colors outline-none text-sm font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-platinum/50 font-semibold tracking-wider uppercase mb-1 font-mono">Country *</label>
                    <input
                      type="text"
                      value={editingAirline.country}
                      onChange={e => setEditingAirline(prev => prev ? { ...prev, country: e.target.value } : null)}
                      className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-white rounded-xl focus:border-gold transition-colors outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-platinum/50 font-semibold tracking-wider uppercase mb-1 font-mono">Website</label>
                    <input
                      type="text"
                      value={editingAirline.website || ""}
                      onChange={e => setEditingAirline(prev => prev ? { ...prev, website: e.target.value } : null)}
                      className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-white rounded-xl focus:border-gold transition-colors outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-platinum/50 font-semibold tracking-wider uppercase mb-1 font-mono">Alliance</label>
                    <select
                      value={editingAirline.alliance || "None"}
                      onChange={e => setEditingAirline(prev => prev ? { ...prev, alliance: e.target.value } : null)}
                      className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-white rounded-xl focus:border-gold transition-colors outline-none text-sm select-dark"
                    >
                      <option value="None">None</option>
                      <option value="Star Alliance">Star Alliance</option>
                      <option value="oneworld">oneworld</option>
                      <option value="SkyTeam">SkyTeam</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gold hover:bg-gold-light text-onyx font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] mt-6 text-sm"
                >
                  Save Branding Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
