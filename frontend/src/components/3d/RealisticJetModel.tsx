"use client";

import { useRef, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Grid } from "@react-three/drei";
import * as THREE from "three";

export default function RealisticJetModel() {
  return (
    <>
      {/* Cinematic Studio & Runway Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={1.8} castShadow shadow-bias={-0.0001} />
      <spotLight position={[-10, 10, -10]} intensity={2.5} color="#D4AF37" angle={0.5} penumbra={1} castShadow />
      
      {/* Runway approach light */}
      <pointLight position={[0, -2, 5]} color="#FFF8DC" intensity={2} distance={8} />

      {/* Stable OrbitControls */}
      <OrbitControls 
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.9}
        autoRotate
        autoRotateSpeed={0.5}
      />

      <Suspense fallback={null}>
        {/* Floating Aircraft Model */}
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.4}>
          <JetMesh />
        </Float>
        
        {/* Runway Environment */}
        <RunwayEnvironment />
      </Suspense>
    </>
  );
}

function JetMesh() {
  const leftFanRef = useRef<THREE.Group>(null);
  const rightFanRef = useRef<THREE.Group>(null);
  
  // Rotate turbine fans in frame
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (leftFanRef.current) {
      leftFanRef.current.rotation.y = elapsed * 15;
    }
    if (rightFanRef.current) {
      rightFanRef.current.rotation.y = elapsed * 15;
    }
  });

  // Swept wings geometry shape
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0);
  wingShape.lineTo(4, -1.5);
  wingShape.lineTo(4, -2.5);
  wingShape.lineTo(0, -1);
  wingShape.lineTo(0, 0);
  const wingExtrude = { depth: 0.1, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };

  return (
    <group scale={0.9} position={[0, 0.5, 0]}>
      {/* Fuselage - pearl white body */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.38, 9.5, 64]} />
        <meshPhysicalMaterial 
          color="#F9F6EE" metalness={0.7} roughness={0.15} clearcoat={1.0} clearcoatRoughness={0.05}
        />
      </mesh>
      
      {/* Nose cone */}
      <mesh position={[0, 0, 4.75]} castShadow receiveShadow>
        <sphereGeometry args={[0.55, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color="#F9F6EE" metalness={0.7} roughness={0.15} clearcoat={1.0} />
      </mesh>
      
      {/* Tail cone */}
      <mesh position={[0, 0, -4.75]} rotation={[Math.PI, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.08, 1.8, 32]} />
        <meshPhysicalMaterial color="#F9F6EE" metalness={0.7} roughness={0.15} clearcoat={1.0} />
      </mesh>

      {/* Cockpit Glass (tinted dark glass with gold sheen) */}
      <mesh position={[0, 0.33, 4.15]} rotation={[0.2, 0, 0]}>
        <capsuleGeometry args={[0.28, 0.75, 32, 32]} />
        <meshPhysicalMaterial color="#0A0A0A" metalness={0.95} roughness={0.05} transmission={0.4} thickness={0.1} />
      </mesh>

      {/* Main Swept Wings (Left & Right) */}
      <mesh position={[-0.45, -0.15, 0]} rotation={[-Math.PI / 2, 0, Math.PI]} castShadow receiveShadow>
        <extrudeGeometry args={[wingShape, wingExtrude]} />
        <meshPhysicalMaterial color="#E0E0E0" metalness={0.8} roughness={0.1} clearcoat={1.0} />
      </mesh>
      <mesh position={[0.45, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <extrudeGeometry args={[wingShape, wingExtrude]} />
        <meshPhysicalMaterial color="#E0E0E0" metalness={0.8} roughness={0.1} clearcoat={1.0} />
      </mesh>

      {/* Vertical Tail Stabilizer */}
      <mesh position={[0, 0.45, -4.2]} rotation={[0, -Math.PI / 2, 0]} castShadow receiveShadow>
        <extrudeGeometry args={[(() => {
          const s = new THREE.Shape();
          s.moveTo(0,0); s.lineTo(-1.3, 2.3); s.lineTo(-1.8, 2.3); s.lineTo(-0.9, 0); s.lineTo(0,0);
          return s;
        })(), { depth: 0.08, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 }]} />
        <meshPhysicalMaterial color="#D4AF37" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Horizontal Tail Stabilizers (Left & Right) */}
      <mesh position={[-0.08, 2.6, -5.5]} rotation={[-Math.PI / 2, 0, Math.PI]} castShadow receiveShadow>
        <extrudeGeometry args={[(() => {
          const s = new THREE.Shape();
          s.moveTo(0,0); s.lineTo(1.3, -0.4); s.lineTo(1.3, -0.8); s.lineTo(0, -0.4); s.lineTo(0,0);
          return s;
        })(), { depth: 0.05, bevelEnabled: true }]} />
        <meshPhysicalMaterial color="#D4AF37" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0.08, 2.6, -5.5]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <extrudeGeometry args={[(() => {
          const s = new THREE.Shape();
          s.moveTo(0,0); s.lineTo(1.3, -0.4); s.lineTo(1.3, -0.8); s.lineTo(0, -0.4); s.lineTo(0,0);
          return s;
        })(), { depth: 0.05, bevelEnabled: true }]} />
        <meshPhysicalMaterial color="#D4AF37" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Two Turbine Engines */}
      <Engine position={[-1.15, 0.18, -3.1]} fanRef={leftFanRef} />
      <Engine position={[1.15, 0.18, -3.1]} fanRef={rightFanRef} />
    </group>
  );
}

