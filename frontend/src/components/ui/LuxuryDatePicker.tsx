"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Sparkles, X } from "lucide-react";

interface LuxuryDatePickerProps {
  value: string; // "YYYY-MM-DD"
  onChange: (date: string) => void;
  className?: string;
  minDate?: string;
  placeholder?: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function LuxuryDatePicker({
  value,
  onChange,
  className = "",
  minDate,
  placeholder = "Select Date"
}: LuxuryDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial date or default to today / value
  const parsedDate = value ? new Date(value + "T00:00:00") : new Date();
  const validDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

  const [currentYear, setCurrentYear] = useState(validDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(validDate.getMonth());

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Sync view when value changes
  useEffect(() => {
    if (value) {
      const d = new Date(value + "T00:00:00");
      if (!isNaN(d.getTime())) {
        setCurrentYear(d.getFullYear());
        setCurrentMonth(d.getMonth());
      }
    }
  }, [value]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleSelectDate = (day: number) => {
    const formattedMonth = String(currentMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const newDateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    onChange(newDateStr);
    setIsOpen(false);
  };

  const setQuickPreset = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    onChange(`${y}-${m}-${day}`);
    setIsOpen(false);
  };

  // Calendar calculations
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Format value for display button
  const formattedDisplay = value ? (() => {
    const d = new Date(value + "T00:00:00");
    if (isNaN(d.getTime())) return placeholder;
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  })() : placeholder;

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === currentYear &&
    today.getMonth() === currentMonth &&
    today.getDate() === day;

  const isSelected = (day: number) => {
    if (!value) return false;
    const [y, m, d] = value.split("-").map(Number);
    return y === currentYear && m === currentMonth + 1 && d === day;
  };

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white/5 hover:bg-white/[0.08] border ${
          isOpen ? "border-gold ring-1 ring-gold/40 shadow-[0_0_20px_rgba(212,175,55,0.2)]" : "border-white/10 hover:border-gold/30"
        } rounded-xl p-4 text-left text-white transition-all flex items-center justify-between group cursor-pointer`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <Calendar className="w-4 h-4 text-gold group-hover:scale-110 transition-transform shrink-0" />
          <span className={`text-sm font-medium tracking-wide truncate ${value ? "text-white" : "text-platinum/40"}`}>
            {formattedDisplay}
          </span>
        </div>
        <span className="text-[10px] font-mono text-gold/80 px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20 shrink-0 uppercase tracking-widest hidden sm:inline-block">
          Select
        </span>
      </button>

      {/* Floating Glassmorphic Calendar Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 mt-3 z-50 w-[330px] sm:w-[350px] bg-[#09090c]/95 backdrop-blur-3xl border border-gold/30 rounded-3xl p-5 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(212,175,55,0.15)]"
          >
            {/* Ambient gold background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-[40px] pointer-events-none" />

            {/* Calendar Header with Month/Year Navigation */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 relative z-10">
              <div>
                <h4 className="text-white font-serif font-bold text-base tracking-tight">
                  {MONTH_NAMES[currentMonth]} <span className="text-gold">{currentYear}</span>
                </h4>
                <p className="text-[10px] font-mono text-platinum/40 uppercase tracking-widest">
                  Aviation Flight Schedule
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-gold/20 hover:text-gold text-platinum/70 transition-colors border border-white/5"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-gold/20 hover:text-gold text-platinum/70 transition-colors border border-white/5"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Day Names Row */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2 relative z-10">
              {DAY_NAMES.map((name, i) => (
                <span
                  key={name}
                  className={`text-[11px] font-mono font-bold uppercase py-1 ${
                    i === 0 || i === 6 ? "text-gold/80" : "text-platinum/40"
                  }`}
                >
                  {name}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center relative z-10">
              {/* Previous month trailing days */}
              {Array.from({ length: firstDayIndex }).map((_, i) => {
                const dayNum = daysInPrevMonth - firstDayIndex + i + 1;
                return (
                  <span
                    key={`prev-${i}`}
                    className="h-9 flex items-center justify-center text-xs text-zinc-600 font-mono"
                  >
                    {dayNum}
                  </span>
                );
              })}

              {/* Current month days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const active = isSelected(dayNum);
                const current = isToday(dayNum);

                return (
                  <button
                    key={`day-${dayNum}`}
                    type="button"
                    onClick={() => handleSelectDate(dayNum)}
                    className={`h-9 w-full flex flex-col items-center justify-center rounded-xl text-xs font-mono transition-all relative group cursor-pointer ${
                      active
                        ? "bg-gradient-to-r from-gold via-gold-light to-white text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.6)] scale-105 z-20"
                        : current
                        ? "bg-white/10 text-gold border border-gold/40 hover:bg-gold/20 font-bold"
                        : "text-platinum/90 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10"
                    }`}
                  >
                    <span>{dayNum}</span>
                    {current && !active && (
                      <span className="w-1 h-1 rounded-full bg-gold absolute bottom-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Aviation Presets Bar */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-1.5 relative z-10">
              <button
                type="button"
                onClick={() => setQuickPreset(0)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-gold/20 text-platinum/70 hover:text-gold text-[10px] font-mono uppercase tracking-wider transition-colors border border-white/5"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setQuickPreset(1)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-gold/20 text-platinum/70 hover:text-gold text-[10px] font-mono uppercase tracking-wider transition-colors border border-white/5"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => setQuickPreset(7)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-gold/20 text-platinum/70 hover:text-gold text-[10px] font-mono uppercase tracking-wider transition-colors border border-white/5"
              >
                +1 Week
              </button>
              <button
                type="button"
                onClick={() => setQuickPreset(30)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-gold/20 text-platinum/70 hover:text-gold text-[10px] font-mono uppercase tracking-wider transition-colors border border-white/5"
              >
                +1 Month
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
