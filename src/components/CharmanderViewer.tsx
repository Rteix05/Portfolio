'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei';

function CharmanderModel() {
  const { scene } = useGLTF('/charmander.glb');
  return <primitive object={scene} scale={0.35} position={[0, -1.2, 0]} />
}

useGLTF.preload('/charmander.glb');

export default function CharmanderViewer() {
  return (
    <Canvas
      camera={{ position: [0, 1, 5], fov: 40 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-4, 2, -4]} intensity={0.4} color="#a0c4ff" />
      <Suspense fallback={null}>
        <CharmanderModel />
        <ContactShadows position={[0, -1.2, 0]} opacity={0.3} scale={6} blur={2} far={3} />
        <Environment preset="city" />
      </Suspense>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1.2}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
}
