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
    // On enlève le fond statique pour laisser place à la vidéo
    <main className={`${spaceGrotesk.className} relative text-white min-h-screen transition-colors duration-500 bg-black`}>
      
      {/* BACKGROUND VIDEO 3D GLOBALE FIXE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          disablePictureInPicture
          className="w-full h-full object-cover opacity-60 mix-blend-lighten"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
        {/* Calque d'assombrissement pour la lisibilité */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Le contenu passe au-dessus de la vidéo avec z-10 */}
      <div className="relative z-10">
        <Navbar />

        {/* 1. HERO SECTION */}
        <section className="h-screen w-full relative overflow-hidden flex items-end pb-8 md:pb-16 pl-6 md:pl-10">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60 mb-3 drop-shadow-md">3D & Interactive</p>
          <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[9rem] font-serif tracking-tighter leading-none text-white drop-shadow-2xl">
              Expériences 3D
            </h1>
          </div>
        </section>

        {/* 2. INTRODUCTION (Glassmorphism) */}
        <section className="pt-20 px-6 md:px-10 pb-20 border-t border-white/10 backdrop-blur-sm bg-black/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-sm max-w-6xl mx-auto">
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <p className="text-white/50 mb-2 uppercase tracking-widest text-xs">Logiciels</p>
              <p className="font-medium text-lg">Blender · Three.js · R3F</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <p className="text-white/50 mb-2 uppercase tracking-widest text-xs">Domaine</p>
              <p className="font-medium text-lg">Conception & Intégration Web</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <p className="text-white/50 mb-2 uppercase tracking-widest text-xs">Compétences clés</p>
              <p className="font-medium text-lg leading-relaxed">Modélisation 3D, Texturing, Shaders, Animation, Optimisation glTF</p>
            </div>
          </div>
        </section>

        {/* 3. SECTION PINNING */}
        <section className="relative flex flex-col md:flex-row w-full max-w-7xl mx-auto px-10 items-start">
          
          <div className="w-full md:w-1/2 flex flex-col pt-[15vh] pb-[20vh] gap-8 md:gap-[40vh] z-10">
            
            <div ref={addToTextRefs} className="max-w-md p-8 rounded-3xl backdrop-blur-md bg-black/40 border border-white/10 shadow-2xl">
              <p className="text-sm font-medium text-white/50 tracking-widest uppercase mb-4">Modélisation Blender</p>
              <p className="text-3xl md:text-4xl font-serif leading-tight text-white/90 mb-6 drop-shadow-md">
                Reproduire fidèlement notre salle de cours de l&apos;IUT en 3D.
              </p>
              <p className="text-white/70 leading-relaxed text-lg">
                À partir de relevés de dimensions réels, j&apos;ai modélisé chaque élément de la salle — mobilier, matériaux, éclairage — dans Blender. Un exercice complet allant de la prise de mesures à la gestion des textures UV et des lumières d&apos;ambiance.
              </p>
            </div>

            <div ref={addToTextRefs} className="max-w-md p-8 rounded-3xl backdrop-blur-md bg-black/40 border border-white/10 shadow-2xl">
              <p className="text-sm font-medium text-white/50 tracking-widest uppercase mb-4">Workflow</p>
              <p className="text-3xl md:text-4xl font-serif leading-tight text-white/90 mb-6 drop-shadow-md">
                Du plan papier au rendu photoréaliste.
              </p>
              <p className="text-white/70 leading-relaxed text-lg">
                Modélisation polygonale, unwrapping UV, application de matériaux PBR et mise en scène d&apos;un éclairage HDRI pour obtenir un rendu réaliste. Le fichier final a ensuite été exporté en glTF pour une intégration web optimisée.
              </p>
            </div>

          </div>

          {/* VIEWER 3D */}
          <div className="w-full md:w-1/2 hidden md:flex sticky top-0 h-screen items-center justify-center">
            {/* Ajout d'un socle en verre sous le modèle 3D pour le faire ressortir du fond */}
            <div className="relative w-full max-w-130 aspect-square rounded-[3rem] backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-4">
              <CharmanderViewer />
            </div>
          </div>

        </section>

        {/* 4. SECTION GRILLE — SKILLS */}
        <section className="py-24 px-6 md:px-10 border-t border-white/10 backdrop-blur-sm bg-black/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-20 max-w-4xl text-white/90 drop-shadow-xl">
              De la conception dans Blender jusqu&apos;à l&apos;expérience interactive dans le navigateur.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative rounded-3xl overflow-hidden aspect-video shadow-2xl border border-white/10 group">
                <video autoPlay muted loop playsInline disablePictureInPicture disableRemotePlayback className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105 pointer-events-none">
                  <source src="/blender.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 pointer-events-none">
                  <p className="text-xs uppercase tracking-widest text-white/60 mb-2 font-mono">Étape 1</p>
                  <p className="text-2xl font-serif text-white drop-shadow-md">Modélisation & Texturing</p>
                  <p className="text-sm text-white/70 mt-2">Blender · UV Unwrapping · Matériaux PBR · Export glTF</p>
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden aspect-video shadow-2xl border border-white/10 group">
                <video autoPlay muted loop playsInline disablePictureInPicture disableRemotePlayback className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105 pointer-events-none">
                  <source src="/playstation_2.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 pointer-events-none">
                  <p className="text-xs uppercase tracking-widest text-white/60 mb-2 font-mono">Étape 2</p>
                  <p className="text-2xl font-serif text-white drop-shadow-md">Intégration Three.js</p>
                  <p className="text-sm text-white/70 mt-2">React Three Fiber · GLSL Shaders · Post-processing · Animation</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. SECTION PORTFOLIO PS5 */}
        <section className="py-24 px-6 md:px-10 overflow-hidden backdrop-blur-md bg-black/20">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
                <div className="w-full md:w-1/3 p-8 rounded-3xl backdrop-blur-md bg-black/40 border border-white/10 shadow-2xl">
                     <p className="text-sm font-medium text-white/50 tracking-widest uppercase mb-4 font-mono">Portfolio interactif</p>
                     <h2 className="text-3xl md:text-5xl font-serif leading-tight text-white/90 mb-6">
                        Modèles 3D intégrés via Three.js.
                     </h2>
                     <p className="text-white/70 leading-relaxed mb-4 text-lg">
                        Les modèles créés sous Blender sont exportés en format <span className="font-medium text-white">glTF/GLB</span>, puis chargés et animés en temps réel dans le navigateur avec <span className="font-medium text-white">React Three Fiber</span>.
                     </p>
                     <p className="text-white/70 leading-relaxed text-lg">
                        Des shaders GLSL custom (God Rays, Bokeh, réflexions d&apos;environnement) viennent enrichir le rendu pour une expérience cinématique, fidèle à l&apos;UI de la PlayStation 5.
                     </p>
                </div>

                <div className="w-full md:w-2/3 relative h-[60vh]">
                     <div className="absolute right-0 top-0 w-3/4 h-[90%] rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-10 group">
                         <video autoPlay muted loop playsInline disablePictureInPicture disableRemotePlayback className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none">
                            <source src="/playstation_2.mp4" type="video/mp4" />
                         </video>
                     </div>
                     <div className="absolute left-0 bottom-0 w-1/2 aspect-4/3 rounded-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10 z-20 group">
                         <video autoPlay muted loop playsInline disablePictureInPicture disableRemotePlayback className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none">
                            <source src="/blender.mp4" type="video/mp4" />
                         </video>
                     </div>
                </div>
            </div>
        </section>

        {/* 6. FOOTER */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-6 px-6 md:px-20 py-16 border-t border-white/10 backdrop-blur-xl bg-black/60">
           <a href="/a-propos" className="text-2xl md:text-4xl lg:text-6xl font-serif italic text-white/30 hover:text-white transition-colors cursor-pointer drop-shadow-lg">
              ← À Propos
           </a>
           <a href="/projets-scolaires" className="text-2xl md:text-4xl lg:text-6xl font-serif italic text-white/30 hover:text-white transition-colors cursor-pointer drop-shadow-lg">
              Projets Scolaires →
           </a>
        </section>

      </div>
    </main>
  );
}