interface EngineProps {
  position: [number, number, number];
  fanRef: React.RefObject<THREE.Group | null>;
}

function Engine({ position, fanRef }: EngineProps) {
  return (
    <group position={position}>
      {/* Engine Cylinder Pod */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.36, 0.32, 1.8, 32]} />
        <meshPhysicalMaterial color="#F9F6EE" metalness={0.7} roughness={0.2} clearcoat={0.8} />
      </mesh>
      
      {/* Chrome Engine Rim */}
      <mesh position={[0, 0, 0.92]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.04, 16, 64]} />
        <meshPhysicalMaterial color="#FFFFFF" metalness={1.0} roughness={0.05} />
      </mesh>

      {/* Spinning fan blades group */}
      <group position={[0, 0, 0.8]} ref={fanRef} rotation={[0, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
        
        {/* Generate multiple fan blades */}
        {Array.from({ length: 12 }).map((_, idx) => {
          const rotationAngle = (idx / 12) * Math.PI * 2;
          return (
            <mesh key={idx} rotation={[0, 0, rotationAngle]} position={[0, 0, 0]}>
              <boxGeometry args={[0.04, 0.25, 0.01]} />
              <meshPhysicalMaterial color="#333333" metalness={0.9} roughness={0.3} />
            </mesh>
          );
        })}
      </group>

      {/* Exhaust Core and orange glow */}
      <mesh position={[0, 0, -0.9]}>
        <cylinderGeometry args={[0.26, 0.18, 0.1, 32]} />
        <meshPhysicalMaterial color="#111111" metalness={0.8} roughness={0.6} />
      </mesh>
      
      {/* Glow Disk */}
      <mesh position={[0, 0, -0.91]} rotation={[Math.PI, 0, 0]}>
        <circleGeometry args={[0.24, 32]} />
        <meshBasicMaterial color="#FF8C00" />
      </mesh>
      
      <pointLight position={[0, 0, -1.2]} color="#D4AF37" intensity={1.5} distance={1.5} />
    </group>
  );
}

function RunwayEnvironment() {
  return (
    <group position={[0, -2.5, 0]}>
      {/* Runway surface plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 60]} />
        <meshStandardMaterial color="#0A0A0A" roughness={0.95} />
      </mesh>

      {/* Neon centerline */}
      <Grid 
        sectionSize={2}
        sectionThickness={1.5}
        sectionColor="#D4AF37" 
        gridSize={[30, 50]} 
        infiniteGrid 
        fadeDistance={40}
        cellColor="#222222"
        cellSize={0.5}
      />
      
      {/* Colored FBO Runway Lights */}
      {/* Left side green indicators */}
      <RunwayLight position={[-4, 0.05, 10]} color="#00FF00" />
      <RunwayLight position={[-4, 0.05, 0]} color="#00FF00" />
      <RunwayLight position={[-4, 0.05, -10]} color="#FF0000" />
      
      {/* Right side green indicators */}
      <RunwayLight position={[4, 0.05, 10]} color="#00FF00" />
      <RunwayLight position={[4, 0.05, 0]} color="#00FF00" />
      <RunwayLight position={[4, 0.05, -10]} color="#FF0000" />
    </group>
  );
}

function RunwayLight({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshBasicMaterial color={color} />
      <pointLight color={color} intensity={1.2} distance={3} />
    </mesh>
  );
}
