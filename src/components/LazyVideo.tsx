'use client';

import { useEffect, useRef, useState } from 'react';

type LazyVideoProps = {
  src: string;
  className?: string;
  poster?: string;
  captions?: string;
};

/**
 * Les pages projets empilent plusieurs vidéos qui démarraient toutes au chargement.
 * Ici la source n'est montée qu'à l'approche du viewport : le navigateur ne
 * télécharge que ce que le visiteur atteint vraiment.
 */
export default function LazyVideo({ src, className, poster, captions }: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Navigateur sans IntersectionObserver : on charge, mais hors du rendu initial
    if (typeof IntersectionObserver === 'undefined') {
      const frame = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      disablePictureInPicture
      disableRemotePlayback
      preload="none"
      poster={poster}
      className={className}
    >
      {inView && <source src={src} type="video/mp4" />}
      {inView && captions && (
        <track kind="captions" src={captions} srcLang="fr" label="Français" />
      )}
    </video>
  );
}
