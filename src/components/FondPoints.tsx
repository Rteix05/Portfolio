'use client';

import { usePathname } from 'next/navigation';
import WaveMesh from '@/components/WaveMesh';

// Pages qui ont déjà leur propre Wave Mesh au premier plan : pas de second fond derrière
const PAGES_AVEC_FOND_PROPRE = ['/', '/contact'];

/**
 * Fond commun à tout le site : le champ de points de la home, fixe derrière le contenu.
 * Il apparaît dans toutes les zones sans fond propre ; un voile l'adoucit pour la lecture.
 */
export default function FondPoints() {
  const pathname = usePathname();
  if (PAGES_AVEC_FOND_PROPRE.includes(pathname)) return null;
  return <CalqueFondPoints className="fixed inset-0 -z-10" />;
}

// Le calque seul (points + voile), réutilisé à l'intérieur des scènes épinglées qui ont
// besoin de mélanger leur canvas avec le fond (séquence d'évolution de /3d)
export function CalqueFondPoints({ className }: { className: string }) {
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden="true">
      <WaveMesh className="h-full w-full" />
      <div className="absolute inset-0 bg-white/55 dark:bg-[#050505]/55" />
    </div>
  );
}
