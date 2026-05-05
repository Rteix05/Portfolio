'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Space_Grotesk } from 'next/font/google';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { SiGithub } from 'react-icons/si';
import { LuMail, LuLinkedin } from 'react-icons/lu';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

const projects = [
  { 
    id: '3d', 
    name: '3D',
    subtitle: 'Three.js, React Three Fiber, GLSL',
    description: 'Modèles 3D interactifs, shaders custom et expériences immersives dans le navigateur.',
    mapImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop',
    cardImage: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1000&auto=format&fit=crop',
    cardVideo: '/blender.mp4',
  },
  { 
    id: 'projets-scolaires', 
    name: 'Projets Scolaires',
    subtitle: 'PHP, Symfony, React, MVC',
    description: 'SAE universitaires : sites dynamiques, architectures headless et bases de données.',
    mapImage: '/murderbg.png',
    cardImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop',
    cardVideo: '/sommeval.mp4',
  },
  { 
    id: 'projets-perso', 
    name: 'Projets Perso',
    subtitle: 'React, Vue, Parallax, UI Design',
    description: 'Side projects créatifs : GTA VI parallax, PS3 UI, PS5 Portfolio 3D.',
    mapImage: '/ps3-bg.jpg',
    cardImage: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1000&auto=format&fit=crop',
    cardVideo: '/playstation_2.mp4',
  },
  { 
    id: 'projets-pro', 
    name: 'Projets Pro',
    subtitle: 'React, Next.js, Node.js',
    description: 'Missions en entreprise, stages et collaborations professionnelles.',
    mapImage: '/logo-mairie.jpg',
    cardImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    cardVideo: '/blender.mp4',
    hidden: true,
  },
  { 
    id: 'design', 
    name: 'Design',
    subtitle: 'Figma, UI/UX, Prototypage',
    description: 'Maquettes, prototypes et parcours utilisateur pensés avec soin.',
    mapImage: '/sommevalfig.jpg',
    cardImage: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=1000&auto=format&fit=crop',
    cardVideo: '/figma1.mp4',
  },
  { 
    id: 'competences', 
    name: 'Compétences',
    subtitle: 'Front-End, Back-End, Outils',
    description: 'Stack technique complète : React, Vue, Symfony, Three.js et plus encore.',
    mapImage: '/competences.jpg',
    cardImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop',
  },
  { 
    id: 'a-propos', 
    name: 'À Propos',
    subtitle: 'Développeur Web Full Stack',
    description: 'Rafael Teixeira — passionné par les interfaces modernes et la 3D interactive.',
    mapImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2000&auto=format&fit=crop',
    cardImage: '/Raf.jpg',
  },
];

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];

