'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

// Au premier chargement, la page est affichée tout de suite (le HTML du serveur
// reste visible) ; le fondu ne joue que pour les navigations dans le site.
let premierAffichage = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const animer = !premierAffichage;

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
