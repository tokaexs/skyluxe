"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Compass, Sparkles, X, ChevronRight, ChevronLeft, HelpCircle } from "lucide-react";

interface TourStep {
  targetId: string | null;
  title: string;
  description: string;
  position: "bottom" | "top" | "center" | "right";
}

const LANDING_TOUR_STEPS: TourStep[] = [
  {
    targetId: null,
    title: "Sovereign Airspace Awaits",
    description: "Welcome to SkyLuxe, the next-generation operating system for luxury aviation. Let us guide you through your personalized flight operations hub.",
    position: "center",
  },
  {
    targetId: "tour-nav",
    title: "Integrated Flight Operations",
    description: "Coordinate premium travel options across commercial first-class partners, browse the private charter fleet, trigger AI concierge dispatches, or manage your elite membership tiers.",
    position: "bottom",
  },
  {
    targetId: "tour-currency",
    title: "Seamless Multi-Currency Toggles",
    description: "Convert pricing from USD ($) to INR (₹) in real-time. This instantly recalculates all flight rates, charter quotes, and wallet transactions.",
    position: "bottom",
  },
  {
    targetId: "tour-signin",
    title: "Digital Credentials & Authorization",
    description: "Authenticate to access your private flight dashboard, log passport stamps, track achievements, and manage your SkyCoins points balance.",
    position: "bottom",
  },
];

const DASHBOARD_TOUR_STEPS: TourStep[] = [
  {
    targetId: null,
    title: "Sovereign Command Center",
    description: "Welcome to your executive operations dashboard. Here you can monitor active flight dispatches, audit travel stats, and manage financial settlements.",
    position: "center",
  },
  {
    targetId: "tour-db-sidebar",
    title: "Integrated Subsystems Navigation",
    description: "Access and navigate all active modules—track upcoming trips, browse rewards vouchers, review passport achievements, and view real-time travel analytics.",
    position: "right",
  },
  {
    targetId: "tour-db-metrics",
    title: "Real-time Telemetry Metrics",
    description: "Review key flight performance telemetry at a glance: total flight hours secured, active flight counts, and current aviation wallet balance.",
    position: "bottom",
  },
  {
    targetId: "tour-db-active-flight",
    title: "Active Mission Dispatches",
    description: "Track the dispatch status of your next scheduled flight, download boarding passes, or view live telemetry route tracking.",
    position: "top",
  },
];

