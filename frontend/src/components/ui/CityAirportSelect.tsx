"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, Search, ChevronDown, Check } from "lucide-react";
import { AIRPORTS, Airport, searchAirports } from "@/lib/airports";

interface CityAirportSelectProps {
  label?: string;
  value: string; // airport code e.g. "BOM" or formatted "Mumbai (BOM)"
  onChange: (value: string, airport: Airport) => void;
  placeholder?: string;
  className?: string;
}

export default function CityAirportSelect({
  label,
  value,
  onChange,
  placeholder = "Select City / Airport",
  className = ""
}: CityAirportSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find selected airport object
  const cleanCode = value?.includes("(") ? value.split("(")[1]?.replace(")", "").trim() : value?.trim();
  const selectedAirport = AIRPORTS.find(
    a => a.code.toUpperCase() === cleanCode?.toUpperCase() || `${a.city} (${a.code})` === value
  );

  const filtered = searchAirports(search);

  // Group filtered results by region
  const grouped = filtered.reduce<Record<string, Airport[]>>((acc, item) => {
    acc[item.region] = acc[item.region] || [];
    acc[item.region].push(item);
    return acc;
  }, {});

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (airport: Airport) => {
    onChange(`${airport.city} (${airport.code})`, airport);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-[10px] text-platinum/50 uppercase tracking-widest mb-2 flex items-center gap-1 font-mono">
          <MapPin className="w-3 h-3 text-gold shrink-0" /> {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/30 rounded-xl p-3.5 sm:p-4 text-left text-white transition-all flex items-center justify-between group focus:outline-none focus:border-gold/50"
      >
        <div className="flex items-center gap-2.5 truncate">
          <MapPin className="w-4 h-4 text-gold/70 group-hover:text-gold shrink-0" />
          <div className="truncate">
            <span className="font-semibold text-sm text-white block truncate">
              {selectedAirport ? `${selectedAirport.city} (${selectedAirport.code})` : value || placeholder}
            </span>
            {selectedAirport && (
              <span className="text-[10px] text-platinum/40 font-mono block truncate">
                {selectedAirport.name} • {selectedAirport.country}
              </span>
            )}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-platinum/40 group-hover:text-gold transition-transform duration-200 shrink-0 ml-2 ${isOpen ? "rotate-180 text-gold" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-[#0c0c10] border border-gold/30 rounded-2xl shadow-2xl backdrop-blur-2xl overflow-hidden max-h-80 flex flex-col animate-in fade-in zoom-in-95 duration-150 min-w-[280px]">
          {/* Search Header */}
          <div className="p-3 border-b border-white/10 bg-white/[0.02] sticky top-0 z-10 flex items-center gap-2">
            <Search className="w-4 h-4 text-gold shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Indian or World City / Code..."
              className="w-full bg-transparent border-none text-white text-xs placeholder-platinum/40 focus:outline-none font-mono"
              autoFocus
            />
          </div>

          {/* List Section */}
          <div className="overflow-y-auto flex-1 p-2 space-y-3 custom-scrollbar">
            {Object.keys(grouped).length === 0 ? (
              <div className="p-6 text-center text-xs text-platinum/40 font-mono">
                No matching cities found.
              </div>
            ) : (
              Object.entries(grouped).map(([region, airports]) => (
                <div key={region}>
                  <div className="px-3 py-1 text-[9px] font-mono uppercase tracking-widest text-gold/70 bg-gold/5 rounded-md mb-1">
                    {region} ({airports.length} {region === "India" ? "Cities / Hubs" : "Destinations"})
                  </div>
                  <div className="space-y-0.5">
                    {airports.map((airport) => {
                      const isSelected = selectedAirport?.code === airport.code;
                      return (
                        <button
                          key={airport.code}
                          type="button"
                          onClick={() => handleSelect(airport)}
                          className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between group ${
                            isSelected
                              ? "bg-gold/15 text-gold border border-gold/30"
                              : "hover:bg-white/5 text-platinum/80 hover:text-white"
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs text-white group-hover:text-gold transition-colors">
                                {airport.city}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white/5 rounded text-gold">
                                {airport.code}
                              </span>
                            </div>
                            <p className="text-[10px] text-platinum/40 truncate font-light mt-0.5">
                              {airport.name}
                            </p>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-gold shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
