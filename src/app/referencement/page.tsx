'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Space_Grotesk } from 'next/font/google';
import Footer from '../../components/Footer';
import Navbar from '@/components/Navbar';
import { LuSearchCheck, LuFileCode, LuGauge, LuTrendingUp } from 'react-icons/lu';

gsap.registerPlugin(ScrollTrigger);

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

type Pilier = {
  id: number;
  title: string;
  accent: string;
  icon: React.ReactNode;
  intro: string;
  points: string[];
};

const piliers: Pilier[] = [
  {
    id: 1,
    title: 'SEO technique',
    accent: '#10b981',
    icon: <LuSearchCheck size={22} strokeWidth={1.5} />,
    intro:
      'Ce que les moteurs voient réellement quand ils explorent le site — et qui diffère souvent de ce que voit un visiteur.',
    points: [
      'Indexation et exploration : robots.txt, sitemap.xml, directives noindex',
      'Metadata uniques par page : title, description, URL canonique',
      'Données structurées JSON-LD au format Schema.org',
      'Rendu JavaScript et contenu disponible côté serveur',
      'Redirections, duplication de domaines, pages orphelines',
    ],
  },
  {
    id: 2,
    title: 'Contenu & sémantique',
    accent: '#3b82f6',
    icon: <LuFileCode size={22} strokeWidth={1.5} />,
    intro:
      'Un HTML qui exprime clairement de quoi parle chaque page, et un contenu aligné sur ce que les gens cherchent vraiment.',
    points: [
      'Structure des titres Hn cohérente, un seul h1 par page',
      'Recherche de mots-clés et d’intentions de recherche',
      'Rédaction des titres et méta-descriptions',
      'Maillage interne entre les pages',
      'Textes alternatifs et accessibilité des contenus',
    ],
  },
  {
    id: 3,
    title: 'Performance & Core Web Vitals',
    accent: '#a855f7',
    icon: <LuGauge size={22} strokeWidth={1.5} />,
    intro:
      'La vitesse perçue est un critère de classement, et surtout la première raison pour laquelle un visiteur repart.',
    points: [
      'LCP, INP et CLS mesurés puis corrigés',
      'Images en formats modernes, dimensionnées et servies à la bonne taille',
      'Chargement différé des médias lourds hors écran',
      'Polices, rendu initial et stabilité visuelle',
      'Audits Lighthouse avant et après intervention',
    ],
  },
  {
    id: 4,
    title: 'Mesure & suivi',
    accent: '#ec4899',
    icon: <LuTrendingUp size={22} strokeWidth={1.5} />,
    intro:
      'Sans mesure, une optimisation reste une hypothèse. Le suivi décide de ce qui mérite d’être poursuivi.',
    points: [
      'Mise en place et lecture de Google Search Console',
      'Suivi des impressions, des positions et des pages indexées',
      'Détection des erreurs d’exploration et des contenus dupliqués',
      'Comparaison avant / après sur les indicateurs clés',
    ],
  },
];

const etapes = [
  {
    num: '01',
    title: 'Audit',
    text: 'Relevé complet : indexation, metadata, structure des titres, performance, maillage. Chaque point est vérifié sur le site en production, pas seulement dans le code.',
  },
  {
    num: '02',
    title: 'Priorisation',
    text: 'Les correctifs sont classés par impact réel sur la visibilité. Un title dupliqué sur tout un site passe avant un détail d’attribut.',
  },
  {
    num: '03',
    title: 'Implémentation',
    text: 'Corrections appliquées directement dans le code, vérifiées au build et relues dans le HTML généré.',
  },
  {
    num: '04',
    title: 'Mesure',
    text: 'Sitemap soumis, suivi dans Search Console, comparaison des indicateurs sur les semaines qui suivent.',
  },
];

