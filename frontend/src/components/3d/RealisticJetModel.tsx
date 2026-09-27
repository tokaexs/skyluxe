"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, ContactShadows, Environment, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// Preload the GLB model asset for instant hydration
useGLTF.preload("/models/private_jet.glb");

export default function RealisticJetModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/private_jet.glb");

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    box.getCenter(center);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
          if (mesh.name === "Object_4") {
            mat.metalness = 0.45;
            mat.roughness = 0.18;
            mat.envMapIntensity = 1.3;
          } else if (mesh.name === "Object_5") {
            mat.roughness = 0.08;
            mat.metalness = 0.9;
            mat.envMapIntensity = 1.6;
          } else if (mesh.name === "Object_6") {
            mat.metalness = 0.95;
            mat.roughness = 0.05;
            mat.envMapIntensity = 2.0;
          } else if (mesh.name === "Object_7" || mesh.name === "Object_8") {
            mat.roughness = 0.5;
            mat.envMapIntensity = 0.8;
          }
          mesh.material = mat;
        }
      }
    });

    return { scene: clone, center };
  }, [scene]);

  const mouseTarget = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    const pointer = state.pointer;

    mouseTarget.current.x = THREE.MathUtils.lerp(mouseTarget.current.x, pointer.x * 0.4, 0.04);
    mouseTarget.current.y = THREE.MathUtils.lerp(mouseTarget.current.y, pointer.y * 0.4, 0.04);

    const floatY = Math.sin(time * 0.4) * 0.08;
    const floatRoll = Math.sin(time * 0.3) * 0.015;
    const floatPitch = Math.cos(time * 0.35) * 0.01;

    const baseRotY = Math.PI * 0.68;
    const baseRotX = 0.12;
    const baseRotZ = -0.06;

    groupRef.current.rotation.y = baseRotY + mouseTarget.current.x * 0.2 + floatRoll;
    groupRef.current.rotation.x = baseRotX - mouseTarget.current.y * 0.15 + floatPitch;
    groupRef.current.rotation.z = baseRotZ + mouseTarget.current.x * 0.1;
    groupRef.current.position.y = 0.1 + floatY + mouseTarget.current.y * 0.15;
  });

  const scaleValue = 0.0072;

  return (
    <>
      <ambientLight intensity={0.65} color="#151722" />
      <directionalLight
        position={[14, 18, 12]}
        intensity={2.4}
        color="#FFF6E8"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <directionalLight
        position={[-16, 10, -12]}
        intensity={1.8}
        color="#8EB6E6"
      />
      <pointLight
        position={[4, -6, 6]}
        intensity={1.6}
        color="#D4AF37"
        distance={22}
      />
      <spotLight
        position={[2, 12, 6]}
        angle={0.6}
        penumbra={0.8}
        intensity={1.2}
        color="#FFFFFF"
      />
      <Environment preset="city" environmentIntensity={0.6} />
      <Sparkles count={28} scale={[18, 10, 14]} size={2.2} speed={0.35} opacity={0.35} color="#D4AF37" />

      <group ref={groupRef} position={[2.5, 0.1, 0]}>
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
        <ContactShadows
          position={[0, -2.4, 0]}
          opacity={0.45}
          scale={16}
          blur={2.8}
          far={6}
          color="#050505"
        />
      </group>
    </>
  );
}
