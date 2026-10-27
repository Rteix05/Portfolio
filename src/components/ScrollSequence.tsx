'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { rafraichirDansLOrdre } from '@/lib/scrollOrder';

gsap.registerPlugin(ScrollTrigger);

// Toutes les fenêtres (debut / fin) sont en progression du scroll, de 0 à 1

export type Chapitre = {
  debut: number;
  fin: number;
  cote: 'gauche' | 'droite';
  label: string;
  titre: string;
  texte: string;
  // Petite légende reliée par un trait, côté opposé au texte
  annotation?: string;
};

export type Fantome = {
  debut: number;
  fin: number;
  texte: string;
};

export type Statistiques = {
  debut: number;
  fin: number;
  valeurs: { valeur: number; unite: string; legende: string }[];
  // Assombrit l'image derrière les compteurs ; inutile si les images sont déjà sombres
  voile?: boolean;
};

type ScrollSequenceProps = {
  // Dossiers dans /public contenant 001.webp, 002.webp… : une séquence rendue sur
  // fond clair, et en option la même sur fond sombre pour le mode sombre du site
  dossiers: { clair: string; sombre?: string };
  total: number;
  chapitres: Chapitre[];
  fantomes?: Fantome[];
  statistiques?: Statistiques;
  // Hauteur de scroll pendant laquelle la section reste figée, en % d'écran
  duree?: number;
};

const FONDU = 0.04;
// Images décodées gardées autour de la position : peu derrière, plus devant
const FENETRE_ARRIERE = 6;
const FENETRE_AVANT = 24;
// Une image sur 24 reste décodée en permanence, pour les grands sauts de scroll
const PAS_REPERES = 24;
const DECODAGES_SIMULTANES = 3;

const cheminImage = (dossier: string, n: number) => `${dossier}/${String(n + 1).padStart(3, '0')}.webp`;
const borne = (v: number) => Math.min(1, Math.max(0, v));
// Opacité d'une fenêtre : fondu d'entrée, plateau, fondu de sortie
const visibilite = (p: number, debut: number, fin: number) =>
  Math.min(borne((p - debut) / FONDU), borne((fin - p) / FONDU));
const formatNombre = new Intl.NumberFormat('fr-FR');

// Le site bascule de thème via la classe `dark` sur <html> (sombre par défaut)
const suivreTheme = (prevenir: () => void) => {
  const observer = new MutationObserver(prevenir);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
};
const lireTheme = () => document.documentElement.classList.contains('dark');

/**
 * Séquence d'images rejouée au scroll, façon pages produit Apple : une vidéo
 * découpée en images dessinées sur un canvas figé à l'écran, avec par-dessus
 * des chapitres de texte, un texte géant qui défile, et une phase sombre
 * où des compteurs montent.
 */
