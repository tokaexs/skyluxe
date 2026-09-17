"use client";

import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";
import { useSpring } from "framer-motion";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const HUB_COORDINATES: Record<string, [number, number]> = {
  BOM: [72.8656, 19.0896],
  DWC: [55.1613, 24.8962],
  DXB: [55.3657, 25.2532],
  LHR: [-0.4543, 51.4700],
  DEL: [77.1000, 28.5562],
  SIN: [103.9915, 1.3644],
  JFK: [-73.7781, 40.6413],
  CDG: [2.5479, 49.0097]
};

interface AtmosphericGlobeProps {
  stamps?: { stampId: string; title: string; country: string; date: any }[];
}

export default function AtmosphericGlobe({ stamps = [] }: AtmosphericGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapboxTokenActive, setMapboxTokenActive] = useState(false);

  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);
  
  const spring = useSpring(0, {
    stiffness: 280,
    damping: 40,
    mass: 1
  });

  // 1. Try initializing Mapbox 3D Globe first
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token || !mapContainerRef.current) {
      setMapboxTokenActive(false);
      return;
    }

    setMapboxTokenActive(true);
    mapboxgl.accessToken = token;

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/dark-v11",
        projection: { name: "globe" }, // Render map as a 3D Globe
        zoom: 1.8,
        center: [55.1613, 24.8962], // Center around Middle East/Asia
        attributionControl: false
      });

      map.on("load", () => {
        // Luxury deep space fog and ambient coloring
        map.setFog({
          color: "rgb(10, 10, 10)",
          "high-color": "rgb(2, 4, 8)",
          "horizon-blend": 0.03,
          "space-color": "rgb(5, 5, 5)",
          "star-intensity": 0.7
        });

        // Add markers for visited stamps
        const plotted = new Set<string>();
        stamps.forEach(stamp => {
          const codeMatch = stamp.stampId.replace("stamp_", "").toUpperCase();
          const coords = HUB_COORDINATES[codeMatch];
          
          if (coords && !plotted.has(codeMatch)) {
            plotted.add(codeMatch);

            // Create custom gold breathing marker
            const markerEl = document.createElement("div");
            markerEl.className = "relative flex items-center justify-center";
            markerEl.innerHTML = `
              <span class="absolute inline-flex h-3 w-3 rounded-full bg-gold opacity-75 animate-ping"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-gold border border-white"></span>
            `;
            new mapboxgl.Marker(markerEl).setLngLat(coords).addTo(map);
          }
        });
      });

      return () => {
        map.remove();
      };
    } catch (err) {
      console.error("Mapbox 3D Globe init failed:", err);
      setMapboxTokenActive(false);
    }
  }, [stamps]);

  // 2. Fallback to Cobe Canvas Globe if Mapbox is inactive
  useEffect(() => {
    if (mapboxTokenActive) return;

    let phi = 0;
    let width = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    if (!canvasRef.current) return;

    // Convert stamps into Cobe markers
    const cobeMarkers = stamps.map(stamp => {
      const codeMatch = stamp.stampId.replace("stamp_", "").toUpperCase();
      const coords = HUB_COORDINATES[codeMatch];
      if (coords) {
        // Cobe expects markers in [lat, lng] format
        return { location: [coords[1], coords[0]] as [number, number], size: 0.08 };
      }
      return null;
    }).filter(m => m !== null) as { location: [number, number]; size: number }[];

    // Add default hubs if stamps list is empty
    if (cobeMarkers.length === 0) {
      cobeMarkers.push(
        { location: [19.0896, 72.8656], size: 0.08 }, // BOM
        { location: [24.8962, 55.1613], size: 0.08 }, // DWC
        { location: [51.4700, -0.4543], size: 0.08 }  // LHR
      );
    }

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 1,
      width: width,
      height: width,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 8000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.1],
      markerColor: [0.83, 0.68, 0.21], // Gold
      glowColor: [0.05, 0.05, 0.05],
      markers: cobeMarkers,
      onRender: (state: Record<string, any>) => {
        state.phi = phi + spring.get();
        phi += 0.005;
        state.width = width;
        state.height = width;
      }
    } as any);

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [mapboxTokenActive, stamps]);

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      {mapboxTokenActive ? (
        // Mapbox container
        <div ref={mapContainerRef} className="w-full h-full rounded-2xl overflow-hidden bg-[#020202]" />
      ) : (
        // Cobe Canvas
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", contain: "layout paint size", opacity: 0.8 }}
          onPointerDown={(e) => {
            pointerInteracting.current = e.clientX as any;
            canvasRef.current!.style.cursor = "grabbing";
          }}
          onPointerUp={() => {
            pointerInteracting.current = null;
            canvasRef.current!.style.cursor = "grab";
          }}
          onPointerOut={() => {
            pointerInteracting.current = null;
            canvasRef.current!.style.cursor = "grab";
          }}
          onMouseMove={(e) => {
            if (pointerInteracting.current !== null) {
              const delta = e.clientX - (pointerInteracting.current as any);
              pointerInteractionMovement.current = delta;
              spring.set(spring.get() + delta * 0.01);
              pointerInteracting.current = e.clientX as any;
            }
          }}
          onTouchMove={(e) => {
            if (pointerInteracting.current !== null && e.touches[0]) {
              const delta = e.touches[0].clientX - (pointerInteracting.current as any);
              pointerInteractionMovement.current = delta;
              spring.set(spring.get() + delta * 0.01);
              pointerInteracting.current = e.touches[0].clientX as any;
            }
          }}
        />
      )}
    </div>
  );
}
