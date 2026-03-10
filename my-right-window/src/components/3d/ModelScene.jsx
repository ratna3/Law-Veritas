import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import LegalModel from './LegalModel';
import PropTypes from 'prop-types';

function ModelFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-cream">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-navy border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Loading 3D Model...</p>
      </div>
    </div>
  );
}

export default function ModelScene({
  modelPath,
  scale = 1,
  cameraPosition = [0, 0, 5],
  rotationSpeed = 0.3,
  enableOrbit = true,
}) {
  return (
    <Suspense fallback={<ModelFallback />}>
      <Canvas
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <directionalLight position={[-10, -10, -5]} intensity={0.4} />
        <pointLight position={[0, 5, 0]} intensity={0.3} color="#b8860b" />
        <LegalModel modelPath={modelPath} scale={scale} rotationSpeed={rotationSpeed} />
        {enableOrbit && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        )}
      </Canvas>
    </Suspense>
  );
}

ModelScene.propTypes = {
  modelPath: PropTypes.string.isRequired,
  scale: PropTypes.number,
  cameraPosition: PropTypes.arrayOf(PropTypes.number),
  rotationSpeed: PropTypes.number,
  enableOrbit: PropTypes.bool,
};
