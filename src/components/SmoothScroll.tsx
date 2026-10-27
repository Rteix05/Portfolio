'use client';

import { useEffect, useRef } from 'react';
import { ReactLenis, useLenis, type LenisRef } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ScrollTrigger lit la position de Lenis à chaque défilement
function SyncScrollTrigger() {
  useLenis(ScrollTrigger.update);
  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    // Lenis et GSAP partagent la même horloge : plus de décalage d'une image
    // entre le défilement et les animations épinglées
    const tick = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={{ lerp: 0.09, wheelMultiplier: 1, autoRaf: false }}>
      <SyncScrollTrigger />
      {children}
    </ReactLenis>
  );
}
