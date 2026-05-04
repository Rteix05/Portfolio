'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar({ isHidden = false, onMenuClick }: { isHidden?: boolean; onMenuClick?: () => void }) {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState("Paris --:--");
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isHoveringMail, setIsHoveringMail] = useState(false);
  const pathname = usePathname();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50);
  });

  useEffect(() => {
    setMounted(true);
    if (!document.documentElement.classList.contains('light')) {
      document.documentElement.classList.add('dark');
    }

    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        timeZone: 'Europe/Paris',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      setCurrentTime(`Paris ${timeString}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      setTheme('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      setTheme('dark');
    }
  };

  const isHome = pathname === '/';

  const glassBg = theme === 'dark' ? 'rgba(35, 35, 35, 0.65)' : 'rgba(235, 235, 235, 0.75)';
  const glassBorder = theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)';
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';

  return (
    <div className="fixed top-0 left-0 w-full z-100 flex justify-center pointer-events-none">
      <AnimatePresence>
        {!isHidden && (
          <motion.header
            layout
            initial={{ y: -100, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              width: isScrolled ? "auto" : "100%",
              marginTop: isScrolled ? "1.5rem" : "0rem",
              paddingTop: isScrolled ? "0.5rem" : "2.5rem",
              paddingBottom: isScrolled ? "0.5rem" : "2.5rem",
              paddingLeft: isScrolled ? "0.5rem" : "2.5rem",
              paddingRight: isScrolled ? "0.5rem" : "2.5rem",
              borderRadius: isScrolled ? "9999px" : "0px",
              backgroundColor: isScrolled ? glassBg : "rgba(0, 0, 0, 0)",
              backdropFilter: isScrolled ? "blur(24px)" : "blur(0px)",
              border: isScrolled ? glassBorder : "1px solid rgba(255, 255, 255, 0)",
              color: textColor,
              boxShadow: isScrolled && theme === 'light' ? '0 10px 40px -10px rgba(0,0,0,0.1)' : 'none'
            }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="pointer-events-auto flex items-center justify-between"
            style={{ gap: isScrolled ? '1rem' : '0rem' }}
          >
            
            {/* GAUCHE */}
            <motion.div layout className="shrink-0">
              {isHome ? (
                <button onClick={onMenuClick} className="rounded-full border border-black/20 dark:border-white/20 px-5 py-2.5 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10">
                  Menu
                </button>
              ) : (
                <Link href="/" className="rounded-full border border-black/20 dark:border-white/20 px-5 py-2.5 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-2">
                  <span>←</span> Retour
                </Link>
              )}
            </motion.div>

            {/* CENTRE */}
            <motion.div layout className="text-xl font-medium tracking-tight px-4 md:px-6">
              Rafael Teixeira
            </motion.div>

            {/* DROITE */}
            <motion.div layout className="flex items-center gap-2 pr-2 pl-4 md:pl-0">
              <div className="text-sm opacity-60 uppercase tracking-widest text-right min-w-30 hidden md:block mr-2">
                {mounted ? currentTime : "Paris --:--"}
              </div>
              
              {/* Bouton Toggle Light/Dark avec icônes SVG */}
              {isScrolled && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                  onClick={toggleTheme}
                  className="h-10 w-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  {mounted && theme === 'dark' ? (
                    // Icône Soleil
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                  ) : (
                    // Icône Lune
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                  )}
                </motion.button>
              )}

              {/* BOUTON MAIL MAGIQUE (Couleur dynamique) */}
              {isScrolled && (
                <Link href="/contact" passHref>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                    className="h-10 flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 text-black dark:text-white overflow-hidden cursor-pointer px-2 shadow-sm hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
                    onMouseEnter={() => setIsHoveringMail(true)}
                    onMouseLeave={() => setIsHoveringMail(false)}
                    layout
                  >
                    <div className="w-6 flex items-center justify-center shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    
                    <AnimatePresence>
                      {isHoveringMail && (
                        <motion.div
                          initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                          animate={{ width: 'auto', opacity: 1, marginLeft: 8 }}
                          exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                          transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                          className="whitespace-nowrap overflow-hidden text-sm font-medium pr-2"
                        >
                          Get in Touch
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              )}
            </motion.div>

          </motion.header>
        )}
      </AnimatePresence>
    </div>
  );
}