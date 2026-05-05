'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/components/Navbar';
import { getTechIcon } from '@/lib/techIcons';

gsap.registerPlugin(ScrollTrigger);

const projets = [
  {
    id: 1,
    name: 'Sommeval',
    subtitle: 'SAE 301 · Desktop',
    type: 'Figma · UI Design · Desktop · Prototypage',
    description: 'Maquette desktop haute-fidélité pour la SAE 301. Conception d\'une interface de gestion et de découverte de caves et domaines viticoles, avec une identité visuelle soignée et un parcours utilisateur fluide.',
    figmaLink: 'https://www.figma.com/design/f4zaIVAKcbR1ZSqSoDmMZU/SAE-301---Sommeval---Lou-CALMES---Lucas-CORRIERAS---Rafael-TEIXEIRA?node-id=0-1&t=GfFna88C8grUnim4-1',
    accent: '#a16207',
    screens: [
      '/sommevalfig.jpg',
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 2,
    name: 'Carb\'On',
    subtitle: 'Mobile First · Environnement',
    type: 'Figma · UI Design · Mobile · UX Research',
    description: 'Application mobile de suivi d\'empreinte carbone. Approche mobile-first avec une expérience utilisateur simplifiée pour encourager les comportements éco-responsables au quotidien.',
    figmaLink: 'https://www.figma.com/design/X2muTfFrU4o62ABzqQwtlU/Carb-On---WS401-%7C-Lou-CALMES-%7C-Rafael-TEIXEIRA-%7C-Marwan-BOUCHEBBAT-%7C-Radouan-OURIRI-%7C-Rahman-TURKMEN?node-id=0-1&t=khOQ4HSUyCeqN3lc-1',
    accent: '#16a34a',
    screens: [
      '/carbonfig.jpg',
      'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 3,
    name: 'WR403D — Jeux de Niche',
    subtitle: 'Projet de cours · Steam-like',
    type: 'Figma · UI Design · Web · Prototypage · UX',
    description: 'Conception d\'un site inspiré de Steam dédié aux jeux de niche. Deux prototypes d\'expériences interactives et plusieurs pages du site : accueil, fiche jeu, catalogue — avec une identité visuelle sombre et immersive.',
    figmaLink: 'https://www.figma.com/design/hn98fGNUkjNcm2jeSnKCTG/WR403D---Lou-CALMES-_-Rafael-TEIXEIRA-_-Marwan-BOUCHEBBAT-_-Radouan-OURIRI?node-id=37-3&t=XR5rbCbAUBuj2eca-1',
    accent: '#7c3aed',
    screens: [
      '/403fig.jpg',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=800&auto=format&fit=crop',
    ],
  },
];

export default function DesignPage() {
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
    <main className="bg-white text-black dark:bg-[#050505] dark:text-white min-h-screen transition-colors duration-500">
      <Navbar />

      {/* HERO */}
      <section className="h-screen w-full relative flex items-center justify-center overflow-hidden">
        {/* Vidéo de fond */}
        <video
          autoPlay muted loop playsInline disablePictureInPicture disableRemotePlayback
          className="absolute inset-0 w-full h-full object-cover opacity-30 dark:opacity-20 pointer-events-none"
        >
          <source src="/figma1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-linear-to-b from-white/50 via-white/10 to-white dark:from-[#050505]/50 dark:via-[#050505]/10 dark:to-[#050505]" />

        <div className="relative z-10 text-center px-6">
          <p className="text-sm uppercase tracking-[0.4em] mb-8 opacity-50">UI / UX · Figma</p>
          <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[11rem] font-serif tracking-tighter leading-none drop-shadow-2xl">
            Design
          </h1>
          <p className="mt-8 text-base md:text-lg opacity-50 max-w-md mx-auto leading-relaxed">
            Maquettes haute-fidélité, prototypes interactifs & design systems
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="relative z-10 bg-white dark:bg-[#050505] pt-10 px-6 md:px-10 pb-32 transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-black/10 dark:border-white/20 pt-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif tracking-tight leading-tight text-black/90 dark:text-white/90">
                Interfaces pensées pour l&apos;utilisateur
              </h2>
            </div>
            <div className="flex flex-col justify-end">
              <p className="text-lg text-black/60 dark:text-white/60 leading-relaxed">
                Du wireframe au prototype cliquable, chaque projet est conçu avec
                une approche centrée sur l&apos;expérience utilisateur, la cohérence
                visuelle et la simplicité d&apos;usage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROJETS FIGMA */}
      <div className="bg-white dark:bg-[#050505] transition-colors duration-500">
        {projets.map((projet, index) => {
          const isEven = index % 2 === 0;

          return (
            <section key={projet.id} className="relative py-24 md:py-40 overflow-hidden">

              {/* Fond teinté subtil */}
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{ background: `radial-gradient(ellipse at ${isEven ? '80%' : '20%'} 50%, ${projet.accent}, transparent 70%)` }}
              />

              <div className={`relative z-10 max-w-7xl mx-auto px-6 md:px-10 flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 md:gap-20`}>

                {/* TEXTE */}
                <div ref={addRef} className="w-full md:w-2/5 shrink-0">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs font-mono opacity-40 uppercase tracking-widest">0{projet.id}</span>
                    <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                    <span
                      className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{ background: `${projet.accent}20`, color: projet.accent }}
                    >
                      {projet.subtitle}
                    </span>
                  </div>

                  <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-5">
                    {projet.name}
                  </h2>

                  <div className="flex flex-wrap gap-2 mb-7">
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

                  <p className="text-base md:text-lg opacity-65 leading-relaxed mb-10">
                    {projet.description}
                  </p>

                  <a
                    href={projet.figmaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium border transition-all"
                    style={{
                      borderColor: `${projet.accent}60`,
                      color: projet.accent,
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = projet.accent;
                      (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = projet.accent;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = '';
                      (e.currentTarget as HTMLAnchorElement).style.color = projet.accent;
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = `${projet.accent}60`;
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 38 57" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 28.5C19 25.9804 20.0009 23.5641 21.7825 21.7825C23.5641 20.0009 25.9804 19 28.5 19C31.0196 19 33.4359 20.0009 35.2175 21.7825C36.9991 23.5641 38 25.9804 38 28.5C38 31.0196 36.9991 33.4359 35.2175 35.2175C33.4359 36.9991 31.0196 38 28.5 38C25.9804 38 23.5641 36.9991 21.7825 35.2175C20.0009 33.4359 19 31.0196 19 28.5Z"/>
                      <path d="M0 47.5C0 44.9804 1.00089 42.5641 2.78249 40.7825C4.56408 39.0009 6.98044 38 9.5 38H19V47.5C19 50.0196 17.9991 52.4359 16.2175 54.2175C14.4359 55.9991 12.0196 57 9.5 57C6.98044 57 4.56408 55.9991 2.78249 54.2175C1.00089 52.4359 0 50.0196 0 47.5Z"/>
                      <path d="M19 0V19H28.5C31.0196 19 33.4359 17.9991 35.2175 16.2175C36.9991 14.4359 38 12.0196 38 9.5C38 6.98044 36.9991 4.56408 35.2175 2.78249C33.4359 1.00089 31.0196 0 28.5 0H19Z"/>
                      <path d="M0 9.5C0 12.0196 1.00089 14.4359 2.78249 16.2175C4.56408 17.9991 6.98044 19 9.5 19H19V0H9.5C6.98044 0 4.56408 1.00089 2.78249 2.78249C1.00089 4.56408 0 6.98044 0 9.5Z"/>
                      <path d="M0 28.5C0 31.0196 1.00089 33.4359 2.78249 35.2175C4.56408 36.9991 6.98044 38 9.5 38H19V19H9.5C6.98044 19 4.56408 20.0009 2.78249 21.7825C1.00089 23.5641 0 25.9804 0 28.5Z"/>
                    </svg>
                    Voir sur Figma
                    <span>↗</span>
                  </a>
                </div>

                {/* MOCKUPS */}
                <div ref={addRef} className="w-full md:w-3/5 relative">
                  <div className="hidden md:grid grid-cols-5 grid-rows-2 gap-3 h-[65vh]">
                    {/* Screen principal */}
                    <div className="col-span-3 row-span-2 rounded-2xl overflow-hidden shadow-2xl border border-black/5 dark:border-white/10 bg-gray-100 dark:bg-zinc-900 group">
                      <img src={projet.screens[0]} alt={`${projet.name} - screen principal`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="col-span-2 row-span-1 rounded-2xl overflow-hidden shadow-xl border border-black/5 dark:border-white/10 bg-gray-100 dark:bg-zinc-900 group">
                      <img src={projet.screens[1]} alt={`${projet.name} - screen 2`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="col-span-2 row-span-1 rounded-2xl overflow-hidden shadow-xl border border-white/10 group" style={{ background: `${projet.accent}18` }}>
                      <img src={projet.screens[2]} alt={`${projet.name} - screen 3`} className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105 mix-blend-luminosity" />
                    </div>
                  </div>
                  {/* Mobile: stack images */}
                  <div className="md:hidden flex flex-col gap-3">
                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-black/5 dark:border-white/10 bg-gray-100 dark:bg-zinc-900 aspect-video">
                      <img src={projet.screens[0]} alt={`${projet.name} - screen principal`} className="w-full h-full object-cover" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl overflow-hidden shadow-xl border border-black/5 dark:border-white/10 bg-gray-100 dark:bg-zinc-900 aspect-video">
                        <img src={projet.screens[1]} alt={`${projet.name} - screen 2`} className="w-full h-full object-cover" />
                      </div>
                      <div className="rounded-2xl overflow-hidden shadow-xl border border-white/10 aspect-video" style={{ background: `${projet.accent}18` }}>
                        <img src={projet.screens[2]} alt={`${projet.name} - screen 3`} className="w-full h-full object-cover opacity-80 mix-blend-luminosity" />
                      </div>
                    </div>
                  </div>

                  {/* Badge outil */}
                  <div className="absolute -bottom-4 left-4 md:left-8 flex items-center gap-2 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-lg rounded-full px-4 py-2 text-xs font-medium">
                    <svg width="12" height="12" viewBox="0 0 38 57" fill={projet.accent} xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 28.5C19 25.9804 20.0009 23.5641 21.7825 21.7825C23.5641 20.0009 25.9804 19 28.5 19C31.0196 19 33.4359 20.0009 35.2175 21.7825C36.9991 23.5641 38 25.9804 38 28.5C38 31.0196 36.9991 33.4359 35.2175 35.2175C33.4359 36.9991 31.0196 38 28.5 38C25.9804 38 23.5641 36.9991 21.7825 35.2175C20.0009 33.4359 19 31.0196 19 28.5Z"/>
                      <path d="M0 47.5C0 44.9804 1.00089 42.5641 2.78249 40.7825C4.56408 39.0009 6.98044 38 9.5 38H19V47.5C19 50.0196 17.9991 52.4359 16.2175 54.2175C14.4359 55.9991 12.0196 57 9.5 57C6.98044 57 4.56408 55.9991 2.78249 54.2175C1.00089 52.4359 0 50.0196 0 47.5Z"/>
                      <path d="M19 0V19H28.5C31.0196 19 33.4359 17.9991 35.2175 16.2175C36.9991 14.4359 38 12.0196 38 9.5C38 6.98044 36.9991 4.56408 35.2175 2.78249C33.4359 1.00089 31.0196 0 28.5 0H19Z"/>
                      <path d="M0 9.5C0 12.0196 1.00089 14.4359 2.78249 16.2175C4.56408 17.9991 6.98044 19 9.5 19H19V0H9.5C6.98044 0 4.56408 1.00089 2.78249 2.78249C1.00089 4.56408 0 6.98044 0 9.5Z"/>
                      <path d="M0 28.5C0 31.0196 1.00089 33.4359 2.78249 35.2175C4.56408 36.9991 6.98044 38 9.5 38H19V19H9.5C6.98044 19 4.56408 20.0009 2.78249 21.7825C1.00089 23.5641 0 25.9804 0 28.5Z"/>
                    </svg>
                    Figma
                  </div>
                </div>

              </div>
            </section>
          );
        })}
      </div>

      {/* STACK DESIGN */}
      <section className="relative z-10 bg-gray-50 dark:bg-black py-32 px-6 md:px-10 border-t border-black/5 dark:border-white/10 transition-colors duration-500 mt-16">
        <div className="max-w-5xl mx-auto">
          <div ref={addRef} className="mb-16 text-center md:text-left">
            <p className="text-sm font-medium opacity-50 tracking-widest uppercase mb-4">Outils & méthodes</p>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight">
              Stack Design
            </h2>
          </div>

          <div ref={addRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'After Effects', 'Premiere Pro', 'Spline', 'Framer'].map((tech) => {
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

      {/* FOOTER NAV */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-6 px-6 md:px-20 py-16 bg-white dark:bg-[#050505] border-t border-black/5 dark:border-white/10 transition-colors duration-500">
        <a href="/projets-perso" className="text-2xl md:text-4xl lg:text-6xl font-serif italic text-black/20 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
          ← Projets Perso
        </a>
        <a href="/competences" className="text-2xl md:text-4xl lg:text-6xl font-serif italic text-black/20 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
          Compétences →
        </a>
      </section>
    </main>
  );
}
