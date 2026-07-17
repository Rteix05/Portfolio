'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Space_Grotesk } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { getTechIcon } from '@/lib/techIcons';

gsap.registerPlugin(ScrollTrigger);

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

const projets = [
  {
    id: 1,
    name: 'La Montagne de la Prière',
    type: 'Next.js · React · Symfony · MySQL · Tailwind CSS · Framer Motion · JWT · Cloudflare R2 · Vercel',
    description: 'Plateforme web sur-mesure (architecture Headless) pour une association religieuse. Gestion des inscriptions, dons, ressources PDF et espace membre sécurisé.',
    link: 'https://www.samuelpanzutv.com',
    image: '/mdlp.jpg',
    video: '/mdlpfav.png',
    videoIsImage: true,
    role: 'Développeur Fullstack (Conception, Développement, Déploiement)',
    projectType: 'Application Web sur-mesure (Architecture Headless)',
    details: {
      context: "L'association \"La Montagne de la Prière\" avait besoin d'une présence numérique moderne et évolutive pour centraliser sa communication et interagir avec sa communauté. Au-delà d'un simple site vitrine, l'objectif était de concevoir une véritable application métier capable de gérer des inscriptions, des dons, et la diffusion de ressources éducatives (cours au format PDF), le tout en anticipant des pics de trafic importants lors des événements dominicaux.",
      architecture: [
        {
          label: 'Frontend',
          subtitle: 'Interface & Vitesse',
          tech: 'Next.js / React',
          points: [
            'Génération de pages statiques et dynamiques (SSR/SSG) pour un SEO optimisé.',
            'Design system sur-mesure avec Tailwind CSS et animations fluides via Framer Motion.',
            'Déploiement sur le réseau mondial (Edge Network) de Vercel pour des temps de chargement instantanés.',
          ],
        },
        {
          label: 'Backend',
          subtitle: 'Logique & API',
          tech: 'Framework Symfony (PHP)',
          points: [
            'Création d\'une API RESTful sécurisée connectée à une base de données MySQL.',
            'Gestion de l\'authentification sécurisée par token (JWT).',
            'Hébergement sur un serveur VPS dédié via Cloudways (DigitalOcean), configuré pour absorber les forts pics de connexions simultanées sans latence.',
          ],
        },
        {
          label: 'Infrastructure',
          subtitle: 'Stockage',
          tech: 'Cloudflare R2',
          points: [
            "Mise en place d'un Object Storage externe pour alléger le serveur principal.",
            "L'upload et le téléchargement des cours PDF se font via le réseau Cloudflare, garantissant une bande passante illimitée.",
          ],
        },
      ],
      features: [
        { title: "Système d'Authentification", desc: "Espace membre sécurisé avec inscription, connexion et gestion des accès (Utilisateur vs Administrateur)." },
        { title: "Dashboard Administrateur Sur-Mesure", desc: "Interface privée permettant aux responsables d'uploader et de gérer les cours de l'église en toute autonomie." },
        { title: "Tunnel d'Interaction", desc: "Systèmes de formulaires dynamiques pour la prise de rendez-vous, l'inscription au baptême, et le recrutement de bénévoles." },
        { title: "Optimisation SEO Dynamique", desc: "Implémentation du système generateMetadata de Next.js pour que chaque page (et chaque cours) soit parfaitement indexée par Google et esthétique lors des partages sur les réseaux sociaux (Open Graph)." },
      ],
      conclusion: "Ce projet m'a permis de maîtriser l'ensemble du cycle de vie d'une application complexe. De la maquette initiale jusqu'à la mise en production sur des serveurs distants, en passant par la configuration DNS et la sécurisation des données. J'ai livré une plateforme évolutive (prête à accueillir une application mobile connectée à la même API) et de qualité professionnelle, dotée des mêmes standards technologiques que les grandes startups actuelles.",
    },
  },
  {
    id: 2,
    name: 'Projet Pro 2',
    type: 'Node.js · Express · MongoDB',
    description: 'Description du deuxième projet professionnel. Remplace ce texte par les détails de ton expérience.',
    link: '#',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2000&auto=format&fit=crop',
    video: 'https://cdn.coverr.co/videos/coverr-scrolling-through-a-website-on-a-laptop-5056/1080p.mp4',
  },
];

