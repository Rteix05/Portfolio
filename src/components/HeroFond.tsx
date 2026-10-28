'use client';

import { useEffect, useRef } from 'react';

/**
 * Fond du hero des pages projets : montage des vidéos de la page, flou déjà
 * appliqué dans le fichier (léger, aucun filtre CSS à calculer).
 * Avec « réduire les animations », on garde l'image fixe.
 */
export default function HeroFond({ nom }: { nom: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    video.src = `/${nom}-hero.mp4`;
    video.play().catch(() => {});
  }, [nom]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden="true"
      poster={`/${nom}-hero.webp`}
      className="absolute inset-0 h-full w-full object-cover opacity-25 pointer-events-none"
    />
  );
}
