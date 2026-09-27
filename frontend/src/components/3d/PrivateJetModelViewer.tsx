"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import {
  Compass,
  Eye,
  Maximize2,
  RotateCcw,
  Sun,
  Moon,
  Sparkles,
  Zap,
  Shield,
  Wifi,
  Radio,
  Layers,
  ChevronRight,
  Palette,
  Volume2,
  VolumeX,
  CloudSun,
  Stars,
} from "lucide-react";

// Type definitions for <model-viewer> web component in React JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          "auto-rotate"?: boolean | string;
          "rotation-per-second"?: string;
          "auto-rotate-delay"?: string | number;
          "camera-controls"?: boolean | string;
          "touch-action"?: string;
          "environment-image"?: string;
          exposure?: string | number;
          "shadow-intensity"?: string | number;
          "shadow-softness"?: string | number;
          "camera-orbit"?: string;
          "camera-target"?: string;
          "field-of-view"?: string;
          "min-field-of-view"?: string;
          "max-field-of-view"?: string;
          "min-camera-orbit"?: string;
          "max-camera-orbit"?: string;
          "interpolation-decay"?: string | number;
          "interaction-prompt"?: string;
          "interaction-prompt-threshold"?: string | number;
          poster?: string;
          loading?: string;
          reveal?: string;
        },
        HTMLElement
      >;
    }
  }
}

interface CameraPreset {
  id: string;
  name: string;
  orbit: string;
  target?: string;
}

interface Hotspot {
  id: string;
  slot: string;
  position: string;
  normal: string;
  title: string;
  badge: string;
  desc: string;
  orbit: string;
  target: string;
}

interface LiveryOption {
  id: string;
  name: string;
  color: string;
  border: string;
  accent: string;
  filter: string;
}

const cameraPresets: CameraPreset[] = [
  { id: "hero", name: "3/4 Hero", orbit: "-28deg 72deg 82%" },
  { id: "cockpit", name: "Apex Nose", orbit: "-5deg 80deg 76%" },
  { id: "profile", name: "Profile", orbit: "70deg 84deg 82%" },
  { id: "planform", name: "Planform", orbit: "-30deg 25deg 88%" },
];

const liveries: LiveryOption[] = [
  {
    id: "obsidian",
    name: "Obsidian Gold",
    color: "#0a0a0c",
    border: "border-gold",
    accent: "text-gold",
    filter: "brightness(0.95) contrast(1.08) drop-shadow(0 0 25px rgba(212,175,55,0.15))",
  },
  {
    id: "pearl",
    name: "Starlight Pearl",
    color: "#f4f4f6",
    border: "border-white/80",
    accent: "text-white",
    filter: "brightness(1.05) contrast(1.02) drop-shadow(0 0 30px rgba(255,255,255,0.2))",
  },
  {
    id: "monaco",
    name: "Monaco Navy",
    color: "#0c1524",
    border: "border-sky-400",
    accent: "text-sky-400",
    filter: "hue-rotate(200deg) brightness(0.92) contrast(1.05) drop-shadow(0 0 25px rgba(56,189,248,0.2))",
  },
  {
    id: "champagne",
    name: "Champagne Royale",
    color: "#d4af37",
    border: "border-amber-300",
    accent: "text-amber-300",
    filter: "sepia(0.25) brightness(1.02) contrast(1.05) drop-shadow(0 0 30px rgba(212,175,55,0.3))",
  },
];

const jetHotspots: Hotspot[] = [
  {
    id: "cockpit",
    slot: "hotspot-cockpit",
    position: "-8.0 2.2 0",
    normal: "-1 0 0",
    title: "Fly-By-Wire Flight Deck",
    badge: "Avionics",
    desc: "Triple-redundant FADEC avionics, synthetic vision HUD, and active clear-air turbulence damping.",
    orbit: "-20deg 82deg 60%",
    target: "-6.5m 2.0m 0m",
  },
  {
    id: "cabin",
    slot: "hotspot-cabin",
    position: "-1.5 2.5 0",
    normal: "0 1 0",
    title: "Nuage Master Stateroom",
    badge: "Bespoke Cabin",
    desc: "Acoustically isolated private master suite with en-suite shower, Ka-Band high-speed WiFi, and Soleil circadian lighting.",
    orbit: "35deg 70deg 68%",
    target: "-0.5m 2.2m 0m",
  },
  {
    id: "engine",
    slot: "hotspot-engine",
    position: "5.2 2.8 3.0",
    normal: "0 0 1",
    title: "Rolls-Royce Pearl 700",
    badge: "Propulsion",
    desc: "18,250 lbf thrust turbofans with 100% Sustainable Aviation Fuel (SAF) compatibility & WhisperQuiet nacelles.",
    orbit: "115deg 78deg 62%",
    target: "4.5m 2.6m 2.5m",
  },
  {
    id: "wingtip",
    slot: "hotspot-wing",
    position: "2.0 2.0 12.0",
    normal: "0 1 0",
    title: "Aerodynamic Transonic Wing",
    badge: "Aerodynamics",
    desc: "Optimized supercritical swept-wing architecture delivering high-mach efficiency and ultra-smooth climb profiles.",
    orbit: "75deg 60deg 75%",
    target: "1.5m 2.0m 9.0m",
  },
];

