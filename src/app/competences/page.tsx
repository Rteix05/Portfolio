'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reveler } from '@/lib/reveal';
import { Space_Grotesk } from 'next/font/google';
import PageFooter from '@/components/PageFooter';
import Navbar from '@/components/Navbar';
import HeroProjet from '@/components/HeroProjet';
import { getTechIcon } from '@/lib/techIcons';
// Import d'icônes génériques pour celles qui n'ont pas de logo tech officiel
import { LuLayoutTemplate, LuPenTool, LuFileText, LuCode, LuServer, LuDatabase, LuTerminal, LuGlobe,
  LuSearchCheck, LuBraces, LuGauge, LuShare2, LuLink, LuFlaskConical, LuMonitorCheck, LuListChecks, LuShieldCheck, LuBot, LuWorkflow, LuSparkles, LuScanEye, LuMessageSquareCode, LuRefreshCw } from 'react-icons/lu';
import { SiGithub, SiSpringboot, SiPython } from 'react-icons/si';

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
    case 'SEO technique': return <LuSearchCheck {...props} />;
    case 'Données structurées': return <LuBraces {...props} />;
    case 'Core Web Vitals': return <LuGauge {...props} />;
    case 'Metadata & Open Graph': return <LuShare2 {...props} />;
    case 'Maillage interne': return <LuLink {...props} />;
    case 'PHPUnit': return <LuFlaskConical {...props} />;
    case 'Playwright': return <LuMonitorCheck {...props} />;
    case 'Cypress': return <LuListChecks {...props} />;
    case 'ESLint': return <LuShieldCheck {...props} />;
    case 'Tests de l’IA': return <LuBot {...props} />;
    case 'CI GitHub Actions': return <LuWorkflow {...props} />;
    case 'Java (Spring Boot)': return <SiSpringboot size={18} />;
    case 'Python': return <SiPython size={18} />;
    case 'OpenRouter (LLM)': return <LuSparkles {...props} />;
    case 'IA de vision': return <LuScanEye {...props} />;
    case 'Prompt engineering': return <LuMessageSquareCode {...props} />;
    case 'Fallback multi-modèles': return <LuRefreshCw {...props} />;
    case 'Validation des réponses': return <LuShieldCheck {...props} />;
    case 'Dev assisté par IA': return <LuBot {...props} />;
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
    'Projets perso': '/projets',
    'Portfolio 3D': '/3d',
    'Expériences 3D': '/3d',
    'PS5 UI': '/3d',
    'WR403D': '/design',
    'Tous les projets': '/projets',
    'SAE 501': '/projets',
    'WR506D — Penderie': '/projets',
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
  ctaHref?: string;
  ctaLabel?: string;
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
      { name: 'React Native / Expo', detail: 'Expo Router, EAS Build, apps iOS & Android', projects: ['WR506D — Penderie'] },
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
      { name: 'Java (Spring Boot)', detail: 'API REST avec Spring Boot, architecture en couches', projects: ['Projets scolaires'] },
      { name: 'Python', detail: 'Scripts et automatisation, dont l’animation de l’évolution 3D dans Blender', projects: ['Expériences 3D'] },
      { name: 'SQL / MySQL', detail: 'Requêtes complexes, jointures, CRUD', projects: ['Sommeval', 'Projets scolaires'] },
      { name: 'PostgreSQL', detail: 'Migrations, relations, indexation', projects: ['Projets pro'] },
      { name: 'REST API', detail: 'Architecture RESTful, CRUD, JSON', projects: ['Sommeval', 'Projets pro'] },
    ],
  },
  {
    id: 7,
    category: 'Intelligence artificielle',
    title: 'IA & LLM',
    description: 'Intégrer de l’IA dans de vraies applications : reconnaissance d’images, modèles de langage avec bascule automatique entre plusieurs modèles, réponses contrôlées et testées pour qu’elles restent fiables.',
    accent: '#8b5cf6',
    box3Title: 'Usage',
    box3Tags: ['Intégration dans des apps réelles', 'Tests avec un faux LLM', 'Modèles gratuits, coût maîtrisé'],
    skills: [
      { name: 'OpenRouter (LLM)', detail: 'Accès à plusieurs modèles (Gemma, Nemotron) depuis une seule API', projects: ['WR506D — Penderie'] },
      { name: 'IA de vision', detail: 'Reconnaissance de vêtements par photo et lecture d’étiquettes textiles', projects: ['WR506D — Penderie'] },
      { name: 'Prompt engineering', detail: 'Réponses JSON limitées au catalogue de l’app, sans hallucinations', projects: ['WR506D — Penderie'] },
      { name: 'Fallback multi-modèles', detail: 'Bascule automatique sur 4 LLM gratuits quand l’un échoue', projects: ['WR506D — Penderie'] },
      { name: 'Validation des réponses', detail: 'Contrôle des sorties et historique de chaque scan pour mesurer la fiabilité', projects: ['WR506D — Penderie'] },
      { name: 'Dev assisté par IA', detail: 'Claude Code, Codex, Antigravity, avec une PR relue par sujet', projects: ['Tous les projets'] },
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
      { name: 'Gitflow', detail: 'Branches feature / develop / main, releases, hotfix', projects: ['Tous les projets'] },
      { name: 'Docker', detail: 'Images custom, docker-compose, environnements reproductibles et simples à lancer', projects: ['Sommeval', 'Projets pro'] },
      { name: 'Documentation', detail: 'READMEs clairs et structurés pour une prise en main rapide', projects: ['Tous les projets'] },
      { name: 'Vercel', detail: 'Déploiement continu, variables d\'env, domaines custom', projects: ['Portfolio v4', 'Projets Next.js'] },
      { name: 'OVH / VPS', detail: 'Configuration serveur, SSL, reverse proxy Nginx', projects: ['Projets pro', 'Hébergement client'] },
      { name: 'Linux CLI', detail: 'Navigation, scripts bash, gestion de services systemd', projects: ['VPS', 'Environnements Docker'] },
    ],
  },
  {
    id: 5,
    category: 'SEO & Performance',
    title: 'Visibilité & Référencement',
    description: 'Rendre un site lisible par les moteurs et rapide pour les visiteurs : structure technique, sémantique du HTML, Core Web Vitals et suivi des résultats dans le temps.',
    accent: '#f59e0b',
    box3Title: 'Mesure & Outils',
    box3Tags: ['Google Search Console', 'Lighthouse / PageSpeed', 'Suivi des positions'],
    skills: [
      { name: 'SEO technique', detail: 'Indexation, URLs canoniques, sitemap, robots, redirections', projects: ['Portfolio v4'] },
      { name: 'Core Web Vitals', detail: 'LCP, INP, CLS, optimisation des images et des médias', projects: ['Portfolio v4'] },
      { name: 'Données structurées', detail: 'JSON-LD Schema.org, résultats enrichis', projects: ['Portfolio v4'] },
      { name: 'Metadata & Open Graph', detail: 'Titles, méta-descriptions, aperçus de partage', projects: ['Tous les projets'] },
      { name: 'Sémantique HTML', detail: 'Structure Hn, accessibilité, textes alternatifs', projects: ['Tous les projets'] },
      { name: 'Maillage interne', detail: 'Architecture des liens, pages orphelines', projects: ['Portfolio v4'] },
    ],
  },
  {
    id: 6,
    category: 'Tests & Qualité',
    title: 'Test & Vérification',
    description: 'Prouver que le code fait ce qu’il doit avant chaque mise en ligne : tests unitaires et fonctionnels, scénarios de bout en bout dans un vrai navigateur, intégration continue, et vérification du résultat sur le site en production.',
    accent: '#22d3ee',
    box3Title: 'Méthode',
    box3Tags: ['Tests avant chaque mise en ligne', 'Vérification en production', 'Une PR relue par sujet'],
    skills: [
      { name: 'PHPUnit', detail: 'Tests unitaires et fonctionnels Symfony : 240 tests sur Penderie, 81 sur l’Académie E.S.I.C.', projects: ['WR506D — Penderie', 'Académie E.S.I.C.'] },
      { name: 'Playwright', detail: 'Parcours de bout en bout et vérifications visuelles dans un vrai navigateur', projects: ['Portfolio v4'] },
      { name: 'Cypress', detail: 'Scénarios e2e : connexion, réservation, back-office', projects: ['Matos'] },
      { name: 'ESLint', detail: 'Règles de qualité et typage strict TypeScript appliqués au code', projects: ['Portfolio v4'] },
      { name: 'Tests de l’IA', detail: 'Faux service OpenRouter pour tester les réponses des LLM sans réseau ni coût', projects: ['WR506D — Penderie'] },
      { name: 'CI GitHub Actions', detail: 'Tests lancés à chaque push, déploiement seulement si tout passe', projects: ['Académie E.S.I.C.'] },
    ],
  },
];

