import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Apparition au scroll commune à toutes les pages : les blocs qui entrent
 * ensemble dans l'écran arrivent en cascade, une seule fois, sans disparaître
 * quand on remonte. À appeler dans un gsap.context pour le nettoyage.
 */
export function reveler(elements: (Element | null)[]) {
  const cibles = elements.filter((el): el is Element => el !== null);
  if (cibles.length === 0) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set(cibles, { opacity: 1, y: 0 });
    return;
  }

  gsap.set(cibles, { opacity: 0, y: 48 });
  ScrollTrigger.batch(cibles, {
    start: 'top 88%',
    once: true,
    onEnter: (lot) =>
      gsap.to(lot, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.09,
        overwrite: true,
      }),
  });
}