export default function ScrollSequence({
  dossiers,
  total,
  chapitres,
  fantomes = [],
  statistiques,
  duree = 500,
}: ScrollSequenceProps) {
  const modeSombre = useSyncExternalStore(suivreTheme, lireTheme, () => true);
  const dossier = modeSombre && dossiers.sombre ? dossiers.sombre : dossiers.clair;
  const clair = dossier === dossiers.clair;
  // Couleur de fond des images rendues, pour combler autour quand elles ne couvrent pas tout
  const fond = clair ? '#ffffff' : '#050505';
  // Position courante dans la séquence, partagée entre le scroll et le canvas :
  // au changement de thème, la nouvelle séquence reprend à la même image
  const positionRef = useRef(0);
  const allerARef = useRef<(position: number) => void>(() => {});
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const voileRef = useRef<HTMLDivElement>(null);
  const chapitreRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fantomeRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);
  const compteurRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    // Canvas opaque : le navigateur n'a pas à mélanger avec ce qu'il y a derrière
    const ctx = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !ctx) return;

    // Décoder les 360 images d'un coup coûterait ~3 Go : le navigateur en jetterait
    // une partie et devrait les redécoder en plein scroll (saccades). On garde donc
    // toutes les images compressées (~18 Ko chacune) et on ne décode que celles
    // autour de la position, plus quelques repères.
    const fichiers: (Blob | undefined)[] = [];
    const cache = new Map<number, ImageBitmap>();
    const enCours = new Set<number>();
    let voulue = positionRef.current;
    let sens = 1; // sens du scroll, pour décoder en avance du bon côté
    let dessinee = -1;
    let raf = 0;
    let annule = false;

    const estRepere = (n: number) => n % PAS_REPERES === 0 || n === total - 1;
    const dansFenetre = (n: number) => {
      const derriere = sens > 0 ? FENETRE_ARRIERE : FENETRE_AVANT;
      const devant = sens > 0 ? FENETRE_AVANT : FENETRE_ARRIERE;
      return n >= voulue - derriere && n <= voulue + devant;
    };
    const aGarder = (n: number) => dansFenetre(n) || estRepere(n);

    // Image prête la plus proche de celle demandée
    const indexPret = (n: number) => {
      for (let ecart = 0; ecart < total; ecart++) {
        if (cache.has(n - ecart)) return n - ecart;
        if (cache.has(n + ecart)) return n + ecart;
      }
      return -1;
    };

    const peindre = (img: ImageBitmap) => {
      // Équivalent de object-fit: cover. En portrait, cover couperait les ailes :
      // on garde au moins 52 % de la largeur de l'image, le fond comble le reste
      let echelle = Math.max(canvas.width / img.width, canvas.height / img.height);
      if (canvas.height > canvas.width) echelle = Math.min(echelle, canvas.width / (img.width * 0.52));
      const l = img.width * echelle;
      const h = img.height * echelle;
      ctx.drawImage(img, (canvas.width - l) / 2, (canvas.height - h) / 2, l, h);
    };

    const dessiner = () => {
      raf = 0;
      const base = Math.floor(voulue);
      const index = indexPret(base);
      if (index === -1) return;
      ctx.globalAlpha = 1;
      ctx.fillStyle = fond;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      peindre(cache.get(index)!);
      // Fondu vers l'image suivante : le mouvement reste continu entre deux images
      const fraction = voulue - base;
      const suivante = cache.get(base + 1);
      if (index === base && fraction > 0.02 && suivante) {
        ctx.globalAlpha = fraction;
        peindre(suivante);
        ctx.globalAlpha = 1;
      }
      dessinee = index === base ? voulue : -1;
    };

    const demander = (forcer = false) => {
      if ((forcer || voulue !== dessinee) && !raf) raf = requestAnimationFrame(dessiner);
    };

    // Décode les images qui manquent, les plus proches d'abord, puis les repères
    const decoder = () => {
      if (annule) return;
      const aFaire = (n: number) => n >= 0 && n < total && fichiers[n] && !cache.has(n) && !enCours.has(n);
      const cible = Math.round(voulue);
      const candidats: number[] = [];
      for (let ecart = 0; ecart <= FENETRE_AVANT; ecart++) {
        for (const n of ecart ? [cible + ecart * sens, cible - ecart * sens] : [cible]) {
          if (dansFenetre(n) && aFaire(n)) candidats.push(n);
        }
      }
      for (let n = 0; n < total; n += PAS_REPERES) if (aFaire(n) && !candidats.includes(n)) candidats.push(n);
      if (aFaire(total - 1) && !candidats.includes(total - 1)) candidats.push(total - 1);

      while (enCours.size < DECODAGES_SIMULTANES && candidats.length) {
        const n = candidats.shift()!;
        enCours.add(n);
        createImageBitmap(fichiers[n]!)
          .then((bmp) => {
            if (annule || !aGarder(n)) return bmp.close();
            cache.set(n, bmp);
            if (Math.abs(n - voulue) < 2 || dessinee !== voulue) demander(true);
          })
          .catch(() => {})
          .finally(() => {
            enCours.delete(n);
            decoder();
          });
      }
    };

    // Libère les images sorties de la fenêtre (hors repères)
    const liberer = () => {
      cache.forEach((bmp, n) => {
        if (!aGarder(n)) {
          bmp.close();
          cache.delete(n);
        }
      });
    };

    const redimensionner = () => {
      // Au-delà de 1,5 le canvas dépasse la résolution des images : on dessine plus pour rien
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      // Changer la taille remet le contexte à zéro : on redonne la qualité de réduction
      ctx.imageSmoothingQuality = 'high';
      demander(true);
    };

    // Téléchargement : une image sur 8 d'abord pour pouvoir parcourir toute la
    // séquence très vite, puis les intermédiaires
    const ordre: number[] = [];
    const vues = new Set<number>();
    for (const pas of [8, 4, 2, 1]) {
      for (let n = 0; n < total; n += pas) {
        if (!vues.has(n)) {
          vues.add(n);
          ordre.push(n);
        }
      }
    }
    const controleur = new AbortController();
    let suivant = 0;
    const telecharger = async () => {
      while (!annule && suivant < ordre.length) {
        const n = ordre[suivant++];
        try {
          const reponse = await fetch(cheminImage(dossier, n), { signal: controleur.signal });
          if (!reponse.ok) continue;
          fichiers[n] = await reponse.blob();
          decoder();
        } catch {
          // Annulé ou image manquante : on passe à la suivante
        }
      }
    };
    for (let k = 0; k < 6; k++) telecharger();

    const observer = new ResizeObserver(redimensionner);
    observer.observe(canvas);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Mouvement réduit : image finale figée
      positionRef.current = voulue = total - 1;
    }

    allerARef.current = (position) => {
      if (position === voulue) return;
      sens = position > voulue ? 1 : -1;
      const avant = Math.round(voulue);
      voulue = position;
      demander();
      // La fenêtre a avancé d'une image : on libère derrière et on décode devant
      if (Math.round(position) !== avant) {
        liberer();
        decoder();
      }
    };
    demander(true);

    return () => {
      annule = true;
      controleur.abort();
      allerARef.current = () => {};
      observer.disconnect();
      cancelAnimationFrame(raf);
      cache.forEach((bmp) => bmp.close());
      cache.clear();
    };
  }, [dossier, total, fond]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const majCalques = (p: number) => {
      chapitres.forEach((c, i) => {
        const el = chapitreRefs.current[i];
        if (!el) return;
        const entree = borne((p - c.debut) / FONDU);
        const sortie = borne((c.fin - p) / FONDU);
        el.style.opacity = String(Math.min(entree, sortie));
        el.style.transform = `translate3d(0, ${(1 - entree) * 32 - (1 - sortie) * 32}px, 0)`;
      });

      // Le texte géant traverse l'écran de droite à gauche pendant sa fenêtre
      fantomes.forEach((f, i) => {
        const el = fantomeRefs.current[i];
        if (!el) return;
        const avance = borne((p - f.debut) / (f.fin - f.debut));
        el.style.opacity = String(visibilite(p, f.debut, f.fin));
        el.style.transform = `translate3d(${30 - avance * 90}%, -50%, 0)`;
      });

      if (statistiques && statsRef.current && voileRef.current) {
        const { debut, fin, valeurs, voile = true } = statistiques;
        const sombre = visibilite(p, debut, fin);
        voileRef.current.style.opacity = String(voile ? sombre * 0.75 : 0);
        statsRef.current.style.opacity = String(sombre);

        // Les compteurs montent pendant la première moitié de la phase sombre
        const montee = 1 - Math.pow(1 - borne((p - debut) / ((fin - debut) * 0.5)), 3);
        valeurs.forEach((v, i) => {
          const el = compteurRefs.current[i];
          if (el) el.textContent = formatNombre.format(Math.round(v.valeur * montee));
        });
      }
    };

    // Mouvement réduit : contenus listés sans section épinglée
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    majCalques(0);

    const trigger = ScrollTrigger.create({
      trigger: scene,
      start: 'top top',
      end: `+=${duree}%`,
      pin: true,
      pinSpacing: true,
      // Lenis lisse déjà le défilement : un second lissage ici ferait traîner l'animation
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: ({ progress }) => {
        positionRef.current = progress * (total - 1);
        allerARef.current(positionRef.current);
        majCalques(progress);
      },
    });
    rafraichirDansLOrdre();

    return () => trigger.kill();
  }, [total, chapitres, fantomes, statistiques, duree]);

  return (
    <div
      ref={sceneRef}
      className={`relative h-screen w-full overflow-hidden motion-reduce:h-auto motion-reduce:min-h-screen ${
        clair ? 'bg-white text-black' : 'bg-[#050505] text-white'
      }`}
    >
      {/* Mobile : l'image occupe le haut de l'écran, le texte passe en dessous */}
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-x-0 top-0 h-[66%] w-full md:inset-0 md:h-full" />

      {fantomes.map((f, i) => (
        <p
          key={f.texte}
          ref={(el) => {
            fantomeRefs.current[i] = el;
          }}
          aria-hidden="true"
          className={`pointer-events-none absolute top-[38%] left-0 whitespace-nowrap md:top-1/2 text-[22vw] font-semibold leading-none tracking-tighter uppercase opacity-0 ${clair ? 'text-black/[0.05]' : 'text-white/[0.07]'} will-change-transform motion-reduce:hidden`}
        >
          {f.texte}
        </p>
      ))}

      {/* Voile de la phase sombre */}
      <div ref={voileRef} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black opacity-0" />

      <div className="relative mx-auto h-full max-w-7xl px-6 md:px-10 motion-reduce:flex motion-reduce:h-auto motion-reduce:flex-col motion-reduce:gap-16 motion-reduce:py-24">
        {chapitres.map((c, i) => (
          <div
            key={i}
            ref={(el) => {
              chapitreRefs.current[i] = el;
            }}
            className={`absolute inset-x-6 bottom-[6%] flex opacity-0 will-change-transform md:inset-x-10 md:top-1/2 md:bottom-auto md:-mt-24 motion-reduce:static motion-reduce:mt-0 motion-reduce:opacity-100 ${
              c.cote === 'droite' ? 'md:justify-end' : ''
            }`}
          >
            <div className="relative isolate max-w-sm">
              {/* Halo de la couleur du fond : le texte reste lisible quand il passe sur le modèle */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-20 -inset-y-16 -z-10 hidden md:block motion-reduce:hidden"
                style={{
                  background: `radial-gradient(closest-side, ${clair ? 'rgb(255 255 255 / 0.85)' : 'rgb(5 5 5 / 0.85)'} 45%, transparent)`,
                }}
              />
              <p className="mb-4 font-mono text-xs uppercase tracking-widest opacity-50">{c.label}</p>
              <h2 className="text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight whitespace-pre-line">
                {c.titre}
              </h2>
              <p className="mt-4 text-sm leading-relaxed opacity-60 md:mt-5">{c.texte}</p>
            </div>

            {c.annotation && (
              <div
                aria-hidden="true"
                className={`absolute top-10 hidden items-center gap-3 md:flex motion-reduce:hidden ${
                  c.cote === 'droite' ? 'left-0' : 'right-0'
                }`}
              >
                <span className={`h-px w-24 ${clair ? 'bg-black/30' : 'bg-white/30'}`} />
                <span className="max-w-40 font-mono text-[0.625rem] uppercase leading-snug tracking-widest opacity-50">
                  {c.annotation}
                </span>
              </div>
            )}
          </div>
        ))}

        {statistiques && (
          <div
            ref={statsRef}
            className="absolute inset-x-6 top-1/2 grid -translate-y-1/2 grid-cols-2 gap-10 text-white opacity-0 motion-reduce:text-current md:inset-x-10 md:grid-cols-4 motion-reduce:static motion-reduce:translate-y-0 motion-reduce:opacity-100"
          >
            {statistiques.valeurs.map((v, i) => (
              <div key={i} className="text-center">
                <span
                  ref={(el) => {
                    compteurRefs.current[i] = el;
                  }}
                  className="block text-5xl md:text-7xl font-semibold leading-none tracking-tighter tabular-nums"
                >
                  {formatNombre.format(v.valeur)}
                </span>
                <span className="mt-2 block font-mono text-xs uppercase tracking-widest opacity-50">{v.unite}</span>
                <span className="mx-auto mt-3 block max-w-40 text-xs leading-relaxed opacity-40">{v.legende}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

