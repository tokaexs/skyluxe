"use client";

import React, { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Float, ContactShadows, Environment, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// Preload the GLB model asset for instant hydration
useGLTF.preload("/models/private_jet.glb");

interface JetModelProps {
  isMobile: boolean;
}

function JetModel({ isMobile }: JetModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/private_jet.glb");

  // Clone scene so materials/instances remain clean and independent
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    
    // Compute bounding box and center offset precisely
    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    box.getCenter(center);
    
    // Traverse meshes to ensure enhanced luxury material properties
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        if (mesh.material) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
          
          // Enhanced pearl metallic fuselage
          if (mesh.name === "Object_4") {
            mat.metalness = 0.45;
            mat.roughness = 0.18;
            mat.envMapIntensity = 1.3;
          } 
          // Tinted aerodynamic glass
          else if (mesh.name === "Object_5") {
            mat.roughness = 0.08;
            mat.metalness = 0.9;
            mat.envMapIntensity = 1.6;
          }
          // Polished chrome turbine rims and exhaust
          else if (mesh.name === "Object_6") {
            mat.metalness = 0.95;
            mat.roughness = 0.05;
            mat.envMapIntensity = 2.0;
          }
          // Interior cabin executive leather
          else if (mesh.name === "Object_7" || mesh.name === "Object_8") {
            mat.roughness = 0.5;
            mat.envMapIntensity = 0.8;
          }
          
          mesh.material = mat;
        }
      }
    });

    return { scene: clone, center };
  }, [scene]);

  // Target mouse parallax coordinates
  const mouseTarget = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();
    const pointer = state.pointer; // normalized [-1, 1]

    // On mobile, minimize parallax reaction; on desktop, keep it silky & subtle
    const parallaxFactor = isMobile ? 0.08 : 0.45;
    mouseTarget.current.x = THREE.MathUtils.lerp(mouseTarget.current.x, pointer.x * parallaxFactor, 0.04);
    mouseTarget.current.y = THREE.MathUtils.lerp(mouseTarget.current.y, pointer.y * parallaxFactor, 0.04);

    // Subtle luxury floating motion
    const floatY = Math.sin(time * 0.4) * 0.08;
    const floatRoll = Math.sin(time * 0.3) * 0.015;
    const floatPitch = Math.cos(time * 0.35) * 0.01;

    // Base orientations:
    // Model original: Nose is at -X.
    // We rotate around Y so nose points 3/4 toward viewer (e.g. angle ~ 115° to 125°)
    // and pitch nose slightly up (+0.12 rad) with a graceful banking angle (-0.08 rad)
    const baseRotY = Math.PI * 0.68; // ~122 degrees
    const baseRotX = 0.12;           // slight nose-up pitch
    const baseRotZ = -0.06;          // elegant banked turn

    groupRef.current.rotation.y = baseRotY + mouseTarget.current.x * 0.2 + floatRoll;
    groupRef.current.rotation.x = baseRotX - mouseTarget.current.y * 0.15 + floatPitch;
    groupRef.current.rotation.z = baseRotZ + mouseTarget.current.x * 0.1;

    // Subtle position translation
    const baseY = isMobile ? -0.4 : 0.1;
    groupRef.current.position.y = baseY + floatY + mouseTarget.current.y * 0.15;
  });

  // Scale: Normalize 1537 unit raw model to ~10.5 unit scene width
  // Desktop scale ~0.0072; Mobile scale ~0.0046
  const scaleValue = isMobile ? 0.0048 : 0.0072;

  // Position: Desktop sits gracefully towards center-right; Mobile sits centered/lower
  const positionCoords: [number, number, number] = isMobile
    ? [0.2, -0.4, 0]
    : [2.5, 0.1, 0];

  return (
    <group ref={groupRef} position={positionCoords}>
      {/* Centering wrapper using the GLB bounding center offset */}
      <group
        scale={scaleValue}
        position={[
          -clonedScene.center.x * scaleValue,
          -clonedScene.center.y * scaleValue,
          -clonedScene.center.z * scaleValue,
        ]}
      >
        <primitive object={clonedScene.scene} />
      </group>

      {/* Atmospheric Soft Contact Shadow */}
      <ContactShadows
        position={[0, -2.4, 0]}
        opacity={0.45}
        scale={16}
        blur={2.8}
        far={6}
        color="#050505"
      />
    </group>
  );
}

// Cinematic studio & atmospheric lighting designed for SkyLuxe
function Lighting() {
  return (
    <>
      {/* Low-intensity ambient atmospheric tone */}
      <ambientLight intensity={0.65} color="#151722" />

      {/* Main Luxury Key Light (Warm soft sun/studio key) */}
      <directionalLight
        position={[14, 18, 12]}
        intensity={2.4}
        color="#FFF6E8"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Rim Accent Light (Cool aerodynamic edge definition) */}
      <directionalLight
        position={[-16, 10, -12]}
        intensity={1.8}
        color="#8EB6E6"
      />

      {/* Ground & Fuselage Golden Reflection (SkyLuxe signature warm gold fill) */}
      <pointLight
        position={[4, -6, 6]}
        intensity={1.6}
        color="#D4AF37"
        distance={22}
      />

      {/* Top Cockpit Highlight */}
      <spotLight
        position={[2, 12, 6]}
        angle={0.6}
        penumbra={0.8}
        intensity={1.2}
        color="#FFFFFF"
      />

      {/* Pre-calibrated environment reflections for realistic metallic sheen */}
      <Environment preset="city" environmentIntensity={0.6} />

      {/* Subtle floating gold atmosphere luminescence */}
      <Sparkles
        count={28}
        scale={[18, 10, 14]}
        size={2.2}
        speed={0.35}
        opacity={0.35}
        color="#D4AF37"
      />
    </>
  );
}

class ErrorBoundary3D extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.warn("PrivateJet3D Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

export default function PrivateJetHero3D() {
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
      <ErrorBoundary3D>
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
          camera={{
            position: [0, 1.2, 13],
            fov: 38,
            near: 0.1,
            far: 100,
          }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <Lighting />
            <JetModel isMobile={isMobile} />
          </Suspense>
        </Canvas>
      </ErrorBoundary3D>

      {/* Luxury Atmospheric Depth Gradients & Glow */}
      {/* Gold ambient radial aura positioned behind the jet */}
      <div className="absolute right-[5%] top-[25%] w-[650px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)] blur-3xl pointer-events-none -z-10" />

      {/* Readability mask: High contrast gradient on the left, translucent on the right */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-[#020202]/75 to-transparent pointer-events-none lg:w-3/5" />

      {/* Top navbar protection shadow */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#020202]/80 to-transparent pointer-events-none" />

      {/* Bottom fade into the fleet catalog */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#020202] via-[#020202]/60 to-transparent pointer-events-none" />
    </div>
  );
}
