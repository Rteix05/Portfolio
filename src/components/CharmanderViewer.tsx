'use client';

import { Component, Suspense, useState, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei';

function CharmanderModel() {
  const { scene } = useGLTF('/charmander.glb');
  return <primitive object={scene} scale={0.35} position={[0, -1.2, 0]} />
}

useGLTF.preload('/charmander.glb');

// Navigateur sans accélération graphique : Three.js échouerait en boucle
function webglDisponible() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') ?? c.getContext('webgl');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

function Repli() {
  return (
    <div className="flex h-full w-full items-center justify-center text-center text-sm opacity-50">
      La 3D interactive demande WebGL, désactivé dans ce navigateur.
    </div>
  );
}

// Filet de sécurité si le contexte WebGL tombe malgré la détection
class GardeWebGL extends Component<{ children: ReactNode }, { echec: boolean }> {
  state = { echec: false };
  static getDerivedStateFromError() {
    return { echec: true };
  }
  render() {
    return this.state.echec ? <Repli /> : this.props.children;
  }
}

export default function CharmanderViewer() {
  // Composant chargé sans SSR : document est disponible
  const [webgl] = useState(webglDisponible);
  if (!webgl) return <Repli />;

  return (
    <GardeWebGL>
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
    </GardeWebGL>
  );
}