// Résumé de la démarche de référencement : les 8 maillons de la chaîne SEO et la méthode de travail
const maillonsSeo = [
  { titre: 'Mots-clés et intentions', texte: 'Partir des requêtes réellement tapées, de leur volume et de l’intention derrière.' },
  { titre: 'Architecture', texte: 'Une page par intention, des URLs claires et une profondeur de clic maîtrisée.' },
  { titre: 'SEO technique', texte: 'robots.txt, sitemap, canoniques et contenu bien présent dans le HTML servi.' },
  { titre: 'Optimisation on-page', texte: 'Titles et méta-descriptions pensés pour le clic, structure Hn cohérente.' },
  { titre: 'Données structurées', texte: 'JSON-LD Schema.org pour accéder aux résultats enrichis.' },
  { titre: 'Core Web Vitals', texte: 'LCP, INP et CLS mesurés sur le terrain, en mobile-first.' },
  { titre: 'Maillage interne', texte: 'Diriger l’autorité vers les pages stratégiques, aucune page orpheline.' },
  { titre: 'Mesure et itération', texte: 'Search Console pour voir ce que Google indexe vraiment, puis itérer.' },
];
const methodeSeo = ['Audit', 'Priorisation', 'Implémentation', 'Mesure'];

export default function CompetencesPage() {
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
    <main className={`${spaceGrotesk.className} text-black dark:text-white min-h-screen transition-colors duration-500`}>
      <Navbar />

      {/* OUVERTURE : bandeau titre + média de la carte d’accueil */}
      <HeroProjet id="competences" />

      <section className="relative z-10 pt-10 px-6 md:px-10 pb-32 transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
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

      <div>
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
                    <span className="text-xs font-mono opacity-40 uppercase tracking-widest">{String(index + 1).padStart(2, '0')}</span>
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
                    href={section.ctaHref ?? '/contact'}
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
                    {section.ctaLabel ?? 'Discuter de cette stack'} <span>&rarr;</span>
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
                          {[...otherSkills.map(s => s.name), ...section.box3Tags].slice(0, 4).map(label => (
                            <span key={label} className="text-xs font-medium opacity-80 flex items-center gap-1.5">
                              • {label}
                            </span>
                          ))}
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

      {/* RÉFÉRENCEMENT EN RÉSUMÉ : la chaîne en 8 maillons et la méthode de travail */}
      <section aria-labelledby="titre-seo-resume" className="relative px-6 md:px-10 py-24 md:py-32 border-t border-black/5 dark:border-white/5">
        <div ref={addRef} className="max-w-7xl mx-auto">
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: '#f59e0b' }}>SEO & Performance</p>
              <h2 id="titre-seo-resume" className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.02]">
                Le référencement, en résumé
              </h2>
            </div>
            <p className="text-base md:text-lg leading-relaxed text-black/60 dark:text-white/60">
              Le référencement est une chaîne de huit maillons, du choix des mots-clés à la mesure des résultats :
              un seul maillon faible suffit à faire perdre leur effet à tous les autres. Je les traite dans l’ordre
              où ils se déroulent sur un vrai projet, en vérifiant chaque point sur le site en production.
            </p>
          </div>

          <ol className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/10 dark:bg-white/10">
            {maillonsSeo.map((m, i) => (
              <li key={m.titre} className="bg-white/90 p-6 backdrop-blur dark:bg-[#050505]/90">
                <p className="font-mono text-xs text-black/40 dark:text-white/40">{String(i + 1).padStart(2, '0')}</p>
                <p className="mt-3 text-base font-semibold">{m.titre}</p>
                <p className="mt-2 text-sm leading-relaxed text-black/60 dark:text-white/60">{m.texte}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-black/70 dark:text-white/70">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/40 dark:text-white/40">Méthode</span>
              {methodeSeo.map((etape, i) => (
                <span key={etape} className="flex items-center gap-3">
                  {i > 0 && <span aria-hidden="true" className="text-black/25 dark:text-white/25">→</span>}
                  {etape}
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER NAV + COPYRIGHT */}
      <PageFooter precedent={{ href: '/design', label: 'Design' }} suivant={{ href: '/a-propos', label: 'À Propos' }} />
    </main>
  );
}