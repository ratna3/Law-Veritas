import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GOLD = '#b8860b';
const GOLD_LIGHT = '#d4a843';
const MARBLE = '#f0ebe3';
const MARBLE_DARK = '#d4cfc7';

function Column({ position, height = 2.8, radius = 0.18 }) {
  const fluteCount = 12;
  const flutes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < fluteCount; i++) {
      const angle = (i / fluteCount) * Math.PI * 2;
      const x = position[0] + Math.cos(angle) * (radius + 0.02);
      const z = position[2] + Math.sin(angle) * (radius + 0.02);
      arr.push({ x, z, angle });
    }
    return arr;
  }, [position, radius]);

  return (
    <group>
      {/* Main column shaft */}
      <mesh position={[position[0], position[1], position[2]]}>
        <cylinderGeometry args={[radius, radius * 1.05, height, 24]} />
        <meshStandardMaterial color={MARBLE} metalness={0.05} roughness={0.4} />
      </mesh>
      {/* Flute grooves */}
      {flutes.map((f, i) => (
        <mesh key={i} position={[f.x, position[1], f.z]}>
          <cylinderGeometry args={[0.02, 0.02, height - 0.2, 6]} />
          <meshStandardMaterial color={MARBLE_DARK} metalness={0.05} roughness={0.5} />
        </mesh>
      ))}
      {/* Capital (top) */}
      <mesh position={[position[0], position[1] + height / 2 + 0.08, position[2]]}>
        <boxGeometry args={[radius * 3, 0.12, radius * 3]} />
        <meshStandardMaterial color={MARBLE} metalness={0.05} roughness={0.35} />
      </mesh>
      <mesh position={[position[0], position[1] + height / 2 + 0.16, position[2]]}>
        <boxGeometry args={[radius * 3.5, 0.06, radius * 3.5]} />
        <meshStandardMaterial color={MARBLE} metalness={0.05} roughness={0.35} />
      </mesh>
      {/* Base */}
      <mesh position={[position[0], position[1] - height / 2 - 0.06, position[2]]}>
        <boxGeometry args={[radius * 3.2, 0.1, radius * 3.2]} />
        <meshStandardMaterial color={MARBLE} metalness={0.05} roughness={0.35} />
      </mesh>
    </group>
  );
}

function PillarGroup({ rotationSpeed = 0.15 }) {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Central pillar */}
      <Column position={[0, 0, 0]} height={3} radius={0.22} />

      {/* Side pillars */}
      <Column position={[-0.9, -0.2, 0]} height={2.6} radius={0.14} />
      <Column position={[0.9, -0.2, 0]} height={2.6} radius={0.14} />

      {/* Entablature (top beam connecting pillars) */}
      <mesh position={[0, 1.75, 0]}>
        <boxGeometry args={[2.4, 0.12, 0.5]} />
        <meshStandardMaterial color={MARBLE} metalness={0.05} roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.84, 0]}>
        <boxGeometry args={[2.5, 0.06, 0.55]} />
        <meshStandardMaterial color={MARBLE} metalness={0.05} roughness={0.35} />
      </mesh>

      {/* Pediment (triangular top) */}
      <mesh position={[0, 2.1, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[1.3, 0.5, 3]} />
        <meshStandardMaterial color={MARBLE} metalness={0.05} roughness={0.35} />
      </mesh>

      {/* Gold accent strip on pediment */}
      <mesh position={[0, 1.9, 0.28]}>
        <boxGeometry args={[2.3, 0.03, 0.01]} />
        <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Base platform */}
      <mesh position={[0, -1.65, 0]}>
        <boxGeometry args={[2.6, 0.12, 0.8]} />
        <meshStandardMaterial color={MARBLE_DARK} metalness={0.05} roughness={0.4} />
      </mesh>
      <mesh position={[0, -1.75, 0]}>
        <boxGeometry args={[2.8, 0.1, 0.9]} />
        <meshStandardMaterial color={MARBLE_DARK} metalness={0.05} roughness={0.4} />
      </mesh>

      {/* Gold "JUSTICE" text plaque */}
      <mesh position={[0, -1.5, 0.42]}>
        <boxGeometry args={[1.2, 0.2, 0.02]} />
        <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

export default function PillarScene() {
  return (
    <Canvas
      className="w-full h-full"
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.5, 4.5], fov: 40 }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1} />
      <directionalLight position={[-3, -2, -3]} intensity={0.3} />
      <pointLight position={[0, 3, 2]} intensity={0.35} color={GOLD_LIGHT} />
      <PillarGroup />
    </Canvas>
  );
}
