"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Space_Grotesk } from 'next/font/google';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import WaveMesh from '@/components/WaveMesh';
import LogoAccueil from '@/components/LogoAccueil';
import { SiGithub } from 'react-icons/si';
import { LuMail, LuLinkedin } from 'react-icons/lu';
import Image from 'next/image';
import { rubriques, CLE_REPRISE_VIDEO } from '@/lib/rubriques';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

const projects = [
  { 
    id: '3d', 
    name: '3D',
    subtitle: 'Three.js, React Three Fiber, GLSL',
    description: 'Modèles 3D interactifs, shaders custom et expériences immersives dans le navigateur.',
    cardImage: rubriques['3d'].affiche,
    cardVideo: rubriques['3d'].video,
  },
  {
    id: 'projets',
    name: 'Projets',
    subtitle: 'Next.js, React Native, Symfony',
    description: 'Une sélection de mes meilleurs projets : pro, scolaires et perso.',
    cardImage: rubriques['projets'].affiche,
    cardVideo: rubriques['projets'].video,
  },
  { 
    id: 'design', 
    name: 'Design',
    subtitle: 'Figma, UI/UX, Prototypage',
    description: 'Maquettes, prototypes et parcours utilisateur pensés avec soin.',
    cardImage: rubriques['design'].affiche,
    cardVideo: rubriques['design'].video,
  },
  { 
    id: 'competences', 
    name: 'Compétences',
    subtitle: 'Front-End, Back-End, Outils',
    description: 'Stack technique complète : React, Vue, Symfony, Three.js et plus encore.',
    cardImage: rubriques['competences'].affiche,
    cardVideo: rubriques['competences'].video,
  },
  { 
    id: 'a-propos', 
    name: 'À Propos',
    subtitle: 'Développeur Web Full Stack - UX/UI Designer',
    description: 'Rafael Teixeira — passionné par les interfaces modernes et la 3D interactive.',
    cardImage: rubriques['a-propos'].affiche,
  },
];

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];
// Changement de projet au survol, calé sur metalab.com : fondus courts qui se croisent
// et carte dévoilée de gauche à droite comme un rideau
const fondu = { duration: 0.35, ease: [0.33, 1, 0.68, 1] as [number, number, number, number] };
const rideau = { duration: 0.4, ease: [0.65, 0, 0.35, 1] as [number, number, number, number] };
const RIDEAU_FERME = 'inset(0% 100% 0% 0%)';
const RIDEAU_OUVERT = 'inset(0% 0% 0% 0%)';

