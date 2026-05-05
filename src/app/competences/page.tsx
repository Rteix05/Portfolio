'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Space_Grotesk } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { getTechIcon } from '@/lib/techIcons';

gsap.registerPlugin(ScrollTrigger);

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

type Skill = {
  name: string;
  detail: string;
  projects: string[];
};

type Section = {
  id: string;
  category: string;
  title: string;
  accent: string;
  skills: Skill[];
};

const sections: Section[] = [
  {
    id: 'frontend',
    category: 'Front-End',
    title: 'Interfaces & Expériences',
    accent: 'from-emerald-500/10 to-teal-500/5',
    skills: [
      { name: 'React', detail: 'React 18, Hooks, Context, React Router', projects: ['Portfolio v4', 'Projets perso', 'PS5 UI'] },
      { name: 'Vue.js', detail: 'Composition API, Vue Router, Pinia', projects: ['Projets scolaires'] },
      { name: 'Next.js', detail: 'App Router, SSR, ISR, API Routes', projects: ['Portfolio v4', 'Projets pro'] },
      { name: 'Three.js / R3F', detail: 'React Three Fiber, Drei, GLSL Shaders', projects: ['Portfolio 3D', 'Expériences 3D'] },
      { name: 'TypeScript', detail: 'Typage strict, interfaces, generics', projects: ['Portfolio v4', 'Projets pro'] },
      { name: 'Tailwind CSS', detail: 'Utility-first, responsive, dark mode', projects: ['Portfolio v4', 'Sommeval', 'Carb\'On'] },
      { name: 'GSAP', detail: 'ScrollTrigger, Timeline, animations complexes', projects: ['Portfolio v4', 'Projets perso'] },
      { name: 'Framer Motion', detail: 'AnimatePresence, layout animations', projects: ['Portfolio v4'] },
      { name: 'HTML / CSS', detail: 'Sémantique, Grid, Flexbox, animations CSS', projects: ['Tous les projets'] },
    ],
  },
  {
    id: 'backend',
    category: 'Back-End',
    title: 'Serveurs & Données',
    accent: 'from-blue-500/10 to-indigo-500/5',
    skills: [
      { name: 'PHP', detail: 'POO, MVC, sessions, authentification', projects: ['Sommeval', 'Projets scolaires'] },
      { name: 'Symfony', detail: 'Controllers, Twig, Doctrine ORM, API Platform', projects: ['Sommeval', 'SAE 501'] },
      { name: 'Node.js', detail: 'Express, API REST, middleware', projects: ['Projets pro', 'Side projects'] },
      { name: 'SQL / MySQL', detail: 'Requêtes complexes, jointures, CRUD', projects: ['Sommeval', 'Projets scolaires'] },
      { name: 'PostgreSQL', detail: 'Migrations, relations, indexation', projects: ['Projets pro'] },
      { name: 'REST API', detail: 'Architecture RESTful, CRUD, JSON', projects: ['Sommeval', 'Projets pro'] },
    ],
  },
  {
    id: 'design',
    category: 'UI / UX',
    title: 'Design & Prototypage',
    accent: 'from-pink-500/10 to-rose-500/5',
    skills: [
      { name: 'Figma', detail: 'Maquettes desktop & mobile, composants, auto-layout', projects: ['Sommeval', 'Carb\'On', 'WR403D'] },
      { name: 'UI Design', detail: 'Design systems, typographie, hiérarchie visuelle', projects: ['Sommeval', 'Carb\'On', 'WR403D'] },
      { name: 'UX Design', detail: 'Wireframes, user flows, itérations utilisateur', projects: ['Carb\'On', 'WR403D'] },
      { name: 'Prototypage', detail: 'Prototypes haute-fidélité, transitions Figma', projects: ['Sommeval', 'Carb\'On', 'WR403D'] },
      { name: 'Adobe Suite', detail: 'Photoshop, Illustrator, Premiere Pro, After Effects', projects: ['Projets visuels', 'Médias'] },
      { name: 'Blender', detail: 'Modélisation 3D, rendu, exports glTF/glb', projects: ['Expériences 3D', 'Portfolio 3D'] },
    ],
  },
  {
    id: 'workflow',
    category: 'Workflow & DevOps',
    title: 'GitHub, Docker & Déploiement',
    accent: 'from-violet-500/10 to-purple-500/5',
    skills: [
      { name: 'Git / GitHub', detail: 'Création de repos, branches, PRs, code review, gestion d\'équipe', projects: ['Tous les projets'] },
      { name: 'Docker', detail: 'Images custom, docker-compose, environnements reproductibles et simples à lancer', projects: ['Sommeval', 'Projets pro'] },
      { name: 'Documentation', detail: 'READMEs clairs et structurés pour une prise en main rapide', projects: ['Tous les projets'] },
      { name: 'Vercel', detail: 'Déploiement continu, variables d\'env, domaines custom', projects: ['Portfolio v4', 'Projets Next.js'] },
      { name: 'OVH / VPS', detail: 'Configuration serveur, SSL, reverse proxy Nginx', projects: ['Projets pro', 'Hébergement client'] },
      { name: 'Linux CLI', detail: 'Navigation, scripts bash, gestion de services systemd', projects: ['VPS', 'Environnements Docker'] },
    ],
  },
];

