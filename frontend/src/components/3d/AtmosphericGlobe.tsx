"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";
// Use a stable spring instance without re-creating each render
import { useSpring } from "framer-motion";

export default function AtmosphericGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);
  // Initialize spring using useSpring hook (stable across renders)
  const spring = useSpring(0, {
    stiffness: 280,
    damping: 40,
    mass: 1
  });

  useEffect(() => {
    let phi = 0;
    let width = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    if (!canvasRef.current) return;

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
      markers: [
        // NY
        { location: [40.7128, -74.0060], size: 0.1 },
        // London
        { location: [51.5074, -0.1278], size: 0.1 },
        // Dubai
        { location: [25.2048, 55.2708], size: 0.1 },
        // Tokyo
        { location: [35.6762, 139.6503], size: 0.1 },
      ],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi + spring.get();
        phi += 0.005;
        state.width = width;
        state.height = width;
      }
    });

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []); // Run only once on mount

  return (
    <div className="w-full max-w-[800px] aspect-square mx-auto flex items-center justify-center relative cursor-grab active:cursor-grabbing">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', contain: 'layout paint size', opacity: 0.8 }}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX as any;
          canvasRef.current!.style.cursor = 'grabbing';
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          canvasRef.current!.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          canvasRef.current!.style.cursor = 'grab';
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
    </div>
  );
}