export default function TourGuide() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const cardRef = useRef<HTMLDivElement>(null);

  const isLanding = pathname === "/";
  const isDashboard = pathname === "/dashboard";
  const shouldRunTour = isLanding || isDashboard;

  const TOUR_STEPS = isDashboard ? DASHBOARD_TOUR_STEPS : LANDING_TOUR_STEPS;

  // Run on client side only, triggered by pathname change
  useEffect(() => {
    setMounted(true);
    if (!shouldRunTour) {
      setIsVisible(false);
      return;
    }

    const viewKey = isDashboard ? "skyluxe_dashboard_tour_views" : "skyluxe_landing_tour_views";
    const views = Number(localStorage.getItem(viewKey) || "0");
    
    if (views < 2) {
      setIsVisible(true);
      localStorage.setItem(viewKey, String(views + 1));
    } else {
      setIsVisible(false);
    }

    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pathname, isDashboard, shouldRunTour]);

  // Reset steps on route transitions
  useEffect(() => {
    setCurrentStep(0);
    setTargetRect(null);
  }, [pathname]);

  // Update target bounding rect when step or window size changes
  useEffect(() => {
    if (!isVisible || !shouldRunTour) return;

    const step = TOUR_STEPS[currentStep];
    if (step.targetId) {
      const element = document.getElementById(step.targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          setTargetRect(element.getBoundingClientRect());
        }, 350); // Wait for smooth scroll completion
      } else {
        setTargetRect(null);
      }
    } else {
      setTargetRect(null);
    }
  }, [currentStep, isVisible, windowSize, shouldRunTour, TOUR_STEPS]);

  // Track scroll updates to keep spotlight correctly aligned
  useEffect(() => {
    if (!isVisible || !shouldRunTour) return;

    const handleScroll = () => {
      const step = TOUR_STEPS[currentStep];
      if (step.targetId) {
        const element = document.getElementById(step.targetId);
        if (element) {
          setTargetRect(element.getBoundingClientRect());
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentStep, isVisible, shouldRunTour, TOUR_STEPS]);

  if (!mounted || !shouldRunTour) return null;

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    const viewKey = isDashboard ? "skyluxe_dashboard_tour_views" : "skyluxe_landing_tour_views";
    localStorage.setItem(viewKey, "2"); // Terminate auto-launch by maxing views
    setIsVisible(false);
  };

  const startTourManually = () => {
    setCurrentStep(0);
    setIsVisible(true);
  };

  // Compute card coordinates for slide-animation mapping
  const getCardCoords = () => {
    const defaultWidth = 380;
    const defaultHeight = 230;

    if (!targetRect) {
      return {
        x: (windowSize.width - defaultWidth) / 2,
        y: (windowSize.height - defaultHeight) / 2,
      };
    }

    const margin = 28;
    const step = TOUR_STEPS[currentStep];
    let x = 0;
    let y = 0;

    if (step.position === "bottom") {
      y = targetRect.bottom + margin;
      x = targetRect.left + (targetRect.width - defaultWidth) / 2;
    } else if (step.position === "top") {
      y = targetRect.top - defaultHeight - margin;
      x = targetRect.left + (targetRect.width - defaultWidth) / 2;
    } else if (step.position === "right") {
      y = targetRect.top + (targetRect.height - defaultHeight) / 2;
      x = targetRect.right + margin;
    } else {
      y = targetRect.top + (targetRect.height - defaultHeight) / 2;
      x = targetRect.right + margin;
    }

    // Enforce viewport boundary constraints
    x = Math.max(margin, Math.min(windowSize.width - defaultWidth - margin, x));
    y = Math.max(margin, Math.min(windowSize.height - defaultHeight - margin, y));

    return { x, y };
  };

  const coords = getCardCoords();

  return (
    <>
      {/* Premium Tour Replay Button */}
      {!isVisible && (
        <button
          onClick={startTourManually}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-onyx/85 backdrop-blur-md border border-white/10 hover:border-gold/60 text-gold shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer"
          aria-label="Replay Tutorial Guide"
        >
          <HelpCircle className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute right-14 top-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 bg-onyx/95 border border-white/10 px-3 py-1.5 rounded-lg text-[9px] font-semibold uppercase tracking-widest text-platinum whitespace-nowrap transition-all duration-300 shadow-xl">
            Replay Hub Tour
          </span>
        </button>
      )}

      <AnimatePresence>
        {isVisible && (
          <div className="fixed inset-0 z-[9999] pointer-events-auto overflow-hidden">
            {/* Spotlight SVG Mask Layer */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox={`0 0 ${windowSize.width} ${windowSize.height}`}
            >
              <defs>
                {/* Gold Metallic Shimmer Gradient */}
                <linearGradient id="spotlightBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="30%" stopColor="#FFFFFF" />
                  <stop offset="70%" stopColor="#F5E0A3" />
                  <stop offset="100%" stopColor="#AA7C11" />
                </linearGradient>

                <mask id="tour-spotlight-mask">
                  <rect x="0" y="0" width="100%" height="100%" fill="white" />
                  {targetRect && (
                    <motion.rect
                      initial={false}
                      animate={{
                        x: targetRect.left - 12,
                        y: targetRect.top - 12,
                        width: targetRect.width + 24,
                        height: targetRect.height + 24,
                      }}
                      transition={{ type: "spring", stiffness: 100, damping: 18 }}
                      rx="16"
                      ry="16"
                      fill="black"
                    />
                  )}
                </mask>
              </defs>

              {/* Deep Cinematic Overlay */}
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="rgba(3, 4, 10, 0.82)"
                mask="url(#tour-spotlight-mask)"
              />

              {/* Shimmering Metallic Gold Spotlight border with subtle breathing pulse */}
              {targetRect && (
                <motion.rect
                  initial={false}
                  animate={{
                    x: targetRect.left - 14,
                    y: targetRect.top - 14,
                    width: targetRect.width + 28,
                    height: targetRect.height + 28,
                    opacity: [0.75, 0.95, 0.75],
                  }}
                  transition={{
                    x: { type: "spring", stiffness: 100, damping: 18 },
                    y: { type: "spring", stiffness: 100, damping: 18 },
                    width: { type: "spring", stiffness: 100, damping: 18 },
                    height: { type: "spring", stiffness: 100, damping: 18 },
                    opacity: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                  }}
                  rx="18"
                  ry="18"
                  fill="none"
                  stroke="url(#spotlightBorderGrad)"
                  strokeWidth="2.5"
                  style={{
                    filter: "drop-shadow(0 0 12px rgba(212,175,55,0.7))",
                  }}
                />
              )}
            </svg>

            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={handleSkip} />

            {/* Premium Glassmorphic Step Dialog Card */}
            <motion.div
              ref={cardRef}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: coords.x,
                y: coords.y
              }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ 
                x: { type: "spring", stiffness: 90, damping: 16 },
                y: { type: "spring", stiffness: 90, damping: 16 },
                scale: { duration: 0.2 },
                opacity: { duration: 0.2 }
              }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                background: "linear-gradient(135deg, rgba(12, 14, 25, 0.75) 0%, rgba(6, 7, 12, 0.9) 100%)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
              }}
              className="z-50 w-[380px] min-h-[230px] rounded-2xl p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_25px_60px_rgba(0,0,0,0.85)] flex flex-col justify-between overflow-hidden border border-white/[0.08]"
            >
              {/* Premium Inner Ambient Aura Glows */}
              <div className="absolute -top-12 -left-12 w-36 h-36 bg-gold/10 rounded-full blur-[45px] pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-blue-500/8 rounded-full blur-[45px] pointer-events-none" />

              {/* Header */}
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2 text-gold">
                  <Compass className="w-4 h-4 animate-spin-slow" />
                  <span className="text-[9px] font-bold tracking-[0.2em] uppercase font-mono">
                    System Operations Guide
                  </span>
                </div>
                <button
                  onClick={handleSkip}
                  className="text-white/40 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-white/5"
                  title="Skip Walkthrough"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Animated Content Transition (Cross-fade & Slide) */}
              <div className="my-4 relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <h3 className="text-xl font-serif font-semibold text-white mb-2.5 leading-snug tracking-tight">
                      {TOUR_STEPS[currentStep].title}
                    </h3>
                    <p className="text-xs text-platinum/70 leading-relaxed font-light font-sans font-serif">
                      {TOUR_STEPS[currentStep].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer navigation */}
              <div className="flex justify-between items-center mt-2 border-t border-white/[0.06] pt-4 relative z-10">
                {/* Step dots indicator */}
                <div className="flex gap-2">
                  {TOUR_STEPS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentStep(i)}
                      className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                        i === currentStep ? "w-5 bg-gold" : "w-1.5 bg-white/20 hover:bg-white/40"
                      }`}
                      aria-label={`Go to step ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <button
                      onClick={handleBack}
                      className="px-3.5 py-1.5 rounded-xl border border-white/10 text-platinum hover:bg-white/5 hover:border-white/20 text-xs transition-all flex items-center gap-1.5 cursor-pointer font-medium"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Back
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-gold to-[#f0cc66] hover:brightness-110 text-onyx font-bold text-xs shadow-[0_4px_15px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.45)] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {currentStep === TOUR_STEPS.length - 1 ? "Complete" : "Next"}{" "}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
