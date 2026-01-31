import { Canvas } from '@react-three/fiber';
import { useGLTF, Center, Float, Environment } from '@react-three/drei';
import { useEffect, Suspense } from 'react';
import * as THREE from 'three';
import gearsModel from '../../assets/gears.glb?url';

const Model = () => {
    const { scene } = useGLTF(gearsModel);

    useEffect(() => {
        // Apply gold/metallic material to all meshes
        scene.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                    color: "#bf953f", // Gold color
                    metalness: 0.8,
                    roughness: 0.2,
                    envMapIntensity: 1
                });
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [scene]);

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <primitive
                object={scene}
                scale={2}
            />
        </Float>
    );
};

const GearsLoader = () => {
    return (
        <div className="fixed inset-0 bg-[#0a0f1c] z-50 flex flex-col items-center justify-center">
            <div className="w-full h-[60vh]">
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} />
                    <Environment preset="city" />
                    <Suspense fallback={null}>
                        <Center>
                            <Model />
                        </Center>
                    </Suspense>
                </Canvas>
            </div>

            <div className="text-center -mt-10 relative z-10">
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#bf953f] mb-4 animate-pulse tracking-wider">
                    Law-gically Loading...
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#bf953f] to-transparent mx-auto rounded-full"></div>
                <p className="text-gray-400 mt-4 text-sm tracking-widest uppercase">Preparing Legal Resources</p>
            </div>
        </div>
    );
};

// Pre-load the model
useGLTF.preload(gearsModel);

export default GearsLoader;
