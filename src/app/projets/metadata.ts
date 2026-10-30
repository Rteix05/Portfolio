import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projets — Sélection pro, scolaire et perso',
  description:
    'Sélection de projets : plateformes web en production (Next.js, Symfony, Stripe), application mobile React Native, site headless et expériences 3D.',
  alternates: { canonical: '/projets' },
  openGraph: {
    title: 'Projets — Sélection pro, scolaire et perso | Rafael Teixeira',
    description:
      'Sélection de projets : plateformes web en production (Next.js, Symfony, Stripe), application mobile React Native, site headless et expériences 3D.',
    url: '/projets',
    siteName: 'Rafael Teixeira',
    images: [
      { url: '/og-image.webp', width: 1200, height: 630, alt: 'Rafael Teixeira — Développeur Full Stack' },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
};