export default function ReferencementPage() {
  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      revealRefs.current.forEach((el) => {
        if (el) {
          gsap.fromTo(
            el,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                end: 'bottom 20%',
                toggleActions: 'play reverse play reverse',
              },
            },
          );
        }
      });
    });
    return () => ctx.revert();
  }, []);

  const addRef = (el: HTMLDivElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  return (
    <main
      className={`${spaceGrotesk.className} bg-white text-black dark:bg-[#050505] dark:text-white min-h-screen transition-colors duration-500`}
    >
      <Navbar />

      {/* HERO */}
      <section className="h-screen w-full relative flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-15 pointer-events-none"
        >
          <source src="/figma2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-linear-to-b from-white/50 via-white/10 to-white dark:from-[#050505]/50 dark:via-[#050505]/10 dark:to-[#050505]" />

        <div className="relative z-10 text-center px-6">
          <p className="text-sm uppercase tracking-[0.4em] mb-8 opacity-50">SEO · Performance · Visibilité</p>
          <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[9rem] font-semibold tracking-tighter leading-none uppercase drop-shadow-2xl">
            Référencement
          </h1>
          <p className="mt-8 text-base md:text-lg opacity-50 max-w-xl mx-auto leading-relaxed">
            Rendre un site lisible par les moteurs, rapide pour les visiteurs et mesurable dans le temps.
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="relative z-10 bg-white dark:bg-[#050505] pt-10 px-6 md:px-10 pb-24 transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-black/10 dark:border-white/20 pt-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight text-black/90 dark:text-white/90">
                Un site bien construit se référence mieux
              </h2>
            </div>
            <div className="flex flex-col justify-end">
              <p className="text-lg text-black/60 dark:text-white/60 leading-relaxed">
                Le référencement n’est pas une couche que l’on ajoute à la fin : il se joue dans la structure du
                HTML, dans le temps de chargement et dans la clarté du contenu. J’interviens sur ces trois plans,
                du diagnostic technique jusqu’au suivi des résultats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PILIERS */}
      <section className="relative z-10 bg-white dark:bg-[#050505] px-6 md:px-10 pb-24 transition-colors duration-500">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          {piliers.map((pilier) => (
            <div
              key={pilier.id}
              ref={addRef}
              className="rounded-2xl border border-black/5 dark:border-white/10 bg-gray-50/50 dark:bg-zinc-900/40 p-7 flex flex-col gap-5 hover:border-black/20 dark:hover:border-white/20 transition-all duration-500"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex items-center justify-center w-11 h-11 rounded-xl"
                  style={{ background: `${pilier.accent}18`, color: pilier.accent }}
                >
                  {pilier.icon}
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-mono opacity-40 uppercase tracking-widest">0{pilier.id}</span>
                  <h3 className="text-xl font-semibold leading-tight">{pilier.title}</h3>
                </div>
              </div>

              <p className="text-sm opacity-60 leading-relaxed">{pilier.intro}</p>

              <ul className="flex flex-col gap-2 pt-1 border-t border-black/5 dark:border-white/5">
                {pilier.points.map((point) => (
                  <li key={point} className="text-sm opacity-75 flex gap-2.5 leading-relaxed">
                    <span style={{ color: pilier.accent }}>—</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* METHODE */}
      <section className="relative z-10 bg-white dark:bg-[#050505] px-6 md:px-10 pb-32 transition-colors duration-500">
        <div className="max-w-6xl mx-auto border-t border-black/10 dark:border-white/20 pt-10">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight mb-12 text-black/90 dark:text-white/90">
            La méthode
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {etapes.map((etape) => (
              <div key={etape.num} ref={addRef} className="flex flex-col gap-3">
                <span className="text-sm font-mono opacity-30">{etape.num}</span>
                <h3 className="text-xl font-semibold">{etape.title}</h3>
                <p className="text-sm opacity-60 leading-relaxed">{etape.text}</p>
              </div>
            ))}
          </div>

          <div ref={addRef} className="mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <a
              href="/contact"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium border border-black/20 dark:border-white/20 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
            >
              Parler de votre référencement <span>&rarr;</span>
            </a>
            <a
              href="/competences"
              className="text-sm opacity-50 hover:opacity-100 transition-opacity underline underline-offset-4"
            >
              Voir la stack technique complète
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER NAV + COPYRIGHT */}
      <footer className={`border-t border-black/8 dark:border-white/8 ${spaceGrotesk.className}`}>
        <div className="flex items-center justify-between px-6 md:px-16 py-16">
          <a
            href="/competences"
            className="text-2xl md:text-3xl font-semibold uppercase tracking-tight text-black/20 dark:text-white/20 hover:text-black dark:hover:text-white transition-colors"
          >
            &larr; Compétences
          </a>
          <a
            href="/a-propos"
            className="text-2xl md:text-3xl font-semibold uppercase tracking-tight text-black/20 dark:text-white/20 hover:text-black dark:hover:text-white transition-colors"
          >
            À Propos &rarr;
          </a>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-6 border-t border-black/8 dark:border-white/8 gap-3">
          <p className="text-xs text-black/20 dark:text-white/20 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Rafael Teixeira — Tous droits réservés
          </p>
          <div className="flex items-center gap-4">
            <Footer />
          </div>
        </div>
      </footer>
    </main>
  );
}
