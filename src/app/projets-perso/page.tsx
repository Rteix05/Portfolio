'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Space_Grotesk } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { getTechIcon } from '@/lib/techIcons';

gsap.registerPlugin(ScrollTrigger);

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

// Données enrichies avec les images et vidéos (temporairement les mêmes vidéos PS5 partout)
const projets = [
  {
    id: 1,
    name: 'Portfolio — Next.js',
    type: 'Next.js · TailwindCSS · GSAP · Three.js',
    description: "Portfolio personnel développé avec Next.js, Tailwind CSS, GSAP et React Three Fiber. Animations au scroll, viewer 3D interactif, design immersif et navigation fluide entre les pages.",
    link: 'https://rafaelteixeira.fr',
    image: '/portfolio.png',
    video: '/background.mp4', 
  },
  {
    id: 2,
    name: 'PS3 UI — Interface Website',
    type: 'Vue.js · UI Design',
    description: 'Site Vue + Tailwind imitant l\'interface utilisateur de la PlayStation 3, avec des animations atmosphériques et des transitions soignées. Navigation au clavier et interactions fidèles à l\'original.',
    link: 'https://ps3userinterface.vercel.app/',
    image: '/ps3-bg.jpg',
    video: '/play3.mp4',
  },
  {
    id: 3,
    name: 'PS5 Portfolio — 3D Exp',
    type: 'Three.js · R3F · GLSL · React',
    description: 'Portfolio personnel reproduisant l\'UI de la PS5 entièrement en 3D dans le navigateur. Navigation spatiale, modèles GLB animés, shaders custom (God Rays, Bokeh, Réflexions), particules et effets post-processing.',
    link: 'https://portfolio-playstation-bp93gdmje.vercel.app/',
    image: '/play5.jpg',
    video: '/playstation.mp4',
  },
];

