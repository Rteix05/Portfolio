'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reveler } from '@/lib/reveal';
import { Space_Grotesk } from 'next/font/google';
import PageFooter from '@/components/PageFooter';
import Navbar from '@/components/Navbar';
import LazyVideo, { affiche } from '@/components/LazyVideo';
import HeroFond from '@/components/HeroFond';
import { getTechIcon } from '@/lib/techIcons';

gsap.registerPlugin(ScrollTrigger);

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

type Projet = {
  id: number;
  name: string;
  type: string;
  description: string;
  link?: string;
  image?: string;
  video?: string;
  status?: 'en-cours';
};

const projets: Projet[] = [
  {
    id: 1,
    name: 'WR506D — Penderie',
    type: 'React Native · Expo · TypeScript · Symfony 7.4',
    description: 'Application mobile de gestion de garde-robe : numérisation des vêtements, composition de tenues et organisation du dressing. Développée en React Native avec Expo.',
    image: '/penderie-garde.webp',
    video: '/projets/penderie.mp4',
    status: 'en-cours',
  },
  {
    id: 2,
    name: 'Pokémon — SAE 203',
    type: 'PHP · SQL · Base de données · HTML/CSS',
    description: 'Site en PHP permettant d\'apprendre à créer et manipuler des bases de données en PHP et SQL. Interface pokédex avec recherche, filtres et affichage dynamique.',
    link: 'https://sae203.mmi24h04.mmi-troyes.fr',
    image: '/projets/pokemon-image.webp',
    video: '/projets/pokemon.mp4',
  },
  {
    id: 3,
    name: "Carb'On — SAE 401",
    type: 'Vue.js · Symfony · TailwindCSS · Mobile First',
    description: "Application mobile-first de gestion de l'empreinte carbone sous forme de gamification. Backoffice administrable via EasyAdmin, frontend Vue 3 avec Tailwind CSS.",
    link: 'https://sae401.mmi24b07.mmi-troyes.fr',
    image: '/carbon.webp',
    video: '/projets/carbon.mp4',
  },
  {
    id: 4,
    name: 'Alpha Murder Party',
    type: 'PHP · MVC · MySQL · Authentification · Gestion des rôles',
    description: 'Site en architecture MVC avec base de données, intégrant l\'inscription, la connexion, la déconnexion, une messagerie interne et un système administrateur complet.',
    link: 'https://sae202.mmi24h04.mmi-troyes.fr',
    image: '/murderbg.webp',
    video: '/projets/murder.mp4',
  },
  {
    id: 5,
    name: 'Mairie de Sommeval',
    type: 'Symfony · React · API Platform · Docker · MySQL · RGAA',
    description: 'Refonte du site d\'une mairie avec une architecture headless Symfony en back + React en front. Gestion de contenu découplée et interface moderne.',
    link: 'http://sae301.mmi24b11.mmi-troyes.fr/',
    image: '/projets/sommeval-image.webp',
    video: '/projets/sommeval.mp4',
  },
  {
    id: 6,
    name: 'Montagne de la Prière',
    type: 'Symfony · Next.js · Stripe · PayPal · Dashboard Admin · CRUD',
    description: 'Refonte complète d\'un site CMS vers une application SaaS fullstack développée lors de mon stage. Système de prise de rendez-vous, intégration de paiements en ligne et mailing automatisé.',
    link: 'https://samuelpanzutv.com', 
    image: '/mdlp.webp',
    video: '/projets/mdlp.mp4',
  },
];