export default function PrivateJetModelViewer() {
  const viewerRef = useRef<HTMLElement>(null);
  const [autoRotateEnabled, setAutoRotateEnabled] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [activePreset, setActivePreset] = useState("hero");
  const [currentOrbit, setCurrentOrbit] = useState("-28deg 72deg 82%");
  const [currentTarget, setCurrentTarget] = useState("auto auto auto");
  const [fov, setFov] = useState("30deg");
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [selectedLivery, setSelectedLivery] = useState<LiveryOption>(liveries[0]);
  const [lightingMode, setLightingMode] = useState<"studio" | "golden" | "midnight" | "highalt">("studio");
  const [ambientAudio, setAmbientAudio] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion & responsive framing
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setAutoRotateEnabled(false);
      }

      const handleMotionChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          setAutoRotateEnabled(false);
        }
      };
      mediaQuery.addEventListener("change", handleMotionChange);

      const updateFraming = () => {
        if (window.innerWidth < 640) {
          setFov("36deg");
        } else if (window.innerWidth < 1024) {
          setFov("32deg");
        } else {
          setFov("30deg");
        }
      };
      updateFraming();
      window.addEventListener("resize", updateFraming);

      return () => {
        mediaQuery.removeEventListener("change", handleMotionChange);
        window.removeEventListener("resize", updateFraming);
      };
    }
  }, []);

  useEffect(() => {
    const el = viewerRef.current as any;
    if (!el) return;

    const handleUserInteraction = () => {
      setHasInteracted(true);
      setAutoRotateEnabled(false);
      el.removeAttribute("auto-rotate");
    };

    const handleModelLoad = () => {
      if (typeof el.jumpCameraToGoal === "function") {
        el.jumpCameraToGoal();
      }
    };

    el.addEventListener("user-interaction", handleUserInteraction);
    el.addEventListener("pointerdown", handleUserInteraction);
    el.addEventListener("touchstart", handleUserInteraction);
    el.addEventListener("load", handleModelLoad);

    return () => {
      el.removeEventListener("user-interaction", handleUserInteraction);
      el.removeEventListener("pointerdown", handleUserInteraction);
      el.removeEventListener("touchstart", handleUserInteraction);
      el.removeEventListener("load", handleModelLoad);
    };
  }, []);

  const switchCameraPreset = (preset: CameraPreset) => {
    setActivePreset(preset.id);
    setActiveHotspot(null);
    setCurrentOrbit(preset.orbit);
    setCurrentTarget("auto auto auto");
    const el = viewerRef.current as any;
    if (el) {
      el.cameraOrbit = preset.orbit;
      el.cameraTarget = "auto auto auto";
    }
  };

  const selectHotspot = (hotspot: Hotspot) => {
    if (activeHotspot?.id === hotspot.id) {
      setActiveHotspot(null);
      switchCameraPreset(cameraPresets[0]);
      return;
    }
    setActiveHotspot(hotspot);
    setActivePreset("");
    setAutoRotateEnabled(false);
    setCurrentOrbit(hotspot.orbit);
    setCurrentTarget(hotspot.target);
    const el = viewerRef.current as any;
    if (el) {
      el.cameraOrbit = hotspot.orbit;
      el.cameraTarget = hotspot.target;
    }
  };

  const resetView = () => {
    switchCameraPreset(cameraPresets[0]);
  };

  // Lighting parameters based on selected atmospheric environment
  const getLightingParams = () => {
    switch (lightingMode) {
      case "golden":
        return { exposure: "0.95", shadowIntensity: "1.2", shadowSoftness: "0.4" };
      case "midnight":
        return { exposure: "0.55", shadowIntensity: "0.7", shadowSoftness: "0.8" };
      case "highalt":
        return { exposure: "1.05", shadowIntensity: "1.0", shadowSoftness: "0.5" };
      case "studio":
      default:
        return { exposure: "0.85", shadowIntensity: "1.0", shadowSoftness: "0.6" };
    }
  };

  const lightingParams = getLightingParams();

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto">
      {/* Load Google Model Viewer CDN Script */}
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
        strategy="afterInteractive"
      />

      <style jsx global>{`
        model-viewer {
          background-color: transparent !important;
          --poster-color: transparent !important;
        }
        .hotspot-btn {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 2px solid rgba(212, 175, 55, 0.95);
          background: rgba(10, 10, 12, 0.85);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.7), inset 0 0 10px rgba(212, 175, 55, 0.5);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hotspot-btn:hover {
          transform: scale(1.35);
          border-color: #fff;
          box-shadow: 0 0 30px rgba(212, 175, 55, 1), 0 0 15px #fff;
        }
        .hotspot-inner {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #d4af37;
          animation: pulseHotspot 2s infinite ease-in-out;
        }
        @keyframes pulseHotspot {
          0%, 100% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.4); opacity: 1; }
        }
      `}</style>

      {/* Atmospheric Environment Ambient Glow Overlays */}
      {lightingMode === "golden" && (
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/20 via-transparent to-amber-700/10 pointer-events-none z-[1] transition-opacity duration-1000" />
      )}
      {lightingMode === "midnight" && (
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-black/20 to-transparent pointer-events-none z-[1] transition-opacity duration-1000" />
      )}
      {lightingMode === "highalt" && (
        <div className="absolute inset-0 bg-gradient-to-t from-sky-950/20 via-transparent to-sky-800/10 pointer-events-none z-[1] transition-opacity duration-1000" />
      )}

      {/* Model Canvas: Layer 0 */}
      <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center">
        <model-viewer
          ref={viewerRef}
          src="/models/private-jet.glb"
          alt="SkyLuxe Executive Private Jet 3D Model"
          camera-controls
          touch-action="pan-y"
          environment-image="/hdri/studio.hdr"
          exposure={lightingParams.exposure}
          shadow-intensity={lightingParams.shadowIntensity}
          shadow-softness={lightingParams.shadowSoftness}
          camera-orbit={currentOrbit}
          min-camera-orbit="auto auto 45%"
          max-camera-orbit="auto auto 130%"
          camera-target={currentTarget}
          field-of-view={fov}
          interpolation-decay="200"
          interaction-prompt="none"
          auto-rotate={autoRotateEnabled && !hasInteracted ? "" : undefined}
          rotation-per-second="8deg"
          auto-rotate-delay="1000"
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
            outline: "none",
            opacity: 0.95,
            filter: selectedLivery.filter,
            transition: "filter 0.5s ease",
          }}
        >
          {/* Interactive 3D Hotspots on the aircraft geometry */}
          {jetHotspots.map((h) => (
            <button
              key={h.id}
              slot={h.slot}
              data-position={h.position}
              data-normal={h.normal}
              onClick={() => selectHotspot(h)}
              className="hotspot-btn group"
              title={h.title}
            >
              <span className="hotspot-inner" />
            </button>
          ))}

          {/* Quiet text loading placeholder during network fetch */}
          <div
            slot="poster"
            className="w-full h-full flex items-center justify-center text-sm text-platinum/40 font-mono tracking-wider select-none bg-transparent"
          >
            Loading 3D asset…
          </div>
        </model-viewer>
      </div>

      {/* Floating Active Hotspot Callout Drawer (Top Left / Floating) */}
      {activeHotspot && (
        <div className="absolute top-28 sm:top-36 left-4 sm:left-10 z-30 max-w-sm w-[90vw] p-5 rounded-2xl bg-black/85 border border-gold/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(212,175,55,0.25)] animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-gold/15 border border-gold/30 text-[10px] text-gold font-mono uppercase tracking-widest font-bold">
              {activeHotspot.badge}
            </span>
            <button
              onClick={() => setActiveHotspot(null)}
              className="text-platinum/40 hover:text-white text-xs font-mono px-2 py-0.5 rounded bg-white/5"
            >
              Close ✕
            </button>
          </div>
          <h4 className="text-base sm:text-lg font-serif font-bold text-white mb-1.5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            {activeHotspot.title}
          </h4>
          <p className="text-xs text-platinum/80 font-light leading-relaxed mb-4">
            {activeHotspot.desc}
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[11px] font-mono text-gold">
            <span>Bespoke Engineering</span>
            <span className="text-platinum/50 flex items-center gap-1">
              Active Focus <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      )}

      {/* Bespoke Livery Studio & Finish Customizer (Floating Top Right of Hero) */}
      <div className="absolute top-28 sm:top-36 right-4 sm:right-10 z-20 hidden sm:flex flex-col items-end gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 border border-white/10 backdrop-blur-xl shadow-xl">
          <Palette className="w-3.5 h-3.5 text-gold" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-platinum/60">
            Livery Atelier:
          </span>
          <span className={`text-[10px] font-mono font-bold ${selectedLivery.accent}`}>
            {selectedLivery.name}
          </span>
        </div>

        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/75 border border-white/15 backdrop-blur-2xl shadow-2xl">
          {liveries.map((liv) => (
            <button
              key={liv.id}
              onClick={() => setSelectedLivery(liv)}
              title={`Apply ${liv.name} Finish`}
              className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                selectedLivery.id === liv.id
                  ? `ring-2 ring-gold scale-110 shadow-[0_0_12px_rgba(212,175,55,0.6)]`
                  : "opacity-70 hover:opacity-100 hover:scale-105"
              }`}
              style={{ backgroundColor: liv.color, border: "1px solid rgba(255,255,255,0.2)" }}
            >
              {selectedLivery.id === liv.id && (
                <div className="w-2 h-2 rounded-full bg-gold" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive 3D Camera Angles & Lighting Toolbar (Floating Bottom Left of Hero) */}
      <div className="absolute bottom-6 left-6 z-20 hidden md:flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/75 border border-white/15 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono text-platinum/50 uppercase tracking-widest border-r border-white/10 mr-1">
          <Eye className="w-3 h-3 text-gold" />
          <span>View</span>
        </div>
        {cameraPresets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => switchCameraPreset(preset)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-300 ${
              activePreset === preset.id
                ? "bg-gradient-to-r from-gold to-gold-light text-onyx font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                : "text-platinum/70 hover:text-white hover:bg-white/5"
            }`}
          >
            {preset.name}
          </button>
        ))}
        
        {/* Environment / Lighting Mode Selector */}
        <div className="border-l border-white/10 pl-1.5 ml-1 flex items-center gap-1">
          <button
            onClick={() => setLightingMode("studio")}
            title="Studio Daylight"
            className={`p-1.5 rounded-xl transition-colors ${
              lightingMode === "studio" ? "bg-gold/20 text-gold" : "text-platinum/50 hover:text-white"
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setLightingMode("golden")}
            title="Alpine Sunset (Golden Hour)"
            className={`p-1.5 rounded-xl transition-colors ${
              lightingMode === "golden" ? "bg-amber-500/20 text-amber-400" : "text-platinum/50 hover:text-white"
            }`}
          >
            <CloudSun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setLightingMode("midnight")}
            title="Midnight Runway"
            className={`p-1.5 rounded-xl transition-colors ${
              lightingMode === "midnight" ? "bg-blue-500/20 text-blue-300" : "text-platinum/50 hover:text-white"
            }`}
          >
            <Stars className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetView}
            title="Reset to 3/4 Hero View"
            className="p-1.5 rounded-xl text-platinum/50 hover:text-gold hover:bg-white/5 transition-colors ml-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Real-Time Flight Deck Telemetry HUD (Floating Bottom Right of Hero) */}
      <div className="absolute bottom-6 right-6 z-20 hidden lg:flex items-center gap-4 px-4 py-2 rounded-2xl bg-black/70 border border-white/10 backdrop-blur-2xl shadow-2xl font-mono text-[11px] text-platinum/70">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-bold">AVIONICS HUD</span>
        </div>
        <div className="border-l border-white/10 pl-3">
          <span className="text-platinum/40 text-[9px] uppercase block">Service Ceiling</span>
          <span className="text-gold font-bold">FL510 (51,000 FT)</span>
        </div>
        <div className="border-l border-white/10 pl-3">
          <span className="text-platinum/40 text-[9px] uppercase block">Global SATCOM</span>
          <span className="text-white flex items-center gap-1 font-bold">
            <Wifi className="w-3 h-3 text-gold" /> Ka-Band 50 Mbps
          </span>
        </div>
        <div className="border-l border-white/10 pl-3">
          <span className="text-platinum/40 text-[9px] uppercase block">Cabin Atmosphere</span>
          <span className="text-emerald-400 font-bold">100% HEPA Fresh</span>
        </div>
      </div>
    </div>
  );
}


