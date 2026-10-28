'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LazyVideo from '@/components/LazyVideo';
import { rafraichirDansLOrdre } from '@/lib/scrollOrder';
import './eclat.css';

gsap.registerPlugin(ScrollTrigger);

type Calque = {
  etiquette: string;
  titre: string;
  texte: string;
  tags: string[];
  media: { type: 'image' | 'video'; src: string; alt?: string; poster?: string };
  // Décalage du calque une fois la pile ouverte, en % de la largeur de scène
  dx: number;
  dy: number;
};

const label = 'eclat-label font-mono uppercase';

// Projets Blender : une vidéo par calque (rendus EEVEE, captures du viewport recadrées)
const video = (nom: string): Calque['media'] => ({ type: 'video', src: `/3d/${nom}.mp4`, poster: `/3d/${nom}.webp` });

const calques: Calque[] = [
  {
    etiquette: 'IUT — Salle de cours',
    titre: 'Notre salle de cours, à l’échelle.',
    texte: 'Mobilier, postes et ouvertures modélisés à partir de relevés réels. Le projet qui m’a appris la modélisation et l’export glTF.',
    tags: ['Blender', 'Modélisation', 'glTF'],
    media: video('salle-iut'),
    dx: -25,
    dy: -11,
  },
  {
    etiquette: 'Blender3D — Ville côtière',
    titre: 'Une ville entière générée par script.',
    texte: 'Relief, rues en lacets, milliers de maisons, port et viaduc : toute la scène est construite par un script Python calé sur une image de référence.',
    tags: ['Python bpy', 'Procédural', 'Shaders'],
    media: video('ville-cotiere'),
    dx: 3,
    dy: -14,
  },
  {
    etiquette: 'WR507D — Le quartier',
    titre: 'Un quartier victorien pour un escape game VR.',
    texte: 'Maisons, arbres morts, voitures, lampadaires et câbles sont générés autour du manoir, décor d’un jeu d’horreur solo en réalité virtuelle.',
    tags: ['Level design', 'Procédural', 'VR'],
    media: video('manoir-quartier'),
    dx: 26,
    dy: -6,
  },
  {
    etiquette: 'WR507D — Le salon',
    titre: 'Un manoir meublé pièce par pièce.',
    texte: '18 textures PBR cuites dans Blender, plus de 200 matériaux recréés automatiquement dans Unity URP. Le tout tient dans le budget d’un Meta Quest 2.',
    tags: ['Textures PBR', 'Unity URP', 'Quest 2'],
    media: video('manoir-salon'),
    dx: -28,
    dy: 3,
  },
  {
    etiquette: 'WR507D — La cave',
    titre: 'La lampe torche pour seule lumière.',
    texte: 'Découpage par pièce pour l’occlusion culling et atlas de couleurs : les draw calls restent sous le budget de la VR autonome.',
    tags: ['Éclairage', 'Optimisation', 'Occlusion culling'],
    media: video('manoir-cave'),
    dx: 13,
    dy: 11,
  },
  {
    etiquette: 'WR507D — La famille',
    titre: 'Une famille riggée et animée.',
    texte: 'Père, mère, frère et sœur : squelettes et cycles d’animation (marche, course, agripper, regarder autour) exportés en FBX pour Unity.',
    tags: ['Rigging', 'Animation', 'Export FBX'],
    media: video('famille'),
    dx: -11,
    dy: 14,
  },
  {
    etiquette: 'WR507D — Le chien',
    titre: 'Une créature, six animations.',
    texte: 'Marche, course, aboiement, grognement, mâchouillement, attente : le chien de garde du manoir est riggé et animé dans Blender.',
    tags: ['Rigging', 'Animation', 'Créature'],
    media: video('chien'),
    dx: 27,
    dy: 13,
  },
];

const carte =
  'relative block aspect-16/10 overflow-hidden border border-(--eclat-rule) bg-black/5 dark:bg-white/5';