export default function ProjetsScolairesPage() {
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      reveler(textRefs.current);
    });
    return () => ctx.revert();
  }, []);

  const addRef = (el: HTMLDivElement | null) => {
    if (el && !textRefs.current.includes(el)) textRefs.current.push(el);
  };

  return (
    <main className={`${spaceGrotesk.className} bg-white text-black dark:bg-[#050505] dark:text-white min-h-screen transition-colors duration-500`}>
      <Navbar />

      {/* HERO : MONTAGE FLOU DES PROJETS EN FOND */}
      <section className="h-screen w-full relative flex items-center justify-center overflow-hidden">
        <HeroFond nom="scolaires" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-white dark:to-[#050505]" />
        
        <div className="relative z-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] mb-6 opacity-60">BUT MMI</p>
          <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[9rem] font-semibold tracking-tighter leading-none drop-shadow-2xl">
            Projets
            <span className="block -mt-1 md:-mt-6">Scolaires</span>
          </h1>
        </div>
      </section>

      {/* INTRO */}
      <section className="relative z-10 bg-white dark:bg-[#050505] pt-10 px-6 md:px-10 pb-16 transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-black/10 dark:border-white/20 pt-10 text-sm">
            <div>
              <p className="opacity-50 mb-2 uppercase tracking-widest text-xs">Formation</p>
              <p className="font-medium text-lg">BUT MMI — Troyes</p>
            </div>
            <div>
              <p className="opacity-50 mb-2 uppercase tracking-widest text-xs">Projets</p>
              <p className="font-medium text-lg">
                {projets.filter((p) => p.status !== 'en-cours').length} Projets & SAE réalisés
                {projets.some((p) => p.status === 'en-cours')
                  ? ` · ${projets.filter((p) => p.status === 'en-cours').length} en cours`
                  : ''}
              </p>
            </div>
            <div>
              <p className="opacity-50 mb-2 uppercase tracking-widest text-xs">Technologies</p>
              <p className="font-medium text-lg leading-relaxed">PHP · SQL · Symfony · Next.js · Vue · React · React Native · TailwindCSS · Docker · Stripe · Figma</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROJETS (COMPOSITION IMAGE + VIDÉO) */}
      <div className="pb-40 bg-white dark:bg-[#050505] transition-colors duration-500">
        {projets.map((projet, index) => {
          // Permet d'alterner l'image à gauche puis à droite
          const isEven = index % 2 === 0;

          return (
            <section key={projet.id} className="relative z-10 py-32 px-6 md:px-10 overflow-hidden">
              <div className={`max-w-7xl mx-auto flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 md:gap-24`}>
                
                {/* PARTIE TEXTE */}
                <div ref={addRef} className="w-full md:w-1/3">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm opacity-50 uppercase tracking-widest font-mono">0{projet.id}</span>
                    {projet.status === 'en-cours' && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-amber-600 dark:text-amber-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Projet en cours
                      </span>
                    )}
                  </div>
                  
                  {/* BADGES COMPÉTENCES */}
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

                  <h2 className="text-4xl md:text-5xl font-semibold leading-tight mb-6">
                    {projet.name}
                  </h2>
                  <p className="text-lg opacity-70 leading-relaxed mb-10">
                    {projet.description}
                  </p>
                  {projet.link ? (
                    <a
                      href={projet.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-black/20 dark:border-white/20 px-6 py-3 text-sm font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                    >
                      Voir le site web <span>↗</span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 px-6 py-3 text-sm font-medium opacity-40 cursor-default">
                      Bientôt disponible
                    </span>
                  )}
                </div>

                {/* PARTIE MÉDIAS (Superposition Image + Vidéo) */}
                <div ref={addRef} className="w-full md:w-2/3 relative h-[50vh] md:h-[70vh]">
                  
                  {/* Grande Image (En arrière-plan) */}
                  <div className={`absolute ${isEven ? 'right-0' : 'left-0'} top-0 w-4/5 h-[85%] rounded-3xl overflow-hidden shadow-2xl border border-black/5 dark:border-white/10 z-10 bg-gray-100 dark:bg-zinc-900`}>
                    {projet.image ? (
                      <Image
                        src={projet.image}
                        alt={`Aperçu du projet ${projet.name}`}
                        fill
                        loading={index === 0 ? 'eager' : 'lazy'}
                        sizes="(max-width: 768px) 100vw, 55vw"
                        className="object-cover opacity-90 transition-transform duration-1000 ease-out-soft hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-black/5 to-transparent dark:from-white/5">
                        <span className="text-xs uppercase tracking-widest opacity-40">Visuels à venir</span>
                      </div>
                    )}
                  </div>

                  {/* Petite Vidéo (Superposée) */}
                  {projet.video && (
                    <div className={`absolute ${isEven ? 'left-0' : 'right-0'} bottom-0 w-[55%] aspect-4/3 rounded-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-black/5 dark:border-white/10 z-20 bg-black`}>
                      <LazyVideo
                        src={projet.video}
                        poster={affiche(projet.video, projet.image)}
                        className="w-full h-full object-cover pointer-events-none"
                      />
                    </div>
                  )}

                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* FOOTER NAV + COPYRIGHT */}
      <PageFooter precedent={{ href: '/3d', label: 'Projets 3D' }} suivant={{ href: '/projets-perso', label: 'Projets Perso' }} />
    </main>
  );
}