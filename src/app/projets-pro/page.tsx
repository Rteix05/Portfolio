'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reveler } from '@/lib/reveal';
import { Space_Grotesk } from 'next/font/google';
import Navbar from '@/components/Navbar';
import ProjetVisuels from '@/components/ProjetVisuels';
import PageFooter from '@/components/PageFooter';
import { getTechIcon } from '@/lib/techIcons';

gsap.registerPlugin(ScrollTrigger);

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

type Projet = {
  id: number;
  name: string;
  type: string;
  description: string;
  link: string;
  image: string;
  video: string;
  videoIsImage?: boolean;
  role?: string;
  projectType?: string;
  details?: {
    context: string;
    architecture: { label: string; subtitle: string; tech: string; points: string[] }[];
    features: { title: string; desc: string }[];
    conclusion: string;
  };
};

const projets: Projet[] = [
  {
    id: 1,
    name: 'La Montagne de la Prière',
    type: 'Next.js · React · Symfony · MySQL · Tailwind CSS · Framer Motion · JWT · Cloudflare R2 · Vercel',
    description: 'Plateforme web sur-mesure (architecture Headless) pour une association religieuse. Gestion des inscriptions, dons, ressources PDF et espace membre sécurisé.',
    link: 'https://www.samuelpanzutv.com',
    image: '/mdlp.webp',
    video: '/projets/mdlp.mp4',
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
    name: 'Académie E.S.I.C.',
    type: 'Next.js · React · TypeScript · Tailwind CSS · Symfony · API Platform · MySQL · Stripe · JWT · Docker · Vercel',
    description: "Plateforme de formation en ligne pour l'École du Savoir et de l'Intelligence Chrétienne : catalogue de formations, vente de masterclass premium et espace personnel pour chaque élève.",
    link: 'https://esich.fr',
    image: '/esic.webp',
    video: '/projets/esic.mp4',
    role: 'Développeur Fullstack (Conception, Développement, Déploiement)',
    projectType: 'Plateforme e-learning avec paiement en ligne',
    details: {
      context: "L'Académie E.S.I.C. est un centre de formation chrétienne qui voulait présenter sa vision et sa mission, mais surtout diffuser ses enseignements en ligne. Il fallait une plateforme de contenu complète : un catalogue de formations gratuites ou payantes, des masterclass premium (vidéo, PDF ou pack) vendues en ligne avec déblocage automatique après achat, et un espace personnel pour que chaque élève retrouve ses cours. Le tout accessible (RGAA) et conforme (RGPD, CGU, CGV).",
      architecture: [
        {
          label: 'Frontend',
          subtitle: 'Catalogue & Expérience',
          tech: 'Next.js 16 / React 19',
          points: [
            'Catalogue présenté comme une plateforme de contenu : carrousels par catégorie et fiches détaillées (durée, niveau, prix, intervenant).',
            "Mode sombre et réglages d'affichage pour l'accessibilité (taille du texte de 90 % à 200 %, liens et texte en gras).",
            'Lecteur vidéo protégé par filigrane nominatif ; les lecteurs tiers (YouTube, Vimeo…) ne se chargent qu\'après consentement aux cookies.',
          ],
        },
        {
          label: 'Backend',
          subtitle: 'API & Back-office',
          tech: 'Symfony 7.4 / API Platform',
          points: [
            'API sécurisée connectée à MySQL, authentification par JWT en cookie httpOnly, protection anti-CSRF et limitation des tentatives.',
            'Back-office EasyAdmin pour gérer formations, masterclass, actualités programmables, utilisateurs et accès.',
            'Emails transactionnels (bienvenue, confirmation de commande, mot de passe oublié) avec Symfony Mailer et Twig.',
          ],
        },
        {
          label: 'Paiement',
          subtitle: 'Monétisation',
          tech: 'Stripe Checkout',
          points: [
            'Achat de formations, masterclass et accès complet à un institut, avec factures PDF téléchargeables.',
            'Webhooks signés et idempotents pour débloquer les contenus automatiquement ; preuves d\'acceptation des CGV enregistrées avec chaque paiement.',
          ],
        },
      ],
      features: [
        { title: 'Salle de cours', desc: 'Vidéo et support PDF de chaque formation acquise, servis par des routes protégées et des liens signés.' },
        { title: 'Espace personnel', desc: 'Formations suivies, accès instituts, masterclass débloquées, historique des paiements et profil.' },
        { title: 'Accès à vie à un institut', desc: "Un paiement unique donne accès à toutes les formations publiées d'un institut, y compris les futures." },
        { title: 'Qualité et déploiement', desc: 'Environnement Docker, tests PHPUnit, CI GitHub Actions, workflow gitflow ; frontend sur Vercel et API sur Cloudways.' },
      ],
      conclusion: "Ce projet m'a fait aller plus loin que sur une application web classique : paiement en ligne, contenus protégés, obligations légales (CGV, droit de rétractation, RGPD) et accessibilité. J'ai livré une plateforme de formation complète, testée et déployée en production, que l'Académie administre en autonomie.",
    },
  },
];

// Position du curseur dans l'élément, lue par la classe .projecteur
const suivreCurseur = (e: React.PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
};