export default function CompetencesPage() {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      sectionRefs.current.forEach((el) => {
        if (el) {
          gsap.fromTo(el,
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      });
    });
    return () => ctx.revert();
  }, []);

  const addRef = (el: HTMLDivElement | null) => {
    if (el && !sectionRefs.current.includes(el)) sectionRefs.current.push(el);
  };

  return (
    <main className={`${spaceGrotesk.className} bg-white text-black dark:bg-[#050505] dark:text-white min-h-screen transition-colors duration-500`}>
      <Navbar />

      {/* HERO */}
      <section className="h-screen w-full relative flex items-center justify-center overflow-hidden">
        <img
          src="/competences.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity pointer-events-none"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-black" />
        <h1 className="relative z-10 text-[4rem] md:text-[10rem] font-sans font-bold tracking-tighter leading-none text-white drop-shadow-2xl text-center uppercase">
          Compétences
        </h1>
      </section>

      {/* INTRO */}
      <section className="relative z-10 bg-white dark:bg-black pt-24 px-6 md:px-10 pb-20 transition-colors duration-500">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-serif tracking-tight leading-tight mb-8 text-black/90 dark:text-white/90">
            Développeur Full Stack polyvalent
          </h2>
          <p className="text-lg text-black/60 dark:text-white/60 max-w-3xl mx-auto leading-relaxed mb-6">
            À l&apos;aise aussi bien côté Front-End que Back-End, je conçois et déploie des projets fullstack
            de A à Z — seul ou en équipe. UI/UX avec Figma, interfaces React/Vue/Next.js,
            APIs Symfony/Node.js, bases de données, hébergement et Docker.
          </p>
          <p className="text-base text-black/50 dark:text-white/40 max-w-2xl mx-auto leading-relaxed">
            Sur GitHub, je structure mes repos avec des READMEs clairs, des images Docker prêtes à l&apos;emploi
            et une organisation pensée pour la collaboration.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {['Front-End', 'Back-End', 'UI / UX', 'Hébergement', 'Docker', 'GitHub'].map((tag) => (
              <span key={tag} className="px-4 py-1.5 rounded-full border border-black/10 dark:border-white/15 text-sm font-medium text-black/70 dark:text-white/60">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTIONS SKILLS */}
      {sections.map((section, si) => (
        <section
          key={section.id}
          className={`relative z-10 py-24 px-6 md:px-10 transition-colors duration-500 ${si % 2 === 0 ? 'bg-gray-50 dark:bg-[#050505]' : 'bg-white dark:bg-black'}`}
        >
          <div className="max-w-6xl mx-auto">
            <div ref={addRef} className="mb-14 border-b border-black/10 dark:border-white/10 pb-8">
              <p className="text-sm font-medium text-black/50 dark:text-white/50 tracking-widest uppercase mb-3">
                {section.category}
              </p>
              <h2 className="text-4xl md:text-6xl font-serif leading-tight text-black/90 dark:text-white/90">
                {section.title}
              </h2>
            </div>

            <div ref={addRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.skills.map((skill) => {
                const icon = getTechIcon(skill.name);
                return (
                  <div
                    key={skill.name}
                    className={`group relative rounded-2xl border border-black/8 dark:border-white/8 bg-linear-to-br ${section.accent} p-6 hover:border-black/20 dark:hover:border-white/20 transition-all`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {icon && <span className="text-2xl opacity-80">{icon}</span>}
                      <h3 className="text-lg font-semibold leading-tight">{skill.name}</h3>
                    </div>
                    <p className="text-sm text-black/55 dark:text-white/50 leading-relaxed mb-4">
                      {skill.detail}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {skill.projects.map((proj) => (
                        <span
                          key={proj}
                          className="text-[11px] px-2.5 py-0.5 rounded-full bg-black/6 dark:bg-white/8 text-black/60 dark:text-white/50 font-medium"
                        >
                          {proj}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* FOOTER */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-6 px-6 md:px-20 py-16 bg-gray-100 dark:bg-[#050505] border-t border-black/5 dark:border-white/10 transition-colors duration-500">
        <a href="/design" className="text-2xl md:text-4xl lg:text-6xl font-serif italic text-black/20 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
          ← Design
        </a>
        <a href="/a-propos" className="text-2xl md:text-4xl lg:text-6xl font-serif italic text-black/20 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
          À Propos →
        </a>
      </section>
    </main>
  );
}