export default function Home() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [clickedProject, setClickedProject] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

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

    setTimeout(() => {
      router.push(`/${projectId}`);
    }, 800); 
  };

  const currentId = hoveredProject || clickedProject;
  const displayData = currentId ? projects.find(p => p.id === currentId) : null;

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#050505] text-white">
      
      {/* 0. BACKGROUND VIDEO 3D (Ton propre rendu) */}
      <motion.div 
        animate={{ opacity: hoveredProject || isTransitioning ? 0 : 1 }}
        transition={{ duration: 0.5, ease }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          disablePictureInPicture
          className="w-full h-full object-cover opacity-50 mix-blend-lighten"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
        {/* Calque d'assombrissement pour s'assurer que le texte central reste lisible */}
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

    


      {/* 1. BACKGROUND MAP (Passe au-dessus de la vidéo au survol) */}
      <AnimatePresence>
        {(hoveredProject || isTransitioning) && displayData && (
          <motion.div
            key={displayData.id + '-bg'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            className="absolute inset-0 z-10"
          >
            <img src={displayData.mapImage} alt="Map" className="h-full w-full object-cover opacity-30 mix-blend-luminosity" />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
        )}
      </AnimatePresence>



      {/* 3. LE LAYOUT PROJET (Apparait au survol) */}
      <AnimatePresence>
        {(hoveredProject || isTransitioning) && displayData && (
          <motion.div key={displayData.id + '-layout'} className="absolute inset-0 z-30 pointer-events-none overflow-hidden">

            <motion.h2 
              initial={{ opacity: 0, y: 50 }} 
              animate={{ opacity: isTransitioning ? 0 : 1, y: 0 }} 
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.6, ease }}
              className={`absolute font-semibold uppercase leading-[0.92] tracking-[-0.06em] z-10 drop-shadow-2xl ${isMobile ? 'bottom-[8vh] left-[5vw] right-[5vw]' : 'bottom-[12vh] left-[10vw]'} ${displayData.id === 'projets-scolaires' ? 'text-[2.8rem] md:text-[6.6rem]' : 'text-[3.2rem] md:text-[7.5rem]'} ${spaceGrotesk.className}`}
            >
              {displayData.id === 'projets-scolaires' ? (
                <>
                  Projets
                  <br />
                  Scolaires
                </>
              ) : (
                displayData.name
              )}
            </motion.h2>

            <motion.div
              initial={{ 
                width: isMobile ? '90vw' : '45vw', height: isMobile ? '30vh' : '50vh',
                right: isMobile ? '5vw' : '8vw', top: isMobile ? '12vh' : '18vh',
                borderRadius: '1rem', opacity: 0, y: 40
              }}
              animate={
                isTransitioning 
                ? { 
                    width: '100vw', height: '100vh', right: '0vw', top: '0vh', borderRadius: '0rem', opacity: 1, y: 0,
                    zIndex: 50
                  } 
                : { 
                    width: isMobile ? '90vw' : '45vw', height: isMobile ? '30vh' : '50vh',
                    right: isMobile ? '5vw' : '8vw', top: isMobile ? '12vh' : '18vh',
                    borderRadius: '1rem', opacity: 1, y: 0, zIndex: 20
                  }
              }
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.8, ease }} 
              className="absolute overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
            >
              {displayData.cardVideo ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  disablePictureInPicture
                  disableRemotePlayback
                  className="w-full h-full object-cover"
                >
                  <source src={displayData.cardVideo} type="video/mp4" />
                </video>
              ) : (
                <img src={displayData.cardImage} alt={displayData.name} className="w-full h-full object-cover" />
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: isTransitioning ? 0 : 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5, ease, delay: 0.1 }}
              className={`absolute ${isMobile ? 'hidden' : 'right-[8vw] bottom-[15vh]'} max-w-62.5 text-[0.95rem] font-medium leading-relaxed tracking-[-0.02em] text-white/70 ${spaceGrotesk.className}`}
            >
              {displayData.description}
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. INTERFACE FIXE */}
      <div className="absolute inset-0 z-40 flex flex-col pointer-events-none">
        
        <Navbar isHidden={isTransitioning} onMenuClick={() => setMenuOpen(prev => !prev)} />

        {/* SOCIAL ICONS */}
        <div className="absolute bottom-8 right-8 flex items-center gap-4 pointer-events-auto z-50">
          <a href="https://github.com/Rteix05" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors duration-300">
            <SiGithub size={20} />
          </a>
          <a href="https://www.linkedin.com/in/rafael-teixeira-57b5b1269/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors duration-300">
            <LuLinkedin size={20} />
          </a>
          <a href="/contact" className="text-white/40 hover:text-white transition-colors duration-300">
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
              className="flex flex-1 items-center p-6 md:p-10 pt-32"
            >
              <nav className="flex w-48 flex-col space-y-1 pointer-events-auto">
                {projects.filter(p => !p.hidden).map((project, i) => (
                  <motion.a
                    key={project.id}
                    href={`/${project.id}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: i * 0.05, ease: [0.76, 0, 0.24, 1] }}
                    onClick={(e) => handleProjectClick(e, project.id)}
                    onMouseEnter={() => !isTransitioning && setHoveredProject(project.id)}
                    onMouseLeave={() => !isTransitioning && setHoveredProject(null)}
                    className={`w-max cursor-pointer block ${isTransitioning ? 'pointer-events-none' : ''}`}
                  >
                    <div className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${hoveredProject === project.id ? 'bg-white text-black shadow-lg' : 'bg-transparent text-white/50 hover:text-white'}`}>
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