export default function ProjetsProPage() {
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

      {/* HERO AVEC IMAGE DE FOND */}
      <section className="h-screen w-full relative flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-20 mix-blend-luminosity pointer-events-none"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-white dark:to-[#050505]" />
        
        <div className="relative z-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] mb-6 opacity-60">Expérience Professionnelle</p>
          <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[9rem] font-semibold tracking-tighter leading-none drop-shadow-2xl">
            Projets
            <span className="block -mt-1 md:-mt-6">Professionnels</span>
          </h1>
        </div>
      </section>

      {/* INTRO */}
      <section className="relative z-10 bg-white dark:bg-[#050505] pt-10 px-6 md:px-10 pb-16 transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
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

      {/* PROJETS */}
      <div className="pb-32 bg-white dark:bg-[#050505] transition-colors duration-500">
        {projets.map((projet, index) => {
          const isEven = index % 2 === 0;
          const d = projet.details;

          return (
            <section key={projet.id} className="relative z-10 py-24 md:py-32 px-6 md:px-10 overflow-hidden">
              <div className="max-w-7xl mx-auto">

                {/* EN-TÊTE : TEXTE + VISUELS */}
                <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-14 md:gap-20`}>
                  <div ref={addRef} className="w-full md:w-5/12">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-sm opacity-50 tracking-widest font-mono">{String(projet.id).padStart(2, '0')}</span>
                      <span className="h-px flex-1 bg-black/10 dark:bg-white/15" />
                      {projet.projectType && (
                        <span className="text-xs uppercase tracking-widest opacity-50 text-right">{projet.projectType}</span>
                      )}
                    </div>
                    <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-4">
                      {projet.name}
                    </h2>
                    {projet.role && (
                      <p className="text-xs uppercase tracking-widest opacity-50 mb-6">{projet.role}</p>
                    )}
                    <p className="text-lg opacity-70 leading-relaxed mb-8">
                      {projet.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {projet.type.split('·').map((tech) => {
                        const name = tech.trim();
                        const icon = getTechIcon(name);
                        return (
                          <span key={name} className="inline-flex items-center gap-1.5 rounded-full border border-black/10 dark:border-white/15 px-3 py-1 text-xs opacity-70 transition-all duration-300 hover:opacity-100 hover:-translate-y-0.5 hover:border-black/40 dark:hover:border-white/50">
                            {icon && <span className="text-sm">{icon}</span>}
                            {name}
                          </span>
                        );
                      })}
                    </div>
                    {projet.link !== '#' && (
                      <a
                        href={projet.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-10 inline-flex items-center gap-2 rounded-full bg-black text-white dark:bg-white dark:text-black px-6 py-3 text-sm font-medium hover:opacity-80 transition-opacity"
                      >
                        Voir le site <span aria-hidden>↗</span>
                      </a>
                    )}
                  </div>

                  {/* VISUELS : inclinaison 3D, parallaxe, échange au clic */}
                  <div ref={addRef} className="w-full md:w-7/12">
                    <ProjetVisuels
                      nom={projet.name}
                      image={projet.image}
                      video={projet.video}
                      videoIsImage={projet.videoIsImage}
                      aDroite={isEven}
                      prioritaire={index === 0}
                    />
                  </div>
                </div>

                {/* DÉTAIL EN PLEINE LARGEUR */}
                {d && (
                  <div className="mt-20 md:mt-28 space-y-16 text-sm">
                    <div ref={addRef} className="grid grid-cols-1 md:grid-cols-12 gap-6 border-t border-black/10 dark:border-white/15 pt-10">
                      <p className="md:col-span-3 text-xs uppercase tracking-widest opacity-40">Contexte</p>
                      <p className="md:col-span-9 text-lg md:text-xl opacity-70 leading-relaxed">{d.context}</p>
                    </div>

                    <div ref={addRef} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <p className="md:col-span-3 text-xs uppercase tracking-widest opacity-40">Architecture technique</p>
                      <div className="md:col-span-9 grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {d.architecture.map((layer) => (
                          <div key={layer.label} onPointerMove={suivreCurseur} className="carte carte-survol projecteur p-6 flex flex-col">
                            <p className="text-xs uppercase tracking-widest opacity-40 mb-1">{layer.subtitle}</p>
                            <p className="text-xl font-semibold mb-1">{layer.label}</p>
                            <p className="font-mono text-xs opacity-60 mb-5">{layer.tech}</p>
                            <ul className="space-y-3 border-t border-black/10 dark:border-white/10 pt-5">
                              {layer.points.map((pt, i) => (
                                <li key={i} className="opacity-65 leading-relaxed flex gap-2"><span className="opacity-40">›</span>{pt}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div ref={addRef} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <p className="md:col-span-3 text-xs uppercase tracking-widest opacity-40">Fonctionnalités clés</p>
                      <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-px rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-black/10 dark:bg-white/10">
                        {d.features.map((f, i) => (
                          <div key={f.title} onPointerMove={suivreCurseur} className="group projecteur bg-white dark:bg-[#050505] p-6">
                            <p className="font-mono text-xs opacity-40 mb-3 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-1">{String(i + 1).padStart(2, '0')}</p>
                            <p className="text-base font-semibold mb-2">{f.title}</p>
                            <p className="opacity-60 leading-relaxed">{f.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div ref={addRef} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <p className="md:col-span-3 text-xs uppercase tracking-widest opacity-40">Bilan</p>
                      <blockquote className="md:col-span-9 text-lg md:text-2xl font-medium leading-snug opacity-85 border-l-2 border-black/20 dark:border-white/25 pl-6">
                        {d.conclusion}
                      </blockquote>
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* SECTION GRILLE TECHNOS */}
      <section className="relative z-10 bg-gray-50 dark:bg-black py-24 px-6 md:px-10 border-t border-black/5 dark:border-white/10 transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
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
                <div key={tech} onPointerMove={suivreCurseur} className="carte carte-survol projecteur px-5 py-6 flex flex-col items-center gap-3 text-sm font-medium">
                  {icon && <span className="text-xl opacity-70">{icon}</span>}
                  {tech}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <PageFooter precedent={{ href: '/projets-perso', label: 'Projets Perso' }} suivant={{ href: '/design', label: 'Design' }} />
    </main>
  );
}
