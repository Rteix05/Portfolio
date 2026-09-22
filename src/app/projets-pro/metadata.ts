import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projets pro — Missions & collaborations',
  description:
    'Projets menés en entreprise et en freelance : applications métier, intégrations sur mesure, déploiement et suivi en production.',
  alternates: { canonical: '/projets-pro' },
  openGraph: {
    title: 'Projets pro — Missions & collaborations | Rafael Teixeira',
    description:
      'Projets menés en entreprise et en freelance : applications métier, intégrations sur mesure, déploiement et suivi en production.',
    url: '/projets-pro',
    siteName: 'Rafael Teixeira',
    images: [
      { url: '/og-image.webp', width: 1200, height: 630, alt: 'Rafael Teixeira — Développeur Full Stack' },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
};
