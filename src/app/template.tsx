'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { PAGES_AVEC_HERO } from '@/lib/rubriques';

// Au premier chargement, la page est affichée tout de suite (le HTML du serveur
// reste visible) ; le fondu ne joue que pour les navigations dans le site.
let premierAffichage = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Les pages à hero enchaînent sur la carte agrandie de l'accueil : un fondu casserait la continuité
  const animer = !premierAffichage && !PAGES_AVEC_HERO.includes(pathname);

  useEffect(() => {
    premierAffichage = false;
  }, []);

  return (
    <motion.div
      initial={animer ? { opacity: 0, y: 24 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1] // Courbe d'animation fluide très utilisée par Metalab
      }}
    >
      {children}
    </motion.div>
  );
}