export default function ProjetsProPage() {
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
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop" 
          alt="Hero Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity pointer-events-none" 
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-white dark:to-[#050505]" />
        
        <div className="relative z-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] mb-6 opacity-60">Expérience Professionnelle</p>
          <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[9rem] font-semibold tracking-tighter leading-none drop-shadow-2xl">
            Projets
          </h1>
          <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[9rem] font-semibold tracking-tighter leading-none -mt-1 md:-mt-6 drop-shadow-2xl">
            Professionnels
          </h1>
        </div>
      </section>

      {/* INTRO */}
      <section className="relative z-10 bg-white dark:bg-[#050505] pt-10 px-6 md:px-10 pb-16 transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-black/10 dark:border-white/20 pt-10 text-sm">
            <div className="md:col-span-1">
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight text-black/90 dark:text-white/90">
                Des projets réalisés en milieu professionnel
              </h2>
            </div>
            <div className="md:col-span-1 flex flex-col justify-end">
              <p className="text-lg text-black/60 dark:text-white/60 leading-relaxed">
                Missions en entreprise, stages et collaborations professionnelles
                mettant en pratique mes compétences dans des contextes réels.
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
                  <h2 className="text-4xl md:text-5xl font-semibold leading-tight mb-3">
                    {projet.name}
                  </h2>
                  {'role' in projet && (
                    <p className="text-xs uppercase tracking-widest opacity-50 mb-6">{(projet as any).role}</p>
                  )}
                  <p className="text-lg opacity-70 leading-relaxed mb-6">
                    {projet.description}
                  </p>
                  {'details' in projet && (() => {
                    const d = (projet as any).details;
                    return (
                      <div className="space-y-6 text-sm">
                        <div>
                          <p className="text-xs uppercase tracking-widest opacity-40 mb-2">Contexte</p>
                          <p className="opacity-60 leading-relaxed">{d.context}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest opacity-40 mb-3">Architecture Technique</p>
                          <div className="space-y-3">
                            {d.architecture.map((layer: any) => (
                              <div key={layer.label} className="rounded-xl border border-black/10 dark:border-white/10 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-semibold">{layer.label}</span>
                                  <span className="opacity-40">·</span>
                                  <span className="opacity-50 text-xs">{layer.subtitle}</span>
                                  <span className="ml-auto opacity-60 font-mono text-xs">{layer.tech}</span>
                                </div>
                                <ul className="space-y-1">
                                  {layer.points.map((pt: string, i: number) => (
                                    <li key={i} className="opacity-60 leading-relaxed flex gap-2"><span className="opacity-40 mt-0.5">›</span>{pt}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest opacity-40 mb-3">Fonctionnalités Clés</p>
                          <ul className="space-y-2">
                            {d.features.map((f: any, i: number) => (
                              <li key={i} className="flex gap-2 opacity-70 leading-relaxed">
                                <span className="opacity-50 mt-0.5">▸</span>
                                <span><span className="font-semibold">{f.title} : </span>{f.desc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-xl bg-black/5 dark:bg-white/5 p-4">
                          <p className="text-xs uppercase tracking-widest opacity-40 mb-2">Bilan</p>
                          <p className="opacity-60 leading-relaxed">{d.conclusion}</p>
                        </div>
                      </div>
                    );
                  })()}
                  {projet.link !== '#' && (
                    <a
                      href={projet.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-8 inline-flex items-center gap-2 rounded-full border border-black/20 dark:border-white/20 px-6 py-3 text-sm font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
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
                      className="w-full h-full object-cover opacity-90"
                    />
                  </div>

                  {/* Petite Vidéo ou Image (Superposée) */}
                  <div className={`absolute ${isEven ? 'left-0' : 'right-0'} bottom-0 w-[55%] aspect-4/3 rounded-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-black/5 dark:border-white/10 z-20 bg-black`}>
                    {(projet as any).videoIsImage ? (
                      <img
                        src={projet.video}
                        alt={projet.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                    <video 
                      autoPlay muted loop playsInline disablePictureInPicture disableRemotePlayback 
                      className="w-full h-full object-cover pointer-events-none"
                    >
                      <source src={projet.video} type="video/mp4" />
                    </video>
                    )}
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
            <h2 className="text-4xl md:text-6xl font-semibold leading-tight">
              Stack professionnelle
            </h2>
          </div>

          <div ref={addRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Git', 'Figma', 'Vercel'].map((tech) => {
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
        <a href="/projets-perso" className="text-2xl md:text-4xl lg:text-6xl font-semibold italic text-black/20 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
          ← Projets Perso
        </a>
        <a href="/design" className="text-2xl md:text-4xl lg:text-6xl font-semibold italic text-black/20 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
          Design UI/UX →
        </a>
      </section>
    </main>
  );
}
