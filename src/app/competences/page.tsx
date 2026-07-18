'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Space_Grotesk } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { getTechIcon } from '@/lib/techIcons';
// Import d'icônes génériques pour celles qui n'ont pas de logo tech officiel
import { LuLayoutTemplate, LuPenTool, LuFileText, LuCode, LuServer, LuDatabase, LuTerminal, LuGlobe } from 'react-icons/lu';
import { SiGithub } from 'react-icons/si';

gsap.registerPlugin(ScrollTrigger);

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

// Fonction de fallback pour donner une icône aux compétences sans logo officiel
const getFallbackIcon = (name: string) => {
  const props = { size: 18, strokeWidth: 1.5 };
  switch (name) {
    case 'Git / GitHub': return <SiGithub size={18} />;
    case 'UI Design':
    case 'Prototypage': return <LuLayoutTemplate {...props} />; 
    case 'UX Design': return <LuPenTool {...props} />;
    case 'Documentation': return <LuFileText {...props} />;
    case 'REST API': return <LuGlobe {...props} />;
    case 'SQL / MySQL':
    case 'PostgreSQL': return <LuDatabase {...props} />;
    case 'OVH / VPS': return <LuServer {...props} />;
    case 'Linux CLI': return <LuTerminal {...props} />;
    default: return <LuCode {...props} />;
  }
};

// Fonction pour lier le nom d'un projet à son URL
const getProjectLink = (projectName: string) => {
  const links: Record<string, string> = {
    'Portfolio v4': '/',
    'Projets scolaires': '/projets',
    'Sommeval': 'http://sae301.mmi24b11.mmi-troyes.fr/',
    'Carb\'On': 'https://sae401.mmi24b07.mmi-troyes.fr',
    'Projets perso': '/projets-perso',
    'Portfolio 3D': '/3d',
    'Expériences 3D': '/3d',
    'PS5 UI': '/3d',
    'WR403D': '/design',
    'Tous les projets': '/projets',
    'SAE 501': '/projets',
  };
  return links[projectName] || '#';
};

type Skill = {
  name: string;
  detail: string;
  projects: string[];
};

type Section = {
  id: number;
  category: string;
  title: string;
  description: string;
  accent: string;
  box3Title: string;
  box3Tags: string[];
  skills: Skill[];
};

