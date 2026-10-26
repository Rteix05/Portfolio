'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LazyVideo from '@/components/LazyVideo';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  nom: string;
  image: string;
  video: string;
  videoIsImage?: boolean;
  aDroite: boolean;
};

/**
 * Composition « grande image + petite superposée » d'un projet.
 * Inclinaison 3D qui suit la souris, parallaxe au scroll,
 * et clic sur la petite vignette pour la passer au premier plan.
 */
export default function ProjetVisuels({ nom, image, video, videoIsImage, aDroite }: Props) {
  const zone = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const grande = useRef<HTMLDivElement>(null);
  const petite = useRef<HTMLDivElement>(null);
  const [inverse, setInverse] = useState(false);

  const calmeDemande = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Parallaxe au scroll : les deux visuels ne défilent pas à la même vitesse
  useEffect(() => {
    if (calmeDemande()) return;
    const ctx = gsap.context(() => {
      const declencheur = { trigger: zone.current, start: 'top bottom', end: 'bottom top', scrub: true };
      gsap.fromTo(grande.current, { y: 30 }, { y: -30, ease: 'none', scrollTrigger: declencheur });
      gsap.fromTo(petite.current, { y: 70 }, { y: -70, ease: 'none', scrollTrigger: { ...declencheur } });
    });
    return () => ctx.revert();
  }, []);

  const bouger = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || calmeDemande() || !zone.current) return;
    const r = zone.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(scene.current, { rotateY: x * 8, rotateX: -y * 8, duration: 0.8, ease: 'power3.out' });
    gsap.to(grande.current, { x: x * -14, duration: 0.8, ease: 'power3.out' });
    gsap.to(petite.current, { x: x * 22, duration: 0.8, ease: 'power3.out' });
  };

  const quitter = () => {
    gsap.to(scene.current, { rotateY: 0, rotateX: 0, duration: 1.2, ease: 'elastic.out(1, 0.6)' });
    gsap.to([grande.current, petite.current], { x: 0, duration: 1.2, ease: 'elastic.out(1, 0.6)' });
  };

  const media = (src: string, estImage: boolean, sizes: string) =>
    estImage ? (
      <Image src={src} alt={`Aperçu du projet ${nom}`} fill sizes={sizes} className="object-cover object-top" />
    ) : (
      <LazyVideo src={src} poster={image} className="w-full h-full object-cover pointer-events-none" />
    );

  const cadre =
    'absolute rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] transition-[width,height,top,left] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]';
  // Positions en % pour que l'échange s'anime (left/top/width/height)
  const posGrande: React.CSSProperties = { left: aDroite ? '15%' : '0%', top: '0%', width: '85%', height: '82%' };
  const posPetite: React.CSSProperties = { left: aDroite ? '0%' : '50%', top: '50%', width: '50%', height: '50%' };

  // Bouton posé sur la vignette du premier plan : il bouge avec elle
  const echanger = (
    <button
      type="button"
      onClick={() => setInverse((v) => !v)}
      aria-label={`Changer de visuel pour ${nom}`}
      className="group absolute inset-0 rounded-3xl cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
    >
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/70 text-white backdrop-blur px-4 py-1.5 text-xs font-medium md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-focus-visible:opacity-100 md:group-focus-visible:translate-y-0 transition-all duration-300">
        ⇄ Changer de vue
      </span>
    </button>
  );

  return (
    <div
      ref={zone}
      onPointerMove={bouger}
      onPointerLeave={quitter}
      className="w-full relative h-[45vh] md:h-[60vh] [perspective:1400px]"
    >
      <div ref={scene} className="absolute inset-0 [transform-style:preserve-3d]">
        <div
          ref={grande}
          style={inverse ? posPetite : posGrande}
          className={`${cadre} ${inverse ? 'z-20' : 'z-10'} bg-gray-100 dark:bg-zinc-900`}
        >
          {media(image, true, '(max-width: 768px) 100vw, 55vw')}
          {inverse && echanger}
        </div>
        <div
          ref={petite}
          style={inverse ? posGrande : posPetite}
          className={`${cadre} ${inverse ? 'z-10' : 'z-20'} bg-black`}
        >
          {media(video, !!videoIsImage, '(max-width: 768px) 60vw, 30vw')}
          {!inverse && echanger}
        </div>
      </div>
    </div>
  );
}
