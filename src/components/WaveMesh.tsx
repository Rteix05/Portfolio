'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';

/**
 * Fond animé de l'accueil : un champ de points en perspective qui roule vers l'horizon
 * comme une mer calme, avec une bosse qui suit la souris et des ondes au clic.
 * D'après « Wave Mesh » de ham7a311 sur 21st.dev (licence MIT), adapté aux thèmes du site.
 */

// Palettes : [fond, points]. Sombre = variante « night » d'origine, claire = « paper »,
// avec les fonds du site (#050505 et blanc) pour se fondre avec le reste des pages
const PALETTES = {
  sombre: ['#050505', '#c9d6ea'],
  clair: ['#ffffff', '#1b1a17'],
} as const;

// Géométrie de la scène (unités du monde) : hauteur de l'œil, plan le plus proche et le plus lointain
const HAUTEUR_OEIL = 0.62;
const PROCHE = 0.35;
const LOIN = 3.4;

const suivreTheme = (rappel: () => void) => {
  const observateur = new MutationObserver(rappel);
  observateur.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observateur.disconnect();
};
const lireTheme = () => (document.documentElement.classList.contains('light') ? 'clair' : 'sombre');

// Horloge commune : plusieurs Wave Mesh à l'écran (fond de page, fond d'une scène) ondulent en phase
let origineTemps: number | null = null;

const enRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

