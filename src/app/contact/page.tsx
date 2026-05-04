'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

export default function ContactPage() {
  // Animation variants pour un effet d'apparition en cascade
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVars: import("framer-motion").Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] } },
  };

  return (
    <main className="bg-[#050505] text-white min-h-screen transition-colors duration-500 overflow-hidden flex flex-col relative">
      
      {/* BACKGROUND VIDEO */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video autoPlay muted loop playsInline disablePictureInPicture className="w-full h-full object-cover opacity-30 mix-blend-lighten">
          <source src="/background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <Navbar />

      <div className="grow flex flex-col items-center justify-center px-6 md:px-10 pt-32 pb-20 relative z-10">
        
        {/* Gros texte en fond (optionnel, pour l'esthétique) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-serif italic font-bold opacity-5 pointer-events-none whitespace-nowrap select-none">
          Get in touch
        </div>

        <motion.div 
          variants={containerVars} 
          initial="hidden" 
          animate="show"
          className="w-full max-w-4xl flex flex-col items-center text-center relative z-10"
        >
          {/* Titre Principal */}
          <motion.p variants={itemVars} className="text-sm font-medium opacity-50 tracking-widest uppercase mb-6">
            Contact
          </motion.p>
          <motion.h1 variants={itemVars} className="text-[2.5rem] sm:text-[3.5rem] md:text-[6rem] lg:text-[7rem] font-serif leading-[0.9] tracking-tighter mb-12">
            Discutons de <br />
            <span className="italic text-black/50 dark:text-white/50">ton projet.</span>
          </motion.h1>
          
          <motion.p variants={itemVars} className="text-lg md:text-xl opacity-70 max-w-2xl mx-auto mb-16 leading-relaxed">
            Je suis actuellement à la recherche d&apos;une alternance / opportunité en tant que développeur front-end & concepteur d&apos;interfaces.
          </motion.p>

          {/* Les Coordonnées - Format Liste Minimaliste */}
          <motion.div variants={itemVars} className="w-full max-w-lg border-t border-black/10 dark:border-white/10 pt-10 flex flex-col gap-8">
            
            {/* Ligne Email */}
            <div className="flex flex-col md:flex-row justify-between items-center group">
              <span className="text-sm uppercase tracking-widest opacity-50 mb-2 md:mb-0">Email</span>
              <a 
                href="mailto:contact@rafaelteixeira.fr" 
                className="text-2xl md:text-3xl font-medium relative overflow-hidden"
              >
                contact@rafaelteixeira.fr
                {/* Ligne de soulignement animée au survol */}
                <span className="absolute bottom-0 left-0 w-full h-px bg-black dark:bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </a>
            </div>

            {/* Ligne LinkedIn */}
            <div className="flex flex-col md:flex-row justify-between items-center group">
              <span className="text-sm uppercase tracking-widest opacity-50 mb-2 md:mb-0">Réseau</span>
              <a 
                href="https://linkedin.com/in/ton-profil" // N'oublie pas de mettre ton vrai lien
                target="_blank" 
                rel="noopener noreferrer"
                className="text-2xl md:text-3xl font-medium flex items-center gap-2 relative overflow-hidden"
              >
                LinkedIn <span className="text-xl">↗</span>
                <span className="absolute bottom-0 left-0 w-full h-px bg-black dark:bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </a>
            </div>

            {/* Ligne GitHub (Optionnelle) */}
            <div className="flex flex-col md:flex-row justify-between items-center group">
              <span className="text-sm uppercase tracking-widest opacity-50 mb-2 md:mb-0">Code</span>
              <a 
                href="https://github.com/ton-profil" // N'oublie pas de mettre ton vrai lien
                target="_blank" 
                rel="noopener noreferrer"
                className="text-2xl md:text-3xl font-medium flex items-center gap-2 relative overflow-hidden"
              >
                GitHub <span className="text-xl">↗</span>
                <span className="absolute bottom-0 left-0 w-full h-px bg-black dark:bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </a>
            </div>

          </motion.div>
        </motion.div>

      </div>
    </main>
  );
}