export default function ProjetsPersoPage() {
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      textRefs.current.forEach((el) => {
        if (el) {
          gsap.fromTo(el,
            { opacity: 0, y: 50 },
            {
              opacity: 1, y: 0, duration: 1, ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                end: 'bottom 20%',
                toggleActions: 'play reverse play reverse',
              },
            }
          );
        }
      });
    });
    return () => ctx.revert();
  }, []);

  const addRef = (el: HTMLDivElement | null) => {
    if (el && !textRefs.current.includes(el)) textRefs.current.push(el);
  };

  return (
    <main className={`${spaceGrotesk.className} bg-white text-black dark:bg-[#050505] dark:text-white min-h-screen transition-colors duration-500`}>
      <Navbar />

      {/* HERO AVEC IMAGE DE FOND */}
      <section className="h-screen w-full relative flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop" 
          alt="Hero Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity pointer-events-none" 
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-white dark:to-[#050505]" />
        
        <div className="relative z-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] mb-6 opacity-60">Side Projects</p>
          <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[9rem] font-serif tracking-tighter leading-none drop-shadow-2xl">
            Projets
          </h1>
          <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[9rem] font-serif tracking-tighter leading-none -mt-1 md:-mt-6 drop-shadow-2xl">
            Personnels
          </h1>
        </div>
      </section>

      {/* INTRO */}
      <section className="relative z-10 bg-white dark:bg-[#050505] pt-10 px-6 md:px-10 pb-16 transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-black/10 dark:border-white/20 pt-10 text-sm">
            <div className="md:col-span-1">
              <h2 className="text-3xl md:text-5xl font-serif tracking-tight leading-tight text-black/90 dark:text-white/90">
                L&apos;exploration créative au-delà des cours
              </h2>
            </div>
            <div className="md:col-span-1 flex flex-col justify-end">
              <p className="text-lg text-black/60 dark:text-white/60 leading-relaxed">
                Des projets personnels pour expérimenter avec des technologies modernes,
                pousser les limites du design web et créer des expériences uniques et immersives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROJETS (COMPOSITION IMAGE + VIDÉO) */}
      <div className="pb-32 bg-white dark:bg-[#050505] transition-colors duration-500">
        {projets.map((projet, index) => {
          const isEven = index % 2 === 0;

          return (
            <section key={projet.id} className="relative z-10 py-32 px-6 md:px-10 overflow-hidden">
              <div className={`max-w-7xl mx-auto flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 md:gap-24`}>
                
                {/* PARTIE TEXTE */}
                <div ref={addRef} className="w-full md:w-1/3">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm opacity-50 uppercase tracking-widest font-mono">0{projet.id}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {projet.type.split('·').map((tech) => {
                      const name = tech.trim();
                      const icon = getTechIcon(name);
                      return (
                        <span key={name} className="inline-flex items-center gap-1.5 rounded-full border border-black/10 dark:border-white/15 px-3 py-1 text-xs opacity-70">
                          {icon && <span className="text-sm">{icon}</span>}
                          {name}
                        </span>
                      );
                    })}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-6">
                    {projet.name.split('—')[0].trim()}
                  </h2>
                  <p className="text-lg opacity-70 leading-relaxed mb-10">
                    {projet.description}
                  </p>
                  {projet.link !== '#' && (
                    <a
                      href={projet.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-black/20 dark:border-white/20 px-6 py-3 text-sm font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                    >
                      Voir le projet <span>↗</span>
                    </a>
                  )}
                </div>

                {/* PARTIE MÉDIAS (Superposition Image + Vidéo) */}
                <div ref={addRef} className="w-full md:w-2/3 relative h-[50vh] md:h-[70vh]">
                  
                  {/* Grande Image (En arrière-plan) */}
                  <div className={`absolute ${isEven ? 'right-0' : 'left-0'} top-0 w-4/5 h-[85%] rounded-3xl overflow-hidden shadow-2xl border border-black/5 dark:border-white/10 z-10 bg-gray-100 dark:bg-zinc-900`}>
                    <img 
                      src={projet.image} 
                      alt={projet.name} 
                      className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                    />
                  </div>

                  {/* Petite Vidéo (Superposée) */}
                  <div className={`absolute ${isEven ? 'left-0' : 'right-0'} bottom-0 w-[55%] aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-black/5 dark:border-white/10 z-20 bg-black`}>
                    <video 
                      autoPlay muted loop playsInline disablePictureInPicture disableRemotePlayback 
                      className="w-full h-full object-cover pointer-events-none"
                    >
                      <source src={projet.video} type="video/mp4" />
                    </video>
                  </div>

                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* SECTION GRILLE TECHNOS */}
      <section className="relative z-10 bg-gray-50 dark:bg-black py-24 px-6 md:px-10 border-t border-black/5 dark:border-white/10 transition-colors duration-500">
        <div className="max-w-5xl mx-auto">
          <div ref={addRef} className="mb-16 text-center md:text-left">
            <p className="text-sm font-medium opacity-50 tracking-widest uppercase mb-4">Technologies utilisées</p>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight">
              Stack des projets perso
            </h2>
          </div>

          <div ref={addRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Next.js', 'Vue.js', 'React', 'Three.js', 'React Three Fiber', 'GSAP', 'TailwindCSS', 'GLSL Shaders', 'Vite', 'Vercel'].map((tech) => {
              const icon = getTechIcon(tech);
              return (
                <div key={tech} className="rounded-xl border border-black/10 dark:border-white/10 px-5 py-5 flex flex-col items-center gap-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  {icon && <span className="text-xl opacity-70">{icon}</span>}
                  {tech}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-6 px-6 md:px-20 py-16 bg-white dark:bg-[#050505] border-t border-black/5 dark:border-white/10 transition-colors duration-500">
        <a href="/projets-scolaires" className="text-2xl md:text-4xl lg:text-6xl font-serif italic text-black/20 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
          ← Projets Scolaires
        </a>
        <a href="/design" className="text-2xl md:text-4xl lg:text-6xl font-serif italic text-black/20 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
          Design →
        </a>
      </section>
    </main>
  );
}