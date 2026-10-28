'use client';

import { useState, useSyncExternalStore } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];

// Thème : la classe de <html> fait foi, le choix est retenu d'une visite à l'autre
const suivreTheme = (rappel: () => void) => {
  const observateur = new MutationObserver(rappel);
  observateur.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observateur.disconnect();
};
const lireTheme = () => (document.documentElement.classList.contains('light') ? 'light' : 'dark');

// Heure de Paris, rafraîchie chaque seconde
const suivreHorloge = (rappel: () => void) => {
  const id = setInterval(rappel, 1000);
  return () => clearInterval(id);
};
const lireHeure = () =>
  `Paris ${new Date().toLocaleTimeString('en-US', { timeZone: 'Europe/Paris', hour: 'numeric', minute: '2-digit', hour12: true })}`;

export default function Navbar({ isHidden = false, onMenuClick }: { isHidden?: boolean; onMenuClick?: () => void }) {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHoveringMail, setIsHoveringMail] = useState(false);
  const theme = useSyncExternalStore(suivreTheme, lireTheme, () => 'dark');
  const heure = useSyncExternalStore(suivreHorloge, lireHeure, () => 'Paris --:--');
  const pathname = usePathname();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50);
  });

  const toggleTheme = () => {
    const suivant = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(suivant);
    try {
      localStorage.setItem('theme', suivant);
    } catch {}
  };

  const isHome = pathname === '/';
  const bouton =
    'rounded-full border border-black/15 dark:border-white/15 px-5 py-2.5 text-sm transition-colors duration-300 hover:bg-black/5 dark:hover:bg-white/10';

  return (
    <div className="fixed top-0 left-0 w-full z-100 flex justify-center pointer-events-none">
      <AnimatePresence>
        {!isHidden && (
          // Seule la mise en page est animée (FLIP en transform) : largeur, marges et
          // rayon passent d'un état à l'autre sans recalcul de mise en page à chaque image
          <motion.header
            layout
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.6, ease, layout: { duration: 0.7, ease } }}
            style={{ borderRadius: isScrolled ? 9999 : 0 }}
            className={`pointer-events-auto flex items-center justify-between border text-black dark:text-white transition-[background-color,border-color,box-shadow] duration-500 ${
              isScrolled
                ? 'mt-4 md:mt-6 gap-2 md:gap-4 p-2 border-black/5 dark:border-white/10 bg-[rgba(235,235,235,0.75)] dark:bg-[rgba(35,35,35,0.65)] backdrop-blur-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] dark:shadow-none'
                : 'w-full px-6 py-6 md:px-10 md:py-10 border-transparent bg-transparent'
            }`}
          >
            {/* GAUCHE */}
            <motion.div layout="position" className="shrink-0">
              {isHome ? (
                <button onClick={onMenuClick} className={bouton}>
                  Menu
                </button>
              ) : (
                <Link href="/" className={`${bouton} group flex items-center gap-2`}>
                  <span className="inline-block transition-[translate] duration-500 group-hover:-translate-x-1">←</span> Retour
                </Link>
              )}
            </motion.div>

            {/* CENTRE */}
            <motion.div layout="position" className="text-lg md:text-xl font-medium tracking-tight px-2 md:px-6 whitespace-nowrap">
              Rafael Teixeira
            </motion.div>

            {/* DROITE */}
            <motion.div layout="position" className="flex items-center gap-2 md:pr-2">
              <div className="text-sm opacity-60 uppercase tracking-widest text-right min-w-30 hidden md:block mr-2 tabular-nums">
                {heure}
              </div>

              <AnimatePresence initial={false}>
                {isScrolled && (
                  <motion.button
                    key="theme"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.4, ease }}
                    onClick={toggleTheme}
                    aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
                    className="h-10 w-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={theme}
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.3, ease }}
                        className="flex"
                      >
                        {theme === 'dark' ? (
                          // Icône Soleil
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                        ) : (
                          // Icône Lune
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                        )}
                      </motion.span>
                    </AnimatePresence>
                  </motion.button>
                )}
              </AnimatePresence>

              {/* BOUTON MAIL : le libellé se déplie au survol */}
              <AnimatePresence initial={false}>
                {isScrolled && (
                  <motion.div
                    key="mail"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.4, ease }}
                  >
                    <Link
                      href="/contact"
                      aria-label="Me contacter"
                      className="h-10 flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 overflow-hidden px-2 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
                      onMouseEnter={() => setIsHoveringMail(true)}
                      onMouseLeave={() => setIsHoveringMail(false)}
                    >
                      <span className="w-6 flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </span>
                      <AnimatePresence>
                        {isHoveringMail && (
                          <motion.span
                            initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                            animate={{ width: 'auto', opacity: 1, marginLeft: 8 }}
                            exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                            transition={{ duration: 0.35, ease }}
                            className="whitespace-nowrap overflow-hidden text-sm font-medium pr-2"
                          >
                            Get in Touch
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.header>
        )}
      </AnimatePresence>
    </div>
  );
}