export default function Home() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [clickedProject, setClickedProject] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // Affiches des cartes chargées une seule fois, à la première ouverture du menu
  const affichesChargees = useRef(false);
  const router = useRouter();

  const basculerMenu = () => {
    setMenuOpen((ouvert) => !ouvert);
    if (affichesChargees.current) return;
    affichesChargees.current = true;
    // Affiches des cartes en cache : la carte s'ouvre déjà remplie au premier survol
    projects.forEach((p) => {
      if (p.cardImage) new window.Image().src = p.cardImage;
    });
  };

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleProjectClick = (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    setClickedProject(projectId);
    setIsTransitioning(true);
    router.prefetch(`/${projectId}`);

    // À la fin de l'agrandissement, on note où en est la vidéo de la carte et on capture
    // l'image affichée : la page d'arrivée repart exactement de là, sans saut
    setTimeout(() => {
      const video = document.querySelector<HTMLVideoElement>('[data-carte-video]');
      try {
        if (video && video.currentSrc) {
          let image: string | null = null;
          if (video.readyState >= 2) {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d')?.drawImage(video, 0, 0);
            image = canvas.toDataURL('image/jpeg', 0.85);
          }
          sessionStorage.setItem(CLE_REPRISE_VIDEO, JSON.stringify({ src: new URL(video.currentSrc).pathname, temps: video.currentTime, image }));
        }
      } catch {}
      router.push(`/${projectId}`);
    }, 800);
  };

  const heroVisible = !hoveredProject && !isTransitioning && !menuOpen;
  const currentId = hoveredProject || clickedProject;
  const displayData = currentId ? projects.find(p => p.id === currentId) : null;
  // Comme sur metalab.com, un projet sur deux est en miroir : le titre passe à droite et la
  // description à gauche ; la carte, elle, reste toujours à droite
  const miroir = !isMobile && !!displayData && projects.indexOf(displayData) % 2 === 1;
  const carteGauche = isMobile ? '6vw' : '47vw';
  const carteDroite = isMobile ? '6vw' : '8vw';

  return (
    <main
      className="relative h-dvh w-full overflow-hidden bg-white text-black dark:bg-[#050505] dark:text-white"
    >
      {/* Les liens internes de l’accueil vivent dans le menu au survol : on les expose
          aussi ici pour les moteurs et les lecteurs d’écran. Le titre, lui, est visible. */}
      <div className="sr-only">
        <nav aria-label="Sections du portfolio">
          <ul>
            {projects.map((p) => (
              <li key={`seo-${p.id}`}>
                <a href={`/${p.id}`}>{p.name}</a> — {p.description}
              </li>
            ))}
            <li>
              <a href="/contact">Contact</a> — Me contacter pour une alternance, une mission ou un projet.
            </li>
          </ul>
        </nav>
      </div>

      
      {/* 0. FOND : champ de points animé (Wave Mesh), aux couleurs du thème. Il reste en
          place au survol des projets : seuls la carte et les textes changent, plus fluide à l'œil */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <WaveMesh className="h-full w-full" />
      </div>

    


      {/* 3. LE LAYOUT PROJET (Apparait au survol / au clic) */}
      <AnimatePresence>
        {(hoveredProject || isTransitioning) && displayData && (
          <motion.div key={displayData.id + '-layout'} className="absolute inset-0 z-30 pointer-events-none overflow-hidden">

            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: isTransitioning ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={fondu}
              className={`absolute font-semibold uppercase leading-[0.92] tracking-[-0.06em] z-30 dark:drop-shadow-2xl ${isMobile ? 'bottom-[8vh] left-[5vw] right-[5vw]' : miroir ? 'bottom-[7vh] right-[8vw] text-right' : 'bottom-[12vh] left-[10vw]'} text-[3.2rem] md:text-[7.5rem] ${spaceGrotesk.className}`}
            >
              {displayData.name}
            </motion.h2>

            <motion.div
              initial={{ 
                left: carteGauche, right: carteDroite,
                height: isMobile ? '38vh' : '50vh', top: isMobile ? '13vh' : '18vh',
                borderRadius: '1rem', clipPath: RIDEAU_FERME
              }}
              animate={
                isTransitioning
                ? {
                    left: '0vw', right: '0vw', height: '100%', top: '0vh', borderRadius: '0rem', clipPath: RIDEAU_OUVERT,
                    zIndex: 50
                  }
                : {
                    left: carteGauche, right: carteDroite,
                    height: isMobile ? '38vh' : '50vh', top: isMobile ? '13vh' : '18vh',
                    borderRadius: '1rem', clipPath: RIDEAU_OUVERT, zIndex: 20
                  }
              }
              exit={{ clipPath: RIDEAU_FERME, transition: rideau }}
              // Le rideau s'ouvre vite ; l'agrandissement plein écran au clic garde son rythme
              transition={{ duration: 0.8, ease, clipPath: rideau }}
              className={`absolute overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border transition-colors duration-500 ${isTransitioning ? 'border-transparent' : 'border-black/10 dark:border-white/10'}`}
            >
              {/* Sur téléphone la carte devient verticale : la vidéo (16:10) est montrée en entier,
                  sur un fond flou tiré de son affiche, au lieu d'être rognée sur les côtés */}
              {isMobile && displayData.cardVideo && displayData.cardImage && (
                <Image src={displayData.cardImage} alt="" aria-hidden="true" fill sizes="100vw" className="object-cover blur-2xl scale-125 opacity-70" />
              )}
              {displayData.cardVideo ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  data-carte-video
                  poster={displayData.cardImage || '/poster.jpg'}
                  className={`relative w-full h-full object-center ${isMobile ? 'object-contain' : 'object-cover'}`}
                >
                  <source src={displayData.cardVideo} type="video/mp4" />
                  <track kind="captions" src={`${displayData.cardVideo.replace(/\.mp4$/, '')}.vtt`} srcLang="fr" label="Français" />
                </video>
              ) : (
                displayData.cardImage ? (
                  <Image src={displayData.cardImage} alt={displayData.name} width={1200} height={800} className="w-full h-full object-cover object-center" priority={true} />
                ) : (
                  <div className="w-full h-full bg-gray-900" />
                )
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: isTransitioning ? 0 : 1 }} exit={{ opacity: 0 }}
              transition={fondu}
              className={`absolute ${isMobile ? 'hidden' : miroir ? 'left-[10vw] bottom-[15vh]' : 'right-[8vw] bottom-[15vh]'} max-w-62.5 text-[0.95rem] font-medium leading-relaxed tracking-[-0.02em] text-black/70 dark:text-white/70 ${spaceGrotesk.className}`}
            >
              {displayData.description}
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. INTERFACE FIXE */}
      <div className="absolute inset-0 z-40 flex flex-col pointer-events-none">
        
        <Navbar isHidden={isTransitioning} onMenuClick={basculerMenu} />

        {/* ACCROCHE — nom à gauche, discours à droite.
            Les deux s’effacent dès qu’un projet prend le dessus ou que le menu s’ouvre.
            Sur mobile, les deux blocs s’empilent dans une colonne pour ne jamais se chevaucher ;
            à partir de md, le conteneur disparaît (display: contents) et chacun reprend sa place. */}
        <div className="absolute left-6 right-6 bottom-20 flex flex-col gap-8 md:contents">
        {/* Logo <RT> en 3D, objet flottant à la place du nom. Toujours monté (la 3D ne se recharge
            jamais) : il s'efface seulement, et son rendu se met en pause, quand un projet ou le menu prend la place */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: heroVisible ? 1 : 0 }}
          transition={fondu}
          className={`h-[24vh] w-[86vw] sm:w-[70vw] md:absolute md:bottom-[7vh] md:left-[5vw] md:h-[40vh] md:w-[44vw] ${heroVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
          <h1 className="sr-only">Rafael Teixeira</h1>
          <LogoAccueil actif={heroVisible} />
        </motion.div>

        <AnimatePresence>
          {!hoveredProject && !isTransitioning && !menuOpen && (
            <motion.div
              key="hero-texte"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fondu}
              className={`md:absolute md:right-[8vw] md:bottom-[48vh] md:w-[32rem] md:text-right ${spaceGrotesk.className}`}
            >
              <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-black/50 dark:text-white/50 mb-4">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Disponible en alternance
              </span>

              <p className="text-sm md:text-base text-black/70 dark:text-white/70 font-medium tracking-tight md:whitespace-nowrap">
                Développeur full-stack · Étudiant en BUT MMI à Troyes
              </p>

              <p className="mt-3 text-sm md:text-[0.95rem] leading-relaxed text-black/55 dark:text-white/50">
                Je conçois et développe des sites et des applications web, du design de l’interface
                jusqu’à la mise en ligne et son référencement.
              </p>

              <p className="mt-6 text-[10px] font-mono uppercase tracking-[0.15em] text-black/40 dark:text-white/30 leading-relaxed md:whitespace-nowrap">
                React · Next.js · TypeScript · Symfony · Docker · Three.js · SEO
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        </div>

        {/* SOCIAL ICONS */}
        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 flex items-center gap-4 pointer-events-auto z-50">
          <a href="https://github.com/Rteix05" target="_blank" rel="noopener noreferrer" aria-label="GitHub (nouvel onglet)" className="text-black/40 hover:text-black active:text-black dark:text-white/40 dark:hover:text-white dark:active:text-white transition-colors duration-300">
            <SiGithub size={20} />
          </a>
          <a href="https://www.linkedin.com/in/rafael-teixeira-57b5b1269/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (nouvel onglet)" className="text-black/40 hover:text-black active:text-black dark:text-white/40 dark:hover:text-white dark:active:text-white transition-colors duration-300">
            <LuLinkedin size={20} />
          </a>
          <a href="/contact" aria-label="Contact" className="text-black/40 hover:text-black active:text-black dark:text-white/40 dark:hover:text-white dark:active:text-white transition-colors duration-300">
            <LuMail size={20} />
          </a>
        </div>

        <AnimatePresence>
          {menuOpen && !isTransitioning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
              className="flex flex-1 flex-col items-center justify-center px-6 pt-24 pb-24 md:flex-row md:items-center md:justify-start md:p-10 md:pt-32"
            >
              <nav
                // On ne revient à l’accueil qu’en quittant tout le menu : passer d’un lien à
                // l’autre enchaîne directement les projets, sans flash de l’accueil entre deux
                onMouseLeave={() => !isTransitioning && !isMobile && setHoveredProject(null)}
                className="flex w-full max-w-xs flex-col items-stretch gap-2.5 pointer-events-auto md:w-48 md:items-start md:gap-0 md:space-y-1">
                {projects.map((project, i) => (
                  <motion.a
                    key={project.id}
                    href={`/${project.id}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.4, delay: i * 0.05, ease: [0.76, 0, 0.24, 1] }}
                    onClick={(e) => handleProjectClick(e, project.id)}
                    onMouseEnter={() => !isTransitioning && !isMobile && setHoveredProject(project.id)}
                    className={`w-full md:w-max cursor-pointer block ${isTransitioning ? 'pointer-events-none' : ''}`}
                  >
                    <div className={`w-full md:w-auto rounded-full px-6 py-3.5 md:px-5 md:py-2.5 text-center text-base md:text-left md:text-sm font-medium transition-all duration-300 ${hoveredProject === project.id ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' : 'bg-black/5 text-black/70 md:bg-transparent md:text-black/50 hover:text-black active:bg-black active:text-white dark:bg-white/5 dark:text-white/70 dark:md:bg-transparent dark:md:text-white/50 dark:hover:text-white dark:active:bg-white dark:active:text-black'}`}>
                      {project.name}
                    </div>
                  </motion.a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </main>
  );
}