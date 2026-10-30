'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reveler } from '@/lib/reveal';
import { Space_Grotesk } from 'next/font/google';
import PageFooter from '@/components/PageFooter';
import Navbar from '@/components/Navbar';
import HeroProjet from '@/components/HeroProjet';
import LazyVideo from '@/components/LazyVideo';
import EclatStack from '@/components/EclatStack';
import ScrollSequence, { type Chapitre } from '@/components/ScrollSequence';
import dynamic from 'next/dynamic';

const CharmanderViewer = dynamic(() => import('@/components/CharmanderViewer'), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

// Séquence d'évolution racontée en trois étapes, du modèle Blender au navigateur.
// Repères de l'animation (progression du scroll) :
//   Salamèche → évolution sur fond noir 0.10-0.40 (flash à 0.32)
//   Reptincel → évolution sur fond noir 0.55-0.85 (flash à 0.77)
//   Dracaufeu jusqu'à la fin
// Les évolutions passent sur fond noir dans les deux thèmes : on garde les textes hors de ces phases.
const chapitresSequence: Chapitre[] = [
  {
    debut: -0.1, fin: 0.09, cote: 'gauche',
    label: 'Étape 1 / Conception Blender',
    titre: 'Modéliser\net éclairer.',
    texte: 'Les trois modèles glTF sont importés dans Blender, leurs textures ravivées, puis posés dans un studio lumineux, en version claire et sombre pour suivre le thème du site.',
    annotation: 'Blender · EEVEE',
  },
  {
    debut: 0.4, fin: 0.55, cote: 'gauche',
    label: 'Étape 2 / Animation & rendu',
    titre: 'Une évolution\nécrite en Python.',
    texte: 'Silhouettes lumineuses, alternance des formes, flash : toute l’animation est pilotée par un script bpy, puis rendue en 360 images 1920×1080 compressées en WebP.',
  },
  {
    debut: 0.86, fin: 1.1, cote: 'droite',
    label: 'Étape 3 / Intégration Three.js',
    titre: 'Rejouée dans\nle navigateur.',
    texte: 'La séquence défile au rythme du scroll sur un canvas, synchronisée par GSAP. Plus bas, les modèles glTF sont chargés en temps réel avec Three.js et React Three Fiber.',
  },
];

export default function Projets3DPage() {
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      reveler(textRefs.current);
    });
    return () => ctx.revert();
  }, []);

  const addToTextRefs = (el: HTMLDivElement | null) => {
    if (el && !textRefs.current.includes(el)) textRefs.current.push(el);
  };

  return (
    <main className={`${spaceGrotesk.className} text-black dark:text-white min-h-screen transition-colors duration-500`}>
      <Navbar />

      {/* OUVERTURE : bandeau titre + média de la carte d’accueil */}
      <HeroProjet id="3d" />

      {/* 2. INTRODUCTION */}
      <section className="py-20 px-6 md:px-10 border-t border-black/10 dark:border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-sm max-w-7xl mx-auto">
          <div className="carte carte-survol p-6">
            <p className="opacity-50 mb-2 uppercase tracking-widest text-xs">Logiciels</p>
            <p className="font-medium text-lg">Blender · Three.js · R3F</p>
          </div>
          <div className="carte carte-survol p-6">
            <p className="opacity-50 mb-2 uppercase tracking-widest text-xs">Domaine</p>
            <p className="font-medium text-lg">Conception & Intégration Web</p>
          </div>
          <div className="carte carte-survol p-6">
            <p className="opacity-50 mb-2 uppercase tracking-widest text-xs">Compétences clés</p>
            <p className="font-medium text-lg leading-relaxed">Modélisation 3D, Texturing, Shaders, Animation, Optimisation glTF</p>
          </div>
        </div>
      </section>

      {/* 2ter. SÉQUENCE AU SCROLL (façon Apple) */}
      <section aria-label="Évolution de Salamèche en Reptincel puis Dracaufeu, rejouée au scroll" className="border-t border-black/10 dark:border-white/10">
        <ScrollSequence
          dossiers={{ clair: '/sequences/evolution', sombre: '/sequences/evolution-sombre' }}
          total={360}
          duree={350}
          chapitres={chapitresSequence}
        />
      </section>

      {/* 2bis. PILE ÉCLATÉE 3D */}
      <section aria-labelledby="eclat-titre" className="py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] opacity-60 mb-3">01</p>
          <h2 id="eclat-titre" className="text-4xl md:text-6xl font-semibold leading-tight max-w-2xl opacity-90">
            Sept scènes modélisées dans Blender.
          </h2>
          <p className="opacity-70 leading-relaxed text-lg mt-6 max-w-lg">
            Une salle de cours, une ville procédurale, puis un escape game VR complet : quartier, manoir, personnages.
            <span className="hidden md:inline"> Faites défiler : la pile s&apos;ouvre, puis on la traverse.</span>
            <span className="md:hidden"> Faites glisser pour parcourir les scènes.</span>
          </p>
          <EclatStack />
        </div>
      </section>

      {/* 3. SECTION PINNING */}
      <section className="relative flex flex-col md:flex-row w-full max-w-7xl mx-auto px-6 md:px-10 items-start">
        <div className="w-full md:w-1/2 flex flex-col pt-16 pb-24 md:pt-[15vh] md:pb-[20vh] gap-8 md:gap-[40vh] z-10">
          <div ref={addToTextRefs} className="carte max-w-md p-6 md:p-8 backdrop-blur-sm">
            <p className="text-sm font-medium opacity-50 tracking-widest uppercase mb-4">Modélisation Blender</p>
            <p className="text-3xl md:text-4xl font-semibold leading-tight mb-6">Reproduire fidèlement notre salle de cours de l&apos;IUT en 3D.</p>
            <p className="opacity-70 leading-relaxed text-lg">
              À partir de relevés de dimensions réels, j&apos;ai modélisé chaque élément de la salle dans Blender.
            </p>
          </div>
          <div ref={addToTextRefs} className="carte max-w-md p-6 md:p-8 backdrop-blur-sm">
            <p className="text-sm font-medium opacity-50 tracking-widest uppercase mb-4">Workflow</p>
            <p className="text-3xl md:text-4xl font-semibold leading-tight mb-6">Du plan papier au rendu photoréaliste.</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 hidden md:flex sticky top-0 h-screen items-center justify-center">
          <div className="relative w-full max-w-130 aspect-square rounded-[3rem] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4">
            <CharmanderViewer />
          </div>
        </div>
      </section>

      {/* 4. SECTION GRILLE — SKILLS */}
      <section className="py-24 px-6 md:px-10 border-t border-black/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-6xl font-semibold leading-tight mb-12 md:mb-20 max-w-4xl opacity-90">
            De la conception dans Blender jusqu&apos;à l&apos;expérience interactive dans le navigateur.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative rounded-3xl overflow-hidden aspect-4/3 md:aspect-video shadow-2xl border border-black/10 dark:border-white/10 group">
              <LazyVideo src="/blender.mp4" className="w-full h-full object-cover opacity-90 transition-transform duration-1000 ease-out-soft group-hover:scale-[1.04] pointer-events-none" />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8 pointer-events-none">
                <p className="text-xs uppercase tracking-widest text-white/60 mb-2 font-mono">Étape 1</p>
                <p className="text-2xl font-semibold text-white drop-shadow-md">Modélisation & Texturing</p>
                <p className="text-sm text-white/70 mt-2">Blender · UV Unwrapping · Matériaux PBR · Export glTF</p>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden aspect-4/3 md:aspect-video shadow-2xl border border-black/10 dark:border-white/10 group">
              <LazyVideo src="/playstation_2.mp4" className="w-full h-full object-cover opacity-90 transition-transform duration-1000 ease-out-soft group-hover:scale-[1.04] pointer-events-none" />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8 pointer-events-none">
                <p className="text-xs uppercase tracking-widest text-white/60 mb-2 font-mono">Étape 2</p>
                <p className="text-2xl font-semibold text-white drop-shadow-md">Intégration Three.js</p>
                <p className="text-sm text-white/70 mt-2">React Three Fiber · GLSL Shaders · Post-processing · Animation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION PORTFOLIO PS5 */}
      <section className="py-24 px-6 md:px-10 overflow-hidden border-t border-black/10 dark:border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
              <div className="carte w-full md:w-1/3 p-6 md:p-8">
                   <p className="text-sm font-medium opacity-50 tracking-widest uppercase mb-4 font-mono">Portfolio interactif</p>
                   <h2 className="text-3xl md:text-5xl font-semibold leading-tight opacity-90 mb-6">
                      Modèles 3D intégrés via Three.js.
                   </h2>
                   <p className="opacity-70 leading-relaxed mb-4 text-lg">
                      Les modèles créés sous Blender sont exportés en format <span className="font-medium">glTF/GLB</span>, puis chargés et animés en temps réel dans le navigateur avec <span className="font-medium">React Three Fiber</span>.
                   </p>
                   <p className="opacity-70 leading-relaxed text-lg">
                      Des shaders GLSL custom (God Rays, Bokeh, réflexions d&apos;environnement) viennent enrichir le rendu pour une expérience cinématique, fidèle à l&apos;UI de la PlayStation 5.
                   </p>
              </div>

              <div className="w-full md:w-2/3 relative h-[45vh] md:h-[60vh] overflow-hidden">
                   <div className="absolute right-0 top-0 w-3/4 h-[90%] rounded-3xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 z-10 group">
                       <LazyVideo src="/playstation_2.mp4" className="w-full h-full object-cover transition-transform duration-1000 ease-out-soft group-hover:scale-[1.04] pointer-events-none" />
                   </div>
                   <div className="absolute left-0 bottom-0 w-1/2 aspect-4/3 rounded-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-black/10 dark:border-white/10 z-20 group">
                       <LazyVideo src="/blender.mp4" className="w-full h-full object-cover transition-transform duration-1000 ease-out-soft group-hover:scale-[1.04] pointer-events-none" />
                   </div>
              </div>
          </div>
      </section>

      {/* FOOTER NAV + COPYRIGHT */}
      <PageFooter precedent={{ href: '/a-propos', label: 'À Propos' }} suivant={{ href: '/projets', label: 'Projets' }} />
    </main>
  );
}