const sections: Section[] = [
  {
    id: 1,
    category: 'Front-End',
    title: 'Interfaces & Expériences',
    description: 'Développement d\'interfaces web modernes, immersives et réactives. Optimisation des performances, animations complexes au pixel près et intégration 3D interactive.',
    accent: '#10b981',
    box3Title: 'Animation & Style',
    box3Tags: [], 
    skills: [
      { name: 'React', detail: 'React 18, Hooks, Context, React Router', projects: ['Portfolio v4', 'Projets perso', 'PS5 UI'] },
      { name: 'Next.js', detail: 'App Router, SSR, ISR, API Routes', projects: ['Portfolio v4', 'Projets pro'] },
      { name: 'Vue.js', detail: 'Composition API, Vue Router, Pinia', projects: ['Projets scolaires'] }, // Vue mis en dernier du Core Tech
      { name: 'Three.js / R3F', detail: 'React Three Fiber, Drei, GLSL Shaders', projects: ['Portfolio 3D', 'Expériences 3D'] },
      { name: 'TypeScript', detail: 'Typage strict, interfaces, generics', projects: ['Portfolio v4', 'Projets pro'] },
      { name: 'Tailwind CSS', detail: 'Utility-first, responsive, dark mode', projects: ['Portfolio v4', 'Sommeval', 'Carb\'On'] },
      { name: 'GSAP', detail: 'ScrollTrigger, Timeline, animations complexes', projects: ['Portfolio v4', 'Projets perso'] },
      { name: 'Framer Motion', detail: 'AnimatePresence, layout animations', projects: ['Portfolio v4'] },
      { name: 'HTML / CSS', detail: 'Sémantique, Grid, Flexbox, animations CSS', projects: ['Tous les projets'] },
    ],
  },
  {
    id: 2,
    category: 'Back-End',
    title: 'Serveurs & Données',
    description: 'Conception d\'architectures robustes, d\'APIs sécurisées et gestion optimisée des bases de données pour assurer la scalabilité et la fluidité des applications.',
    accent: '#3b82f6',
    box3Title: 'Concepts & Sécurité',
    box3Tags: ['Architecture MVC', 'Authentification (JWT)', 'Sécurité Web & RGPD'],
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
    id: 3,
    category: 'UI / UX',
    title: 'Design & Prototypage',
    description: 'Création de parcours utilisateurs intuitifs et d\'identités visuelles percutantes. Du wireframe basse-fidélité jusqu\'au design system complet et fonctionnel.',
    accent: '#ec4899',
    box3Title: 'Principes de Design',
    box3Tags: ['Design System', 'Responsive Design', 'Accessibilité (RGAA)'],
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
    id: 4,
    category: 'Workflow & DevOps',
    title: 'CI/CD & Environnements',
    description: 'Mise en place d\'environnements de travail reproductibles, automatisation des déploiements et gestion de serveurs pour des lancements de projets fluides.',
    accent: '#a855f7',
    box3Title: 'Infrastructures',
    box3Tags: ['Intégration Continue (CI)', 'Gestion Noms de Domaine', 'Certificats SSL'],
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

      <section className="h-screen w-full relative flex items-center justify-center overflow-hidden">
        <video
          autoPlay muted loop playsInline disablePictureInPicture disableRemotePlayback
          className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-15 pointer-events-none"
        >
          <source src="/figma1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-linear-to-b from-white/50 via-white/10 to-white dark:from-[#050505]/50 dark:via-[#050505]/10 dark:to-[#050505]" />

        <div className="relative z-10 text-center px-6">
          <p className="text-sm uppercase tracking-[0.4em] mb-8 opacity-50">Expertise · Stack Technique</p>
          <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[10rem] font-semibold tracking-tighter leading-none uppercase drop-shadow-2xl">
            Compétences
          </h1>
          <p className="mt-8 text-base md:text-lg opacity-50 max-w-md mx-auto leading-relaxed">
            Technologies maîtrisées, frameworks back-end, design systems & architecture devops.
          </p>
        </div>
      </section>

      <section className="relative z-10 bg-white dark:bg-[#050505] pt-10 px-6 md:px-10 pb-32 transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-black/10 dark:border-white/20 pt-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight text-black/90 dark:text-white/90">
                Une polyvalence technique au service des projets
              </h2>
            </div>
            <div className="flex flex-col justify-end">
              <p className="text-lg text-black/60 dark:text-white/60 leading-relaxed">
                À l&apos;aise sur l&apos;intégralité de la chaîne de production web. Je conçois des architectures
                scalables, développe des interfaces fluides enrichies en animations et assure leur déploiement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white dark:bg-[#050505] transition-colors duration-500">
        {sections.map((section, index) => {
          const isEven = index % 2 === 0;
          
          const mainSkills = section.skills.slice(0, 3);
          const secondarySkills = section.skills.slice(3, 6);
          const otherSkills = section.skills.slice(6);

          return (
            <section key={section.id} className="relative py-24 md:py-40 overflow-hidden border-t border-black/5 dark:border-white/5">
              
              <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ background: `radial-gradient(ellipse at ${isEven ? '80%' : '20%'} 50%, ${section.accent}, transparent 70%)` }}
              />

              <div className={`relative z-10 max-w-7xl mx-auto px-6 md:px-10 flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 md:gap-20`}>

                <div ref={addRef} className="w-full md:w-2/5 shrink-0">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs font-mono opacity-40 uppercase tracking-widest">0{section.id}</span>
                    <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                    <span
                      className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{ background: `${section.accent}20`, color: section.accent }}
                    >
                      {section.category}
                    </span>
                  </div>

                  <h2 className="text-4xl md:text-6xl font-semibold leading-tight mb-5">
                    {section.title}
                  </h2>

                  <div className="flex flex-wrap gap-2 mb-7">
                    {section.skills.slice(0, 4).map((sk) => {
                      const icon = getTechIcon(sk.name) || getFallbackIcon(sk.name);
                      return (
                        <span key={sk.name} className="inline-flex items-center gap-1.5 rounded-full border border-black/10 dark:border-white/15 px-3 py-1 text-xs opacity-70">
                          {icon && <span className="opacity-80">{icon}</span>}
                          {sk.name}
                        </span>
                      );
                    })}
                  </div>

                  <p className="text-base md:text-lg opacity-65 leading-relaxed mb-10">
                    {section.description}
                  </p>

                  <a
                    href="/contact"
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium border transition-all"
                    style={{
                      borderColor: `${section.accent}60`,
                      color: section.accent,
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = section.accent;
                      (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = section.accent;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = '';
                      (e.currentTarget as HTMLAnchorElement).style.color = section.accent;
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = `${section.accent}60`;
                    }}
                  >
                    Discuter de cette stack <span>&rarr;</span>
                  </a>
                </div>

                <div ref={addRef} className="w-full md:w-3/5 relative">
                  <div className="hidden md:grid grid-cols-5 grid-rows-2 gap-3 h-[65vh]">
                    
                    <div className="col-span-3 row-span-2 rounded-2xl p-6 shadow-2xl border border-black/5 dark:border-white/10 bg-gray-50/50 dark:bg-zinc-900/40 backdrop-blur-xs flex flex-col justify-between group hover:border-black/20 dark:hover:border-white/20 transition-all duration-500">
                      <div>
                        <p className="text-xs uppercase tracking-widest font-mono opacity-40 mb-4">Core Tech</p>
                        <div className="flex flex-col gap-5">
                          {mainSkills.map((sk) => {
                            const icon = getTechIcon(sk.name) || getFallbackIcon(sk.name);
                            return (
                              <div key={sk.name} className="flex flex-col gap-1">
                                <span className="font-semibold text-lg flex items-center gap-2">
                                  <span className="opacity-80 flex items-center justify-center">{icon}</span> {sk.name}
                                </span>
                                <span className="text-xs opacity-60 font-light">{sk.detail}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 pt-4 border-t border-black/5 dark:border-white/5">
                        {Array.from(new Set(mainSkills.flatMap(s => s.projects))).slice(0, 4).map(p => {
                          const link = getProjectLink(p);
                          const isExternal = link.startsWith('http');
                          return (
                            <a
                              key={p}
                              href={link}
                              target={isExternal ? "_blank" : "_self"}
                              rel={isExternal ? "noopener noreferrer" : ""}
                              className="text-[10px] uppercase font-mono tracking-tight px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 opacity-50 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer"
                            >
                              {p}
                            </a>
                          );
                        })}
                      </div>
                    </div>

                    <div className="col-span-2 row-span-1 rounded-2xl p-5 shadow-xl border border-black/5 dark:border-white/10 bg-gray-50/50 dark:bg-zinc-900/40 backdrop-blur-xs flex flex-col justify-between hover:border-black/20 dark:hover:border-white/20 transition-all duration-500">
                      <div className="flex flex-col gap-3">
                        <p className="text-xs uppercase tracking-widest font-mono opacity-40">Outils & Maîtrise</p>
                        <div className="flex flex-wrap gap-1.5">
                          {secondarySkills.map(s => {
                            const icon = getTechIcon(s.name) || getFallbackIcon(s.name);
                            return (
                              <span key={s.name} className="text-xs font-medium px-2 py-1 rounded-md bg-black/5 dark:bg-white/5 flex items-center gap-1">
                                {icon && <span className="opacity-80">{icon}</span>} {s.name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div 
                      className="col-span-2 row-span-1 rounded-2xl p-5 shadow-xl border border-transparent dark:border-white/5 flex flex-col justify-between transition-all duration-500 overflow-hidden relative"
                      style={{ background: `${section.accent}09`, borderColor: `${section.accent}20` }}
                    >
                      <div className="flex flex-col gap-2 relative z-10">
                        <p className="text-xs uppercase tracking-widest font-mono opacity-40" style={{ color: section.accent }}>
                          {section.box3Title}
                        </p>
                        <div className="flex flex-col gap-2 mt-1">
                          {otherSkills.length > 0 ? (
                            otherSkills.slice(0, 3).map(s => (
                              <span key={s.name} className="text-xs font-medium opacity-80 flex items-center gap-1.5">
                                • {s.name}
                              </span>
                            ))
                          ) : (
                            section.box3Tags.map(tag => (
                              <span key={tag} className="text-xs font-medium opacity-80 flex items-center gap-1.5">
                                • {tag}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="md:hidden flex flex-col gap-3">
                    <div className="rounded-2xl p-6 shadow-2xl border border-black/5 dark:border-white/10 bg-gray-50 dark:bg-zinc-900/60 flex flex-col gap-4">
                      {section.skills.map((sk) => {
                        const icon = getTechIcon(sk.name) || getFallbackIcon(sk.name);
                        return (
                          <div key={sk.name} className="border-b border-black/5 dark:border-white/5 pb-3 last:border-none last:pb-0">
                            <span className="font-semibold text-base flex items-center gap-2 mb-1">
                              <span className="opacity-80 flex items-center justify-center">{icon}</span> {sk.name}
                            </span>
                            <p className="text-xs opacity-60">{sk.detail}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>
            </section>
          );
        })}
      </div>

      {/* FOOTER NAV + COPYRIGHT */}
      <footer className={`border-t border-black/8 dark:border-white/8 ${spaceGrotesk.className}`}>
        <div className="flex items-center justify-between px-6 md:px-16 py-16">
          <a
            href="/design"
            className="text-2xl md:text-3xl font-semibold uppercase tracking-tight text-black/20 dark:text-white/20 hover:text-black dark:hover:text-white transition-colors"
          >
            &larr; Design
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
          <p className="text-xs text-black/20 dark:text-white/20 uppercase tracking-widest">Développeur Full Stack &amp; UI/UX</p>
        </div>
      </footer>
    </main>
  );
}