'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import LogoRT from '@/components/LogoRT';

// Logo plat, affiché pendant le chargement de la 3D ou sans WebGL
function LogoPlat() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <LogoRT className="h-auto w-[60%]" />
    </div>
  );
}

// La 3D (Three.js) est chargée à part : elle ne retarde pas l'affichage de l'accueil
const LogoRT3D = dynamic(() => import('@/components/LogoRT3D'), { ssr: false, loading: LogoPlat });

const webglDisponible = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') ?? c.getContext('webgl'));
  } catch {
    return false;
  }
};

export default function LogoAccueil({ actif }: { actif: boolean }) {
  const [webgl] = useState(() => (typeof window === 'undefined' ? true : webglDisponible()));
  const [pret, setPret] = useState(false);
  if (!webgl) return <LogoPlat />;
  return (
    <div className="relative h-full w-full" role="img" aria-label="Logo RT de Rafael Teixeira">
      {/* Le logo plat reste dessous jusqu'à la première image 3D, sans saut */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${pret ? 'opacity-0' : 'opacity-100'}`}>
        <LogoPlat />
      </div>
      <LogoRT3D actif={actif} onPret={() => setPret(true)} />
    </div>
  );
}
