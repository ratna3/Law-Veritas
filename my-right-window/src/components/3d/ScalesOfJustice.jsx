import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GOLD = '#b8860b';
const GOLD_LIGHT = '#d4a843';
const NAVY = '#1a365d';

function CylinderMesh({ position, args, color = GOLD }) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={args} />
      <meshStandardMaterial color={color} metalness={0.7} roughness={0.25} />
    </mesh>
  );
}

function SphereMesh({ position, args, color = GOLD }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={args} />
      <meshStandardMaterial color={color} metalness={0.7} roughness={0.25} />
    </mesh>
  );
}

function Bowl({ position }) {
  const bowlGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.35, -0.18, 0.5, 0);
    const geo = new THREE.LatheGeometry(
      [new THREE.Vector2(0, 0), new THREE.Vector2(0.3, -0.12), new THREE.Vector2(0.5, 0)],
      32
    );
    return geo;
  }, []);

  return (
    <mesh position={position} geometry={bowlGeo}>
      <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Chain({ start, end }) {
  const points = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  }, [start, end]);

  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line geometry={geo}>
      <lineBasicMaterial color={GOLD_LIGHT} linewidth={1} />
    </line>
  );
}

function ScalesGroup({ rotationSpeed = 0.15 }) {
  const groupRef = useRef();
  const beamRef = useRef();
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * rotationSpeed;
    }
    if (beamRef.current) {
      beamRef.current.rotation.z = Math.sin(timeRef.current * 0.8) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Base */}
      <CylinderMesh position={[0, -1.8, 0]} args={[0.6, 0.7, 0.12, 32]} />
      <CylinderMesh position={[0, -1.7, 0]} args={[0.15, 0.15, 0.1, 16]} />
      {/* Pillar */}
      <CylinderMesh position={[0, -0.3, 0]} args={[0.06, 0.08, 2.8, 12]} />
      {/* Decorative ring at top of pillar */}
      <mesh position={[0, 1.15, 0]}>
        <torusGeometry args={[0.12, 0.03, 8, 24]} />
        <meshStandardMaterial color={GOLD_LIGHT} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Finial sphere */}
      <SphereMesh position={[0, 1.35, 0]} args={[0.08, 16, 16]} />

      {/* Beam assembly - tilts */}
      <group ref={beamRef} position={[0, 1.1, 0]}>
        {/* Horizontal beam */}
        <CylinderMesh position={[0, 0, 0]} args={[0.04, 0.04, 2.4, 8]} />
        {/* Rotate beam to horizontal */}
        <group rotation={[0, 0, Math.PI / 2]}>
          <CylinderMesh position={[0, 0, 0]} args={[0.04, 0.04, 2.4, 8]} />
        </group>

        {/* Left chains + bowl */}
        <Chain start={[-1.15, 0, 0.15]} end={[-0.85, -0.8, 0.15]} />
        <Chain start={[-1.15, 0, -0.15]} end={[-0.85, -0.8, -0.15]} />
        <Chain start={[-1.15, 0, 0]} end={[-1.45, -0.8, 0]} />
        <Bowl position={[-1.15, -0.85, 0]} />

        {/* Right chains + bowl */}
        <Chain start={[1.15, 0, 0.15]} end={[0.85, -0.8, 0.15]} />
        <Chain start={[1.15, 0, -0.15]} end={[0.85, -0.8, -0.15]} />
        <Chain start={[1.15, 0, 0]} end={[1.45, -0.8, 0]} />
        <Bowl position={[1.15, -0.85, 0]} />
      </group>
    </group>
  );
}

export default function ScalesOfJustice() {
  return (
    <Canvas
      className="w-full h-full"
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.3, 4], fov: 45 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <directionalLight position={[-3, -2, -3]} intensity={0.3} />
      <pointLight position={[0, 3, 2]} intensity={0.4} color={GOLD_LIGHT} />
      <ScalesGroup />
    </Canvas>
  );
}