export default function WaveMesh({ className = '' }: { className?: string }) {
  const conteneurRef = useRef<HTMLDivElement | null>(null);
  const theme = useSyncExternalStore(suivreTheme, lireTheme, () => 'sombre' as const);
  const [fond, points] = PALETTES[theme];

  useEffect(() => {
    const conteneur = conteneurRef.current;
    if (!conteneur) return;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
    conteneur.prepend(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return () => canvas.remove();

    const mouvementReduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Écran tactile : pas de survol, et 30 images/s suffisent pour économiser la batterie
    const tactile = !matchMedia('(hover: hover) and (pointer: fine)').matches;
    const dpr = Math.min(devicePixelRatio, 2);
    const couleurPoints = enRgb(points);

    let largeur = 0;
    let hauteur = 0;
    let colonnes = 0;
    let rangees = 0;
    let focale = 0;
    let horizon = 0;
    let raf = 0;
    let visible = true;
    let derniereImage = 0;
    if (origineTemps === null) origineTemps = performance.now();
    const debut = origineTemps;
    // Bosse qui suit la souris (position lissée vers la cible) et ondes des clics
    const bosse = { x: 0, z: 1.4, force: 0, cibleX: 0, cibleZ: 1.4, cibleForce: 0 };
    const ondes: { x: number; z: number; t: number }[] = [];

    const redimensionner = () => {
      const l = conteneur.clientWidth;
      const h = conteneur.clientHeight;
      if (l === largeur && h === hauteur) return;
      largeur = l;
      hauteur = h;
      canvas.width = Math.round(largeur * dpr);
      canvas.height = Math.round(hauteur * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      focale = Math.max(largeur, hauteur * 1.2) * 0.55;
      horizon = hauteur * 0.3;
      colonnes = Math.round(Math.min(150, Math.max(56, largeur / 9)));
      rangees = Math.round(Math.min(90, Math.max(48, hauteur / 9.5)));
    };

    const demiLargeur = () => (largeur / 2 / focale) * LOIN * 1.05;

    // Hauteur de la surface en (x, z) à l'instant t : houle + bosse + ondes
    const relief = (x: number, z: number, t: number) => {
      let y = 0.085 * Math.sin(x * 2.2 + t * 0.7) + 0.07 * Math.sin(z * 2.9 - t * 0.9 + x * 0.8) + 0.03 * Math.sin((x + z) * 6.1 + t * 1.6);
      if (bosse.force > 0.01) {
        const d2 = (x - bosse.x) ** 2 + (z - bosse.z) ** 2;
        y += 0.24 * bosse.force * Math.exp(-d2 / 0.07);
      }
      for (const onde of ondes) {
        const age = t - onde.t;
        const distance = Math.hypot(x - onde.x, z - onde.z);
        const rayon = age * 1.15;
        y += 0.2 * Math.exp(-((distance - rayon) ** 2) / 0.014) * Math.exp(-age * 0.75);
      }
      return y;
    };

    const dessiner = (t: number) => {
      ctx.clearRect(0, 0, largeur, hauteur);
      bosse.x += (bosse.cibleX - bosse.x) * 0.1;
      bosse.z += (bosse.cibleZ - bosse.z) * 0.1;
      bosse.force += (bosse.cibleForce - bosse.force) * 0.06;
      while (ondes.length && t - ondes[0].t > 5) ondes.shift();

      const demi = demiLargeur();
      for (let r = 0; r < rangees; r++) {
        // Rangées espacées en progression géométrique : serrées vers l'horizon
        const z = LOIN * Math.pow(PROCHE / LOIN, r / (rangees - 1));
        const proximite = Math.pow(1 - (z - PROCHE) / (LOIN - PROCHE), 1.25);
        const taille = Math.max(0.8, Math.min(3.2, 2.3 / z));
        ctx.fillStyle = `rgba(${couleurPoints},${(0.12 + proximite * 0.85).toFixed(3)})`;
        for (let c = 0; c < colonnes; c++) {
          const x = -demi + (c / (colonnes - 1)) * demi * 2;
          const ecranX = largeur / 2 + (x / z) * focale;
          if (ecranX < -4 || ecranX > largeur + 4) continue;
          const ecranY = horizon + ((HAUTEUR_OEIL - relief(x, z, t)) / z) * focale;
          ctx.fillRect(ecranX - taille / 2, ecranY - taille / 2, taille, taille);
        }
      }
    };

    const maintenant = () => (performance.now() - debut) / 1000;

    const boucle = (horodatage: number) => {
      if (!visible || document.hidden) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(boucle);
      if (tactile && horodatage - derniereImage < 30) return;
      derniereImage = horodatage;
      redimensionner();
      dessiner(maintenant());
    };
    const reveiller = () => {
      if (!mouvementReduit && !raf && visible && !document.hidden) raf = requestAnimationFrame(boucle);
    };

    // Point du sol sous le pointeur (null au-dessus de l'horizon ou hors du fond)
    const pointAuSol = (e: PointerEvent) => {
      const rect = conteneur.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height || y <= horizon + 4) return null;
      const z = Math.min(LOIN, Math.max(PROCHE, (HAUTEUR_OEIL * focale) / (y - horizon)));
      return { x: ((x - largeur / 2) * z) / focale, z };
    };
    const auMouvement = (e: PointerEvent) => {
      const p = pointAuSol(e);
      if (p) {
        bosse.cibleX = p.x;
        bosse.cibleZ = p.z;
        if (bosse.force < 0.05) {
          bosse.x = p.x;
          bosse.z = p.z;
        }
      }
      bosse.cibleForce = p ? 1 : 0;
    };
    const auClic = (e: PointerEvent) => {
      const p = pointAuSol(e);
      if (p) ondes.push({ x: p.x, z: p.z, t: maintenant() });
    };

    redimensionner();
    dessiner(mouvementReduit ? 3 : 0);

    // Hors de l'écran ou onglet caché : l'animation s'arrête
    const observateurVisibilite = new IntersectionObserver(([entree]) => {
      visible = entree.isIntersecting;
      reveiller();
    });
    observateurVisibilite.observe(conteneur);
    const observateurTaille = new ResizeObserver(() => {
      if (mouvementReduit) {
        redimensionner();
        dessiner(3);
      }
    });
    observateurTaille.observe(conteneur);
    document.addEventListener('visibilitychange', reveiller);
    if (!mouvementReduit) {
      reveiller();
      if (!tactile) window.addEventListener('pointermove', auMouvement, { passive: true });
      window.addEventListener('pointerdown', auClic, { passive: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      observateurVisibilite.disconnect();
      observateurTaille.disconnect();
      document.removeEventListener('visibilitychange', reveiller);
      window.removeEventListener('pointermove', auMouvement);
      window.removeEventListener('pointerdown', auClic);
      canvas.remove();
    };
  }, [points]);

  const [r, g, b] = enRgb(points).split(',');
  return (
    <div
      ref={conteneurRef}
      aria-hidden="true"
      className={`relative isolate overflow-hidden ${className}`}
      style={{ background: `radial-gradient(120% 60% at 50% 30%, rgb(${r} ${g} ${b} / 0.07), transparent 60%), ${fond}` }}
    />
  );
}