// Rendu dans la pile et, sur mobile, en vignette : LazyVideo ne charge que ce qui est visible
function Media({ media }: { media: Calque['media'] }) {
  if (media.type === 'video') {
    return <LazyVideo src={media.src} poster={media.poster} className="absolute inset-0 h-full w-full object-cover pointer-events-none" />;
  }
  return (
    <Image
      src={media.src}
      alt={media.alt ?? ''}
      fill
      sizes="(min-width: 48rem) 600px, 100vw"
      className="object-cover"
    />
  );
}

const VARIABLES = ['--eclat-progress', '--eclat-zoom', '--eclat-camera', '--cam-x', '--cam-y', '--orbite-x', '--orbite-y'];

export default function EclatStack() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pisteRef = useRef<HTMLDivElement>(null);
  const listeRef = useRef<HTMLOListElement>(null);
  const progresRef = useRef<HTMLSpanElement>(null);

  // Mobile : barre de progression du carrousel
  useEffect(() => {
    const liste = listeRef.current;
    const progres = progresRef.current;
    if (!liste || !progres) return;
    const maj = () => {
      const max = liste.scrollWidth - liste.clientWidth;
      const part = liste.clientWidth / liste.scrollWidth;
      const p = max > 0 ? liste.scrollLeft / max : 0;
      progres.style.width = `${part * 100}%`;
      progres.style.transform = `translateX(${(p * (1 - part) / part) * 100}%)`;
    };
    maj();
    liste.addEventListener('scroll', maj, { passive: true });
    window.addEventListener('resize', maj);
    return () => {
      liste.removeEventListener('scroll', maj);
      window.removeEventListener('resize', maj);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const piste = pisteRef.current;
    if (!root || !piste) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 48rem)', () => {
      const dernier = calques.length - 1;
      const set = (nom: string, valeur: number) => root.style.setProperty(nom, valeur.toFixed(4));
      const ease = gsap.parseEase('power2.inOut');
      const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

      // Sept vidéos décodées en même temps alourdissent la pile 3D :
      // seules celles des calques proches de la caméra tournent
      const videos = Array.from(root.querySelectorAll<HTMLVideoElement>('[data-eclat-calque] video'));
      const piloterVideos = (camera: number, zoom: number) => {
        videos.forEach((v, i) => {
          const voulue = zoom > 0.05 && Math.abs(i - camera) < 1.5;
          if (voulue && v.paused) v.play().catch(() => {});
          else if (!voulue && !v.paused) v.pause();
        });
      };

      // Timeline du scroll épinglé :
      //   0 → 18 %   la pile s'ouvre
      //  18 → 25 %   la caméra s'approche
      //  25 → 100 %  la caméra traverse les calques (moitié pause, moitié transition)
      const trigger = ScrollTrigger.create({
        trigger: piste,
        start: 'top top',
        end: '+=380%',
        pin: true,
        pinSpacing: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: ({ progress: p }) => {
          set('--eclat-progress', Math.min(1, p / 0.18));
          set('--eclat-zoom', clamp01((p - 0.18) / 0.07));

          const t = clamp01((p - 0.25) / 0.75) * dernier;
          const etape = Math.floor(t);
          const reste = t - etape;
          const camera = reste <= 0.5 ? Math.min(dernier, etape) : Math.min(dernier, etape + ease((reste - 0.5) / 0.5));
          set('--eclat-camera', camera);

          const a = Math.min(dernier, Math.floor(camera));
          const b = Math.min(dernier, a + 1);
          const f = camera - a;
          set('--cam-x', calques[a].dx + (calques[b].dx - calques[a].dx) * f);
          set('--cam-y', calques[a].dy + (calques[b].dy - calques[a].dy) * f);
          piloterVideos(camera, clamp01((p - 0.18) / 0.07));
        },
      });

      rafraichirDansLOrdre();

      let detacherOrbite: (() => void) | undefined;

      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const orbiteX = gsap.quickTo(root, '--orbite-x', { duration: 0.7, ease: 'power3.out' });
        const orbiteY = gsap.quickTo(root, '--orbite-y', { duration: 0.7, ease: 'power3.out' });
        const borne = (v: number) => Math.max(-1, Math.min(1, v));

        const onMove = (e: PointerEvent) => {
          const r = piste.getBoundingClientRect();
          orbiteY(6 * borne((e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
          orbiteX(-6 * borne((e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
        };
        const onLeave = () => {
          orbiteX(0);
          orbiteY(0);
        };

        piste.addEventListener('pointermove', onMove);
        piste.addEventListener('pointerleave', onLeave);
        detacherOrbite = () => {
          piste.removeEventListener('pointermove', onMove);
          piste.removeEventListener('pointerleave', onLeave);
        };
      }

      return () => {
        trigger.kill();
        detacherOrbite?.();
        VARIABLES.forEach((v) => root.style.removeProperty(v));
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      <p className="sr-only">
        Schéma en perspective : sept calques empilés puis écartés les uns des autres.
      </p>

      <div ref={rootRef} data-eclat className="mt-16">
        <div ref={pisteRef} data-eclat-piste>
          <div data-eclat-scene aria-hidden="true">
            <div data-eclat-pile>
              <svg data-eclat-sol aria-hidden="true" viewBox="0 0 160 100" preserveAspectRatio="none">
                {Array.from({ length: 9 }, (_, n) => (
                  <line key={`v${n}`} style={{ '--n': n } as React.CSSProperties} x1={n * 20} y1={0} x2={n * 20} y2={100} pathLength={1} />
                ))}
                {Array.from({ length: 6 }, (_, n) => (
                  <line key={`h${n}`} style={{ '--n': n + 9 } as React.CSSProperties} x1={0} y1={n * 20} x2={160} y2={n * 20} pathLength={1} />
                ))}
              </svg>

              {calques.map((calque, i) => (
                <div
                  key={calque.etiquette}
                  data-eclat-calque
                  style={{ '--i': i, '--dx': calque.dx, '--dy': calque.dy } as React.CSSProperties}
                >
                  <span data-eclat-etiquette className={`${label} flex justify-between gap-3`}>
                    <span>{calque.etiquette}</span>
                    <span className="opacity-50">{String(i + 1).padStart(2, '0')}</span>
                  </span>
                  <span data-eclat-tranche="droite" aria-hidden="true" />
                  <span data-eclat-tranche="bas" aria-hidden="true" />
                  <span data-eclat-cadre>
                    <i data-eclat-poignee />
                    <i data-eclat-poignee />
                    <i data-eclat-poignee />
                    <i data-eclat-poignee />
                    <span data-eclat-carte className={`${carte} rounded-lg`}>
                      <Media media={calque.media} />
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <span data-eclat-axe className={label}>
            <span className="opacity-50">Premiers projets</span>
            <span data-eclat-axe-trait />
            <span className="opacity-50">Escape game VR</span>
          </span>

          <ol ref={listeRef} data-eclat-legendes>
            {calques.map((calque, i) => (
              <li key={calque.etiquette} data-eclat-legende style={{ '--i': i } as React.CSSProperties}>
                <span data-eclat-vignette aria-hidden="true" className={`${carte} mb-5 rounded-3xl`}>
                  <Media media={calque.media} />
                </span>
                <p className={`${label} opacity-50`}>
                  {String(i + 1).padStart(2, '0')} · {calque.etiquette}
                </p>
                <h3 className="mt-4 text-2xl md:text-4xl font-semibold leading-tight">
                  {calque.titre}
                </h3>
                <p className="mt-4 opacity-70 leading-relaxed md:text-lg">{calque.texte}</p>
                <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                  {calque.tags.map((tag) => (
                    <li key={tag} className={`${label} opacity-50`}>
                      {tag}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <span data-eclat-progres aria-hidden="true">
            <span ref={progresRef} />
          </span>
        </div>
      </div>
    </>
  );
}
