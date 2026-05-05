'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Space_Grotesk } from 'next/font/google';

// Importation de la police Space Grotesk
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export default function ContactPage() {
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
    // On applique la police Space Grotesk sur toute la page en injectant sa classe
    <main className={`${spaceGrotesk.className} bg-black text-white min-h-screen overflow-hidden flex flex-col relative`}>
      
      {/* 1. BACKGROUND VIDEO */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video autoPlay muted loop playsInline disablePictureInPicture className="w-full h-full object-cover opacity-40 mix-blend-lighten">
          <source src="/background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <Navbar />

      <div className="grow flex flex-col items-center justify-center px-6 md:px-10 pt-32 pb-20 relative z-10">
        
        {/* 2. BACKGROUND TEXT */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-bold pointer-events-none whitespace-nowrap select-none text-transparent opacity-30 tracking-tighter"
          style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.15)' }}
        >
          GET IN TOUCH
        </div>

        <motion.div 
          variants={containerVars} 
          initial="hidden" 
          animate="show"
          className="w-full max-w-4xl flex flex-col items-center relative z-10"
        >
          {/* Titre Minimaliste */}
          <motion.div variants={itemVars} className="text-center mb-16">
            <h1 className="text-[3rem] md:text-[5rem] lg:text-[6rem] font-bold leading-none tracking-tighter mb-6 drop-shadow-2xl">
              Let&apos;s connect.
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto leading-relaxed">
              Actuellement à la recherche d&apos;une alternance — Front-End, Back-End, Fullstack, DevOps ou UX/UI.
            </p>
          </motion.div>

          {/* 3. CARTES DE CONTACT */}
          <motion.div variants={itemVars} className="w-full max-w-2xl flex flex-col gap-4">
            
            {/* Carte Téléphone */}
            <a 
              href="tel:+33664687121"
              className="group relative flex items-center justify-between p-6 md:p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
            >
              <div className="relative z-10">
                <span className="text-xs uppercase tracking-[0.2em] text-white/50 block mb-2">Téléphone</span>
                <span className="text-xl md:text-3xl font-medium tracking-tight">06 64 68 71 21</span>
              </div>
              <div className="relative z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-500 shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-500">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
            </a>

            {/* Carte Email */}
            <a 
              href="mailto:contact@rafaelteixeira.fr" 
              className="group relative flex items-center justify-between p-6 md:p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
            >
              <div className="relative z-10">
                <span className="text-xs uppercase tracking-[0.2em] text-white/50 block mb-2">Email</span>
                <span className="text-xl md:text-3xl font-medium tracking-tight">contact@rafaelteixeira.fr</span>
              </div>
              <div className="relative z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-500 shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-45 transition-transform duration-500">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </a>

            {/* Carte LinkedIn */}
            <a 
              href="https://www.linkedin.com/in/rafael-teixeira-57b5b1269/"
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between p-6 md:p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
            >
              <div className="relative z-10">
                <span className="text-xs uppercase tracking-[0.2em] text-white/50 block mb-2">Réseau Professionnel</span>
                <span className="text-xl md:text-3xl font-medium tracking-tight">LinkedIn</span>
              </div>
              <div className="relative z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-500 shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </div>
            </a>

            {/* Carte GitHub */}
            <a 
              href="https://github.com/Rteix05"
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between p-6 md:p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
            >
              <div className="relative z-10">
                <span className="text-xs uppercase tracking-[0.2em] text-white/50 block mb-2">Code & Projets</span>
                <span className="text-xl md:text-3xl font-medium tracking-tight">GitHub</span>
              </div>
              <div className="relative z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-500 shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </div>
            </a>

          </motion.div>
        </motion.div>

      </div>
    </main>
  );
}