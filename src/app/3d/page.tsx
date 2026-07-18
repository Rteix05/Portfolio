'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Space_Grotesk } from 'next/font/google';
import Navbar from '@/components/Navbar';
import dynamic from 'next/dynamic';

const CharmanderViewer = dynamic(() => import('@/components/CharmanderViewer'), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export default function Projets3DPage() {
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      textRefs.current.forEach((text) => {
        if (text) {
          gsap.fromTo(
            text,
            { opacity: 0, y: 100 },
            {
              opacity: 1, 
              y: 0, 
              scrollTrigger: {
                trigger: text,
                start: 'top 85%', 
                end: 'top 40%',   
                scrub: 1,         
              },
            }
          );
          gsap.to(text, {
            opacity: 0,
            y: -100,
            scrollTrigger: {
              trigger: text,
              start: 'bottom 40%', 
              end: 'bottom 10%',
              scrub: 1,
            },
          });
        }
      });
    });
    return () => ctx.revert();
  }, []);

  const addToTextRefs = (el: HTMLDivElement | null) => {
    if (el && !textRefs.current.includes(el)) textRefs.current.push(el);
  };

  return (
    <main className={`${spaceGrotesk.className} bg-white dark:bg-[#050505] text-black dark:text-white min-h-screen transition-colors duration-500`}>
      <Navbar />

      {/* 1. HERO SECTION avec vidéo Blender */}
      <section className="h-screen w-full relative overflow-hidden flex items-end pb-16 pl-6 md:pl-10">
        <video 
          autoPlay muted loop playsInline disablePictureInPicture
          className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-30"
        >
          <source src="/blender.mp4" type="video/mp4" />
        </video>
        {/* Overlay pour assurer le contraste du texte */}
        <div className="absolute inset-0 bg-white/40 dark:bg-black/50" />
        
        <div className="relative z-10 max-w-4xl">
          <p className="text-sm uppercase tracking-[0.3em] opacity-60 mb-3">3D & Interactive</p>
          <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[9rem] font-semibold tracking-tighter leading-none">
            Expériences 3D
          </h1>
        </div>
      </section>

      {/* 2. INTRODUCTION */}
      <section className="py-20 px-6 md:px-10 border-t border-black/10 dark:border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-sm max-w-6xl mx-auto">
          <div className="p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            <p className="opacity-50 mb-2 uppercase tracking-widest text-xs">Logiciels</p>
            <p className="font-medium text-lg">Blender · Three.js · R3F</p>
          </div>
          <div className="p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            <p className="opacity-50 mb-2 uppercase tracking-widest text-xs">Domaine</p>
            <p className="font-medium text-lg">Conception & Intégration Web</p>
          </div>
          <div className="p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            <p className="opacity-50 mb-2 uppercase tracking-widest text-xs">Compétences clés</p>
            <p className="font-medium text-lg leading-relaxed">Modélisation 3D, Texturing, Shaders, Animation, Optimisation glTF</p>
          </div>
        </div>
      </section>

      {/* 3. SECTION PINNING */}
      <section className="relative flex flex-col md:flex-row w-full max-w-7xl mx-auto px-10 items-start">
        <div className="w-full md:w-1/2 flex flex-col pt-[15vh] pb-[20vh] gap-8 md:gap-[40vh] z-10">
          <div ref={addToTextRefs} className="max-w-md p-8 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-xl">
            <p className="text-sm font-medium opacity-50 tracking-widest uppercase mb-4">Modélisation Blender</p>
            <p className="text-3xl md:text-4xl font-semibold leading-tight mb-6">Reproduire fidèlement notre salle de cours de l&apos;IUT en 3D.</p>
            <p className="opacity-70 leading-relaxed text-lg">
              À partir de relevés de dimensions réels, j&apos;ai modélisé chaque élément de la salle dans Blender.
            </p>
          </div>
          <div ref={addToTextRefs} className="max-w-md p-8 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-xl">
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
          <h2 className="text-4xl md:text-6xl font-semibold leading-tight mb-20 max-w-4xl opacity-90">
            De la conception dans Blender jusqu&apos;à l&apos;expérience interactive dans le navigateur.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative rounded-3xl overflow-hidden aspect-video shadow-2xl border border-black/10 dark:border-white/10 group">
              <video autoPlay muted loop playsInline disablePictureInPicture disableRemotePlayback className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105 pointer-events-none">
                <source src="/blender.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 pointer-events-none">
                <p className="text-xs uppercase tracking-widest text-white/60 mb-2 font-mono">Étape 1</p>
                <p className="text-2xl font-semibold text-white drop-shadow-md">Modélisation & Texturing</p>
                <p className="text-sm text-white/70 mt-2">Blender · UV Unwrapping · Matériaux PBR · Export glTF</p>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden aspect-video shadow-2xl border border-black/10 dark:border-white/10 group">
              <video autoPlay muted loop playsInline disablePictureInPicture disableRemotePlayback className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105 pointer-events-none">
                <source src="/playstation_2.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 pointer-events-none">
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
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
              <div className="w-full md:w-1/3 p-8 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-2xl">
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

              <div className="w-full md:w-2/3 relative h-[60vh]">
                   <div className="absolute right-0 top-0 w-3/4 h-[90%] rounded-3xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 z-10 group">
                       <video autoPlay muted loop playsInline disablePictureInPicture disableRemotePlayback className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none">
                          <source src="/playstation_2.mp4" type="video/mp4" />
                       </video>
                   </div>
                   <div className="absolute left-0 bottom-0 w-1/2 aspect-4/3 rounded-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-black/10 dark:border-white/10 z-20 group">
                       <video autoPlay muted loop playsInline disablePictureInPicture disableRemotePlayback className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none">
                          <source src="/blender.mp4" type="video/mp4" />
                       </video>
                   </div>
              </div>
          </div>
      </section>

      {/* FOOTER NAV + COPYRIGHT */}
      <footer className={`border-t border-black/8 dark:border-white/8 ${spaceGrotesk.className}`}>
        <div className="flex items-center justify-between px-6 md:px-16 py-16">
          <a
            href="/a-propos"
            className="text-2xl md:text-3xl font-semibold uppercase tracking-tight text-black/20 dark:text-white/20 hover:text-black dark:hover:text-white transition-colors"
          >
            &larr; À Propos
          </a>
          <a
            href="/projets-scolaires"
            className="text-2xl md:text-3xl font-semibold uppercase tracking-tight text-black/20 dark:text-white/20 hover:text-black dark:hover:text-white transition-colors"
          >
            Projets Scolaires &rarr;
          </a>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-6 border-t border-black/8 dark:border-white/8 gap-3">
          <p className="text-xs text-black/20 dark:text-white/20 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Rafael Teixeira — Tous droits réservés
          </p>
          <p className="text-xs text-black/20 dark:text-white/20 uppercase tracking-widest">Développeur Full Stack &amp; UI/UX</p>
        </div>
      </footer>
    </main>
  );
}