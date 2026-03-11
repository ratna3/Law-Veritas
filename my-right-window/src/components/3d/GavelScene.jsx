import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GOLD = '#b8860b';
const GOLD_LIGHT = '#d4a843';
const WOOD_DARK = '#5c3317';
const WOOD_LIGHT = '#8b5e3c';

function GavelGroup({ rotationSpeed = 0.2 }) {
  const groupRef = useRef();
  const gavelRef = useRef();
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * rotationSpeed;
    }
    // Gentle rocking motion for the gavel head
    if (gavelRef.current) {
      gavelRef.current.rotation.z = Math.sin(timeRef.current * 1.2) * 0.06;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Sound block (base) */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.8, 0.9, 0.25, 32]} />
        <meshStandardMaterial color={WOOD_DARK} metalness={0.1} roughness={0.7} />
      </mesh>
      {/* Sound block gold rim */}
      <mesh position={[0, -1.05, 0]}>
        <torusGeometry args={[0.82, 0.025, 8, 48]} />
        <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Gavel assembly */}
      <group ref={gavelRef} position={[0, 0.3, 0]} rotation={[0, 0, -0.3]}>
        {/* Handle */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 1.6, 12]} />
          <meshStandardMaterial color={WOOD_LIGHT} metalness={0.1} roughness={0.6} />
        </mesh>
        {/* Handle grip ring bottom */}
        <mesh position={[0, -1.1, 0]}>
          <torusGeometry args={[0.08, 0.02, 8, 16]} />
          <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Handle grip ring top */}
        <mesh position={[0, -0.9, 0]}>
          <torusGeometry args={[0.08, 0.02, 8, 16]} />
          <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Handle end cap */}
        <mesh position={[0, -1.3, 0]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.25} />
        </mesh>

        {/* Gavel Head */}
        <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.9, 16]} />
          <meshStandardMaterial color={WOOD_DARK} metalness={0.15} roughness={0.6} />
        </mesh>
        {/* Gavel head gold bands */}
        <mesh position={[-0.35, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.23, 0.02, 8, 24]} />
          <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.35, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.23, 0.02, 8, 24]} />
          <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Gavel head end caps */}
        <mesh position={[-0.45, 0.3, 0]}>
          <sphereGeometry args={[0.2, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={WOOD_DARK} metalness={0.15} roughness={0.6} />
        </mesh>
        <mesh position={[0.45, 0.3, 0]}>
          <sphereGeometry args={[0.2, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={WOOD_DARK} metalness={0.15} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

export default function GavelScene() {
  return (
    <Canvas
      className="w-full h-full"
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.5, 3.5], fov: 45 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <directionalLight position={[-3, -2, -3]} intensity={0.3} />
      <pointLight position={[0, 3, 2]} intensity={0.4} color={GOLD_LIGHT} />
      <GavelGroup />
    </Canvas>
  );
}
